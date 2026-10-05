import React from 'react';
import { 
  Building2, 
  FileText, 
  Compass, 
  FolderArchive, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'applications' | 'apply' | 'finder' | 'vault' | 'officer';
  onSelectTab: (tab: 'applications' | 'apply' | 'finder' | 'vault' | 'officer') => void;
  userRole: 'entrepreneur' | 'officer';
  onToggleRole: () => void;
  onResetData: () => void;
  selectedAgencyForOfficer?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onToggleRole,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab('applications')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans block leading-none">
                  Permit Genie
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('applications')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'applications'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              My Filings
            </button>

            <button
              onClick={() => onSelectTab('apply')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'apply'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Apply
            </button>

            <button
              onClick={() => onSelectTab('finder')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'finder'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Permit Discovery
            </button>

            <button
              onClick={() => onSelectTab('vault')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'vault'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Document Vault
            </button>

            <button
              onClick={() => onSelectTab('officer')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'officer'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Agency Reviewer Desk</span>
            </button>
          </nav>

          {/* Zone 3: Primary actions & Role toggle */}
          <div className="flex items-center gap-2.5">
            {/* Role Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (userRole !== 'entrepreneur') onToggleRole();
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  userRole === 'entrepreneur'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Entrepreneur
              </button>
              <button
                type="button"
                onClick={() => {
                  if (userRole !== 'officer') onToggleRole();
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                  userRole === 'officer'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>City Officer</span>
              </button>
            </div>

            <button
              onClick={onResetData}
              title="Reset to default demo data"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('apply')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs whitespace-nowrap"
            >
              <span>+ New Master Filing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-3 text-xs overflow-x-auto">
        <button
          onClick={() => onSelectTab('applications')}
          className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'applications' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          My Filings
        </button>
        <button
          onClick={() => onSelectTab('apply')}
          className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'apply' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Apply
        </button>
        <button
          onClick={() => onSelectTab('finder')}
          className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'finder' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Discovery
        </button>
        <button
          onClick={() => onSelectTab('vault')}
          className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'vault' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Vault
        </button>
        <button
          onClick={() => onSelectTab('officer')}
          className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'officer' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          Officer Desk
        </button>
      </div>
    </header>
  );
};
