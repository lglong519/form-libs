<template>
	<div>
		<div class="s-weather-wrapper" style="height:32px;display:flex;align-items:center"></div>
		<div class="dashboard-editor-container">
			<github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
			<panel-group @handleSetLineChartData="handleSetLineChartData"/>

			<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
				<line-chart :chart-data="currentLineChartData"/>
			</el-row>
		</div>
	</div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner';
import PanelGroup from './components/PanelGroup';
import LineChart from './components/LineChart';

export default {
	name: 'Index',
	components: {
		GithubCorner,
		PanelGroup,
		LineChart,
	},
	data () {
		return {
			lineChartData: {
				newVisitis: {
					expectedData: [100, 120, 161, 134, 105, 160, 165],
					actualData: [120, 82, 91, 154, 162, 140, 145]
				},
				messages: {
					expectedData: [200, 192, 120, 144, 160, 130, 140],
					actualData: [180, 160, 151, 106, 145, 150, 130]
				},
				purchases: {
					expectedData: [80, 100, 121, 104, 105, 90, 100],
					actualData: [120, 90, 100, 138, 142, 130, 130]
				},
				shoppings: {
					expectedData: [130, 140, 141, 142, 145, 150, 160],
					actualData: [120, 82, 91, 154, 162, 140, 130]
				}
			},
			lineChartType: 'newVisitis'
		};
	},
	computed: {
		currentLineChartData () {
			return this.lineChartData[this.lineChartType];
		}
	},
	methods: {
		handleSetLineChartData (type) {
			this.lineChartType = type;
		}
	},
	mounted () {
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.dashboard-editor-container {
	  position: relative;
	  padding: 32px;
	  background-color: rgb(240, 242, 245);
	  .chart-wrapper {
	    background: #fff;
	    padding: 16px 16px 0;
	    margin-bottom: 32px;
	  }
	}
</style>
