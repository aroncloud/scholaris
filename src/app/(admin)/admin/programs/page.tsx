'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

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
  DialogTrigger,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Eye,
  ChevronRight,
  ChevronDown,
  Building,
  Users,
  Clock,
  Target,
  Award,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

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

interface Filiere {
  id: string;
  nom: string;
  description: string;
  duree: number; // en années
  maquettes: Maquette[];
  statut: "actif" | "suspendu" | "archive";
  capaciteAccueil: number;
  fraisInscription: number;
}

const mockFilieres: Filiere[] = [
  {
    id: "1",
    nom: "Pharmacie",
    description: "Formation en sciences pharmaceutiques",
    duree: 5,
    statut: "actif",
    capaciteAccueil: 120,
    fraisInscription: 3500,
    maquettes: [
      {
        id: "1",
        nom: "Maquette Pharmacie 2023",
        version: "2023.1",
        description: "Maquette officielle pour l'année académique 2023-2024",
        dateCreation: "2023-06-01",
        statut: "actif",
        totalCredits: 300,
        sequences: [
          {
            id: "1",
            nom: "Séquence 1 - Bases scientifiques",
            description: "Formation aux sciences fondamentales",
            duree: 12,
            statut: "actif",
            domaines: [
              {
                id: "1",
                nom: "Sciences Chimiques",
                description: "Chimie générale et organique",
                statut: "actif",
                ues: [
                  {
                    id: "1",
                    code: "UE-CHIM-001",
                    nom: "Chimie Générale",
                    description: "Fondamentaux de la chimie",
                    credits: 6,
                    statut: "actif",
                    modules: [
                      {
                        id: "1",
                        code: "MOD-CHIM-001",
                        nom: "Chimie Générale I",
                        description: "Atomes, liaisons chimiques, équilibres",
                        credits: 3,
                        heures: 45,
                        enseignant: "Dr. Durand",
                        statut: "actif",
                        semestre: 1,
                        evaluation: "Examen écrit + TP",
                      },
                      {
                        id: "2",
                        code: "MOD-CHIM-002",
                        nom: "Chimie Générale II",
                        description: "Thermodynamique, cinétique chimique",
                        credits: 3,
                        heures: 45,
                        enseignant: "Dr. Durand",
                        statut: "actif",
                        semestre: 1,
                        evaluation: "Examen écrit + TP",
                        prerequis: ["MOD-CHIM-001"],
                      },
                    ],
                  },
                  {
                    id: "2",
                    code: "UE-CHIM-002",
                    nom: "Chimie Organique",
                    description: "Chimie du carbone et mécanismes réactionnels",
                    credits: 8,
                    statut: "actif",
                    modules: [
                      {
                        id: "3",
                        code: "MOD-CHIM-003",
                        nom: "Chimie Organique Fondamentale",
                        description: "Structures, nomenclature, réactivité",
                        credits: 4,
                        heures: 60,
                        enseignant: "Pr. Martin",
                        statut: "actif",
                        semestre: 2,
                        evaluation: "Examen écrit + TP",
                      },
                      {
                        id: "4",
                        code: "MOD-CHIM-004",
                        nom: "Mécanismes Réactionnels",
                        description: "Étude des mécanismes de réaction",
                        credits: 4,
                        heures: 60,
                        enseignant: "Pr. Martin",
                        statut: "actif",
                        semestre: 2,
                        evaluation: "Examen oral + Projet",
                        prerequis: ["MOD-CHIM-003"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    nom: "Médecine",
    description: "Formation médicale générale",
    duree: 6,
    statut: "actif",
    capaciteAccueil: 80,
    fraisInscription: 4000,
    maquettes: [],
  },
];

const statutLabels = {
  actif: { label: "Actif", color: "bg-green-100 text-green-800" },
  suspendu: { label: "Suspendu", color: "bg-red-100 text-red-800" },
  archive: { label: "Archivé", color: "bg-gray-100 text-gray-800" },
  brouillon: { label: "Brouillon", color: "bg-yellow-100 text-yellow-800" },
};

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filieres, setFilieres] = useState<Filiere[]>(mockFilieres);
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [selectedMaquette, setSelectedMaquette] = useState<Maquette | null>(
    null,
  );
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isFiliereDialogOpen, setIsFiliereDialogOpen] = useState(false);
  const [isMaquetteDialogOpen, setIsMaquetteDialogOpen] = useState(false);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isCreateFiliereOpen, setIsCreateFiliereOpen] = useState(false);
  const [isViewMaquetteOpen, setIsViewMaquetteOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filiereToDelete, setFiliereToDelete] = useState<string | null>(null);

  // Modal states for maquettes actions
  const [isAddMaquetteOpen, setIsAddMaquetteOpen] = useState(false);
  const [isAddSequenceOpen, setIsAddSequenceOpen] = useState(false);
  const [isAddDomaineOpen, setIsAddDomaineOpen] = useState(false);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddUEOpen, setIsAddUEOpen] = useState(false);

  // Edit modals
  const [isEditMaquetteOpen, setIsEditMaquetteOpen] = useState(false);
  const [isEditSequenceOpen, setIsEditSequenceOpen] = useState(false);
  const [isEditDomaineOpen, setIsEditDomaineOpen] = useState(false);
  const [isEditUEOpen, setIsEditUEOpen] = useState(false);

  // Delete confirmation states
  const [deleteMaquetteDialogOpen, setDeleteMaquetteDialogOpen] =
    useState(false);
  const [deleteSequenceDialogOpen, setDeleteSequenceDialogOpen] =
    useState(false);
  const [deleteDomaineDialogOpen, setDeleteDomaineDialogOpen] = useState(false);
  const [deleteUEDialogOpen, setDeleteUEDialogOpen] = useState(false);

  // Selected items for editing/deleting
  const [selectedMaquetteForEdit, setSelectedMaquetteForEdit] =
    useState<Maquette | null>(null);
  const [selectedSequenceForEdit, setSelectedSequenceForEdit] =
    useState<Sequence | null>(null);
  const [selectedDomaineForEdit, setSelectedDomaineForEdit] =
    useState<Domaine | null>(null);
  const [selectedUEForEdit, setSelectedUEForEdit] = useState<UE | null>(null);

  // Context for add actions
  const [selectedFiliereForActions, setSelectedFiliereForActions] = useState<
    string | null
  >(null);
  const [selectedMaquetteForActions, setSelectedMaquetteForActions] = useState<
    string | null
  >(null);
  const [selectedSequenceForActions, setSelectedSequenceForActions] = useState<
    string | null
  >(null);
  const [selectedDomaineForActions, setSelectedDomaineForActions] = useState<
    string | null
  >(null);


  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleCreateFiliere = () => {
    const newFiliere: Filiere = {
      id: Date.now().toString(),
      maquettes: [],
      ...formData,
    } as Filiere;

    setFilieres([...filieres, newFiliere]);
    // toast({
    //   title: "Filière créée",
    //   description: "La nouvelle filière a été créée avec succès.",
    // });
    setIsCreateFiliereOpen(false);
    setFormData({});
  };

  const handleDeleteFiliere = (filiereId: string) => {
    setFilieres((filieres) => filieres.filter((f) => f.id !== filiereId));
    // toast({
    //   title: "Filière supprimée",
    //   description: "La filière a été supprimée définitivement.",
    //   variant: "destructive",
    // });
  };

  // Handlers for maquettes actions
  const handleAddMaquette = () => {
    if (!selectedFiliereForActions) return;

    const newMaquette: Maquette = {
      id: Date.now().toString(),
      nom: formData.nom || "",
      version: formData.version || "1.0",
      description: formData.description || "",
      dateCreation: new Date().toISOString().split("T")[0],
      sequences: [],
      statut: "brouillon",
      totalCredits: 0,
    };

    setFilieres((prev) =>
      prev.map((f) =>
        f.id === selectedFiliereForActions
          ? { ...f, maquettes: [...f.maquettes, newMaquette] }
          : f,
      ),
    );

    // toast({
    //   title: "Maquette créée",
    //   description: "La nouvelle maquette a été créée avec succès.",
    // });

    setIsAddMaquetteOpen(false);
    setFormData({});
    setSelectedFiliereForActions(null);
  };

  const handleAddSequence = () => {
    if (!selectedFiliereForActions || !selectedMaquetteForActions) return;

    const newSequence: Sequence = {
      id: Date.now().toString(),
      nom: formData.nom || "",
      description: formData.description || "",
      duree: formData.duree || 6,
      domaines: [],
      statut: "actif",
    };

    setFilieres((prev) =>
      prev.map((f) =>
        f.id === selectedFiliereForActions
          ? {
              ...f,
              maquettes: f.maquettes.map((m) =>
                m.id === selectedMaquetteForActions
                  ? { ...m, sequences: [...m.sequences, newSequence] }
                  : m,
              ),
            }
          : f,
      ),
    );

    // toast({
    //   title: "Séquence créée",
    //   description: "La nouvelle séquence a été créée avec succès.",
    // });

    setIsAddSequenceOpen(false);
    setFormData({});
    setSelectedFiliereForActions(null);
    setSelectedMaquetteForActions(null);
  };

  const handleAddDomaine = () => {
    if (
      !selectedFiliereForActions ||
      !selectedMaquetteForActions ||
      !selectedSequenceForActions
    )
      return;

    const newDomaine: Domaine = {
      id: Date.now().toString(),
      nom: formData.nom || "",
      description: formData.description || "",
      ues: [],
      statut: "actif",
    };

    setFilieres((prev) =>
      prev.map((f) =>
        f.id === selectedFiliereForActions
          ? {
              ...f,
              maquettes: f.maquettes.map((m) =>
                m.id === selectedMaquetteForActions
                  ? {
                      ...m,
                      sequences: m.sequences.map((s) =>
                        s.id === selectedSequenceForActions
                          ? { ...s, domaines: [...s.domaines, newDomaine] }
                          : s,
                      ),
                    }
                  : m,
              ),
            }
          : f,
      ),
    );

    // toast({
    //   title: "Domaine créé",
    //   description: "Le nouveau domaine a été créé avec succès.",
    // });

    setIsAddDomaineOpen(false);
    setFormData({});
    setSelectedFiliereForActions(null);
    setSelectedMaquetteForActions(null);
    setSelectedSequenceForActions(null);
  };

  const handleAddUE = () => {
    if (
      !selectedFiliereForActions ||
      !selectedMaquetteForActions ||
      !selectedSequenceForActions ||
      !selectedDomaineForActions
    )
      return;

    const newUE: UE = {
      id: Date.now().toString(),
      code: formData.code || "",
      nom: formData.nom || "",
      description: formData.description || "",
      credits: formData.credits || 0,
      modules: [],
      statut: "actif",
    };

    setFilieres((prev) =>
      prev.map((f) =>
        f.id === selectedFiliereForActions
          ? {
              ...f,
              maquettes: f.maquettes.map((m) =>
                m.id === selectedMaquetteForActions
                  ? {
                      ...m,
                      sequences: m.sequences.map((s) =>
                        s.id === selectedSequenceForActions
                          ? {
                              ...s,
                              domaines: s.domaines.map((d) =>
                                d.id === selectedDomaineForActions
                                  ? { ...d, ues: [...d.ues, newUE] }
                                  : d,
                              ),
                            }
                          : s,
                      ),
                    }
                  : m,
              ),
            }
          : f,
      ),
    );

    // toast({
    //   title: "UE créée",
    //   description: "La nouvelle UE a été créée avec succès.",
    // });

    setIsAddUEOpen(false);
    setFormData({});
    setSelectedFiliereForActions(null);
    setSelectedMaquetteForActions(null);
    setSelectedSequenceForActions(null);
    setSelectedDomaineForActions(null);
  };

  const handleAddModule = () => {
    if (
      !selectedFiliereForActions ||
      !selectedMaquetteForActions ||
      !selectedSequenceForActions ||
      !selectedDomaineForActions ||
      !selectedUEForEdit
    )
      return;

    const newModule: Module = {
      id: Date.now().toString(),
      code: formData.code || "",
      nom: formData.nom || "",
      description: formData.description || "",
      credits: formData.credits || 0,
      heures: formData.heures || 0,
      enseignant: formData.enseignant || "",
      statut: "actif",
      semestre: formData.semestre || 1,
      evaluation: formData.evaluation || "",
      prerequis: formData.prerequis || [],
    };

    setFilieres((prev) =>
      prev.map((f) =>
        f.id === selectedFiliereForActions
          ? {
              ...f,
              maquettes: f.maquettes.map((m) =>
                m.id === selectedMaquetteForActions
                  ? {
                      ...m,
                      sequences: m.sequences.map((s) =>
                        s.id === selectedSequenceForActions
                          ? {
                              ...s,
                              domaines: s.domaines.map((d) =>
                                d.id === selectedDomaineForActions
                                  ? {
                                      ...d,
                                      ues: d.ues.map((ue) =>
                                        ue.id === selectedUEForEdit?.id
                                          ? {
                                              ...ue,
                                              modules: [
                                                ...ue.modules,
                                                newModule,
                                              ],
                                            }
                                          : ue,
                                      ),
                                    }
                                  : d,
                              ),
                            }
                          : s,
                      ),
                    }
                  : m,
              ),
            }
          : f,
      ),
    );

    // toast({
    //   title: "Module créé",
    //   description: "Le nouveau module a été créé avec succès.",
    // });

    setIsAddModuleOpen(false);
    setFormData({});
    setSelectedFiliereForActions(null);
    setSelectedMaquetteForActions(null);
    setSelectedSequenceForActions(null);
    setSelectedDomaineForActions(null);
    setSelectedUEForEdit(null);
  };

  const handleChangeStatus = (type: string, id: string, newStatus: string) => {
    if (type === "filiere") {
      setFilieres((filieres) =>
        filieres.map((f) =>
          f.id === id ? { ...f, statut: newStatus as any } : f,
        ),
      );
    }
    // toast({
    //   title: "Statut modifié",
    //   description: `Le statut a été changé en "${statutLabels[newStatus as keyof typeof statutLabels].label}".`,
    // });
  };

  const calculateTotalCredits = (maquette: Maquette): number => {
    return maquette.sequences.reduce(
      (total, sequence) =>
        total +
        sequence.domaines.reduce(
          (seqTotal, domaine) =>
            seqTotal +
            domaine.ues.reduce((domTotal, ue) => domTotal + ue.credits, 0),
          0,
        ),
      0,
    );
  };

  const filteredFilieres = filieres.filter((filiere) => {
    const matchesSearch =
      filiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filiere.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatut =
      filterStatut === "all" || filiere.statut === filterStatut;

    return matchesSearch && matchesStatut;
  });

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
            <Button onClick={() => setIsCreateFiliereOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle filière
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Filières actives
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filieres.filter((f) => f.statut === "actif").length}
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
                {filieres.reduce(
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
                {filieres.reduce(
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
                {filieres.reduce((total, f) => total + f.capaciteAccueil, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Étudiants maximum</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="filieres" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="filieres">
              Filières ({filieres.length})
            </TabsTrigger>
            <TabsTrigger value="maquettes">Maquettes pédagogiques</TabsTrigger>
            <TabsTrigger value="modules">Modules d'enseignement</TabsTrigger>
            <TabsTrigger value="calendrier">Calendrier académique</TabsTrigger>
          </TabsList>

          {/* Filieres Tab */}
          

          {/* Maquettes Tab */}
          <TabsContent value="maquettes" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Maquettes de formation</h3>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setSelectedFiliereForActions("1"); // Default to first filiere for demo
                  setIsAddMaquetteOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une maquette
              </Button>
            </div>

            <div className="space-y-4">
              {/* Licence 3 Informatique */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-blue-900">
                        Licence 3 Informatique (INFO-L3)
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>Filière: Informatique</span>
                        <span>|</span>
                        <span>Année académique: 2023-2024</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600"
                        onClick={() => {
                          setSelectedFiliereForActions("1");
                          setSelectedMaquetteForActions("1");
                          setIsAddSequenceOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une séquence
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Set edit data for maquette
                          setSelectedMaquetteForEdit({
                            id: "1",
                            nom: "Licence 3 Informatique (INFO-L3)",
                            version: "2023.1",
                            description:
                              "Maquette pour la licence 3 informatique",
                            dateCreation: "2023-06-01",
                            sequences: [],
                            statut: "actif",
                            totalCredits: 180,
                          });
                          setFormData({
                            nom: "Licence 3 Informatique (INFO-L3)",
                            version: "2023.1",
                            description:
                              "Maquette pour la licence 3 informatique",
                          });
                          setIsEditMaquetteOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMaquetteForEdit({
                            id: "1",
                            nom: "Licence 3 Informatique (INFO-L3)",
                            version: "2023.1",
                            description:
                              "Maquette pour la licence 3 informatique",
                            dateCreation: "2023-06-01",
                            sequences: [],
                            statut: "actif",
                            totalCredits: 180,
                          });
                          setDeleteMaquetteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Semestre 5 */}
                  <div className="space-y-4">
                    <Collapsible>
                      <div className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <CollapsibleTrigger
                          onClick={() => toggleExpanded("semestre-5")}
                          className="flex items-center space-x-2 flex-1"
                        >
                          {expandedItems.has("semestre-5") ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">
                            Semestre 5 (2023-09-01 - 2024-01-31)
                          </span>
                        </CollapsibleTrigger>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-600"
                            onClick={() => {
                              setSelectedFiliereForActions("1");
                              setSelectedMaquetteForActions("1");
                              setSelectedSequenceForActions("semestre-5");
                              setIsAddDomaineOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter un domaine
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSequenceForEdit({
                                id: "semestre-5",
                                nom: "Semestre 5",
                                description:
                                  "Semestre 5 de la licence 3 informatique",
                                duree: 6,
                                domaines: [],
                                statut: "actif",
                              });
                              setFormData({
                                nom: "Semestre 5",
                                description:
                                  "Semestre 5 de la licence 3 informatique",
                                duree: 6,
                              });
                              setIsEditSequenceOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSequenceForEdit({
                                id: "semestre-5",
                                nom: "Semestre 5",
                                description:
                                  "Semestre 5 de la licence 3 informatique",
                                duree: 6,
                                domaines: [],
                                statut: "actif",
                              });
                              setDeleteSequenceDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CollapsibleContent className="mt-4 ml-6">
                        {/* Programmation Domain */}
                        <div className="space-y-4">
                          <Collapsible>
                            <div className="flex items-center justify-between w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
                              <CollapsibleTrigger
                                onClick={() => toggleExpanded("programmation")}
                                className="flex items-center space-x-2 flex-1"
                              >
                                {expandedItems.has("programmation") ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <Target className="h-4 w-4 text-orange-600" />
                                <span className="font-medium">
                                  Programmation
                                </span>
                              </CollapsibleTrigger>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 border-blue-600"
                                  onClick={() => {
                                    setSelectedFiliereForActions("1");
                                    setSelectedMaquetteForActions("1");
                                    setSelectedSequenceForActions("semestre-5");
                                    setSelectedDomaineForActions(
                                      "programmation",
                                    );
                                    setIsAddUEOpen(true);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Ajouter un module
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDomaineForEdit({
                                      id: "programmation",
                                      nom: "Programmation",
                                      description: "Domaine de programmation",
                                      ues: [],
                                      statut: "actif",
                                    });
                                    setFormData({
                                      nom: "Programmation",
                                      description: "Domaine de programmation",
                                    });
                                    setIsEditDomaineOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDomaineForEdit({
                                      id: "programmation",
                                      nom: "Programmation",
                                      description: "Domaine de programmation",
                                      ues: [],
                                      statut: "actif",
                                    });
                                    setDeleteDomaineDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CollapsibleContent className="mt-4 ml-6">
                              {/* Programmation Java UE */}
                              <div className="space-y-4">
                                <Collapsible>
                                  <div className="flex items-center justify-between w-full p-2 border rounded-lg hover:bg-gray-50">
                                    <CollapsibleTrigger
                                      onClick={() =>
                                        toggleExpanded("prog-java")
                                      }
                                      className="flex items-center space-x-2 flex-1"
                                    >
                                      {expandedItems.has("prog-java") ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      <BookOpen className="h-4 w-4 text-blue-600" />
                                      <span className="font-medium">
                                        Programmation Java (PROG-JAVA) -
                                        Coefficient: 3
                                      </span>
                                    </CollapsibleTrigger>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 border-blue-600"
                                        onClick={() => {
                                          setSelectedFiliereForActions("1");
                                          setSelectedMaquetteForActions("1");
                                          setSelectedSequenceForActions(
                                            "semestre-5",
                                          );
                                          setSelectedDomaineForActions(
                                            "programmation",
                                          );
                                          setSelectedUEForEdit({
                                            id: "prog-java",
                                            code: "PROG-JAVA",
                                            nom: "Programmation Java",
                                            description:
                                              "Programmation orientée objet en Java",
                                            credits: 3,
                                            modules: [],
                                            statut: "actif",
                                          });
                                          setIsAddModuleOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Ajouter une UE
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUEForEdit({
                                            id: "prog-java",
                                            code: "PROG-JAVA",
                                            nom: "Programmation Java",
                                            description:
                                              "Programmation orientée objet en Java",
                                            credits: 3,
                                            modules: [],
                                            statut: "actif",
                                          });
                                          setFormData({
                                            code: "PROG-JAVA",
                                            nom: "Programmation Java",
                                            description:
                                              "Programmation orientée objet en Java",
                                            credits: 3,
                                          });
                                          setIsEditUEOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUEForEdit({
                                            id: "prog-java",
                                            code: "PROG-JAVA",
                                            nom: "Programmation Java",
                                            description:
                                              "Programmation orientée objet en Java",
                                            credits: 3,
                                            modules: [],
                                            statut: "actif",
                                          });
                                          setDeleteUEDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <CollapsibleContent className="mt-4">
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-gray-50">
                                          <TableHead className="font-semibold">
                                            CODE
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            NOM
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            TYPE
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            HEURES
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            ACTIONS
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell className="font-mono">
                                            JAVA-CM
                                          </TableCell>
                                          <TableCell>
                                            Cours Magistral Java
                                          </TableCell>
                                          <TableCell>CM</TableCell>
                                          <TableCell>20</TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-1">
                                              <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-mono">
                                            JAVA-TP
                                          </TableCell>
                                          <TableCell>
                                            Travaux Pratiques Java
                                          </TableCell>
                                          <TableCell>TP</TableCell>
                                          <TableCell>30</TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-1">
                                              <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </CollapsibleContent>
                                </Collapsible>

                                {/* Développement Web UE */}
                                <Collapsible>
                                  <div className="flex items-center justify-between w-full p-2 border rounded-lg hover:bg-gray-50">
                                    <CollapsibleTrigger
                                      onClick={() => toggleExpanded("prog-web")}
                                      className="flex items-center space-x-2 flex-1"
                                    >
                                      {expandedItems.has("prog-web") ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      <BookOpen className="h-4 w-4 text-blue-600" />
                                      <span className="font-medium">
                                        Développement Web (PROG-WEB) -
                                        Coefficient: 2
                                      </span>
                                    </CollapsibleTrigger>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 border-blue-600"
                                        onClick={() => {
                                          setSelectedFiliereForActions("1");
                                          setSelectedMaquetteForActions("1");
                                          setSelectedSequenceForActions(
                                            "semestre-5",
                                          );
                                          setSelectedDomaineForActions(
                                            "programmation",
                                          );
                                          setSelectedUEForEdit({
                                            id: "prog-web",
                                            code: "PROG-WEB",
                                            nom: "Développement Web",
                                            description:
                                              "Développement d'applications web",
                                            credits: 2,
                                            modules: [],
                                            statut: "actif",
                                          });
                                          setIsAddModuleOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Ajouter une UE
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUEForEdit({
                                            id: "prog-web",
                                            code: "PROG-WEB",
                                            nom: "Développement Web",
                                            description:
                                              "Développement d'applications web",
                                            credits: 2,
                                            modules: [],
                                            statut: "actif",
                                          });
                                          setFormData({
                                            code: "PROG-WEB",
                                            nom: "Développement Web",
                                            description:
                                              "Développement d'applications web",
                                            credits: 2,
                                          });
                                          setIsEditUEOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUEForEdit({
                                            id: "prog-web",
                                            code: "PROG-WEB",
                                            nom: "Développement Web",
                                            description:
                                              "Développement d'applications web",
                                            credits: 2,
                                            modules: [],
                                            statut: "actif",
                                          });
                                          setDeleteUEDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <CollapsibleContent className="mt-4">
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-gray-50">
                                          <TableHead className="font-semibold">
                                            CODE
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            NOM
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            TYPE
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            HEURES
                                          </TableHead>
                                          <TableHead className="font-semibold">
                                            ACTIONS
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell className="font-mono">
                                            WEB-CM
                                          </TableCell>
                                          <TableCell>
                                            Cours Magistral Web
                                          </TableCell>
                                          <TableCell>CM</TableCell>
                                          <TableCell>15</TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-1">
                                              <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-mono">
                                            WEB-TP
                                          </TableCell>
                                          <TableCell>
                                            Travaux Pratiques Web
                                          </TableCell>
                                          <TableCell>TP</TableCell>
                                          <TableCell>25</TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-1">
                                              <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Bases de données Domain */}
                          <Collapsible>
                            <div className="flex items-center justify-between w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
                              <CollapsibleTrigger
                                onClick={() => toggleExpanded("bases-donnees")}
                                className="flex items-center space-x-2 flex-1"
                              >
                                {expandedItems.has("bases-donnees") ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <Target className="h-4 w-4 text-orange-600" />
                                <span className="font-medium">
                                  Bases de données
                                </span>
                              </CollapsibleTrigger>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 border-blue-600"
                                  onClick={() => {
                                    setSelectedFiliereForActions("1");
                                    setSelectedMaquetteForActions("1");
                                    setSelectedSequenceForActions("semestre-5");
                                    setSelectedDomaineForActions(
                                      "bases-donnees",
                                    );
                                    setIsAddUEOpen(true);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Ajouter un module
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDomaineForEdit({
                                      id: "bases-donnees",
                                      nom: "Bases de données",
                                      description:
                                        "Gestion et conception de bases de données",
                                      ues: [],
                                      statut: "actif",
                                    });
                                    setFormData({
                                      nom: "Bases de données",
                                      description:
                                        "Gestion et conception de bases de données",
                                    });
                                    setIsEditDomaineOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDomaineForEdit({
                                      id: "bases-donnees",
                                      nom: "Bases de données",
                                      description:
                                        "Gestion et conception de bases de données",
                                      ues: [],
                                      statut: "actif",
                                    });
                                    setDeleteDomaineDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CollapsibleContent className="mt-4 ml-6">
                              <div className="text-center py-4 text-gray-500">
                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Aucun module défini</p>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Modules d'enseignement</CardTitle>
                <CardDescription>
                  Détail des unités d'enseignement et modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filieres.map((filiere) =>
                    filiere.maquettes.map((maquette) =>
                      maquette.sequences.map((sequence) =>
                        sequence.domaines.map((domaine) =>
                          domaine.ues.map((ue) => (
                            <div key={ue.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <BookOpen className="h-5 w-5 text-blue-600" />
                                  <span className="font-semibold">
                                    {ue.nom}
                                  </span>
                                  <Badge variant="outline">{ue.code}</Badge>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {ue.credits} crédits
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {filiere.nom} → {sequence.nom} → {domaine.nom}
                                </div>
                              </div>
                              <div className="grid gap-2">
                                {ue.modules.map((module) => (
                                  <div
                                    key={module.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-medium">
                                          {module.nom}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {module.code}
                                        </Badge>
                                        <Badge
                                          className={
                                            statutLabels[module.statut].color
                                          }
                                        >
                                          {statutLabels[module.statut].label}
                                        </Badge>
                                      </div>
                                      <div className="text-sm text-muted-foreground mb-2">
                                        {module.description}
                                      </div>
                                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                        <span>{module.credits} crédits</span>
                                        <span>{module.heures}h</span>
                                        <span>S{module.semestre}</span>
                                        <span>{module.enseignant}</span>
                                        <span>{module.evaluation}</span>
                                      </div>
                                      {module.prerequis &&
                                        module.prerequis.length > 0 && (
                                          <div className="mt-2">
                                            <span className="text-xs text-red-600">
                                              Prérequis:{" "}
                                              {module.prerequis.join(", ")}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedModule(module);
                                          setFormData(module);
                                          setIsModuleDialogOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )),
                        ),
                      ),
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendrier Tab */}
          <TabsContent value="calendrier" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier académique</CardTitle>
                <CardDescription>
                  Planning des périodes d'enseignement et d'évaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>
                    Fonctionnalité de calendrier académique en cours de
                    développement
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Configurer le calendrier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Filiere Dialog */}
        <Dialog
          open={isCreateFiliereOpen}
          onOpenChange={setIsCreateFiliereOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle filière</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom de la filière</Label>
                <Input
                  id="nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duree">Durée (années)</Label>
                <Input
                  id="duree"
                  type="number"
                  value={formData.duree || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duree: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacite">Capacité d'accueil</Label>
                <Input
                  id="capacite"
                  type="number"
                  value={formData.capaciteAccueil || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capaciteAccueil: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frais">Frais d'inscription (€)</Label>
                <Input
                  id="frais"
                  type="number"
                  value={formData.fraisInscription || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fraisInscription: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut || "actif"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, statut: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateFiliereOpen(false);
                  setFormData({});
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleCreateFiliere}>Créer la filière</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Filiere Dialog */}
        <Dialog
          open={isFiliereDialogOpen}
          onOpenChange={setIsFiliereDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la filière</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nom">Nom de la filière</Label>
                <Input
                  id="edit-nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duree">Durée (années)</Label>
                <Input
                  id="edit-duree"
                  type="number"
                  value={formData.duree || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duree: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacite">Capacité d'accueil</Label>
                <Input
                  id="edit-capacite"
                  type="number"
                  value={formData.capaciteAccueil || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capaciteAccueil: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-frais">Frais d'inscription (€)</Label>
                <Input
                  id="edit-frais"
                  type="number"
                  value={formData.fraisInscription || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fraisInscription: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsFiliereDialogOpen(false);
                  setSelectedFiliere(null);
                  setFormData({});
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (selectedFiliere) {
                    setFilieres((filieres) =>
                      filieres.map((f) =>
                        f.id === selectedFiliere.id ? { ...f, ...formData } : f,
                      ),
                    );
                    // toast({
                    //   title: "Filière modifiée",
                    //   description:
                    //     "Les informations ont été mises à jour avec succès.",
                    // });
                    setIsFiliereDialogOpen(false);
                    setSelectedFiliere(null);
                    setFormData({});
                  }
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Module Dialog */}
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le module</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="module-nom">Nom du module</Label>
                <Input
                  id="module-nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-code">Code du module</Label>
                <Input
                  id="module-code"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="module-description">Description</Label>
                <Textarea
                  id="module-description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-credits">Crédits</Label>
                <Input
                  id="module-credits"
                  type="number"
                  value={formData.credits || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-heures">Heures d'enseignement</Label>
                <Input
                  id="module-heures"
                  type="number"
                  value={formData.heures || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, heures: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-enseignant">
                  Enseignant responsable
                </Label>
                <Input
                  id="module-enseignant"
                  value={formData.enseignant || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, enseignant: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-semestre">Semestre</Label>
                <Select
                  value={formData.semestre?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, semestre: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semestre 1</SelectItem>
                    <SelectItem value="2">Semestre 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="module-evaluation">Mode d'évaluation</Label>
                <Input
                  id="module-evaluation"
                  value={formData.evaluation || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, evaluation: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModuleDialogOpen(false);
                  setSelectedModule(null);
                  setFormData({});
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  // toast({
                  //   title: "Module modifié",
                  //   description:
                  //     "Les informations du module ont été mises à jour.",
                  // });
                  setIsModuleDialogOpen(false);
                  setSelectedModule(null);
                  setFormData({});
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous s��r ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement la filière et toutes ses
                maquettes. Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setFiliereToDelete(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (filiereToDelete) {
                    handleDeleteFiliere(filiereToDelete);
                  }
                  setDeleteDialogOpen(false);
                  setFiliereToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add Maquette Dialog */}
        <Dialog open={isAddMaquetteOpen} onOpenChange={setIsAddMaquetteOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle maquette</DialogTitle>
              <DialogDescription>
                Créer une nouvelle maquette pédagogique pour la filière
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maquette-nom">Nom de la maquette</Label>
                <Input
                  id="maquette-nom"
                  placeholder="Ex: Licence 3 Informatique"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maquette-version">Version</Label>
                <Input
                  id="maquette-version"
                  placeholder="Ex: 2023.1"
                  value={formData.version || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="maquette-description">Description</Label>
                <Textarea
                  id="maquette-description"
                  placeholder="Description de la maquette..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddMaquetteOpen(false);
                  setFormData({});
                  setSelectedFiliereForActions(null);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleAddMaquette}>Créer la maquette</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Sequence Dialog */}
        <Dialog open={isAddSequenceOpen} onOpenChange={setIsAddSequenceOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle séquence</DialogTitle>
              <DialogDescription>
                Créer une nouvelle séquence pour la maquette
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sequence-nom">Nom de la séquence</Label>
                <Input
                  id="sequence-nom"
                  placeholder="Ex: Semestre 6"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sequence-duree">Durée (mois)</Label>
                <Input
                  id="sequence-duree"
                  type="number"
                  placeholder="6"
                  value={formData.duree || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duree: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="sequence-description">Description</Label>
                <Textarea
                  id="sequence-description"
                  placeholder="Description de la séquence..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddSequenceOpen(false);
                  setFormData({});
                  setSelectedFiliereForActions(null);
                  setSelectedMaquetteForActions(null);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleAddSequence}>Créer la séquence</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Domaine Dialog */}
        <Dialog open={isAddDomaineOpen} onOpenChange={setIsAddDomaineOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau domaine</DialogTitle>
              <DialogDescription>
                Créer un nouveau domaine d'enseignement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domaine-nom">Nom du domaine</Label>
                <Input
                  id="domaine-nom"
                  placeholder="Ex: Algorithmique et Structures de données"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domaine-description">Description</Label>
                <Textarea
                  id="domaine-description"
                  placeholder="Description du domaine..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDomaineOpen(false);
                  setFormData({});
                  setSelectedFiliereForActions(null);
                  setSelectedMaquetteForActions(null);
                  setSelectedSequenceForActions(null);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleAddDomaine}>Créer le domaine</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add UE Dialog */}
        <Dialog open={isAddUEOpen} onOpenChange={setIsAddUEOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle UE</DialogTitle>
              <DialogDescription>
                Créer une nouvelle unité d'enseignement
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ue-code">Code UE</Label>
                <Input
                  id="ue-code"
                  placeholder="Ex: UE-ALGO-001"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ue-credits">Crédits</Label>
                <Input
                  id="ue-credits"
                  type="number"
                  placeholder="6"
                  value={formData.credits || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="ue-nom">Nom de l'UE</Label>
                <Input
                  id="ue-nom"
                  placeholder="Ex: Algorithmique avancée"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="ue-description">Description</Label>
                <Textarea
                  id="ue-description"
                  placeholder="Description de l'UE..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddUEOpen(false);
                  setFormData({});
                  setSelectedFiliereForActions(null);
                  setSelectedMaquetteForActions(null);
                  setSelectedSequenceForActions(null);
                  setSelectedDomaineForActions(null);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleAddUE}>Créer l'UE</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Module Dialog */}
        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau module</DialogTitle>
              <DialogDescription>
                Créer un nouveau module d'enseignement
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="module-code">Code module</Label>
                <Input
                  id="module-code"
                  placeholder="Ex: ALGO-CM"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-nom">Nom du module</Label>
                <Input
                  id="module-nom"
                  placeholder="Ex: Cours Magistral Algorithmique"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-credits">Crédits</Label>
                <Input
                  id="module-credits"
                  type="number"
                  placeholder="3"
                  value={formData.credits || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-heures">Heures</Label>
                <Input
                  id="module-heures"
                  type="number"
                  placeholder="30"
                  value={formData.heures || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, heures: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-enseignant">Enseignant</Label>
                <Input
                  id="module-enseignant"
                  placeholder="Ex: Dr. Martin"
                  value={formData.enseignant || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, enseignant: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-semestre">Semestre</Label>
                <Select
                  value={formData.semestre?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, semestre: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semestre 1</SelectItem>
                    <SelectItem value="2">Semestre 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="module-description">Description</Label>
                <Textarea
                  id="module-description"
                  placeholder="Description du module..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="module-evaluation">Mode d'évaluation</Label>
                <Input
                  id="module-evaluation"
                  placeholder="Ex: Examen écrit + TP"
                  value={formData.evaluation || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, evaluation: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModuleOpen(false);
                  setFormData({});
                  setSelectedFiliereForActions(null);
                  setSelectedMaquetteForActions(null);
                  setSelectedSequenceForActions(null);
                  setSelectedDomaineForActions(null);
                  setSelectedUEForEdit(null);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleAddModule}>Créer le module</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Maquette Dialog */}
        <Dialog open={isEditMaquetteOpen} onOpenChange={setIsEditMaquetteOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la maquette</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-maquette-nom">Nom de la maquette</Label>
                <Input
                  id="edit-maquette-nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maquette-version">Version</Label>
                <Input
                  id="edit-maquette-version"
                  value={formData.version || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-maquette-description">Description</Label>
                <Textarea
                  id="edit-maquette-description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditMaquetteOpen(false);
                  setFormData({});
                  setSelectedMaquetteForEdit(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  // toast({
                  //   title: "Maquette modifiée",
                  //   description: "La maquette a été mise à jour avec succès.",
                  // });
                  setIsEditMaquetteOpen(false);
                  setFormData({});
                  setSelectedMaquetteForEdit(null);
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Sequence Dialog */}
        <Dialog open={isEditSequenceOpen} onOpenChange={setIsEditSequenceOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la séquence</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sequence-nom">Nom de la séquence</Label>
                <Input
                  id="edit-sequence-nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sequence-duree">Durée (mois)</Label>
                <Input
                  id="edit-sequence-duree"
                  type="number"
                  value={formData.duree || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duree: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-sequence-description">Description</Label>
                <Textarea
                  id="edit-sequence-description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditSequenceOpen(false);
                  setFormData({});
                  setSelectedSequenceForEdit(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  // toast({
                  //   title: "Séquence modifiée",
                  //   description: "La séquence a été mise à jour avec succès.",
                  // });
                  setIsEditSequenceOpen(false);
                  setFormData({});
                  setSelectedSequenceForEdit(null);
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Domaine Dialog */}
        <Dialog open={isEditDomaineOpen} onOpenChange={setIsEditDomaineOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le domaine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-domaine-nom">Nom du domaine</Label>
                <Input
                  id="edit-domaine-nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-domaine-description">Description</Label>
                <Textarea
                  id="edit-domaine-description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDomaineOpen(false);
                  setFormData({});
                  setSelectedDomaineForEdit(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  // toast({
                  //   title: "Domaine modifié",
                  //   description: "Le domaine a été mis à jour avec succès.",
                  // });
                  setIsEditDomaineOpen(false);
                  setFormData({});
                  setSelectedDomaineForEdit(null);
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit UE Dialog */}
        <Dialog open={isEditUEOpen} onOpenChange={setIsEditUEOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier l'UE</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ue-code">Code UE</Label>
                <Input
                  id="edit-ue-code"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ue-credits">Crédits</Label>
                <Input
                  id="edit-ue-credits"
                  type="number"
                  value={formData.credits || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-ue-nom">Nom de l'UE</Label>
                <Input
                  id="edit-ue-nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-ue-description">Description</Label>
                <Textarea
                  id="edit-ue-description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditUEOpen(false);
                  setFormData({});
                  setSelectedUEForEdit(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  // toast({
                  //   title: "UE modifiée",
                  //   description: "L'UE a été mise à jour avec succès.",
                  // });
                  setIsEditUEOpen(false);
                  setFormData({});
                  setSelectedUEForEdit(null);
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Maquette Dialog */}
        <AlertDialog
          open={deleteMaquetteDialogOpen}
          onOpenChange={setDeleteMaquetteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la maquette</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette maquette ? Cette action
                est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteMaquetteDialogOpen(false);
                  setSelectedMaquetteForEdit(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // toast({
                  //   title: "Maquette supprimée",
                  //   description: "La maquette a été supprimée avec succès.",
                  //   variant: "destructive",
                  // });
                  setDeleteMaquetteDialogOpen(false);
                  setSelectedMaquetteForEdit(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Sequence Dialog */}
        <AlertDialog
          open={deleteSequenceDialogOpen}
          onOpenChange={setDeleteSequenceDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la séquence</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette séquence ? Cette action
                est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteSequenceDialogOpen(false);
                  setSelectedSequenceForEdit(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // toast({
                  //   title: "Séquence supprimée",
                  //   description: "La séquence a été supprimée avec succès.",
                  //   variant: "destructive",
                  // });
                  setDeleteSequenceDialogOpen(false);
                  setSelectedSequenceForEdit(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Domaine Dialog */}
        <AlertDialog
          open={deleteDomaineDialogOpen}
          onOpenChange={setDeleteDomaineDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le domaine</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce domaine ? Cette action est
                irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDomaineDialogOpen(false);
                  setSelectedDomaineForEdit(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // toast({
                  //   title: "Domaine supprimé",
                  //   description: "Le domaine a été supprimé avec succès.",
                  //   variant: "destructive",
                  // });
                  setDeleteDomaineDialogOpen(false);
                  setSelectedDomaineForEdit(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete UE Dialog */}
        <AlertDialog
          open={deleteUEDialogOpen}
          onOpenChange={setDeleteUEDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer l'UE</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette UE ? Cette action est
                irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteUEDialogOpen(false);
                  setSelectedUEForEdit(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // toast({
                  //   title: "UE supprim��e",
                  //   description: "L'UE a été supprimée avec succès.",
                  //   variant: "destructive",
                  // });
                  setDeleteUEDialogOpen(false);
                  setSelectedUEForEdit(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}
