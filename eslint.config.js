import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    // version explícita: o detect do eslint-plugin-react 7.37 chama a API
    // context.getFilename() removida no ESLint 10 e quebra.
    settings: { react: { version: '19.2' } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Mantém a paridade com o .eslintrc.cjs antigo: apenas as duas regras
      // clássicas de hooks. O recommended do react-hooks 7 passou a embutir
      // todo o ruleset do React Compiler (purity/immutability/...), que
      // quebraria código de geometria válido — fora do escopo desta migração.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
