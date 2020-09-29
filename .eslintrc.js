module.exports = {
  extends: [
    'standard',
    'prettier'
    // "prettier/standard"
  ],
  plugins: [
    'import',
    // "prettier",
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-var': 1
    // "prettier/prettier": 2,
  }
}
