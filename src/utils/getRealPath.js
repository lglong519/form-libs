export default route => {
	let viewPath = route.path;
	let keys = Object.keys(route.params);
	keys.forEach(key => {
		if (route.params[key]) {
			viewPath = viewPath.replace(route.params[key], `:${key}`);
		} else {
			viewPath += `/:${key}`;
		}
	});
	return viewPath.replace(/\/+$/, '');
};
