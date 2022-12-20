module.exports = {
    // ESLint will stop looking in parent folders once it finds a configuration with 'root': true.
    root: true,

    // Use overrides because we can only config which files we want to lint in this section.
    overrides: [{
        // An environment defines global variables that are predefined.
        env: {
            'es2020': true,
            'node': true,
            'jquery': true,
        },

        // Custom typescript parser. The original eslitn parser cannot parse typescript. See https://github.com/typescript-eslint/typescript-eslint
        parser: '@typescript-eslint/parser',

        // Parse only typescript file. (Had some bug if we allow js file when linting in VSCode)
        files: ["**/*.ts", "**/*.tsx"],

        // Note when using a custom parser, the parserOptions configuration property is still required for ESLint to work properly with features not in ECMAScript 5 by default. Parsers are all passed parserOptions and may or may not use them to determine which features to enable.
        parserOptions: {
            'ecmaVersion': 2020,
            'sourceType': 'module',
            'project': './tsconfig.json', // This option allows you to provide a path to your project's tsconfig.json. This setting is required if you want to use rules which require type information.
        },

        plugins: [
            '@typescript-eslint',
        ],

        // Enable some rules by default.
        extends: [
            'eslint:recommended',
        ],

        // Custom rules.
        rules: {
            // Best Practices (eslint)
            'accessor-pairs': 'error',
            'no-console' : 0,
            'curly': [
                'error', 
                'multi-or-nest',
                'consistent'
            ],
            'default-case': 'error',
            'dot-notation': ['error'],
            'eqeqeq': ['error', 'always'],
            'no-caller': 'error',
            'no-else-return': 'error',
            'no-empty-function': 'error',
            'no-eval': 'error',
            'no-extra-bind': 'error',
            'no-implied-eval': 'error',
            'no-iterator': 'error',
            'no-floating-decimal': 'error',
            'no-labels': 'error',
            'no-lone-blocks': 'error',
            'no-multi-spaces': ['error', { ignoreEOLComments: true }],
            'no-new': 'error',
            'no-new-func': 'error',
            'no-new-object': 'error',
            'no-new-require': 'error',
            'no-new-wrappers': 'error',
            'no-octal-escape': 'error',
            'no-proto': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-template-curly-in-string': 'error',
            'no-return-assign': 'error',
            'no-return-await': 'error',
            'no-script-url': 'error',
            'no-useless-call': 'error',
            'radix': 'error',
            'require-await': 'warn',
            'wrap-iife': ['error', 'inside'],
            'yoda': 'error',

            // Vars (eslint)
            'no-unused-vars': ['error', { 'args': 'none' }],
            'no-label-var': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-undef': 'off', // https://typescript-eslint.io/linting/troubleshooting#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors

            // Node.js and CommonJS (eslint)
            'callback-return': 'error',
            'global-require': 'error',
            'handle-callback-err': 'error',
            'no-path-concat': 'error',

            // Stylistic Issues (eslint)
            'array-bracket-newline': ['error', { 'multiline': true }],
            'block-spacing': 'error',
            'brace-style': [
                'error',
                '1tbs',
                { 'allowSingleLine': true }
            ],
            'capitalized-comments': ['error', { 'ignoreConsecutiveComments': true }],
            'comma-dangle': ['error', 'only-multiline'],
            'comma-spacing': [ 'error', { 'before': false, 'after': true }],
            'comma-style': ['error', 'last'],
            'eol-last': ['error', 'always'],
            'func-call-spacing': ['error', 'never'],
            'indent': [
                'error',
                4,
            ],
            'jsx-quotes': ['error', 'prefer-double'],
            'key-spacing': ['error'],
            'keyword-spacing': ['error'],
            'lines-between-class-members': ['error', 'always'],
            'new-parens': 'error',
            'no-array-constructor': 'error',
            'no-lonely-if': 'error',
            'no-mixed-operators': 'error',
            'no-multiple-empty-lines': 'error',
            'no-multi-assign': 'error',
            'no-nested-ternary': 'error',
            'no-plusplus': 'error',
            'no-trailing-spaces': 'error',
            'no-whitespace-before-property': 'error',
            'object-curly-spacing': ['error', 'always'],
            'object-curly-newline': ['error', { 'consistent': true }],
            'padded-blocks': ['error', 'never'],
            'prefer-object-spread': 'error',
            'quote-props': ['error', 'consistent-as-needed'],
            'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
            'semi': [ 'error', 'always'],
            'semi-style': ['error', 'last'],
            'space-before-blocks': 'error',
            'space-before-function-paren': 'error',
            'space-in-parens': ['error', 'never'],
            'space-infix-ops': ['error', { 'int32Hint': false }],
            'space-unary-ops': 'error',
            'spaced-comment': ['error', 'always'],
            'switch-colon-spacing': 'error',
            'template-tag-spacing': 'error',

            // ES6 (eslint)
            'arrow-body-style': ['error', 'as-needed'],
            'arrow-parens': ['error', 'always'],
            'arrow-spacing': 'error',
            'no-confusing-arrow': 'error',
            'no-duplicate-imports': 'error',
            'no-useless-computed-key': 'error',
            'no-useless-rename': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',
            'rest-spread-spacing': ['error', 'never'],
            'template-curly-spacing': 'error',
            'yield-star-spacing': 'error',

            // Typescript (typescript-eslint)
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
            '@typescript-eslint/ban-tslint-comment': 'error',
            '@typescript-eslint/ban-types': 'error',
            '@typescript-eslint/class-literal-property-style': 'warn',
            '@typescript-eslint/consistent-indexed-object-style': 'error',
            '@typescript-eslint/consistent-type-assertions': ['error', { 'assertionStyle': 'as', 'objectLiteralTypeAssertions': 'never' }],
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/member-delimiter-style': ['error', { 'singleline': { 'requireLast': true } }],
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/method-signature-style': ['error', 'method'],
            '@typescript-eslint/no-confusing-non-null-assertion': 'error',
            '@typescript-eslint/no-confusing-void-expression': 'error',
            '@typescript-eslint/no-dynamic-delete': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-extra-non-null-assertion': 'error',
            '@typescript-eslint/no-for-in-array': 'error',
            '@typescript-eslint/no-implicit-any-catch': 'error',
            '@typescript-eslint/no-invalid-void-type': 'error',
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-parameter-properties': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-this-alias': 'error',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-unnecessary-type-constraint': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/prefer-as-const': 'error',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-includes': 'error',
            '@typescript-eslint/prefer-literal-enum-member': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/prefer-regexp-exec': 'error',
            '@typescript-eslint/prefer-string-starts-ends-with': 'error',
            '@typescript-eslint/restrict-plus-operands': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/triple-slash-reference': 'error',
            '@typescript-eslint/type-annotation-spacing': 'error',
            '@typescript-eslint/unbound-method': 'error',

            // Typescript (typescript-eslint) Naming convention
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    'selector': 'default',
                    'format': ['camelCase'],
                    'leadingUnderscore': 'forbid',
                    'trailingUnderscore': 'forbid',
                },
                // Enforce that boolean variables are prefixed with an allowed verb.
                {
                    'selector': ['variable', 'parameter', 'classProperty', 'typeProperty', 'parameterProperty'],
                    'types': ['boolean'],
                    'format': ['PascalCase'], // The prefix is trimmed before format is validated, therefore PascalCase must be used to allow variables such as isEnabled using the prefix is.
                    'prefix': ['is', 'should', 'has', 'can', 'did', 'will'],
                    'leadingUnderscore': 'forbid',
                    'trailingUnderscore': 'forbid',
                },
                // Individual Selectors that need to be PascalCase.
                {
                    'selector': ['function', 'classMethod', 'objectLiteralMethod', 'typeParameter', 'typeMethod', 'accessor', 'enumMember', 'class', 'interface', 'typeAlias', 'enum'],
                    'format': ['PascalCase'],
                    'leadingUnderscore': 'forbid',
                    'trailingUnderscore': 'forbid',
                },
                // Enforce that boolean accessor is prefixed with an allowed verb.
                {
                    'selector': 'accessor',
                    'types': ['boolean'],
                    'format': ['PascalCase'], // The prefix is trimmed before format is validated, therefore PascalCase must be used to allow variables such as isEnabled using the prefix is.
                    'prefix': ['Is', 'Should', 'Has', 'Can', 'Did', 'Will'],
                    'leadingUnderscore': 'forbid',
                    'trailingUnderscore': 'forbid',
                },
            ],
        }
    }],
};