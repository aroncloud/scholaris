'use client';

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Absence } from "@/types/studentmyabsencesTypes";
import { Upload, FileUp } from "lucide-react";
import { submitJustification } from "@/actions/studentMyAbsencesAction";
import { showToast } from "@/components/ui/showToast";
import { useUserStore } from "@/store/useAuthStore";

interface DialogCreateSubmitJustificationProps {
  isSubmitJustificationOpen: boolean;
  setIsSubmitJustificationOpen: (open: boolean) => void;
  absencesData: Absence[];
  selectedAbsences: number[];
  handleAbsenceSelection: (absenceId: number, checked: boolean) => void;
}

export default function DialogCreateSubmitJustification({
  isSubmitJustificationOpen,
  setIsSubmitJustificationOpen,
  absencesData,
  selectedAbsences,
  handleAbsenceSelection,
}: DialogCreateSubmitJustificationProps) {
  const [reason, setReason] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const user = useUserStore((state) => state.user);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!user?.user?.user_code) {
      showToast({ variant: "error-solid", message: "Utilisateur non trouvé" });
      return;
    }
    if (!selectedFile) {
      showToast({ variant: "error-solid", message: "Veuillez téléverser un fichier" });
      return;
    }
    if (!selectedType) {
      showToast({ variant: "error-solid", message: "Veuillez sélectionner le type de justificatif" });
      return;
    }
    if (selectedAbsences.length === 0) {
      showToast({ variant: "error-solid", message: "Veuillez sélectionner au moins une absence" });
      return;
    }

    setLoading(true);

    const payload = {
      absence_codes: selectedAbsences.map(index => absencesData[index].absence_code),
      reason,
      files: [{ content_url: "", title: selectedFile.name, type_code: selectedType }],
    };

    try {
      const result = await submitJustification(payload, selectedFile, user.user.user_code);

      console.log("➡️ Submit Justification Result:", result);

      if (result.code === "success") {
        showToast({ variant: "success-solid", message: "Justificatif soumis avec succès" });
        setIsSubmitJustificationOpen(false);
        setReason("");
        setSelectedType("");
        setSelectedFile(null);
      } else {
        showToast({ variant: "error-solid", message: result.error || "Une erreur est survenue" });
      }
    } catch (error: any) {
      console.error("💥 handleSubmit error:", error);
      showToast({ variant: "error-solid", message: "Erreur lors de la soumission" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isSubmitJustificationOpen} onOpenChange={setIsSubmitJustificationOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Soumettre un justificatif</DialogTitle>
          <DialogDescription>
            Sélectionnez les absences concernées et téléversez votre justificatif.
          </DialogDescription>
        </DialogHeader>

        {/* Type de justificatif */}
        <div className="w-full mb-4">
          <Label htmlFor="type">Type de justificatif</Label>
          <Select onValueChange={(value) => setSelectedType(value)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEDICAL_CERTIFICATE">Certificat médical</SelectItem>
              <SelectItem value="FAMILY_REASON">Justificatif familial</SelectItem>
              <SelectItem value="TRANSPORT_ISSUE">Problème de transport</SelectItem>
              <SelectItem value="INTERNSHIP_DOCUMENT">Convention de stage</SelectItem>
              <SelectItem value="OTHER">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File Upload */}
        <div className="w-full mb-4">
          <Label htmlFor="fichier">Fichier justificatif</Label>
          <div className="mt-1 flex items-center space-x-2 w-full">
            <Input
              id="fichier"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="flex-1"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Parcourir
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Formats acceptés: PDF, JPG, PNG (max 5MB)
          </p>
        </div>

        {/* Reason */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="reason">Description</Label>
          <Textarea
            id="reason"
            placeholder="Décrivez brièvement le motif de vos absences..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Absence Selection */}
        <div className="space-y-3 max-h-56 overflow-y-auto border p-3 rounded-md bg-gray-50 mb-4">
          {absencesData
            .filter(absence => absence.status_code === "UNJUSTIFIED")
            .map((absence, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`absence-${index}`}
                  checked={selectedAbsences.includes(index)}
                  onCheckedChange={(checked) => handleAbsenceSelection(index, Boolean(checked))}
                />
                <Label htmlFor={`absence-${index}`} className="text-sm">
                  {new Date(absence.recorded_at).toLocaleDateString("fr-FR")} — {absence.course_unit_name} ({absence.session_title})
                </Label>
              </div>
            ))}
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsSubmitJustificationOpen(false)}>
            Annuler
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit} disabled={selectedAbsences.length === 0 || loading}>
            <FileUp className="h-4 w-4 mr-2" />
            {loading ? "Soumission..." : "Soumettre justificatif"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




// 'use client';

// import React, { useRef, useState } from "react";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import type { Absence} from "@/types/studentmyabsencesTypes";
// import { Upload, FileUp } from "lucide-react";

// interface DialogCreateSubmitJustificationProps {
//     isSubmitJustificationOpen: boolean;
//     setIsSubmitJustificationOpen: (open: boolean) => void;
//     absencesData: Absence[];
//     selectedAbsences: number[];
//     handleAbsenceSelection: (absenceId: number, checked: boolean) => void;
// }

// export default function DialogCreateSubmitJustification({
//     isSubmitJustificationOpen,
//     setIsSubmitJustificationOpen,
//     absencesData,
//     selectedAbsences,
//     handleAbsenceSelection,
// }: DialogCreateSubmitJustificationProps) {
//     const [reason, setReason] = useState("");

//     const [selectedType, setSelectedType] = useState<string>("");

//     const fileInputRef = useRef<HTMLInputElement | null>(null);



//     return (
//         <Dialog open={isSubmitJustificationOpen} onOpenChange={setIsSubmitJustificationOpen}>
//             <DialogContent className="max-w-2xl">
//                 <DialogHeader>
//                     <DialogTitle>Soumettre un justificatif</DialogTitle>
//                     <DialogDescription>
//                         Sélectionnez les absences concernées et téléversez votre justificatif.
//                     </DialogDescription>
//                 </DialogHeader>

//                 {/* Type de justificatif */}
//                 <div className="w-full">
//                     <Label htmlFor="type">Type de justificatif</Label>
//                     <Select onValueChange={(value) => setSelectedType(value)}>
//                         <SelectTrigger className="w-full mt-1">
//                             <SelectValue placeholder="Sélectionner le type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="MEDICAL_CERTIFICATE">Certificat médical</SelectItem>
//                             <SelectItem value="FAMILY_REASON">Justificatif familial</SelectItem>
//                             <SelectItem value="TRANSPORT_ISSUE">Problème de transport</SelectItem>
//                             <SelectItem value="INTERNSHIP_DOCUMENT">Convention de stage</SelectItem>
//                             <SelectItem value="OTHER">Autre</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* 📎 File Upload */}

//                 <div className="w-full">
//                     <Label htmlFor="fichier">Fichier justificatif</Label>
//                     <div className="mt-1 flex items-center space-x-2 w-full">
//                         <Input
//                             id="fichier"
//                             type="file"
//                             accept=".pdf,.jpg,.jpeg,.png"
//                             className="flex-1"
//                             onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) {
//                                     console.log("Selected file:", file.name); // You can store the file in state here if needed 
//                                 }
//                             }}
//                             ref={fileInputRef}
//                         />
//                         <Button className="bg-blue-600 hover:bg-blue-700 text-white"
//                             onClick={() => fileInputRef.current?.click()} >
//                             <Upload className="h-4 w-4 mr-2" />
//                             Parcourir </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground mt-1">
//                         Formats acceptés: PDF, JPG, PNG (max 5MB)
//                     </p>
//                 </div>

//                 {/*  Reason */}
//                 <div className="space-y-2">
//                     <Label htmlFor="reason">Description</Label>
//                     <Textarea
//                         id="reason"
//                         placeholder="Décrivez brièvement le motif de vos absences..."
//                         value={reason}
//                         onChange={(e) => setReason(e.target.value)}
//                     />
//                 </div>

//                 {/*  Absence Selection */}
//                 <div className="space-y-3 max-h-56 overflow-y-auto border p-3 rounded-md bg-gray-50">
//                     {absencesData
//                     .filter(absence => absence.status_code === "UNJUSTIFIED")
//                     .map((absence, index) => (
//                         <div key={index} className="flex items-center space-x-2">
//                             <Checkbox
//                                 id={`absence-${index}`}
//                                 checked={selectedAbsences.includes(index)}
//                                 onCheckedChange={(checked) =>
//                                     handleAbsenceSelection(index, Boolean(checked))
//                                 }
//                             />
//                             <Label htmlFor={`absence-${index}`} className="text-sm">
//                                 {new Date(absence.recorded_at).toLocaleDateString("fr-FR")} — {absence.course_unit_name} ({absence.session_title})
//                             </Label>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Footer */}
//                 <DialogFooter className="mt-6">
//                     <Button variant="outline" onClick={() => setIsSubmitJustificationOpen(false)}>
//                         Annuler
//                     </Button>
//                     <Button
//                         className="bg-blue-600 hover:bg-blue-700 text-white"
//                         disabled={selectedAbsences.length == 0} >
//                         <FileUp className="h-4 w-4 mr-2" />
//                         Soumettre justificatif
//                     </Button>
//                 </DialogFooter>

//             </DialogContent>
//         </Dialog>
//     );
// }