import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/login';

Vue.use(Router);

import Layout from '@/views/layout/Layout';

export default new Router({
	mode: 'history',
	routes: [
		{ path: '/404', component: () => import('@/views/404') },
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
			path: '/access',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Access',
					component: () => import('@/views/access/index'),
					meta: { title: 'Access', icon: 'table' }
				}
			]
		},
		{ path: '*', redirect: '/404' }
	]
});
