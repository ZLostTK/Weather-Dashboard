module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true,
    },
    ignorePatterns: ['dist/', 'node_modules/', '*.config.js', '*.config.ts', 'coverage/'],
    extends: ['eslint:recommended', 'plugin:vue/vue3-essential'],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'vue'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off',
        '@typescript-eslint/no-require-imports': 'off',
    },
};
