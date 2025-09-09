"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import CreateResourceModal from "@/components/features/classroom/modal/CreateResourceModal";
import ResourcesTab from "@/components/features/classroom/ResourcesTab";
import PlanningTab from "@/components/features/classroom/PlanningTab";

export default function ClassroomPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des Ressources Matérielles
          </h1>
          <p className="text-gray-600">
            Gérez les Ressources, Planning du système
          </p>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Nouvelle ressource
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resources">
        <TabsList className="bg-gray-100 rounded-md p-1 mb-4">
          <TabsTrigger
            value="resources"
            className="px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md"
          >
            Ressources
          </TabsTrigger>
          <TabsTrigger
            value="planning"
            className="px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md"
          >
            Planning
          </TabsTrigger>
        </TabsList>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div>
            <ResourcesTab
              search={search}
              filterType={filterType}
              setSearch={setSearch}
              setFilterType={setFilterType}
            />
          </div>
        </TabsContent>

        {/* Planning Tab */}
        <TabsContent value="planning">
          <div className="bg-white rounded-md shadow p-4">
            <PlanningTab />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <CreateResourceModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
