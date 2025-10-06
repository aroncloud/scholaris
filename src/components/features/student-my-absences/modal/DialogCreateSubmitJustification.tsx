'use client';

import React, { useState } from "react";
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
import { uploadFile } from "@/lib/UploadFile";
import { submitJustification } from "@/actions/studentMyAbsencesAction";
import type { Absence, SubmitJustificationPayload, JustificationFile } from "@/types/studentmyabsencesTypes";
import { Loader2, Upload, FileText, FileUp } from "lucide-react";
import { showToast } from "@/components/ui/showToast";

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
    const [file, setFile] = useState<File | null>(null);
    const [uploadedFile, setUploadedFile] = useState<JustificationFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("");


    // Handle file selection & upload to Cloudflare R2
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setLoading(true);

        try {
            const result = await uploadFile(selected);
            if (result?.success && result?.url) {
                const uploaded: JustificationFile = {
                    content_url: result.url,
                    title: selected.name,
                    type_code: selectedType || "OTHER", 
                };

                setUploadedFile(uploaded);
                showToast({
                    variant: "success-solid",
                    message: "Fichier téléversé avec succès !",
                });
            } else {
                showToast({
                    variant: "error-solid",
                    message: "Échec du téléversement du fichier.",
                });
            }
        } catch (error) {
            console.error("Upload failed:", error);
            showToast({
                variant: "error-solid",
                message: "Erreur lors du téléversement du fichier.",
            });
        } finally {
            setLoading(false);
        }
    };

    //  Submit the justification
    const handleSubmit = async () => {
        if (selectedAbsences.length === 0) {
            showToast({
                variant: "warning",
                message: "Veuillez sélectionner au moins une absence.",
            });
            return;
        }
        if (!reason.trim()) {
            showToast({
                variant: "warning",
                message: "Veuillez saisir le motif de votre justification.",
            });
            return;
        }
        if (!uploadedFile) {
            showToast({
                variant: "warning",
                message: "Veuillez téléverser un justificatif.",
            });
            return;
        }

        const selectedAbsenceCodes = selectedAbsences.map(
            (i) => absencesData[i]?.absence_code
        );

        const payload: SubmitJustificationPayload = {
            absence_codes: selectedAbsenceCodes,
            reason,
            files: [uploadedFile],
        };

        setLoading(true);
        try {
            const result = await submitJustification(payload);
            if (result?.code === "success") {
                showToast({
                    variant: "success-solid",
                    message: "Justification soumise avec succès !",
                });
                setReason("");
                setFile(null);
                setUploadedFile(null);
                setIsSubmitJustificationOpen(false);
            } else {
                showToast({
                    variant: "error-solid",
                    message: "Échec de la soumission.",
                });
            }
        } catch (error) {
            console.error("Submit error:", error);
            showToast({
                variant: "error-solid",
                message: "Erreur lors de la soumission du justificatif.",
            });
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
                <div className="w-full">
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

                {/* 📎 File Upload */}
                <div className="space-y-2">
                    <Label htmlFor="file">Fichier justificatif</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="flex-1"
                            onChange={handleFileUpload}
                            disabled={loading}
                        />
                        <Button
                            type="button"
                            onClick={() => document.getElementById("file")?.click()}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" /> Téléversement...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" /> Parcourir
                                </>
                            )}
                        </Button>
                        {loading && <Loader2 className="animate-spin h-5 w-5 text-blue-500" />}
                    </div>

                    {/* Display uploaded file info */}
                    {uploadedFile && (
                        <div className="flex items-center space-x-2 text-sm text-green-700 mt-2">
                            <FileText className="h-4 w-4" />
                            <span>{uploadedFile.title}</span>
                        </div>
                    )}
                </div>


                {/*  Reason */}
                <div className="space-y-2">
                    <Label htmlFor="reason">Description</Label>
                    <Textarea
                        id="reason"
                        placeholder="Décrivez brièvement le motif de vos absences..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                {/*  Absence Selection */}
                <div className="space-y-3 max-h-56 overflow-y-auto border p-3 rounded-md bg-gray-50">
                    {absencesData.map((absence, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                                id={`absence-${index}`}
                                checked={selectedAbsences.includes(index)}
                                onCheckedChange={(checked) =>
                                    handleAbsenceSelection(index, Boolean(checked))
                                }
                            />
                            <Label htmlFor={`absence-${index}`} className="text-sm">
                                {new Date(absence.recorded_at).toLocaleDateString("fr-FR")} — {absence.course_unit_name} ({absence.session_title})
                            </Label>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsSubmitJustificationOpen(false)}
                        disabled={loading} 
                    >
                        Annuler
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={
                            loading || selectedAbsences.length === 0 
                        }
                        className={`bg-blue-600 hover:bg-blue-700 text-white transition-all ${selectedAbsences.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Soumission...
                            </>
                        ) : (
                            <>
                                <FileUp className="h-4 w-4 mr-2" /> Soumettre justificatif
                            </>
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}