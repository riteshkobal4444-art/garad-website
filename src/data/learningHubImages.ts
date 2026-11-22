export type LearningHubImageType = 'sample' | 'original';

export interface LearningHubImageAsset {
  /** Path to an authentic Garad photograph or a temporary illustrative sample under `/assets/learning-hub/samples/`. */
  src: string;
  /** Distinguishes authentic Garad programme photography ('original') from temporary illustrative previews ('sample'). */
  imageType: LearningHubImageType;
  /** Accessible, descriptive alt text for screen readers and image fallbacks. */
  alt: string;
  /** CSS object-position value to keep faces and key subjects well-framed across responsive crops. */
  objectPosition: string;
  /** Optional caption shown only when verified or explicitly labelled as illustrative context. */
  caption?: string;
}

/**
 * Central maintainable image registry for GARAD LEARNING HUB.
 *
 * To replace any temporary illustrative image with an authentic Garad Foundation photograph:
 * 1. Place the verified photograph inside `public/assets/learning-hub/<filename>.jpg`.
 * 2. Update the corresponding entry below: set `src` to `'/assets/learning-hub/<filename>.jpg'`
 *    and change `imageType` from `'sample'` to `'original'`.
 * No component or layout code needs to be modified.
 */
export const LEARNING_HUB_IMAGES = {
  heroWorkshop: {
    src: '/assets/learning-hub/samples/hero-workshop.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of an Indian facilitator engaging high-school students around a sunlit workshop table with notebooks and activity cards',
    objectPosition: 'center 25%',
  },
  programmeSabseBadaRupaiya: {
    src: '/assets/learning-hub/samples/sabse-bada-rupaiya.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of teenage students in a Maharashtra classroom learning budgeting with a mentor and a clay savings box on the desk',
    objectPosition: 'center 25%',
  },
  programmeShivShala: {
    src: '/assets/learning-hub/samples/shiv-shala.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of young Indian learners seated in a sunlit courtyard learning circle listening attentively to an educator',
    objectPosition: 'center 25%',
  },
  programmeYouthLeadership: {
    src: '/assets/learning-hub/samples/youth-leadership-program.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of a young Indian student speaking confidently beside a flipchart while peers take notes in a leadership workshop',
    objectPosition: 'center 22%',
  },
  programmeSpecialWorkshops: {
    src: '/assets/learning-hub/samples/special-workshops.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of small groups collaborating over hands-on activity cards and notebooks during a customised learning workshop',
    objectPosition: 'center 25%',
  },
  audienceSchoolsColleges: {
    src: '/assets/learning-hub/samples/audience-schools-colleges.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of Indian school and college students raising hands enthusiastically during an interactive facilitator-led session',
    objectPosition: 'center 28%',
  },
  audienceCorporates: {
    src: '/assets/learning-hub/samples/audience-corporates.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of young Indian professionals collaborating in a facilitated roundtable workshop in a bright office room',
    objectPosition: 'center 25%',
  },
  audienceCommunitiesYouth: {
    src: '/assets/learning-hub/samples/audience-communities-youth.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of young adults seated in a sunlit community veranda learning circle participating in a group discussion',
    objectPosition: 'center 30%',
  },
  galleryLearningAction: {
    src: '/assets/learning-hub/samples/gallery-learning-in-action.jpg',
    imageType: 'sample',
    alt: 'Illustrative scene of a workshop facilitator leaning beside teenagers collaborating over handmade charts and activity cards',
    objectPosition: 'center 30%',
  },
} satisfies Record<string, LearningHubImageAsset>;
