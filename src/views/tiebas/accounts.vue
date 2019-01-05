<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="true">
					<el-form-item>
						<el-input placeholder="un" v-model="searchVal" clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
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

			<el-table :data="accounts" :row-class-name="tableRowClassName" v-loading="tableLoading">
				<el-table-column prop="un" label="un" fixed></el-table-column>
				<el-table-column prop="uid" label="uid" min-width="120"></el-table-column>
				<el-table-column prop="user.username" label="user" min-width="210"></el-table-column>
				<el-table-column prop="sequence" label="sequence" min-width="140"></el-table-column>
				<el-table-column prop="BDUSS" label="BDUSS" min-width="180">
					<template slot-scope="scope">
						<div class="no-wrap">{{scope.row.BDUSS}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="active" label="active" width="60" align="center">
					<template slot-scope="scope">
						{{scope.row.active}}
					</template>
				</el-table-column>
				<el-table-column width="80" label="Tiebas" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" plain @click="viewTiebas(scope.row)">view</el-button>
					</template>
				</el-table-column>
				<el-table-column width="90" label="Summary" align="center">
					<template slot-scope="scope">
						<router-link :to="{name:'Summary',params:{account:scope.row._id,user:scope.row.user._id}}"><el-tag size="mini">view</el-tag></router-link>
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
	import { validateURL } from '@/utils/validate';
	function editForm () {
		return {
			BDUSS: undefined,
			sequence: undefined,
			active: undefined,
			user: undefined,
		};
	}
	export default {
		data () {
			return {
				accounts: [],
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
				let searchVal = {};
				this.tableLoading = true;
				if (this.searchVal) {
					searchVal = { 'un': { '$regex': this.searchVal, '$options': '$i' } };
				}
				if (this.$route.params.user) {
					searchVal.user = this.$route.params.user;
				}
				return this.query(`tieba/tieba-accounts?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${JSON.stringify(searchVal)}`, {
					populate: 'user'
				}).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.accounts = res.data;
					this.tableLoading = false;
				});
			},
			async refresh () {
				await this.queryDatas();
			},
			viewTiebas (data) {
				this.$router.push({
					path: `/tieba/tiebas/${data.user._id}/${data._id}`
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
