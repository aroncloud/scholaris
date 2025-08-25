import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Teacher, CreateTeacherRequest, statutLabels, typeContratLabels } from "../types";

interface TeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: Teacher | null;
  isEditing: boolean;
  onSave: (teacher: Partial<Teacher> | CreateTeacherRequest) => void;
}


export function TeacherDialog({
  open,
  onOpenChange,
  teacher,
  isEditing,
  onSave,
}: TeacherDialogProps) {
  const [formData, setFormData] = useState<Partial<Teacher>>(teacher || {});
  const [createFormData, setCreateFormData] = useState<Partial<CreateTeacherRequest>>({});

  const handleSave = () => {
    if (teacher) {
      // Editing existing teacher
      onSave(formData);
    } else {
      // Creating new teacher
      onSave(createFormData);
    }
    setFormData({});
    setCreateFormData({});
  };

  const handleCancel = () => {
    setFormData(teacher || {});
    setCreateFormData({});
    onOpenChange(false);
  };

  if (!isEditing && teacher) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dossier de l&apos;enseignant</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Nom complet
                </Label>
                <p className="text-sm">
                  {teacher.prenom} {teacher.nom}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Matricule
                </Label>
                <p className="text-sm">{teacher.matricule}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="text-sm">{teacher.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Téléphone
                </Label>
                <p className="text-sm">{teacher.telephone || "Non renseigné"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Spécialité
                </Label>
                <p className="text-sm">{teacher.specialite}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Département
                </Label>
                <p className="text-sm">{teacher.departement}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Qualification
                </Label>
                <p className="text-sm">{teacher.qualification}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Type de contrat
                </Label>
                <Badge className={typeContratLabels[teacher.typeContrat].color}>
                  {typeContratLabels[teacher.typeContrat].label}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Date d&apos;embauche
                </Label>
                {/* <p className="text-sm">
                  {new Date(teacher.dateEmbauche).toLocaleDateString("fr-FR")}
                </p> */}
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Expérience
                </Label>
                <p className="text-sm">{teacher.experience} ans</p>
              </div>
              {teacher.salaire && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Salaire
                  </Label>
                  <p className="text-sm text-green-600">{teacher.salaire}€/mois</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Statut
                </Label>
                <Badge className={statutLabels[teacher.statut].color}>
                  {statutLabels[teacher.statut].label}
                </Badge>
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Matières enseignées
              </Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {teacher.matieres.map((matiere, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {matiere}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {teacher ? "Modifier l'enseignant" : "Créer un nouvel enseignant"}
          </DialogTitle>
          {!teacher && (
            <DialogDescription>
              Remplissez les informations de l&apos;enseignant
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              value={formData.prenom || ""}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={formData.nom || ""}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              value={formData.telephone || ""}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialite">Spécialité</Label>
            <Input
              id="specialite"
              value={formData.specialite || ""}
              onChange={(e) =>
                setFormData({ ...formData, specialite: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departement">Département</Label>
            <Select
              value={formData.departement}
              onValueChange={(value) =>
                setFormData({ ...formData, departement: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sciences Médicales">Sciences Médicales</SelectItem>
                <SelectItem value="Sciences Biologiques">Sciences Biologiques</SelectItem>
                <SelectItem value="Sciences Chimiques">Sciences Chimiques</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Select
              value={formData.qualification}
              onValueChange={(value) =>
                setFormData({ ...formData, qualification: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professeur">Professeur</SelectItem>
                <SelectItem value="Maître de Conférences">
                  Maître de Conférences
                </SelectItem>
                <SelectItem value="Docteur">Docteur</SelectItem>
                <SelectItem value="Assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="typeContrat">Type de contrat</Label>
            <Select
              value={formData.typeContrat}
              onValueChange={(value) =>
                 setFormData({ ...formData, typeContrat: value as Teacher["typeContrat"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CDI">CDI</SelectItem>
                <SelectItem value="CDD">CDD</SelectItem>
                <SelectItem value="Vacataire">Vacataire</SelectItem>
                <SelectItem value="Stage">Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {teacher && (
            <>
              <div className="space-y-2">
                <Label htmlFor="salaire">Salaire</Label>
                <Input
                  id="salaire"
                  type="number"
                  value={formData.salaire || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salaire: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heures">Heures d&apos;enseignement</Label>
                <Input
                  id="heures"
                  type="number"
                  value={formData.heuresEnseignement || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      heuresEnseignement: Number(e.target.value),
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            {teacher ? "Modifier" : "Créer l'enseignant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}