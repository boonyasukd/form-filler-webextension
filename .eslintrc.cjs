module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-cond-assign': 'off',
    'no-param-reassign': ['error', { 'props': false }],
    'import/prefer-default-export': 'off',
    'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'object-curly-newline': ['error', { consistent: true }],
    'quote-props': ['error', 'consistent'],
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',

    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
