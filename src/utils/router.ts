export type AppRoute =
  | { view: 'home' }
  | { view: 'about' }
  | { view: 'garad-universe' }
  | { view: 'archive' }
  | { view: 'activity'; slug: string }
  | { view: 'learning-hub' }
  | { view: 'learning-hub-programme'; slug: string }
  | { view: 'in-the-news' }
  | { view: 'reports' }
  | { view: 'csr' }
  | { view: 'csr-project'; slug: string }
  | { view: 'volunteer' }
  | { view: 'donate' }
  | { view: 'donation-success'; reference: string; token: string };

/**
 * Parses clean History API pathname routes:
 * - / -> Flagship Garad Foundation Homepage
 * - /about -> About Garad Foundation & Vision
 * - /garad-universe -> Interactive Garad Universe (Mission Bharari Village)
 * - /activities -> Complete Financial-Year Activities Archive
 * - /activities/:slug -> Individual Activity detail page
 * - /learning-hub & /learning-hub/:slug -> Garad Learning Hub & Programmes
 * - /in-the-news -> Garad in the News Pressroom
 * - /reports -> Reports & Publications page (Annual Reports + Activity Reports)
 * - /csr-partnerships & /csr-partnerships/:slug -> Corporate CSR Partnership Hub
 * - /volunteer -> Be a Volunteer page
 * - /donate & /donation-success -> Donation & Verified Receipt pages
 */
export function parseCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/' || pathname === '/home') {
    if (window.location.hash === '#mission-bharari-phase-1') {
      return { view: 'activity', slug: 'mission-bharari-phase-1' };
    }
    return { view: 'home' };
  }

  if (pathname === '/about' || pathname === '/about-us') {
    return { view: 'about' };
  }

  if (pathname === '/garad-universe' || pathname === '/universe') {
    return { view: 'garad-universe' };
  }

  if (pathname === '/activities') {
    return { view: 'archive' };
  }

  if (pathname === '/learning-hub') {
    return { view: 'learning-hub' };
  }

  const learningHubMatch = pathname.match(/^\/learning-hub\/([a-z0-9-]+)$/i);
  if (learningHubMatch && learningHubMatch[1]) {
    return {
      view: 'learning-hub-programme',
      slug: learningHubMatch[1].toLowerCase(),
    };
  }

  if (pathname === '/in-the-news' || pathname === '/garad-in-the-news') {
    return { view: 'in-the-news' };
  }

  if (pathname === '/reports') {
    return { view: 'reports' };
  }

  if (pathname === '/csr-partnerships') {
    return { view: 'csr' };
  }

  const csrProjectMatch = pathname.match(/^\/csr-partnerships\/([a-z0-9-]+)$/i);
  if (csrProjectMatch && csrProjectMatch[1]) {
    return { view: 'csr-project', slug: csrProjectMatch[1].toLowerCase() };
  }

  if (pathname === '/volunteer' || pathname === '/be-a-volunteer') {
    return { view: 'volunteer' };
  }

  if (pathname === '/donate') {
    return { view: 'donate' };
  }

  if (pathname === '/donation-success') {
    const params = new URLSearchParams(window.location.search);
    return {
      view: 'donation-success',
      reference: (params.get('ref') || '').trim(),
      token: (params.get('token') || '').trim(),
    };
  }

  const activityMatch = pathname.match(/^\/activities\/([a-z0-9-]+)$/i);
  if (activityMatch && activityMatch[1]) {
    return { view: 'activity', slug: activityMatch[1].toLowerCase() };
  }

  return { view: 'home' };
}

export function getHomePath(): string {
  return '/';
}

export function getAboutPath(): string {
  return '/about';
}

export function getGaradUniversePath(): string {
  return '/garad-universe';
}

export function getArchivePath(): string {
  return '/activities';
}

export function getActivityPath(slug: string): string {
  return `/activities/${slug}`;
}

export function getLearningHubPath(): string {
  return '/learning-hub';
}

export function getLearningProgrammePath(slug: string): string {
  return `/learning-hub/${slug}`;
}

export function getInTheNewsPath(): string {
  return '/in-the-news';
}

export function getReportsPath(): string {
  return '/reports';
}

export function getCsrPartnershipsPath(): string {
  return '/csr-partnerships';
}

export function getCsrProjectPath(slug: string): string {
  return `/csr-partnerships/${slug}`;
}

export function getVolunteerPath(): string {
  return '/volunteer';
}

export function getDonatePath(): string {
  return '/donate';
}

export function getDonationSuccessPath(reference: string, token: string): string {
  const params = new URLSearchParams({ ref: reference, token });
  return `/donation-success?${params.toString()}`;
}

export function pushRoute(path: string): void {
  if (typeof window === 'undefined') return;
  const current = `${window.location.pathname}${window.location.search}`;
  if (current !== path || window.location.hash) {
    window.history.pushState(null, '', path);
  }
}
