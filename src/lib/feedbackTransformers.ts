// Data transformation utilities for feedback system

import {
  IGetSingleFeedbackForm,
  IGetSingleQuestion,
  ICreateFeedbackForm,
  IAddQuestionsToForm,
  IUpdateFeedbackForm,
  IUpdateFeedbackQuestion,
  IGetAvailableFeedbackForStudent,
  IGetFeedbackFormFromResponse,
  IQuestion,
  UIStudentCampaign,
  UIStudentFeedbackForm,
  UIStudentQuestion,
  ISubmitResponse
} from "@/types/feedbackTypes";

// UI Question type
export interface UIQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'text';
  text: string;
  options?: string[];
  required: boolean;
  displayOrder: number;
}

// UI Form type
export interface UIFeedbackForm {
  id: string;
  name: string;
  description: string;
  type: string;
  isDefault: boolean;
  questions: UIQuestion[];
  createdAt: Date;
  status: 'draft' | 'active' | 'archived';
}

// Transform API question type to UI question type
function transformQuestionType(apiType: 'SCALE_1_5' | 'TEXT' | 'MULTIPLE_CHOICE'): 'rating' | 'multiple_choice' | 'text' {
  switch (apiType) {
    case 'SCALE_1_5':
      return 'rating';
    case 'MULTIPLE_CHOICE':
      return 'multiple_choice';
    case 'TEXT':
      return 'text';
  }
}

// Transform UI question type to API question type
function transformUIQuestionType(uiType: 'rating' | 'multiple_choice' | 'text'): 'SCALE_1_5' | 'TEXT' | 'MULTIPLE_CHOICE' {
  switch (uiType) {
    case 'rating':
      return 'SCALE_1_5';
    case 'multiple_choice':
      return 'MULTIPLE_CHOICE';
    case 'text':
      return 'TEXT';
  }
}

// Transform API question to UI question
export function transformAPIQuestionToUI(apiQuestion: IGetSingleQuestion): UIQuestion {
  let options: string[] | undefined;

  if (apiQuestion.question_type === 'MULTIPLE_CHOICE' && apiQuestion.options_json) {
    try {
      const parsed = JSON.parse(apiQuestion.options_json);
      options = parsed.options || [];
    } catch (e) {
      console.error('Error parsing options_json:', e);
      options = [];
    }
  }

  return {
    id: apiQuestion.question_code,
    type: transformQuestionType(apiQuestion.question_type),
    text: apiQuestion.question_text,
    options,
    required: false, // API doesn't have required field yet
    displayOrder: apiQuestion.display_order
  };
}

// Transform API form to UI form
export function transformAPIFormToUI(apiForm: IGetSingleFeedbackForm): UIFeedbackForm {
  return {
    id: apiForm.form_code,
    name: apiForm.title,
    description: apiForm.description,
    type: apiForm.target_level_code,
    isDefault: Boolean(apiForm.is_default),
    questions: apiForm.questions.map(transformAPIQuestionToUI),
    createdAt: new Date(apiForm.created_at),
    status: 'active' // API doesn't have status field yet
  };
}

// Transform UI question to API question for creation
export function transformUIQuestionToAPI(uiQuestion: UIQuestion, index: number): IAddQuestionsToForm {
  let optionsJson: string | undefined;

  if (uiQuestion.type === 'multiple_choice' && uiQuestion.options) {
    optionsJson = JSON.stringify({ options: uiQuestion.options });
  } else if (uiQuestion.type === 'rating') {
    optionsJson = JSON.stringify({ min: 1, max: 5 });
  }

  return {
    question_text: uiQuestion.text,
    question_type: transformUIQuestionType(uiQuestion.type),
    options_json: optionsJson,
    display_order: index + 1
  };
}

// Transform UI form to API create form (with questions)
export function transformUIFormToAPICreate(
  name: string,
  description: string,
  targetLevelCode: string,
  isDefault: boolean,
  questions: UIQuestion[]
): ICreateFeedbackForm {
  return {
    title: name,
    description: description,
    target_level_code: targetLevelCode,
    is_default: isDefault,
    questions: questions.map((q, index) => transformUIQuestionToAPI(q, index))
  };
}

// Transform UI form to API update form
export function transformUIFormToAPIUpdate(
  name: string,
  description: string,
  targetLevelCode: string,
  isDefault: boolean
): IUpdateFeedbackForm {
  return {
    title: name,
    description: description,
    target_level_code: targetLevelCode,
    is_default: isDefault
  };
}

// Transform UI question to API update question
export function transformUIQuestionToAPIUpdate(uiQuestion: UIQuestion): IUpdateFeedbackQuestion {
  let optionsJson: string;

  if (uiQuestion.type === 'multiple_choice' && uiQuestion.options) {
    optionsJson = JSON.stringify({ options: uiQuestion.options });
  } else if (uiQuestion.type === 'rating') {
    optionsJson = JSON.stringify({ min: 1, max: 5 });
  } else {
    optionsJson = '';
  }

  return {
    question_text: uiQuestion.text,
    question_type: transformUIQuestionType(uiQuestion.type),
    options_json: optionsJson,
    display_order: uiQuestion.displayOrder
  };
}

// ============= Student Feedback Transformers =============

// Transform API campaign to UI campaign for students
export function transformAPICampaignToUI(apiCampaign: IGetAvailableFeedbackForStudent): UIStudentCampaign {
  return {
    id: apiCampaign.response_code || '',
    responseCode: apiCampaign.response_code || '',
    campaignTitle: apiCampaign.campaign_title || '',
    formTitle: apiCampaign.form_title || '',
    endDate: apiCampaign.end_date ? new Date(apiCampaign.end_date) : undefined,
    status: apiCampaign.status === 'SUBMITTED' ? 'submitted' : 'pending',
    hasResponded: apiCampaign.status === 'SUBMITTED'
  };
}

// Transform API question type to UI question type for students
function transformAPIQuestionTypeToUI(apiType: string): 'rating' | 'multiple_choice' | 'text' {
  switch (apiType) {
    case 'SCALE_1_5':
      return 'rating';
    case 'MULTIPLE_CHOICE':
      return 'multiple_choice';
    case 'TEXT':
      return 'text';
    default:
      return 'text';
  }
}

// Transform API question to UI question for students
export function transformAPIStudentQuestionToUI(apiQuestion: IQuestion): UIStudentQuestion {
  let options: string[] | undefined;

  if (apiQuestion.question_type === 'MULTIPLE_CHOICE' && apiQuestion.options_json) {
    try {
      const parsed = JSON.parse(apiQuestion.options_json);
      options = parsed.options || [];
    } catch (e) {
      console.error('Error parsing options_json:', e);
      options = [];
    }
  }

  return {
    id: apiQuestion.question_code,
    type: transformAPIQuestionTypeToUI(apiQuestion.question_type),
    text: apiQuestion.question_text,
    options,
    displayOrder: apiQuestion.display_order
  };
}

// Transform API feedback form to UI form for students
export function transformAPIStudentFormToUI(apiForm: IGetFeedbackFormFromResponse): UIStudentFeedbackForm {
  return {
    formCode: apiForm.form_code,
    title: apiForm.title,
    description: apiForm.description,
    targetLevelCode: apiForm.target_level_code,
    questions: apiForm.questions
      .sort((a, b) => a.display_order - b.display_order)
      .map(transformAPIStudentQuestionToUI)
  };
}

// Transform UI answer to API submit response
export function transformUIAnswerToAPI(
  questionCode: string,
  questionType: 'rating' | 'multiple_choice' | 'text',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any
): ISubmitResponse {
  const response: ISubmitResponse = {
    question_code: questionCode
  };

  switch (questionType) {
    case 'rating':
      response.answer_numeric = typeof answer === 'number' ? answer : parseInt(answer, 10);
      break;
    case 'multiple_choice':
      response.answer_json = JSON.stringify({ selected_option: answer });
      break;
    case 'text':
      response.answer_text = String(answer);
      break;
  }

  return response;
}

// ============= Campaign Transformers =============

// Transform API campaign list to UI campaign
export function transformAPICampaignListToUI(apiCampaign: import('@/types/feedbackTypes').IListFeedbackCampaigns): import('@/types/feedbackTypes').Campaign {
  return {
    id: apiCampaign.campaign_code,
    name: apiCampaign.title,
    formId: apiCampaign.form_code,
    formName: apiCampaign.form_code, // Will be resolved later if needed
    status: transformCampaignStatus(apiCampaign.status),
    startDate: new Date(apiCampaign.start_date),
    endDate: apiCampaign.end_date ? new Date(apiCampaign.end_date) : undefined,
    responseCount: apiCampaign.completed_responses,
    targetAudience: apiCampaign.total_responses || 100, // Use total or default
    autoTrigger: false // Not provided by API, default to false
  };
}

// Transform campaign status from API to UI
function transformCampaignStatus(apiStatus: string): 'scheduled' | 'active' | 'completed' {
  switch (apiStatus) {
    case 'PLANNED':
      return 'scheduled';
    case 'ONGOING':
      return 'active';
    case 'COMPLETED':
    case 'CANCELLED':
      return 'completed';
    default:
      return 'scheduled';
  }
}
