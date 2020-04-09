<template>
	<view class="home-container" :style="{'padding-top' : navBarHeight + 'px' }">
		<uniNavBar fixed="true" :showLeft="false" :title="title" backgroundColor="#0387FE" shadow="false" color="white"></uniNavBar>
		<view class="hide" :class="{'show': tabIndex === 1 }">
			<TabShelf :visiable="tabIndex === 1" />
		</view>
		<view class="hide" :class="{'show': tabIndex === 2 }">
			<TabRank :visiable="tabIndex === 2" />
		</view>
		<view class="hide" :class="{'show': tabIndex === 3 }">
			<TabUpdate :visiable="tabIndex === 3" />
		</view>
		<view class="hide" :class="{'show': tabIndex === 4 }">
			<TabSearch :visiable="tabIndex === 4" />
		</view>
		<view class="hide" :class="{'show': tabIndex === 5 }">
			<TabSetting :visiable="tabIndex === 5" />
		</view>
		<cover-view class="cover">
			<cover-view v-for="item in tabs" :key="item.index" class="tab-item" @click="navClick(item)">
				<cover-image class="tab-icon" :src="'../../static/images/tabbar/'+ item.image + [tabIndex === item.index ? '_selected':''] + '.png'"></cover-image>
				<cover-view class="tab-name" :style="{'color' : tabIndex === item.index ? '#007aff':'#9B9B9B'}">{{item.title}}</cover-view>
			</cover-view>


			<!-- <adTabbar>
				<adTabbarItem v-for="item in tabs" :key="item.index" :name="item.title" :dataCur="item.index" class="maxWidth"
				 @click="navClick" :textColor="curPage=='page1'? '#007aff':'#9B9B9B'" :icon="'../../static/images/tabbar/'+ item.image + [tabIndex === item.index ? '_selected':''] + '.png'"></adTabbarItem>
			</adTabbar> -->
		</cover-view>
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
				return this.tabs[this.tabIndex - 1].title
			}
		},
		watch: {
			tabIndex: {
				handler(newValue, oldValue) {
					uni.setNavigationBarTitle({
						title: this.title
					})
					uni.pageScrollTo({
						scrollTop: 0
					})
				},
				immediate: true
			}
		},
		data() {
			return {
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
		methods: {
			// 导航栏切换
			navClick: function(e) {
				this.tabIndex = e.index
			},
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
			uni.$emit('pullDwomRefresh')
		},
		onReachBottom() {
			uni.$emit('loadMore')
		},
	}
</script>

<style lang="less">
	.home-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		box-sizing: border-box;
		justify-content: stretch;

		.hide {
			display: none;
		}

		.show {
			display: flex;
			flex: 1;
			flex-direction: column;
		}

		.maxWidth {
			flex: 1;
		}

		.cover {
			height: 100upx;
			position: fixed;
			left: 0;
			width: 100vw;
			bottom: 0;
			visibility: visible;
			background-color: red;
			min-height: 100upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

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
