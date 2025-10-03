import { ApiResponse, Absence, AbsenceFilters, SubmitJustificationParams, AbsenceData, JustificationRequest, SubmitJustificationPayload } from "@/types/studentmyabsencesTypes";
import { verifySession } from "@/lib/session";

const API_BASE_URL = '/api/proxy/absences';

/**
 * Fetches student absences with optional filters
 * @param filters Optional filters to apply to the query
 * @param token Authentication token
 * @returns Promise with the absences data
 */
export const getStudentAbsences = async (
  filters?: AbsenceFilters,
  token?: string
): Promise<Absence[]> => {
  try {

    console.log('Fetching absences with filters:', filters);
    // Convert filters to URLSearchParams
    const params = new URLSearchParams();
    if (filters) {
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.courseId) params.append('courseId', filters.courseId);
    }

    const url = `${API_BASE_URL}?${params.toString()}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-cache',
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status} ${response.statusText}`;
      let errorData: any = {};
      
      try {
        // First try to parse as JSON
        const responseText = await response.text();
        try {
          errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Error response data:', errorData);
        } catch (parseError) {
          // If not JSON, use the raw text
          console.error('Failed to parse error response as JSON. Response text:', responseText);
          errorMessage = `Server responded with: ${responseText}`;
        }
      } catch (e) {
        console.error('Error reading error response:', e);
        errorMessage = `Unable to read error response: ${e instanceof Error ? e.message : String(e)}`;
      }
      
      const error = new Error(`Failed to fetch absences: ${errorMessage}`);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    const result = await response.json();
    console.log('API Response:', result);
    
    // Handle the API response format
    if (result.code === '200' && result.body) {
      // Map the API response to our Absence type
      return result.body.map((item: any) => ({
        ...item,
        id: item.absence_code,
        // Map to legacy fields for backward compatibility
        studentId: item.student_user_code,
        courseId: item.enrollment_code,
        courseName: item.course_unit_name,
        teacherName: '', // Not available in the API response
        date: item.start_time.split('T')[0],
        startTime: item.start_time,
        endTime: item.end_time,
        duration: (new Date(item.end_time).getTime() - new Date(item.start_time).getTime()) / (1000 * 60 * 60), // Calculate duration in hours
        type: 'COURSE', // Default to COURSE, adjust based on your needs
        status: item.status_code,
        createdAt: item.recorded_at,
        updatedAt: item.recorded_at
      }));
    } else if (result.data?.body) {
      // Handle the case where the response is wrapped in a data object
      return result.data.body.map((item: any) => ({
        ...item,
        id: item.absence_code,
        // Map to legacy fields for backward compatibility
        studentId: item.student_user_code,
        courseId: item.enrollment_code,
        courseName: item.course_unit_name,
        teacherName: '', // Not available in the API response
        date: item.start_time.split('T')[0],
        startTime: item.start_time,
        endTime: item.end_time,
        duration: (new Date(item.end_time).getTime() - new Date(item.start_time).getTime()) / (1000 * 60 * 60),
        type: 'COURSE',
        status: item.status_code,
        createdAt: item.recorded_at,
        updatedAt: item.recorded_at
      }));
    } else if (Array.isArray(result)) {
      return result; // Fallback for direct API response (array of absences)
    }
    
    throw new Error('Unexpected API response format');
  } catch (error) {
    console.error('Error in getStudentAbsences:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Une erreur est survenue lors de la récupération des absences');
  }
}

/**
 * Uploads a file to the server
 */
const uploadFile = async (file: File, token: string): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload file';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.url) {
      throw new Error('Invalid response from upload server');
    }
    
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
  }
};

/**
 * Submits a justification for absences
 * @param params Justification parameters
 * @param token Authentication token
 * @returns Promise with the justification response
 */
// In studentMyAbsencesAction.ts
// Map our internal type codes to the expected API type codes
const TYPE_CODE_MAP: Record<string, string> = {
  'medical': 'MEDICAL_CERTIFICATE',
  'other': 'OTHER',
  'official': 'OFFICIAL_DOCUMENT',
  'note': 'PERSONAL_NOTE'
};

const getTypeCode = (type?: string): string => {
  if (!type) return 'OTHER';
  return TYPE_CODE_MAP[type.toLowerCase()] || type.toUpperCase();
};

export const submitJustification = async (
  params: SubmitJustificationParams,
  token: string
): Promise<{ justification_code: string }> => {
  // Log the input parameters for debugging
  console.log('Starting submitJustification with params:', {
    ...params,
    file: params.file ? `[File: ${params.file.name}, size: ${params.file.size} bytes]` : 'No file',
    files: params.files?.map((f, i) => {
      // Handle both File objects and file URLs
      const fileInfo = 'file' in f && f.file instanceof File 
        ? `[File ${i + 1}: ${f.file.name}, size: ${f.file.size} bytes]` 
        : 'No file object';
      
      return {
        ...f,
        file: fileInfo,
        content_url: 'content_url' in f ? f.content_url : 'No URL'
      };
    }) || 'No files array'
  });

  try {
    // 1. Validate required parameters
    const absenceCodes = params.absence_codes?.length ? params.absence_codes : params.selectedAbsences;
    
    if (!absenceCodes?.length) {
      throw new Error('Aucune absence sélectionnée pour la justification');
    }

    // 2. Handle file uploads
    const filesToSubmit: Array<{
      content_url: string;
      title: string;
      type_code: string;
    }> = [];
    
    // Ensure we have a valid type code
    const typeCode = getTypeCode(params.type);
    console.log('Using type code:', typeCode, 'for type:', params.type);
    
    // Function to handle file upload
    const handleFileUpload = async (file: File, typeCodeParam?: string) => {
      try {
        if (!file) {
          console.warn('Attempted to upload undefined file');
          return null;
        }
        
        console.log('Uploading file:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified).toISOString()
        });
        
        const uploadResponse = await uploadFile(file, token);
        
        if (!uploadResponse?.url) {
          console.error('Invalid upload response:', uploadResponse);
          throw new Error('La réponse du serveur est invalide. Aucune URL de fichier reçue.');
        }
        
        // Ensure we have a valid type code, default to 'OTHER' if not provided
        const finalTypeCode = typeCodeParam ? getTypeCode(typeCodeParam) : 'OTHER';
        
        const fileInfo = {
          content_url: uploadResponse.url,
          title: file.name,
          type_code: finalTypeCode
        };
        
        console.log('File uploaded successfully:', fileInfo);
        return fileInfo;
      } catch (error) {
        console.error('File upload failed:', error);
        throw new Error(`Échec du téléversement du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    };

    // Handle main file if provided
    if (params.file) {
      try {
        console.log('Processing main file:', params.file.name);
        const uploadedFile = await handleFileUpload(params.file, params.type || 'other');
        if (uploadedFile) {
          filesToSubmit.push(uploadedFile);
          console.log('Main file processed successfully');
        }
      } catch (error) {
        console.error('Error uploading main file:', error);
        // Continue with other files even if main file fails
      }
    } else {
      console.log('No main file provided in params.file');
    }
    
    // Handle additional files if provided
    if (params.files?.length) {
      console.log(`Processing ${params.files.length} additional files`);
      for (let i = 0; i < params.files.length; i++) {
        const fileData = params.files[i];
        try {
          console.log(`Processing file ${i + 1}:`, {
            hasFile: 'file' in fileData && !!fileData.file,
            hasContentUrl: !!fileData.content_url,
            type: fileData.type_code || 'Not specified'
          });
          
          // Type guard to check if the file is a valid File object
          const isFile = (obj: unknown): obj is File => {
            return obj instanceof File || 
                   (typeof obj === 'object' && 
                    obj !== null && 
                    'name' in obj && 
                    'size' in obj && 
                    'type' in obj);
          };
          
          const fileObject = fileData.file;
          if (fileObject && isFile(fileObject)) {
            const uploadedFile = await handleFileUpload(
              fileObject, 
              fileData.type_code || params.type || 'other'
            );
            if (uploadedFile) {
              filesToSubmit.push(uploadedFile);
              console.log(`File ${i + 1} processed successfully`);
            }
          } else if (fileData.content_url) {
            console.log(`Using existing URL for file ${i + 1}:`, fileData.content_url);
            filesToSubmit.push({
              content_url: fileData.content_url,
              title: fileData.title || `Justification_${i + 1}`,
              type_code: (fileData.type_code || params.type || 'OTHER').toUpperCase()
            });
          } else {
            console.warn(`File ${i + 1} has neither file nor content_url, skipping`);
          }
        } catch (error) {
          console.error(`Error processing file ${i + 1}, continuing with other files:`, error);
          continue;
        }
      }
    } else {
      console.log('No additional files provided in params.files');
    }
    
    // Final validation
    console.log('Files to submit after processing:', filesToSubmit);
    if (filesToSubmit.length === 0) {
      const errorMessage = 'Aucun fichier valide fourni pour la justification. Veuillez vérifier le format et la taille des fichiers.';
      console.error('No valid files were processed. Check file uploads and content_urls.');
      console.log('Debug info:', {
        hasMainFile: !!params.file,
        hasFiles: params.files?.length || 0,
        files: params.files?.map(f => ({
          hasFile: 'file' in f && !!f.file,
          hasContentUrl: !!f.content_url,
          type: f.type_code
        })),
        allParams: JSON.parse(JSON.stringify(params, (key, value) => {
          if (key === 'file' && value instanceof File) {
            return `[File: ${value.name}, size: ${value.size} bytes, type: ${value.type}]`;
          }
          if (key === 'files' && Array.isArray(value)) {
            return value.map(f => ({
              ...f,
              file: f.file ? `[File: ${f.file.name}, size: ${f.file.size} bytes]` : 'No file',
              content_url: f.content_url || 'No URL'
            }));
          }
          return value;
        }))
      });
      
      throw new Error(errorMessage);
    }

    // 3. Prepare the request payload
    const payload: JustificationRequest = {
      absence_codes: absenceCodes,
      reason: params.reason || 'Justification soumis',
      files: filesToSubmit.map(file => ({
        content_url: file.content_url,
        title: file.title,
        type_code: getTypeCode(file.type_code || params.type)
      }))
    };
    
    console.log('Submitting justification with payload:', JSON.stringify(payload, null, 2));

    // 4. Submit the justification through our API route
    const apiUrl = '/api/justifications';
    console.log(`Sending request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('API response status:', response.status);

    let responseData;
    const responseText = await response.text();
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error('Réponse invalide du serveur: ' + responseText);
    }

    if (!response.ok) {
      console.error('Justification submission failed:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
        responseText: responseText
      });
      
      if (response.status === 403) {
        throw new Error('Accès refusé. Vérifiez que vous avez les droits nécessaires.');
      } else if (response.status === 400) {
        throw new Error(responseData.message || 'Données invalides. Vérifiez les informations fournies.');
      } else if (response.status === 500) {
        console.error('Server error details:', responseData);
        throw new Error('Erreur interne du serveur. Veuillez réessayer plus tard.');
      }
      
      throw new Error(
        responseData?.message || 
        responseData?.error ||
        `Échec de la soumission de la justification: ${response.status} ${response.statusText}`
      );
    }

    console.log('Justification submitted successfully:', responseData);
    
    // Handle different possible response formats
    if (responseData.body?.justification_code) {
      return { justification_code: responseData.body.justification_code };
    } else if (responseData.justification_code) {
      return { justification_code: responseData.justification_code };
    } else if (responseData.id) {
      return { justification_code: responseData.id };
    } else if (responseData.body?.id) {
      return { justification_code: responseData.body.id };
    }

    console.error('Unexpected response format:', responseData);
    throw new Error('Format de réponse inattendu du serveur');
  } catch (error) {
    console.error('Error in submitJustification:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Une erreur inattendue est survenue lors de la soumission de la justification');
  }
};

/**
 * Downloads a justification file
 * @param fileUrl URL of the file to download
{{ ... }}
 * @returns Promise that resolves with the file blob
 */
export const downloadJustificationFile = async (
  fileUrl: string,
  token: string
): Promise<Blob> => {
  try {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(fileUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};