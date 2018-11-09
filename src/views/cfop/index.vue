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
				<el-table-column prop="formula" label="Formula" min-width="250"></el-table-column>
				<el-table-column prop="formula" label="Reletive">
					<template slot-scope="scope">
						{{scope.row.from}}<=>{{scope.row.to}}
					</template>
				</el-table-column>
				<el-table-column width="70" label="video" align="center">
					<template slot-scope="scope">
						<el-button size="mini" :disabled="!scope.row.video" @click="openVideo(scope.row)" type="primary" icon="el-icon-caret-right" plain circle></i></el-button>
					</template>
				</el-table-column>
				<el-table-column width="60" label="Tag" align="center">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.tags.length" v-for="item of scope.row.tags" :key="item._id" :type="item.type" size="mini">{{item.label}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column width="70">
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" size="mini" type="warning" plain @click="toggleEdit(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<div class="multi-edit">
					<el-button type="warning" size="small" @click="toReorder" plain>重新排序</el-button>
				</div>
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</div>
			<!-- edit dialog -->
			<el-dialog :title="dialog.title" :visible.sync="dialog.visible">
				<el-form :model="editForm" :rules="editRules" ref="editform">
					<el-form-item label="order" prop="order">
						<el-input v-model.number="editForm.order" placeholder="请输入" :autofocus="true"></el-input>
					</el-form-item>
					<el-form-item label="number" prop="number">
						<el-input v-model.number="editForm.number" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="image" prop="image">
						<el-input v-model="editForm.image" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="formula" prop="formula">
						<el-input v-model="editForm.formula" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="reletive" prop="reletive">
						<el-input v-model="editForm.reletive" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="video" prop="video">
						<el-input v-model="editForm.video" placeholder="请输入"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</div>
			</el-dialog>
			<!-- video -->
			<el-dialog :before-close="beforeClose" :visible.sync="videoVisible" custom-class="video-dialog">
				<video-player ref="vvideo" :videoSrc="videoSrc" />
			</el-dialog>

		</el-card>
	</div>
</template>


<style lang="scss" scoped>
	.ico {
	  width: 35px;
	}

	.el-table__row {
	  &:hover #edit-order-btn {
	    display: inline-block;
	  }
	}
	#edit-order-btn {
	  display: none;
	}
	.multi-edit {
	  float: left;
	}
</style>

<style lang="scss">
	.video-dialog{
		width:50%;
		.el-dialog__header{
			padding: 0;
			.el-dialog__headerbtn{
				top: 10px;
			}
		}
		.el-dialog__body{
			padding: 0;
		}
		@media only screen and (max-width: 992px) {
			width:80%;
		}
		@media only screen and (max-width: 768px) {
			width:100%!important;
		}
	}
</style>

<script>
	import VideoPlayer from '@/components/VideoPlayer';
	function editForm () {
		return {
			order: undefined,
			number: undefined,
			image: undefined,
			formula: undefined,
			reletive: undefined,
			video: undefined,
		};
	}
	export default {
		components: {
			VideoPlayer
		},
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
				editForm: editForm(),
				dialog: {
					visible: false,
					title: null
				},
				tableLoading: false,
				editRules: {
					order: [
						{ required: true, message: '请输入', trigger: 'blur' },
						{ type: 'number', message: '必须为数字值' }
					],
					number: [
						{ required: true, message: '请输入', trigger: 'blur' },
						{ type: 'number', message: '必须为数字值' }
					],
					formula: [
						{ required: true, message: '请输入', trigger: 'blur' }
					],
					image: [
						{ required: true, message: '请输入', trigger: 'blur' }
					],
				},
				videoSrc: '',
				videoVisible: false,
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
			toggleEdit (data) {
				if (data._id) {
					this.dialog.title = '修改';
					this.editForm = JSON.parse(JSON.stringify(data));
				} else {
					this.dialog.title = '新建';
				}
				this.dialog.visible = true;
			},
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
			submit () {
				this.$refs.editform.validate(async valid => {
					if (valid) {
						if (this.editForm._id) {
							await this.patch(`cfop/${this.source}/${this.editForm._id}`, this.editForm);
						} else {
							await this.post(`cfop/${this.source}`, this.editForm);
						}
						await this.queryDatas();
						this.dialog.visible = false;
						this.editForm = editForm();
					}
				});
			},
			cancel () {
				this.dialog.visible = false;
			},
			openVideo (data) {
				this.videoSrc = data.video;
				this.videoVisible = true;
			},
			beforeClose (fn) {
				this.$refs.vvideo.pause();
				fn(true);
			}
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
