<script>
export default {
	name: 'MenuItem',
	functional: true,
	props: {
		icon: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		}
	},
	render (h, context) {
		const { icon, title } = context.props;
		const vnodes = [];

		if (icon) {
			let iconClass = `fa fa-${icon}`;
			vnodes.push(<i style="margin-right:10px;" class={iconClass}></i>);
		}

		if (title) {
			vnodes.push(<span slot="title">{(title)}</span>);
		}
		return vnodes;
	}
};
</script>
