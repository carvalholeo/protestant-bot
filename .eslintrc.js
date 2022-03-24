module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security-node/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'security-node',
    '@typescript-eslint',
    'sonarjs',
    'promise',
    'import'
  ],
  'rules': {
    'max-len': ['error', {
      'code': 120,
      'ignoreComments': true,
      'ignoreTrailingComments': true,
      'ignoreUrls': true,
      'ignoreTemplateLiterals': true,
    }],
  },
};
