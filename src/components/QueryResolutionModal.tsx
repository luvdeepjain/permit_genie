import React, { useState } from 'react';
import { 
  X, 
  AlertCircle, 
  Send, 
  FileText, 
  Upload, 
  CheckCircle2, 
  FileCheck
} from 'lucide-react';
import { PermitApplication, OfficerQuery } from '../types/permit';
import { AGENCY_METADATA } from '../utils/agencyConstants';

interface QueryResolutionModalProps {
  application: PermitApplication;
  onClose: () => void;
  onResolveSuccess: (updatedApp: PermitApplication) => void;
}

export const QueryResolutionModal: React.FC<QueryResolutionModalProps> = ({
  application,
  onClose,
  onResolveSuccess,
}) => {
  // Find all open queries across clearances
  const openQueries: Array<{
    clearanceId: string;
    agencyName: string;
    agencyCode: string;
    query: OfficerQuery;
  }> = [];

  application.agencyClearances.forEach(clr => {
    clr.queries.forEach(q => {
      if (q.status === 'OPEN') {
        const meta = AGENCY_METADATA[clr.agencyType];
        openQueries.push({
          clearanceId: clr.id,
          agencyName: meta.name,
          agencyCode: meta.code,
          query: q,
        });
      }
    });
  });

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const activeQueryItem = openQueries[selectedItemIndex];

  const [responseText, setResponseText] = useState(
    'Amended technical schematic submitted. The mechanical ventilation unit has been updated with direct 100% outside air emergency purge louvers triggered automatically by thermal sensors.'
  );
  const [attachmentName, setAttachmentName] = useState('amended_exhaust_purge_schematic_rev3.pdf');

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQueryItem || !responseText) return;

    const { clearanceId, query } = activeQueryItem;

    const updatedClearances = application.agencyClearances.map(clr => {
      if (clr.id !== clearanceId) return clr;

      const updatedQueries = clr.queries.map(q => {
        if (q.id !== query.id) return q;
        return {
          ...q,
          status: 'RESOLVED' as const,
          responseText,
          resolvedAt: new Date().toISOString(),
          attachmentName,
        };
      });

      // If all queries are resolved, move status back to UNDER_REVIEW
      const hasRemainingOpen = updatedQueries.some(q => q.status === 'OPEN');
      return {
        ...clr,
        status: hasRemainingOpen ? clr.status : ('UNDER_REVIEW' as const),
        queries: updatedQueries,
      };
    });

    const hasAnyOpenQueriesLeft = updatedClearances.some(c => 
      c.queries.some(q => q.status === 'OPEN')
    );

    const updatedApp: PermitApplication = {
      ...application,
      status: hasAnyOpenQueriesLeft ? 'QUERIES_PENDING' : 'IN_PROGRESS',
      agencyClearances: updatedClearances,
      lastUpdatedAt: new Date().toISOString(),
      timeline: [
        ...application.timeline,
        {
          id: `tl-res-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: `Applicant Clarification Submitted (${activeQueryItem.agencyCode})`,
          description: `Applicant responded to inquiry by ${query.officerName} with attached exhibit "${attachmentName}".`,
          actor: application.applicant.fullName,
          actorRole: 'Applicant Signatory',
          type: 'query',
        },
      ],
    };

    onResolveSuccess(updatedApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              Agency Clarification & Rectification
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeQueryItem ? (
          <form onSubmit={handleSubmitResolution} className="space-y-4 text-xs">
            {/* Query details box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-900">
                  {activeQueryItem.agencyCode} · {activeQueryItem.agencyName}
                </span>
                <span className="text-[11px] text-amber-800">
                  Officer: {activeQueryItem.query.officerName}
                </span>
              </div>
              <p className="text-slate-800 italic leading-relaxed">
                "{activeQueryItem.query.queryText}"
              </p>
            </div>

            {/* Response Textarea */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Formal Engineering / Legal Clarification *
              </label>
              <textarea
                required
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Document Attachment */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amended Schematic / Document Exhibit
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => setAttachmentName('revised_compliance_drawing_sealed.pdf')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 whitespace-nowrap"
                >
                  Select File
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Rectification to Officer</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No open queries currently requiring resolution on this application.
          </div>
        )}
      </div>
    </div>
  );
};
