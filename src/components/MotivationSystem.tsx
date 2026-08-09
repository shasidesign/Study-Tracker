import React, { useState, useEffect } from 'react';
import { Quote } from '../types/tracker';
import { QUOTES_DATABASE } from '../data/initialData';
import { Quote as QuoteIcon, Shuffle, Copy, Check, Filter, Sparkles, Heart, Volume2, Plus, Star, Search, MessageSquare, BookOpen } from 'lucide-react';

interface MotivationSystemProps {
  currentQuote: Quote;
}

export const MotivationSystem: React.FC<MotivationSystemProps> = ({ currentQuote }) => {
  const [quotesList, setQuotesList] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('ds_custom_quotes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...QUOTES_DATABASE, ...parsed];
      } catch (e) {
        return QUOTES_DATABASE;
      }
    }
    return QUOTES_DATABASE;
  });

  const [selectedQuote, setSelectedQuote] = useState<Quote>(currentQuote);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('ds_favorite_quotes');
    return saved ? JSON.parse(saved) : [1, 2, 5, 8];
  });

  const [reflectionNote, setReflectionNote] = useState<string>(() => {
    return localStorage.getItem('ds_today_quote_reflection') || '';
  });
  const [savedReflectionMsg, setSavedReflectionMsg] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuoteData, setNewQuoteData] = useState({
    quote: '',
    author: '',
    category: 'Consistency & Focus' as Quote['category'],
  });

  // Day of year calculation for automatic 365 day cycle
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const categories = [
    'ALL',
    'Favorites',
    'Data Science & Logic',
    'Consistency & Focus',
    'Mindset & Growth',
    'Success & Resilience',
  ];

  const filteredQuotes = quotesList.filter((q) => {
    let matchesCategory = true;
    if (filterCategory === 'Favorites') {
      matchesCategory = favorites.includes(q.id);
    } else if (filterCategory !== 'ALL') {
      matchesCategory = q.category === filterCategory;
    }

    const matchesSearch =
      q.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleShuffle = () => {
    if (filteredQuotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setSelectedQuote(filteredQuotes[randomIndex]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${selectedQuote.quote}" — ${selectedQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${selectedQuote.quote}. By ${selectedQuote.author}`);
    utterance.rate = 0.9;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: number[];
    if (favorites.includes(id)) {
      updated = favorites.filter((fId) => fId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('ds_favorite_quotes', JSON.stringify(updated));
  };

  const handleSaveReflection = () => {
    localStorage.setItem('ds_today_quote_reflection', reflectionNote);
    setSavedReflectionMsg(true);
    setTimeout(() => setSavedReflectionMsg(false), 2000);
  };

  const handleAddCustomQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteData.quote.trim() || !newQuoteData.author.trim()) return;

    const newId = Date.now();
    const customQuote: Quote = {
      id: newId,
      quote: newQuoteData.quote.trim(),
      author: newQuoteData.author.trim(),
      category: newQuoteData.category,
    };

    const updatedList = [customQuote, ...quotesList];
    setQuotesList(updatedList);

    // Save custom quotes separately
    const customOnly = updatedList.filter((q) => q.id > 1000);
    localStorage.setItem('ds_custom_quotes', JSON.stringify(customOnly));

    setSelectedQuote(customQuote);
    setNewQuoteData({
      quote: '',
      author: '',
      category: 'Consistency & Focus',
    });
    setIsAddModalOpen(false);
  };

  const isCurrentFavorite = favorites.includes(selectedQuote.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
              <QuoteIcon className="w-4 h-4 text-[#0066FF]" /> Daily Motivation & Mindset Engine ({quotesList.length}+ Quotes)
            </h2>
            <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
              Curated quote rotation (Day {dayOfYear} cycle) with text-to-speech audio, custom quotes, and favorite collections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> + Custom Quote
            </button>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7F7F5] dark:bg-[#24262A] hover:bg-[#EBEBE9] dark:hover:bg-[#33353A] text-[#37352F] dark:text-slate-200 border border-[#EBEBE9] dark:border-[#33353A] text-xs font-bold transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#0066FF]" /> Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Featured Quote Display Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-[#18191C] dark:to-slate-950 border border-[#0066FF]/20 shadow-md relative overflow-hidden text-center space-y-6">
        <div className="absolute top-4 left-4 text-[#0066FF]/10 dark:text-blue-500/10 pointer-events-none">
          <QuoteIcon className="w-32 h-32" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0066FF] dark:text-blue-400 bg-[#0066FF]/10 px-3 py-1 rounded-full border border-[#0066FF]/20">
            <Sparkles className="w-3.5 h-3.5" /> Quote #{selectedQuote.id} • {selectedQuote.category}
          </span>
          <button
            onClick={() => toggleFavorite(selectedQuote.id)}
            className={`p-1.5 rounded-full border transition-all cursor-pointer ${
              isCurrentFavorite
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-white dark:bg-[#24262A] border-[#EBEBE9] dark:border-[#33353A] text-[#A4A4A2] hover:text-amber-500'
            }`}
            title={isCurrentFavorite ? 'Starred Favorite' : 'Star this Quote'}
          >
            <Star className={`w-4 h-4 ${isCurrentFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        <blockquote className="text-xl sm:text-2xl font-extrabold text-[#37352F] dark:text-white tracking-tight leading-snug max-w-3xl mx-auto italic relative z-10">
          "{selectedQuote.quote}"
        </blockquote>

        <div className="text-sm font-semibold text-[#787774] dark:text-slate-300">— {selectedQuote.author}</div>

        <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
          {/* Audio TTS Button */}
          <button
            onClick={handleSpeech}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border shadow-xs transition-all cursor-pointer ${
              speaking
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-[#0066FF] hover:bg-blue-600 text-white border-[#0066FF]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{speaking ? 'Stop Speech' : 'Listen Quote (TTS)'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#24262A] hover:bg-[#F7F7F5] dark:hover:bg-[#2A2B2E] text-[#37352F] dark:text-slate-200 text-xs font-bold border border-[#EBEBE9] dark:border-[#33353A] shadow-xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Quote'}</span>
          </button>
        </div>
      </div>

      {/* Daily Reflection Journal Widget */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#37352F] dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0066FF]" /> Today's Mindset & Goal Reflection
          </h3>
          {savedReflectionMsg && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved to Local Storage
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Write your main takeaway or daily commitment from today's quote..."
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            className="flex-1 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-lg px-3 py-2 text-xs text-[#37352F] dark:text-slate-200 focus:outline-none focus:border-[#0066FF]"
          />
          <button
            onClick={handleSaveReflection}
            className="px-4 py-2 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
          >
            Save Reflection
          </button>
        </div>
      </div>

      {/* Quote Library */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0066FF]" />
            <h3 className="text-base font-bold text-[#37352F] dark:text-white">Motivational Library</h3>
            <span className="text-xs text-[#787774] dark:text-slate-400">({filteredQuotes.length} Quotes)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-48">
              <Search className="w-3.5 h-3.5 text-[#A4A4A2] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#37352F] dark:text-slate-200 placeholder-[#A4A4A2] focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] px-3 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-[#A4A4A2]" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent text-[#37352F] dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-[#24262A]">
                    {c === 'Favorites' ? `★ Favorites (${favorites.length})` : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
          {filteredQuotes.map((q) => {
            const isFav = favorites.includes(q.id);
            const isSelected = selectedQuote.id === q.id;

            return (
              <div
                key={q.id}
                onClick={() => setSelectedQuote(q)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative group ${
                  isSelected
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-[#0066FF] shadow-xs'
                    : 'bg-[#F7F7F5] dark:bg-[#24262A] border-[#EBEBE9] dark:border-[#33353A] hover:border-[#0066FF]/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs text-[#37352F] dark:text-slate-200 font-medium italic leading-relaxed">
                    "{q.quote}"
                  </p>
                  <button
                    onClick={(e) => toggleFavorite(q.id, e)}
                    className={`p-1 rounded transition-colors ${
                      isFav ? 'text-amber-500' : 'text-[#A4A4A2] hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#787774] dark:text-slate-400 pt-1 border-t border-[#EBEBE9]/60 dark:border-[#33353A]/60">
                  <span>— {q.author}</span>
                  <span className="text-[10px] text-[#0066FF] dark:text-blue-400 font-semibold">{q.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Quote Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
              <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                Add Custom Quote
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#787774] hover:text-[#37352F] dark:hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomQuote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Quote Statement</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Focus on process over outcome, and the result takes care of itself."
                  value={newQuoteData.quote}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, quote: e.target.value })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md p-2.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Author / Source</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Aurelius, Self, Proverb"
                  value={newQuoteData.author}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, author: e.target.value })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#37352F] dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newQuoteData.category}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, category: e.target.value as any })}
                  className="w-full bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] rounded-md px-2.5 py-1.5 text-xs text-[#37352F] dark:text-slate-100 focus:outline-none focus:border-[#0066FF] cursor-pointer"
                >
                  <option value="Consistency & Focus">Consistency & Focus</option>
                  <option value="Data Science & Logic">Data Science & Logic</option>
                  <option value="Mindset & Growth">Mindset & Growth</option>
                  <option value="Success & Resilience">Success & Resilience</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-[#F7F7F5] dark:bg-[#24262A] text-[#37352F] dark:text-slate-300 border border-[#EBEBE9] dark:border-[#33353A] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#0066FF] text-white font-semibold shadow-xs hover:bg-blue-600 cursor-pointer"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

