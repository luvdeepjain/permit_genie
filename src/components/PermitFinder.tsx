import React, { useState } from 'react';
import { 
  Compass, 
  Building2, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { BusinessCategory } from '../types/permit';
import { INDUSTRY_PRESETS, AGENCY_METADATA } from '../utils/agencyConstants';
import { evaluateRequiredAgencies } from '../utils/permitRules';

interface PermitFinderProps {
  onStartApplicationWithPreset: (industry: BusinessCategory) => void;
}

export const PermitFinder: React.FC<PermitFinderProps> = ({
  onStartApplicationWithPreset,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<BusinessCategory>('food_hospitality');
  const [squareFootage, setSquareFootage] = useState<number>(2500);
  const [occupancyLoad, setOccupancyLoad] = useState<number>(60);
  const [hasCommercialKitchen, setHasCommercialKitchen] = useState<boolean>(true);
  const [hasHazardousMaterials, setHasHazardousMaterials] = useState<boolean>(false);
  const [hasOutdoorPatio, setHasOutdoorPatio] = useState<boolean>(true);
  const [isHistoricDistrict, setIsHistoricDistrict] = useState<boolean>(false);
  const [renovationBudget, setRenovationBudget] = useState<number>(150000);

  const currentPreset = INDUSTRY_PRESETS.find(p => p.category === selectedIndustry) || INDUSTRY_PRESETS[0];

  const requirements = evaluateRequiredAgencies({
    industry: selectedIndustry,
    squareFootage,
    occupancyLoad,
    hasCommercialKitchen,
    hasHazardousMaterials,
    hasOutdoorPatio,
    isHistoricDistrict,
    estimatedRenovationBudget: renovationBudget,
  });

  const totalCalculatedFees = requirements.reduce((acc, r) => acc + r.fees, 0);
  const sequentialDays = requirements.reduce((acc, r) => acc + r.statutoryDays, 0);
  const concurrentDays = Math.max(...requirements.map(r => r.statutoryDays), 14);
  const daysSaved = sequentialDays - concurrentDays;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>Interactive Regulatory Discovery Tool</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Permit & Approval Feasibility Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Estimate statutory agency clearances, mandatory architectural exhibits, estimated turnaround times, and municipal fees before signing a commercial lease.
        </p>

        {/* Industry Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6">
          {INDUSTRY_PRESETS.map((preset) => {
            const isSelected = preset.category === selectedIndustry;
            return (
              <button
                key={preset.category}
                onClick={() => {
                  setSelectedIndustry(preset.category);
                  if (preset.category === 'food_hospitality') {
                    setHasCommercialKitchen(true);
                    setHasHazardousMaterials(false);
                  } else if (preset.category === 'biotech_healthcare' || preset.category === 'industrial_manufacturing') {
                    setHasCommercialKitchen(false);
                    setHasHazardousMaterials(true);
                  } else {
                    setHasCommercialKitchen(false);
                    setHasHazardousMaterials(false);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500 text-indigo-900 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold leading-snug line-clamp-2">
                  {preset.label}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-2">
                  ~{preset.averageTimelineDays} Days
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator Body: Parameters & Realtime Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Space & Operational Parameters
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Usable Floor Space</span>
              <span className="font-mono text-indigo-600">{squareFootage.toLocaleString()} sq ft</span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="250"
              value={squareFootage}
              onChange={(e) => setSquareFootage(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Expected Occupancy Capacity</span>
              <span className="font-mono text-indigo-600">{occupancyLoad} people</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="5"
              value={occupancyLoad}
              onChange={(e) => setOccupancyLoad(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Renovation / Tenant Fit-Out Budget</span>
              <span className="font-mono text-indigo-600">${renovationBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={renovationBudget}
              onChange={(e) => setRenovationBudget(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="font-semibold text-slate-700 block">Specific Operational Triggers</span>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCommercialKitchen}
                onChange={(e) => setHasCommercialKitchen(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">Commercial cooking equipment / grease exhaust</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHazardousMaterials}
                onChange={(e) => setHasHazardousMaterials(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">Hazardous chemicals, gases, or biomedical waste</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasOutdoorPatio}
                onChange={(e) => setHasOutdoorPatio(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">Sidewalk patio / outdoor seating encroachment</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isHistoricDistrict}
                onChange={(e) => setIsHistoricDistrict(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">Designated Historic Conservation District</span>
            </label>
          </div>
        </div>

        {/* Right: Projected Clearances & Speedup (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comparison Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-800">
              <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                Concurrent Processing Efficiency
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Saves {daysSaved} Days ({Math.round((daysSaved / sequentialDays) * 100)}% Speedup)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <div className="text-xs text-slate-400">Permit Genie Fast-Track</div>
                <div className="text-3xl font-extrabold font-mono text-white mt-1 tabular-nums">
                  ~{concurrentDays} <span className="text-sm font-normal text-slate-300">Days</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-0.5">
                  Synchronous multi-agency reviews
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400">Legacy Serial Bureaucracy</div>
                <div className="text-3xl font-extrabold font-mono text-slate-400 mt-1 tabular-nums line-through decoration-rose-500/60">
                  ~{sequentialDays} <span className="text-sm font-normal">Days</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Filing agency-by-agency in sequence
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-800/80 flex items-center justify-between text-xs">
              <span className="text-indigo-200">Consolidated Government Filing Fees:</span>
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                ${totalCalculatedFees.toLocaleString()}.00
              </span>
            </div>
          </div>

          {/* List of Calculated Clearances */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Required Clearances ({requirements.length} Authorities)</span>
              <span className="text-slate-500 font-normal">Statutory Timeframes</span>
            </div>

            <div className="space-y-2">
              {requirements.map((req) => {
                const meta = AGENCY_METADATA[req.agencyType];
                return (
                  <div
                    key={req.agencyType}
                    className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="font-mono text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded text-[10px]">
                          {meta.code}
                        </span>
                        <span>{req.permitName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {meta.name}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        ${req.fees}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {req.statutoryDays} Days
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onStartApplicationWithPreset(selectedIndustry)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Launch Single-Window Filing for this Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
