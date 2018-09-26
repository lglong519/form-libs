import Vue from 'vue';
import api from '@/api';
import moment from 'moment';

export default {
	install (Vue, options) {
		Object.entries(api).forEach(item => {
			[, Vue.prototype[item[0]]] = item;
		});
	}
};

Vue.filter('dateTime', (value, format = 'YYYY-MM-DD HH:mm:SS') => {
	return moment(value).format(format);
});
