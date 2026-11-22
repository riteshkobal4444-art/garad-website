import { ActivityMedia, getActivityBySlug } from './activities';

export type CsrProjectStatus =
  | 'Open for CSR Partnership'
  | 'Concept Under Development'
  | 'Implementation Completed'
  | 'Awaiting Project Approval';

export interface CsrHistoricalReference {
  heading: string;
  period: string;
  location: string;
  summary: string;
  verifiedHighlights: string[];
  linkedActivitySlug?: string;
  disclaimer: string;
}

export interface CsrProjectProfile {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  isPriority?: boolean;
  status: CsrProjectStatus;
  focusArea: string;
  shortDescription: string;
  cardMedia: ActivityMedia;
  targetBeneficiariesSummary: string;
  proposedGeographySummary: string;
  durationSummary: string;
  fundingSummary: string;
  fundingApprovalNote: string;
  /** Only set to a real URL when a final approved concept note PDF is uploaded to /public/assets/reports/. */
  conceptNotePdfUrl: string | null;
  conceptNoteStatusNote: string;
  /** Matches Preferred Project select option in the CSR Enquiry Form */
  enquiryProjectOption:
    | 'Sabse Bada Rupaiya'
    | 'Mission Bharari'
    | 'Garad Granthalay'
    | 'Project Urja';
  enquiryDefaultArea:
    | 'Education'
    | 'Financial Literacy'
    | 'Rural and Tribal Development'
    | 'Youth Development'
    | 'Community Development'
    | 'Other';
  /** Completed historical work kept strictly separate from proposed future targets */
  historicalRecord?: CsrHistoricalReference;
  /** Full 15-section structured CSR profile */
  detail: {
    overview: string[];
    socialNeed: string[];
    objectives: string[];
    targetBeneficiaries: string[];
    proposedGeography: string;
    implementationMethodology: string[];
    projectDuration: string;
    keyActivities: string[];
    expectedOutputs: string[];
    outcomeIndicators: string[];
    monitoringAndEvaluation: string[];
    fundingAndBudget: {
      headlineAmount: string;
      approvalStatus: string;
      breakdownNote: string;
      indicativeComponents: { item: string; note: string }[];
    };
    documentationAndReporting: string[];
  };
}

export interface WhyPartnerPillar {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface OrganisationalCredibilityItem {
  id: string;
  label: string;
  status: 'Verified' | 'Active — Details Pending Verification' | 'Pending Verification';
  detail: string;
}

export interface ImplementationStep {
  step: string;
  title: string;
  description: string;
}

export interface InstitutionalDocumentRecord {
  id: string;
  title: string;
  category: 'Statutory & Compliance' | 'Financial Governance' | 'Programme Documentation';
  description: string;
  availability:
    | 'Available on CSR Due Diligence Request'
    | 'Protected Institutional Record'
    | 'Pending Verification & Upload';
  /** Only populated once an approved public PDF is uploaded; never fake or broken. */
  publicPdfUrl: string | null;
}

export interface PartnershipModelItem {
  id: string;
  title: string;
  description: string;
  suitabilityNote: string;
}

export const CSR_HERO_MEDIA: ActivityMedia = {
  imagePath: null,
  alt: 'Garad Foundation community education and youth development field documentation in Maharashtra',
  caption:
    'Grassroots education, youth empowerment, and community outreach programmes coordinated by Garad Foundation in Thane and across Maharashtra.',
  dateRecorded: 'Thane & Maharashtra',
  locationRecorded: 'Field Archive — Authentic Photo Upload Ready',
  visualMotif: 'education',
  placeholderLabel: 'Garad Foundation Field Photography — Safeguarding Archive',
  safeguardingNote:
    'Authentic, consent-cleared Garad Foundation field photographs are published here as soon as archival image files are uploaded.',
};

export const WHY_PARTNER_PILLARS: WhyPartnerPillar[] = [
  {
    id: 'community-centred',
    number: '01',
    title: 'Community-Centred Implementation',
    description:
      'Working with schools, communities and local stakeholders to identify practical needs.',
  },
  {
    id: 'focused-programmes',
    number: '02',
    title: 'Focused Development Programmes',
    description:
      'Implementing initiatives in education, youth development and community empowerment.',
  },
  {
    id: 'documented-implementation',
    number: '03',
    title: 'Documented Implementation',
    description:
      'Maintaining project records, beneficiary information, photographs and implementation documentation.',
  },
  {
    id: 'responsible-reporting',
    number: '04',
    title: 'Responsible Reporting',
    description:
      'Providing appropriate project updates, expenditure records and completion documentation.',
  },
];

export const ORGANISATIONAL_CREDIBILITY_ITEMS: OrganisationalCredibilityItem[] = [
  {
    id: 'field-experience',
    label: 'Documented Programme Implementation',
    status: 'Verified',
    detail:
      'Six documented initiatives published in our FY 2020–21 digital archive across education, women’s health awareness, community welfare, and youth development.',
  },
  {
    id: '80g-approval',
    label: 'Section 80G Approval',
    status: 'Active — Details Pending Verification',
    detail:
      'Garad Foundation holds Section 80G approval. Official URN and certificate copy are shared during CSR onboarding and will be published once verified for public display.',
  },
  {
    id: 'society-12a-csr1',
    label: 'Registered Society, 12A & CSR-1 Registrations',
    status: 'Pending Verification',
    detail:
      'Statutory registration numbers and active certificates are furnished directly to corporate CSR teams upon due-diligence request; public certificate display is withheld until verified.',
  },
  {
    id: 'audited-financials',
    label: 'Audited Financial Statements',
    status: 'Pending Verification',
    detail:
      'Maintained separately as institutional financial records and provided directly to corporate CSR managers and grant reviewers during formal review.',
  },
];

const missionBharariPhase1 = getActivityBySlug('mission-bharari-phase-1');

export const CSR_PROJECTS: CsrProjectProfile[] = [
  {
    id: 'sabse-bada-rupaiya',
    slug: 'sabse-bada-rupaiya',
    name: 'Sabse Bada Rupaiya',
    subtitle: 'Money Smart Starts Young',
    isPriority: true,
    status: 'Awaiting Project Approval',
    focusArea: 'Financial Literacy & Youth Education',
    shortDescription:
      'A school-based financial literacy initiative designed to introduce students to saving, budgeting, responsible spending, financial goal-setting and safe digital financial practices.',
    cardMedia: {
      imagePath: null,
      alt: 'Sabse Bada Rupaiya — school-based financial literacy programme for Standards VII to X students in Thane',
      caption:
        'Priority programme design for school-based financial literacy across four schools in Thane.',
      dateRecorded: 'Proposed Phase 1',
      locationRecorded: 'Thane, Maharashtra',
      visualMotif: 'literature',
      placeholderLabel: 'Sabse Bada Rupaiya — Programme Visual Pending Upload',
      safeguardingNote:
        'Consent-cleared school session photographs will be uploaded following programme approval and classroom implementation.',
    },
    targetBeneficiariesSummary:
      'Students in Standards VII–X (Proposed Phase 1: 100 students across 4 schools)',
    proposedGeographySummary: 'Four partner schools in Thane, Maharashtra',
    durationSummary: 'Final implementation calendar to be confirmed upon approval',
    fundingSummary: '₹1,00,000 (Draft Estimate — Pending Final Budget Approval)',
    fundingApprovalNote:
      'Draft funding estimate requiring final internal and partner budget approval before project sanction.',
    conceptNotePdfUrl: null,
    conceptNoteStatusNote:
      'Concept note PDF is undergoing final review and will be enabled for download once formally approved and uploaded.',
    enquiryProjectOption: 'Sabse Bada Rupaiya',
    enquiryDefaultArea: 'Financial Literacy',
    detail: {
      overview: [
        'Sabse Bada Rupaiya ("Money Smart Starts Young") is Garad Foundation’s priority school-based financial literacy initiative developed for students in Standards VII–X.',
        'The programme introduces foundational personal finance habits early—covering saving, budgeting, distinguishing needs from wants, goal-setting, and navigating digital financial platforms safely—through age-appropriate, interactive classroom sessions.',
        'Proposed Phase 1 is scoped for four schools and 100 students in Thane, Maharashtra, with a draft funding estimate of ₹1,00,000 subject to final budget review and formal approval by Garad Foundation.',
      ],
      socialNeed: [
        'Adolescent students increasingly encounter cashless transactions, mobile payment tools, and household spending decisions without structured school-level financial education.',
        'Early exposure to practical money management, basic banking concepts, and digital safety helps young people avoid common financial pitfalls and build disciplined habits before entering higher education or the workforce.',
      ],
      objectives: [
        'Introduce students in Standards VII–X to core principles of saving, budgeting, and responsible spending.',
        'Build practical understanding of short-term and long-term financial goal-setting.',
        'Equip students with essential awareness of safe digital financial practices and common online fraud risks.',
        'Provide structured learning workbooks and classroom exercises that reinforce everyday decision-making.',
      ],
      targetBeneficiaries: [
        'Primary cohort: School students enrolled in Standards VII–X.',
        'Proposed Phase 1 scale: 100 students across 4 partner schools in Thane (proposed pilot target subject to school onboarding and final approval).',
      ],
      proposedGeography:
        'Thane, Maharashtra (four participating schools to be confirmed during Phase 1 school onboarding).',
      implementationMethodology: [
        'Partner school orientation and scheduling with school principals and designated teachers.',
        'Structured, facilitator-led interactive classroom modules tailored for Standards VII–X.',
        'Hands-on budgeting, goal-mapping, and digital-safety scenario exercises using student workbooks.',
        'Pre-session and post-session comprehension check-ins to gauge student understanding, subject to final M&E design.',
      ],
      projectDuration:
        'Proposed Phase 1 duration and school session calendar are being finalised and will be confirmed prior to formal CSR agreement.',
      keyActivities: [
        'Curriculum and bilingual/local-context student workbook finalisation.',
        'Selection and coordination with four participating schools in Thane.',
        'Delivery of structured financial literacy classroom sessions covering saving, budgeting, responsible spending, goal-setting, and safe digital financial practices.',
        'Documentation of attendance, facilitator observations, and completion summary.',
      ],
      expectedOutputs: [
        'Proposed delivery of structured financial literacy sessions across 4 partner schools in Thane (subject to approval).',
        'Proposed direct participation of 100 students from Standards VII–X.',
        'Distribution of age-appropriate financial literacy learning materials to participating students.',
      ],
      outcomeIndicators: [
        'Demonstrated student understanding of saving, basic budgeting, and distinguishing needs vs. wants (measured via session check-ins where adopted).',
        'Student awareness of safe digital payment habits and common digital-fraud warning signs.',
        'School faculty feedback on relevance and classroom applicability.',
      ],
      monitoringAndEvaluation: [
        'School-wise student attendance sheets and session completion logs.',
        'Simple pre- and post-programme comprehension exercises calibrated to Standards VII–X.',
        'Facilitator field notes and safeguarding-compliant photographic documentation (subject to school and guardian consent).',
      ],
      fundingAndBudget: {
        headlineAmount: '₹1,00,000 (Draft Estimate)',
        approvalStatus:
          'Draft estimate requiring final budget approval by Garad Foundation before being published as a final sanctioned budget.',
        breakdownNote:
          'Itemised rupee allocations will be finalised and shared during formal CSR proposal submission once the Phase 1 budget is approved.',
        indicativeComponents: [
          {
            item: 'Curriculum & Student Learning Materials',
            note: 'Workbooks, activity sheets, and visual classroom aids (allocation pending final approval).',
          },
          {
            item: 'Facilitator & Classroom Delivery Coordination',
            note: 'Session facilitation, school outreach, and local coordination across 4 Thane schools.',
          },
          {
            item: 'Monitoring, Documentation & Completion Reporting',
            note: 'Attendance documentation, assessment compilation, and CSR completion report preparation.',
          },
        ],
      },
      documentationAndReporting: [
        'School onboarding summary and implementation schedule.',
        'Participant attendance records and session activity summary.',
        'Expenditure statement and supporting bills aligned with the approved grant agreement.',
        'Final Project Completion Report upon conclusion of Phase 1.',
      ],
    },
  },
  {
    id: 'mission-bharari',
    slug: 'mission-bharari',
    name: 'Mission Bharari',
    subtitle: 'Rural & Tribal Educational Support Initiative',
    status: 'Concept Under Development',
    focusArea: 'Rural & Tribal Education',
    shortDescription:
      'An educational support initiative focused on improving learning opportunities and providing relevant educational assistance to students in rural and tribal communities.',
    cardMedia: {
      imagePath: null,
      alt: 'Mission Bharari — rural and tribal educational support initiative by Garad Foundation',
      caption:
        'Educational support initiative building on documented Phase 1 work across 10 Zilla Parishad schools in Bhor Taluka, Pune.',
      dateRecorded: 'Phase 1 Completed (Feb 2021) · Next Phase Under Development',
      locationRecorded: 'Rural & Tribal Communities, Maharashtra',
      visualMotif: 'education',
      placeholderLabel: 'Mission Bharari — Field Documentation Archive',
      safeguardingNote:
        'Authentic school photography is published only upon verified institutional and guardian consent.',
    },
    targetBeneficiariesSummary:
      'Next proposed phase cohort to be finalised after baseline survey (separate from completed Phase 1 reach)',
    proposedGeographySummary:
      'Rural and tribal school clusters in Maharashtra (next-phase geography under assessment)',
    durationSummary: 'Next proposed phase timeline under development',
    fundingSummary: 'Pending next-phase baseline survey and approved budget',
    fundingApprovalNote:
      'Future phase budget and beneficiary targets will be published only after baseline assessment and formal approval.',
    conceptNotePdfUrl: null,
    conceptNoteStatusNote:
      'Next-phase concept note is under development. Completed Phase 1 documentation is available now as a verified Activity Report PDF.',
    enquiryProjectOption: 'Mission Bharari',
    enquiryDefaultArea: 'Rural and Tribal Development',
    historicalRecord: {
      heading: 'Completed Historical Implementation: Mission Bharari – Phase 1',
      period: missionBharariPhase1?.date || '3 February 2021 (FY 2020–21)',
      location:
        missionBharariPhase1?.location ||
        '10 Zilla Parishad Schools, Bhor Taluka, Pune District, Maharashtra',
      summary:
        'Garad Foundation completed Mission Bharari – Phase 1 through a three-stage workflow: an on-ground baseline survey across 10 Zilla Parishad schools, 100% volunteer-led digital crowdfunding, and direct COVID-safe handover of complete individual stationery kits.',
      verifiedHighlights: [
        '220 rural students supported across 10 surveyed Zilla Parishad schools (internal FY 2020–21 activity reporting).',
        'Individual stationery kits included notebooks, pens, geometry kits, erasers, and essential school supplies.',
        'Executed with direct school coordination and zero intermediary distribution delays.',
      ],
      linkedActivitySlug: 'mission-bharari-phase-1',
      disclaimer:
        'Historical Separation Notice: The 220 students supported in Phase 1 (2021) represent completed historical work and are NOT counted as beneficiaries of any future CSR-funded phase.',
    },
    detail: {
      overview: [
        'Mission Bharari is Garad Foundation’s educational support initiative dedicated to reducing practical learning barriers for students in rural and tribal schools across Maharashtra.',
        'Building on the Foundation’s documented Phase 1 implementation in Bhor Taluka (February 2021), the next phase of Mission Bharari is currently under concept development to identify underserved school clusters, confirm material and learning needs via baseline surveys, and design a structured partnership proposal.',
        'In line with institutional reporting integrity, completed Phase 1 figures are documented strictly as historical implementation experience and kept separate from future proposed targets.',
      ],
      socialNeed: [
        'Students in remote rural and tribal Zilla Parishad schools frequently lack essential individual learning materials, structured stationery kits, and supplementary academic resources needed for consistent school participation.',
        'Targeted, survey-backed educational assistance addresses immediate material gaps without imposing costs on low-income farming and tribal households.',
      ],
      objectives: [
        'Conduct on-ground school baseline surveys before procurement to confirm actual student requirements.',
        'Provide relevant, quality educational support materials directly to students in identified rural and tribal schools.',
        'Strengthen classroom readiness and continuity of schooling in partnership with local headmasters and teachers.',
      ],
      targetBeneficiaries: [
        'Proposed future cohort: School students in identified rural and tribal communities (exact student count and school roster will be determined after next-phase baseline mapping and partner approval).',
        'Historical reference (completed, separate from future targets): 220 students across 10 Zilla Parishad schools in Bhor Taluka, Pune District during Phase 1 (3 February 2021).',
      ],
      proposedGeography:
        'Underserved rural and tribal school clusters in Maharashtra (specific talukas and partner schools for the next phase will be finalised during baseline assessment).',
      implementationMethodology: [
        'Stage 1 — School Baseline Survey: Field visits to shortlisted schools to verify student counts and priority educational needs.',
        'Stage 2 — Programme Design & Procurement: Finalisation of kit or educational support specifications, partner budget approval, and transparent procurement.',
        'Stage 3 — Direct School Distribution & Follow-Up: Coordinated handover with school authorities, documentation of distribution logs, and post-implementation reporting.',
      ],
      projectDuration:
        'Next-phase schedule will be defined in alignment with the academic calendar and partner CSR agreement once the concept is approved.',
      keyActivities: [
        'Field needs assessment and school headmaster consultation.',
        'Preparation of tailored educational assistance bundles or school support inputs.',
        'Coordinated on-site handover and school-level verification acknowledgements.',
        'Compilation of beneficiary logs and CSR completion documentation.',
      ],
      expectedOutputs: [
        'Baseline needs assessment report covering shortlisted rural or tribal schools.',
        'Verified delivery of approved educational materials/assistance directly to enrolled students (exact quantitative targets to be established in the approved phase proposal).',
      ],
      outcomeIndicators: [
        'Reduction in student-level material barriers to daily classroom and homework participation.',
        'School headmaster and teacher feedback on material utility and student readiness.',
        'Verification of 100% direct handover against baseline school registers.',
      ],
      monitoringAndEvaluation: [
        'Pre-implementation school baseline sheets verified with school staff.',
        'School-wise distribution logs and acknowledgement receipts.',
        'Safeguarding-compliant field documentation and completion reporting.',
      ],
      fundingAndBudget: {
        headlineAmount: 'Under Development (Pending Baseline & Approval)',
        approvalStatus:
          'No unapproved budget is published for the upcoming phase. A detailed school-wise budget will be prepared after baseline survey and partner scoping.',
        breakdownNote:
          'Corporate partners interested in co-designing a rural or tribal school cluster under Mission Bharari may initiate a scoping discussion using the CSR enquiry form.',
        indicativeComponents: [
          {
            item: 'Baseline School Survey & Needs Mapping',
            note: 'On-ground verification of student rosters and material requirements.',
          },
          {
            item: 'Educational Kits & Learning Support Procurement',
            note: 'Directly sourced notebooks, stationery, or grade-appropriate educational resources.',
          },
          {
            item: 'Logistics, School Coordination & Reporting',
            note: 'Safe transport to rural schools, distribution coordination, and completion documentation.',
          },
        ],
      },
      documentationAndReporting: [
        'Baseline survey summary prior to implementation.',
        'School-wise distribution records and acknowledgements.',
        'Itemised expenditure documentation and vouchers as agreed.',
        'Activity / Project Completion Report (see published Phase 1 Activity Report PDF for documentation format).',
      ],
    },
  },
  {
    id: 'garad-granthalay',
    slug: 'garad-granthalay',
    name: 'Garad Granthalay',
    subtitle: 'Rural Library & Reading-Space Initiative',
    status: 'Concept Under Development',
    focusArea: 'Rural Libraries & Reading Habits',
    shortDescription:
      'A rural library and reading-space development initiative aimed at encouraging reading habits and improving access to educational resources for school students.',
    cardMedia: {
      imagePath: null,
      alt: 'Garad Granthalay — rural library and student reading-space development concept by Garad Foundation',
      caption:
        'Concept-stage rural library and reading-space initiative focused on encouraging everyday reading among school students.',
      dateRecorded: 'Concept Under Development',
      locationRecorded: 'Rural Schools / Communities, Maharashtra',
      visualMotif: 'culture',
      placeholderLabel: 'Garad Granthalay — Reading Space Concept',
      safeguardingNote:
        'Project photographs will be documented and published following site selection, setup, and safeguarding clearance.',
    },
    targetBeneficiariesSummary:
      'School students in rural communities (final beneficiary target pending project design and approval)',
    proposedGeographySummary:
      'Rural school or community spaces in Maharashtra (sites to be identified during design phase)',
    durationSummary: 'To be finalised following site assessment and project design',
    fundingSummary: 'Budget not yet finalised (Concept Under Development)',
    fundingApprovalNote:
      'No unapproved budget or beneficiary target is published; scope and costs will be defined during formal project design.',
    conceptNotePdfUrl: null,
    conceptNoteStatusNote:
      'Concept note is currently under development and will be uploaded only after internal review and approval.',
    enquiryProjectOption: 'Garad Granthalay',
    enquiryDefaultArea: 'Education',
    detail: {
      overview: [
        'Garad Granthalay is a rural library and reading-space development initiative currently under concept development at Garad Foundation.',
        'The initiative aims to nurture consistent reading habits, improve access to age-appropriate books and reference resources, and create welcoming study environments for school students in underserved rural settings.',
        'Specific locations, beneficiary counts, and funding requirements are intentionally withheld until site selection, community consultation, and formal budget approval are completed.',
      ],
      socialNeed: [
        'Many rural school students have limited access to non-textbook reading material, Marathi and bilingual storybooks, general knowledge books, or quiet study spaces outside formal classroom hours.',
        'Accessible school or village reading spaces support comprehension, curiosity, vocabulary growth, and independent learning.',
      ],
      objectives: [
        'Improve student access to curated, age-appropriate books and educational reading materials.',
        'Establish organised, welcoming reading and study spaces in collaboration with local schools or community caretakers.',
        'Encourage sustained reading habits through a practical library management and utilisation plan.',
      ],
      targetBeneficiaries: [
        'Rural school students (specific grade bands and student counts will be confirmed once partner school or community sites are selected and approved).',
      ],
      proposedGeography:
        'Rural areas of Maharashtra (exact village or school locations pending baseline scoping).',
      implementationMethodology: [
        'Site feasibility assessment and space readiness confirmation with local school or community stakeholders.',
        'Curation of age-appropriate books, learning resources, and durable shelving/reading furniture.',
        'Installation of reading space and orientation of a local teacher or coordinator on issue/return registers and care.',
        'Periodic utilisation review to confirm ongoing book borrowing and reading engagement.',
      ],
      projectDuration:
        'Setup and utilisation monitoring period will be defined during detailed project design.',
      keyActivities: [
        'Selection and curation of books and reading material suited to student age groups (subject to project design).',
        'Provision of bookshelves and functional study space elements (subject to project design).',
        'Provision of supplementary learning resources (subject to project design).',
        'Development of a simple library management and utilisation plan with local custodians.',
      ],
      expectedOutputs: [
        'Functional rural reading space equipped with curated books, storage, and basic study infrastructure (final unit specifications subject to approved design).',
        'Established borrowing register and local utilisation guidelines.',
      ],
      outcomeIndicators: [
        'Regular student footfall and book circulation tracked through library registers (where implemented).',
        'Teacher and student feedback on accessibility and reading engagement.',
      ],
      monitoringAndEvaluation: [
        'Inventory catalogue of books and library assets supplied.',
        'Basic borrowing/utilisation logs maintained by the host school or local coordinator.',
        'Periodic check-in visits and completion documentation.',
      ],
      fundingAndBudget: {
        headlineAmount: 'Pending Project Design & Approval',
        approvalStatus:
          'No draft or final budget is published while Garad Granthalay remains in Concept Under Development.',
        breakdownNote:
          'Potential components below reflect indicative design elements and are subject to site assessment and partner scope.',
        indicativeComponents: [
          {
            item: 'Books and Reading Material',
            note: 'Curated Marathi, bilingual, and educational books (subject to project design).',
          },
          {
            item: 'Bookshelves & Study Spaces',
            note: 'Durable shelving, seating, or basic reading-corner setup based on host site needs.',
          },
          {
            item: 'Learning Resources & Utilisation Plan',
            note: 'Supplementary educational charts/materials and simple cataloguing/borrowing registers.',
          },
        ],
      },
      documentationAndReporting: [
        'Site readiness confirmation and curated asset inventory list.',
        'Installation record and utilisation guidelines.',
        'Expenditure records and completion report aligned to approved partnership scope.',
      ],
    },
  },
  {
    id: 'project-urja',
    slug: 'project-urja',
    name: 'Project Urja',
    subtitle: 'Documented Educational Initiative',
    status: 'Implementation Completed',
    focusArea: 'Education & Student Support',
    shortDescription:
      'An education-related initiative based on Garad Foundation’s documented programme experience. Detailed historical archive dossier and any future-phase specifications remain subject to internal record confirmation.',
    cardMedia: {
      imagePath: null,
      alt: 'Project Urja — documented educational initiative by Garad Foundation',
      caption:
        'Education-focused initiative grounded in Garad Foundation’s documented grassroots programme experience.',
      dateRecorded: 'Historical Programme Record',
      locationRecorded: 'Maharashtra (Archive Confirmation Pending)',
      visualMotif: 'welfare',
      placeholderLabel: 'Project Urja — Historical Programme Record',
      safeguardingNote:
        'Only verified historical documentation is published; additional photographs and records are awaiting archival confirmation.',
    },
    targetBeneficiariesSummary:
      'Student beneficiaries per documented Foundation programme records (specific historical count awaiting archival upload)',
    proposedGeographySummary:
      'Maharashtra (historical implementation geography; no new unapproved phase published)',
    durationSummary: 'Historical implementation completed',
    fundingSummary: 'No new funding requirement published (Historical Record)',
    fundingApprovalNote:
      'Presented as documented programme experience. Garad Foundation has not published new components or a future funding ask for Project Urja.',
    conceptNotePdfUrl: null,
    conceptNoteStatusNote:
      'Historical project dossier PDF is pending archival consolidation and internal approval before public upload.',
    enquiryProjectOption: 'Project Urja',
    enquiryDefaultArea: 'Education',
    historicalRecord: {
      heading: 'Archival Documentation & Verification Status',
      period: 'Documented Historical Programme Experience',
      location: 'Maharashtra',
      summary:
        'Project Urja reflects Garad Foundation’s documented education-focused grassroots work. Consistent with our zero-fabrication reporting standard, this profile does not invent new project components, beneficiary counts, or future funding asks beyond confirmed records.',
      verifiedHighlights: [
        'Grounded in Garad Foundation’s education and youth development implementation track record.',
        'Detailed historical beneficiary logs, dates, and location specifics for Project Urja are flagged for archival verification and upload by Garad Foundation.',
        'No speculative future phase budget is published without formal programme approval.',
      ],
      disclaimer:
        'Verification Notice: Full historical documentation for Project Urja is awaiting final archival verification and upload; partners wishing to review historical education records may request them via the CSR enquiry form.',
    },
    detail: {
      overview: [
        'Project Urja is an education-related initiative rooted in Garad Foundation’s documented grassroots programme experience.',
        'To maintain strict accuracy for corporate CSR teams and grant reviewers, this profile summarises Project Urja strictly within confirmed scope—without inventing unverified project components, speculative beneficiary metrics, or unapproved future budgets.',
      ],
      socialNeed: [
        'Underserved students in Maharashtra benefit from practical educational encouragement, structured academic support, and community-backed learning initiatives.',
      ],
      objectives: [
        'Support student learning continuity and educational engagement in line with Garad Foundation’s core education focus.',
        'Document grassroots educational implementation transparently for institutional stakeholders.',
      ],
      targetBeneficiaries: [
        'Students served under Garad Foundation’s documented Project Urja activities (exact historical beneficiary disaggregation awaiting archival verification before public display).',
      ],
      proposedGeography:
        'Maharashtra (historical implementation footprint; no unapproved future expansion geography is claimed).',
      implementationMethodology: [
        'Implemented through Garad Foundation’s community-centred volunteer and local stakeholder coordination model.',
        'Detailed historical execution records are being consolidated into Garad Foundation’s standardised CSR reporting format.',
      ],
      projectDuration:
        'Historical implementation completed; no new active timeline has been approved for public release.',
      keyActivities: [
        'Education-focused student support activities aligned with documented Foundation records (specific historical activity log pending archival confirmation).',
      ],
      expectedOutputs: [
        'No future outputs are projected here while Project Urja is listed as a completed historical record without an approved renewal proposal.',
      ],
      outcomeIndicators: [
        'Historical implementation learnings inform Garad Foundation’s ongoing education programme design and school outreach standards.',
      ],
      monitoringAndEvaluation: [
        'Historical records are reviewed against Garad Foundation’s documentation standards prior to inclusion in public CSR dossiers.',
      ],
      fundingAndBudget: {
        headlineAmount: 'No Active Funding Ask Published',
        approvalStatus:
          'Implementation Completed. No future funding requirement has been approved or published for Project Urja.',
        breakdownNote:
          'Organisations interested in supporting Garad Foundation’s active education pipeline may review Sabse Bada Rupaiya, Mission Bharari, or initiate an open partnership conversation.',
        indicativeComponents: [
          {
            item: 'Historical Archive Consolidation',
            note: 'Verification of archival Project Urja records prior to publishing any standalone historical PDF.',
          },
        ],
      },
      documentationAndReporting: [
        'Relevant historical education records and published FY 2020–21 Activity Reports are available for institutional review.',
        'Additional Project Urja documentation will be uploaded upon archival verification.',
      ],
    },
  },
];

export function getCsrProjectBySlug(slug: string): CsrProjectProfile | undefined {
  return CSR_PROJECTS.find((p) => p.slug === slug);
}

export const IMPLEMENTATION_STEPS: ImplementationStep[] = [
  {
    step: '01',
    title: 'Understand the Need',
    description: 'Identify community and school-level requirements.',
  },
  {
    step: '02',
    title: 'Plan the Programme',
    description:
      'Develop objectives, beneficiary criteria, activities, budgets and implementation timelines.',
  },
  {
    step: '03',
    title: 'Implement Responsibly',
    description:
      'Coordinate with schools, community stakeholders and programme facilitators.',
  },
  {
    step: '04',
    title: 'Monitor Progress',
    description:
      'Maintain attendance, beneficiary records, photographs and assessment information as appropriate.',
  },
  {
    step: '05',
    title: 'Report Transparently',
    description:
      'Share implementation updates, verified outcomes, expenditure information and completion reports.',
  },
];

export const INSTITUTIONAL_DOCUMENTS: InstitutionalDocumentRecord[] = [
  {
    id: 'society-registration',
    title: 'Society Registration Certificate',
    category: 'Statutory & Compliance',
    description:
      'Founding organisational registration certificate maintained in Garad Foundation’s compliance records.',
    availability: 'Available on CSR Due Diligence Request',
    publicPdfUrl: null,
  },
  {
    id: '12a-approval',
    title: '12A Registration / Approval',
    category: 'Statutory & Compliance',
    description:
      'Income Tax Section 12A registration documentation provided to CSR teams following verification.',
    availability: 'Pending Verification & Upload',
    publicPdfUrl: null,
  },
  {
    id: '80g-approval',
    title: '80G Approval Certificate',
    category: 'Statutory & Compliance',
    description:
      'Garad Foundation holds Section 80G approval. Verified certificate copy is shared during CSR due diligence and will be published once confirmed for public release.',
    availability: 'Available on CSR Due Diligence Request',
    publicPdfUrl: null,
  },
  {
    id: 'csr-1-registration',
    title: 'CSR-1 Registration',
    category: 'Statutory & Compliance',
    description:
      'MCA CSR-1 registration record for eligible corporate CSR partnerships, furnished upon confirmation.',
    availability: 'Pending Verification & Upload',
    publicPdfUrl: null,
  },
  {
    id: 'pan-details',
    title: 'PAN & Banking Verification Details',
    category: 'Financial Governance',
    description:
      'Protected statutory tax identifier and institutional banking details shared securely only during formal CSR onboarding.',
    availability: 'Protected Institutional Record',
    publicPdfUrl: null,
  },
  {
    id: 'audited-financials',
    title: 'Audited Financial Statements',
    category: 'Financial Governance',
    description:
      'Certified Income & Expenditure statements and Balance Sheets maintained on record and shared directly with institutional donors and CSR reviewers.',
    availability: 'Available on CSR Due Diligence Request',
    publicPdfUrl: null,
  },
  {
    id: 'project-completion-reports',
    title: 'Project Completion Reports',
    category: 'Programme Documentation',
    description:
      'Documented FY 2020–21 field completion records are published in our Activity Reports section; dedicated CSR grant completion dossiers are furnished per partner agreement.',
    availability: 'Available on CSR Due Diligence Request',
    publicPdfUrl: null,
  },
];

export const PARTNERSHIP_MODELS: PartnershipModelItem[] = [
  {
    id: 'project-csr-funding',
    title: 'Project-Based CSR Funding',
    description:
      'Support a specific education or community development project.',
    suitabilityNote:
      'Structured around defined objectives, school or community scope, budget approval, and completion reporting.',
  },
  {
    id: 'programme-support',
    title: 'Programme Support',
    description:
      'Support programme implementation over an agreed period.',
    suitabilityNote:
      'Enables sustained coordination across an academic term or multi-stage grassroots initiative.',
  },
  {
    id: 'educational-resources',
    title: 'Educational Resources',
    description:
      'Contribute books, learning materials and relevant educational resources.',
    suitabilityNote:
      'Supports school stationery drives, student learning workbooks, and rural reading-space collections.',
  },
  {
    id: 'employee-volunteering',
    title: 'Employee Volunteering',
    description:
      'Explore meaningful volunteering opportunities based on actual programme requirements.',
    suitabilityNote:
      'Designed around genuine school and community needs rather than disruptive one-off events.',
  },
];
