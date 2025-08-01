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
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/hello-world',
        'getting-started/configuration',
      ],
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
        'guides/authentication',
        'guides/validation',
        'guides/testing',
        'guides/deployment',
        'guides/performance',
        'guides/security',
      ],
    },
    
    // API Reference section
    {
      type: 'category',
      label: '🔌 API Reference',
      collapsible: true,
      collapsed: true,
      items: [
        'api/application',
        'api/request',
        'api/response',
        'api/router',
        'api/middleware',
      ],
    },
    
    // Examples section
    {
      type: 'category',
      label: '💡 Examples',
      collapsible: true,
      collapsed: true,
      items: [
        'examples/rest-api',
        'examples/authentication',
        'examples/file-uploads',
        'examples/websockets',
        'examples/real-time-app',
      ],
    },
    
    // Advanced Topics
    {
      type: 'category',
      label: '⚡ Advanced',
      collapsible: true,
      collapsed: true,
      items: [
        'advanced/custom-middleware',
        'advanced/streaming',
        'advanced/compression',
        'advanced/clustering',
        'advanced/plugins',
      ],
    },
    
    // Community & Support
    {
      type: 'category',
      label: '🤝 Community',
      collapsible: true,
      collapsed: true,
      items: [
        'community/contributing',
        'community/code-of-conduct',
        'community/faq',
        'community/showcase',
      ],
    },
    
    // Troubleshooting
    {
      type: 'category',
      label: '🔧 Troubleshooting',
      collapsible: true,
      collapsed: true,
      items: [
        'troubleshooting/common-issues',
        'troubleshooting/debugging',
        'troubleshooting/performance-issues',
        'troubleshooting/security-issues',
      ],
    },
  ],
  
  // API Reference sidebar (for API pages)
  apiSidebar: [
    'api/application',
    'api/request',
    'api/response',
    'api/router',
    'api/middleware',
  ],
};

export default sidebars;
