# Garad Foundation — Media Coverage Asset Guide

This folder stores authentic media assets displayed on **`/in-the-news`** (*Garad in the News*).

## Replacing Demo Content with Verified Press Records

Currently, `/in-the-news` renders **9 clearly labelled `DEMO CONTENT` preview entries** from `DEMO_MEDIA_COVERAGE_ITEMS` in `src/data/mediaCoverage.ts`.

As soon as you add one or more verified records (`isDemo: false`) to **`VERIFIED_MEDIA_COVERAGE_ITEMS`** inside `src/data/mediaCoverage.ts`, the entire page automatically switches from demonstration preview mode to your verified Garad Foundation press archive — with zero UI or layout changes required.

## Recommended Folder Structure

```text
public/assets/media/
├── newspapers/   # High-resolution newspaper scans (JPG, PNG, WebP) and archival PDF clippings
├── thumbnails/   # Lightweight preview thumbnails for fast grid loading
└── videos/       # Uploaded MP4 or WebM news clips (optional if using YouTube URLs)
```

## Copy-Paste Record Examples (`VERIFIED_MEDIA_COVERAGE_ITEMS`)

### 1. Verified Newspaper Cutting

```ts
{
  id: 'print-verified-01',
  type: 'newspaper',
  layoutVariant: 'featured', // 'featured' | 'medium' | 'archival'
  headline: 'Exact Published Headline',
  publicationName: 'Exact Newspaper Name',
  publicationDate: '2024-02-21',
  activityDate: '19 February 2024',
  description: 'Brief factual summary of the published newspaper report.',
  thumbnail: '/assets/media/thumbnails/print-verified-01.webp',
  clippingImage: '/assets/media/newspapers/print-verified-01.jpg',
  pdfUrl: '/assets/media/newspapers/print-verified-01.pdf', // Optional
  articleUrl: null,
  videoUrl: null,
  videoEmbedUrl: null,
  relatedActivity: 'abhivyakta-2024', // Optional slug from src/data/activities.ts
  isDemo: false,
  category: 'Youth Development',
  editionNote: 'Thane Edition · Page 4',
}
```

### 2. Verified Digital Article

```ts
{
  id: 'digital-verified-01',
  type: 'digital',
  headline: 'Exact Online Article Headline',
  publicationName: 'Exact Digital Publication Name',
  publicationDate: '2024-02-22',
  description: 'Brief factual summary of the published online feature.',
  thumbnail: '/assets/media/thumbnails/digital-verified-01.webp',
  clippingImage: undefined,
  pdfUrl: null,
  articleUrl: 'https://example-publication.org/verified-article-url',
  videoUrl: null,
  videoEmbedUrl: null,
  relatedActivity: 'abhivyakta-2024',
  isDemo: false,
  category: 'Youth Development',
}
```

### 3. Verified News Video

```ts
{
  id: 'video-verified-01',
  type: 'video',
  layoutVariant: 'featured', // 'featured' | 'medium'
  headline: 'Exact Broadcast or Report Title',
  publicationName: 'Exact News Channel or Publisher',
  publicationDate: '2024-02-20',
  duration: '03:45',
  description: 'Brief factual summary of the broadcast coverage.',
  thumbnail: '/assets/media/thumbnails/video-verified-01.webp',
  clippingImage: undefined,
  pdfUrl: null,
  articleUrl: null,
  videoUrl: null, // Or '/assets/media/videos/clip.mp4'
  videoEmbedUrl: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
  relatedActivity: 'abhivyakta-2024',
  isDemo: false,
  category: 'Youth Development',
}
```
