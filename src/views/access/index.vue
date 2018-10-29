<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form>
					<el-form-item>
						<el-input placeholder="请输入内容" v-model="searchVal" class="input-with-select">
							<el-select v-model="searchProp" slot="prepend" placeholder="请选择">
								<el-option v-for="item in searchProps" :key="item" :label="item" :value="item"></el-option>
							</el-select>
							<el-button slot="append" type="primary" icon="el-icon-search" plain @click="search"></el-button>
						</el-input>
					</el-form-item>
				</el-form>
				<div>
					<el-tooltip class="hidden-xs-only" effect="light" content="刷新" placement="left-start">
						<el-button icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
					</el-tooltip>
					<el-button class="hidden-sm-and-up" icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
				</div>
			</el-row>
			<el-table :default-sort="{prop: 'updatedAt', order: 'descending'}" :data="tableData" stripe style="width: 100%" v-loading="tableLoading" border>
				<el-table-column type="index" label="#" align="center"></el-table-column>
				<el-table-column prop="inc" label="次数" sortable width="80" align="center"> </el-table-column>
				<el-table-column prop="ip" label="ip" sortable width="160"> </el-table-column>
				<el-table-column prop="action" label="请求" sortable width="80" align="center"> </el-table-column>
				<el-table-column prop="resource" label="资源" :show-overflow-tooltip="true" min-width="150"></el-table-column>
				<el-table-column prop="host" label="入口" sortable width="180"> </el-table-column>
				<el-table-column prop="updatedAt" label="时间" sortable min-width="100">
					<template slot-scope="scope">
						{{scope.row.updatedAt|dateTime}}
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :pager-count="5" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</div>
		</el-card>
	</div>
</template>

<style>
	.el-select .el-input {
	  width: 100px;
	}
	.input-with-select .el-input-group__prepend {
	  background-color: #fff;
	}
</style>

<script>
  export default {
  	data () {
  		return {
			tableData: [],
			pagination: {
				total: 0,
				currentPage: 1,
				pageSizes: [10, 20, 30, 50, 100],
				pageSize: 10,
			},
			searchVal: null,
			tableLoading: false,
			searchProp: null,
			searchProps: ['action', 'client', 'host', 'ip', 'referer'],
  		};
	},
	methods: {
		pageSizeChange (e) {
			this.pagination.pageSize = e;
			this.queryAccesses();
		},
		pageChange (e) {
			this.pagination.currentPage = e;
			this.queryAccesses();
		},
		queryAccesses () {
			let searchVal = '';
			this.tableLoading = true;
			if (this.searchVal || this.searchVal === 0) {
				if (this.searchProp) {
					searchVal = `{"${this.searchProp}":{"$regex":"${this.searchVal}","$options":"$i"}}`;
				}
			}
			this.query(`services/accesses?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}`).then(res => {
				this.pagination.total = Number(res.headers['x-total-count']);
				this.tableData = res.data;
				this.tableLoading = false;
			});
		},
		refresh () {
			this.queryAccesses();
		},
		search () {
			if (this.searchProp && this.searchVal) {
				this.queryAccesses();
			} else {
				this.$message({
					message: !this.searchProp ? '请选择查询字段' : '请输入内容',
					type: 'error',
				});
			}

		}
	},
	mounted () {
		this.queryAccesses();
	}
  };
</script>
