import { useState, useEffect, useCallback } from 'react';
import {
  getAvailableFeedbackForStudent,
  getFeedbackFormFromResponse,
  submitResponse as apiSubmitResponse
} from '@/actions/feedbackAction';
import {
  UIStudentCampaign,
  UIStudentFeedbackForm,
  ISubmitResponse
} from '@/types/feedbackTypes';
import {
  transformAPICampaignToUI,
  transformAPIStudentFormToUI
} from '@/lib/feedbackTransformers';
import { showToast } from '@/components/ui/showToast';

export function useFeedbackAnswer() {
  const [campaigns, setCampaigns] = useState<UIStudentCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAvailableFeedbackForStudent();

      if (result.code === 'success' && result.data) {
        console.log('Loaded campaigns:', result.data.body);
        const transformedCampaigns = result.data.body.map(transformAPICampaignToUI);
        setCampaigns(transformedCampaigns);
      } else {
        setError(result.error || 'Erreur lors du chargement des evaluations');
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: 'Impossible de charger les evaluations',
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Error loading campaigns:', err);
      setError('Erreur lors du chargement des evaluations');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeedbackForm = useCallback(async (responseCode: string): Promise<UIStudentFeedbackForm | null> => {
    try {
      const result = await getFeedbackFormFromResponse(responseCode);

      if (result.code === 'success' && result.data) {
        console.log('Loaded feedback form:', result.data.body);
        return transformAPIStudentFormToUI(result.data.body);
      }

      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de charger le formulaire',
        position: 'top-center',
      });

      return null;
    } catch (err) {
      console.error('Error loading feedback form:', err);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de charger le formulaire',
        position: 'top-center',
      });
      return null;
    }
  }, []);

  const submitFeedback = useCallback(async (
    responseCode: string,
    answers: ISubmitResponse[]
  ): Promise<boolean> => {
    try {
      const result = await apiSubmitResponse(responseCode, answers);

      if (result.code === 'success') {
        showToast({
          variant: 'success-solid',
          message: 'Succes',
          description: 'Votre evaluation a ete soumise avec succes',
          position: 'top-center',
        });

        await loadCampaigns();
        return true;
      }

      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: result.error || 'Erreur lors de la soumission',
        position: 'top-center',
      });

      return false;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission',
        position: 'top-center',
      });
      return false;
    }
  }, [loadCampaigns]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return {
    campaigns,
    loading,
    error,
    loadCampaigns,
    loadFeedbackForm,
    submitFeedback
  };
}
