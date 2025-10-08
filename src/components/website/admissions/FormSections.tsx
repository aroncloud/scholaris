/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useMemo, useState } from "react";
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
import { IConfig, ICountryMap } from "@/types/utilitiesTypes";
import { regroupLocation } from "@/lib/utils";
import { MARITAl_STATUS } from "@/constant";
import { IFactorizedProgram } from "@/types/programTypes";
import { DatePicker } from "@/components/DatePicker";
import { Combobox } from "@/components/ui/Combobox";

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
  configs: IConfig | null;
  applicationCode: string;
  programList: IFactorizedProgram[];
  handleInputChange: (field: string, value: string) => void;
  handleFileChange: (
    documentType: keyof FormData["documents"],
    file: File | null,
  ) => void;
}


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
        <DatePicker
          label=""
          minDate={new Date(1900, 0, 1)}
          onChange={(e) => {
            if(e){
              handleInputChange("dateNaissance", e?.toJSON().split('T')[0])
             }
          }}
          selected={formData.dateNaissance ? new Date(formData.dateNaissance) : undefined}
        />
        {errors.dateNaissance && <p className="text-sm text-red-600">{errors.dateNaissance}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lieuNaissance">Lieu de naissance <span className="text-red-500">*</span></Label>
        <Input id="lieuNaissance" value={formData.lieuNaissance} onChange={(e) => handleInputChange("lieuNaissance", e.target.value)} placeholder="Lieu de naissance" className={errors.lieuNaissance ? "border-red-500" : ""} />
        {errors.lieuNaissance && <p className="text-sm text-red-600">{errors.lieuNaissance}</p>}
      </div>

      
      <div className="space-y-2">
        <Label htmlFor="cni_issue_date">Date de delivrance de la CNI <span className="text-red-500">*</span></Label>
        {/* <Input id="cni_issue_date" type="date" value={formData.cni_issue_date} onChange={(e) => handleInputChange("cni_issue_date", e.target.value)} className={errors.cni_issue_date ? "border-red-500" : ""} /> */}
        <DatePicker
          label=""
          minDate={new Date(1900, 0, 1)}
          onChange={(e) => {
            if(e){
              handleInputChange("cni_issue_date", e?.toJSON().split('T')[0])
             }
          }}
          selected={formData.cni_issue_date ? new Date(formData.cni_issue_date) : undefined}
        />
        {errors.cni_issue_date && <p className="text-sm text-red-600">{errors.cni_issue_date}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input id="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="Email" className={errors.email ? "border-red-500" : ""} />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
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
  configs,
  errors,
}) => {
  // On regroupe les données en structure hiérarchique
  const countryMap: ICountryMap = useMemo(() => {
    if (!configs) {
      return { regions: [] };
    }
    return regroupLocation({
      arrondissements: configs.arrondissements,
      departments: configs.departments,
      regions: configs.regions
    });
  }, [configs]);

  const [departments, setDepartments] = useState<{ code: string; name: string }[]>([]);
  const [arrondissements, setArrondissements] = useState<{ code: string; name: string }[]>([]);

  // Mettre à jour les départements quand la région change
  useEffect(() => {
    const region = countryMap.regions.find(r => r.region_code === formData.region);
    if (region) {
      setDepartments(region.departments.map(d => ({ code: d.department_code, name: d.department_name })));
    } else {
      setDepartments([]);
    }
    setArrondissements([]);
    handleInputChange("departement", "");
    handleInputChange("arrondissement", "");
  }, [formData.region, countryMap, handleInputChange]);

  // Mettre à jour les arrondissements quand le département change
  useEffect(() => {
    const region = countryMap.regions.find(r => r.region_code === formData.region);
    const dept = region?.departments.find(d => d.department_code === formData.departement);
    if (dept) {
      setArrondissements(dept.arrondissements.map(a => ({ code: a.arrondissement_code, name: a.arrondissement_name })));
    } else {
      setArrondissements([]);
    }
    handleInputChange("arrondissement", "");
  }, [formData.departement, formData.region, countryMap, handleInputChange]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Région */}
        <div className="space-y-2">
          <Label htmlFor="region">Région <span className="text-red-500">*</span></Label>
          <Combobox
            options={countryMap.regions.map(r => ({ 
                value: r.region_code, 
                label: r.region_name
            }))}
            value={formData.region}
            onChange={(value) => handleInputChange("region", value)}
            placeholder="Sélectionner un cours"
            
          />
          {errors.region && <p className="text-sm text-red-600">{errors.region}</p>}
        </div>

        {/* Département */}
        <div className="space-y-2">
          <Label htmlFor="departement">Département <span className="text-red-500">*</span></Label>
          <Combobox
            options={departments.map(d => ({ 
                value: d.code, 
                label: d.name
            }))}
            value={formData.departement}
            onChange={(value) => handleInputChange("departement", value)}
            placeholder="Sélectionnez le département"
            
          />
          {errors.departement && <p className="text-sm text-red-600">{errors.departement}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arrondissement */}
        <div className="space-y-2">
          <Label htmlFor="arrondissement">Arrondissement <span className="text-red-500">*</span></Label>
          <Combobox
            options={arrondissements.map(a => ({ 
                value: a.code, 
                label: a.name
            }))}
            value={formData.arrondissement}
            onChange={(value) => handleInputChange("arrondissement", value)}
            placeholder="Sélectionnez l'arrondissement"
            
          />
          {errors.arrondissement && <p className="text-sm text-red-600">{errors.arrondissement}</p>}
        </div>

        {/* Village */}
        <div className="space-y-2">
          <Label htmlFor="village">Village <span className="text-red-500">*</span></Label>
          <Input
            id="village"
            value={formData.village}
            onChange={(e) => handleInputChange("village", e.target.value)}
            placeholder="Village"
          />
          {errors.village && <p className="text-sm text-red-600">{errors.village}</p>}
        </div>
      </div>
    </div>
  );
};

export const AdditionalInfoForm: React.FC<StepFormProps> = ({
  formData,
  handleInputChange,
  configs,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ethnie */}
        <div className="space-y-2">
          <Label htmlFor="ethnie">Ethnie <span className="text-red-500">*</span></Label>
          <Combobox
            options={((configs && configs.ethnicities.map(c => ({ 
                value: c.ethnicity_code, 
                label: c.ethnicity_name
            }))) ?? [])}
            value={formData.ethnie}
            onChange={(value) => handleInputChange("ethnie", value)}
            placeholder="Sélectionnez l'ethnie"
            
          />
          {errors.ethnie && <p className="text-sm text-red-600">{errors.ethnie}</p>}
        </div>

        {/* Situation matrimoniale */}
        <div className="space-y-2">
          <div className="space-y-2"> 
              <Label htmlFor="situationMatrimoniale">Situation matrimoniale</Label>
              <Select value={formData.situationMatrimoniale} onValueChange={(value) => handleInputChange("situationMatrimoniale", value)}>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAl_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
          </div>
        </div>
      </div>

      {/* Si marié(e), afficher les champs époux(se) */}
      {formData.situationMatrimoniale === "MARRIED" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nomEpoux">Nom de l'époux(se)</Label>
            <Input
              id="nomEpoux"
              value={formData.nomEpoux}
              onChange={(e) => handleInputChange("nomEpoux", e.target.value)}
              placeholder="Nom de l'époux(se)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEpoux">Contact de l'époux(se)</Label>
            <Input
              id="contactEpoux"
              type="tel"
              value={formData.contactEpoux}
              onChange={(e) => handleInputChange("contactEpoux", e.target.value)}
              placeholder="Contact de l'époux(se)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const AcademicInfoForm: React.FC<StepFormProps> = ({
  formData,
  errors,
  handleInputChange,
  programList
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string>("")

  // Récupérer les curriculums pour le programme choisi
  const selectedCurriculums =
    programList.find(p => p.program.program_code === selectedProgram)?.curriculums || []

  return (
    <div className="space-y-6">
      {/* Sélection du programme */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="formation">
            Formation Souhaitée <span className="text-red-500">*</span>
          </Label>
          <Combobox
            options={programList.map(p => ({ 
                value: p.program.program_code, 
                label: p.program.program_name
            }))}
            value={formData.formation}
            onChange={(value) => {
              handleInputChange("formation", value)
              setSelectedProgram(value)
              handleInputChange("curriculum", "") 
            }}
            placeholder="Sélectionnez la formation"
            
          />
          {errors.formation && <p className="text-sm text-red-600">{errors.formation}</p>}
        </div>

        
        <div className="space-y-2">
          <Label htmlFor="curriculum">Curriculum <span className="text-red-500">*</span></Label>
          <Combobox
            options={selectedCurriculums.map(c => ({ 
                value: c.curriculum_code, 
                label: c.curriculum_name
            }))}
            value={formData.curriculum}
            onChange={(value) => handleInputChange("curriculum", value)}
            placeholder="Sélectionnez le curriculum"
            
          />
          {errors.curriculum && <p className="text-sm text-red-600">{errors.curriculum}</p>}
        </div>

      </div>

      {/* Autres champs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="education_level_code">Niveau d&apos;éducation <span className="text-red-500">*</span></Label>
          <Select
            value={formData.niveauEtude}
            onValueChange={(e) => handleInputChange("niveauEtude", e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Diplome d'éntre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BACCALAUREAT">Baccalauréat</SelectItem>
              <SelectItem value="LICENCE">Licence</SelectItem>
              <SelectItem value="MASTER">Master</SelectItem>
            </SelectContent>
          </Select>
          {errors.niveauEtude && <p className="text-sm text-red-600">{errors.niveauEtude}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="etablissementOrigine">Établissement d'origine <span className="text-red-500">*</span></Label>
          <Input
            id="etablissementOrigine"
            value={formData.etablissementOrigine}
            onChange={(e) => handleInputChange("etablissementOrigine", e.target.value)}
            placeholder="Établissement d'origine"
          />
          {errors.etablissementOrigine && <p className="text-sm text-red-600">{errors.etablissementOrigine
            }</p>}
        </div>
      </div>
    </div>
  )
}

export const DocumentsForm: React.FC<StepFormProps> = ({
  formData,
  errors,
  handleFileChange,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUpload
        label="CNI Recto"
        documentType="cniRecto"
        required
        file={formData.documents.cniRecto}
        onFileChange={handleFileChange}
        error={errors.cniRecto}
        description="Face avant de votre carte d'identité"
      />
      <FileUpload
        label="CNI Verso"
        documentType="cniVerso"
        required
        file={formData.documents.cniVerso}
        onFileChange={handleFileChange}
        error={errors.cniVerso}
        description="Face arrière de votre carte d'identité"
      />
      <FileUpload
        label="Photo d'identité 4x4"
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
        required
        file={formData.documents.releveNotes}
        onFileChange={handleFileChange}
        error={errors.releveNotes}
        description="Votre relevé de notes le plus récent"
      />
      <FileUpload
        label="Diplôme"
        documentType="diplome"
        required
        file={formData.documents.diplome}
        onFileChange={handleFileChange}
        error={errors.diplome}
        description="Copie de votre diplôme"
      />
      <FileUpload
        label="Acte de naissance"
        documentType="acteNaissance"
        required
        file={formData.documents.acteNaissance}
        onFileChange={handleFileChange}
        error={errors.acteNaissance}
        description="Copie de votre acte de naissance"
      />
      <FileUpload
        label="Page d'entente du résultat de concours"
        documentType="pageResultatConcours"
        required
        file={formData.documents.pageResultatConcours}
        onFileChange={handleFileChange}
        error={errors.pageResultatConcours}
        description="Page montrant l'entente du résultat"
      />
      <FileUpload
        label="Page avec votre nom du résultat de concours"
        documentType="pageNomConcours"
        required
        file={formData.documents.pageNomConcours}
        onFileChange={handleFileChange}
        error={errors.pageNomConcours}
        description="Page où apparaît votre nom"
      />
    </div>
  </div>
);

export const ConfirmationSummary: React.FC<StepFormProps> = ({
  formData,
  errors,
  handleInputChange,
  programList
}) => {

  return (
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
            <div>
              <span className="font-medium">Formation souhaitée:</span> {programList.find(item => item.program.program_code === formData.formation)?.program.program_name || 'N/A'}
            </div>
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
          checked={formData.accepteConditions === "true"}
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
  )
};
