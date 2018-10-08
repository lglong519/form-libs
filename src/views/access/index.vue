<template>
	<div class="app-container">
		<el-card>
			<el-table :default-sort="{prop: 'updatedAt', order: 'descending'}" :data="tableData" stripe style="width: 100%">
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

			<el-row type="flex" class="row-mg" justify="end">
				<el-pagination layout="prev, pager, next" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</el-row>
		</el-card>
	</div>
</template>

<script>
  export default {
  	data () {
  		return {
			tableData: [],
			pagination: {
				total: 0,
				currentPage: 1
			}
  		};
	},
	methods: {
		pageChange (e) {
			this.queryAccesses(e - 1);
		},
		queryAccesses (p) {
			this.query(`services/accesses?p=${p}`).then(res => {
				this.pagination.total = Number(res.headers['x-total-count']);
				this.tableData = res.data;
			});
		}
	},
	mounted () {
		this.queryAccesses(this.pagination.currentPage - 1);
	}
  };
</script>
<style lang="scss" scoped>
.row-mg{
	margin-top: 10px;
}
</style>
