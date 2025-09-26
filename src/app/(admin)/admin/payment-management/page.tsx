'use client'

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  User,
  CalendarDays,
  Receipt,
  Banknote,
  Wallet,
} from "lucide-react";
import { getUserList } from "@/actions/programsAction";
import { IListStudent } from "@/types/staffType";
import { toast } from "sonner";

// Interfaces TypeScript
interface Payment {
  id: number;
  studentId: number;
  studentName: string;
  programme: string;
  montant: number;
  modePaiement: string;
  datePaiement: string;
  reference: string;
  fraisRetard?: number;
}

interface PaymentStats {
  title: string;
  value: string;
  status: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  trendDirection: "up" | "down";
}

// Données mock pour les statistiques
const paymentStats: PaymentStats[] = [
  {
    title: "Paiements aujourd'hui",
    value: "450,000 FCFA",
    status: "normal",
    description: "12 transactions",
    icon: <DollarSign className="h-4 w-4" />,
    trend: "+18.2%",
    trendDirection: "up"
  },
  {
    title: "Montant total collecté",
    value: "2,450,000 FCFA",
    status: "excellent",
    description: "Ce mois",
    icon: <TrendingUp className="h-4 w-4" />,
    trend: "+12.5%",
    trendDirection: "up"
  },
  {
    title: "Taux de recouvrement",
    value: "87.2%",
    status: "normal",
    description: "Objectif: 90%",
    icon: <CheckCircle className="h-4 w-4" />,
    trend: "+3.4%",
    trendDirection: "up"
  },
];

// Données mock pour les paiements
const paymentsData: Payment[] = [
  {
    id: 1,
    studentId: 1001,
    studentName: "Jean-Baptiste Kouame",
    programme: "Médecine - 3ème année",
    montant: 250000,
    modePaiement: "BANK_DEPOSIT",
    datePaiement: "2024-01-22",
    reference: "PAY-2024-001"
  },
  {
    id: 2,
    studentId: 1002,
    studentName: "Marie-Claire Assi",
    programme: "Pharmacie - 2ème année",
    montant: 180000,
    modePaiement: "Mobile Money",
    datePaiement: "2024-01-21",
    reference: "PAY-2024-002"
  },
  {
    id: 3,
    studentId: 1003,
    studentName: "Kofi Mensah",
    programme: "Dentaire - 4ème année",
    montant: 320000,
    modePaiement: "Espèces",
    datePaiement: "2024-01-18",
    reference: "PAY-2024-003",
    fraisRetard: 15000
  },
  {
    id: 4,
    studentId: 1004,
    studentName: "Fatou Traore",
    programme: "Kinésithérapie - 1ère année",
    montant: 150000,
    modePaiement: "Carte bancaire",
    datePaiement: "2024-01-21",
    reference: "PAY-2024-004"
  },
  {
    id: 5,
    studentId: 1005,
    studentName: "David Kone",
    programme: "Médecine - 5ème année",
    montant: 300000,
    modePaiement: "BANK_DEPOSIT",
    datePaiement: "2024-01-22",
    reference: "PAY-2024-005"
  },
  {
    id: 6,
    studentId: 1006,
    studentName: "Aminata Diallo",
    programme: "Infirmerie - 3ème année",
    montant: 95000,
    modePaiement: "Mobile Money",
    datePaiement: "2024-01-15",
    reference: "PAY-2024-006"
  }
];

export default function PaymentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
  const [studentList, setStudentList] = useState<IListStudent[]>([]);

  // Fonction pour charger la liste des étudiants
  const loadStudentList = useCallback(async () => {
    try {
      const result = await getUserList();
      if (result.code === 'success') {
        setStudentList(result.data.body || []);
      } else {
        console.error('Error loading student list:', result.error);
        toast("Erreur", {
          description: "Impossible de charger la liste des étudiants.",
        });
      }
    } catch (error) {
      console.error('Error loading student list:', error);
      toast("Erreur", {
        description: "Une erreur s'est produite lors du chargement des étudiants.",
      });
    }
  }, []);

  useEffect(() => {
    loadStudentList();
  }, [loadStudentList]);


  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case "BANK_DEPOSIT":
        return <Banknote className="h-4 w-4" />;
      case "Mobile Money":
        return <Wallet className="h-4 w-4" />;
      case "Carte bancaire":
        return <CreditCard className="h-4 w-4" />;
      case "Espèces":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getPaymentModeLabel = (mode: string) => {
    switch (mode) {
      case "BANK_DEPOSIT":
        return "Virement bancaire";
      case "Mobile Money":
        return "Mobile Money";
      case "Carte bancaire":
        return "Carte bancaire";
      case "Espèces":
        return "Espèces";
      default:
        return mode;
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

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsDialogOpen(true);
  };

  const filteredPayments = paymentsData.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.programme.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestion des Paiements
          </h2>
          <p className="text-muted-foreground">
            Suivi et gestion des paiements étudiants
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
          <Button onClick={() => setIsCreatePaymentOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paymentStats.map((stat, index) => (
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
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  }
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payments Table with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Paiements</CardTitle>
              <CardDescription>
                Gestion et suivi de tous les paiements
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un paiement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date paiement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono">
                        {payment.reference}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.programme}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.montant)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPaymentModeIcon(payment.modePaiement)}
                          <span className="text-sm">{getPaymentModeLabel(payment.modePaiement)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(payment.datePaiement).toLocaleDateString('fr-FR')}
                          </span>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Receipt className="mr-2 h-4 w-4" />
                              Générer reçu
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              Contacter étudiant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Annuler paiement
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

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du Paiement - {selectedPayment?.reference}</DialogTitle>
            <DialogDescription>
              Informations complètes sur le paiement
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Étudiant</Label>
                  <p className="text-sm">{selectedPayment.studentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Programme</Label>
                  <p className="text-sm">{selectedPayment.programme}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Référence</Label>
                  <p className="text-sm font-mono">{selectedPayment.reference}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mode de paiement</Label>
                  <div className="flex items-center space-x-2">
                    {getPaymentModeIcon(selectedPayment.modePaiement)}
                    <span className="text-sm">{getPaymentModeLabel(selectedPayment.modePaiement)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedPayment.montant)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date de paiement</Label>
                  <p className="text-sm">{new Date(selectedPayment.datePaiement).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fermer
            </Button>
            <Button>
              <Receipt className="h-4 w-4 mr-2" />
              Générer reçu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Payment Dialog */}
      <Dialog open={isCreatePaymentOpen} onOpenChange={setIsCreatePaymentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Paiement</DialogTitle>
            <DialogDescription>
              Créer un nouveau paiement pour un étudiant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="student">Étudiant</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un étudiant" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {studentList.map((student) => (
                    <SelectItem key={student.user_code} value={student.user_code}>
                      <div className="flex items-center w-full max-w-full">
                        <span className="truncate">
                          {student.first_name} {student.last_name} - {student.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="montant">Montant (FCFA)</Label>
                <Input id="montant" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="mode">Mode de paiement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_DEPOSIT">Virement bancaire</SelectItem>
                    <SelectItem value="mobile">Mobile Money</SelectItem>
                    <SelectItem value="carte">Carte bancaire</SelectItem>
                    <SelectItem value="especes">Espèces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="datePaiement">Date de paiement</Label>
                <Input id="datePaiement" type="date" />
              </div>
              <div>
                <Label htmlFor="reference">Référence</Label>
                <Input id="reference" placeholder="REF-2024-XXX" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePaymentOpen(false)}>
              Annuler
            </Button>
            <Button>
              Créer le paiement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}