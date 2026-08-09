import * as XLSX from 'xlsx';
import { DailyLog, Skill, Goal, ReminderItem, Quote, AchievementBadge } from '../types/tracker';

export interface AppExportData {
  logs: DailyLog[];
  skills: Skill[];
  goals: Goal[];
  reminders: ReminderItem[];
  quotes?: Quote[];
  badges?: AchievementBadge[];
}

export const exportAllDataToExcel = (data: AppExportData, filename = 'Data_Science_Growth_Tracker_Master.xlsx') => {
  const { logs, skills, goals, reminders, quotes = [], badges = [] } = data;

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // 1. Sheet: Daily Study Logs
  const skillMap = new Map(skills.map(s => [s.id, s.name]));
  const logRows = logs.map(l => {
    // Breakdown of skill hours into readable string
    const skillBreakdown = Object.entries(l.skillsHours || {})
      .map(([sId, hrs]) => `${skillMap.get(sId) || sId}: ${hrs}h`)
      .join(', ');

    return {
      'Log ID': l.id,
      'Date': l.date,
      'Day of Week': l.day,
      'Total Study Hours': l.totalHours,
      'Skill Hours Breakdown': skillBreakdown,
      'Focus Energy Level (1-10)': l.energyLevel,
      'Study Mood': l.mood,
      'Daily Target Goal': l.todayGoal,
      'Goal Completed': l.goalCompleted ? 'YES' : 'NO',
      'Daily Learning Notes & Key Output': l.remarks || '',
      'Self Reflection': l.learningReflection || '',
    };
  });
  const wsLogs = XLSX.utils.json_to_sheet(logRows.length > 0 ? logRows : [
    { 'Date': 'No logs yet', 'Total Study Hours': 0 }
  ]);
  XLSX.utils.book_append_sheet(wb, wsLogs, 'Daily Study Logs');

  // 2. Sheet: Skill Matrix & Weekly Targets
  const skillRows = skills.map(s => {
    // Calculate total hours logged for this skill across all logs
    const totalLogged = logs.reduce((sum, log) => sum + (log.skillsHours[s.id] || 0), 0);
    return {
      'Skill ID': s.id,
      'Skill Name': s.name,
      'Category': s.category,
      'Target Weekly Hours': s.targetWeeklyHours,
      'Total Logged Hours': Number(totalLogged.toFixed(1)),
      'Weekly Target Pace (%)': s.targetWeeklyHours > 0 
        ? `${Math.min(100, Math.round((totalLogged / s.targetWeeklyHours) * 100))}%`
        : '0%',
      'Custom Skill': s.isCustom ? 'YES' : 'NO',
    };
  });
  const wsSkills = XLSX.utils.json_to_sheet(skillRows);
  XLSX.utils.book_append_sheet(wb, wsSkills, 'Skill Matrix');

  // 3. Sheet: Reminders & Exam Deadlines
  const todayStr = new Date().toISOString().split('T')[0];
  const reminderRows = reminders.map(r => {
    const dueTime = new Date(r.dueDate).getTime();
    const nowTime = new Date(todayStr).getTime();
    const diffDays = Math.ceil((dueTime - nowTime) / (1000 * 3600 * 24));

    let urgency = 'Upcoming';
    if (r.status === 'Completed' || r.status === 'Submitted' || r.status === 'Passed') {
      urgency = 'Cleared / Done';
    } else if (diffDays < 0) {
      urgency = `${Math.abs(diffDays)} Days OVERDUE`;
    } else if (diffDays === 0) {
      urgency = 'DUE TODAY';
    } else if (diffDays <= 3) {
      urgency = `Due in ${diffDays} Days`;
    }

    return {
      'Task ID': r.id,
      'Task Name': r.task,
      'Category': r.category,
      'Priority': r.priority,
      'Due Date': r.dueDate,
      'Days Remaining': diffDays,
      'Urgency Status': urgency,
      'Completion Status': r.status,
      'Notes': r.notes || '',
    };
  });
  const wsReminders = XLSX.utils.json_to_sheet(reminderRows);
  XLSX.utils.book_append_sheet(wb, wsReminders, 'Deadlines & Reminders');

  // 4. Sheet: Goals & Milestones
  const goalRows = goals.map(g => ({
    'Goal ID': g.id,
    'Goal Title': g.name,
    'Category': g.category,
    'Timeframe': g.timeframe,
    'Priority': g.priority,
    'Target Deadline': g.deadline,
    'Progress Percentage': `${g.progress}%`,
    'Status': g.status,
    'Notes / Strategy': g.notes || '',
  }));
  const wsGoals = XLSX.utils.json_to_sheet(goalRows);
  XLSX.utils.book_append_sheet(wb, wsGoals, 'Target Goals');

  // 5. Sheet: Badges & Gamification Achievements
  if (badges.length > 0) {
    const badgeRows = badges.map(b => ({
      'Badge Title': b.title,
      'Category': b.category,
      'Unlocked': b.unlocked ? 'YES' : 'NO',
      'Progress (%)': `${b.progress}%`,
      'Unlocked Date': b.unlockedAt || 'In Progress',
      'Description': b.description,
    }));
    const wsBadges = XLSX.utils.json_to_sheet(badgeRows);
    XLSX.utils.book_append_sheet(wb, wsBadges, 'Achievements & Badges');
  }

  // 6. Sheet: Executive Summary / Analytics Meta
  const totalHoursAllTime = logs.reduce((acc, curr) => acc + curr.totalHours, 0);
  const avgEnergy = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + curr.energyLevel, 0) / logs.length).toFixed(1) 
    : '0';

  const summaryRows = [
    { 'Metric Name': 'Total Study Hours Logged', 'Value': totalHoursAllTime },
    { 'Metric Name': 'Total Study Days Tracked', 'Value': logs.length },
    { 'Metric Name': 'Average Daily Focus Energy (1-10)', 'Value': avgEnergy },
    { 'Metric Name': 'Active Skills Monitored', 'Value': skills.length },
    { 'Metric Name': 'Active Pending Deadlines', 'Value': reminders.filter(r => r.status !== 'Completed' && r.status !== 'Submitted').length },
    { 'Metric Name': 'Total Target Goals Set', 'Value': goals.length },
    { 'Metric Name': 'Report Generated Date', 'Value': new Date().toLocaleString() },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  // Trigger file download automatically
  XLSX.writeFile(wb, filename);
};
