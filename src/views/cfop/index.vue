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
			<el-table :data="tableDatas" :row-class-name="tableRowClassName" v-loading="tableLoading" :default-sort="{prop: 'order', order: 'ascending'}" border>
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
					<el-button type="warning" size="small" @click="toReorder" plain>重新排序</el-button>
				</div>
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</div>
		</el-card>
	</div>
</template>


<style lang="scss" scoped>
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
				dialogVisible: false,
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
					searchVal = `{"number":{"$in":[${this.searchVal}]}}`;
				}
				return this.query(`cfop/${this.source}?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}&sort=order&populate=tags`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.tableDatas = res.data;
					this.tableLoading = false;
				});
			},
			toggleEdit () {},
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
			toReorder () {
				this.$router.push({ path: `/cfop/${this.source}/reorder` });
			},
		},
		watch: {
			$route () {
				this.source = this.$route.path.split('/').pop();
				this.queryDatas();
			}
		},
		created () {
			this.source = this.$route.path.split('/').pop();
			this.queryDatas();
		},
	};
</script>
