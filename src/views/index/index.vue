<template>
	<div class="index">
		<img src="../../assets/logo.png">
		<h1>{{ msg }}</h1>
	</div>
</template>

<script>
export default {
	name: 'Index',
	data () {
		return {
			msg: 'Welcome...'
		};
	},
	mounted () {
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index{
  text-align: center;
}
h1,
h2 {
  font-weight: normal;
}
</style>
