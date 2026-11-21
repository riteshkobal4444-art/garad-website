export type FiscalYearId =
  | 'all'
  | '2020-21'
  | '2021-22'
  | '2022-23'
  | '2023-24'
  | '2024-25'
  | '2025-26';

export type ActivityCategory =
  | 'All'
  | 'Community Welfare'
  | 'Women & Health Awareness'
  | 'Youth Development'
  | 'Public Health & Youth'
  | 'Education'
  | 'Language & Culture';

export type VisualMotif =
  | 'welfare'
  | 'health'
  | 'literature'
  | 'video'
  | 'education'
  | 'culture';

export interface ActivityMedia {
  /** Path to an authentic, safeguarding-cleared Garad Foundation photograph, or null when pending archival upload. */
  imagePath: string | null;
  alt: string;
  caption: string;
  dateRecorded?: string;
  locationRecorded?: string;
  visualMotif: VisualMotif;
  placeholderLabel: string;
  safeguardingNote?: string;
}

export interface ActivityMetric {
  value: string;
  label: string;
  sublabel?: string;
  accent?: 'forest' | 'terracotta';
}

export interface ActivityMetadataCard {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: 'calendar' | 'map-pin' | 'users' | 'award' | 'globe' | 'heart' | 'book';
}

export interface ActivitySection {
  id: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
}

export interface ActivityObjective {
  id: string;
  title: string;
  description: string;
  icon: 'heart' | 'users' | 'sparkles' | 'check' | 'book' | 'shield' | 'video' | 'graduation' | 'award' | 'mic';
}

export interface MethodologyStage {
  stageNumber: string;
  subtitleMeta: string;
  title: string;
  description: string;
  footerLabel: string;
  accent: 'sage' | 'terracotta' | 'forest';
  icon: 'clipboard' | 'users' | 'truck';
}

export interface DistributionRound {
  roundLabel: string;
  boxes: number;
  note: string;
}

export interface ParticipantGroup {
  label: string;
  count: number;
  sharePercent: number;
  tone: 'forest' | 'terracotta';
}

export interface WinnerEntry {
  rank: string;
  name: string;
  workTitle?: string;
  tier: 'first' | 'second' | 'consolation';
}

export interface ActivityRecord {
  id: string;
  slug: string;
  archiveNumber: string;
  title: string;
  shortTitle: string;
  year: Exclude<FiscalYearId, 'all'>;
  yearDisplay: string;
  date: string;
  cardDate: string;
  location: string;
  cardLocation: string;
  category: Exclude<ActivityCategory, 'All'>;
  isFlagship?: boolean;
  cardDescription: string;
  cardKeyStat: string;
  cardStatIcon: 'box' | 'users' | 'pen' | 'video' | 'graduation' | 'award';
  introduction: string;
  seoTitle: string;
  seoDescription: string;
  heroImage: ActivityMedia;
  cardImage: ActivityMedia;
  metadataCards: ActivityMetadataCard[];
  verifiedMetrics: ActivityMetric[];
  metricsDisclaimer?: string;
  needAndRationale: ActivitySection;
  whatWeDid: ActivitySection;
  objectivesSectionEyebrow: string;
  objectivesSectionHeading: string;
  objectives: ActivityObjective[];
  implementation: {
    fundingModel?: string;
    deliveryModel?: string;
    submissionChannels?: string[];
    languages?: string[];
    formats?: string[];
    themeSummary?: string;
    evaluationCriteria?: string[];
    evaluatedBy?: string;
    prizeFulfilment?: string;
    methodology?: {
      eyebrow: string;
      heading: string;
      stages: MethodologyStage[];
    };
  };
  participationDetails?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    participantSplit?: ParticipantGroup[];
    healthScreeningNote?: string;
    distributionBreakdown?: {
      rounds: DistributionRound[];
      totalBoxes: number;
      locations: string[];
      fundingNote: string;
    };
    videoThemes?: string[];
  };
  outputs?: {
    sidebarTitle: string;
    items: string[];
    summaryNote?: string;
  };
  partners?: {
    name: string;
    role: string;
  }[];
  winners?: {
    eyebrow: string;
    heading: string;
    subtitle?: string;
    entries: WinnerEntry[];
    fulfilmentNote?: string;
  };
  reflection: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
  };
  gallery: ActivityMedia[];
  relatedActivitySlugs: string[];
}

export interface TimelinePillar {
  id: Exclude<FiscalYearId, 'all'>;
  shortLabel: string;
  verticalLabel: string;
  badgeText: string;
  heightPercent: number;
  variant: 'ochre' | 'forest-1' | 'forest-2' | 'forest-3' | 'forest-4' | 'terracotta';
  documentedCount: number;
  summary: string;
}

export interface HeroStatistic {
  id:
    | 'studentsReached'
    | 'completedProjects'
    | 'villagesCovered'
    | 'passionateVolunteers';
  label: string;
  value: string;
  requiresVerification?: boolean;
  verificationNote?: string;
}

/**
 * Central editable metrics object for the Activities Archive hero section.
 * Update values here to keep all four hero statistic cards in sync.
 */
export const HERO_STATISTICS_CONFIG = {
  studentsReached: {
    id: 'studentsReached' as const,
    label: 'Students Reached',
    value: '2,000+',
  },
  completedProjects: {
    id: 'completedProjects' as const,
    label: 'Completed Projects',
    value: '6+',
  },
  villagesCovered: {
    id: 'villagesCovered' as const,
    label: 'Villages Covered',
    value: '20+',
  },
  passionateVolunteers: {
    id: 'passionateVolunteers' as const,
    label: 'Passionate Volunteers',
    // VERIFICATION REQUIRED: Confirm final volunteer count against Garad Foundation records.
    value: '230',
    requiresVerification: true,
    verificationNote:
      'Marked as requiring verification until final confirmed volunteer count is provided.',
  },
} as const;

export const HERO_STATISTICS: HeroStatistic[] = [
  HERO_STATISTICS_CONFIG.studentsReached,
  HERO_STATISTICS_CONFIG.completedProjects,
  HERO_STATISTICS_CONFIG.villagesCovered,
  HERO_STATISTICS_CONFIG.passionateVolunteers,
];

export const TIMELINE_PILLARS: TimelinePillar[] = [
  {
    id: '2020-21',
    shortLabel: '20–21',
    verticalLabel: '6 REPORTS',
    badgeText: '6 Documented',
    heightPercent: 86,
    variant: 'ochre',
    documentedCount: 6,
    summary: '6 documented activities published in 2020–21 edition',
  },
  {
    id: '2021-22',
    shortLabel: '21–22',
    verticalLabel: 'PENDING',
    badgeText: 'Archive Pending',
    heightPercent: 50,
    variant: 'forest-1',
    documentedCount: 0,
    summary: 'Activities for 2021–22 will be added as the archive is updated',
  },
  {
    id: '2022-23',
    shortLabel: '22–23',
    verticalLabel: 'PENDING',
    badgeText: 'Archive Pending',
    heightPercent: 54,
    variant: 'forest-2',
    documentedCount: 0,
    summary: 'Activities for 2022–23 will be added as the archive is updated',
  },
  {
    id: '2023-24',
    shortLabel: '23–24',
    verticalLabel: 'PENDING',
    badgeText: 'Archive Pending',
    heightPercent: 58,
    variant: 'forest-3',
    documentedCount: 0,
    summary: 'Activities for 2023–24 will be added as the archive is updated',
  },
  {
    id: '2024-25',
    shortLabel: '24–25',
    verticalLabel: 'PENDING',
    badgeText: 'Archive Pending',
    heightPercent: 62,
    variant: 'forest-4',
    documentedCount: 0,
    summary: 'Activities for 2024–25 will be added as the archive is updated',
  },
  {
    id: '2025-26',
    shortLabel: '25–26',
    verticalLabel: 'HORIZON',
    badgeText: '2025–26 Cycle',
    heightPercent: 68,
    variant: 'terracotta',
    documentedCount: 0,
    summary: 'Activities for 2025–26 will be added as the archive is updated',
  },
];

export const YEAR_FILTERS: { id: FiscalYearId; label: string }[] = [
  { id: 'all', label: 'All Activities' },
  { id: '2020-21', label: '2020–21' },
  { id: '2021-22', label: '2021–22' },
  { id: '2022-23', label: '2022–23' },
  { id: '2023-24', label: '2023–24' },
  { id: '2024-25', label: '2024–25' },
  { id: '2025-26', label: '2025–26' },
];

export const CATEGORY_FILTERS: ActivityCategory[] = [
  'All',
  'Community Welfare',
  'Women & Health Awareness',
  'Youth Development',
  'Public Health & Youth',
  'Education',
  'Language & Culture',
];

export const ACTIVITIES: ActivityRecord[] = [
  /* =====================================================================
     ACTIVITY 01 — UTSAVACHI SHIDORI
     ===================================================================== */
  {
    id: 'activity-01',
    slug: 'utsavachi-shidori',
    archiveNumber: 'ACTIVITY 01',
    title: 'Utsavachi Shidori',
    shortTitle: 'Utsavachi Shidori',
    year: '2020-21',
    yearDisplay: '2020–21',
    date: '1 January 2020',
    cardDate: '1 Jan 2020',
    location: 'Teen Haath Naka, Majiwada and Nitin Company Signals, Thane',
    cardLocation: 'Thane, Maharashtra',
    category: 'Community Welfare',
    cardDescription:
      'Youth volunteers packed fresh, home-prepared meals and snacks into 175 individual food boxes for homeless and vulnerable individuals across three major traffic junctions in Thane.',
    cardKeyStat: '175 Food Boxes · 100% In-Kind Community Support',
    cardStatIcon: 'box',
    introduction:
      'Beginning the new year with direct civic solidarity, Utsavachi Shidori brought together youth volunteers in Thane to pack and distribute 175 fresh, home-prepared food boxes at Teen Haath Naka, Majiwada, and Nitin Company traffic signals through 100% in-kind community donations.',
    seoTitle: 'Utsavachi Shidori (Jan 2020) — Garad Foundation Archive',
    seoDescription:
      'Garad Foundation youth volunteers distributed 175 fresh, home-prepared food boxes across Teen Haath Naka, Majiwada, and Nitin Company Signals in Thane on 1 January 2020.',
    cardImage: {
      imagePath: null,
      alt: 'Archival media slot for Utsavachi Shidori food box distribution at Thane traffic junctions on 1 January 2020',
      caption: 'Utsavachi Shidori — Thane traffic junction meal distribution (1 January 2020).',
      dateRecorded: '1 January 2020',
      locationRecorded: 'Teen Haath Naka, Majiwada & Nitin Company Signals, Thane',
      visualMotif: 'welfare',
      placeholderLabel: 'Field Photograph Pending Archival Upload',
    },
    heroImage: {
      imagePath: null,
      alt: 'Archival documentary slot for Utsavachi Shidori meal distribution in Thane on 1 January 2020',
      caption:
        'Volunteers packed fresh, home-prepared food and snacks into 175 individual meal boxes for distribution at Teen Haath Naka, Majiwada, and Nitin Company Signals, Thane.',
      dateRecorded: '1 January 2020',
      locationRecorded: 'Teen Haath Naka, Majiwada & Nitin Company Signals, Thane',
      visualMotif: 'welfare',
      placeholderLabel: 'Verified Field Photography Pending Archival Upload',
      safeguardingNote:
        'Authentic photographs from this distribution will be published once archival files are verified for dignity and consent.',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'ACTIVITY DATE',
        title: '1 January 2020',
        subtitle: 'Activity Report Edition 2020–21',
        icon: 'calendar',
      },
      {
        id: 'location',
        eyebrow: 'THANE DISTRIBUTION JUNCTIONS',
        title: '3 Major Traffic Signals',
        subtitle: 'Teen Haath Naka, Majiwada & Nitin Company',
        icon: 'map-pin',
      },
      {
        id: 'funding',
        eyebrow: 'FUNDING MODEL',
        title: '100% In-Kind Donations',
        subtitle: 'Described in report as zero-budget',
        icon: 'heart',
      },
    ],
    verifiedMetrics: [
      { value: '175', label: 'Food Boxes Distributed', accent: 'forest' },
      { value: '3', label: 'Thane Signals Covered', accent: 'terracotta' },
    ],
    needAndRationale: {
      id: 'need-rationale',
      eyebrow: 'NEED & RATIONALE',
      heading: 'Meeting Immediate Urban Food Insecurity with Empathy',
      paragraphs: [
        'While New Year celebrations typically center on festivities, homeless and economically vulnerable individuals living near major city intersections often remain overlooked. In Thane, busy transit corridors such as Teen Haath Naka, Majiwada, and Nitin Company Signals are daily gathering points for marginalised families and street-dwelling individuals with limited access to warm, freshly prepared meals.',
        'Utsavachi Shidori was conceived to mark the start of 2020 through practical, respectful grassroots service—channeling youth energy into direct neighbourhood care while encouraging young volunteers to witness and understand urban poverty firsthand.',
      ],
    },
    whatWeDid: {
      id: 'what-we-did',
      eyebrow: 'WHAT WE DID',
      heading: 'Home-Prepared Meals Packed and Distributed by Youth Volunteers',
      paragraphs: [
        'Mobilising entirely through in-kind community contributions rather than monetary fundraising, Garad Foundation youth volunteers gathered fresh, home-prepared food and snacks and carefully packed them into individual meal boxes for hygienic, dignified handover.',
        'Distribution was carried out across three key Thane traffic junctions—Teen Haath Naka, Majiwada Signal, and Nitin Company Signal—reaching a verified total of 175 food boxes across two documented distribution rounds (80 boxes in the first round and 95 boxes in the second round).',
      ],
    },
    objectivesSectionEyebrow: 'DOCUMENTED OBJECTIVES',
    objectivesSectionHeading: 'Core Objectives of Utsavachi Shidori',
    objectives: [
      {
        id: 'obj-1',
        title: 'Direct Fresh Meal Distribution',
        description:
          'Distribute fresh, home-prepared food and snacks to homeless and vulnerable individuals at Thane intersections.',
        icon: 'heart',
      },
      {
        id: 'obj-2',
        title: 'Youth Awareness of Urban Poverty',
        description:
          'Build grounded awareness among youth volunteers about everyday realities of urban poverty in their own city.',
        icon: 'users',
      },
      {
        id: 'obj-3',
        title: 'Empathy & Inclusive Action',
        description:
          'Promote empathy and inclusive grassroots civic action driven by community participation.',
        icon: 'sparkles',
      },
      {
        id: 'obj-4',
        title: 'Purposeful Start to the New Year',
        description:
          'Begin the new year with a practical, zero-budget community initiative rooted in shared contribution.',
        icon: 'check',
      },
    ],
    implementation: {
      fundingModel: '100% in-kind community donations (zero-budget model)',
      deliveryModel: 'Youth volunteer-led meal packing and direct signal-level handover',
    },
    participationDetails: {
      eyebrow: 'COMMUNITY PARTICIPATION & OUTPUT SUMMARY',
      heading: 'Documented Distribution Breakdown Across Thane',
      paragraphs: [
        'Community households and youth volunteers contributed all ingredients and prepared meals in kind, demonstrating that meaningful neighbourhood relief can be organised without formal cash budgets when local civic trust is strong.',
        'The activity report documents 175 food boxes distributed across two recorded rounds—80 boxes in the first round and 95 boxes in the second round—covering Teen Haath Naka, Majiwada, and Nitin Company Signals.',
      ],
      distributionBreakdown: {
        rounds: [
          {
            roundLabel: 'First Round',
            boxes: 80,
            note: 'Documented in activity distribution table',
          },
          {
            roundLabel: 'Second Round',
            boxes: 95,
            note: 'Documented in activity distribution table',
          },
        ],
        totalBoxes: 175,
        locations: [
          'Teen Haath Naka Signal, Thane',
          'Majiwada Signal, Thane',
          'Nitin Company Signal, Thane',
        ],
        fundingNote: '100% in-kind community donations (zero-budget initiative)',
      },
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED OUTPUTS',
      items: [
        '80 food boxes distributed in first documented round',
        '95 food boxes distributed in second documented round',
        '175 verified total individual meal boxes distributed',
        '3 major Thane traffic junctions covered',
        'Zero-budget model via 100% in-kind community donations',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION',
      heading: 'Quiet Civic Solidarity on Day One',
      paragraphs: [
        'Utsavachi Shidori reaffirmed that grassroots social work does not require large institutional budgets to create immediate warmth and dignity. When young citizens prepare and share meals directly with vulnerable neighbours, charity shifts toward genuine community solidarity.',
      ],
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival photo placeholder for Utsavachi Shidori food box packing by youth volunteers',
        caption: 'Volunteer meal box preparation using home-prepared food and snacks.',
        dateRecorded: '1 January 2020',
        locationRecorded: 'Thane, Maharashtra',
        visualMotif: 'welfare',
        placeholderLabel: 'Archival Photo Slot 01 · Meal Box Packing',
      },
      {
        imagePath: null,
        alt: 'Archival photo placeholder for distribution at Teen Haath Naka and Majiwada signals',
        caption: 'On-ground distribution rounds covering Teen Haath Naka, Majiwada, and Nitin Company Signals.',
        dateRecorded: '1 January 2020',
        locationRecorded: 'Thane Traffic Junctions',
        visualMotif: 'welfare',
        placeholderLabel: 'Archival Photo Slot 02 · Junction Outreach',
      },
    ],
    relatedActivitySlugs: [
      'menstrual-hygiene-awareness',
      'mission-bharari-phase-1',
      'online-videography-awareness-contest',
    ],
  },

  /* =====================================================================
     ACTIVITY 02 — MENSTRUAL HYGIENE AWARENESS & SANITARY PAD DISTRIBUTION
     ===================================================================== */
  {
    id: 'activity-02',
    slug: 'menstrual-hygiene-awareness',
    archiveNumber: 'ACTIVITY 02',
    title: 'Menstrual Hygiene Awareness & Sanitary Pad Distribution',
    shortTitle: 'Menstrual Hygiene & Pad Drive',
    year: '2020-21',
    yearDisplay: '2020–21',
    date: '25 February 2020',
    cardDate: '25 Feb 2020',
    location: 'Mamnoli, Kalyan, Maharashtra',
    cardLocation: 'Mamnoli, Kalyan, MH',
    category: 'Women & Health Awareness',
    cardDescription:
      'Local-language menstrual hygiene workshops and sanitary napkin kit distribution for 150 tribal women and 50 adolescent girls in Mamnoli, Kalyan, conducted with Aapla Thane Foundation.',
    cardKeyStat: '200 Participants · 150 Tribal Women & 50 Adolescent Girls',
    cardStatIcon: 'users',
    introduction:
      'Conducted in partnership with Aapla Thane Foundation in Mamnoli, Kalyan, this outreach reached 200 participants—150 tribal women and 50 adolescent girls—through respectful local-language menstrual health sessions, sanitary napkin kit distribution, and preventive health awareness.',
    seoTitle: 'Menstrual Hygiene Awareness, Mamnoli — Garad Foundation',
    seoDescription:
      'In partnership with Aapla Thane Foundation, Garad Foundation reached 150 tribal women and 50 adolescent girls in Mamnoli, Kalyan on 25 February 2020 with menstrual hygiene workshops and sanitary pad kits.',
    cardImage: {
      imagePath: null,
      alt: 'Archival media slot for Menstrual Hygiene Awareness session in Mamnoli, Kalyan on 25 February 2020',
      caption: 'Menstrual hygiene awareness workshop and sanitary kit distribution in Mamnoli, Kalyan.',
      dateRecorded: '25 February 2020',
      locationRecorded: 'Mamnoli, Kalyan, Maharashtra',
      visualMotif: 'health',
      placeholderLabel: 'Safeguarding-Reviewed Photo Pending Upload',
    },
    heroImage: {
      imagePath: null,
      alt: 'Safeguarding-protected archival frame for Menstrual Hygiene Awareness and Sanitary Pad Distribution in Mamnoli, Kalyan',
      caption:
        'Local-language menstrual health dialogue and sanitary napkin kit distribution held in Mamnoli, Kalyan in collaboration with Aapla Thane Foundation.',
      dateRecorded: '25 February 2020',
      locationRecorded: 'Mamnoli, Kalyan, Maharashtra',
      visualMotif: 'health',
      placeholderLabel: 'Field Photography Subject to Participant Consent Review',
      safeguardingNote:
        'To respect participant privacy and safeguarding standards for adolescent girls and health sessions, identifiable photographs are displayed only with documented written consent.',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'ACTIVITY DATE',
        title: '25 February 2020',
        subtitle: 'Activity Report Edition 2020–21',
        icon: 'calendar',
      },
      {
        id: 'location',
        eyebrow: 'LOCATION',
        title: 'Mamnoli, Kalyan',
        subtitle: 'Maharashtra · Tribal Community Outreach',
        icon: 'map-pin',
      },
      {
        id: 'partner',
        eyebrow: 'COLLABORATING PARTNER',
        title: 'Aapla Thane Foundation',
        subtitle: '200 Documented Participants',
        icon: 'users',
      },
    ],
    verifiedMetrics: [
      { value: '150', label: 'Tribal Women Reached', accent: 'forest' },
      { value: '50', label: 'Adolescent Girls Reached', accent: 'terracotta' },
    ],
    needAndRationale: {
      id: 'need-rationale',
      eyebrow: 'NEED & RATIONALE',
      heading: 'Addressing Silence, Stigma, and Access Barriers in Rural Health',
      paragraphs: [
        'In many rural and tribal settlements across Maharashtra, menstruation remains surrounded by stigma, myths, and limited access to accurate biological guidance or safe sanitary products. Adolescent girls and women frequently lack open, non-judgemental spaces to ask practical hygiene questions in their own language.',
        'Organised in Mamnoli, Kalyan, this initiative aimed to pair practical sanitary kit access with open, culturally respectful dialogue—helping participants adopt safer menstrual hygiene practices and recognise when preventive health attention is needed.',
      ],
    },
    whatWeDid: {
      id: 'what-we-did',
      eyebrow: 'WHAT WE DID',
      heading: 'Local-Language Sessions, Sanitary Kits, and Preventive Screening',
      paragraphs: [
        'Working jointly with Aapla Thane Foundation, facilitators led interactive local-language awareness sessions addressing menstrual biology, common myths, preventive personal hygiene, safe sanitary pad usage, and responsible disposal methods.',
        'Sanitary napkin kits were distributed to all 200 documented participants (150 tribal women and 50 adolescent girls). As documented in the activity report, the camp also included basic health screening for anaemia and reproductive health symptoms, with referrals provided where needed.',
      ],
    },
    objectivesSectionEyebrow: 'DOCUMENTED OBJECTIVES',
    objectivesSectionHeading: 'Core Objectives of the Mamnoli Health Drive',
    objectives: [
      {
        id: 'obj-1',
        title: 'Practical Menstrual Hygiene Awareness',
        description:
          'Share clear biological facts, dispel myths, and guide safe pad usage and hygienic disposal.',
        icon: 'book',
      },
      {
        id: 'obj-2',
        title: 'Sanitary Napkin Kit Distribution',
        description:
          'Distribute sanitary napkin kits directly to participating tribal women and adolescent girls.',
        icon: 'heart',
      },
      {
        id: 'obj-3',
        title: 'Respectful Local-Language Dialogue',
        description:
          'Encourage open, supportive conversation in familiar local language free from hesitation or taboo.',
        icon: 'users',
      },
      {
        id: 'obj-4',
        title: 'Preventive Health Awareness',
        description:
          'Support preventive reproductive health awareness, basic anaemia symptom checks, and timely referrals.',
        icon: 'shield',
      },
    ],
    implementation: {
      deliveryModel: 'Joint community outreach with Aapla Thane Foundation',
    },
    participationDetails: {
      eyebrow: 'PARTNERSHIP & COMMUNITY INVOLVEMENT',
      heading: '200 Participants Across Two Community Cohorts',
      paragraphs: [
        'Strong local coordination with Aapla Thane Foundation enabled respectful community mobilisation in Mamnoli, welcoming both adult tribal women and adolescent girls into an approachable learning environment.',
      ],
      participantSplit: [
        {
          label: 'Tribal Women',
          count: 150,
          sharePercent: 75,
          tone: 'forest',
        },
        {
          label: 'Adolescent Girls',
          count: 50,
          sharePercent: 25,
          tone: 'terracotta',
        },
      ],
      healthScreeningNote:
        'Basic health screening for anaemia and reproductive health symptoms was conducted during the outreach, with referrals provided where needed. Individual screening and referral counts are not specified in the report.',
    },
    partners: [
      {
        name: 'Aapla Thane Foundation',
        role: 'Field Outreach & Community Health Partner',
      },
    ],
    outputs: {
      sidebarTitle: 'SESSION TOPICS & PROVISIONS',
      items: [
        'Menstrual hygiene fundamentals & biological facts',
        'Addressing social myths through local-language dialogue',
        'Safe sanitary pad usage & hygienic disposal guidance',
        'Sanitary napkin kits distributed to 200 participants',
        'Basic screening for anaemia & reproductive symptoms with referrals where needed',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION',
      heading: 'Dignity Begins with Open, Informed Conversation',
      paragraphs: [
        'Combining practical hygiene supplies with respectful local-language dialogue proved essential in Mamnoli. Rather than treating distribution as a one-way handout, collaborative facilitation with Aapla Thane Foundation created a trusted space where women and adolescent girls could engage candidly with preventive health knowledge.',
      ],
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival safeguarding placeholder for Mamnoli menstrual hygiene awareness session',
        caption: 'Local-language menstrual health awareness workshop in Mamnoli, Kalyan (25 February 2020).',
        dateRecorded: '25 February 2020',
        locationRecorded: 'Mamnoli, Kalyan, Maharashtra',
        visualMotif: 'health',
        placeholderLabel: 'Archival Photo Slot 01 · Awareness Session (Consent-Gated)',
      },
      {
        imagePath: null,
        alt: 'Archival safeguarding placeholder for sanitary napkin kit distribution with Aapla Thane Foundation',
        caption: 'Sanitary napkin kit distribution organised jointly with Aapla Thane Foundation.',
        dateRecorded: '25 February 2020',
        locationRecorded: 'Mamnoli, Kalyan, Maharashtra',
        visualMotif: 'health',
        placeholderLabel: 'Archival Photo Slot 02 · Kit Distribution (Consent-Gated)',
      },
    ],
    relatedActivitySlugs: [
      'utsavachi-shidori',
      'mission-bharari-phase-1',
      'online-videography-awareness-contest',
    ],
  },

  /* =====================================================================
     ACTIVITY 03 — ONLINE ESSAY & POETRY COMPETITION
     ===================================================================== */
  {
    id: 'activity-03',
    slug: 'online-essay-poetry-competition',
    archiveNumber: 'ACTIVITY 03',
    title: 'Online Essay & Poetry Competition',
    shortTitle: 'Online Essay & Poetry Contest',
    year: '2020-21',
    yearDisplay: '2020–21',
    date: 'Academic Year 2020–21',
    cardDate: '2020–21',
    location: 'Online',
    cardLocation: 'Online',
    category: 'Youth Development',
    cardDescription:
      'Accessible digital literary platform engaging 30 youth participants across Marathi, Hindi, and English in essay and poetry writing on a shared theme rooted in Indian history.',
    cardKeyStat: '30 Youth Participants · Marathi, Hindi & English',
    cardStatIcon: 'pen',
    introduction:
      'Hosted online during the 2020–21 academic year, this multilingual competition invited 30 young writers to explore a common theme rooted in Indian history through essays and poetry in Marathi, Hindi, and English.',
    seoTitle: 'Online Essay & Poetry Competition (2020–21) — Garad Foundation',
    seoDescription:
      '30 youth participants submitted essays and poetry in Marathi, Hindi, and English on a common Indian history theme in Garad Foundation’s 2020–21 Online Essay & Poetry Competition.',
    cardImage: {
      imagePath: null,
      alt: 'Archival media slot for Garad Foundation 2020-21 Online Essay and Poetry Competition',
      caption: 'Multilingual digital essay and poetry submissions in Marathi, Hindi, and English (Academic Year 2020–21).',
      dateRecorded: 'Academic Year 2020–21',
      locationRecorded: 'Online',
      visualMotif: 'literature',
      placeholderLabel: 'Digital Archive Visual Pending Upload',
    },
    heroImage: {
      imagePath: null,
      alt: 'Archival record frame for Garad Foundation Online Essay and Poetry Competition 2020-21',
      caption:
        'Digital entries submitted across Marathi, Hindi, and English in Essay and Poetry formats on a common theme rooted in Indian history.',
      dateRecorded: 'Academic Year 2020–21',
      locationRecorded: 'Online',
      visualMotif: 'literature',
      placeholderLabel: 'Archival Submission Collages Pending Upload',
      safeguardingNote:
        'Sample competition certificates and archived entry excerpts will be added once cleared for public display.',
    },
    metadataCards: [
      {
        id: 'period',
        eyebrow: 'REPORTING PERIOD',
        title: 'Academic Year 2020–21',
        subtitle: 'Exact event date not recorded in archive',
        icon: 'calendar',
      },
      {
        id: 'mode',
        eyebrow: 'DELIVERY MODE',
        title: 'Online Digital Platform',
        subtitle: 'Marathi · Hindi · English',
        icon: 'globe',
      },
      {
        id: 'theme',
        eyebrow: 'SHARED THEME & FORMATS',
        title: 'Indian History',
        subtitle: 'Essay & Poetry · 30 Participants',
        icon: 'book',
      },
    ],
    verifiedMetrics: [
      { value: '30', label: 'Youth Participants', accent: 'forest' },
      { value: '3', label: 'Languages Supported', accent: 'terracotta' },
    ],
    needAndRationale: {
      id: 'need-rationale',
      eyebrow: 'NEED & RATIONALE',
      heading: 'Sustaining Reading, Inquiry, and Expression Beyond Classrooms',
      paragraphs: [
        'During the 2020–21 academic year, prolonged interruptions to regular school and college routines narrowed opportunities for co-curricular reading, reflective writing, and cultural engagement among young learners.',
        'Garad Foundation introduced an accessible online literary platform so youth could express ideas in the language most natural to them—Marathi, Hindi, or English—while deepening independent inquiry into Indian history.',
      ],
    },
    whatWeDid: {
      id: 'what-we-did',
      eyebrow: 'WHAT WE DID',
      heading: 'Multilingual Digital Submissions, Review, and E-Certificate Recognition',
      paragraphs: [
        'Participants submitted original digital entries in either Essay or Poetry format centered on a common theme rooted in Indian history. Accepting entries across Marathi, Hindi, and English lowered linguistic barriers and welcomed students from diverse educational backgrounds.',
        'Every entry submitted by the 30 youth participants was individually reviewed and appreciated, and top participants were recognised with e-certificates.',
      ],
    },
    objectivesSectionEyebrow: 'DOCUMENTED OBJECTIVES',
    objectivesSectionHeading: 'Core Objectives of the Literary Initiative',
    objectives: [
      {
        id: 'obj-1',
        title: 'Independent Reading & Self-Learning',
        description:
          'Encourage young participants to research historical topics independently outside formal exam syllabi.',
        icon: 'book',
      },
      {
        id: 'obj-2',
        title: 'Creative Expression & Critical Thinking',
        description:
          'Foster thoughtful writing, structured argument in essays, and reflective expression in poetry.',
        icon: 'sparkles',
      },
      {
        id: 'obj-3',
        title: 'Accessible Multilingual Digital Platform',
        description:
          'Enable participation from home across Marathi, Hindi, and English without geographic restrictions.',
        icon: 'users',
      },
      {
        id: 'obj-4',
        title: 'Cultural & Historical Awareness',
        description:
          'Strengthen connection to shared heritage through a common theme rooted in Indian history.',
        icon: 'award',
      },
    ],
    implementation: {
      deliveryModel: 'Digital entry submission, individual review, and e-certificate recognition',
      languages: ['Marathi', 'Hindi', 'English'],
      formats: ['Essay', 'Poetry'],
      themeSummary: 'A common theme rooted in Indian history',
    },
    participationDetails: {
      eyebrow: 'PARTICIPATION & ACTIVITY HIGHLIGHTS',
      heading: 'Three Languages, Two Literary Formats, Thirty Young Voices',
      paragraphs: [
        'Opening the competition in three languages allowed participants to write with confidence and nuance. Every submission was reviewed and appreciated to ensure first-time writers received encouragement alongside e-certificate recognition for top entries.',
      ],
    },
    outputs: {
      sidebarTitle: 'ACTIVITY SUMMARY',
      items: [
        '30 verified youth participants',
        '3 participating languages: Marathi, Hindi, and English',
        '2 creative formats: Essay and Poetry',
        'Common theme rooted in Indian history',
        'Every submission reviewed and appreciated; e-certificates issued to top participants',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION',
      heading: 'Encouraging Reflective Youth Voice Online',
      paragraphs: [
        'Even in a fully online format, thoughtful review and multilingual inclusion turned a simple literary contest into a meaningful space for self-learning. Recognising every contributor helped sustain young people’s confidence during an uncertain academic year.',
      ],
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival slot for Online Essay and Poetry Competition digital announcement and e-certificate archive',
        caption: 'Digital competition archive covering Essay and Poetry submissions in Marathi, Hindi, and English (2020–21).',
        dateRecorded: 'Academic Year 2020–21',
        locationRecorded: 'Online',
        visualMotif: 'literature',
        placeholderLabel: 'Archival Slot · E-Certificate & Event Archive',
      },
    ],
    relatedActivitySlugs: [
      'marathi-rajbhasha-divas-spardha',
      'online-videography-awareness-contest',
      'mission-bharari-phase-1',
    ],
  },

  /* =====================================================================
     ACTIVITY 04 — ONLINE VIDEOGRAPHY AWARENESS CONTEST
     ===================================================================== */
  {
    id: 'activity-04',
    slug: 'online-videography-awareness-contest',
    archiveNumber: 'ACTIVITY 04',
    title: 'Online Videography Awareness Contest',
    shortTitle: 'Online Videography Contest',
    year: '2020-21',
    yearDisplay: '2020–21',
    date: '20 March 2020 (as recorded)',
    cardDate: '20 Mar 2020 (as recorded)',
    location: 'Online',
    cardLocation: 'Online · WhatsApp & Email',
    category: 'Public Health & Youth',
    cardDescription:
      '20 youth creators produced short-form COVID-19 awareness videos in Marathi, Hindi, and English submitted via WhatsApp and email, with trophies and signature pens couriered to winners post-lockdown.',
    cardKeyStat: '20 Youth Creators · 2 Documented Awardees',
    cardStatIcon: 'video',
    introduction:
      'Mobilising young people as responsible public-health communicators, the Online Videography Awareness Contest received 20 short-form video submissions via WhatsApp and email across Marathi, Hindi, and English on COVID-19 symptoms, prevention, and creative community awareness.',
    seoTitle: 'Online Videography Awareness Contest — Garad Foundation',
    seoDescription:
      '20 youth creators submitted COVID-19 public-health awareness videos in Marathi, Hindi, and English via WhatsApp and email in Garad Foundation’s Online Videography Awareness Contest.',
    cardImage: {
      imagePath: null,
      alt: 'Archival media slot for Online Videography Awareness Contest held online in 2020',
      caption: 'Short-form COVID-19 awareness video submissions via WhatsApp and email.',
      dateRecorded: '20 March 2020 (as recorded)',
      locationRecorded: 'Online',
      visualMotif: 'video',
      placeholderLabel: 'Video Archive Stills Pending Upload',
    },
    heroImage: {
      imagePath: null,
      alt: 'Archival frame for Garad Foundation Online Videography Awareness Contest featuring 20 youth creators',
      caption:
        'Youth creators submitted short-form COVID-19 awareness videos in Marathi, Hindi, and English via WhatsApp and email, evaluated by the Garad Foundation Core Team.',
      dateRecorded: '20 March 2020 (as recorded)',
      locationRecorded: 'Online (WhatsApp & Email)',
      visualMotif: 'video',
      placeholderLabel: 'Archived Contest Frames Pending Verification',
      safeguardingNote:
        'Original contest video stills and winner prize visuals will be published once verified from archival records.',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE AS RECORDED',
        title: '20 March 2020',
        subtitle: 'Preserved as recorded in activity report',
        icon: 'calendar',
      },
      {
        id: 'channels',
        eyebrow: 'SUBMISSION CHANNELS',
        title: 'WhatsApp & Email',
        subtitle: 'Marathi, Hindi & English entries',
        icon: 'globe',
      },
      {
        id: 'evaluation',
        eyebrow: 'EVALUATION PANEL',
        title: 'Core Team Review',
        subtitle: 'Creativity, clarity & communication',
        icon: 'award',
      },
    ],
    verifiedMetrics: [
      { value: '20', label: 'Youth Creators Submitted', accent: 'forest' },
      { value: '3', label: 'Public Health Themes', accent: 'terracotta' },
    ],
    needAndRationale: {
      id: 'need-rationale',
      eyebrow: 'NEED & RATIONALE',
      heading: 'Empowering Peer-to-Peer Public Health Communication',
      paragraphs: [
        'As public concern around COVID-19 intensified in early 2020, clear and accessible health information in local languages became vital. Young people were uniquely positioned to translate preventive guidance into relatable short-form visual messages for families and peers.',
        'By keeping participation lightweight—accepting videos directly through WhatsApp and email—Garad Foundation invited youth to step forward as responsible digital communicators rather than passive bystanders.',
      ],
    },
    whatWeDid: {
      id: 'what-we-did',
      eyebrow: 'WHAT WE DID',
      heading: 'Multilingual Short-Form Video Submissions and Core Team Evaluation',
      paragraphs: [
        'Participants submitted short awareness videos in Marathi, Hindi, or English focused on three clearly defined public-health themes: understanding COVID-19 symptoms, preventive measures, and creative ways to spread accurate awareness.',
        'All 20 verified submissions were evaluated by the Garad Foundation Core Team on creativity, clarity, and communication effectiveness. Recognised winners received a trophy and signature pen, couriered safely after lockdown restrictions eased.',
      ],
    },
    objectivesSectionEyebrow: 'DOCUMENTED OBJECTIVES',
    objectivesSectionHeading: 'Core Objectives of the Awareness Contest',
    objectives: [
      {
        id: 'obj-1',
        title: 'Clear COVID-19 Awareness',
        description:
          'Spread accurate, understandable public-health messages on symptoms and everyday prevention.',
        icon: 'shield',
      },
      {
        id: 'obj-2',
        title: 'Responsible Youth Peer Communicators',
        description:
          'Engage young citizens constructively as credible peer voices during a public-health challenge.',
        icon: 'users',
      },
      {
        id: 'obj-3',
        title: 'Short-Form Visual Storytelling',
        description:
          'Use accessible smartphone video storytelling across Marathi, Hindi, and English.',
        icon: 'video',
      },
      {
        id: 'obj-4',
        title: 'Digital Confidence & Creative Leadership',
        description:
          'Build communication confidence and civic creative leadership among student creators.',
        icon: 'sparkles',
      },
    ],
    implementation: {
      submissionChannels: ['WhatsApp', 'Email'],
      languages: ['Marathi', 'Hindi', 'English'],
      evaluatedBy: 'Garad Foundation Core Team',
      evaluationCriteria: ['Creativity', 'Clarity', 'Communication'],
      prizeFulfilment: 'Trophy and signature pen, couriered after lockdown',
    },
    participationDetails: {
      eyebrow: 'CONTEST STRUCTURE & THEMES',
      heading: 'Three Core Public-Health Themes Across 20 Submissions',
      paragraphs: [
        'Accepting videos over WhatsApp and email ensured creators could participate with ordinary mobile phones without complex software or upload portals.',
      ],
      videoThemes: [
        'COVID-19 symptoms',
        'Preventive measures',
        'Creative ways to spread awareness',
      ],
    },
    winners: {
      eyebrow: 'RECOGNISED WINNERS & PRIZES',
      heading: 'Documented Contest Awardees',
      subtitle:
        'Evaluated by the Garad Foundation Core Team on creativity, clarity, and communication.',
      entries: [
        {
          rank: 'First Prize',
          name: 'Janhavi Dandekar',
          workTitle: 'Understanding Symptoms of COVID-19',
          tier: 'first',
        },
        {
          rank: 'Second Prize',
          name: 'Dinraj Aponkar',
          workTitle: 'Corona Awareness',
          tier: 'second',
        },
      ],
      fulfilmentNote:
        'Prize fulfilment: Trophy and signature pen, couriered after lockdown.',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED HIGHLIGHTS',
      items: [
        '20 verified youth creator submissions',
        'Submission channels: WhatsApp and email',
        'Languages: Marathi, Hindi, and English',
        '3 structured COVID-19 awareness themes',
        'Trophy & signature pen couriered to winners post-lockdown',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION',
      heading: 'Turning Everyday Smartphones into Civic Awareness Tools',
      paragraphs: [
        'The contest highlighted how swiftly young people respond when invited to contribute constructively to community wellbeing. Following through on physical prize couriers after lockdown also reinforced trust and follow-through with participating youth.',
      ],
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival slot for Online Videography Awareness Contest winner recognition',
        caption: 'First and Second Prize winners received trophies and signature pens couriered after lockdown.',
        dateRecorded: '20 March 2020 (as recorded)',
        locationRecorded: 'Online',
        visualMotif: 'video',
        placeholderLabel: 'Archival Slot · Contest Recognition & Trophies',
      },
    ],
    relatedActivitySlugs: [
      'online-essay-poetry-competition',
      'marathi-rajbhasha-divas-spardha',
      'mission-bharari-phase-1',
    ],
  },

  /* =====================================================================
     ACTIVITY 05 — MISSION BHARARI – PHASE 1
     ===================================================================== */
  {
    id: 'activity-05',
    slug: 'mission-bharari-phase-1',
    archiveNumber: 'ACTIVITY 05',
    title: 'Mission Bharari – Phase 1',
    shortTitle: 'Mission Bharari – Phase 1',
    year: '2020-21',
    yearDisplay: '2020–21',
    date: '3 February 2021',
    cardDate: '3 Feb 2021',
    location: 'Bhor Taluka, Pune District, Maharashtra',
    cardLocation: 'Bhor Taluka, Pune District',
    category: 'Education',
    isFlagship: true,
    cardDescription:
      'Volunteer-led rural education initiative using a baseline survey and 100% digital crowdfunding to distribute essential stationery kits to 220 students across 10 Zilla Parishad schools.',
    cardKeyStat: '220 Students · 10 Zilla Parishad Schools (Reported)',
    cardStatIcon: 'graduation',
    introduction:
      'Responding to material barriers faced by rural students during pandemic school disruptions, Mission Bharari – Phase 1 combined a field baseline survey, 100% digital crowdfunding by youth volunteers, and COVID-safe distribution of essential stationery kits to 220 students across 10 Zilla Parishad schools in Bhor Taluka, Pune District.',
    seoTitle: 'Mission Bharari – Phase 1 (Bhor Taluka) — Garad Foundation',
    seoDescription:
      'On 3 February 2021, Garad Foundation’s youth-led digital crowdfunding drive delivered essential stationery kits to 220 students across 10 Zilla Parishad schools in Bhor Taluka, Pune District.',
    cardImage: {
      imagePath: null,
      alt: 'Archival media slot for Mission Bharari Phase 1 stationery distribution in Bhor Taluka, Pune District on 3 February 2021',
      caption: 'Essential stationery kit distribution across 10 Zilla Parishad schools in Bhor Taluka (3 February 2021).',
      dateRecorded: '3 February 2021',
      locationRecorded: 'Bhor Taluka, Pune District, Maharashtra',
      visualMotif: 'education',
      placeholderLabel: 'Field Photography Pending Consent & Verification',
    },
    heroImage: {
      imagePath: null,
      alt: 'Safeguarding-aware archival frame for Mission Bharari Phase 1 distribution across 10 Zilla Parishad schools in Bhor Taluka, Pune District',
      caption:
        'Essential stationery kits—including notebooks, pens, geometry kits, erasers, and basic supplies—distributed by volunteers under COVID-19 precautions in Bhor Taluka, Pune District.',
      dateRecorded: '3 February 2021',
      locationRecorded: 'Bhor Taluka, Pune District, Maharashtra',
      visualMotif: 'education',
      placeholderLabel: 'Safeguarding-Reviewed Field Photos Pending Upload',
      safeguardingNote:
        'In accordance with child-safeguarding standards, classroom photographs featuring identifiable students are published only after written institutional and guardian clearance.',
    },
    metadataCards: [
      {
        id: 'deployment',
        eyebrow: 'FIELD DEPLOYMENT',
        title: '3 February 2021',
        subtitle: 'Activity Report Edition 2020–21',
        icon: 'calendar',
      },
      {
        id: 'scope',
        eyebrow: 'GEOGRAPHIC SCOPE',
        title: 'Bhor Taluka, Pune District',
        subtitle: '10 Zilla Parishad Schools · Maharashtra',
        icon: 'map-pin',
      },
      {
        id: 'funding',
        eyebrow: 'FUNDING & DELIVERY MODEL',
        title: '100% Digital Crowdfunding',
        subtitle: 'Volunteer-Led Distribution',
        icon: 'users',
      },
    ],
    verifiedMetrics: [
      { value: '220', label: 'Students Supported', accent: 'forest' },
      { value: '10', label: 'ZP Schools Reached', accent: 'terracotta' },
    ],
    metricsDisclaimer:
      'Figures reflect internal activity reporting from the 2020–21 report edition (not independently audited).',
    needAndRationale: {
      id: 'need-baseline',
      eyebrow: 'THE NEED & BASELINE SURVEY',
      heading: 'Identifying Material Barriers Across Remote Zilla Parishad Schools',
      paragraphs: [
        'Pandemic-related disruptions placed severe strain on rural households in Bhor Taluka, Pune District. Even as students prepared to continue studies, many families struggled to afford basic classroom necessities such as notebooks, pens, geometry kits, and erasers.',
        'Before raising funds or procuring supplies, a field coordinator conducted a structured baseline survey across 10 Zilla Parishad schools in Bhor Taluka. Mapping student requirements directly on the ground ensured that stationery kits responded to genuine classroom needs rather than assumptions.',
      ],
    },
    whatWeDid: {
      id: 'campaign-strategy',
      eyebrow: 'CAMPAIGN STRATEGY & EXECUTION',
      heading: 'Youth-Led Digital Crowdfunding and COVID-Safe Field Delivery',
      paragraphs: [
        'Guided by the baseline survey, Garad Foundation youth volunteers launched a 100% digital crowdfunding drive—mobilising contributions through WhatsApp outreach, social media updates, and personal phone calls to friends, families, and community well-wishers.',
        'Once supplies were assembled—comprising notebooks, pens, geometry kits, erasers, and other essential stationery—volunteers travelled to Bhor Taluka on 3 February 2021 to distribute kits directly to 220 students across the 10 surveyed Zilla Parishad schools while observing COVID-19 safety precautions.',
      ],
    },
    objectivesSectionEyebrow: 'DOCUMENTED OBJECTIVES',
    objectivesSectionHeading: 'Core Objectives of Mission Bharari – Phase 1',
    objectives: [
      {
        id: 'obj-1',
        title: 'Essential Stationery for Rural Students',
        description:
          'Provide notebooks, pens, geometry kits, erasers, and essential supplies directly to rural Zilla Parishad learners.',
        icon: 'book',
      },
      {
        id: 'obj-2',
        title: 'Addressing Material Barriers',
        description:
          'Reduce practical material barriers that hinder consistent classroom participation and homework practice.',
        icon: 'graduation',
      },
      {
        id: 'obj-3',
        title: 'Supporting Dignity & Encouragement',
        description:
          'Hand over complete individual stationery kits with care to encourage students and support their dignity.',
        icon: 'heart',
      },
      {
        id: 'obj-4',
        title: 'Transparent Youth-Led Crowdfunding',
        description:
          'Establish a repeatable, transparent youth-led digital crowdfunding and volunteer delivery model.',
        icon: 'shield',
      },
    ],
    implementation: {
      fundingModel: '100% digital crowdfunding (WhatsApp, social media & personal calls)',
      deliveryModel: 'Volunteer-led field distribution under COVID-19 precautions',
      methodology: {
        eyebrow: 'DOCUMENTED THREE-STAGE METHODOLOGY',
        heading: 'From Baseline Survey to COVID-Safe Delivery',
        stages: [
          {
            stageNumber: 'STAGE 01',
            subtitleMeta: '10 Zilla Parishad Schools',
            title: 'Baseline Survey',
            description:
              'A field coordinator surveyed 10 Zilla Parishad schools in Bhor Taluka, Pune District to assess ground needs and catalog stationery requirements for 220 rural students.',
            footerLabel: 'Field Need Assessment',
            accent: 'sage',
            icon: 'clipboard',
          },
          {
            stageNumber: 'STAGE 02',
            subtitleMeta: '100% Digital Crowdfunding',
            title: 'Digital Crowdfunding',
            description:
              'Youth volunteers mobilised community donations through WhatsApp outreach, social media posts, and personal calls—funding stationery procurement transparently without intermediaries.',
            footerLabel: 'Youth-Led Mobilisation',
            accent: 'terracotta',
            icon: 'users',
          },
          {
            stageNumber: 'STAGE 03',
            subtitleMeta: '3 February 2021 · Volunteer-Led',
            title: 'COVID-Safe Delivery',
            description:
              'Volunteers assembled and distributed essential stationery kits—notebooks, pens, geometry kits, erasers, and related supplies—to 220 students under COVID-19 precautions.',
            footerLabel: 'Direct Field Distribution',
            accent: 'forest',
            icon: 'truck',
          },
        ],
      },
    },
    participationDetails: {
      eyebrow: 'DOCUMENTED OUTPUTS & HIGHLIGHTS',
      heading: 'Reaching 220 Students Across 10 Rural Schools',
      paragraphs: [
        'Mission Bharari – Phase 1 connected urban youth volunteers directly with rural public-school communities in Bhor Taluka. By pairing ground-level survey work with accessible peer crowdfunding, volunteers delivered complete individual stationery supplies in a single coordinated field deployment on 3 February 2021.',
      ],
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED KIT ITEMS',
      items: [
        'Notebooks',
        'Pens',
        'Geometry kits',
        'Erasers',
        'Other essential stationery',
      ],
      summaryNote:
        'Reported outputs: 220 students supported across 10 Zilla Parishad schools in Bhor Taluka, Pune District (100% digital crowdfunding, volunteer-led delivery).',
    },
    reflection: {
      eyebrow: 'REFLECTION',
      heading: 'A Repeatable Blueprint for Youth-Led Rural Education Support',
      paragraphs: [
        'Mission Bharari – Phase 1 demonstrated how structured field surveys and transparent peer crowdfunding can bridge practical gaps for rural learners. Equipping students with their own stationery supplies strengthened readiness for classroom participation while laying an operational foundation for future phases.',
      ],
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival safeguarding slot for Mission Bharari Phase 1 baseline survey across 10 Zilla Parishad schools',
        caption: 'Stage 01 — Baseline survey across 10 Zilla Parishad schools in Bhor Taluka, Pune District.',
        dateRecorded: '3 February 2021',
        locationRecorded: 'Bhor Taluka, Pune District',
        visualMotif: 'education',
        placeholderLabel: 'Archival Photo Slot 01 · Kit Assembly',
      },
      {
        imagePath: null,
        alt: 'Archival safeguarding slot for Mission Bharari Phase 1 stationery kit distribution',
        caption: 'Stage 03 — Essential stationery kits (notebooks, pens, geometry kits, erasers) distributed under COVID-19 precautions.',
        dateRecorded: '3 February 2021',
        locationRecorded: 'Bhor Taluka, Pune District',
        visualMotif: 'education',
        placeholderLabel: 'Archival Photo Slot 02 · School Handover (Consent-Gated)',
      },
      {
        imagePath: null,
        alt: 'Archival safeguarding slot for Mission Bharari Phase 1 volunteer logistics in Bhor Taluka',
        caption: 'Volunteer-led transport and distribution across participating Zilla Parishad schools.',
        dateRecorded: '3 February 2021',
        locationRecorded: 'Bhor Taluka, Pune District',
        visualMotif: 'education',
        placeholderLabel: 'Archival Photo Slot 03 · Field Team Dispatch',
      },
    ],
    relatedActivitySlugs: [
      'utsavachi-shidori',
      'menstrual-hygiene-awareness',
      'marathi-rajbhasha-divas-spardha',
    ],
  },

  /* =====================================================================
     ACTIVITY 06 — MARATHI RAJBHASHA DIVAS SPARDHA
     ===================================================================== */
  {
    id: 'activity-06',
    slug: 'marathi-rajbhasha-divas-spardha',
    archiveNumber: 'ACTIVITY 06',
    title: 'Marathi Rajbhasha Divas Spardha',
    shortTitle: 'Marathi Rajbhasha Divas Spardha',
    year: '2020-21',
    yearDisplay: '2020–21',
    date: '27 February (Exact year not specified)',
    cardDate: '27 Feb · Year not specified',
    location: 'Online',
    cardLocation: 'Online · Elocution (Vakta Spardha)',
    category: 'Language & Culture',
    cardDescription:
      'Online elocution competition (Vakta Spardha) celebrating Marathi literature, cultural heritage, and social themes through recorded speeches, honouring 8 named awardees.',
    cardKeyStat: '8 Named Awardees · Elocution (Vakta Spardha)',
    cardStatIcon: 'award',
    introduction:
      'Observed on 27 February (exact year not specified in the report), Marathi Rajbhasha Divas Spardha provided an online elocution platform (Vakta Spardha) where participants submitted recorded speeches celebrating Marathi literature, cultural heritage, and social issues.',
    seoTitle: 'Marathi Rajbhasha Divas Spardha — Garad Foundation Archive',
    seoDescription:
      'Garad Foundation hosted an online Marathi elocution competition (Vakta Spardha) on 27 February celebrating Marathi literature, cultural heritage, and social issues, recognising 8 named awardees.',
    cardImage: {
      imagePath: null,
      alt: 'Archival media slot for Marathi Rajbhasha Divas Spardha online elocution competition',
      caption: 'Online elocution competition (Vakta Spardha) observed on 27 February.',
      dateRecorded: '27 February (year not specified)',
      locationRecorded: 'Online',
      visualMotif: 'culture',
      placeholderLabel: 'Event Archive Visual Pending Upload',
    },
    heroImage: {
      imagePath: null,
      alt: 'Archival frame for Garad Foundation Marathi Rajbhasha Divas Spardha online elocution competition',
      caption:
        'Participants submitted recorded Marathi speeches online on Marathi literature, cultural heritage, and social issues, evaluated on content, clarity, fluency, and emotional expression.',
      dateRecorded: '27 February (year not specified)',
      locationRecorded: 'Online',
      visualMotif: 'culture',
      placeholderLabel: 'Competition Certificates & Archive Pending Upload',
      safeguardingNote:
        'Verified event banners and awardee certificate snapshots will be added once confirmed against original records.',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'RECORDED DATE',
        title: '27 February',
        subtitle: 'Exact year not specified in report',
        icon: 'calendar',
      },
      {
        id: 'format',
        eyebrow: 'COMPETITION TYPE',
        title: 'Elocution (Vakta Spardha)',
        subtitle: 'Online Recorded Speeches',
        icon: 'globe',
      },
      {
        id: 'awardees',
        eyebrow: 'VERIFIED NAMED AWARDEES',
        title: '8 Named Awardees',
        subtitle: 'First, Second & 6 Consolation Prizes',
        icon: 'award',
      },
    ],
    verifiedMetrics: [
      { value: '8', label: 'Named Awardees Documented', accent: 'forest' },
      { value: '4', label: 'Evaluation Criteria', accent: 'terracotta' },
    ],
    needAndRationale: {
      id: 'need-objective',
      eyebrow: 'NEED & OBJECTIVE',
      heading: 'Celebrating Marathi Language, Literature, and Confident Youth Oratory',
      paragraphs: [
        'Marathi Rajbhasha Divas on 27 February honours Maharashtra’s rich linguistic and literary legacy. Providing structured opportunities for young speakers to engage deeply with Marathi literature, cultural heritage, and contemporary social questions nurtures both linguistic pride and articulate public communication.',
        'Hosting the elocution competition (Vakta Spardha) online enabled speakers to prepare and record speeches from anywhere, preserving cultural celebration even when in-person auditorium gatherings were impractical.',
      ],
    },
    whatWeDid: {
      id: 'what-we-did',
      eyebrow: 'WHAT WE DID',
      heading: 'Recorded Online Elocution Evaluated on Four Core Criteria',
      paragraphs: [
        'Participants prepared and submitted recorded Marathi speeches online addressing themes drawn from Marathi literature, cultural heritage, and social issues.',
        'Submissions were carefully evaluated across four stated criteria—content, clarity, fluency, and emotional expression—resulting in the recognition of eight named awardees across First Prize, Second Prize, and six Consolation honours.',
      ],
    },
    objectivesSectionEyebrow: 'DOCUMENTED OBJECTIVES',
    objectivesSectionHeading: 'Core Objectives of Marathi Rajbhasha Divas Spardha',
    objectives: [
      {
        id: 'obj-1',
        title: 'Pride in Marathi Language & Heritage',
        description:
          'Promote appreciation and pride in Marathi literature, linguistic richness, and cultural traditions.',
        icon: 'award',
      },
      {
        id: 'obj-2',
        title: 'Accessible Online Elocution Platform',
        description:
          'Provide an open online Vakta Spardha platform for youth elocution via recorded speeches.',
        icon: 'mic',
      },
      {
        id: 'obj-3',
        title: 'Confident & Respectful Expression',
        description:
          'Encourage thoughtful, fluent, and respectful public speaking on literature and social issues.',
        icon: 'sparkles',
      },
    ],
    implementation: {
      deliveryModel: 'Online recorded speech submissions (Vakta Spardha)',
      languages: ['Marathi'],
      formats: ['Elocution (Vakta Spardha)'],
      themeSummary: 'Marathi literature, cultural heritage, and social issues',
      evaluationCriteria: ['Content', 'Clarity', 'Fluency', 'Emotional expression'],
    },
    winners: {
      eyebrow: 'NAMED AWARDEES',
      heading: 'Documented Awardees — Marathi Rajbhasha Divas Spardha',
      subtitle:
        'Eight named awardees recorded in the activity report across First Prize, Second Prize, and Consolation honours.',
      entries: [
        { rank: 'First Prize', name: 'Akshay Jadhav', tier: 'first' },
        { rank: 'Second Prize', name: 'Chandranshu Chakrakint', tier: 'second' },
        { rank: 'Consolation', name: 'Gayatri Gokhale', tier: 'consolation' },
        { rank: 'Consolation', name: 'Pradnya Jagtap', tier: 'consolation' },
        { rank: 'Consolation', name: 'Ishwari Kedar', tier: 'consolation' },
        { rank: 'Consolation', name: 'Poorva Kekean', tier: 'consolation' },
        { rank: 'Consolation', name: 'Sagar Kawale', tier: 'consolation' },
        { rank: 'Consolation', name: 'Sunita Kawale', tier: 'consolation' },
      ],
    },
    outputs: {
      sidebarTitle: 'COMPETITION SUMMARY',
      items: [
        'Format: Online Elocution (Vakta Spardha)',
        'Recorded speeches on Marathi literature, heritage & social issues',
        'Evaluated on content, clarity, fluency & emotional expression',
        '8 named awardees documented (1st, 2nd & 6 Consolation)',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION',
      heading: 'Keeping Cultural Oratory Vibrant Across Digital Spaces',
      paragraphs: [
        'The depth of expression shown across recorded speeches affirmed that cultural celebration thrives when youth are offered respectful platforms to speak in their mother tongue. Documenting and honouring eight speakers celebrated both literary study and public speaking discipline.',
      ],
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival slot for Marathi Rajbhasha Divas Spardha results and certificate archive',
        caption: 'Marathi Rajbhasha Divas Spardha — Online Elocution (Vakta Spardha) recognition archive.',
        dateRecorded: '27 February (year not specified)',
        locationRecorded: 'Online',
        visualMotif: 'culture',
        placeholderLabel: 'Archival Slot · Vakta Spardha Recognition',
      },
    ],
    relatedActivitySlugs: [
      'online-essay-poetry-competition',
      'online-videography-awareness-contest',
      'mission-bharari-phase-1',
    ],
  },
];

export function getActivityBySlug(slug: string): ActivityRecord | undefined {
  return ACTIVITIES.find((item) => item.slug === slug);
}

export function getRelatedActivities(activity: ActivityRecord): ActivityRecord[] {
  return activity.relatedActivitySlugs
    .map((slug) => getActivityBySlug(slug))
    .filter((item): item is ActivityRecord => Boolean(item));
}
