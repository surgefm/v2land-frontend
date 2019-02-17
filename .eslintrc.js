module.exports = {
  root: true,
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType": "module",
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "v2land",
  ],
  // required to lint *.vue files
  plugins: [
    "vue",
  ],
  // add your custom rules here
  rules: {
    "no-useless-escape": 0,
    "require-jsdoc": 0,
    "vue/return-in-computed-property": 0,
    "vue/require-default-prop": 0,
    "vue/require-prop-types": 0,
    "vue/no-use-v-if-with-v-for": 0,
  },
  globals: {}
}
