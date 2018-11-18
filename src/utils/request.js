import axios from 'axios';
import router from '@/router';
import store from '@/store';
import { getToken, expireToken } from '@/utils/auth';
import { SESSION_KEY, REQUST, MODE, SESSION_EXPIRE_TIME } from '@/.config';
import { Message, MessageBox } from 'element-ui';
import _ from 'lodash';
const debug = require('debug')('app:request');
let mode = localStorage.getItem('mode');
mode || (mode = MODE);

// create an axios instance
const service = axios.create({
	baseURL: REQUST[mode].BASE_URL, // api的base_url
	timeout: 300000, // request timeout
	withCredentials: true,
});

// request interceptor
service.interceptors.request.use(
	config => {
		// Do something before request is sent
		if (getToken()) {
			// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
			config.headers[SESSION_KEY] = getToken();
		}

		config.headers['x-requested-with'] = 'XMLHttpRequest';
		config.headers['x-serve'] = 'service';
		return config;
	},
	error => {
		// Do something with request error
		debug(error); // for debug
		Promise.reject(error);
	}
);

// respone interceptor
service.interceptors.response.use(
	response => {
		debug('response', response);
		if (!_.get(response, 'data.accessToken')) {
			expireToken(Date.now() + SESSION_EXPIRE_TIME);
		}
		return response;
	},
	/**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
	// response => {
	//   const res = response.data
	//   if (res.code !== 20000) {
	//     Message({
	//       message: res.message,
	//       type: 'error',
	//       duration: 5 * 1000
	//     })
	//     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
	//     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
	//       // 请自行在引入 MessageBox
	//       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
	//         confirmButtonText: '重新登录',
	//         cancelButtonText: '取消',
	//         type: 'warning'
	//       }).then(() => {
	//         store.dispatch('FedLogOut').then(() => {
	//           location.reload() // 为了重新实例化vue-router对象 避免bug
	//         })
	//       })
	//     }
	//     return Promise.reject('error')
	//   } else {
	//     return response.data
	//   }
	// },
	error => {
		debug(error);
		let duration = 3000;
		let redirect;
		let message;
		if (_.get(error, 'response.status') === 401) {
			store.commit('GET_PROFILE', {});
			message = '未登录';
			duration = 2000;
			redirect = { path: '/login', query: { redirect: router.app.$route.fullPath } };
		}
		Message({
			message: message || _.get(error, 'response.data.message') || error.message,
			type: 'error',
			duration,
			onClose () {
				redirect && router.push(redirect);

			}
		});
		return Promise.reject(error);
	}
);

export default service;
