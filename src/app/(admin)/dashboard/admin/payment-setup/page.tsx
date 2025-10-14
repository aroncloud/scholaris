/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Plus,
  X,
  Save,
  Calendar,
  DollarSign,
  GraduationCap,
  Trash2,
  Edit2,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MoreVertical
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFinancialData } from "@/hooks/feature/financial/useFinancialData"
import { useFactorizedProgramStore } from "@/store/programStore"

// Types
interface Echeance {
  id: string
  libelle: string
  pourcentage: number
  dateEcheance: string
}

interface GrilleTarifaire {
  id: string
  filiere: string
  niveau: string
  anneeAcademique: string
  montantTotal: number
  echeances: Echeance[]
  statut: "ACTIVE" | "BROUILLON"
}

const filieres = [
  "Informatique", "Gestion", "Finance", "Marketing", "Commerce International",
  "Droit", "Architecture", "Médecine", "Pharmacie", "Génie Civil",
  "Génie Électrique", "Génie Mécanique", "Télécommunications", "Réseaux",
  "Cybersécurité", "Data Science", "Intelligence Artificielle", "Design Graphique"
]

const niveaux = ["L1", "L2", "L3", "M1", "M2"]

const anneesAcademiques = ["2024-2025", "2025-2026", "2026-2027"]

// Données exemple
const grillesInitiales: GrilleTarifaire[] = [
  {
    id: "1",
    filiere: "Informatique",
    niveau: "L1",
    anneeAcademique: "2024-2025",
    montantTotal: 400000,
    statut: "ACTIVE",
    echeances: [
      { id: "e1", libelle: "Inscription", pourcentage: 40, dateEcheance: "2024-09-15" },
      { id: "e2", libelle: "2ème Tranche", pourcentage: 30, dateEcheance: "2024-12-15" },
      { id: "e3", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "2025-03-15" }
    ]
  },
  {
    id: "2",
    filiere: "Informatique",
    niveau: "L2",
    anneeAcademique: "2024-2025",
    montantTotal: 450000,
    statut: "ACTIVE",
    echeances: [
      { id: "e4", libelle: "1ère Tranche", pourcentage: 50, dateEcheance: "2024-09-15" },
      { id: "e5", libelle: "2ème Tranche", pourcentage: 50, dateEcheance: "2025-01-15" }
    ]
  },
  {
    id: "3",
    filiere: "Gestion",
    niveau: "L1",
    anneeAcademique: "2024-2025",
    montantTotal: 380000,
    statut: "ACTIVE",
    echeances: [
      { id: "e6", libelle: "Inscription", pourcentage: 35, dateEcheance: "2024-09-10" },
      { id: "e7", libelle: "2ème Tranche", pourcentage: 35, dateEcheance: "2024-12-10" },
      { id: "e8", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "2025-03-10" }
    ]
  }
]

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

export default function GrilleTarifairePage() {
  const [grilles, setGrilles] = useState<GrilleTarifaire[]>(grillesInitiales)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGrille, setEditingGrille] = useState<GrilleTarifaire | null>(null)
  const { planData, listAllPlan } = useFinancialData()
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFiliere, setFilterFiliere] = useState<string>("TOUS")
  const [filterNiveau, setFilterNiveau] = useState<string>("TOUS")
  const [filterAnnee, setFilterAnnee] = useState<string>("TOUS")
  
  // Form state
  const [filiere, setFiliere] = useState("")
  const [niveau, setNiveau] = useState("")
  const [anneeAcademique, setAnneeAcademique] = useState("")
  const [montantTotal, setMontantTotal] = useState("")
  const [echeances, setEcheances] = useState<Echeance[]>([
    { id: "1", libelle: "Inscription", pourcentage: 40, dateEcheance: "" },
    { id: "2", libelle: "2ème Tranche", pourcentage: 30, dateEcheance: "" },
    { id: "3", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "" }
  ])

  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);
  useEffect(() => {
    listAllPlan();
  }, [listAllPlan])

  const handleAjouterEcheance = () => {
    const newEcheance: Echeance = {
      id: Date.now().toString(),
      libelle: `${echeances.length + 1}ème Tranche`,
      pourcentage: 0,
      dateEcheance: ""
    }
    setEcheances([...echeances, newEcheance])
  }

  const handleSupprimerEcheance = (id: string) => {
    if (echeances.length > 1) {
      setEcheances(echeances.filter(e => e.id !== id))
    }
  }

  const handleUpdateEcheance = (id: string, field: keyof Echeance, value: any) => {
    setEcheances(echeances.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ))
  }

  const calculerMontantEcheance = (pourcentage: number) => {
    if (!montantTotal) return 0
    return (parseFloat(montantTotal) * pourcentage) / 100
  }

  const totalPourcentage = echeances.reduce((acc, e) => acc + (e.pourcentage || 0), 0)
  const isFormValid = filiere && niveau && anneeAcademique && montantTotal && totalPourcentage === 100 && echeances.every(e => e.dateEcheance)

  const handleSauvegarder = () => {
    const nouvelleGrille: GrilleTarifaire = {
      id: editingGrille?.id || Date.now().toString(),
      filiere,
      niveau,
      anneeAcademique,
      montantTotal: parseFloat(montantTotal),
      statut: "ACTIVE",
      echeances: echeances
    }

    if (editingGrille) {
      setGrilles(grilles.map(g => g.id === editingGrille.id ? nouvelleGrille : g))
    } else {
      setGrilles([...grilles, nouvelleGrille])
    }

    handleReset()
  }

  const handleReset = () => {
    setIsDialogOpen(false)
    setEditingGrille(null)
    setFiliere("")
    setNiveau("")
    setAnneeAcademique("")
    setMontantTotal("")
    setEcheances([
      { id: "1", libelle: "Inscription", pourcentage: 40, dateEcheance: "" },
      { id: "2", libelle: "2ème Tranche", pourcentage: 30, dateEcheance: "" },
      { id: "3", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "" }
    ])
  }

  const handleEditer = (grille: GrilleTarifaire) => {
    setEditingGrille(grille)
    setFiliere(grille.filiere)
    setNiveau(grille.niveau)
    setAnneeAcademique(grille.anneeAcademique)
    setMontantTotal(grille.montantTotal.toString())
    setEcheances(grille.echeances)
    setIsDialogOpen(true)
  }

  const handleSupprimer = (id: string) => {
    setGrilles(grilles.filter(g => g.id !== id))
  }

  // Filtres
  const filteredGrilles = grilles.filter(grille => {
    const matchSearch = 
      grille.filiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grille.niveau.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFiliere = filterFiliere === "TOUS" || grille.filiere === filterFiliere
    const matchNiveau = filterNiveau === "TOUS" || grille.niveau === filterNiveau
    const matchAnnee = filterAnnee === "TOUS" || grille.anneeAcademique === filterAnnee
    
    return matchSearch && matchFiliere && matchNiveau && matchAnnee
  })

  // Grouper par année académique
  const grillesParAnnee = filteredGrilles.reduce((acc, grille) => {
    if (!acc[grille.anneeAcademique]) {
      acc[grille.anneeAcademique] = []
    }
    acc[grille.anneeAcademique].push(grille)
    return acc
  }, {} as Record<string, GrilleTarifaire[]>)

  const uniqueFilieres = Array.from(new Set(grilles.map(g => g.filiere))).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-slate-600" />
            <span className="text-xs md:text-sm font-medium text-slate-600 tracking-wide uppercase">
              Configuration Financière
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">
                Grilles Tarifaires
              </h1>
              <p className="text-sm md:text-base text-slate-600">
                {filteredGrilles.length} grille{filteredGrilles.length > 1 ? 's' : ''} configurée{filteredGrilles.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button size="lg" className="gap-2 w-full sm:w-auto" onClick={() => {
              handleReset()
              setIsDialogOpen(true)
            }}>
              <Plus className="h-5 w-5" />
              Nouvelle Grille
            </Button>
          </div>
        </div>

        {/* Filtres rapides */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher une filière ou niveau..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              <Select value={filterFiliere} onValueChange={setFilterFiliere}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Toutes les filières</SelectItem>
                  {uniqueFilieres.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterNiveau} onValueChange={setFilterNiveau}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les niveaux</SelectItem>
                  {niveaux.map(n => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grilles groupées par année */}
        {Object.entries(grillesParAnnee).sort().reverse().map(([annee, grillesAnnee]) => (
          <div key={annee} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-slate-900">{annee}</h2>
              <Badge variant="outline" className="font-medium">{grillesAnnee.length} grille{grillesAnnee.length > 1 ? 's' : ''}</Badge>
            </div>

          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planData.map((plan) => (
            <Card key={plan.fee_code} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-11 w-11 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">
                        {curriculumList.find(item => item.curriculum_code ==  plan.curriculum_code)?.curriculum_name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {curriculumList.find(item => item.curriculum_code ==  plan.curriculum_code)?.study_level}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        // handleEditer(grille)
                      }}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleSupprimer(plan.fee_code)}
                        className="text-rose-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Montant Total</p>
                    <p className="text-xl font-bold text-slate-900">
                      {formatMontant(grille.montantTotal)}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Échéances</span>
                      <span className="font-medium text-slate-700">{grille.echeances.length} tranche{grille.echeances.length > 1 ? 's' : ''}</span>
                    </div>
                    
                    {grille.echeances.map((echeance, index) => (
                      <div key={echeance.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {echeance.libelle}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(echeance.dateEcheance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <Badge variant="outline" className="text-xs">
                            {echeance.pourcentage}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => handleEditer(grille)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGrilles.length === 0 && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Aucune grille trouvée
              </h3>
              <p className="text-slate-500 mb-6">
                Essayez de modifier vos filtres ou créez une nouvelle grille
              </p>
              <Button onClick={() => {
                handleReset()
                setIsDialogOpen(true)
              }} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une grille
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dialog Création/Édition */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingGrille ? "Modifier la grille" : "Nouvelle grille tarifaire"}
              </DialogTitle>
              <DialogDescription>
                Configurez les tarifs et échéances de paiement
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              
              {/* Informations générales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filiere">Filière *</Label>
                  <Select value={filiere} onValueChange={setFiliere}>
                    <SelectTrigger id="filiere" className="h-11">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {filieres.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau *</Label>
                  <Select value={niveau} onValueChange={setNiveau}>
                    <SelectTrigger id="niveau" className="h-11">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {niveaux.map(n => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annee">Année *</Label>
                  <Select value={anneeAcademique} onValueChange={setAnneeAcademique}>
                    <SelectTrigger id="annee" className="h-11">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {anneesAcademiques.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant">Montant Total (FCFA) *</Label>
                <Input
                  id="montant"
                  type="number"
                  placeholder="450000"
                  value={montantTotal}
                  onChange={(e) => setMontantTotal(e.target.value)}
                  className="h-12 text-lg font-semibold"
                />
                {montantTotal && (
                  <p className="text-sm text-slate-500">
                    {formatMontant(parseFloat(montantTotal))}
                  </p>
                )}
              </div>

              <Separator />

              {/* Échéances */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Échéances de paiement</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAjouterEcheance}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>

                <div className="space-y-3">
                  {echeances.map((echeance, index) => (
                    <Card key={echeance.id} className="border-slate-200 bg-slate-50/30">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Tranche {index + 1}</span>
                            {echeances.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSupprimerEcheance(echeance.id)}
                                className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <Input
                            value={echeance.libelle}
                            onChange={(e) => handleUpdateEcheance(echeance.id, 'libelle', e.target.value)}
                            placeholder="Libellé"
                            className="h-10"
                          />

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Pourcentage</Label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={echeance.pourcentage}
                                  onChange={(e) => handleUpdateEcheance(echeance.id, 'pourcentage', parseFloat(e.target.value) || 0)}
                                  className="h-10 pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">%</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs">Montant</Label>
                              <div className="h-10 px-3 border border-slate-200 rounded-lg bg-white flex items-center">
                                <span className="text-sm font-semibold text-slate-900 truncate">
                                  {formatMontant(calculerMontantEcheance(echeance.pourcentage))}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs">Date limite</Label>
                              <Input
                                type="date"
                                value={echeance.dateEcheance}
                                onChange={(e) => handleUpdateEcheance(echeance.id, 'dateEcheance', e.target.value)}
                                className="h-10"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className={`border-2 ${totalPourcentage === 100 ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {totalPourcentage === 100 ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}
                        <span className="font-medium text-sm">Total des pourcentages</span>
                      </div>
                      <span className={`text-xl font-bold ${totalPourcentage === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {totalPourcentage}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                  Annuler
                </Button>
                <Button 
                  onClick={handleSauvegarder}
                  disabled={!isFormValid}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {editingGrille ? "Mettre à jour" : "Enregistrer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}