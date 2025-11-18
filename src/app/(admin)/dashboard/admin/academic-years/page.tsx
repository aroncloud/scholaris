'use client'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Shield,
  Monitor,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Lock,
} from "lucide-react";

const systemStats = [
  {
    title: "Utilisation serveur",
    value: "68%",
    status: "normal",
    description: "CPU et mémoire",
  },
  {
    title: "Base de données",
    value: "2.4 GB",
    status: "normal",
    description: "Espace utilisé",
  },
  {
    title: "Utilisateurs connectés",
    value: "247",
    status: "normal",
    description: "Sessions actives",
  },
  {
    title: "Temps de réponse",
    value: "89ms",
    status: "excellent",
    description: "Moyenne 24h",
  },
];

const systemConfig = [
  {
    id: 1,
    category: "Général",
    setting: "Nom de l'établissement",
    value: "Université de Sciences de la Santé",
    type: "text",
    editable: true,
  },
  {
    id: 2,
    category: "Général",
    setting: "Année académique courante",
    value: "2023-2024",
    type: "select",
    editable: true,
  },
  {
    id: 3,
    category: "Sécurité",
    setting: "Durée session (minutes)",
    value: "120",
    type: "number",
    editable: true,
  },
  {
    id: 4,
    category: "Sécurité",
    setting: "Authentification 2FA",
    value: "Activé",
    type: "toggle",
    editable: true,
  },
  {
    id: 5,
    category: "Email",
    setting: "Serveur SMTP",
    value: "smtp.univ.fr",
    type: "text",
    editable: true,
  },
  {
    id: 6,
    category: "Email",
    setting: "Notifications automatiques",
    value: "Activé",
    type: "toggle",
    editable: true,
  },
];

const backupHistory = [
  {
    id: 1,
    date: "2024-01-20 02:00",
    type: "Complète",
    taille: "124 MB",
    statut: "Succès",
    duree: "12 min",
  },
  {
    id: 2,
    date: "2024-01-19 02:00",
    type: "Incrémentale",
    taille: "23 MB",
    statut: "Succès",
    duree: "3 min",
  },
  {
    id: 3,
    date: "2024-01-18 02:00",
    type: "Incrémentale",
    taille: "31 MB",
    statut: "Erreur",
    duree: "5 min",
    erreur: "Espace insuffisant",
  },
];

const auditLogs = [
  {
    id: 1,
    date: "2024-01-20 14:30",
    utilisateur: "admin@univ.fr",
    action: "Modification configuration",
    ressource: "Paramètres système",
    ip: "192.168.1.10",
    statut: "Succès",
  },
  {
    id: 2,
    date: "2024-01-20 10:15",
    utilisateur: "marie.dupont@rh.univ.fr",
    action: "Création utilisateur",
    ressource: "Profil enseignant",
    ip: "192.168.1.25",
    statut: "Succès",
  },
  {
    id: 3,
    date: "2024-01-20 09:45",
    utilisateur: "inconnu",
    action: "Tentative connexion",
    ressource: "Interface admin",
    ip: "203.45.67.89",
    statut: "Échec",
  },
];

const permissions = [
  {
    id: 1,
    module: "Gestion des utilisateurs",
    administrateur: true,
    rh: true,
    scolarite: false,
    enseignant: false,
    etudiant: false,
  },
  {
    id: 2,
    module: "Programmes académiques",
    administrateur: true,
    rh: false,
    scolarite: true,
    enseignant: false,
    etudiant: false,
  },
  {
    id: 3,
    module: "Gestion des notes",
    administrateur: true,
    rh: false,
    scolarite: true,
    enseignant: true,
    etudiant: false,
  },
  {
    id: 4,
    module: "Consultation dossier",
    administrateur: true,
    rh: true,
    scolarite: true,
    enseignant: false,
    etudiant: true,
  },
];

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "Succès":
      case "normal":
      case "Activé":
        return "bg-green-100 text-green-800";
      case "Erreur":
      case "Échec":
        return "bg-red-100 text-red-800";
      case "excellent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "Succès":
      case "normal":
      case "excellent":
        return <CheckCircle className="h-4 w-4" />;
      case "Erreur":
      case "Échec":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Administration
            </h2>
            <p className="text-muted-foreground">
              Configuration système et paramètres administratifs
            </p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter logs
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {getStatusIcon(stat.status)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="backup">Sauvegardes</TabsTrigger>
            <TabsTrigger value="logs">Logs d'audit</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Activité système</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connexions aujourd'hui</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documents créés</span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications envoyées</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Erreurs système</span>
                      <span className="font-bold text-red-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5" />
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU</span>
                        <span>68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mémoire</span>
                        <span>72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Disque</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration système</CardTitle>
                <CardDescription>
                  Paramètres généraux de l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemConfig.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{config.setting}</div>
                        <div className="text-sm text-muted-foreground">
                          {config.category}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">
                          {config.value}
                        </div>
                        {config.editable && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Matrice des permissions</CardTitle>
                <CardDescription>
                  Gestion des accès par rôle et module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Administrateur</TableHead>
                      <TableHead>RH</TableHead>
                      <TableHead>Scolarité</TableHead>
                      <TableHead>Enseignant</TableHead>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell className="font-medium">
                          {perm.module}
                        </TableCell>
                        <TableCell>
                          {perm.administrateur ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          {perm.rh ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          {perm.scolarite ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          {perm.enseignant ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          {perm.etudiant ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Sauvegardes</h3>
                <p className="text-sm text-muted-foreground">
                  Gestion des sauvegardes système
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle sauvegarde
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historique des sauvegardes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupHistory.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{backup.date}</TableCell>
                        <TableCell>{backup.type}</TableCell>
                        <TableCell>{backup.taille}</TableCell>
                        <TableCell>{backup.duree}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant="secondary"
                              className={getStatusColor(backup.statut)}
                            >
                              {backup.statut}
                            </Badge>
                            {backup.erreur && (
                              <div className="text-xs text-red-600">
                                {backup.erreur}
                              </div>
                            )}
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
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Restaurer
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Logs d'audit</span>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans les logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>
                  Traçabilité des actions administratives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Ressource</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {log.date}
                        </TableCell>
                        <TableCell>{log.utilisateur}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.ressource}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ip}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(log.statut)}
                          >
                            {log.statut}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Paramètres de sécurité</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Authentification 2FA</div>
                        <div className="text-sm text-muted-foreground">
                          Obligatoire pour les admins
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Verrouillage auto</div>
                        <div className="text-sm text-muted-foreground">
                          Après 3 tentatives
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Logs d'audit</div>
                        <div className="text-sm text-muted-foreground">
                          Enregistrement complet
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Alertes sécurité</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-red-800">
                          Tentatives de connexion suspectes
                        </div>
                        <div className="text-sm text-red-600">
                          3 tentatives depuis 203.45.67.89
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Lock className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <div className="font-medium text-yellow-800">
                          Certificat SSL expire bientôt
                        </div>
                        <div className="text-sm text-yellow-600">
                          Expiration dans 15 jours
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
