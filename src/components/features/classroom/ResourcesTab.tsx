"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useClassroomData } from "@/hooks/feature/classroom/useClassroomData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import EditResourceModal from "@/components/features/classroom/modal/EditResourceModal";
import DeleteResourceModal from "@/components/features/classroom/modal/DeleteResourceModal"; // ✅ import delete modal
import { ICreateResource } from "@/types/classroomType";

interface ResourcesTabProps {
  search: string;
  filterType: string;
  setSearch: (val: string) => void;
  setFilterType: (val: string) => void;
}

export default function ResourcesTab({ search, filterType, setSearch, setFilterType }: ResourcesTabProps) {
  const { resources, addResource, updateResource, deleteResource } = useClassroomData();

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ICreateResource | null>(null);

  // Pre-fill with mock data on mount
  useEffect(() => {
    if (resources.length === 0) {
      addResource({ name: "Amphi 200", capacity: 200, location: "Bloc A-1", type: "AMPHI", description: "Grand amphithéâtre principal" });
      addResource({ name: "Salle TD 101", capacity: 40, location: "Bloc B-1", type: "TD", description: "Salle de travaux dirigés 1" });
      addResource({ name: "Laboratoire Médecine", capacity: 25, location: "Bloc C-1", type: "LAB", description: "Laboratoire équipé pour expériences Médecine" });
    }
  }, [resources, addResource]);

  // Filtering
  const filtered = resources.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "ALL" ? true : r.type?.toUpperCase() === filterType;
    return matchesSearch && matchesType;
  });

  // Open edit modal
  const handleEditClick = (resource: ICreateResource) => {
    setSelectedResource(resource);
    setIsEditOpen(true);
  };

  // Open delete modal
  const handleDeleteClick = (resource: ICreateResource) => {
    setSelectedResource(resource);
    setIsDeleteOpen(true);
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
                  filtered.map((res, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{res.name}</td>
                      <td className="p-3">{res.capacity}</td>
                      <td className="p-3">{res.type}</td>
                      <td className="p-3">{res.location}</td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(res)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteClick(res)}
                            >
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

      {/* Edit Resource Modal */}
      {selectedResource && (
        <EditResourceModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          resource={selectedResource}
          updateResource={updateResource}
        />
      )}

      {/* Delete Resource Modal */}
      {selectedResource && (
        <DeleteResourceModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          resource={selectedResource}
          deleteResource={deleteResource}
        />
      )}
    </>
  );
}
