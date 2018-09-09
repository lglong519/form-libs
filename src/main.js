// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import plugin from './plugin';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(plugin);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
	el: '#formLibs',
	router,
	components: { App },
	template: '<App/>'
});
