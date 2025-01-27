const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // 配置未使用变量的检查规则
      '@typescript-eslint/no-unused-vars': [
        'error', // 违反规则时报错
        {
          args: 'all', // 检查所有函数参数
          argsIgnorePattern: '^_', // 忽略以下划线开头的参数，如 _unused
          caughtErrors: 'all', // 检查所有 catch 语句中的错误参数
          caughtErrorsIgnorePattern: '^_', // 忽略 catch 中以下划线开头的错误参数
          destructuredArrayIgnorePattern: '^_', // 忽略解构数组中以下划线开头的变量
          varsIgnorePattern: '^_', // 忽略以下划线开头的变量
          ignoreRestSiblings: true, // 忽略剩余参数中未使用的属性
        },
      ],
    },
  },
];
