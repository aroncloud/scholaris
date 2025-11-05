/**
 * EXEMPLE DE REFACTORISATION
 *
 * Voici comment votre DialogRecordSingleDeposit peut être refactorisé
 * en utilisant le GenericFormDialog
 */

"use client";

import { useState, useEffect } from "react";
import { GenericFormDialog, FormSection } from "@/components/ui/GenericFormDialog";
import { IRecordDeposit, IGetStudentSummary } from "@/types/financialTypes";
import { IListStudent } from "@/types/staffType";
import { getStudentFinancialSummary } from "@/actions/financialAction";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { DollarSign, Calendar, FileText, Wallet, User } from "lucide-react";
import Badge from "@/components/custom-ui/Badge";

interface DialogRecordSingleDepositProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: IListStudent | null;
  onSave: (deposit: IRecordDeposit) => Promise<boolean>;
}

const PAYMENT_METHODS = [
  { value: "BANK_DEPOSIT", label: "Dépôt bancaire" },
  { value: "CASH", label: "Espèces" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CHECK", label: "Chèque" },
];

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA';
};

export default function DialogRecordSingleDepositRefactored({
  open,
  onOpenChange,
  student,
  onSave
}: DialogRecordSingleDepositProps) {

  const { selectedAcademicYear } = useAcademicYearStore();
  const [studentSummary, setStudentSummary] = useState<IGetStudentSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger le résumé financier de l'étudiant
  const loadStudentSummary = async () => {
    if (!student || !selectedAcademicYear) return;

    setLoading(true);
    try {
      const result = await getStudentFinancialSummary(
        student.user_code,
        selectedAcademicYear.academic_year_code
      );

      if (result.code === "success") {
        setStudentSummary(result.data.body);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du résumé:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && student) {
      loadStudentSummary();
    }
  }, [open, student]);

  // Configuration du formulaire
  const sections: FormSection<IRecordDeposit>[] = [
    {
      title: "Informations du versement",
      icon: <DollarSign className="h-4 w-4 text-green-600" />,
      fields: [
        {
          name: "amount",
          label: "Montant du versement",
          type: "number",
          placeholder: "150000",
          required: true,
          min: 1,
          step: 1000,
          description: "Montant en FCFA",
          validate: (value) => {
            if (value <= 0) return "Le montant doit être supérieur à 0";
            return true;
          },
        },
        {
          name: "payment_method",
          label: "Mode de paiement",
          type: "select",
          required: true,
          options: PAYMENT_METHODS,
        },
        {
          name: "payment_date",
          label: "Date du paiement",
          type: "date",
          required: true,
          maxDate: new Date(),
        },
        {
          name: "academic_year_code",
          label: "Année académique",
          type: "text",
          required: true,
          disabled: true,
          description: "Année académique en cours",
        },
        {
          name: "reference",
          label: "Référence de transaction",
          type: "text",
          placeholder: "REF-2024-001",
          description: "Numéro de référence bancaire ou de transaction",
          colSpan: 2,
        },
        {
          name: "notes",
          label: "Notes additionnelles",
          type: "textarea",
          placeholder: "Informations complémentaires sur le versement...",
          colSpan: 2,
        },
      ],
    },
  ];

  // Header personnalisé avec les informations de l'étudiant
  const headerContent = student && (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">
            {student.first_name} {student.last_name}
          </h4>
          <p className="text-sm text-gray-600">{student.email}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-2 text-sm text-gray-500">
          Chargement du résumé financier...
        </div>
      ) : studentSummary && (
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-blue-200">
          <div className="bg-white/60 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-gray-600">Montant dû</p>
            </div>
            <p className="font-bold text-lg text-gray-900">
              {formatMontant(studentSummary.total_fees_due)}
            </p>
          </div>

          <div className="bg-white/60 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <p className="text-xs text-gray-600">Déjà versé</p>
            </div>
            <p className="font-bold text-lg text-green-600">
              {formatMontant(studentSummary.total_paid)}
            </p>
          </div>

          <div className="bg-white/60 rounded-lg p-3 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-orange-600" />
              <p className="text-xs text-gray-600">Solde restant</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-xl text-orange-600">
                {formatMontant(studentSummary.outstanding_balance)}
              </p>
              <Badge
                size="sm"
                value={studentSummary.payment_status}
                label={studentSummary.payment_status}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Valeurs par défaut
  const defaultValues: Partial<IRecordDeposit> = {
    student_user_code: student?.user_code || "",
    academic_year_code: selectedAcademicYear?.academic_year_code || "",
    payment_date: new Date().toISOString().split('T')[0],
  };

  return (
    <GenericFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Enregistrer un versement"
      description="Saisissez les détails du versement effectué par l'étudiant"
      sections={sections}
      defaultValues={defaultValues}
      onSubmit={onSave}
      submitLabel="Enregistrer le versement"
      cancelLabel="Annuler"
      headerContent={headerContent}
      loading={loading}
      maxWidth="2xl"
    />
  );
}
