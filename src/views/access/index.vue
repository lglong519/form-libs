<template>
	<div class="app-container">
		<el-table :data="tableData" stripe style="width: 100%">
			<el-table-column prop="inc" label="次数" width="180">
			</el-table-column>
			<el-table-column prop="action" label="请求" width="180">
			</el-table-column>
			<el-table-column prop="resource" label="资源">
			</el-table-column>
		</el-table>
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
			console.log(res);
		});
	}
  };
</script>