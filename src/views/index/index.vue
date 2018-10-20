<template>
	<div>
		<weather-info />
		<div class="dashboard-editor-container">
			<github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
			<panel-group @handleSetLineChartData="handleSetLineChartData" :panelData="panelData" :gitData="gitData" />

			<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
				<line-chart :chart-data="currentLineChartData" />
			</el-row>
		</div>
	</div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner';
import PanelGroup from './components/PanelGroup';
import LineChart from './components/LineChart';
import WeatherInfo from './components/WeatherInfo';

export default {
	name: 'Index',
	components: {
		GithubCorner,
		PanelGroup,
		LineChart,
		WeatherInfo,
	},
	data () {
		return {
			lineChartData: {
				accesses: {
					expectedData: [100, 120, 161, 134, 105, 160, 165],
					actualData: [120, 82, 91, 154, 162, 140, 145]
				},
				exercise: {
					expectedData: [200, 192, 120, 144, 160, 130, 140],
					actualData: [180, 160, 151, 106, 145, 150, 130]
				},
				expenses: {
					expectedData: [80, 100, 121, 104, 105, 90, 100],
					actualData: [120, 90, 100, 138, 142, 130, 130]
				},
				commits: {
					contributions: [],
				}
			},
			lineChartType: 'accesses',
			panelData: {},
			gitData: JSON.parse(localStorage.getItem('gitData'))
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
		},
		async aggregation () {
			this.panelData = await this.get('services/aggregation');
			this.gitData = await this.get('services/aggregation/git/lglong519');
			localStorage.setItem('gitData', JSON.stringify(this.gitData));
		}
	},
	async created () {
		this.lineChartData.commits.contributions = this.gitData.commits.week;
		await this.aggregation();
		this.lineChartData.commits.contributions = this.gitData.commits.week;
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
	@media only screen and (max-width: 768px) {
	  .dashboard-editor-container {
	    padding: 16px;
	    .chart-wrapper {
	      padding: 8px 8px 0;
	      margin-bottom: 16px;
	    }
	  }
	}
</style>
