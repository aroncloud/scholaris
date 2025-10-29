/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { FeedbackForm, Campaign, ICreateFeedbackForm, IUpdateFeedbackForm, ICreateCampaign, IAddQuestionsToForm, IUpdateFeedbackQuestion, ISubmitResponse } from "@/types/feedbackTypes";
import { actionErrorHandler } from "./errorManagement";
import { verifySession } from "@/lib/session";
import axios from "axios";

// Mock data - à remplacer par des vraies requêtes API quand le backend sera prêt

const mockForms: FeedbackForm[] = [
  {
    id: '1',
    name: 'Évaluation de Session de Cours',
    description: 'Évaluation standard post-session pour recueillir les feedbacks étudiants',
    type: 'Session de cours',
    isDefault: true,
    status: 'active',
    createdAt: new Date('2024-10-15'),
    questions: [
      { id: 'q1', type: 'rating', text: 'Comment évaluez-vous la qualité globale de cette session ?', required: true },
      { id: 'q2', type: 'rating', text: 'Le contenu était-il clair et bien structuré ?', required: true },
      { id: 'q3', type: 'multiple_choice', text: 'Le rythme de la session était :', options: ['Trop rapide', 'Approprié', 'Trop lent'], required: true },
      { id: 'q4', type: 'text', text: 'Quelles améliorations suggéreriez-vous ?', required: false }
    ]
  },
  {
    id: '2',
    name: 'Évaluation Instructeur',
    description: 'Évaluation de la performance de l\'instructeur',
    type: 'Instructeur',
    isDefault: false,
    status: 'active',
    createdAt: new Date('2024-10-10'),
    questions: [
      { id: 'q1', type: 'rating', text: 'Clarté des explications', required: true },
      { id: 'q2', type: 'rating', text: 'Engagement et dynamisme', required: true },
      { id: 'q3', type: 'text', text: 'Commentaires additionnels', required: false }
    ]
  },
  {
    id: '3',
    name: 'Feedback Infrastructure',
    description: 'Évaluation des locaux et équipements',
    type: 'Infrastructure',
    isDefault: false,
    status: 'active',
    createdAt: new Date('2024-09-20'),
    questions: [
      { id: 'q1', type: 'rating', text: 'Qualité des équipements', required: true },
      { id: 'q2', type: 'multiple_choice', text: 'Les salles sont-elles adaptées ?', options: ['Oui', 'Moyennement', 'Non'], required: true },
      { id: 'q3', type: 'text', text: 'Suggestions d\'amélioration', required: false }
    ]
  }
];

const mockCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Feedback Session - Introduction à React',
    formId: '1',
    formName: 'Évaluation de Session de Cours',
    status: 'active',
    startDate: new Date('2024-10-27'),
    responseCount: 24,
    targetAudience: 35,
    autoTrigger: true,
    form: mockForms[0]
  },
  {
    id: 'c2',
    name: 'Évaluation Prof. Martin - Semestre 1',
    formId: '2',
    formName: 'Évaluation Instructeur',
    status: 'completed',
    startDate: new Date('2024-10-20'),
    endDate: new Date('2024-10-25'),
    responseCount: 42,
    targetAudience: 42,
    autoTrigger: false,
    form: mockForms[1]
  },
  {
    id: 'c3',
    name: 'Feedback Session - TypeScript Avancé',
    formId: '1',
    formName: 'Évaluation de Session de Cours',
    status: 'scheduled',
    startDate: new Date('2024-10-30'),
    responseCount: 0,
    targetAudience: 28,
    autoTrigger: true,
    form: mockForms[0]
  },
  {
    id: 'c4',
    name: 'Évaluation Infrastructure - Campus Principal',
    formId: '3',
    formName: 'Feedback Infrastructure',
    status: 'active',
    startDate: new Date('2024-10-25'),
    responseCount: 67,
    targetAudience: 120,
    autoTrigger: false,
    form: mockForms[2]
  }
];

export async function getFeedbackFormList() {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/forms`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // // Simulation d'un délai réseau
    // await new Promise(resolve => setTimeout(resolve, 300));

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->getFeedbackForms.error', error);
    return actionErrorHandler(error);
  }
}

export async function getSingleFeedbackForms(form_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/forms/${form_code}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // // Simulation d'un délai réseau
    // await new Promise(resolve => setTimeout(resolve, 300));

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->getFeedbackForms.error', error);
    return actionErrorHandler(error);
  }
}

export async function createFeedbackForm(formData: ICreateFeedbackForm) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.post(
      `${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/forms`,
      formData,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    // console.log('-->createFeedbackForm', formData);

    // // Simulation d'un délai réseau
    // await new Promise(resolve => setTimeout(resolve, 500));

    // const newForm: FeedbackForm = {
    //   ...formData,
    //   id: Date.now().toString(),
    //   createdAt: new Date(),
    //   status: 'draft'
    // };

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->createFeedbackForm.error', error);
    return actionErrorHandler(error);
  }
}

export async function addQuestionsToForm (form_code: string, formData: IAddQuestionsToForm[]) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.post(
      `${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/forms/${form_code}/questions`,
      formData,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->addQuestionsToForm.error', error);
    return actionErrorHandler(error);
  }
}

export async function updateFeedbackForm(formData: IUpdateFeedbackForm, form_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.put(
      `${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/forms/${form_code}`,
      formData,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    // console.log('-->updateFeedbackForm', formData);

    // // Simulation d'un délai réseau
    // await new Promise(resolve => setTimeout(resolve, 500));

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->updateFeedbackForm.error', error);
    return actionErrorHandler(error);
  }
}


export async function updateQuestion (form_code: string, question_code: string, formData: IUpdateFeedbackQuestion) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.put(
      `${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/forms/${form_code}/questions/${question_code}`,
      formData,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );


    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->updateQuestion.error', error);
    return actionErrorHandler(error);
  }
}
export async function getFeedBackTargetLevel() {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/target-levels`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->getFeedBackTargetLevel.error', error);
    return actionErrorHandler(error);
  }
}


export async function getAvailableFeedbackForStudent () {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/responses/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->getAvailableFeedbackForStudent.error', error);
    return actionErrorHandler(error);
  }
}

export async function getFeedbackFormFromResponse (response_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/responses/${response_code}/form`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->getFeedbackFormFromResponse.error', error);
    return actionErrorHandler(error);
  }
}

export async function submitResponse(response_code: string, formData: ISubmitResponse[]) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.post(
      `${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/responses/${response_code}/submit`,
      {
        answers: formData
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->submitResponse.error', error);
    return actionErrorHandler(error);
  }
}



export async function listFeedbackCampaigns () {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/campaigns`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->listFeedbackCampaigns.error', error);
    return actionErrorHandler(error);
  }
}



export async function getCampaignReport (campaign_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback/reports/campaigns/${campaign_code}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      code: 'success' as const,
      error: null,
      data: response.data
    };
  } catch (error: unknown) {
    console.error('-->getCampaignReport.error', error);
    return actionErrorHandler(error);
  }
}





export async function deleteFeedbackForm(formId: string) {
  try {
    // TODO: Remplacer par un vrai appel API
    // const session = await verifySession();
    // const token = session.accessToken;
    // const response = await axios.delete(
    //   `${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/feedback-forms/${formId}`,
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );

    console.log('-->deleteFeedbackForm', formId);

    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      code: 'success' as const,
      error: null,
      data: { id: formId }
    };
  } catch (error: unknown) {
    console.error('-->deleteFeedbackForm.error', error);
    return actionErrorHandler(error);
  }
}

export async function getCampaigns() {
  try {
    // TODO: Remplacer par un vrai appel API
    // const session = await verifySession();
    // const token = session.accessToken;
    // const response = await axios.get(`${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/campaigns`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });

    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      code: 'success' as const,
      error: null,
      data: mockCampaigns
    };
  } catch (error: unknown) {
    console.error('-->getCampaigns.error', error);
    return actionErrorHandler(error);
  }
}

export async function createCampaign(campaignData: ICreateCampaign) {
  try {
    // TODO: Remplacer par un vrai appel API
    // const session = await verifySession();
    // const token = session.accessToken;
    // const response = await axios.post(
    //   `${process.env.COMMUNICATION_WORKER_ENDPOINT}/api/campaigns`,
    //   campaignData,
    //   { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    // );

    console.log('-->createCampaign', campaignData);

    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    const form = mockForms.find(f => f.id === campaignData.formId);
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      formName: form?.name || '',
      status: 'scheduled',
      responseCount: 0,
      form
    };

    return {
      code: 'success' as const,
      error: null,
      data: newCampaign
    };
  } catch (error: unknown) {
    console.error('-->createCampaign.error', error);
    return actionErrorHandler(error);
  }
}
