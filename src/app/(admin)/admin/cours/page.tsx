"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp, 
  Search,
  Calendar
} from "lucide-react";
import CourseCard from "@/components/features/cours/CourseCardTab";
import CourseDetailsModal from "@/components/modal/course/CourseDetailsModal";
import CourseEditModal from "@/components/modal/course/CourseEditModal";
import PlanificationComponent from "@/components/features/cours/planificationTab";
import { useCoursData } from "@/hooks/feature/cours/useCoursData";
import StatCard from "@/components/cards/StatCard";

const MesCoursPage: React.FC = () => {
  const {
    courses,
    stats,
    loading,
    searchCourses,
    refreshData
  } = useCoursData();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("mes-cours");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchCourses(searchTerm);
    } else {
      await refreshData();
    }
  };

  const handleViewDetails = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsEditModalOpen(true);
  };

  const handleSettings = (courseId: string) => {
    console.log('Settings for course:', courseId);
    // Open course settings modal
  };


  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCourseId(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCourseId(null);
  };

  const handleSaveCourse = async () => {
    await refreshData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
          <p className="text-gray-600">
            Gestion et suivi de vos enseignements assignés par l&apos;administration
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Cours actifs"
              value={stats.activeCourses}
              description="En cours cette année"
              icon={<BookOpen className="h-4 w-4 text-blue-600" />}
            />
            <StatCard
              title="Total étudiants"
              value={stats.totalStudents}
              description="Tous cours confondus"
              icon={<Users className="h-4 w-4 text-green-600" />}
            />
            <StatCard
              title="Heures enseignées"
              value={`${stats.hoursTaught}h`}
              description="Cette année académique"
              icon={<Clock className="h-4 w-4 text-orange-600" />}
            />
            <StatCard
              title="Progression moyenne"
              value={`${stats.averageProgress}%`}
              description="Avancement des cours"
              icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
            />
          </div>
        )}

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} variant="default">
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mes-cours" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Mes cours
            </TabsTrigger>
            <TabsTrigger value="planification" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mes-cours" className="space-y-6">
            {/* Course Cards Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-3">
                  {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onSettings={handleSettings}
                />
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun cours trouvé
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Aucun cours ne correspond à votre recherche."
                    : "Vous n'avez pas encore de cours assignés."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="planification">
            <PlanificationComponent />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <CourseDetailsModal
          courseId={selectedCourseId}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onEdit={handleEdit}
        />
        <CourseEditModal
          courseId={selectedCourseId}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveCourse}
        />
      </div>
    </div>
  );
};

export default MesCoursPage;




// 'use client';

// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { 
//   BookOpen, 
//   Users, 
//   Clock, 
//   TrendingUp, 
//   Search,
//   Calendar,
//   Settings
// } from 'lucide-react';
// import CourseCard from '@/components/features/cours/CourseCardTab';
// import CourseDetailsModal from '@/components/modal/course/CourseDetailsModal';
// import CourseEditModal from '@/components/modal/course/CourseEditModal';
// import PlanificationComponent from '@/components/features/cours/planificationTab';
// import { Course } from '@/types/courseType';
// import { useCoursData } from '@/hooks/feature/cours/useCoursData';

// const MesCoursPage: React.FC = () => {
//   // Use the custom hook for data management
//   const {
//     courses,
//     stats,
//     programs,
//     loading,
//     error,
//     searchCourses,
//     refreshData
//   } = useCoursData();

//   // Local UI state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeTab, setActiveTab] = useState('mes-cours');
//   const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const handleSearch = async () => {
//     if (searchTerm.trim()) {
//       await searchCourses(searchTerm);
//     } else {
//       await refreshData();
//     }
//   };

//   const handleViewDetails = (courseId: string) => {
//     setSelectedCourseId(courseId);
//     setIsDetailsModalOpen(true);
//   };

//   const handleEdit = (courseId: string) => {
//     setSelectedCourseId(courseId);
//     setIsEditModalOpen(true);
//   };

//   const handleSettings = (courseId: string) => {
//     console.log('Settings for course:', courseId);
//     // Open course settings modal
//   };

//   const handleCloseDetailsModal = () => {
//     setIsDetailsModalOpen(false);
//     setSelectedCourseId(null);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedCourseId(null);
//   };

//   const handleSaveCourse = async (updatedCourse: Course) => {
//     // The hook will automatically update the courses state
//     // and refresh the stats when a course is updated
//     await refreshData();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement des cours...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="space-y-2">
//           <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
//           <p className="text-gray-600">
//             Gestion et suivi de vos enseignements assignés par l'administration
//           </p>
//         </div>

//         {/* Stats Cards */}
//         {stats && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-600">
//                   Cours actifs
//                 </CardTitle>
//                 <BookOpen className="h-4 w-4 text-blue-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-gray-900">{stats.activeCourses}</div>
//                 <p className="text-xs text-gray-500">En cours cette année</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-600">
//                   Total étudiants
//                 </CardTitle>
//                 <Users className="h-4 w-4 text-green-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
//                 <p className="text-xs text-gray-500">Tous cours confondus</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-600">
//                   Heures enseignées
//                 </CardTitle>
//                 <Clock className="h-4 w-4 text-orange-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-gray-900">{stats.hoursTaught}h</div>
//                 <p className="text-xs text-gray-500">Cette année académique</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-600">
//                   Progression moyenne
//                 </CardTitle>
//                 <TrendingUp className="h-4 w-4 text-purple-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</div>
//                 <p className="text-xs text-gray-500">Avancement des cours</p>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Search Bar */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center space-x-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   placeholder="Rechercher un cours..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                   onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                 />
//               </div>
//               <Button onClick={handleSearch} variant="default">
//                 Rechercher
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Navigation Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="mes-cours" className="flex items-center gap-2">
//               <BookOpen className="h-4 w-4" />
//               Mes cours
//             </TabsTrigger>
//             <TabsTrigger value="planification" className="flex items-center gap-2">
//               <Calendar className="h-4 w-4" />
//               Planification
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="mes-cours" className="space-y-6">
//             {/* Course Cards Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//               {courses.map((course) => (
//                 <CourseCard
//                   key={course.id}
//                   course={course}
//                   onViewDetails={handleViewDetails}
//                   onEdit={handleEdit}
//                   onSettings={handleSettings}
//                 />
//               ))}
//             </div>

//             {courses.length === 0 && (
//               <div className="text-center py-12">
//                 <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
//                 <p className="text-gray-500">
//                   {searchTerm 
//                     ? 'Aucun cours ne correspond à votre recherche.' 
//                     : 'Vous n\'avez pas encore de cours assignés.'
//                   }
//                 </p>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="planification">
//             <PlanificationComponent />
//           </TabsContent>
//         </Tabs>

//         {/* Course Details Modal */}
//         <CourseDetailsModal
//           courseId={selectedCourseId}
//           isOpen={isDetailsModalOpen}
//           onClose={handleCloseDetailsModal}
//           onEdit={handleEdit}
//         />

//         {/* Course Edit Modal */}
//         <CourseEditModal
//           courseId={selectedCourseId}
//           isOpen={isEditModalOpen}
//           onClose={handleCloseEditModal}
//           onSave={handleSaveCourse}
//         />
//       </div>
//     </div>
//   );
// };

// export default MesCoursPage;
