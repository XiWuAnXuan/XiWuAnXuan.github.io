/**
 * Input: @eslint/eslintrc, eslint-plugin-prettier, eslint-config-next
 * Output: eslintConfig (default flat config)
 * Pos: 配置层-ESLint 规则与忽略路径
 *
 * 本注释在文件修改时自动更新
 */

import { FlatCompat } from '@eslint/eslintrc'

import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  prettierConfigRecommended,
  {
    ignores: ['**/node_modules/**', '.next/**', 'dist/**', 'build/**', 'coverage/**', 'out/**'],
  },
]

export default eslintConfig
