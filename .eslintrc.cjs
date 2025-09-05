module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.base.json"],
	},
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	env: { node: true, es2021: true },
	ignorePatterns: ["dist", "*.config.js", "*.config.cjs"],
	rules: {},
};
