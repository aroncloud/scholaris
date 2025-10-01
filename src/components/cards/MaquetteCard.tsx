'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Calendar, ChevronDown, ChevronRight, Edit, Eye, Loader2, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { ICreateCurriculum, ICreateDomain, ICreateModule, ICreateSemester, ICreateUE, ICurriculumDetail, IModulePerDomain, IGetUEPerModule } from '@/types/programTypes'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { v4 as uuidv4 } from 'uuid'
import { Badge } from '../ui/badge'
import { getStatusColor } from '@/lib/utils'
import { createDomain, createModule, createSemester, createUE, getModuleListPerDomain, getUEListPerModule, updateCurriculum, updateDomain, updateModule, updateSemester } from '@/actions/programsAction'
import UETable from '../features/programs/tables/UETable'
import { showToast } from '../ui/showToast'
import { DialogUpdateCurriculum } from '../features/programs/Modal/DialogUpdateCurriculum' 
import { DialogCreateSequence } from '../features/programs/Modal/DialogCreateSequence'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { DialogUpdateSequence } from '../features/programs/Modal/DialogUpdateSequence'
import { DialogCreateDomain } from '../features/programs/Modal/DialogCreateDomain'
import { Separator } from '../custom-ui/separator'
import { DialogUpdateDomain } from '../features/programs/Modal/DialogUpdateDomain'
import { DialogCreateModule } from '../features/programs/Modal/DialogCreateModule'
import { DialogUpdateModule } from '../features/programs/Modal/DialogUpdateModule'
import { DialogCreateUE } from '../features/programs/Modal/DialogCreateUE'
import { Button } from '../ui/button'
import { useRouter } from "@bprogress/next/app";

type MyComponentProps = {
  curriculum: ICurriculumDetail
  programName: string
  refresh: () => void;
}

const MaquetteCard = ({ curriculum, programName, refresh }: MyComponentProps) => {
  // État pour gérer l'expansion du card principal
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [fetchedModuleList, setFetchedModuleList] = useState<IModulePerDomain[]>([])
  const [fetchedUEList, setFetchedUEList] = useState<IGetUEPerModule[]>([])
  const [loadingModules, setLoadingModules] = useState<Set<string>>(new Set())
  const [loadingUE, setLoadingUE] = useState<Set<string>>(new Set())
  const [selectedCurriculum, setSelectedCurriculum] = useState<ICreateCurriculum | null>(null);
  const router = useRouter();
  
  const [isUpdateCurriculumDialogOpen, setIsUpdateCurriculumDialogOpen] = useState(false);
  
  // ---- Domaine ----
  const [selectedDomain, setSelectedDomain] = useState<ICreateDomain | null>(null);
  const [isCreateDomainDialogOpen, setIsCreateDomainDialogOpen] = useState(false);
  const [isUpdateDomainDialogOpen, setIsUpdateDomainDialogOpen] = useState(false);

  // ---- Module ----
  const [selectedModule, setSelectedModule] = useState<ICreateModule | null>(null);
  const [isCreateModuleDialogOpen, setIsCreateModuleDialogOpen] = useState(false);
  const [isUpdateModuleDialogOpen, setIsUpdateModuleDialogOpen] = useState(false);

  // ---- Séquence ----
  const [selectedSequence, setSelectedSequence] = useState<ICreateSemester | null>(null);
  const [selectedSequenceList, setSelectedSequenceList] = useState<ICreateSemester []>([]);
  const [isCreateSequenceDialogOpen, setIsCreateSequenceDialogOpen] = useState(false);
  const [isUpdateSequenceDialogOpen, setIsUpdateSequenceDialogOpen] = useState(false);

  // ---- UE ----
  const [isCreateUEDialogOpen, setIsCreateUEDialogOpen] = useState(false);

  
  const handleUpdateCurriculum = async (curriculum: ICreateCurriculum) => {
    if(selectedCurriculum) {
      const result = await updateCurriculum(curriculum, selectedCurriculum.curriculum_code);
      console.log("Update curriculum result:", result);

      if (result.code === 'success') {
        setIsUpdateCurriculumDialogOpen(false);
        showToast({
            variant: "success-solid",
            message: 'Curriculum mis à jour avec succès',
            description: `${curriculum.curriculum_name} a été ajouté.`,
            position: 'top-center',
        })
        refresh()
      } else {
        showToast({
            variant: "error-solid",
            message: "Impossible de mettre a jour le curriculum",
            description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
            position: 'top-center',
        })
      }
    }  
  }

  // --- Domain ---
  const handleCreateDomain = async (domain: ICreateDomain) => {
    console.log('domain', domain)
    const result = await createDomain({... domain, curriculum_code: curriculum.curriculum_code, domain_code: domain.internal_code});
    console.log("Create domain result:", result);

    if (result.code === 'success') {
      setIsCreateDomainDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Domaine créé avec succès',
        description: `${domain.domain_name} a été ajouté.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer le domaine",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
    }
  };

  const handleUpdateDomain = async (domain: ICreateDomain) => {
    const result = await updateDomain({... domain, curriculum_code: curriculum.curriculum_code});
    console.log("Update domain result:", result);

    if (result.code === 'success') {
      setIsUpdateDomainDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Domaine mis à jour avec succès',
        description: `${domain.domain_name} a été modifié.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour le domaine",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
    }
  };

  // --- Sequence ---
  const handleCreateSequence = async (sequence: ICreateSemester) => {
    const result = await createSemester(sequence);
    console.log("Create sequence result:", result);

    if (result.code === 'success') {
      setIsCreateSequenceDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Séquence créée avec succès',
        description: `${sequence.sequence_name} a été ajoutée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer la séquence",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
    }
  };

  const handleUpdateSequence = async (sequence: ICreateSemester) => {
    if(selectedSequence){
      const result = await updateSemester(sequence, selectedSequence?.sequence_code);
      console.log("Update sequence result:", result);

      if (result.code === 'success') {
        setIsUpdateSequenceDialogOpen(false);
        showToast({
          variant: "success-solid",
          message: 'Séquence mise à jour avec succès',
          description: `${sequence.sequence_name} a été modifiée.`,
          position: 'top-center',
        });
        refresh();
      } else {
        showToast({
          variant: "error-solid",
          message: "Impossible de mettre à jour la séquence",
          description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
          position: 'top-center',
        });
      }
    }
  };

  // --- UE ---
  const handleCreateUE = async (ue: ICreateUE) => {
    const result = await createUE(ue);
    console.log("Create UE result:", result);

    if (result.code === 'success') {
      setIsCreateUEDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'UE créée avec succès',
        description: `${ue.course_unit_name} a été ajoutée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer l'UE",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
      return false
    }

    return true
  };

  // --- Module ---
  const handleCreateModule = async (module: ICreateModule) => {
    const result = await createModule(module);
    console.log("Create module result:", result);

    if (result.code === 'success') {
      setIsCreateModuleDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Module créé avec succès',
        description: `${module.module_name} a été ajouté.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer le module",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
      return false
    }

    return true
  };

  const handleUpdateModule = async (module: ICreateModule) => {
    const result = await updateModule(module);
    console.log("Update module result:", result);

    if (result.code === 'success') {
      setIsUpdateModuleDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Module mis à jour avec succès',
        description: `${module.module_name} a été modifié.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour le module",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
      return false
    }

    return true;
  };




  const toggleExpanded = async (domainId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId)
    } else {
      if (!fetchedModuleList.some((mod) => mod.domain_code === domainId)) {
        setLoadingModules((prev) => new Set(prev).add(domainId))
        await getModuleInfo(domainId)
        setLoadingModules((prev) => {
          const copy = new Set(prev)
          copy.delete(domainId)
          return copy
        })
      }
      newExpanded.add(domainId)
    }
    setExpandedItems(newExpanded)
  }

  const toggleModuleExpanded = async (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      if (!fetchedUEList.some((ue) => ue.module_code === moduleId)) {
        setLoadingUE((prev) => new Set(prev).add(moduleId))
        await getUEInfo(moduleId)
        setLoadingUE((prev) => {
          const copy = new Set(prev)
          copy.delete(moduleId)
          return copy
        })
      }
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const getModuleInfo = async (domainId: string) => {
    const moduleResult = await getModuleListPerDomain(domainId)
    if (moduleResult.code == 'success') {
      setFetchedModuleList((mod) => [...mod, ...moduleResult.data.body])
    }
  }

  const getUEInfo = async (moduleId: string) => {
    const UEResult = await getUEListPerModule(moduleId)
    if (UEResult.code == 'success') {
      setFetchedUEList((ue) => [...ue, ...UEResult.data.body])
    }
  }

  return (
    <>
      <Collapsible
        open={isCardExpanded}
        onOpenChange={setIsCardExpanded}
        className="w-full"
      >
        <Card className="border-l-4 border-l-blue-500 gap-4">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-auto">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="h-10 -ml-3 w-auto">
                      {isCardExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <CardTitle className="text-lg text-blue-900 cursor-pointer">
                      {curriculum.curriculum_name}
                    </CardTitle>
                  </div>
                </CollapsibleTrigger>
                <CardDescription>
                  <div className="flex flex-wrap items-center gap-2 my-1 text-sm">
                    <span>Filière: {programName}</span>
                    <span>|</span>
                    <span>Année académique: {new Date().getFullYear()}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getStatusColor(curriculum.status_code)}>
                  {curriculum.status_code}
                </Badge>
                <div className="flex gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-7 w-7 p-4"
                      >
                        <MoreHorizontal className="h-4 w-7" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {
                        router.push(`/dashboard/admin/programs/${curriculum.curriculum_code}`)
                      }}>
                        <Eye className="mr-2 h-5 w-5" />
                        Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCurriculum({
                            curriculum_code: curriculum.curriculum_code,
                            curriculum_name: curriculum.curriculum_name,
                            program_code: curriculum.program.program_code,
                            study_level: curriculum.study_level,
                            status_code: curriculum.status_code,
                          });
                          setIsUpdateCurriculumDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm mt-2">
              {curriculum.training_sequences.map((seq) => (
                <Badge
                  key={uuidv4()}
                  className="flex items-center gap-2 h-6 whitespace-nowrap"
                >
                  {seq.sequence_name}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-3 w-5 p-0 bg-blue-500 rounded"
                      >
                        <MoreHorizontal className="h-4 w-7" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {}}>
                        <Eye className="mr-2 h-4 w-4" />
                        Détail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedSequence({
                            curriculum_code: curriculum.curriculum_code,
                            sequence_code: seq.sequence_code,
                            sequence_name: seq.sequence_name,
                            sequence_number: seq.sequence_number,
                            description: seq.description ?? "",
                            status_code: seq.status_code,
                          });

                          setIsUpdateSequenceDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Badge>
              ))}
              <Button
                className="text-sm h-6 rounded ml-3"
                variant={"outline"}
                onClick={() => {
                  setIsCreateSequenceDialogOpen(true);
                }}
              >
                <Plus /> Ajouter une sequence
              </Button>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <Separator />
            <Button
              className="text-sm h-6 rounded w-fit my-3 ml-7"
              variant={"outline"}
              onClick={() => {
                setIsCreateDomainDialogOpen(true);
                setSelectedSequenceList(curriculum.training_sequences);
              }}
            >
              <Plus className="h-4 w-4" /> Nouveau domaine
            </Button>
            <CardContent>
              {curriculum.domains.map((domain) => (
                <Collapsible
                  key={domain.domain_code}
                  open={expandedItems.has(domain.domain_code)}
                  onOpenChange={() => toggleExpanded(domain.domain_code)}
                  className="w-full"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 mb-3 gap-2">
                    <CollapsibleTrigger className="flex items-center justify-between w-full md:w-auto">
                      <div className="flex gap-2 items-center">
                        {expandedItems.has(domain.domain_code) ? (
                          <ChevronDown className="w-4" />
                        ) : (
                          <ChevronRight className="w-4" />
                        )}
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{domain.domain_name}</span>
                        {loadingModules.has(domain.domain_code) && (
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="text-sm h-6 rounded"
                        variant={"outline"}
                        onClick={() => {
                          setIsCreateModuleDialogOpen(true);
                          setSelectedSequenceList(curriculum.training_sequences);
                          setSelectedDomain({
                            curriculum_code: domain.curriculum_code,
                            domain_code: domain.domain_code,
                            domain_name: domain.domain_name,
                            description: domain.description ?? "",
                            internal_code: domain.internal_code,
                            sequence_code: domain.sequence_code ?? "",
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Ajouter un module
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDomain({
                            curriculum_code: curriculum.curriculum_code,
                            domain_code: domain.domain_code,
                            domain_name: domain.domain_name,
                            description: domain.description ?? "",
                            internal_code: domain.internal_code,
                            sequence_code: domain.sequence_code ?? "",
                          });
                          setSelectedSequenceList(curriculum.training_sequences);

                          setIsUpdateDomainDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent className="mt-2 ml-6">
                    {loadingModules.has(domain.domain_code) ? null : fetchedModuleList.filter(
                        (mod) => mod.domain_code === domain.domain_code
                      ).length === 0 ? (
                      <div className="text-sm text-muted-foreground p-2">
                        Aucun module pour ce domaine.
                      </div>
                    ) : (
                      fetchedModuleList
                        .filter((mod) => mod.domain_code === domain.domain_code)
                        .map((mod) => (
                          <Collapsible
                            key={mod.module_code}
                            open={expandedModules.has(mod.module_code)}
                            onOpenChange={() => toggleModuleExpanded(mod.module_code)}
                            className="w-full"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full p-2 bg-blue-50 rounded-lg hover:bg-blue-100 mb-2 gap-2">
                              <CollapsibleTrigger className="flex items-center justify-between w-full md:w-auto">
                                <div className="flex gap-2 items-center">
                                  {expandedModules.has(mod.module_code) ? (
                                    <ChevronDown className="w-4" />
                                  ) : (
                                    <ChevronRight className="w-4" />
                                  )}
                                  <span className="font-medium">
                                    {mod.module_name}
                                  </span>
                                  {loadingUE.has(mod.module_code) && (
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                  )}
                                </div>
                              </CollapsibleTrigger>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  className="text-sm h-6 rounded"
                                  variant={"outline"}
                                  onClick={() => {
                                    setSelectedModule({
                                      coefficient: mod.coefficient,
                                      module_code: mod.module_code,
                                      module_name: mod.module_name,
                                      description: mod.description ?? "",
                                      internal_code: mod.internal_code,
                                      domain_code: mod.domain_code,
                                      sequence_code: mod.sequence_code ?? "",
                                    });

                                    setIsCreateUEDialogOpen(true);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" /> Ajouter une UE
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedModule({
                                      coefficient: mod.coefficient,
                                      module_code: mod.module_code,
                                      module_name: mod.module_name,
                                      description: mod.description ?? "",
                                      internal_code: mod.internal_code,
                                      domain_code: mod.domain_code,
                                      sequence_code: mod.sequence_code ?? "",
                                    });

                                    setIsUpdateModuleDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <CollapsibleContent className="mt-2 ml-6">
                              {loadingUE.has(mod.module_code)
                                ? null
                                : fetchedUEList.filter(
                                    (ue) => ue.module_code === mod.module_code
                                  ).length === 0
                                ? (
                                  <div className="text-sm text-muted-foreground p-2">
                                    Aucune UE pour ce module.
                                  </div>
                                ) : (
                                  <UETable
                                    ues={fetchedUEList.filter(
                                      (ue) => ue.module_code === mod.module_code
                                    )}
                                    refresh={refresh}
                                  />
                                )}
                            </CollapsibleContent>
                          </Collapsible>
                        ))
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      




      {(selectedCurriculum && isUpdateCurriculumDialogOpen) && <DialogUpdateCurriculum
        initialData={selectedCurriculum}
        open={isUpdateCurriculumDialogOpen}
        onOpenChange={setIsUpdateCurriculumDialogOpen}
        onUpdate={handleUpdateCurriculum}
      />}

      <DialogCreateSequence
        onOpenChange={setIsCreateSequenceDialogOpen}
        open={isCreateSequenceDialogOpen}
        onSave={handleCreateSequence}
        curriculumCode={curriculum.curriculum_code}
        curriculumName={curriculum?.curriculum_name}
      />
      {(selectedSequence && isUpdateSequenceDialogOpen) && <DialogUpdateSequence
        initialData={selectedSequence}
        open={isUpdateSequenceDialogOpen}
        onOpenChange={setIsUpdateSequenceDialogOpen}
        onUpdate={handleUpdateSequence}
        curriculumCode={curriculum.curriculum_code}
        curriculumName={curriculum?.curriculum_name}
      />}


      <DialogCreateDomain
        curriculumName={curriculum.curriculum_name}
        onOpenChange={setIsCreateDomainDialogOpen}
        open={isCreateDomainDialogOpen}
        onSave={handleCreateDomain}
        sequenceList={selectedSequenceList}
      />
      {(selectedDomain && isUpdateDomainDialogOpen) && <DialogUpdateDomain
        initialData={selectedDomain}
        onOpenChange={setIsUpdateDomainDialogOpen}
        open={isUpdateDomainDialogOpen}
        onUpdate={handleUpdateDomain}
        sequenceList={selectedSequenceList}
        curriculumName={curriculum.curriculum_name}
      />}


      {(selectedDomain && isCreateModuleDialogOpen) && <DialogCreateModule
        onOpenChange={setIsCreateModuleDialogOpen}
        open={isCreateModuleDialogOpen}
        onSave={handleCreateModule}
        domain={selectedDomain}

      />}

      {(selectedModule && isUpdateModuleDialogOpen) && <DialogUpdateModule
        onOpenChange={setIsUpdateModuleDialogOpen}
        initialData={selectedModule}
        open={isUpdateModuleDialogOpen}
        onUpdate={handleUpdateModule}
      />}

      {/* UE Dialogs */}
      {(selectedModule && isCreateUEDialogOpen) && <DialogCreateUE
        module={selectedModule}
        onOpenChange={setIsCreateUEDialogOpen}
        open={isCreateUEDialogOpen}
        onSave={handleCreateUE}
      />}

    </>
  )
}

export default MaquetteCard