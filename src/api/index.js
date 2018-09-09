import Service from '@/utils/request';

const get = (method = 'get') => (url, params = {}, config = {}) => Service[method](url, { params, ...config }).then(res => res.data);
const post = (method = 'post') => (url, params = {}, config = {}) => Service[method](url, params, config).then(res => res.data);
const query = (url, params = {}, config = {}) => Service.get(url, { params, ...config });

export default {
	get: get(),
	del: get('delete'),
	head: get('head'),
	post: post(),
	put: post('put'),
	patch: post('patch'),
	query
};
