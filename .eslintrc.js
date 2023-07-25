module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    amd: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'default-param-last': 'off',
    'max-len': ['error', { ignoreUrls: true, code: 140 }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-console': 'off',
    'no-new': 'off',
    'no-extra-semi': 'off',
    'import/no-cycle': 'off',
    'max-classes-per-file': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'typescript-eslint/no-unused-vars': 'off',
    'prefer-destructuring': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    semi: 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
