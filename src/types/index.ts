export interface UserSettings {
  dailyGoal: number;
  enableNotifications: boolean;
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  theme: 'light' | 'dark' | 'system';
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login?: string;
  settings: UserSettings;
  time_zone?: string;
  notification_preferences: Record<string, boolean>;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
  due_date?: string;
  estimated_duration?: number;
  priority_score?: number;
  status: 'pending' | 'in_progress' | 'completed';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface FocusSession {
  id: string;
  user_id: string;
  task_id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  session_type: string;
  completed: boolean;
  notes?: string;
}

export interface Theme {
  dark: boolean;
  roundness: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    error: string;
    text: string;
    onSurface: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    notification: string;
    success: string;
  };
} 