/**
 * INTERNAL CONTENT VERIFICATION NOTES — DO NOT IMPORT INTO PUBLIC UI COMPONENTS.
 *
 * Source: Garad Foundation Activity Report 2020–2026 (Internal Verification Checklist).
 * Maintained strictly for editorial & compliance review before formal CSR or public updates.
 */

export interface InternalVerificationItem {
  activityId: string;
  slug: string;
  title: string;
  verificationPoints: string[];
  doNotPublishReminders: string[];
}

export const INTERNAL_VERIFICATION_CHECKLIST: InternalVerificationItem[] = [
  {
    activityId: 'activity-01',
    slug: 'utsavachi-shidori',
    title: 'Utsavachi Shidori (1 January 2020)',
    verificationPoints: [
      'Narrative text in the report mentions three distribution rounds, whereas the distribution table documents only two rounds (80 + 95 = 175 food boxes). Confirm whether a third round occurred or correct narrative wording.',
    ],
    doNotPublishReminders: [
      'Do not claim a third round on the public website until reconciled.',
    ],
  },
  {
    activityId: 'activity-02',
    slug: 'menstrual-hygiene-awareness',
    title: 'Menstrual Hygiene Awareness & Sanitary Pad Distribution (25 February 2020)',
    verificationPoints: [
      'Health screening and referral counts for anaemia and reproductive health symptoms are not documented in the report; confirm records with Aapla Thane Foundation if needed.',
      'Obtain written participant/guardian consent before uploading any identifiable field photography.',
    ],
    doNotPublishReminders: [
      'Do not publish the unverified minor quotation noted in the internal verification notes.',
      'Do not invent screening or referral numbers.',
    ],
  },
  {
    activityId: 'activity-03',
    slug: 'online-essay-poetry-competition',
    title: 'Online Essay & Poetry Competition (Academic Year 2020–21)',
    verificationPoints: [
      'Confirm exact competition date, official Indian history theme title, and verified list of e-certificate winners from archival records.',
    ],
    doNotPublishReminders: [
      'Do not invent an exact date, theme title, winners, or participant quotations.',
    ],
  },
  {
    activityId: 'activity-04',
    slug: 'online-videography-awareness-contest',
    title: 'Online Videography Awareness Contest (20 March 2020 as recorded)',
    verificationPoints: [
      'Confirm recorded date of 20 March 2020, as it precedes India’s nationwide lockdown announcement.',
    ],
    doNotPublishReminders: [
      'Do not publish unverified viewer counts or social-media reach figures.',
    ],
  },
  {
    activityId: 'activity-05',
    slug: 'mission-bharari-phase-1',
    title: 'Mission Bharari – Phase 1 (3 February 2021)',
    verificationPoints: [
      'Verify the reported 220-student and 10-Zilla Parishad school counts against school-wise distribution lists or headmaster acknowledgements prior to formal CSR reporting.',
      'Confirm written safeguarding clearances before uploading classroom photographs showing identifiable minors.',
    ],
    doNotPublishReminders: [
      'Do not describe reported outputs as independently audited.',
      'Do not invent donor counts, unit cost advantages, or unverified headmaster quotes.',
    ],
  },
  {
    activityId: 'activity-06',
    slug: 'marathi-rajbhasha-divas-spardha',
    title: 'Marathi Rajbhasha Divas Spardha (27 February, year unspecified)',
    verificationPoints: [
      'Confirm the exact competition year and total participant count.',
      'Verify exact spelling of all 8 named awardees against original certificates or result sheets (specifically confirm Chandranshu Chakrakint and Poorva Kekean).',
    ],
    doNotPublishReminders: [
      'Do not guess the year, invent total participant counts, or silently alter awardee spellings.',
    ],
  },
  {
    activityId: 'archive-hero-metrics',
    slug: 'activities',
    title: 'Activities Archive Hero — Passionate Volunteers Metric',
    verificationPoints: [
      'Confirm the Passionate Volunteers figure (currently set to 230 in HERO_STATISTICS_CONFIG.passionateVolunteers) against Garad Foundation’s official volunteer register before final publication.',
    ],
    doNotPublishReminders: [
      'Do not present the temporary volunteer figure as an audited total until verified.',
    ],
  },
];
