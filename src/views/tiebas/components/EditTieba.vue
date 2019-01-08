<template>
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :before-close="cancel">
			<el-form :model="editForm" :rules="editRules" ref="editForm" label-width="50px" :label-position="labelPosition">
				<el-form-item v-if="editForm._id" label="_id" prop="_id">
					<el-input v-model="editForm._id" disabled></el-input>
				</el-form-item>
				<el-form-item v-if="editForm.user" label="user" prop="user">
					<el-input v-model="editForm.user" disabled></el-input>
				</el-form-item>
				<el-form-item v-if="editForm.tiebaAccount" label="acc" prop="tiebaAccount">
					<el-input v-model="editForm.tiebaAccount" disabled></el-input>
				</el-form-item>
				<el-form-item label="吧名" prop="kw">
					<el-input v-model="editForm.kw" autofocus="true"></el-input>
				</el-form-item>
				<el-form-item v-if="editForm.sequence" label="sequence" prop="sequence">
					<el-input v-model.number="editForm.sequence"></el-input>
				</el-form-item>
				<el-form-item label="fid" prop="fid">
					<el-input v-model="editForm.fid"></el-input>
				</el-form-item>
				<el-form-item v-if="editForm.status" label="status" prop="status">
					<el-select v-model="editForm.status" placeholder="选择">
						<el-option v-for="item of ['pending', 'resolve', 'reject']" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="editForm.active===true||editForm.active===false" label="active" prop="active">
					<el-switch v-model="editForm.active" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
				</el-form-item>
				<el-form-item v-if="editForm.void===true||editForm.void===false" label="void" prop="void">
					<el-switch v-model="editForm.void" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		props: {
			currAccount: {},
			tieba: null,
			editTiebaVisible: false,
		},
		data () {
			return {
				editForm: {},
				dialog: {
					visible: false,
					title: null
				},
				editRules: {
					user: [
						{ required: true, message: '请输入', trigger: 'blur' },
					],
					tiebaAccount: [
						{ required: true, message: '请输入', trigger: 'blur' },
					],
					kw: [
						{ required: true, message: '请输入', trigger: 'blur' },
					],
				},
				tableLoading: false,
				searchProp: '',
			};
		},
		computed: {
			...mapGetters(['device']),
			labelPosition () {
				if (this.device == 'mobile') {
					return 'top';
				}
				return 'right';
			},
		},
		watch: {
			editTiebaVisible () {
				this.dialog.visible = this.editTiebaVisible;
				this.init();
			}
		},
		methods: {
			processTieba () {
				if (this.tieba) {
					return {
						...this.tieba
					};
				}
				let { user } = this.$route.params;
				let { _id: tiebaAccount } = this.currAccount || {};
				return {
					kw: undefined,
					user,
					tiebaAccount
				};
			},
			submit () {
				this.$refs.editForm.validate(async valid => {
					if (valid) {
						if (this.editForm._id) {
							await this.patch(`tieba/tiebas/${this.editForm._id}`, this.editForm);
						} else {
							this.editForm.user = this.$route.params.user;
							await this.post('tieba/tiebas', this.editForm);
						}
						this.cancel();
						this.editForm = this.processTieba();
					}
				});
			},
			cancel () {
				this.$emit('toggleEditTieba');
				this.editForm = this.processTieba();
				this.$refs.editForm.clearValidate();
			},
			init () {
				this.editForm = this.processTieba();
				this.dialog.title = this.editForm._id ? '修改' : '添加一个吧';
			},
		},
	};
</script>
