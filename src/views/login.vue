<template>
	<div>
		<el-card class="box-card">
			<div>帐号登录</div>
			<br>
			<div>
				<el-input placeholder="请输入帐号" type="text" v-model="login">
					<template slot="prepend">帐号:</template>
				</el-input>
			</div>
			<br>
			<el-row type="flex" justify="space-between">
				<el-input placeholder="请输入密码" type="password" v-model="password">
					<template slot="prepend">密码:</template>
				</el-input>
			</el-row>
			<br>
			<el-row type="flex" justify="space-between">
				<el-checkbox v-model="checked">记住密码</el-checkbox>
				<el-button type="primary" size="medium" :loading="loading" :disabled="loading" @click="signin" plain>{{loading?"登录中...":"登录"}}</el-button>
			</el-row>
		</el-card>
	</div>
</template>
<script>
import { setToken } from '@/utils/auth';
import { LOCAL_SESSION } from '@/.config';

export default {
	data () {
		return {
			login: null,
			password: null,
			checked: false,
			loading: false,
		};
	},
	methods: {
		signin () {
			this.post(
				'services/access-tokens',
				{
					login: this.login,
					password: this.password,
					client: 'web'
				}
			).then(res => {
				// token
				setToken(res[LOCAL_SESSION], res.expireAt);
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.box-card {
  margin: 100px auto;
  max-width: 500px;
}
</style>

