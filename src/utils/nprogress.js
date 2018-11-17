import router from '@/router';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from './auth';

nprogress.inc(0.2);
nprogress.configure({ easing: 'ease', speed: 500, showSpinner: false });

router.beforeEach((to, from, next) => {
	nprogress.start();
	if (!getToken() && to.path != '/login') {
		next({
			path: '/login',
			query: { redirect: to.fullPath }
		});
	} else {
		next();
	}
});

router.afterEach(() => {
	nprogress.done();
});
