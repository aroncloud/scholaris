/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  MoreHorizontal,
  Eye,
  FileText,
  User,
  CalendarDays,
} from "lucide-react";

// Données financières mock
const financialStats = [
  {
    title: "Total des frais collectés",
    value: "2,450,000 FCFA",
    status: "normal",
    description: "Ce mois",
    icon: <DollarSign className="h-4 w-4" />,
    trend: "+12.5%",
    trendDirection: "up"
  },
  {
    title: "Montant en attente",
    value: "875,000 FCFA",
    status: "warning",
    description: "À recouvrer",
    icon: <Clock className="h-4 w-4" />,
    trend: "+5.2%",
    trendDirection: "up"
  },
  {
    title: "Étudiants en retard",
    value: "23",
    status: "alert",
    description: "Plus de 30 jours",
    icon: <AlertTriangle className="h-4 w-4" />,
    trend: "-8.1%",
    trendDirection: "down"
  },
  {
    title: "Taux de recouvrement",
    value: "87.2%",
    status: "excellent",
    description: "Objectif: 90%",
    icon: <TrendingUp className="h-4 w-4" />,
    trend: "+3.4%",
    trendDirection: "up"
  },
];

const studentFinancialData: Student[] = [
  {
    id: 1,
    nom: "Jean-Baptiste Kouame",
    programme: "Médecine - 3ème année",
    totalDu: 750000,
    totalPaye: 500000,
    solde: 250000,
    statut: "En retard",
    derniereEcheance: "2024-01-15",
    prochainPaiement: "2024-02-15",
    telephone: "+225 07 12 34 56 78",
    email: "jean.kouame@student.univ.fr",
    solvabilite: "Moyenne"
  },
  {
    id: 2,
    nom: "Marie-Claire Assi",
    programme: "Pharmacie - 2ème année",
    totalDu: 650000,
    totalPaye: 650000,
    solde: 0,
    statut: "À jour",
    derniereEcheance: "2024-01-10",
    prochainPaiement: "2024-03-10",
    telephone: "+225 05 98 76 54 32",
    email: "marie.assi@student.univ.fr",
    solvabilite: "Excellente"
  },
  {
    id: 3,
    nom: "Kofi Mensah",
    programme: "Dentaire - 4ème année",
    totalDu: 800000,
    totalPaye: 320000,
    solde: 480000,
    statut: "Critique",
    derniereEcheance: "2023-12-15",
    prochainPaiement: "2024-01-15",
    telephone: "+225 01 23 45 67 89",
    email: "kofi.mensah@student.univ.fr",
    solvabilite: "Faible"
  },
  {
    id: 4,
    nom: "Fatou Traore",
    programme: "Kinésithérapie - 1ère année",
    totalDu: 450000,
    totalPaye: 450000,
    solde: 0,
    statut: "À jour",
    derniereEcheance: "2024-01-20",
    prochainPaiement: "2024-04-20",
    telephone: "+225 07 88 99 11 22",
    email: "fatou.traore@student.univ.fr",
    solvabilite: "Bonne"
  },
  {
    id: 5,
    nom: "David Kone",
    programme: "Médecine - 5ème année",
    totalDu: 900000,
    totalPaye: 720000,
    solde: 180000,
    statut: "En cours",
    derniereEcheance: "2024-01-05",
    prochainPaiement: "2024-02-05",
    telephone: "+225 02 55 66 77 88",
    email: "david.kone@student.univ.fr",
    solvabilite: "Bonne"
  },
  {
    id: 6,
    nom: "Aminata Diallo",
    programme: "Infirmerie - 3ème année",
    totalDu: 380000,
    totalPaye: 190000,
    solde: 190000,
    statut: "En retard",
    derniereEcheance: "2024-01-01",
    prochainPaiement: "2024-02-01",
    telephone: "+225 05 44 33 22 11",
    email: "aminata.diallo@student.univ.fr",
    solvabilite: "Moyenne"
  }
];

// Interface pour le type Student
interface Student {
  id: number;
  nom: string;
  programme: string;
  totalDu: number;
  totalPaye: number;
  solde: number;
  statut: string;
  derniereEcheance: string;
  prochainPaiement: string;
  telephone: string;
  email: string;
  solvabilite: string;
}

export default function FinancialDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "À jour":
        return "bg-green-100 text-green-800";
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "En retard":
        return "bg-orange-100 text-orange-800";
      case "Critique":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSolvabilityColor = (solvabilite: string) => {
    switch (solvabilite) {
      case "Excellente":
        return "bg-green-100 text-green-800";
      case "Bonne":
        return "bg-blue-100 text-blue-800";
      case "Moyenne":
        return "bg-yellow-100 text-yellow-800";
      case "Faible":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600";
      case "warning":
        return "text-orange-600";
      case "alert":
        return "text-red-600";
      case "excellent":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + " FCFA";
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const filteredStudents = studentFinancialData.filter(student =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.programme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Tableau de bord Financier
          </h2>
          <p className="text-muted-foreground">
            Vue d&apos;ensemble des finances et situations financières des étudiants
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={getStatColor(stat.status)}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className={`flex items-center text-xs ${
                  stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trendDirection === 'up' ?
                    <TrendingUp className="h-3 w-3 mr-1" /> :
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students Financial Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Situations Financières des Étudiants</CardTitle>
              <CardDescription>
                Suivi des paiements et échéances par étudiant
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="a-jour">À jour</SelectItem>
                  <SelectItem value="en-retard">En retard</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Total Dû</TableHead>
                <TableHead>Total Payé</TableHead>
                <TableHead>Solde</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Solvabilité</TableHead>
                <TableHead>Prochaine Échéance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.programme}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(student.totalDu)}
                  </TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(student.totalPaye)}
                  </TableCell>
                  <TableCell className={student.solde > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                    {formatCurrency(student.solde)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(student.statut)}
                    >
                      {student.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getSolvabilityColor(student.solvabilite)}
                    >
                      {student.solvabilite}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(student.prochainPaiement).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Dossier financier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Contacter étudiant
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Exporter relevé
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails Financiers - {selectedStudent?.nom}</DialogTitle>
            <DialogDescription>
              Informations complètes sur la situation financière de l&apos;étudiant
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Programme</Label>
                  <p className="text-sm">{selectedStudent.programme}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Téléphone</Label>
                  <p className="text-sm">{selectedStudent.telephone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Solvabilité</Label>
                  <Badge className={getSolvabilityColor(selectedStudent.solvabilite)}>
                    {selectedStudent.solvabilite}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Dû</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedStudent.totalDu)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Payé</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedStudent.totalPaye)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Solde Restant</p>
                  <p className={`text-lg font-bold ${selectedStudent.solde > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(selectedStudent.solde)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Dernière Échéance</Label>
                  <p className="text-sm">{new Date(selectedStudent.derniereEcheance).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Prochaine Échéance</Label>
                  <p className="text-sm">{new Date(selectedStudent.prochainPaiement).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Statut de Paiement</Label>
                <div className="mt-1">
                  <Badge className={getStatusColor(selectedStudent.statut)}>
                    {selectedStudent.statut}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fermer
            </Button>
            <Button>
              Accéder au dossier complet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}