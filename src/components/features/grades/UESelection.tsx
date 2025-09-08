'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UESelectionProps {
  onSelect?: (data: {
    filiere: string;
    niveau: string;
    ue: string;
  }) => void;
}

const UESelection: React.FC<UESelectionProps> = ({
  onSelect,
}) => {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [ue, setUe] = useState('');

  const filieres = [
    { id: 'info', name: 'Informatique' },
    { id: 'gestion', name: 'Gestion' },
    { id: 'compta', name: 'Comptabilité' },
  ];

  const niveaux = [
    { id: 'l1', name: 'Licence 1' },
    { id: 'l2', name: 'Licence 2' },
    { id: 'l3', name: 'Licence 3' },
  ];

  const ues = [
    { id: 'ue1', name: 'UE1 - Programmation avancée' },
    { id: 'ue2', name: 'UE2 - Base de données' },
    { id: 'ue3', name: 'UE3 - Réseaux' },
  ];

  const isFormValid = filiere && niveau && ue;

  const handleSave = () => {
    if (isFormValid) {
      const data = { filiere, niveau, ue };
      if (onSelect) {
        onSelect(data);
      }
      // You can add additional save logic here if needed
      console.log('Saving UE selection:', data);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 border-gray-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>
          <div className="text-left">
            <h2 className="text-xl font-semibold">Saisir des Notes</h2>
            <p className="text-sm text-gray-500">saisie des notes par unité d'enseignement</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            className="text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setFiliere('');
              setNiveau('');
              setUe('');
            }}
          >
            Réinitialiser
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sauvegarder
          </Button>
        </div>
      </div>

        {/* Main Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <h3 className="text-lg font-medium mb-1">Sélection de l'Unité d'Enseignement</h3>
            <p className="text-sm text-gray-500 mb-6">Choisissez la filière, le niveau et l'UE pour saisir les notes</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filiere Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                <Select value={filiere} onValueChange={setFiliere}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {filieres.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Niveau Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <Select value={niveau} onValueChange={setNiveau}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveaux.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* UE Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unité d'Enseignement</label>
                <Select value={ue} onValueChange={setUe}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une UE" />
                  </SelectTrigger>
                  <SelectContent>
                    {ues.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default UESelection;
