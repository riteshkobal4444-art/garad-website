import { ACTIVITIES, ActivityMedia, getActivityBySlug } from './activities';
import heroMissionBharariImg from '../assets/images/mission_bharari_hero_1795271349821.jpg';
import heroAbhivyaktaImg from '../assets/images/sample_abhivyakta_folk_dance_1795375247087.jpg';
import heroProjectUrjaImg from '../assets/images/bharari_gallery_reading_1795271250819.jpg';
import aboutVolunteersImg from '../assets/images/volunteer_hero_education_1795289741467.jpg';
import joinClosingImg from '../assets/images/volunteer_closing_community_1795289742188.jpg';

export type HomepageImageType = 'original' | 'sample';

export interface HomepageImageAsset {
  src: string;
  alt: string;
  caption: string;
  imageType: HomepageImageType;
  objectPosition?: string;
}

export interface HeroInitiativeSlide {
  id: string;
  indexLabel: string;
  title: string;
  category: string;
  description: string;
  ctaLabel: string;
  destination:
    | { kind: 'activity'; slug: string }
    | { kind: 'csr-project'; slug: string };
  image: HomepageImageAsset;
}

export interface HomepageFeaturedActivity {
  slug: string;
  title: string;
  shortDescription: string;
  dateLabel: string;
  yearDisplay: string;
  category: string;
  location: string;
  image: HomepageImageAsset;
}

export interface VerifiedImpactStat {
  id: string;
  numericValue: number;
  suffix?: string;
  displayValue: string;
  label: string;
  periodAndSource: string;
}

export interface VerifiedTestimonial {
  id: string;
  quote: string;
  reviewerName: string;
  roleOrContext?: string;
  sourceAttribution: string;
}

export interface CommunityReflectionHighlight {
  id: string;
  group: string;
  reflection: string;
  attribution: string;
}

export interface GaradUniverseLandmark {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Percentage position inside the 16:9 panoramic village vista */
  xPercent: number;
  yPercent: number;
  destinationLabel: string;
  destination:
    | { kind: 'activity'; slug: string }
    | { kind: 'csr-project'; slug: string }
    | { kind: 'learning-hub' }
    | { kind: 'archive' }
    | { kind: 'volunteer' };
}

/**
 * Verified contact & organisational details sourced from garadfoundation.org.
 */
export const GARAD_CONTACT_INFO = {
  organisationName: 'Garad Foundation',
  tagline: 'Small Actions. Big Change.',
  summary:
    'A youth-led foundation working towards a better tomorrow through education, social awareness, youth empowerment and meaningful community action.',
  address:
    'Shop No. 2, Saraswati Nivas CHS, Atre Katta, M.G. Road, Naupada, Thane West, Maharashtra',
  cityRegion: 'Thane, Maharashtra, India',
  email: 'garadfoundation@gmail.com',
  phoneDisplay: '+91 93214 68652',
  phoneHref: 'tel:+919321468652',
  officialWebsiteUrl: 'https://garadfoundation.org/',
  activitiesArchiveUrl: 'https://activities.garadfoundation.org/',
} as const;

/**
 * Garad Universe integration configuration.
 * Defaults to the integrated interactive `/garad-universe` route inside this project.
 * If an external Garad Universe deployment URL is provided later, set `externalUrl`.
 */
export const GARAD_UNIVERSE_CONFIG: {
  routePath: string;
  externalUrl: string | null;
} = {
  routePath: '/garad-universe',
  externalUrl: null,
};

/**
 * Authentic introductory story and verified Vision statement from Garad Foundation.
 */
export const GARAD_STORY_AND_VISION = {
  aboutEyebrow: 'About Garad Foundation',
  aboutHeading:
    'A Little Group of Young People, Trying to Make the World a Kinder Place.',
  aboutLead:
    'Garad Foundation began with something simple — a genuine desire to help. We are a youth-led organisation built by young people who believe that even small actions, done with love and consistency, can create meaningful change.',
  aboutSupporting:
    'Rooted in Thane and working across rural and urban communities in Maharashtra, our volunteers collaborate directly with Zilla Parishad schools, local educators, and community partners across education, health awareness, youth expression, and community welfare.',
  aboutImage: {
    src: aboutVolunteersImg,
    alt: 'Young Garad Foundation volunteers engaging with schoolchildren and illustrated storybooks in a sunlit Maharashtra courtyard',
    caption:
      'Youth volunteers coordinating grassroots educational outreach across Maharashtra.',
    imageType: 'sample' as HomepageImageType,
    objectPosition: 'center 30%',
  },
  visionEyebrow: 'Our Vision',
  visionStatement:
    'In the next two decades, we envision youth as the true pillars of nation-building — driving positive change at the grassroots through education, selfless service, and the spirit of innovation.',
};

/**
 * Hero Section — Three Featured Initiatives Carousel.
 * Intentionally distinct from the dedicated "Our Activities" section further down the page.
 */
export const HERO_FEATURED_INITIATIVES: HeroInitiativeSlide[] = [
  {
    id: 'hero-mission-bharari',
    indexLabel: '01',
    title: 'Mission Bharari',
    category: 'Tribal Education',
    description:
      'Helping students in tribal communities move towards a brighter educational future.',
    ctaLabel: 'Explore Initiative',
    destination: { kind: 'activity', slug: 'mission-bharari-phase-1' },
    image: {
      src: heroMissionBharariImg,
      alt: 'Students and volunteers during Mission Bharari rural educational outreach in Maharashtra',
      caption: 'Mission Bharari — Rural & tribal school stationery and educational support.',
      imageType: 'sample',
      objectPosition: 'center 30%',
    },
  },
  {
    id: 'hero-abhivyakta',
    indexLabel: '02',
    title: 'Abhivyaktā',
    category: 'Youth Expression & Culture',
    description:
      'A platform where young voices find confidence, expression and opportunity.',
    ctaLabel: 'Explore Initiative',
    destination: { kind: 'activity', slug: 'abhivyakta-2024' },
    image: {
      src: heroAbhivyaktaImg,
      alt: 'Young students performing on stage during a cultural and elocution showcase in Maharashtra',
      caption: 'Abhivyaktā — District-level elocution and regional folk cultural celebration.',
      imageType: 'sample',
      objectPosition: 'center 25%',
    },
  },
  {
    id: 'hero-project-urja',
    indexLabel: '03',
    title: 'Project Urja',
    category: 'Education & Student Support',
    description:
      'Bringing light and new possibilities to students who need them.',
    ctaLabel: 'Explore Initiative',
    destination: { kind: 'csr-project', slug: 'project-urja' },
    image: {
      src: heroProjectUrjaImg,
      alt: 'Students reading and learning together in a warm sunlit classroom setting',
      caption: 'Project Urja — Documented educational support initiative by Garad Foundation.',
      imageType: 'sample',
      objectPosition: 'center 32%',
    },
  },
];

/**
 * Garad Universe Landmarks (Mission Bharari Village Environment).
 * Preserves the village entrance, rural school, and library pavilion structure.
 */
export const GARAD_UNIVERSE_LANDMARKS: GaradUniverseLandmark[] = [
  {
    id: 'village-entrance',
    title: 'Village Entrance',
    subtitle: 'Community Gateway',
    description:
      'Where Garad volunteers begin every initiative — listening to families, educators, and rural communities first.',
    xPercent: 18,
    yPercent: 68,
    destinationLabel: 'Explore All Activities',
    destination: { kind: 'archive' },
  },
  {
    id: 'mission-bharari-school',
    title: 'Mission Bharari School',
    subtitle: 'Zilla Parishad Classroom',
    description:
      'Our flagship educational effort supporting 220 students across 10 rural Zilla Parishad schools in Bhor Taluka.',
    xPercent: 49,
    yPercent: 52,
    destinationLabel: 'View Mission Bharari',
    destination: { kind: 'activity', slug: 'mission-bharari-phase-1' },
  },
  {
    id: 'garad-granthalay-library',
    title: 'Garad Granthalay',
    subtitle: 'Rural Reading & Library Space',
    description:
      'Nurturing reading habits and accessible study spaces through curated books and rural community libraries.',
    xPercent: 78,
    yPercent: 58,
    destinationLabel: 'Explore Garad Granthalay',
    destination: { kind: 'csr-project', slug: 'garad-granthalay' },
  },
];

/**
 * Dedicated "OUR ACTIVITIES" Homepage Section — Strictly 3 Selected Activities.
 * Resolved directly from verified records in `src/data/activities.ts` using distinct
 * imagery that does not duplicate the Hero banner photographs.
 */
function buildFeaturedActivities(): HomepageFeaturedActivity[] {
  const missionBharari = getActivityBySlug('mission-bharari-phase-1');
  const abhivyakta = getActivityBySlug('abhivyakta-2024');
  const projectSavitri = getActivityBySlug('project-savitri');

  const list: HomepageFeaturedActivity[] = [];

  if (missionBharari) {
    list.push({
      slug: missionBharari.slug,
      title: 'Mission Bharari',
      shortDescription:
        'Supporting students in tribal communities through meaningful educational opportunities.',
      dateLabel: missionBharari.cardDate,
      yearDisplay: missionBharari.yearDisplay,
      category: missionBharari.category,
      location: missionBharari.cardLocation,
      image: {
        src:
          missionBharari.gallery[1]?.imagePath ||
          missionBharari.cardImage.imagePath ||
          '/assets/activities/samples/mission-bharari-phase-1-handover.jpg',
        alt:
          missionBharari.gallery[1]?.alt ||
          'Students receiving school kits during Mission Bharari rural educational outreach',
        caption: 'Mission Bharari – Phase 1 · Bhor Taluka',
        imageType: missionBharari.gallery[1]?.imageType ?? 'sample',
        objectPosition: 'center 25%',
      },
    });
  }

  if (abhivyakta) {
    list.push({
      slug: abhivyakta.slug,
      title: 'Abhivyaktā',
      shortDescription:
        'Creating a platform for students to express their ideas, confidence and creativity.',
      dateLabel: abhivyakta.cardDate,
      yearDisplay: abhivyakta.yearDisplay,
      category: abhivyakta.category,
      location: abhivyakta.cardLocation,
      image: {
        src:
          abhivyakta.cardImage.imagePath ||
          '/assets/activities/samples/abhivyakta-2024-elocution.jpg',
        alt: abhivyakta.cardImage.alt,
        caption: 'Abhivyaktā 2024 · Thane District Youth Showcase',
        imageType: abhivyakta.cardImage.imageType ?? 'sample',
        objectPosition: abhivyakta.cardImage.objectPosition || 'center 22%',
      },
    });
  }

  if (projectSavitri) {
    list.push({
      slug: projectSavitri.slug,
      title: 'Project Savitri',
      shortDescription:
        'Supporting women and children through community-focused awareness and empowerment initiatives.',
      dateLabel: projectSavitri.cardDate,
      yearDisplay: projectSavitri.yearDisplay,
      category: projectSavitri.category,
      location: projectSavitri.cardLocation,
      image: {
        src:
          projectSavitri.cardImage.imagePath ||
          '/assets/activities/samples/project-savitri-distribution.jpg',
        alt: projectSavitri.cardImage.alt,
        caption: 'Project Savitri · Kharidi Village',
        imageType: projectSavitri.cardImage.imageType ?? 'sample',
        objectPosition: projectSavitri.cardImage.objectPosition || 'center 25%',
      },
    });
  }

  return list;
}

export const HOMEPAGE_FEATURED_ACTIVITIES: HomepageFeaturedActivity[] =
  buildFeaturedActivities();

/**
 * Strictly Verified Impact Metrics.
 * Every number corresponds directly to a documented record in `ACTIVITIES` and
 * states its exact activity and reporting period. Unverified aggregate volunteer
 * totals are intentionally omitted until confirmed against the official register.
 */
export const VERIFIED_IMPACT_STATS: VerifiedImpactStat[] = [
  {
    id: 'stat-documented-activities',
    numericValue: ACTIVITIES.length,
    displayValue: String(ACTIVITIES.length),
    label: 'Documented Community Activities',
    periodAndSource: 'Published archive · FY 2018–2019 to FY 2023–2024',
  },
  {
    id: 'stat-mission-bharari-students',
    numericValue: 220,
    displayValue: '220',
    label: 'Rural Students Supported',
    periodAndSource: '10 Zilla Parishad schools · Mission Bharari Phase 1 (Feb 2021)',
  },
  {
    id: 'stat-sandals-children',
    numericValue: 250,
    suffix: '+',
    displayValue: '250+',
    label: 'Pairs of Sandals for Children',
    periodAndSource: 'Schoolchildren in Khardi Village · June 2022',
  },
  {
    id: 'stat-women-girls-hygiene',
    numericValue: 200,
    displayValue: '200',
    label: 'Women & Adolescent Girls Reached',
    periodAndSource: 'Mamnoli menstrual hygiene drive · Feb 2020',
  },
  {
    id: 'stat-project-savitri',
    numericValue: 140,
    suffix: '+',
    displayValue: '140+',
    label: 'Women & Children Supported',
    periodAndSource: 'Project Savitri · Kharidi Village (Aug 2023)',
  },
  {
    id: 'stat-abhivyakta-youth',
    numericValue: 135,
    suffix: '+',
    displayValue: '135+',
    label: 'Youth Stage Participants',
    periodAndSource: '60 elocution & 75+ folk dance students · Abhivyakta (Feb 2024)',
  },
];

/**
 * Stories & Gallery — 6 Curated Visuals distinct from the Hero & Our Activities cards.
 * Uses `ActivityMedia` shape so clicking any photo opens the full-screen LightboxModal.
 */
export const HOMEPAGE_GALLERY_ITEMS: ActivityMedia[] = [
  {
    imagePath: '/assets/activities/samples/gyansetu-study-library.jpg',
    imageType: 'sample',
    objectPosition: 'center 26%',
    alt: 'Students reading curated Marathi and English books in a sunlit community study library',
    caption: 'Gyansetu — Curated books shared across 7 rural study libraries.',
    dateRecorded: '15 Oct 2021',
    locationRecorded: 'Maharashtra · Education Archive',
    visualMotif: 'education',
    placeholderLabel: 'Gyansetu Study Libraries',
  },
  {
    imagePath: '/assets/activities/samples/sandals-for-children-outreach.jpg',
    imageType: 'sample',
    objectPosition: 'center 32%',
    alt: 'Rural schoolchildren walking joyfully together along a village school path in new footwear',
    caption: 'Sandals for Children — Over 250 pairs of sandals distributed in Khardi Village.',
    dateRecorded: '21 Jun 2022',
    locationRecorded: 'Khardi Village · Education Support',
    visualMotif: 'education',
    placeholderLabel: 'Sandals for Children',
  },
  {
    imagePath: '/assets/activities/samples/utsavachi-shidori-packing.jpg',
    imageType: 'sample',
    objectPosition: 'center 28%',
    alt: 'Young volunteers carefully packing home-prepared meal boxes during a community welfare drive',
    caption: 'Utsavachi Shidori — 175 home-prepared meal boxes packed by Thane volunteers.',
    dateRecorded: '1 Jan 2020',
    locationRecorded: 'Thane, Maharashtra · Community Welfare',
    visualMotif: 'welfare',
    placeholderLabel: 'Utsavachi Shidori',
  },
  {
    imagePath: '/assets/activities/samples/mission-bharari-phase-1-assembly.jpg',
    imageType: 'sample',
    objectPosition: 'center 30%',
    alt: 'Volunteers sorting and packing customised stationery and notebook kits for rural schools',
    caption: 'Mission Bharari — Volunteer-led assembly of customised school stationery kits.',
    dateRecorded: '3 Feb 2021',
    locationRecorded: 'Bhor Taluka · Rural School Outreach',
    visualMotif: 'education',
    placeholderLabel: 'Mission Bharari Preparation',
  },
  {
    imagePath: '/assets/activities/samples/blood-donation-drive-2022-camp.jpg',
    imageType: 'sample',
    objectPosition: 'center 25%',
    alt: 'Community members participating in a voluntary blood donation camp supported by youth volunteers',
    caption: 'Blood Donation Drive — 35 voluntary donors in partnership with Kai. Wamanrao Oak Blood Bank.',
    dateRecorded: '20 Feb 2022',
    locationRecorded: 'Thane · Public Health & Youth',
    visualMotif: 'health',
    placeholderLabel: 'Blood Donation Drive 2022',
  },
  {
    imagePath: '/assets/activities/samples/gudhi-shikshanachi-classroom.jpg',
    imageType: 'sample',
    objectPosition: 'center 28%',
    alt: 'Schoolchildren smiling with new stationery and notebooks in a village classroom',
    caption: 'Gudhi Shikshanachi — Spreading the light of education through essential school supplies.',
    dateRecorded: '20 Mar 2019',
    locationRecorded: 'Maharashtra · Education Drive',
    visualMotif: 'education',
    placeholderLabel: 'Gudhi Shikshanachi',
  },
];

/**
 * Verified Individual Testimonials & Public Reviews.
 * Keep strictly empty until verbatim, publicly approved Google Reviews / Trustindex
 * entries with verified reviewer names are added here. Never invent fictional quotes.
 */
export const VERIFIED_TESTIMONIALS: VerifiedTestimonial[] = [];

/**
 * Authentic community acknowledgements drawn directly from Garad Foundation's
 * verified Annual Report archive — displayed transparently whenever individual
 * public testimonials are awaiting direct publication.
 */
export const COMMUNITY_REFLECTION_HIGHLIGHTS: CommunityReflectionHighlight[] = [
  {
    id: 'ref-volunteers',
    group: 'Youth Volunteers & Core Team',
    reflection:
      'From baseline visits across ten rural Zilla Parishad schools to packing meal boxes at Thane intersections, volunteering with Garad turns quiet empathy into disciplined teamwork and personal growth.',
    attribution: 'Garad Foundation Annual Report Archive · Volunteer Reflection',
  },
  {
    id: 'ref-educators',
    group: 'Rural Educators & Local Partners',
    reflection:
      'Every school drive begins by listening to headmasters, teachers, and families—ensuring stationery kits, libraries, and student platforms respond to real classroom needs.',
    attribution: 'Garad Foundation Field Documentation · School Collaboration',
  },
  {
    id: 'ref-supporters',
    group: 'Community Contributors & Donors',
    reflection:
      'Sustained through transparent peer crowdfunding and direct in-kind neighbourhood support, every contribution travels directly from caring citizens to students and families.',
    attribution: 'Garad Foundation Accountability Record · Direct Community Support',
  },
];

export const JOIN_JOURNEY_IMAGE: HomepageImageAsset = {
  src: joinClosingImg,
  alt: 'Garad Foundation youth volunteers and community members smiling together outdoors after a grassroots drive',
  caption: 'Small actions sustained together create lasting community dignity.',
  imageType: 'sample',
  objectPosition: 'center 30%',
};
