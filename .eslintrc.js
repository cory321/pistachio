module.exports = {
	root: true,
	extends: [ 'wpcalypso/react', 'plugin:jest/recommended', 'prettier' ],
	parser: '@babel/eslint-parser',
	env: {
		browser: true,
		'jest/globals': true,
		node: true,
	},
	plugins: [ 'jest', 'import', 'prettier' ],
	rules: {
		// REST API objects include underscores
		camelcase: 0,

		'wpcalypso/import-docblock': 0,
		'wpcalypso/jsx-classname-namespace': 0,
		'jest/no-disabled-tests': 0,

		'import/no-extraneous-dependencies': [ 'error', { packageDir: './' } ],
		'prettier/prettier': 'warn',

		'no-shadow': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
