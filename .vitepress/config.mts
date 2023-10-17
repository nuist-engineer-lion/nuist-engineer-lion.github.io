import { defineConfig } from 'vitepress'
import { getSidebar } from 'vitepress-plugin-auto-sidebar'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nuist Sast Archive",
  description: "Archive Station",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '修机文档', link: '/docs/' },
      { text: '历届部长团', link: '/team/2020' },
    ],
    sidebar:
    {
      "/docs/":[{
        text: "修机日志",
        items: getSidebar({ contentRoot: '/', contentDirs:["docs"],collapsible: false, collapsed: false })
      }],
      "/team/":[{
        text: "历届部长团",
        items: getSidebar({ contentRoot: '/', contentDirs:["team"],collapsible: false, collapsed: false })
      }]
    },
    // getSidebar({ contentRoot: '/', contentDirs:["team","docs"],collapsible: false, collapsed: false }),

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nuist-engineer-lion/nuist-engineer-lion.github.io' }
    ]
  }
})
