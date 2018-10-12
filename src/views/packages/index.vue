<template>
	<div class="app-container">
		<el-card>
			<el-row type="flex" justify="space-between">
				<el-form :inline="true">
					<el-form-item>
						<el-input placeholder="请输入内容" v-model="searchVal" clearable><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="success" icon="el-icon-search" plain @click="refresh">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-edit" plain @click="toggleEdit">添加</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-tooltip class="item" effect="light" content="刷新" placement="left-start">
						<el-button icon="el-icon-refresh" size="small" circle @click="refresh"></el-button>
					</el-tooltip>
				</div>
			</el-row>

			<el-table :data="packages" :row-class-name="tableRowClassName" v-loading="tableLoading">
				<el-table-column prop="name" label="name"></el-table-column>
				<el-table-column prop="var" label="var"></el-table-column>
				<el-table-column prop="link" label="doc">
					<template slot-scope="scope">
						<a :href="scope.row.link" target="_blank">
							<el-tooltip class="item" effect="dark" :content="scope.row.link" placement="right-start">
								<el-button type="text">前往</el-button>
							</el-tooltip>
						</a>
					</template>
				</el-table-column>
				<el-table-column prop="isActive" label="status">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.isActive" active-color="#13ce66" inactive-color="#ff4949" :change="switchPackage(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column>
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" size="mini" plain @click="toggleEdit(scope.row)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-row type="flex" class="row-mg" justify="end">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChange" :page-sizes="pagination.pageSizes" :total="pagination.total" @current-change="pageChange"></el-pagination>
			</el-row>
		</el-card>
		<!-- edit dialog -->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible">
			<el-form :model="editPackage" :rules="editRules" ref="editPackage">
				<el-form-item label="name" prop="name">
					<el-input v-model="editPackage.name" placeholder="请输入包名"></el-input>
				</el-form-item>
				<el-form-item label="var" prop="var">
					<el-input v-model="editPackage.var" placeholder="请输入变量名"></el-input>
				</el-form-item>
				<el-form-item label="link" prop="link">
					<el-input v-model="editPackage.link" placeholder="请输入文档链接"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="isActive">
					<el-switch v-model="editPackage.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import { validateURL } from '@/utils/validate';

function editPackage () {
	return {
		name: null,
		var: null,
		link: null,
		isActive: true
	};
}
export default {
	data () {
		function validLink (rule, value, callback) {
			if (!value) {
				callback(new Error('请输入链接'));
			} else if (!validateURL(value)) {
				callback(new Error('链接格式不对'));
			} else {
				callback();
			}
		}
		return {
			packages: [],
			pagination: {
				total: 0,
				currentPage: 1,
				pageSizes: [10, 20, 30, 50, 100],
				pageSize: 10,
			},
			searchVal: null,
			editPackage: editPackage(),
			dialog: {
				visible: false,
				title: null
			},
			editRules: {
				name: [
					{ required: true, message: '请输入包名', trigger: 'blur' }
				],
				var: [
					{ required: true, message: '请输入变量名', trigger: 'blur' }
				],
				link: [
					{ required: true, message: '请输入链接', trigger: 'blur' },
					{ validator: validLink, trigger: 'blur' }
				],
				isActive: [
					{ type: 'boolean', message: '必须为布尔值' }
				],
			},
			tableLoading: false
		};
	},
	methods: {
		tableRowClassName ({ row, rowIndex }) {
			if (rowIndex === 1) {
				return 'warning-row';
			} else if (rowIndex === 3) {
				return 'success-row';
			}
			return '';
		},
		loadPackages () {
			this.packages.forEach(elem => {
				elem && this.switchPackage(elem);
			});
		},
		switchPackage (data) {
			if (data.isActive) {
				try {
					window[data.var] = require(data.name);
				} catch (e) {
					this.$message({
						message: `Cannot find module '${data.name}'`,
						type: 'error',
					});
				}
			} else {
				window[data.var] = null;
			}
		},
		pageSizeChange (e) {
			this.pagination.pageSize = e;
			this.queryPackages();
		},
		pageChange (e) {
			this.pagination.currentPage = e;
			this.queryPackages();
		},
		queryPackages (searchVal = '') {
			this.tableLoading = true;
			if (this.searchVal) {
				searchVal = `{"name":{"$regex":"${this.searchVal}","$options":"$i"}}`;
			}
			return this.query(`services/packages?pageSize=${this.pagination.pageSize}&p=${this.pagination.currentPage - 1}&q=${searchVal}`).then(res => {
				this.pagination.total = Number(res.headers['x-total-count']);
				this.packages = res.data;
				this.tableLoading = false;
			});
		},
		toggleEdit (data) {
			if (data._id) {
				this.dialog.title = '修改';
				this.editPackage = data;
			} else {
				this.dialog.title = '新建';
			}
			this.dialog.visible = true;
		},
		submit () {
			this.$refs.editPackage.validate(async valid => {
				if (valid) {
					if (this.editPackage._id) {
						await this.patch(`services/packages/${this.editPackage._id}`, this.editPackage);
					} else {
						await this.post('services/packages', this.editPackage);
					}
					await this.queryPackages();
					this.dialog.visible = false;
					this.editPackage = editPackage();
				}
			});
		},
		cancel () {
			this.dialog.visible = false;
			this.editPackage = editPackage();
		},
		async refresh () {
			await this.queryPackages();
			this.loadPackages();
		}
	},
	async mounted () {
		await this.queryPackages();
		this.loadPackages();
	}
};
</script>