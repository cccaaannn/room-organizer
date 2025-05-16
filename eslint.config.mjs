import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import checkFile from "eslint-plugin-check-file";
import _import from "eslint-plugin-import";
import { projectStructurePlugin } from "eslint-plugin-project-structure";
import react from "eslint-plugin-react";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	{ ignores: ["*", "!src"] },
	...fixupConfigRules(
		compat.extends(
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended",
			"plugin:react-hooks/recommended",
			"plugin:react/recommended",
			"plugin:import/recommended",
			"plugin:import/typescript"
		)
	),
	{
		plugins: {
			import: fixupPluginRules(_import),
			react: fixupPluginRules(react),
			unicorn: fixupPluginRules(unicorn),
			"@stylistic": stylistic,
			"check-file": checkFile,
			"project-structure": projectStructurePlugin
		},

		languageOptions: {
			globals: {
				...globals.browser
			},

			parser: tsParser
		},

		settings: {
			"import/resolver": {
				alias: {
					map: [["@", "./src/"]],
					extensions: [".ts", ".js", ".tsx"]
				}
			}
		},

		rules: {
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/array-bracket-spacing": ["error", "never"],
			"@stylistic/arrow-parens": ["error", "as-needed"],
			"@stylistic/arrow-spacing": ["error", { "before": true, "after": true }],
			"@stylistic/block-spacing": ["error", "always"],
			"@stylistic/brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
			"@stylistic/comma-dangle": ["error", "never"],
			"@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
			"@stylistic/function-call-spacing": ["error", "never"],
			"@stylistic/key-spacing": ["error", { "beforeColon": false }],
			"@stylistic/keyword-spacing": ["error", { "before": true }],
			"@stylistic/lines-around-comment": ["error", { "beforeBlockComment": true }],
			"@stylistic/lines-between-class-members": ["error", "always"],
			"@stylistic/space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
			"@stylistic/no-multi-spaces": "error",
			"@stylistic/member-delimiter-style": "error",
			"@stylistic/no-mixed-spaces-and-tabs": "error",
			"@stylistic/object-curly-newline": ["error", {
				"ObjectExpression": { "multiline": true, "minProperties": 10, "consistent": true },
				"ImportDeclaration": { "multiline": true, "minProperties": 10, "consistent": true },
				"ObjectPattern": { "multiline": true, "minProperties": 10, "consistent": true },
				"ExportDeclaration": { "multiline": true, "minProperties": 2, "consistent": true }
			}],

			// Ts
			"@stylistic/no-extra-parens": "off",
			"@stylistic/no-extra-semi": "error",
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/no-multiple-empty-lines": ["error", { "max": 3, "maxBOF": 0, "maxEOF": 1 }],
			"@stylistic/comma-style": ["error", "last"],
			"@stylistic/semi": ["error", "always", { "omitLastInOneLineClassBody": true, "omitLastInOneLineBlock": true }],
			"@stylistic/type-annotation-spacing": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					"args": "all",
					"argsIgnorePattern": "^_",
					"caughtErrors": "all",
					"caughtErrorsIgnorePattern": "^_",
					"destructuredArrayIgnorePattern": "^_",
					"varsIgnorePattern": "^_",
					"ignoreRestSiblings": true
				}
			],

			// React
			// "react/jsx-props-no-multi-spaces": "error",
			"react-refresh/only-export-components": "off",
			"react/react-in-jsx-scope": "off",
			"react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
			"react/jsx-newline": ["error", { prevent: false, allowMultilines: false }],
			"react/jsx-first-prop-new-line": ["error", "multiline"],
			"react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
			"react/jsx-one-expression-per-line": ["error", { allow: "literal" }],
			"react/jsx-closing-bracket-location": ["error", "tag-aligned"],
			"react/jsx-closing-tag-location": ["error", "tag-aligned"],
			"react/jsx-child-element-spacing": "error",
			"react/self-closing-comp": ["error", { component: true, html: true }],
			"react/jsx-curly-newline": ["error", { multiline: "consistent", singleline: "consistent" }],

			// Import
			"import/newline-after-import": ["error", { count: 2 }],
			"import/no-unresolved": ["error", { ignore: ["^@/assets"] }],
			"import/order": ["error", {
				groups: [
					["builtin", "external"],
					["parent", "sibling"],
					["index"],
					["unknown"]
				],
				pathGroups: [
					{ pattern: "react", group: "external", position: "before" },
					{ pattern: "react/**", group: "external", position: "before" }
				],
				named: true,
				pathGroupsExcludedImportTypes: ["builtin"],
				"newlines-between": "always",
				alphabetize: { order: "asc", caseInsensitive: true }
			}]
		}
	}
];