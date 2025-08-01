// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

// Custom color palette
const primaryColor = '#4f46e5'; // Indigo
const secondaryColor = '#7c3aed'; // Violet
const accentColor = '#10b981'; // Emerald
const darkBackground = '#0f172a'; // Dark blue-gray
const lightBackground = '#f8fafc'; // Light blue-gray

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hasty Server',
  tagline: 'Hasty Server offers a range of features that make it a powerful and flexible web server',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://hasty-server.vercel.app/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'IntegerAlex', // Usually your GitHub org/user name.
  projectName: 'hasty-server', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:

		'https://github.com/IntegerAlex/hasty-server/tree/master/doc'

        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/IntegerAlex/hasty-server.git',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      })
    ]
  ],

  themeConfig: {
    // Custom color mode configuration
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // Animation configuration
    announcementBar: {
      id: 'welcome',
      content: '🚀 Welcome to Hasty Server Docs! Explore and build amazing web servers.',
      backgroundColor: primaryColor,
      textColor: '#ffffff',
      isCloseable: true,
    },
    navbar: {
      title: 'Hasty Server',
      logo: {
        alt: 'Hasty Server Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'getting-started',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api-reference',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/IntegerAlex/hasty-server',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
      style: 'dark',
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/IntegerAlex/hasty-server',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/IntegerAlex/hasty-server',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hasty Server. Built with Docusaurus.`,
    },
    prism: {
      theme: {
        ...prismThemes.github,
        plain: {
          ...prismThemes.github.plain,
          backgroundColor: '#f8fafc',
        },
      },
      darkTheme: {
        ...prismThemes.dracula,
        plain: {
          ...prismThemes.dracula.plain,
          backgroundColor: '#1e293b',
        },
      },
      additionalLanguages: ['http', 'bash', 'json'],
    },
    // Custom docs configuration
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    // Custom CSS variables for theming
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // Custom CSS variables
    customCss: [
      require.resolve('./src/css/custom.css'),
    ],
    // Metadata for social cards
    image: 'img/social-card.png',
      navbar: {
        title: 'Hasty Server',
        // logo: {
        //   alt: 'Hasty Server',
        //   src: 'img/logo.png',
        // },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docSidebar',
            position: 'left',
            label: 'Docs'
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/IntegerAlex/hasty-server.git',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Hasty Server',
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
                label: 'Blog',
                to: '/blog'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Hasty Server.`
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      }
    })
}

export default config
