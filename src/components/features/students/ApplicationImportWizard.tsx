/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SheetData {
  sheetName: string;
  headers: string[];
  data: any[][];
}

type MappingType = 'COLUMN' | 'SHEET_NAME';

export interface FieldMapping {
  key: string;
  label: string;
  type: MappingType;
  dataType: string;
  required?: boolean;
}

interface ApplicationImportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Record<string, any>[]) => Promise<boolean>;
  title?: string;
  description?: string;
  mapping: FieldMapping[];
}

export default function ApplicationImportWizard({
  open,
  onOpenChange,
  onSave,
  title = "Import d'étudiants depuis Excel",
  description = "Téléchargez un fichier Excel contenant plusieurs sheets",
  mapping
}: ApplicationImportWizardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [sheetsData, setSheetsData] = useState<SheetData[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filtrer les champs qui nécessitent un mapping manuel (type COLUMN)
  const columnFields = mapping.filter(field => field.type === 'COLUMN');
  const sheetNameFields = mapping.filter(field => field.type === 'SHEET_NAME');

  // Réinitialiser l'état quand la dialog s'ouvre/ferme
  useEffect(() => {
    if (!open) {
      resetUpload();
    }
  }, [open]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setError('');
    setSuccess(false);
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        const allSheetsData: SheetData[] = [];
        const firstSheetHeaders: string[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, dateNF: 'dd/mm/yyyy' }) as any[][];

          if (jsonData.length > 0) {
            const sheetHeaders = jsonData[0].map((h: any) => String(h || ''));
            
            if (firstSheetHeaders.length === 0) {
              firstSheetHeaders.push(...sheetHeaders);
            }

            const rows = jsonData.slice(1).filter(row => 
              row.some(cell => cell !== undefined && cell !== '')
            );
            
            allSheetsData.push({
              sheetName,
              headers: sheetHeaders,
              data: rows
            });
          }
        });

        if (firstSheetHeaders.length === 0) {
          setError('Le fichier Excel ne contient pas de données valides.');
          return;
        }

        setHeaders(firstSheetHeaders);
        setSheetsData(allSheetsData);
        
        // Auto-mapping intelligent
        const newMapping: Record<string, string> = {};
        columnFields.forEach(field => {
          const fieldLower = field.label.toLowerCase();
          firstSheetHeaders.forEach((header) => {
            const headerLower = String(header).toLowerCase();
            
            if (fieldLower.includes('nom') && headerLower.includes('nom')) {
              newMapping[field.key] = header;
            } else if (fieldLower.includes('prenom') && headerLower.includes('prenom')) {
              newMapping[field.key] = header;
            } else if (fieldLower.includes('email') && (headerLower.includes('email') || headerLower.includes('mail'))) {
              newMapping[field.key] = header;
            } else if ((fieldLower.includes('telephone') || fieldLower.includes('phone') || fieldLower.includes('contact')) 
                       && (headerLower.includes('telephone') || headerLower.includes('phone') || headerLower.includes('contact'))) {
              newMapping[field.key] = header;
            } else if (fieldLower.includes('sexe') && headerLower.includes('sexe')) {
              newMapping[field.key] = header;
            } else if (fieldLower.includes('date') && headerLower.includes('date')) {
              newMapping[field.key] = header;
            } else if (fieldLower.includes('lieu') && headerLower.includes('lieu')) {
              newMapping[field.key] = header;
            } else if (fieldLower.includes('matricule') && headerLower.includes('matricule')) {
              newMapping[field.key] = header;
            }
          });
        });
        setColumnMapping(newMapping);

      } catch (err) {
        setError('Erreur lors de la lecture du fichier Excel. Veuillez vérifier le format.');
        console.error(err);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleMappingChange = (fieldKey: string, excelHeader: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [fieldKey]: excelHeader
    }));
  };

  const handleSubmit = async () => {
    // Vérifier que tous les champs COLUMN requis sont mappés
    const requiredColumnFields = columnFields.filter(field => field.required);
    const missingFields = requiredColumnFields.filter(field => !columnMapping[field.key]);
    
    if (missingFields.length > 0) {
      setError(`Veuillez mapper tous les champs requis: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const mappedData: Record<string, any>[] = [];

      sheetsData.forEach(sheet => {
        sheet.data.forEach(row => {
          const record: Record<string, any> = {};

          // Mapper les champs SHEET_NAME
          sheetNameFields.forEach(field => {
            record[field.key] = sheet.sheetName;
          });

          // Mapper les champs COLUMN
          columnFields.forEach(field => {
            const excelHeader = columnMapping[field.key];
            if (excelHeader) {
              const headerIndex = sheet.headers.indexOf(excelHeader);
              if (headerIndex !== -1) {
                let value = row[headerIndex];
                
                // Gérer les dates Excel (valeurs numériques)
                if (field.dataType === 'date' && value && !isNaN(Number(value))) {
                  // Si c'est un nombre, c'est probablement un serial date Excel
                  const excelDate = Number(value);
                  const date = new Date((excelDate - 25569) * 86400 * 1000);
                  
                  // Formater en dd/mm/yyyy
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  value = `${day}/${month}/${year}`;
                }
                
                record[field.key] = value ? String(value) : '';
              } else {
                record[field.key] = '';
              }
            } else {
              record[field.key] = '';
            }
          });

          // Vérifier si au moins un champ requis est rempli
          const hasRequiredData = requiredColumnFields.some(field => {
            return record[field.key] && String(record[field.key]).trim() !== '';
          });

          if (hasRequiredData) {
            mappedData.push(record);
          }
        });
      });

      console.log('Données mappées:', mappedData);
      
      // Appel de la fonction onSave fournie par le parent
      const saveSuccess = await onSave(mappedData);
      
      if (saveSuccess) {
        setSuccess(true);
        setError('');
        console.log(`${mappedData.length} enregistrements extraits et sauvegardés`);
        
        // Fermer la dialog après 2 secondes
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        setError('Erreur lors de la sauvegarde des données');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError('Erreur lors du traitement des données: ' + errorMessage);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setHeaders([]);
    setSheetsData([]);
    setColumnMapping({});
    setError('');
    setSuccess(false);
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!file && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-dialog"
              />
              <label htmlFor="file-upload-dialog" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Cliquez pour sélectionner un fichier Excel
                </p>
                <p className="text-xs text-gray-500">
                  Formats acceptés: .xlsx, .xls
                </p>
              </label>
            </div>
          )}

          {file && !success && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{file.name}</p>
                  <p className="text-sm text-blue-700">
                    {sheetsData.length} sheet(s) détecté(s)
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetUpload}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {headers.length > 0 && !success && columnFields.length > 0 && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Mapper les colonnes</h3>
                <div className="space-y-3">
                  {columnFields.map(field => (
                    <div key={field.key} className="flex items-center gap-4">
                      <label className="w-32 text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <Select
                        value={columnMapping[field.key] || ''}
                        onValueChange={(value) => handleMappingChange(field.key, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Sélectionner une colonne" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map((header, index) => (
                            <SelectItem key={index} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Les données ont été traitées avec succès! {sheetsData.reduce((acc, sheet) => acc + sheet.data.length, 0)} enregistrements importés.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Annuler
          </Button>
          {file && !success && (
            <Button onClick={handleSubmit} disabled={isProcessing}>
              {isProcessing ? 'Traitement...' : 'Importer'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}