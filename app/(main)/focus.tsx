import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { FocusSessionService } from '../../src/services/FocusSessionService';
import { TaskService } from '../../src/services/TaskService';
import { Task, FocusSession } from '../../src/types';
import { ThemedSurface } from '../../src/components/themed/ThemedSurface';
import { ThemedButton } from '../../src/components/themed/ThemedButton';
import { Timer } from '../../src/components/Timer';
import { FocusControls } from '../../src/components/FocusControls';

export default function FocusScreen() {
  const { taskId } = useLocalSearchParams();
  const { session } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [focusSession, setFocusSession] = useState<FocusSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (taskId && session?.user.id) {
      loadTask();
    }
  }, [taskId, session?.user.id]);

  const loadTask = async () => {
    try {
      const { data } = await TaskService.getTask(taskId as string);
      setTask(data);
    } catch (error) {
      console.error('Error loading task:', error);
    }
  };

  const startSession = async () => {
    try {
      const newSession = await FocusSessionService.createSession({
        user_id: session!.user.id,
        task_id: taskId as string,
        start_time: new Date().toISOString(),
        session_type: isBreak ? 'break' : 'focus',
        completed: false,
      });
      
      setFocusSession(newSession);
      setIsActive(true);
      startTimer();
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsActive(false);
  };

  const completeSession = async () => {
    try {
      if (focusSession?.id) {
        await FocusSessionService.updateSession(focusSession.id, {
          end_time: new Date().toISOString(),
          completed: true,
        });
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setIsActive(false);
      setIsBreak(!isBreak);
      setTimeRemaining(isBreak ? 25 * 60 : 5 * 60);
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedSurface style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {isBreak ? 'Break Time' : 'Focus Time'}
        </Text>

        {task && (
          <Text variant="titleMedium" style={styles.taskTitle}>
            {task.title}
          </Text>
        )}

        <Timer
          seconds={timeRemaining}
          isActive={isActive}
          isBreak={isBreak}
        />

        <FocusControls
          isActive={isActive}
          onStart={startSession}
          onPause={pauseTimer}
          onComplete={completeSession}
        />
      </ThemedSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  taskTitle: {
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 