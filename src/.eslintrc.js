module.exports = {
    env: {
      es6: true,
      node:true,

    },
    extends: ['airbnb-base', 'prettier'],
    plugins: ['prettier'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
      "prettier/prettier": "error",
      "class-methods-use-this": "off",
      "no-params-reassign": "off",
      "camelcase": "off",
      "no-unused-vars": ["error", {"argsIgnorePattern": "next"}],
      "no-param-reassign": [2, { "props": false }],
      "import/prefer-default-export": "off"
    },
  };
