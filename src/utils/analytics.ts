import { DailyLog, Skill, Goal } from '../types/tracker';

export interface DashboardMetrics {
  totalStudyHours: number;
  weeklyStudyHours: number;
  monthlyStudyHours: number;
  currentStreak: number;
  longestStreak: number;
  completionPercentage: number;
  productivityScore: number;
  todayGoalProgress: number;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
  consistencyScore: number;
  skillHoursMap: Record<string, number>;
}

export function calculateMetrics(
  logs: DailyLog[],
  skills: Skill[],
  goals: Goal[]
): DashboardMetrics {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalStudyHours = Number(logs.reduce((sum, l) => sum + l.totalHours, 0).toFixed(1));

  // Date threshold calculations
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const weeklyStudyHours = Number(
    logs
      .filter(l => new Date(l.date) >= sevenDaysAgo)
      .reduce((sum, l) => sum + l.totalHours, 0)
      .toFixed(1)
  );

  const monthlyStudyHours = Number(
    logs
      .filter(l => new Date(l.date) >= thirtyDaysAgo)
      .reduce((sum, l) => sum + l.totalHours, 0)
      .toFixed(1)
  );

  // Streak calculations (consecutive days with > 0 totalHours)
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Map dates with study hours > 0
  const activeDates = new Set(logs.filter(l => l.totalHours > 0).map(l => l.date));
  
  // Calculate longest streak across all logs
  const allDatesSorted = [...logs].map(l => l.date).sort();
  allDatesSorted.forEach(dStr => {
    if (activeDates.has(dStr)) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });

  // Calculate current streak backwards from latest log
  for (let i = 0; i < sortedLogs.length; i++) {
    if (sortedLogs[i].totalHours > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Goals progress
  const totalGoals = goals.length || 1;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const completionPercentage = Math.round((completedGoals / totalGoals) * 100);

  const dailyGoals = goals.filter(g => g.timeframe === 'Daily');
  const todayGoalProgress = dailyGoals.length
    ? Math.round(dailyGoals.reduce((sum, g) => sum + g.progress, 0) / dailyGoals.length)
    : 85;

  const weeklyGoals = goals.filter(g => g.timeframe === 'Weekly');
  const weeklyGoalProgress = weeklyGoals.length
    ? Math.round(weeklyGoals.reduce((sum, g) => sum + g.progress, 0) / weeklyGoals.length)
    : 78;

  const monthlyGoals = goals.filter(g => g.timeframe === 'Monthly');
  const monthlyGoalProgress = monthlyGoals.length
    ? Math.round(monthlyGoals.reduce((sum, g) => sum + g.progress, 0) / monthlyGoals.length)
    : 70;

  // Consistency Score (% of days in last 30 days with > 0 study hours)
  const last30Logs = logs.filter(l => new Date(l.date) >= thirtyDaysAgo);
  const active30Days = last30Logs.filter(l => l.totalHours > 0).length;
  const consistencyScore = last30Logs.length ? Math.round((active30Days / last30Logs.length) * 100) : 100;

  // Productivity Score Formula: (Weekly Study Hours / Weekly Target) * 50 + (Consistency Score) * 35 + (Average Mood/Energy) * 15
  const totalWeeklyTarget = skills.reduce((sum, s) => sum + s.targetWeeklyHours, 0) || 40;
  const hoursRatio = Math.min(1, weeklyStudyHours / totalWeeklyTarget);
  const avgEnergy = logs.length ? logs.reduce((sum, l) => sum + l.energyLevel, 0) / logs.length : 8;
  const productivityScore = Math.min(100, Math.round(hoursRatio * 50 + (consistencyScore / 100) * 35 + (avgEnergy / 10) * 15));

  // Skill Hours Map
  const skillHoursMap: Record<string, number> = {};
  skills.forEach(s => { skillHoursMap[s.id] = 0; });

  logs.forEach(log => {
    Object.entries(log.skillsHours).forEach(([sId, hrs]) => {
      skillHoursMap[sId] = Number(((skillHoursMap[sId] || 0) + hrs).toFixed(1));
    });
  });

  return {
    totalStudyHours,
    weeklyStudyHours,
    monthlyStudyHours,
    currentStreak,
    longestStreak,
    completionPercentage,
    productivityScore,
    todayGoalProgress,
    weeklyGoalProgress,
    monthlyGoalProgress,
    consistencyScore,
    skillHoursMap,
  };
}

export const calculateDashboardMetrics = calculateMetrics;
