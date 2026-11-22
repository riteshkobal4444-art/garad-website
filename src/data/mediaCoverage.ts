/**
 * Garad Foundation — "Garad in the News" Media Coverage Data Architecture.
 *
 * ARCHITECTURE & INTEGRITY RULE:
 * - Real verified Garad Foundation press records belong in `VERIFIED_MEDIA_COVERAGE_ITEMS`
 *   with `isDemo: false`.
 * - Demonstration preview records live separately in `DEMO_MEDIA_COVERAGE_ITEMS`
 *   with `isDemo: true`.
 * - Every demo entry uses fictional headlines, placeholder publication names,
 *   illustrative imagery, and no links to fabricated news websites.
 * - As soon as real verified records are added to `VERIFIED_MEDIA_COVERAGE_ITEMS`,
 *   `MEDIA_COVERAGE_ITEMS` automatically switches to live verified content without
 *   any UI or layout changes.
 */

import {
  calculateFinancialYear,
  ConcreteFinancialYearId,
  formatFinancialYearLabel,
  getFinancialYearStart,
} from '../utils/financialYear';

import demoStudentsClassroom from '../assets/images/demo_students_classroom_1795373588526.jpg';
import demoVolunteersBooks from '../assets/images/demo_volunteers_books_1795373579028.jpg';
import demoWomenWorkshop from '../assets/images/demo_women_workshop_1795373581983.jpg';
import demoYouthStage from '../assets/images/demo_youth_stage_1795373583257.jpg';
import demoCommunityOutreach from '../assets/images/demo_community_outreach_1795373582028.jpg';

export type MediaType = 'newspaper' | 'digital' | 'video';

export type ClippingLayoutVariant = 'featured' | 'medium' | 'archival';

export interface MediaCoverageItem {
  /** Unique stable identifier */
  id: string;
  /** Media format: print newspaper cutting, online digital article, or news video */
  type: MediaType;
  /** Published headline or broadcast title */
  headline: string;
  /** Publication, newspaper, portal, or broadcast channel name (placeholder for demo items) */
  publicationName: string;
  /**
   * Publication date (ISO "YYYY-MM-DD" recommended for reliable chronological sorting
   * and Indian financial-year derivation). Strictly separate from any underlying activity date.
   */
  publicationDate: string;
  /** Optional formatted display override for the publication date */
  publicationDateDisplay?: string;
  /** Optional date of the underlying community activity, kept separate from publicationDate */
  activityDate?: string;
  /** Concise factual summary or preview description */
  description: string;
  /** Card/video preview thumbnail image URL or imported asset */
  thumbnail?: string;
  /** Full-resolution scanned newspaper clipping image URL (or photo inset for demo print layouts) */
  clippingImage?: string;
  /** Optional archival PDF URL for verified print clippings */
  pdfUrl?: string | null;
  /** Verified external article URL for real Digital Press items (always null for demo items) */
  articleUrl?: string | null;
  /** Direct uploaded MP4/WebM video file URL (always null for demo preview items) */
  videoUrl?: string | null;
  /** Verified YouTube watch/short/embed URL for real News Videos (always null for demo items) */
  videoEmbedUrl?: string | null;
  /** Optional related activity slug (kept null for independent demo preview entries) */
  relatedActivity?: string | null;
  /** Distinguishes demonstration preview content (`true`) from verified published coverage (`false`) */
  isDemo: boolean;

  /** Optional editorial pressroom metadata */
  category?: string;
  language?: string;
  editionNote?: string;
  duration?: string;
  layoutVariant?: ClippingLayoutVariant;
  /** Optional lead deck & column body paragraphs for simulated print clipping layouts */
  clippingLead?: string;
  clippingColumns?: string[];
  photoCaption?: string;
}

export interface MediaOverviewCounts {
  newspapers: number;
  digital: number;
  videos: number;
  total: number;
}

export interface MediaTimelineYearGroup {
  year: number;
  items: MediaCoverageItem[];
}

/**
 * Verified authentic Garad Foundation media coverage records (`isDemo: false`).
 * Add real newspaper clippings, authentic digital article links, and real broadcast
 * videos here to replace the preview dataset automatically.
 */
export const VERIFIED_MEDIA_COVERAGE_ITEMS: MediaCoverageItem[] = [];

/**
 * Realistic demonstration dataset (`isDemo: true`) for previewing the
 * Garad in the News editorial pressroom layout:
 * - 4 Newspaper Cuttings (1 featured, 2 medium, 1 smaller archival)
 * - 2 Digital Articles (preview-only, no fabricated external URLs)
 * - 3 News Videos (1 featured, 2 secondary, visual preview modal without broken player)
 * Total: 9 sample media entries.
 */
export const DEMO_MEDIA_COVERAGE_ITEMS: MediaCoverageItem[] = [
  /* ------------------------------------------------------------------------
     NEWSPAPER CUTTINGS (4)
     ------------------------------------------------------------------------ */
  {
    id: 'demo-clipping-01',
    type: 'newspaper',
    layoutVariant: 'featured',
    headline:
      'Village Classrooms Receive Notebook & Reading Kits Ahead of New School Term',
    publicationName: 'Sample Daily Publication',
    publicationDate: '2024-06-18',
    activityDate: 'Sample Activity Date · 12 June 2024',
    editionNote: 'Sample Regional Desk · Page 4',
    category: 'Rural Education',
    language: 'Sample Print Layout',
    description:
      'Sample featured newspaper cutting illustrating how a major print story on rural school stationery and reading-kit support appears in the pressroom archive.',
    thumbnail: demoStudentsClassroom,
    clippingImage: demoStudentsClassroom,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
    clippingLead:
      'Volunteers coordinate with rural teachers to prepare classroom notebooks, illustrated readers, and stationery sets for primary school learners before the monsoon academic term begins.',
    clippingColumns: [
      'SAMPLE PRESS REPORT — Ahead of the opening weeks of the school year, community volunteers completed a coordinated outreach drive supporting rural primary classrooms with structured learning kits and shared reading books.',
      'Local educators noted that timely access to notebooks and reading material helps younger students settle into daily study routines with greater confidence and steady attendance throughout the term.',
      'Organisers highlighted that neighbourhood contributors and student volunteers helped sort, pack, and verify each bundle before travelling to participating village schools earlier this month.',
    ],
    photoCaption:
      'Illustrative demo photograph — Primary school students reading together in a sunlit classroom.',
  },
  {
    id: 'demo-clipping-02',
    type: 'newspaper',
    layoutVariant: 'medium',
    headline:
      'Youth Volunteers Organise Community Book Drives to Build Rural Reading Corners',
    publicationName: 'Sample District Chronicle',
    publicationDate: '2024-02-26',
    activityDate: 'Sample Activity Date · 18 February 2024',
    editionNote: 'Sample Civic Supplement · Page 2',
    category: 'Youth & Literacy',
    language: 'Sample Print Layout',
    description:
      'Sample medium newspaper cutting previewing local print coverage of a student-led book sorting and rural reading corner initiative.',
    thumbnail: demoVolunteersBooks,
    clippingImage: demoVolunteersBooks,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
    clippingLead:
      'Weekend sorting tables bring together college students and neighbourhood donors to assemble age-appropriate Marathi and English storybooks for village learners.',
    clippingColumns: [
      'SAMPLE PRESS REPORT — Stacks of gently used storybooks, reference notebooks, and pencil sets were catalogued by youth volunteers during a weekend community collection drive.',
      'Coordinators emphasised that well-organised reading corners encourage curiosity beyond standard textbooks and foster peer reading habits across neighbouring settlements.',
    ],
    photoCaption:
      'Illustrative demo photograph — Youth volunteers sorting notebooks and storybooks.',
  },
  {
    id: 'demo-clipping-03',
    type: 'newspaper',
    layoutVariant: 'medium',
    headline:
      'Student Public Speaking & Cultural Gathering Encourages Confident Young Voices',
    publicationName: 'Sample Community Gazette',
    publicationDate: '2023-11-14',
    activityDate: 'Sample Activity Date · 9 November 2023',
    editionNote: 'Sample Youth & Culture · Page 6',
    category: 'Youth Development',
    language: 'Sample Print Layout',
    description:
      'Sample medium newspaper cutting previewing regional print coverage of a student elocution and cultural showcase.',
    thumbnail: demoYouthStage,
    clippingImage: demoYouthStage,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
    clippingLead:
      'Participants from local schools gathered for an afternoon of student speeches, civic storytelling, and regional cultural performances.',
    clippingColumns: [
      'SAMPLE PRESS REPORT — High-school and middle-school participants stepped onto the auditorium stage to share prepared speeches on community leadership, education, and local heritage.',
      'Teachers and visiting mentors remarked that inclusive stage platforms help first-time speakers develop poise, clear articulation, and collaborative spirit.',
    ],
    photoCaption:
      'Illustrative demo photograph — Student speaker addressing an auditorium gathering.',
  },
  {
    id: 'demo-clipping-04',
    type: 'newspaper',
    layoutVariant: 'archival',
    headline:
      'Volunteers Walk Rural Village Lanes to Deliver Seasonal Educational Supplies',
    publicationName: 'Sample Archival Weekly',
    publicationDate: '2023-01-24',
    activityDate: 'Sample Activity Date · 19 January 2023',
    editionNote: 'Sample Brief Archive · Col. 3',
    category: 'Community Welfare',
    language: 'Sample Print Layout',
    description:
      'Sample smaller archival print clipping demonstrating how compact single-column newspaper briefs appear alongside larger features.',
    thumbnail: demoCommunityOutreach,
    clippingImage: demoCommunityOutreach,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
    clippingLead:
      'Small volunteer teams carried packaged stationery and classroom essentials directly to rural learning centres.',
    clippingColumns: [
      'SAMPLE ARCHIVAL BRIEF — Travelling on foot along rural village paths at daybreak, youth volunteers delivered packed cartons of notebooks and classroom learning aids directly to community coordinators.',
    ],
    photoCaption:
      'Illustrative demo photograph — Volunteers carrying educational supply boxes along a village lane.',
  },

  /* ------------------------------------------------------------------------
     DIGITAL NEWS ARTICLES (2) — Preview-only, zero fabricated external links
     ------------------------------------------------------------------------ */
  {
    id: 'demo-digital-01',
    type: 'digital',
    headline:
      'How Weekend Volunteer Book Drives Are Strengthening Rural Reading Habits',
    publicationName: 'Sample Civic Digital Desk',
    publicationDate: '2024-08-09',
    activityDate: 'Sample Activity Date · 3 August 2024',
    category: 'Education',
    language: 'Sample Digital Preview',
    description:
      'An illustrative digital article preview exploring how youth-led book collection tables turn household book donations into structured reading kits for village schools.',
    thumbnail: demoVolunteersBooks,
    clippingImage: undefined,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
  },
  {
    id: 'demo-digital-02',
    type: 'digital',
    headline:
      'Village Courtyards Become Open Spaces for Women’s Health & Community Dialogue',
    publicationName: 'Sample Social Impact Online',
    publicationDate: '2023-09-19',
    activityDate: 'Sample Activity Date · 14 September 2023',
    category: 'Women & Health',
    language: 'Sample Digital Preview',
    description:
      'A demonstration digital feature previewing editorial coverage of peer-led courtyard conversations focused on everyday health awareness and community wellbeing.',
    thumbnail: demoWomenWorkshop,
    clippingImage: undefined,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
  },

  /* ------------------------------------------------------------------------
     NEWS VIDEOS (3) — 1 featured + 2 secondary, preview modal without autoplay
     ------------------------------------------------------------------------ */
  {
    id: 'demo-video-01',
    type: 'video',
    layoutVariant: 'featured',
    headline:
      'Inside a Rural Classroom: Preparing Young Learners for a New Academic Year',
    publicationName: 'Sample Community Broadcast',
    publicationDate: '2024-07-04',
    activityDate: 'Sample Activity Date · 28 June 2024',
    duration: '03:48',
    category: 'Rural Education',
    language: 'Sample Video Preview',
    description:
      'A featured demonstration video preview showing how a documentary report on village school notebooks, reading sessions, and volunteer outreach will screen inside the archive.',
    thumbnail: demoStudentsClassroom,
    clippingImage: undefined,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
  },
  {
    id: 'demo-video-02',
    type: 'video',
    layoutVariant: 'medium',
    headline:
      'Community Voices: Courtyard Conversations Supporting Rural Women’s Awareness',
    publicationName: 'Sample Regional News Channel',
    publicationDate: '2023-10-11',
    activityDate: 'Sample Activity Date · 6 October 2023',
    duration: '02:55',
    category: 'Women & Health',
    language: 'Sample Video Preview',
    description:
      'A demonstration video card illustrating how broadcast reports from grassroots village workshops will appear in the documentary library.',
    thumbnail: demoWomenWorkshop,
    clippingImage: undefined,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
  },
  {
    id: 'demo-video-03',
    type: 'video',
    layoutVariant: 'medium',
    headline:
      'Young Speakers Take the Stage at a District Youth Oratory & Culture Showcase',
    publicationName: 'Sample Youth Media Network',
    publicationDate: '2024-02-22',
    activityDate: 'Sample Activity Date · 19 February 2024',
    duration: '04:12',
    category: 'Youth Development',
    language: 'Sample Video Preview',
    description:
      'A demonstration video card previewing how highlights from student speaking competitions and community cultural gatherings will be curated on screen.',
    thumbnail: demoYouthStage,
    clippingImage: undefined,
    pdfUrl: null,
    articleUrl: null,
    videoUrl: null,
    videoEmbedUrl: null,
    relatedActivity: null,
    isDemo: true,
  },
];

/**
 * Active dataset rendered on `/in-the-news`.
 * Automatically transitions from demonstration entries to verified published records
 * once verified items are added to `VERIFIED_MEDIA_COVERAGE_ITEMS`.
 */
export const MEDIA_COVERAGE_ITEMS: MediaCoverageItem[] =
  VERIFIED_MEDIA_COVERAGE_ITEMS.length > 0
    ? VERIFIED_MEDIA_COVERAGE_ITEMS
    : DEMO_MEDIA_COVERAGE_ITEMS;

export const IS_SHOWING_DEMO_MEDIA_ARCHIVE: boolean =
  VERIFIED_MEDIA_COVERAGE_ITEMS.length === 0;

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const DISPLAY_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Parses a media item's `publicationDate` into a numeric UTC timestamp for sorting.
 */
export function parsePublicationTimestamp(publicationDate: string): number | null {
  const raw = String(publicationDate || '').trim();
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }

  const dmy = raw.match(
    /^(\d{1,2})\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})$/i
  );
  if (dmy) {
    const month = MONTH_MAP[dmy[2].toLowerCase()];
    if (month !== undefined) {
      return Date.UTC(Number(dmy[3]), month, Number(dmy[1]));
    }
  }

  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Extracts the 4-digit publication year strictly from `publicationDate`.
 */
export function getPublicationYear(publicationDate: string): number | null {
  const ts = parsePublicationTimestamp(publicationDate);
  if (ts !== null) {
    return new Date(ts).getUTCFullYear();
  }
  const fallback = String(publicationDate || '').match(/\b(19\d{2}|20\d{2})\b/);
  return fallback ? Number(fallback[1]) : null;
}

/**
 * Derives the Indian Financial Year (April–March) strictly from `publicationDate`.
 */
export function getMediaFinancialYear(
  publicationDate: string
): ConcreteFinancialYearId | null {
  try {
    return calculateFinancialYear(publicationDate);
  } catch {
    return null;
  }
}

/**
 * Returns unique Indian Financial Years present in `items`, sorted newest first,
 * derived strictly from each entry's `publicationDate`.
 */
export function getMediaFinancialYears(
  items: readonly MediaCoverageItem[]
): { id: ConcreteFinancialYearId; label: string }[] {
  const unique = new Set<ConcreteFinancialYearId>();
  for (const item of items) {
    const fy = getMediaFinancialYear(item.publicationDate);
    if (fy) unique.add(fy);
  }
  return Array.from(unique)
    .sort((a, b) => getFinancialYearStart(b) - getFinancialYearStart(a))
    .map((id) => ({ id, label: formatFinancialYearLabel(id) }));
}

/**
 * Formats a media item's publication date for clean editorial display.
 */
export function formatPublicationDate(
  item: Pick<MediaCoverageItem, 'publicationDate' | 'publicationDateDisplay'>
): string {
  if (item.publicationDateDisplay?.trim()) {
    return item.publicationDateDisplay.trim();
  }
  const raw = String(item.publicationDate || '').trim();
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const day = Number(iso[3]);
    const monthName = DISPLAY_MONTHS[Number(iso[2]) - 1];
    if (monthName) {
      return `${day} ${monthName} ${iso[1]}`;
    }
  }
  return raw;
}

/**
 * Derives live overview counts strictly from the provided media coverage array.
 */
export function getMediaOverviewCounts(
  items: readonly MediaCoverageItem[]
): MediaOverviewCounts {
  let newspapers = 0;
  let digital = 0;
  let videos = 0;

  for (const item of items) {
    if (item.type === 'newspaper') newspapers += 1;
    else if (item.type === 'digital') digital += 1;
    else if (item.type === 'video') videos += 1;
  }

  return {
    newspapers,
    digital,
    videos,
    total: items.length,
  };
}

/**
 * Returns unique calendar publication years sorted descending (newest first).
 */
export function getMediaPublicationYears(
  items: readonly MediaCoverageItem[]
): number[] {
  const years = new Set<number>();
  for (const item of items) {
    const year = getPublicationYear(item.publicationDate);
    if (year !== null) years.add(year);
  }
  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Strictly validates that an external article URL uses http:// or https://.
 */
export function isSafeExternalUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || !rawUrl.trim()) return false;
  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Strictly parses a verified YouTube URL into a privacy-enhanced embed URL without autoplay.
 */
export function parseYouTubeEmbedUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || !rawUrl.trim()) return null;

  try {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    let videoId: string | null = null;

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || null;
    } else if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else {
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (
          (parts[0] === 'embed' ||
            parts[0] === 'shorts' ||
            parts[0] === 'live') &&
          parts[1]
        ) {
          videoId = parts[1];
        }
      }
    }

    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  } catch {
    return null;
  }
}

/**
 * Groups media coverage items chronologically by publication year (newest first),
 * sorting entries within each year by `publicationDate` descending.
 */
export function groupMediaByPublicationYear(
  items: readonly MediaCoverageItem[]
): MediaTimelineYearGroup[] {
  const byYear = new Map<number, MediaCoverageItem[]>();

  for (const item of items) {
    const year = getPublicationYear(item.publicationDate);
    if (year === null) continue;
    const list = byYear.get(year) || [];
    list.push(item);
    byYear.set(year, list);
  }

  return Array.from(byYear.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, groupItems]) => ({
      year,
      items: [...groupItems].sort((a, b) => {
        const tsA = parsePublicationTimestamp(a.publicationDate) ?? 0;
        const tsB = parsePublicationTimestamp(b.publicationDate) ?? 0;
        return tsB - tsA;
      }),
    }));
}

export function getMediaTypeLabel(type: MediaType): string {
  switch (type) {
    case 'newspaper':
      return 'Newspaper Cutting';
    case 'digital':
      return 'Digital Article';
    case 'video':
      return 'News Video';
  }
}
