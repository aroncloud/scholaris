import { useState, useEffect, useCallback } from 'react';
import {
  listFeedbackCampaigns as apiListCampaigns,
  getCampaignReport as apiGetCampaignReport
} from '@/actions/feedbackAction';
import { Campaign, IGetCampaignDetail } from '@/types/feedbackTypes';
import { transformAPICampaignListToUI } from '@/lib/feedbackTransformers';
import { showToast } from '@/components/ui/showToast';

export function useFeedbackCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load campaigns list
  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiListCampaigns();

      if (result.code === 'success' && result.data) {
        console.log('Loaded campaigns:', result.data.body);
        const transformedCampaigns = result.data.body.map(transformAPICampaignListToUI);
        setCampaigns(transformedCampaigns);
      } else {
        setError(result.error || 'Erreur lors du chargement des campagnes');
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: 'Impossible de charger les campagnes',
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Error loading campaigns:', err);
      setError('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load campaign report/details
  const loadCampaignReport = useCallback(async (campaignCode: string): Promise<IGetCampaignDetail | null> => {
    try {
      const result = await apiGetCampaignReport(campaignCode);

      if (result.code === 'success' && result.data) {
        console.log('Loaded campaign report:', result.data.body);
        return result.data.body;
      }

      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de charger le rapport de la campagne',
        position: 'top-center',
      });

      return null;
    } catch (err) {
      console.error('Error loading campaign report:', err);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de charger le rapport de la campagne',
        position: 'top-center',
      });
      return null;
    }
  }, []);

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return {
    campaigns,
    loading,
    error,
    loadCampaigns,
    loadCampaignReport
  };
}
