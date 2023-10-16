import { defineConfig } from 'vitepress'
import load from '../docs/loader.data.mjs'

// @ts-ignore allow top level await 
const data = await load.load()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nuist Sast Archive",
  description: "Archive Station",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '修机文档', link: '/docs/' },
      { text: '历届部长团', link: '/previous-team' },
    ],
    sidebar:{
      "/docs/":[{
        text: "修机日志",
        items: data
      }]
    },

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
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
