// Types pour le système de feedback

export type QuestionType = 'multiple_choice' | 'rating' | 'text';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  required: boolean;
}

export interface FeedbackForm {
  id: string;
  name: string;
  description: string;
  type: string;
  isDefault: boolean;
  questions: Question[];
  createdAt: Date;
  status: 'draft' | 'active' | 'archived';
}

export interface Campaign {
  id: string;
  name: string;
  formId: string;
  formName: string;
  status: 'scheduled' | 'active' | 'completed';
  startDate: Date;
  endDate?: Date;
  responseCount: number;
  targetAudience: number;
  autoTrigger: boolean;
  form?: FeedbackForm;
}



export interface ICreateCampaign {
  name: string;
  formId: string;
  targetAudience: number;
  startDate: Date;
  endDate?: Date;
  autoTrigger: boolean;
}

export interface QuestionAnalytics {
  question: string;
  type: QuestionType;
  average?: string;
  distribution?: Record<number, number>;
  responses?: Array<{ option: string; count: number; percentage: number }> | string[];
}

export interface CampaignAnalytics {
  questions: QuestionAnalytics[];
}


//Real interface

export interface IGetFeedbackForm {
  form_code: string;
  title: string;
  description: string;
  created_by_user_code: string;
  created_at: string;
  target_level_code: string;
  is_default: boolean;
}

export interface ICreateFeedbackForm {
  title: string;
  description: string;
  target_level_code: string; // ex: 'COURSE_UNIT'
  is_default: boolean;
  questions: IAddQuestionsToForm[];
}

export interface IUpdateFeedbackForm {
  "title": string,
  "description": string,
  "target_level_code": string,
  "is_default": boolean
}

export interface IUpdateFeedbackQuestion {
  "question_text": string,
  "question_type": string,
  "options_json": string, //"{\"min\":1,\"max\":5}" when question_type is SCALE_1_5
  "display_order": number
}

export interface IAddQuestionsToForm {
  question_text: string;
  question_type: 'SCALE_1_5' | 'TEXT' | 'MULTIPLE_CHOICE';
  options_json?: string; // "{\"options\":[\"Lectures\",\"Labs\",\"Projects\"]}" when question_type is MULTIPLE_CHOICE
  display_order: number;
}

export interface IGetSingleQuestion {
  question_code: string;
  form_code: string;
  question_text: string;
  question_type: 'SCALE_1_5' | 'TEXT' | 'MULTIPLE_CHOICE';
  options_json?: string | null;
  display_order: number;
}

export interface IGetSingleFeedbackForm {
  form_code: string;
  title: string;
  description: string;
  created_by_user_code: string;
  created_at: string; // date/heure au format ISO ou string
  target_level_code: string; // ex: "SESSION", "COURSE_UNIT", etc.
  is_default: boolean | 0 | 1; // selon si l'API renvoie 0/1 ou true/false
  questions: IGetSingleQuestion[];
}

export interface IGetFeedBackTargetLevel {
  "target_level_code": string,
  "title": string,
  "description": string | null
}

export interface IGetAvailableFeedbackForStudent {
    campaign_title?: string;
    end_date?: string;
    form_title?: string;
    response_code?: string;
    status?: string;
}

export interface IGetFeedbackFormFromResponse {
    created_at: string;
    created_by_user_code: string;
    description: string;
    form_code: string;
    is_default: number;
    questions: IQuestion[];
    target_level_code: string;
    title: string;
}

export interface IQuestion {
    display_order: number;
    form_code: string;
    options_json: null | string;
    question_code: string;
    question_text: string;
    question_type: string;
}

export interface ISubmitResponse {
  "question_code": string;
  "answer_numeric"?: number | null;
  "answer_text"?: string | null;
  "answer_json"?: string | null;
}

export interface IListFeedbackCampaigns {
  campaign_code: string;
  form_code: string;
  title: string;
  start_date: string; // format : "YYYY-MM-DD"
  end_date: string;   // format : "YYYY-MM-DD"
  status: string; // valeurs possibles
  audience_filter_json?: string | null;
  target_code: string;
  target_level_code: string; // ex: "SESSION", "COURSE_UNIT", etc.
  total_responses: number;
  completed_responses: number;
}


export interface ICampaignDetails {
  campaign_code: string;
  form_code: string;
  title: string;
  start_date: string; // format YYYY-MM-DD
  end_date: string;   // format YYYY-MM-DD
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  audience_filter_json?: string | null;
  target_code: string;
  target_level_code: string; // ex: "SESSION", "COURSE_UNIT", etc.
}

export interface ISummary {
  total_responses: number;
}

export interface INumericScaleResult {
  question_code: string;
  question_text: string;
  question_type: 'SCALE_1_5';
  response_count: number;
  average_score: number;
}

export interface IMultipleChoiceDistribution {
  option: string;
  count: number;
}

export interface IMultipleChoiceResult {
  question_code: string;
  question_text: string;
  question_type: 'MULTIPLE_CHOICE';
  distribution: IMultipleChoiceDistribution[];
}

export interface IQuantitativeResults {
  numeric_scale: INumericScaleResult[];
  multiple_choice: IMultipleChoiceResult[];
}

export interface IQualitativeResult {
  question_code: string;
  question_text: string;
  answer: string;
}

export interface IGetCampaignDetail {
  campaign_details: ICampaignDetails;
  summary: ISummary;
  quantitative_results: IQuantitativeResults;
  qualitative_results: IQualitativeResult[];
}



































// UI types for student feedback
export interface UIStudentCampaign {
  id: string;
  responseCode: string;
  campaignTitle: string;
  formTitle: string;
  endDate?: Date;
  status: 'pending' | 'submitted';
  hasResponded: boolean;
}

export interface UIStudentQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'text';
  text: string;
  options?: string[];
  displayOrder: number;
}

export interface UIStudentFeedbackForm {
  formCode: string;
  title: string;
  description: string;
  targetLevelCode: string;
  questions: UIStudentQuestion[];
}