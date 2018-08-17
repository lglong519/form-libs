module.exports = {
	globals: {
		expect: false,
	},
	extends: [
		'plugin:vue/essential',
		'teslint'
	],
	'parser': 'vue-eslint-parser',
	plugins: [
		'vue'
	],
	rules: {
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	}
};
