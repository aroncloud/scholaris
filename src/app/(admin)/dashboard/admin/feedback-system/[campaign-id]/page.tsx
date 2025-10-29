'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useFeedbackCampaigns } from '@/hooks/feature/feedback/useFeedbackCampaigns'
import CampaignDetailsPage from '@/components/features/feedback-system/CampaignDetailsPage'
import { IGetCampaignDetail } from '@/types/feedbackTypes'

export default function CampaignDetailsPageWrapper() {
  const params = useParams()
  const campaignId = params['campaign-id'] as string
  const { loadCampaignReport } = useFeedbackCampaigns()
  const [campaignData, setCampaignData] = useState<IGetCampaignDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (campaignId) {
        setLoading(true)
        const data = await loadCampaignReport(campaignId)
        setCampaignData(data)
        setLoading(false)
      }
    }

    loadData()
  }, [campaignId, loadCampaignReport])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du rapport de campagne...</p>
        </div>
      </div>
    )
  }

  if (!campaignData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Campagne non trouvee</h2>
          <p className="text-slate-500">Impossible de charger les donnees de cette campagne</p>
        </div>
      </div>
    )
  }

  return <CampaignDetailsPage data={campaignData} />
}
