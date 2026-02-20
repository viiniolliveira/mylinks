export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createUi(ctx);
    ui.mount();
    registerPageMetadataListener();
  },
});

function createUi(ctx: any) {
  return createShadowRootUi(ctx, {
    name: 'mylinks-trigger',
    position: 'inline',
    onMount: (container) => {
      // Create a floating button
      const button = document.createElement('button');
      button.textContent = 'M';
      button.title = 'Open MyLinks Side Panel';
      
      // Style the button
      Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#0f172a', // slate-900
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        cursor: 'pointer',
        zIndex: '999999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '20px',
        fontFamily: 'system-ui, sans-serif',
        transition: 'transform 0.2s',
      });

      button.onmouseover = () => {
        button.style.transform = 'scale(1.1)';
      };
      button.onmouseout = () => {
        button.style.transform = 'scale(1.0)';
      };

      // Add click handler to send message to background
      button.addEventListener('click', () => {
        // We need to send a message to the background script
        // The background script will then open the side panel
        browser.runtime.sendMessage({ action: 'openSidePanel' });
      });

      container.append(button);
    },
  });
}

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
