const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./.config'));

if (!config.BAIDU_AK) {
	throw Error('BAIDU_AK is required');
}

class HtmlReplacePlugin {

	apply (compiler) {
		compiler.plugin('compilation', compilation => {
			compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
				let trace = '';
				if (process.env.NODE_ENV == 'production') {
					trace = `<script>!(function(c,b,d,a){c[a]||(c[a]={});c[a].config={pid:"ijur6@9e40eda203b3e1f",imgUrl:"https://arms-retcode.aliyuncs.com/r.png?"};with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d)})(window,document,"https://retcode.alicdn.com/retcode/bl.js","__bl");</script>
					`;
				}
				htmlPluginData.html = htmlPluginData.html
					.replace(this.reg('VUE_APP_TRACE'), trace)
					.replace(this.reg('BAIDU_AK'), config.BAIDU_AK);
				callback(null, htmlPluginData);
			});
		});
	}
	reg (prop) {
		return new RegExp(`\\{\\{\\s*${prop}\\s*\\}\\}`, 'ig');
	}

}

module.exports = HtmlReplacePlugin;
