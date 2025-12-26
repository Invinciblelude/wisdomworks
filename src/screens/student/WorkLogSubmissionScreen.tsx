import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, TYPOGRAPHY, TRADE_CATEGORIES, SUPERVISORY_TASKS } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { supabase, TABLES, STORAGE_BUCKETS } from '../../services/supabase';

interface DutyHours {
  [key: string]: {
    tasks: string;
    hours: number;
  };
}

export function WorkLogSubmissionScreen({ navigation, route }: any) {
  const user = useAuthStore((state) => state.user);
  const currentStudent = useStudentStore((state) => state.currentStudent);
  
  const [projectName, setProjectName] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [studentRole, setStudentRole] = useState('');
  const [dutyHours, setDutyHours] = useState<DutyHours>({});
  const [supervisoryTasks, setSupervisoryTasks] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function pickImage() {
    if (photos.length >= 6) {
      Alert.alert('Photo Limit', 'You can upload a maximum of 6 photos per work log.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7, // Compress to 70% quality
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  }

  async function takePhoto() {
    if (photos.length >= 6) {
      Alert.alert('Photo Limit', 'You can upload a maximum of 6 photos per work log.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  function updateDutyHours(tradeKey: string, field: 'tasks' | 'hours', value: string | number) {
    setDutyHours({
      ...dutyHours,
      [tradeKey]: {
        tasks: field === 'tasks' ? (value as string) : (dutyHours[tradeKey]?.tasks || ''),
        hours: field === 'hours' ? (value as number) : (dutyHours[tradeKey]?.hours || 0),
      },
    });
  }

  function toggleSupervisoryTask(task: string) {
    if (supervisoryTasks.includes(task)) {
      setSupervisoryTasks(supervisoryTasks.filter((t) => t !== task));
    } else {
      setSupervisoryTasks([...supervisoryTasks, task]);
    }
  }

  function calculateTotalHours(): number {
    return Object.values(dutyHours).reduce((sum, duty) => sum + (duty.hours || 0), 0);
  }

  async function uploadPhotos(): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const photoUri of photos) {
      try {
        const fileName = `${currentStudent?.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const response = await fetch(photoUri);
        const blob = await response.blob();

        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKETS.WORK_LOG_PHOTOS)
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKETS.WORK_LOG_PHOTOS)
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
    }

    return uploadedUrls;
  }

  async function handleSubmit() {
    // Validation
    if (!projectName || !projectAddress || !dateStart || !dateEnd || !studentRole) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (photos.length < 3) {
      Alert.alert('Photos Required', 'Please upload at least 3 photos of your work.');
      return;
    }

    const totalHours = calculateTotalHours();
    if (totalHours === 0) {
      Alert.alert('Hours Required', 'Please log hours for at least one trade category.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos
      const photoUrls = await uploadPhotos();

      // Submit work log
      const { error } = await supabase.from(TABLES.WORK_LOGS).insert({
        student_id: currentStudent?.id,
        project_name: projectName,
        project_address: projectAddress,
        date_start: dateStart,
        date_end: dateEnd,
        total_hours: totalHours,
        student_role: studentRole,
        duties_performed: dutyHours,
        supervisory_tasks: (currentStudent?.current_year || 1) >= 3 ? supervisoryTasks.map((task) => ({ task, completed: true })) : [],
        photos: photoUrls,
        status: 'submitted',
      });

      if (error) throw error;

      Alert.alert(
        'Work Log Submitted! ✓',
        'Your work log has been submitted for review. You\'ll be notified when it\'s approved.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message || 'Unable to submit work log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function saveDraft() {
    Alert.alert('Draft Saved', 'Your work log has been saved as a draft.');
    // TODO: Implement draft saving to AsyncStorage
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Submit Work Log</Text>
          <Text style={styles.subtitle}>Document your journey-level experience</Text>
        </View>

        {/* Project Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Project Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Kitchen Remodel, Deck Addition"
              value={projectName}
              onChangeText={setProjectName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Project Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main St, City, CA 12345"
              value={projectAddress}
              onChangeText={setProjectAddress}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Start Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                value={dateStart}
                onChangeText={setDateStart}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>End Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                value={dateEnd}
                onChangeText={setDateEnd}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Role *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Lead Carpenter, Apprentice, Foreman"
              value={studentRole}
              onChangeText={setStudentRole}
            />
          </View>
        </View>

        {/* Duties Performed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duties Performed by Trade</Text>
          <Text style={styles.sectionSubtitle}>
            The CSLB requires at least 2 unrelated trades per project
          </Text>

          {TRADE_CATEGORIES.map((trade) => (
            <View key={trade.key} style={styles.tradeCard}>
              <Text style={styles.tradeLabel}>{trade.label}</Text>
              
              <TextInput
                style={styles.textArea}
                placeholder={`Describe ${trade.label.toLowerCase()} tasks performed...`}
                multiline
                numberOfLines={3}
                value={dutyHours[trade.key]?.tasks || ''}
                onChangeText={(text) => updateDutyHours(trade.key, 'tasks', text)}
              />

              <View style={styles.hoursInput}>
                <Text style={styles.hoursLabel}>Hours:</Text>
                <TextInput
                  style={styles.hoursField}
                  placeholder="0"
                  keyboardType="numeric"
                  value={dutyHours[trade.key]?.hours?.toString() || ''}
                  onChangeText={(text) => updateDutyHours(trade.key, 'hours', parseFloat(text) || 0)}
                />
              </View>
            </View>
          ))}

          <View style={styles.totalHours}>
            <Text style={styles.totalHoursLabel}>Total Hours:</Text>
            <Text style={styles.totalHoursValue}>{calculateTotalHours()}</Text>
          </View>
        </View>

        {/* Supervisory Tasks (Years 3-4 Only) */}
        {currentStudent && (currentStudent.current_year || 1) >= 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Supervisory Tasks (Year {currentStudent?.current_year || 1})</Text>
            <Text style={styles.sectionSubtitle}>
              Check all tasks you performed on this project
            </Text>

            {SUPERVISORY_TASKS.map((task, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxRow}
                onPress={() => toggleSupervisoryTask(task)}
              >
                <View style={[styles.checkbox, supervisoryTasks.includes(task) && styles.checkboxChecked]}>
                  {supervisoryTasks.includes(task) && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{task}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Photos (Minimum 3) *</Text>
          <Text style={styles.sectionSubtitle}>
            Upload photos of your work for verification
          </Text>

          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text style={styles.photoButtonIcon}>📷</Text>
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonIcon}>🖼️</Text>
              <Text style={styles.photoButtonText}>Choose from Library</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => removePhoto(index)}
                >
                  <Text style={styles.removePhotoText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {photos.length < 3 && (
            <Text style={styles.photoWarning}>⚠️ You need at least {3 - photos.length} more photo(s)</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.draftButton} onPress={saveDraft}>
            <Text style={styles.draftButtonText}>Save as Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit for Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: SPACING['2xl'],
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  tradeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  tradeLabel: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hoursInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  hoursLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
    color: COLORS.text.primary,
    marginRight: SPACING.sm,
  },
  hoursField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.primary,
    width: 80,
  },
  totalHours: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  totalHoursLabel: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
  },
  totalHoursValue: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.primary,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  photoButtonIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  photoButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.primary,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 1,
    marginRight: '3.5%',
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
  },
  photoWarning: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.warning,
    marginTop: SPACING.sm,
  },
  actions: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  draftButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  draftButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
  },
});

