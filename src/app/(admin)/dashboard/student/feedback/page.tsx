/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useMemo } from 'react'
import { Clock, AlertCircle, Sparkles, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/layout/PageHeader'
import ContentLayout from '@/layout/ContentLayout'
import { useFeedbackAnswer } from '@/hooks/feature/feedback/useFeedbackAnswer'
import { UIStudentCampaign, UIStudentQuestion } from '@/types/feedbackTypes'
import { transformUIAnswerToAPI } from '@/lib/feedbackTransformers'
import { StudentFeedbackCampaignCard } from '@/components/features/student-feedback/StudentFeedbackCampaignCard'
import { DialogStudentFeedback } from '@/components/features/student-feedback/DialogStudentFeedback'

type ViewMode = 'card' | 'table'

export default function StudentFeedback() {
  const { campaigns, loading, loadFeedbackForm, submitFeedback } = useFeedbackAnswer()
  const [selectedCampaign, setSelectedCampaign] = useState<UIStudentCampaign | null>(null)
  const [feedbackForm, setFeedbackForm] = useState<any>(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const activeCampaigns = useMemo(() => campaigns, [campaigns])
  const pendingCampaigns = useMemo(() => activeCampaigns.filter(c => !c.hasResponded), [activeCampaigns])
  const completedCount = useMemo(() => activeCampaigns.filter(c => c.hasResponded).length, [activeCampaigns])

  // Pagination
  const totalPages = Math.ceil(activeCampaigns.length / itemsPerPage)
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return activeCampaigns.slice(startIndex, startIndex + itemsPerPage)
  }, [activeCampaigns, currentPage, itemsPerPage])

  const handleStartFeedback = async (campaign: UIStudentCampaign) => {
    setSelectedCampaign(campaign)
    const form = await loadFeedbackForm(campaign.responseCode)
    if (form) {
      setFeedbackForm(form)
      setShowFeedbackDialog(true)
    }
  }

  const handleCloseFeedback = () => {
    setShowFeedbackDialog(false)
    setSelectedCampaign(null)
    setFeedbackForm(null)
  }

  const handleSubmitFeedback = async (answers: Record<string, any>) => {
    if (!selectedCampaign || !feedbackForm) return

    const apiAnswers = feedbackForm.questions.map((question: UIStudentQuestion) => {
      const answer = answers[question.id]
      return transformUIAnswerToAPI(question.id, question.type, answer)
    })

    await submitFeedback(selectedCampaign.responseCode, apiAnswers)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
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

      <ContentLayout
        title={`${activeCampaigns.length} évaluation${activeCampaigns.length > 1 ? 's' : ''} disponible${activeCampaigns.length > 1 ? 's' : ''}`}
        description={`${pendingCampaigns.length} en attente • ${completedCount} complété${completedCount > 1 ? 's' : ''}`}
        actions={
          <div className="hidden md:flex items-center justify-between mb-6">
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
        }
        className='p-3 md:p-6'
      >
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Chargement des évaluations...</p>
          </div>
        ) : (
          <>
            {/* Card View */}
            {viewMode === 'card' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {paginatedCampaigns.map((campaign) => (
                  <StudentFeedbackCampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onStart={handleStartFeedback}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Campagne</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Formulaire</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date limite</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{campaign.campaignTitle}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">{campaign.formTitle}</p>
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
          </>
        )}
      </ContentLayout>

      <DialogStudentFeedback
        open={showFeedbackDialog}
        onOpenChange={handleCloseFeedback}
        campaign={selectedCampaign}
        feedbackForm={feedbackForm}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  )
}
