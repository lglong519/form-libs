<template>
	<div>
		<h1>{{ msg }}</h1>
	</div>
</template>

<script>
import api from '../api';

export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: 'Welcome...'
		};
	},
	mounted () {
		api.get('gallery/0819.json', {
			static: 'name'
		}).then(res => {
			console.log(res);
		});
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
</style>
