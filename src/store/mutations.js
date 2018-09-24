export default {
	SET_ACCOUNT (state, account) {
		state.account = account;
		localStorage.setItem('account', account);
	},
	TOGGLE_SIDEBAR: state => {
		if (state.sidebar.opened) {
			localStorage.setItem('sidebarStatus', 1);
		} else {
			localStorage.setItem('sidebarStatus', '');
		}
		state.sidebar.opened = !state.sidebar.opened;
		state.sidebar.withoutAnimation = false;
	},
	CLOSE_SIDEBAR: (state, withoutAnimation) => {
		localStorage.setItem('sidebarStatus', 1);
		state.sidebar.opened = false;
		state.sidebar.withoutAnimation = withoutAnimation;
	},
	TOGGLE_DEVICE: (state, device) => {
		state.device = device;
	}
};
