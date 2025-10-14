"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, TrendingUp, Award } from "lucide-react"

// Types
interface Epreuve {
  id: string
  nom: string
  note: number
  coefficient: number
  date: string
}

interface Module {
  id: string
  nom: string
  code: string
  epreuves: Epreuve[]
  coefficient: number
}

interface ReleveNotes {
  etudiant: {
    nom: string
    prenom: string
    matricule: string
    niveau: string
    filiere: string
  }
  anneeAcademique: string
  semestre: string
  modules: Module[]
  moyenneGenerale: number
  decision: "ADMIS" | "AJOURNÉ" | "REDOUBLE"
  mention?: string
}

const calculerMoyenneModule = (module: Module): number => {
  const sommeNotes = module.epreuves.reduce((acc, epreuve) => {
    return acc + (epreuve.note * epreuve.coefficient)
  }, 0)
  const sommeCoefficients = module.epreuves.reduce((acc, epreuve) => {
    return acc + epreuve.coefficient
  }, 0)
  return sommeCoefficients > 0 ? sommeNotes / sommeCoefficients : 0
}

const getDecisionStyle = (decision: string) => {
  switch (decision) {
    case "ADMIS":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
    case "AJOURNÉ":
      return "bg-amber-500/10 text-amber-700 border-amber-500/20"
    case "REDOUBLE":
      return "bg-rose-500/10 text-rose-700 border-rose-500/20"
    default:
      return "bg-slate-500/10 text-slate-700 border-slate-500/20"
  }
}

const getNoteColor = (note: number): string => {
  if (note >= 16) return "text-emerald-600 font-semibold"
  if (note >= 14) return "text-blue-600 font-semibold"
  if (note >= 12) return "text-slate-700 font-medium"
  if (note >= 10) return "text-amber-600 font-medium"
  return "text-rose-600 font-medium"
}

const releveNotesData: ReleveNotes = {
  etudiant: {
    nom: "KAMGA",
    prenom: "Jean-Pierre",
    matricule: "21A001CM",
    niveau: "Licence 2",
    filiere: "Informatique"
  },
  anneeAcademique: "2024-2025",
  semestre: "Semestre 1",
  modules: [
    {
      id: "1",
      nom: "Programmation Orientée Objet",
      code: "INF201",
      coefficient: 3,
      epreuves: [
        { id: "1", nom: "Contrôle Continu", note: 14.5, coefficient: 1, date: "15/01/2025" },
        { id: "2", nom: "Travaux Pratiques", note: 16, coefficient: 1, date: "20/01/2025" },
        { id: "3", nom: "Examen Final", note: 13, coefficient: 2, date: "10/02/2025" }
      ]
    },
    {
      id: "2",
      nom: "Base de Données",
      code: "INF202",
      coefficient: 3,
      epreuves: [
        { id: "4", nom: "Contrôle Continu", note: 12, coefficient: 1, date: "18/01/2025" },
        { id: "5", nom: "Projet", note: 15.5, coefficient: 2, date: "25/01/2025" },
        { id: "6", nom: "Examen Final", note: 11, coefficient: 2, date: "12/02/2025" }
      ]
    },
    {
      id: "3",
      nom: "Mathématiques pour l'Informatique",
      code: "MAT201",
      coefficient: 2,
      epreuves: [
        { id: "7", nom: "Contrôle Continu", note: 10.5, coefficient: 1, date: "22/01/2025" },
        { id: "8", nom: "Examen Final", note: 12, coefficient: 2, date: "14/02/2025" }
      ]
    }
  ],
  moyenneGenerale: 13.02,
  decision: "ADMIS",
  mention: "Assez Bien"
}

export default function ReleveNotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-600 tracking-wide uppercase">
                  Relevé de Notes Officiel
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {releveNotesData.anneeAcademique}
              </h1>
              <p className="text-slate-600 mt-1">{releveNotesData.semestre}</p>
            </div>
            <Button size="lg" className="gap-2 shadow-sm">
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student Info Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Étudiant
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {releveNotesData.etudiant.prenom} {releveNotesData.etudiant.nom}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Matricule
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {releveNotesData.etudiant.matricule}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Filière
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {releveNotesData.etudiant.filiere}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Niveau
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {releveNotesData.etudiant.niveau}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <div className="space-y-4">
              {releveNotesData.modules.map((module) => {
                const moyenneModule = calculerMoyenneModule(module)
                return (
                  <Card key={module.id} className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {module.code}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Coef. {module.coefficient}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mt-2">
                            {module.nom}
                          </h3>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                            Moyenne
                          </p>
                          <p className={`text-2xl font-bold ${getNoteColor(moyenneModule)}`}>
                            {moyenneModule.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                        {module.epreuves.map((epreuve) => (
                          <div 
                            key={epreuve.id} 
                            className="px-6 py-4 hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                  {epreuve.nom}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-sm text-slate-500">
                                    {epreuve.date}
                                  </p>
                                  <span className="text-slate-300">•</span>
                                  <p className="text-sm text-slate-500">
                                    Coef. {epreuve.coefficient}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className={`text-xl ${getNoteColor(epreuve.note)}`}>
                                  {epreuve.note.toFixed(2)}
                                </p>
                                <p className="text-xs text-slate-400">/ 20</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            
            {/* Results Summary */}
            <Card className="border-slate-200 shadow-sm sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium uppercase tracking-wider">
                    Résultats
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Moyenne Générale */}
                <div className="text-center p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Moyenne Générale
                  </p>
                  <p className="text-5xl font-bold text-white mb-1">
                    {releveNotesData.moyenneGenerale.toFixed(2)}
                  </p>
                  <p className="text-slate-400 text-sm">/ 20</p>
                </div>

                <Separator />

                {/* Mention */}
                {releveNotesData.mention && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Award className="h-4 w-4 text-slate-600" />
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Mention
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-base px-4 py-2 border-slate-300"
                    >
                      {releveNotesData.mention}
                    </Badge>
                  </div>
                )}

                <Separator />

                {/* Décision */}
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                    Décision du Jury
                  </p>
                  <Badge 
                    className={`text-lg px-6 py-3 border ${getDecisionStyle(releveNotesData.decision)}`}
                  >
                    {releveNotesData.decision}
                  </Badge>
                </div>

                <Separator />

                {/* Info Note */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Ce document est officiel. Pour toute contestation, 
                    contactez le service de la scolarité sous 15 jours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}