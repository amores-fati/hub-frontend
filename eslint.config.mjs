// @ts-check
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import nodePlugin from 'eslint-plugin-node';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        plugins: {
            // @ts-expect-error
            node: nodePlugin,
            perfectionist,
            unicorn,
            '@next/next': nextPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // regras TypeScript
            '@typescript-eslint/no-redeclare': 'off',
            '@typescript-eslint/consistent-type-definitions': ['off', 'type'],
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',

            // outras regras
            'no-console': ['warn'],
            'node/prefer-global/process': 'off',
            'node/no-process-env': 'off',

            // Next.js recommended rules
            ...Object.fromEntries(
                Object.entries(nextPlugin.configs.recommended.rules).map(
                    ([key, value]) => [
                        key,
                        Array.isArray(value) ? value : [value],
                    ],
                ),
            ),

            // filename case
            'unicorn/filename-case': [
                'error',
                {
                    case: 'pascalCase',
                    ignore: [
                        'globals.scss',
                        'client.tsx',
                        'layout.tsx',
                        'README.md',
                        'index.css',
                        'index.scss',
                        'index.ts',
                        'index.tsx',
                        'page.tsx',
                        'queries.ts',
                        'mutations.ts',
                        'query-client.ts',
                        'http-client.ts',
                        'next.config.ts',
                    ],
                },
            ],
        },
    },
    {
        files: ['components/base/**/*', 'Utils.ts'],
        rules: {
            'unicorn/filename-case': 'off',
        },
    },
);
