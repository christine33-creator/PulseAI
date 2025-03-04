import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Portal, Dialog } from 'react-native-paper';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { supabase } from '../../src/services/supabase';
import { FocusSessionService } from '../../src/services/FocusSessionService';
import { ThemedSurface } from '../../src/components/themed/ThemedSurface';
import { ThemedButton } from '../../src/components/themed/ThemedButton';
import { ThemedListItem } from '../../src/components/themed/ThemedListItem';

export default function ProfileScreen() {
  const { session } = useAuth();
  const { theme, themePreference, setThemePreference } = useTheme();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stats, setStats] = useState({
    totalMinutes: 0,
    completedSessions: 0,
    streak: 0,
  });

  useEffect(() => {
    if (session?.user.id) {
      loadStats();
    }
  }, [session?.user.id]);

  const loadStats = async () => {
    try {
      const stats = await FocusSessionService.getSessionStats(session!.user.id);
      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', session!.user.id);

      if (error) throw error;
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedSurface style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Focus Stats
        </Text>

        <View style={styles.stats}>
          <StatCard
            title="Total Focus Time"
            value={`${stats.totalMinutes} min`}
          />
          <StatCard
            title="Sessions Completed"
            value={stats.completedSessions.toString()}
          />
          <StatCard
            title="Current Streak"
            value={`${stats.streak} days`}
          />
        </View>
      </ThemedSurface>

      <ThemedSurface style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Settings
        </Text>

        <ThemedListItem
          title="Theme"
          description={themePreference}
          leftIcon="theme-light-dark"
          onPress={() => {
            const nextTheme = themePreference === 'light' ? 'dark' : 
              themePreference === 'dark' ? 'system' : 'light';
            setThemePreference(nextTheme);
          }}
        />

        <ThemedButton
          mode="outlined"
          onPress={() => setShowLogoutDialog(true)}
          style={styles.button}
          variant="secondary"
        >
          Sign Out
        </ThemedButton>

        <ThemedButton
          mode="outlined"
          onPress={() => setShowDeleteDialog(true)}
          style={styles.button}
          variant="error"
        >
          Delete Account
        </ThemedButton>
      </ThemedSurface>

      {/* Logout Dialog */}
      <Portal>
        <Dialog
          visible={showLogoutDialog}
          onDismiss={() => setShowLogoutDialog(false)}
        >
          <Dialog.Title>Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to sign out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <ThemedButton onPress={() => setShowLogoutDialog(false)}>
              Cancel
            </ThemedButton>
            <ThemedButton onPress={handleLogout} variant="error">
              Sign Out
            </ThemedButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Account Dialog */}
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <ThemedButton onPress={() => setShowDeleteDialog(false)}>
              Cancel
            </ThemedButton>
            <ThemedButton onPress={handleDeleteAccount} variant="error">
              Delete
            </ThemedButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text variant="titleMedium">{value}</Text>
      <Text variant="bodySmall" style={styles.statTitle}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    padding: 8,
  },
  statTitle: {
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  button: {
    marginTop: 16,
  },
}); 