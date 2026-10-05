# Permit Genie

A centralized government clearance and multi-agency permit management platform built to streamline the approval process for entrepreneurs, business owners, and expanding enterprises.

Permit Genie replaces fragmented municipal websites and serial bureaucratic delays with a single-window portal where applicants apply once, track parallel reviews in real time, and manage compliance requirements across all relevant government authorities.

---

## Key Features

### 1. Single-Window Application Wizard
- **Unified Information Submission**: Enter legal entity, DBA, tax identification, and location details once.
- **Dynamic Regulatory Routing**: The system automatically computes the exact matrix of required municipal authorities based on operational parameters (e.g., commercial kitchen hood, hazardous materials, outdoor sidewalk seating, historic district preservation).
- **Consolidated Fee Clearinghouse**: Replaces fragmented checks and multiple agency fees with a unified statutory fee schedule.

### 2. Real-Time Multi-Agency Tracking
- **Inter-Agency Status Ribbon**: Visual indicators across all involved authorities (Department of Buildings, Fire Prevention Bureau, Public Health, Environmental Protection, Zoning Commission, and Commerce & Labor).
- **Statutory SLA Transparency**: Live countdown clocks tracking mandated review windows under municipal Fast-Track laws.
- **Concurrent Processing Engine**: Demonstrates how parallel processing reduces approval times from ~68+ days to ~18–24 days.

### 3. Dual-Role Architecture
- **Entrepreneur View**: File applications, monitor progress, resolve open queries, review scheduled inspections, and download official certificates.
- **City Case Officer / Reviewer Desk**: Municipal inspectors can switch between departments (DOB, Fire, Health, EPA, Zoning) to evaluate technical drawings, request clarifications, schedule on-site field inspections, or grant official clearances.

### 4. Direct Query & Deficiency Resolution
- **Official Clarification Threads**: Review inspector deficiency notices and submit formal rectifications with attached technical schematics without restarting the filing.
- **Status Synchronization**: Resolving inquiries automatically unblocks agency review and updates the statutory audit trail.

### 5. On-Site Inspection Coordinator
- View scheduled on-site audits, assigned inspector badge numbers, contact details, and directive checklists.

### 6. Interactive Permit Feasibility Calculator
- Discover required permits, estimated timeframes, and fee schedules by selecting industry types (Food & Beverage, Biotech, Light Manufacturing, Retail, Tech Office, Childcare) and property parameters before signing commercial leases.

### 7. Enterprise Document Vault
- Centralized storage for company records (Articles of Organization, PE-stamped architectural blueprints, liability insurance, hygiene certificates) with expiration alerts and multi-application mapping.

### 8. Consolidated Certificate of Occupancy
- Printable, official municipal certificate with tamper-evident digital verification hash, QR code, permitted occupancy loads, and authorized signatures.

---

## Participating Government Authorities

| Agency | Code | Jurisdiction |
| :--- | :--- | :--- |
| **City Planning & Zoning Commission** | `CPZC` | Permitted land use, spatial development & outdoor dining |
| **Department of Buildings & Safety** | `DOB` | Structural integrity, ADA compliance & MEP engineering |
| **Bureau of Fire Prevention** | `BFPS` | Life safety, emergency egress & commercial hood suppression |
| **Department of Public Health** | `DPH` | Commercial sanitation, food hygiene & plumbing standards |
| **Environmental Protection Agency** | `EPPC` | Effluent discharge, hazardous waste & emission controls |
| **Department of Commerce & Labor** | `DCLS` | General merchant licensing, payroll tax & labor standards |

---

## Technology Stack

- **Framework**: React 19 (TypeScript)
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **State & Persistence**: LocalStorage persistence with sample application datasets

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Running Locally
```bash
# Start the development server
npm run dev
```
Open your browser at `http://localhost:3000`.

### Building for Production
```bash
# Compile and create production build
npm run build

# Run TypeScript linter checks
npm run lint
```

---

## License

Apache-2.0
