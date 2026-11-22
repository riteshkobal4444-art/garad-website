import type { ActivityMedia, ActivityRecord } from './activities';

export type ActivityImageType = 'sample' | 'original';

export interface ActivitySampleImageSet {
  /** Primary card image displayed on the Activities Archive listing grid. */
  cardImage: string;
  /** Hero banner image displayed at the top of the Activity Detail page. */
  heroImage: string;
  /** Ordered gallery image paths matching each activity's gallery slots. */
  gallery: string[];
  /** Optional CSS object-position value for card crop framing. */
  cardPosition?: string;
  /** Optional CSS object-position value for wide hero banner crop framing. */
  heroPosition?: string;
  /** Optional per-slot CSS object-position values for gallery 4:3 frames. */
  galleryPositions?: string[];
}

/**
 * Central sample-photography registry for the Garad Foundation Activities Archive.
 *
 * IMPORTANT:
 * - Every image listed here is an illustrative sample preview stored locally under
 *   `/public/assets/activities/samples/` and is NOT an original Garad Foundation event photo.
 * - Each of the 15 documented activities is assigned its own distinct primary image.
 * - When an activity record already provides an authentic `imagePath` (non-null),
 *   `applyActivitySampleImages` preserves it untouched and marks it `imageType: 'original'`.
 * - Replacing a sample image later requires only setting `imagePath` (and optionally
 *   `imageType: 'original'`) on the activity record in `src/data/activities.ts`.
 */
export const ACTIVITY_SAMPLE_IMAGES: Record<string, ActivitySampleImageSet> = {
  'utsavachi-shidori': {
    cardImage: '/assets/activities/samples/utsavachi-shidori-outreach.jpg',
    heroImage: '/assets/activities/samples/utsavachi-shidori-outreach.jpg',
    gallery: [
      '/assets/activities/samples/utsavachi-shidori-packing.jpg',
      '/assets/activities/samples/utsavachi-shidori-outreach.jpg',
    ],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 30%', 'center 25%'],
  },
  'menstrual-hygiene-awareness': {
    cardImage: '/assets/activities/samples/menstrual-hygiene-2020-session.jpg',
    heroImage: '/assets/activities/samples/menstrual-hygiene-2020-session.jpg',
    gallery: [
      '/assets/activities/samples/menstrual-hygiene-2020-session.jpg',
      '/assets/activities/samples/menstrual-hygiene-2020-kits.jpg',
    ],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 25%', 'center 30%'],
  },
  'online-essay-poetry-competition': {
    cardImage: '/assets/activities/samples/online-essay-poetry-competition.jpg',
    heroImage: '/assets/activities/samples/online-essay-poetry-competition.jpg',
    gallery: ['/assets/activities/samples/online-essay-poetry-competition.jpg'],
    cardPosition: 'center 28%',
    heroPosition: 'center 30%',
    galleryPositions: ['center 28%'],
  },
  'online-videography-awareness-contest': {
    cardImage: '/assets/activities/samples/online-videography-awareness-contest.jpg',
    heroImage: '/assets/activities/samples/online-videography-awareness-contest.jpg',
    gallery: ['/assets/activities/samples/online-videography-awareness-contest.jpg'],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 25%'],
  },
  'mission-bharari-phase-1': {
    cardImage: '/assets/activities/samples/mission-bharari-phase-1-hero.jpg',
    heroImage: '/assets/activities/samples/mission-bharari-phase-1-hero.jpg',
    gallery: [
      '/assets/activities/samples/mission-bharari-phase-1-assembly.jpg',
      '/assets/activities/samples/mission-bharari-phase-1-handover.jpg',
      '/assets/activities/samples/mission-bharari-phase-1-dispatch.jpg',
    ],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 30%', 'center 25%', 'center 35%'],
  },
  'marathi-rajbhasha-divas-spardha': {
    cardImage: '/assets/activities/samples/marathi-rajbhasha-divas-spardha.jpg',
    heroImage: '/assets/activities/samples/marathi-rajbhasha-divas-spardha.jpg',
    gallery: ['/assets/activities/samples/marathi-rajbhasha-divas-spardha.jpg'],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 25%'],
  },
  'abhivyakta-2024': {
    cardImage: '/assets/activities/samples/abhivyakta-2024-elocution.jpg',
    heroImage: '/assets/activities/samples/abhivyakta-2024-folk-dance.jpg',
    gallery: [
      '/assets/activities/samples/abhivyakta-2024-elocution.jpg',
      '/assets/activities/samples/abhivyakta-2024-folk-dance.jpg',
      '/assets/activities/samples/abhivyakta-2024-awards.jpg',
    ],
    cardPosition: 'center 22%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 22%', 'center 28%', 'center 25%'],
  },
  'gudhi-shikshanachi': {
    cardImage: '/assets/activities/samples/gudhi-shikshanachi-classroom.jpg',
    heroImage: '/assets/activities/samples/gudhi-shikshanachi-classroom.jpg',
    gallery: ['/assets/activities/samples/gudhi-shikshanachi-classroom.jpg'],
    cardPosition: 'center 28%',
    heroPosition: 'center 30%',
    galleryPositions: ['center 28%'],
  },
  'sanitary-pad-distribution': {
    cardImage: '/assets/activities/samples/sanitary-pad-distribution-2019.jpg',
    heroImage: '/assets/activities/samples/sanitary-pad-distribution-2019.jpg',
    gallery: ['/assets/activities/samples/sanitary-pad-distribution-2019.jpg'],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 25%'],
  },
  'chhatrapati-shivaji-maharaj-jayanti-2019': {
    cardImage: '/assets/activities/samples/chhatrapati-shivaji-maharaj-jayanti-2019.jpg',
    heroImage: '/assets/activities/samples/chhatrapati-shivaji-maharaj-jayanti-2019.jpg',
    gallery: ['/assets/activities/samples/chhatrapati-shivaji-maharaj-jayanti-2019.jpg'],
    cardPosition: 'center 28%',
    heroPosition: 'center 30%',
    galleryPositions: ['center 28%'],
  },
  'selfie-with-bappa': {
    cardImage: '/assets/activities/samples/selfie-with-bappa-2019.jpg',
    heroImage: '/assets/activities/samples/selfie-with-bappa-2019.jpg',
    gallery: ['/assets/activities/samples/selfie-with-bappa-2019.jpg'],
    cardPosition: 'center 30%',
    heroPosition: 'center 35%',
    galleryPositions: ['center 30%'],
  },
  gyansetu: {
    cardImage: '/assets/activities/samples/gyansetu-study-library.jpg',
    heroImage: '/assets/activities/samples/gyansetu-study-library.jpg',
    gallery: ['/assets/activities/samples/gyansetu-study-library.jpg'],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 25%'],
  },
  'blood-donation-drive-2022': {
    cardImage: '/assets/activities/samples/blood-donation-drive-2022-camp.jpg',
    heroImage: '/assets/activities/samples/blood-donation-drive-2022-camp.jpg',
    gallery: [
      '/assets/activities/samples/blood-donation-drive-2022-volunteers.jpg',
      '/assets/activities/samples/blood-donation-drive-2022-camp.jpg',
    ],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 25%', 'center 28%'],
  },
  'sandals-for-children': {
    cardImage: '/assets/activities/samples/sandals-for-children-fitting.jpg',
    heroImage: '/assets/activities/samples/sandals-for-children-fitting.jpg',
    gallery: [
      '/assets/activities/samples/sandals-for-children-fitting.jpg',
      '/assets/activities/samples/sandals-for-children-outreach.jpg',
    ],
    cardPosition: 'center 32%',
    heroPosition: 'center 35%',
    galleryPositions: ['center 32%', 'center 35%'],
  },
  'project-savitri': {
    cardImage: '/assets/activities/samples/project-savitri-distribution.jpg',
    heroImage: '/assets/activities/samples/project-savitri-distribution.jpg',
    gallery: [
      '/assets/activities/samples/project-savitri-sorting.jpg',
      '/assets/activities/samples/project-savitri-distribution.jpg',
    ],
    cardPosition: 'center 25%',
    heroPosition: 'center 28%',
    galleryPositions: ['center 28%', 'center 25%'],
  },
};

function resolveActivityMedia(
  media: ActivityMedia,
  samplePath: string | undefined,
  samplePosition?: string
): ActivityMedia {
  // Rule 1: Never overwrite an existing authentic Garad Foundation photograph.
  if (media.imagePath) {
    return {
      ...media,
      imageType: media.imageType ?? 'original',
    };
  }

  // Rule 2: Populate missing image slots with clearly flagged illustrative sample imagery.
  if (samplePath) {
    return {
      ...media,
      imagePath: samplePath,
      imageType: 'sample',
      objectPosition: media.objectPosition ?? samplePosition,
    };
  }

  // Rule 3: Gracefully leave null so ArchivalMediaFrame displays its branded neutral placeholder.
  return media;
}

/**
 * Populates missing (`imagePath: null`) card, hero, and gallery slots on an ActivityRecord
 * using `ACTIVITY_SAMPLE_IMAGES`, while preserving every authentic original image intact.
 */
export function applyActivitySampleImages(activity: ActivityRecord): ActivityRecord {
  const sampleSet = ACTIVITY_SAMPLE_IMAGES[activity.slug];

  return {
    ...activity,
    cardImage: resolveActivityMedia(
      activity.cardImage,
      sampleSet?.cardImage,
      sampleSet?.cardPosition
    ),
    heroImage: resolveActivityMedia(
      activity.heroImage,
      sampleSet?.heroImage,
      sampleSet?.heroPosition
    ),
    gallery: activity.gallery.map((slot, index) =>
      resolveActivityMedia(
        slot,
        sampleSet?.gallery[index] ?? sampleSet?.heroImage,
        sampleSet?.galleryPositions?.[index] ?? sampleSet?.cardPosition
      )
    ),
  };
}
