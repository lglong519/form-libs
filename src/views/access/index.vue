<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="false" style="width:400px">
					<el-form-item>
						<el-input placeholder="请输入内容" v-model="searchVal" class="input-with-select">
							<el-select v-model="searchProp" slot="prepend" placeholder="请选择">
								<template v-for="item,i in ['action','client','host','ip','referer']">
									<el-option :label="item" :value="item"></el-option>
								</template>
							</el-select>
							<el-button slot="append" icon="el-icon-search" @click="queryAccesses"></el-button>
						</el-input>
					</el-form-item>
				</el-form>
				<div>
					<el-tooltip class="item" effect="light" content="刷新" placement="left-start">
						<el-button icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
					</el-tooltip>
				</div>
			</el-row>
			<el-table :default-sort="{prop: 'updatedAt', order: 'descending'}" :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="inc" label="次数" sortable width="80"> </el-table-column>
				<el-table-column prop="ip" label="ip" sortable width="160"> </el-table-column>
				<el-table-column prop="action" label="请求" sortable width="80"> </el-table-column>
				<el-table-column prop="resource" label="资源"> </el-table-column>
				<el-table-column prop="host" label="入口" sortable width="180"> </el-table-column>
				<el-table-column prop="updatedAt" label="时间" sortable width="150">
					<template slot-scope="scope">
						{{scope.row.updatedAt|dateTime}}
					</template>
				</el-table-column>
			</el-table>

			<el-row type="flex" class="row-mg" justify="end" align="middle">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</el-row>
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
		queryAccesses (searchVal = '') {
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
		}
	},
	mounted () {
		this.queryAccesses();
	}
  };
</script>
