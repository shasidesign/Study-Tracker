import React, { useState, useEffect } from 'react';
import { ReminderItem, ReminderCategory, GoalPriority, ReminderStatus } from '../types/tracker';
import { Bell, AlertTriangle, Plus, Search, Filter, Trash2, Edit2, Sparkles, CheckCircle, Clock, Calendar, Download, Volume2, ShieldAlert, Check, ArrowUpRight } from 'lucide-react';

interface ReminderCenterProps {
  reminders: ReminderItem[];
  onAddReminder: (reminder: ReminderItem) => void;
  onUpdateReminder: (reminder: ReminderItem) => void;
  onDeleteReminder: (id: string) => void;
}

export const ReminderCenter: React.FC<ReminderCenterProps> = ({
  reminders,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    task: '',
    category: 'Exams' as ReminderCategory,
    priority: 'High' as GoalPriority,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Upcoming' as ReminderStatus,
    notes: '',
  });

  const categories: (ReminderCategory | 'ALL')[] = [
    'ALL',
    'Assignments',
    'Exams',
    'Projects',
    'Hackathons',
    'Internship Applications',
    'Certifications',
    'Interviews',
  ];

  // Process reminders with countdowns and urgency status
  const processedReminders = reminders.map((r) => {
    const dueTime = new Date(r.dueDate).getTime();
    const nowTime = new Date(todayStr).getTime();
    const diffDays = Math.ceil((dueTime - nowTime) / (1000 * 3600 * 24));

    const isCompleted = r.status === 'Submitted' || r.status === 'Passed' || r.status === 'Completed';
    const isOverdue = diffDays < 0 && !isCompleted;
    const isDueToday = diffDays === 0 && !isCompleted;
    const isDueSoon = diffDays > 0 && diffDays <= 3 && !isCompleted;

    return {
      ...r,
      daysRemaining: diffDays,
      isCompleted,
      isOverdue,
      isDueToday,
      isDueSoon,
    };
  });

  // Calculate top metrics
  const overdueList = processedReminders.filter((r) => r.isOverdue);
  const dueTodayList = processedReminders.filter((r) => r.isDueToday);
  const dueSoonList = processedReminders.filter((r) => r.isDueSoon);
  const activeCount = processedReminders.filter((r) => !r.isCompleted).length;

  // Closest upcoming deadline for live countdown timer
  const upcomingSorted = [...processedReminders]
    .filter((r) => !r.isCompleted && r.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const topUrgentTask = upcomingSorted[0] || null;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!topUrgentTask) return;

    const targetDate = new Date(`${topUrgentTask.dueDate}T23:59:59`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [topUrgentTask?.dueDate, topUrgentTask?.id]);

  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not allowed without interaction');
    }
  };

  const handleQuickStatusChange = (r: ReminderItem, newStatus: ReminderStatus) => {
    onUpdateReminder({ ...r, status: newStatus });
    if (soundEnabled && (newStatus === 'Completed' || newStatus === 'Submitted')) {
      playNotificationSound();
    }
  };

  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//DataScienceStudyTracker//EN\n";
    reminders.forEach((r) => {
      const formattedDate = r.dueDate.replace(/-/g, '');
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:[${r.category}] ${r.task}\n`;
      icsContent += `DESCRIPTION:Priority: ${r.priority} | Status: ${r.status}. ${r.notes || ''}\n`;
      icsContent += `DTSTART;VALUE=DATE:${formattedDate}\n`;
      icsContent += `DTEND;VALUE=DATE:${formattedDate}\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'academic_deadlines.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    let csv = "Task Name,Category,Priority,Due Date,Status,Notes\n";
    reminders.forEach((r) => {
      csv += `"${r.task.replace(/"/g, '""')}","${r.category}","${r.priority}","${r.dueDate}","${r.status}","${(r.notes || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reminders_schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      task: '',
      category: 'Exams',
      priority: 'High',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Upcoming',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ReminderItem) => {
    setEditingId(item.id);
    setFormData({
      task: item.task,
      category: item.category,
      priority: item.priority,
      dueDate: item.dueDate,
      status: item.status,
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.task.trim()) return;

    const itemToSave: ReminderItem = {
      id: editingId || `r-${Date.now()}`,
      task: formData.task.trim(),
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate,
      status: formData.status,
      notes: formData.notes,
    };

    if (editingId) {
      onUpdateReminder(itemToSave);
    } else {
      onAddReminder(itemToSave);
    }

    setIsModalOpen(false);
  };

  const filteredReminders = processedReminders.filter((r) => {
    const matchesSearch =
      r.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;

    let matchesStatus = true;
    if (statusFilter === 'OVERDUE') matchesStatus = r.isOverdue;
    else if (statusFilter === 'SOON') matchesStatus = r.isDueSoon || r.isDueToday;
    else if (statusFilter === 'ACTIVE') matchesStatus = !r.isCompleted;
    else if (statusFilter === 'COMPLETED') matchesStatus = r.isCompleted;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0066FF]" /> Smart Reminder & Command Center
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
              {activeCount} Active Deadlines
            </span>
          </div>
          <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
            Real-time urgency tracking, countdowns, quick status toggles, and calendar exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7F7F5] dark:bg-[#24262A] hover:bg-[#EBEBE9] dark:hover:bg-[#33353A] text-[#37352F] dark:text-slate-200 border border-[#EBEBE9] dark:border-[#33353A] text-xs font-semibold cursor-pointer"
            title="Export to iCal (.ics) for Google or Apple Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>.iCal Export</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7F7F5] dark:bg-[#24262A] hover:bg-[#EBEBE9] dark:hover:bg-[#33353A] text-[#37352F] dark:text-slate-200 border border-[#EBEBE9] dark:border-[#33353A] text-xs font-semibold cursor-pointer"
            title="Export schedule to CSV file"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Task</span>
          </button>
        </div>
      </div>

      {/* Top Urgent Countdown & Urgency Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Urgent Live Countdown Box */}
        <div className="md:col-span-2 p-5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-200 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Most Critical Countdown</span>
            </div>
            {topUrgentTask && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-xs">
                {topUrgentTask.category}
              </span>
            )}
          </div>

          {topUrgentTask ? (
            <div className="space-y-2 relative z-10">
              <h3 className="text-base font-extrabold truncate">{topUrgentTask.task}</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due Date: <strong>{topUrgentTask.dueDate}</strong> ({topUrgentTask.priority} Priority)
              </p>

              <div className="flex items-center gap-3 pt-2 font-mono">
                <div className="bg-black/20 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-xl font-extrabold block leading-none">{timeLeft.hours}</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-200">Hours</span>
                </div>
                <span className="text-lg font-bold">:</span>
                <div className="bg-black/20 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-xl font-extrabold block leading-none">{timeLeft.minutes}</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-200">Mins</span>
                </div>
                <span className="text-lg font-bold">:</span>
                <div className="bg-black/20 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-xl font-extrabold block leading-none">{timeLeft.seconds}</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-200">Secs</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-blue-100">
              🎉 No urgent pending deadlines! All assignments & exams completed or cleared.
            </div>
          )}
        </div>

        {/* Quick Urgency Metric Buttons */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'OVERDUE' ? 'ALL' : 'OVERDUE')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
            statusFilter === 'OVERDUE'
              ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
              : 'bg-white dark:bg-[#18191C] border-[#EBEBE9] dark:border-[#2A2B2E] hover:border-rose-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${statusFilter === 'OVERDUE' ? 'text-white' : 'text-[#787774] dark:text-slate-400'}`}>
              Overdue Tasks
            </span>
            <ShieldAlert className={`w-4 h-4 ${statusFilter === 'OVERDUE' ? 'text-white' : 'text-rose-500'}`} />
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-extrabold ${statusFilter === 'OVERDUE' ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`}>
              {overdueList.length}
            </span>
            <p className={`text-[10px] mt-0.5 ${statusFilter === 'OVERDUE' ? 'text-rose-100' : 'text-[#787774] dark:text-slate-400'}`}>
              Requires immediate submission
            </p>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'SOON' ? 'ALL' : 'SOON')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
            statusFilter === 'SOON'
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-white dark:bg-[#18191C] border-[#EBEBE9] dark:border-[#2A2B2E] hover:border-amber-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${statusFilter === 'SOON' ? 'text-white' : 'text-[#787774] dark:text-slate-400'}`}>
              Due Next 3 Days
            </span>
            <Clock className={`w-4 h-4 ${statusFilter === 'SOON' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-extrabold ${statusFilter === 'SOON' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`}>
              {dueTodayList.length + dueSoonList.length}
            </span>
            <p className={`text-[10px] mt-0.5 ${statusFilter === 'SOON' ? 'text-amber-100' : 'text-[#787774] dark:text-slate-400'}`}>
              High priority review window
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm text-xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'ACTIVE', label: 'Active Pending' },
            { id: 'OVERDUE', label: `Overdue (${overdueList.length})` },
            { id: 'SOON', label: 'Due Soon' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#0066FF] text-white shadow-2xs'
                  : 'bg-[#F7F7F5] dark:bg-[#24262A] text-[#787774] dark:text-slate-300 hover:text-[#37352F] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-[#A4A4A2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deadlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-lg pl-8 pr-3 py-1 text-xs text-[#37352F] dark:text-slate-200 placeholder-[#A4A4A2] focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] px-2.5 py-1 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-[#A4A4A2]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-[#37352F] dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reminders Table */}
      <div className="rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-slate-200 font-bold border-b border-[#EBEBE9] dark:border-[#2A2B2E]">
                <th className="p-3 w-10 text-center">Quick Done</th>
                <th className="p-3 min-w-[200px]">Task Name</th>
                <th className="p-3 min-w-[130px]">Category</th>
                <th className="p-3 min-w-[85px] text-center">Priority</th>
                <th className="p-3 min-w-[100px]">Due Date</th>
                <th className="p-3 min-w-[110px] text-center">Days Remaining</th>
                <th className="p-3 min-w-[100px] text-center">Status</th>
                <th className="p-3 min-w-[100px] text-center">Flag</th>
                <th className="p-3 min-w-[80px] text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EBEBE9] dark:divide-[#2A2B2E] text-[#37352F] dark:text-slate-200">
              {filteredReminders.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-[#F7F7F5]/80 dark:hover:bg-[#24262A]/50 transition-colors ${
                    r.isCompleted
                      ? 'bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
                      : r.isOverdue
                      ? 'bg-rose-50/50 dark:bg-rose-950/20'
                      : r.isDueSoon || r.isDueToday
                      ? 'bg-amber-50/50 dark:bg-amber-950/20'
                      : ''
                  }`}
                >
                  {/* Quick Toggle Checkbox */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        handleQuickStatusChange(
                          r,
                          r.isCompleted ? 'Upcoming' : 'Completed'
                        )
                      }
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer ${
                        r.isCompleted
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : 'border-[#EBEBE9] dark:border-[#33353A] hover:border-[#0066FF] text-transparent hover:text-gray-300'
                      }`}
                      title={r.isCompleted ? 'Mark as Upcoming' : 'Mark as Completed'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  <td className="p-3 font-semibold text-[#37352F] dark:text-white">
                    <span className={r.isCompleted ? 'line-through text-[#787774] dark:text-slate-400' : ''}>
                      {r.task}
                    </span>
                    {r.notes && <p className="text-[10px] font-normal text-[#787774] dark:text-slate-400 mt-0.5">{r.notes}</p>}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] text-[#37352F] dark:text-slate-300 text-[10px] font-semibold">
                      {r.category}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : r.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {r.priority}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-[#787774] dark:text-slate-300">{r.dueDate}</td>

                  <td className="p-3 text-center font-mono font-bold">
                    {r.isCompleted ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Done</span>
                    ) : r.daysRemaining < 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">{Math.abs(r.daysRemaining)}d Overdue</span>
                    ) : r.daysRemaining === 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">DUE TODAY</span>
                    ) : (
                      <span className="text-[#37352F] dark:text-slate-300">{r.daysRemaining} Days</span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <select
                      value={r.status}
                      onChange={(e) => handleQuickStatusChange(r, e.target.value as ReminderStatus)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBEBE9] dark:bg-[#24262A] text-[#37352F] dark:text-slate-200 border-none focus:outline-none cursor-pointer"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Passed">Passed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  <td className="p-3 text-center">
                    {r.isCompleted ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        CLEARED
                      </span>
                    ) : r.isOverdue ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                        OVERDUE
                      </span>
                    ) : r.isDueSoon || r.isDueToday ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        DUE SOON
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">ON TRACK</span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(r)}
                        className="p-1 text-[#0066FF] hover:bg-[#EBEBE9] dark:hover:bg-[#24262A] rounded cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteReminder(r.id)}
                        className="p-1 text-rose-500 hover:bg-[#EBEBE9] dark:hover:bg-[#24262A] rounded cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
              <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                {editingId ? 'Edit Reminder Task' : 'Add New Deadline Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#787774] hover:text-[#37352F] dark:hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Learning Semester Exam"
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Exams">Exams</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Projects">Projects</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="Internship Applications">Internship Applications</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Interviews">Interviews</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Passed">Passed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-slate-300 border border-[#EBEBE9] dark:border-[#33353A] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#0066FF] text-white font-semibold shadow-xs hover:bg-blue-600 cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
