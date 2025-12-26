import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentStore } from '../../store/studentStore';
import { COLORS, SPACING, TYPOGRAPHY, CURRICULUM_STRUCTURE, JOURNEY_LEVELS } from '../../constants';

export function StudentJourneyScreen({ navigation }: any) {
  const currentStudent = useStudentStore((state) => state.currentStudent);

  if (!currentStudent) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Unable to load journey information</Text>
      </SafeAreaView>
    );
  }

  const years = [
    { key: 'YEAR_1', year: 1 },
    { key: 'YEAR_2', year: 2 },
    { key: 'YEAR_3', year: 3 },
    { key: 'YEAR_4', year: 4 },
  ];

  function isYearCompleted(year: number): boolean {
    return (currentStudent?.current_year || 1) > year;
  }

  function isYearCurrent(year: number): boolean {
    return (currentStudent?.current_year || 1) === year;
  }

  function isQuarterCompleted(year: number, quarter: number): boolean {
    if ((currentStudent?.current_year || 1) > year) return true;
    if ((currentStudent?.current_year || 1) === year && (currentStudent?.current_quarter || 1) > quarter) return true;
    return false;
  }

  function isQuarterCurrent(year: number, quarter: number): boolean {
    return (currentStudent?.current_year || 1) === year && (currentStudent?.current_quarter || 1) === quarter;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your 4-Year Journey</Text>
          <Text style={styles.subtitle}>From Trainee to Licensed Contractor</Text>
          
          <View style={styles.currentPosition}>
            <Text style={styles.currentLabel}>You are here:</Text>
            <Text style={styles.currentValue}>
              Year {currentStudent.current_year}, Quarter {currentStudent.current_quarter}
            </Text>
          </View>
        </View>

        {/* Timeline */}
        {years.map(({ key, year }) => {
          const yearData = CURRICULUM_STRUCTURE[key as keyof typeof CURRICULUM_STRUCTURE];
          const journeyLevel = JOURNEY_LEVELS[yearData.journey_level as keyof typeof JOURNEY_LEVELS];
          const completed = isYearCompleted(year);
          const current = isYearCurrent(year);

          return (
            <View key={key} style={styles.yearContainer}>
              {/* Year Header */}
              <View style={[
                styles.yearHeader,
                completed && styles.yearHeaderCompleted,
                current && styles.yearHeaderCurrent,
              ]}>
                <View style={styles.yearHeaderLeft}>
                  <View style={[
                    styles.yearBadge,
                    { backgroundColor: journeyLevel.color },
                  ]}>
                    <Text style={styles.yearBadgeText}>Year {year}</Text>
                  </View>
                  {completed && <Text style={styles.completedBadge}>✓ Complete</Text>}
                  {current && <Text style={styles.currentBadge}>→ Current</Text>}
                </View>

                <View style={styles.yearHeaderRight}>
                  <Text style={styles.yearTitle}>{yearData.title}</Text>
                  <Text style={styles.yearSubtitle}>{yearData.subtitle}</Text>
                  <Text style={styles.journeyLevel}>{journeyLevel.title}</Text>
                  {year >= 3 && (
                    <Text style={styles.cslbStatus}>✓ Hours count toward CSLB</Text>
                  )}
                </View>
              </View>

              {/* Quarters */}
              {yearData.quarters.map((quarter: any) => {
                const quarterCompleted = isQuarterCompleted(year, quarter.number);
                const quarterCurrent = isQuarterCurrent(year, quarter.number);

                return (
                  <View key={quarter.number} style={styles.quarterContainer}>
                    <View style={styles.quarterHeader}>
                      <View style={[
                        styles.quarterIndicator,
                        quarterCompleted && styles.quarterIndicatorCompleted,
                        quarterCurrent && styles.quarterIndicatorCurrent,
                      ]}>
                        {quarterCompleted ? (
                          <Text style={styles.quarterIndicatorText}>✓</Text>
                        ) : (
                          <Text style={styles.quarterIndicatorText}>Q{quarter.number}</Text>
                        )}
                      </View>

                      <View style={styles.quarterInfo}>
                        <Text style={[
                          styles.quarterTitle,
                          quarterCurrent && styles.quarterTitleCurrent,
                        ]}>
                          {quarter.title}
                        </Text>
                        
                        <View style={styles.focusContainer}>
                          {quarter.focus.map((item: string, index: number) => (
                            <View key={index} style={styles.focusItem}>
                              <Text style={styles.focusBullet}>•</Text>
                              <Text style={styles.focusText}>{item}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>

                    {quarterCurrent && (
                      <TouchableOpacity
                        style={styles.viewResourcesButton}
                        onPress={() => navigation.navigate('LearningResources', { year, quarter: quarter.number })}
                      >
                        <Text style={styles.viewResourcesText}>View Learning Resources →</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Journey Levels</Text>
          
          {Object.entries(JOURNEY_LEVELS).map(([key, level]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: level.color }]} />
              <View style={styles.legendContent}>
                <Text style={styles.legendLabel}>{level.title}</Text>
                <Text style={styles.legendDescription}>{level.description}</Text>
                {level.counts_toward_cslb && (
                  <Text style={styles.legendCSLB}>✓ Counts toward CSLB hours</Text>
                )}
              </View>
            </View>
          ))}
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
  errorText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    padding: SPACING.xl,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
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
    marginBottom: SPACING.md,
  },
  currentPosition: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  currentLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xs / 2,
  },
  currentValue: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
  },
  yearContainer: {
    marginBottom: SPACING.lg,
  },
  yearHeader: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.lg,
    borderTopWidth: 4,
    borderTopColor: COLORS.border,
  },
  yearHeaderCompleted: {
    borderTopColor: COLORS.success,
  },
  yearHeaderCurrent: {
    borderTopColor: COLORS.primary,
  },
  yearHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  yearBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  yearBadgeText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  completedBadge: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
  },
  currentBadge: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
  },
  yearHeaderRight: {
    flex: 1,
  },
  yearTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs / 2,
  },
  yearSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  journeyLevel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  cslbStatus: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
    marginTop: SPACING.xs / 2,
  },
  quarterContainer: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quarterHeader: {
    flexDirection: 'row',
  },
  quarterIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  quarterIndicatorCompleted: {
    backgroundColor: COLORS.success,
  },
  quarterIndicatorCurrent: {
    backgroundColor: COLORS.primary,
  },
  quarterIndicatorText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: '#FFFFFF',
  },
  quarterInfo: {
    flex: 1,
  },
  quarterTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  quarterTitleCurrent: {
    color: COLORS.primary,
  },
  focusContainer: {
    marginTop: SPACING.xs,
  },
  focusItem: {
    flexDirection: 'row',
    marginBottom: SPACING.xs / 2,
  },
  focusBullet: {
    color: COLORS.primary,
    marginRight: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSizes.sm,
  },
  focusText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  viewResourcesButton: {
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
  },
  viewResourcesText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
  },
  legend: {
    backgroundColor: '#FFFFFF',
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold as any,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  legendColor: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  legendContent: {
    flex: 1,
  },
  legendLabel: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: TYPOGRAPHY.fontWeights.semibold as any,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  legendDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  legendCSLB: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeights.medium as any,
    marginTop: 2,
  },
});

