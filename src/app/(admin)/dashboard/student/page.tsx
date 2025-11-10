/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User,
  CreditCard, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  GraduationCap,
  Wallet,
  DollarSign,
  BookOpen,
  Award,
  Video,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from 'lucide-react';
import PageHeader from '@/layout/PageHeader';
import Badge from '@/components/custom-ui/Badge';
import StatCard from '@/components/cards/StatCard';
import { useUserStore } from '@/store/useAuthStore';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

const StudentProfileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [calendarView, setCalendarView] = useState<'timeGridWeek' | 'timeGridDay' | 'dayGridMonth' | 'listWeek'>('timeGridWeek');
  const calendarRef = useRef<FullCalendar>(null);

  const { user } = useUserStore();

  // Données du profil étudiant
  const studentProfile = {
    personal: {
      name: 'Marie DUBOIS',
      studentId: '2024-INF-001',
      photo: '/api/placeholder/150/150',
      dateOfBirth: '1999-03-15',
      placeOfBirth: 'Yaoundé, Cameroun',
      nationality: 'Camerounaise',
      address: 'Quartier Nlongkak, Yaoundé',
      phone: '+237 6XX XXX XXX',
      email: 'marie.dubois@student.edu',
      emergencyContact: {
        name: 'Paul DUBOIS',
        relationship: 'Père',
        phone: '+237 6XX XXX XXX'
      }
    },
    academic: {
      program: 'Formation Infirmier',
      specialization: 'Soins Généraux',
      currentLevel: 'Licence 2',
      currentSemester: 'Semestre 3',
      academicYear: '2024-2025',
      startDate: '2023-09-01',
      expectedGraduation: '2026-06-30',
      status: 'ACTIVE',
      advisor: 'Dr. NGONO Marie Claire'
    },
    financial: {
      totalFees: 850000, // FCFA
      paidAmount: 650000,
      remainingBalance: 200000,
      nextPaymentDue: '2025-01-15',
      paymentPlan: 'Trimestriel',
      scholarship: {
        amount: 200000,
        sponsor: 'Bourse d\'Excellence Gouvernementale',
        status: 'ACTIVE'
      },
      transactions: [
        {
          id: 'TXN-001',
          date: '2024-09-15',
          description: 'Frais de scolarité S3',
          amount: 425000,
          type: 'PAYMENT',
          status: 'COMPLETED'
        },
        {
          id: 'TXN-002',
          date: '2024-09-20',
          description: 'Bourse gouvernementale',
          amount: -200000,
          type: 'CREDIT',
          status: 'COMPLETED'
        },
        {
          id: 'TXN-003',
          date: '2024-12-10',
          description: 'Frais examens',
          amount: 25000,
          type: 'PAYMENT',
          status: 'COMPLETED'
        }
      ]
    },
    academics: {
      currentGPA: 14.2,
      totalCredits: 90,
      completedCredits: 82,
      remainingCredits: 8,
      semesters: [
        { name: 'Semestre 1', gpa: 13.5, credits: 30, status: 'COMPLETED' },
        { name: 'Semestre 2', gpa: 13.8, credits: 30, status: 'COMPLETED' },
        { name: 'Semestre 3', gpa: 14.2, credits: 22, status: 'IN_PROGRESS' }
      ]
    },
    nextSessions: [
      {
        id: 'SESSION-001',
        title: 'Anatomie et Physiologie',
        course: 'UE_IDE_ANATOMIE',
        teacher: 'Dr. MBARGA Paul',
        date: '2025-11-12',
        startTime: '08:00',
        endTime: '10:00',
        room: 'Amphi A',
        type: 'COURS_MAGISTRAL',
        status: 'SCHEDULED'
      },
      {
        id: 'SESSION-002',
        title: 'Soins Infirmiers de Base',
        course: 'UE_IDE_SOINS_BASE',
        teacher: 'Mme. NGONO Marie',
        date: '2025-11-12',
        startTime: '10:30',
        endTime: '12:30',
        room: 'Salle TP-2',
        type: 'TRAVAUX_PRATIQUES',
        status: 'SCHEDULED'
      },
      {
        id: 'SESSION-003',
        title: 'Pharmacologie Générale',
        course: 'UE_IDE_PHARMACOLOGIE',
        teacher: 'Dr. ETONDE Jean',
        date: '2025-11-13',
        startTime: '14:00',
        endTime: '16:00',
        room: 'Amphi B',
        type: 'COURS_MAGISTRAL',
        status: 'SCHEDULED'
      },
      {
        id: 'SESSION-004',
        title: 'Hygiène et Asepsie',
        course: 'UE_IDE_HYGIENE',
        teacher: 'Dr. BILE Martin',
        date: '2025-11-14',
        startTime: '09:00',
        endTime: '11:00',
        room: 'Salle TP-1',
        type: 'TRAVAUX_PRATIQUES',
        status: 'SCHEDULED'
      },
      {
        id: 'SESSION-005',
        title: 'Psychologie du Patient',
        course: 'UE_IDE_PSYCHO',
        teacher: 'Mme. ATANGANA Rose',
        date: '2025-11-14',
        startTime: '14:00',
        endTime: '16:00',
        room: 'Amphi C',
        type: 'COURS_MAGISTRAL',
        status: 'SCHEDULED'
      },
      {
        id: 'SESSION-006',
        title: 'Nutrition et Diététique',
        course: 'UE_IDE_NUTRITION',
        teacher: 'Dr. FOUDA Anne',
        date: '2025-11-15',
        startTime: '08:00',
        endTime: '10:00',
        room: 'Amphi A',
        type: 'COURS_MAGISTRAL',
        status: 'SCHEDULED'
      }
    ]
  };

  // Conversion des sessions en events FullCalendar
  const calendarEvents = studentProfile.nextSessions.map(session => {
    const sessionTypeColors: Record<string, { bg: string; border: string }> = {
      'COURS_MAGISTRAL': { bg: '#3B82F6', border: '#2563EB' },
      'TRAVAUX_DIRIGES': { bg: '#10B981', border: '#059669' },
      'TRAVAUX_PRATIQUES': { bg: '#8B5CF6', border: '#7C3AED' },
      'EXAMEN': { bg: '#EF4444', border: '#DC2626' }
    };

    const colors = sessionTypeColors[session.type] || { bg: '#6B7280', border: '#4B5563' };

    return {
      id: session.id,
      title: session.title,
      start: `${session.date}T${session.startTime}:00`,
      end: `${session.date}T${session.endTime}:00`,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      extendedProps: {
        teacher: session.teacher,
        room: session.room,
        type: session.type,
        course: session.course
      }
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XAF', 'FCFA');
  };

  const getPaymentStatus = () => {
    const { remainingBalance, nextPaymentDue } = studentProfile.financial;
    const dueDate = new Date(nextPaymentDue);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (remainingBalance === 0) {
      return { status: 'paid', color: 'text-green-600', icon: CheckCircle, message: 'Paiements à jour' };
    } else if (daysUntilDue < 0) {
      return { status: 'overdue', color: 'text-red-600', icon: AlertTriangle, message: 'Paiement en retard' };
    } else if (daysUntilDue <= 7) {
      return { status: 'due', color: 'text-yellow-600', icon: Clock, message: `Échéance dans ${daysUntilDue} jours` };
    } else {
      return { status: 'upcoming', color: 'text-blue-600', icon: Calendar, message: `Prochaine échéance: ${daysUntilDue} jours` };
    }
  };

  const getSessionTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      'COURS_MAGISTRAL': { label: 'Cours Magistral', color: 'blue' },
      'TRAVAUX_DIRIGES': { label: 'TD', color: 'green' },
      'TRAVAUX_PRATIQUES': { label: 'TP', color: 'purple' },
      'EXAMEN': { label: 'Examen', color: 'red' }
    };
    return types[type] || { label: type, color: 'gray' };
  };

  const formatSessionDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handlePrevious = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  const handleViewChange = (view: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth' | 'listWeek') => {
    setCalendarView(view);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };

  const paymentStatus = getPaymentStatus();
  const PaymentIcon = paymentStatus.icon;

  return (
    <>
      {/* Header */}
      <PageHeader
        Icon={User}
        title={studentProfile.personal.name}
        description={`${studentProfile.personal.studentId} • ${studentProfile.academic.program}`}
        status={<Badge size='sm' value={studentProfile.academic.status} label={studentProfile.academic.status} icon={CheckCircle} />}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button size="sm" variant={"info"}>
            <Download className="w-4 h-4 mr-2" />
            Certificat
          </Button>
        </div>
      </PageHeader> 

      <div className="p-4 md:p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title='Crédits Validés' value={`${studentProfile.academics.completedCredits}/${studentProfile.academics.totalCredits}`} icon={BookOpen} variant='success' main />

          <StatCard title='Solde Scolarité' value={`${formatCurrency(studentProfile.financial.remainingBalance)}`} icon={Wallet} variant='purple' />

          <StatCard title='Statut Paiement' value={paymentStatus.message} icon={PaymentIcon} variant='danger' />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white rounded-xl border border-slate-200 p-1.5 inline-flex space-x-1 shadow-sm h-auto w-full mt-6 mb-2">
            <TabsTrigger value="overview" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="sessions" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">Emploi du Temps</TabsTrigger>
            <TabsTrigger value="financial" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">Financier</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progression académique */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Progression Académique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Crédits complétés</span>
                        <span>{studentProfile.academics.completedCredits}/{studentProfile.academics.totalCredits}</span>
                      </div>
                      <Progress value={(studentProfile.academics.completedCredits / studentProfile.academics.totalCredits) * 100} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {studentProfile.academics.semesters.map((semester, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-sm">{semester.name}</div>
                          <div className="text-lg font-bold text-blue-600">{semester.gpa}/20</div>
                          <Badge size='sm' value={semester.status} label={semester.status} icon={CheckCircle} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Situation financière */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Situation Financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Frais totaux</span>
                      <span className="font-semibold">{formatCurrency(studentProfile.financial.totalFees)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Montant payé</span>
                      <span className="font-semibold text-green-600">{formatCurrency(studentProfile.financial.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Solde restant</span>
                      <span className="font-semibold text-red-600">{formatCurrency(studentProfile.financial.remainingBalance)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prochaines échéances */}
            <Card>
              <CardHeader>
                <CardTitle>Prochaines Échéances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">Paiement Scolarité</div>
                        <div className="text-sm text-gray-600">Échéance: {new Date(studentProfile.financial.nextPaymentDue).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">{formatCurrency(studentProfile.financial.remainingBalance)}</div>
                      <Button size="sm" className="mt-2">Payer maintenant</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prochaine session rapide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Prochaine Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentProfile.nextSessions.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{studentProfile.nextSessions[0].title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatSessionDate(studentProfile.nextSessions[0].date)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {studentProfile.nextSessions[0].startTime} - {studentProfile.nextSessions[0].endTime} • {studentProfile.nextSessions[0].room}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Enseignant: {studentProfile.nextSessions[0].teacher}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emploi du Temps avec FullCalendar */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Emploi du Temps</CardTitle>
                    <CardDescription>Vos cours et sessions</CardDescription>
                  </div>
                  
                  {/* Contrôles du calendrier */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Navigation */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handlePrevious}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleToday}
                        className="h-8 px-3"
                      >
                        Aujourd&apos;hui
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleNext}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sélecteur de vue */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                      <Button
                        variant={calendarView === 'dayGridMonth' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleViewChange('dayGridMonth')}
                        className="h-8 px-3"
                      >
                        Mois
                      </Button>
                      <Button
                        variant={calendarView === 'timeGridWeek' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleViewChange('timeGridWeek')}
                        className="h-8 px-3"
                      >
                        Semaine
                      </Button>
                      <Button
                        variant={calendarView === 'timeGridDay' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleViewChange('timeGridDay')}
                        className="h-8 px-3"
                      >
                        Jour
                      </Button>
                      <Button
                        variant={calendarView === 'listWeek' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleViewChange('listWeek')}
                        className="h-8 px-3"
                      >
                        Liste
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Légende */}
                <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-600"></div>
                    <span className="text-sm text-gray-600">Cours Magistral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-600"></div>
                    <span className="text-sm text-gray-600">TD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-600"></div>
                    <span className="text-sm text-gray-600">TP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-600"></div>
                    <span className="text-sm text-gray-600">Examen</span>
                  </div>
                </div>

                {/* FullCalendar */}
                <div className="fullcalendar-wrapper">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="timeGridWeek"
                    locale={frLocale}
                    headerToolbar={false} // On utilise nos propres contrôles
                    events={calendarEvents}
                    height="auto"
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}
                    weekends={false}
                    eventClick={(info) => {
                      // Gérer le clic sur un événement
                      console.log('Event clicked:', info.event);
                    }}
                    eventContent={(arg) => {
                      return (
                        <div className="p-1">
                          <div className="font-semibold text-xs truncate">{arg.event.title}</div>
                          <div className="text-xs opacity-90 truncate">{arg.event.extendedProps.room}</div>
                        </div>
                      );
                    }}
                    slotLabelFormat={{
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }}
                    eventTimeFormat={{
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Informations Financières */}
          <TabsContent value="financial">
            <div className="space-y-6">
              {/* Résumé financier */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé Financier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(studentProfile.financial.totalFees)}</div>
                      <div className="text-sm text-gray-600">Frais totaux</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(studentProfile.financial.paidAmount)}</div>
                      <div className="text-sm text-gray-600">Montant payé</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{formatCurrency(studentProfile.financial.remainingBalance)}</div>
                      <div className="text-sm text-gray-600">Solde restant</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Progress value={(studentProfile.financial.paidAmount / studentProfile.financial.totalFees) * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>0%</span>
                      <span>{Math.round((studentProfile.financial.paidAmount / studentProfile.financial.totalFees) * 100)}% payé</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Historique des transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentProfile.financial.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${transaction.type === 'PAYMENT' ? 'bg-red-100' : 'bg-green-100'}`}>
                            {transaction.type === 'PAYMENT' ? (
                              <CreditCard className={`w-4 h-4 ${transaction.type === 'PAYMENT' ? 'text-red-600' : 'text-green-600'}`} />
                            ) : (
                              <DollarSign className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${transaction.type === 'PAYMENT' ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.type === 'PAYMENT' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                          </div>
                          <Badge size='sm' value={transaction.status} label={transaction.status} icon={CheckCircle} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Styles CSS pour FullCalendar */}
      <style jsx global>{`
        .fullcalendar-wrapper {
          min-height: 500px;
        }

        .fc {
          font-family: inherit;
        }

        .fc .fc-button {
          background-color: #3B82F6;
          border-color: #3B82F6;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          text-transform: capitalize;
        }

        .fc .fc-button:hover {
          background-color: #2563EB;
          border-color: #2563EB;
        }

        .fc .fc-button-primary:disabled {
          background-color: #93C5FD;
          border-color: #93C5FD;
          opacity: 0.6;
        }

        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #E5E7EB;
        }

        .fc-theme-standard .fc-scrollgrid {
          border-color: #E5E7EB;
        }

        .fc .fc-col-header-cell {
          background-color: #F9FAFB;
          padding: 0.75rem 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #6B7280;
        }

        .fc .fc-daygrid-day-number {
          padding: 0.5rem;
          font-weight: 500;
        }

        .fc .fc-timegrid-slot {
          height: 3rem;
        }

        .fc .fc-timegrid-slot-label {
          border-color: #E5E7EB;
        }

        .fc-event {
          border-radius: 0.375rem;
          border-left-width: 3px;
          padding: 0.25rem;
          margin: 1px 2px;
          cursor: pointer;
        }

        .fc-event:hover {
          opacity: 0.9;
        }

        .fc .fc-list-event:hover td {
          background-color: #F3F4F6;
        }

        .fc-list-event-title {
          font-weight: 500;
        }

        .fc-list-event-time {
          color: #6B7280;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .fc .fc-toolbar {
            flex-direction: column;
            gap: 1rem;
          }

          .fc .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }

          .fc-timegrid-event .fc-event-title {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .fc-timegrid-slot {
            height: 2.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default StudentProfileDashboard;