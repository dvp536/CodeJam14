import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Base recommended rules
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
    
      // Custom relaxations
      'react/jsx-no-target-blank': 'off', // Allow links with `target="_blank"` without `rel="noopener noreferrer"`
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ], // Warn only for non-constant exports in React Refresh
    
      // Additional lenient settings
      'no-console': 'off', // Allow console logs for debugging
      'no-debugger': 'warn', // Warn for debugger usage, rather than error
      'react/prop-types': 'off', // Disable prop-types validation for React components
      'react/react-in-jsx-scope': 'off', // Disable React in scope requirement (for React 17+)
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.js', '.jsx'] },
      ], // Allow JSX in `.js` files with a warning
      'no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^React$' }, // Ignores unused 'React'
      ], // Warn for unused variables but ignore those prefixed with `_`
      'react/display-name': 'off', // Disable the requirement for display names in React components
      'react/no-unescaped-entities': 'off', // Allow unescaped characters in JSX
      'react/jsx-props-no-spreading': 'off', // Allow props spreading
    
      // Optional: Modify these if needed
      'react/jsx-curly-brace-presence': ['warn', { props: 'ignore', children: 'ignore' }], // Warn for unnecessary curly braces but allow in props and children
    },
  },
]
