import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '박경찬 · Frontend Engineer',
  tagline: '코드로 증명하는 프론트엔드 포트폴리오',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://kyungchan3007.github.io',
  baseUrl: '/-portfolio/',

  organizationName: 'kyungchan3007',
  projectName: '-portfolio',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

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
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '박경찬',
      items: [
        {
          href: 'https://github.com/kyungchan3007',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© ${new Date().getFullYear()} 박경찬`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'bash', 'yaml', 'json'],
    },
    mermaid: {
      theme: { light: 'default', dark: 'dark' },
      options: {
        fontSize: 18,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
