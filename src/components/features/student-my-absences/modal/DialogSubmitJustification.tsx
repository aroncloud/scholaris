'use client';

import React, { useState, useRef, ChangeEvent, ReactElement, useMemo, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUp, RefreshCw, X } from "lucide-react";
import { BaseAbsence, JustificationFormData, JustificationFile } from "@/types/studentmyabsencesTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showToast } from "@/components/ui/showToast";
import { v4 as uuidv4 } from 'uuid';
import { getAbsenceKey } from "@/utils/absenceKeys";

// Create a base interface that both Absence and UIAbsence can extend

// Update the Absence interface to extend BaseAbsence
interface Absence extends BaseAbsence {
  id: string | number;
  // Add any additional Absence-specific properties here
}

// Update the UIAbsence interface to extend BaseAbsence
interface UIAbsence extends BaseAbsence {
  id: number;
  // Add any additional UIAbsence-specific properties here
}

interface DialogSubmitJustificationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  absences: Absence[];
  selectedAbsences: string[];
  onAbsenceSelection?: (absenceId: string, isSelected: boolean) => void;
  onSubmit: (data: JustificationFormData) => void;
  isLoading?: boolean;
  singleAbsenceMode?: boolean;
}

const MAX_FILE_SIZE_MB = 5;
// const ACCEPTED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
const ACCEPTED_FILE_TYPES = ['.pdf'];

export function DialogSubmitJustification({
  isOpen,
  absences = [],
  selectedAbsences = [],
  onAbsenceSelection,
  onSubmit,
  isLoading = false,
  singleAbsenceMode = false,
  onOpenChange
}: DialogSubmitJustificationProps): ReactElement {
  const [formData, setFormData] = useState<JustificationFormData>({
    type: '',
    file: null,
    description: '',
    selectedAbsences: []
  });
  const [selectedAbsenceKey, setSelectedAbsenceKey] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize the processed absences to prevent unnecessary re-renders
  const displayAbsences = useMemo(() => {
    if (!Array.isArray(absences) || absences.length === 0) return [];
    
    return absences
      .filter(Boolean)
      .map(absence => ({
        ...absence,
        id: absence.absence_code || String(absence.id),
        _uniqueKey: absence.absence_code || getAbsenceKey(absence as any)
      }))
      .filter(a => !a.statut || a.statut === 'non_justifiee');
  }, [absences]);

  const initialFormData = useMemo<JustificationFormData>(() => ({
    type: '',
    file: null,
    description: '',
    selectedAbsences: Array.isArray(selectedAbsences) ? selectedAbsences.map(String) : []
  }), [selectedAbsences]);

  const handleRemoveFile = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open) {
      // Only reset form when closing the dialog
      setFormData({
        type: '',
        file: null,
        description: '',
        selectedAbsences: []
      });
      setSelectedAbsenceKey('');
      setErrors({});
    }
    
    onOpenChange(open);
  }, [onOpenChange]);

  // Handle initial form setup when dialog opens
  useEffect(() => {
    if (!isOpen) return;
    
    // Only reset form if there are no selected absences
    if (selectedAbsences.length === 0 && formData.selectedAbsences.length === 0) {
      setFormData(initialFormData);
      setErrors({});
    }
    
    if (displayAbsences.length === 0) {
      onOpenChange(false);
      return;
    }
    
    // Handle single absence mode
    if (singleAbsenceMode && displayAbsences.length > 0 && !selectedAbsenceKey) {
      const firstAbsence = displayAbsences[0];
      if (firstAbsence) {
        const firstAbsenceKey = firstAbsence.absence_code || String(firstAbsence.id);
        if (selectedAbsenceKey !== firstAbsenceKey) {
          setSelectedAbsenceKey(firstAbsenceKey);
          setFormData(prev => ({
            ...prev,
            selectedAbsences: [firstAbsenceKey]
          }));
        }
      }
    }
  }, [isOpen, displayAbsences.length, singleAbsenceMode, selectedAbsences, initialFormData, selectedAbsenceKey]);
  
  // Debug effect to log formData changes
  useEffect(() => {
    console.log('[FORM_DATA_CHANGED]', {
      type: formData.type,
      description: formData.description,
      file: formData.file ? formData.file.name : null,
      selectedAbsences: formData.selectedAbsences,
      selectedAbsenceKey
    });
  }, [formData, selectedAbsenceKey]);
  const handleSelectChange = useCallback((value: string) => {
    if (!value) {
      console.log('[SELECT] No value provided to handleSelectChange');
      return;
    }
    
    console.group('[SELECT] Absence selected in dropdown');
    console.log('Previous selectedAbsenceKey:', selectedAbsenceKey);
    console.log('New selected value:', value);
    console.log('Current formData before change:', JSON.parse(JSON.stringify(formData)));
    
    // Prevent unnecessary updates if the same value is selected
    if (selectedAbsenceKey === value) return;
    
    // Find the selected absence by _uniqueKey, absence_code, or id
    const selected = displayAbsences.find(a => {
      if (!a) return false;
      return a._uniqueKey === value || 
             a.absence_code === value || 
             String(a.id) === value;
    });
    
    if (selected) {
      // Use the _uniqueKey if available, otherwise fall back to absence_code or id
      const absenceKey = selected._uniqueKey || 
                        selected.absence_code || 
                        String(selected.id);
      
      setSelectedAbsenceKey(absenceKey);
      
      // Update the form data with the selected absence
      setFormData(prev => ({
        ...prev,
        selectedAbsences: [absenceKey],
        type: prev.type || '' // Reset type when changing absence if not set
      }));
      
      // Call the onAbsenceSelection callback if provided
      if (onAbsenceSelection) {
        onAbsenceSelection(absenceKey, true);
      }
      
      console.log('[DIALOG] Setting selected absence:', { 
        selectedAbsence: {
          id: selected.id,
          absence_code: selected.absence_code,
          _uniqueKey: selected._uniqueKey
        },
        absenceKey
      });
    } else {
      console.error('[DIALOG] Could not find selected absence in displayAbsences', {
        selectedValue: value,
        availableAbsences: displayAbsences.map(a => ({
          id: a.id,
          absence_code: a.absence_code,
          _uniqueKey: a._uniqueKey,
          ue: a.ue,
          cours: a.cours,
          date: a.dateAbsence
        }))
      });
      
      // Reset the selection if the selected value is not found
      setSelectedAbsenceKey('');
      setFormData(prev => ({
        ...prev,
        selectedAbsences: [],
        type: prev.type // Keep the current type when resetting
      }));
      
      // Notify parent about deselection if callback is provided
      if (onAbsenceSelection) {
        onAbsenceSelection('', false);
      }
    }
  }, [displayAbsences, onAbsenceSelection]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    console.group('[FILE] File input changed');
    console.log('File input event:', e);
    
    const file = e.target.files?.[0] || null;
    console.log('Selected file:', file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : 'No file selected');
    
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: `Le fichier ne doit pas dépasser ${MAX_FILE_SIZE_MB}MB` }));
        return;
      }
      if (!ext || !ACCEPTED_FILE_TYPES.includes(`.${ext}`)) {
        setErrors(prev => ({ ...prev, file: `Type de fichier non supporté. Types acceptés: ${ACCEPTED_FILE_TYPES.join(', ')}` }));
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setErrors(prev => ({ ...prev, file: '' }));
    } else {
      setFormData(prev => ({ ...prev, file: null }));
    }
  }, []);

  const handleInputChange = useCallback((field: keyof JustificationFormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for the current field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.group('[SUBMIT] Form submission started');
    console.log('Current form data:', {
      ...formData,
      file: formData.file ? `[File: ${formData.file.name}, ${formData.file.size} bytes]` : null
    });
    
    setErrors({});
    
    try {
      // Validate form data
      if (!formData.type) {
        setErrors(prev => ({ ...prev, type: 'Veuillez sélectionner un type de justificatif' }));
        return;
      }

      if (!formData.file) {
        setErrors(prev => ({ ...prev, file: 'Veuillez sélectionner un fichier' }));
        return;
      }

      // Get the selected absences - prioritize the ones from props if available
      let selectedAbsenceIds: string[] = [];
      
      // If we have selectedAbsences from props, use them
      if (selectedAbsences.length > 0) {
        selectedAbsenceIds = [...selectedAbsences];
      } 
      // Otherwise, try to get from selectedAbsenceKey
      else if (selectedAbsenceKey) {
        const selectedAbsence = displayAbsences.find(a => a._uniqueKey === selectedAbsenceKey);
        if (selectedAbsence) {
          selectedAbsenceIds.push(selectedAbsence.absence_code || selectedAbsence._uniqueKey);
        }
      }

      if (selectedAbsenceIds.length === 0) {
        setErrors(prev => ({ ...prev, absences: 'Aucune absence valide sélectionnée' }));
        return;
      }

      // Ensure the file exists before proceeding
      if (!formData.file) {
        throw new Error('Aucun fichier sélectionné');
      }

      // Prepare the files array with non-null assertion since we've checked for null above
      const filesToSubmit = [{
        file: formData.file!,
        name: formData.file!.name,
        title: formData.file!.name,
        type_code: formData.type.toUpperCase()
      }];

      // Prepare the data in the format expected by the parent component
      const submissionData: JustificationFormData = {
        type: formData.type,
        reason: formData.description || 'Justification soumis',
        description: formData.description || 'Justification soumis',
        file: formData.file!,
        selectedAbsences: selectedAbsenceIds,
        files: filesToSubmit
      };

      console.log('Submitting justification with data:', {
        ...submissionData,
        file: '[File object]',
        files: submissionData.files?.map(f => ({
          ...f,
          file: f.file ? '[File object]' : 'null'
        }))
      });

      console.log('Submitting data to parent component:', {
        ...submissionData,
        file: submissionData.file ? `[File: ${submissionData.file.name}]` : null,
        files: submissionData.files?.map(f => f.name)
      });
      
      try {
        // Call the onSubmit handler from props
        await onSubmit(submissionData);
        console.log('Form submitted successfully');
        
        // Close the dialog on success
        onOpenChange(false);
      } catch (error) {
        console.error('Error in onSubmit handler:', error);
        throw error; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.groupEnd(); // Close the submit group
      console.error('Error submitting justification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la soumission du justificatif';
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      // Re-throw the error to allow the parent component to handle it
      console.groupEnd(); // Ensure group is closed before throwing
      throw error;
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[550px] h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Déposer un justificatif</DialogTitle>
          <DialogDescription>
            {singleAbsenceMode 
              ? 'Veuillez sélectionner un justificatif pour cette absence.' 
              : 'Sélectionnez les absences à justifier et téléversez votre justificatif.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Type Select */}
          <div className="space-y-2">
            <Label>Type de justificatif</Label>
            <div className="relative">
              <Select
                value={formData.type}
                onValueChange={val => setFormData(prev => ({ ...prev, type: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un type" className="truncate" />
                </SelectTrigger>
                <SelectContent className="z-[100] w-full max-w-full">
                  <SelectItem value="medical">Certificat médical</SelectItem>
                  <SelectItem value="administratif">Motif administratif</SelectItem>
                  <SelectItem value="family">Justificatif familial</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Fichier du justificatif</Label>
            <div className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <div className="relative flex-1">
                  <Input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <div 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="truncate text-foreground">
                      {formData.file ? formData.file.name : 'Sélectionner un fichier'}
                    </span>
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  variant="outline"
                  className="ml-2 h-10 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  <span>Parcourir</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {/* Formats acceptés : PDF, JPG, PNG (max {MAX_FILE_SIZE_MB}Mo) */}
                Formats acceptés : PDF(max {MAX_FILE_SIZE_MB}Mo)
              </p>
            </div>
            {formData.file && (
              <div className="flex items-center justify-between rounded-md border border-input px-3 py-2 mt-2">
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{formData.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRemoveFile}
                  title="Supprimer le fichier"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Supprimer le fichier</span>
                </Button>
              </div>
            )}
            {errors.file && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <X className="h-4 w-4" />
                <span>{errors.file}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description (optionnel)</Label>
            <Textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Ajoutez une description..."
              className="min-h-[100px]"
            />
          </div>

          {/* Absence Select */}
          <div className="space-y-2">
            <Label htmlFor="absence-select">Sélectionner une absence</Label>
            <div className="relative">
              <Select 
                value={selectedAbsenceKey || ''} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une absence" className="truncate" />
                </SelectTrigger>
                <SelectContent className="z-[100] w-full max-w-full">
                  {displayAbsences.map((absence, index) => {
                    // Create a stable unique key using the absence code, ID, and index
                    const uniqueKey = absence.absence_code 
                      ? `abs_${absence.absence_code}` 
                      : `absence_${absence.id || index}_${absence.dateAbsence}_${absence.heureDebut}`;
                      
                    const date = absence.dateAbsence ? new Date(absence.dateAbsence) : null;
                    const formattedDate = date ? date.toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : 'Date inconnue';
                    
                    return (
                      <SelectItem 
                        key={uniqueKey}
                        value={absence.absence_code || absence.id.toString()}
                        className="py-2"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{absence.ue || 'UE inconnue'}</span>
                          <span className="text-sm text-muted-foreground">
                            {formattedDate} • {absence.heureDebut || 'Heure inconnue'}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.absences && <p className="text-sm text-red-500 mt-1">{errors.absences}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Soumettre'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
