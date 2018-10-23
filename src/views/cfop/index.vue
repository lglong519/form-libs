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

			<!-- content -->
			<el-table :data="tableDatas" row-key="order" :row-class-name="tableRowClassName" v-loading="tableLoading" :default-sort="{prop: 'order', order: 'ascending'}" border>
				<el-table-column prop="order" class="order" label="#" width="55" align="center" sortable>
				</el-table-column>
				<el-table-column prop="number" label="No" width="65" align="center" sortable></el-table-column>
				<el-table-column prop="image" label="ico" width="60" align="center">
					<template slot-scope="scope">
						<img class="ico" :src="scope.row.image" />
					</template>
				</el-table-column>
				<el-table-column prop="formula" label="Formula"></el-table-column>
				<el-table-column prop="formula" label="Reletive">
					<template slot-scope="scope">
						{{scope.row.from}}<=>{{scope.row.to}}
					</template>
				</el-table-column>
				<el-table-column width="70" label="video" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-caret-right" plain circle></i></el-button>
					</template>
				</el-table-column>
				<el-table-column width="60" label="Tag" align="center">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.tags.length" v-for="item of scope.row.tags" :key="item._id" :type="item.type" size="mini">{{item.label}}</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<div class="multi-edit">
					<el-button type="warning" size="small" disabled plain>拖拽排序</el-button>
				</div>
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</div>
		</el-card>
		<!-- edit dialog -->
		<!--
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible">
			<el-form :model="editForm" :rules="editRules" ref="editform">
				<el-form-item label="count" prop="count">
					<el-input v-model.number="editForm.count" placeholder="请输入数量" autofocus="true"></el-input>
				</el-form-item>
				<el-form-item label="参考日期" prop="referenceDate">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.referenceDate" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="实际日期" prop="createdAt">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.createdAt" style="width: 100%;"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
		 -->
	</div>
</template>


<style lang="scss" scoped>
	.el-table .warning-row {
	  background: oldlace;
	}

	.el-table .success-row {
	  background: #f0f9eb;
	}

	.ico {
	  width: 35px;
	}

	.el-table__row {
		&:hover #edit-order-btn{
			display: inline-block;
		}
	}
	#edit-order-btn {
		display: none;
	}
	.multi-edit{
		float: left;
	}
</style>

<script>
	function editForm () {
		return {
			count: null,
			referenceDate: undefined,
			createdAt: undefined,
		};
	}
	export default {
		data () {
			return {
				source: 'f2ls',
				tableDatas: [],
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
					count: [
						{ required: true, message: '请输入数量', trigger: 'blur' },
						{ type: 'number', message: '必须为数字值' }
					],
					referenceDate: [
						{ type: 'date', message: '请选择日期', trigger: 'change' }
					],
					createdAt: [
						{ type: 'date', message: '请选择日期', trigger: 'change' }
					],
				},
				tableLoading: false
			};
		},
		methods: {
			tableRowClassName ({ row, rowIndex }) {
				if (rowIndex === 1) {
					return 'warning-row';
				} else if (rowIndex === 3) {
					return 'success-row';
				}
				return '';
			},
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
					searchVal = `{"number":{"$in":[${this.searchVal}]}}`;
				}
				return this.query(`cfop/${this.source}?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}&sort=order&populate=tags`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.tableDatas = res.data;
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
				this.$refs.editform.validate(async valid => {
					if (valid) {
						if (this.editForm._id) {
							await this.patch(`cfop/${this.source}/${this.editForm._id}`, this.editForm);
						} else {
							await this.post(`cfop/${this.source}`, this.editForm);
						}
						await this.queryDatas();
						this.dialog.visible = false;
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
			search () {
				if (this.searchVal) {
					this.queryDatas();
				} else {
					this.$message({
						message: '请输入内容',
						type: 'error',
					});
				}
			},
		},
		watch: {
			$route () {
				this.source = this.$route.path.split('/').pop();
				this.queryDatas();
			},
			editForm () {
				if (typeof this.editForm.createdAt == 'string') {
					this.editForm.createdAt = new Date(this.editForm.createdAt);
				}
				if (typeof this.editForm.referenceDate == 'string') {
					this.editForm.referenceDate = new Date(this.editForm.referenceDate);
				}
			}
		},
		created () {
			this.source = this.$route.path.split('/').pop();
			this.queryDatas();
		},
	};
</script>
