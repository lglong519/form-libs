import api from '@/api';

export default {
	install (Vue, options) {
		Object.entries(api).forEach(item => {
			[, Vue.prototype[item[0]]] = item;
		});
	}
};
