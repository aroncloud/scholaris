'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Calendar, ChevronDown, ChevronRight, Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { ICreateCurriculum, ICreateDomain, ICreateModule, ICreateSemester, ICreateUE, ICurriculumDetail, IModulePerDomain, IUEPerModuleList } from '@/types/programTypes'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { v4 as uuidv4 } from 'uuid'
import { Badge } from '../ui/badge'
import { getStatusColor } from '@/lib/utils'
import { createDomain, createModule, createSemester, createUE, getModuleListPerDomain, getUEListPerModule, updateCurriculum, updateDomain, updateModule, updateSemester, updateUE } from '@/actions/programsAction'
import UETable from '../tables/UETable'
import { showToast } from '../ui/showToast'
import { DialogUpdateCurriculum } from '../features/programs/Modal/DialogUpdateCurriculum' 

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
  const [fetchedUEList, setFetchedUEList] = useState<IUEPerModuleList[]>([])
  const [loadingModules, setLoadingModules] = useState<Set<string>>(new Set())
  const [loadingUE, setLoadingUE] = useState<Set<string>>(new Set())
  const [selectedCurriculum, setSelectedCurriculum] = useState<ICreateCurriculum | null>(null);
  
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
  const [isCreateSequenceDialogOpen, setIsCreateSequenceDialogOpen] = useState(false);
  const [isUpdateSequenceDialogOpen, setIsUpdateSequenceDialogOpen] = useState(false);

  // ---- UE ----
  const [selectedUE, setSelectedUE] = useState<ICreateUE | null>(null);
  const [isCreateUEDialogOpen, setIsCreateUEDialogOpen] = useState(false);
  const [isUpdateUEDialogOpen, setIsUpdateUEDialogOpen] = useState(false);

  
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
            description: result.code,
            position: 'top-center',
        })
      }
    }  
  }

  // --- Domain ---
  const handleCreateDomain = async (domain: ICreateDomain) => {
    const result = await createDomain(domain);
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
        description: result.code,
        position: 'top-center',
      });
    }
  };

  const handleUpdateDomain = async (domain: ICreateDomain) => {
    const result = await updateDomain(domain);
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
        description: result.code,
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
        description: result.code,
        position: 'top-center',
      });
    }
  };

  const handleUpdateSequence = async (sequence: ICreateSemester) => {
    const result = await updateSemester(sequence);
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
        description: result.code,
        position: 'top-center',
      });
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
        description: result.code,
        position: 'top-center',
      });
    }
  };

  const handleUpdateUE = async (ue: ICreateUE) => {
    const result = await updateUE(ue);
    console.log("Update UE result:", result);

    if (result.code === 'success') {
      setIsUpdateUEDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'UE mise à jour avec succès',
        description: `${ue.course_unit_name} a été modifiée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour l'UE",
        description: result.code,
        position: 'top-center',
      });
    }
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
        description: result.code,
        position: 'top-center',
      });
    }
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
        description: result.code,
        position: 'top-center',
      });
    }
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
            <div className="flex items-center justify-between">
              <div>
                <CollapsibleTrigger asChild>
                  <div className='flex items-center'>
                    <Button variant="ghost" size="sm" className="h-10 -ml-3 w-auto">
                      {isCardExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <CardTitle className="text-lg text-blue-900 cursor-pointer">{curriculum.curriculum_name}</CardTitle>
                  </div>
                </CollapsibleTrigger>
                <CardDescription>
                  <div className="flex items-center gap-4 my-1">
                    <span>Filière: {programName}</span>
                    <span>|</span>
                    <span>Année académique: {new Date().getFullYear()}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(curriculum.status_code)}>{curriculum.status_code}</Badge>
                <Button className="text-sm h-[22px] rounded" variant={'outline-info'}>
                  <Plus className="h-4 w-4" /> Nouveau domaine
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedCurriculum({
                    curriculum_code: curriculum.curriculum_code,
                    curriculum_name: curriculum.curriculum_name,
                    program_code: curriculum.program.program_code,
                    study_level: curriculum.study_level,
                    status_code: curriculum.status_code,
                  });
                  setIsUpdateCurriculumDialogOpen(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm space-x-1 flex items-center">
              {curriculum.training_sequences.map((seq) => (
                <Badge key={uuidv4()}>{seq.sequence_name}</Badge>
              ))}
              <Button className="text-sm h-[22px] rounded ml-3" variant={'outline-info'}>
                <Plus /> Ajouter une sequence
              </Button>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent>
              {/* Contenu des domaines */}
              {curriculum.domains.map((domain) => (
                <Collapsible
                  key={domain.domain_code}
                  open={expandedItems.has(domain.domain_code)}
                  onOpenChange={() => toggleExpanded(domain.domain_code)}
                  className="w-full"
                >
                  {/* Domaine */}
                  <div className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 mb-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <div className="flex gap-2 items-center">
                        {expandedItems.has(domain.domain_code) ? (
                          <ChevronDown className="w-4" />
                        ) : (
                          <ChevronRight className="w-4" />
                        )}
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{domain.domain_name}</span>
                        {loadingModules.has(domain.domain_code) && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      </div>
                    </CollapsibleTrigger>
                    <div className="flex items-center gap-2">
                      <Button className="text-sm h-[22px] rounded ml-3" variant={'outline-info'}>
                        <Plus className="h-4 w-4 mr-1" /> Ajouter un module
                      </Button>
                    </div>
                  </div>

                  {/* Modules */}
                  <CollapsibleContent className="mt-2 ml-6">
                    {loadingModules.has(domain.domain_code) ? null : fetchedModuleList.filter((mod) => mod.domain_code === domain.domain_code).length === 0 ? (
                      <div className="text-sm text-muted-foreground p-2">Aucun module pour ce domaine.</div>
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
                            <div className="flex items-center justify-between w-full p-2 bg-blue-50 rounded-lg hover:bg-blue-100 mb-2">
                              <CollapsibleTrigger className="flex items-center justify-between w-full">
                                <div className="flex gap-2 items-center">
                                  {expandedModules.has(mod.module_code) ? (
                                    <ChevronDown className="w-4" />
                                  ) : (
                                    <ChevronRight className="w-4" />
                                  )}
                                  <span className="font-medium">{mod.module_name}</span>
                                  {loadingUE.has(mod.module_code) && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                                </div>
                              </CollapsibleTrigger>
                              <Button className="text-sm h-[22px] rounded ml-3" variant={'outline-info'}>
                                <Plus className="h-4 w-4 mr-1" /> Ajouter une UE
                              </Button>
                            </div>

                            {/* UE */}
                            <CollapsibleContent className="mt-2 ml-6">
                              {loadingUE.has(mod.module_code) ? null : fetchedUEList.filter((ue) => ue.module_code === mod.module_code).length === 0 ? (
                                <div className="text-sm text-muted-foreground p-2">Aucune UE pour ce module.</div>
                              ) : (
                                <UETable
                                  ues={fetchedUEList.filter((ue) => ue.module_code === mod.module_code)}
                                  onEdit={(ue) => {}}
                                  onDelete={(ue) => {}}
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
      

      {selectedCurriculum && <DialogUpdateCurriculum
        initialData={selectedCurriculum}
        open={isUpdateCurriculumDialogOpen}
        onOpenChange={setIsUpdateCurriculumDialogOpen}
        onUpdate={handleUpdateCurriculum}
      />}
    </>
  )
}

export default MaquetteCard