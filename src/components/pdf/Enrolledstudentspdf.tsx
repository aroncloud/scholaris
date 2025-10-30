import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { IGetEnrolledStudent } from '@/types/userType';
import { formatDateToText } from '@/lib/utils';

// Styles professionnels pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  
  // En-tête institutionnel
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2px solid #1e40af',
  },
  
  headerLeft: {
    width: '40%',
    alignItems: 'center',
  },
  
  headerCenter: {
    width: '20%',
    alignItems: 'center',
  },
  
  headerRight: {
    width: '40%',
    alignItems: 'center',
  },
  
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  
  institutionName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 2,
  },
  
  institutionSubtitle: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
  },
  
  // Titre du document
  titleSection: {
    marginBottom: 25,
    alignItems: 'center',
  },
  
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  subtitle: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 4,
  },
  
  // Informations de contexte
  infoBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    border: '1px solid #cbd5e1',
  },
  
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#334155',
    width: '35%',
  },
  
  infoValue: {
    fontSize: 9,
    color: '#475569',
    width: '65%',
  },
  
  // Tableau
  table: {
    width: '100%',
    marginTop: 15,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    padding: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 9,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e2e8f0',
    padding: 8,
    fontSize: 8,
  },
  
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  
  tableRowOdd: {
    backgroundColor: '#ffffff',
  },
  
  // Colonnes du tableau
  colNumber: {
    width: '5%',
    textAlign: 'center',
  },
  
  colStudentNumber: {
    width: '12%',
  },
  
  colName: {
    width: '25%',
  },
  
  colGender: {
    width: '8%',
    textAlign: 'center',
  },
  
  colBirth: {
    width: '12%',
    fontSize: 7,
  },
  
  colEnrollment: {
    width: '12%',
    fontSize: 7,
  },
  
  colStatus: {
    width: '12%',
  },
  
  colPayment: {
    width: '14%',
    textAlign: 'center',
  },
  
  // Badges de statut
  statusBadge: {
    padding: '3px 6px',
    borderRadius: 3,
    fontSize: 7,
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
  
  paymentPaid: {
    color: '#15803d',
    fontWeight: 'bold',
  },
  
  paymentUnpaid: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  
  // Pied de page
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTop: '1px solid #cbd5e1',
    fontSize: 8,
    color: '#64748b',
  },
  
  // Statistiques
  statsSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
    border: '1px solid #bfdbfe',
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  
  statBox: {
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  
  statLabel: {
    fontSize: 8,
    color: '#64748b',
  },
});

interface EnrolledStudentsPDFProps {
  students: IGetEnrolledStudent[];
  curriculumName: string;
  academicYear: string;
  institutionName?: string;
  ministryName?: string;
  logoUrl?: string;
  ministryLogoUrl?: string;
  hymn?: string;
}

export const EnrolledStudentsPDF: React.FC<EnrolledStudentsPDFProps> = ({
  students,
  curriculumName,
  academicYear,
  institutionName = "Institut de Formation du Personnel Sanitaire",
  ministryName = "Ministère de la Santé Publique",
  logoUrl,
  ministryLogoUrl,
  hymn,
}) => {
  // Statistiques
  const totalStudents = students.length;
  const maleCount = students.filter(s => s.gender === 'MALE').length;
  const femaleCount = students.filter(s => s.gender === 'FEMALE').length;
  const paidCount = students.filter(s => s.inscription_paid).length;
  const activeCount = students.filter(s => s.status_code === 'ACTIVE').length;


  // Traduction du genre
  const translateGender = (gender: string) => {
    return gender === 'MALE' ? 'M' : gender === 'FEMALE' ? 'F' : '-';
  };

  // Traduction du statut
  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif',
      'SUSPENDED': 'Suspendu',
      'GRADUATED': 'Diplômé',
    };
    return statusMap[status] || status;
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* En-tête institutionnel */}
        <View style={styles.header}>
          {/* Logo institution gauche */}
          <View style={styles.headerLeft}>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
            <Text style={styles.institutionName}>{institutionName}</Text>
            <Text style={styles.institutionSubtitle}>Excellence en formation sanitaire</Text>
            {hymn && (
              <Text style={[styles.institutionSubtitle, { marginTop: 4, fontStyle: 'italic' }]}>
                {hymn}
              </Text>
            )}
          </View>

          {/* Espace central */}
          <View style={styles.headerCenter} />

          {/* Logo ministère droit */}
          <View style={styles.headerRight}>
            {ministryLogoUrl && <Image src={ministryLogoUrl} style={styles.logo} />}
            <Text style={styles.institutionName}>{ministryName}</Text>
            <Text style={styles.institutionSubtitle}>République du Cameroun</Text>
          </View>
        </View>

        {/* Titre du document */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Liste des Étudiants Inscrits</Text>
          <Text style={styles.subtitle}>{curriculumName}</Text>
          <Text style={styles.subtitle}>Année Académique {academicYear}</Text>
        </View>

        {/* Informations contextuelles */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Filière :</Text>
            <Text style={styles.infoValue}>{curriculumName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Année Académique :</Text>
            <Text style={styles.infoValue}>{academicYear}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date d&apos;édition :</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre total d&apos;étudiants :</Text>
            <Text style={styles.infoValue}>{totalStudents}</Text>
          </View>
        </View>

        {/* Tableau des étudiants */}
        <View style={styles.table}>
          {/* En-tête du tableau */}
          <View style={styles.tableHeader}>
            <Text style={styles.colNumber}>N°</Text>
            <Text style={styles.colStudentNumber}>Matricule</Text>
            <Text style={styles.colName}>Nom & Prénom(s)</Text>
            <Text style={styles.colGender}>Sexe</Text>
            <Text style={styles.colBirth}>Date Naissance</Text>
            <Text style={styles.colEnrollment}>Date Inscription</Text>
            <Text style={styles.colStatus}>Statut</Text>
            <Text style={styles.colPayment}>Frais Payés</Text>
          </View>

          {/* Lignes du tableau */}
          {students.map((student, index) => (
            <View 
              key={student.enrollment_code} 
              style={[
                styles.tableRow, 
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              ]}
            >
              <Text style={styles.colNumber}>{index + 1}</Text>
              <Text style={styles.colStudentNumber}>{student.student_number}</Text>
              <Text style={styles.colName}>
                {student.last_name.toUpperCase()} {student.first_name}
              </Text>
              <Text style={styles.colGender}>{translateGender(student.gender)}</Text>
              <Text style={styles.colBirth}>{formatDateToText(student.date_of_birth)}</Text>
              <Text style={styles.colEnrollment}>{formatDateToText(student.enrollment_date)}</Text>
              <Text style={[
                styles.colStatus,
              ]}>
                {translateStatus(student.status_code)}
              </Text>
              <Text style={[
                styles.colPayment,
                student.inscription_paid ? styles.paymentPaid : styles.paymentUnpaid
              ]}>
                {student.inscription_paid ? 'OUI' : 'NON'}
              </Text>
            </View>
          ))}
        </View>

        {/* Statistiques */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalStudents}</Text>
              <Text style={styles.statLabel}>Total Inscrits</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{maleCount}</Text>
              <Text style={styles.statLabel}>Hommes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{femaleCount}</Text>
              <Text style={styles.statLabel}>Femmes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{activeCount}</Text>
              <Text style={styles.statLabel}>Actifs</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{paidCount}</Text>
              <Text style={styles.statLabel}>Frais Payés</Text>
            </View>
          </View>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Document généré le {new Date().toLocaleDateString('fr-FR')}</Text>
          <Text>{institutionName}</Text>
          <Text>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
};