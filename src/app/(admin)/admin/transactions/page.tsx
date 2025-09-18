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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
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
  ArrowUpCircle,
  ArrowDownCircle,
  Download,
  RefreshCw,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  CalendarDays,
  Receipt,
  Building,
  ShoppingCart,
  Wrench,
  Users,
  Zap,
  Coffee,
  Car,
  BookOpen,
} from "lucide-react";

// Interfaces TypeScript
interface Transaction {
  id: number;
  type: "recette" | "depense";
  montant: number;
  categorie: string;
  description: string;
  date: string;
  reference: string;
  beneficiaire?: string;
  fournisseur?: string;
  modePaiement: string;
}

interface TransactionStats {
  title: string;
  value: string;
  status: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  trendDirection: "up" | "down";
}

// Catégories pour les transactions
const categoriesRecettes = [
  { value: "formation", label: "Formations externes", icon: <BookOpen className="h-4 w-4" /> },
  { value: "partenariat", label: "Partenariats", icon: <Users className="h-4 w-4" /> },
  { value: "subvention", label: "Subventions", icon: <Building className="h-4 w-4" /> },
  { value: "location", label: "Location d'espaces", icon: <Building className="h-4 w-4" /> },
  { value: "autres-recettes", label: "Autres recettes", icon: <DollarSign className="h-4 w-4" /> }
];

const categoriesDepenses = [
  { value: "fournitures", label: "Fournitures bureau", icon: <ShoppingCart className="h-4 w-4" /> },
  { value: "maintenance", label: "Maintenance", icon: <Wrench className="h-4 w-4" /> },
  { value: "electricite", label: "Électricité", icon: <Zap className="h-4 w-4" /> },
  { value: "transport", label: "Transport", icon: <Car className="h-4 w-4" /> },
  { value: "reception", label: "Réception", icon: <Coffee className="h-4 w-4" /> },
  { value: "autres-depenses", label: "Autres dépenses", icon: <Receipt className="h-4 w-4" /> }
];

// Données mock pour les statistiques
const transactionStats: TransactionStats[] = [
  {
    title: "Recettes du mois",
    value: "850,000 FCFA",
    status: "excellent",
    description: "15 transactions",
    icon: <ArrowUpCircle className="h-4 w-4" />,
    trend: "+22.5%",
    trendDirection: "up"
  },
  {
    title: "Dépenses du mois",
    value: "425,000 FCFA",
    status: "normal",
    description: "28 transactions",
    icon: <ArrowDownCircle className="h-4 w-4" />,
    trend: "+8.2%",
    trendDirection: "up"
  },
  {
    title: "Solde net",
    value: "425,000 FCFA",
    status: "excellent",
    description: "Bénéfice mensuel",
    icon: <TrendingUp className="h-4 w-4" />,
    trend: "+15.8%",
    trendDirection: "up"
  },
];

// Données mock pour les transactions
const transactionsData: Transaction[] = [
  {
    id: 1,
    type: "recette",
    montant: 150000,
    categorie: "formation",
    description: "Formation continue personnel médical",
    date: "2024-01-20",
    reference: "TXN-R-2024-001",
    beneficiaire: "Institut de Formation Médicale",
    modePaiement: "Virement bancaire"
  },
  {
    id: 2,
    type: "depense",
    montant: 85000,
    categorie: "fournitures",
    description: "Achat matériel de bureau Q1",
    date: "2024-01-19",
    reference: "TXN-D-2024-002",
    fournisseur: "Bureautique Plus",
    modePaiement: "Chèque"
  },
  {
    id: 3,
    type: "recette",
    montant: 200000,
    categorie: "partenariat",
    description: "Convention partenariat Hôpital Central",
    date: "2024-01-18",
    reference: "TXN-R-2024-003",
    beneficiaire: "Hôpital Central d'Abidjan",
    modePaiement: "Virement bancaire"
  },
  {
    id: 4,
    type: "depense",
    montant: 125000,
    categorie: "maintenance",
    description: "Maintenance équipements laboratoire",
    date: "2024-01-17",
    reference: "TXN-D-2024-004",
    fournisseur: "TechMed Services",
    modePaiement: "Espèces"
  },
  {
    id: 5,
    type: "depense",
    montant: 45000,
    categorie: "electricite",
    description: "Facture électricité janvier",
    date: "2024-01-16",
    reference: "TXN-D-2024-005",
    fournisseur: "CIE",
    modePaiement: "Prélèvement automatique"
  },
  {
    id: 6,
    type: "recette",
    montant: 300000,
    categorie: "location",
    description: "Location amphithéâtre événement",
    date: "2024-01-15",
    reference: "TXN-R-2024-006",
    beneficiaire: "Société EventPro",
    modePaiement: "Virement bancaire"
  }
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [transactionType, setTransactionType] = useState<"recette" | "depense">("recette");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recette":
        return "bg-green-100 text-green-800";
      case "depense":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recette":
        return <ArrowUpCircle className="h-4 w-4 text-green-600" />;
      case "depense":
        return <ArrowDownCircle className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (categorie: string, type: string) => {
    const categories = type === "recette" ? categoriesRecettes : categoriesDepenses;
    const category = categories.find(cat => cat.value === categorie);
    return category?.icon || <Receipt className="h-4 w-4" />;
  };

  const getCategoryLabel = (categorie: string, type: string) => {
    const categories = type === "recette" ? categoriesRecettes : categoriesDepenses;
    const category = categories.find(cat => cat.value === categorie);
    return category?.label || categorie;
  };

  const getStatColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-blue-600";
      case "excellent":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + " FCFA";
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsDialogOpen(true);
  };

  const filteredTransactions = transactionsData.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCategoryLabel(transaction.categorie, transaction.type).toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "recettes") return matchesSearch && transaction.type === "recette";
    if (activeTab === "depenses") return matchesSearch && transaction.type === "depense";

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Transactions Diverses
          </h2>
          <p className="text-muted-foreground">
            Gestion des recettes et dépenses diverses de l&apos;établissement
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
          <Button onClick={() => setIsCreateTransactionOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle transaction
          </Button>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transactionStats.map((stat, index) => (
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

      {/* Transactions Table with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des Transactions</CardTitle>
              <CardDescription>
                Suivi de toutes les recettes et dépenses diverses
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="recettes">Recettes</TabsTrigger>
              <TabsTrigger value="depenses">Dépenses</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">
                        {transaction.reference}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(transaction.type)}
                          <Badge
                            variant="secondary"
                            className={getTypeColor(transaction.type)}
                          >
                            {transaction.type === "recette" ? "Recette" : "Dépense"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.beneficiaire || transaction.fournisseur}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(transaction.categorie, transaction.type)}
                          <span className="text-sm">{getCategoryLabel(transaction.categorie, transaction.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${
                        transaction.type === "recette" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "recette" ? "+" : "-"}{formatCurrency(transaction.montant)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(transaction.date).toLocaleDateString('fr-FR')}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
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
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Transaction - {selectedTransaction?.reference}</DialogTitle>
            <DialogDescription>
              Informations complètes sur la transaction
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedTransaction.type)}
                    <Badge className={getTypeColor(selectedTransaction.type)}>
                      {selectedTransaction.type === "recette" ? "Recette" : "Dépense"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Catégorie</Label>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(selectedTransaction.categorie, selectedTransaction.type)}
                    <span className="text-sm">{getCategoryLabel(selectedTransaction.categorie, selectedTransaction.type)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Référence</Label>
                  <p className="text-sm font-mono">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mode de paiement</Label>
                  <p className="text-sm">{selectedTransaction.modePaiement}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className={`text-2xl font-bold ${
                    selectedTransaction.type === "recette" ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedTransaction.type === "recette" ? "+" : "-"}{formatCurrency(selectedTransaction.montant)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{new Date(selectedTransaction.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {selectedTransaction.type === "recette" ? "Bénéficiaire" : "Fournisseur"}
                  </Label>
                  <p className="text-sm">{selectedTransaction.beneficiaire || selectedTransaction.fournisseur}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm">{selectedTransaction.description}</p>
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

      {/* Create Transaction Dialog */}
      <Dialog open={isCreateTransactionOpen} onOpenChange={setIsCreateTransactionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Transaction</DialogTitle>
            <DialogDescription>
              Enregistrer une nouvelle recette ou dépense diverse
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type de transaction</Label>
              <Select value={transactionType} onValueChange={(value: "recette" | "depense") => setTransactionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recette">
                    <div className="flex items-center space-x-2">
                      <ArrowUpCircle className="h-4 w-4 text-green-600" />
                      <span>Recette</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="depense">
                    <div className="flex items-center space-x-2">
                      <ArrowDownCircle className="h-4 w-4 text-red-600" />
                      <span>Dépense</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="montant">Montant (FCFA)</Label>
                <Input id="montant" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="categorie">Catégorie</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {(transactionType === "recette" ? categoriesRecettes : categoriesDepenses).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div>
                <Label htmlFor="reference">Référence</Label>
                <Input id="reference" placeholder="TXN-XXX-2024-XXX" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tiers">
                  {transactionType === "recette" ? "Bénéficiaire" : "Fournisseur"}
                </Label>
                <Input id="tiers" placeholder={transactionType === "recette" ? "Nom du bénéficiaire" : "Nom du fournisseur"} />
              </div>
              <div>
                <Label htmlFor="modePaiement">Mode de paiement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virement">Virement bancaire</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="especes">Espèces</SelectItem>
                    <SelectItem value="prelevement">Prélèvement automatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description détaillée de la transaction..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTransactionOpen(false)}>
              Annuler
            </Button>
            <Button>
              Enregistrer la transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}