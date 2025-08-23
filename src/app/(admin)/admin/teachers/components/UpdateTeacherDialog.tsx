import { useState, useEffect } from "react";
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
import { Teacher, UpdateTeacherRequest } from "../types";

interface UpdateTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  onSave: (teacherData: UpdateTeacherRequest) => void;
}

export function UpdateTeacherDialog({
  open,
  onOpenChange,
  teacher,
  onSave,
}: UpdateTeacherDialogProps) {
  const [formData, setFormData] = useState<Partial<UpdateTeacherRequest>>({});

 
  useEffect(() => {
    if (teacher) {
      console.log('Teacher data in UpdateDialog:', teacher); 
      setFormData({
        user_code: teacher.id,
        user_name: teacher.userName || "",
        password_plaintext: "",
        email: teacher.email,
        first_name: teacher.prenom,
        last_name: teacher.nom,
        gender: teacher.gender || "MALE", 
        phone_number: teacher.telephone || "",
        teacher_number: teacher.matricule,
        specialty: teacher.specialite,
        hiring_date: teacher.dateEmbauche,
        salary: teacher.salaire || 0,
        qualifications: teacher.qualification || "",
      });
    }
  }, [teacher]);

  const handleSave = () => {
    console.log('Update form data:', formData);
    
    const missingFields = [];
    if (!formData.user_code) missingFields.push('Code utilisateur');
    if (!formData.user_name) missingFields.push('Nom d\'utilisateur');
    if (!formData.password_plaintext) missingFields.push('Mot de passe');
    if (!formData.email) missingFields.push('Email');
    if (!formData.first_name) missingFields.push('Prénom');
    if (!formData.last_name) missingFields.push('Nom');
    if (!formData.gender) missingFields.push('Genre');
    if (!formData.phone_number) missingFields.push('Téléphone');
    if (!formData.teacher_number) missingFields.push('Numéro enseignant');
    if (!formData.specialty) missingFields.push('Spécialité');
    if (!formData.hiring_date) missingFields.push('Date d\'embauche');
    if (!formData.salary) missingFields.push('Salaire');

    if (missingFields.length > 0) {
      alert(`Veuillez remplir les champs obligatoires : ${missingFields.join(', ')}`);
      return;
    }

    onSave(formData as UpdateTeacherRequest);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'enseignant</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'enseignant
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="user_name">Nom d'utilisateur *</Label>
            <Input
              id="user_name"
              value={formData.user_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, user_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_plaintext">Mot de passe *</Label>
            <Input
              id="password_plaintext"
              type="password"
              value={formData.password_plaintext || ""}
              onChange={(e) =>
                setFormData({ ...formData, password_plaintext: e.target.value })
              }
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom *</Label>
            <Input
              id="first_name"
              value={formData.first_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom *</Label>
            <Input
              id="last_name"
              value={formData.last_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="phone_number">Téléphone *</Label>
            <Input
              id="phone_number"
              value={formData.phone_number || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Genre *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value as UpdateTeacherRequest["gender"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Masculin</SelectItem>
                <SelectItem value="FEMALE">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacher_number">Numéro enseignant *</Label>
            <Input
              id="teacher_number"
              value={formData.teacher_number || ""}
              onChange={(e) =>
                setFormData({ ...formData, teacher_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Spécialité *</Label>
            <Input
              id="specialty"
              value={formData.specialty || ""}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hiring_date">Date d'embauche *</Label>
            <Input
              id="hiring_date"
              type="date"
              value={formData.hiring_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, hiring_date: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salaire *</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salary: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualifications</Label>
            <Input
              id="qualifications"
              value={formData.qualifications || ""}
              onChange={(e) =>
                setFormData({ ...formData, qualifications: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Mettre à jour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}