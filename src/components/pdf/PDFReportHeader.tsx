import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

interface PDFReportHeaderProps {
  institutionName: string;
  ministryName: string;
  hymn: string;
  logoUrl?: string;
  ministryLogoUrl?: string;
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '2 solid #1e40af',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  contentWrapper: {
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  ministryName: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  institutionName: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  hymn: {
    fontSize: 7,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
  titleSection: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#1e40af',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export const PDFReportHeader: React.FC<PDFReportHeaderProps> = ({
  institutionName,
  ministryName,
  hymn,
  logoUrl,
  ministryLogoUrl,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {/* Section gauche (Établissement) */}
        <View style={styles.leftSection}>
          <View style={styles.contentWrapper}>
            {logoUrl && (
              <Image src={logoUrl} style={styles.logo} />
            )}
            <Text style={styles.institutionName}>{institutionName}</Text>
            <Text style={styles.hymn}>&quot;{hymn}&quot;</Text>
          </View>
        </View>

        {/* Section droite (Ministère/Pays) */}
        <View style={styles.rightSection}>
          <View style={styles.contentWrapper}>
            {ministryLogoUrl && (
              <Image src={ministryLogoUrl} style={styles.logo} />
            )}
            <Text style={styles.ministryName}>{ministryName}</Text>
            <Text style={styles.hymn}>Paix - Travail - Patrie</Text>
          </View>
        </View>
      </View>

      {/* Titre du document */}
      {/* <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View> */}
    </View>
  );
};