import React, { useState } from 'react';
import { DailyLog, Skill, Goal } from '../types/tracker';
import { FORMULA_GUIDE } from '../data/initialData';
import { generateAIExecutiveSummary } from '../services/gemini';
import { exportAllDataToExcel } from '../utils/excelExporter';
import {
  FileSpreadsheet,
  Sparkles,
  Copy,
  Check,
  Brain,
  TrendingUp,
  Download,
  Terminal,
  HelpCircle,
  Lightbulb,
  FileCode
} from 'lucide-react';

interface ExecutiveReportProps {
  logs: DailyLog[];
  skills: Skill[];
  goals: Goal[];
  totalHours: number;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({
  logs,
  skills,
  goals,
  totalHours,
}) => {
  const [reportType, setReportType] = useState<'Weekly' | 'Monthly' | 'Quarterly'>('Monthly');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Filter logs based on report timeframe
  const now = new Date();
  const daysLimit = reportType === 'Weekly' ? 7 : reportType === 'Monthly' ? 30 : 90;

  const filteredLogs = logs.filter((l) => {
    const diffDays = (now.getTime() - new Date(l.date).getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays < daysLimit;
  });

  const periodHours = Number(filteredLogs.reduce((sum, l) => sum + l.totalHours, 0).toFixed(1));
  const completedGoals = goals.filter((g) => g.status === 'Completed').length;
  const goalRate = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;

  // Skill breakdown for period
  const skillTotals: Record<string, number> = {};
  skills.forEach((s) => (skillTotals[s.id] = 0));

  filteredLogs.forEach((l) => {
    Object.entries(l.skillsHours).forEach(([sId, hrs]) => {
      skillTotals[sId] = Number(((skillTotals[sId] || 0) + hrs).toFixed(1));
    });
  });

  const sortedSkills = skills
    .map((s) => ({
      name: s.name,
      hours: skillTotals[s.id] || 0,
    }))
    .sort((a, b) => b.hours - a.hours);

  const topSkill = sortedSkills[0]?.name || 'Python';
  const weakSkill = sortedSkills[sortedSkills.length - 1]?.name || 'DSA';

  const handleGenerateAI = async () => {
    setLoadingAi(true);
    const summary = await generateAIExecutiveSummary(logs, skills, goals);
    setAiReport(summary);
    setLoadingAi(false);
  };

  const handleCopyText = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(title);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#37352F] dark:text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#0066FF]" /> Executive Report & Automation Blueprint
            </h2>
            <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
              AI-generated study counsel, strategic performance summary, and exact Excel/Google Sheets formula logic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Period Selector */}
            <div className="flex bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] p-1 rounded-lg text-xs font-semibold">
              {(['Weekly', 'Monthly', 'Quarterly'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    reportType === type
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'text-[#787774] dark:text-slate-400 hover:text-[#37352F] dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Export Full Excel Workbook */}
            <button
              onClick={() => exportAllDataToExcel({ logs, skills, goals, reminders: [] })}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Excel (.xlsx)</span>
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={handleGenerateAI}
              disabled={loadingAi}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingAi ? 'Analyzing Data...' : 'AI Executive Counsel'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Report Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-3">
          <h3 className="text-base font-bold text-[#37352F] dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {reportType} Executive Performance Report
          </h3>
          <span className="text-xs text-[#0066FF] dark:text-blue-400 font-mono font-semibold">
            {daysLimit} Days Evaluated • {periodHours} Hours Total
          </span>
        </div>

        {/* High-level Summary Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <span className="text-[10px] font-bold text-[#787774] dark:text-slate-400 uppercase">Primary Technical Focus</span>
            <div className="text-base font-bold text-[#0066FF] dark:text-blue-400">{topSkill}</div>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Invested {sortedSkills[0]?.hours || 0} hrs in this period</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <span className="text-[10px] font-bold text-[#787774] dark:text-slate-400 uppercase">Focus Deficit Area</span>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400">{weakSkill}</div>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">Needs additional time block allocation</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-1">
            <span className="text-[10px] font-bold text-[#787774] dark:text-slate-400 uppercase">Goal Completion Index</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{goalRate}% Completed</div>
            <p className="text-[11px] text-[#787774] dark:text-slate-400">{completedGoals} of {goals.length} target goals achieved</p>
          </div>
        </div>

        {/* AI Executive Summary Output */}
        {aiReport && (
          <div className="p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-[#0066FF]/20 text-xs text-[#37352F] dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#0066FF] dark:text-blue-400 text-sm mb-2">
              <Sparkles className="w-4 h-4" /> AI Strategic Insights & Career Recommendation
            </div>
            {aiReport}
          </div>
        )}
      </div>

      {/* Excel / Google Sheets Automation Formula Blueprint */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#37352F] dark:text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#0066FF]" /> Excel & Google Sheets Automation Blueprint
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0066FF]/10 text-[#0066FF] dark:text-blue-400 border border-[#0066FF]/20">
              COPYABLE FORMULAS
            </span>
          </div>
          <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">
            Use these exact Excel / Google Sheets formulas to replicate this modern dashboard directly in your spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORMULA_GUIDE.map((fg) => (
            <div key={fg.title} className="p-4 rounded-xl bg-[#F7F7F5] dark:bg-[#24262A] border border-[#EBEBE9] dark:border-[#33353A] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-[#37352F] dark:text-white">{fg.title}</h4>
                  <p className="text-xs text-[#787774] dark:text-slate-400 mt-0.5">{fg.description}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-[#18191C] text-[#0066FF] dark:text-blue-400 border border-[#EBEBE9] dark:border-[#33353A]">
                  {fg.category}
                </span>
              </div>

              {/* Formula Code Blocks */}
              <div className="space-y-2 text-xs">
                {/* Excel Formula */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#787774] dark:text-slate-400 mb-1">
                    <span>EXCEL FORMULA:</span>
                    <button
                      onClick={() => handleCopyText(fg.excelFormula, fg.title + '_excel')}
                      className="text-[#0066FF] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormula === fg.title + '_excel' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-white dark:bg-[#18191C] text-[#0066FF] dark:text-blue-400 font-mono text-[11px] overflow-x-auto border border-[#EBEBE9] dark:border-[#33353A]">
                    {fg.excelFormula}
                  </pre>
                </div>

                {/* Google Sheets Formula */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#787774] dark:text-slate-400 mb-1">
                    <span>GOOGLE SHEETS FORMULA:</span>
                    <button
                      onClick={() => handleCopyText(fg.googleSheetsFormula, fg.title + '_gs')}
                      className="text-[#0066FF] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormula === fg.title + '_gs' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-white dark:bg-[#18191C] text-emerald-600 dark:text-emerald-400 font-mono text-[11px] overflow-x-auto border border-[#EBEBE9] dark:border-[#33353A]">
                    {fg.googleSheetsFormula}
                  </pre>
                </div>
              </div>

              <div className="text-[11px] text-[#787774] dark:text-slate-400 pt-2 border-t border-[#EBEBE9] dark:border-[#33353A] italic">
                <strong>Logic:</strong> {fg.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
