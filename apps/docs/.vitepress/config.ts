import { defineConfig } from 'vitepress'

export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Twinscape',
      description: '与框架无关的数字孪生渲染工具包',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: 'API', link: '/api/core' },
          { text: '配置', link: '/guide/configuration' },
          { text: '示例', link: '/examples' },
          { text: '更新日志', link: '/changelog' },
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '核心概念', link: '/guide/core-concepts' },
              { text: '能力矩阵', link: '/guide/capability-matrix' },
              { text: '配置', link: '/guide/configuration' },
            ],
          },
          { text: '参考', items: [{ text: '核心 API', link: '/api/core' }] },
          { text: '示例', link: '/examples' },
          { text: '更新日志', link: '/changelog' },
        ],
        outline: { label: '本页内容' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新于' },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
        skipToContentLabel: '跳转到正文',
        notFound: {
          title: '页面未找到',
          quote: '你访问的页面不存在或已被移动。',
          linkLabel: '返回首页',
          linkText: '返回首页',
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '关闭搜索',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Twinscape',
      description: 'Framework-agnostic digital twin rendering toolkit',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API', link: '/en/api/core' },
          { text: 'Configuration', link: '/en/guide/configuration' },
          { text: 'Examples', link: '/en/examples' },
          { text: 'Changelog', link: '/en/changelog' },
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting started', link: '/en/guide/getting-started' },
              { text: 'Core concepts', link: '/en/guide/core-concepts' },
              { text: 'Capability matrix', link: '/en/guide/capability-matrix' },
              { text: 'Configuration', link: '/en/guide/configuration' },
            ],
          },
          { text: 'Reference', items: [{ text: 'Core API', link: '/en/api/core' }] },
          { text: 'Examples', link: '/en/examples' },
          { text: 'Changelog', link: '/en/changelog' },
        ],
        socialLinks: [],
        search: { provider: 'local' },
      },
    },
  },
})
