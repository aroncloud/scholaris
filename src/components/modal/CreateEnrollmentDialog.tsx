'use client'

import React, { useState, useEffect } from 'react';
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
import { IInitiateStudentApplication } from "@/types/userTypes";
import { ICurriculum } from "@/types/programTypes";
import { toast } from "sonner";
import { initiateStudentApplication } from "@/actions/studentAction";
import { getCurriculumList } from "@/actions/programsAction";

interface CreateEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateEnrollmentDialog: React.FC<CreateEnrollmentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<IInitiateStudentApplication>({
    curriculum_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    student_number: '',
    gender: 'MALE',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [curriculums, setCurriculums] = useState<ICurriculum[]>([]);
  const [loadingCurriculums, setLoadingCurriculums] = useState(true);

  useEffect(() => {
    const loadCurriculums = async () => {
      try {
        const result = await getCurriculumList();
        if (result.code === 'success') {
          setCurriculums(result.data.body);
        } else {
          toast.error("Erreur lors du chargement des curriculums");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des curriculums");
      } finally {
        setLoadingCurriculums(false);
      }
    };

    if (open) {
      loadCurriculums();
    }
  }, [open]);

  const handleInputChange = (field: keyof IInitiateStudentApplication, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation basique
    if (!formData.first_name || !formData.last_name || !formData.email || 
        !formData.phone_number || !formData.student_number || !formData.curriculum_code) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    try {
      const result = await initiateStudentApplication(formData);
      
      if (result.code === 'success') {
        toast.success("Demande d'inscription créée avec succès");
        onOpenChange(false);
        setFormData({
          curriculum_code: '',
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          student_number: '',
          gender: 'MALE',
        });
        onSuccess?.();
      } else {
        toast.error("Erreur lors de la création de la demande", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande d'inscription</DialogTitle>
          <DialogDescription>
            Créer une nouvelle demande d'inscription étudiant
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Nom de famille"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@exemple.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Téléphone *</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder="+237..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Genre *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_number">Numéro étudiant *</Label>
            <Input
              id="student_number"
              value={formData.student_number}
              onChange={(e) => handleInputChange('student_number', e.target.value)}
              placeholder="MA-2025-08-13-0008"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="curriculum_code">Curriculum *</Label>
            <Select
              value={formData.curriculum_code}
              onValueChange={(value) => handleInputChange('curriculum_code', value)}
              disabled={loadingCurriculums}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCurriculums ? "Chargement..." : "Sélectionner un curriculum"} />
              </SelectTrigger>
              <SelectContent>
                {curriculums.map((curriculum) => (
                  <SelectItem 
                    key={curriculum.curriculum_code} 
                    value={curriculum.curriculum_code}
                    className="whitespace-normal break-words"
                  >
                    <div className="flex flex-col w-full">
                      <span className="font-medium truncate">{curriculum.curriculum_name}</span>
                      <span className="text-sm text-muted-foreground">({curriculum.study_level})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Création..." : "Créer la demande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEnrollmentDialog;