<template>
	<view class="home-container">
		<uniNavBar :showLeft="false" :title="title" backgroundColor="#0387FE" shadow="false" color="white"></uniNavBar>
		<TabShelf ref="shelf" :class="[tabIndex === 1 ? 'show' : 'hide']" />
		<TabRank :class="[tabIndex === 2 ? 'show' : 'hide']" />
		<TabUpdate :class="[tabIndex === 3 ? 'show' : 'hide']" />
		<TabSearch :class="[tabIndex === 4 ? 'show' : 'hide']" />
		<TabSetting :class="[tabIndex === 5 ? 'show' : 'hide']" />
		<view class="cover">
			<view v-for="item in tabs" :key="item.index" class="tab-item" @click="navClick(item)">
				<image class="tab-icon" :src="'../../static/images/tabbar/'+ item.image + [tabIndex === item.index ? '_selected':''] + '.png'"></image>
				<view class="tab-name" :style="{'color' : tabIndex === item.index ? '#007aff':'#9B9B9B'}">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import TabShelf from '../tab_shelf/tab_shelf.vue'
	import TabRank from '../tab_rank/tab_rank'
	import TabUpdate from '../tab_update/tab_update'
	import TabSearch from '../tab_search/tab_search'
	import TabSetting from '../tab_setting/tab_setting'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		components: {
			TabShelf,
			TabRank,
			TabUpdate,
			TabSearch,
			TabSetting,
			uniNavBar
		},
		computed: {
			title() {
				let title = this.tabs[this.tabIndex - 1].title
				return title
			}
		},
		watch: {
			tabIndex: {
				handler(newValue, oldValue) {

				},
				immediate: true
			}
		},
		data() {
			return {
				triggered: false,
				navBarHeight: 44 + uni.getSystemInfoSync().statusBarHeight,
				tabIndex: 1,
				tabs: [{
						title: '书架',
						image: 'tabbar_local_shelf',
						index: 1
					},
					{
						title: '排行',
						image: 'tabbar_rank',
						index: 2
					},
					{
						title: '最近更新',
						image: 'tabbar_update',
						index: 3
					}, {
						title: '搜索',
						image: 'tabbar_search',
						index: 4
					}, {
						title: '设置',
						image: 'tabbar_setting',
						index: 5
					}
				]
			};
		},
		mounted() {},
		methods: {
			// 导航栏切换
			navClick: function(e) {
				this.tabIndex = e.index
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
			uni.$emit('pullDwomRefresh')
		},
		onReachBottom() {
			uni.$emit('loadMore')
		}
	}
</script>

<style lang="less">
	/deep/ .home-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		box-sizing: border-box;
		overflow: hidden;

		// .tab-shelf {
		// 	flex: 1;
		// }

		.page {
			flex: 1;
			height: 200upx;
		}

		.hide {
			display: none;
		}

		.show {
			display: flex;
			flex: 1;
			flex-direction: column;
		}

		.cover {
			width: 100vw;
			visibility: visible;
			background-color: red;
			min-height: 100upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			z-index: 2;

			/*tabbar*/
			padding: 0;
			height: calc(130upx + env(safe-area-inset-bottom) / 2);
			padding-bottom: calc(env(safe-area-inset-bottom) / 2);

			/*shadow*/
			box-shadow: 0 -1upx 6upx rgba(0, 0, 0, 0.1);

			/*bg-white*/
			background-color: #ffffff;
			color: #666666;


			.tab-item {
				display: flex;
				flex: 1;
				flex-direction: column;
				align-items: center;
				height: 100%;
				width: 100%;
				justify-content: center;

				.tab-icon {
					width: 50upx;
					height: 50upx;
					display: inline-block;
					margin-bottom: 10upx;
				}
			}

			.tab-name {
				font-size: 12px;
				display: inline-block;
			}
		}
	}
</style>
