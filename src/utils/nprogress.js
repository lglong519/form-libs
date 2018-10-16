import router from '@/router';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

nprogress.inc(0.2);
nprogress.configure({ easing: 'ease', speed: 500, showSpinner: false });

router.beforeEach((to, from, next) => {
	nprogress.start();
	next();
});

router.afterEach(() => {
	nprogress.done();
});
