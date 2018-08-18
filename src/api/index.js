import Service from '@/utils/request';

const get = (method = 'get') => (url, params = {}) => Service[method](url, { params }).then(res => res.data);
const post = (method = 'post') => (url, params = {}) => Service[method](url, params).then(res => res.data);
const query = (url, params = {}) => Service.get(url, { params });

export default {
	get: get(),
	del: get('delete'),
	head: get('head'),
	post: post(),
	put: post('put'),
	patch: post('patch'),
	query
};
