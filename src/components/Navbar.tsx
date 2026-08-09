import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  BrainCircuit,
  TrendingUp,
  BarChart3,
  Target,
  Bell,
  Quote as QuoteIcon,
  Award,
  FileSpreadsheet,
  Flame,
  Sun,
  Moon,
  RotateCcw,
  Download,
  FileText
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'daily_tracker'
  | 'skill_management'
  | 'weekly_analytics'
  | 'monthly_analytics'
  | 'goals'
  | 'reminders'
  | 'motivation'
  | 'achievements'
  | 'executive_report'
  | 'notes';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  streak: number;
  totalHours: number;
  onResetData: () => void;
  onExportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  streak,
  totalHours,
  onResetData,
  onExportData,
}) => {
  const level = Math.floor(totalHours / 25) + 1;
  const nextLevelHours = level * 25;
  const levelProgress = Math.min(100, Math.round(((totalHours % 25) / 25) * 100));

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'daily_tracker', label: '2. Daily Tracker', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'skill_management', label: '3. Skill Manager', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'weekly_analytics', label: '4. Weekly Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'monthly_analytics', label: '5. Monthly Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'goals', label: '6. Goals System', icon: <Target className="w-4 h-4" /> },
    { id: 'reminders', label: '7. Reminder Center', icon: <Bell className="w-4 h-4" /> },
    { id: 'motivation', label: '8. Daily Quotes', icon: <QuoteIcon className="w-4 h-4" /> },
    { id: 'achievements', label: '9. Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'executive_report', label: '10. Executive Report & Formulas', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'notes', label: '11. Notes & Remarks Journal', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className={`border-b sticky top-0 z-40 backdrop-blur-md ${
      darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-800'
    }`}>
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight">Study & Personal Growth Tracker</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO B.TECH DS EDITION
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated Productivity, Skill Analytics & Excel Integration</p>
          </div>
        </div>

        {/* Level, Streak, Export, and Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Streak Counter */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            streak > 0
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
              : 'bg-slate-800/50 text-slate-400 border-slate-700'
          }`}>
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{streak} Day Streak</span>
          </div>

          {/* Level / XP Progress */}
          <div className="hidden sm:flex flex-col px-3 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 min-w-[130px]">
            <div className="flex justify-between items-center text-[11px] font-semibold text-indigo-300">
              <span>Lvl {level} Scholar</span>
              <span>{totalHours.toFixed(0)}h / {nextLevelHours}h</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={onExportData}
            title="Export Data as JSON Backup"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            title="Reset to 30-Day Sample Data"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light / Dark Mode"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Sheet Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
