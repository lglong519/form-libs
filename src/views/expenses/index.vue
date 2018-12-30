<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="true">
					<el-form-item>
						<el-input placeholder="请输入类型" v-model="searchVal" clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
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

			<el-table :data="expenses" v-loading="tableLoading" border stripe>
				<el-table-column prop="amount" label="金额">
					<template slot-scope="scope">
						{{scope.row.amount|currency}}
					</template>
				</el-table-column>
				<el-table-column prop="type" label="类型"></el-table-column>
				<el-table-column prop="createdAt" label="日期" min-width="100">
					<template slot-scope="scope">
						{{scope.row.createdAt|dateTime}}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="note" label="备注"></el-table-column> -->
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
			<el-form :model="editExpense" :rules="editRules" ref="editExpense" label-width="50px">
				<el-form-item label="金额" prop="amount">
					<el-input v-model.number="editExpense.amount" placeholder="请输入金额" autofocus="true" @keyup.enter.native="submit"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="editExpense.type" placeholder="选择">
						<el-option v-for="item of ['food','general']" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="note">
					<el-input type="textarea" v-model="editExpense.note" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="修改" prop="updatedAt">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editExpense.updatedAt" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="创建" prop="createdAt">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editExpense.createdAt" style="width: 100%;"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	function editExpense () {
		return {
			amount: undefined,
			type: 'food',
		};
	}
	export default {
		data () {
			return {
				expenses: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSizes: [10, 20, 30, 50, 100],
					pageSize: 10,
				},
				searchVal: null,
				editExpense: editExpense(),
				dialog: {
					visible: false,
					title: null
				},
				editRules: {
					amount: [
						{ required: true, message: '请输入金额', trigger: 'blur' },
						{ type: 'number', message: 'amount 必须为数字值' }
					],
					type: [
						{ required: true, message: '请选择类型', trigger: 'change' }
					],
				},
				tableLoading: false
			};
		},
		methods: {
			pageSizeChange (e) {
				this.pagination.pageSize = e;
				this.queryExpenses();
			},
			pageChange (e) {
				this.pagination.currentPage = e;
				this.queryExpenses();
			},
			queryExpenses () {
				let searchVal = '';
				this.tableLoading = true;
				if (this.searchVal) {
					searchVal = `{"type":"${this.searchVal}"}`;
				}
				return this.query(`services/expenses?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.expenses = res.data;
					this.tableLoading = false;
				});
			},
			toggleEdit (data) {
				if (data && data._id) {
					this.editExpense = JSON.parse(JSON.stringify(data));
				} else if (this.editExpense._id) {
					this.editExpense = editExpense();
				}
				if (this.editExpense.amount) {
					this.editExpense.amount = this.editExpense.amount / 100;
				}
				this.dialog.title = this.editExpense._id ? '修改' : '新建';
				this.dialog.visible = true;
			},
			submit () {
				this.$refs.editExpense.validate(async valid => {
					if (valid) {
						this.editExpense.amount = this.editExpense.amount * 100;
						this.dialog.visible = false;
						if (this.editExpense._id) {
							await this.patch(`services/expenses/${this.editExpense._id}`, this.editExpense);
						} else {
							await this.post('services/expenses', this.editExpense);
						}
						await this.queryExpenses();
						this.editExpense = editExpense();
					}
				});
			},
			cancel () {
				this.dialog.visible = false;
				this.editExpense = editExpense();
			},
			refresh () {
				this.queryExpenses();
			},
			remove (data) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await this.del(`services/expenses/${data._id}`);
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
			this.queryExpenses();
		}
	};
</script>
