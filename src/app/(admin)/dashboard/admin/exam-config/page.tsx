"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Eye, 
  FileText, 
  Search,
  Filter,
  Download
} from 'lucide-react';

interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  numeroEtudiant: string;
  moyenneGenerale: number;
  statut: 'admis' | 'ajourne' | 'rattrapage';
  filiere: string;
  uniteEnseignement: string;
}

interface StatistiquesPromotion {
  totalEtudiants: number;
  admis: number;
  ajournes: number;
  rattrapages: number;
  moyennePromotion: number;
  tauxReussite: number;
}

const TableauBordDeliberations = () => {
  const [selectedPromotion, setSelectedPromotion] = useState('L2-2024');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreFiliere, setFiltreFiliere] = useState('toutes');
  const [filtreUniteEnseignement, setFiltreUniteEnseignement] = useState('toutes');
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [etudiantSelectionne, setEtudiantSelectionne] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tableau');

  // Données simulées des étudiants
  const [etudiants] = useState<Etudiant[]>([
    {
      id: '1',
      nom: 'MBARGA',
      prenom: 'Marie Claire',
      numeroEtudiant: 'ETU2024001',
      moyenneGenerale: 14.5,
      statut: 'admis',
      filiere: 'Soins Infirmiers',
      uniteEnseignement: 'Sciences Fondamentales'
    },
    {
      id: '2',
      nom: 'NKOMO',
      prenom: 'Jean Baptiste',
      numeroEtudiant: 'ETU2024002',
      moyenneGenerale: 9.8,
      statut: 'rattrapage',
      filiere: 'Soins Infirmiers',
      uniteEnseignement: 'Soins Cliniques'
    },
    {
      id: '3',
      nom: 'ASSOMO',
      prenom: 'Patricia',
      numeroEtudiant: 'ETU2024003',
      moyenneGenerale: 12.3,
      statut: 'admis',
      filiere: 'Sage-Femme',
      uniteEnseignement: 'Obstétrique'
    },
    {
      id: '4',
      nom: 'OLOMO',
      prenom: 'André',
      numeroEtudiant: 'ETU2024004',
      moyenneGenerale: 7.2,
      statut: 'ajourne',
      filiere: 'Kinésithérapie',
      uniteEnseignement: 'Rééducation Motrice'
    },
    {
      id: '5',
      nom: 'KOUAM',
      prenom: 'Sylvie',
      numeroEtudiant: 'ETU2024005',
      moyenneGenerale: 16.8,
      statut: 'admis',
      filiere: 'Soins Infirmiers',
      uniteEnseignement: 'Sciences Fondamentales'
    },
    {
      id: '6',
      nom: 'TCHOUA',
      prenom: 'Paul',
      numeroEtudiant: 'ETU2024006',
      moyenneGenerale: 11.2,
      statut: 'admis',
      filiere: 'Kinésithérapie',
      uniteEnseignement: 'Anatomie Fonctionnelle'
    },
    {
      id: '7',
      nom: 'MANGA',
      prenom: 'Françoise',
      numeroEtudiant: 'ETU2024007',
      moyenneGenerale: 8.9,
      statut: 'rattrapage',
      filiere: 'Sage-Femme',
      uniteEnseignement: 'Gynécologie'
    },
    {
      id: '8',
      nom: 'BIYA',
      prenom: 'Joseph',
      numeroEtudiant: 'ETU2024008',
      moyenneGenerale: 13.7,
      statut: 'admis',
      filiere: 'Soins Infirmiers',
      uniteEnseignement: 'Soins Cliniques'
    },
    {
      id: '9',
      nom: 'FOUDA',
      prenom: 'Christine',
      numeroEtudiant: 'ETU2024009',
      moyenneGenerale: 15.2,
      statut: 'admis',
      filiere: 'Sage-Femme',
      uniteEnseignement: 'Obstétrique'
    },
    {
      id: '10',
      nom: 'NDONGO',
      prenom: 'Michel',
      numeroEtudiant: 'ETU2024010',
      moyenneGenerale: 10.5,
      statut: 'admis',
      filiere: 'Kinésithérapie',
      uniteEnseignement: 'Rééducation Motrice'
    }
  ]);

  // Filtrage des étudiants
  const etudiantsFiltres = etudiants.filter(etudiant => {
    const matchTexte = rechercheTexte === '' || 
      etudiant.nom.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      etudiant.prenom.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      etudiant.numeroEtudiant.toLowerCase().includes(rechercheTexte.toLowerCase());
    
    const matchStatut = filtreStatut === 'tous' || etudiant.statut === filtreStatut;
    const matchFiliere = filtreFiliere === 'toutes' || etudiant.filiere === filtreFiliere;
    const matchUniteEnseignement = filtreUniteEnseignement === 'toutes' || etudiant.uniteEnseignement === filtreUniteEnseignement;
    
    return matchTexte && matchStatut && matchFiliere && matchUniteEnseignement;
  });

  // Options d'unités d'enseignement basées sur la filière sélectionnée
  const getUnitesEnseignement = () => {
    switch (filtreFiliere) {
      case 'Soins Infirmiers':
        return ['Sciences Fondamentales', 'Soins Cliniques', 'Santé Publique'];
      case 'Sage-Femme':
        return ['Obstétrique', 'Gynécologie', 'Néonatologie'];
      case 'Kinésithérapie':
        return ['Anatomie Fonctionnelle', 'Rééducation Motrice', 'Biomécanique'];
      default:
        return ['Sciences Fondamentales', 'Soins Cliniques', 'Obstétrique', 'Gynécologie', 'Anatomie Fonctionnelle', 'Rééducation Motrice'];
    }
  };

  // Calcul des statistiques basées sur les étudiants filtrés
  const statistiques: StatistiquesPromotion = {
    totalEtudiants: etudiantsFiltres.length,
    admis: etudiantsFiltres.filter(e => e.statut === 'admis').length,
    ajournes: etudiantsFiltres.filter(e => e.statut === 'ajourne').length,
    rattrapages: etudiantsFiltres.filter(e => e.statut === 'rattrapage').length,
    moyennePromotion: etudiantsFiltres.length > 0 ? etudiantsFiltres.reduce((sum, e) => sum + e.moyenneGenerale, 0) / etudiantsFiltres.length : 0,
    tauxReussite: etudiantsFiltres.length > 0 ? (etudiantsFiltres.filter(e => e.statut === 'admis').length / etudiantsFiltres.length) * 100 : 0
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="h-8 w-8 text-gray-700" />
                <h1 className="text-2xl font-semibold text-gray-900">Tableau de Bord des Délibérations</h1>
              </div>
              <p className="text-gray-600">
                Vue d&apos;ensemble des résultats de la promotion - Session de délibération
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1-2024">L1 - Promotion 2024</SelectItem>
                  <SelectItem value="L2-2024">L2 - Promotion 2024</SelectItem>
                  <SelectItem value="L3-2024">L3 - Promotion 2024</SelectItem>
                  <SelectItem value="M1-2024">M1 - Promotion 2024</SelectItem>
                  <SelectItem value="M2-2024">M2 - Promotion 2024</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>



        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tableau">Tableau des Résultats</TabsTrigger>
            <TabsTrigger value="statistiques">Analyses</TabsTrigger>
          </TabsList>

          {/* Onglet Tableau des Résultats */}
          <TabsContent value="tableau" className="space-y-6">
            {/* Filtres et recherche */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher un étudiant..."
                        value={rechercheTexte}
                        onChange={(e) => setRechercheTexte(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les statuts</SelectItem>
                        <SelectItem value="admis">Admis</SelectItem>
                        <SelectItem value="rattrapage">Rattrapage</SelectItem>
                        <SelectItem value="ajourne">Ajourné</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={filtreFiliere} onValueChange={setFiltreFiliere}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filière" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toutes">Toutes les filières</SelectItem>
                        <SelectItem value="Soins Infirmiers">Soins Infirmiers</SelectItem>
                        <SelectItem value="Sage-Femme">Sage-Femme</SelectItem>
                        <SelectItem value="Kinésithérapie">Kinésithérapie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={filtreUniteEnseignement} onValueChange={setFiltreUniteEnseignement}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unité d'enseignement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toutes">Toutes les unités</SelectItem>
                        {getUnitesEnseignement().map(unite => (
                          <SelectItem key={unite} value={unite}>{unite}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setRechercheTexte('');
                        setFiltreStatut('tous');
                        setFiltreFiliere('toutes');
                        setFiltreUniteEnseignement('toutes');
                      }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tableau principal */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats de la Promotion {selectedPromotion}</CardTitle>
                <CardDescription>
                  {etudiantsFiltres.length} étudiant(s) affiché(s) sur {etudiants.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-700">Étudiant</th>
                        <th className="text-center p-4 font-medium text-gray-700">Numéro</th>
                        <th className="text-center p-4 font-medium text-gray-700">Filière</th>
                        <th className="text-center p-4 font-medium text-gray-700">Unité d&apos;enseignement</th>
                        <th className="text-center p-4 font-medium text-gray-700">Moyenne</th>
                        <th className="text-center p-4 font-medium text-gray-700">Statut</th>
                        <th className="text-center p-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {etudiantsFiltres.map((etudiant) => (
                        <tr key={etudiant.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{etudiant.nom} {etudiant.prenom}</p>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-mono text-sm text-gray-600">{etudiant.numeroEtudiant}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-sm text-gray-700">{etudiant.filiere}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-sm text-gray-700">{etudiant.uniteEnseignement}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-lg font-medium text-gray-900">
                              {etudiant.moyenneGenerale.toFixed(1)}
                            </span>
                            <span className="text-gray-500 text-sm">/20</span>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="font-normal">
                              {etudiant.statut === 'admis' && 'Admis'}
                              {etudiant.statut === 'ajourne' && 'Ajourné'}
                              {etudiant.statut === 'rattrapage' && 'Rattrapage'}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEtudiantSelectionne(etudiant.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="statistiques" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Résultats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Admis ({statistiques.admis})</span>
                        <span className="text-gray-600">{statistiques.totalEtudiants > 0 ? ((statistiques.admis / statistiques.totalEtudiants) * 100).toFixed(0) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${statistiques.totalEtudiants > 0 ? (statistiques.admis / statistiques.totalEtudiants) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Rattrapages ({statistiques.rattrapages})</span>
                        <span className="text-gray-600">{statistiques.totalEtudiants > 0 ? ((statistiques.rattrapages / statistiques.totalEtudiants) * 100).toFixed(0) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${statistiques.totalEtudiants > 0 ? (statistiques.rattrapages / statistiques.totalEtudiants) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Ajournés ({statistiques.ajournes})</span>
                        <span className="text-gray-600">{statistiques.totalEtudiants > 0 ? ((statistiques.ajournes / statistiques.totalEtudiants) * 100).toFixed(0) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${statistiques.totalEtudiants > 0 ? (statistiques.ajournes / statistiques.totalEtudiants) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la Sélection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-semibold text-gray-900">
                        {statistiques.moyennePromotion.toFixed(1)}/20
                      </p>
                      <p className="text-sm text-gray-600">Moyenne de la sélection</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-semibold text-gray-900">
                        {statistiques.tauxReussite.toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-600">Taux de réussite</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de détail étudiant */}
        {etudiantSelectionne && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {(() => {
                const etudiant = etudiantsFiltres.find(e => e.id === etudiantSelectionne);
                if (!etudiant) return null;

                return (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {etudiant.nom} {etudiant.prenom}
                        </h2>
                        <p className="text-gray-600">{etudiant.numeroEtudiant}</p>
                        <p className="text-sm text-gray-500">{etudiant.filiere} - {etudiant.uniteEnseignement}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {etudiant.statut}
                        </Badge>
                        <Button
                          variant="outline"
                          onClick={() => setEtudiantSelectionne(null)}
                        >
                          Fermer
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Résumé général */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Résumé</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center p-4 bg-gray-50 rounded">
                            <p className="text-3xl font-semibold text-gray-900">
                              {etudiant.moyenneGenerale.toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600">Moyenne générale</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Actions */}
                      <div className="flex justify-end gap-3">
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Générer Relevé
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Exporter
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableauBordDeliberations;