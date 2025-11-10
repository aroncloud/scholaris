/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Award } from "lucide-react"
import { IGetStudentReport } from "@/types/userType"
import { formatDateToText } from "@/lib/utils"
import { useFactorizedProgramStore } from "@/store/programStore"

interface SidebarInfoProps {
  reportData: IGetStudentReport
  user: any
  activeTab: string
  setActiveTab: (tab: string) => void
  getDecisionStyle: (decision: string) => string
}


export function SidebarInfo({ reportData, user, activeTab, setActiveTab, getDecisionStyle }: SidebarInfoProps) {
    const { factorizedPrograms } = useFactorizedProgramStore();
    const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);
    return (
        <Card className="border-slate-200 sticky top-6">
        <CardHeader className="">
            <div className="flex items-center text-slate-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wider">
                Informations
            </span>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Info Étudiant */}
            {user && (
            <>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                <p className="text-xs font-medium text-blue-900 mb-2 uppercase tracking-wider">
                    Étudiant
                </p>
                <p className="text-sm font-semibold text-blue-900 break-words">
                    {user.user.first_name} {user.user.last_name}
                </p>
                <div className="mt-3 space-y-1">
                    <p className="text-xs text-blue-700">
                    <span className="font-medium">Année:</span> {reportData.enrollment_details.academic_year_code.replace("ay-", "")}
                    </p>
                    <p className="text-xs text-blue-700 break-words">
                    <span className="font-medium">Curriculum:</span> {curriculumList.find(item => item.curriculum_code === reportData.enrollment_details.curriculum_code)?.curriculum_name}
                    </p>
                </div>
                </div>
                <Separator />
            </>
            )}

            {/* Mention */}
            {reportData.annual_result?.mention && (
            <>
                <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Award className="h-4 w-4 text-slate-600" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Mention
                    </p>
                </div>
                <Badge variant="outline" className="text-base px-4 py-2 border-slate-300">
                    {reportData.annual_result.mention}
                </Badge>
                </div>
                <Separator />
            </>
            )}

            {/* Décision */}
            {reportData.annual_result?.verdict_code && (
            <>
                <div className="text-center">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                    Décision du Jury
                </p>
                <Badge className={`text-lg px-6 py-3 border ${getDecisionStyle(reportData.annual_result.verdict_code)}`}>
                    {reportData.annual_result.verdict_code}
                </Badge>
                </div>
                <Separator />
            </>
            )}

            {/* Résumé Semestres */}
            <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                Semestres
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {reportData.grades_by_schedule.map((schedule) => (
                <div
                    key={schedule.schedule_code}
                    className={`flex justify-between items-center p-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === schedule.schedule_code
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    }`}
                    onClick={() => setActiveTab(schedule.schedule_code)}
                >
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                        {schedule.sequence_name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {formatDateToText(schedule.start_date)}
                    </p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                    {schedule.status_code}
                    </Badge>
                </div>
                ))}
            </div>
            </div>

            <Separator />

            {/* Notes du jury */}
            {reportData.annual_result?.jury_notes && (
            <>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs font-medium text-slate-700 mb-2 uppercase tracking-wider">
                    Notes du jury
                </p>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                    {reportData.annual_result.jury_notes}
                </p>
                </div>
                <Separator />
            </>
            )}

            {/* Avertissement */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-900 leading-relaxed">
                Ce document est officiel. Pour toute contestation, contactez le service de la scolarité sous 15 jours.
            </p>
            </div>
        </CardContent>
        </Card>
    )
}