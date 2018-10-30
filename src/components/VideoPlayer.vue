<template>
	<div class="item">
		<div class="player">
			<video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" :playsinline="true" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)" @loadeddata="onPlayerLoadeddata($event)" @waiting="onPlayerWaiting($event)" @playing="onPlayerPlaying($event)" @timeupdate="onPlayerTimeupdate($event)" @canplay="onPlayerCanplay($event)" @canplaythrough="onPlayerCanplaythrough($event)" @ready="playerReadied" @statechanged="playerStateChanged($event)">
			</video-player>
		</div>
	</div>
</template>

<script>
export default {
	props: [
		'videoSrc'
	],
	data () {
		return {
			// videojs options
			playerOptions: {
				autoplay: false,
				muted: false,
				loop: false,
				preload: 'auto',
				language: 'zh-CN',
				aspectRatio: '16:9',
				fluid: true,
				playbackRates: [0.7, 1.0, 1.5, 2.0],
				sources: [{
					type: 'video/mp4',
					// src: 'http://vjs.zencdn.net/v/oceans.mp4',
				}],
				poster: '',
				notSupportedMessage: '此视频暂无法播放，请稍后再试',
			}
		};
	},
	created () {
		this.playerOptions.sources[0].src = this.videoSrc;
	},
	computed: {
		player () {
			return this.$refs.videoPlayer.player;
		}
	},
	watch: {
		videoSrc () {
			this.playerOptions.sources.splice(0, 1, {
				type: 'video/mp4',
				src: this.videoSrc,
			});
		}
	},
	methods: {
		play () {
			this.player.play();
		},
		pause () {
			this.player.pause();
		},
		// listen event
		onPlayerPlay (player) {
			// console.log('player play!', player)
		},
		onPlayerPause (player) {
			// console.log('player pause!', player)
		},
		onPlayerEnded (player) {
			// console.log('player ended!', player)
		},
		onPlayerLoadeddata (player) {
			// console.log('player Loadeddata!', player)
		},
		onPlayerWaiting (player) {
			// console.log('player Waiting!', player)
		},
		onPlayerPlaying (player) {
			// console.log('player Playing!', player)
		},
		onPlayerTimeupdate (player) {
			// console.log('player Timeupdate!', player.currentTime())
		},
		onPlayerCanplay (player) {
			// console.log('player Canplay!', player)
		},
		onPlayerCanplaythrough (player) {
			// console.log('player Canplaythrough!', player)
		},
		// or listen state event
		playerStateChanged (playerCurrentState) {
			// console.log('player current update state', playerCurrentState)
		},
		// player is ready
		playerReadied (player) {
			// seek to 10s
			console.log('Player\'s readied', player);
			player.currentTime(10);
		}
	}
};
</script>
