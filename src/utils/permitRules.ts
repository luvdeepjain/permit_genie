import { AgencyClearance, AgencyType, BusinessCategory, RequiredDocument } from '../types/permit';
import { AGENCY_METADATA } from './agencyConstants';

export interface EvaluationInput {
  industry: BusinessCategory;
  squareFootage: number;
  occupancyLoad: number;
  hasCommercialKitchen: boolean;
  hasHazardousMaterials: boolean;
  hasOutdoorPatio: boolean;
  isHistoricDistrict: boolean;
  estimatedRenovationBudget: number;
}

export interface GeneratedAgencyRequirement {
  agencyType: AgencyType;
  permitName: string;
  description: string;
  fees: number;
  statutoryDays: number;
  mandatoryDocuments: Array<{
    name: string;
    category: 'LEGAL' | 'TECHNICAL' | 'SAFETY' | 'FINANCIAL';
  }>;
}

export function evaluateRequiredAgencies(input: EvaluationInput): GeneratedAgencyRequirement[] {
  const requirements: GeneratedAgencyRequirement[] = [];

  // 1. Zoning & Planning is always required for commercial establishments
  let zoningDesc = 'Verification of permissible commercial land use and parking ratio under City Code.';
  if (input.hasOutdoorPatio) {
    zoningDesc += ' Includes public sidewalk dining & encroachment clearance.';
  }
  if (input.isHistoricDistrict) {
    zoningDesc += ' Requires Historic Preservation Review Board alignment.';
  }
  requirements.push({
    agencyType: 'ZONING_PLANNING',
    permitName: input.hasOutdoorPatio ? 'Commercial Land Use & Sidewalk Patio Authorization' : 'Commercial Use & Zoning Certificate',
    description: zoningDesc,
    fees: input.isHistoricDistrict ? 650 : 450,
    statutoryDays: input.isHistoricDistrict ? 18 : 14,
    mandatoryDocuments: [
      { name: 'Commercial Lease Agreement & Landlord Consent', category: 'LEGAL' },
      { name: 'Site Boundary & Zoning Plot Plan', category: 'TECHNICAL' },
      ...(input.hasOutdoorPatio ? [{ name: 'Pedestrian Egress & Sidewalk Seating Plan', category: 'TECHNICAL' as const }] : []),
    ],
  });

  // 2. Department of Buildings (DOB)
  const isMajorRenovation = input.estimatedRenovationBudget > 50000 || input.squareFootage > 2000;
  requirements.push({
    agencyType: 'BUILDING_SAFETY',
    permitName: isMajorRenovation ? 'Commercial Tenant Alteration & Structural Safety Permit' : 'Minor Interior Commercial Alteration Clearance',
    description: 'ADA compliance, structural load safety, mechanical HVAC ventilation, and electrical adequacy.',
    fees: Math.min(1800, Math.round(500 + input.estimatedRenovationBudget * 0.0025)),
    statutoryDays: isMajorRenovation ? 21 : 14,
    mandatoryDocuments: [
      { name: 'Architectural Blueprint Set (PE/AIA Stamped)', category: 'TECHNICAL' },
      { name: 'ADA Accessibility Compliance Checklist & Egress Details', category: 'TECHNICAL' },
      { name: 'Electrical & Plumbing Single-Line Diagrams', category: 'TECHNICAL' },
    ],
  });

  // 3. Fire Prevention Bureau
  requirements.push({
    agencyType: 'FIRE_MARSHAL',
    permitName: input.hasCommercialKitchen 
      ? 'Commercial Kitchen Hood Fire Suppression & Life Safety Permit' 
      : 'Assembly & Commercial Life Safety Inspection Clearance',
    description: input.hasCommercialKitchen 
      ? 'UL 300 hood suppression verification, emergency exits, and rapid evacuation pathway inspection.'
      : 'Egress path illumination, alarm notification devices, and fire extinguisher capacity compliance.',
    fees: input.hasCommercialKitchen ? 550 : 350,
    statutoryDays: 15,
    mandatoryDocuments: [
      { name: 'Emergency Evacuation & Illuminated Egress Layout', category: 'SAFETY' },
      ...(input.hasCommercialKitchen ? [{ name: 'Commercial Kitchen Hood & Wet Chemical Suppression Specs', category: 'SAFETY' as const }] : []),
    ],
  });

  // 4. Public Health & Food Sanitation (Required for Food, Childcare, Healthcare)
  if (input.hasCommercialKitchen || input.industry === 'food_hospitality' || input.industry === 'education_childcare') {
    requirements.push({
      agencyType: 'PUBLIC_HEALTH',
      permitName: 'Food Establishment Health Permit & Sanitary License',
      description: 'Food hygiene, mechanical dishwashing sanitization, potable water supply, and certified food managers.',
      fees: 400,
      statutoryDays: 18,
      mandatoryDocuments: [
        { name: 'Sanitary Equipment Schedule (NSF/ANSI Certified)', category: 'TECHNICAL' },
        { name: 'Certified Food Protection Manager Credential (ServSafe)', category: 'LEGAL' },
        { name: 'Grease Interceptor Plumbing Sizing Calculations', category: 'TECHNICAL' },
      ],
    });
  }

  // 5. Environmental Protection Agency (EPA) - Hazardous materials, Biotech, Industrial
  if (input.hasHazardousMaterials || input.industry === 'biotech_healthcare' || input.industry === 'industrial_manufacturing') {
    requirements.push({
      agencyType: 'ENVIRONMENTAL',
      permitName: 'Hazardous Waste & Environmental Emission Authorization',
      description: 'Industrial effluent pretreatment, hazardous material storage, air emission limits, and licensed waste haulage.',
      fees: 1200,
      statutoryDays: 25,
      mandatoryDocuments: [
        { name: 'Hazardous Materials Inventory Statement (HMIS) & SDS', category: 'SAFETY' },
        { name: 'Chemical Spill Containment & Neutralization Engineering Plan', category: 'TECHNICAL' },
        { name: 'Licensed Hazardous Waste Hauler Agreement', category: 'LEGAL' },
      ],
    });
  }

  // 6. Commerce & Labor Standards (Always required)
  requirements.push({
    agencyType: 'COMMERCE_LABOR',
    permitName: 'Municipal Business Operating Certificate & Tax Registration',
    description: 'City business registration, local payroll tax clearance, and statutory labor poster adherence.',
    fees: 200,
    statutoryDays: 10,
    mandatoryDocuments: [
      { name: 'Articles of Incorporation / Organization (State Seal)', category: 'LEGAL' },
      { name: 'Federal Employer Identification (FEIN) Verification Letter', category: 'FINANCIAL' },
    ],
  });

  return requirements;
}

export function buildClearancesFromRequirements(requirements: GeneratedAgencyRequirement[], submissionDateStr: string): AgencyClearance[] {
  return requirements.map((req, index) => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + req.statutoryDays);

    const docs: RequiredDocument[] = req.mandatoryDocuments.map((doc, docIdx) => ({
      id: `doc-${req.agencyType}-${docIdx + 1}`,
      name: doc.name,
      category: doc.category,
      status: 'UPLOADED',
      fileName: `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      fileSize: `${(Math.random() * 3 + 1.2).toFixed(1)} MB`,
      uploadedAt: submissionDateStr,
    }));

    return {
      id: `CLR-${req.agencyType.substring(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      agencyType: req.agencyType,
      permitName: req.permitName,
      description: req.description,
      status: 'UNDER_REVIEW',
      submissionDate: submissionDateStr,
      slaDeadlineDate: deadline.toISOString().split('T')[0],
      statutoryDaysTotal: req.statutoryDays,
      statutoryDaysRemaining: req.statutoryDays,
      fees: req.fees,
      feePaid: true,
      queries: [],
      documents: docs,
      assignedInspector: {
        name: index % 2 === 0 ? 'Marcus Vance, PE' : 'Captain Raymond Scott',
        title: index % 2 === 0 ? 'Senior Plan Examiner' : 'Bureau Field Inspector',
        badgeNumber: `CITY-${400 + index * 12}`,
        phone: '(415) 554-2000',
        email: `officer.${req.agencyType.toLowerCase()}@citygov.org`,
      },
    };
  });
}
