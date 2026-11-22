/**
 * Reusable Annual Report Data Schema & FY 2020-21 Edition Dataset
 * ---------------------------------------------------------------------------
 * To generate a future Annual Report (e.g. FY 2021-22, FY 2022-23), duplicate
 * this data object, update the year, reporting period, verified figures,
 * projects, financial rows, photos, and messages, and pass it to
 * `generateAnnualReportPdf(reportData, outputPath)`.
 *
 * Strictly factual rule: Never invent registration numbers, financial figures,
 * partner names, quotes, or beneficiary counts. Use explicit editable
 * placeholders wherever verified records are still pending insertion.
 */

export interface AnnualReportBranding {
  organisationName: string;
  /**
   * Relative path from project root to the official unmodified Garad Foundation logo
   * (PNG or JPG with transparent or light background).
   * Drop the official file at `public/assets/branding/garad-foundation-logo.png`.
   */
  logoPath: string;
  locationLabel: string;
}

export interface AnnualReportImpactItem {
  value: string;
  label: string;
  detail: string;
  icon: 'beneficiaries' | 'projects' | 'volunteers' | 'funds' | 'locations' | 'schools';
  isPlaceholder?: boolean;
}

export interface AnnualReportProject {
  id: string;
  name: string;
  subtitle: string;
  statusTag: string;
  isPlaceholderRecord?: boolean;
  backgroundAndNeed: string[];
  objectives: string[];
  activitiesConducted: string[];
  location: string;
  beneficiaries: string;
  outcomes: string[];
  /** Relative path from project root to a verified, consent-cleared photograph (optional). */
  photoPath?: string | null;
  photoCaption?: string;
  /** Include ONLY when an authentic, authorised testimonial/quote exists. */
  testimonial?: {
    quote: string;
    attribution: string;
  } | null;
}

export interface AnnualReportFinancialLine {
  category: string;
  amountLabel: string;
  /** Optional numeric value (in INR) used to auto-render expenditure charts when audited figures exist. */
  amountNumeric?: number | null;
  notes: string;
}

export interface AnnualReportPartner {
  category: string;
  name: string;
  role: string;
  isPlaceholder?: boolean;
}

export interface AnnualReportStory {
  label: string;
  personName: string;
  location: string;
  background: string;
  whatChanged: string;
  initiativeContribution: string;
  consentStatus: string;
  photoPath?: string | null;
  photoCaption?: string;
}

export interface AnnualReportData {
  id: string;
  reportTitle: string;
  reportYearLabel: string;
  reportingPeriod: string;
  tagline: string;
  marathiSubline?: string;
  branding: AnnualReportBranding;
  cover: {
    photoPath: string | null;
    photoCaption: string;
    editionNote: string;
    metaSummary: [string, string][];
  };
  about: {
    overviewParagraphs: string[];
    vision: string;
    mission: string;
    coreValues: { title: string; description: string }[];
    approachPillars: { title: string; description: string }[];
    foundingAndRegistration: [string, string][];
  };
  founderMessage: {
    heading: string;
    salutation: string;
    paragraphs: string[];
    authorName: string;
    authorRole: string;
    photoPath?: string | null;
    signaturePath?: string | null;
    editorialNote: string;
  };
  impactAtAGlance: {
    intro: string;
    metrics: AnnualReportImpactItem[];
    methodologyNote: string;
    verifiedActivitySummaryRows: string[][];
  };
  projects: {
    intro: string;
    items: AnnualReportProject[];
  };
  financialOverview: {
    intro: string;
    summaryMetrics: { label: string; value: string; note: string; isPlaceholder?: boolean }[];
    incomeSources: AnnualReportFinancialLine[];
    expenseCategories: AnnualReportFinancialLine[];
    donorContributionNote: string;
    auditAndDisclosureNote: string;
  };
  volunteerAndDonorEngagement: {
    intro: string;
    volunteerParticipation: string[];
    youthLeadershipHighlights: string[];
    donorAcknowledgements: string[];
    communityChannels: string[];
    photoPath?: string | null;
    photoCaption?: string;
  };
  partnerships: {
    intro: string;
    partners: AnnualReportPartner[];
    collaborationNote: string;
  };
  storiesOfChange: {
    intro: string;
    stories: AnnualReportStory[];
  };
  lookingAhead: {
    intro: string;
    confirmedCommitments: string[];
    proposedPlans: {
      area: string;
      goal: string;
      communityNeed: string;
      resourceRequirement: string;
    }[];
    strategicFocusNote: string;
  };
  acknowledgments: {
    openingParagraph: string;
    groups: { group: string; message: string }[];
    closingParagraph: string;
  };
  contact: {
    intro: string;
    fields: [string, string][];
    qrCodePath?: string | null;
    qrCodeCaption: string;
  };
}

export const ANNUAL_REPORT_2020_21: AnnualReportData = {
  id: 'annual-report-2020-21',
  reportTitle: 'Annual Report 2020–21',
  reportYearLabel: '2020–21',
  reportingPeriod: 'April 2020 – March 2021',
  tagline: 'Youth Empowerment Through Grassroots Action',
  marathiSubline: 'गरड फाउंडेशन · ठाणे, महाराष्ट्र',
  branding: {
    organisationName: 'Garad Foundation',
    logoPath: 'public/assets/branding/garad-foundation-logo.png',
    locationLabel: 'Thane, Maharashtra, India',
  },
  cover: {
    photoPath: 'src/assets/images/volunteer_hero_education_1795289741467.jpg',
    photoCaption:
      'Garad Foundation community education and youth volunteering across Maharashtra.',
    editionNote: 'Institutional Annual Report · Prepared for CSR, Donor & Stakeholder Review',
    metaSummary: [
      ['Reporting Period', 'April 2020 – March 2021 (FY 2020–21)'],
      ['Headquarters', 'Thane, Maharashtra, India'],
      ['Documented Initiatives', '6 Completed Activities (Verified Archive Records)'],
      ['Primary Focus', 'Education, Health & Hygiene, Community Welfare & Youth Engagement'],
    ],
  },
  about: {
    overviewParagraphs: [
      'Garad Foundation is a youth-led, volunteer-driven nonprofit organisation based in Thane, Maharashtra, India. Built on the conviction that steady grassroots action creates lasting dignity, the Foundation brings together students, working professionals, and community well-wishers to address practical gaps in rural education, women’s health awareness, community welfare, and constructive youth engagement.',
      'Throughout Financial Year 2020–21—a year shaped by pandemic disruptions across both urban and rural Maharashtra—Garad Foundation stayed focused on direct listening, baseline school mapping, local collaborations, and transparent community-supported delivery.',
    ],
    vision:
      'Equitable, self-reliant communities where children, women, and young citizens have access to foundational education, dignified healthcare awareness, and constructive civic spaces.',
    mission:
      'To mobilise youth energy and transparent community resources for practical, baseline-informed initiatives across education, preventive health, community welfare, and regional culture.',
    coreValues: [
      {
        title: 'Dignity & Respect',
        description:
          'Every interaction with schoolchildren, rural families, and urban communities prioritises personal dignity, listening, and safeguarding.',
      },
      {
        title: 'Accountability & Honesty',
        description:
          'Documenting real outputs transparently without inflating reach, estimating financial records, or overstating unmeasured impact.',
      },
      {
        title: 'Grassroots Collaboration',
        description:
          'Working closely with Zilla Parishad teachers, local grassroots organisations, and neighbourhood volunteers rather than top-down delivery.',
      },
      {
        title: 'Youth Leadership',
        description:
          'Empowering young citizens to take practical ownership of civic challenges through structured volunteering and teamwork.',
      },
    ],
    approachPillars: [
      {
        title: 'Volunteer-Driven',
        description:
          'Needs surveys, packing, outreach logistics, and youth competitions are planned and executed directly by committed volunteers.',
      },
      {
        title: 'Crowd-Funded',
        description:
          'Initiatives such as Mission Bharari – Phase 1 and Utsavachi Shidori are sustained through transparent peer crowdfunding and direct in-kind community support.',
      },
      {
        title: 'Youth-Led',
        description:
          'Young coordinators lead rural baseline visits, digital awareness campaigns, and school engagement with disciplined follow-through.',
      },
    ],
    foundingAndRegistration: [
      ['Legal Name', 'Garad Foundation'],
      ['Headquarters', 'Thane, Maharashtra, India'],
      ['Founding Year', '[Editable: Insert official founding date / year as per registration deed]'],
      ['Registration Type & Number', '[Editable: Insert Society / Trust Registration Number]'],
      ['Section 12A Registration', '[Editable: Insert official 12A URN & validity period]'],
      ['Section 80G Approval', 'Garad Foundation holds 80G approval — [Editable: Insert official 80G URN]'],
      ['MCA CSR-1 Registration', '[Editable: Insert official CSR-1 Registration Number, if applicable]'],
      ['PAN', '[Editable: Insert Organisation PAN for institutional due diligence]'],
    ],
  },
  founderMessage: {
    heading: 'Message from the Founder / Chairman',
    salutation: 'Dear Friends, Volunteers, Partners, and Supporters,',
    paragraphs: [
      '[Editable Draft — Replace with authorised Founder / Chairman message prior to final external release.]',
      'Financial Year 2020–21 brought unprecedented disruption to schools, livelihoods, and everyday community life across Maharashtra. Yet it also reminded us of what disciplined youth volunteering and neighbourly solidarity can accomplish when communities come together.',
      'During this reporting cycle, our volunteers carried out six documented grassroots initiatives—from sharing 175 home-prepared meal boxes across Thane city intersections and partnering with Aapla Thane Foundation for menstrual hygiene outreach in Mamnoli, to completing a ten-school baseline survey in Bhor Taluka and delivering customised school stationery kits to 220 rural Zilla Parishad students under Mission Bharari – Phase 1.',
      'When lockdowns prevented physical gatherings, our team adapted rapidly through accessible WhatsApp and digital formats—enabling youth writing, COVID-19 awareness filmmaking, and Marathi Rajbhasha Divas elocution across Maharashtra.',
      'We extend our sincere gratitude to every volunteer, household contributor, digital crowdfunding supporter, Zilla Parishad educator, and collaborating partner who trusted our work during a difficult year. We invite you to review this report as an honest record of our documented efforts and our roadmap ahead.',
    ],
    authorName: '[Editable: Founder / Chairman Full Name]',
    authorRole: 'Founder / Chairman, Garad Foundation',
    photoPath: null,
    signaturePath: null,
    editorialNote:
      'Editorial Verification Note: No fictional founder quote, portrait, or signature has been inserted. Insert the approved Founder/Chairman statement, portrait path, and authorised signature asset in src/data/annualReport2020_21.ts before final publication.',
  },
  impactAtAGlance: {
    intro:
      'The indicators below summarise Garad Foundation’s documented outputs during the FY 2020–21 reporting period (including verified early-2020 founding drives archived in the 2020–21 edition). Where consolidated multi-programme figures or audited financial totals are still pending verification, editable placeholders are shown explicitly.',
    metrics: [
      {
        value: '220',
        label: 'Rural Students Supported',
        detail: '10 Zilla Parishad schools, Bhor Taluka (Mission Bharari – Phase 1)',
        icon: 'schools',
      },
      {
        value: '200',
        label: 'Women & Girls Reached',
        detail: '150 tribal women & 50 adolescent girls (Mamnoli, Kalyan)',
        icon: 'beneficiaries',
      },
      {
        value: '6',
        label: 'Documented Projects',
        detail: 'Completed activities recorded in the FY 2020–21 archive',
        icon: 'projects',
      },
      {
        value: '175',
        label: 'Meal Boxes Shared',
        detail: '2 rounds (80 + 95) across 3 Thane urban intersections',
        icon: 'locations',
      },
      {
        value: '[Pending Verification]',
        label: 'Volunteers Engaged (FY 2020–21)',
        detail: 'Editable placeholder — confirm verified FY 2020–21 headcount',
        icon: 'volunteers',
        isPlaceholder: true,
      },
      {
        value: '[Audited Total Pending]',
        label: 'Funds Raised & Utilised',
        detail: 'Editable placeholder — insert audited FY 2020–21 rupee total',
        icon: 'funds',
        isPlaceholder: true,
      },
    ],
    methodologyNote:
      'Non-Duplication & Integrity Standard: Activity reach figures are presented individually rather than summed into a single deduplicated beneficiary total, because online competitions and field drives served distinct cohorts without a unified ID registry.',
    verifiedActivitySummaryRows: [
      ['Utsavachi Shidori', '1 Jan 2020', 'Thane (3 Urban Signals)', '175 food boxes (80 + 95 rounds; 100% in-kind)'],
      ['Menstrual Hygiene & Pad Drive', '25 Feb 2020', 'Mamnoli, Kalyan', '200 participants (150 tribal women, 50 adolescent girls)'],
      ['Online Essay & Poetry Contest', 'FY 2020–21', 'Online (Maharashtra)', '30 youth entries across Marathi, Hindi & English'],
      ['COVID-19 Videography Contest', 'FY 2020–21', 'Online (Maharashtra)', '20 youth creator entries; 2 named winners'],
      ['Mission Bharari – Phase 1', '3 Feb 2021', '10 ZP Schools, Bhor Taluka', '220 rural primary students equipped with kits'],
      ['Marathi Rajbhasha Divas Spardha', '27 Feb 2021', 'Online (Maharashtra)', '8 named awardees (Vakta Spardha elocution)'],
    ],
  },
  projects: {
    intro:
      'Garad Foundation structures its work around practical, community-identified priorities. Each project profile below uses a consistent editorial format and clearly separates verified FY 2020–21 documented activities from programme frameworks awaiting verified 2020–21 records.',
    items: [
      {
        id: 'mission-bharari',
        name: 'Mission Bharari — School Kit Drive (Phase 1)',
        subtitle: 'Flagship Rural Education Initiative · 3 February 2021',
        statusTag: 'Verified FY 2020–21 Record',
        backgroundAndNeed: [
          'Extended pandemic school closures disproportionately affected children enrolled in remote rural Zilla Parishad schools across Bhor Taluka, Pune District. While urban classrooms transitioned to online platforms, rural students faced intermittent connectivity and an acute shortage of basic learning materials.',
          'Before procuring supplies, a Garad Foundation field coordinator conducted a direct baseline survey across ten Zilla Parishad schools to map actual student stationery needs rather than relying on estimates.',
        ],
        objectives: [
          'Equip primary schoolchildren across ten remote Zilla Parishad schools with individual, age-appropriate stationery kits prior to academic resumption.',
          'Eliminate material sharing during COVID-19 precautions by giving every surveyed student personal ownership of notebooks and writing instruments.',
          'Demonstrate a transparent, volunteer-led peer crowdfunding model with zero intermediary leakage.',
        ],
        activitiesConducted: [
          'Completed an on-ground baseline survey across 10 Zilla Parishad schools in Bhor Taluka.',
          'Mobilised 100% of required resources through volunteer-led digital crowdfunding via WhatsApp, social media, and personal networks.',
          'Assembled and delivered customised school stationery kits directly to students on 3 February 2021 following COVID-safe distribution protocols with local teachers.',
        ],
        location: '10 Zilla Parishad Schools, Bhor Taluka, Pune District, Maharashtra',
        beneficiaries: '220 rural primary students (documented in internal FY 2020–21 report)',
        outcomes: [
          '220 surveyed students across all 10 partner schools received personal school stationery kits on schedule.',
          'Direct school-level coordination strengthened trust with Zilla Parishad educators and created a repeatable baseline-survey methodology for future phases.',
          'Note: Long-term academic retention metrics were not formally tracked in Phase 1 and are not overstated.',
        ],
        photoPath: 'src/assets/images/mission_bharari_hero_1795271349821.jpg',
        photoCaption:
          'Representative educational documentation visual — replace with consent-cleared archival Phase 1 field photograph if required.',
        testimonial: null,
      },
      {
        id: 'swasthya-saksharta',
        name: 'Swasthya Saksharta — Health and Hygiene',
        subtitle: 'Menstrual Hygiene Awareness & Sanitary Pad Distribution · 25 February 2020',
        statusTag: 'Verified FY 2020–21 Archive Record',
        backgroundAndNeed: [
          'In rural and tribal settlements such as Mamnoli near Kalyan, social stigma, limited access to affordable sanitary products, and lack of local-language menstrual health guidance frequently lead to unsafe hygiene practices and preventable discomfort among women and adolescent girls.',
        ],
        objectives: [
          'Foster an open, dignified, and stigma-free conversation on menstrual hygiene in local language.',
          'Provide practical access to biodegradable sanitary pads for tribal women and adolescent girls.',
          'Identify basic preventive health symptoms (such as anaemia or reproductive discomfort) for timely medical follow-up.',
        ],
        activitiesConducted: [
          'Collaborated with Aapla Thane Foundation to organise an on-ground awareness session and distribution drive in Mamnoli, Kalyan.',
          'Conducted interactive health and hygiene education covering safe usage, disposal, and self-care practices.',
          'Distributed sanitary care packages and facilitated preliminary symptom awareness referrals.',
        ],
        location: 'Mamnoli, Kalyan, Thane District, Maharashtra',
        beneficiaries: '200 participants (150 tribal women and 50 adolescent girls)',
        outcomes: [
          'All 200 documented participants received menstrual hygiene guidance and sanitary pad packages in a respectful community setting.',
          'Demonstrated effective grassroots collaboration with a trusted local partner organisation (Aapla Thane Foundation).',
        ],
        photoPath: 'src/assets/images/menstrual_hygiene_drive_1795271241244.jpg',
        photoCaption:
          'Representative health outreach visual — safeguarding-cleared archival photographs are maintained on institutional record.',
        testimonial: null,
      },
      {
        id: 'emergency-covid-relief',
        name: 'Emergency COVID Relief & Community Solidarity',
        subtitle: 'Utsavachi Shidori & Pandemic Youth Continuity Drives · FY 2020–21',
        statusTag: 'Verified FY 2020–21 Record',
        backgroundAndNeed: [
          'Urban daily-wage families at city intersections faced acute nutritional vulnerability at the start of 2020, while subsequent COVID-19 lockdowns disrupted public health communication and isolated students and young citizens across Maharashtra.',
        ],
        objectives: [
          'Deliver freshly packed, hygienic festive food boxes directly to underserved families at Thane urban intersections with zero administrative overhead.',
          'Keep youth constructively engaged during lockdown months through peer-led COVID-19 awareness filmmaking, multilingual writing, and Marathi elocution.',
        ],
        activitiesConducted: [
          'Utsavachi Shidori (1 Jan 2020): Volunteers collected 100% in-kind household contributions and distributed 175 meal boxes in two rounds (80 + 95) across Teen Haath Naka, Majiwada, and Nitin Company signals in Thane.',
          'COVID-19 Online Videography Awareness Contest: Engaged 20 youth creators to produce short public-health awareness videos evaluated by the Core Team (2 named winners).',
          'Online Essay & Poetry Competition (30 youth entries in Marathi, Hindi & English) and Marathi Rajbhasha Divas Spardha (27 Feb 2021; 8 named elocution awardees) sustained accessible digital youth participation during pandemic restrictions.',
        ],
        location: 'Thane Urban Intersections & Statewide Online Platforms (Maharashtra)',
        beneficiaries: '175 food box recipients; 50+ documented youth participants across 3 online initiatives',
        outcomes: [
          'Demonstrated zero-budget community generosity through 100% in-kind meal sharing.',
          'Preserved youth creativity, regional linguistic pride, and peer public-health awareness using low-barrier digital channels (WhatsApp and email).',
        ],
        photoPath: 'src/assets/images/utsavachi_shidori_ration_1795271249251.jpg',
        photoCaption:
          'Representative community relief visual — Utsavachi Shidori distribution across Thane.',
        testimonial: null,
      },
      {
        id: 'pustak-bharari',
        name: 'Pustak Bharari — Rural Library Initiative',
        subtitle: 'Rural Reading Access & Book-Sharing Framework',
        statusTag: 'Editable Placeholder — Records Pending',
        isPlaceholderRecord: true,
        backgroundAndNeed: [
          '[Editable Placeholder: No separate verified FY 2020–21 activity report for Pustak Bharari is currently present in the 2020–21 digital archive. Insert verified background, rural reading-gap context, and launch date once confirmed from organisational records.]',
        ],
        objectives: [
          '[Editable: Confirm specific book-collection, school reading-corner, or rural library objectives applicable to this reporting period.]',
        ],
        activitiesConducted: [
          '[Editable: Record verified book drives, reading sessions, or library setups completed during the reporting period.]',
        ],
        location: '[Editable: Confirm participating villages / schools]',
        beneficiaries: '[Editable: Confirm verified student / reader reach]',
        outcomes: [
          '[Editable: Insert verified outputs such as books catalogued, reading corners established, or active borrowers — do not estimate.]',
        ],
        photoPath: null,
        testimonial: null,
      },
      {
        id: 'neeranjali',
        name: 'Neeranjali — Water Awareness Project',
        subtitle: 'Community Water Conservation & Awareness Framework',
        statusTag: 'Editable Placeholder — Records Pending',
        isPlaceholderRecord: true,
        backgroundAndNeed: [
          '[Editable Placeholder: Verified FY 2020–21 implementation records for Neeranjali are not yet uploaded to the public archive. Insert verified community water-scarcity or conservation context before external release.]',
        ],
        objectives: [
          '[Editable: Confirm documented water awareness, conservation, or safe-water objectives for this reporting year.]',
        ],
        activitiesConducted: [
          '[Editable: Record verified workshops, awareness rallies, school drives, or field interventions completed.]',
        ],
        location: '[Editable: Confirm participating communities / talukas]',
        beneficiaries: '[Editable: Confirm verified participant / household count]',
        outcomes: [
          '[Editable: Document observed outcomes and verified reach supported by field logs.]',
        ],
        photoPath: null,
        testimonial: null,
      },
    ],
  },
  financialOverview: {
    intro:
      'Garad Foundation maintains strict financial honesty: no rupee figures are estimated or approximated in this template. During FY 2020–21, documented grassroots activities relied heavily on 100% in-kind community contributions (Utsavachi Shidori), peer-led digital crowdfunding (Mission Bharari – Phase 1), and local partner collaboration (Mamnoli). Populate the audited rows below directly from the signed FY 2020–21 Income & Expenditure Statement before publishing audited totals.',
    summaryMetrics: [
      {
        label: 'Total Income (FY 2020–21)',
        value: '[Audited Figure Pending]',
        note: 'Insert exact audited total income (INR)',
        isPlaceholder: true,
      },
      {
        label: 'Total Expenditure (FY 2020–21)',
        value: '[Audited Figure Pending]',
        note: 'Insert exact audited total expenditure (INR)',
        isPlaceholder: true,
      },
      {
        label: 'Surplus / (Deficit)',
        value: '[Audited Figure Pending]',
        note: 'Insert net surplus or deficit per audited accounts',
        isPlaceholder: true,
      },
    ],
    incomeSources: [
      {
        category: 'Individual & Peer Digital Crowdfunding',
        amountLabel: '[Insert Audited INR]',
        amountNumeric: null,
        notes: 'Includes verified community crowdfunding (e.g., Mission Bharari – Phase 1)',
      },
      {
        category: 'Corporate / Institutional CSR Grants',
        amountLabel: '[Insert Audited INR or Nil]',
        amountNumeric: null,
        notes: 'Confirm whether any corporate grants were received in FY 2020–21',
      },
      {
        category: 'In-Kind Community Support (Non-Cash)',
        amountLabel: 'Disclosed Qualitatively',
        amountNumeric: null,
        notes: '175 home-prepared meal boxes for Utsavachi Shidori (zero-cash model)',
      },
      {
        category: 'Interest & Other Income',
        amountLabel: '[Insert Audited INR]',
        amountNumeric: null,
        notes: 'As reflected in audited bank and ledger records',
      },
    ],
    expenseCategories: [
      {
        category: 'Education Programmes (e.g., Mission Bharari Kits)',
        amountLabel: '[Insert Audited INR]',
        amountNumeric: null,
        notes: 'Direct stationery kit procurement and rural school delivery',
      },
      {
        category: 'Health & Hygiene Outreach',
        amountLabel: '[Insert Audited INR]',
        amountNumeric: null,
        notes: 'Sanitary hygiene supplies and outreach logistics',
      },
      {
        category: 'Youth & Cultural Initiatives',
        amountLabel: '[Insert Audited INR]',
        amountNumeric: null,
        notes: 'Certificates, awardee recognition, and competition coordination',
      },
      {
        category: 'Administrative, Statutory & Compliance Costs',
        amountLabel: '[Insert Audited INR]',
        amountNumeric: null,
        notes: 'Audit, statutory filings, and essential operational expenses',
      },
    ],
    donorContributionNote:
      'Donor Contribution Breakdown: Detailed donor-wise contribution schedules are maintained confidentially in statutory books and Form 10BD records (where applicable) and are available to institutional CSR due-diligence teams upon formal request.',
    auditAndDisclosureNote:
      'Audit Note & Financial Disclosures: Certified copies of Garad Foundation’s audited Balance Sheet, Income & Expenditure Account, and Statutory Auditor’s Report for FY 2020–21 are maintained separately on official record. Update the numeric fields in src/data/annualReport2020_21.ts with exact audited figures to automatically render the proportional expenditure chart in this section.',
  },
  volunteerAndDonorEngagement: {
    intro:
      'Volunteers and community well-wishers are the heart of Garad Foundation. Rather than relying on heavy overhead, young citizens across Thane and Maharashtra step forward to survey needs, coordinate logistics, mobilise resources, and celebrate student talent.',
    volunteerParticipation: [
      'Direct field execution: Volunteers coordinated meal collection and distribution across three Thane urban signals for Utsavachi Shidori.',
      'Rural baseline coordination: A field coordinator personally surveyed ten Zilla Parishad schools in Bhor Taluka prior to Mission Bharari – Phase 1.',
      'Digital continuity: Volunteers designed outreach prompts, managed WhatsApp/email entries, and evaluated youth competitions fairly during lockdowns.',
      'Editable Registry Note: [Insert verified FY 2020–21 total active volunteer count and hours once confirmed from internal attendance logs.]',
    ],
    youthLeadershipHighlights: [
      'Online Essay & Poetry Competition: 30 young writers contributed original reflections in Marathi, Hindi, and English during pandemic restrictions.',
      'COVID-19 Awareness Videography Contest: 20 youth creators produced short awareness videos; evaluated by the Core Team with 2 named winners.',
      'Marathi Rajbhasha Divas Spardha (27 Feb 2021): Celebrated regional linguistic heritage through recorded elocution, recognising 8 named student/youth awardees.',
    ],
    donorAcknowledgements: [
      'Household contributors who prepared and donated 175 meal boxes for Utsavachi Shidori.',
      'Individual micro-donors and well-wishers who funded 100% of Mission Bharari – Phase 1 through peer digital crowdfunding.',
      'Privacy Commitment: Individual donor names are published only with explicit written consent.',
    ],
    communityChannels: [
      'WhatsApp and community volunteer groups for rapid grassroots mobilisation',
      'Garad Foundation Digital Archive (/activities) and Reports Portal (/reports)',
      'Dedicated Volunteer Onboarding (/volunteer) and Verified Donation Portal (/donate)',
    ],
    photoPath: 'src/assets/images/volunteer_closing_community_1795289742188.jpg',
    photoCaption:
      'Volunteers organising educational notebooks and stationery supplies for rural school outreach.',
  },
  partnerships: {
    intro:
      'Meaningful grassroots impact grows through local trust. The table below records verified collaborations documented in FY 2020–21, alongside clearly marked editable rows for any additional approved partners.',
    partners: [
      {
        category: 'NGO Collaboration',
        name: 'Aapla Thane Foundation',
        role: 'Collaborating field partner for the Menstrual Hygiene Awareness & Sanitary Pad Distribution drive in Mamnoli, Kalyan (25 Feb 2020), supporting community mobilisation and outreach to 200 participants.',
      },
      {
        category: 'School Partnerships',
        name: '10 Zilla Parishad Primary Schools (Bhor Taluka, Pune District)',
        role: 'School headmasters and teachers facilitated the pre-implementation baseline survey and COVID-safe distribution of stationery kits to 220 students under Mission Bharari – Phase 1 (3 Feb 2021).',
      },
      {
        category: 'Government Collaborations',
        name: '[Editable: None formally documented in FY 2020–21 public archive]',
        role: 'Add verified government department or gram panchayat collaborations only with documented record.',
        isPlaceholder: true,
      },
      {
        category: 'Corporate Sponsors / CSR Partners',
        name: '[Editable: None formally documented in FY 2020–21 public archive]',
        role: 'Add verified corporate CSR partners and approved partner roles here when applicable. Never display unapproved corporate logos.',
        isPlaceholder: true,
      },
    ],
    collaborationNote:
      'Partner Verification Standard: Garad Foundation lists only verified partners with clear, accurate descriptions of their role and does not display third-party logos without written permission.',
  },
  storiesOfChange: {
    intro:
      'Numbers summarise scale, while real human experiences show why grassroots work matters. In accordance with Garad Foundation’s safeguarding and consent policy, identifiable beneficiary names, direct quotes, and portraits are published ONLY after documented consent is verified. The three editorial story frames below are ready for approved narratives.',
    stories: [
      {
        label: 'Story 01 · Rural Education (Mission Bharari – Phase 1)',
        personName: '[Editable: Student / Educator Name — Publish Only With Written Consent]',
        location: 'Zilla Parishad Primary School, Bhor Taluka, Pune District',
        background:
          '[Editable: Briefly describe the student’s or school’s learning context during the 2020–21 lockdown and stationery gap identified during the baseline survey.]',
        whatChanged:
          '[Editable: Record a factual, non-exaggerated observation from the teacher or family following receipt of personal stationery kits on 3 February 2021.]',
        initiativeContribution:
          'Mission Bharari – Phase 1 delivered individual stationery kits across 10 rural ZP schools based on direct headmaster-verified requirements.',
        consentStatus: 'Consent Status: Pending documented guardian / educator release',
      },
      {
        label: 'Story 02 · Women’s Health & Dignity (Swasthya Saksharta)',
        personName: '[Editable: Community Participant / Volunteer Name — Consent Required]',
        location: 'Mamnoli, Kalyan, Thane District',
        background:
          '[Editable: Describe the community context around menstrual health awareness and access to safe sanitary products in Mamnoli.]',
        whatChanged:
          '[Editable: Document how open, local-language dialogue and access to biodegradable pads supported informed hygiene practices.]',
        initiativeContribution:
          'Jointly conducted with Aapla Thane Foundation, reaching 150 tribal women and 50 adolescent girls with awareness sessions and sanitary care kits.',
        consentStatus: 'Consent Status: Strictly safeguarded; identifiable details withheld without written consent',
      },
      {
        label: 'Story 03 · Youth Civic Leadership',
        personName: '[Editable: Youth Volunteer / Awardee Name — Consent Required]',
        location: 'Thane / Maharashtra (Online & Field Programmes)',
        background:
          '[Editable: Share how a student or young professional got involved during the 2020–21 pandemic period.]',
        whatChanged:
          '[Editable: Highlight practical leadership skills, teamwork, or community perspective gained through volunteering or youth competitions.]',
        initiativeContribution:
          'Garad Foundation provided structured opportunities for youth volunteers to lead baseline surveys, relief packing, and digital awareness drives.',
        consentStatus: 'Consent Status: Awaiting signed volunteer story release',
      },
    ],
  },
  lookingAhead: {
    intro:
      'Building on the disciplined field lessons of FY 2020–21, Garad Foundation’s roadmap separates confirmed institutional practices from proposed programmes that remain subject to community needs assessments, internal board approval, and partner funding.',
    confirmedCommitments: [
      'Maintain transparent, baseline-informed activity documentation and annual institutional reporting across every future financial year.',
      'Uphold strict safeguarding and written-consent protocols before publishing identifiable beneficiary photographs or stories.',
      'Continue welcoming students, working professionals, and local community partners through structured volunteer onboarding.',
    ],
    proposedPlans: [
      {
        area: 'Financial Literacy (Proposed: Sabse Bada Rupaiya)',
        goal: 'Pilot practical financial literacy workshops for Standards VII–X students in Thane (proposed Phase 1: 4 schools, 100 students).',
        communityNeed: 'Practical money management and savings awareness for school-going adolescents.',
        resourceRequirement: 'Status: Awaiting internal project & budget approval (draft estimate INR 1,00,000 subject to final review).',
      },
      {
        area: 'Rural Education Expansion (Proposed: Mission Bharari Next Phase)',
        goal: 'Build on the verified Phase 1 ten-school baseline methodology to support additional underserved rural schools.',
        communityNeed: 'Continued learning kit and foundational educational resource gaps in remote schools.',
        resourceRequirement: 'Status: Concept under development; target geography and budget to be confirmed after baseline survey.',
      },
      {
        area: 'Rural Libraries (Proposed: Garad Granthalay / Pustak Bharari)',
        goal: 'Develop accessible community and school reading spaces in rural areas.',
        communityNeed: 'Limited availability of age-appropriate Marathi and English storybooks outside urban centres.',
        resourceRequirement: 'Status: Concept under development; site assessments and resource requirements pending confirmation.',
      },
      {
        area: 'Institutional Governance & CSR Readiness',
        goal: 'Publish annual audited financial summaries alongside verified activity reports for subsequent financial years.',
        communityNeed: 'Stronger institutional transparency for corporate CSR partners and grant reviewers.',
        resourceRequirement: 'Ongoing core-team documentation, audit coordination, and digital reporting workflows.',
      },
    ],
    strategicFocusNote:
      'Clarity Note: All proposed initiatives above represent exploratory planning priorities and are not presented as funded or completed commitments until formally approved.',
  },
  acknowledgments: {
    openingParagraph:
      'Every milestone recorded in Financial Year 2020–21 was made possible by people who chose to show up with quiet sincerity. Garad Foundation offers heartfelt thanks to every individual and institution who walked alongside us through a challenging year.',
    groups: [
      {
        group: 'Our Volunteers & Core Team',
        message:
          'For travelling to rural Zilla Parishad schools, packing meal boxes at Thane signals, organising digital youth competitions, and upholding care and integrity in every detail.',
      },
      {
        group: 'Individual Donors & Well-Wishers',
        message:
          'For trusting a youth-led grassroots organisation with your in-kind contributions and peer crowdfunding support—enabling direct, zero-intermediary delivery.',
      },
      {
        group: 'Collaborating Partners & Educators',
        message:
          'To Aapla Thane Foundation for joint outreach in Mamnoli, and to the headmasters and teachers of the 10 Zilla Parishad schools in Bhor Taluka for welcoming and guiding our team.',
      },
      {
        group: 'Communities, Students & Families',
        message:
          'For sharing your trust, hospitality, and candid feedback—reminding us every day that meaningful change begins with listening.',
      },
    ],
    closingParagraph:
      'Small efforts, sustained with honesty and shared purpose, build stronger communities. Thank you for being part of the Garad Foundation journey.',
  },
  contact: {
    intro:
      'We welcome enquiries from corporate CSR teams, institutional donors, academic institutions, local NGOs, and prospective volunteers. Update any bracketed contact placeholders below with verified official details before external distribution.',
    fields: [
      ['Organisation Name', 'Garad Foundation'],
      ['Registered Office Address', 'Thane, Maharashtra, India — [Editable: Insert complete registered postal address]'],
      ['Official Email', '[Editable: Insert verified official Garad Foundation email address]'],
      ['Phone Number', '[Editable: Insert verified official telephone / WhatsApp number]'],
      ['Website & Digital Portal', 'Activities Archive (/activities) · Reports (/reports) · CSR Hub (/csr-partnerships) · Volunteer (/volunteer) · Donate (/donate)'],
      ['Social Media Handles', '[Editable: Insert verified Instagram / LinkedIn / Facebook / YouTube handles]'],
    ],
    qrCodePath: null,
    qrCodeCaption:
      'Optional Official QR Code — Provide a verified QR code image path in src/data/annualReport2020_21.ts (no placeholder QR code is auto-generated).',
  },
};
