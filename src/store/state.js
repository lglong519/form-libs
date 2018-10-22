import { MODE } from '@/.config';

const state = {
	account: localStorage.getItem('account'),
	sidebar: {
		opened: !!localStorage.getItem('sidebarStatus'),
		withoutAnimation: false
	},
	device: 'desktop',
	myProfile: {},
	leftTime: 0,
	timer: null,
	mode: localStorage.getItem('mode') || MODE
	/*
	tagsView: {
		visitedViews: [],
		cachedViews: [],
	}
	*/
};

export default state;
