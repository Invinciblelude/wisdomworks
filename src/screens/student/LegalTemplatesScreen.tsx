import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import {
  LEGAL_TEMPLATES,
  STOP_WORK_NOTICE_TEMPLATE,
  NOTICE_OF_COMPLETION_TEMPLATE,
  MATERIAL_DELIVERY_CLAUSE,
  PROGRESS_PAYMENT_SCHEDULE_TEMPLATE,
  HIS_COMMISSION_AGREEMENT_TEMPLATE,
  FIRST_DAY_HANDOUT,
  LEGAL_UPDATES_2025_2026,
} from '../../constants/legal';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export function LegalTemplatesScreen({ navigation }: any) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const templates: Template[] = [
    {
      id: '1',
      title: 'Material Delivery Payment Clause',
      category: 'Contract',
      description: 'B&P § 7159.5 compliant clause for billing materials upon delivery',
      content: MATERIAL_DELIVERY_CLAUSE,
    },
    {
      id: '2',
      title: 'Progress Payment Schedule',
      category: 'Contract',
      description: 'CSLB-compliant payment milestone template',
      content: JSON.stringify(PROGRESS_PAYMENT_SCHEDULE_TEMPLATE, null, 2),
    },
    {
      id: '3',
      title: 'Stop Work Notice (5-Day Intent)',
      category: 'Notice',
      description: 'Step 1: Post this at job site when payment is overdue',
      content: STOP_WORK_NOTICE_TEMPLATE.step_1.template,
    },
    {
      id: '4',
      title: 'Stop Work Notice (10-Day)',
      category: 'Notice',
      description: 'Step 2: Serve via certified mail (Civil Code § 8830)',
      content: STOP_WORK_NOTICE_TEMPLATE.step_2.template,
    },
    {
      id: '5',
      title: 'Notice of Completion',
      category: 'Notice',
      description: 'Shortens lien rights window (Civil Code § 8182)',
      content: NOTICE_OF_COMPLETION_TEMPLATE.template,
    },
    {
      id: '6',
      title: 'HIS Commission Agreement',
      category: 'Agreement',
      description: 'Student commission & mentorship agreement',
      content: HIS_COMMISSION_AGREEMENT_TEMPLATE,
    },
  ];

  const legalUpdates = [
    {
      id: 'sb1455',
      title: 'SB 1455: Workers Comp Delay',
      description: 'Universal Workers Comp mandate delayed to January 1, 2028',
      icon: '📅',
      effective: '2025',
    },
    {
      id: 'ab2622',
      title: 'AB 2622: Handyman Limit $1,000',
      description: 'Handyman exemption increased to $1,000 (labor + materials)',
      icon: '🔨',
      effective: '2025',
    },
    {
      id: 'sb61',
      title: 'SB 61: 5% Retention Cap',
      description: 'Retention on private works capped at 5%',
      icon: '💰',
      effective: '2026',
    },
    {
      id: 'ab1327',
      title: 'AB 1327: Email Cancellation',
      description: 'Right to Cancel notices must include email option',
      icon: '✉️',
      effective: '2025',
    },
  ];

  function openTemplate(template: Template) {
    setSelectedTemplate(template);
    setModalVisible(true);
  }

  async function shareTemplate() {
    if (!selectedTemplate) return;

    try {
      await Share.share({
        message: `${selectedTemplate.title}\n\n${selectedTemplate.content}`,
        title: selectedTemplate.title,
      });
    } catch (error) {
      console.error('Error sharing template:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Legal Templates & Updates</Text>
          <Text style={styles.headerSubtitle}>
            CSLB-compliant forms and 2025/2026 California law updates
          </Text>
        </View>

        {/* 2025/2026 Legal Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 2025/2026 Law Updates</Text>
          {legalUpdates.map((update) => (
            <TouchableOpacity
              key={update.id}
              style={styles.updateCard}
              onPress={() => {
                // Navigate to detailed view
                navigation.navigate('LegalUpdateDetails', { updateId: update.id });
              }}
            >
              <Text style={styles.updateIcon}>{update.icon}</Text>
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>{update.title}</Text>
                <Text style={styles.updateDescription}>{update.description}</Text>
                <Text style={styles.updateEffective}>Effective: {update.effective}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contract Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Contract Templates</Text>
          {templates
            .filter((t) => t.category === 'Contract')
            .map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => openTemplate(template)}
              >
                <View style={styles.templateHeader}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateCategory}>{template.category}</Text>
                </View>
                <Text style={styles.templateDescription}>
                  {template.description}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Legal Notices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📢 Legal Notices</Text>
          {templates
            .filter((t) => t.category === 'Notice')
            .map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => openTemplate(template)}
              >
                <View style={styles.templateHeader}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateCategory}>{template.category}</Text>
                </View>
                <Text style={styles.templateDescription}>
                  {template.description}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Agreements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤝 Agreements</Text>
          {templates
            .filter((t) => t.category === 'Agreement')
            .map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => openTemplate(template)}
              >
                <View style={styles.templateHeader}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateCategory}>{template.category}</Text>
                </View>
                <Text style={styles.templateDescription}>
                  {template.description}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Quick Resources</Text>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate('FirstDayHandout')}
          >
            <Text style={styles.linkIcon}>📋</Text>
            <Text style={styles.linkText}>First Day Student Handout</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate('ComplianceQuiz')}
          >
            <Text style={styles.linkIcon}>✅</Text>
            <Text style={styles.linkText}>Week 1 Compliance Quiz</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Template Viewer Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedTemplate?.title}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={shareTemplate}>
              <Text style={styles.modalButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalCategory}>
              {selectedTemplate?.category}
            </Text>
            <Text style={styles.modalDescription}>
              {selectedTemplate?.description}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.templateContent}>{selectedTemplate?.content}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  updateIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  updateDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs / 2,
  },
  updateEffective: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.text.tertiary,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  templateTitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    flex: 1,
  },
  templateCategory: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  templateDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
  },
  linkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  linkIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  linkText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
    color: COLORS.text.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalButton: {
    padding: SPACING.xs,
    minWidth: 60,
  },
  modalButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
  },
  modalTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  modalCategory: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalDescription: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  templateContent: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.primary,
    lineHeight: 20,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
});

