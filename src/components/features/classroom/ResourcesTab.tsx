"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useClassroomData } from "@/hooks/feature/classroom/useClassroomData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { ICreateClassroom, IGetClassroom } from "@/types/classroomType";
import DialogUpdateClassroom from "./modal/DialogUpdateClassroom";
import { deleteClassroom, updateClassroom } from "@/actions/classroomAction";
import { showToast } from "@/components/ui/showToast";
import DialogDeleteGeneric from "@/components/modal/DialogDeleteGeneric";

interface ResourcesTabProps {
  search: string;
  filterType: string;
  setSearch: (val: string) => void;
  setFilterType: (val: string) => void;
}

export default function ResourcesTab({ search, filterType, setSearch, setFilterType }: ResourcesTabProps) {
  const { data, loading, error, refresh } =  useClassroomData();

  // Modals state
  const [isEditClassRoomDialogOpen, setIsEditClassRoomDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<IGetClassroom | null>(null);


  // Filtering
  const filtered = data.filter((c) => {
    const matchesSearch = c.resource_name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Open edit modal
  const handleUpdateClassroom = async (classroom: ICreateClassroom) => {
    if (selectedClassroom) {
      const result = await updateClassroom(
        classroom,
        selectedClassroom.resource_code
      );
      console.log("Update classroom result:", result);

      if (result.code === "success") {
        setIsEditClassRoomDialogOpen(false);
        showToast({
          variant: "success-solid",
          message: "Salle mise à jour avec succès",
          description: `${classroom.resource_name} a été mise à jour.`,
          position: "top-center",
        });
        refresh();
      } else {
        showToast({
          variant: "error-solid",
          message: "Impossible de mettre à jour la salle",
          description:
            result.error ??
            "Une erreur est survenue, essayez encore ou contactez l'administrateur",
          position: "top-center",
        });
      }
    }
  };

const handleDeleteClassroom = async () => {
  if (selectedClassroom) {
    const result = await deleteClassroom(selectedClassroom.resource_code);
    console.log("Delete classroom result:", result);

    if(result.code === "success") {
      setIsDeleteDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: "Salle supprimée avec succès",
        description: `${selectedClassroom.resource_name} a été supprimée.`,
        position: "top-center",
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de supprimer la salle",
        description:
          result.error ??
          "Une erreur est survenue, essayez encore ou contactez l'administrateur",
        position: "top-center",
      });
    }
  }
};


  // Open delete modal
  const handleDeleteClick = (classroom: IGetClassroom) => {
    setSelectedClassroom(classroom);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      {/* Search & Filter Card */}
      <Card className="mb-4">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">Filtres et recherche</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une ressource..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex justify-between items-center w-60 px-6 py-3 text-base hover:bg-blue-50"
                >
                  {filterType === "ALL" ? "Tous les types" : filterType}
                  <span className="ml-2 text-gray-500 text-xl">▾</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                <DropdownMenuItem onClick={() => setFilterType("ALL")}>Tous les types</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("AMPHI")}>Amphi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("TD")}>TD</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("LAB")}>Laboratoire</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Capacité</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Localisation</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((cls, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{cls.resource_name}</td>
                      <td className="p-3">{cls.capacity}</td>
                      <td className="p-3">{cls.type_code}</td>
                      <td className="p-3">{cls.location}</td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedClassroom(cls);
                              setIsEditClassRoomDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteClick(cls)}
                            >
                               <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-center text-gray-500" colSpan={5}>
                      Aucune ressource trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedClassroom && (
        <DialogUpdateClassroom
          open={isEditClassRoomDialogOpen}
          onOpenChange={setIsEditClassRoomDialogOpen}
          classroom={selectedClassroom}
          onSave={handleUpdateClassroom}
        />
      )}

      
      <DialogDeleteGeneric
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteClassroom}
        
      />
    </>
  );
}
