import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { IGetEnrolledStudent } from '@/types/userType';
import { PDFReportHeader } from './PDFReportHeader';

interface EnrolledStudentsPDFProps {
  students: IGetEnrolledStudent[];
  curriculumName: string;
  academicYear: string;
  institutionName: string;
  ministryName: string;
  hymn: string;
  logoUrl?: string;
  ministryLogoUrl?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 20,
    color: '#475569',
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    color: '#ffffff',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 35,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  tableRowOdd: {
    backgroundColor: '#ffffff',
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    justifyContent: 'center',
  },
  tableCellHeader: {
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  // Colonnes avec largeurs spécifiques
  colNumber: {
    width: '8%',
    textAlign: 'center',
  },
  colStudent: {
    width: '32%',
  },
  colGender: {
    width: '12%',
    textAlign: 'center',
  },
  colDate: {
    width: '18%',
    textAlign: 'center',
  },
  colStatus: {
    width: '15%',
    textAlign: 'center',
  },
  colPayment: {
    width: '15%',
    textAlign: 'center',
  },
  // Styles pour l'étudiant (nom et matricule)
  studentName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  studentNumber: {
    fontSize: 8,
    color: '#64748b',
  },
  // Badge de statut
  statusBadge: {
    padding: '4 8',
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusInactive: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  // Badge de paiement
  paymentPaid: {
    color: '#15803d',
    fontWeight: 'bold',
  },
  paymentUnpaid: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#64748b',
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
  },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 10,
    marginBottom: 3,
    color: '#334155',
  },
  summaryBold: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

// Fonction pour formater la date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Fonction pour obtenir le style du statut
const getStatusStyle = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('active') || statusLower.includes('actif')) {
    return styles.statusActive;
  }
  if (statusLower.includes('inactive') || statusLower.includes('inactif')) {
    return styles.statusInactive;
  }
  return styles.statusPending;
};

export const EnrolledStudentsPDF: React.FC<EnrolledStudentsPDFProps> = ({
  students,
  curriculumName,
  academicYear,
  institutionName,
  ministryName,
  hymn,
  logoUrl,
  ministryLogoUrl,
}) => {
  // Calculer les statistiques
  const totalStudents = students.length;
  const paidStudents = students.filter(s => s.inscription_paid).length;
  const unpaidStudents = totalStudents - paidStudents;
  const maleStudents = students.filter(s => s.gender.toLowerCase() === 'm' || s.gender.toLowerCase() === 'masculin').length;
  const femaleStudents = totalStudents - maleStudents;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête réutilisable */}
        <PDFReportHeader
          institutionName={institutionName}
          ministryName={ministryName}
          hymn={hymn}
          logoUrl={logoUrl}
          ministryLogoUrl={ministryLogoUrl}
        />

        {/* Titre du document */}
        <Text style={styles.title}>
          Liste des Étudiants Inscrits
        </Text>
        <Text style={styles.subtitle}>
          {curriculumName} - Année Académique {academicYear}
        </Text>

        {/* Tableau des étudiants */}
        <View style={styles.table}>
          {/* En-tête du tableau */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.colNumber]}>N°</Text>
            <Text style={[styles.tableCellHeader, styles.colStudent]}>Étudiant</Text>
            <Text style={[styles.tableCellHeader, styles.colGender]}>Genre</Text>
            <Text style={[styles.tableCellHeader, styles.colDate]}>Date d&apos;inscription</Text>
            <Text style={[styles.tableCellHeader, styles.colStatus]}>Statut</Text>
            <Text style={[styles.tableCellHeader, styles.colPayment]}>Frais payés</Text>
          </View>

          {/* Lignes du tableau */}
          {students.map((student, index) => (
            <View
              key={student.enrollment_code || index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
              ]}
            >
              {/* Numéro */}
              <Text style={[styles.tableCell, styles.colNumber]}>
                {index + 1}
              </Text>

              {/* Étudiant (Nom + Matricule) */}
              <View style={[styles.tableCell, styles.colStudent]}>
                <Text style={styles.studentName}>
                  {student.first_name} {student.last_name}
                </Text>
                <Text style={styles.studentNumber}>
                  {student.student_number}
                </Text>
              </View>

              {/* Genre */}
              <Text style={[styles.tableCell, styles.colGender]}>
                {student.gender}
              </Text>

              {/* Date d'inscription */}
              <Text style={[styles.tableCell, styles.colDate]}>
                {formatDate(student.enrollment_date)}
              </Text>

              {/* Statut */}
              <View style={[styles.tableCell, styles.colStatus]}>
                <Text style={[styles.statusBadge, getStatusStyle(student.status_code)]}>
                  {student.status_code}
                </Text>
              </View>

              {/* Frais payés */}
              <Text
                style={[
                  styles.tableCell,
                  styles.colPayment,
                  student.inscription_paid ? styles.paymentPaid : styles.paymentUnpaid,
                ]}
              >
                {student.inscription_paid ? 'Oui' : 'Non'}
              </Text>
            </View>
          ))}
        </View>

        {/* Section récapitulative */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryBold}>Total d&apos;étudiants :</Text> {totalStudents}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryBold}>Hommes :</Text> {maleStudents} | <Text style={styles.summaryBold}>Femmes :</Text> {femaleStudents}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryBold}>Frais payés :</Text> {paidStudents} | <Text style={styles.summaryBold}>Non payés :</Text> {unpaidStudents}
          </Text>
        </View>

        {/* Pied de page */}
        <Text style={styles.footer}>
          Document généré le {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Page>
    </Document>
  );
};