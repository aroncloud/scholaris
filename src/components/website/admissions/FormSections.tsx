/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, CheckCircle, Upload, User} from "lucide-react";
import { FormErrors } from "@/hooks/useAdmissionForm";
import { FileUploadProps, FormData } from "@/types/requestSubmissionTypes";

interface FormSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}


export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-[#3b2c6a]">
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);



export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  documentType,
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  description,
  file,
  error,
  onFileChange,
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {description && <p className="text-xs text-gray-500">{description}</p>}
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#ff9900] transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => onFileChange(documentType, e.target.files?.[0] || null)}
        className="hidden"
        id={String(documentType)}
      />
      <label htmlFor={String(documentType)} className="cursor-pointer">
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <div className="mt-2">
            {file ? (
              <p className="text-sm text-green-600 font-medium">
                ✓ {file.name}
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Cliquez pour sélectionner un fichier
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
        </div>
      </label>
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);


interface StepFormProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (field: string, value: string) => void;
  handleFileChange: (
    documentType: keyof FormData["documents"],
    file: File | null,
  ) => void;
}

// Données constantes pour les listes déroulantes
const regions = [
  "Adamaoua",
  "Centre",
  "Est",
  "Extrême-Nord",
  "Littoral",
  "Nord",
  "Nord-Ouest",
  "Ouest",
  "Sud",
  "Sud-Ouest",
];

const formations = [
  { id: "aide-soignant", nom: "Aide-Soignant(e)" },
  { id: "infirmier-ide", nom: "Infirmier(ère) Diplômé(e) d'État" },
  { id: "agent-sante-communautaire", nom: "Agent de Santé Communautaire" },
  { id: "sage-femme", nom: "Sage-Femme" },
  { id: "technicien-labo", nom: "Technicien de Laboratoire" },
];

export const PersonalInfoForm: React.FC<StepFormProps> = ({
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom <span className="text-red-500">*</span></Label>
        <Input id="nom" value={formData.nom} onChange={(e) => handleInputChange("nom", e.target.value)} placeholder="Nom" className={errors.nom ? "border-red-500" : ""} />
        {errors.nom && <p className="text-sm text-red-600">{errors.nom}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="prenom">Prénom <span className="text-red-500">*</span></Label>
        <Input id="prenom" value={formData.prenom} onChange={(e) => handleInputChange("prenom", e.target.value)} placeholder="Prénom" className={errors.prenom ? "border-red-500" : ""} />
        {errors.prenom && <p className="text-sm text-red-600">{errors.prenom}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateNaissance">Date de naissance <span className="text-red-500">*</span></Label>
        <Input id="dateNaissance" type="date" value={formData.dateNaissance} onChange={(e) => handleInputChange("dateNaissance", e.target.value)} className={errors.dateNaissance ? "border-red-500" : ""} />
        {errors.dateNaissance && <p className="text-sm text-red-600">{errors.dateNaissance}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lieuNaissance">Lieu de naissance <span className="text-red-500">*</span></Label>
        <Input id="lieuNaissance" value={formData.lieuNaissance} onChange={(e) => handleInputChange("lieuNaissance", e.target.value)} placeholder="Lieu de naissance" className={errors.lieuNaissance ? "border-red-500" : ""} />
        {errors.lieuNaissance && <p className="text-sm text-red-600">{errors.lieuNaissance}</p>}
      </div>
    </div>
    {/* Section parents */}
    <div className="space-y-4 pt-4">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2"><User className="h-4 w-4" />Informations des parents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nomPere">Nom du père <span className="text-red-500">*</span></Label>
          <Input id="nomPere" value={formData.nomPere} onChange={(e) => handleInputChange("nomPere", e.target.value)} placeholder="Nom du père" className={errors.nomPere ? "border-red-500" : ""} />
          {errors.nomPere && <p className="text-sm text-red-600">{errors.nomPere}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPere">Contact du père</Label>
          <Input id="contactPere" type="tel" value={formData.contactPere} onChange={(e) => handleInputChange("contactPere", e.target.value)} placeholder="Contact du père" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nomMere">Nom de la mère <span className="text-red-500">*</span></Label>
          <Input id="nomMere" value={formData.nomMere} onChange={(e) => handleInputChange("nomMere", e.target.value)} placeholder="Nom de la mère" className={errors.nomMere ? "border-red-500" : ""} />
          {errors.nomMere && <p className="text-sm text-red-600">{errors.nomMere}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactMere">Contact de la mère</Label>
          <Input id="contactMere" type="tel" value={formData.contactMere} onChange={(e) => handleInputChange("contactMere", e.target.value)} placeholder="Contact de la mère" />
        </div>
      </div>
    </div>
  </div>
);

export const OriginInfoForm: React.FC<StepFormProps> = ({
  formData,
  handleInputChange,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="region">Région</Label>
        <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez la région" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="arrondissement">Arrondissement</Label>
        <Input id="arrondissement" value={formData.arrondissement} onChange={(e) => handleInputChange("arrondissement", e.target.value)} placeholder="Arrondissement" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="departement">Département</Label>
        <Input id="departement" value={formData.departement} onChange={(e) => handleInputChange("departement", e.target.value)} placeholder="Département" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="village">Village</Label>
        <Input id="village" value={formData.village} onChange={(e) => handleInputChange("village", e.target.value)} placeholder="Village" />
      </div>
    </div>
  </div>
);

export const AdditionalInfoForm: React.FC<StepFormProps> = ({
  formData,
  handleInputChange,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="ethnie">Ethnie</Label>
        <Input id="ethnie" value={formData.ethnie} onChange={(e) => handleInputChange("ethnie", e.target.value)} placeholder="Ethnie" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="situationMatrimoniale">Situation matrimoniale</Label>
        <Select value={formData.situationMatrimoniale} onValueChange={(value) => handleInputChange("situationMatrimoniale", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="célibataire">Célibataire</SelectItem>
            <SelectItem value="marié(e)">Marié(e)</SelectItem>
            <SelectItem value="divorcé(e)">Divorcé(e)</SelectItem>
            <SelectItem value="veuf(ve)">Veuf(ve)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    {formData.situationMatrimoniale === "marié(e)" && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nomEpoux">Nom de l'époux(se)</Label>
          <Input id="nomEpoux" value={formData.nomEpoux} onChange={(e) => handleInputChange("nomEpoux", e.target.value)} placeholder="Nom de l'époux(se)" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEpoux">Contact de l'époux(se)</Label>
          <Input id="contactEpoux" type="tel" value={formData.contactEpoux} onChange={(e) => handleInputChange("contactEpoux", e.target.value)} placeholder="Contact de l'époux(se)" />
        </div>
      </div>
    )}
  </div>
);

export const AcademicInfoForm: React.FC<StepFormProps> = ({
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="formation">
        Formation Souhaitée <span className="text-red-500">*</span>
      </Label>
      <Select
        value={formData.formation}
        onValueChange={(value) => handleInputChange("formation", value)}
      >
        <SelectTrigger className={errors.formation ? "border-red-500" : ""}>
          <SelectValue placeholder="Choisissez votre formation" />
        </SelectTrigger>
        <SelectContent>
          {formations.map((formation) => (
            <SelectItem key={formation.id} value={formation.id}>
              {formation.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.formation && (
        <p className="text-sm text-red-600">{errors.formation}</p>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="niveauEtude">Niveau d'étude</Label>
        <Input id="niveauEtude" value={formData.niveauEtude} onChange={(e) => handleInputChange("niveauEtude", e.target.value)} placeholder="Niveau d'étude" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="etablissementOrigine">Établissement d'origine</Label>
        <Input id="etablissementOrigine" value={formData.etablissementOrigine} onChange={(e) => handleInputChange("etablissementOrigine", e.target.value)} placeholder="Établissement d'origine" />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="matriculeConcours">Matricule du concours d'entrée</Label>
      <Input id="matriculeConcours" value={formData.matriculeConcours} onChange={(e) => handleInputChange("matriculeConcours", e.target.value)} placeholder="Matricule du concours" />
    </div>
  </div>
);

export const DocumentsForm: React.FC<StepFormProps> = ({
  formData,
  errors,
  handleFileChange,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUpload
        label="Photo d'identité (Recto)"
        documentType="photoIdentiteRecto"
        required
        file={formData.documents.photoIdentiteRecto}
        onFileChange={handleFileChange}
        error={errors.photoIdentiteRecto}
        description="Face avant de votre carte d'identité"
      />
      <FileUpload
        label="Photo d'identité (Verso)"
        documentType="photoIdentiteVerso"
        required
        file={formData.documents.photoIdentiteVerso}
        onFileChange={handleFileChange}
        error={errors.photoIdentiteVerso}
        description="Face arrière de votre carte d'identité"
      />
      <FileUpload
        label="Photo 4x4"
        documentType="photo4x4"
        required
        file={formData.documents.photo4x4}
        onFileChange={handleFileChange}
        error={errors.photo4x4}
        description="Photo d'identité récente, format 4x4"
      />
      <FileUpload
        label="Relevé de notes"
        documentType="releveNotes"
        file={formData.documents.releveNotes}
        onFileChange={handleFileChange}
        error={errors.releveNotes}
      />
      <FileUpload
        label="Diplôme"
        documentType="diplome"
        file={formData.documents.diplome}
        onFileChange={handleFileChange}
        error={errors.diplome}
      />
      <FileUpload
        label="Acte de naissance"
        documentType="acteNaissance"
        file={formData.documents.acteNaissance}
        onFileChange={handleFileChange}
        error={errors.acteNaissance}
      />
      <FileUpload
        label="Attestation de réussite au concours"
        documentType="attestationConcours"
        file={formData.documents.attestationConcours}
        onFileChange={handleFileChange}
        error={errors.attestationConcours}
      />
    </div>
  </div>
);

export const ConfirmationSummary: React.FC<StepFormProps> = ({
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="space-y-6">
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-[#3b2c6a]">
        Récapitulatif de votre demande
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-medium">Nom:</span> {formData.nom}</div>
          <div><span className="font-medium">Prénom:</span> {formData.prenom}</div>
          <div><span className="font-medium">Date de naissance:</span> {formData.dateNaissance}</div>
          <div><span className="font-medium">Formation souhaitée:</span> {formations.find((f) => f.id === formData.formation)?.nom || formData.formation}</div>
        </div>
      </div>
    </div>

    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Documents qui seront générés
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white rounded border">
          <FileText className="h-5 w-5 text-[#ff9900]" />
          <div>
            <p className="font-medium">Fiche de Renseignements Officielle</p>
            <p className="text-sm text-gray-600">Document officiel avec toutes vos informations</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded border">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium">Confirmation d'Inscription</p>
            <p className="text-sm text-gray-600">Accusé de réception de votre demande</p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-start space-x-2">
      <Checkbox
        id="accepteConditions"
        checked={formData.accepteConditions}
        onCheckedChange={(checked) => handleInputChange("accepteConditions", checked ? "true" : "false")}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="accepteConditions"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          J'accepte les conditions d'admission <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-muted-foreground">
          En cochant cette case, je confirme que toutes les informations fournies sont exactes et j'accepte les conditions d'admission de l'EPFPS.
        </p>
      </div>
    </div>
    {errors.accepteConditions && (
      <p className="text-sm text-red-600">{errors.accepteConditions}</p>
    )}

    {Object.keys(errors).length > 0 && (
      <Alert>
        <AlertDescription>
          Veuillez corriger les erreurs avant de soumettre votre demande.
        </AlertDescription>
      </Alert>
    )}
  </div>
);
