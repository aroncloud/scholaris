'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Upload,
  Plus,
} from "lucide-react";
import FilieresTab from "../../../../components/features/programs/FilieresTab";
import { IFactorizedProgram, ICurriculumDetail, ICreateProgramList } from "@/types/programTypes";
import { getCurriculumList, getProgramList, getSemesterList } from "@/actions/programsAction";
import MaquettesTab from "../../../../components/features/programs/MaquettesTab";
import CalendrierTab from "../../../../components/features/programs/CalendrierTab";
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonFilieresTab from "@/components/features/skeleton/SkeletonFilieresTab";
import { useProgramData } from "@/hooks/feature/programs/useProgramData";

interface Module {
  id: string;
  code: string;
  nom: string;
  description: string;
  credits: number;
  heures: number;
  enseignant: string;
  prerequis?: string[];
  statut: "actif" | "suspendu" | "archive";
  semestre: number;
  evaluation: string;
}

interface UE {
  id: string;
  code: string;
  nom: string;
  description: string;
  credits: number;
  modules: Module[];
  statut: "actif" | "suspendu" | "archive";
}

interface Domaine {
  id: string;
  nom: string;
  description: string;
  ues: UE[];
  statut: "actif" | "suspendu" | "archive";
}

interface Sequence {
  id: string;
  nom: string;
  description: string;
  duree: number; // en mois
  domaines: Domaine[];
  statut: "actif" | "suspendu" | "archive";
}

interface Maquette {
  id: string;
  nom: string;
  version: string;
  description: string;
  dateCreation: string;
  sequences: Sequence[];
  statut: "actif" | "brouillon" | "archive";
  totalCredits: number;
}


export default function ProgramsPage() {
  const [program, setProgram] = useState<IFactorizedProgram[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);

  const { curriculumList, programs, loading, refresh, } =  useProgramData();


  

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Gestion des Programmes Académiques
            </h2>
            <p className="text-muted-foreground">
              Configuration des filières, maquettes et modules d'enseignement
            </p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter structure
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importer maquette
            </Button>
            <Button onClick={() => setIsCreateProgramOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle filière
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Filières actives
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {program.filter((f) => f.statut === "actif").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Programmes proposés
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Maquettes validées
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {program.reduce(
                  (total, f) =>
                    total +
                    f.maquettes.filter((m) => m.statut === "actif").length,
                  0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Structures pédagogiques
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Modules enseignés
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {program.reduce(
                  (total, f) =>
                    total +
                    f.maquettes.reduce(
                      (maqTotal, m) =>
                        maqTotal +
                        m.sequences.reduce(
                          (seqTotal, s) =>
                            seqTotal +
                            s.domaines.reduce(
                              (domTotal, d) =>
                                domTotal +
                                d.ues.reduce(
                                  (ueTotal, u) => ueTotal + u.modules.length,
                                  0,
                                ),
                              0,
                            ),
                          0,
                        ),
                      0,
                    ),
                  0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Unités d'enseignement
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Capacité d'accueil
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {program.reduce((total, f) => total + f.capaciteAccueil, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Étudiants maximum</p>
            </CardContent>
          </Card> */}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="program" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="program">
              Filières ({program.length})
            </TabsTrigger>
            <TabsTrigger value="maquettes">Maquettes pédagogiques</TabsTrigger>
            <TabsTrigger value="calendrier">Calendrier académique</TabsTrigger>
          </TabsList>

          {/* Filieres Tab */}
          {loading ? (
            <SkeletonFilieresTab />
          ) : (
            <FilieresTab
              programList={programs}
              setIsCreateProgramOpen={setIsCreateProgramOpen}
              isCreateProgramOpen={isCreateProgramOpen}
              isExportModalOpen={isExportModalOpen}
              setIExportModalOpen={setIsExportModalOpen}
              isImportModalOpen={isImportModalOpen}
              setIsImportModalOpen={setIsImportModalOpen}
              isDataLoading={loading}
              refresh={refresh}
            />
          )}

          {/* Maquettes Tab */}
          {!loading && <MaquettesTab curriculumList={curriculumList} refresh={refresh} />}

          {/* Modules Tab */}
          

          {/* Calendrier Tab */}
          {!loading && <CalendrierTab />}
        </Tabs>

        
      </div>
  );
}


