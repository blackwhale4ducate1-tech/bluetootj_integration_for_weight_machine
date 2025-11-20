import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useWeight } from '../../context/WeightContext';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { spacing, layout } from '../../theme/spacing';
import { formatWeight, formatRelativeTime, getBMICategory } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading, { WeightSkeleton } from '../../components/common/Loading';
import ErrorMessage, { EmptyState } from '../../components/common/ErrorMessage';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const {
    latestMeasurement,
    dashboardStats,
    loading,
    error,
    refreshing,
    fetchDashboardStats,
    fetchLatestMeasurement,
    clearError,
  } = useWeight();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadDashboardData();
    setGreetingMessage();
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchLatestMeasurement(),
    ]);
  };

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
  };

  const navigateToConnect = () => {
    navigation.navigate('WeightNavigator', { screen: 'ConnectScale' });
  };

  const navigateToHistory = () => {
    navigation.navigate('WeightNavigator', { screen: 'History' });
  };

  const navigateToStats = () => {
    navigation.navigate('Stats');
  };

  const renderCurrentWeight = () => {
    if (loading && !latestMeasurement) {
      return <WeightSkeleton style={styles.weightSkeleton} />;
    }

    if (!latestMeasurement) {
      return (
        <Card style={styles.weightCard}>
          <EmptyState
            title="No measurements yet"
            message="Connect your scale to start tracking your weight"
            actionText="Connect Scale"
            onAction={navigateToConnect}
            icon={<Text style={styles.emptyIcon}>⚖️</Text>}
          />
        </Card>
      );
    }

    const bmiCategory = getBMICategory(latestMeasurement.bmi);

    return (
      <Card style={styles.weightCard}>
        <View style={styles.weightHeader}>
          <Text style={styles.weightLabel}>Current Weight</Text>
          <Text style={styles.lastMeasured}>
            {formatRelativeTime(latestMeasurement.timestamp)}
          </Text>
        </View>

        <View style={styles.weightDisplay}>
          <Text style={styles.weightValue}>
            {formatWeight(latestMeasurement.weight, latestMeasurement.unit)}
          </Text>
          
          {latestMeasurement.bmi && (
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>BMI</Text>
              <View style={styles.bmiValue}>
                <Text style={[styles.bmiText, { color: bmiCategory?.color }]}>
                  {latestMeasurement.bmi}
                </Text>
                <Text style={[styles.bmiCategory, { color: bmiCategory?.color }]}>
                  {bmiCategory?.label}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Card>
    );
  };

  const renderQuickStats = () => {
    if (!dashboardStats) return null;

    const { weekStats, monthStats } = dashboardStats;

    return (
      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        
        <View style={styles.statsGrid}>
          {weekStats && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>This Week</Text>
              <Text style={[
                styles.statValue,
                { color: weekStats.change >= 0 ? lightColors.error : lightColors.success }
              ]}>
                {weekStats.change >= 0 ? '+' : ''}{formatWeight(weekStats.change, 'kg', 1)}
              </Text>
            </View>
          )}
          
          {monthStats && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>This Month</Text>
              <Text style={[
                styles.statValue,
                { color: monthStats.change >= 0 ? lightColors.error : lightColors.success }
              ]}>
                {monthStats.change >= 0 ? '+' : ''}{formatWeight(monthStats.change, 'kg', 1)}
              </Text>
            </View>
          )}
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Goal</Text>
            <Text style={styles.statValue}>70.0 kg</Text>
            <Text style={styles.statSubtext}>5.5 kg to go</Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <Button
        title="Connect Scale"
        onPress={navigateToConnect}
        variant="primary"
        fullWidth
        style={styles.actionButton}
        icon={<Text style={styles.buttonIcon}>📱</Text>}
      />
      
      <View style={styles.actionRow}>
        <Button
          title="View History"
          onPress={navigateToHistory}
          variant="outline"
          style={styles.halfButton}
          icon={<Text style={styles.buttonIcon}>📋</Text>}
        />
        
        <Button
          title="View Stats"
          onPress={navigateToStats}
          variant="outline"
          style={styles.halfButton}
          icon={<Text style={styles.buttonIcon}>📊</Text>}
        />
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error}
          onRetry={loadDashboardData}
          onDismiss={clearError}
          variant="card"
          style={styles.errorContainer}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[lightColors.primary]}
          tintColor={lightColors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, {user?.firstName || 'there'}!
        </Text>
        <Text style={styles.subtitle}>
          Ready to track your progress?
        </Text>
      </View>

      {/* Current Weight */}
      {renderCurrentWeight()}

      {/* Quick Stats */}
      {renderQuickStats()}

      {/* Actions */}
      {renderActions()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  
  content: {
    padding: layout.screenPadding,
  },
  
  header: {
    marginBottom: spacing.xl,
  },
  
  greeting: {
    ...textStyles.h2,
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  
  subtitle: {
    ...textStyles.body,
    color: lightColors.textSecondary,
  },
  
  weightCard: {
    marginBottom: spacing.lg,
  },
  
  weightSkeleton: {
    marginBottom: spacing.lg,
  },
  
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  weightLabel: {
    ...textStyles.h4,
    color: lightColors.text,
  },
  
  lastMeasured: {
    ...textStyles.caption,
    color: lightColors.textSecondary,
  },
  
  weightDisplay: {
    alignItems: 'center',
  },
  
  weightValue: {
    ...textStyles.weightLarge,
    color: lightColors.primary,
    marginBottom: spacing.md,
  },
  
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  bmiLabel: {
    ...textStyles.body,
    color: lightColors.textSecondary,
  },
  
  bmiValue: {
    alignItems: 'center',
  },
  
  bmiText: {
    ...textStyles.bmi,
    fontWeight: '600',
  },
  
  bmiCategory: {
    ...textStyles.caption,
    fontWeight: '500',
  },
  
  statsCard: {
    marginBottom: spacing.lg,
  },
  
  statsTitle: {
    ...textStyles.h4,
    color: lightColors.text,
    marginBottom: spacing.md,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  statLabel: {
    ...textStyles.caption,
    color: lightColors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  statValue: {
    ...textStyles.labelLarge,
    color: lightColors.text,
    fontWeight: '600',
  },
  
  statSubtext: {
    ...textStyles.caption,
    color: lightColors.textSecondary,
    marginTop: spacing.xs,
  },
  
  actionsContainer: {
    gap: spacing.md,
  },
  
  actionButton: {
    marginBottom: spacing.sm,
  },
  
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  halfButton: {
    flex: 1,
  },
  
  buttonIcon: {
    fontSize: 16,
  },
  
  emptyIcon: {
    fontSize: 48,
  },
  
  errorContainer: {
    margin: spacing.lg,
  },
});

export default HomeScreen;
