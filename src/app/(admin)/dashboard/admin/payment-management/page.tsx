/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Plus, 
  DollarSign, 
  Calendar,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  GraduationCap,
  Users,
  TrendingUp,
  Eye,
  ChevronRight
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Types
interface Etudiant {
  id: string
  matricule: string
  nom: string
  prenom: string
  niveau: string
  filiere: string
  montantTotal: number
  montantPaye: number
  statut: "COMPLET" | "PARTIEL" | "IMPAYE"
}

interface Paiement {
  id: string
  date: string
  montant: number
  modePaiement: "ESPECES" | "CARTE" | "VIREMENT" | "MOBILE_MONEY" | "CHEQUE"
  reference: string
  notes?: string
}

interface ModePaiement {
  id: string
  nom: string
  icon: any
  description: string
}

interface Filiere {
  id: string
  nom: string
  niveaux: string[]
}

const filieres: Filiere[] = [
  { id: "info", nom: "Informatique", niveaux: ["L1", "L2", "L3", "M1", "M2"] },
  { id: "gestion", nom: "Gestion", niveaux: ["L1", "L2", "L3", "M1", "M2"] },
  { id: "finance", nom: "Finance", niveaux: ["L1", "L2", "L3", "M1", "M2"] },
  { id: "marketing", nom: "Marketing", niveaux: ["L1", "L2", "L3", "M1", "M2"] }
]

const modesPaiement: ModePaiement[] = [
  { id: "ESPECES", nom: "Espèces", icon: Wallet, description: "Paiement en liquide" },
  { id: "CARTE", nom: "Carte Bancaire", icon: CreditCard, description: "CB, Visa, Mastercard" },
  { id: "VIREMENT", nom: "Virement", icon: Building2, description: "Virement bancaire" },
  { id: "MOBILE_MONEY", nom: "Mobile Money", icon: Smartphone, description: "Orange Money, MTN..." },
  { id: "CHEQUE", nom: "Chèque", icon: CreditCard, description: "Chèque bancaire" }
]

// Données exemple
const etudiantsData: Etudiant[] = [
  { id: "1", matricule: "21A001CM", nom: "KAMGA", prenom: "Jean-Pierre", niveau: "L2", filiere: "info", montantTotal: 450000, montantPaye: 450000, statut: "COMPLET" },
  { id: "2", matricule: "21A002CM", nom: "NGUENDO", prenom: "Marie", niveau: "L1", filiere: "info", montantTotal: 400000, montantPaye: 250000, statut: "PARTIEL" },
  { id: "3", matricule: "21A003CM", nom: "MBARGA", prenom: "Paul", niveau: "M1", filiere: "info", montantTotal: 550000, montantPaye: 0, statut: "IMPAYE" },
  { id: "4", matricule: "21B001CM", nom: "FOUDA", prenom: "Alice", niveau: "L3", filiere: "info", montantTotal: 450000, montantPaye: 450000, statut: "COMPLET" },
  { id: "5", matricule: "21B002CM", nom: "NKOMO", prenom: "David", niveau: "L2", filiere: "info", montantTotal: 450000, montantPaye: 150000, statut: "PARTIEL" },
  { id: "6", matricule: "21C001CM", nom: "ATEBA", prenom: "Sophie", niveau: "L1", filiere: "gestion", montantTotal: 400000, montantPaye: 400000, statut: "COMPLET" },
  { id: "7", matricule: "21C002CM", nom: "BIKOE", prenom: "Thomas", niveau: "L2", filiere: "gestion", montantTotal: 450000, montantPaye: 200000, statut: "PARTIEL" },
  { id: "8", matricule: "21D001CM", nom: "OWONA", prenom: "Carine", niveau: "M1", filiere: "finance", montantTotal: 550000, montantPaye: 550000, statut: "COMPLET" },
  { id: "9", matricule: "21D002CM", nom: "ESSOMBA", prenom: "Marc", niveau: "L3", filiere: "finance", montantTotal: 450000, montantPaye: 0, statut: "IMPAYE" },
  { id: "10", matricule: "21E001CM", nom: "MANGA", prenom: "Julie", niveau: "L1", filiere: "marketing", montantTotal: 400000, montantPaye: 100000, statut: "PARTIEL" }
]

const paiementsData: Record<string, Paiement[]> = {
  "1": [
    { id: "p1", date: "2024-09-15", montant: 250000, modePaiement: "VIREMENT", reference: "VIR20240915001" },
    { id: "p2", date: "2024-11-20", montant: 200000, modePaiement: "MOBILE_MONEY", reference: "MM20241120458" }
  ],
  "2": [{ id: "p3", date: "2024-10-05", montant: 250000, modePaiement: "ESPECES", reference: "ESP20241005123" }]
}

const getStatutStyle = (statut: string) => {
  switch (statut) {
    case "COMPLET": return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
    case "PARTIEL": return "bg-amber-500/10 text-amber-700 border-amber-500/20"
    case "IMPAYE": return "bg-rose-500/10 text-rose-700 border-rose-500/20"
    default: return "bg-slate-500/10 text-slate-700 border-slate-500/20"
  }
}

const getStatutIcon = (statut: string) => {
  switch (statut) {
    case "COMPLET": return <CheckCircle2 className="h-3.5 w-3.5" />
    case "PARTIEL": return <Clock className="h-3.5 w-3.5" />
    case "IMPAYE": return <AlertCircle className="h-3.5 w-3.5" />
  }
}

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function GestionScolaritePage() {
  const [selectedFiliere, setSelectedFiliere] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatut, setSelectedStatut] = useState<string>("TOUS")
  const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null)
  const [viewMode, setViewMode] = useState<"details" | "list">("list")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [montant, setMontant] = useState("")
  const [modePaiement, setModePaiement] = useState("")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")

  const filteredEtudiants = etudiantsData.filter(etudiant => {
    const matchFiliere = !selectedFiliere || etudiant.filiere === selectedFiliere
    const matchSearch = 
      etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatut = selectedStatut === "TOUS" || etudiant.statut === selectedStatut
    return matchFiliere && matchSearch && matchStatut
  })

  const stats = {
    total: filteredEtudiants.reduce((acc, e) => acc + e.montantTotal, 0),
    paye: filteredEtudiants.reduce((acc, e) => acc + e.montantPaye, 0),
    reste: filteredEtudiants.reduce((acc, e) => acc + (e.montantTotal - e.montantPaye), 0),
    complet: filteredEtudiants.filter(e => e.statut === "COMPLET").length,
    partiel: filteredEtudiants.filter(e => e.statut === "PARTIEL").length,
    impaye: filteredEtudiants.filter(e => e.statut === "IMPAYE").length
  }

  const handleNouveauPaiement = () => {
    console.log({ etudiant: selectedEtudiant?.id, montant, modePaiement, reference, notes })
    setIsDialogOpen(false)
    setMontant("")
    setModePaiement("")
    setReference("")
    setNotes("")
  }

  // État initial : sélection de filière
  if (!selectedFiliere) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex h-16 w-16 bg-slate-900 rounded-2xl items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Gestion des Paiements
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Bienvenue sur l&apos;interface de gestion financière. Sélectionnez une filière pour commencer à gérer les paiements de scolarité de vos étudiants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filieres.map((filiere) => (
              <button
                key={filiere.id}
                onClick={() => setSelectedFiliere(filiere.id)}
                className="group p-8 bg-white border-2 border-slate-200 rounded-2xl text-left transition-all hover:border-slate-900 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <GraduationCap className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{filiere.nom}</h3>
                <p className="text-sm text-slate-500">
                  {filiere.niveaux.length} niveaux disponibles
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentFiliere = filieres.find(f => f.id === selectedFiliere)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header avec sélecteur de filière */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFiliere("")}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Retour
              </Button>
              
              <Select value={selectedFiliere} onValueChange={setSelectedFiliere}>
                <SelectTrigger className="w-[250px] h-11 border-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filieres.map((filiere) => (
                    <SelectItem key={filiere.id} value={filiere.id}>
                      {filiere.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            {currentFiliere?.nom}
          </h1>
          <p className="text-slate-600">
            {filteredEtudiants.length} étudiant{filteredEtudiants.length > 1 ? 's' : ''} inscrit{filteredEtudiants.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <Users className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{filteredEtudiants.length}</p>
              <p className="text-xs text-slate-500">Étudiants</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <Badge variant="outline" className="text-emerald-600">{stats.complet}</Badge>
              </div>
              <p className="text-2xl font-bold text-emerald-600 mb-1">{formatMontant(stats.paye)}</p>
              <p className="text-xs text-slate-500">Montant Perçu</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <Badge variant="outline" className="text-amber-600">{stats.partiel + stats.impaye}</Badge>
              </div>
              <p className="text-2xl font-bold text-amber-600 mb-1">{formatMontant(stats.reste)}</p>
              <p className="text-xs text-slate-500">Reste à Percevoir</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-slate-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{formatMontant(stats.total)}</p>
              <p className="text-xs text-slate-500">Montant Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par nom, prénom ou matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              
              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger className="w-full md:w-[180px] h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous ({filteredEtudiants.length})</SelectItem>
                  <SelectItem value="COMPLET">Payé complet ({stats.complet})</SelectItem>
                  <SelectItem value="PARTIEL">Payé partiel ({stats.partiel})</SelectItem>
                  <SelectItem value="IMPAYE">Impayé ({stats.impaye})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table des étudiants */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-semibold">Étudiant</TableHead>
                  <TableHead className="font-semibold">Matricule</TableHead>
                  <TableHead className="font-semibold">Niveau</TableHead>
                  <TableHead className="font-semibold text-right">Montant Total</TableHead>
                  <TableHead className="font-semibold text-right">Payé</TableHead>
                  <TableHead className="font-semibold text-right">Reste</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEtudiants.map((etudiant) => (
                  <TableRow key={etudiant.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-slate-600">
                            {etudiant.prenom.charAt(0)}{etudiant.nom.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {etudiant.prenom} {etudiant.nom}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-slate-600">{etudiant.matricule}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">{etudiant.niveau}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatMontant(etudiant.montantTotal)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      {formatMontant(etudiant.montantPaye)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-amber-600">
                      {formatMontant(etudiant.montantTotal - etudiant.montantPaye)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border gap-1.5 ${getStatutStyle(etudiant.statut)}`}>
                        {getStatutIcon(etudiant.statut)}
                        {etudiant.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEtudiant(etudiant)}
                          className="h-8 gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Voir
                        </Button>
                        <Dialog open={isDialogOpen && selectedEtudiant?.id === etudiant.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedEtudiant(etudiant)}
                              className="h-8 gap-1.5"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Paiement
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Enregistrer un paiement</DialogTitle>
                              <DialogDescription>
                                {selectedEtudiant?.prenom} {selectedEtudiant?.nom} - {selectedEtudiant?.matricule}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="montant">Montant (FCFA)</Label>
                                <Input
                                  id="montant"
                                  type="number"
                                  placeholder="Ex: 250000"
                                  value={montant}
                                  onChange={(e) => setMontant(e.target.value)}
                                  className="h-11"
                                />
                              </div>

                              <div className="space-y-3">
                                <Label>Mode de paiement</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {modesPaiement.map((mode) => {
                                    const Icon = mode.icon
                                    return (
                                      <button
                                        key={mode.id}
                                        onClick={() => setModePaiement(mode.id)}
                                        className={`p-4 border-2 rounded-xl text-left transition-all hover:border-slate-300 ${
                                          modePaiement === mode.id
                                            ? 'border-slate-900 bg-slate-50'
                                            : 'border-slate-200'
                                        }`}
                                      >
                                        <Icon className={`h-5 w-5 mb-2 ${
                                          modePaiement === mode.id ? 'text-slate-900' : 'text-slate-600'
                                        }`} />
                                        <p className="font-medium text-sm text-slate-900">{mode.nom}</p>
                                        <p className="text-xs text-slate-500 mt-1">{mode.description}</p>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="reference">Référence de transaction</Label>
                                <Input
                                  id="reference"
                                  placeholder="Ex: VIR20250115001"
                                  value={reference}
                                  onChange={(e) => setReference(e.target.value)}
                                  className="h-11"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="notes">Notes (optionnel)</Label>
                                <Input
                                  id="notes"
                                  placeholder="Informations complémentaires..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  className="h-11"
                                />
                              </div>

                              <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Annuler
                                </Button>
                                <Button 
                                  onClick={handleNouveauPaiement}
                                  disabled={!montant || !modePaiement || !reference}
                                >
                                  Enregistrer le paiement
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredEtudiants.length === 0 && (
              <div className="p-12 text-center">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Aucun étudiant trouvé
                </h3>
                <p className="text-slate-500">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}