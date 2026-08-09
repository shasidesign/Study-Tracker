import React from 'react';
import { DailyLog, Skill, Goal } from '../types/tracker';
import { BarChart3, PieChart as PieIcon, CheckCircle2, Zap, Brain, Sparkles, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface MonthlyAnalyticsProps {
  logs: DailyLog[];
  skills: Skill[];
  goals: Goal[];
}

export const MonthlyAnalytics: React.FC<MonthlyAnalyticsProps> = ({ logs, skills, goals }) => {
  const now = new Date();
  
  // Filter last 30 days
  const last30Logs = logs.filter((l) => {
    const diffDays = (now.getTime() - new Date(l.date).getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays < 30;
  });

  const monthlyStudyHours = Number(
    last30Logs.reduce((sum, l) => sum + l.totalHours, 0).toFixed(1)
  );

  const activeDaysCount = last30Logs.filter((l) => l.totalHours > 0).length;
  const consistencyScore = last30Logs.length ? Math.round((activeDaysCount / last30Logs.length) * 100) : 100;

  // Goals
  const totalGoals = goals.length || 1;
  const completedGoals = goals.filter((g) => g.status === 'Completed').length;
  const goalAchievementPct = Math.round((completedGoals / totalGoals) * 100);

  // Productivity Score Formula: (Monthly Hours / 120 Target) * 50 + (Consistency Score) * 35 + (Goal Achievement) * 15
  const monthlyTarget = 120; // 30 days * 4 hrs/day
  const hoursRatio = Math.min(1, monthlyStudyHours / monthlyTarget);
  const productivityScore = Math.min(100, Math.round(hoursRatio * 50 + (consistencyScore / 100) * 35 + (goalAchievementPct / 100) * 15));

  // Monthly Skill Distribution
  const skillMonthlyHours: Record<string, number> = {};
  skills.forEach((s) => (skillMonthlyHours[s.id] = 0));

  last30Logs.forEach((l) => {
    Object.entries(l.skillsHours).forEach(([sId, hrs]) => {
      skillMonthlyHours[sId] = Number(((skillMonthlyHours[sId] || 0) + hrs).toFixed(1));
    });
  });

  const skillChartData = skills
    .map((s) => ({
      name: s.name,
      hours: skillMonthlyHours[s.id] || 0,
      color: s.color,
    }))
    .filter((s) => s.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#3B82F6', '#84CC16'];

  return (
    <div className="space-y-6">
      {/* Header and KPI Row */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0066FF]" /> Monthly Executive Analytics
            </h2>
            <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
              Comprehensive 30-day productivity score, consistency index, and skill investment matrix.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Monthly Study Hours</p>
            <h3 className="text-2xl font-black text-[#37352F] dark:text-white">{monthlyStudyHours} <span className="text-xs font-normal text-[#787774] dark:text-slate-400">hrs</span></h3>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Active Days: <strong className="text-emerald-600 dark:text-emerald-400">{activeDaysCount} / {last30Logs.length} Days</strong></p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Monthly Consistency</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{consistencyScore}%</h3>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Continuous daily learning cadence</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Productivity Index</p>
            <h3 className="text-2xl font-black text-[#0066FF] dark:text-blue-400">{productivityScore}/100</h3>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Weighted velocity & energy rating</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <p className="text-[11px] font-semibold text-[#787774] dark:text-slate-400 uppercase">Goal Achievement Rate</p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400">{goalAchievementPct}%</h3>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Completed <strong className="text-[#37352F] dark:text-slate-200">{completedGoals}/{totalGoals}</strong> total goals</p>
          </div>
        </div>
      </div>

      {/* Monthly Skill Distribution Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-[#0066FF]" /> 30-Day Skill Time Distribution
            </h3>
            <p className="text-xs text-[#787774] dark:text-slate-400 mb-4">Total accumulated hours per skill area</p>
            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="hours"
                  >
                    {skillChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18191C', borderColor: '#33353A', borderRadius: '8px', color: '#FFF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Skill Hours Ranking Table */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#0066FF]" /> Monthly Skill Investment Leaderboard
              </h3>
              <p className="text-xs text-[#787774] dark:text-slate-400">Ranked by total study time over the last 30 days</p>
            </div>
          </div>

          <div className="space-y-3">
            {skillChartData.map((s, idx) => {
              const pctOfTotal = monthlyStudyHours ? Math.round((s.hours / monthlyStudyHours) * 100) : 0;
              return (
                <div key={s.name} className="p-3 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#37352F] dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      #{idx + 1} {s.name}
                    </span>
                    <span className="font-mono text-[#0066FF] dark:text-blue-400 font-bold">
                      {s.hours} hrs ({pctOfTotal}% of total time)
                    </span>
                  </div>
                  <div className="w-full bg-[#EBEBE9] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pctOfTotal}%`,
                        backgroundColor: s.color || '#0066FF',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
