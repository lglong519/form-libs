module.exports = {
	parserOptions: {
		'ecmaFeatures': {
			'jsx': true
		}
	},
	globals: {
		expect: false,
	},
	extends: [
		'teslint'
	],
	rules: {
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	}
};
