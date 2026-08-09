import React from 'react';
import { DailyLog, Skill, Goal, Quote } from '../types/tracker';
import { DashboardMetrics } from '../utils/analytics';
import {
  Clock,
  Flame,
  CheckCircle2,
  Brain,
  TrendingUp,
  Zap,
  Target,
  Sparkles,
  BookOpen,
  ChevronRight,
  Award
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  metrics: DashboardMetrics;
  logs: DailyLog[];
  skills: Skill[];
  goals: Goal[];
  quote: Quote;
  onNavigate: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  logs,
  skills,
  quote,
  onNavigate,
}) => {
  // Recent 10 days activity chart data
  const recentLogsChartData = [...logs]
    .slice(0, 10)
    .reverse()
    .map((l) => ({
      date: l.date.slice(5), // MM-DD
      hours: l.totalHours,
      energy: l.energyLevel,
    }));

  // Skill Hours Distribution Data
  const skillChartData = skills
    .map((s) => ({
      name: s.name,
      hours: metrics.skillHoursMap[s.id] || 0,
      color: s.color,
    }))
    .filter((s) => s.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const CHART_COLORS = ['#0066FF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#32D74B'];

  const recentReflections = logs
    .filter((l) => l.learningReflection && l.learningReflection.trim().length > 0)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Executive Header Banner - Recipe 1 Dark Highlight Style */}
      <div className="bg-[#1A1A18] text-white border border-[#2A2A28] rounded-xl p-6 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0066FF] bg-[#0066FF]/10 px-2.5 py-0.5 rounded border border-[#0066FF]/20">
              <Sparkles className="w-3 h-3" /> Data Science B.Tech Hub
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              GrowthOS Executive Summary
            </h2>
            <p className="text-xs text-[#A4A4A2] max-w-2xl leading-relaxed">
              Monitoring core technical skills, Machine Learning models, DSA problem counts, and consistency velocity.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#2A2A28] px-5 py-3 rounded-xl border border-[#3A3A38] shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0066FF]">
                {metrics.productivityScore}%
              </div>
              <div className="text-[10px] font-bold text-[#A4A4A2] uppercase tracking-wider mt-0.5">
                Productivity
              </div>
            </div>
            <div className="h-8 w-px bg-[#3A3A38]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {metrics.consistencyScore}%
              </div>
              <div className="text-[10px] font-bold text-[#A4A4A2] uppercase tracking-wider mt-0.5">
                Consistency
              </div>
            </div>
          </div>
        </div>

        {/* Quote Footer Line */}
        <div className="mt-5 pt-4 border-t border-[#2A2A28] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#A4A4A2] gap-2">
          <div className="italic truncate max-w-2xl">
            <strong className="text-white font-semibold not-italic">Daily Insight:</strong> "{quote.quote}" — {quote.author}
          </div>
          <button
            onClick={() => onNavigate('motivation')}
            className="text-[#0066FF] hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            All 365 Quotes <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards - Recipe 1 Style */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Study Hours */}
        <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] p-5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-[#A4A4A2] uppercase tracking-widest mb-1">Total Study Hours</div>
          <div className="text-3xl font-bold text-[#37352F] dark:text-white">{metrics.totalStudyHours}</div>
          <div className="flex justify-between items-center text-[10px] text-[#787774] dark:text-slate-400 mt-2 pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
            <span>Weekly: <strong className="text-[#37352F] dark:text-white">{metrics.weeklyStudyHours}h</strong></span>
            <span>Monthly: <strong className="text-[#37352F] dark:text-white">{metrics.monthlyStudyHours}h</strong></span>
          </div>
        </div>

        {/* Card 2: Current Streak */}
        <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] p-5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-[#A4A4A2] uppercase tracking-widest mb-1">Current Streak</div>
          <div className="text-3xl font-bold text-[#37352F] dark:text-white">{metrics.currentStreak} <span className="text-sm font-normal text-[#787774]">Days</span></div>
          <div className="text-[10px] text-orange-600 font-bold mt-2 pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
            Longest Record: {metrics.longestStreak} Days
          </div>
        </div>

        {/* Card 3: Consistency & Goal Completion */}
        <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] p-5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-[#A4A4A2] uppercase tracking-widest mb-1">Goal Completion Rate</div>
          <div className="text-3xl font-bold text-[#37352F] dark:text-white">{metrics.completionPercentage}%</div>
          <div className="w-full bg-[#EBEBE9] dark:bg-[#2A2B2E] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#0066FF] h-full rounded-full transition-all duration-500" style={{ width: `${metrics.completionPercentage}%` }} />
          </div>
        </div>

        {/* Card 4: Top Skill Focus */}
        <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] p-5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-[#A4A4A2] uppercase tracking-widest mb-1">Primary Skill Focus</div>
          <div className="text-2xl font-bold text-[#37352F] dark:text-white truncate">{skillChartData[0]?.name || 'Python'}</div>
          <div className="text-[10px] text-[#A4A4A2] mt-2 pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E] flex justify-between items-center">
            <span>{skillChartData[0]?.hours || 0} hrs logged</span>
            <button onClick={() => onNavigate('skill_management')} className="text-[#0066FF] font-bold hover:underline cursor-pointer">
              Skill Matrix →
            </button>
          </div>
        </div>
      </section>

      {/* Goal Progress Overview Card */}
      <section className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#0066FF]" />
            <h3 className="font-bold text-sm text-[#37352F] dark:text-white">Multi-Tier Goal Progress</h3>
          </div>
          <button
            onClick={() => onNavigate('goals')}
            className="text-xs text-[#0066FF] hover:underline font-semibold cursor-pointer"
          >
            Manage Goals →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F7F7F5] dark:bg-[#24262A] rounded-lg border border-[#EBEBE9] dark:border-[#2A2B2E] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#37352F] dark:text-white">Today's Daily Target</span>
              <span className="text-[#0066FF] font-bold">{metrics.todayGoalProgress}%</span>
            </div>
            <div className="w-full bg-[#EBEBE9] dark:bg-[#18191C] h-2 rounded-full overflow-hidden">
              <div className="bg-[#0066FF] h-full rounded-full transition-all duration-500" style={{ width: `${metrics.todayGoalProgress}%` }} />
            </div>
            <p className="text-[10px] text-[#787774] dark:text-slate-400">Consistency & daily practice targets</p>
          </div>

          <div className="p-4 bg-[#F7F7F5] dark:bg-[#24262A] rounded-lg border border-[#EBEBE9] dark:border-[#2A2B2E] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#37352F] dark:text-white">Weekly Target Hours</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{metrics.weeklyGoalProgress}%</span>
            </div>
            <div className="w-full bg-[#EBEBE9] dark:bg-[#18191C] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.weeklyGoalProgress}%` }} />
            </div>
            <p className="text-[10px] text-[#787774] dark:text-slate-400">Weekly course & assignment milestones</p>
          </div>

          <div className="p-4 bg-[#F7F7F5] dark:bg-[#24262A] rounded-lg border border-[#EBEBE9] dark:border-[#2A2B2E] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#37352F] dark:text-white">Monthly Milestone Progress</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">{metrics.monthlyGoalProgress}%</span>
            </div>
            <div className="w-full bg-[#EBEBE9] dark:bg-[#18191C] h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.monthlyGoalProgress}%` }} />
            </div>
            <p className="text-[10px] text-[#787774] dark:text-slate-400">Certifications, ML pipelines & exams</p>
          </div>
        </div>
      </section>

      {/* Analytics Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Learning Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#37352F] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0066FF]" /> Daily Study Hours Velocity
              </h3>
              <p className="text-xs text-[#787774] dark:text-slate-400">Hours invested across recent study sessions</p>
            </div>
            <span className="text-[10px] font-bold text-[#0066FF] uppercase bg-[#0066FF]/10 px-2 py-0.5 rounded">
              Auto Synced
            </span>
          </div>

          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentLogsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#A4A4A2" fontSize={11} tickLine={false} />
                <YAxis stroke="#A4A4A2" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A18',
                    borderColor: '#2A2A28',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="hours" stroke="#0066FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Distribution Donut */}
        <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#37352F] dark:text-white flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-[#0066FF]" /> Skill Distribution
            </h3>
            <p className="text-xs text-[#787774] dark:text-slate-400 mb-2">Logged hours per subject area</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillChartData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="hours"
                  >
                    {skillChartData.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A18',
                      borderColor: '#2A2A28',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
            {skillChartData.slice(0, 4).map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color || CHART_COLORS[idx] }} />
                  <span className="text-[#37352F] dark:text-slate-200 truncate">{s.name}</span>
                </div>
                <span className="text-[#A4A4A2] font-semibold font-mono">{s.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Learning Reflections */}
      <section className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0066FF]" />
            <h3 className="font-bold text-sm text-[#37352F] dark:text-white">Recent Daily Reflections</h3>
          </div>
          <button
            onClick={() => onNavigate('daily_tracker')}
            className="text-xs text-[#0066FF] hover:underline font-semibold cursor-pointer"
          >
            Open Daily Tracker →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReflections.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-[#F7F7F5] dark:bg-[#24262A] rounded-lg border border-[#EBEBE9] dark:border-[#2A2B2E] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-xs text-[#787774] dark:text-slate-400 mb-1">
                  <span className="font-bold text-[#0066FF]">{r.date}</span>
                  <span className="text-[10px] font-mono font-bold bg-[#EBEBE9] dark:bg-[#18191C] px-2 py-0.5 rounded text-[#37352F] dark:text-slate-200">
                    {r.totalHours}h Logged
                  </span>
                </div>
                <p className="text-xs text-[#37352F] dark:text-slate-200 line-clamp-3 leading-relaxed">
                  "{r.learningReflection}"
                </p>
              </div>

              <div className="pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E] text-[10px] text-[#A4A4A2] flex justify-between items-center">
                <span className="truncate max-w-[150px]">Goal: {r.todayGoal}</span>
                <span className={r.goalCompleted ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                  {r.goalCompleted ? '✓ Done' : 'In Progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
