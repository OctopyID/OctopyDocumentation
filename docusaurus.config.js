module.exports = {
  title: 'Octopy Framework',
  tagline: 'A lightweight PHP Framework with Laravel look like',
  url: 'https://framework.octopy.id',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'Octopy ID', // Usually your GitHub org/user name.
  projectName: 'OctopyDocumentation', // Usually your repo name.
  themeConfig: {
    prism: {
      defaultLanguage: 'php',
      theme: require('prism-react-renderer/themes/github'),
    },
    // algolia: {
    //     apiKey: '4ca4b0912376cb10c68ef0fa8ba044df',
    //     indexName: 'octopy-framework',
    //     algoliaOptions: {},
    //     placeholder: 'Search...'
    // },
    navbar: {
      search: true,
      title: 'Octopy Framework',
      logo: {
        alt: 'Octopy Framework Logo',
        src: 'img/octopy.png',
      },
      links: [
        {
          to: 'docs/introduction', 
          label: 'Documentation', 
          position: 'right'
        },
        {
          to: 'blog', 
          label: 'Blog', 
          position: 'right'
        },
        {
          href: 'https://github.com/SupianIDz/OctopyFramework',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      // style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Octopy ID - All Right Reserved.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/SupianIDz/OctopyDocumentation/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Miriam+Libre',
  ],
};
