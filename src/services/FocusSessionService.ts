import { supabase } from './supabase';
import { FocusSession } from '../types';

export const FocusSessionService = {
  async createSession(session: Partial<FocusSession>): Promise<FocusSession> {
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSession(sessionId: string, updates: Partial<FocusSession>): Promise<FocusSession> {
    const { data, error } = await supabase
      .from('focus_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDailySessions(userId: string): Promise<FocusSession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', today.toISOString())
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getSessionStats(userId: string): Promise<{
    totalMinutes: number;
    completedSessions: number;
    streak: number;
  }> {
    // Implementation for getting user's focus session statistics
    // This would involve multiple database queries and calculations
    return {
      totalMinutes: 0,
      completedSessions: 0,
      streak: 0,
    };
  },
}; 