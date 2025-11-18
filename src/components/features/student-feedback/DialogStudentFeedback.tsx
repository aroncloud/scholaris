/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Star, ArrowLeft, AlertCircle, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { UIStudentCampaign, UIStudentFeedbackForm } from '@/types/feedbackTypes';

interface DialogStudentFeedbackProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: UIStudentCampaign | null;
  feedbackForm: UIStudentFeedbackForm | null;
  onSubmit: (answers: Record<string, any>) => Promise<void>;
}

export function DialogStudentFeedback({
  open,
  onOpenChange,
  campaign,
  feedbackForm,
  onSubmit
}: DialogStudentFeedbackProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratingValues, setRatingValues] = useState<{ [key: string]: number }>({});
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!campaign || !feedbackForm) return null;

  const currentQuestion = feedbackForm.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === feedbackForm.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / feedbackForm.questions.length) * 100;

  const handleRatingClick = (questionId: string, rating: number) => {
    setRatingValues({ ...ratingValues, [questionId]: rating });
    setValue(questionId, rating);
    setAnswers({ ...answers, [questionId]: rating });
  };

  const handleNext = async () => {
    const isValid = await trigger(currentQuestion.id);
    const currentValue = watch(currentQuestion.id);

    if (!currentValue) {
      return;
    }

    if (isValid && currentQuestionIndex < feedbackForm.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, ...answers });
      // Reset states
      setCurrentQuestionIndex(0);
      setRatingValues({});
      setAnswers({});
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <DialogTitle className="text-left text-2xl font-bold text-slate-900">
                {campaign.campaignTitle}
              </DialogTitle>
              <DialogDescription className="text-left text-sm text-slate-600 mt-1">
                {feedbackForm.title}
              </DialogDescription>
            </div>
            <Badge className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
              Question {currentQuestionIndex + 1}/{feedbackForm.questions.length}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Progression</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-slate-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 [&>div]:shadow-lg [&>div]:shadow-blue-500/50"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 min-h-[400px] flex flex-col">
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex items-start space-x-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {currentQuestion.text}
                      <span className="text-red-500 ml-1">*</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      {currentQuestion.type === 'rating' && 'Cliquez sur les étoiles pour noter'}
                      {currentQuestion.type === 'multiple_choice' && 'Sélectionnez une option'}
                      {currentQuestion.type === 'text' && 'Rédigez votre réponse'}
                    </p>
                  </div>
                </div>

                {/* Rating Question */}
                {currentQuestion.type === 'rating' && (
                  <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingClick(currentQuestion.id, rating)}
                          className="transition-all duration-200 hover:scale-110"
                        >
                          <Star
                            className={`w-12 h-12 transition-all duration-200 ${
                              (ratingValues[currentQuestion.id] || 0) >= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {ratingValues[currentQuestion.id] && (
                      <p className="text-2xl font-bold text-slate-900">
                        {ratingValues[currentQuestion.id]} / 5
                      </p>
                    )}
                    <input
                      type="hidden"
                      {...register(currentQuestion.id, { required: true })}
                      value={ratingValues[currentQuestion.id] || ''}
                    />
                  </div>
                )}

                {/* Multiple Choice Question */}
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
                      >
                        <input
                          type="radio"
                          {...register(currentQuestion.id, { required: true })}
                          value={option}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="flex-1 font-medium text-slate-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Text Question */}
                {currentQuestion.type === 'text' && (
                  <div>
                    <Textarea
                      {...register(currentQuestion.id, { required: true })}
                      placeholder="Entrez votre réponse ici..."
                      rows={8}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                {errors[currentQuestion.id] && (
                  <div className="flex items-center space-x-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-600 font-medium">Cette question est obligatoire</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                variant="secondary"
                className="px-6 py-1.5 text-slate-700 hover:bg-white border border-slate-300 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              <div className="flex items-center space-x-3 justify-between">
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  variant="secondary"
                  className="px-6 py-1.5 text-slate-700 hover:bg-white border border-slate-300 rounded-lg transition-all duration-200 font-medium"
                >
                  Annuler
                </Button>

                {isLastQuestion ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 font-medium flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Envoi...' : 'Soumettre'}</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-6 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 font-medium flex items-center space-x-2"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
