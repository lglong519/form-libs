import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import state from './state';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

const store = new Vuex.Store({
	state,
	getters,
	mutations,
	actions
});
export default store;
