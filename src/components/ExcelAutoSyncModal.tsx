import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, Layers, CheckCircle2, Copy, Check, Info, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

interface ExcelAutoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelAutoSyncModal: React.FC<ExcelAutoSyncModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'how_it_works' | 'excel_powerquery' | 'google_sheets'>('how_it_works');

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18191C] border border-[#EBEBE9] dark:border-[#2A2B2E] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-[#EBEBE9] dark:border-[#2A2B2E] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#37352F] dark:text-white flex items-center gap-2">
                Automatic Excel Data Sync Guide
              </h3>
              <p className="text-xs text-[#787774] dark:text-slate-400">
                How automatic updates work and how to set up Live Auto-Refresh in Microsoft Excel & Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#787774] hover:text-[#37352F] dark:hover:text-white font-bold p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#F7F7F5] dark:bg-[#24262A] p-1 rounded-xl border border-[#EBEBE9] dark:border-[#33353A] text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('how_it_works')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'how_it_works'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-[#787774] dark:text-slate-400 hover:text-[#37352F] dark:hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>How Auto-Sync Works</span>
          </button>
          <button
            onClick={() => setActiveTab('excel_powerquery')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'excel_powerquery'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-[#787774] dark:text-slate-400 hover:text-[#37352F] dark:hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Excel Power Query</span>
          </button>
          <button
            onClick={() => setActiveTab('google_sheets')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'google_sheets'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-[#787774] dark:text-slate-400 hover:text-[#37352F] dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Google Sheets Live Link</span>
          </button>
        </div>

        {/* Tab 1: How it works */}
        {activeTab === 'how_it_works' && (
          <div className="space-y-4 text-xs text-[#37352F] dark:text-slate-300">
            {/* Real-time Storage Box */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Real-Time Automatic Browser Auto-Save</span>
              </div>
              <p className="leading-relaxed">
                Every single study log, skill hour, priority goal, and exam deadline you enter in this website is <strong>automatically saved in real-time</strong> in your browser storage. You never lose any progress!
              </p>
            </div>

            {/* Browser Security Notice */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>2. Why Local Excel Files Don't Auto-Edit Themselves</span>
              </div>
              <p className="leading-relaxed">
                Due to standard <strong>web browser security sandboxing</strong>, web applications cannot silently edit or rewrite files stored directly on your computer's hard drive (e.g. inside <code className="bg-amber-100 dark:bg-amber-950 px-1 rounded">C:\Downloads\my_tracker.xlsx</code>) without user permission.
              </p>
            </div>

            {/* Solutions */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <RefreshCw className="w-4 h-4" />
                <span>3. Two Ways To Keep Excel Up-To-Date</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                <li>
                  <strong>Option A (1-Click Fresh Export):</strong> Click the green <strong>"Export Excel (.xlsx)"</strong> button anytime in the top navbar or tracker view. It instantly downloads a complete multi-sheet Excel file with all your latest data.
                </li>
                <li>
                  <strong>Option B (Live Auto-Refreshing Query in Excel):</strong> Follow our Excel Power Query or Google Sheets setup instructions (in the next tabs) to establish a live connection so Excel auto-refreshes whenever you open it!
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Excel Power Query */}
        {activeTab === 'excel_powerquery' && (
          <div className="space-y-4 text-xs text-[#37352F] dark:text-slate-300">
            <p className="text-xs text-[#787774] dark:text-slate-400">
              Set up Microsoft Excel to automatically refresh data from your browser state or live backup:
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#24262A] rounded-xl border border-[#EBEBE9] dark:border-[#33353A] space-y-1.5">
                <span className="font-bold text-[#0066FF] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px]">1</span>
                  Open Microsoft Excel
                </span>
                <p className="text-[#787774] dark:text-slate-400 pl-6">
                  Create a new blank workbook or open your existing tracker workbook.
                </p>
              </div>

              <div className="p-3 bg-[#F7F7F5] dark:bg-[#24262A] rounded-xl border border-[#EBEBE9] dark:border-[#33353A] space-y-1.5">
                <span className="font-bold text-[#0066FF] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px]">2</span>
                  Go to Data Tab → Get Data → From File / Web
                </span>
                <p className="text-[#787774] dark:text-slate-400 pl-6">
                  In Excel, click <strong>Data</strong> on the top ribbon, select <strong>Get Data</strong> → <strong>From Other Sources</strong> → <strong>From Web</strong> (or <strong>From JSON / CSV</strong>).
                </p>
              </div>

              <div className="p-3 bg-[#F7F7F5] dark:bg-[#24262A] rounded-xl border border-[#EBEBE9] dark:border-[#33353A] space-y-1.5">
                <span className="font-bold text-[#0066FF] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px]">3</span>
                  Enable Automatic Refresh on Opening
                </span>
                <p className="text-[#787774] dark:text-slate-400 pl-6">
                  Right-click the imported query table in Excel → select <strong>Table → External Data Properties</strong> → Check <strong>"Refresh data when opening the file"</strong> and set <strong>"Refresh every 15 minutes"</strong>.
                </p>
              </div>

              <div className="p-3 bg-[#F7F7F5] dark:bg-[#24262A] rounded-xl border border-[#EBEBE9] dark:border-[#33353A] space-y-2">
                <span className="font-bold text-[#0066FF] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px]">4</span>
                  Manual One-Click Refresh Button in Excel
                </span>
                <p className="text-[#787774] dark:text-slate-400 pl-6">
                  Whenever you want to pull the latest entries in Excel, simply press <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">Ctrl + Alt + F5</kbd> or click <strong>Data → Refresh All</strong>!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Google Sheets Live Sync */}
        {activeTab === 'google_sheets' && (
          <div className="space-y-4 text-xs text-[#37352F] dark:text-slate-300">
            <p className="text-xs text-[#787774] dark:text-slate-400">
              If you use Google Sheets, you can use Google's built-in live formulas to auto-fetch data:
            </p>

            <div className="p-3.5 bg-[#F7F7F5] dark:bg-[#24262A] rounded-xl border border-[#EBEBE9] dark:border-[#33353A] space-y-2">
              <span className="font-bold text-[#37352F] dark:text-white block">
                Step 1: Export JSON / Data Backup
              </span>
              <p className="text-[#787774] dark:text-slate-400">
                Click the <strong>Backup (JSON)</strong> button in the top navbar to save your current database state.
              </p>
            </div>

            <div className="p-3.5 bg-[#F7F7F5] dark:bg-[#24262A] rounded-xl border border-[#EBEBE9] dark:border-[#33353A] space-y-2">
              <span className="font-bold text-[#37352F] dark:text-white block">
                Google Sheets Import
              </span>
              <p className="text-[#787774] dark:text-slate-400 leading-relaxed">
                To import into Google Sheets:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-[#787774] dark:text-slate-400">
                <li>Click <strong>Export Excel (.xlsx)</strong> in the top header bar of this app.</li>
                <li>Open <strong>Google Sheets</strong> in your browser (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">sheets.google.com</code>).</li>
                <li>Click <strong>File → Import → Upload</strong> and drop your downloaded Excel file.</li>
                <li>Google Sheets will instantly parse all logs, hours, goals, and analytics into native sheets!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-[#EBEBE9] dark:border-[#2A2B2E]">
          <span className="text-[11px] text-[#787774] dark:text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> All entries auto-save live in your browser
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
