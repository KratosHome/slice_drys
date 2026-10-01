import { defineConfig } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'

export default defineConfig([
  {
    extends: [
      ...nextCoreWebVitals,
      prettierRecommended,
      ...nextTypescript,
    ],
    plugins: {
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'prettier/prettier': [
        'off',
        {
          endOfLine: 'auto',
        },
      ],

      'no-console': [
        'error',
        {
          allow: ['error', 'warn'],
        },
      ],
    },
  },
])
