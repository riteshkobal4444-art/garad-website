# Garad Foundation — Activity Photography Asset Structure

Authentic, safeguarding-cleared photographs for each activity can be added inside per-activity folders here without changing any page layout or component code.

## Folder Convention (by Activity Slug)

```text
public/assets/activities/
├── gudhi-shikshanachi/
├── sanitary-pad-distribution/
├── chhatrapati-shivaji-maharaj-jayanti-2019/
├── selfie-with-bappa/
├── gyansetu/
├── blood-donation-drive-2022/
├── sandals-for-children/
├── project-savitri/
└── abhivyakta-2024/
```

## Illustrative Preview Images

Sample preview imagery used to demonstrate the Activities Archive layout lives in `public/assets/activities/samples/` and is mapped in `src/data/activitySampleImages.ts` with `imageType: 'sample'`.

## How to Attach Real Event Photographs

1. Place verified `.jpg` or `.webp` photographs inside the matching activity folder (for example, `public/assets/activities/gyansetu/hero.jpg`).
2. Update the corresponding `heroImage.imagePath`, `cardImage.imagePath`, or `gallery[n].imagePath` in `src/data/activities.ts` from `null` to `'/assets/activities/<slug>/<filename>.jpg'` (and optionally `imageType: 'original'`).
3. Any non-null `imagePath` in `src/data/activities.ts` is automatically preserved as `imageType: 'original'`, replacing the sample preview and removing the `ILLUSTRATIVE IMAGE` label.
4. Provide descriptive `alt` text for every photograph added.
5. Run `npm run generate:reports` to refresh downloadable PDF reports with the newly added authentic photography.
