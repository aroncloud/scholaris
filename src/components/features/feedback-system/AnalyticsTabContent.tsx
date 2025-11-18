'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Campaign } from '@/types/feedbackTypes';
import { Send, Users, TrendingUp, Star } from 'lucide-react';
import ContentLayout from '@/layout/ContentLayout';

interface AnalyticsTabContentProps {
  campaigns: Campaign[];
  onViewDetails: (campaign: Campaign) => void;
}

export function AnalyticsTabContent({
  campaigns,
  onViewDetails
}: AnalyticsTabContentProps) {
  return (
    <ContentLayout
      title="Analytics & Insights"
      description="Analysez les tendances et performances"
      actions={
        <div className="flex items-center space-x-3 justify-between">
          <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Ce mois</option>
            <option>3 derniers mois</option>
            <option>Cette année</option>
          </select>
          <Button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 font-medium">
            Exporter PDF
          </Button>
        </div>
      }
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Campagnes</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{campaigns.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Réponses</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {campaigns.reduce((sum, c) => sum + c.responseCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Taux Moyen</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {Math.round(campaigns.reduce((sum, c) => sum + (c.responseCount / c.targetAudience * 100), 0) / campaigns.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Score Moyen</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">4.2 / 5</p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-700 fill-yellow-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Campaigns Analytics Table */}
      <Card className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Performance des Campagnes</h3>
          <p className="text-sm text-slate-500 mt-1">Cliquez sur une campagne pour voir les détails</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Campagne</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Réponses</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Participation</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Score Moyen</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {campaigns.map((campaign) => {
                const participationRate = (campaign.responseCount / campaign.targetAudience) * 100;
                return (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{campaign.name}</p>
                        <p className="text-sm text-slate-500">{campaign.formName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        campaign.status === 'active'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : campaign.status === 'completed'
                          ? 'bg-gray-100 text-gray-700 border-gray-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {campaign.status === 'active' ? 'En cours' : campaign.status === 'completed' ? 'Terminée' : 'Planifiée'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {campaign.responseCount} / {campaign.targetAudience}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 justify-between">
                        <div className="flex-1 max-w-[120px]">
                          <Progress
                            value={participationRate}
                            className="h-2 bg-slate-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600"
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 min-w-[45px]">
                          {participationRate.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-slate-900">
                          {(Math.random() * 1.5 + 3.5).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => onViewDetails(campaign)}
                        size="sm"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg shadow-blue-500/30"
                      >
                        Voir détails
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </ContentLayout>
  );
}
