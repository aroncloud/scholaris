'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Target,
  Users,
  Star,
  BarChart3,
  MessageSquare,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Badge from '@/components/custom-ui/Badge'
import { Card, CardContent } from '@/components/ui/card'
import PageHeader from '@/layout/PageHeader'
import ContentLayout from '@/layout/ContentLayout'
import { useRouter } from 'next/navigation'
import {
  IGetCampaignDetail,
  ICampaignDetails,
  INumericScaleResult,
  IMultipleChoiceResult,
  IQualitativeResult
} from '@/types/feedbackTypes';
import StatCard from '@/components/cards/StatCard'

// Status Badge Component
const StatusBadge = ({ status }: { status: ICampaignDetails['status'] }) => {
  const configs = {
    PLANNED: {
      label: 'Planifiée',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Clock
    },
    ONGOING: {
      label: 'En cours',
      className: 'bg-green-100 text-green-700 border-green-200',
      icon: TrendingUp
    },
    COMPLETED: {
      label: 'Terminée',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: CheckCircle2
    },
    CANCELLED: {
      label: 'Annulée',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: AlertCircle
    }
  }

  const config = configs[status]
  const Icon = config.icon
  //<Badge size="sm" value={row.status_code} label={row.status_code} />) }
  return (
    <Badge icon={Icon} label={config.label} size='sm' value={status}/>
  )
}

// Numeric Scale Card Component
const NumericScaleCard = ({ result }: { result: INumericScaleResult }) => {
  const [expanded, setExpanded] = useState(true)

  const getDistribution = () => {
    const dist: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    const avg = result.average_score
    const total = result.response_count

    if (avg >= 4) {
      dist[5] = Math.floor(total * 0.5)
      dist[4] = Math.floor(total * 0.3)
      dist[3] = Math.floor(total * 0.15)
      dist[2] = Math.floor(total * 0.03)
      dist[1] = total - dist[5] - dist[4] - dist[3] - dist[2]
    } else if (avg >= 3) {
      dist[4] = Math.floor(total * 0.4)
      dist[3] = Math.floor(total * 0.35)
      dist[5] = Math.floor(total * 0.15)
      dist[2] = Math.floor(total * 0.07)
      dist[1] = total - dist[5] - dist[4] - dist[3] - dist[2]
    } else {
      dist[3] = Math.floor(total * 0.4)
      dist[2] = Math.floor(total * 0.3)
      dist[4] = Math.floor(total * 0.2)
      dist[1] = Math.floor(total * 0.07)
      dist[5] = total - dist[4] - dist[3] - dist[2] - dist[1]
    }

    return dist
  }

  const distribution = getDistribution()

  return (
    <Card className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-0">
        {/* Header - Always visible */}
        <div 
          className=" cursor-pointer transition-colors duration-200"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white font-bold shadow-lg shadow-blue-500/30 flex-shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{result.question_text}</h4>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{result.response_count} réponses</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Score moyen - Toujours visible */}
            <div className="flex items-center space-x-4 ml-4">
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(result.average_score)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {result.average_score.toFixed(1)}<span className="text-lg text-slate-500">/5</span>
                </p>
              </div>
              <button className=" hover:bg-slate-100 rounded-lg transition-colors">
                {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Distribution - Collapsible */}
        {expanded && (
          <div className="pb-3 mt-2 pt-2 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-4">Distribution détaillée</p>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating]
                const percentage = (count / result.response_count) * 100
                return (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 w-16 flex-shrink-0">
                      <span className="text-sm font-semibold text-slate-700">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-28 text-right flex-shrink-0">
                      <span className="text-sm font-semibold text-slate-700">{count}</span>
                      <span className="text-xs text-slate-500 ml-1">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Multiple Choice Card Component
const MultipleChoiceCard = ({ result }: { result: IMultipleChoiceResult }) => {
  const totalResponses = result.distribution.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-200">
      <CardContent>
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white font-bold shadow-lg shadow-purple-500/30 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-slate-900">{result.question_text}</h4>
            <div className="flex items-center space-x-1 text-sm text-slate-500">
              <Users className="w-4 h-4" />
              <span>{totalResponses} réponses</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {result.distribution.map((item, idx) => {
            const percentage = (item.count / totalResponses) * 100
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 truncate flex-1 mr-4">{item.option}</span>
                  <span className="text-sm font-semibold text-slate-900 flex-shrink-0">
                    {item.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Qualitative Results Component
const QualitativeResults = ({ results }: { results: IQualitativeResult[] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [answersPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({})

  const groupedByQuestion = results.reduce((acc, result) => {
    if (!acc[result.question_code]) {
      acc[result.question_code] = {
        question_text: result.question_text,
        answers: []
      }
    }
    acc[result.question_code].answers.push(result.answer)
    return acc
  }, {} as { [key: string]: { question_text: string; answers: string[] } })

  const filterAnswers = (answers: string[]) => {
    if (!searchTerm.trim()) return answers
    return answers.filter(answer => 
      answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getPaginatedAnswers = (questionCode: string, answers: string[]) => {
    const page = currentPage[questionCode] || 1
    const filteredAnswers = filterAnswers(answers)
    const startIndex = (page - 1) * answersPerPage
    const endIndex = startIndex + answersPerPage
    return {
      answers: filteredAnswers.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredAnswers.length / answersPerPage),
      totalFiltered: filteredAnswers.length,
      currentPage: page
    }
  }

  const changePage = (questionCode: string, newPage: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [questionCode]: newPage
    }))
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher dans les commentaires..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage({}) // Reset pagination on search
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          </div>
          {searchTerm && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setCurrentPage({})
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {Object.entries(groupedByQuestion).map(([questionCode, data]) => {
          const { answers, totalPages, totalFiltered, currentPage: page } = getPaginatedAnswers(questionCode, data.answers)
          const hasResults = answers.length > 0

          return (
            <Card key={questionCode} className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-200 pt-4 pb-0">
              <CardContent className="p-0">
                {/* Header */}
                <div className="pb-2 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white font-bold shadow-lg shadow-green-500/30 flex-shrink-0">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-slate-900 mb-2 pr-4">{data.question_text}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{data.answers.length} réponses</span>
                          </span>
                          {searchTerm && totalFiltered !== data.answers.length && (
                            <span className="flex items-center space-x-1 text-blue-600">
                              <Filter className="w-4 h-4" />
                              <span>{totalFiltered} résultats filtrés</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answers */}
                <div className="pt-4">
                  {hasResults ? (
                    <>
                      <div className="space-y-3 mb-6">
                        {answers.map((answer, idx) => {
                          const globalIndex = (page - 1) * answersPerPage + idx + 1
                          return (
                            <div key={idx} className="p-2 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-bold text-blue-600">#{globalIndex}</span>
                                </div>
                                <p className="text-sm text-slate-700 flex-1 leading-relaxed">
                                  {searchTerm ? (
                                    <span dangerouslySetInnerHTML={{
                                      __html: answer.replace(
                                        new RegExp(searchTerm, 'gi'),
                                        match => `<mark class="bg-yellow-200 text-slate-900 px-1 rounded">${match}</mark>`
                                      )
                                    }} />
                                  ) : (
                                    answer
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                          <p className="text-sm text-slate-600">
                            Page {page} sur {totalPages} • {totalFiltered} réponse{totalFiltered > 1 ? 's' : ''}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => changePage(questionCode, page - 1)}
                              disabled={page === 1}
                            >
                              Précédent
                            </Button>
                            
                            {/* Page numbers */}
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 5) {
                                  pageNum = i + 1
                                } else if (page <= 3) {
                                  pageNum = i + 1
                                } else if (page >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i
                                } else {
                                  pageNum = page - 2 + i
                                }

                                return (
                                  <button
                                    key={i}
                                    onClick={() => changePage(questionCode, pageNum)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                                      pageNum === page
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                )
                              })}
                            </div>

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => changePage(questionCode, page + 1)}
                              disabled={page === totalPages}
                            >
                              Suivant
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">
                        {searchTerm 
                          ? `Aucun résultat trouvé pour "${searchTerm}"`
                          : 'Aucune réponse disponible'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Main Component
export default function CampaignDetailsPage({ data }: { data: IGetCampaignDetail }) {
  const router = useRouter()
  const { campaign_details, summary, quantitative_results, qualitative_results } = data

  const hasQuantitativeResults = quantitative_results.numeric_scale.length > 0 || quantitative_results.multiple_choice.length > 0
  const hasQualitativeResults = qualitative_results.length > 0
  const hasAnyResults = hasQuantitativeResults || hasQualitativeResults

  return (
    <>
      <PageHeader
        title="Résumé de la campagne"
        description={`Analyse détaillée de la campagne • ${summary.total_responses} réponses collectées`}
        backUrl='/dashboard/admin/feedback-system'
        Icon={MessageSquare}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" className="flex-shrink-0">
            <Share2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Partager</span>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Exporter le rapport</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </PageHeader>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Campaign Info Header */}
        <Card className="border-blue-200 overflow-hidden">
          <CardContent className="">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="text-right sm:text-left">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Titre de la campagne</p>
                <p className="text-xs sm:text-lg font-mono font-semibold text-slate-900 break-all">{campaign_details.title}</p>
              </div>
              <StatusBadge status={campaign_details.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

              <StatCard title="Début"
                value={new Date(campaign_details.start_date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                  
                })}
               icon={Calendar}
               variant="info"
               compact
              />
              <StatCard 
                title="Fin" 
                value={new Date(campaign_details.end_date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
                icon={Clock} 
                variant="purple" 
                compact
              />
              <StatCard 
              title="Réponses" 
              value={summary.total_responses} 
              icon={Users} 
              variant="success" 
              main
              />
              <StatCard 
              title="Niveau" 
              value={campaign_details.target_level_code} 
              icon={Target} 
              variant="neutral" 
              compact />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview - Visible seulement si des résultats existent */}
        {hasAnyResults && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Questions notées"
              value={quantitative_results.numeric_scale.length}
              icon={Star}
              variant="info"
            />

            <StatCard
              title="Choix multiples"
              value={quantitative_results.multiple_choice.length}
              icon={CheckCircle2}
              variant="purple"
            />

            <StatCard
              title="Avis textuels"
              value={qualitative_results.length}
              icon={MessageSquare}
              variant="success"
            />
          </div>
        )}

        {/* Quantitative Results - Numeric Scale */}
        {quantitative_results.numeric_scale.length > 0 && (
          <ContentLayout
            title="Résultats quantitatifs - Échelles de notation"
            description={`${quantitative_results.numeric_scale.length} question${quantitative_results.numeric_scale.length > 1 ? 's' : ''} avec notation de 1 à 5 étoiles`}
          >
            <div className="space-y-4">
              {quantitative_results.numeric_scale.map((result) => (
                <NumericScaleCard key={result.question_code} result={result} />
              ))}
            </div>
          </ContentLayout>
        )}

        {/* Quantitative Results - Multiple Choice */}
        {quantitative_results.multiple_choice.length > 0 && (
          <ContentLayout
            title="Résultats quantitatifs - Choix multiples"
            description={`${quantitative_results.multiple_choice.length} question${quantitative_results.multiple_choice.length > 1 ? 's' : ''} à choix multiples avec distribution des réponses`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {quantitative_results.multiple_choice.map((result) => (
                <MultipleChoiceCard key={result.question_code} result={result} />
              ))}
            </div>
          </ContentLayout>
        )}

        {/* Qualitative Results */}
        {qualitative_results.length > 0 && (
          <ContentLayout
            title="Résultats qualitatifs"
            description={`${qualitative_results.length} commentaire${qualitative_results.length > 1 ? 's' : ''} détaillé${qualitative_results.length > 1 ? 's' : ''} des participants`}
          >
            <QualitativeResults results={qualitative_results} />
          </ContentLayout>
        )}

        {/* Empty State - Plus visible et informatif */}
        {!hasAnyResults && (
          <Card className="bg-white border-2 border-dashed border-slate-300">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucune donnée disponible</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                Les résultats de cette campagne seront disponibles une fois que des réponses auront été collectées par les participants.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="secondary" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux campagnes
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager la campagne
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}