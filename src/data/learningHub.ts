import {
  LEARNING_HUB_IMAGES,
  LearningHubImageAsset,
} from './learningHubImages';

export type ProgrammeStatus =
  | 'Completed / Past Programme'
  | 'Available for Enquiry'
  | 'Proposed Programme'
  | 'Custom Session';

export interface ProgrammeSessionPhase {
  step: string;
  title: string;
  detail: string;
}

export interface LearningProgramme {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  /** Whether this represents an established/proposed Garad programme vs. a customised session offering. */
  kind: 'programme' | 'custom-session';
  /** Verified category label (only populated when verified information is available). */
  category?: string;
  /** Verified programme status (only populated when supported by verified information). */
  status?: ProgrammeStatus;
  /** Concise verified summary shown on the programme card. */
  cardSummary: string;
  /** True when only the programme name is currently verified and full curriculum details are awaiting documentation. */
  detailsPendingVerification?: boolean;
  /** Primary visual for cards and programme detail hero. */
  image: LearningHubImageAsset;
  /** Accent motif strictly aligned with Garad Learning Hub palette. */
  accentTone: 'forest' | 'gold' | 'sage';
  /** Detailed programme profile fields (populated only with verified content). */
  detail: {
    overview: string;
    overviewNote?: string;
    learningObjectives?: string[];
    topicsCovered?: string[];
    howStudentsParticipate?: string[];
    proposedSessionStructure?: ProgrammeSessionPhase[];
    intendedAudience?: {
      label: string;
      detail: string;
    }[];
    proposalScopeNotice?: {
      heading: string;
      targets: string[];
      expectedOutcomes: string[];
      disclaimer: string;
    };
    enquiryOptionValue: string;
  };
}

export const LEARNING_PROGRAMMES: LearningProgramme[] = [
  {
    id: 'prog-sabse-bada-rupaiya',
    slug: 'sabse-bada-rupaiya',
    name: 'Sabse Bada Rupaiya — Money Smart Starts Young',
    shortName: 'Sabse Bada Rupaiya',
    kind: 'programme',
    category: 'Financial Literacy',
    status: 'Proposed Programme',
    cardSummary:
      'A practical, school-based financial literacy programme that introduces students to responsible money habits through interactive learning and real-life activities.',
    image: LEARNING_HUB_IMAGES.programmeSabseBadaRupaiya,
    accentTone: 'gold',
    detail: {
      overview:
        'A practical, school-based financial literacy programme that introduces students to responsible money habits through interactive learning and real-life activities.',
      overviewNote:
        'Based on the Garad Foundation Phase 1 concept note. Programme targets and expected outcomes listed below represent proposed Phase 1 plans rather than confirmed completion statistics.',
      learningObjectives: [
        'Build practical awareness of saving, responsible spending, and distinguishing everyday needs from wants.',
        'Encourage students to set achievable personal savings goals and track progress over time.',
        'Introduce foundational banking concepts and safe habits for everyday digital payments.',
        'Reinforce classroom learning through hands-on budgeting exercises and interactive facilitator dialogue.',
      ],
      topicsCovered: [
        'Saving and responsible spending',
        'Budgeting and needs versus wants',
        'Financial goal-setting',
        'Basic banking',
        'Digital payment safety',
      ],
      howStudentsParticipate: [
        'Interactive group sessions facilitated with relatable everyday examples',
        'Practical budgeting exercises comparing needs versus wants',
        'Guided interaction with an invited subject mentor or expert',
        'Individual Gullak savings boxes to encourage hands-on saving habits',
        'Personalised Savings Goal Cards to plan and track student goals',
        'Short pre- and post-session learning assessments',
        'Participation certificates recognising student engagement',
      ],
      proposedSessionStructure: [
        {
          step: '01',
          title: 'Warm-Up & Baseline Check',
          detail:
            'Opening conversation on everyday money choices paired with a brief baseline assessment.',
        },
        {
          step: '02',
          title: 'Interactive Learning & Budgeting Exercise',
          detail:
            'Facilitated activities exploring saving, needs versus wants, basic banking, and digital payment safety.',
        },
        {
          step: '03',
          title: 'Expert Interaction & Goal-Setting',
          detail:
            'Practical Q&A with a resource person alongside filling out individual Savings Goal Cards and receiving Gullak savings boxes.',
        },
        {
          step: '04',
          title: 'Reflection, Post-Assessment & Certificates',
          detail:
            'Closing learning check, student feedback collection, and distribution of participation certificates (90–120 minutes total proposed duration).',
        },
      ],
      intendedAudience: [
        {
          label: 'Target Students',
          detail: 'School students in Standards VII–X',
        },
        {
          label: 'Proposed Group Size',
          detail: '25 students per school batch',
        },
        {
          label: 'Proposed Duration',
          detail: '90–120 minutes per school intervention',
        },
        {
          label: 'Phase 1 Proposal Scope',
          detail: '100 students across four schools in Thane (planned)',
        },
      ],
      proposalScopeNotice: {
        heading: 'Phase 1 Concept Note — Proposed Targets & Expected Outcomes',
        targets: [
          'Proposed Phase 1 reach: 100 students across four schools in Thane (25 students per school).',
          'Proposed session format: 90–120 minute interactive school intervention with learning kits.',
        ],
        expectedOutcomes: [
          'At least 20% average improvement in assessment scores (expected target).',
          'At least 90% participation in three or more learning activities (expected target).',
          'At least 80% positive participant feedback (expected target).',
        ],
        disclaimer:
          'These figures reflect Phase 1 concept-note targets and expected outcomes, not confirmed completion results.',
      },
      enquiryOptionValue: 'Sabse Bada Rupaiya — Money Smart Starts Young',
    },
  },
  {
    id: 'prog-shiv-shala',
    slug: 'shiv-shala',
    name: 'Shiv Shala',
    shortName: 'Shiv Shala',
    kind: 'programme',
    cardSummary:
      'A named Garad Foundation learning initiative. Verified programme description, category, and session details will be published here once confirmed.',
    detailsPendingVerification: true,
    image: LEARNING_HUB_IMAGES.programmeShivShala,
    accentTone: 'forest',
    detail: {
      overview:
        'Shiv Shala is a verified programme name within Garad Learning Hub. Detailed programme objectives, topics, format, and historical documentation are awaiting editorial verification and will be published here once confirmed by the Garad team.',
      enquiryOptionValue: 'Shiv Shala',
    },
  },
  {
    id: 'prog-youth-leadership',
    slug: 'youth-leadership-program',
    name: 'Youth Leadership Program',
    shortName: 'Youth Leadership Program',
    kind: 'programme',
    cardSummary:
      'A named Garad Foundation youth leadership initiative. Detailed programme curriculum, learning objectives, and facilitator records will be updated once verified.',
    detailsPendingVerification: true,
    image: LEARNING_HUB_IMAGES.programmeYouthLeadership,
    accentTone: 'sage',
    detail: {
      overview:
        'Youth Leadership Program is a verified programme name within Garad Learning Hub. Specific learning objectives, session duration, facilitator profiles, and cohort records are intentionally left unpopulated until verified documentation is published.',
      enquiryOptionValue: 'Youth Leadership Program',
    },
  },
  {
    id: 'prog-special-workshops',
    slug: 'special-workshops',
    name: 'Special Workshops',
    shortName: 'Special Workshops',
    kind: 'custom-session',
    category: 'Custom Learning Experiences',
    status: 'Custom Session',
    cardSummary:
      'Learning sessions designed around the interests, needs and goals of schools, organisations and communities.',
    image: LEARNING_HUB_IMAGES.programmeSpecialWorkshops,
    accentTone: 'forest',
    detail: {
      overview:
        'Learning sessions designed around the interests, needs and goals of schools, organisations and communities. Unlike established Garad curriculum tracks, Special Workshops are shaped collaboratively in response to an organisation’s specific context and participant group.',
      overviewNote:
        'Special Workshops are tailored on enquiry and are distinct from named Garad Foundation programmes.',
      learningObjectives: [
        'Align workshop themes and activities with the specific context of the host school, college, corporate team, or community group.',
        'Prioritise interactive participation, practical exercises, and thoughtful group conversation.',
        'Gather participant reflections to review relevance and learning value after each session.',
      ],
      howStudentsParticipate: [
        'Collaborative planning with the host institution to clarify group needs and learning goals',
        'Interactive facilitation tailored to participant age group and setting',
        'Hands-on activities, discussions, and guided reflection',
      ],
      intendedAudience: [
        {
          label: 'Schools & Colleges',
          detail: 'Custom thematic sessions shaped around student learning needs',
        },
        {
          label: 'Corporate Organisations',
          detail: 'Tailored workshops and collaborative learning sessions for teams',
        },
        {
          label: 'Communities & Youth Groups',
          detail: 'Practical group sessions rooted in local interests and community goals',
        },
      ],
      enquiryOptionValue: 'Special Workshops (Custom Session)',
    },
  },
];

export function getLearningProgrammeBySlug(
  slug: string
): LearningProgramme | undefined {
  return LEARNING_PROGRAMMES.find((p) => p.slug === slug);
}

/* ---------------------- Interactive Programme Finder ---------------------- */
export const FINDER_AUDIENCE_OPTIONS = [
  { id: 'School', label: 'School', hint: 'Primary, middle, or secondary school students' },
  { id: 'College', label: 'College', hint: 'Junior college, undergraduate, or campus groups' },
  {
    id: 'Corporate Organisation',
    label: 'Corporate Organisation',
    hint: 'Employee engagement, CSR, or team learning',
  },
  {
    id: 'Community / Youth Group',
    label: 'Community / Youth Group',
    hint: 'Neighbourhood circles, youth collectives, or grassroots groups',
  },
  { id: 'Other', label: 'Other', hint: 'Nonprofits, institutions, or mixed groups' },
] as const;

export type FinderAudienceId = (typeof FINDER_AUDIENCE_OPTIONS)[number]['id'];

export const FINDER_TOPIC_OPTIONS = [
  { id: 'Financial Literacy', label: 'Financial Literacy' },
  { id: 'Leadership Development', label: 'Leadership Development' },
  { id: 'Life Skills', label: 'Life Skills' },
  { id: 'Values and Cultural Learning', label: 'Values and Cultural Learning' },
  { id: 'Special Workshop', label: 'Special Workshop' },
  { id: 'Custom Learning Experience', label: 'Custom Learning Experience' },
] as const;

export type FinderTopicId = (typeof FINDER_TOPIC_OPTIONS)[number]['id'];

export interface FinderResolution {
  hasVerifiedMatch: boolean;
  matchedProgrammes: LearningProgramme[];
  headline: string;
  summary: string;
  enquiryProgrammeValue: string;
  suggestedCustomRequirement: string;
}

/**
 * Strictly factual match resolution:
 * - Only recommends Sabse Bada Rupaiya when Audience is School AND Topic is Financial Literacy
 *   (the only verified audience+topic match in the concept note).
 * - Recommends Special Workshops when Topic is Special Workshop or Custom Learning Experience.
 * - For all other combinations, honestly directs visitors to request a custom session
 *   without fabricating programme matches.
 */
export function resolveProgrammeFinder(
  audience: FinderAudienceId,
  topic: FinderTopicId
): FinderResolution {
  if (audience === 'School' && topic === 'Financial Literacy') {
    const sbr = LEARNING_PROGRAMMES.find(
      (p) => p.slug === 'sabse-bada-rupaiya'
    )!;
    return {
      hasVerifiedMatch: true,
      matchedProgrammes: [sbr],
      headline: 'A matching programme from our library',
      summary:
        'Sabse Bada Rupaiya — Money Smart Starts Young is a proposed school-based financial literacy programme designed for Standards VII–X. Submit an enquiry to discuss feasibility and scheduling with the Garad team.',
      enquiryProgrammeValue: sbr.detail.enquiryOptionValue,
      suggestedCustomRequirement: `School financial literacy enquiry (${topic})`,
    };
  }

  if (topic === 'Special Workshop' || topic === 'Custom Learning Experience') {
    const special = LEARNING_PROGRAMMES.find(
      (p) => p.slug === 'special-workshops'
    )!;
    return {
      hasVerifiedMatch: true,
      matchedProgrammes: [special],
      headline: 'Custom learning sessions built around your group',
      summary:
        'Special Workshops are tailored around the interests, needs, and goals of schools, organisations, and communities. Share your objectives to start a conversation with the Garad team.',
      enquiryProgrammeValue: special.detail.enquiryOptionValue,
      suggestedCustomRequirement: `${topic} for ${audience}`,
    };
  }

  return {
    hasVerifiedMatch: false,
    matchedProgrammes: [],
    headline: "Let's create a learning experience for your group.",
    summary: `We do not currently have a verified standard curriculum match listed for ${audience.toLowerCase()} groups focused on ${topic.toLowerCase()}. Share your learning goals with us and our team will connect to discuss a customised session.`,
    enquiryProgrammeValue: 'Special Workshops (Custom Session)',
    suggestedCustomRequirement: `Custom ${topic} session for ${audience}`,
  };
}

/* ---------------------- Who Can Learn With Us ---------------------- */
export interface LearningAudienceCard {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  image: LearningHubImageAsset;
  organisationType: FinderAudienceId;
  targetSection: 'programmes' | 'enquiry';
}

export const LEARNING_AUDIENCES: LearningAudienceCard[] = [
  {
    id: 'schools-colleges',
    title: 'Schools & Colleges',
    description:
      'Bring meaningful, practical learning experiences to your students.',
    ctaLabel: 'Explore School Sessions',
    image: LEARNING_HUB_IMAGES.audienceSchoolsColleges,
    organisationType: 'School',
    targetSection: 'programmes',
  },
  {
    id: 'corporates',
    title: 'Corporates',
    description:
      'Engage with learning experiences and customised workshops for your organisation.',
    ctaLabel: 'Corporate Enquiry',
    image: LEARNING_HUB_IMAGES.audienceCorporates,
    organisationType: 'Corporate Organisation',
    targetSection: 'enquiry',
  },
  {
    id: 'communities-youth',
    title: 'Communities & Youth',
    description:
      'Create opportunities for young people and communities to learn and grow.',
    ctaLabel: 'Explore Community Sessions',
    image: LEARNING_HUB_IMAGES.audienceCommunitiesYouth,
    organisationType: 'Community / Youth Group',
    targetSection: 'enquiry',
  },
];

/* ---------------------- How Our Sessions Work ---------------------- */
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const SESSION_PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Understand',
    description:
      "We understand the organisation's needs and learning goals.",
  },
  {
    number: '02',
    title: 'Plan',
    description:
      'We identify a suitable programme or develop a customised session.',
  },
  {
    number: '03',
    title: 'Experience',
    description:
      'Participants take part in interactive and practical learning activities.',
  },
  {
    number: '04',
    title: 'Reflect',
    description:
      'We gather feedback and review the learning experience.',
  },
];

/* ---------------------- Learning in Action Gallery ---------------------- */
export interface LearningGalleryItem {
  id: string;
  kind: 'photo' | 'video-preview';
  layoutSpan: 'feature' | 'tall' | 'standard';
  image: LearningHubImageAsset;
  themeLabel: string;
  /** Only non-fabricated descriptive context; never claims real event dates or numbers for sample visuals. */
  previewNote: string;
  videoUrl?: string | null;
}

export const LEARNING_GALLERY_ITEMS: LearningGalleryItem[] = [
  {
    id: 'gal-1',
    kind: 'photo',
    layoutSpan: 'feature',
    image: LEARNING_HUB_IMAGES.galleryLearningAction,
    themeLabel: 'Hands-On Group Exercises',
    previewNote:
      'Illustrative visual preview depicting collaborative small-group learning and facilitator guidance. Original Garad Learning Hub session photographs will replace preview imagery as sessions are documented.',
  },
  {
    id: 'gal-2',
    kind: 'photo',
    layoutSpan: 'standard',
    image: LEARNING_HUB_IMAGES.programmeSabseBadaRupaiya,
    themeLabel: 'Practical Financial Habits',
    previewNote:
      'Illustrative visual preview representing classroom budgeting exercises and hands-on savings tools.',
  },
  {
    id: 'gal-3',
    kind: 'video-preview',
    layoutSpan: 'standard',
    image: LEARNING_HUB_IMAGES.heroWorkshop,
    themeLabel: 'Interactive Facilitation Reel',
    previewNote:
      'Video preview slot prepared for authentic Garad Learning Hub workshop recordings once verified and cleared for publication.',
    videoUrl: null,
  },
  {
    id: 'gal-4',
    kind: 'photo',
    layoutSpan: 'standard',
    image: LEARNING_HUB_IMAGES.programmeYouthLeadership,
    themeLabel: 'Youth Expression & Dialogue',
    previewNote:
      'Illustrative visual preview representing peer presentations and guided group conversation.',
  },
  {
    id: 'gal-5',
    kind: 'video-preview',
    layoutSpan: 'standard',
    image: LEARNING_HUB_IMAGES.audienceCommunitiesYouth,
    themeLabel: 'Community Learning Circles',
    previewNote:
      'Video preview slot prepared for verified community session stories and facilitator reflections.',
    videoUrl: null,
  },
];

/* ---------------------- Enquiry Options ---------------------- */
export const ENQUIRY_ORGANISATION_TYPES = [
  'School',
  'College',
  'Corporate Organisation',
  'Community / Youth Group',
  'Other',
] as const;

export type EnquiryOrganisationType =
  (typeof ENQUIRY_ORGANISATION_TYPES)[number];

export const ENQUIRY_PROGRAMME_OPTIONS = [
  'Sabse Bada Rupaiya — Money Smart Starts Young',
  'Shiv Shala',
  'Youth Leadership Program',
  'Special Workshops (Custom Session)',
  'Not sure yet — please advise',
] as const;

export type EnquiryProgrammeOption =
  (typeof ENQUIRY_PROGRAMME_OPTIONS)[number];

/* ---------------------- Frequently Asked Questions ---------------------- */
export interface LearningFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const LEARNING_HUB_FAQS: LearningFaqItem[] = [
  {
    id: 'faq-who',
    question: 'Who can request a learning session?',
    answer:
      'Schools, colleges, corporate organisations, community groups, youth collectives, and partner institutions can submit an enquiry through the Request a Session form on this page. The Garad team reviews each request individually to assess suitability and scheduling.',
  },
  {
    id: 'faq-custom-school',
    question: 'Can schools request a customised programme?',
    answer:
      'Yes. In addition to enquiring about named Garad Learning Hub initiatives, schools can request a Special Workshop tailored to their students’ age group, learning goals, and schedule. Share your requirements in the enquiry form so our team can discuss what is feasible.',
  },
  {
    id: 'faq-corporates',
    question: 'Can corporates organise workshops?',
    answer:
      'Yes. Corporate organisations may enquire about learning sessions or customised workshops for their teams, or explore supporting school-based learning initiatives through Garad Foundation. Please use the session enquiry form to start a conversation.',
  },
  {
    id: 'faq-how-enquire',
    question: 'How can we enquire about a programme?',
    answer:
      'Complete the Request a Training Session form below with your organisation details, preferred programme or custom learning requirement, expected group size, and preferred dates. Submitting an enquiry starts a planning discussion and does not constitute an automatic booking.',
  },
  {
    id: 'faq-availability',
    question: 'Are all programmes currently available?',
    answer:
      'Not every programme listed in Garad Learning Hub is continuously open for immediate booking. Some initiatives, such as Sabse Bada Rupaiya, are currently documented at the Phase 1 proposal stage, while others are awaiting full published details. Availability, facilitator readiness, and dates are always confirmed directly by the Garad team after reviewing your enquiry.',
  },
];
