module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'react-native/react-native': true,
    'jest/globals': true
  },
  extends: ['airbnb', 'plugin:react-native/all', 'eslint:recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    babelOptions: {
      configFile: './babel.config.js'
    }
  },
  plugins: ['react', 'react-native', 'jest'],
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  },
  globals: {
    __DEV__: true
  },
  rules: {
    'no-console': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-invalid-this': 0,
    'import/no-commonjs': 0,
    'react/jsx-no-bind': 0,
    'react/prop-types': 1,
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-unused-prop-types': 'warn',
    'react/jsx-wrap-multilines': 'warn',
    'react/jsx-tag-spacing': 'warn',
    'import/no-cycle': 'warn',
    'react/require-default-props': 'warn',
    'import/prefer-default-export': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'import/no-unresolved': [
      'error',
      {
        ignore: ['@src', '@src/', '@src/.*']
      }
    ]
  }
};
