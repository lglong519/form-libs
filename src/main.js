// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import plugin from './plugin';
import ElementUI from 'element-ui';
import debug from 'debug';
import './utils/nprogress';
import './utils/init';

import 'normalize.css/normalize.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
// import './assets/theme-686F98/index.css';
import 'font-awesome/css/font-awesome.min.css';
import './styles/index.scss';

require('./.config').MODE === 'localhost' && debug.enable('app');

Vue.use(plugin);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
	el: '#formLibs',
	router,
	store,
	components: { App },
	template: '<App/>'
});
