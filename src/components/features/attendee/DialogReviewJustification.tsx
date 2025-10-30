import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/custom-ui/Avatar';
import { 
  Loader2, 
  User, 
  Calendar, 
  BookOpen, 
  Paperclip, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  FileText
} from 'lucide-react';
import { formatDateToText } from '@/lib/utils';
import { IGetStudentAbsence } from '@/types/absenceTypes';
import { IGetJustificationDetail } from '@/types/planificationType';

interface DialogReviewJustificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  absence: IGetStudentAbsence;
  justification: IGetJustificationDetail | null;
  isLoading?: boolean;
  onSubmit: (action: 'APPROVE' | 'REJECT', comment: string) => Promise<void>;
}

export const DialogReviewJustification: React.FC<DialogReviewJustificationProps> = ({
  open,
  onOpenChange,
  absence,
  justification,
  isLoading = false,
  onSubmit,
}) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fullName = `${absence.first_name} ${absence.last_name}`;

    useEffect(() => {
        if (open) {
        setComment('');
        }
    }, [open]);

    const handleSubmit = async (action: 'APPROVE' | 'REJECT') => {
        if (action === 'REJECT' && !comment.trim()) {
            alert("Le commentaire est requis pour rejeter une justification.");
            return;
        }
        
        setIsSubmitting(true);
        await onSubmit(action, comment);
        setIsSubmitting(false);
    };
  
    const InfoLine = ({
        icon,
        label,
        value,
    }: {
        icon: React.ReactNode;
        label: string;
        value: string | React.ReactNode;
    }) => (
    <div className="flex items-center gap-2.5 py-1.5 transition-colors hover:bg-accent/50 rounded-md px-2.5 -mx-2.5">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold truncate">{value}</p>
        </div>
    </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="px-5 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Examiner la justification
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Pour l&apos;absence de <span className="font-semibold text-foreground/80">{fullName}</span> au cours de{' '}
                        <span className="font-semibold text-foreground/80">{absence.course_unit_name}</span>
                    </DialogDescription>
                </DialogHeader>
            
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                        </div>
                        <p className="text-muted-foreground text-sm">Chargement des détails...</p>
                    </div>
                ) : !justification ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
                        <div className="p-3 rounded-full bg-destructive/10">
                            <Info className="h-10 w-10 text-destructive" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg">Aucune justification trouvée</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                                L&apos;étudiant n&apos;a pas encore soumis de justification pour cette absence.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="max-h-[70vh] overflow-y-auto">
                        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Colonne 1: Informations générales */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <User className="h-4 w-4" />
                                    <h3 className="font-semibold text-base">Informations de l&apos;étudiant</h3>
                                </div>
                                
                                {/* Carte étudiant */}
                                <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12" />
                                    <div className="relative flex items-center gap-3">
                                        <Avatar
                                            fallback={fullName}
                                            variant="info"
                                            size="lg"
                                        />
                                        <div>
                                            <p className="font-semibold text-base">{fullName}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{absence.student_number}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Détails de la séance */}
                                <div className="space-y-0.5 rounded-lg border bg-card/50 p-4 shadow-sm">
                                    <InfoLine icon={<BookOpen className="h-3.5 w-3.5" />} label="Cours" value={justification.session.course_unit_name} />
                                    <InfoLine icon={<Clock className="h-3.5 w-3.5" />} label="Séance" value={justification.session.session_title} />
                                    <InfoLine icon={<Calendar className="h-3.5 w-3.5" />} label="Date" value={formatDateToText(justification.recorded_at)} />
                                    <InfoLine icon={<User className="h-3.5 w-3.5" />} label="Enseignant" value={justification.session.teacher_name} />
                                </div>
                            </div>
                        
                            {/* Colonne 2: Justification */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <FileText className="h-4 w-4" />
                                    <h3 className="font-semibold text-base">Justification soumise</h3>
                                </div>
                                
                                {/* Carte justification */}
                                <div className="space-y-3 rounded-lg border bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 p-4 shadow-sm">
                                    {justification.justification?.submitted_at && 
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        Soumise le {formatDateToText(justification.justification?.submitted_at)}
                                    </div>
                                    }
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/30 rounded-full" />
                                        <blockquote className="pl-3 text-sm text-foreground/90 leading-relaxed">
                                            {justification.justification?.reason}
                                        </blockquote>
                                    </div>
                                </div>
                                
                                {/* Documents */}
                                {justification.justification?.documents && justification.justification.documents?.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <Paperclip className="h-3.5 w-3.5 text-primary" />
                                            <h4 className="font-semibold text-sm">Documents joints</h4>
                                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                                {justification.justification.documents.length}
                                            </span>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {justification.justification.documents.map(doc => (
                                                <li key={doc.content_code} 
                                                    className="group flex items-center justify-between rounded-md border bg-card p-2.5 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                                                    <span className="text-sm font-medium truncate pr-2 group-hover:text-primary transition-colors">{doc.title}</span>
                                                    <a href={doc.content_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                                        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                                                            <Download className="h-3 w-3"/>
                                                            Voir
                                                        </Button>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Zone de décision */}
                        <div className="bg-gradient-to-r from-muted/80 to-muted/40 px-5 py-4 border-t">
                            <div className="space-y-2">
                                <Label htmlFor="review-comment" className="text-sm font-semibold flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary rounded-full" />
                                    Votre décision
                                </Label>
                                <Textarea
                                    id="review-comment"
                                    placeholder="Ajoutez un commentaire (requis pour un rejet)..."
                                    className='bg-white border-2 focus:border-primary transition-colors min-h-[80px]'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Footer */}
                <DialogFooter className="px-5 py-3.5 bg-muted/30 flex-col-reverse sm:flex-row sm:justify-between gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isSubmitting} className="sm:w-auto w-full">
                            Annuler
                        </Button>
                    </DialogClose>
                    {justification && !isLoading && (
                        <div className='flex gap-2 sm:w-auto w-full'>
                            <Button 
                                variant="danger" 
                                onClick={() => handleSubmit('REJECT')} 
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4"/>}
                                Rejeter
                            </Button>
                            <Button 
                                onClick={() => handleSubmit('APPROVE')} 
                                disabled={isSubmitting}
                                variant="success"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4"/>}
                                Approuver
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};