import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Calendar, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingDown,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { PermitApplication, AgencyType, ClearanceStatus } from '../types/permit';
import { AGENCY_METADATA } from '../utils/agencyConstants';

interface ApplicationTrackerProps {
  applications: PermitApplication[];
  onSelectApplication: (app: PermitApplication) => void;
  onOpenApply: () => void;
  onOpenCertificate: (app: PermitApplication) => void;
  onOpenQueryResolve: (app: PermitApplication) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onSelectApplication,
  onOpenApply,
  onOpenCertificate,
  onOpenQueryResolve,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'QUERIES_PENDING' | 'APPROVED'>('ALL');

  // Metrics
  const totalApps = applications.length;
  const inProgressCount = applications.filter(a => a.status === 'IN_PROGRESS').length;
  const queriesPendingCount = applications.filter(a => a.status === 'QUERIES_PENDING').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;

  const totalClearancesAcrossApps = applications.reduce((acc, app) => acc + app.agencyClearances.length, 0);
  const totalApprovedClearances = applications.reduce((acc, app) => {
    return acc + app.agencyClearances.filter(c => c.status === 'APPROVED').length;
  }, 0);

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: PermitApplication['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Clearances Completed
          </span>
        );
      case 'QUERIES_PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" />
            Action Required
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            Under Multi-Agency Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
            Draft
          </span>
        );
    }
  };

  const renderAgencyPill = (agencyType: AgencyType, status: ClearanceStatus) => {
    const meta = AGENCY_METADATA[agencyType];
    let statusStyle = 'text-slate-600 bg-slate-50 border-slate-200';
    let icon = <Clock className="w-3 h-3 text-slate-400" />;

    if (status === 'APPROVED') {
      statusStyle = 'text-emerald-800 bg-emerald-50/70 border-emerald-200';
      icon = <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
    } else if (status === 'ACTION_REQUIRED') {
      statusStyle = 'text-amber-800 bg-amber-50/80 border-amber-300 font-semibold';
      icon = <AlertCircle className="w-3 h-3 text-amber-600" />;
    } else if (status === 'INSPECTION_SCHEDULED') {
      statusStyle = 'text-purple-800 bg-purple-50/80 border-purple-200';
      icon = <Calendar className="w-3 h-3 text-purple-600" />;
    } else if (status === 'UNDER_REVIEW') {
      statusStyle = 'text-blue-800 bg-blue-50/70 border-blue-200';
      icon = <Clock className="w-3 h-3 text-blue-600 animate-pulse" />;
    }

    return (
      <div 
        key={agencyType}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium ${statusStyle}`}
        title={`${meta.name}: ${status.replace('_', ' ')}`}
      >
        {icon}
        <span className="font-mono text-[11px]">{meta.code}</span>
        <span className="hidden sm:inline text-[11px] font-sans">
          {meta.shortName.split(' ')[0]}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-12">
          <Building2 className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Single-Window Clearance Engine</span>
            <span aria-hidden="true">·</span>
            <span>Concurrent Inter-Agency Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 font-sans">
            Unified Government Approvals Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Permit Genie synchronizes approvals across City Planning, Buildings, Fire, Public Health, and Environmental Agencies simultaneously—eliminating serial bureaucratic backlogs.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-slate-200">
          <div>
            <div className="text-xs text-slate-400 font-medium">Clearances Granted</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {totalApprovedClearances} <span className="text-sm font-normal text-slate-400">/ {totalClearancesAcrossApps}</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span>{Math.round((totalApprovedClearances / totalClearancesAcrossApps) * 100)}% overall completion</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Avg. Clearance Speed</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              18.4 <span className="text-sm font-normal text-slate-400">Days</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingDown className="w-3 h-3" />
              <span>64% faster than legacy serial review</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Action Required</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {queriesPendingCount}
            </div>
            <div className="text-[11px] text-amber-300 mt-0.5">
              {queriesPendingCount > 0 ? 'Applicant clarification needed' : 'All dossiers clear'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Statutory SLA Compliance</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              100%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Under City Fast-Track Act
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by business, filing ID, or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Filings ({totalApps})
          </button>
          <button
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'IN_PROGRESS'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('QUERIES_PENDING')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'QUERIES_PENDING'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Needed ({queriesPendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'APPROVED'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">No applications match your criteria</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              Try adjusting your search terms or filter settings, or start a new single-window filing.
            </p>
            <button
              onClick={onOpenApply}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start New Permit Application
            </button>
          </div>
        ) : (
          filteredApps.map((app) => {
            const approvedClearances = app.agencyClearances.filter(c => c.status === 'APPROVED').length;
            const totalClearances = app.agencyClearances.length;
            const progressPct = Math.round((approvedClearances / totalClearances) * 100);
            const openQueries = app.agencyClearances.flatMap(c => c.queries.filter(q => q.status === 'OPEN'));
            const scheduledInspection = app.agencyClearances.find(c => c.status === 'INSPECTION_SCHEDULED');

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs hover:shadow-xs overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-mono">
                        <span className="font-semibold text-slate-900">{app.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>Filed {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans capitalize">{app.entityType}</span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {app.tradeName || app.businessName}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{app.location.address}, {app.location.city}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 font-medium">{app.location.zoneDesignation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>

                  {/* Multi-Agency Status Ribbon */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                      <span>Inter-Agency Clearances Matrix</span>
                      <span className="font-mono tabular-nums text-slate-700">
                        {approvedClearances} of {totalClearances} Approved ({progressPct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          app.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Agency Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {app.agencyClearances.map(c => renderAgencyPill(c.agencyType, c.status))}
                    </div>
                  </div>

                  {/* Context Callout: Inspection or Open Query */}
                  {openQueries.length > 0 && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-amber-900 block">
                            Agency Clarification Required ({openQueries.length})
                          </span>
                          <span className="text-amber-800 line-clamp-1">
                            {openQueries[0].officerName}: "{openQueries[0].queryText}"
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenQueryResolve(app)}
                        className="px-3 py-1.5 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
                      >
                        Respond & Upload Fix
                      </button>
                    </div>
                  )}

                  {scheduledInspection && (
                    <div className="bg-purple-50/80 border border-purple-200 rounded-lg p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-purple-700 shrink-0" />
                        <div>
                          <span className="font-semibold text-purple-900">
                            Physical Sanitation Inspection Confirmed
                          </span>
                          <span className="text-purple-800 block text-[11px]">
                            {scheduledInspection.inspectionDate} ({scheduledInspection.inspectionTimeSlot}) with {scheduledInspection.assignedInspector?.name}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-purple-900 font-semibold text-[11px] bg-purple-100/70 px-2 py-0.5 rounded">
                        4 Days Remaining
                      </span>
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      <span>Total Government Fees: </span>
                      <span className="font-mono font-semibold text-slate-800 tabular-nums">
                        ${app.totalFees.toLocaleString()}
                      </span>
                      <span className="text-emerald-700 ml-1.5 font-medium">(Paid in Full)</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {app.status === 'APPROVED' && (
                        <button
                          onClick={() => onOpenCertificate(app)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>View Official Certificate</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectApplication(app)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Open Master Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
