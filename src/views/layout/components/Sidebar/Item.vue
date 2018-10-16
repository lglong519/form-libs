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
			let iconClass = `sidebar-icon fa fa-${icon}`;
			vnodes.push(<i class={iconClass}></i>);
		}

		if (title) {
			vnodes.push(<span slot="title">{(title)}</span>);
		}
		return vnodes;
	}
};
</script>
<style lang="scss" scoped>
.sidebar-icon {
  margin-right: 10px;
  color: #fff;
}
.sidebar--collapse .sidebar-icon{
	margin-left:8px;
}
</style>