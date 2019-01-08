<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="true">
					<el-form-item>
						<el-input placeholder="name" v-model="searchVal" clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="success" icon="el-icon-search" plain @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-tooltip class="hidden-xs-only" effect="light" content="刷新" placement="left-start">
						<el-button icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
					</el-tooltip>
					<el-button class="hidden-sm-and-up" icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
				</div>
			</el-row>

			<el-table :data="users" :row-class-name="tableRowClassName" v-loading="tableLoading">
				<el-table-column prop="image" label="ico" width="60" align="center">
					<template slot-scope="scope">
						<img v-if="scope.row.image" class="ico" :src="scope.row.image" />
					</template>
				</el-table-column>
				<el-table-column prop="username" label="name"></el-table-column>
				<el-table-column prop="email" label="email">
				</el-table-column>
				<el-table-column prop="phone" label="phone" min-width="110"></el-table-column>
				<el-table-column prop="client" label="client"></el-table-column>
				<el-table-column prop="createdAt" label="创建" min-width="100">
					<template slot-scope="scope">
						{{scope.row.createdAt|dateTime}}
					</template>
				</el-table-column>
				<el-table-column prop="updatedAt" label="更新" min-width="100">
					<template slot-scope="scope">
						{{scope.row.updatedAt|dateTime}}
					</template>
				</el-table-column>
				<el-table-column prop="_id" label="_id"></el-table-column>
				<el-table-column width="85" label="Accounts" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="mini" plain @click="viewAccounts(scope.row)">{{scope.row.accounts}}</el-button>
					</template>
				</el-table-column>
				<el-table-column width="80" label="Tiebas" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="mini" plain @click="viewTiebas(scope.row)">
							{{scope.row.tiebas}}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column width="90" label="Summary" align="center">
					<template slot-scope="scope">
						<router-link :to="{name:'Summary',params:{user:scope.row._id}}"><el-tag size="mini">view</el-tag></router-link>
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
				users: [],
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
					searchVal = `{"username":{"$regex":"${this.searchVal}","$options":"$i"}}`;
				}
				return this.query(`tieba/tieba-accounts/users?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.users = res.data;
					this.tableLoading = false;
				});
			},
			async refresh () {
				await this.queryDatas();
			},
			viewAccounts (data) {
				this.$router.push({
					path: `/tieba/tieba-accounts/${data._id}`
				});
			},
			viewTiebas (data) {
				this.$router.push({
					path: `/tieba/tiebas/${data._id}`
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
		async mounted () {
			await this.queryDatas();
		}
	};
</script>
