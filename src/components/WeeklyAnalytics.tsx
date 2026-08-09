import React from 'react';
import { DailyLog, Skill } from '../types/tracker';
import { TrendingUp, Award, AlertCircle, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';

interface WeeklyAnalyticsProps {
  logs: DailyLog[];
  skills: Skill[];
}

export const WeeklyAnalytics: React.FC<WeeklyAnalyticsProps> = ({ logs, skills }) => {
  const now = new Date();
  
  // Calculate current 7 days vs previous 7 days
  const currentWeekLogs = logs.filter((l) => {
    const diffDays = (now.getTime() - new Date(l.date).getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays < 7;
  });

  const prevWeekLogs = logs.filter((l) => {
    const diffDays = (now.getTime() - new Date(l.date).getTime()) / (1000 * 3600 * 24);
    return diffDays >= 7 && diffDays < 14;
  });

  const currWeeklyHours = Number(
    currentWeekLogs.reduce((sum, l) => sum + l.totalHours, 0).toFixed(1)
  );
  
  const prevWeeklyHours = Number(
    prevWeekLogs.reduce((sum, l) => sum + l.totalHours, 0).toFixed(1)
  );

  // WoW Growth %
  const wowGrowth = prevWeeklyHours === 0
    ? 100
    : Number((((currWeeklyHours - prevWeeklyHours) / prevWeeklyHours) * 100).toFixed(1));

  // Skill-wise weekly hours
  const skillWeeklyHours: Record<string, number> = {};
  skills.forEach((s) => (skillWeeklyHours[s.id] = 0));

  currentWeekLogs.forEach((l) => {
    Object.entries(l.skillsHours).forEach(([sId, hrs]) => {
      skillWeeklyHours[sId] = Number(((skillWeeklyHours[sId] || 0) + hrs).toFixed(1));
    });
  });

  const sortedSkills = skills
    .map((s) => ({
      ...s,
      weeklyHours: skillWeeklyHours[s.id] || 0,
      targetPct: Math.round(((skillWeeklyHours[s.id] || 0) / (s.targetWeeklyHours || 1)) * 100),
    }))
    .sort((a, b) => b.weeklyHours - a.weeklyHours);

  const bestSkill = sortedSkills[0] || { name: 'Python', weeklyHours: 0 };
  const leastSkill = sortedSkills[sortedSkills.length - 1] || { name: 'Reading', weeklyHours: 0 };

  // Prepare Chart Data for Weekly Days (Mon - Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = daysOfWeek.map((dayName, idx) => {
    const matchingLog = currentWeekLogs.find((l) => l.day.slice(0, 3) === dayName);
    return {
      day: dayName,
      hours: matchingLog ? matchingLog.totalHours : 0,
      energy: matchingLog ? matchingLog.energyLevel : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards Header */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0066FF]" /> Weekly Performance Analytics
            </h2>
            <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
              Automated 7-day velocity breakdown, week-over-week trends, and skill focus analysis.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0066FF]/10 px-3 py-1.5 rounded-lg border border-[#0066FF]/20 text-xs text-[#0066FF] dark:text-blue-400 font-bold">
            <BarChart2 className="w-4 h-4" /> WoW Comparison Mode
          </div>
        </div>

        {/* Executive Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* 1. Weekly Hours */}
          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Weekly Study Hours</p>
            <h3 className="text-2xl font-black text-[#37352F] dark:text-white">{currWeeklyHours} <span className="text-xs text-[#787774] dark:text-slate-400 font-normal">hrs</span></h3>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Previous Week: <strong className="text-[#37352F] dark:text-slate-200">{prevWeeklyHours}h</strong></p>
          </div>

          {/* 2. WoW Growth % */}
          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Week-over-Week Growth</p>
            <div className="flex items-center gap-2">
              <h3 className={`text-2xl font-black ${wowGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {wowGrowth > 0 ? `+${wowGrowth}` : wowGrowth}%
              </h3>
              {wowGrowth >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )}
            </div>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Velocity relative to prior 7 days</p>
          </div>

          {/* 3. Best Performing Skill */}
          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Best Performing Skill</p>
            <h3 className="text-lg font-bold text-[#0066FF] dark:text-blue-400 truncate flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> {bestSkill.name}
            </h3>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Logged <strong className="text-[#0066FF] dark:text-blue-400">{bestSkill.weeklyHours} hrs</strong> this week</p>
          </div>

          {/* 4. Least Focused Skill */}
          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Least Focused Skill</p>
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 truncate flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" /> {leastSkill.name}
            </h3>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Logged <strong className="text-amber-600 dark:text-amber-400">{leastSkill.weeklyHours} hrs</strong> this week</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Day-by-Day Hours Bar Chart */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
          <h3 className="text-base font-bold text-[#37352F] dark:text-white mb-1">Weekly Day-by-Day Study Hours</h3>
          <p className="text-xs text-[#787774] dark:text-slate-400 mb-4">Daily distribution across current week</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBEBE9" vertical={false} />
                <XAxis dataKey="day" stroke="#787774" fontSize={12} tickLine={false} />
                <YAxis stroke="#787774" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18191C', borderColor: '#33353A', borderRadius: '8px', color: '#FFF' }} />
                <Bar dataKey="hours" name="Study Hours" fill="#0066FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill-wise Weekly Hours Progress List */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#37352F] dark:text-white">Skill-wise Weekly Hours vs Target</h3>
            <p className="text-xs text-[#787774] dark:text-slate-400">Target weekly completion rates per topic</p>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {sortedSkills.map((s) => (
              <div key={s.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#37352F] dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-mono text-[#787774] dark:text-slate-400">
                    <strong className="text-[#0066FF] dark:text-blue-400">{s.weeklyHours}h</strong> / {s.targetWeeklyHours}h ({s.targetPct}%)
                  </span>
                </div>
                <div className="w-full bg-[#F7F7F5] dark:bg-[#24262A] h-2 rounded-full overflow-hidden border border-[#EBEBE9] dark:border-[#33353A]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, s.targetPct)}%`,
                      backgroundColor: s.color || '#0066FF',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
