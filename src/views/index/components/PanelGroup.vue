<template>
	<el-row :gutter="gutter" class="panel-group">
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('accesses')">
				<div class="card-panel-icon-wrapper icon-people">
					<i class="fa fa-odnoklassniki"></i>
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">Accesses</div>
					<count-to :start-val="0" :end-val="panelData.accesses" :duration="duration()" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('exercise')">
				<div class="card-panel-icon-wrapper icon-message">
					<i class="fa fa-soccer-ball-o"></i>
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">Exercise</div>
					<count-to :start-val="0" :end-val="panelData.pressUps+panelData.squats" :duration="duration()" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('expenses')">
				<div class="card-panel-icon-wrapper icon-money">
					<i class="fa fa-rmb"></i>
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">Expenses</div>
					<count-to :start-val="0" :end-val="5280" :duration="duration()" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('commits')">
				<div class="card-panel-icon-wrapper icon-shopping">
					<i class="fa fa-github-square"></i>
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">Commits</div>
					<count-to :start-val="0" :end-val="gitData.commits.total" :duration="duration()" class="card-panel-num" />
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import CountTo from 'vue-count-to';

export default {
	data () {
		return {
			gutter: this.$store.getters.device == 'mobile' ? 20 : 40
		};
	},
	computed: {
		device () {
			return this.$store.getters.device;
		}
	},
	watch: {
		device () {
			if (this.device == 'mobile') {
				this.gutter = 20;
			} else {
				this.gutter = 40;
			}
		}
	},
	props: {
		panelData: {
			type: Object
		},
		gitData: {
			type: Object
		}
	},
	components: {
		CountTo
	},
	methods: {
		duration () {
			return parseInt(Math.random() * (3000 - 2000) + 2000);
		},
		handleSetLineChartData (type) {
			this.$emit('handleSetLineChartData', type);
		}
	}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.panel-group {
	  margin-top: 18px;
	  .card-panel-col {
	    margin-bottom: 32px;
	  }
	  .card-panel {
	    display: flex;
	    padding: 0 14px;
	    align-items: center;
	    justify-content: space-between;
	    height: 108px;
	    cursor: pointer;
	    font-size: 12px;
	    overflow: hidden;
	    color: #666;
	    background: #fff;
	    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	    border-color: rgba(0, 0, 0, 0.05);
	    &:hover {
	      .card-panel-icon-wrapper {
	        color: #fff;
	      }
	      .icon-people {
	        background: #40c9c6;
	      }
	      .icon-message {
	        background: #36a3f7;
	      }
	      .icon-money {
	        background: #f4516c;
	      }
	      .icon-shopping {
	        background: #34bfa3;
	      }
	    }
	    .icon-people {
	      color: #40c9c6;
	    }
	    .icon-message {
	      color: #36a3f7;
	    }
	    .icon-money {
	      color: #f4516c;
	    }
	    .icon-shopping {
	      color: #34bfa3;
	    }
	    .card-panel-icon-wrapper {
	      padding: 13px 19px;
	      transition: all 0.38s ease-out;
	      border-radius: 6px;
	      font-size: 48px;
	    }
	    .card-panel-icon {
	      font-size: 48px;
	    }
	    .card-panel-description {
	      font-weight: bold;
	      margin: 26px;
	      margin-left: 0px;
	      .card-panel-text {
	        line-height: 18px;
	        color: rgba(0, 0, 0, 0.45);
	        font-size: 16px;
	        margin-bottom: 12px;
	      }
	      .card-panel-num {
	        font-size: 20px;
	      }
	    }
	  }
	}

	@media only screen and (max-width: 480px) {
	  .card-panel-text {
	    display: none;
	  }
	  .card-panel-icon-wrapper {
		  padding: 8px 14px!important;
	      font-size: 40px!important;
	  }
	}
</style>
