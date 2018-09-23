export default {
	SET_ACCOUNT (state, account) {
		state.account = account;
		localStorage.setItem('account', account);
	},
	DEL_ACCOUNT (state) {
		state.account = null;
		localStorage.removeItem('account');
	},
};
