module.exports = {
	parserOptions: {
		'ecmaFeatures': {
			'jsx': true
		}
	},
	globals: {
		expect: false,
		BMap: false,
		BMAP_NORMAL_MAP: false,
		BMAP_HYBRID_MAP: false,
		BMAP_ANCHOR_TOP_LEFT: false,
	},
	extends: [
		'teslint/typescript'
	],
	rules: {
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	}
};
