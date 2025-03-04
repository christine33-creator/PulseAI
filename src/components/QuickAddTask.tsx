import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { TaskService } from '../services/TaskService';
import { Task } from '../types';
import { ThemedSurface } from './themed/ThemedSurface';
import { ThemedInput } from './themed/ThemedInput';
import { ThemedButton } from './themed/ThemedButton';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onTaskCreated: (task: Task) => void;
};

export function QuickAddTask({ visible, onDismiss, onTaskCreated }: Props) {
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const task = await TaskService.createTask({
        user_id: session!.user.id,
        title: title.trim(),
        description: description.trim(),
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      onTaskCreated(task);
      setTitle('');
      setDescription('');
      onDismiss();
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ThemedSurface style={styles.content}>
          <Text variant="titleLarge" style={styles.title}>
            Add New Task
          </Text>

          <ThemedInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            error={!!error}
          />

          <ThemedInput
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <View style={styles.buttons}>
            <ThemedButton
              mode="outlined"
              onPress={onDismiss}
              style={styles.button}
            >
              Cancel
            </ThemedButton>

            <ThemedButton
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              style={styles.button}
            >
              Add Task
            </ThemedButton>
          </View>
        </ThemedSurface>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 16,
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
}); 