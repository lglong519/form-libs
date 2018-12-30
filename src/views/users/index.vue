<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="true">
					<el-form-item>
						<el-input placeholder="请输入内容" v-model="searchVal" clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="success" icon="el-icon-search" plain @click="search">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-edit" plain @click="toggleEdit">添加</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-tooltip class="hidden-xs-only" effect="light" content="刷新" placement="left-start">
						<el-button icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
					</el-tooltip>
					<el-button class="hidden-sm-and-up" icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
				</div>
			</el-row>

			<el-table :data="users" :row-class-name="tableRowClassName" v-loading="tableLoading">
				<el-table-column prop="image" label="ico" width="60" align="center">
					<template slot-scope="scope">
						<img v-if="scope.row.image" class="ico" :src="scope.row.image" />
					</template>
				</el-table-column>
				<el-table-column prop="username" label="name"></el-table-column>
				<el-table-column prop="email" label="email">
				</el-table-column>
				<el-table-column prop="phone" label="phone">
				</el-table-column>
				<el-table-column prop="inc" label="inc" width="60"></el-table-column>
				<el-table-column prop="client" label="client"></el-table-column>
				<el-table-column width="70" label="action">
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" size="mini" plain @click="toggleEdit(scope.row)"></el-button>
					</template>
				</el-table-column>
				<el-table-column width="60">
					<template slot-scope="scope">
						<el-button type="danger" icon="el-icon-delete" size="mini" plain @click="remove(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</div>
		</el-card>
		<!-- edit dialog -->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible">
			<el-form :model="editForm" :rules="editRules" ref="editForm">
				<el-form-item label="name" prop="username">
					<el-input v-model="editForm.username" placeholder="请输入username"></el-input>
				</el-form-item>
				<el-form-item label="email" prop="email">
					<el-input v-model="editForm.email" placeholder="请输入email"></el-input>
				</el-form-item>
				<el-form-item label="phone" prop="phone">
					<el-input v-model="editForm.phone" placeholder="请输入phone"></el-input>
				</el-form-item>
				<el-form-item label="image" prop="image">
					<el-input v-model="editForm.image" placeholder="请输入image"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
	.ico {
	  width: 35px;
	}
</style>

<script>
	import { validateURL } from '@/utils/validate';
	import * as _ from 'lodash';

	function editForm () {
		return {
			username: undefined,
			email: undefined,
			phone: undefined,
			image: undefined,
		};
	}
	export default {
		data () {
			function validLink (rule, value, callback) {
				if (!value) {
					callback();
				} else if (!validateURL(value)) {
					callback(new Error('链接格式不对'));
				} else {
					callback();
				}
			}
			return {
				users: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSizes: [10, 20, 30, 50, 100],
					pageSize: 10,
				},
				searchVal: null,
				editForm: editForm(),
				dialog: {
					visible: false,
					title: null
				},
				editRules: {
					username: [
						{ required: true, message: '请输入', trigger: 'blur' }
					],
					email: [
						{ message: '请输入', trigger: 'blur' }
					],
					phone: [
						{ message: '请输入', trigger: 'blur' }
					],
					image: [
						{ message: '请输入链接', trigger: 'blur' },
						{ validator: validLink, trigger: 'blur' }
					],
				},
				tableLoading: false
			};
		},
		methods: {
			tableRowClassName ({ row, rowIndex }) {
				if ((rowIndex + 3) % 4 == 0) {
					return 'warning-row';
				}
				if ((rowIndex + 1) % 4 == 0) {
					return 'success-row';
				}
				return '';
			},
			pageSizeChange (e) {
				this.pagination.pageSize = e;
				this.queryPackages();
			},
			pageChange (e) {
				this.pagination.currentPage = e;
				this.queryPackages();
			},
			queryPackages () {
				let searchVal = '';
				this.tableLoading = true;
				if (this.searchVal) {
					searchVal = `{"name":{"$regex":"${this.searchVal}","$options":"$i"}}`;
				}
				return this.query(`services/users?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.users = res.data;
					this.tableLoading = false;
				});
			},
			toggleEdit (data) {
				if (data && data._id) {
					this.editForm = JSON.parse(JSON.stringify(data));
				} else if (this.editForm._id) {
					this.editForm = editForm();
				}
				this.dialog.title = this.editForm._id ? '修改' : '新建';
				this.dialog.visible = true;
			},
			submit () {
				this.$refs.editForm.validate(async valid => {
					if (valid) {
						if (this.editForm._id) {
							await this.patch(`services/users/${this.editForm._id}`, _.pick(this.editForm, ['username', 'email', 'phone', 'image']));
						} else {
							await this.post('services/users', this.editForm);
						}
						await this.queryPackages();
						this.dialog.visible = false;
						this.editForm = editForm();
					}
				});
			},
			cancel () {
				this.dialog.visible = false;
				this.editForm = editForm();
			},
			async refresh () {
				await this.queryPackages();
			},
			remove (data) {
				this.$confirm(`此操作将永久删除:${data.username}, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await this.del(`services/users/${data._id}`);
					this.$notify.success({
						message: '删除成功',
					});
					this.refresh();
				}).catch(action => {
					this.$notify({
						type: action === 'cancel' ? 'info' : 'error',
						message: action === 'cancel' ? '已取消删除' : '删除失败',
					});
				});

			},
			search () {
				if (this.searchVal) {
					this.refresh();
				} else {
					this.$message({
						message: '请输入内容',
						type: 'error',
					});
				}

			}
		},
		async mounted () {
			await this.queryPackages();
		}
	};
</script>
