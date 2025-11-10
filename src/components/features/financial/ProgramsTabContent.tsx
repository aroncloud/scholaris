"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, CheckCircle2, Clock, Users, DollarSign, MoreVertical, Edit, DollarSignIcon } from "lucide-react";
import ContentLayout from "@/layout/ContentLayout";
import StatCard from "@/components/cards/StatCard";
import { Combobox } from "@/components/ui/Combobox";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import { IStudentGetFinancialInfo } from "@/types/financialTypes";
import { Avatar } from "@/components/custom-ui/Avatar";
import Badge from '@/components/custom-ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ProgramCard from "./ProgramCard";

export interface FinancialDataWrapper extends IStudentGetFinancialInfo {
  isPaidOff: boolean;
}

interface ProgramsTabContentProps {
  factorizedPrograms: Array<{
    program: {
      program_code: string;
      program_name: string;
    };
    curriculums: Array<{
      curriculum_code: string;
      curriculum_name: string;
    }>;
  }>;
  wrappedData: FinancialDataWrapper[];
  loadingFinData: boolean;
  onSelectStudent: (student: FinancialDataWrapper) => void;
  onCurriculumChange?: (curriculumCode: string) => void;
}

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA';
};

export default function ProgramsTabContent({
  factorizedPrograms,
  wrappedData,
  loadingFinData,
  onSelectStudent,
  onCurriculumChange,
}: ProgramsTabContentProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("");
  const [searchProgram, setSearchProgram] = useState("");

  const handleCurriculumChange = (curriculumCode: string) => {
    setSelectedCurriculum(curriculumCode);
    if (onCurriculumChange) {
      onCurriculumChange(curriculumCode);
    }
  };

  const stats = useMemo(() => {
    const total = wrappedData.reduce((acc, curr) => acc + curr.total_due, 0);
    const paid = wrappedData.reduce((acc, curr) => acc + curr.total_paid, 0);
    const remaining = wrappedData.reduce((acc, curr) => acc + curr.remaining_balance, 0);

    return {
      students: wrappedData.length,
      total,
      paid,
      remaining
    };
  }, [wrappedData]);

  const filteredPrograms = useMemo(
    () =>
      factorizedPrograms.filter((p) =>
        p.program.program_name.toLowerCase().includes(searchProgram.toLowerCase())
      ),
    [factorizedPrograms, searchProgram]
  );

  const currentCurriculums = useMemo(
    () =>
      factorizedPrograms
        .find((p) => p.program.program_code === selectedProgram)
        ?.curriculums.map((c) => ({
          value: c.curriculum_code,
          label: c.curriculum_name,
        })) ?? [],
    [factorizedPrograms, selectedProgram]
  );

  const columns: TableColumn<FinancialDataWrapper>[] = useMemo(() => [
    {
      key: "enrollment.first_name",
      label: "Étudiant",
      priority: 'medium',
      render: (_, data) => (
        <div className="flex items-center gap-3">
          <Avatar
            fallback={`${data.enrollment.first_name} ${data.enrollment.last_name}`}
            variant={data.isPaidOff ? 'success' : data.total_paid === 0 ? 'danger' : 'warning'}
            className="hidden md:flex"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {data.enrollment.first_name} {data.enrollment.last_name}
            </div>
            <div className="text-sm text-gray-500">{data.enrollment.student_number}</div>
          </div>
        </div>
      ),
    },
    {
      key: "total_due",
      label: "Total",
      priority: 'medium',
      render: (_, data) => (
        <span>
          <span className="text-lg font-bold">{data.total_due}</span>{" "}
          <span className="text-sm text-gray-600">FCFA</span>
        </span>
      ),
    },
    {
      key: "total_paid",
      label: "Perçu",
      priority: 'medium',
      render: (_, data) => (
        <span>
          <span className="text-lg font-bold">{data.total_paid}</span>{" "}
          <span className="text-sm text-gray-600">FCFA</span>
        </span>
      ),
    },
    {
      key: "remaining_balance",
      label: "Reste",
      priority: 'medium',
      render: (_, data) => (
        <span>
          <span className="text-lg font-bold">{data.remaining_balance}</span>{" "}
          <span className="text-sm text-gray-600">FCFA</span>
        </span>
      ),
    },
    {
      key: "isPaidOff",
      label: "Statut",
      priority: 'low',
      render: (_, data) => (
        <Badge
          label={data.isPaidOff ? "Soldé" : "Non soldé"}
          variant={data.isPaidOff ? "success" : "danger"}
          size="sm"
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      priority: 'high',
      render: (_, data) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onSelectStudent(data);
              }}
              className="flex flex-row flex-nowrap items-center gap-2 cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4"/>
              <span className="whitespace-nowrap">Enregistrer un paiement</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                console.log("Voir historique:", data);
              }}
              className="gap-2 cursor-pointer"
            >
              <DollarSignIcon className="mr-2 h-4 w-4"/>
              <span>Voir l&apos;historique</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onSelectStudent]);

  const handleBack = () => {
    setSelectedProgram("");
    setSelectedCurriculum("");
  };

  return (
    <ContentLayout
      title={!selectedProgram ? "Programmes académiques" : "Gestion financière"}
      description={!selectedProgram ? "Sélectionnez un programme" : ""}
    >
      {!selectedProgram ? (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher un programme..."
              value={searchProgram}
              onChange={(e) => setSearchProgram(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((item) => (
              <ProgramCard
                key={item.program.program_code}
                programCode={item.program.program_code}
                programName={item.program.program_name}
                curriculumCount={item.curriculums.length}
                onSelect={setSelectedProgram}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Button variant="outline" onClick={handleBack}>
              Retour
            </Button>
            <div className="flex-1 w-full sm:w-auto">
              <Combobox
                value={selectedCurriculum}
                onChange={handleCurriculumChange}
                options={currentCurriculums}
              />
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Étudiants" value={stats.students} icon={Users} variant="info" />
            <StatCard
              title="Montant Perçu"
              value={formatMontant(stats.paid)}
              icon={CheckCircle2}
              variant="success"
              main
            />
            <StatCard
              title="Reste à Percevoir"
              value={formatMontant(stats.remaining)}
              icon={Clock}
              variant="warning"
            />
            <StatCard
              title="Montant Total"
              value={formatMontant(stats.total)}
              icon={DollarSign}
              variant="neutral"
            />
          </div>

          <ResponsiveTable
            columns={columns}
            data={wrappedData}
            paginate={10}
            locale="fr"
            isLoading={loadingFinData}
            keyField="enrollment_code"
            filters={[
              {
                key: 'isPaidOff',
                values: [
                  { label: 'Soldé', value: 'true' },
                  { label: 'Non soldé', value: 'false' },
                ],
              },
            ]}
          />
        </>
      )}
    </ContentLayout>
  );
}
