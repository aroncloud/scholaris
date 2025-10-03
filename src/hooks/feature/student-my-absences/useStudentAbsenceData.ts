import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { getStudentAbsences, submitJustification, downloadJustificationFile } from '@/actions/studentMyAbsencesAction';
import { 
  Absence, 
  JustificationFormData,
  AbsenceFilters, 
  SubmitJustificationParams, 
  UseStudentAbsenceDataProps, 
  JustificationResponse, 
  JustificationFile 
} from '@/types/studentmyabsencesTypes';
import { verifyClientSession } from '@/lib/client-session';

// Helper function to get the access token
const getAccessToken = async (): Promise<string> => {
  const session = await verifyClientSession();
  return session.accessToken;
};

type UseStudentAbsenceDataReturn = {
  absences: Absence[];
  filteredAbsences: Absence[];
  absencesByDate: Record<string, Absence[]>;
  statistics: { total: number; justified: number; unjustified: number; pending: number };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetchAbsences: () => Promise<UseQueryResult<Absence[], Error>>;
  submitJustification: (params: JustificationFormData) => Promise<JustificationResponse>;
  isSubmittingJustification: boolean;
  downloadJustificationFile: (fileUrl: string) => Promise<Blob>;
  selectedAbsences: string[];
  setSelectedAbsences: React.Dispatch<React.SetStateAction<string[]>>;
};

interface UseStudentAbsenceDataOptions extends Partial<UseStudentAbsenceDataProps> {
  searchTerm?: string;
  filters?: AbsenceFilters;
  enabled?: boolean;
}

export const useStudentAbsenceData = (props?: UseStudentAbsenceDataOptions) => {
  const { filters, enabled = true, searchTerm = '' } = props || {};
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);
  const [selectedAbsences, setSelectedAbsences] = useState<string[]>([]);

  const queryKey = ['studentAbsences', filters];

  const fetchAbsences = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const absences = await getStudentAbsences(filters, token);
      setError(null);
      return absences;
    } catch (err) {
      const enhancedError = err instanceof Error ? err : new Error('Failed to fetch absences');
      setError(enhancedError);
      throw enhancedError;
    }
  }, [filters]);

  const { data: absences = [], isLoading: isLoadingAbsences, isError: isAbsencesError, refetch: refetchAbsences, error: queryError } = useQuery<Absence[], Error>({
    queryKey,
    queryFn: fetchAbsences,
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const filteredAbsences = useCallback(() => {
    if (!searchTerm) return absences;
    return absences.filter(absence =>
      Object.values(absence).some(value =>
        value !== null && value !== undefined && String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [absences, searchTerm]);

  const absencesByDate = useCallback(() => {
    return absences.reduce<Record<string, Absence[]>>((acc, a) => {
      try {
        // Ensure we have a valid date before creating a Date object
        if (!a.date) return acc;
        const date = new Date(a.date).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(a);
      } catch (error) {
        console.error('Error processing date for absence:', a, error);
      }
      return acc;
    }, {});
  }, [absences]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = absences.length;
    const justified = absences.filter(a => a.status_code === 'JUSTIFIED').length;
    const unjustified = absences.filter(a => a.status_code === 'UNJUSTIFIED').length;
    const pending = absences.filter(a => a.status_code === 'PENDING' || a.status_code === 'PENDING_REVIEW').length;
    
    return {
      total,
      justified,
      unjustified,
      pending,
    };
  }, [absences]);
  const submitJustificationMutation = useMutation<JustificationResponse, Error, SubmitJustificationParams>({
    mutationFn: async (params) => {
      try {
        const token = await getAccessToken();
        const result = await submitJustification(params, token);
        
        // Map the response to match JustificationResponse
        return {
          id: result.justification_code,
          status: 'PENDING' as const,
          fileUrl: params.files[0]?.content_url || '',
          submittedAt: new Date().toISOString(),
          justification_code: result.justification_code
        };
      } catch (error) {
        console.error('Error in submitJustification mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAbsences'] });
      console.log('Justification submitted successfully');
    },
    onError: (err) => {
      console.error('Error submitting justification:', err);
      setError(err);
    }
  });

  const submitJustificationWrapper = useCallback(
    async (params: JustificationFormData) => {
      try {
        console.log('submitJustificationWrapper called with params:', {
          ...params,
          file: params.file ? `[File: ${params.file.name}, size: ${params.file.size} bytes]` : 'No file',
          files: params.files?.map((f, i) => ({
            ...f,
            file: f.file ? `[File ${i + 1}: ${f.file.name}, size: ${f.file.size} bytes]` : 'No file',
            content_url: f.content_url || 'No URL'
          })) || 'No files array'
        });

        // Validate required fields
        const selectedAbsences = params.selectedAbsences || [];
        if (selectedAbsences.length === 0) {
          throw new Error('Aucune absence sélectionnée pour la justification');
        }

        if (!params.type) {
          throw new Error('Veuillez sélectionner un type de justificatif');
        }

        // Prepare the files array with required fields
        const files: Array<{
          content_url?: string;
          title: string;
          type_code: string;
          file?: File;
          name?: string;
        }> = [];
        
        // Add main file if exists
        if (params.file) {
          console.log('Adding main file to submission:', {
            name: params.file.name,
            size: params.file.size,
            type: params.file.type
          });
          files.push({
            file: params.file,
            name: params.file.name,
            title: params.file.name,
            type_code: params.type.toUpperCase()
          });
        } else {
          console.log('No main file provided in params');
        }
        
        // Add any additional files
        if (params.files?.length) {
          console.log(`Adding ${params.files.length} additional files`);
          params.files.forEach((file, index) => {
            console.log(`Processing additional file ${index + 1}:`, {
              hasFile: 'file' in file && !!file.file,
              hasContentUrl: !!file.content_url,
              type: file.type_code || 'Not specified'
            });
            
            const fileObj = {
              ...file,
              title: file.title || file.name || `Justification_${index + 1}`,
              type_code: file.type_code || params.type.toUpperCase()
            };
            
            files.push(fileObj);
          });
        } else {
          console.log('No additional files provided');
        }

        if (files.length === 0) {
          const error = new Error('Aucun fichier fourni pour la justification');
          console.error('No files to submit:', error);
          throw error;
        }

        // Map to the format expected by the API
        const payload: SubmitJustificationParams = {
          type: params.type,
          reason: params.description || params.reason || 'Justification soumise',
          selectedAbsences: selectedAbsences,
          absence_codes: selectedAbsences,
          files: files.map(file => ({
            ...file,
            content_url: file.content_url || '',
            title: file.title || 'Justification',
            type_code: file.type_code || params.type.toUpperCase()
          }))
        };

        // Include the main file if it exists (will be uploaded first)
        if (params.file) {
          payload.file = params.file;
        }

        console.log('Submitting justification with payload:', {
          ...payload,
          file: payload.file ? `[File: ${payload.file.name}]` : 'No file',
          files: payload.files?.map(f => ({
            ...f,
            file: 'file' in f ? '[File]' : 'No file',
            content_url: f.content_url || 'No URL'
          }))
        });

        return submitJustificationMutation.mutateAsync(payload);
      } catch (error) {
        console.error('Error in submitJustificationWrapper:', error);
        throw error;
      }
    },
    [submitJustificationMutation]
  );

  const downloadJustification = useCallback(async (fileUrl: string) => {
    const token = await getAccessToken();
    const blob = await downloadJustificationFile(fileUrl, token);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileUrl.split('/').pop() || 'justification';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return blob;
  }, []);

  useEffect(() => {
    if (queryError) setError(queryError instanceof Error ? queryError : new Error(String(queryError)));
  }, [queryError]);

  return {
    absences,
    filteredAbsences: filteredAbsences(),
    absencesByDate: absencesByDate(),
    statistics,
    isLoading: isLoadingAbsences,
    isError: isAbsencesError,
    error,
    refetchAbsences,
    submitJustification: submitJustificationWrapper,
    isSubmittingJustification: submitJustificationMutation.isPending,
    downloadJustificationFile: downloadJustification,
    selectedAbsences,
    setSelectedAbsences
  } as UseStudentAbsenceDataReturn;
};



// import { useState, useCallback, useEffect, useMemo } from 'react';
// import { useQuery, useMutation, QueryKey, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
// import { getStudentAbsences, submitJustification, downloadJustificationFile } from '@/actions/studentMyAbsencesAction';
// import { 
//   Absence, 
//   AbsenceFilters, 
//   SubmitJustificationParams, 
//   UseStudentAbsenceDataProps, 
//   JustificationResponse, 
//   JustificationFile 
// } from '@/types/studentmyabsencesTypes';

// import { verifyClientSession } from '@/lib/client-session';

// // Helper function to get the access token
// const getAccessToken = async (): Promise<string> => {
//   const session = await verifyClientSession();
//   return session.accessToken;
// };

// type UseStudentAbsenceDataReturn = {
//   // Data
//   absences: Absence[];
//   filteredAbsences: Absence[];
//   absencesByDate: Record<string, Absence[]>;
//   statistics: { total: number; justified: number; unjustified: number; pending: number };
  
//   // Loading states
//   isLoading: boolean;
//   isError: boolean;
//   error: Error | null;
  
//   // Actions
//   refetchAbsences: () => Promise<UseQueryResult<Absence[], Error>>;
//   submitJustification: (params: Omit<SubmitJustificationParams, 'absenceIds'> & { absenceIds: string[] }) => Promise<unknown>;
//   isSubmittingJustification: boolean;
//   downloadJustificationFile: (fileUrl: string) => Promise<Blob>;
//   selectedAbsences: string[];
//   setSelectedAbsences: React.Dispatch<React.SetStateAction<string[]>>;
// };

// /**
//  * Custom hook to manage student absence data
// {{ ... }}
//  * @returns Object containing absences, loading states, and mutation functions
//  */
// interface UseStudentAbsenceDataOptions extends Partial<UseStudentAbsenceDataProps> {
//   searchTerm?: string;
//   filters?: AbsenceFilters;
//   enabled?: boolean;
// }

// export const useStudentAbsenceData = (props?: UseStudentAbsenceDataOptions) => {
//   const { filters, enabled = true, searchTerm = '' } = props || {};
//   const queryClient = useQueryClient();
//   const [error, setError] = useState<Error | null>(null);

//   // Query key for caching
//   const queryKey = ['studentAbsences', filters];

//   // Fetch absences query
//   const fetchAbsences = useCallback(async () => {
//     try {
//       const accessToken = await getAccessToken();
//       console.log('Fetching absences with token:', !!accessToken);
//       console.log('Using filters:', filters);
      
//       const absences = await getStudentAbsences(filters, accessToken);
//       console.log('Fetched absences:', absences);
      
//       // Reset error state on successful fetch
//       setError(null);
//       return absences;
//     } catch (error) {
//       console.error('Error fetching absences:', error);
      
//       // Create a more detailed error message
//       let errorMessage = 'Failed to fetch absences';
//       let errorDetails = {};
      
//       if (error instanceof Error) {
//         errorMessage = error.message;
//         // @ts-ignore - Check for custom error properties we added
//         if (error.status) errorDetails = { status: error.status, ...error.data };
        
//         console.error('Error details:', {
//           message: error.message,
//           stack: error.stack,
//           ...errorDetails
//         });
//       }
      
//       // Update the error state
//       const enhancedError = new Error(errorMessage);
//       Object.assign(enhancedError, errorDetails);
//       setError(enhancedError);
      
//       // Re-throw to let react-query handle it
//       throw enhancedError;
//     }
//   }, [filters]);

//   console.log('useStudentAbsenceData - Initializing with filters:', { 
//     filters,
//     enabled
//   });

//   const {
//     data: absences = [],
//     isLoading: isLoadingAbsences,
//     isError: isAbsencesError,
//     refetch: refetchAbsences,
//     error: queryError,
//     status: queryStatus
//   } = useQuery<Absence[], Error, Absence[]>({
//     queryKey,
//     queryFn: fetchAbsences,
//     enabled,
//     retry: (failureCount, error) => {
//       // Only retry on network errors, not on 4xx/5xx responses
//       const isNetworkError = !('status' in (error as any));
//       return isNetworkError && failureCount < 2; // Max 2 retries for network errors
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     onError: (error) => {
//       console.error('useQuery error:', error);
//       setError(error);
//     }
//   });

//   // Calculate statistics
//   const statistics = useCallback(
//     (): { total: number; justified: number; unjustified: number; pending: number } => {
//       const absencesArray = Array.isArray(absences) ? absences : [];
//       return {
//         total: absencesArray.length,
//         justified: absencesArray.filter((a: Absence) => a.status === 'JUSTIFIED').length,
//         unjustified: absencesArray.filter((a: Absence) => a.status === 'UNJUSTIFIED').length,
//         pending: absencesArray.filter((a: Absence) => a.status === 'PENDING').length,
//       };
//     },
//     [absences]
//   );

//   // Filter absences based on search term
//   const filteredAbsences = useCallback(
//     (): Absence[] => {
//       const absencesArray = Array.isArray(absences) ? absences : [];
//       if (!searchTerm) return absencesArray;
      
//       return absencesArray.filter(absence => 
//         Object.values(absence).some(
//           value => value && 
//                   String(value).toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     },
//     [absences, searchTerm]
//   );

//   // Group absences by date for display
//   const absencesByDate = useCallback(() => {
//     const absencesArray = Array.isArray(absences) ? absences : [];
//     return absencesArray.reduce<Record<string, Absence[]>>((acc, absence) => {
//       const date = new Date(absence.date).toISOString().split('T')[0];
//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(absence);
//       return acc;
//     }, {});
//   }, [absences]);

//   // Handle query errors
//   useEffect(() => {
//     if (queryError) {
//       console.error('Error fetching absences:', queryError);
//       setError(queryError instanceof Error ? queryError : new Error(String(queryError)));
//     }
//   }, [queryError]);

//   // Submit justification mutation
//   const submitJustificationMutation = useMutation<
//     JustificationResponse,
//     Error,
//     { absenceIds: string[]; reason: string; files: JustificationFile[] }
//   >({
//     mutationFn: async (params) => {
//       try {
//         console.log('Starting justification submission with params:', {
//           absenceIds: params.absenceIds,
//           reason: params.reason,
//           files: params.files.map(f => ({
//             ...f,
//             content_url: f.content_url ? '[HIDDEN]' : null,
//             file: f.file ? '[File]' : null
//           }))
//         });

//         const accessToken = await getAccessToken();
//         if (!accessToken) {
//           throw new Error('No access token available');
//         }

//         // Submit the justification with the files
//         const result = await submitJustification({
//           absence_codes: params.absenceIds,
//           reason: params.reason,
//           files: params.files
//         }, accessToken);

//         console.log('Justification submitted successfully:', result);
//         return result;
//       } catch (error) {
//         console.error('Error in submitJustification mutation:', error);
//         throw error;
//       }
//     },
//     onSuccess: (data, variables) => {
//       console.log('Justification submission successful, invalidating queries');
//       // Invalidate and refetch absences to update the UI
//       queryClient.invalidateQueries({ queryKey });
      
//       // Also invalidate any other related queries
//       queryClient.invalidateQueries({ queryKey: ['studentAbsences'] });
//     },
//     onError: (error: Error, variables) => {
//       console.error('Error in submitJustification mutation:', error, variables);
//       setError(error);
      
//       // Re-throw the error so it can be caught by the component
//       throw error;
//     },
//   });
  
//   const isSubmittingJustification = submitJustificationMutation.isPending;
  
//   // Create a promise-based version of the mutation
//   const submitJustificationWrapper = useCallback(
//     async (params: Omit<SubmitJustificationParams, 'absenceIds'> & { absenceIds: string[] }) => {
//       try {
//         const result = await submitJustificationMutation.mutateAsync(params);
//         return result;
//       } catch (error) {
//         throw error;
//       }
//     },
//     [submitJustificationMutation]
//   );

//   // Download justification file
//   const downloadJustification = useCallback(async (fileUrl: string) => {
//     try {
//       const accessToken = await getAccessToken();
//       const blob = await downloadJustificationFile(fileUrl, accessToken);
      
//       // Create a URL for the blob
//       const url = window.URL.createObjectURL(blob);
      
//       // Create a temporary anchor element
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileUrl.split('/').pop() || 'justification';
      
//       // Trigger the download
//       document.body.appendChild(a);
//       a.click();
      
//       // Cleanup
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//       return blob;
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       throw error;
//     }
//   }, []);

//   // Handle error state updates
//   useEffect(() => {
//     if (queryError) {
//       setError(queryError instanceof Error ? queryError : new Error(String(queryError)));
//     }
//   }, [queryError]);

//   // Prepare the return value
//   const result: UseStudentAbsenceDataReturn = {
//     // Data
//     absences,
//     filteredAbsences: filteredAbsences(),
//     absencesByDate: absencesByDate(),
//     statistics: statistics(),
    
//     // Loading states
//     isLoading: isLoadingAbsences,
//     isError: isAbsencesError,
//     error,
    
//     // Actions
//     refetchAbsences,
//     submitJustification: submitJustificationWrapper,
//     isSubmittingJustification,
//     downloadJustificationFile: downloadJustification,
//     selectedAbsences: [],
//     setSelectedAbsences: () => {}
//   };

//   return result;
// }