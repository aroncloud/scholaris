/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import {
  getFeedbackFormList,
  getSingleFeedbackForms,
  createFeedbackForm as apiCreateFeedbackForm,
  addQuestionsToForm,
  updateFeedbackForm as apiUpdateFeedbackForm,
  updateQuestion,
  deleteFeedbackForm,
  getFeedBackTargetLevel
} from '@/actions/feedbackAction';
import {
  UIFeedbackForm,
  UIQuestion,
  transformAPIFormToUI,
  transformUIQuestionToAPI,
  transformUIFormToAPICreate,
  transformUIFormToAPIUpdate,
  transformUIQuestionToAPIUpdate
} from '@/lib/feedbackTransformers';
import { showToast } from '@/components/ui/showToast';
import { IGetFeedbackForm, IGetFeedBackTargetLevel } from '@/types/feedbackTypes';

export function useFeedbackForms() {
  const [forms, setForms] = useState<UIFeedbackForm[]>([]);
  const [formsList, setFormsList] = useState<IGetFeedbackForm[]>([]);
  const [targetLevels, setTargetLevels] = useState<IGetFeedBackTargetLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load forms list on mount
  const loadForms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getFeedbackFormList();

      if (result.code === 'success' && result.data) {
        console.log('Loaded forms:', result.data.body);
        setFormsList(result.data.body);
      } else {
        setError(result.error || 'Erreur lors du chargement des formulaires');
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: 'Impossible de charger les formulaires',
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Error loading forms:', err);
      setError('Erreur lors du chargement des formulaires');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load target levels
  const loadTargetLevels = useCallback(async () => {
    try {
      const result = await getFeedBackTargetLevel();

      if (result.code === 'success' && result.data) {
        setTargetLevels(result.data.body);
      }
    } catch (err) {
      console.error('Error loading target levels:', err);
    }
  }, []);

  // Load a single form with all details (including questions)
  const loadSingleForm = useCallback(async (formCode: string): Promise<UIFeedbackForm | null> => {
    try {
      const result = await getSingleFeedbackForms(formCode);

      if (result.code === 'success' && result.data) {
        return transformAPIFormToUI(result.data.body);
      }

      return null;
    } catch (err) {
      console.error('Error loading form:', err);
      return null;
    }
  }, []);

  // Create a new feedback form
  const createForm = useCallback(async (
    name: string,
    description: string,
    targetLevelCode: string,
    isDefault: boolean,
    questions: UIQuestion[]
  ): Promise<boolean> => {
    try {
      // Create the form with questions included
      const formData = transformUIFormToAPICreate(name, description, targetLevelCode, isDefault, questions);

      const createResult = await apiCreateFeedbackForm(formData);

      if (createResult.code !== 'success' || !createResult.data) {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: createResult.error || 'Erreur lors de la création du formulaire',
          position: 'top-center',
        });
        return false;
      }

      showToast({
        variant: 'success-solid',
        message: 'Succès',
        description: 'Formulaire créé avec succès',
        position: 'top-center',
      });

      // Reload forms list
      await loadForms();
      return true;

    } catch (err) {
      console.error('Error creating form:', err);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur est survenue lors de la création',
        position: 'top-center',
      });
      return false;
    }
  }, [loadForms]);

  // Update an existing feedback form
  const updateForm = useCallback(async (
    formCode: string,
    name: string,
    description: string,
    targetLevelCode: string,
    isDefault: boolean,
    questions: UIQuestion[],
    existingQuestions: UIQuestion[]
  ): Promise<boolean> => {
    try {
      // Step 1: Update form metadata
      const formData = transformUIFormToAPIUpdate(name, description, targetLevelCode, isDefault);

      const updateResult = await apiUpdateFeedbackForm(formData, formCode);

      if (updateResult.code !== 'success') {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: updateResult.error || 'Erreur lors de la mise à jour du formulaire',
          position: 'top-center',
        });
        return false;
      }

      // Step 2: Update questions
      // For now, we'll update existing questions and add new ones
      // Note: The API doesn't seem to have a delete question endpoint yet

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        // If question has an ID that matches a question_code, it's an existing question
        const existingQuestion = existingQuestions.find(eq => eq.id === question.id);

        if (existingQuestion) {
          // Update existing question
          const questionData = transformUIQuestionToAPIUpdate(question);
          await updateQuestion(formCode, question.id, questionData);
        } else {
          // Add new question
          const apiQuestions = [transformUIQuestionToAPI(question, i)];
          await addQuestionsToForm(formCode, apiQuestions);
        }
      }

      showToast({
        variant: 'success-solid',
        message: 'Succès',
        description: 'Formulaire mis à jour avec succès',
        position: 'top-center',
      });

      // Reload forms list
      await loadForms();
      return true;

    } catch (err) {
      console.error('Error updating form:', err);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour',
        position: 'top-center',
      });
      return false;
    }
  }, [loadForms]);

  // Delete a feedback form
  const deleteForm = useCallback(async (formCode: string): Promise<boolean> => {
    try {
      const result = await deleteFeedbackForm(formCode);

      if (result.code === 'success') {
        showToast({
          variant: 'success-solid',
          message: 'Succès',
          description: 'Formulaire supprimé avec succès',
          position: 'top-center',
        });

        // Reload forms list
        await loadForms();
        return true;
      }

      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: result.error || 'Erreur lors de la suppression',
        position: 'top-center',
      });

      return false;
    } catch (err) {
      console.error('Error deleting form:', err);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression',
        position: 'top-center',
      });
      return false;
    }
  }, [loadForms]);

  // Duplicate a form
  const duplicateForm = useCallback(async (formCode: string): Promise<boolean> => {
    try {
      // Load the full form details
      const formDetails = await loadSingleForm(formCode);

      if (!formDetails) {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: 'Impossible de charger les détails du formulaire',
          position: 'top-center',
        });
        return false;
      }

      // Create a copy
      const success = await createForm(
        `${formDetails.name} (Copie)`,
        formDetails.description,
        formDetails.type,
        false, // Don't make copies default
        formDetails.questions
      );

      if (success) {
        showToast({
          variant: 'success-solid',
          message: 'Succès',
          description: 'Formulaire dupliqué avec succès',
          position: 'top-center',
        });
      }

      return success;
    } catch (err) {
      console.error('Error duplicating form:', err);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur est survenue lors de la duplication',
        position: 'top-center',
      });
      return false;
    }
  }, [loadSingleForm, createForm]);

  // Load data on mount
  useEffect(() => {
    loadForms();
    loadTargetLevels();
  }, [loadForms, loadTargetLevels]);

  return {
    forms,
    formsList,
    targetLevels,
    loading,
    error,
    loadForms,
    loadSingleForm,
    createForm,
    updateForm,
    deleteForm,
    duplicateForm
  };
}
