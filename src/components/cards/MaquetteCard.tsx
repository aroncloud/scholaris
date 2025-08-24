'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Calendar, ChevronDown, ChevronRight, Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { ICurriculumDetail, IModulePerDomain, IUEPerModuleList } from '@/types/programTypes'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { v4 as uuidv4 } from 'uuid'
import { Badge } from '../ui/badge'
import { getStatusColor } from '@/lib/utils'
import { getModuleListPerDomain, getUEListPerModule } from '@/actions/programsAction'
import UETable from '../tables/UETable'

type MyComponentProps = {
  curriculum: ICurriculumDetail
  programName: string
}

const MaquetteCard = ({ curriculum, programName }: MyComponentProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [fetchedModuleList, setFetchedModuleList] = useState<IModulePerDomain[]>([])
  const [fetchedUEList, setFetchedUEList] = useState<IUEPerModuleList[]>([])
  const [loadingModules, setLoadingModules] = useState<Set<string>>(new Set())
  const [loadingUE, setLoadingUE] = useState<Set<string>>(new Set())

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
    <Card className="border-l-4 border-l-blue-500 gap-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-blue-900">{curriculum.curriculum_name}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4 my-1">
                <span>Filière: {programName}</span>
                <span>|</span>
                <span>Année académique: {new Date().getFullYear()}</span>
              </div>
              <div className="text-sm space-x-1 flex items-center">
                {curriculum.training_sequences.map((seq) => (
                  <Badge key={uuidv4()}>{seq.sequence_name}</Badge>
                ))}
                <Button className="text-sm h-[22px] rounded ml-3" variant={'outline-info'}>
                  <Plus /> Ajouter une sequence
                </Button>
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(curriculum.status_code)}>{curriculum.status_code}</Badge>
            <Button className="text-sm h-[22px] rounded ml-3" variant={'outline-info'}>
              <Plus className="h-4 w-4" /> Nouveau domaine
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
    </Card>
  )
}

export default MaquetteCard
