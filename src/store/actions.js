import api from '@/api';
import router from '@/router';

export default {
	ToggleSideBar: ({ commit }) => {
		commit('TOGGLE_SIDEBAR');
	},
	CloseSideBar ({ commit }, { withoutAnimation }) {
		commit('CLOSE_SIDEBAR', withoutAnimation);
	},
	ToggleDevice ({ commit }, device) {
		commit('TOGGLE_DEVICE', device);
	},
	GetProfile ({ commit }) {
		api.get('services/me').then(result => {
			commit('GET_PROFILE', result);
		});
	},
	LogOut ({ commit }) {
		api.del('services/access-tokens').then(() => {
			commit('GET_PROFILE', {});
			router.push({ path: '/login', query: { redirect: router.app.$route.path } });
		});
	}
};
