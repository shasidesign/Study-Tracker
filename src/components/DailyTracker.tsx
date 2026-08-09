import React, { useState } from 'react';
import { DailyLog, Skill, NoteItem } from '../types/tracker';
import { exportAllDataToExcel } from '../utils/excelExporter';
import { NotesJournal } from './NotesJournal';
import { Plus, Search, Calendar, Edit2, Trash2, CheckCircle, XCircle, Sparkles, Filter, FileSpreadsheet } from 'lucide-react';

interface DailyTrackerProps {
  logs: DailyLog[];
  skills: Skill[];
  onAddLog: (newLog: DailyLog) => void;
  onUpdateLog: (updatedLog: DailyLog) => void;
  onDeleteLog: (id: string) => void;
  notes?: NoteItem[];
  onAddNote?: (note: NoteItem) => void;
  onUpdateNote?: (note: NoteItem) => void;
  onDeleteNote?: (id: string) => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  logs,
  skills,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
  notes = [],
  onAddNote = () => {},
  onUpdateNote = () => {},
  onDeleteNote = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [formData, setFormData] = useState({
    date: todayStr,
    mood: 'Focused' as DailyLog['mood'],
    energyLevel: 8,
    remarks: '',
    todayGoal: '',
    goalCompleted: true,
    learningReflection: '',
    skillsHours: skills.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {} as Record<string, number>),
  });

  const handleOpenAddModal = () => {
    setEditingLogId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mood: 'Focused',
      energyLevel: 8,
      remarks: '',
      todayGoal: 'Solve 2 LeetCode Mediums & Practice SQL Window Functions',
      goalCompleted: true,
      learningReflection: 'Mastered SQL CTEs and implemented XGBoost hyperparameter tuning.',
      skillsHours: skills.reduce((acc, s) => ({ ...acc, [s.id]: 1.0 }), {} as Record<string, number>),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (log: DailyLog) => {
    setEditingLogId(log.id);
    setFormData({
      date: log.date,
      mood: log.mood,
      energyLevel: log.energyLevel,
      remarks: log.remarks,
      todayGoal: log.todayGoal,
      goalCompleted: log.goalCompleted,
      learningReflection: log.learningReflection,
      skillsHours: {
        ...skills.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {}),
        ...log.skillsHours,
      },
    });
    setIsModalOpen(true);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const dObj = new Date(formData.date);
    const dayStr = dayNames[dObj.getDay()] || 'Monday';

    const total = Number(
      Object.values(formData.skillsHours).reduce((sum, h) => sum + (Number(h) || 0), 0).toFixed(1)
    );

    const logToSave: DailyLog = {
      id: editingLogId || `log-${formData.date}-${Date.now()}`,
      date: formData.date,
      day: dayStr,
      skillsHours: formData.skillsHours,
      totalHours: total,
      mood: formData.mood,
      energyLevel: formData.energyLevel,
      remarks: formData.remarks,
      todayGoal: formData.todayGoal,
      goalCompleted: formData.goalCompleted,
      learningReflection: formData.learningReflection,
    };

    if (editingLogId) {
      onUpdateLog(logToSave);
    } else {
      onAddLog(logToSave);
    }

    setIsModalOpen(false);
  };

  const filteredLogs = logs
    .filter((l) => {
      const matchesSearch =
        l.date.includes(searchTerm) ||
        l.todayGoal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.learningReflection.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.remarks.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = filterMood === 'ALL' || l.mood === filterMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const grandTotalHours = Number(
    filteredLogs.reduce((sum, l) => sum + l.totalHours, 0).toFixed(1)
  );

  const skillTotals: Record<string, number> = {};
  skills.forEach((s) => {
    skillTotals[s.id] = Number(
      filteredLogs.reduce((sum, l) => sum + (l.skillsHours[s.id] || 0), 0).toFixed(1)
    );
  });

  const avgEnergy = filteredLogs.length
    ? (filteredLogs.reduce((sum, l) => sum + l.energyLevel, 0) / filteredLogs.length).toFixed(1)
    : '0';

  const completedGoalsCount = filteredLogs.filter((l) => l.goalCompleted).length;
  const goalRate = filteredLogs.length
    ? Math.round((completedGoalsCount / filteredLogs.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0066FF]" /> Daily Log Sheet
          </h2>
          <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
            Record hours per skill, mood, energy, goal completion, and reflections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#A4A4A2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#37352F] dark:text-slate-200 placeholder-[#A4A4A2] focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          {/* Mood Filter */}
          <div className="flex items-center gap-1.5 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] px-3 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-[#A4A4A2]" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="bg-transparent text-[#37352F] dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Moods</option>
              <option value="Great">Great</option>
              <option value="Focused">Focused</option>
              <option value="Neutral">Neutral</option>
              <option value="Tired">Tired</option>
              <option value="Stressed">Stressed</option>
            </select>
          </div>

          {/* Export Excel Button */}
          <button
            onClick={() => exportAllDataToExcel({ logs, skills, goals: [], reminders: [] })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Download Daily Logs Excel (.xlsx) Sheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Export</span>
          </button>

          {/* Add Entry Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Entry</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-slate-200 font-bold border-b border-[#EBEBE9] dark:border-[#2A2B2E] select-none">
                <th className="p-3 min-w-[95px] sticky left-0 bg-[#F7F7F5] dark:bg-[#24262A] z-10">Date</th>
                <th className="p-3 min-w-[80px]">Day</th>

                {skills.map((s) => (
                  <th key={s.id} className="p-3 min-w-[90px] text-center" style={{ color: s.color }}>
                    {s.name} (h)
                  </th>
                ))}

                <th className="p-3 min-w-[85px] text-center font-bold text-[#0066FF] bg-[#0066FF]/10">
                  Total (h)
                </th>
                <th className="p-3 min-w-[80px] text-center">Mood</th>
                <th className="p-3 min-w-[70px] text-center">Energy</th>
                <th className="p-3 min-w-[160px]">Today's Goal</th>
                <th className="p-3 min-w-[80px] text-center">Status</th>
                <th className="p-3 min-w-[200px]">Reflection</th>
                <th className="p-3 min-w-[140px]">Remarks</th>
                <th className="p-3 min-w-[75px] text-center sticky right-0 bg-[#F7F7F5] dark:bg-[#24262A] z-10">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EBEBE9] dark:divide-[#2A2B2E] text-[#37352F] dark:text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F7F5]/80 dark:hover:bg-[#24262A]/50 transition-colors">
                  <td className="p-3 font-semibold text-[#0066FF] sticky left-0 bg-white dark:bg-[#18191C] z-10 font-mono">
                    {log.date}
                  </td>
                  <td className="p-3 text-[#787774] dark:text-slate-400">{log.day}</td>

                  {skills.map((s) => {
                    const hrs = log.skillsHours[s.id] || 0;
                    return (
                      <td key={s.id} className="p-3 text-center font-mono font-medium">
                        {hrs > 0 ? (
                          <span className="text-[#37352F] dark:text-slate-200">{hrs}</span>
                        ) : (
                          <span className="text-[#A4A4A2] dark:text-slate-600">-</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="p-3 text-center font-bold text-[#0066FF] bg-[#0066FF]/5 font-mono">
                    {log.totalHours}h
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBEBE9] dark:bg-[#24262A] border border-[#A4A4A2]/30">
                      {log.mood}
                    </span>
                  </td>

                  <td className="p-3 text-center font-mono font-medium text-[#787774] dark:text-slate-300">
                    {log.energyLevel}/10
                  </td>

                  <td className="p-3 max-w-[160px] truncate" title={log.todayGoal}>
                    {log.todayGoal || '-'}
                  </td>

                  <td className="p-3 text-center">
                    {log.goalCompleted ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#A4A4A2] text-[10px]">
                        <XCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>

                  <td className="p-3 max-w-[200px] truncate" title={log.learningReflection}>
                    {log.learningReflection || '-'}
                  </td>

                  <td className="p-3 max-w-[140px] truncate text-[#787774] dark:text-slate-400" title={log.remarks}>
                    {log.remarks || '-'}
                  </td>

                  <td className="p-3 text-center sticky right-0 bg-white dark:bg-[#18191C] z-10">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(log)}
                        className="p-1 hover:bg-[#EBEBE9] dark:hover:bg-[#24262A] text-[#0066FF] rounded transition-colors"
                        title="Edit Log"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1 hover:bg-[#EBEBE9] dark:hover:bg-[#24262A] text-rose-500 rounded transition-colors"
                        title="Delete Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-[#F7F7F5] dark:bg-[#24262A] font-bold border-t-2 border-[#EBEBE9] dark:border-[#2A2B2E] text-[#37352F] dark:text-white">
                <td className="p-3 sticky left-0 bg-[#F7F7F5] dark:bg-[#24262A] z-10 font-bold text-[#0066FF]">
                  TOTALS ({filteredLogs.length}d)
                </td>
                <td className="p-3 text-[#A4A4A2]">-</td>

                {skills.map((s) => (
                  <td key={s.id} className="p-3 text-center font-mono text-[#0066FF]">
                    {skillTotals[s.id] || 0}h
                  </td>
                ))}

                <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                  {grandTotalHours}h
                </td>
                <td className="p-3 text-center text-[#A4A4A2]">-</td>
                <td className="p-3 text-center font-mono text-amber-600 dark:text-amber-400">Avg {avgEnergy}</td>
                <td className="p-3 text-[#A4A4A2]">-</td>
                <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{goalRate}% Goal Rate</td>
                <td className="p-3 text-[#A4A4A2]" colSpan={3}>
                  Calculated Totals Across Logs
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Embedded Notes & Remarks Journal Section */}
      <div className="pt-4 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
        <NotesJournal
          notes={notes}
          onAddNote={onAddNote}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
        />
      </div>

      {/* Add / Edit Daily Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
              <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                {editingLogId ? 'Edit Daily Log' : 'Add New Daily Log'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#787774] hover:text-[#37352F] dark:hover:text-white font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#37352F] dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#37352F] dark:text-slate-300 mb-1">Mood</label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value as any })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    <option value="Great">Great</option>
                    <option value="Focused">Focused</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Tired">Tired</option>
                    <option value="Stressed">Stressed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#37352F] dark:text-slate-300 mb-1">
                    Energy ({formData.energyLevel}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energyLevel}
                    onChange={(e) => setFormData({ ...formData, energyLevel: Number(e.target.value) })}
                    className="w-full accent-[#0066FF] cursor-pointer mt-1"
                  />
                </div>
              </div>

              {/* Skill Hours Grid */}
              <div className="border border-[#EBEBE9] dark:border-[#2A2B2E] p-3 rounded-lg bg-[#F7F7F5] dark:bg-[#24262A] space-y-2">
                <h4 className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
                  Skill Hours Logged
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {skills.map((s) => (
                    <div key={s.id}>
                      <label className="block text-[10px] text-[#787774] dark:text-slate-300 truncate" style={{ color: s.color }}>
                        {s.name}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="24"
                        value={formData.skillsHours[s.id] ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            skillsHours: {
                              ...formData.skillsHours,
                              [s.id]: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#33353A] rounded px-2 py-1 text-xs font-mono text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#37352F] dark:text-slate-300 mb-1">Today's Goal</label>
                <input
                  type="text"
                  required
                  value={formData.todayGoal}
                  onChange={(e) => setFormData({ ...formData, todayGoal: e.target.value })}
                  placeholder="e.g. Practice 3 LeetCode Mediums"
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#37352F] dark:text-slate-300 mb-1">Reflection & Notes</label>
                <textarea
                  rows={2}
                  value={formData.learningReflection}
                  onChange={(e) => setFormData({ ...formData, learningReflection: e.target.value })}
                  placeholder="Key concepts learned today..."
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] text-xs font-semibold text-[#37352F] dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#0066FF] text-white text-xs font-semibold shadow-sm hover:bg-blue-600 transition-all cursor-pointer"
                >
                  {editingLogId ? 'Update' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
