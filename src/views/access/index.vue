<template>
	<div class="app-container">
		<el-card>
			<el-table :default-sort = "{prop: 'updatedAt', order: 'descending'}" :data="tableData" stripe style="width: 100%">
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
		</el-card>
	</div>
</template>

<script>
  export default {
  	data () {
  		return {
  			tableData: []
  		};
	},
	mounted () {
		this.get('services/accesses').then(res => {
			this.tableData = res;
		});
	}
  };
</script>
