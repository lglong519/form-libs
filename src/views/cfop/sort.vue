<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="true">
					<el-form-item>
						<el-tag type="info">拖拽排序</el-tag>
					</el-form-item>
				</el-form>
			</el-row>
			<!-- content -->
			<el-table :data="tableDatas" id="cfop" :row-class-name="tableRowClassName" v-loading="tableLoading" :default-sort="{prop: 'order', order: 'ascending'}" border>
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
						{{scope.row.from}}&lt;=&gt;{{scope.row.to}}
					</template>
				</el-table-column>
				<el-table-column width="70" label="video" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-caret-right" plain circle></el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-button type="danger" size="small" @click="cancel" plain>取消</el-button>
				<el-button type="primary" size="small" @click="reorder" plain>重新排序</el-button>
			</div>
		</el-card>
	</div>
</template>


<style lang="scss" scoped>
	.ico {
	  width: 35px;
	}
</style>

<style>
	.sort-shadow {
	  background: rgba(157, 180, 223, 0.3) !important;
	}
</style>


<script>
	import Sortable from 'sortablejs';
	export default {
		data () {
			return {
				source: 'f2ls',
				tableDatas: [],
				shadowDatas: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSizes: [10, 20, 30, 50, 100],
					pageSize: 100,
				},
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
			queryDatas () {
				this.tableLoading = true;
				return this.query(`cfop/${this.source}?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&sort=order&populate=tags`).then(res => {
					this.pagination.total = Number(res.headers['x-total-count']);
					this.tableDatas = res.data;
					this.tableLoading = false;
				});
			},
			cancel () {
				this.$router.push({ path: `/cfop/${this.source}` });
			},
			async reorder () {
				await this.post(`cfop/${this.source}/reorder`, this.tableDatas);
				this.cancel();
			},
			initSort () {
				const el = document.querySelector('#cfop tbody');
				Sortable.create(el, {
					ghostClass: 'sort-shadow',
					setData (dataTransfer) {
						dataTransfer.setData('Text', '');
					},
					onEnd: e => {
						console.log(e.oldIndex, e.newIndex);

						const splice = this.tableDatas.splice(e.oldIndex, 1)[0];
						this.tableDatas.splice(e.newIndex, 0, splice);
					}
				});
			}
		},
		watch: {
			$route () {
				this.source = this.$route.path.split('/')[2];
				this.queryDatas();
			}
		},
		created () {
			this.source = this.$route.path.split('/')[2];
			this.queryDatas();
		},
		mounted () {
			this.initSort();
		}
	};
</script>
