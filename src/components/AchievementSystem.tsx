import React from 'react';
import { AchievementBadge } from '../types/tracker';
import { Award, ShieldAlert, Crown, Flame, Zap, Cpu, Layers, Target, CheckCircle2, Lock } from 'lucide-react';

interface AchievementSystemProps {
  badges: AchievementBadge[];
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  badges,
  totalHours,
  currentStreak,
  longestStreak,
}) => {
  // Dynamically update unlock progress for milestone badges
  const updatedBadges = badges.map((b) => {
    let progress = b.progress;
    let unlocked = b.unlocked;

    if (b.id === 'badge-100h') {
      progress = Math.min(100, Math.round((totalHours / 100) * 100));
      if (progress >= 100) unlocked = true;
    } else if (b.id === 'badge-500h') {
      progress = Math.min(100, Math.round((totalHours / 500) * 100));
      if (progress >= 100) unlocked = true;
    } else if (b.id === 'badge-1000h') {
      progress = Math.min(100, Math.round((totalHours / 1000) * 100));
      if (progress >= 100) unlocked = true;
    } else if (b.id === 'badge-streak7') {
      progress = Math.min(100, Math.round((longestStreak / 7) * 100));
      if (progress >= 100) unlocked = true;
    } else if (b.id === 'badge-streak30') {
      progress = Math.min(100, Math.round((longestStreak / 30) * 100));
      if (progress >= 100) unlocked = true;
    }

    return { ...b, progress, unlocked };
  });

  const iconMap: Record<string, React.ReactNode> = {
    Award: <Award className="w-6 h-6" />,
    ShieldAlert: <ShieldAlert className="w-6 h-6" />,
    Crown: <Crown className="w-6 h-6" />,
    Flame: <Flame className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    Cpu: <Cpu className="w-6 h-6" />,
    Layers: <Layers className="w-6 h-6" />,
    Target: <Target className="w-6 h-6" />,
  };

  const unlockedCount = updatedBadges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0066FF]" /> Achievement & Gamification Engine
            </h2>
            <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
              Automated badge unlocks for 100/500/1000 study hours, unbroken streaks, and skill mastery.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 px-3.5 py-1.5 rounded-lg border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> {unlockedCount} / {badges.length} Badges Unlocked
          </div>
        </div>
      </div>

      {/* Gamification Level Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 dark:from-[#18191C] dark:via-slate-900 dark:to-slate-800 border border-[#0066FF]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold text-[#0066FF] dark:text-blue-400 uppercase tracking-wider">Scholar Rank</span>
          <h3 className="text-2xl font-black text-[#37352F] dark:text-white">
            Level {Math.floor(totalHours / 25) + 1} Data Science Scholar
          </h3>
          <p className="text-xs text-[#787774] dark:text-slate-300">
            Total Logged Investment: <strong className="text-[#37352F] dark:text-white">{totalHours} Study Hours</strong> across technical & personal goals.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2 bg-white dark:bg-slate-950/50 p-4 rounded-xl border border-[#EBEBE9] dark:border-slate-800 shadow-xs">
          <div className="flex justify-between text-xs font-bold text-[#37352F] dark:text-slate-300">
            <span>Next Level</span>
            <span>{(totalHours % 25).toFixed(1)} / 25 hrs</span>
          </div>
          <div className="w-full bg-[#EBEBE9] dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0066FF] to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(((totalHours % 25) / 25) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {updatedBadges.map((badge) => (
          <div
            key={badge.id}
            className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
              badge.unlocked
                ? 'bg-white dark:bg-[#18191C] border-[#0066FF]/30 shadow-xs'
                : 'bg-[#F7F7F5] dark:bg-[#24262A]/50 border-[#EBEBE9] dark:border-[#2A2B2E] opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-xl border ${
                    badge.unlocked
                      ? 'bg-[#0066FF]/10 text-[#0066FF] dark:text-blue-400 border-[#0066FF]/20'
                      : 'bg-[#EBEBE9] dark:bg-slate-800 text-[#787774] border-[#EBEBE9] dark:border-slate-700'
                  }`}
                >
                  {iconMap[badge.icon] || <Award className="w-6 h-6" />}
                </div>

                {badge.unlocked ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    UNLOCKED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EBEBE9] dark:bg-slate-800 text-[#787774] dark:text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> LOCKED
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-[#37352F] dark:text-white">{badge.title}</h4>
                <p className="text-xs text-[#787774] dark:text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#787774] dark:text-slate-400">Progress</span>
                <span className={badge.unlocked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#0066FF] dark:text-blue-400 font-bold'}>
                  {badge.progress}%
                </span>
              </div>
              <div className="w-full bg-[#EBEBE9] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    badge.unlocked ? 'bg-emerald-500' : 'bg-[#0066FF]'
                  }`}
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
