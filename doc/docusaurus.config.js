// @ts-check
import { themes as prismThemes } from 'prism-react-renderer'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hasty Server',
  tagline: 'Hasty Server offers a range of features that make it a powerful and flexible web server',
  favicon: 'img/favicon.ico',

  url: 'https://hasty-server.vercel.app/',
  baseUrl: '/',

  organizationName: 'IntegerAlex',
  projectName: 'hasty-server',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/IntegerAlex/hasty-server/tree/master/doc'
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true
          },
          editUrl: 'https://github.com/IntegerAlex/hasty-server.git',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true
      },
      announcementBar: {
        id: 'welcome',
        content: '🚀 Welcome to Hasty Server Docs! Explore and build amazing web servers.',
        backgroundColor: '#4f46e5',
        textColor: '#ffffff',
        isCloseable: true
      },
      navbar: {
        title: 'Hasty Server',
        logo: {
          alt: 'Hasty Server Logo',
          src: 'img/logo.svg'
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs'
          },
          {
            href: 'https://github.com/IntegerAlex/hasty-server',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro'
              }
            ]
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/IntegerAlex/hasty-server.git'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/IntegerAlex/hasty-server'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Hasty Server.`
      },
      prism: {
        theme: {
          ...prismThemes.github,
          plain: {
            ...prismThemes.github.plain,
            backgroundColor: '#f8fafc'
          }
        },
        darkTheme: {
          ...prismThemes.dracula,
          plain: {
            ...prismThemes.dracula.plain,
            backgroundColor: '#1e293b'
          }
        },
        additionalLanguages: ['http', 'bash', 'json']
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true
        }
      },
      image: 'img/social-card.png'
    })
}

export default config
