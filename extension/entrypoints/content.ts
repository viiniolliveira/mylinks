export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    registerPageMetadataListener();
  },
});


function registerPageMetadataListener() {
  browser.runtime.onMessage.addListener((message) => {
    if (message?.action !== 'getPageMetadata') return;

    return {
      url: window.location.href,
      title: getPageTitle(),
      description: getPageDescription(),
      faviconUrl: getFaviconUrl(),
    };
  });
}

function getPageTitle() {
  const ogTitle = document
    .querySelector('meta[property="og:title"]')
    ?.getAttribute('content');

  return ogTitle || document.title || '';
}

function getPageDescription() {
  const selectors = [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector)?.getAttribute('content');
    if (content) return content;
  }

  return '';
}

function getFaviconUrl() {
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
  ];

  for (const selector of selectors) {
    const href = document.querySelector(selector)?.getAttribute('href');
    const resolved = resolveUrl(href);
    if (resolved) return resolved;
  }

  return '';
}

function resolveUrl(value?: string | null) {
  if (!value) return '';
  try {
    return new URL(value, window.location.href).toString();
  } catch {
    return value;
  }
}
