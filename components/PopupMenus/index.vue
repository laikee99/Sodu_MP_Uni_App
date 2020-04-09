<template>
	<cover-view class="pupup-menus-container" @touchmove="stopPop" @click="hiddenMenus">
		<cover-view class="menu-item book-name" @click="stopPop">
			{{book.name}}
		</cover-view>
		<cover-view class="split"></cover-view>

		<cover-view class="menu-item" @click="handleRefresh">
			检查更新
		</cover-view>
		<cover-view class="split"></cover-view>

		<cover-view class="menu-item" @click="handleViewUpdateSites">
			查看更新站点
		</cover-view>
		<cover-view class="split"></cover-view>

		<cover-view class="menu-item delete" @click="handleDeleteBook">
			从书架中移除
		</cover-view>
	</cover-view>
</template>

<script>
	export default {
		props: {
			book: {
				type: Object,
				default: null
			},
			isShelf: {
				type: Boolean,
				default: false
			},
		},
		methods: {
			stopPop() {
				console.log('=========')
			},
			// 添加至个人书架
			handleAddToShelf() {
				uni.$emit('addBookToShelf', this.book)
				this.$emit('closeMenu')
			},
			// 查看sodu更新站点
			handleViewUpdateSites() {
				this.$emit('closeMenu')
				let url = '../../pages/sodu_update_sites/sodu_update_sites'
				uni.navigateTo({
					url: url + `?book=${JSON.stringify(this.book)}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			handleRefresh() {
				this.$emit('bookRefresh', this.book.bookId)
			},
			// 关闭按钮
			hiddenMenus() {
				console.log('========k')
				this.$emit('closeMenu')
			},
			handleDeleteBook() {
				this.$emit('deleteBook', this.book.bookId)
			}
		}
	}
</script>

<style scoped lang="less">
	.pupup-menus-container {
		position: fixed;
		left: 0upx;
		top: 0upx;
		bottom: 100px;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		text-align: center;
		background: rgba(0, 0, 0, 0.6);
		z-index: 999;
		padding-bottom: 100px;

		.menu-item {
			position: relative;
			height: 100upx;
			width: 100vw;
			background-color: white;
			color: #555555;
			font-weight: 300;
			font-size: 30upx;
			line-height: 100upx;
			text-align: center;

			&.book-name {
				font-weight: 500;
				font-size: 32upx;
			}

			&.delete {
				color: #DD524D;
				font-weight: 500;
				height: 150upx;
				font-size: 34upx;
				line-height: 150upx;
			}


		}

		.split {
			height: 1px;
			background-color: #dbdbdb;
		}
	}
</style>
