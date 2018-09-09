import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/index';
import login from '@/views/login';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'index',
			component: index
		},
		{
			path: '/login',
			name: '登录',
			component: login
		}
	]
});
