<template>
	<div class="app-container">
		<el-card>
			<el-form :model="editForm" :rules="editRules" ref="editform" label-width="80px">
				<el-form-item>
					<img v-if="editForm.image" :src="editForm.image" class="avatar">
				</el-form-item>
				<el-form-item label="头像" prop="image">
					<el-input v-model="editForm.image" placeholder="请选择头像"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username" placeholder="请输入帐号"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="editForm.phone" placeholder="请输入电话"></el-input>
				</el-form-item>
				<el-form-item label="登录次数">
					<el-input v-model="editForm.inc" disabled></el-input>
				</el-form-item>
				<el-form-item label="客户端">
					<el-input v-model="editForm.client" disabled></el-input>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-input :value="editForm.createdAt|dateTime" disabled></el-input>
				</el-form-item>
				<el-form-item label="最近修改">
					<el-input :value="editForm.updatedAt|dateTime" disabled></el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end" class="dialog-footer">
				<el-button type="primary" @click="submit">确 定</el-button>
			</el-row>
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
	.avatar{
		height: 100px;
	}
</style>


<script>
	import { mapGetters } from 'vuex';
	function editForm () {
		return {
			username: null,
			email: null,
			phone: null,
			client: null,
			inc: null,
			image: null,
			createdAt: null,
			updatedAt: null,
		};
	}
	export default {
		computed: {
			...mapGetters(['myProfile']),
		},
		watch: {
			myProfile () {
				this.editForm = JSON.parse(JSON.stringify(this.myProfile));
			}
		},
		data () {
			return {
				source: 'squats',
				searchForm: {
					from: null,
					to: null,
				},
				editForm: editForm(),
				editRules: {
					username: [
						{ required: true, message: '请输入数量', trigger: 'blur' },
					],
					email: [
						{ required: false, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
					],
					phone: [
						{ required: false, message: '请输入电话', trigger: 'blur' },
					],
				},
			};
		},
		methods: {
			submit () {
				this.$refs.editform.validate(async valid => {
					if (valid) {
						await this.patch(`services/users/${this.editForm._id}`, this.editForm);
						this.$store.dispatch('GetProfile');
						this.$message({
							message: '修改成功',
							type: 'success',
							duration: 1500,
						});
					}
				});
			},
		},
		created () {
			this.editForm = JSON.parse(JSON.stringify(this.myProfile));
		}
	};
</script>
