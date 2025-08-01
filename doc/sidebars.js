/**
 * Sidebar configuration for Hasty Server documentation
 *
 * This file defines the navigation structure for the documentation site.
 * The sidebar is organized into logical sections for easy navigation.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Main documentation sidebar
  docsSidebar: [
    // Getting Started section
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsible: true,
      collapsed: false,
      items: [
        'getting-started/quick-start'
      ]
    },

    // Guides section
    {
      type: 'category',
      label: '📚 Guides',
      collapsible: true,
      collapsed: true,
      items: [
        'guides/routing',
        'guides/middleware',
        'guides/static-files',
        'guides/error-handling',
        'guides/limitations'
      ]
    },

    // Additional standalone pages
    'index'
  ]
}

export default sidebars
