import React, { useState } from 'react';
import { Goal, GoalTimeframe, GoalPriority, GoalStatus } from '../types/tracker';
import { Target, Plus, Search, Filter, Clock, Trash2, Edit2, Sparkles } from 'lucide-react';

interface GoalsSystemProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalsSystem: React.FC<GoalsSystemProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Core Data Science',
    timeframe: 'Monthly' as GoalTimeframe,
    priority: 'High' as GoalPriority,
    deadline: new Date().toISOString().split('T')[0],
    status: 'In Progress' as GoalStatus,
    progress: 50,
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingGoalId(null);
    setFormData({
      name: '',
      category: 'Core Data Science',
      timeframe: 'Monthly',
      priority: 'High',
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'In Progress',
      progress: 50,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setFormData({
      name: goal.name,
      category: goal.category,
      timeframe: goal.timeframe,
      priority: goal.priority,
      deadline: goal.deadline,
      status: goal.status,
      progress: goal.progress,
      notes: goal.notes,
    });
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const goalToSave: Goal = {
      id: editingGoalId || `g-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      timeframe: formData.timeframe,
      priority: formData.priority,
      deadline: formData.deadline,
      status: formData.progress === 100 ? 'Completed' : formData.status,
      progress: formData.progress,
      notes: formData.notes,
    };

    if (editingGoalId) {
      onUpdateGoal(goalToSave);
    } else {
      onAddGoal(goalToSave);
    }

    setIsModalOpen(false);
  };

  const filteredGoals = goals.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTimeframe = selectedTimeframe === 'ALL' || g.timeframe === selectedTimeframe;
    return matchesSearch && matchesTimeframe;
  });

  const timeframes: (GoalTimeframe | 'ALL')[] = ['ALL', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-[#0066FF]" /> Multi-Tier Goals System
          </h2>
          <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
            Track short-term daily targets and long-term career milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-[#A4A4A2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#37352F] dark:text-slate-200 placeholder-[#A4A4A2] focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1.5 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] px-3 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-[#A4A4A2]" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-transparent text-[#37352F] dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {timeframes.map((tf) => (
                <option key={tf} value={tf}>
                  {tf === 'ALL' ? 'All Timeframes' : `${tf} Goals`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map((g) => (
          <div
            key={g.id}
            className="p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-slate-300 border border-[#EBEBE9] dark:border-[#33353A]">
                  {g.priority} Priority • {g.timeframe}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(g)}
                    className="p-1 text-[#A4A4A2] hover:text-[#0066FF] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteGoal(g.id)}
                    className="p-1 text-[#A4A4A2] hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#37352F] dark:text-white line-clamp-2">{g.name}</h3>
                <p className="text-xs text-[#787774] dark:text-slate-400 mt-1 line-clamp-2">{g.notes || 'No notes added.'}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#787774] dark:text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-[#A4A4A2]" /> Due: <strong className="text-[#37352F] dark:text-slate-200">{g.deadline}</strong>
                </span>
                <span
                  className={`font-bold text-[11px] ${
                    g.status === 'Completed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[#0066FF]'
                  }`}
                >
                  {g.status} ({g.progress}%)
                </span>
              </div>

              <div className="w-full bg-[#F7F7F5] dark:bg-[#24262A] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    g.status === 'Completed' ? 'bg-emerald-500' : 'bg-[#0066FF]'
                  }`}
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
              <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                {editingGoalId ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#787774] hover:text-[#37352F] dark:hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 100 LeetCode Mediums"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Timeframe</label>
                  <select
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value as any })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">
                    Progress ({formData.progress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                    className="w-full accent-[#0066FF] cursor-pointer mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Notes / Action Plan</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Steps to achieve this goal..."
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
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
                  className="px-4 py-1.5 rounded-md bg-[#0066FF] text-white font-semibold shadow-sm hover:bg-blue-600 cursor-pointer"
                >
                  {editingGoalId ? 'Update Goal' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
