import {
  buildFinancialYearFilters,
  calculateFinancialYear,
  ConcreteFinancialYearId,
  FinancialYearId,
  formatFinancialYearLabel,
  formatFinancialYearShort,
} from '../utils/financialYear';
import {
  ActivityImageType,
  applyActivitySampleImages,
} from './activitySampleImages';

export type { ActivityImageType };
export type FiscalYearId = FinancialYearId;

export type ActivityCategory =
  | 'All'
  | 'Community Welfare'
  | 'Women & Health Awareness'
  | 'Youth Development'
  | 'Public Health & Youth'
  | 'Education'
  | 'Language & Culture'
  | 'Environment';

export type VisualMotif =
  | 'welfare'
  | 'health'
  | 'literature'
  | 'video'
  | 'education'
  | 'culture'
  | 'environment';

export interface ActivityMedia {
  /** Path to an authentic Garad Foundation photograph, a flagged sample preview image, or null when pending archival upload. */
  imagePath: string | null;
  /** Distinguishes authentic Garad Foundation event photography ('original') from illustrative preview imagery ('sample'). */
  imageType?: ActivityImageType;
  /** Optional CSS object-position value to keep key subjects well-framed across responsive crops. */
  objectPosition?: string;
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

export interface CompetitionTracksData {
  eyebrow: string;
  heading: string;
  intro?: string;
  elocution: {
    label: string;
    title: string;
    participantCount: string;
    participantLabel: string;
    summary: string;
    categories: {
      title: string;
      subtitle: string;
      detail: string;
    }[];
    themeTitle: string;
    themeDescription: string;
    prizes: string[];
  };
  folkDance: {
    label: string;
    title: string;
    participantCount: string;
    participantLabel: string;
    summary: string;
    highlightsLabel?: string;
    danceForms: {
      name: string;
      description: string;
    }[];
    closingHighlight: string;
  };
}

export interface ActivityRecord {
  id: string;
  slug: string;
  archiveNumber: string;
  title: string;
  subtitle?: string;
  shortTitle: string;
  year: Exclude<FiscalYearId, 'all'>;
  yearDisplay: string;
  date: string;
  cardDate: string;
  location: string;
  cardLocation: string;
  category: Exclude<ActivityCategory, 'All'>;
  secondaryCategories?: Exclude<ActivityCategory, 'All'>[];
  categoryDisplayLabel?: string;
  isFlagship?: boolean;
  cardDescription: string;
  cardKeyStat: string;
  cardStatIcon:
    | 'box'
    | 'users'
    | 'pen'
    | 'video'
    | 'graduation'
    | 'award'
    | 'heart'
    | 'leaf'
    | 'book';
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
  competitionTracks?: CompetitionTracksData;
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
  getInvolvedCopy?: {
    heading: string;
    description: string;
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

export const CATEGORY_FILTERS: ActivityCategory[] = [
  'All',
  'Community Welfare',
  'Women & Health Awareness',
  'Youth Development',
  'Public Health & Youth',
  'Education',
  'Language & Culture',
  'Environment',
];



const RAW_ACTIVITIES: ActivityRecord[] = [
  /* =====================================================================
     ACTIVITY 01 — UTSAVACHI SHIDORI
     ===================================================================== */
  {
    id: 'activity-01',
    slug: 'utsavachi-shidori',
    archiveNumber: 'ACTIVITY 01',
    title: 'Utsavachi Shidori',
    shortTitle: 'Utsavachi Shidori',
    year: calculateFinancialYear('1 January 2020'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('1 January 2020')),
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
    year: calculateFinancialYear('25 February 2020'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('25 February 2020')),
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
    year: calculateFinancialYear('Academic Year 2020–21'),
    yearDisplay: formatFinancialYearLabel(
      calculateFinancialYear('Academic Year 2020–21')
    ),
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
    year: calculateFinancialYear('20 March 2020 (as recorded)'),
    yearDisplay: formatFinancialYearLabel(
      calculateFinancialYear('20 March 2020 (as recorded)')
    ),
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
    year: calculateFinancialYear('3 February 2021'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('3 February 2021')),
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
    year: calculateFinancialYear(
      '27 February (Exact year not specified)',
      '2020-2021'
    ),
    yearDisplay: formatFinancialYearLabel(
      calculateFinancialYear(
        '27 February (Exact year not specified)',
        '2020-2021'
      )
    ),
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

  /* =====================================================================
     ACTIVITY 07 — ABHIVYAKTA 2024
     ===================================================================== */
  {
    id: 'activity-07',
    slug: 'abhivyakta-2024',
    archiveNumber: 'ACTIVITY 07',
    title: 'Abhivyakta 2024: Voices of Expression and Cultural Celebration',
    subtitle:
      "Celebrating Public Speaking, Confidence and Maharashtra's Cultural Heritage",
    shortTitle: 'Abhivyakta 2024',
    year: calculateFinancialYear('19 February 2024'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('19 February 2024')),
    date: '19 February 2024',
    cardDate: '19 Feb 2024',
    location: 'Thane, Maharashtra',
    cardLocation: 'Thane, Maharashtra',
    category: 'Youth Development',
    secondaryCategories: ['Language & Culture'],
    categoryDisplayLabel: 'Youth Development / Cultural Activities',
    cardDescription:
      "A district-level student event held in Thane on 19 February 2024 celebrating public speaking and Maharashtra's vibrant folk dance traditions, with 60 students in elocution and 75+ students in folk dance.",
    cardKeyStat: '60 Elocution · 75+ Folk Dance Students',
    cardStatIcon: 'award',
    introduction:
      "On February 19, 2024, students from various schools across Thane district gathered for Abhivyakta, a district-level event celebrating public speaking and the vibrant folk dance traditions of Maharashtra. The event provided a platform for students to develop their communication skills, express their ideas confidently and reconnect with Maharashtra's rich cultural heritage.",
    seoTitle:
      'Abhivyakta 2024: Voices of Expression and Cultural Celebration — Garad Foundation',
    seoDescription:
      'Documented record of Abhivyakta 2024 held on 19 February 2024 in Thane, Maharashtra, featuring 60 students in elocution and 75+ students in traditional Maharashtrian folk dance.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Abhivyakta 2024 in Thane, Maharashtra',
      caption:
        'Abhivyakta 2024 — District-level elocution (60 students) and traditional Maharashtrian folk dance (75+ students) event in Thane, Maharashtra on 19 February 2024. Authentic event photographs will be added once verified.',
      dateRecorded: '19 February 2024',
      locationRecorded: 'Thane, Maharashtra',
      visualMotif: 'culture',
      placeholderLabel: 'Archival Photo Pending · Abhivyakta 2024',
      safeguardingNote:
        'Reserved for authentic event photographs from Abhivyakta 2024; stock or synthetic imagery is intentionally omitted.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival placeholder for Abhivyakta 2024 district-level student competition',
      caption:
        'Abhivyakta 2024 — District-level public speaking and traditional Maharashtrian folk dance event in Thane, Maharashtra.',
      dateRecorded: '19 February 2024',
      locationRecorded: 'Thane, Maharashtra',
      visualMotif: 'culture',
      placeholderLabel: 'Abhivyakta 2024 · Thane',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '19 February 2024',
        subtitle: '2024 Archive',
        icon: 'calendar',
      },
      {
        id: 'location',
        eyebrow: 'LOCATION',
        title: 'Thane, Maharashtra',
        subtitle: 'District-Level Event',
        icon: 'map-pin',
      },
      {
        id: 'elocution-reach',
        eyebrow: 'ELOCUTION COMPETITION',
        title: '60 Students',
        subtitle: '5th–7th & 8th–10th Std.',
        icon: 'award',
      },
      {
        id: 'folk-dance-reach',
        eyebrow: 'FOLK DANCE COMPETITION',
        title: '75+ Students',
        subtitle: 'Traditional Maharashtrian Folk Dance',
        icon: 'users',
      },
    ],
    verifiedMetrics: [
      {
        value: '60',
        label: 'Elocution Students',
        sublabel: '5th–7th & 8th–10th Standard',
        accent: 'forest',
      },
      {
        value: '75+',
        label: 'Folk Dance Students',
        sublabel: 'Traditional Maharashtrian Folk Dance',
        accent: 'terracotta',
      },
    ],
    needAndRationale: {
      id: 'introduction',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading:
        "Encouraging Confident Expression and Reconnecting with Maharashtra's Cultural Heritage",
      paragraphs: [
        "On February 19, 2024, students from various schools across Thane district gathered for Abhivyakta, a district-level event celebrating public speaking and the vibrant folk dance traditions of Maharashtra.",
        "The event provided a platform for students to develop their communication skills, express their ideas confidently and reconnect with Maharashtra's rich cultural heritage.",
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: 'Voices of Inspiration and A Celebration of Culture',
      paragraphs: [
        "The elocution competition brought together 60 students across two categories—5th to 7th standard and 8th to 10th standard—who shared their thoughts on topics inspired by the life and legacy of Chhatrapati Shivaji Maharaj. Students delivered speeches reflecting on Shivaji Maharaj's leadership, courage, determination and inspiring life, strengthening their public speaking abilities and confidence. Winners received trophies, certificates, book sets and cash prizes in recognition of their efforts.",
        "The folk dance competition welcomed more than 75 students, who performed traditional Maharashtrian dance forms in colourful costumes. The performances celebrated Maharashtra's cultural heritage through rhythm, movement, traditional costumes and artistic expression, encouraging students to appreciate their cultural roots and participate confidently in group performances. The event concluded with an award ceremony recognising outstanding performances and celebrating the efforts of all participants.",
      ],
    },
    competitionTracks: {
      eyebrow: 'PROGRAMME TRACKS · 19 FEBRUARY 2024',
      heading: 'Two Stages of Student Expression',
      intro:
        'Abhivyakta 2024 featured two dedicated district-level competitions in Thane: the Elocution Competition (60 students) and the Folk Dance Competition (75+ students).',
      elocution: {
        label: 'TRACK 01 · ELOCUTION COMPETITION',
        title: 'Voices of Inspiration',
        participantCount: '60',
        participantLabel: 'Student Participants',
        summary:
          "The elocution competition brought together 60 students who shared their thoughts on topics inspired by the life and legacy of Chhatrapati Shivaji Maharaj, reflecting on his leadership, courage, determination and inspiring life.",
        categories: [
          {
            title: '5th to 7th Standard',
            subtitle: 'Category I',
            detail:
              'Students expressed their ideas confidently, developing communication skills and early stage presence.',
          },
          {
            title: '8th to 10th Standard',
            subtitle: 'Category II',
            detail:
              "Students delivered thoughtful speeches reflecting on Chhatrapati Shivaji Maharaj's leadership, courage, determination and life.",
          },
        ],
        themeTitle: 'Topics Inspired by Chhatrapati Shivaji Maharaj',
        themeDescription:
          "Each participant had an opportunity to express their ideas, strengthen their public speaking abilities and build confidence through speeches inspired by Chhatrapati Shivaji Maharaj's life and legacy.",
        prizes: ['Trophies', 'Certificates', 'Book Sets', 'Cash Prizes'],
      },
      folkDance: {
        label: 'TRACK 02 · FOLK DANCE COMPETITION',
        title: 'A Celebration of Culture',
        participantCount: '75+',
        participantLabel: 'Student Performers',
        summary:
          "The folk dance competition welcomed more than 75 students, who performed traditional Maharashtrian dance forms in colourful costumes, celebrating Maharashtra's cultural heritage through rhythm, movement and artistic expression.",
        highlightsLabel: 'CULTURAL SHOWCASE HIGHLIGHTS',
        danceForms: [
          {
            name: 'Traditional Maharashtrian Folk Dance',
            description:
              "Performances celebrated Maharashtra's cultural heritage through rhythm, movement, colourful traditional costumes and artistic expression.",
          },
          {
            name: 'Group Performance & Cultural Appreciation',
            description:
              'The competition encouraged students to appreciate their cultural roots, develop their artistic abilities and participate confidently in group performances.',
          },
        ],
        closingHighlight:
          'The event concluded with an award ceremony recognising outstanding performances and celebrating the efforts of all participants.',
      },
    },
    objectivesSectionEyebrow: 'CORE FOCUS AREAS',
    objectivesSectionHeading: 'What Abhivyakta 2024 Encouraged',
    objectives: [
      {
        id: 'obj-1',
        title: 'Public Speaking & Communication',
        description:
          'Give students across 5th to 7th and 8th to 10th standard a supportive district-level platform to express ideas and build confidence.',
        icon: 'mic',
      },
      {
        id: 'obj-2',
        title: 'Learning from Historical Leadership',
        description:
          'Encourage students to reflect on the leadership, courage, determination and inspiring life of Chhatrapati Shivaji Maharaj.',
        icon: 'book',
      },
      {
        id: 'obj-3',
        title: 'Traditional Cultural Expression',
        description:
          "Celebrate Maharashtra's traditional folk dance heritage through rhythm, movement, colourful costumes and group performances.",
        icon: 'sparkles',
      },
      {
        id: 'obj-4',
        title: 'Student Recognition',
        description:
          'Honour outstanding efforts with trophies, certificates, book sets and cash prizes at the concluding award ceremony.',
        icon: 'award',
      },
    ],
    implementation: {
      deliveryModel: 'District-level student event in Thane, Maharashtra',
      formats: [
        'Elocution Competition (5th to 7th & 8th to 10th standard)',
        'Traditional Maharashtrian Folk Dance Competition',
      ],
      themeSummary:
        "Public speaking inspired by Chhatrapati Shivaji Maharaj & celebration of Maharashtra's folk dance traditions",
      prizeFulfilment:
        'Winners received trophies, certificates, book sets and cash prizes; event concluded with an award ceremony',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED EVENT SUMMARY',
      items: [
        'Date: 19 February 2024',
        'Location: Thane, Maharashtra',
        'Category: Youth Development / Cultural Activities',
        'Elocution competition: 60 students (5th–7th & 8th–10th std.)',
        'Folk dance competition: 75+ students in colourful traditional costumes',
        'Recognition: Trophies, certificates, book sets and cash prizes',
      ],
    },
    reflection: {
      eyebrow: 'IMPACT AND REFLECTION',
      heading: 'Where Education, Confidence and Cultural Expression Came Together',
      paragraphs: [
        'Abhivyakta 2024 created a platform where education, confidence and cultural expression came together. The elocution competition encouraged students to develop public speaking skills and learn from the life of Chhatrapati Shivaji Maharaj.',
        "The folk dance competition provided an opportunity to celebrate Maharashtra's traditional art forms and encourage artistic expression among young people. The event demonstrated the importance of creating opportunities where students can discover their abilities, express themselves and stay connected with their cultural heritage.",
      ],
    },
    getInvolvedCopy: {
      heading: 'Get Involved',
      description:
        'Support Garad Foundation in creating more opportunities for young people to learn, express themselves and discover their potential.',
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival placeholder for Abhivyakta 2024 Elocution Competition',
        caption:
          'Elocution Competition ("Voices of Inspiration") — 60 students across 5th–7th and 8th–10th standard categories. Authentic event photographs awaiting archival upload.',
        dateRecorded: '19 February 2024',
        locationRecorded: 'Thane, Maharashtra',
        visualMotif: 'culture',
        placeholderLabel: 'Archival Slot · Elocution Competition',
        safeguardingNote:
          'Reserved for authentic event photographs from Abhivyakta 2024.',
      },
      {
        imagePath: null,
        alt: 'Archival placeholder for Abhivyakta 2024 Folk Dance Competition',
        caption:
          'Folk Dance Competition ("A Celebration of Culture") — 75+ students performing traditional Maharashtrian folk dance in colourful costumes.',
        dateRecorded: '19 February 2024',
        locationRecorded: 'Thane, Maharashtra',
        visualMotif: 'culture',
        placeholderLabel: 'Archival Slot · Folk Dance Competition',
        safeguardingNote:
          'Reserved for authentic event photographs from Abhivyakta 2024.',
      },
      {
        imagePath: null,
        alt: 'Archival placeholder for Abhivyakta 2024 Award Ceremony',
        caption:
          'Concluding Award Ceremony — Recognising outstanding performances with trophies, certificates, book sets and cash prizes.',
        dateRecorded: '19 February 2024',
        locationRecorded: 'Thane, Maharashtra',
        visualMotif: 'culture',
        placeholderLabel: 'Archival Slot · Award Ceremony',
        safeguardingNote:
          'Reserved for authentic event photographs from Abhivyakta 2024.',
      },
    ],
    relatedActivitySlugs: [
      'chhatrapati-shivaji-maharaj-jayanti-2019',
      'marathi-rajbhasha-divas-spardha',
      'online-essay-poetry-competition',
    ],
  },

  /* =====================================================================
     ACTIVITY 08 — GUDHI SHIKSHANACHI (2019)
     ===================================================================== */
  {
    id: 'activity-08',
    slug: 'gudhi-shikshanachi',
    archiveNumber: 'ACTIVITY 08',
    title: 'Gudhi Shikshanachi: Spreading the Light of Education',
    subtitle: 'Empowering Underprivileged Children with the Tools to Learn',
    shortTitle: 'Gudhi Shikshanachi',
    year: calculateFinancialYear('20 March 2019'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('20 March 2019')),
    date: '20 March 2019',
    cardDate: '20 Mar 2019',
    location: '',
    cardLocation: '',
    category: 'Education',
    categoryDisplayLabel: 'Education',
    cardDescription:
      'Launched on 20 March 2019 to bring the joy of education to children living near a garbage dumping ground by providing pencil boxes, compass boxes, notebooks, and encouragement to attend school.',
    cardKeyStat: 'Essential Stationery & School Supplies Drive',
    cardStatIcon: 'graduation',
    introduction:
      'On March 20, 2019, we launched a special initiative called Gudhi Shikshanachi aimed at bringing the joy of education to young children living in difficult circumstances. These children, living near a garbage dumping ground, often face significant barriers to education. Our goal was to encourage them to attend school by providing the essential supplies they need to succeed.',
    seoTitle:
      'Gudhi Shikshanachi: Spreading the Light of Education — Garad Foundation',
    seoDescription:
      'Launched on 20 March 2019, Gudhi Shikshanachi provided pencil boxes, compass boxes, notebooks and school supplies to underprivileged children living near a garbage dumping ground.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Gudhi Shikshanachi stationery distribution drive',
      caption:
        'Gudhi Shikshanachi (20 March 2019) — Distribution of pencil boxes, compass boxes, notebooks and educational supplies. Authentic historical photographs will be added once verified.',
      dateRecorded: '20 March 2019',
      visualMotif: 'education',
      placeholderLabel: 'Archival Photo Pending · Gudhi Shikshanachi',
      safeguardingNote:
        'Reserved for authentic photographs from Gudhi Shikshanachi (20 March 2019); no stock or synthetic imagery is used.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival card placeholder for Gudhi Shikshanachi',
      caption:
        'Gudhi Shikshanachi — Providing essential educational supplies to children living in difficult circumstances.',
      dateRecorded: '20 March 2019',
      visualMotif: 'education',
      placeholderLabel: 'Gudhi Shikshanachi · 2019',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '20 March 2019',
        subtitle: '2019 Historical Archive',
        icon: 'calendar',
      },
      {
        id: 'category',
        eyebrow: 'CATEGORY',
        title: 'Education',
        subtitle: 'Underprivileged Children Support',
        icon: 'book',
      },
      {
        id: 'supplies',
        eyebrow: 'SUPPLIES PROVIDED',
        title: 'Stationery Kits',
        subtitle: 'Pencil Box, Compass Box & Notebooks',
        icon: 'award',
      },
    ],
    verifiedMetrics: [],
    needAndRationale: {
      id: 'purpose-of-the-event',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading: 'Motivating Children to Pursue Education by Removing Early Obstacles',
      paragraphs: [
        'The purpose of Gudhi Shikshanachi was simple yet powerful: to motivate underprivileged children to pursue their education by removing some of the obstacles in their way.',
        'By providing them with the necessary school supplies, we hoped to spark their interest in learning and encourage them to attend school regularly.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: 'Stationery Distribution and Conversations on Learning',
      paragraphs: [
        "The day was filled with smiles and excitement as volunteers from our foundation distributed various stationery items to the children. Each child received a pencil box, a compass box, notebooks, and other essential educational materials. These small yet crucial items can make a big difference in a child's ability to learn and participate in school.",
        "The children's faces lit up with joy as they received their new supplies. For many of them, these were the first proper school items they had ever owned. It was heartwarming to see how something as simple as a new notebook or pencil could bring so much happiness and hope.",
        'The volunteers also spent time talking to the children about the importance of education and how it can help them build a better future. The message was clear: education is a powerful tool, and every child deserves the opportunity to learn.',
      ],
    },
    objectivesSectionEyebrow: 'KEY OBJECTIVES',
    objectivesSectionHeading: 'Core Intentions of Gudhi Shikshanachi',
    objectives: [
      {
        id: 'obj-1',
        title: 'Provide Essential School Supplies',
        description:
          'Equip each child with a pencil box, compass box, notebooks, and essential educational materials.',
        icon: 'book',
      },
      {
        id: 'obj-2',
        title: 'Encourage Regular School Attendance',
        description:
          'Spark interest in learning and remove practical stationery barriers faced by children living near a garbage dumping ground.',
        icon: 'graduation',
      },
      {
        id: 'obj-3',
        title: 'Volunteer Mentorship & Dialogue',
        description:
          'Talk directly with children about the value of education and how learning can help build a better future.',
        icon: 'heart',
      },
    ],
    implementation: {
      deliveryModel:
        'Volunteer-led stationery distribution and direct interaction with children',
      themeSummary:
        'Removing early barriers to schooling through essential stationery and encouragement',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED HIGHLIGHTS',
      items: [
        'Date: 20 March 2019',
        'Category: Education',
        'Supplies distributed: Pencil boxes, compass boxes, notebooks & educational materials',
        'Supported children living in difficult circumstances near a garbage dumping ground',
        'Volunteers interacted with children on the importance of education',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'A Step Toward Breaking the Cycle of Poverty Through Education',
      paragraphs: [
        'Gudhi Shikshanachi was more than just a distribution of school supplies—it was a step toward breaking the cycle of poverty through education. By providing these children with the tools they need, we hope to inspire them to continue their education and dream of a brighter future.',
        "This initiative reminded us all of the importance of giving back to the community and supporting those who are less fortunate. The smiles on the children's faces and their excitement for learning were the greatest rewards of the day.",
      ],
    },
    getInvolvedCopy: {
      heading: 'Join Us in Making a Difference',
      description:
        'Gudhi Shikshanachi is just the beginning of our efforts to promote education among underprivileged children. We invite you to join us in this mission to spread the light of education and make a lasting impact in the lives of these young learners.',
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery slot for Gudhi Shikshanachi stationery distribution',
        caption:
          'Gudhi Shikshanachi (20 March 2019) — Archival slot reserved for authentic photographs of stationery distribution and volunteer interactions.',
        dateRecorded: '20 March 2019',
        visualMotif: 'education',
        placeholderLabel: 'Archival Slot · Stationery Distribution',
        safeguardingNote:
          'Placeholder awaiting verified photographs from the 20 March 2019 initiative.',
      },
    ],
    relatedActivitySlugs: [
      'sandals-for-children',
      'gyansetu',
      'mission-bharari-phase-1',
    ],
  },

  /* =====================================================================
     ACTIVITY 09 — SANITARY PAD DISTRIBUTION (2019)
     ===================================================================== */
  {
    id: 'activity-09',
    slug: 'sanitary-pad-distribution',
    archiveNumber: 'ACTIVITY 09',
    title: "Sanitary Pad Distribution: Promoting Women's Health and Hygiene",
    subtitle:
      'Empowering Tribal Women with Better Menstrual Health Management',
    shortTitle: 'Sanitary Pad Distribution (2019)',
    year: calculateFinancialYear('28 April 2019'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('28 April 2019')),
    date: '28 April 2019',
    cardDate: '28 Apr 2019',
    location: 'Mamnoli village, Kalyan taluka, Maharashtra',
    cardLocation: 'Mamnoli Village, Kalyan Taluka',
    category: 'Women & Health Awareness',
    categoryDisplayLabel: 'Women Empowerment / Health',
    cardDescription:
      'Held on 28 April 2019 in Mamnoli village, Kalyan taluka in collaboration with Aple Thane, Aple Foundation to distribute sanitary pads and hold open conversations breaking menstrual taboos.',
    cardKeyStat: 'Partner: Aple Thane, Aple Foundation',
    cardStatIcon: 'heart',
    introduction:
      "On April 28, 2019, we joined hands with the NGO Aple Thane, Aple Foundation to host a special event focused on women's health and hygiene. This initiative took place in Mamnoli village, Kalyan taluka, and was aimed at improving menstrual hygiene management among tribal women. The event was inspired by the discussions on menstrual health during our International Women's Day session.",
    seoTitle:
      "Sanitary Pad Distribution: Promoting Women's Health and Hygiene — Garad Foundation",
    seoDescription:
      'On 28 April 2019, Garad Foundation collaborated with Aple Thane, Aple Foundation in Mamnoli village, Kalyan taluka to distribute sanitary pads and promote menstrual hygiene awareness.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Sanitary Pad Distribution in Mamnoli village on 28 April 2019',
      caption:
        'Sanitary Pad Distribution (28 April 2019, Mamnoli village, Kalyan taluka) in collaboration with Aple Thane, Aple Foundation. Authentic event photographs will be uploaded once cleared.',
      dateRecorded: '28 April 2019',
      locationRecorded: 'Mamnoli village, Kalyan taluka, Maharashtra',
      visualMotif: 'health',
      placeholderLabel: 'Archival Photo Pending · Mamnoli Outreach (2019)',
      safeguardingNote:
        'Reserved exclusively for authentic photographs from the 28 April 2019 outreach following participant consent review.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival placeholder for Sanitary Pad Distribution (2019)',
      caption:
        'Sanitary Pad Distribution — Mamnoli village, Kalyan taluka (28 April 2019).',
      dateRecorded: '28 April 2019',
      locationRecorded: 'Mamnoli village, Kalyan taluka, Maharashtra',
      visualMotif: 'health',
      placeholderLabel: 'Sanitary Pad Distribution · 2019',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '28 April 2019',
        subtitle: '2019 Historical Archive',
        icon: 'calendar',
      },
      {
        id: 'location',
        eyebrow: 'LOCATION',
        title: 'Mamnoli Village',
        subtitle: 'Kalyan Taluka, Maharashtra',
        icon: 'map-pin',
      },
      {
        id: 'partner',
        eyebrow: 'COLLABORATION',
        title: 'Aple Thane, Aple Foundation',
        subtitle: 'Joint Community Outreach',
        icon: 'heart',
      },
    ],
    verifiedMetrics: [],
    needAndRationale: {
      id: 'purpose-of-the-event',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading:
        'Addressing Menstrual Hygiene Management and Breaking Long-Standing Taboos',
      paragraphs: [
        'The main goal of this event was to address the critical issue of menstrual hygiene management among tribal women. We wanted to ensure that these women have access to sanitary products, which are essential for their health and well-being.',
        'Additionally, we aimed to break the taboos and myths surrounding menstruation, empowering women to take charge of their health.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: 'Sanitary Pad Distribution and Open Community Conversations',
      paragraphs: [
        "The day's activities were centered around the distribution of sanitary pads to the women of Mamnoli village. Our team of volunteers, alongside members from Aple Thane, Aple Foundation, distributed sanitary pads to ensure that these women have the resources they need to manage their menstrual health safely and hygienically.",
        'The distribution was more than just handing out products. It was an opportunity to educate the women about menstrual health, the importance of using sanitary pads, and how proper hygiene can reduce health risks. The volunteers engaged in open conversations with the women, encouraging them to ask questions and share their experiences.',
        'Breaking the silence around menstruation was a significant focus of the day. By discussing these issues openly, we aimed to challenge the taboos that often make it difficult for women to talk about and manage their periods. This was a crucial step in empowering the women of Mamnoli to take better care of their health.',
      ],
    },
    objectivesSectionEyebrow: 'KEY OBJECTIVES',
    objectivesSectionHeading: 'Priorities of the Mamnoli Outreach',
    objectives: [
      {
        id: 'obj-1',
        title: 'Access to Sanitary Products',
        description:
          'Distribute sanitary pads to tribal women in Mamnoli village to support safe and hygienic menstrual management.',
        icon: 'heart',
      },
      {
        id: 'obj-2',
        title: 'Menstrual Health Education',
        description:
          'Share practical information on menstrual hygiene and how proper practices reduce preventable health risks.',
        icon: 'shield',
      },
      {
        id: 'obj-3',
        title: 'Breaking Silence & Taboos',
        description:
          'Foster open, respectful conversations where women could ask questions, share experiences, and challenge myths.',
        icon: 'users',
      },
    ],
    partners: [
      {
        name: 'Aple Thane, Aple Foundation',
        role: 'Collaborating NGO partner for sanitary pad distribution and community dialogue in Mamnoli village',
      },
    ],
    implementation: {
      deliveryModel:
        'Joint field distribution and open community dialogue in Mamnoli village, Kalyan taluka',
      themeSummary:
        "Inspired by discussions on menstrual health during Garad Foundation's International Women's Day session",
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED HIGHLIGHTS',
      items: [
        'Date: 28 April 2019',
        'Location: Mamnoli village, Kalyan taluka, Maharashtra',
        'Collaboration: Aple Thane, Aple Foundation',
        'Sanitary pads distributed to tribal women in Mamnoli village',
        'Open conversations addressing menstrual health, myths and taboos',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'A Small Yet Significant Step for Women’s Health in Mamnoli',
      paragraphs: [
        "The Sanitary Pad Distribution event was a small but significant step towards improving women's health in Mamnoli village. By providing access to sanitary products and promoting education around menstrual hygiene, we hope to reduce the health risks associated with poor menstrual management.",
        "The women's positive response and eagerness to learn more about menstrual health were encouraging signs that this initiative made a real difference. It also highlighted the importance of continuing to support and educate women in these communities, ensuring they have the tools and knowledge to manage their health with confidence.",
      ],
    },
    getInvolvedCopy: {
      heading: "Join Us in Supporting Women's Health",
      description:
        "The Sanitary Pad Distribution event was just one part of our ongoing efforts to promote women's health and break the taboos around menstruation. We invite you to join us in making a difference by supporting future initiatives that empower women and improve their quality of life.",
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for 2019 Sanitary Pad Distribution in Mamnoli village',
        caption:
          'Sanitary Pad Distribution (28 April 2019, Mamnoli village, Kalyan taluka) — Archival slot reserved for verified field photographs.',
        dateRecorded: '28 April 2019',
        locationRecorded: 'Mamnoli village, Kalyan taluka, Maharashtra',
        visualMotif: 'health',
        placeholderLabel: 'Archival Slot · Mamnoli Outreach (2019)',
        safeguardingNote:
          'Authentic event photographs will be published here only after safeguarding review.',
      },
    ],
    relatedActivitySlugs: [
      'menstrual-hygiene-awareness',
      'project-savitri',
      'blood-donation-drive-2022',
    ],
  },

  /* =====================================================================
     ACTIVITY 10 — CHHATRAPATI SHIVAJI MAHARAJ JAYANTI (2019)
     ===================================================================== */
  {
    id: 'activity-10',
    slug: 'chhatrapati-shivaji-maharaj-jayanti-2019',
    archiveNumber: 'ACTIVITY 10',
    title: 'Chhatrapati Shivaji Maharaj Jayanti: Honoring a Legendary Leader',
    subtitle:
      'Inspiring Students with the Life and Legacy of Chhatrapati Shivaji Maharaj',
    shortTitle: 'Shivaji Maharaj Jayanti (2019)',
    year: calculateFinancialYear('19 February 2019'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('19 February 2019')),
    date: '19 February 2019',
    cardDate: '19 Feb 2019',
    location: 'Sharadashram hostel facility',
    cardLocation: 'Sharadashram Hostel Facility',
    category: 'Education',
    secondaryCategories: ['Language & Culture'],
    categoryDisplayLabel: 'Education / Cultural Activities',
    cardDescription:
      'Garad Foundation’s inaugural Chhatrapati Shivaji Maharaj Jayanti celebration on 19 February 2019 at the Sharadashram hostel facility, engaging students in interactive learning on courage, governance and social justice.',
    cardKeyStat: 'Interactive Sessions · Sharadashram Hostel',
    cardStatIcon: 'book',
    introduction:
      "On February 19, 2019, we had the honor of celebrating the very first Chhatrapati Shivaji Maharaj Jayanti at the Sharadashram hostel facility. This inaugural event was dedicated to remembering and learning from the life of Chhatrapati Shivaji Maharaj, one of India's greatest leaders. Our goal was to inspire students by sharing the values of bravery, leadership, and strong morals that defined his reign.",
    seoTitle:
      'Chhatrapati Shivaji Maharaj Jayanti (2019): Honoring a Legendary Leader — Garad Foundation',
    seoDescription:
      'On 19 February 2019, Garad Foundation celebrated its first Chhatrapati Shivaji Maharaj Jayanti at the Sharadashram hostel facility through interactive student sessions on courage, governance and social justice.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Chhatrapati Shivaji Maharaj Jayanti 2019 at Sharadashram hostel facility',
      caption:
        'Chhatrapati Shivaji Maharaj Jayanti (19 February 2019, Sharadashram hostel facility) — Inaugural student teaching and discussion session. Authentic photographs awaiting archival upload.',
      dateRecorded: '19 February 2019',
      locationRecorded: 'Sharadashram hostel facility',
      visualMotif: 'culture',
      placeholderLabel: 'Archival Photo Pending · Shivaji Maharaj Jayanti 2019',
      safeguardingNote:
        'Reserved for authentic event photographs from the 19 February 2019 celebration at Sharadashram hostel facility.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival card placeholder for Chhatrapati Shivaji Maharaj Jayanti 2019',
      caption:
        'Chhatrapati Shivaji Maharaj Jayanti — Sharadashram hostel facility (19 February 2019).',
      dateRecorded: '19 February 2019',
      locationRecorded: 'Sharadashram hostel facility',
      visualMotif: 'culture',
      placeholderLabel: 'Shivaji Maharaj Jayanti · 2019',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '19 February 2019',
        subtitle: 'Inaugural Celebration',
        icon: 'calendar',
      },
      {
        id: 'location',
        eyebrow: 'LOCATION',
        title: 'Sharadashram Hostel',
        subtitle: 'Hostel Facility',
        icon: 'map-pin',
      },
      {
        id: 'category',
        eyebrow: 'CATEGORY',
        title: 'Education & Culture',
        subtitle: 'Interactive Student Sessions',
        icon: 'book',
      },
    ],
    verifiedMetrics: [],
    needAndRationale: {
      id: 'purpose-of-the-event',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading:
        'Instilling Courage, Wise Leadership, and Dedication to Social Justice',
      paragraphs: [
        'The main purpose of this event was to instill in our students the values and ethics upheld by Chhatrapati Shivaji Maharaj. His life is a shining example of courage, wise leadership, and dedication to social justice.',
        'We wanted to make sure that these young minds understand and appreciate the importance of these qualities, so they can carry them forward in their own lives.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: 'Interactive Teaching Sessions and Values-Based Discussions',
      paragraphs: [
        "The celebration was filled with activities that were both educational and engaging. We organized interactive teaching sessions where students learned about the historical significance of Chhatrapati Shivaji Maharaj's reign. Through these sessions, they discovered how he became a symbol of strength and fairness.",
        'During the discussions, students explored his contributions to society, including his innovative governance techniques and his tireless efforts to promote social justice. They also learned about the challenges he faced and how he overcame them with wisdom and bravery. These stories not only educated but also inspired the students to think about how they can apply similar values in their own lives.',
      ],
    },
    objectivesSectionEyebrow: 'VALUES EXPLORED',
    objectivesSectionHeading: 'Core Themes Shared with Students',
    objectives: [
      {
        id: 'obj-1',
        title: 'Courage & Moral Strength',
        description:
          'Explore how Chhatrapati Shivaji Maharaj overcame challenges with wisdom, bravery, and a strong moral compass.',
        icon: 'shield',
      },
      {
        id: 'obj-2',
        title: 'Governance & Social Justice',
        description:
          'Examine his innovative governance techniques and enduring commitment to fairness and social justice.',
        icon: 'book',
      },
      {
        id: 'obj-3',
        title: 'Interactive Student Reflection',
        description:
          'Encourage students at the Sharadashram hostel facility to apply principles of responsible leadership in everyday life.',
        icon: 'sparkles',
      },
    ],
    implementation: {
      deliveryModel:
        'Interactive teaching sessions and guided group discussions at Sharadashram hostel facility',
      themeSummary:
        'First Chhatrapati Shivaji Maharaj Jayanti celebration organised by Garad Foundation',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED HIGHLIGHTS',
      items: [
        'Date: 19 February 2019',
        'Location: Sharadashram hostel facility',
        'Category: Education / Cultural Activities',
        'First Chhatrapati Shivaji Maharaj Jayanti organised by the foundation',
        'Interactive teaching and discussions on governance, bravery and social justice',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'Sowing the Seeds of Responsible and Brave Leadership',
      paragraphs: [
        'The event left a lasting impact on everyone involved. The students walked away with a deeper understanding of what it means to be a true leader—someone who leads with courage, fairness, and a strong moral compass. They were inspired by the life of Chhatrapati Shivaji Maharaj and motivated to follow his example in their own journeys.',
        'It was a day filled with learning, reflection, and inspiration. As we celebrated this great leader, we also sowed the seeds of these values in our students, hoping that they grow into responsible and brave individuals, just like Chhatrapati Shivaji Maharaj.',
      ],
    },
    getInvolvedCopy: {
      heading: 'Join Us in Future Celebrations',
      description:
        "Chhatrapati Shivaji Maharaj Jayanti is more than just a day of remembrance; it's a day of inspiration. We look forward to continuing this tradition and invite everyone to join us in honoring the legacy of this legendary leader in the years to come.",
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for Chhatrapati Shivaji Maharaj Jayanti 2019 at Sharadashram hostel facility',
        caption:
          'Chhatrapati Shivaji Maharaj Jayanti (19 February 2019, Sharadashram hostel facility) — Archival slot awaiting verified photographs.',
        dateRecorded: '19 February 2019',
        locationRecorded: 'Sharadashram hostel facility',
        visualMotif: 'culture',
        placeholderLabel: 'Archival Slot · Interactive Session (2019)',
        safeguardingNote:
          'Placeholder awaiting verified photographs from the 19 February 2019 celebration.',
      },
    ],
    relatedActivitySlugs: [
      'abhivyakta-2024',
      'blood-donation-drive-2022',
      'marathi-rajbhasha-divas-spardha',
    ],
  },

  /* =====================================================================
     ACTIVITY 11 — SELFIE WITH BAPPA (2019)
     ===================================================================== */
  {
    id: 'activity-11',
    slug: 'selfie-with-bappa',
    archiveNumber: 'ACTIVITY 11',
    title: 'Selfie with Bappa: Celebrating Ganeshotsav with a Green Heart',
    subtitle: 'A Fun and Eco-Friendly Way to Spread Environmental Awareness',
    shortTitle: 'Selfie with Bappa',
    year: calculateFinancialYear('2019', '2019-2020'),
    yearDisplay: formatFinancialYearLabel(
      calculateFinancialYear('2019', '2019-2020')
    ),
    date: '2019',
    cardDate: '2019',
    location: '',
    cardLocation: '',
    category: 'Environment',
    secondaryCategories: ['Youth Development'],
    categoryDisplayLabel: 'Environment / Awareness Campaign',
    cardDescription:
      'A 2019 social media campaign using #SelfieWithBappa to promote eco-friendly Ganeshotsav celebrations with Ganpati idols made from clay and natural, biodegradable materials.',
    cardKeyStat: 'Hashtag Campaign · #SelfieWithBappa',
    cardStatIcon: 'leaf',
    introduction:
      "In 2019, we launched an exciting and innovative campaign called Selfie with Bappa. This campaign was all about combining the power of social media with the love for Ganeshotsav to promote environmental awareness among the youth. Our goal was to encourage everyone to celebrate this beloved festival in a way that's kind to our planet.",
    seoTitle:
      'Selfie with Bappa: Celebrating Ganeshotsav with a Green Heart — Garad Foundation',
    seoDescription:
      'Launched in 2019, Garad Foundation’s #SelfieWithBappa social media campaign promoted eco-friendly Ganeshotsav celebrations using clay and natural, biodegradable Ganpati idols.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Selfie with Bappa eco-friendly Ganeshotsav campaign (2019)',
      caption:
        'Selfie with Bappa (2019) — Social media environmental awareness campaign (#SelfieWithBappa) promoting clay and biodegradable Ganpati idols. Authentic campaign visuals will be uploaded once archived.',
      dateRecorded: '2019',
      visualMotif: 'environment',
      placeholderLabel: 'Archival Media Pending · #SelfieWithBappa (2019)',
      safeguardingNote:
        'Reserved for authentic campaign documentation from the 2019 #SelfieWithBappa initiative; stock or AI visuals are omitted.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival placeholder for Selfie with Bappa campaign (2019)',
      caption:
        'Selfie with Bappa (2019) — Promoting eco-friendly Ganeshotsav celebrations.',
      dateRecorded: '2019',
      visualMotif: 'environment',
      placeholderLabel: '#SelfieWithBappa · 2019',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'YEAR',
        title: '2019',
        subtitle: 'Social Media Campaign',
        icon: 'calendar',
      },
      {
        id: 'category',
        eyebrow: 'CATEGORY',
        title: 'Environment',
        subtitle: 'Awareness Campaign',
        icon: 'globe',
      },
      {
        id: 'hashtag',
        eyebrow: 'CAMPAIGN TAG',
        title: '#SelfieWithBappa',
        subtitle: 'Eco-Friendly Ganeshotsav',
        icon: 'award',
      },
    ],
    verifiedMetrics: [],
    needAndRationale: {
      id: 'purpose-of-the-campaign',
      eyebrow: 'PURPOSE OF THE CAMPAIGN',
      heading:
        'Encouraging Eco-Friendly Ganeshotsav Celebrations and Reducing Pollution',
      paragraphs: [
        'The main purpose of the Selfie with Bappa campaign was to spread the message of celebrating Ganeshotsav in an eco-friendly manner. We wanted to highlight the importance of reducing pollution during the festival, especially by encouraging the use of eco-friendly Ganpati idols made from natural materials.',
        'Through this campaign, we aimed to inspire people to think about how their actions impact the environment and to make choices that help protect it.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: 'Digital Participation Around #SelfieWithBappa and Natural Idols',
      paragraphs: [
        'The campaign invited participants to take selfies with their Ganpati idols and share them on social media platforms using the hashtag #SelfieWithBappa. It was a fun and interactive way to engage with the community and spread an important message.',
        'As the selfies started rolling in, social media was filled with images of Ganpati idols, each accompanied by a message about the importance of celebrating the festival in an eco-friendly way. Whether it was a small clay idol or a larger one made from natural materials, each post carried the spirit of devotion and the commitment to protecting our environment.',
        'The campaign also sparked conversations about the impact of traditional Ganesh idols made from plaster of Paris, which can cause significant environmental damage. By promoting the use of idols made from clay or other biodegradable materials, Selfie with Bappa encouraged people to make greener choices and celebrate the festival in a way that honors both tradition and nature.',
      ],
    },
    objectivesSectionEyebrow: 'CAMPAIGN FOCUS',
    objectivesSectionHeading: 'Environmental Principles Promoted',
    objectives: [
      {
        id: 'obj-1',
        title: 'Clay & Biodegradable Idols',
        description:
          'Promote Ganpati idols made from clay and natural, biodegradable materials as an alternative to plaster of Paris.',
        icon: 'sparkles',
      },
      {
        id: 'obj-2',
        title: 'Youth Social Media Engagement',
        description:
          'Invite participants to share photographs with their Ganpati idols using the #SelfieWithBappa hashtag.',
        icon: 'users',
      },
      {
        id: 'obj-3',
        title: 'Festival Environmental Awareness',
        description:
          'Encourage thoughtful conversations on reducing festival pollution while honouring devotion and tradition.',
        icon: 'shield',
      },
    ],
    implementation: {
      deliveryModel: 'Social media engagement campaign (#SelfieWithBappa)',
      themeSummary:
        'Promoting clay and natural, biodegradable Ganpati idols to reduce festival pollution',
    },
    outputs: {
      sidebarTitle: 'CAMPAIGN SUMMARY',
      items: [
        'Year: 2019',
        'Category: Environment / Awareness Campaign',
        'Hashtag: #SelfieWithBappa',
        'Encouraged sharing photographs with eco-friendly Ganpati idols',
        'Raised awareness on clay and biodegradable alternatives to plaster of Paris',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'Honouring Both Devotion and Our Natural Environment',
      paragraphs: [
        'Selfie with Bappa was more than just a social media trend; it was a movement that brought together the love for Ganeshotsav and the commitment to protecting our planet. The campaign raised awareness about the environmental impact of our choices and encouraged people to celebrate the festival in a more sustainable way.',
        'The response and the eco-friendly Ganpati idols shared online showed us that small actions can lead to big changes. By making eco-friendly choices, we can all contribute to a healthier planet while still enjoying the festivals we love.',
      ],
    },
    getInvolvedCopy: {
      heading: 'Join Us in Celebrating Eco-Friendly Festivals',
      description:
        "Selfie with Bappa was just the beginning of our efforts to promote environmental awareness through fun and engaging campaigns. We encourage everyone to continue celebrating festivals in a way that's both joyful and kind to the environment. Let's keep the spirit of Bappa alive while protecting the world we live in!",
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for Selfie with Bappa 2019 campaign',
        caption:
          '#SelfieWithBappa (2019) — Archival slot reserved for verified campaign snapshots and community submissions.',
        dateRecorded: '2019',
        visualMotif: 'environment',
        placeholderLabel: 'Archival Slot · #SelfieWithBappa Campaign',
        safeguardingNote:
          'Placeholder awaiting verified campaign visuals from 2019.',
      },
    ],
    relatedActivitySlugs: [
      'online-videography-awareness-contest',
      'online-essay-poetry-competition',
      'abhivyakta-2024',
    ],
  },

  /* =====================================================================
     ACTIVITY 12 — GYANSETU (2021)
     ===================================================================== */
  {
    id: 'activity-12',
    slug: 'gyansetu',
    archiveNumber: 'ACTIVITY 12',
    title: 'Gyansetu: Building Bridges of Knowledge Through Books',
    subtitle: 'Promoting a Love for Reading Among Youth and School Children',
    shortTitle: 'Gyansetu',
    year: calculateFinancialYear('15 October 2021'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('15 October 2021')),
    date: '15 October 2021',
    cardDate: '15 Oct 2021',
    location: '',
    cardLocation: '',
    category: 'Education',
    secondaryCategories: ['Youth Development'],
    categoryDisplayLabel: 'Education / Library Development',
    cardDescription:
      'A book donation drive launched on 15 October 2021 collecting storybooks, novels, textbooks, and reference materials and distributing them across seven study libraries.',
    cardKeyStat: 'Books Distributed to 7 Study Libraries',
    cardStatIcon: 'book',
    introduction:
      "On October 15, 2021, we launched Gyansetu, a book donation drive dedicated to promoting a culture of reading among young people and school children. In a world where knowledge is power, we believe that investing in one's education is the key to a brighter future. Gyansetu was our way of ensuring that every child has access to the books and learning materials they need to succeed.",
    seoTitle:
      'Gyansetu: Building Bridges of Knowledge Through Books — Garad Foundation',
    seoDescription:
      'Launched on 15 October 2021, Gyansetu collected storybooks, novels, textbooks and reference materials and distributed them to seven study libraries.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Gyansetu book donation drive (15 October 2021)',
      caption:
        'Gyansetu (15 October 2021) — Community book donation drive supporting seven study libraries. Authentic photographs awaiting verified archival upload.',
      dateRecorded: '15 October 2021',
      visualMotif: 'literature',
      placeholderLabel: 'Archival Photo Pending · Gyansetu (2021)',
      safeguardingNote:
        'Reserved for authentic photographs from the Gyansetu book donation drive (15 October 2021).',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival placeholder for Gyansetu book donation drive',
      caption:
        'Gyansetu — Collecting and distributing books across seven study libraries (15 October 2021).',
      dateRecorded: '15 October 2021',
      visualMotif: 'literature',
      placeholderLabel: 'Gyansetu · 7 Study Libraries',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '15 October 2021',
        subtitle: '2021 Archive',
        icon: 'calendar',
      },
      {
        id: 'category',
        eyebrow: 'CATEGORY',
        title: 'Education & Libraries',
        subtitle: 'Book Donation Drive',
        icon: 'book',
      },
      {
        id: 'libraries',
        eyebrow: 'LIBRARIES SUPPORTED',
        title: '7 Study Libraries',
        subtitle: 'Storybooks, Novels & Textbooks',
        icon: 'award',
      },
    ],
    verifiedMetrics: [
      {
        value: '7',
        label: 'Study Libraries Supported',
        sublabel: 'Storybooks, Novels, Textbooks & Reference',
        accent: 'forest',
      },
    ],
    needAndRationale: {
      id: 'purpose-of-the-event',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading: 'Cultivating Reading Habits and Expanding Access to Books',
      paragraphs: [
        'The main goal of Gyansetu was to highlight the importance of self-investment through knowledge acquisition. We wanted to provide children and youth with the tools they need to learn and grow by making educational resources more accessible.',
        'Through this book donation drive, we aimed to cultivate a habit of reading and to inspire students to explore the endless possibilities that books offer.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: 'Community Book Collection and Distribution to Seven Study Libraries',
      paragraphs: [
        'The Gyansetu initiative was met with overwhelming support from the community. We collected a wide range of books—everything from storybooks and novels to textbooks and reference materials. These books were then distributed to seven study libraries, where they could be accessed by students eager to learn and grow.',
        'The libraries that received these books were thrilled to expand their collections, and the students were even more excited to dive into new stories and explore new subjects. For many, these books opened up a world of knowledge that might have otherwise been out of reach.',
        'The impact of Gyansetu was felt immediately. Students who received the books were not only gaining valuable learning materials but were also developing a lifelong love for reading. By making these resources available, we helped to create an environment where learning is encouraged and celebrated.',
      ],
    },
    objectivesSectionEyebrow: 'KEY OBJECTIVES',
    objectivesSectionHeading: 'What Gyansetu Sought to Build',
    objectives: [
      {
        id: 'obj-1',
        title: 'Diverse Book Collection',
        description:
          'Mobilise community donations spanning storybooks, novels, textbooks, and reference materials.',
        icon: 'book',
      },
      {
        id: 'obj-2',
        title: 'Strengthening Study Libraries',
        description:
          'Expand the collections of seven study libraries so students have consistent access to reading resources.',
        icon: 'graduation',
      },
      {
        id: 'obj-3',
        title: 'Lifelong Culture of Reading',
        description:
          'Encourage self-investment through knowledge and nurture a lasting love of reading among youth.',
        icon: 'sparkles',
      },
    ],
    implementation: {
      deliveryModel:
        'Community book collection drive and distribution to seven study libraries',
      themeSummary:
        'Storybooks, novels, textbooks, and reference materials shared across seven study libraries',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED OUTPUTS',
      items: [
        'Date: 15 October 2021',
        'Category: Education / Library Development',
        'Distributed donated books to 7 study libraries',
        'Collected storybooks, novels, textbooks and reference materials',
        'Supported student reading habits and shared library access',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'Empowering Students to Invest in Their Own Growth',
      paragraphs: [
        'Gyansetu was more than just a book donation drive—it was a step towards building a better future for our youth. By providing students with access to quality books, we empowered them to take charge of their own education and to invest in their own growth.',
        "This initiative reminded us all of the power of reading and the difference it can make in a child's life. The joy on the faces of the students as they received their books was a powerful reminder of why we do what we do.",
      ],
    },
    getInvolvedCopy: {
      heading: 'Join Us in Supporting Education',
      description:
        'Gyansetu is just one of the many ways we are working to support education in our community. We invite you to join us in our mission to promote reading and learning by contributing to future book drives and educational initiatives. Together, we can build bridges of knowledge and create a brighter future for all.',
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for Gyansetu book donation drive',
        caption:
          'Gyansetu (15 October 2021) — Archival slot reserved for verified photographs of book collection and study library handovers.',
        dateRecorded: '15 October 2021',
        visualMotif: 'literature',
        placeholderLabel: 'Archival Slot · Book Drive & Study Libraries',
        safeguardingNote:
          'Placeholder awaiting verified photographs from the 15 October 2021 book drive.',
      },
    ],
    relatedActivitySlugs: [
      'gudhi-shikshanachi',
      'mission-bharari-phase-1',
      'sandals-for-children',
    ],
  },

  /* =====================================================================
     ACTIVITY 13 — BLOOD DONATION DRIVE (2022)
     ===================================================================== */
  {
    id: 'activity-13',
    slug: 'blood-donation-drive-2022',
    archiveNumber: 'ACTIVITY 13',
    title:
      'Blood Donation Drive: Celebrating Chhatrapati Shivaji Maharaj Jayanti by Saving Lives',
    subtitle: 'A Community Effort to Support Public Health',
    shortTitle: 'Blood Donation Drive (2022)',
    year: calculateFinancialYear('20 February 2022'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('20 February 2022')),
    date: '20 February 2022',
    cardDate: '20 Feb 2022',
    location: '',
    cardLocation: '',
    category: 'Public Health & Youth',
    secondaryCategories: ['Community Welfare'],
    categoryDisplayLabel: 'Health / Community Development',
    cardDescription:
      'Organised on 20 February 2022 with Kai. Wamanrao Oak Blood Bank to honour Chhatrapati Shivaji Maharaj Jayanti, uniting 35 voluntary blood donors in support of public health.',
    cardKeyStat: '35 Donors · Kai. Wamanrao Oak Blood Bank',
    cardStatIcon: 'heart',
    introduction:
      'On February 20, 2022, we proudly organized a Blood Donation Drive in collaboration with the Kai. Wamanrao Oak Blood Bank to honor the legacy of Chhatrapati Shivaji Maharaj on his Jayanti. This event was not just about celebration; it was about making a meaningful contribution to public health and saving lives through the simple yet powerful act of donating blood.',
    seoTitle:
      'Blood Donation Drive (2022): Celebrating Chhatrapati Shivaji Maharaj Jayanti by Saving Lives — Garad Foundation',
    seoDescription:
      'On 20 February 2022, Garad Foundation collaborated with Kai. Wamanrao Oak Blood Bank to host a Blood Donation Drive honouring Chhatrapati Shivaji Maharaj Jayanti, with 35 voluntary donors.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Blood Donation Drive on 20 February 2022',
      caption:
        'Blood Donation Drive (20 February 2022) in collaboration with Kai. Wamanrao Oak Blood Bank — 35 voluntary donors participated. Authentic photographs will be uploaded once verified.',
      dateRecorded: '20 February 2022',
      visualMotif: 'health',
      placeholderLabel: 'Archival Photo Pending · Blood Donation Drive (2022)',
      safeguardingNote:
        'Reserved for authentic photographs from the 20 February 2022 Blood Donation Drive; example document placeholders are omitted.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival card placeholder for Blood Donation Drive 2022',
      caption:
        'Blood Donation Drive (20 February 2022) — 35 donors with Kai. Wamanrao Oak Blood Bank.',
      dateRecorded: '20 February 2022',
      visualMotif: 'health',
      placeholderLabel: 'Blood Donation Drive · 35 Donors',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '20 February 2022',
        subtitle: '2022 Archive',
        icon: 'calendar',
      },
      {
        id: 'donors',
        eyebrow: 'PARTICIPANTS',
        title: '35 Donors',
        subtitle: 'Voluntary Blood Donations',
        icon: 'users',
      },
      {
        id: 'partner',
        eyebrow: 'COLLABORATION',
        title: 'Kai. Wamanrao Oak Blood Bank',
        subtitle: 'Public Health Partner',
        icon: 'heart',
      },
    ],
    verifiedMetrics: [
      {
        value: '35',
        label: 'Voluntary Blood Donors',
        sublabel: 'Kai. Wamanrao Oak Blood Bank',
        accent: 'terracotta',
      },
    ],
    needAndRationale: {
      id: 'purpose-of-the-event',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading: 'Supporting Public Health and Voluntary Blood Donation Awareness',
      paragraphs: [
        'The primary goal of this blood donation drive was to support public health by collecting blood donations that could help save lives. Blood donation is a vital service to the community, and we wanted to encourage more people to participate in this life-saving act.',
        'By organizing this event, we also aimed to raise awareness about the importance of voluntary blood donation and inspire others to get involved in health-related causes.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: '35 Community Donors and Blood Donation Awareness',
      paragraphs: [
        'The event brought together 35 generous donors, each willing to contribute to the blood bank and help those in need. The atmosphere was filled with a sense of community and purpose, as people from all walks of life came forward to donate blood and make a difference.',
        'Throughout the day, the importance of blood donation was highlighted by the volunteers and the team from the blood bank. They shared valuable information about how blood donations can save lives, particularly in emergencies and for patients undergoing surgery or treatment for serious illnesses.',
        "The drive not only collected much-needed blood but also encouraged community involvement in health initiatives. Many donors expressed their happiness at being able to contribute, knowing that their small act could have a big impact on someone's life.",
      ],
    },
    objectivesSectionEyebrow: 'KEY OBJECTIVES',
    objectivesSectionHeading: 'Public Health Goals of the Drive',
    objectives: [
      {
        id: 'obj-1',
        title: 'Support Life-Saving Blood Supply',
        description:
          'Collaborate with Kai. Wamanrao Oak Blood Bank to collect voluntary donations aiding emergencies and medical treatments.',
        icon: 'heart',
      },
      {
        id: 'obj-2',
        title: 'Voluntary Donation Awareness',
        description:
          'Share practical information with community members on how voluntary blood donation supports surgeries and critical care.',
        icon: 'shield',
      },
      {
        id: 'obj-3',
        title: 'Community Service on Jayanti',
        description:
          'Honour Chhatrapati Shivaji Maharaj Jayanti through meaningful civic action and public-health participation.',
        icon: 'users',
      },
    ],
    partners: [
      {
        name: 'Kai. Wamanrao Oak Blood Bank',
        role: 'Medical blood bank partner managing blood collection and donor guidance',
      },
    ],
    implementation: {
      deliveryModel:
        'Voluntary community blood donation camp with medical blood bank team',
      themeSummary:
        'Honouring Chhatrapati Shivaji Maharaj Jayanti through public-health service',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED OUTPUTS',
      items: [
        'Date: 20 February 2022',
        'Category: Health / Community Development',
        'Participants: 35 voluntary blood donors',
        'Collaboration: Kai. Wamanrao Oak Blood Bank',
        'Volunteers and blood bank team shared blood donation awareness',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'Community Generosity Strengthening Emergency Preparedness',
      paragraphs: [
        'The Blood Donation Drive was a powerful reminder of how each of us can contribute to the well-being of our community. By donating blood, the 35 participants helped ensure that the Kai. Wamanrao Oak Blood Bank is better prepared to respond to medical emergencies and save lives.',
        'This event showed us the importance of coming together as a community, especially when it comes to supporting public health. The success of the blood drive was not just in the number of donations but in the spirit of generosity and care that it inspired.',
      ],
    },
    getInvolvedCopy: {
      heading: 'Join Us in Making a Difference',
      description:
        'Our Blood Donation Drive was just one example of how we can all contribute to the health and safety of our community. We encourage everyone to consider donating blood and supporting health-related causes in the future. Together, we can save lives and build a healthier, stronger community.',
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery slot for Blood Donation Drive donors and volunteers',
        caption:
          'Blood Donation Drive (20 February 2022) — Archival slot reserved for authentic photographs of donors and volunteers assisting at the camp.',
        dateRecorded: '20 February 2022',
        visualMotif: 'health',
        placeholderLabel: 'Archival Slot · Donors & Volunteers',
        safeguardingNote:
          'Placeholder awaiting verified photographs from the 20 February 2022 drive.',
      },
      {
        imagePath: null,
        alt: 'Archival gallery slot for Blood Donation Drive with Kai. Wamanrao Oak Blood Bank',
        caption:
          'Blood Donation in Progress — Collaboration with Kai. Wamanrao Oak Blood Bank (35 donors).',
        dateRecorded: '20 February 2022',
        visualMotif: 'health',
        placeholderLabel: 'Archival Slot · Blood Bank Collaboration',
        safeguardingNote:
          'Placeholder awaiting verified photographs from the 20 February 2022 drive.',
      },
    ],
    relatedActivitySlugs: [
      'chhatrapati-shivaji-maharaj-jayanti-2019',
      'sanitary-pad-distribution',
      'utsavachi-shidori',
    ],
  },

  /* =====================================================================
     ACTIVITY 14 — SANDALS FOR CHILDREN (2022)
     ===================================================================== */
  {
    id: 'activity-14',
    slug: 'sandals-for-children',
    archiveNumber: 'ACTIVITY 14',
    title: 'Sandals for Children: Walking Towards a Brighter Future',
    subtitle: 'Providing Comfort and Safety for the Children of Khardi Village',
    shortTitle: 'Sandals for Children',
    year: calculateFinancialYear('21 June 2022'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('21 June 2022')),
    date: '21 June 2022',
    cardDate: '21 Jun 2022',
    location: 'Khardi village, Maharashtra',
    cardLocation: 'Khardi Village, Maharashtra',
    category: 'Education',
    secondaryCategories: ['Community Welfare'],
    categoryDisplayLabel: 'Education / Child Development',
    cardDescription:
      'On 21 June 2022 in Khardi village, Maharashtra, volunteers fitted and distributed more than 250 pairs of brand-new sandals so children walking long distances to school can commute safely and comfortably.',
    cardKeyStat: '250+ Pairs of Sandals · Khardi Village',
    cardStatIcon: 'graduation',
    introduction:
      'On June 21, 2022, we took an important step toward supporting the education of children in Khardi village by organizing a special event to distribute new footwear. Khardi is a rural area with a predominantly tribal population, where children often walk long distances to get to school. With the Sandals for Children initiative, we aimed to remove one of the barriers these kids face on their daily journey to education: the lack of proper footwear.',
    seoTitle:
      'Sandals for Children: Walking Towards a Brighter Future — Garad Foundation',
    seoDescription:
      'On 21 June 2022 in Khardi village, Maharashtra, Garad Foundation distributed over 250 pairs of new sandals to help school-going children commute safely and comfortably.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Sandals for Children in Khardi village (21 June 2022)',
      caption:
        'Sandals for Children (21 June 2022, Khardi village, Maharashtra) — Distribution of 250+ pairs of brand-new sandals to children. Authentic photographs awaiting safeguarding clearance and upload.',
      dateRecorded: '21 June 2022',
      locationRecorded: 'Khardi village, Maharashtra',
      visualMotif: 'education',
      placeholderLabel: 'Archival Photo Pending · Sandals for Children (2022)',
      safeguardingNote:
        'Reserved for authentic photographs from Khardi village (21 June 2022); example document placeholders are omitted.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival card placeholder for Sandals for Children in Khardi village',
      caption:
        'Sandals for Children — 250+ pairs of sandals distributed in Khardi village (21 June 2022).',
      dateRecorded: '21 June 2022',
      locationRecorded: 'Khardi village, Maharashtra',
      visualMotif: 'education',
      placeholderLabel: 'Sandals for Children · 250+ Pairs',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '21 June 2022',
        subtitle: '2022 Archive',
        icon: 'calendar',
      },
      {
        id: 'location',
        eyebrow: 'LOCATION',
        title: 'Khardi Village',
        subtitle: 'Maharashtra',
        icon: 'map-pin',
      },
      {
        id: 'quantity',
        eyebrow: 'FOOTWEAR DISTRIBUTED',
        title: '250+ Pairs',
        subtitle: 'Brand-New Sandals Fitted On-Site',
        icon: 'award',
      },
    ],
    verifiedMetrics: [
      {
        value: '250+',
        label: 'Pairs of Sandals Distributed',
        sublabel: 'Khardi Village, Maharashtra',
        accent: 'forest',
      },
    ],
    needAndRationale: {
      id: 'purpose-of-the-event',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading: 'Making Daily Journeys to School Safer and More Comfortable',
      paragraphs: [
        'The main goal of the Sandals for Children event was to ensure that the children of Khardi village had the necessary footwear to make their school commute safer and more comfortable.',
        'Many of these children walk to school barefoot, which not only makes their journey difficult but also exposes them to injuries and infections. By providing them with new sandals, we hoped to make their path to education a little easier and more secure.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading: 'Individually Fitting Over 250 Pairs of Sandals in Khardi Village',
      paragraphs: [
        'The event was a day filled with joy and excitement as we distributed over 250 pairs of brand-new sandals to the children of Khardi village. The smiles on their faces were priceless as they received their sandals, which would protect their feet and make their daily walk to school much more comfortable.',
        'Our volunteers ensured that each child got a pair of sandals that fit well, taking the time to help them try on the footwear and adjust the straps. The children were thrilled to have something as simple as a pair of sandals—something that many of us take for granted, but which can make a big difference in their lives.',
        'The impact of this initiative was immediate. With their new sandals, these children can now walk to school with greater ease and safety, allowing them to focus more on their studies and less on the discomfort of their journey.',
      ],
    },
    objectivesSectionEyebrow: 'KEY OBJECTIVES',
    objectivesSectionHeading: 'Supporting Safe Rural School Commutes',
    objectives: [
      {
        id: 'obj-1',
        title: 'Protect Children’s Feet',
        description:
          'Reduce the risk of injuries and infections faced by rural children who walk long distances barefoot.',
        icon: 'shield',
      },
      {
        id: 'obj-2',
        title: 'Careful On-Site Sizing',
        description:
          'Help each child try on sandals and adjust straps so every pair fits comfortably for daily walking.',
        icon: 'check',
      },
      {
        id: 'obj-3',
        title: 'Remove Barriers to Schooling',
        description:
          'Make the daily journey to school easier and more secure so children can focus on their studies.',
        icon: 'graduation',
      },
    ],
    implementation: {
      deliveryModel:
        'On-site footwear sizing and distribution by volunteers in Khardi village, Maharashtra',
      themeSummary:
        'Over 250 pairs of brand-new sandals fitted for children in a predominantly tribal rural area',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED OUTPUTS',
      items: [
        'Date: 21 June 2022',
        'Location: Khardi village, Maharashtra',
        'Category: Education / Child Development',
        'Distributed 250+ pairs of brand-new sandals',
        'Volunteers assisted each child with sizing and strap fitting',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'How a Simple Pair of Sandals Removes a Daily Barrier to Learning',
      paragraphs: [
        'The Sandals for Children event was more than just a footwear distribution; it was an important step in supporting the education and well-being of the children in Khardi village. By providing them with proper footwear, we not only helped protect their feet but also removed a significant barrier to their education.',
        'This initiative reminded us of the simple yet powerful ways in which we can make a difference in the lives of others. The success of this event showed that even small gestures, like giving a child a pair of sandals, can have a big impact on their future.',
      ],
    },
    getInvolvedCopy: {
      heading: "Join Us in Supporting Children's Education",
      description:
        "Sandals for Children was just one of the many ways we are working to support children's education in rural areas. We invite you to join us in our mission to remove barriers to education and to help children walk confidently towards a brighter future.",
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for Sandals for Children fitting in Khardi village',
        caption:
          'Volunteers Distributing Sandals (21 June 2022, Khardi village) — Archival slot reserved for verified field photographs.',
        dateRecorded: '21 June 2022',
        locationRecorded: 'Khardi village, Maharashtra',
        visualMotif: 'education',
        placeholderLabel: 'Archival Slot · Footwear Fitting',
        safeguardingNote:
          'Placeholder awaiting verified photographs from Khardi village (21 June 2022).',
      },
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for children and volunteers in Khardi village',
        caption:
          'Khardi Village Distribution — 250+ pairs of brand-new sandals handed over with volunteer support.',
        dateRecorded: '21 June 2022',
        locationRecorded: 'Khardi village, Maharashtra',
        visualMotif: 'education',
        placeholderLabel: 'Archival Slot · Khardi Village Outreach',
        safeguardingNote:
          'Placeholder awaiting verified photographs from Khardi village (21 June 2022).',
      },
    ],
    relatedActivitySlugs: [
      'project-savitri',
      'gudhi-shikshanachi',
      'mission-bharari-phase-1',
    ],
  },

  /* =====================================================================
     ACTIVITY 15 — PROJECT SAVITRI (2023)
     ===================================================================== */
  {
    id: 'activity-15',
    slug: 'project-savitri',
    archiveNumber: 'ACTIVITY 15',
    title: 'Project Savitri: Bringing Comfort to Kharidi Village',
    subtitle: 'Clothing Donation Drive for Women and Children in Need',
    shortTitle: 'Project Savitri',
    year: calculateFinancialYear('27 August 2023'),
    yearDisplay: formatFinancialYearLabel(calculateFinancialYear('27 August 2023')),
    date: '27 August 2023',
    cardDate: '27 Aug 2023',
    location: 'Kharidi village, Maharashtra',
    cardLocation: 'Kharidi Village, Maharashtra',
    category: 'Women & Health Awareness',
    secondaryCategories: ['Community Welfare'],
    categoryDisplayLabel: 'Women Empowerment / Community Development',
    cardDescription:
      'A rainy-season clothing donation drive on 27 August 2023 in the tribal parts of Kharidi village, Maharashtra, providing sweaters, jackets, shoes, and raincoats to 140+ women and children.',
    cardKeyStat: '140+ Women & Children · Kharidi Village',
    cardStatIcon: 'box',
    introduction:
      'On August 27, 2023, we launched Project Savitri, a heartfelt clothing donation drive to support the women and children in the tribal parts of Kharidi village during the challenging rainy season. In these areas, many families struggle with inadequate clothing, which makes the already harsh weather even more difficult to endure. Our goal with this project was to provide them with essential clothing to help them stay warm, dry, and comfortable.',
    seoTitle:
      'Project Savitri: Bringing Comfort to Kharidi Village — Garad Foundation',
    seoDescription:
      'On 27 August 2023, Garad Foundation’s Project Savitri clothing donation drive supported 140+ women and children in Kharidi village, Maharashtra with sweaters, jackets, shoes and raincoats.',
    heroImage: {
      imagePath: null,
      alt: 'Archival documentation placeholder for Project Savitri in Kharidi village (27 August 2023)',
      caption:
        'Project Savitri (27 August 2023, Kharidi village, Maharashtra) — Rainy-season clothing drive reaching 140+ women and children. Authentic photographs awaiting safeguarding clearance and upload.',
      dateRecorded: '27 August 2023',
      locationRecorded: 'Kharidi village, Maharashtra',
      visualMotif: 'welfare',
      placeholderLabel: 'Archival Photo Pending · Project Savitri (2023)',
      safeguardingNote:
        'Reserved for authentic photographs from Project Savitri (27 August 2023, Kharidi village); example document placeholders are omitted.',
    },
    cardImage: {
      imagePath: null,
      alt: 'Archival card placeholder for Project Savitri in Kharidi village',
      caption:
        'Project Savitri — 140+ women and children supported in Kharidi village (27 August 2023).',
      dateRecorded: '27 August 2023',
      locationRecorded: 'Kharidi village, Maharashtra',
      visualMotif: 'welfare',
      placeholderLabel: 'Project Savitri · 140+ Reached',
    },
    metadataCards: [
      {
        id: 'date',
        eyebrow: 'DATE',
        title: '27 August 2023',
        subtitle: '2023 Archive · Rainy Season',
        icon: 'calendar',
      },
      {
        id: 'location',
        eyebrow: 'LOCATION',
        title: 'Kharidi Village',
        subtitle: 'Tribal Parts, Maharashtra',
        icon: 'map-pin',
      },
      {
        id: 'beneficiaries',
        eyebrow: 'BENEFICIARIES',
        title: '140+ Women & Children',
        subtitle: 'Sweaters, Jackets, Shoes & Raincoats',
        icon: 'users',
      },
    ],
    verifiedMetrics: [
      {
        value: '140+',
        label: 'Women & Children Reached',
        sublabel: 'Kharidi Village, Maharashtra',
        accent: 'terracotta',
      },
    ],
    needAndRationale: {
      id: 'purpose-of-the-event',
      eyebrow: 'PURPOSE OF THE EVENT',
      heading:
        'Supporting Comfort and Dignity During the Challenging Rainy Season',
      paragraphs: [
        'The main goal of Project Savitri was to address the immediate needs of women and children in Kharidi village by providing them with suitable clothing.',
        'The rainy season can be particularly harsh for those without proper clothing, leading to discomfort and health issues. By donating clothes, we aimed to make their lives a little easier and help them face the challenges of the season with greater comfort and dignity.',
      ],
    },
    whatWeDid: {
      id: 'activities-and-highlights',
      eyebrow: 'ACTIVITIES AND HIGHLIGHTS',
      heading:
        'Community Clothing Collection, Volunteer Sorting, and Field Distribution',
      paragraphs: [
        'In the weeks leading up to the event, we called on our community to donate old but usable clothing. The response was overwhelmingly positive, with generous contributions pouring in from all corners. Our volunteers worked tirelessly to sort and organize the clothing, ensuring that each item was in good condition and suitable for the recipients.',
        'On the day of the event, we distributed these clothes to over 140 women and children in Kharidi village. The joy and relief on their faces were clear as they received the much-needed clothing. From warm sweaters and jackets to sturdy shoes and raincoats, the donated items helped meet their basic needs and provided protection against the elements.',
        'The impact of Project Savitri was immediate. The clothing not only offered physical comfort but also a sense of dignity and care, reminding the recipients that they are not forgotten, even in the most challenging times.',
      ],
    },
    objectivesSectionEyebrow: 'KEY OBJECTIVES',
    objectivesSectionHeading: 'How Project Savitri Supported Families',
    objectives: [
      {
        id: 'obj-1',
        title: 'Community Clothing Mobilisation',
        description:
          'Collect old but usable garments from community donors ahead of the rainy-season distribution.',
        icon: 'heart',
      },
      {
        id: 'obj-2',
        title: 'Quality Sorting & Preparation',
        description:
          'Volunteers carefully sorted and organised items so every garment was in good condition and suitable for recipients.',
        icon: 'check',
      },
      {
        id: 'obj-3',
        title: 'Weather Protection & Dignity',
        description:
          'Provide sweaters, jackets, sturdy shoes, and raincoats to over 140 women and children in Kharidi village.',
        icon: 'shield',
      },
    ],
    implementation: {
      deliveryModel:
        'Community clothing donation drive, volunteer sorting, and direct distribution in Kharidi village',
      themeSummary:
        'Rainy-season clothing support (sweaters, jackets, shoes and raincoats) for tribal women and children',
    },
    outputs: {
      sidebarTitle: 'DOCUMENTED OUTPUTS',
      items: [
        'Date: 27 August 2023',
        'Location: Kharidi village, Maharashtra',
        'Category: Women Empowerment / Community Development',
        'Beneficiaries: 140+ women and children',
        'Items distributed: Sweaters, jackets, sturdy shoes and raincoats',
      ],
    },
    reflection: {
      eyebrow: 'REFLECTION AND IMPACT',
      heading: 'An Act of Kindness, Solidarity, and Community Care',
      paragraphs: [
        'Project Savitri was more than just a clothing drive—it was an act of kindness and solidarity. By coming together to support the women and children of Kharidi village, we were able to make a tangible difference in their lives during a difficult season. The success of this initiative highlighted the power of community and the importance of helping those in need.',
        "The smiles and gratitude of the recipients were a powerful reminder of why we do what we do. It showed us that even simple actions, like donating clothes, can have a profound impact on someone's life.",
      ],
    },
    getInvolvedCopy: {
      heading: 'Join Us in Making a Difference',
      description:
        'Project Savitri is just one of many efforts to support communities in need. We invite you to join us in our mission to improve the lives of those who are less fortunate. Together, we can bring comfort, dignity, and hope to more people in need.',
    },
    gallery: [
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for Project Savitri clothing sorting by volunteers',
        caption:
          'Volunteers Organising Clothes (August 2023) — Sorting community-donated sweaters, jackets, shoes and raincoats for Kharidi village.',
        dateRecorded: '27 August 2023',
        locationRecorded: 'Kharidi village, Maharashtra',
        visualMotif: 'welfare',
        placeholderLabel: 'Archival Slot · Sorting & Preparation',
        safeguardingNote:
          'Placeholder awaiting verified photographs from Project Savitri (27 August 2023).',
      },
      {
        imagePath: null,
        alt: 'Archival gallery placeholder for Project Savitri distribution in Kharidi village',
        caption:
          'Distribution in Kharidi Village (27 August 2023) — Supporting 140+ women and children during the rainy season.',
        dateRecorded: '27 August 2023',
        locationRecorded: 'Kharidi village, Maharashtra',
        visualMotif: 'welfare',
        placeholderLabel: 'Archival Slot · Kharidi Village Distribution',
        safeguardingNote:
          'Placeholder awaiting verified photographs from Project Savitri (27 August 2023).',
      },
    ],
    relatedActivitySlugs: [
      'sandals-for-children',
      'sanitary-pad-distribution',
      'utsavachi-shidori',
    ],
  },
];

export const ACTIVITIES: ActivityRecord[] = RAW_ACTIVITIES.map(
  applyActivitySampleImages
);

export const YEAR_FILTERS: { id: FiscalYearId; label: string }[] =
  buildFinancialYearFilters(ACTIVITIES.map((item) => item.year));

const PILLAR_VARIANT_BY_FY: Record<
  ConcreteFinancialYearId,
  TimelinePillar['variant']
> = {
  '2018-2019': 'forest-1',
  '2019-2020': 'ochre',
  '2020-2021': 'forest-2',
  '2021-2022': 'forest-3',
  '2022-2023': 'forest-4',
  '2023-2024': 'terracotta',
  '2024-2025': 'forest-2',
  '2025-2026': 'forest-4',
};

export const TIMELINE_PILLARS: TimelinePillar[] = YEAR_FILTERS.filter(
  (fy): fy is { id: ConcreteFinancialYearId; label: string } => fy.id !== 'all'
).map((fy) => {
  const count = ACTIVITIES.filter((a) => a.year === fy.id).length;
  const maxCount = Math.max(
    1,
    ...YEAR_FILTERS.filter((y) => y.id !== 'all').map(
      (y) => ACTIVITIES.filter((a) => a.year === y.id).length
    )
  );
  const heightPercent =
    count === 0 ? 18 : Math.round(36 + (count / maxCount) * 56);

  return {
    id: fy.id,
    shortLabel: formatFinancialYearShort(fy.id),
    verticalLabel:
      count === 0
        ? 'UPCOMING'
        : count === 1
        ? '1 REPORT'
        : `${count} REPORTS`,
    badgeText:
      count === 0
        ? `FY ${fy.label} · Upcoming`
        : `FY ${fy.label} · ${count} Documented`,
    heightPercent,
    variant: PILLAR_VARIANT_BY_FY[fy.id],
    documentedCount: count,
    summary:
      count === 0
        ? `Financial Year ${fy.label} archive slot ready for upcoming verified documentation`
        : `${count} documented ${
            count === 1 ? 'activity' : 'activities'
          } in Financial Year ${fy.label}`,
  };
});

export function getActivityBySlug(slug: string): ActivityRecord | undefined {
  return ACTIVITIES.find((item) => item.slug === slug);
}

export function getRelatedActivities(activity: ActivityRecord): ActivityRecord[] {
  return activity.relatedActivitySlugs
    .map((slug) => getActivityBySlug(slug))
    .filter((item): item is ActivityRecord => Boolean(item));
}
