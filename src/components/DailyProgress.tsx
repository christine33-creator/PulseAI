import { StyleSheet, View } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FocusSessionService } from '../services/FocusSessionService';
import { ThemedSurface } from './themed/ThemedSurface';

export function DailyProgress() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const dailyGoal = 240; // 4 hours in minutes

  useEffect(() => {
    if (session?.user.id) {
      loadDailyProgress();
    }
  }, [session?.user.id]);

  const loadDailyProgress = async () => {
    try {
      const sessions = await FocusSessionService.getDailySessions(session!.user.id);
      const totalMinutes = sessions.reduce((acc, session) => {
        if (session.completed && session.duration) {
          return acc + session.duration;
        }
        return acc;
      }, 0);

      setTotalMinutes(totalMinutes);
      setProgress(Math.min(totalMinutes / dailyGoal, 1));
    } catch (error) {
      console.error('Error loading daily progress:', error);
    }
  };

  return (
    <ThemedSurface style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Daily Progress</Text>
        <Text variant="titleMedium">
          {totalMinutes} / {dailyGoal} min
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        color={theme.colors.primary}
        style={styles.progressBar}
      />

      <Text variant="bodyMedium" style={styles.message}>
        {progress >= 1
          ? "Great job! You've reached your daily goal! 🎉"
          : `${Math.round((dailyGoal - totalMinutes))} minutes left to reach your goal`}
      </Text>
    </ThemedSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 