import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { TaskService } from '../../src/services/TaskService';
import { Task } from '../../src/types';
import { DailyProgress } from '../../src/components/DailyProgress';
import { PriorityTask } from '../../src/components/PriorityTask';
import { QuickAddTask } from '../../src/components/QuickAddTask';
import { ThemedButton } from '../../src/components/themed/ThemedButton';
import { ThemedIcon } from '../../src/components/themed/ThemedIcon';

export default function HomeScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    if (!session?.user.id) return;
    loadTasks();
  }, [session?.user.id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await TaskService.getTasks(session!.user.id);
      setTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleTaskCreated = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    setShowAddTask(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <DailyProgress />

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Priority Tasks
          </Text>

          {tasks.length === 0 ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No tasks yet. Add one to get started!
            </Text>
          ) : (
            tasks.map(task => (
              <PriorityTask
                key={task.id}
                task={task}
                onPress={() => router.push(`/task/${task.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <ThemedButton
        mode="contained"
        onPress={() => setShowAddTask(true)}
        style={styles.fab}
        icon={({ size, color }) => (
          <ThemedIcon name="plus" size={size} color={color} />
        )}
      >
        Add Task
      </ThemedButton>

      <QuickAddTask
        visible={showAddTask}
        onDismiss={() => setShowAddTask(false)}
        onTaskCreated={handleTaskCreated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 28,
  },
}); 