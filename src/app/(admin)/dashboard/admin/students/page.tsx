'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ICreateStudent, IListStudent, IGetEnrollmentRequest } from "@/types/staffType";
import { createUser, getUserList, updateUser } from "@/actions/programsAction";
import { getStudentApplicationList } from "@/actions/studentAction";
import { student_statuses } from "@/constant";
import { showToast } from "@/components/ui/showToast";
import ModalStudent from "@/components/modal/ModalStudent";
import CreateEnrollmentDialog from "@/components/features/admin-students/modals/DialogCreateEnrollmentRequest";
import { DialogCreateStudent } from "@/components/features/students/modal/DialogCreateStudent";
import CurrentStudents from "@/components/features/admin-students/CurrentStudentsTab";
import Header from "@/components/features/admin-students/HeaderSection";
import EnrollmentRequests from "@/components/features/admin-students/EnrollmentRequestsTab";
import ApplicationImportWizard from "@/components/features/students/ApplicationImportWizard";


export default function StudentsPage() {
  const [enrollmentRequests, setEnrollmentRequests] = useState<IGetEnrollmentRequest[]>([]);
  const [studentList, setStudentList] = useState<IListStudent[]>([])
  const [loadingStudentList, setLoadingStudentList] = useState(false);
  const [loadingApplicationList, setLoadingApplicationList] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [sturentFormData, setStudentFormData] = useState<Partial<ICreateStudent>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [action, setAction] = useState<'CREATE' | 'UPDATE'>('CREATE')
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [isCreateEnrollmentOpen, setIsCreateEnrollmentOpen] = useState(false);


  

  const loadEnrollmentRequests = useCallback(async () => {
    try {
      setLoadingApplicationList(true);
      const result = await getStudentApplicationList();
      console.log('-->loadEnrollmentRequests.result', result)
      if(result.code === 'success') {
        setEnrollmentRequests(result.data.body);
      } else {
        console.error('Error loading enrollment requests:', result.error);
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: "Impossible de charger les demandes d'inscription.",
        });
      }
    } catch (error) {
      console.error('Error loading enrollment requests:', error);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: "Une erreur s'est produite lors du chargement des demandes.",
      });
    } finally {
      setLoadingApplicationList(false)
    }
  }, []);
  
  useEffect(() => {
    init();
    loadEnrollmentRequests();
  }, [loadEnrollmentRequests])




  const currentStudents = studentList.filter((student) => {
    return student_statuses[student.status_code as keyof typeof student_statuses] != student_statuses.GRADUATED;
  });
  

  const handleCreateStudent = async (data: ICreateStudent) => {
    const result = await createUser(data);
    
    if (result.code === 'success') {
      showToast({
        variant: 'success-solid',
        message: 'Succès',
        description: 'Étudiant créé avec succès',
      });
      await init();
      setIsStudentModalOpen(false);
    } else {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: result.error || "Erreur lors de la création de l'étudiant",
      });
    }
    // try {
    //   if (action === "CREATE") {
    //     const payload = {
    //       ...sturentFormData,
    //     } as ICreateStudent;

    //     const result = await createUser(payload);
    //     console.log('result-->', result);
        
    //     if (result.code === 'success') {
    //       showToast({
    //         variant: 'success-solid',
    //         message: 'Succès',
    //         description: 'Étudiant créé avec succès',
    //       });
    //       await init();
    //       setIsStudentModalOpen(false);
    //       setStudentFormData({});
    //     } else {
    //       showToast({
    //         variant: 'error-solid',
    //         message: 'Erreur',
    //         description: result.error || "Erreur lors de la création de l'étudiant",
    //       });
    //     }
    //   } else {
    //     const payload = {
    //       ...sturentFormData,
    //     } as ICreateStudent;

    //     const result = await updateUser(payload);
    //     console.log('result-->', result);
        
    //     if (result.code === 'success') {
    //       showToast({
    //         variant: 'success-solid',
    //         message: 'Succès',
    //         description: 'Étudiant mis à jour avec succès',
    //       });
    //       await init();
    //       setIsStudentModalOpen(false);
    //       setAction('CREATE');
    //       setStudentFormData({});
    //     } else {
    //       showToast({
    //         variant: 'error-solid',
    //         message: 'Erreur',
    //         description: result.error || "Erreur lors de la mise à jour de l'étudiant",
    //       });
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error in handleCreateStudent:', error);
    //   showToast({
    //     variant: 'error-solid',
    //     message: 'Erreur',
    //     description: 'Une erreur inattendue est survenue',
    //   });
    // }

    return false
  };

  const handleUpdateStudent = async (data: ICreateStudent) => {
    const payload = {
      ...sturentFormData,
    } as ICreateStudent;

    const result = await updateUser(payload);
    console.log('result-->', result);
    
    if (result.code === 'success') {
      showToast({
        variant: 'success-solid',
        message: 'Succès',
        description: 'Étudiant mis à jour avec succès',
      });
      await init();
      setIsStudentModalOpen(false);
      setAction('CREATE');
      setStudentFormData({});
    } else {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: result.error || "Erreur lors de la mise à jour de l'étudiant",
      });
    }
    

    return false
  };

  const init = async () => {
    setLoadingStudentList(true)
    const result = await getUserList();
    if(result.code == 'success') {
        setStudentList(result.data.body);
    } 
    console.log('getUserList.result', result)
    setLoadingStudentList(false)
  }



  const handleApproveRequest = (requestId: string) => {
    // setEnrollmentRequests((requests) =>
    //   requests.map((req) =>
    //     req.id === requestId ? { ...req, statut: "approuve" as const } : req,
    //   ),
    // );
    showToast({
      variant: 'success-solid',
      message: 'Demande approuvée',
      description: "La demande d'inscription a été approuvée avec succès.",
    });
  };

  const handleCreateEnrollment = () => {
    setIsCreateEnrollmentOpen(true);
  };

  const handleEnrollmentSuccess = () => {
    // Refresh enrollment requests or student list if needed
    init();
    loadEnrollmentRequests();
  };


  return (
    <>
      
      {/* Header */}
      <Header />
      <div className="space-y-6 p-6">
        <Tabs defaultValue="etudiants" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="etudiants">
              Étudiants actuels ({studentList.length})
            </TabsTrigger>
            <TabsTrigger value="inscriptions">
              Demandes d'inscription ({enrollmentRequests.length})
            </TabsTrigger>
          </TabsList>
            {/* Current Students Tab */}
            <TabsContent value="etudiants" className="space-y-4">
              <CurrentStudents
                setAction={setAction}
                setDeleteDialogOpen={setDeleteDialogOpen}
                setIsStudentDialogOpen={setIsStudentModalOpen}
                setFormData={setStudentFormData}
                setStudentToDelete={setStudentToDelete}
                studentList={currentStudents}
                loading={loadingStudentList}
              />
            </TabsContent>

            {/* Enrollment Requests Tab */}
            <TabsContent value="inscriptions" className="space-y-4">
              <EnrollmentRequests
                enrollmentRequests={enrollmentRequests}
                filterStatut={filterStatut}
                handleApproveRequest={handleApproveRequest}
                searchTerm={searchTerm}
                setFilterStatut={setFilterStatut}
                setSearchTerm={setSearchTerm}
                onCreateEnrollment={handleCreateEnrollment}
                loading={loadingApplicationList}
              />
            </TabsContent>
        </Tabs>

        

        {/* Create IStudent Dialog */}
        <DialogCreateStudent
          onSave={handleCreateStudent}
          open={isStudentModalOpen}
          onOpenChange={setIsStudentModalOpen}
        />


        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement l'étudiant. Cette action
                ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setStudentToDelete(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (studentToDelete) {
                    // handleDeleteStudent(studentToDelete);
                  }
                  setDeleteDialogOpen(false);
                  setStudentToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Create Enrollment Dialog */}
        <CreateEnrollmentDialog
          open={isCreateEnrollmentOpen}
          onOpenChange={setIsCreateEnrollmentOpen}
          onSuccess={handleEnrollmentSuccess}
        />

      </div>
    </>
  );
}
