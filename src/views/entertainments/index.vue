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

			<el-table :data="entertainments" :row-class-name="tableRowClassName" v-loading="tableLoading" border>
				<el-table-column prop="title" label="title" align="center"></el-table-column>
				<el-table-column prop="author" label="author" align="center"></el-table-column>
				<el-table-column prop="type" label="type" width="60" align="center"></el-table-column>
				<el-table-column prop="status" label="status" align="center"></el-table-column>
				<el-table-column prop="note" label="note"></el-table-column>
				<el-table-column width="60" label="Tag" align="center">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.tags.length" v-for="item of scope.row.tags" :key="item._id" :type="item.type" size="mini">{{item.label}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="date" label="date" align="center" min-width="100">
					<template slot-scope="scope">
						{{scope.row.date|dateTime('YYYY-MM-DD')}}
					</template>
				</el-table-column>
				<el-table-column width="50" prop="link" label="link">
					<template slot-scope="scope">
						<a v-if="scope.row.link" :href="scope.row.link" target="_blank">
							<el-tooltip class="item" effect="dark" :content="scope.row.link" placement="right-start">
								<el-button type="text">前往</el-button>
							</el-tooltip>
						</a>
					</template>
				</el-table-column>
				<el-table-column width="65" label="action" align="center">
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" size="mini" plain @click="toggleEdit(scope.row)"></el-button>
					</template>
				</el-table-column>
				<el-table-column width="60" align="center">
					<template slot-scope="scope">
						<el-button type="danger" icon="el-icon-delete" size="mini" plain @click="remove(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</div>
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
	.ico {
	  width: 35px;
	}
</style>

<script>
	export default {
		data () {
			return {
				entertainments: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSizes: [10, 20, 30, 50, 100],
					pageSize: 10,
				},
				searchVal: null,
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
				return this.query(`services/entertainments?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.entertainments = res.data;
					this.tableLoading = false;
				});
			},
			toggleEdit (data) {
				if (data._id) {
					this.$router.push({ path: `/entertainments/edit/${data._id}` });
				} else {
					this.$router.push({ path: '/entertainments/edit' });
				}
			},
			async refresh () {
				await this.queryDatas();
			},
			remove (data) {
				this.$confirm(`此操作将永久删除:${data.name}, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await this.del(`services/entertainments/${data._id}`);
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

			},
		},
		async mounted () {
			await this.queryDatas();
		}
	};
</script>
