'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/types/feedbackTypes';
import { Plus } from 'lucide-react';
import ContentLayout from '@/layout/ContentLayout';
import { FeedbackCampaignCard } from './FeedbackCampaignCard';

interface CampaignsTabContentProps {
  campaigns: Campaign[];
  loading: boolean;
  onViewDetails: (campaign: Campaign) => void;
  onCreateNew: () => void;
}

export function CampaignsTabContent({
  campaigns,
  loading,
  onViewDetails,
  onCreateNew
}: CampaignsTabContentProps) {
  if (loading) {
    return (
      <ContentLayout
        title="Campagnes de feedback"
        description="Planifiez et suivez vos campagnes d'evaluation"
      >
        <div className="text-center py-12">
          <p className="text-slate-600">Chargement des campagnes...</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Campagnes de feedback"
      description="Planifiez et suivez vos campagnes d'evaluation"
      actions={
        <Button onClick={onCreateNew} variant='info'>
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle campagne
        </Button>
      }
    >
      {campaigns.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune campagne</h3>
          <p className="text-slate-500 mb-6">Commencez par creer votre premiere campagne de feedback</p>
          <Button onClick={onCreateNew} variant='info'>
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle campagne
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <FeedbackCampaignCard
              key={campaign.id}
              campaign={campaign}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </ContentLayout>
  );
}
