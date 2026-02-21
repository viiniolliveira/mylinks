import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'MyLinks',
    permissions: ['sidePanel', 'storage', 'tabs'],
    icons: {
      16: 'link.png',
      32: 'link.png',
      48: 'link.png',
      128: 'link.png',
    },
    action: {
      default_icon: {
        16: 'link.png',
        32: 'link.png',
        48: 'link.png',
        128: 'link.png',
      },
    },
    side_panel: {
      default_path: 'sidepanel.html',
    },
  },
});
