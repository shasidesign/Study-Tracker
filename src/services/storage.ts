import { DailyLog, Skill, Goal, ReminderItem, AchievementBadge } from '../types/tracker';
import { INITIAL_SKILLS, generateSampleLogs, INITIAL_GOALS, INITIAL_REMINDERS, INITIAL_BADGES } from '../data/initialData';

const STORAGE_KEYS = {
  LOGS: 'study_tracker_daily_logs_v1',
  SKILLS: 'study_tracker_skills_v1',
  GOALS: 'study_tracker_goals_v1',
  REMINDERS: 'study_tracker_reminders_v1',
  BADGES: 'study_tracker_badges_v1',
  THEME: 'study_tracker_theme_v1',
};

export const StorageService = {
  getLogs(): DailyLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (!data) {
        const sample = generateSampleLogs();
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(sample));
        return sample;
      }
      return JSON.parse(data);
    } catch {
      return generateSampleLogs();
    }
  },

  saveLogs(logs: DailyLog[]) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  getSkills(): Skill[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SKILLS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(INITIAL_SKILLS));
        return INITIAL_SKILLS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SKILLS;
    }
  },

  saveSkills(skills: Skill[]) {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  },

  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
        return INITIAL_GOALS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_GOALS;
    }
  },

  saveGoals(goals: Goal[]) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getReminders(): ReminderItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(INITIAL_REMINDERS));
        return INITIAL_REMINDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REMINDERS;
    }
  },

  saveReminders(reminders: ReminderItem[]) {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  getBadges(): AchievementBadge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(INITIAL_BADGES));
        return INITIAL_BADGES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BADGES;
    }
  },

  saveBadges(badges: AchievementBadge[]) {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.BADGES);
  }
};
