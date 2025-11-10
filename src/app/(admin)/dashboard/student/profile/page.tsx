/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
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
  Award
} from 'lucide-react';
import PageHeader from '@/layout/PageHeader';
import Badge from '@/components/custom-ui/Badge';
import StatCard from '@/components/cards/StatCard';
import { useUserStore } from '@/store/useAuthStore';

const StudentProfileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
    }
  };

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
            <TabsTrigger value="personal" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">Profil</TabsTrigger>
            <TabsTrigger value="academic" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">Académique</TabsTrigger>
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
          </TabsContent>

          {/* Profil Personnel */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>Vos données personnelles et contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nom complet</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.user.first_name} {user?.user.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date de naissance</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.userDetailled?.date_of_birth ? user?.userDetailled?.date_of_birth : "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lieu de naissance</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.userDetailled?.place_of_birth ? user?.userDetailled?.place_of_birth : "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nationalité</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.userDetailled?.country ? user?.userDetailled?.country : "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Adresse</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {user?.userDetailled?.address_details ? user?.userDetailled?.address_details : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Téléphone</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user?.userDetailled?.phone_number ? user?.userDetailled?.phone_number : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user?.userDetailled?.phone_number ? user?.userDetailled?.email : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <Separator className="my-6" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Contact d&apos;urgence</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nom</label>
                      <p className="mt-1 text-sm text-gray-900">{studentProfile.personal.emergencyContact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lien de parenté</label>
                      <p className="mt-1 text-sm text-gray-900">{studentProfile.personal.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Téléphone</label>
                      <p className="mt-1 text-sm text-gray-900">{studentProfile.personal.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Informations Académiques */}
          <TabsContent value="academic">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Parcours Académique</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Programme d&apos;études</label>
                        <p className="mt-1 text-sm text-gray-900">{studentProfile.academic.program}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Spécialisation</label>
                        <p className="mt-1 text-sm text-gray-900">{studentProfile.academic.specialization}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Niveau actuel</label>
                        <p className="mt-1 text-sm text-gray-900">{studentProfile.academic.currentLevel}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Conseiller pédagogique</label>
                        <p className="mt-1 text-sm text-gray-900">{studentProfile.academic.advisor}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Année académique</label>
                        <p className="mt-1 text-sm text-gray-900">{studentProfile.academic.academicYear}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date de début</label>
                        <p className="mt-1 text-sm text-gray-900">{new Date(studentProfile.academic.startDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Diplômation prévue</label>
                        <p className="mt-1 text-sm text-gray-900">{new Date(studentProfile.academic.expectedGraduation).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
    </>
  );
};

export default StudentProfileDashboard;