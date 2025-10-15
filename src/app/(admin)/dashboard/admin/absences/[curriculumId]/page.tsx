"use client";

import React, { useState, useMemo } from 'react';
import { Download, FileSpreadsheet, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/layout/PageHeader';
import StatCard from '@/components/cards/StatCard';
import { Avatar } from '@/components/custom-ui/Avatar';
import Badge, { BadgeVariant } from '@/components/custom-ui/Badge';
import { ResponsiveTable, TableColumn } from '@/components/tables/ResponsiveTable';
import ContentLayout from '@/layout/ContentLayout';

interface Student {
  id: string;
  name: string;
  matricule: string;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  totalAbsences: number;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Kamdem Paul', matricule: '21A001', justifiedAbsences: 4, unjustifiedAbsences: 2, totalAbsences: 6 },
  { id: '2', name: 'Ngoue Marie', matricule: '21A002', justifiedAbsences: 8, unjustifiedAbsences: 0, totalAbsences: 8 },
  { id: '3', name: 'Tchinda Jean', matricule: '21A003', justifiedAbsences: 2, unjustifiedAbsences: 6, totalAbsences: 8 },
  { id: '4', name: 'Fotso Claudine', matricule: '21A004', justifiedAbsences: 6, unjustifiedAbsences: 1, totalAbsences: 7 },
  { id: '5', name: 'Beyala Serge', matricule: '21A005', justifiedAbsences: 0, unjustifiedAbsences: 10, totalAbsences: 10 },
  { id: '6', name: 'Moukouri Grace', matricule: '21A006', justifiedAbsences: 3, unjustifiedAbsences: 3, totalAbsences: 6 },
  { id: '7', name: 'Njoya Francis', matricule: '21A007', justifiedAbsences: 5, unjustifiedAbsences: 0, totalAbsences: 5 },
  { id: '8', name: 'Ebogo Sandra', matricule: '21A008', justifiedAbsences: 1, unjustifiedAbsences: 4, totalAbsences: 5 },
  { id: '10', name: 'Mendomo Patricia', matricule: '21A010', justifiedAbsences: 12, unjustifiedAbsences: 8, totalAbsences: 20 },
];

export default function AttendanceReport() {
  const [students] = useState<Student[]>(mockStudents);

  const stats = useMemo(() => {
    const totalJustified = students.reduce((sum, s) => sum + s.justifiedAbsences, 0);
    const totalUnjustified = students.reduce((sum, s) => sum + s.unjustifiedAbsences, 0);
    const totalAbsences = totalJustified + totalUnjustified;
    const criticalCount = students.filter(s => s.unjustifiedAbsences > 5).length;
    const perfectCount = students.filter(s => s.totalAbsences === 0).length;
    const avgAbsences = students.length > 0 ? (totalAbsences / students.length) : 0;
    
    return {
      totalJustified,
      totalUnjustified,
      totalAbsences,
      criticalCount,
      perfectCount,
      avgAbsences,
      criticalPercentage: (criticalCount / students.length) * 100,
      perfectPercentage: (perfectCount / students.length) * 100
    };
  }, [students]);

  // Définir les colonnes du tableau
  const studentColumns: TableColumn<Student>[] = useMemo(() => [
    {
      key: "name",
      label: "Étudiant",
      priority: 'high',
      render: (_, student) => (
        <div className="flex items-center gap-4">
          <Avatar
            fallback={student.name}
            variant={
              student.totalAbsences === 0 ? 'success' :
              student.unjustifiedAbsences > 5 ? 'danger' :
              student.totalAbsences > 10 ? 'warning' :
              'info'
            }
          />
          <div>
            <div className="font-semibold text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.matricule}</div>
          </div>
        </div>
      ),
    },
    {
      key: "justifiedAbsences",
      label: "Justifiées (h)",
      priority: 'high',
      render: (_, student) => (
        <Badge description={student.justifiedAbsences.toString()} label='heures' variant='success' />
      ),
    },
    {
      key: "unjustifiedAbsences",
      label: "Non Justifiées (h)",
      priority: 'high',
      render: (_, student) => (
        <Badge description={student.unjustifiedAbsences.toString()} label='heures' variant='danger' />
      ),
    },
    {
      key: "totalAbsences",
      label: "Total",
      priority: 'medium',
      render: (_, student) => (
        <div className="inline-flex flex-col items-center">
          <span className="text-2xl font-bold text-gray-900">{student.totalAbsences}h</span>
          {student.totalAbsences > 0 && (
            <span className="text-xs text-gray-500 mt-0.5">
              {((student.unjustifiedAbsences / student.totalAbsences) * 100).toFixed(0)}% non just.
            </span>
          )}
        </div>
      ),
    },
    {
      key: "unjustifiedAbsences",
      label: "Évaluation",
      priority: 'medium',
      render: (_, student) => {
        const risk = getRiskLevel(student.unjustifiedAbsences);
        const RiskIcon = risk.icon;
        return <Badge icon={RiskIcon} label={risk.level} variant={risk.bg as BadgeVariant} size='lg' />;
      },
    },
  ], []);

  const exportToCSV = () => {
    const headers = ['Matricule', 'Nom Complet', 'Absences Justifiées (h)', 'Absences Non Justifiées (h)', 'Total (h)', 'Taux'];
    const rows = students.map(s => [
      s.matricule,
      s.name,
      s.justifiedAbsences,
      s.unjustifiedAbsences,
      s.totalAbsences,
      `${((s.unjustifiedAbsences / (s.totalAbsences || 1)) * 100).toFixed(1)}%`
    ]);
    
    const csvContent = [
      `Rapport d'Assiduité`,
      `Généré le: ${new Date().toLocaleDateString('fr-FR')}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport_assiduite_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    window.print();
  };

  const getRiskLevel = (unjustified: number) => {
    if (unjustified === 0) return { level: 'Excellent', color: 'text-emerald-600', bg: 'success', icon: CheckCircle2 };
    if (unjustified <= 3) return { level: 'Acceptable', color: 'text-blue-600', bg: 'info', icon: Clock };
    if (unjustified <= 5) return { level: 'À surveiller', color: 'text-orange-600', bg: 'warning', icon: AlertTriangle };
    return { level: 'Critique', color: 'text-red-600', bg: 'danger', icon: XCircle };
  };

  return (
    <div>
        <PageHeader
          title='Rapport d&apos;Assiduité'
          description={`Informatique · Promotion 2021 · ${students.length} étudiants`}
        >
            
          <Button onClick={exportToCSV} variant="outline" className="h-11 gap-2 border-gray-300 shadow-sm hover:bg-gray-50">
            <FileSpreadsheet className="w-4 h-4" />
            Exporter CSV
          </Button>
          <Button onClick={exportToPDF} className="h-11 gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Download className="w-4 h-4" />
            Télécharger PDF
          </Button>

        </PageHeader>
        <div className="p-6 space-y-8">

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Absences"
              value={`${stats.totalAbsences}h`}
              icon={Clock}
              variant="info"
              main={true}
            >
              <p className="text-sm">
                {stats.avgAbsences.toFixed(1)}h en moyenne par étudiant
              </p>
            </StatCard>

            <StatCard
              title="Justifiées"
              value={`${stats.totalJustified}h`}
              icon={CheckCircle2}
              variant="success"
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" 
                    style={{ width: `${(stats.totalJustified / stats.totalAbsences) * 100}%` }}
                  ></div>
                </div>
                <span className="font-medium">
                  {((stats.totalJustified / stats.totalAbsences) * 100).toFixed(0)}%
                </span>
              </div>
            </StatCard>

            <StatCard
              title="Non Justifiées"
              value={`${stats.totalUnjustified}h`}
              icon={XCircle}
              variant="danger"
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" 
                    style={{ width: `${(stats.totalUnjustified / stats.totalAbsences) * 100}%` }}
                  ></div>
                </div>
                <span className="font-medium">
                  {((stats.totalUnjustified / stats.totalAbsences) * 100).toFixed(0)}%
                </span>
              </div>
            </StatCard>

            <StatCard
              title="Alertes"
              value={stats.criticalCount}
              icon={AlertTriangle}
              variant="warning"
            >
              <p className="text-sm">
                {stats.perfectCount} étudiant{stats.perfectCount > 1 ? 's' : ''} sans absence
              </p>
            </StatCard>
          </div>

          <ContentLayout
            title='Liste des Étudiants'
            description={`${students.length} étudiant${students.length > 1 ? '(s)' : ''}`}
          >


            <ResponsiveTable
              columns={studentColumns}
              data={students}
              searchKey={["name", "matricule"]}
              paginate={10}
              locale="fr"
              keyField="id"
            />
          </ContentLayout>

        </div>
    </div>
  );
}