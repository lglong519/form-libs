<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="true">
					<el-form-item>
						<el-input placeholder="请输入" v-model="searchVal" clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
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

			<el-table :data="favorites" v-loading="tableLoading" border stripe>
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" class="table-expand">
							<el-form-item label="title:">
								<span>{{ props.row.title }}</span>
							</el-form-item>
							<el-form-item label="link:">
								<span>{{ props.row.link }}</span>
							</el-form-item>
							<el-form-item label="type:">
								<span>{{ props.row.type }}</span>
							</el-form-item>
							<el-form-item v-if="props.row.status" label="status:">
								<span>{{ props.row.status }}</span>
							</el-form-item>
							<el-form-item v-if="props.row.description" label="description:">
								<span>{{ props.row.description }}</span>
							</el-form-item>
							<el-form-item v-if="props.row.note" label="note:">
								<span>{{ props.row.note }}</span>
							</el-form-item>
							<el-form-item v-if="props.row.tags.length" label="tags:">
								<span>{{ props.row.tags }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column prop="title" label="title" min-width="120">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="light" :content="scope.row.title||scope.row.link" placement="top-start">
							<div class="link-title">{{scope.row.title||scope.row.link}}</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="link" label="link" width="70">
					<template slot-scope="scope">
						<a :href="scope.row.link" target="_blank">
							<el-tooltip class="item" effect="dark" :content="scope.row.link" placement="right-start">
								<el-button type="text">前往</el-button>
							</el-tooltip>
						</a>
					</template>
				</el-table-column>
				<el-table-column prop="type" label="类型" width="70"></el-table-column>
				<el-table-column width="70" label="active">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.active" active-color="#409EFF" inactive-color="#f56c6c"></el-switch>
					</template>
				</el-table-column>
				<el-table-column width="130" label="编辑">
					<template slot-scope="scope">
						<el-button type="warning" icon="el-icon-edit" size="mini" plain @click="toggleEdit(scope.row)"></el-button>
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
			<el-form :model="editForm" :rules="editRules" ref="editForm" label-width="50px">
				<el-form-item label="title" prop="title">
					<el-input v-model="editForm.title" placeholder="请输入" autofocus="true"></el-input>
				</el-form-item>
				<el-form-item label="link" prop="link">
					<el-input v-model="editForm.link" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="editForm.type" placeholder="选择">
						<el-option v-for="item of ['default', 'music', 'article', 'movie', 'fiction', 'novel', 'ev']" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="note">
					<el-input type="textarea" v-model="editForm.note" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="date" prop="date">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.date" style="width: 100%;"></el-date-picker>
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
.link-title {
  padding-right: 10px;
  min-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #6dba45;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
</style>

<script>
	import { validateURL } from '@/utils/validate';
	function editForm () {
		return {
			title: undefined,
			link: undefined,
			note: undefined,
			date: undefined,
			type: 'default',
		};
	}
	function validLink (rule, value, callback) {
		if (!value) {
			callback(new Error('请输入链接'));
		} else if (!validateURL(value)) {
			callback(new Error('链接格式不对'));
		} else {
			callback();
		}
	}
	export default {
		data () {
			return {
				favorites: [],
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
					amount: [
						{ message: '请输入金额', trigger: 'blur' },
					],
					link: [
						{ required: true, message: '请输入链接', trigger: 'blur' },
						{ validator: validLink, trigger: 'blur' }
					],
				},
				tableLoading: false
			};
		},
		methods: {
			pageSizeChange (e) {
				this.pagination.pageSize = e;
				this.queryDatas();
			},
			pageChange (e) {
				this.pagination.currentPage = e;
				this.queryDatas();
			},
			queryDatas () {
				let searchVal = '';
				this.tableLoading = true;
				if (this.searchVal) {
					searchVal = `{"title":{"$regex":"${this.searchVal}","$options":"$i"}}`;
				}
				return this.query(`services/favorites?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.favorites = res.data;
					this.tableLoading = false;
				});
			},
			toggleEdit (data) {
				if (data._id) {
					this.dialog.title = '修改';
					this.editForm = JSON.parse(JSON.stringify(data));
				} else {
					this.dialog.title = '新建';
				}
				this.dialog.visible = true;
			},
			submit () {
				this.$refs.editForm.validate(async valid => {
					if (valid) {
						this.editForm.amount = this.editForm.amount * 100;
						this.dialog.visible = false;
						if (this.editForm._id) {
							await this.patch(`services/favorites/${this.editForm._id}`, this.editForm);
						} else {
							await this.post('services/favorites', this.editForm);
						}
						await this.queryDatas();
						this.editForm = editForm();
					}
				});
			},
			cancel () {
				this.dialog.visible = false;
				this.editForm = editForm();
			},
			refresh () {
				this.queryDatas();
			},
			remove (data) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await this.del(`services/favorites/${data._id}`);
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
		mounted () {
			this.queryDatas();
		}
	};
</script>
