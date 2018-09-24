export default {
	account: localStorage.getItem('account'),
	sidebar: {
		opened: !!localStorage.getItem('sidebarStatus'),
		withoutAnimation: false
	},
	device: 'desktop'
};
