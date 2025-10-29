import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Campaign } from '@/types/feedbackTypes';
import { BarChart3 } from 'lucide-react';

interface FeedbackCampaignCardProps {
  campaign: Campaign;
  onViewDetails: (campaign: Campaign) => void;
}

export function FeedbackCampaignCard({ campaign, onViewDetails }: FeedbackCampaignCardProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'En cours',
      scheduled: 'Planifiee',
      completed: 'Terminee'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-bold text-slate-900">{campaign.name}</h3>
                <Badge className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(campaign.status)}`}>
                  {getStatusLabel(campaign.status)}
                </Badge>
                {campaign.autoTrigger && (
                  <Badge className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                    Auto
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Debut</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {campaign.startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                {campaign.endDate && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Fin</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {campaign.endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Audience</p>
                  <p className="text-sm font-semibold text-slate-900">{campaign.targetAudience} etudiants</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-600">Progression</p>
                  <p className="text-xs font-bold text-slate-900">
                    {campaign.responseCount} / {campaign.targetAudience} reponses
                  </p>
                </div>
                <Progress
                  value={(campaign.responseCount / campaign.targetAudience) * 100}
                  className="h-2.5 bg-slate-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 [&>div]:shadow-lg [&>div]:shadow-blue-500/50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {((campaign.responseCount / campaign.targetAudience) * 100).toFixed(0)}% de participation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-6 pt-4 border-t border-slate-100">
          <Button
            onClick={() => onViewDetails(campaign)}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Voir les resultats
          </Button>
          {campaign.status === 'active' && (
            <Button variant="secondary" className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200 font-medium">
              Envoyer rappel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
