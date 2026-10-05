import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Upload, 
  Info,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';
import { BusinessCategory, PermitApplication, DocumentVaultItem } from '../types/permit';
import { evaluateRequiredAgencies, buildClearancesFromRequirements } from '../utils/permitRules';
import { AGENCY_METADATA } from '../utils/agencyConstants';

interface NewApplicationWizardProps {
  vaultDocuments: DocumentVaultItem[];
  onSubmitSuccess: (newApp: PermitApplication) => void;
  onCancel: () => void;
}

export const NewApplicationWizard: React.FC<NewApplicationWizardProps> = ({
  vaultDocuments,
  onSubmitSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [businessName, setBusinessName] = useState('Solstice Artisan Micro-Roastery LLC');
  const [tradeName, setTradeName] = useState('Solstice Coffee & Roastery');
  const [entityType, setEntityType] = useState<'LLC' | 'Corporation' | 'Sole Proprietorship' | 'Partnership'>('LLC');
  const [tinTaxId, setTinTaxId] = useState('XX-XXX9281');
  const [applicantName, setApplicantName] = useState('Maya Lin-Campbell');
  const [applicantEmail, setApplicantEmail] = useState('maya@solsticecoffee.com');
  const [applicantPhone, setApplicantPhone] = useState('(415) 621-9940');
  const [applicantRole, setApplicantRole] = useState('Co-Founder & Head of Operations');

  // Location & Operations
  const [industry, setIndustry] = useState<BusinessCategory>('food_hospitality');
  const [address, setAddress] = useState('420 Folsom Street');
  const [suiteUnit, setSuiteUnit] = useState('Unit 1B');
  const [city, setCity] = useState('Metro City');
  const [state, setState] = useState('CA');
  const [zipCode, setZipCode] = useState('94105');
  const [parcelLotNumber, setParcelLotNumber] = useState('Lot 22-A / Block 4018');
  const [zoneDesignation, setZoneDesignation] = useState('C-3-S (Downtown Mixed Commercial & Light Maker)');
  const [squareFootage, setSquareFootage] = useState<number>(3100);
  const [occupancyLoad, setOccupancyLoad] = useState<number>(75);
  const [hasCommercialKitchen, setHasCommercialKitchen] = useState<boolean>(true);
  const [hasHazardousMaterials, setHasHazardousMaterials] = useState<boolean>(false);
  const [hasOutdoorPatio, setHasOutdoorPatio] = useState<boolean>(true);
  const [isHistoricDistrict, setIsHistoricDistrict] = useState<boolean>(false);
  const [renovationBudget, setRenovationBudget] = useState<number>(210000);

  // Document Uploads State
  const [uploadedDocNames, setUploadedDocNames] = useState<Record<string, string>>({
    'Commercial Lease Agreement & Landlord Consent': 'solstice_executed_lease_folsom.pdf',
    'Architectural Blueprint Set (PE/AIA Stamped)': 'solstice_pe_stamped_blueprints_v1.pdf',
    'Commercial Kitchen Hood & Wet Chemical Suppression Specs': 'roaster_hood_cutsheets_ansul.pdf',
  });

  // Calculate dynamic requirements
  const requirements = evaluateRequiredAgencies({
    industry,
    squareFootage,
    occupancyLoad,
    hasCommercialKitchen,
    hasHazardousMaterials,
    hasOutdoorPatio,
    isHistoricDistrict,
    estimatedRenovationBudget: renovationBudget,
  });

  const totalCalculatedFees = requirements.reduce((acc, r) => acc + r.fees, 0);
  const maxStatutoryDays = Math.max(...requirements.map(r => r.statutoryDays), 14);

  const handleDocumentPick = (docName: string) => {
    setUploadedDocNames(prev => ({
      ...prev,
      [docName]: `${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_signed.pdf`,
    }));
  };

  const handleFinalSubmit = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newId = `PG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const clearances = buildClearancesFromRequirements(requirements, todayStr);

    const newApp: PermitApplication = {
      id: newId,
      businessName,
      tradeName,
      entityType,
      tinTaxId,
      industry,
      applicant: {
        fullName: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        role: applicantRole,
      },
      location: {
        address,
        suiteUnit,
        city,
        state,
        zipCode,
        parcelLotNumber,
        zoneDesignation,
      },
      propertyDetails: {
        squareFootage,
        occupancyLoad,
        hasCommercialKitchen,
        hasHazardousMaterials,
        hasOutdoorPatio,
        isHistoricDistrict,
        estimatedRenovationBudget: renovationBudget,
      },
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      agencyClearances: clearances,
      totalFees: totalCalculatedFees,
      feesPaid: totalCalculatedFees,
      timeline: [
        {
          id: `tl-new-1`,
          timestamp: new Date().toISOString(),
          title: 'Master Single-Window Dossier Lodged',
          description: `Application packet concurrently routed to ${requirements.length} municipal authorities under City Fast-Track Act.`,
          actor: applicantName,
          actorRole: applicantRole,
          type: 'status_change',
        },
        {
          id: `tl-new-2`,
          timestamp: new Date().toISOString(),
          title: 'Consolidated Government Fee Settled',
          description: `Total municipal fee of $${totalCalculatedFees.toLocaleString()}.00 settled via unified digital single-window.`,
          actor: 'City Treasury Gateway',
          actorRole: 'Automated Clearinghouse',
          type: 'payment',
        },
      ],
    };

    onSubmitSuccess(newApp);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Single-Window Clearance Application
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Unified Commercial Permit Filing
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your project specifications once. Permit Genie coordinates approvals with all required agencies simultaneously.
            </p>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-4 text-xs font-medium">
          <div className={`p-2 rounded-lg border text-center transition-colors ${step === 1 ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold' : step > 1 ? 'bg-slate-50 border-slate-200 text-emerald-700' : 'text-slate-400 border-slate-100'}`}>
            <span>1. Legal Entity</span>
          </div>
          <div className={`p-2 rounded-lg border text-center transition-colors ${step === 2 ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold' : step > 2 ? 'bg-slate-50 border-slate-200 text-emerald-700' : 'text-slate-400 border-slate-100'}`}>
            <span>2. Space & Operations</span>
          </div>
          <div className={`p-2 rounded-lg border text-center transition-colors ${step === 3 ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold' : step > 3 ? 'bg-slate-50 border-slate-200 text-emerald-700' : 'text-slate-400 border-slate-100'}`}>
            <span>3. Agency Routing</span>
          </div>
          <div className={`p-2 rounded-lg border text-center transition-colors ${step === 4 ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold' : 'text-slate-400 border-slate-100'}`}>
            <span>4. Review & Pay</span>
          </div>
        </div>
      </div>

      {/* STEP 1: ENTITY INFO */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Corporate Entity & Authorised Signatory</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registered Legal Entity Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Trade Name / Doing Business As (DBA)
              </label>
              <input
                type="text"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Entity Legal Structure *
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LLC">Limited Liability Company (LLC)</option>
                <option value="Corporation">Corporation (C-Corp / S-Corp)</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">General or Limited Partnership</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Federal Tax ID (EIN) *
              </label>
              <input
                type="text"
                value={tinTaxId}
                onChange={(e) => setTinTaxId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Designated Primary Applicant & Point of Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corporate Role / Title *
                </label>
                <input
                  type="text"
                  value={applicantRole}
                  onChange={(e) => setApplicantRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue to Space & Operations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION & OPERATIONAL SPECS */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span>Premises Location & Operational Attributes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Industry & Activity Classification *
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as BusinessCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="food_hospitality">Food & Beverage / Restaurant / Cafe / Bakery</option>
                <option value="biotech_healthcare">Biotech, Life Science Labs & Outpatient Clinic</option>
                <option value="industrial_manufacturing">Light Manufacturing, Assembly & Craft Processing</option>
                <option value="retail_commercial">Retail Boutique, Showroom & Fitness Studio</option>
                <option value="technology_coworking">Technology Office & Shared Coworking Facility</option>
                <option value="education_childcare">Education, Vocational Training & Child Care</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Suite / Unit / Floor
              </label>
              <input
                type="text"
                value={suiteUnit}
                onChange={(e) => setSuiteUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Parcel / Tax Lot Identifier
              </label>
              <input
                type="text"
                value={parcelLotNumber}
                onChange={(e) => setParcelLotNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Usable Floor Area (Square Feet) *
              </label>
              <input
                type="number"
                value={squareFootage}
                onChange={(e) => setSquareFootage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Design Occupancy Capacity (Persons) *
              </label>
              <input
                type="number"
                value={occupancyLoad}
                onChange={(e) => setOccupancyLoad(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Estimated Renovation / Fit-Out Budget ($ USD) *
              </label>
              <input
                type="number"
                value={renovationBudget}
                onChange={(e) => setRenovationBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Operational Characteristic Toggles */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Specific Operational Factors (Controls Agency Routing)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasCommercialKitchen}
                  onChange={(e) => setHasCommercialKitchen(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Commercial Kitchen / Grease Hood</span>
                  <span className="text-[11px] text-slate-500">Requires Health and Fire Suppression review</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasHazardousMaterials}
                  onChange={(e) => setHasHazardousMaterials(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Hazardous Materials or Bio-Waste</span>
                  <span className="text-[11px] text-slate-500">Triggers EPA environmental review</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasOutdoorPatio}
                  onChange={(e) => setHasOutdoorPatio(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Sidewalk Dining / Outdoor Patio</span>
                  <span className="text-[11px] text-slate-500">Triggers pedestrian zoning encroachment</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={isHistoricDistrict}
                  onChange={(e) => setIsHistoricDistrict(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Historic District Landmark Building</span>
                  <span className="text-[11px] text-slate-500">Requires preservation architectural sign-off</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Generate Agency Clearances Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DYNAMIC AGENCY ROUTING MATRIX */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>Automatic Regulatory Routing Engine</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Clearances Required for {tradeName || businessName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on your business classification and operational footprint, Permit Genie has computed the exact required agencies.
            </p>
          </div>

          {/* Speedup Comparison Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-emerald-950 block text-sm">
                Fast-Track Concurrent Timeline: ~{maxStatutoryDays} Days
              </span>
              <span className="text-emerald-800">
                Traditional sequential city processing: ~{requirements.reduce((a, b) => a + b.statutoryDays, 0)} Days. You save ~{requirements.reduce((a, b) => a + b.statutoryDays, 0) - maxStatutoryDays} days through Permit Genie concurrent routing.
              </span>
            </div>
            <div className="font-mono font-bold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-lg text-sm shrink-0">
              ${totalCalculatedFees.toLocaleString()} Total Fees
            </div>
          </div>

          {/* List of Required Agencies */}
          <div className="space-y-3">
            {requirements.map((req) => {
              const meta = AGENCY_METADATA[req.agencyType];
              return (
                <div
                  key={req.agencyType}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                        {meta.code}
                      </span>
                      <span className="font-bold text-slate-900">{meta.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 font-mono">
                      <span>SLA: {req.statutoryDays} Days</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-slate-900">${req.fees}.00</span>
                    </div>
                  </div>

                  <div className="text-slate-800 font-medium">{req.permitName}</div>
                  <div className="text-[11px] text-slate-500">{req.description}</div>

                  {/* Mandatory docs checklist */}
                  <div className="pt-2 border-t border-slate-200/60 mt-2">
                    <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                      Required Technical Exhibits:
                    </div>
                    <div className="space-y-1">
                      {req.mandatoryDocuments.map((doc, idx) => {
                        const isAttached = !!uploadedDocNames[doc.name];
                        return (
                          <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200/60">
                            <span className="flex items-center gap-1.5">
                              {isAttached ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Info className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span>{doc.name}</span>
                            </span>

                            {isAttached ? (
                              <span className="text-[10px] font-mono text-emerald-700 font-medium">
                                Attached ({uploadedDocNames[doc.name]})
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDocumentPick(doc.name)}
                                className="text-[10px] text-indigo-600 font-semibold hover:underline"
                              >
                                Attach from Vault
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Proceed to Review & Single-Point Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SINGLE-WINDOW PAYMENT */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Final Dispatch & Unified Payment
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Confirm Single-Window Filing
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your unified filing summary. Upon confirmation, your master packet will be simultaneously submitted to {requirements.length} municipal agencies.
            </p>
          </div>

          {/* Dossier Summary Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Trade Name</span>
                <span className="font-bold text-slate-900">{tradeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Entity Structure</span>
                <span className="font-semibold text-slate-800">{entityType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Location</span>
                <span className="font-medium text-slate-800 truncate block">{address}, {city}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Signatory</span>
                <span className="font-medium text-slate-800">{applicantName}</span>
              </div>
            </div>
          </div>

          {/* Payment Terminal Box */}
          <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-700" />
                <span className="font-bold text-indigo-950 text-sm">
                  Consolidated Municipal Fee Clearinghouse
                </span>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                Zero Surcharge
              </span>
            </div>

            <div className="text-xs text-indigo-900 leading-relaxed">
              Instead of paying 5 separate municipal agencies with multiple checks and vouchers, Permit Genie dispatches the statutory fees via a single transaction.
            </div>

            <div className="pt-3 border-t border-indigo-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Total Statutory Filing Amount:</span>
              <span className="text-2xl font-bold font-mono text-indigo-900 tabular-nums">
                ${totalCalculatedFees.toLocaleString()}.00
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Master Dossier & Dispatch Clearances</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
