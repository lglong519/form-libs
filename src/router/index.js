import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '@/views/login';
import { REQUST, MODE } from '@/.config';
let mode = localStorage.getItem('mode');
mode || (mode = MODE);

Vue.use(VueRouter);

// import Layout from '@/views/layout/Layout';
const Layout = resolve => require(['@/views/layout/Layout'], resolve);
// const CFOP = resolve => require(['@/views/cfop/index'], resolve);
const CFOP = () => import('@/views/cfop/index');
const Sort = resolve => require(['@/views/cfop/sort'], resolve);

const router = new VueRouter({
	mode: 'hash', // history
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
				// component: () => import('@/views/index/index'),
				component: resolve => require(['@/views/index/index'], resolve),
				meta: { title: 'Index' }
			}]
		},
		{
			path: '/login',
			name: '登录',
			component: login
		},
		{
			path: '/tiebas',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Tieba',
					component: () => import('@/views/tiebas/index'),
					meta: { title: 'Tieba', icon: 'paw' }
				}
			]
		},
		{
			path: '/access',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Access',
					// component: () => import('@/views/access/index'),
					component: resolve => require(['@/views/access/index'], resolve),
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
					// component: () => import('@/views/packages/index'),
					component: resolve => require(['@/views/packages/index'], resolve),
					meta: { title: 'Packages', icon: 'codepen' }
				}
			]
		},
		{
			path: '/exercise',
			redirect: '/exercise/squats',
			name: 'Exercise',
			component: Layout,
			meta: {
				title: 'Exercise',
				icon: 'futbol-o',
			},
			children: [
				{
					path: '/exercise/squats',
					name: 'Squats',
					// component: () => import('@/views/exercise/index'),
					component: resolve => require(['@/views/exercise/index'], resolve),
					meta: { title: 'Squats', icon: 'child' }
				},
				{
					path: '/exercise/press-ups',
					name: 'PressUps',
					// component: () => import('@/views/exercise/index'),
					component: resolve => require(['@/views/exercise/index'], resolve),
					meta: { title: 'PressUps', icon: 'hand-paper-o' }
				},
				{
					path: '/exercise/waists',
					name: 'Waists',
					component: resolve => require(['@/views/exercise/index'], resolve),
					meta: { title: 'Waists', icon: 'hand-lizard-o' }
				}
			]
		},
		{
			path: '/expenses',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Expenses',
					// component: () => import('@/views/expenses/index'),
					component: resolve => require(['@/views/expenses/index'], resolve),

					meta: { title: 'Expenses', icon: 'yen' }
				}
			]
		},
		{
			path: '/cfop',
			redirect: '/cfop/f2ls',
			name: 'CFOP',
			component: Layout,
			meta: {
				title: 'CFOP',
				icon: 'cube',
			},
			children: [
				{
					path: '/cfop/f2ls',
					name: 'F2L',
					component: CFOP,
					meta: { title: 'F2L', icon: 'plus-square-o' },
				},
				{
					path: '/cfop/olls',
					name: 'OLL',
					component: CFOP,
					meta: { title: 'OLL', icon: 'delicious' }
				},
				{
					path: '/cfop/plls',
					name: 'PLL',
					component: CFOP,
					meta: { title: 'PLL', icon: 'th-large' }
				},
			]
		},
		{
			hidden: true,
			path: '/cfop/f2ls/reorder',
			component: Layout,
			children: [
				{
					path: '',
					component: Sort,
				}
			]
		},
		{
			hidden: true,
			path: '/cfop/olls/reorder',
			component: Layout,
			children: [
				{
					path: '',
					component: Sort,
				}
			]
		},
		{
			hidden: true,
			path: '/cfop/plls/reorder',
			component: Layout,
			children: [
				{
					path: '',
					component: Sort,
				}
			]
		},
		{
			path: '/users',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Users',
					component: resolve => require(['@/views/users/index'], resolve),
					meta: { title: 'Users', icon: 'user-o' }
				}
			]
		},
		{
			path: '/entertainments',
			component: Layout,
			children: [
				{
					path: '',
					name: 'ENT',
					component: resolve => require(['@/views/entertainments/index'], resolve),
					meta: { title: 'ENT', icon: 'ge' }
				},
				{
					hidden: true,
					path: 'edit/:id?',
					name: 'Edit',
					component: resolve => require(['@/views/entertainments/edit'], resolve),
					meta: { title: 'Edit', icon: 'edit' }
				}
			]
		},
		{
			path: '/favorites',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Favor',
					component: () => import('@/views/favorites/index'),
					meta: { title: 'Favor', icon: 'heart-o' }
				}
			]
		},
		{
			path: '/settings',
			component: Layout,
			children: [
				{
					path: '',
					name: 'Settings',
					component: resolve => require(['@/views/settings/index'], resolve),
					meta: { title: 'Settings', icon: 'gear' }
				}
			]
		},
		{
			path: 'Space',
			component: Layout,
			children: [
				{
					path: REQUST[mode].YUN_DOMAIN,
					meta: { title: 'Space', icon: 'upload', type: 'el' }
				}
			]
		},
		{
			path: 'Mongo',
			component: Layout,
			children: [
				{
					path: REQUST[mode].MONGO_DOMAIN,
					meta: { title: 'Mongo', icon: 'database' }
				}
			]
		},
		{
			path: 'MoFunc.com',
			component: Layout,
			children: [
				{
					path: REQUST[mode].MAIN_DOMAIN,
					meta: { title: 'MoFunc.com', icon: 'link' }
				}
			]
		},
		{ path: '*', redirect: '/404' }
	]
});

export default router;

router.onError(error => {
	const pattern = /Loading chunk (\d)+ failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	const targetPath = router.history.pending.fullPath;
	if (isChunkLoadFailed) {
		router.replace(targetPath);
	}
});
