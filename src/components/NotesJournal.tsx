import React, { useState } from 'react';
import { NoteItem, NoteCategory } from '../types/tracker';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Tag,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Filter,
  Clock,
  BookOpen,
  Bookmark
} from 'lucide-react';

interface NotesJournalProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesJournal: React.FC<NotesJournalProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Quick Remarks State
  const [quickRemark, setQuickRemark] = useState('');
  const [quickRemarkTitle, setQuickRemarkTitle] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    remarks: '',
    category: 'Study Notes' as NoteCategory,
    tagsInput: '',
    isPinned: false,
    color: 'indigo',
  });

  const categories: NoteCategory[] = [
    'General',
    'Study Notes',
    'Self Remarks',
    'Key Takeaway',
    'Idea & Brainstorm',
    'Weekly Review',
    'Personal Reflection',
  ];

  const handleOpenAddModal = () => {
    setEditingNoteId(null);
    setFormData({
      title: '',
      content: '',
      remarks: '',
      category: 'Study Notes',
      tagsInput: '',
      isPinned: false,
      color: 'indigo',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setFormData({
      title: note.title,
      content: note.content,
      remarks: note.remarks || '',
      category: note.category,
      tagsInput: note.tags ? note.tags.join(', ') : '',
      isPinned: note.isPinned,
      color: note.color || 'indigo',
    });
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const tagsArray = formData.tagsInput
      ? formData.tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const noteToSave: NoteItem = {
      id: editingNoteId || `note-${Date.now()}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      remarks: formData.remarks.trim(),
      category: formData.category,
      tags: tagsArray,
      isPinned: formData.isPinned,
      createdAt: editingNoteId ? (notes.find((n) => n.id === editingNoteId)?.createdAt || now) : now,
      updatedAt: now,
      color: formData.color,
    };

    if (editingNoteId) {
      onUpdateNote(noteToSave);
    } else {
      onAddNote(noteToSave);
    }

    setIsModalOpen(false);
  };

  const handleAddQuickRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRemark.trim()) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const title = quickRemarkTitle.trim() || `Self Remark - ${new Date().toLocaleDateString()}`;

    const newNote: NoteItem = {
      id: `remark-${Date.now()}`,
      title,
      content: quickRemark.trim(),
      remarks: `Self-Evaluation: ${quickRemark.trim()}`,
      category: 'Self Remarks',
      tags: ['Self Remark', 'Daily Reflection'],
      isPinned: false,
      createdAt: now,
      updatedAt: now,
      color: 'amber',
    };

    onAddNote(newNote);
    setQuickRemark('');
    setQuickRemarkTitle('');
  };

  const handleTogglePin = (note: NoteItem) => {
    onUpdateNote({ ...note, isPinned: !note.isPinned });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.remarks && n.remarks.toLowerCase().includes(searchTerm.toLowerCase())) ||
      n.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || n.category === selectedCategory;
    const matchesPinned = !showPinnedOnly || n.isPinned;

    return matchesSearch && matchesCategory && matchesPinned;
  });

  // Sort pinned first, then by date descending
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-[#18191C] p-6 rounded-2xl border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#37352F] dark:text-white flex items-center gap-2">
              Notes & Self-Tracking Journal
            </h2>
            <p className="text-xs text-[#787774] dark:text-slate-400">
              Create, organize, modify, and review personal study notes, self-remarks, and daily reflections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleOpenAddModal}
            className="flex-1 lg:flex-none px-4 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </button>
        </div>
      </div>

      {/* Quick Add Self-Remark Panel */}
      <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>Quick Self-Remark & Daily Evaluation</span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-500">
            Add a quick remark to track yourself without opening full form
          </span>
        </div>

        <form onSubmit={handleAddQuickRemark} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Title (Optional, e.g. Chapter 4 Reflection)"
              value={quickRemarkTitle}
              onChange={(e) => setQuickRemarkTitle(e.target.value)}
              className="sm:col-span-1 px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-[#1C1E22] text-[#37352F] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              required
              placeholder="Type your self-remark / daily observation here (e.g. Need to revise SQL Window Functions tomorrow)..."
              value={quickRemark}
              onChange={(e) => setQuickRemark(e.target.value)}
              className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-[#1C1E22] text-[#37352F] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Remark</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-[#18191C] rounded-2xl border border-[#EBEBE9] dark:border-[#2A2B2E] space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#787774] dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search notes by title, content, remarks, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-xl text-xs text-[#37352F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#787774]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-xl text-xs text-[#37352F] dark:text-white focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Pinned Toggle */}
            <button
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showPinnedOnly
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                  : 'bg-[#F7F7F5] dark:bg-[#24262A] text-[#787774] dark:text-slate-400 border-[#EBEBE9] dark:border-[#33353A]'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
              <span>Pinned Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#18191C] rounded-2xl border border-[#EBEBE9] dark:border-[#2A2B2E]">
          <FileText className="w-12 h-12 text-[#787774] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[#37352F] dark:text-white">No Notes Found</h3>
          <p className="text-xs text-[#787774] dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No notes match your current search terms or filters. Try clearing your filters or create a new note!
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 bg-[#0066FF] text-white text-xs font-semibold rounded-xl"
          >
            Create First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => {
            const isPinned = note.isPinned;
            return (
              <div
                key={note.id}
                className={`flex flex-col justify-between p-5 rounded-2xl border transition-all hover:shadow-md ${
                  isPinned
                    ? 'bg-indigo-500/5 dark:bg-indigo-950/20 border-indigo-500/30 dark:border-indigo-800/40'
                    : 'bg-white dark:bg-[#18191C] border-[#EBEBE9] dark:border-[#2A2B2E]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Category & Pin / Action Controls */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-[#37352F] dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {note.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePin(note)}
                        title={note.isPinned ? 'Unpin Note' : 'Pin Note to Top'}
                        className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          note.isPinned
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                            : 'text-[#787774] hover:text-[#37352F] dark:hover:text-white'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(note)}
                        title="Edit Note"
                        className="p-1.5 text-[#787774] hover:text-[#0066FF] rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        title="Delete Note"
                        className="p-1.5 text-[#787774] hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Body Content */}
                  <div>
                    <h3 className="text-sm font-bold text-[#37352F] dark:text-white flex items-center gap-1.5">
                      {note.title}
                    </h3>
                    <p className="text-xs text-[#787774] dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>

                  {/* Remarks Box (if provided) */}
                  {note.remarks && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-700 dark:text-amber-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Self Remark / Action Point</span>
                      </div>
                      <p className="leading-snug">{note.remarks}</p>
                    </div>
                  )}

                  {/* Tag Chips */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Timestamp & Copy */}
                <div className="pt-4 mt-3 border-t border-[#EBEBE9] dark:border-[#2A2B2E] flex items-center justify-between text-[11px] text-[#787774] dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {note.updatedAt}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Note: ${note.title}\n\n${note.content}${note.remarks ? `\n\nRemarks: ${note.remarks}` : ''}`,
                        note.id
                      )
                    }
                    className="flex items-center gap-1 text-[#787774] hover:text-[#0066FF] cursor-pointer"
                    title="Copy Note Content"
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === note.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating / Editing Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
              <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0066FF]" />
                {editingNoteId ? 'Edit Note' : 'Create New Note'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#787774] hover:text-[#37352F] dark:hover:text-white font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#37352F] dark:text-slate-300 font-semibold mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Science Interview Prep & SQL Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBEBE9] dark:border-[#33353A] bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#37352F] dark:text-slate-300 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as NoteCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EBEBE9] dark:border-[#33353A] bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#37352F] dark:text-slate-300 font-semibold mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SQL, ML, Exam, Focus"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EBEBE9] dark:border-[#33353A] bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#37352F] dark:text-slate-300 font-semibold mb-1">
                  Note Content & Main Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your study notes, insights, key formulas, or reflections here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBEBE9] dark:border-[#33353A] bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 space-y-1">
                <label className="block text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Self-Tracking Remarks & Action Points (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Self-Remark: Review this topic on Saturday before practice test..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-[#1C1E22] text-[#37352F] dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0066FF] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isPinned" className="text-[#37352F] dark:text-slate-300 font-semibold cursor-pointer">
                  Pin this note to top of list
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#37352F] dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-semibold cursor-pointer"
                >
                  {editingNoteId ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
