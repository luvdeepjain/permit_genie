import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Search, 
  FileText, 
  Send, 
  Check, 
  FileCheck,
  Flame,
  Activity,
  Trees,
  Briefcase
} from 'lucide-react';
import { AgencyType, PermitApplication, AgencyClearance, ClearanceStatus } from '../types/permit';
import { AGENCY_METADATA } from '../utils/agencyConstants';

interface AgencyOfficerPortalProps {
  applications: PermitApplication[];
  onUpdateApplication: (updatedApp: PermitApplication) => void;
}

export const AgencyOfficerPortal: React.FC<AgencyOfficerPortalProps> = ({
  applications,
  onUpdateApplication,
}) => {
  const [selectedAgency, setSelectedAgency] = useState<AgencyType>('PUBLIC_HEALTH');
  const [activeFilingId, setActiveFilingId] = useState<string>('');

  // Action Modals State inside portal
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [inspectionDate, setInspectionDate] = useState('2026-10-12');
  const [inspectionTimeSlot, setInspectionTimeSlot] = useState('09:30 AM - 11:00 AM');
  const [inspectionNotes, setInspectionNotes] = useState('Verify backflow preventers, emergency lighting exit pathways, and fire damper operation.');

  const currentAgencyMeta = AGENCY_METADATA[selectedAgency];

  // Find all clearances for this agency across applications
  const assignedClearances: Array<{ app: PermitApplication; clearance: AgencyClearance }> = [];
  applications.forEach(app => {
    const clr = app.agencyClearances.find(c => c.agencyType === selectedAgency);
    if (clr) {
      assignedClearances.push({ app, clearance: clr });
    }
  });

  const selectedItem = assignedClearances.find(i => i.app.id === activeFilingId) || assignedClearances[0];

  const handleApproveClearance = () => {
    if (!selectedItem) return;
    const { app, clearance } = selectedItem;

    const certNumber = `${currentAgencyMeta.code}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updatedClearance: AgencyClearance = {
      ...clearance,
      status: 'APPROVED',
      certificateNumber: certNumber,
      issuedAt: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statutoryDaysRemaining: 0,
      approvalConditions: [
        'Premises shall strictly maintain compliance with submitted engineering specifications.',
        'Permit certificate must be framed and displayed conspicuously at customer entrance.',
      ],
    };

    const updatedClearances = app.agencyClearances.map(c => 
      c.id === clearance.id ? updatedClearance : c
    );

    // Check if all clearances are now approved
    const allApproved = updatedClearances.every(c => c.status === 'APPROVED');

    const updatedApp: PermitApplication = {
      ...app,
      status: allApproved ? 'APPROVED' : app.status,
      agencyClearances: updatedClearances,
      lastUpdatedAt: new Date().toISOString(),
      timeline: [
        ...app.timeline,
        {
          id: `tl-officer-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: `${currentAgencyMeta.shortName} Clearance Granted`,
          description: `Official approval granted under Permit #${certNumber} by ${currentAgencyMeta.name}.`,
          agencyType: selectedAgency,
          actor: 'City Case Officer',
          actorRole: `${currentAgencyMeta.shortName} Examiner`,
          type: 'approval',
        },
      ],
    };

    onUpdateApplication(updatedApp);
  };

  const handleScheduleInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const { app, clearance } = selectedItem;

    const updatedClearance: AgencyClearance = {
      ...clearance,
      status: 'INSPECTION_SCHEDULED',
      inspectionDate,
      inspectionTimeSlot,
      inspectionNotes,
    };

    const updatedApp: PermitApplication = {
      ...app,
      agencyClearances: app.agencyClearances.map(c => c.id === clearance.id ? updatedClearance : c),
      lastUpdatedAt: new Date().toISOString(),
      timeline: [
        ...app.timeline,
        {
          id: `tl-officer-insp-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: `On-Site Inspection Scheduled (${currentAgencyMeta.code})`,
          description: `Field inspection scheduled for ${inspectionDate} (${inspectionTimeSlot}). Notes: ${inspectionNotes}`,
          agencyType: selectedAgency,
          actor: 'City Field Inspector',
          actorRole: `${currentAgencyMeta.shortName} Specialist`,
          type: 'inspection',
        },
      ],
    };

    onUpdateApplication(updatedApp);
    setIsInspectionModalOpen(false);
  };

  const handleRaiseQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !queryText) return;
    const { app, clearance } = selectedItem;

    const newQuery = {
      id: `qry-off-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      officerName: 'Senior Plan Examiner',
      officerRole: `${currentAgencyMeta.shortName} Authority`,
      queryText,
      status: 'OPEN' as const,
    };

    const updatedClearance: AgencyClearance = {
      ...clearance,
      status: 'ACTION_REQUIRED',
      queries: [...clearance.queries, newQuery],
    };

    const updatedApp: PermitApplication = {
      ...app,
      status: 'QUERIES_PENDING',
      agencyClearances: app.agencyClearances.map(c => c.id === clearance.id ? updatedClearance : c),
      lastUpdatedAt: new Date().toISOString(),
      timeline: [
        ...app.timeline,
        {
          id: `tl-officer-qry-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: `Technical Clarification Raised (${currentAgencyMeta.code})`,
          description: `Case officer requested applicant response: "${queryText}"`,
          agencyType: selectedAgency,
          actor: 'Senior Plan Examiner',
          actorRole: `${currentAgencyMeta.shortName} Authority`,
          type: 'query',
        },
      ],
    };

    onUpdateApplication(updatedApp);
    setIsQueryModalOpen(false);
    setQueryText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Officer Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Municipal Regulatory Review Console</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-sans">
            Agency Plan Examiner & Inspector Desk
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Evaluate dossiers routed to your department, verify engineering drawings, dispatch field inspections, or issue certified permits.
          </p>
        </div>

        {/* Agency Select Dropdown/Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto text-xs">
          {(['PUBLIC_HEALTH', 'FIRE_MARSHAL', 'BUILDING_SAFETY', 'ENVIRONMENTAL', 'ZONING_PLANNING'] as AgencyType[]).map((a) => (
            <button
              key={a}
              onClick={() => {
                setSelectedAgency(a);
                setActiveFilingId('');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedAgency === a
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {AGENCY_METADATA[a].code}
            </button>
          ))}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filings Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Incoming Dossiers ({assignedClearances.length})</span>
            <span className="font-mono text-slate-700">{currentAgencyMeta.code} Queue</span>
          </div>

          <div className="space-y-2.5">
            {assignedClearances.map(({ app, clearance }) => {
              const isSelected = selectedItem?.app.id === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => setActiveFilingId(app.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-500 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-700">{app.id}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      SLA: {clearance.statutoryDaysRemaining}d left
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {app.tradeName || app.businessName}
                    </h3>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {clearance.permitName}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[150px]">{app.location.address}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      clearance.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      clearance.status === 'ACTION_REQUIRED' ? 'bg-amber-100 text-amber-900' :
                      clearance.status === 'INSPECTION_SCHEDULED' ? 'bg-purple-100 text-purple-900' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {clearance.status.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Filing Dossier & Inspector Action Station (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          {selectedItem ? (
            <>
              {/* Dossier Header */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {selectedItem.app.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Zone: {selectedItem.app.location.zoneDesignation}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedItem.app.tradeName || selectedItem.app.businessName}
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedItem.app.location.address} · {selectedItem.app.propertyDetails.squareFootage} sq ft · Load: {selectedItem.app.propertyDetails.occupancyLoad} pax
                  </div>
                </div>

                <div className="shrink-0">
                  {selectedItem.clearance.status === 'APPROVED' ? (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Approved & Certified
                      </span>
                      <div className="font-mono text-[10px] text-slate-400 mt-1">
                        #{selectedItem.clearance.certificateNumber}
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 font-semibold text-xs rounded-lg border border-blue-200">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Pending Department Adjudication
                    </span>
                  )}
                </div>
              </div>

              {/* Department Review Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">
                  {selectedItem.clearance.permitName}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {selectedItem.clearance.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-slate-500 font-mono text-[11px]">
                  <span>Statutory Review Window: {selectedItem.clearance.statutoryDaysTotal} Days</span>
                  <span>Filing Fee: ${selectedItem.clearance.fees}.00 (Paid)</span>
                  <span>Assigned Inspector: {selectedItem.clearance.assignedInspector?.name || 'Central Pool'}</span>
                </div>
              </div>

              {/* Technical Exhibits Submitted by Applicant */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Submitted Technical Exhibits ({selectedItem.clearance.documents.length})
                </div>
                <div className="space-y-2">
                  {selectedItem.clearance.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {doc.fileName || 'spec_sheet.pdf'} · {doc.fileSize || '3.2 MB'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Valid Signature
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Decision Station */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Regulatory Actions & Decision
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Action 1: Grant Clearance */}
                  <button
                    onClick={handleApproveClearance}
                    disabled={selectedItem.clearance.status === 'APPROVED'}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedItem.clearance.status === 'APPROVED'
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-emerald-50/70 border-emerald-300 text-emerald-950 hover:bg-emerald-100/70 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Grant Agency Clearance</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-medium">
                      Issue official permit serial number and certified approval.
                    </span>
                  </button>

                  {/* Action 2: Schedule Inspection */}
                  <button
                    onClick={() => setIsInspectionModalOpen(true)}
                    className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/70 text-purple-950 hover:bg-purple-100/70 transition-all text-left flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>Schedule On-Site Audit</span>
                    </div>
                    <span className="text-[11px] text-purple-800 font-medium">
                      Assign date/time for physical field inspection.
                    </span>
                  </button>

                  {/* Action 3: Request Clarification */}
                  <button
                    onClick={() => setIsQueryModalOpen(true)}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 hover:bg-amber-100/70 transition-all text-left flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Issue Clarification Notice</span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium">
                      Pause SLA timer and request amended schematics.
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No active filings found for this department.
            </div>
          )}
        </div>
      </div>

      {/* Query Clarification Modal */}
      {isQueryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Issue Official Technical Clarification Query</span>
            </h3>
            <p className="text-xs text-slate-500">
              The applicant will receive an urgent notification to resolve this inquiry and attach amended technical documentation.
            </p>

            <form onSubmit={handleRaiseQuery} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Regulatory Deficiency / Clarification Prompt *
                </label>
                <textarea
                  required
                  rows={4}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="e.g. Please clarify whether the secondary plumbing interceptor complies with City Wastewater Standard Section 4.2..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQueryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
                >
                  Dispatch Clarification Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {isInspectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Schedule On-Site Physical Inspection</span>
            </h3>

            <form onSubmit={handleScheduleInspection} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Inspection Date *
                </label>
                <input
                  type="date"
                  required
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Time Slot Window *
                </label>
                <input
                  type="text"
                  required
                  value={inspectionTimeSlot}
                  onChange={(e) => setInspectionTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Inspection Directives for Applicant
                </label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInspectionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
                >
                  Confirm Inspection Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
