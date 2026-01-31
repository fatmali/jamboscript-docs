import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'JamboScript',
  tagline: 'A Swahili-based programming language',
  favicon: 'img/favicon.ico',

  url: 'https://fatmali.github.io',
  baseUrl: '/jamboscript/',

  organizationName: 'fatmali',
  projectName: 'jamboscript-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sw'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      sw: {
        label: 'Kiswahili',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'JamboScript',
      logo: {
        alt: 'JamboScript Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/playground',
          label: 'Playground',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/fatmali/jamboscript',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} JamboScript. Built with ❤️ by <a href="https://github.com/fatmali" target="_blank" rel="noopener noreferrer">Fatma</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  // Webpack config to make jamboscript work in browser
  plugins: [
    function () {
      return {
        name: 'node-polyfills',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                fs: false,
                path: false,
              },
            },
          };
        },
      };
    },
  ],
};

export default config;
