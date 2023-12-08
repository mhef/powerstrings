/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  rules: {
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'prefer-const': 0,
    'object-shorthand': 0,
    'max-len': 0,
    'no-console': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'func-names': 0,
    'no-bitwise': 0,
    'no-continue': 0,
    'prefer-destructuring': 0,
    'vue/multi-word-component-names': 0,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    '@vue/eslint-config-typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
