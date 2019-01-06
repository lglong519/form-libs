<template>
	<div class="app-container">
		<el-card class="summarize">
			<el-row>总共 {{summarize.total}} 个贴吧，已签 {{summarize.resolve}} 个，待签 {{summarize.pendding}} 个，出错 {{summarize.reject}} 个，忽略 {{summarize.void}} 个， 无效 {{summarize.invalid}} 个</el-row>
			<el-row>
				<el-button plain size="mini" type="warning" @click="resetAll">重置</el-button>
			</el-row>
		</el-card>

		<el-row type="flex" justify="space-between">
			<el-form :inline="true">
				<el-form-item>
					<el-select v-model="searchProp" placeholder="请选择" size="mini" @change="searchBystatus">
						<el-option v-for="item in searchProps" :key="item.label" :label="item.label" :value="item.status"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-input placeholder="kw" v-model="searchVal" clearable>
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
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
			<el-table-column prop="kw" label="kw" fixed>
				<template slot-scope="scope">
					<a
						target="_blank"
						:onclick="`window.open('https://tieba.baidu.com/f?kw=${scope.row.kw}');`"
						:style="scope.row.void?'color:#f56c6c':'color:#409EFF'"
					>{{scope.row.kw}}</a>
				</template>
			</el-table-column>
			<el-table-column prop="level_id" label="★" align="center" width="100">
				<template slot-scope="scope">
					<el-tag size="mini">{{scope.row.cur_score}}</el-tag>
					<el-tag size="mini" type="warning">{{scope.row.level_id}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="50">
				<template slot-scope="scope">
					<span v-if="scope.row.status=='pendding'">待签</span>
					<span v-if="scope.row.status=='resolve'">已签</span>
					<span v-if="scope.row.status=='reject'">出错</span>
				</template>
			</el-table-column>
			<el-table-column prop="desc" label="desc" min-width="100">
				<template slot-scope="scope">
					<div :class="scope.row.status=='reject'&&'color-danger'">{{scope.row.desc}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="updatedAt" label="时间" min-width="100">
				<template slot-scope="scope">{{scope.row.updatedAt|dateTime}}</template>
			</el-table-column>
			<el-table-column prop="fid" label="fid" min-width="120"></el-table-column>
			<el-table-column prop="tiebaAccount.un" label="account" min-width="210"></el-table-column>
			<el-table-column prop="user.username" label="user" min-width="210"></el-table-column>
			<el-table-column prop="sequence" label="sequence" min-width="140"></el-table-column>
			<el-table-column width="70" label="有效" align="center">
				<template slot-scope="scope">{{scope.row.active}}</template>
			</el-table-column>
			<el-table-column width="70" label="忽略" align="center">
				<template slot-scope="scope">{{scope.row.void}}</template>
			</el-table-column>

			<el-table-column width="90" label="Summary" align="center">
				<template slot-scope="scope">
					<router-link :to="{name:'Summary',params:{account:scope.row.tiebaAccount._id,user:scope.row.user._id}}">
						<el-tag size="mini">view</el-tag>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="pageSizeChange"
				:page-sizes="pagination.pageSizes"
				:total="pagination.total"
				@current-change="pageChange"
				:current-page="pagination.currentPage"
			></el-pagination>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.color-danger {
		color: #f56c6c;
	}
	.ico {
		width: 35px;
	}
	.summarize {
		margin-bottom: 10px;
		background-color: #edeff2;
		font-size: 14px;
		color: #787b80;
		.el-row {
			margin-bottom: 5px;
		}
	}
</style>

<script>
	import generateQeuqryOptions, { searchProps } from './generateQeuqryOptions';

	export default {
		data () {
			return {
				summarize: {
					total: 0,
					resolve: 0,
					pendding: 0,
					reject: 0,
					void: 0,
					invalid: 0,
				},
				accounts: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSizes: [10, 20, 30, 50, 100],
					pageSize: 10,
				},
				searchVal: null,
				tableLoading: false,
				searchProp: '',
				searchProps,
			};
		},
		methods: {
			tableRowClassName ({ row, rowIndex }) {
				if (row.void) {
					return 'delete-row';
				}
				if (!row.active) {
					return 'unactive-row';
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
					searchVal = { 'kw': { '$regex': this.searchVal, '$options': '$i' } };
				}
				if (this.$route.params.user) {
					searchVal.user = this.$route.params.user;
				}
				if (this.$route.params.account) {
					searchVal.tiebaAccount = this.$route.params.account;
				}

				Object.assign(searchVal, generateQeuqryOptions(this.searchProp));

				return this.query(`tieba/tiebas?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${JSON.stringify(searchVal)}`, {
					populate: 'tiebaAccount,user'
				}).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.accounts = res.data;
					this.tableLoading = false;
					this.getSumarize();
				});
			},
			async refresh () {
				await this.queryDatas();
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
			resetAll () {
				this.$confirm('全部重置为待签, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await this.post('tieba/tiebas/reset');
					this.$notify.success({
						message: '重置成功',
					});
					this.refresh();
				});
			},
			getSumarize () {
				return this.get('tieba/tiebas/summarize').then(result => {
					this.summarize = result;
				});
			},
			searchBystatus () {
				this.pagination.currentPage = 1;
				this.queryDatas();
			},
		},
		async mounted () {
			await this.queryDatas();
		}
	};
</script>
