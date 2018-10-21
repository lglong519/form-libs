<template>
  <div :class="className" :style="{height:realHeight,width:width}"/>
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import debounce from '@/utils/debounce';

export default {
	props: {
		className: {
			type: String,
			default: 'chart'
		},
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: String,
			default: '350px'
		},
		autoResize: {
			type: Boolean,
			default: true
		},
		chartData: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			chart: null
		};
	},
	computed: {
		realHeight () {
			if (this.$store.getters.device == 'mobile') {
				return '250px';
			}
			return this.height;
		}
	},
	watch: {
		chartData: {
			deep: true,
			handler (val) {
				this.chart.dispose();
				this.chart = echarts.init(this.$el, 'macarons');
				this.setOptions(val);
			}
		}
	},
	mounted () {
		this.initChart();
		if (this.autoResize) {
			this.__resizeHandler = debounce(() => {
				if (this.chart) {
					this.chart.resize();
				}
			}, 100);
			window.addEventListener('resize', this.__resizeHandler);
		}

		// 监听侧边栏的变化
		const sidebarElm = document.getElementsByClassName('sidebar-container')[0];
		sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler);
	},
	beforeDestroy () {
		if (!this.chart) {
			return;
		}
		if (this.autoResize) {
			window.removeEventListener('resize', this.__resizeHandler);
		}

		const sidebarElm = document.getElementsByClassName('sidebar-container')[0];
		sidebarElm && sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler);

		this.chart.dispose();
		this.chart = null;
	},
	methods: {
		sidebarResizeHandler (e) {
			if (e.propertyName === 'width') {
				this.__resizeHandler();
			}
		},
		setOptions (chartData) {
			let legend = Object.keys(chartData);
			let padding = [];
			let series = legend.map((item, i) => {
				padding.push((i + 1) * 5);
				if (i % 2 == 0) {
					return {
						name: item,
						smooth: true,
						type: 'line',
						itemStyle: {
							normal: {
								color: '#FF005A',
								lineStyle: {
									color: '#FF005A',
									width: 2
								}
							}
						},
						data: chartData[item],
						animationDuration: 2800,
						animationEasing: 'cubicInOut'
					};
				}
				return {
					name: item,
					smooth: true,
					type: 'line',
					itemStyle: {
						normal: {
							color: '#3888fa',
							lineStyle: {
								color: '#3888fa',
								width: 2
							},
							areaStyle: {
								color: '#f3f8ff'
							}
						}
					},
					data: chartData[item],
					animationDuration: 2800,
					animationEasing: 'quadraticOut'
				};
			});
			this.chart.setOption({
				xAxis: {
					data: this.week,
					boundaryGap: false,
					axisTick: {
						show: false
					}
				},
				grid: {
					left: 10,
					right: 10,
					bottom: 20,
					top: 30,
					containLabel: true
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					padding
				},
				yAxis: {
					axisTick: {
						show: false
					}
				},
				legend: {
					data: legend
				},
				series
			});
		},
		initChart () {
			for (let i = 0; i < new Date().getDay(); i++) {
				this.week.push(this.week.shift());
			}
			this.chart = echarts.init(this.$el, 'macarons');
			this.setOptions(this.chartData);
		}
	}
};
</script>
