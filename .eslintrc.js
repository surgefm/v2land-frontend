module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "v2land",
  ],
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "no-useless-escape": 0,
    "linebreak-style": 0,
    "global-require": 0
  },
  globals: {}
}
