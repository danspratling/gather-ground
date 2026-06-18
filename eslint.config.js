import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

const restrictCommercelayerImports = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/commerce/commercelayer', '**/commerce/commercelayer/**'],
          message:
            'Import from src/lib/commerce instead. The commercelayer adapter is an implementation detail and must not be referenced directly outside src/lib/commerce.',
        },
      ],
    },
  ],
};

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ['dist/', '.astro/', 'storybook-static/', 'node_modules/'],
  },
  {
    files: ['src/**/*.{ts,tsx,js,mjs,cjs}'],
    ignores: ['src/lib/commerce/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: restrictCommercelayerImports,
  },
  {
    files: ['src/**/*.astro'],
    ignores: ['src/lib/commerce/**'],
    rules: restrictCommercelayerImports,
  },
];
