import React, { useState } from 'react';
import { Skill, DailyLog } from '../types/tracker';
import { BrainCircuit, Plus, Trash2, Edit2, Sparkles, Filter, Search, Target, Check, X } from 'lucide-react';

interface SkillManagementProps {
  skills: Skill[];
  logs: DailyLog[];
  onAddSkill: (skill: Skill) => void;
  onUpdateSkill: (skill: Skill) => void;
  onDeleteSkill: (skillId: string) => void;
}

export const SkillManagement: React.FC<SkillManagementProps> = ({
  skills,
  logs,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Core Data Science' as Skill['category'],
    targetWeeklyHours: 5,
    color: '#0066FF',
  });

  const skillHoursMap: Record<string, number> = {};
  skills.forEach((s) => (skillHoursMap[s.id] = 0));

  logs.forEach((log) => {
    Object.entries(log.skillsHours).forEach(([sId, hrs]) => {
      skillHoursMap[sId] = Number(((skillHoursMap[sId] || 0) + hrs).toFixed(1));
    });
  });

  const categories = [
    'ALL',
    'Core Data Science',
    'Technical / Dev',
    'Soft Skills',
    'Personal Development',
    'Other',
  ];

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleOpenAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Core Data Science',
      targetWeeklyHours: 5,
      color: '#0066FF',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: Skill) => {
    setEditingSkill(s);
    setFormData({
      name: s.name,
      category: s.category,
      targetWeeklyHours: s.targetWeeklyHours,
      color: s.color || '#0066FF',
    });
    setIsModalOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingSkill) {
      // Updating existing skill
      const updated: Skill = {
        ...editingSkill,
        name: formData.name.trim(),
        category: formData.category,
        targetWeeklyHours: formData.targetWeeklyHours,
        color: formData.color,
      };
      onUpdateSkill(updated);
    } else {
      // Adding new skill
      const generatedId = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || `skill_${Date.now()}`;
      if (skills.some((s) => s.id === generatedId)) {
        alert('A skill with a similar name already exists.');
        return;
      }
      const created: Skill = {
        id: generatedId,
        name: formData.name.trim(),
        category: formData.category,
        targetWeeklyHours: formData.targetWeeklyHours,
        color: formData.color,
        isCustom: true,
      };
      onAddSkill(created);
    }

    setIsModalOpen(false);
  };

  const handleDeleteWithConfirm = (skill: Skill) => {
    const logged = skillHoursMap[skill.id] || 0;
    const msg = logged > 0
      ? `Are you sure you want to delete "${skill.name}"? It has ${logged} logged study hours.`
      : `Are you sure you want to delete "${skill.name}"?`;
    if (window.confirm(msg)) {
      onDeleteSkill(skill.id);
    }
  };

  const presetColors = [
    '#0066FF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4',
    '#3B82F6', '#F43F5E', '#84CC16', '#EAB308', '#14B8A6', '#A855F7'
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#0066FF]" /> Skill Matrix & Subject Velocity
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
              {skills.length} Active Skills
            </span>
          </div>
          <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
            Add, modify, or customize technical and soft skills. Automatically updates logs, weekly analytics & executive reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-40">
            <Search className="w-3.5 h-3.5 text-[#A4A4A2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#37352F] dark:text-slate-200 placeholder-[#A4A4A2] focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] px-3 py-1.5 rounded-lg text-xs">
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

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Skill</span>
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((s) => {
          const loggedHrs = skillHoursMap[s.id] || 0;
          const weeklyAvg = (loggedHrs / 4).toFixed(1);
          const targetPct = Math.min(100, Math.round((Number(weeklyAvg) / (s.targetWeeklyHours || 1)) * 100));

          return (
            <div
              key={s.id}
              className="p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#0066FF]/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: s.color || '#0066FF' }}
                    />
                    <h3 className="text-sm font-bold text-[#37352F] dark:text-white truncate">{s.name}</h3>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      className="text-[#787774] dark:text-slate-400 hover:text-[#0066FF] dark:hover:text-blue-400 p-1 rounded hover:bg-[#F7F7F5] dark:hover:bg-[#24262A] transition-colors"
                      title="Edit Skill Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteWithConfirm(s)}
                      className="text-[#787774] dark:text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-[#F7F7F5] dark:hover:bg-[#24262A] transition-colors"
                      title="Delete Skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-slate-300 border border-[#EBEBE9] dark:border-[#33353A]">
                    {s.category}
                  </span>
                  <span className="text-[11px] text-[#787774] dark:text-slate-400 font-medium flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#0066FF]" />
                    Target: <strong className="text-[#37352F] dark:text-slate-200">{s.targetWeeklyHours}h/wk</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#787774] dark:text-slate-400">30-Day Logged Investment</span>
                  <span className="font-mono font-bold text-[#0066FF] dark:text-blue-400">{loggedHrs} hrs</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#787774] dark:text-slate-400">Weekly Target Pace</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{targetPct}%</span>
                  </div>
                  <div className="w-full bg-[#F7F7F5] dark:bg-[#24262A] h-2 rounded-full overflow-hidden border border-[#EBEBE9] dark:border-[#33353A]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${targetPct}%`,
                        backgroundColor: s.color || '#0066FF',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding or Editing Skill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
              <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                {editingSkill ? 'Modify Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#787774] hover:text-[#37352F] dark:hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PyTorch, System Design, SQL"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF] cursor-pointer"
                >
                  <option value="Core Data Science">Core Data Science</option>
                  <option value="Technical / Dev">Technical / Dev</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Personal Development">Personal Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">
                  Target Weekly Hours ({formData.targetWeeklyHours}h/wk)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={formData.targetWeeklyHours}
                  onChange={(e) => setFormData({ ...formData, targetWeeklyHours: Number(e.target.value) })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs font-mono text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-2">Color Badge</label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        formData.color === c ? 'scale-110 border-[#37352F] dark:border-white shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
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
                  {editingSkill ? 'Save Changes' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

