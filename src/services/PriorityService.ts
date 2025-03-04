import { Task } from '../types';

export const PriorityService = {
  updateTaskPriorities(tasks: Task[]): Task[] {
    return tasks.map(task => ({
      ...task,
      priority_score: calculatePriorityScore(task),
    }));
  },
};

function calculatePriorityScore(task: Task): number {
  let score = 0;

  // Base score based on status
  if (task.status === 'pending') {
    score += 50;
  } else if (task.status === 'in_progress') {
    score += 75;
  }

  // Due date factor
  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      // Overdue tasks get high priority
      score += 100;
    } else if (daysUntilDue === 0) {
      // Due today
      score += 90;
    } else if (daysUntilDue <= 2) {
      // Due in next 2 days
      score += 80;
    } else if (daysUntilDue <= 7) {
      // Due this week
      score += 60;
    } else {
      // Due later
      score += Math.max(20, 60 - daysUntilDue);
    }
  }

  // Time estimation factor
  if (task.estimated_duration) {
    if (task.estimated_duration <= 30) {
      // Quick tasks get a slight boost
      score += 10;
    } else if (task.estimated_duration >= 120) {
      // Longer tasks get higher priority to encourage breaking them down
      score += 20;
    }
  }

  // Age factor - older tasks get gradually higher priority
  const ageInDays = Math.ceil(
    (new Date().getTime() - new Date(task.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  score += Math.min(20, ageInDays * 2);

  // Normalize score to 0-100 range
  return Math.min(100, Math.max(0, score));
} 