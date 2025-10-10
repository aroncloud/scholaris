"use client";

import React, { useState, useMemo } from 'react';
import { Download, FileSpreadsheet, AlertTriangle, CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import PageHeader from '@/layout/PageHeader';
import StatCard from '@/components/cards/StatCard';

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
  { id: '9', name: 'Nkolo David', matricule: '21A009', justifiedAbsences: 0, unjustifiedAbsences: 0, totalAbsences: 0 },
  { id: '10', name: 'Mendomo Patricia', matricule: '21A010', justifiedAbsences: 12, unjustifiedAbsences: 8, totalAbsences: 20 },
];

export default function AttendanceReport() {
  const [students] = useState<Student[]>(mockStudents);
  const [period, setPeriod] = useState<string>('semester1');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');

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

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'total-desc': return b.totalAbsences - a.totalAbsences;
        case 'total-asc': return a.totalAbsences - b.totalAbsences;
        case 'unjustified-desc': return b.unjustifiedAbsences - a.unjustifiedAbsences;
        default: return 0;
      }
    });
  }, [students, searchTerm, sortBy]);

  const exportToCSV = () => {
    const headers = ['Matricule', 'Nom Complet', 'Absences Justifiées (h)', 'Absences Non Justifiées (h)', 'Total (h)', 'Taux'];
    const rows = filteredAndSortedStudents.map(s => [
      s.matricule,
      s.name,
      s.justifiedAbsences,
      s.unjustifiedAbsences,
      s.totalAbsences,
      `${((s.unjustifiedAbsences / (s.totalAbsences || 1)) * 100).toFixed(1)}%`
    ]);
    
    const csvContent = [
      `Rapport d'Assiduité - ${period === 'semester1' ? 'Semestre 1' : period === 'semester2' ? 'Semestre 2' : 'Année Complète'}`,
      `Généré le: ${new Date().toLocaleDateString('fr-FR')}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport_assiduite_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    window.print();
  };

  const getStatusColor = (student: Student) => {
    if (student.totalAbsences === 0) return 'perfect';
    if (student.unjustifiedAbsences > 5) return 'critical';
    if (student.totalAbsences > 10) return 'warning';
    return 'normal';
  };

  const getRiskLevel = (unjustified: number) => {
    if (unjustified === 0) return { level: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
    if (unjustified <= 3) return { level: 'Acceptable', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock };
    if (unjustified <= 5) return { level: 'À surveiller', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertTriangle };
    return { level: 'Critique', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
  };

  return (
    <div>
        <PageHeader
          title='Rapport d&apos;Assiduité'
          description={`Informatique · Promotion 2021 · ${students.length} étudiants`}
        >
          <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48 h-11 border-gray-300 shadow-sm">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester1">Semestre 1 - 2024</SelectItem>
                <SelectItem value="semester2">Semestre 2 - 2024</SelectItem>
                <SelectItem value="year">Année complète</SelectItem>
              </SelectContent>
            </Select>
            
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

          {/* Main Table Card */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">Liste des Étudiants</CardTitle>
                  <p className="text-gray-600 mt-1">{filteredAndSortedStudents.length} résultat{filteredAndSortedStudents.length > 1 ? 's' : ''}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un étudiant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 border-gray-300 shadow-sm"
                    />
                  </div>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-56 h-11 border-gray-300 shadow-sm">
                      <SelectValue placeholder="Trier par..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nom (A-Z)</SelectItem>
                      <SelectItem value="total-desc">Total absences (↓)</SelectItem>
                      <SelectItem value="total-asc">Total absences (↑)</SelectItem>
                      <SelectItem value="unjustified-desc">Non justifiées (↓)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700 uppercase tracking-wider">Étudiant</th>
                      <th className="text-center py-4 px-6 font-semibold text-sm text-gray-700 uppercase tracking-wider">Justifiées</th>
                      <th className="text-center py-4 px-6 font-semibold text-sm text-gray-700 uppercase tracking-wider">Non Justifiées</th>
                      <th className="text-center py-4 px-6 font-semibold text-sm text-gray-700 uppercase tracking-wider">Total</th>
                      <th className="text-center py-4 px-6 font-semibold text-sm text-gray-700 uppercase tracking-wider">Évaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAndSortedStudents.map((student) => {
                      const statusColor = getStatusColor(student);
                      const risk = getRiskLevel(student.unjustifiedAbsences);
                      const RiskIcon = risk.icon;
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md ${
                                statusColor === 'perfect' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                                statusColor === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                statusColor === 'warning' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                                'bg-gradient-to-br from-blue-500 to-blue-600'
                              }`}>
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.matricule}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                              <span className="text-emerald-700 font-bold text-lg">{student.justifiedAbsences}</span>
                              <span className="text-emerald-600 text-xs font-medium">heures</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200">
                              <span className="text-red-700 font-bold text-lg">{student.unjustifiedAbsences}</span>
                              <span className="text-red-600 text-xs font-medium">heures</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-2xl font-bold text-gray-900">{student.totalAbsences}h</span>
                              {student.totalAbsences > 0 && (
                                <span className="text-xs text-gray-500 mt-0.5">
                                  {((student.unjustifiedAbsences / student.totalAbsences) * 100).toFixed(0)}% non just.
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${risk.bg} border border-opacity-20`}>
                              <RiskIcon className={`w-4 h-4 ${risk.color}`} />
                              <span className={`font-semibold text-sm ${risk.color}`}>{risk.level}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredAndSortedStudents.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucun étudiant trouvé</p>
                  <p className="text-gray-400 text-sm mt-1">Essayez de modifier votre recherche</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
    </div>
  );
}