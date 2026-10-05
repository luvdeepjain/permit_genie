import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  QrCode,
  Award
} from 'lucide-react';
import { PermitApplication } from '../types/permit';
import { AGENCY_METADATA } from '../utils/agencyConstants';

interface DigitalCertificateModalProps {
  application: PermitApplication;
  onClose: () => void;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  application,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const certificateNumber = `COO-2026-${application.id.replace(/[^0-9]/g, '')}`;
  const issueDate = application.lastUpdatedAt ? new Date(application.lastUpdatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'October 3, 2026';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[95vh] overflow-hidden">
        {/* Modal Controls Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">
              Official Single-Window Certificate of Occupancy
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Document</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100/60 print:bg-white print:p-0">
          <div className="max-w-3xl mx-auto bg-white border-8 border-double border-slate-700 p-8 sm:p-12 shadow-md print:shadow-none print:border-4 relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <Building2 className="w-96 h-96 text-slate-900" />
            </div>

            {/* Header */}
            <div className="text-center pb-6 border-b-2 border-slate-800 space-y-2 relative z-10">
              <div className="text-xs font-mono font-bold tracking-widest uppercase text-slate-600">
                City & County Municipal Government · Unified Single-Window Bureau
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif uppercase">
                Consolidated Certificate of Occupancy & Operations
              </h1>
              <div className="text-xs font-mono text-slate-500 font-semibold tracking-wider">
                CERTIFICATE NO: <span className="text-slate-900 font-bold">{certificateNumber}</span>
              </div>
            </div>

            {/* Legal Statement */}
            <div className="py-6 space-y-4 text-xs leading-relaxed text-slate-700 relative z-10">
              <p className="text-center italic font-serif text-sm text-slate-800">
                This is to certify that the premises described herein have been thoroughly inspected and found to comply with the applicable Building Codes, Fire Life Safety Ordinances, Health & Sanitation Regulations, and Zoning Mandates of the City.
              </p>

              {/* Establishment Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-lg text-xs mt-4">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Legal Entity Name</span>
                  <span className="font-bold text-slate-900 block">{application.businessName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Trade Name (DBA)</span>
                  <span className="font-bold text-slate-900 block">{application.tradeName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Premises Location</span>
                  <span className="font-semibold text-slate-800 block">{application.location.address}, {application.location.suiteUnit || ''}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Parcel Identifier & Zone</span>
                  <span className="font-mono text-slate-800 block">{application.location.parcelLotNumber} · {application.location.zoneDesignation}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Permitted Classification</span>
                  <span className="font-semibold text-slate-800 block capitalize">{application.industry.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Maximum Occupancy Capacity</span>
                  <span className="font-mono font-bold text-slate-900 block">{application.propertyDetails.occupancyLoad} Persons</span>
                </div>
              </div>

              {/* Inter-Agency Sign-Off Registry */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                  Certified Agency Clearances Included in this Master Authorization:
                </div>
                <div className="border border-slate-200 divide-y divide-slate-200 rounded-md overflow-hidden text-xs">
                  {application.agencyClearances.map((c) => {
                    const meta = AGENCY_METADATA[c.agencyType];
                    return (
                      <div key={c.id} className="p-2.5 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-900">{meta.name}</span>
                          <span className="text-slate-400 font-mono text-[10px]">({meta.code})</span>
                        </div>
                        <div className="font-mono text-[11px] font-semibold text-slate-700">
                          {c.certificateNumber || `VERIFIED-${c.id}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Conditions */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-md text-[11px] text-amber-950 space-y-1">
                <span className="font-bold block">Conditions of Continued Validity:</span>
                <p>
                  This Certificate remains valid provided no alterations to structural elements, egress corridors, or fire suppression devices occur without prior single-window amendment filing.
                </p>
              </div>
            </div>

            {/* Document Verification & Signatures */}
            <div className="pt-8 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-xs">
              {/* QR Verification */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 border-2 border-slate-800 p-1 bg-white flex items-center justify-center">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  <span className="font-bold text-slate-900 block">Digital Verification Hash</span>
                  <span>SHA256: 8f4a...9b12</span>
                  <span className="block mt-0.5 text-emerald-700 font-semibold">City Registry Verified</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-center gap-8 text-center">
                <div className="space-y-1">
                  <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 px-4">
                    Marcus Vance, PE
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">
                    Chief Building Plan Examiner
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 px-4">
                    Capt. Raymond Scott
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">
                    Bureau of Fire Prevention
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-mono pt-6">
              Issued at Metro City Hall · Valid through October 2028 · Permit Genie Municipal Gateway
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
