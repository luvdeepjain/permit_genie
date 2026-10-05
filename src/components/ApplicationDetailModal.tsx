import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  Download, 
  ExternalLink,
  MessageSquare,
  Check,
  CreditCard,
  History,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { PermitApplication, AgencyClearance, AgencyType } from '../types/permit';
import { AGENCY_METADATA } from '../utils/agencyConstants';

interface ApplicationDetailModalProps {
  application: PermitApplication;
  onClose: () => void;
  onOpenCertificate: (app: PermitApplication) => void;
  onOpenQueryResolve: (app: PermitApplication) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onOpenCertificate,
  onOpenQueryResolve,
}) => {
  const [activeTab, setActiveTab] = useState<'clearances' | 'workflow' | 'timeline' | 'fees'>('clearances');
  const [selectedClearanceId, setSelectedClearanceId] = useState<string>(
    application.agencyClearances[0]?.id || ''
  );

  const selectedClearance = application.agencyClearances.find(c => c.id === selectedClearanceId) || application.agencyClearances[0];

  const totalClearances = application.agencyClearances.length;
  const approvedCount = application.agencyClearances.filter(c => c.status === 'APPROVED').length;
  const pendingActionCount = application.agencyClearances.filter(c => c.status === 'ACTION_REQUIRED').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                {application.id}
              </span>
              <span aria-hidden="true">·</span>
              <span>Filed: {new Date(application.createdAt).toLocaleDateString()}</span>
              <span aria-hidden="true">·</span>
              <span className="font-sans font-medium text-slate-700">{application.entityType}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {application.tradeName || application.businessName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {application.location.address}, {application.location.city}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">Parcel: {application.location.parcelLotNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600">Zone: {application.location.zoneDesignation}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {application.status === 'APPROVED' && (
              <button
                onClick={() => onOpenCertificate(application)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Certificate of Occupancy</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('clearances')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'clearances'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Agencies & Clearances ({approvedCount}/{totalClearances})</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Concurrent Workflow Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Statutory Audit Trail ({application.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'fees'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Municipal Fee Ledger</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CLEARANCES */}
          {activeTab === 'clearances' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Agency List Selector (Left) */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Participating Authorities ({application.agencyClearances.length})
                </div>

                {application.agencyClearances.map((clearance) => {
                  const meta = AGENCY_METADATA[clearance.agencyType];
                  const isSelected = clearance.id === selectedClearanceId;

                  return (
                    <button
                      key={clearance.id}
                      onClick={() => setSelectedClearanceId(clearance.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-500 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {meta.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">
                            {meta.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {clearance.permitName}
                        </div>
                      </div>

                      <div className="shrink-0 mt-0.5">
                        {clearance.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        )}
                        {clearance.status === 'ACTION_REQUIRED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Inquiry
                          </span>
                        )}
                        {clearance.status === 'INSPECTION_SCHEDULED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                            <Calendar className="w-3 h-3 text-purple-600" />
                            Inspection
                          </span>
                        )}
                        {clearance.status === 'UNDER_REVIEW' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-blue-500" />
                            In Review
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Clearance Detail Pane (Right) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-5">
                {selectedClearance && (() => {
                  const meta = AGENCY_METADATA[selectedClearance.agencyType];
                  return (
                    <>
                      {/* Clearance Header */}
                      <div className="pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs text-indigo-600 font-semibold mb-1">
                            {meta.name} ({meta.code})
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {selectedClearance.permitName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {selectedClearance.description}
                          </p>
                        </div>

                        {selectedClearance.certificateNumber && (
                          <div className="text-right shrink-0">
                            <div className="text-[11px] text-slate-400 uppercase font-mono">Permit Serial</div>
                            <div className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                              {selectedClearance.certificateNumber}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SLA Timers & Assigned Official */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-lg border border-slate-200/80 text-xs">
                        <div>
                          <div className="text-slate-500 font-medium mb-1">Statutory Review Window</div>
                          <div className="font-mono font-semibold text-slate-800 tabular-nums">
                            {selectedClearance.statutoryDaysTotal} Legal Days Under Code
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Target SLA Deadline: {selectedClearance.slaDeadlineDate}
                          </div>
                        </div>

                        {selectedClearance.assignedInspector ? (
                          <div>
                            <div className="text-slate-500 font-medium mb-1">Assigned Case Officer</div>
                            <div className="font-semibold text-slate-900">
                              {selectedClearance.assignedInspector.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>Badge: {selectedClearance.assignedInspector.badgeNumber}</span>
                              <span aria-hidden="true">·</span>
                              <span>{selectedClearance.assignedInspector.phone}</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-slate-500 font-medium mb-1">Assigned Officer</div>
                            <div className="text-slate-600 italic">Central Queue Allocation</div>
                          </div>
                        )}
                      </div>

                      {/* Open Queries / Deficiencies */}
                      {selectedClearance.queries && selectedClearance.queries.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                            <span className="flex items-center gap-1.5 text-amber-900">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              Official Clarification Queries ({selectedClearance.queries.length})
                            </span>
                          </div>

                          {selectedClearance.queries.map((q) => (
                            <div 
                              key={q.id}
                              className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                                q.status === 'OPEN'
                                  ? 'bg-amber-50/90 border-amber-300'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold text-slate-900">
                                  {q.officerName} ({q.officerRole})
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  q.status === 'OPEN' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {q.status}
                                </span>
                              </div>
                              <p className="text-slate-800 italic">
                                "{q.queryText}"
                              </p>

                              {q.status === 'RESOLVED' ? (
                                <div className="pt-2 border-t border-slate-200 text-emerald-800">
                                  <span className="font-semibold block">Applicant Resolution:</span>
                                  <span>{q.responseText}</span>
                                  {q.attachmentName && (
                                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Attached: {q.attachmentName}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="pt-2">
                                  <button
                                    onClick={() => onOpenQueryResolve(application)}
                                    className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors shadow-2xs"
                                  >
                                    Respond & Submit Rectification
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Scheduled Inspection Banner */}
                      {selectedClearance.inspectionDate && (
                        <div className="bg-purple-50/80 border border-purple-200 rounded-lg p-3.5 space-y-1.5 text-xs">
                          <div className="flex items-center gap-2 font-semibold text-purple-900">
                            <Calendar className="w-4 h-4 text-purple-700" />
                            <span>Physical On-Site Inspection Scheduled</span>
                          </div>
                          <div className="text-purple-950">
                            Date: <span className="font-semibold">{selectedClearance.inspectionDate}</span> ({selectedClearance.inspectionTimeSlot})
                          </div>
                          {selectedClearance.inspectionNotes && (
                            <div className="text-[11px] text-purple-800 pt-1 border-t border-purple-200/60">
                              <span className="font-medium">Inspector Directives: </span>
                              {selectedClearance.inspectionNotes}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Approval Conditions */}
                      {selectedClearance.approvalConditions && selectedClearance.approvalConditions.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-slate-700">
                            Conditions of Permit Approval
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                            {selectedClearance.approvalConditions.map((cond, i) => (
                              <li key={i} className="leading-relaxed">
                                {cond}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Mandatory Technical Documents */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-slate-700">
                          Verified Technical Filings & Schematics ({selectedClearance.documents.length})
                        </div>
                        <div className="space-y-1.5">
                          {selectedClearance.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                <div className="truncate">
                                  <div className="font-medium text-slate-800 truncate">{doc.name}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {doc.fileName || 'document.pdf'} {doc.fileSize && `· ${doc.fileSize}`}
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {doc.status === 'VERIFIED' && (
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                    Verified
                                  </span>
                                )}
                                {doc.status === 'REJECTED' && (
                                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                                    Deficient
                                  </span>
                                )}
                                {doc.status === 'UPLOADED' && (
                                  <span className="text-[10px] font-medium text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                                    Uploaded
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 2: CONCURRENT WORKFLOW ENGINE */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  How Permit Genie Accelerates Your Approvals
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional municipal clearance requires applicants to file serially: waiting weeks for Zoning, then submitting to DOB, then waiting for Fire, then Health. 
                  Permit Genie orchestrates parallel routing with automated dependency locks.
                </p>
              </div>

              {/* Workflow Pipeline Steps */}
              <div className="space-y-4">
                {/* Stage 1 */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span>Phase 1: Land Use & Zoning Conformance</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          Approved
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Zoning Commission verifies baseline allowable use for {application.industry.replace('_', ' ')}. Unlocks physical construction & tenant improvements.
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-500 shrink-0">
                    Duration: 8 Days
                  </div>
                </div>

                {/* Stage 2 - Concurrent */}
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                          Phase 2: Parallel Inter-Agency Review (Concurrent Speedup)
                        </div>
                        <div className="text-xs text-indigo-800">
                          Three agencies evaluate technical blueprints simultaneously without holding each other back.
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                      Saves ~38 Days
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-lg border border-indigo-100 text-xs space-y-1">
                      <div className="font-bold text-slate-900">Buildings (DOB)</div>
                      <div className="text-slate-500 text-[11px]">Structural & ADA Egress</div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                        Approved
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-indigo-100 text-xs space-y-1">
                      <div className="font-bold text-slate-900">Fire Prevention</div>
                      <div className="text-slate-500 text-[11px]">Suppression & Hood Safety</div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                        Approved
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-indigo-100 text-xs space-y-1">
                      <div className="font-bold text-slate-900">Commerce & Labor</div>
                      <div className="text-slate-500 text-[11px]">Operating License & Tax</div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                        Approved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span>Phase 3: Physical Field Inspection & Commissioning</span>
                        <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                          Scheduled Oct 6
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Sanitation Officer Dr. Sarah Lin audits refrigeration temperatures, backflow preventers, and food safety credentials.
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-500 shrink-0">
                    Est. Final Pass: 4 Days
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 opacity-75">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span>Phase 4: Consolidated Master Certificate of Occupancy</span>
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          Unlocks Upon Sanitation Pass
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Permit Genie combines all individual agency sign-offs into a tamper-evident, QR-verified unified operational permit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE & AUDIT TRAIL */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Official statutory audit log of all communications, document versions, inspection scheduling, and status transitions.
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {application.timeline.map((event) => (
                  <div key={event.id} className="relative flex items-start gap-3 text-xs">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{event.title}</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {new Date(event.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600">{event.description}</p>
                      <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-2">
                        <span>Actor: {event.actor} ({event.actorRole})</span>
                        {event.agencyType && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-indigo-600 font-semibold">{AGENCY_METADATA[event.agencyType].code}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MUNICIPAL FEE LEDGER */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Consolidated Filing Fee Paid</div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    ${application.totalFees.toLocaleString()}.00
                  </div>
                  <div className="text-xs text-emerald-700 font-medium mt-0.5">
                    Settled via City Single-Window Clearinghouse · Transaction Ref: TXN-PG-{application.id.replace('PG-', '')}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Municipal Fee Receipt for Application ${application.id}\nTotal Paid: $${application.totalFees}.00\nPayment Status: SETTLED IN FULL`)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Tax & Fee Receipt</span>
                </button>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Agency / Code</th>
                      <th className="px-4 py-3">Fee Description</th>
                      <th className="px-4 py-3">Statutory Basis</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {application.agencyClearances.map((c) => {
                      const meta = AGENCY_METADATA[c.agencyType];
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {meta.name} <span className="font-mono text-slate-400">({meta.code})</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {c.permitName}
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                            Municipal Code Title 18-A
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                            ${c.fees}.00
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              PAID
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Filing protected by City Digital Single-Window Governance Standard.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
