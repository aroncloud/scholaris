/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UIFeedbackForm, UIQuestion } from "@/lib/feedbackTransformers";
import { IGetFeedBackTargetLevel } from "@/types/feedbackTypes";
import { Plus, Trash2, X, Star, CheckCircle2, Type, AlertCircle, Save } from "lucide-react";
import { showToast } from "@/components/ui/showToast";

type QuestionType = 'rating' | 'multiple_choice' | 'text';

interface DialogCreateFeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    name: string,
    description: string,
    targetLevelCode: string,
    isDefault: boolean,
    questions: UIQuestion[],
    existingQuestions?: UIQuestion[]
  ) => Promise<boolean>;
  editingForm?: UIFeedbackForm | null;
  targetLevels: IGetFeedBackTargetLevel[];
}

export function DialogCreateFeedbackForm({
  open,
  onOpenChange,
  onSave,
  editingForm,
  targetLevels,
}: DialogCreateFeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetLevelCode: '',
    isDefault: false
  });
  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [existingQuestions, setExistingQuestions] = useState<UIQuestion[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or editing form changes
  useEffect(() => {
    if (open && editingForm) {
      setFormData({
        name: editingForm.name,
        description: editingForm.description,
        targetLevelCode: editingForm.type,
        isDefault: editingForm.isDefault
      });
      setQuestions([...editingForm.questions]);
      setExistingQuestions([...editingForm.questions]);
    } else if (!open) {
      setFormData({
        name: '',
        description: '',
        targetLevelCode: targetLevels.length > 0 ? targetLevels[0].target_level_code : '',
        isDefault: false
      });
      setQuestions([]);
      setExistingQuestions([]);
      setErrors({});
    }
  }, [open, editingForm, targetLevels]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Le nom du formulaire est requis";
    if (!formData.targetLevelCode) newErrors.targetLevelCode = "Le niveau cible est requis";
    if (questions.length === 0) newErrors.questions = "Ajoutez au moins une question";

    // Validate questions
    questions.forEach((q, index) => {
      if (!q.text.trim()) {
        newErrors[`question_${index}`] = "Le texte de la question est requis";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast({
        variant: "error-solid",
        message: "Erreur de validation",
        description: `Veuillez remplir tous les champs requis`,
        position: 'top-center',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSave(
        formData.name,
        formData.description,
        formData.targetLevelCode,
        formData.isDefault,
        questions,
        editingForm ? existingQuestions : undefined
      );

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error(error);
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: 'Une erreur est survenue lors de la sauvegarde',
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as string]) {
      const newErrors = { ...errors };
      delete newErrors[field as string];
      setErrors(newErrors);
    }
  };

  const addQuestion = (type: QuestionType) => {
    const newQuestion: UIQuestion = {
      id: `temp_${Date.now()}`, // Temporary ID for new questions
      type,
      text: '',
      required: false,
      displayOrder: questions.length + 1,
      ...(type === 'multiple_choice' ? { options: ['Option 1', 'Option 2'] } : {})
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<UIQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options && q.options.length > 2) {
        return { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) };
      }
      return q;
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900">
            {editingForm ? 'Modifier le formulaire' : 'Nouveau formulaire'}
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-slate-500 mt-1">
            Configurez votre formulaire d&apos;évaluation
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          {/* Informations de base */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">
                Nom du formulaire <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Ex: Évaluation de session de cours"
                disabled={isSubmitting}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Décrivez l'objectif de ce formulaire..."
                rows={3}
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="targetLevel">
                  Niveau cible <span className="text-red-500">*</span>
                </Label>
                <select
                  id="targetLevel"
                  value={formData.targetLevelCode}
                  onChange={(e) => handleFieldChange("targetLevelCode", e.target.value)}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.targetLevelCode ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Sélectionnez un niveau</option>
                  {targetLevels.map((level) => (
                    <option key={level.target_level_code} value={level.target_level_code}>
                      {level.title}
                    </option>
                  ))}
                </select>
                {errors.targetLevelCode && <p className="text-red-500 text-xs">{errors.targetLevelCode}</p>}
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-3 cursor-pointer bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg transition-all duration-200 w-full">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => handleFieldChange("isDefault", e.target.checked)}
                    disabled={isSubmitting}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">Définir comme formulaire par défaut</span>
                </label>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-900">Questions</h4>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => addQuestion('rating')}
                  disabled={isSubmitting}
                  size="sm"
                  variant="secondary"
                  className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Note
                </Button>
                <Button
                  type="button"
                  onClick={() => addQuestion('multiple_choice')}
                  disabled={isSubmitting}
                  size="sm"
                  variant="secondary"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Choix multiples
                </Button>
                <Button
                  type="button"
                  onClick={() => addQuestion('text')}
                  disabled={isSubmitting}
                  size="sm"
                  variant="secondary"
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                >
                  <Type className="w-4 h-4 mr-1" />
                  Texte libre
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg text-blue-700 font-bold text-sm mt-1">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-slate-700">
                            Question {question.type === 'rating' && '(Note par étoiles)'}
                            {question.type === 'multiple_choice' && '(Choix multiples)'}
                            {question.type === 'text' && '(Texte libre)'}
                          </label>
                          <div className="flex items-center space-x-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                                disabled={isSubmitting}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                              <span className="text-xs font-medium text-slate-600">Requis</span>
                            </label>
                            <Button
                              type="button"
                              onClick={() => deleteQuestion(question.id)}
                              disabled={isSubmitting}
                              size="sm"
                              variant="ghost"
                              className="p-1.5 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Input
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                          placeholder="Entrez votre question..."
                          disabled={isSubmitting}
                          className={`bg-white ${errors[`question_${index}`] ? 'border-red-500' : ''}`}
                        />
                        {errors[`question_${index}`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`question_${index}`]}</p>
                        )}
                      </div>

                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Options</p>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                disabled={isSubmitting}
                                className="flex-1 bg-white text-sm"
                              />
                              {question.options!.length > 2 && (
                                <Button
                                  type="button"
                                  onClick={() => deleteOption(question.id, optionIndex)}
                                  disabled={isSubmitting}
                                  size="sm"
                                  variant="ghost"
                                  className="p-2 text-red-500 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            onClick={() => addOption(question.id)}
                            disabled={isSubmitting}
                            size="sm"
                            variant="ghost"
                            className="px-3 py-1.5 text-blue-600 hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Ajouter une option
                          </Button>
                        </div>
                      )}

                      {question.type === 'rating' && (
                        <div className="flex items-center space-x-1 pl-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-5 h-5 text-yellow-400" />
                          ))}
                        </div>
                      )}

                      {question.type === 'text' && (
                        <div className="pl-4">
                          <div className="w-full h-20 bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                            Zone de texte pour la réponse
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                  <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Aucune question ajoutée</p>
                  <p className="text-sm text-slate-500 mt-1">Cliquez sur les boutons ci-dessus pour ajouter des questions</p>
                </div>
              )}
              {errors.questions && (
                <p className="text-red-500 text-sm">{errors.questions}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 md:p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-slate-600">
              {questions.length} question{questions.length !== 1 ? 's' : ''} • {questions.filter(q => q.required).length} obligatoire{questions.filter(q => q.required).length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-3 justify-between">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingForm ? 'Mettre à jour' : 'Créer le formulaire'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
