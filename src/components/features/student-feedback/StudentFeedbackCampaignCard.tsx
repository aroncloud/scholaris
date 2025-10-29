import React from 'react';
import { CheckCircle2, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { UIStudentCampaign } from '@/types/feedbackTypes';

interface StudentFeedbackCampaignCardProps {
  campaign: UIStudentCampaign;
  onStart: (campaign: UIStudentCampaign) => void;
}

export function StudentFeedbackCampaignCard({ campaign, onStart }: StudentFeedbackCampaignCardProps) {
  return (
    <Card className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-slate-900">{campaign.campaignTitle}</h3>
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
            <p className="text-sm text-slate-500 mb-3">{campaign.formTitle}</p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              {campaign.endDate && (
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Fin: {campaign.endDate.toLocaleDateString('fr-FR')}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {campaign.hasResponded ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700">
              Vous avez déjà répondu à ce formulaire
            </span>
          </div>
        ) : (
          <Button
            onClick={() => onStart(campaign)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Commencer l&apos;évaluation
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
