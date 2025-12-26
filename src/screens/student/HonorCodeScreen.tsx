import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { HONOR_CODE } from '../../constants/honorCode';
import { useAuthStore } from '../../store/authStore';
import { supabase, TABLES } from '../../services/supabase';

export function HonorCodeScreen({ navigation }: any) {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const user = useAuthStore((state) => state.user);

  async function handleSign() {
    if (!agreed) {
      Alert.alert('Agreement Required', 'You must agree to the Honor Code terms before signing.');
      return;
    }

    if (!signature || signature.trim().length < 3) {
      Alert.alert('Signature Required', 'Please enter your full name as your signature.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get student ID
      const { data: studentData, error: studentError } = await supabase
        .from(TABLES.STUDENTS)
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (studentError) throw studentError;

      // Insert Honor Code signature
      const { error: signatureError } = await supabase
        .from('honor_code_signatures')
        .insert({
          student_id: studentData.id,
          honor_code_version: '1.0',
          student_signature: signature.trim(),
          acknowledgment_text: HONOR_CODE.acknowledgment,
          agreed_to_terms: true,
        });

      if (signatureError) {
        // Check if already signed
        if (signatureError.message.includes('duplicate')) {
          Alert.alert(
            'Already Signed',
            'You have already signed the Honor Code. Your signature is on file.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }
        throw signatureError;
      }

      // Mark compliance item as complete
      await supabase
        .from('student_compliance_tracking')
        .upsert({
          student_id: studentData.id,
          compliance_item_id: '(SELECT id FROM compliance_items WHERE item_text = \'Honor Code signed\')',
          status: 'completed',
          completed_at: new Date().toISOString(),
        });

      Alert.alert(
        'Honor Code Signed ✓',
        'Your commitment to integrity has been recorded. Welcome to the Wisdom Works family.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to submit signature. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{HONOR_CODE.title}</Text>
          <Text style={styles.tagline}>{HONOR_CODE.tagline}</Text>
        </View>

        {/* Preamble */}
        <View style={styles.section}>
          <Text style={styles.preamble}>{HONOR_CODE.preamble}</Text>
        </View>

        {/* Principles */}
        {HONOR_CODE.principles.map((principle) => (
          <View key={principle.number} style={styles.principle}>
            <Text style={styles.principleNumber}>{principle.number}.</Text>
            <View style={styles.principleContent}>
              <Text style={styles.principleTitle}>{principle.title.toUpperCase()}</Text>
              {principle.rules.map((rule, index) => (
                <View key={index} style={styles.rule}>
                  <Text style={styles.ruleName}>{rule.name}:</Text>
                  <Text style={styles.ruleCommitment}>{rule.commitment}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Acknowledgment */}
        <View style={styles.acknowledgmentBox}>
          <Text style={styles.acknowledgmentTitle}>STUDENT ACKNOWLEDGMENT</Text>
          <Text style={styles.acknowledgmentText}>{HONOR_CODE.acknowledgment}</Text>
        </View>

        {/* Agreement Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgreed(!agreed)}
          disabled={isSubmitting}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read and understand the Wisdom Works Academy Honor Code. I commit
            to upholding these principles throughout my time at the Academy and beyond.
          </Text>
        </TouchableOpacity>

        {/* Signature Input */}
        <View style={styles.signatureContainer}>
          <Text style={styles.signatureLabel}>Your Signature (Type your full name)</Text>
          <View style={styles.signatureInputWrapper}>
            <Text style={[styles.signatureLine, !signature && { color: COLORS.text.tertiary }]}>
              {signature || 'Type your name here...'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editSignatureButton}
            onPress={() => {
              Alert.prompt(
                'Your Signature',
                'Enter your full name as it appears on your ID',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign',
                    onPress: (text?: string) => {
                      if (text && text.trim().length >= 3) {
                        setSignature(text.trim());
                      } else {
                        Alert.alert('Invalid Signature', 'Please enter your full name.');
                      }
                    },
                  },
                ],
                'plain-text',
                signature
              );
            }}
          >
            <Text style={styles.editSignatureButtonText}>
              {signature ? 'Edit Signature' : 'Enter Signature'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Button */}
        <TouchableOpacity
          style={[
            styles.signButton,
            (!agreed || !signature || isSubmitting) && styles.signButtonDisabled,
          ]}
          onPress={handleSign}
          disabled={!agreed || !signature || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signButtonText}>Sign Honor Code</Text>
          )}
        </TouchableOpacity>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            By signing, you acknowledge that violations may result in dismissal from
            Wisdom Works Academy and termination of your HIS registration.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  header: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontStyle: 'italic',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  preamble: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.primary,
    lineHeight: 24,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
  },
  principle: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  principleNumber: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  principleContent: {
    flex: 1,
  },
  principleTitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  rule: {
    marginBottom: SPACING.md,
  },
  ruleName: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs / 2,
  },
  ruleCommitment: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  acknowledgmentBox: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  acknowledgmentTitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  acknowledgmentText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.primary,
    lineHeight: 22,
  },
  signatureContainer: {
    marginBottom: SPACING.lg,
  },
  signatureLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  signatureInputWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.text.primary,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  signatureLine: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontStyle: 'italic',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  editSignatureButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  editSignatureButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
  },
  signButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  signButtonDisabled: {
    opacity: 0.5,
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: SPACING.md,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  warningText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
});


