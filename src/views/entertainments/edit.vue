<template>
	<div class="app-container">
		<el-card>
			<el-form :model="editForm" :rules="editRules" ref="editForm" label-width="60px">
				<el-form-item label="title" prop="title">
					<el-input v-model="editForm.title" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="author" prop="author">
					<el-input v-model="editForm.author" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="desc" prop="description">
					<el-input type="textarea" v-model="editForm.description" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="type" prop="type">
					<el-select v-model="editForm.type" placeholder="选择">
						<el-option v-for="item of types" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="status" prop="status">
					<el-input v-model="editForm.status" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="link" prop="link">
					<el-input v-model="editForm.link" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="date" prop="date">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.date" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="note" prop="note">
					<el-input type="textarea" v-model="editForm.note" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import { validateURL } from '@/utils/validate';
	function editForm () {
		return {
			title: undefined,
			author: undefined,
			description: undefined,
			type: undefined,
			status: undefined,
			date: undefined,
			link: undefined,
			note: undefined,
			tags: undefined,
		};
	}
	export default {
		data () {
			function validLink (rule, value, callback) {
				if (!value) {
					callback();
					// callback(new Error('请输入链接'));
				} else if (!validateURL(value)) {
					callback(new Error('链接格式不对'));
				} else {
					callback();
				}
			}
			return {
				types: ['fiction', 'music', 'article', 'movie', 'novel', 'variety', 'series'],
				editForm: editForm(),
				editRules: {
					title: [
						{ required: true, message: '请输入', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择', trigger: 'change' }
					],
					link: [
						{ message: '请输入链接', trigger: 'blur' },
						{ validator: validLink, trigger: 'blur' }
					],
				},
			};
		},
		methods: {
			getDatas (id) {
				return this.get(`services/entertainments/${id}`).then(res => {
					this.editForm = res;
				});
			},
			submit () {
				this.$refs.editForm.validate(async valid => {
					if (valid) {
						if (this.editForm._id) {
							this.editForm = await this.patch(`services/entertainments/${this.editForm._id}`, this.editForm);
						} else {
							this.editForm = await this.post('services/entertainments', this.editForm);
						}
						this.cancel();
					}
				});
			},
			cancel () {
				this.$router.push({ path: '/entertainments' });
			},
		},
		async created () {
			if (this.$route.params.id) {
				this.getDatas(this.$route.params.id);
			}
		}
	};
</script>
