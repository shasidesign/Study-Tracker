import React, { useState, useEffect, useRef } from 'react';
import {
  DailyLog,
  Skill,
  Goal,
  ReminderItem,
  AchievementBadge,
  Quote,
  NoteItem
} from './types/tracker';
import {
  INITIAL_SKILLS,
  INITIAL_GOALS,
  INITIAL_REMINDERS,
  INITIAL_BADGES,
  QUOTES_DATABASE,
  generateSampleLogs,
  INITIAL_NOTES
} from './data/initialData';
import { calculateDashboardMetrics } from './utils/analytics';
import { exportAllDataToExcel } from './utils/excelExporter';
import { Navbar, ActiveTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DailyTracker } from './components/DailyTracker';
import { SkillManagement } from './components/SkillManagement';
import { WeeklyAnalytics } from './components/WeeklyAnalytics';
import { MonthlyAnalytics } from './components/MonthlyAnalytics';
import { GoalsSystem } from './components/GoalsSystem';
import { ReminderCenter } from './components/ReminderCenter';
import { MotivationSystem } from './components/MotivationSystem';
import { AchievementSystem } from './components/AchievementSystem';
import { ExecutiveReport } from './components/ExecutiveReport';
import { ExcelAutoSyncModal } from './components/ExcelAutoSyncModal';
import { NotesJournal } from './components/NotesJournal';
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
  Upload,
  RefreshCw,
  Plus,
  Menu,
  X,
  Sparkles,
  Palette,
  FileText
} from 'lucide-react';

export type BackgroundTheme = 'cyber' | 'nebula' | 'aurora' | 'sunset' | 'midnight';

export default function App() {
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('ds_tracker_logs');
    return saved ? JSON.parse(saved) : generateSampleLogs();
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('ds_tracker_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('ds_tracker_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('ds_tracker_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem('ds_tracker_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('ds_tracker_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ds_tracker_theme');
    return saved ? saved === 'dark' : false; // Default to sleek light theme as per Recipe 1
  });

  const [bgTheme, setBgTheme] = useState<BackgroundTheme>(() => {
    const saved = localStorage.getItem('ds_tracker_bg_theme');
    return (saved as BackgroundTheme) || 'cyber';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [excelSyncModalOpen, setExcelSyncModalOpen] = useState(false);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('ds_tracker_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('ds_tracker_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('ds_tracker_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('ds_tracker_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('ds_tracker_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('ds_tracker_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ds_tracker_bg_theme', bgTheme);
  }, [bgTheme]);

  useEffect(() => {
    localStorage.setItem('ds_tracker_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derived Analytics Metrics
  const metrics = calculateDashboardMetrics(logs, skills, goals);

  // Quote of the day selection
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const currentQuote: Quote = QUOTES_DATABASE[dayOfYear % QUOTES_DATABASE.length] || QUOTES_DATABASE[0];

  // Reset data function
  const handleResetData = () => {
    if (window.confirm('Reset all tracker data to 30-day default sample records?')) {
      const freshLogs = generateSampleLogs();
      setLogs(freshLogs);
      setSkills(INITIAL_SKILLS);
      setGoals(INITIAL_GOALS);
      setReminders(INITIAL_REMINDERS);
      setBadges(INITIAL_BADGES);
      setNotes(INITIAL_NOTES);
    }
  };

  // Export Excel (.xlsx) workbook containing all sheets
  const handleExportToExcel = () => {
    exportAllDataToExcel({
      logs,
      skills,
      goals,
      reminders,
      quotes: QUOTES_DATABASE,
      badges,
    });
  };

  // Export JSON backup
  const handleExportData = () => {
    const exportObject = {
      logs,
      skills,
      goals,
      reminders,
      badges,
      notes,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DS_GrowthOS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.logs && Array.isArray(data.logs)) setLogs(data.logs);
        if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
        if (data.goals && Array.isArray(data.goals)) setGoals(data.goals);
        if (data.reminders && Array.isArray(data.reminders)) setReminders(data.reminders);
        if (data.badges && Array.isArray(data.badges)) setBadges(data.badges);
        if (data.notes && Array.isArray(data.notes)) setNotes(data.notes);
        alert('Data successfully restored from JSON backup file!');
      } catch (err) {
        alert('Invalid JSON backup file. Please select a valid DS GrowthOS JSON backup.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Handlers for Notes
  const handleAddNote = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleUpdateNote = (updatedNote: NoteItem) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  // Handlers for Logs
  const handleAddLog = (newLog: DailyLog) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateLog = (updatedLog: DailyLog) => {
    setLogs((prev) => prev.map((l) => (l.id === updatedLog.id ? updatedLog : l)));
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this daily log entry?')) {
      setLogs((prev) => prev.filter((l) => l.id !== id));
    }
  };

  // Handlers for Skills
  const handleAddSkill = (newSkill: Skill) => {
    setSkills((prev) => [...prev, newSkill]);
  };

  const handleUpdateSkill = (updatedSkill: Skill) => {
    setSkills((prev) => prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)));
  };

  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for Goals
  const handleAddGoal = (newGoal: Goal) => {
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Handlers for Reminders
  const handleAddReminder = (newReminder: ReminderItem) => {
    setReminders((prev) => [...prev, newReminder]);
  };

  const handleUpdateReminder = (updatedReminder: ReminderItem) => {
    setReminders((prev) => prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r)));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Navigation Items with AI stylized vibrant icon themes
  const mainNavItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:text-blue-400',
      activeGradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'daily_tracker' as ActiveTab,
      label: 'Daily Tracker',
      icon: <CalendarCheck className="w-4 h-4" />,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400',
      activeGradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'skill_management' as ActiveTab,
      label: 'Skill Matrix',
      icon: <BrainCircuit className="w-4 h-4" />,
      colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:text-purple-400',
      activeGradient: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'goals' as ActiveTab,
      label: 'Goal System',
      icon: <Target className="w-4 h-4" />,
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:text-rose-400',
      activeGradient: 'from-rose-600 to-red-600'
    },
    {
      id: 'reminders' as ActiveTab,
      label: 'Reminder Center',
      icon: <Bell className="w-4 h-4" />,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:text-amber-400',
      activeGradient: 'from-amber-600 to-orange-600'
    },
    {
      id: 'notes' as ActiveTab,
      label: 'Notes & Remarks',
      icon: <FileText className="w-4 h-4" />,
      colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20 dark:text-sky-400',
      activeGradient: 'from-sky-600 to-blue-600'
    },
  ];

  const analyticsNavItems = [
    {
      id: 'weekly_analytics' as ActiveTab,
      label: 'Weekly Report',
      icon: <TrendingUp className="w-4 h-4" />,
      colorClass: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20 dark:text-cyan-400',
      activeGradient: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'monthly_analytics' as ActiveTab,
      label: 'Monthly Performance',
      icon: <BarChart3 className="w-4 h-4" />,
      colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400',
      activeGradient: 'from-indigo-600 to-violet-600'
    },
    {
      id: 'motivation' as ActiveTab,
      label: 'Daily Quotes',
      icon: <QuoteIcon className="w-4 h-4" />,
      colorClass: 'text-violet-500 bg-violet-500/10 border-violet-500/20 dark:text-violet-400',
      activeGradient: 'from-violet-600 to-fuchsia-600'
    },
    {
      id: 'achievements' as ActiveTab,
      label: 'Achievements',
      icon: <Award className="w-4 h-4" />,
      colorClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 dark:text-amber-400',
      activeGradient: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'executive_report' as ActiveTab,
      label: 'Executive & Formulas',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      colorClass: 'text-teal-500 bg-teal-500/10 border-teal-500/20 dark:text-teal-400',
      activeGradient: 'from-teal-600 to-emerald-600'
    },
  ];

  const level = Math.floor(metrics.totalStudyHours / 25) + 1;

  return (
    <div
      className={`relative flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${
        darkMode ? `bg-theme-${bgTheme}-dark text-[#EDEDED]` : `bg-theme-${bgTheme}-light text-[#37352F]`
      }`}
    >
      {/* Background Ambient Lighting Orbs & Immersive Gradient Mesh Depth */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 transition-all duration-700">
        {bgTheme === 'cyber' && (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[100px] animate-ambient-glow-1" />
            <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-indigo-500/15 dark:bg-purple-600/20 rounded-full blur-[100px] animate-ambient-glow-2" />
            <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-[110px] animate-ambient-glow-3" />
          </>
        )}

        {bgTheme === 'nebula' && (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-600/25 rounded-full blur-[100px] animate-ambient-glow-1" />
            <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-fuchsia-500/20 dark:bg-pink-600/25 rounded-full blur-[100px] animate-ambient-glow-2" />
            <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-indigo-500/15 dark:bg-violet-600/20 rounded-full blur-[110px] animate-ambient-glow-3" />
          </>
        )}

        {bgTheme === 'aurora' && (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 dark:bg-emerald-600/25 rounded-full blur-[100px] animate-ambient-glow-1" />
            <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-teal-500/20 dark:bg-cyan-600/25 rounded-full blur-[100px] animate-ambient-glow-2" />
            <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-green-500/15 dark:bg-emerald-500/20 rounded-full blur-[110px] animate-ambient-glow-3" />
          </>
        )}

        {bgTheme === 'sunset' && (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-amber-500/20 dark:bg-amber-600/25 rounded-full blur-[100px] animate-ambient-glow-1" />
            <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-rose-500/20 dark:bg-rose-600/25 rounded-full blur-[100px] animate-ambient-glow-2" />
            <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-orange-500/15 dark:bg-orange-600/20 rounded-full blur-[110px] animate-ambient-glow-3" />
          </>
        )}

        {bgTheme === 'midnight' && (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-sky-500/10 dark:bg-blue-600/15 rounded-full blur-[100px] animate-ambient-glow-1" />
            <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[100px] animate-ambient-glow-2" />
            <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-slate-500/10 dark:bg-slate-600/15 rounded-full blur-[110px] animate-ambient-glow-3" />
          </>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Recipe 1 Technical Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 z-50 flex flex-col border-r transition-transform duration-200 backdrop-blur-md ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          darkMode ? 'bg-[#141518]/90 border-[#2A2B2E]' : 'bg-[#F7F7F5]/90 border-[#EBEBE9]'
        }`}
      >
        {/* Sidebar Header Logo */}
        <div className="p-6 flex items-center justify-between border-b border-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#37352F] dark:bg-white rounded flex items-center justify-center text-white dark:text-[#37352F] font-bold text-xs tracking-tight shadow-sm">
              DS
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight uppercase">GrowthOS</h1>
              <span className="text-[10px] text-[#A4A4A2] font-mono block">Pro B.Tech Tracker</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 text-[#787774] hover:text-[#37352F] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-[#A4A4A2] uppercase tracking-wider">
              Navigation
            </div>
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                    isActive
                      ? darkMode
                        ? 'bg-[#2A2B2E] text-white shadow-md font-semibold border border-white/10'
                        : 'bg-white text-[#37352F] shadow-sm font-semibold border border-[#EBEBE9]'
                      : darkMode
                      ? 'text-[#A4A4A2] hover:bg-[#2A2B2E]/50 hover:text-white'
                      : 'text-[#787774] hover:bg-[#EBEBE9]/60 hover:text-[#37352F]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg border transition-all duration-200 flex items-center justify-center shrink-0 ${
                      isActive
                        ? `bg-gradient-to-tr ${item.activeGradient} text-white border-transparent shadow-sm shadow-indigo-500/20 scale-105`
                        : `${item.colorClass} group-hover:scale-110`
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Analytics & Reports */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-[#A4A4A2] uppercase tracking-wider">
              Analytics & Insights
            </div>
            {analyticsNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                    isActive
                      ? darkMode
                        ? 'bg-[#2A2B2E] text-white shadow-md font-semibold border border-white/10'
                        : 'bg-white text-[#37352F] shadow-sm font-semibold border border-[#EBEBE9]'
                      : darkMode
                      ? 'text-[#A4A4A2] hover:bg-[#2A2B2E]/50 hover:text-white'
                      : 'text-[#787774] hover:bg-[#EBEBE9]/60 hover:text-[#37352F]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg border transition-all duration-200 flex items-center justify-center shrink-0 ${
                      isActive
                        ? `bg-gradient-to-tr ${item.activeGradient} text-white border-transparent shadow-sm shadow-indigo-500/20 scale-105`
                        : `${item.colorClass} group-hover:scale-110`
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer Daily Quote Mini Card */}
        <div className="p-4 mt-auto">
          <div
            className={`p-3.5 rounded-xl border shadow-sm space-y-1.5 ${
              darkMode ? 'bg-[#24262A] border-[#33353A]' : 'bg-white border-[#EBEBE9]'
            }`}
          >
            <div className="text-[10px] font-bold uppercase text-[#A4A4A2] tracking-wider flex items-center justify-between">
              <span>Daily Motivation</span>
              <Sparkles className="w-3 h-3 text-[#0066FF]" />
            </div>
            <p className="text-xs italic leading-relaxed line-clamp-3 text-[#37352F] dark:text-[#E0E0E0]">
              "{currentQuote.quote}"
            </p>
            <p className="text-[10px] font-semibold text-[#787774] text-right">— {currentQuote.author}</p>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header
          className={`px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0 backdrop-blur-md z-10 ${
            darkMode ? 'bg-[#141518]/80 border-[#2A2B2E]' : 'bg-[#FBFBFA]/80 border-[#EBEBE9]'
          }`}
        >
          {/* Left Title Area */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg border border-[#EBEBE9] dark:border-[#2A2B2E] text-[#37352F] dark:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#37352F] dark:text-white truncate">
                Data Science Executive Dashboard
              </h2>
              <p className="text-xs text-[#787774] truncate">
                B.Tech DS Journey • Level {level} Scholar • {metrics.totalStudyHours} Total Hours Logged
              </p>
            </div>
          </div>

          {/* Right Control Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Real-time Auto-Save Badge */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold"
              title="All changes auto-save in real-time inside your browser"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Auto-Saved Live</span>
            </div>

            {/* Streak Counter */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold ${
                metrics.currentStreak > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-slate-200/50 text-slate-500 border-slate-300'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="hidden sm:inline">{metrics.currentStreak} Day Streak</span>
              <span className="sm:hidden">{metrics.currentStreak}d</span>
            </div>

            {/* Quick Log Action */}
            <button
              onClick={() => setActiveTab('daily_tracker')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">+ Log Session</span>
            </button>

            {/* Export Excel Workbook (.xlsx) */}
            <button
              onClick={handleExportToExcel}
              title="Automatically export all tracker logs, skills, goals & deadlines into a multi-tab Excel (.xlsx) workbook"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export Excel (.xlsx)</span>
              <span className="sm:hidden">Excel</span>
            </button>

            {/* Excel Auto-Sync Guide Button */}
            <button
              onClick={() => setExcelSyncModalOpen(true)}
              title="Learn how Excel auto-updates and how to set up Live Power Query / Google Sheets Sync"
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Auto-Sync Setup</span>
            </button>

            {/* Hidden JSON File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportData}
              accept=".json"
              className="hidden"
            />

            {/* Export JSON Backup */}
            <button
              onClick={handleExportData}
              title="Download full JSON data backup file"
              className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>JSON Backup</span>
            </button>

            {/* Import JSON Restore */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Restore tracker data from a JSON backup file"
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-[#2A2B2E] border border-[#EBEBE9] dark:border-[#33353A] text-xs font-semibold rounded-md text-[#37352F] dark:text-white hover:bg-slate-200 dark:hover:bg-[#33353A] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">Restore JSON</span>
            </button>

            {/* Reset Data */}
            <button
              onClick={handleResetData}
              title="Reset to 30-Day Sample Data"
              className="p-1.5 rounded-md border border-[#EBEBE9] dark:border-[#33353A] bg-white dark:bg-[#2A2B2E] text-[#787774] dark:text-slate-300 hover:text-[#37352F] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Background Theme Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#EBEBE9] dark:border-[#33353A] bg-white dark:bg-[#2A2B2E] text-xs shadow-xs">
              <Palette className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <select
                value={bgTheme}
                onChange={(e) => setBgTheme(e.target.value as BackgroundTheme)}
                title="Switch Immersive Background Theme Environment"
                className="bg-transparent text-xs font-bold text-[#37352F] dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="cyber" className="dark:bg-[#1C1E22] text-black dark:text-white">Cyber Grid</option>
                <option value="nebula" className="dark:bg-[#1C1E22] text-black dark:text-white">Deep Nebula</option>
                <option value="aurora" className="dark:bg-[#1C1E22] text-black dark:text-white">Aurora Emerald</option>
                <option value="sunset" className="dark:bg-[#1C1E22] text-black dark:text-white">Sunset Amber</option>
                <option value="midnight" className="dark:bg-[#1C1E22] text-black dark:text-white">Midnight OLED</option>
              </select>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Light / Dark Mode"
              className="p-1.5 rounded-md border border-[#EBEBE9] dark:border-[#33353A] bg-white dark:bg-[#2A2B2E] text-amber-500 transition-all cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#37352F]" />}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              metrics={metrics}
              logs={logs}
              skills={skills}
              goals={goals}
              quote={currentQuote}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'daily_tracker' && (
            <DailyTracker
              logs={logs}
              skills={skills}
              onAddLog={handleAddLog}
              onUpdateLog={handleUpdateLog}
              onDeleteLog={handleDeleteLog}
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'skill_management' && (
            <SkillManagement
              skills={skills}
              logs={logs}
              onAddSkill={handleAddSkill}
              onUpdateSkill={handleUpdateSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          )}

          {activeTab === 'weekly_analytics' && (
            <WeeklyAnalytics logs={logs} skills={skills} />
          )}

          {activeTab === 'monthly_analytics' && (
            <MonthlyAnalytics logs={logs} skills={skills} goals={goals} />
          )}

          {activeTab === 'goals' && (
            <GoalsSystem
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === 'reminders' && (
            <ReminderCenter
              reminders={reminders}
              onAddReminder={handleAddReminder}
              onUpdateReminder={handleUpdateReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          )}

          {activeTab === 'motivation' && (
            <MotivationSystem currentQuote={currentQuote} />
          )}

          {activeTab === 'achievements' && (
            <AchievementSystem
              badges={badges}
              totalHours={metrics.totalStudyHours}
              currentStreak={metrics.currentStreak}
              longestStreak={metrics.longestStreak}
            />
          )}

          {activeTab === 'executive_report' && (
            <ExecutiveReport
              logs={logs}
              skills={skills}
              goals={goals}
              totalHours={metrics.totalStudyHours}
            />
          )}

          {activeTab === 'notes' && (
            <NotesJournal
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}
        </main>
      </div>

      {/* Excel Live Auto-Sync Guide Modal */}
      <ExcelAutoSyncModal
        isOpen={excelSyncModalOpen}
        onClose={() => setExcelSyncModalOpen(false)}
      />
    </div>
  );
}
