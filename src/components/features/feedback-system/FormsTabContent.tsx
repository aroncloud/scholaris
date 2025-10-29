'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IGetFeedbackForm } from '@/types/feedbackTypes';
import { Plus, Eye, Edit, Copy, Trash2, Calendar, Target, Sparkles, FileText } from 'lucide-react';
import ContentLayout from '@/layout/ContentLayout';
import Badge from '@/components/custom-ui/Badge';

interface FormsTabContentProps {
  forms: IGetFeedbackForm[];
  onEdit: (formCode: string) => void;
  onDuplicate: (formCode: string) => void;
  onDelete: (formCode: string) => void;
  onCreateNew: () => void;
  loading?: boolean;
}

// FormCard Component
const FormCard = ({ form, onEdit, onDuplicate, onDelete }: {
  form: IGetFeedbackForm;
  onEdit: (formCode: string) => void;
  onDuplicate: (formCode: string) => void;
  onDelete: (formCode: string) => void;
}) => {
  return (
    <Card className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg overflow-hidden relative">
      <CardContent className="px-4">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>

              {/* Title + Description */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 truncate mb-1"
                  title={form.title}
                >
                  {form.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {form.description || 'Aucune description disponible'}
                </p>
              </div>
            </div>
          </div>

          {/* Badge */}
          {form.is_default && (
            <div className="shrink-0">
              <Badge
                variant="info"
                size="sm"
                label="Par défaut"
                icon={Sparkles}
              />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 mb-4 border border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Niveau cible</p>
                <p className="text-sm font-bold text-slate-900">{form.target_level_code}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Créé le</p>
                <p className="text-sm font-bold text-slate-900">
                  {new Date(form.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(form.form_code)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => onDuplicate(form.form_code)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Dupliquer"
          >
            <Copy className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Prévisualiser"
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => onDelete(form.form_code)}
            variant="destructive"
            size="icon"
            className="bg-red-50 hover:bg-red-100 text-red-600 border-0"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer metadata */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            Code:{' '}
            <span className="font-mono font-semibold text-slate-600">
              {form.form_code}
            </span>
          </p>
          <p className="text-xs text-slate-400">
            Par:{' '}
            <span className="font-semibold text-slate-600">
              {form.created_by_user_code}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};


export default FormCard;


export function FormsTabContent({
  forms,
  onEdit,
  onDuplicate,
  onDelete,
  onCreateNew,
  loading
}: FormsTabContentProps) {
  return (
    <ContentLayout
      title="Formulaires d'évaluation"
      description="Configurez et gérez vos templates de feedback"
      actions={
        <Button onClick={onCreateNew} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 font-medium">
          <Plus className="w-5 h-5 mr-2" />
          Nouveau formulaire
        </Button>
      }
    >
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Chargement des formulaires...</p>
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 font-medium">Aucun formulaire disponible</p>
          <p className="text-sm text-slate-500 mt-1">Créez votre premier formulaire d&apos;évaluation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {forms.map((form) => (
            <FormCard
              key={form.form_code}
              form={form}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </ContentLayout>
  );
}
