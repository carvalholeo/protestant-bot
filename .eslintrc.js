module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'google',
    'plugin:sonarjs/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
  plugins: ['sonarjs'],
};
