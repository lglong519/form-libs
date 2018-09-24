import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/login';

Vue.use(Router);

import Layout from '@/views/layout/Layout';

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: Layout,
			redirect: '/index',
			name: 'Index',
			hidden: true,
			children: [{
				path: 'index',
				component: () => import('@/views/index/index')
			}]
		},
		{
			path: '/login',
			name: '登录',
			component: login
		},
		{
			path: '/form',
			component: Layout,
			children: [
				{
					path: 'index',
					name: 'Form',
					component: () => import('@/views/form/index'),
					meta: { title: 'Form', icon: 'form' }
				}
			]
		},
	]
});
