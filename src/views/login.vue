<template>
	<div>
		<el-card class="box-card">
			<div>帐号登录</div>
			<br>
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item prop="login">
					<el-input placeholder="请输入帐号" type="text" v-model="form.login" @keyup.enter.native="signin">
						<template slot="prepend">帐号:</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input placeholder="请输入密码" type="password" v-model="form.password" @keyup.enter.native="signin">
						<template slot="prepend">密码:</template>
					</el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="space-between">
				<el-checkbox v-model="rememberMe">记住帐号</el-checkbox>
				<el-button type="primary" size="medium" :loading="loading" :disabled="loading" @click="signin" plain>{{loading?"登录中...":"登录"}}</el-button>
			</el-row>
		</el-card>
	</div>
</template>
<script>
import { setToken } from '@/utils/auth';
import { LOCAL_SESSION } from '@/.config';
import { mapState } from 'vuex';

export default {
	data () {
		return {
			form: {
				login: null,
				password: null,
				client: 'web'
			},
			rememberMe: false,
			loading: false,
			rules: {
				login: [
					{ required: true, message: '请输入帐号', trigger: 'blur' },
					{ min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
				],
			},
			redirect: null
		};
	},
	watch: {
		$route: {
			handler (route) {
				this.redirect = route.query && route.query.redirect;
			},
			immediate: true
		}
	},
	computed: {
		...mapState(['account'])
	},
	mounted () {
		if (this.account) {
			this.login = this.account;
			this.rememberMe = true;
		}
	},
	methods: {
		signin () {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.loading = true;
					this.$store.commit('SET_ACCOUNT', this.rememberMe ? this.login : '');
					this.post(
						'services/access-tokens',
						this.form
					).then(res => {
						const self = this;
						this.$message({
							message: '登录成功',
							type: 'success',
							onClose () {
								self.$router.push({ path: self.redirect || '/' });
							}
						});
						this.loading = false;
						setToken(res[LOCAL_SESSION], res.expireAt);
					}).catch(() => {
						this.loading = false;
					});
				}
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
@media screen and (max-width: 500px) {
	.box-card{
		margin-top: 0;
		width: 100%;
	}
}
</style>

