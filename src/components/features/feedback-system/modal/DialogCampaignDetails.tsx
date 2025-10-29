/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign, QuestionAnalytics } from "@/types/feedbackTypes";
import { X, Star, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DialogCampaignDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
}

export function DialogCampaignDetails({
  open,
  onOpenChange,
  campaign,
}: DialogCampaignDetailsProps) {
  if (!campaign || !campaign.form) return null;

  // Mock analytics data - TODO: Replace with real API call
  const mockAnalytics = {
    questions: campaign.form.questions.map((q) => {
      if (q.type === 'rating') {
        return {
          question: q.text,
          type: 'rating' as const,
          average: (Math.random() * 1.5 + 3.5).toFixed(1),
          distribution: {
            1: Math.floor(Math.random() * 5),
            2: Math.floor(Math.random() * 10),
            3: Math.floor(Math.random() * 20),
            4: Math.floor(Math.random() * 30) + 20,
            5: Math.floor(Math.random() * 30) + 20
          }
        };
      } else if (q.type === 'multiple_choice' && q.options) {
        const total = campaign.responseCount;
        return {
          question: q.text,
          type: 'multiple_choice' as const,
          responses: q.options.map((opt) => ({
            option: opt,
            count: Math.floor(Math.random() * total),
            percentage: Math.floor(Math.random() * 100)
          }))
        };
      } else {
        return {
          question: q.text,
          type: 'text' as const,
          responses: [
            'Très bonne session, contenu clair et bien expliqué',
            'J\'aurais aimé plus d\'exemples pratiques',
            'Excellent cours, le formateur est très pédagogue',
            'Manque un peu de temps pour les exercices'
          ]
        };
      }
    })
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{campaign.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{campaign.formName}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-slate-600 mb-1">Réponses</p>
              <p className="text-2xl font-bold text-slate-900">{campaign.responseCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-slate-600 mb-1">Taux</p>
              <p className="text-2xl font-bold text-blue-600">
                {((campaign.responseCount / campaign.targetAudience) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-slate-600 mb-1">Score Moyen</p>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <p className="text-2xl font-bold text-slate-900">
                  {(Math.random() * 1.5 + 3.5).toFixed(1)}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-slate-600 mb-1">Statut</p>
              <Badge className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                campaign.status === 'active'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : campaign.status === 'completed'
                  ? 'bg-gray-100 text-gray-700 border-gray-200'
                  : 'bg-blue-100 text-blue-700 border-blue-200'
              }`}>
                {campaign.status === 'active' ? 'En cours' : campaign.status === 'completed' ? 'Terminée' : 'Planifiée'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          <div className="space-y-6">
            {mockAnalytics.questions.map((qAnalytics: QuestionAnalytics, index: number) => (
              <Card key={index} className="bg-white border border-slate-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg text-blue-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 flex-1">{qAnalytics.question}</h4>
                    </div>
                  </div>

                  {/* Rating Analytics */}
                  {qAnalytics.type === 'rating' && qAnalytics.average && qAnalytics.distribution && (
                    <div>
                      <div className="flex items-center justify-center mb-6">
                        <div className="text-center">
                          <p className="text-5xl font-bold text-slate-900 mb-2">{qAnalytics.average}</p>
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 ${
                                  star <= Math.round(parseFloat(qAnalytics.average || '0'))
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-slate-500">Score moyen</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = qAnalytics.distribution![rating];
                          const percentage = (count / campaign.responseCount) * 100;
                          return (
                            <div key={rating} className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 w-16">
                                <span className="text-sm font-semibold text-slate-700">{rating}</span>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              </div>
                              <div className="flex-1">
                                <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                              <div className="w-20 text-right">
                                <span className="text-sm font-semibold text-slate-700">{count}</span>
                                <span className="text-xs text-slate-500 ml-1">({percentage.toFixed(0)}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Multiple Choice Analytics */}
                  {qAnalytics.type === 'multiple_choice' && Array.isArray(qAnalytics.responses) && (
                    <div className="space-y-3">
                      {qAnalytics.responses.map((resp: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700">{resp.option}</span>
                              <span className="text-sm font-semibold text-slate-900">
                                {resp.count} ({resp.percentage}%)
                              </span>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                                style={{ width: `${resp.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text Responses */}
                  {qAnalytics.type === 'text' && Array.isArray(qAnalytics.responses) && (
                    <div className="space-y-3">
                      {qAnalytics.responses.slice(0, 4).map((response: string, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-slate-700 flex-1">{response}</p>
                          </div>
                        </div>
                      ))}
                      <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        Voir toutes les réponses ({campaign.responseCount})
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => onOpenChange(false)}
              variant="secondary"
              className="px-6 py-2.5"
            >
              Fermer
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                className="px-6 py-2.5"
              >
                Télécharger le rapport
              </Button>
              <Button
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
              >
                Exporter les données
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
