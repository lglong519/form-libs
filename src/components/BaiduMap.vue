<template>
	<div class="baidu-map" :class="{'xl':device=='mobile'}" ref="baiduMap"></div>
</template>
 
<script>
import { mapGetters } from 'vuex';

export default {
	computed: mapGetters(['device']),
	data () {
		return {
			geo: {
				log: undefined,
				lat: undefined,
			},
			bMap: undefined
		};
	},
	methods: {
		async map () {
			let map = new BMap.Map(this.$refs.baiduMap);
			let log = 113.271;
			let lat = 23.131;
			let address;
			if (this.device == 'mobile') {
				if (this.geo.lat && this.geo.log) {
					log = this.geo.log;
					lat = this.geo.lat;
				} else {
					let result = await this.get('services/address');
					address = result.city;
				}
			} else {
				let result = await this.get('services/address');
				address = result.city;
			}
			if (address) {
				map.centerAndZoom(address, 11);

			} else {
				map.centerAndZoom(new BMap.Point(log, lat), 11);
			}
			map.addControl(new BMap.MapTypeControl({
				mapTypes: [
					BMAP_NORMAL_MAP,
					BMAP_HYBRID_MAP,
				]
			}));
			map.addControl(new BMap.NavigationControl({
				enableGeolocation: true
			}));
			// map.clearOverlays();
			// let new_point = new BMap.Point(log, lat);
			// let marker = new BMap.Marker(new_point); // 创建标注
			// map.addOverlay(marker);
			map.enableScrollWheelZoom(true);
			map.enableInertialDragging();

			let geolocationControl = new BMap.GeolocationControl();
			geolocationControl.addEventListener('locationSuccess', e => {
				// 定位成功事件
				let address = '';
				address += e.addressComponent.province;
				address += e.addressComponent.city;
				address += e.addressComponent.district;
				address += e.addressComponent.street;
				address += e.addressComponent.streetNumber;
				console.log(`当前定位地址为：${address}`);
				if (!address) {
					map.centerAndZoom(new BMap.Point(113.271, 23.131), 11);
				}
			});
			geolocationControl.addEventListener('locationError', e => {
				// 定位失败事件
				console.log(e.message);
			});
			map.addControl(geolocationControl);
			let size = new BMap.Size(10, 20);
			map.addControl(new BMap.CityListControl({
				anchor: BMAP_ANCHOR_TOP_LEFT,
				offset: size,
				// 切换城市之间事件
				// onChangeBefore: function(){
				//    alert('before');
				// },
				// 切换城市之后事件
				// onChangeAfter:function(){
				//   alert('after');
				// }
			}));
		},
		async getLocation () {
			return new Promise((res, rej) => {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(data => {
						this.geo = {
							lat: data.coords.latitude, //纬度
							log: data.coords.longitude, //经度
						};
						res(this.geo);
					}, error => {
						let err;
						switch (error.code) {
							case error.PERMISSION_DENIED:
								err = '定位失败,用户拒绝请求地理定位';
								break;
							case error.POSITION_UNAVAILABLE:
								err = '定位失败,位置信息是不可用';
								break;
							case error.TIMEOUT:
								err = '定位失败,请求获取用户位置超时';
								break;
							case error.UNKNOWN_ERROR:
								err = '定位失败,定位系统失效';
								break;
						}
						this.$message({
							message: err,
							type: 'error',
						});
						res(err);
					});
				} else {
					res();
				}
			});

		}
	},
	async mounted () {
		await this.getLocation();
		this.map();
	}
};
</script>
 
<style lang="scss">
.baidu-map{
  height: 500px;
  overflow: hidden;
  margin: 20px;
	&.xl{
		margin-left: 0;
		margin-right: 0;
		height: 300px;
	}
}
</style>