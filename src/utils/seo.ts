import { useEffect } from 'react';

interface SeoConfig {
  title: string;
  description: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown>;
}

function upsertMeta(selector: string, attrs: Record<string, string>, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function usePageSeo({
  title,
  description,
  type = 'website',
  structuredData,
}: SeoConfig) {
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description' }, description);
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    upsertMeta(
      'meta[property="og:description"]',
      { property: 'og:description' },
      description
    );
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, type);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta(
      'meta[property="og:site_name"]',
      { property: 'og:site_name' },
      'Garad Foundation'
    );
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: 'twitter:description' },
      description
    );

    upsertCanonical(canonicalUrl);

    const scriptId = 'garad-structured-data';
    let ldScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (structuredData) {
      if (!ldScript) {
        ldScript = document.createElement('script');
        ldScript.id = scriptId;
        ldScript.type = 'application/ld+json';
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(structuredData);
    } else if (ldScript) {
      ldScript.remove();
    }
  }, [title, description, type, structuredData]);
}
