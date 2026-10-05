export type AgencyType = 
  | 'BUILDING_SAFETY'
  | 'FIRE_MARSHAL'
  | 'PUBLIC_HEALTH'
  | 'ENVIRONMENTAL'
  | 'ZONING_PLANNING'
  | 'COMMERCE_LABOR';

export type BusinessCategory = 
  | 'food_hospitality'
  | 'biotech_healthcare'
  | 'industrial_manufacturing'
  | 'retail_commercial'
  | 'technology_coworking'
  | 'education_childcare';

export type ClearanceStatus = 
  | 'PENDING_SUBMISSION'
  | 'UNDER_REVIEW'
  | 'INSPECTION_SCHEDULED'
  | 'ACTION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED';

export type ApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_PROGRESS'
  | 'QUERIES_PENDING'
  | 'APPROVED'
  | 'PARTIALLY_APPROVED';

export interface AgencyMeta {
  id: AgencyType;
  name: string;
  shortName: string;
  code: string;
  department: string;
  badgeColor: string;
  statutoryDays: number;
}

export interface OfficerQuery {
  id: string;
  date: string;
  officerName: string;
  officerRole: string;
  queryText: string;
  status: 'OPEN' | 'RESOLVED';
  responseText?: string;
  resolvedAt?: string;
  attachmentName?: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  category: 'LEGAL' | 'TECHNICAL' | 'SAFETY' | 'FINANCIAL';
  status: 'MISSING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  feedback?: string;
}

export interface AssignedInspector {
  name: string;
  title: string;
  badgeNumber: string;
  phone: string;
  email: string;
}

export interface AgencyClearance {
  id: string;
  agencyType: AgencyType;
  permitName: string;
  description: string;
  status: ClearanceStatus;
  submissionDate: string;
  slaDeadlineDate: string;
  statutoryDaysTotal: number;
  statutoryDaysRemaining: number;
  assignedInspector?: AssignedInspector;
  inspectionDate?: string;
  inspectionTimeSlot?: string;
  inspectionNotes?: string;
  fees: number;
  feePaid: boolean;
  queries: OfficerQuery[];
  documents: RequiredDocument[];
  approvalConditions?: string[];
  certificateNumber?: string;
  issuedAt?: string;
  validUntil?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  agencyType?: AgencyType;
  actor: string;
  actorRole: string;
  type: 'status_change' | 'document_uploaded' | 'inspection' | 'query' | 'payment' | 'approval';
}

export interface PermitApplication {
  id: string;
  businessName: string;
  tradeName: string; // DBA
  entityType: 'LLC' | 'Corporation' | 'Sole Proprietorship' | 'Partnership';
  tinTaxId: string;
  industry: BusinessCategory;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  location: {
    address: string;
    suiteUnit?: string;
    city: string;
    state: string;
    zipCode: string;
    parcelLotNumber: string;
    zoneDesignation: string;
  };
  propertyDetails: {
    squareFootage: number;
    occupancyLoad: number;
    hasCommercialKitchen: boolean;
    hasHazardousMaterials: boolean;
    hasOutdoorPatio: boolean;
    isHistoricDistrict: boolean;
    estimatedRenovationBudget: number;
  };
  status: ApplicationStatus;
  createdAt: string;
  submittedAt?: string;
  lastUpdatedAt: string;
  agencyClearances: AgencyClearance[];
  timeline: TimelineEvent[];
  totalFees: number;
  feesPaid: number;
}

export interface DocumentVaultItem {
  id: string;
  name: string;
  category: 'Corporate' | 'Architectural' | 'Environmental' | 'Safety' | 'Financial';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  expiryDate?: string;
  verified: boolean;
  linkedApplicationsCount: number;
}

export interface IndustryRulePreset {
  category: BusinessCategory;
  label: string;
  description: string;
  typicalAgencies: AgencyType[];
  averageTimelineDays: number;
  estimatedFeeRange: string;
  mandatoryDocs: string[];
}
