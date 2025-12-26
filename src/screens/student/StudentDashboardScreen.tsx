import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { COLORS, SPACING, TYPOGRAPHY, CURRICULUM_STRUCTURE } from '../../constants';

export function StudentDashboardScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const currentStudent = useStudentStore((state) => state.currentStudent);
  const progress = useStudentStore((state) => state.progress);
  const isLoading = useStudentStore((state) => state.isLoading);
  const fetchStudentProfile = useStudentStore((state) => state.fetchStudentProfile);
  const fetchWorkLogs = useStudentStore((state) => state.fetchWorkLogs);
  const calculateProgress = useStudentStore((state) => state.calculateProgress);

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadDashboard();
  }, [user?.id]);

  async function loadDashboard() {
    if (!user?.id) return;

    try {
      await fetchStudentProfile(user.id);
      const student = useStudentStore.getState().currentStudent;
      if (student) {
        await Promise.all([
          fetchWorkLogs(student.id),
          calculateProgress(student.id),
        ]);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }

  if (isLoading && !currentStudent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentStudent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Unable to load student profile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDashboard}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentYear = CURRICULUM_STRUCTURE[`YEAR_${currentStudent.current_year}` as keyof typeof CURRICULUM_STRUCTURE];
  const currentQuarter = currentYear.quarters[currentStudent.current_quarter - 1];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.full_name}</Text>
          <View style={styles.journeyBadge}>
            <Text style={styles.journeyBadgeText}>
              {currentStudent.journey_level.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Current Phase Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Current Phase</Text>
          <Text style={styles.phaseTitle}>{currentYear.title}</Text>
          <Text style={styles.phaseSubtitle}>{currentYear.subtitle}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.quarterLabel}>Quarter {currentStudent.current_quarter}</Text>
          <Text style={styles.quarterTitle}>{currentQuarter.title}</Text>
          
          <View style={styles.focusContainer}>
            {currentQuarter.focus.map((item, index) => (
              <View key={index} style={styles.focusItem}>
                <Text style={styles.focusBullet}>•</Text>
                <Text style={styles.focusText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress Overview */}
        {progress && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Progress</Text>
            
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={styles.progressValue}>{progress.total_hours}</Text>
                <Text style={styles.progressLabel}>Hours Logged</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressValue}>
                  {progress.milestones_completed}/{progress.milestones_total}
                </Text>
                <Text style={styles.progressLabel}>Milestones</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressValue}>
                  {progress.certifications_earned}/{progress.certifications_required}
                </Text>
                <Text style={styles.progressLabel}>Certifications</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress.completion_percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {progress.completion_percentage}% Complete
              </Text>
            </View>

            {/* Financial Status */}
            <View style={styles.financialContainer}>
              <Text style={styles.financialTitle}>Financial Status</Text>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Paid:</Text>
                <Text style={styles.financialValue}>
                  ${progress.financial_status.paid.toFixed(2)}
                </Text>
              </View>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Remaining:</Text>
                <Text style={styles.financialValue}>
                  ${progress.financial_status.remaining.toFixed(2)}
                </Text>
              </View>
              <View style={styles.financialProgressBar}>
                <View
                  style={[
                    styles.financialProgressFill,
                    { width: `${progress.financial_status.percentage}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('WorkLogSubmission')}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Submit Work Log</Text>
              <Text style={styles.actionSubtitle}>Record your monthly hours</Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('StudentJourney')}
          >
            <Text style={styles.actionIcon}>🗺️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>4-Year Roadmap</Text>
              <Text style={styles.actionSubtitle}>View your full journey</Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LearningResources', {
              year: currentStudent.current_year,
              quarter: currentStudent.current_quarter,
            })}
          >
            <Text style={styles.actionIcon}>📚</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Learning Resources</Text>
              <Text style={styles.actionSubtitle}>Access curriculum materials</Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SafetyCertifications')}
          >
            <Text style={styles.actionIcon}>🛡️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Safety Certifications</Text>
              <Text style={styles.actionSubtitle}>
                {progress?.certifications_earned || 0} earned
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MyProjects')}
          >
            <Text style={styles.actionIcon}>🏗️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>My Projects</Text>
              <Text style={styles.actionSubtitle}>Manage your work</Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
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
    paddingBottom: SPACING.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.secondary,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  name: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
    marginTop: SPACING.xs,
  },
  journeyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  journeyBadgeText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  phaseTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  phaseSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  quarterLabel: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  quarterTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  focusContainer: {
    marginTop: SPACING.xs,
  },
  focusItem: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  focusBullet: {
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  focusText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressValue: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.primary,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  progressBarContainer: {
    marginTop: SPACING.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressPercentage: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  financialContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  financialTitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  financialLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
  },
  financialValue: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
  },
  financialProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  financialProgressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  quickActions: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
  },
  actionChevron: {
    fontSize: 24,
    color: COLORS.text.tertiary,
  },
});


