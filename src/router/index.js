import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/login';
import { REQUST, MODE } from '@/.config';

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
			hidden: true,
			children: [{
				path: 'index',
				name: 'index',
				component: () => import('@/views/index/index'),
				meta: { title: 'Index' }
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
		{
			path: '/packages',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Packages',
					component: () => import('@/views/packages/index'),
					meta: { title: 'Packages', icon: 'codepen' }
				}
			]
		},
		{
			path: '/sports',
			redirect: '/sports/squats',
			name: 'Sports',
			component: Layout,
			meta: {
				title: 'Sports',
				icon: 'futbol-o'
			},
			children: [
				{
					path: '/sports/squats',
					name: 'Squats',
					component: () => import('@/views/sports/index'),
					meta: { title: 'Squats', icon: 'child' }
				},
				{
					path: '/sports/press-ups',
					name: 'PressUps',
					component: () => import('@/views/sports/index'),
					meta: { title: 'PressUps', icon: 'hand-paper-o' }
				}
			]
		},
		{
			path: 'Space',
			component: Layout,
			children: [
				{
					path: REQUST[MODE].YUN_DOMAIN,
					meta: { title: 'Space', icon: 'cloud' }
				}
			]
		},
		{
			path: 'Mongo',
			component: Layout,
			children: [
				{
					path: REQUST[MODE].MONGO_DOMAIN,
					meta: { title: 'Mongo', icon: 'database' }
				}
			]
		},
		{
			path: 'MoFunc.com',
			component: Layout,
			children: [
				{
					path: REQUST[MODE].MAIN_DOMAIN,
					meta: { title: 'MoFunc.com', icon: 'link' }
				}
			]
		},
		{ path: '*', redirect: '/404' }
	]
});
