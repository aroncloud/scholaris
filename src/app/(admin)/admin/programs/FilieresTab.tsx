import React from 'react'

const FilieresTab = () => {
  return (
    <TabsContent value="filieres" className="space-y-4">
        <Card>
            <CardHeader>
            <CardTitle>Filières d'études</CardTitle>
            <CardDescription>
                Gestion des programmes de formation
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher une filière..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                />
                </div>
                <div className="flex space-x-2">
                <Select
                    value={filterStatut}
                    onValueChange={setFilterStatut}
                >
                    <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>

            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Filière</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Frais</TableHead>
                    <TableHead>Maquettes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredFilieres.map((filiere) => (
                    <TableRow key={filiere.id}>
                    <TableCell>
                        <div>
                        <div className="font-medium">{filiere.nom}</div>
                        <div className="text-sm text-muted-foreground">
                            {filiere.description}
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{filiere.duree} ans</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{filiere.capaciteAccueil}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="text-green-600 font-medium">
                        {filiere.fraisInscription}€
                        </span>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">
                        {filiere.maquettes.length} maquette(s)
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge className={statutLabels[filiere.statut].color}>
                        {statutLabels[filiere.statut].label}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                            onClick={() => {
                                setSelectedFiliere(filiere);
                                setFormData(filiere);
                                setIsFiliereDialogOpen(true);
                            }}
                            >
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle maquette
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Voir maquettes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {filiere.statut === "actif" ? (
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                handleChangeStatus(
                                    "filiere",
                                    filiere.id,
                                    "suspendu",
                                )
                                }
                            >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Suspendre
                            </DropdownMenuItem>
                            ) : (
                            <DropdownMenuItem
                                className="text-green-600"
                                onClick={() =>
                                handleChangeStatus(
                                    "filiere",
                                    filiere.id,
                                    "actif",
                                )
                                }
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activer
                            </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                            onClick={() =>
                                handleChangeStatus(
                                "filiere",
                                filiere.id,
                                "archive",
                                )
                            }
                            >
                            <Eye className="mr-2 h-4 w-4" />
                            Archiver
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={() => {
                                setFiliereToDelete(filiere.id);
                                setDeleteDialogOpen(true);
                            }}
                            >
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
  )
}

export default FilieresTab