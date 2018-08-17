<template>
	<div>
		<h1>{{ msg }}</h1>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: 'Welcome...'
		};
	},
	mounted(){
		var instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 20000,
  headers: {'x-app-id': 's001'}
});
		instance.get('http://192.168.15.173:50320/arm-backend/1/users').then(res=>{
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
