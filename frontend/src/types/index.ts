export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
}

export interface DailyAnalytics {
  date: string;
  completed: number;
  added: number;
}

export interface StatusAnalytics {
  completed: number;
  pending: number;
}

export interface PriorityAnalytics {
  high: number;
  medium: number;
  low: number;
}

export interface Analytics {
  daily: DailyAnalytics[];
  status: StatusAnalytics;
  priority: PriorityAnalytics;
}