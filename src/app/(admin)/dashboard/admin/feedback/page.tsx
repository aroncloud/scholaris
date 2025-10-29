/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useMemo } from 'react'
import { Send, Star, CheckCircle2, Calendar, Clock, AlertCircle, ChevronRight, ArrowLeft, Sparkles, Grid3x3, List, ChevronLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import PageHeader from '@/layout/PageHeader'

// Types
type QuestionType = 'multiple_choice' | 'rating' | 'text'
type ViewMode = 'card' | 'table'

interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  required: boolean
}

interface FeedbackForm {
  id: string
  name: string
  description: string
  type: string
  questions: Question[]
}

interface Campaign {
  id: string
  name: string
  formId: string
  form: FeedbackForm
  status: 'active' | 'completed'
  startDate: Date
  endDate?: Date
  description: string
  hasResponded: boolean
}

// CampaignCard Component
const CampaignCard = ({ 
  campaign, 
  onStart 
}: { 
  campaign: Campaign
  onStart: (campaign: Campaign) => void
}) => {
  return (
    <Card className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-slate-900">{campaign.name}</h3>
              {campaign.hasResponded ? (
                <Badge className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                  Complété
                </Badge>
              ) : (
                <Badge className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                  En cours
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-3">{campaign.description}</p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Début: {campaign.startDate.toLocaleDateString('fr-FR')}</span>
              </span>
              {campaign.endDate && (
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Fin: {campaign.endDate.toLocaleDateString('fr-FR')}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">{campaign.form.name}</p>
            <span className="text-xs text-slate-500">{campaign.form.type}</span>
          </div>
          <p className="text-xs text-slate-500">{campaign.form.questions.length} questions</p>
        </div>

        {campaign.hasResponded ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700">Vous avez déjà répondu à ce formulaire</span>
          </div>
        ) : (
          <Button 
            onClick={() => onStart(campaign)} 
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Commencer l'évaluation
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// FeedbackModal Component
const FeedbackModal = ({ 
  open, 
  onClose, 
  campaign 
}: { 
  open: boolean
  onClose: () => void
  campaign: Campaign | null
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [ratingValues, setRatingValues] = useState<{ [key: string]: number }>({})
  const [answers, setAnswers] = useState<{ [key: string]: any }>({})

  if (!campaign) return null

  const currentQuestion = campaign.form.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === campaign.form.questions.length - 1
  const progress = ((currentQuestionIndex + 1) / campaign.form.questions.length) * 100

  const handleRatingClick = (questionId: string, rating: number) => {
    setRatingValues({ ...ratingValues, [questionId]: rating })
    setValue(questionId, rating)
    setAnswers({ ...answers, [questionId]: rating })
  }

  const handleNext = async () => {
    const isValid = await trigger(currentQuestion.id)
    const currentValue = watch(currentQuestion.id)
    
    if (currentQuestion.required && !currentValue) {
      return
    }
    
    if (isValid && currentQuestionIndex < campaign.form.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const onSubmit = (data: any) => {
    console.log('Feedback submitted:', { ...data, ...answers })
    // Reset states
    setCurrentQuestionIndex(0)
    setRatingValues({})
    setAnswers({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{campaign.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{campaign.form.name}</p>
            </div>
            <Badge className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
              Question {currentQuestionIndex + 1}/{campaign.form.questions.length}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Progression</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-slate-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 [&>div]:shadow-lg [&>div]:shadow-blue-500/50"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 min-h-[400px] flex flex-col">
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex items-start space-x-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {currentQuestion.text}
                      {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {currentQuestion.type === 'rating' && 'Cliquez sur les étoiles pour noter'}
                      {currentQuestion.type === 'multiple_choice' && 'Sélectionnez une option'}
                      {currentQuestion.type === 'text' && 'Rédigez votre réponse'}
                    </p>
                  </div>
                </div>

                {/* Rating Question */}
                {currentQuestion.type === 'rating' && (
                  <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingClick(currentQuestion.id, rating)}
                          className="transition-all duration-200 hover:scale-110"
                        >
                          <Star 
                            className={`w-12 h-12 transition-all duration-200 ${
                              (ratingValues[currentQuestion.id] || 0) >= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {ratingValues[currentQuestion.id] && (
                      <p className="text-2xl font-bold text-slate-900">
                        {ratingValues[currentQuestion.id]} / 5
                      </p>
                    )}
                    <input 
                      type="hidden" 
                      {...register(currentQuestion.id, { required: currentQuestion.required })}
                      value={ratingValues[currentQuestion.id] || ''}
                    />
                  </div>
                )}

                {/* Multiple Choice Question */}
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
                      >
                        <input
                          type="radio"
                          {...register(currentQuestion.id, { required: currentQuestion.required })}
                          value={option}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="flex-1 font-medium text-slate-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Text Question */}
                {currentQuestion.type === 'text' && (
                  <div>
                    <Textarea
                      {...register(currentQuestion.id, { required: currentQuestion.required })}
                      placeholder="Entrez votre réponse ici..."
                      rows={8}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                {errors[currentQuestion.id] && (
                  <div className="flex items-center space-x-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-600 font-medium">Cette question est obligatoire</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="secondary"
                className="px-6 py-2.5 text-slate-700 hover:bg-white border border-slate-300 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="secondary"
                  className="px-6 py-2.5 text-slate-700 hover:bg-white border border-slate-300 rounded-lg transition-all duration-200 font-medium"
                >
                  Annuler
                </Button>

                {isLastQuestion ? (
                  <Button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 font-medium flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Soumettre</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 font-medium flex items-center space-x-2"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Main Component
export default function StudentFeedback() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [campaigns] = useState<Campaign[]>([
    {
      id: 'c1',
      name: 'Feedback Session - Introduction à React',
      formId: '1',
      status: 'active',
      startDate: new Date('2024-10-27'),
      endDate: new Date('2024-11-10'),
      description: 'Évaluez la session sur les bases de React et les hooks',
      hasResponded: false,
      form: {
        id: '1',
        name: 'Évaluation de Session de Cours',
        description: 'Évaluation standard post-session',
        type: 'Session de cours',
        questions: [
          { id: 'q1', type: 'rating', text: 'Comment évaluez-vous la qualité globale de cette session ?', required: true },
          { id: 'q2', type: 'rating', text: 'Le contenu était-il clair et bien structuré ?', required: true },
          { id: 'q3', type: 'multiple_choice', text: 'Le rythme de la session était :', options: ['Trop rapide', 'Approprié', 'Trop lent'], required: true },
          { id: 'q4', type: 'text', text: 'Quelles améliorations suggéreriez-vous ?', required: false }
        ]
      }
    },
    {
      id: 'c2',
      name: 'Évaluation Prof. Martin - Semestre 1',
      formId: '2',
      status: 'active',
      startDate: new Date('2024-10-20'),
      endDate: new Date('2024-11-05'),
      description: 'Donnez votre avis sur la pédagogie et la disponibilité du professeur',
      hasResponded: true,
      form: {
        id: '2',
        name: 'Évaluation Instructeur',
        description: 'Évaluation de la performance de l\'instructeur',
        type: 'Instructeur',
        questions: [
          { id: 'q1', type: 'rating', text: 'Clarté des explications', required: true },
          { id: 'q2', type: 'rating', text: 'Engagement et dynamisme', required: true },
          { id: 'q3', type: 'text', text: 'Commentaires additionnels', required: false }
        ]
      }
    },
    {
      id: 'c3',
      name: 'Feedback Session - TypeScript Avancé',
      formId: '1',
      status: 'active',
      startDate: new Date('2024-10-30'),
      endDate: new Date('2024-11-15'),
      description: 'Partagez votre expérience sur les concepts avancés de TypeScript',
      hasResponded: false,
      form: {
        id: '1',
        name: 'Évaluation de Session de Cours',
        description: 'Évaluation standard post-session',
        type: 'Session de cours',
        questions: [
          { id: 'q1', type: 'rating', text: 'Comment évaluez-vous la qualité globale de cette session ?', required: true },
          { id: 'q2', type: 'rating', text: 'Le contenu était-il clair et bien structuré ?', required: true },
          { id: 'q3', type: 'multiple_choice', text: 'Le rythme de la session était :', options: ['Trop rapide', 'Approprié', 'Trop lent'], required: true },
          { id: 'q4', type: 'text', text: 'Quelles améliorations suggéreriez-vous ?', required: false }
        ]
      }
    }
  ])

  const activeCampaigns = useMemo(() => campaigns.filter(c => c.status === 'active'), [campaigns])
  const pendingCampaigns = useMemo(() => activeCampaigns.filter(c => !c.hasResponded), [activeCampaigns])
  const completedCount = useMemo(() => activeCampaigns.filter(c => c.hasResponded).length, [activeCampaigns])

  // Pagination
  const totalPages = Math.ceil(activeCampaigns.length / itemsPerPage)
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return activeCampaigns.slice(startIndex, startIndex + itemsPerPage)
  }, [activeCampaigns, currentPage, itemsPerPage])

  const handleStartFeedback = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setShowFeedbackModal(true)
  }

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false)
    setSelectedCampaign(null)
  }

  return (
    <>
        {/* Header */}
        <PageHeader
            title="Mes Évaluations"
            description="Partagez votre expérience d'apprentissage"
            Icon={Sparkles}
        >
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-3">
                    <div className="text-center">
                        <p className="text-xs font-medium text-slate-600">En attente</p>
                        <p className="text-2xl font-bold text-blue-600">{pendingCampaigns.length}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-xs font-medium text-slate-600">Complétés</p>
                        <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                    </div>
                </div>
            </div>
        </PageHeader>

        {/* Main Content */}
        <div>
            {/* View Toggle - Hidden on mobile */}
            <div className="hidden md:flex items-center justify-between mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900">
                {activeCampaigns.length} évaluation{activeCampaigns.length > 1 ? 's' : ''} disponible{activeCampaigns.length > 1 ? 's' : ''}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                {pendingCampaigns.length} en attente • {completedCount} complété{completedCount > 1 ? 's' : ''}
                </p>
            </div>
            <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1">
                <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
                    viewMode === 'card'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                >
                <Grid3x3 className="w-4 h-4" />
                <span className="text-sm font-medium">Cartes</span>
                </button>
                <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
                    viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">Tableau</span>
                </button>
            </div>
            </div>

            {/* Mobile Title */}
            <div className="md:hidden mb-6">
            <h2 className="text-xl font-bold text-slate-900">
                {activeCampaigns.length} évaluation{activeCampaigns.length > 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
                {pendingCampaigns.length} en attente • {completedCount} complété{completedCount > 1 ? 's' : ''}
            </p>
            </div>

            {/* Card View */}
            {viewMode === 'card' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {paginatedCampaigns.map((campaign) => (
                <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onStart={handleStartFeedback}
                />
                ))}
            </div>
            )}

            {/* Table View - Hidden on mobile */}
            {viewMode === 'table' && (
            <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Campagne</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date limite</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {paginatedCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                        <div>
                            <p className="font-semibold text-slate-900">{campaign.name}</p>
                            <p className="text-sm text-slate-500 mt-1">{campaign.form.name}</p>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <Badge className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                            {campaign.form.type}
                        </Badge>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>{campaign.endDate ? campaign.endDate.toLocaleDateString('fr-FR') : 'Aucune'}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        {campaign.hasResponded ? (
                            <Badge className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                            Complété
                            </Badge>
                        ) : (
                            <Badge className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                            En attente
                            </Badge>
                        )}
                        </td>
                        <td className="px-6 py-4 text-right">
                        {campaign.hasResponded ? (
                            <Button
                            disabled
                            variant="secondary"
                            size="sm"
                            className="px-4 py-2 text-slate-400 cursor-not-allowed"
                            >
                            Déjà répondu
                            </Button>
                        ) : (
                            <Button
                            onClick={() => handleStartFeedback(campaign)}
                            size="sm"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30"
                            >
                            Commencer
                            <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                Page {currentPage} sur {totalPages}
                </p>
                <div className="flex items-center space-x-2">
                <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="secondary"
                    size="sm"
                    className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? 'default' : 'secondary'}
                    size="sm"
                    className={`px-4 py-2 ${
                        currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : ''
                    }`}
                    >
                    {page}
                    </Button>
                ))}
                <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    size="sm"
                    className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
                </div>
            </div>
            )}

            {/* Empty State */}
            {activeCampaigns.length === 0 && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune évaluation disponible</h3>
                <p className="text-slate-500">Revenez plus tard pour de nouvelles évaluations</p>
            </div>
            )}
        </div>

        <FeedbackModal 
            open={showFeedbackModal} 
            onClose={handleCloseFeedback} 
            campaign={selectedCampaign}
        />
    </>
  )
}