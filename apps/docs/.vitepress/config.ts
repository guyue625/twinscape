import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Twinscape',
  description: 'Framework-agnostic digital twin rendering toolkit',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'Examples', link: '/examples' },
      { text: 'Changelog', link: '/changelog' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Core concepts', link: '/guide/core-concepts' },
          { text: 'Configuration', link: '/guide/configuration' },
        ],
      },
      { text: 'Reference', items: [{ text: 'Core API', link: '/api/core' }] },
      { text: 'Examples', link: '/examples' },
      { text: 'Changelog', link: '/changelog' },
    ],
    socialLinks: [],
    search: { provider: 'local' },
  },
})
