/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/layout/PageHeader';
import { UIQuestion } from '@/lib/feedbackTransformers';
import { useRouter } from 'next/navigation';

// Import custom hooks
import { useFeedbackForms } from '@/hooks/feature/feedback/useFeedbackForms';
import { useFeedbackCampaigns } from '@/hooks/feature/feedback/useFeedbackCampaigns';

// Import Tab Content Components
import { FormsTabContent } from '@/components/features/feedback-system/FormsTabContent';
import { CampaignsTabContent } from '@/components/features/feedback-system/CampaignsTabContent';
import { AnalyticsTabContent } from '@/components/features/feedback-system/AnalyticsTabContent';

// Import Dialog Components
import { DialogCreateFeedbackForm } from '@/components/features/feedback-system/modal/DialogCreateFeedbackForm';

export default function FeedbackSystemPage() {
  const [activeTab, setActiveTab] = useState<'forms' | 'campaigns' | 'analytics'>('forms');
  const router = useRouter();

  // Use custom hook for feedback forms
  const {
    formsList,
    targetLevels,
    loading: formsLoading,
    loadSingleForm,
    createForm,
    updateForm,
    deleteForm,
    duplicateForm
  } = useFeedbackForms();

  // Use custom hook for campaigns
  const {
    campaigns,
    loading: campaignsLoading
  } = useFeedbackCampaigns();

  // Dialog states
  const [showFormModal, setShowFormModal] = useState(false);

  // Editing states
  const [editingFormCode, setEditingFormCode] = useState<string | null>(null);
  const [editingFormData, setEditingFormData] = useState<any>(null);

  // Form handlers
  const handleOpenFormModal = async (formCode?: string) => {
    if (formCode) {
      // Load full form details for editing
      const formDetails = await loadSingleForm(formCode);
      setEditingFormData(formDetails);
      setEditingFormCode(formCode);
    } else {
      setEditingFormData(null);
      setEditingFormCode(null);
    }
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingFormData(null);
    setEditingFormCode(null);
  };

  const handleSaveForm = async (
    name: string,
    description: string,
    targetLevelCode: string,
    isDefault: boolean,
    questions: UIQuestion[],
    existingQuestions?: UIQuestion[]
  ): Promise<boolean> => {
    if (editingFormCode) {
      // Update existing form
      return await updateForm(
        editingFormCode,
        name,
        description,
        targetLevelCode,
        isDefault,
        questions,
        existingQuestions || []
      );
    } else {
      // Create new form
      return await createForm(name, description, targetLevelCode, isDefault, questions);
    }
  };

  const handleDeleteForm = async (formCode: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) return;
    await deleteForm(formCode);
  };

  const handleDuplicateForm = async (formCode: string) => {
    await duplicateForm(formCode);
  };

  // Campaign handlers
  const handleViewCampaignDetails = (campaign: import('@/types/feedbackTypes').Campaign) => {
    // Navigate to campaign details page
    router.push(`/dashboard/admin/feedback-system/${campaign.id}`);
  };

  const handleCreateCampaign = () => {
    // TODO: Implement campaign creation dialog
    console.log('Create campaign clicked');
  };

  return (
    <>
      <PageHeader
        title="Système de Feedback"
        description="Plateforme d'évaluation intelligente"
        Icon={MessageSquare}
      >
        <Button variant={'info'}>
          <Settings className="w-4 h-4" />
          <span>Paramètres</span>
        </Button>
      </PageHeader>

      <div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="px-2 md:px-6">
          <TabsList className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm h-auto w-full mt-6 mb-2 grid grid-cols-3 gap-1">
            <TabsTrigger
              value="forms"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 flex items-center justify-center"
            >
              <span className="truncate text-center">Configuration</span>
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 flex items-center justify-center"
            >
              <span className="truncate text-center">Campagnes</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 flex items-center justify-center"
            >
              <span className="truncate text-center">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Forms Tab */}
          <TabsContent value="forms">
            <FormsTabContent
              forms={formsList}
              onEdit={handleOpenFormModal}
              onDuplicate={handleDuplicateForm}
              onDelete={handleDeleteForm}
              onCreateNew={() => handleOpenFormModal()}
              loading={formsLoading}
            />
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <CampaignsTabContent
              campaigns={campaigns}
              loading={campaignsLoading}
              onViewDetails={handleViewCampaignDetails}
              onCreateNew={handleCreateCampaign}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTabContent
              campaigns={campaigns}
              onViewDetails={handleViewCampaignDetails}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <DialogCreateFeedbackForm
        open={showFormModal}
        onOpenChange={handleCloseFormModal}
        onSave={handleSaveForm}
        editingForm={editingFormData}
        targetLevels={targetLevels}
      />
    </>
  );
}
