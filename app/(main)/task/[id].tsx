import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { TaskService } from '../../../src/services/TaskService';
import { Task } from '../../../src/types';
import { ThemedSurface } from '../../../src/components/themed/ThemedSurface';
import { ThemedButton } from '../../../src/components/themed/ThemedButton';
import { ThemedStatusBadge } from '../../../src/components/themed/ThemedStatusBadge';
import { ThemedIcon } from '../../../src/components/themed/ThemedIcon';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && session?.user.id) {
      loadTask();
    }
  }, [id, session?.user.id]);

  const loadTask = async () => {
    try {
      const task = await TaskService.getTask(id as string);
      setTask(task);
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      if (!task) return;
      const updatedTask = await TaskService.updateTask(task.id, {
        status: newStatus,
      });
      setTask(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleStartFocus = () => {
    router.push(`/focus?taskId=${task?.id}`);
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedSurface style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium">{task.title}</Text>
          <ThemedStatusBadge status={task.status} style={styles.badge} />
        </View>

        {task.description && (
          <Text variant="bodyLarge" style={styles.description}>
            {task.description}
          </Text>
        )}

        <View style={styles.stats}>
          <StatItem
            icon="clock-outline"
            label="Created"
            value={new Date(task.created_at).toLocaleDateString()}
          />
          {task.due_date && (
            <StatItem
              icon="calendar"
              label="Due Date"
              value={new Date(task.due_date).toLocaleDateString()}
            />
          )}
          {task.estimated_duration && (
            <StatItem
              icon="timer-outline"
              label="Estimated Time"
              value={`${task.estimated_duration} min`}
            />
          )}
          <StatItem
            icon="chart-line"
            label="Priority Score"
            value={Math.round(task.priority_score || 0).toString()}
          />
        </View>

        <View style={styles.actions}>
          <ThemedButton
            mode="contained"
            onPress={handleStartFocus}
            icon={({ size, color }) => (
              <ThemedIcon name="timer" size={size} color={color} />
            )}
          >
            Start Focus Session
          </ThemedButton>

          {task.status !== 'completed' ? (
            <ThemedButton
              mode="outlined"
              onPress={() => handleStatusChange('completed')}
              variant="success"
              icon={({ size, color }) => (
                <ThemedIcon name="check" size={size} color={color} />
              )}
            >
              Mark as Complete
            </ThemedButton>
          ) : (
            <ThemedButton
              mode="outlined"
              onPress={() => handleStatusChange('pending')}
              variant="secondary"
              icon={({ size, color }) => (
                <ThemedIcon name="undo" size={size} color={color} />
              )}
            >
              Mark as Pending
            </ThemedButton>
          )}
        </View>
      </ThemedSurface>
    </ScrollView>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <ThemedIcon name={icon} size={24} />
      <Text variant="bodySmall" style={styles.statLabel}>{label}</Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    margin: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  badge: {
    marginLeft: 8,
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    minWidth: 140,
    alignItems: 'center',
    padding: 8,
  },
  statLabel: {
    marginTop: 4,
    opacity: 0.7,
  },
  actions: {
    gap: 12,
  },
}); 