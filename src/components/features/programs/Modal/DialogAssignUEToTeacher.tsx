"use client";

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  User, 
  BookOpen,
  Award,
  X,
  Check
} from 'lucide-react';
import { IGetUEPerModule } from '@/types/programTypes';
import { Teacher } from '@/types/teacherTypes';
import { getStatusColor } from '@/lib/utils';




interface DialogAssignUEToTeacherProps {
  ue: IGetUEPerModule;
  teacherList: Teacher[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignTeacher: (ueCode: string, teacherCode: string) => Promise<void>;
}


const TeacherCard: React.FC<{
  teacher: Teacher;
  isSelected: boolean;
  onClick: () => void;
}> = ({ teacher, isSelected, onClick }) => {

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PERMANENT": return "bg-purple-100 text-purple-800";
      case "TEMPORARY": return "bg-orange-100 text-orange-800";
      case "CONTRACT": return "bg-cyan-100 text-cyan-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-medium text-gray-900">
              {teacher.first_name} {teacher.last_name}
            </h3>
            {isSelected && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="font-mono">{teacher.teacher_number}</span>
              <span>•</span>
              <span>{teacher.email}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Award className="w-3 h-3" />
              <span className="truncate">{teacher.specialty}</span>
            </div>
            
            {teacher.qualifications && (
              <div className="text-xs text-gray-500 truncate">
                {teacher.qualifications}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge className={`text-xs ${getStatusColor(teacher.employment_status_code)}`}>
              {teacher.employment_status_code}
            </Badge>
            <Badge className={`text-xs ${getTypeColor(teacher.type_code)}`}>
              {teacher.type_code}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DialogAssignUEToTeacher: React.FC<DialogAssignUEToTeacherProps> = ({
  ue,
  teacherList,
  onAssignTeacher,
  onOpenChange,
  open
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const filteredTeachers = useMemo(() => {
    return teacherList.filter(teacher => {
      const searchMatch = searchTerm === '' || 
        teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacher_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === 'ALL' || teacher.status_code === statusFilter;
      
      const typeMatch = typeFilter === 'ALL' || teacher.type_code === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });
  }, [teacherList, searchTerm, statusFilter, typeFilter]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (newOpen) {
      setSelectedTeacher(ue.teacher_user_code || '');
      setIsCoordinator(!!ue.is_module_coordinator);
      setSearchTerm('');
      setStatusFilter('ALL');
      setTypeFilter('ALL');
    }
  };

  const handleAssign = async () => {
    if (!selectedTeacher) {
      // toast({
      //   title: "Erreur",
      //   description: "Veuillez sélectionner un enseignant",
      //   variant: "destructive",
      // });
      return;
    }

    setIsLoading(true);
    try {
      await onAssignTeacher(ue.course_unit_code, selectedTeacher);
      
      // toast({
      //   title: "Succès",
      //   description: "Enseignant affecté avec succès à l'UE",
      // });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning teacher:', error);
      // toast({
      //   title: "Erreur",
      //   description: "Impossible d'affecter l'enseignant",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  // Enseignant actuellement affecté
  const currentTeacher = ue.teacher_user_code 
    ? teacherList.find(t => t.user_code === ue.teacher_user_code)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      
      <DialogContent className=" md:min-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Affecter un enseignant à l&apos;UE</span>
          </DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Enseignant actuel */}
          {currentTeacher && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Enseignant actuel: {currentTeacher.first_name} {currentTeacher.last_name}
                  </span>
                  {ue.is_module_coordinator === 1 && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Coordinateur
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filtres et recherche */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className='mb-1'>Recherche</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom, email, spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter" className='mb-1'>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type-filter" className='mb-1'>Type de contrat</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  <SelectItem value="ALL">Tous les types</SelectItem>
                  <SelectItem value="PERMANENT">Permanent</SelectItem>
                  <SelectItem value="TEMPORARY">Temporaire</SelectItem>
                  <SelectItem value="CONTRACT">Contractuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="coordinator"
              checked={isCoordinator}
              onCheckedChange={(checked) => setIsCoordinator(!!checked)}
            />
            <Label htmlFor="coordinator" className="text-sm">
              Désigner comme coordinateur du module
            </Label>
          </div>

          {/* Liste des enseignants */}
          <div className="border rounded-lg">
            <div className="p-3 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {filteredTeachers.length} enseignant(s) trouvé(s)
                </span>
                {selectedTeacher && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTeacher('')}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Désélectionner
                  </Button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-3 space-y-3">
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Aucun enseignant trouvé</p>
                  <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.user_code}
                    teacher={teacher}
                    isSelected={selectedTeacher === teacher.user_code}
                    onClick={() => setSelectedTeacher(teacher.user_code)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter className='py-2'>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedTeacher || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Affectation...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Affecter l&apos;enseignant
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

