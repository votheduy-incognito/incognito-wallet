module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'react-native/react-native': true,
    'jest/globals': true
  },
  // extends: ['airbnb', 'react-native',  'eslint:recommended'],
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
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-invalid-this': 0,
    'import/no-commonjs': 0,
    'react/jsx-no-bind': 0,
    'react/prop-types': 1,
    'import/prefer-default-export': 0,
    'no-console': 1,
    'import/no-unresolved': 0,
    'react-native/sort-styles': 0,
    'react/require-default-props': 0,
    'react/forbid-prop-types': 0
  }
};
