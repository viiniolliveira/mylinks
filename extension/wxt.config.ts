import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'MyLinks',
    permissions: ['sidePanel', 'storage', 'tabs'],
    action: {}, // Required for chrome.action.onClicked
    side_panel: {
      default_path: 'sidepanel.html',
    },
  },
});
