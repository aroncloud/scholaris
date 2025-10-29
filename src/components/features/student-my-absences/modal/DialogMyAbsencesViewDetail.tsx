'use client'

import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { Absence } from "@/types/studentmyabsencesTypes";

interface DialogMyAbsencesViewDetailProps {
    isDetailsDialogOpen: boolean;
    setIsDetailsDialogOpen: (open: boolean) => void;
    selectedAbsence: Absence | null;
    getStatutColor: (statut: string) => string;
    getStatutLabel: (statut: string) => string;
    handleSubmitJustification: () => void;
}

export default function DialogMyAbsencesViewDetail({
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    selectedAbsence,
    getStatutColor,
    handleSubmitJustification,
}: DialogMyAbsencesViewDetailProps) {

    const calculateTotalHours = (start?: string, end?: string) => {
        if (!start || !end) return "—";
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // hours
        return diff.toFixed(2);
    }

    return (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Détails de l&apos;Absence</DialogTitle>
                    <DialogDescription>
                        Informations complètes sur cette absence
                    </DialogDescription>
                </DialogHeader>

                {selectedAbsence && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Date</Label>
                                <p className="text-sm">{new Date(selectedAbsence.recorded_at).toLocaleString('fr-FR')}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Horaires</Label>
                                <p className="text-sm">
                                    {new Date(selectedAbsence.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
                                    {new Date(selectedAbsence.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">UE</Label>
                                <p className="text-sm">{selectedAbsence.course_unit_name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Durée</Label>
                                <p className="text-sm">{calculateTotalHours(selectedAbsence.start_time, selectedAbsence.end_time)} heures</p>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Cours</Label>
                            <p className="text-sm">{selectedAbsence.session_title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Statut</Label>
                                <Badge className={getStatutColor(selectedAbsence.status_code)}>
                                    {selectedAbsence.status_code}
                                </Badge>
                            </div>
                        </div>

                        {/* {selectedAbsence.motif && (
                            <div>
                                <Label className="text-sm font-medium">Motif</Label>
                                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedAbsence.motif}</p>
                            </div>
                        )} */}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                        Fermer
                    </Button>
                    {selectedAbsence?.status_code === "UNJUSTIFIED" && (
                        <Button onClick={handleSubmitJustification} className="bg-blue-600 hover:bg-blue-700">
                            <FileUp className="h-4 w-4 mr-2" />
                            Soumettre justificatif
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
