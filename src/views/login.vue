<template>
	<div>
		<el-card class="box-card">
			<div>帐号登录</div>
			<br>
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item prop="login">
					<el-input placeholder="请输入帐号" type="text" v-model="form.login" @keyup.enter.native="signin" clearable :disabled="loading">
						<template slot="prepend">帐号:</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input placeholder="请输入密码" :type="pwd.type" v-model="form.password" @keyup.enter.native="signin" :disabled="loading">
						<i class="fa el-input__icon" style="color:#8CC4FF" :class="pwd.icon" slot="suffix" @click="togglePwd">
						</i>
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
import { setToken, removeToken } from '@/utils/auth';
import { LOCAL_SESSION } from '@/.config';
import { mapGetters } from 'vuex';

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
			redirect: null,
			pwd: {
				view: false,
				icon: 'fa-eye-slash',
				type: 'password'
			}
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
		...mapGetters(['account'])
	},
	mounted () {
		if (this.account) {
			this.form.login = this.account;
			this.rememberMe = true;
		}
		this.$store.dispatch('checkLogin').then(() => {
			if (this.$store.getters.isLogin) {
				this.$confirm(`${this.$store.getters.user} 已登录，是否前往主页？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '重新登录',
					type: 'success',
				}).then(() => {
					this.$router.push({ path: this.redirect || '/' });
				}).catch(action => {
					if (action === 'cancel') {
						this.$message({
							type: 'warning',
							message: '请重新登录'
						});
						removeToken();
					}
				});
			}
		});
	},
	methods: {
		signin () {
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.loading) {
						return;
					}
					this.loading = true;
					this.$store.commit('SET_ACCOUNT', this.rememberMe ? this.form.login : '');
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
						setToken(res[LOCAL_SESSION], res.expireAt);
						this.$store.dispatch('GetProfile');
					}).catch(() => {
						this.loading = false;
					});
				}
			});
		},
		togglePwd () {
			this.pwd.view = !this.pwd.view;
			if (this.pwd.view) {
				this.pwd.icon = 'fa-eye';
				this.pwd.type = 'text';
			} else {
				this.pwd.icon = 'fa-eye-slash';
				this.pwd.type = 'password';
			}
		}
	},
};
</script>
<style lang="scss" scoped>
	.box-card {
	  margin: 100px auto;
	  max-width: 500px;
	}
	@media screen and (max-width: 500px) {
	  .box-card {
	    margin-top: 0;
	    width: 100%;
	  }
	}
</style>

