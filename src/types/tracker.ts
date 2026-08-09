export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  day: string; // Monday, Tuesday, etc.
  skillsHours: Record<string, number>; // skillId -> hours
  totalHours: number;
  mood: 'Great' | 'Focused' | 'Neutral' | 'Tired' | 'Stressed';
  energyLevel: number; // 1 - 10
  remarks: string;
  todayGoal: string;
  goalCompleted: boolean;
  learningReflection: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Core Data Science' | 'Technical / Dev' | 'Soft Skills' | 'Personal Development' | 'Other';
  targetWeeklyHours: number;
  color: string;
  iconName?: string;
  isCustom?: boolean;
}

export type GoalTimeframe = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
export type GoalPriority = 'High' | 'Medium' | 'Low';
export type GoalStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';

export interface Goal {
  id: string;
  name: string;
  category: string;
  timeframe: GoalTimeframe;
  priority: GoalPriority;
  deadline: string;
  status: GoalStatus;
  progress: number; // 0 - 100
  notes: string;
}

export type ReminderCategory =
  | 'Assignments'
  | 'Exams'
  | 'Projects'
  | 'Hackathons'
  | 'Internship Applications'
  | 'Certifications'
  | 'Interviews';

export type ReminderStatus = 'Upcoming' | 'In Progress' | 'Submitted' | 'Passed' | 'Completed';

export interface ReminderItem {
  id: string;
  task: string;
  category: ReminderCategory;
  priority: GoalPriority;
  dueDate: string; // YYYY-MM-DD
  status: ReminderStatus;
  notes?: string;
}

export interface Quote {
  id: number;
  quote: string;
  author: string;
  category: 'Data Science & Logic' | 'Consistency & Focus' | 'Mindset & Growth' | 'Success & Resilience';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 - 100
  unlockedAt?: string;
  category: 'Streak' | 'Hours' | 'Skill' | 'Goal';
}

export interface FormulaDefinition {
  title: string;
  description: string;
  excelFormula: string;
  googleSheetsFormula: string;
  explanation: string;
  category: 'Dashboard' | 'Analytics' | 'Conditional Formatting' | 'Data Validation';
}

export type NoteCategory =
  | 'General'
  | 'Study Notes'
  | 'Self Remarks'
  | 'Key Takeaway'
  | 'Idea & Brainstorm'
  | 'Weekly Review'
  | 'Personal Reflection';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  remarks?: string; // Self-tracking remarks / action points
  category: NoteCategory;
  tags: string[];
  isPinned: boolean;
  createdAt: string; // YYYY-MM-DD HH:mm or ISO string
  updatedAt: string;
  color?: string; // Light accent color or badge
}
