import { ACTIVITIES, ActivityRecord } from './activities';
import {
  GENERATED_ACTIVITY_REPORTS,
  GENERATED_ANNUAL_REPORTS,
} from './reportsManifest.generated';

export type ReportDocumentCategory =
  | 'Annual Reports'
  | 'Education'
  | 'Women & Community Development'
  | 'Health & Wellbeing'
  | 'Youth Development'
  | 'Other Activities';

export interface AnnualReportDocument {
  id: string;
  kind: 'annual';
  financialYear: string;
  /** Numeric sort key for descending chronological ordering (e.g. 2020 for FY 2020-21) */
  sortOrder: number;
  title: string;
  description: string;
  publicationDate: string;
  fileUrl: string;
  downloadFilename: string;
  fileSizeBytes: number;
  fileSizeLabel: string;
  pageCount: number;
  published: boolean;
  highlights: string[];
}

export interface ActivityReportDocument {
  id: string;
  kind: 'activity';
  activitySlug: string;
  archiveNumber: string;
  title: string;
  shortTitle: string;
  financialYear: string;
  dateLabel: string;
  location: string;
  category: Exclude<ReportDocumentCategory, 'Annual Reports'>;
  sourceCategory: ActivityRecord['category'];
  description: string;
  keyOutputSummary: string;
  fileUrl: string;
  downloadFilename: string;
  fileSizeBytes: number;
  fileSizeLabel: string;
  pageCount: number;
  published: boolean;
}

function mapActivityToReportCategory(
  activity: ActivityRecord
): Exclude<ReportDocumentCategory, 'Annual Reports'> {
  switch (activity.category) {
    case 'Education':
      return 'Education';
    case 'Women & Health Awareness':
    case 'Community Welfare':
      return 'Women & Community Development';
    case 'Public Health & Youth':
      return 'Health & Wellbeing';
    case 'Youth Development':
    case 'Language & Culture':
      return 'Youth Development';
    default:
      return 'Other Activities';
  }
}

const annual2020Meta = GENERATED_ANNUAL_REPORTS['annual-report-2020-21'];

/**
 * Central registry for Garad Foundation Annual Reports.
 * Only reports with `published: true` and an existing verified PDF asset are shown publicly.
 * Future financial-year reports remain unpublished until approved PDFs exist.
 */
const ANNUAL_REPORTS_REGISTRY: AnnualReportDocument[] = [
  {
    id: 'annual-report-2020-21',
    kind: 'annual',
    financialYear: 'FY 2020–21',
    sortOrder: 2020,
    title: 'Annual Report 2020–21',
    description:
      "A consolidated institutional overview of Garad Foundation's six documented activities, community initiatives, governance practices, and verified outputs during Financial Year 2020–21.",
    publicationDate: 'FY 2020–21 Edition',
    fileUrl: annual2020Meta?.fileUrl || '',
    downloadFilename:
      annual2020Meta?.downloadFilename ||
      'Garad-Foundation-Annual-Report-2020-21.pdf',
    fileSizeBytes: annual2020Meta?.fileSizeBytes || 0,
    fileSizeLabel: annual2020Meta?.fileSizeLabel || '',
    pageCount: annual2020Meta?.pageCount || 0,
    published: Boolean(annual2020Meta?.fileUrl && annual2020Meta?.fileSizeBytes > 0),
    highlights: [
      '6 documented activities across Thane, Kalyan, Bhor Taluka (Pune), and online platforms',
      'CSR-oriented reporting separating documented outputs from long-term outcomes',
      'Transparent financial and safeguarding disclosures without estimated figures',
    ],
  },
];

/**
 * Central registry for individual Activity Reports, derived directly from
 * the central `ACTIVITIES` data source (no duplicated activity records).
 */
const ACTIVITY_REPORTS_REGISTRY: ActivityReportDocument[] = ACTIVITIES.map(
  (activity) => {
    const fileMeta = GENERATED_ACTIVITY_REPORTS[activity.slug];
    const hasApprovedPdf = Boolean(
      fileMeta?.fileUrl && fileMeta?.fileSizeBytes > 0
    );

    return {
      id: `report-${activity.slug}`,
      kind: 'activity',
      activitySlug: activity.slug,
      archiveNumber: activity.archiveNumber,
      title: activity.title,
      shortTitle: activity.shortTitle,
      financialYear: `FY ${activity.yearDisplay}`,
      dateLabel: activity.date,
      location: activity.cardLocation,
      category: mapActivityToReportCategory(activity),
      sourceCategory: activity.category,
      description: activity.cardDescription,
      keyOutputSummary: activity.cardKeyStat,
      fileUrl: fileMeta?.fileUrl || '',
      downloadFilename: fileMeta?.downloadFilename || '',
      fileSizeBytes: fileMeta?.fileSizeBytes || 0,
      fileSizeLabel: fileMeta?.fileSizeLabel || '',
      pageCount: fileMeta?.pageCount || 0,
      published: hasApprovedPdf,
    };
  }
);

/** Returns published Annual Reports sorted in descending chronological order. */
export function getPublishedAnnualReports(): AnnualReportDocument[] {
  return ANNUAL_REPORTS_REGISTRY.filter((r) => r.published).sort(
    (a, b) => b.sortOrder - a.sortOrder
  );
}

/** Returns published Individual Activity Reports. */
export function getPublishedActivityReports(): ActivityReportDocument[] {
  return ACTIVITY_REPORTS_REGISTRY.filter((r) => r.published);
}

/** Looks up a published Activity Report by activity slug. Returns undefined if unpublished. */
export function getPublishedActivityReportBySlug(
  slug: string
): ActivityReportDocument | undefined {
  return ACTIVITY_REPORTS_REGISTRY.find(
    (r) => r.activitySlug === slug && r.published
  );
}

/** Returns only activity report categories that currently have at least one published PDF. */
export function getActiveActivityReportCategories(): Exclude<
  ReportDocumentCategory,
  'Annual Reports'
>[] {
  const ordered: Exclude<ReportDocumentCategory, 'Annual Reports'>[] = [
    'Education',
    'Women & Community Development',
    'Health & Wellbeing',
    'Youth Development',
    'Other Activities',
  ];
  const published = getPublishedActivityReports();
  return ordered.filter((cat) => published.some((doc) => doc.category === cat));
}
