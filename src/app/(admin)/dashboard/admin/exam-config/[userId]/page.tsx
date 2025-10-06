"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Note {
  ue: string;
  matiere: string;
  note: number;
  coefficient: number;
}

const notesMock: Note[] = [
  { ue: "Mathématiques", matiere: "Algèbre", note: 12, coefficient: 2 },
  { ue: "Mathématiques", matiere: "Analyse", note: 14, coefficient: 3 },
  { ue: "Informatique", matiere: "Programmation", note: 16, coefficient: 4 },
  { ue: "Informatique", matiere: "Bases de données", note: 13, coefficient: 2 },
];

export default function DossierEtudiant() {
  const [anneeScolaire, setAnneeScolaire] = useState("2024-2025");
  const [anneeAcademique, setAnneeAcademique] = useState("3");
  const [semestre, setSemestre] = useState("S1");

  // Regroupement par UE
  const ues = Array.from(new Set(notesMock.map((n) => n.ue)));

  return (
    <div className="p-6 space-y-6">
      {/* Header étudiant */}
       <Card className="p-4 flex items-center gap-4">
        {/* <img
          src="/placeholder-avatar.png"
          alt="photo etudiant"
          className="w-16 h-16 rounded-full border"
        /> */}
        <div>
          <h1 className="text-xl font-bold">Nganda Ryan</h1>
          <p className="text-sm text-muted-foreground">Matricule : 2024001</p>
        </div>
      </Card>

      {/* Filtres de sélection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={anneeScolaire} onValueChange={setAnneeScolaire}>
          <SelectTrigger>
            <SelectValue placeholder="Année scolaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023-2024">2023-2024</SelectItem>
            <SelectItem value="2024-2025">2024-2025</SelectItem>
          </SelectContent>
        </Select>

        <Select value={anneeAcademique} onValueChange={setAnneeAcademique}>
          <SelectTrigger>
            <SelectValue placeholder="Année académique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1ère année</SelectItem>
            <SelectItem value="2">2ème année</SelectItem>
            <SelectItem value="3">3ème année</SelectItem>
          </SelectContent>
        </Select>

        <Select value={semestre} onValueChange={setSemestre}>
          <SelectTrigger>
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="S1">Semestre 1</SelectItem>
            <SelectItem value="S2">Semestre 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tableau des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes brutes – Semestre {semestre}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unité d’enseignement</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Note brute</TableHead>
                <TableHead>Coefficient</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notesMock.map((n, i) => (
                <TableRow key={i}>
                  <TableCell>{n.ue}</TableCell>
                  <TableCell>{n.matiere}</TableCell>
                  <TableCell>{n.note}</TableCell>
                  <TableCell>{n.coefficient}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Synthèse */}
      <Card>
        <CardHeader>
          <CardTitle>Synthèse du semestre {semestre}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Moyenne générale :{" "}
            <span className="font-bold">13.8 / 20</span>
          </p>
          <p>
            Résultat :{" "}
            <span className="text-green-600 font-bold">Validé</span>
          </p>
        </CardContent>
      </Card>

      {/* Filtres de sélection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={anneeScolaire} onValueChange={setAnneeScolaire}>
          <SelectTrigger>
            <SelectValue placeholder="Année scolaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023-2024">2023-2024</SelectItem>
            <SelectItem value="2024-2025">2024-2025</SelectItem>
          </SelectContent>
        </Select>

        <Select value={anneeAcademique} onValueChange={setAnneeAcademique}>
          <SelectTrigger>
            <SelectValue placeholder="Année académique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1ère année</SelectItem>
            <SelectItem value="2">2ème année</SelectItem>
            <SelectItem value="3">3ème année</SelectItem>
          </SelectContent>
        </Select>

        <Select value={semestre} onValueChange={setSemestre}>
          <SelectTrigger>
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="S1">Semestre 1</SelectItem>
            <SelectItem value="S2">Semestre 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Onglets par UE */}
      <Tabs defaultValue={ues[0]}>
        <TabsList>
          {ues.map((ue) => (
            <TabsTrigger key={ue} value={ue}>
              {ue}
            </TabsTrigger>
          ))}
        </TabsList>

        {ues.map((ue) => (
          <TabsContent key={ue} value={ue}>
            <Card>
              <CardHeader>
                <CardTitle>{ue}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière</TableHead>
                      <TableHead>Note brute</TableHead>
                      <TableHead>Coefficient</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notesMock
                      .filter((n) => n.ue === ue)
                      .map((n, i) => (
                        <TableRow key={i}>
                          <TableCell>{n.matiere}</TableCell>
                          <TableCell>{n.note}</TableCell>
                          <TableCell>{n.coefficient}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Synthèse */}
      <Card>
        <CardHeader>
          <CardTitle>Synthèse du semestre {semestre}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Moyenne générale : <span className="font-bold">13.8 / 20</span></p>
          <p>Résultat : <span className="text-green-600 font-bold">Validé</span></p>
        </CardContent>
      </Card>
    </div>
  );
}
