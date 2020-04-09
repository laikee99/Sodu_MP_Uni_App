<template>
	<view class="pupup-menus-container" @touchmove.stop.prevent="stopPop" @click.stop="hiddenMenus">
		<view class="menu-item book-name" @click.stop="stopPop">
			{{book.name}}
		</view>
		<view v-if="book && book.sourceUrl" class="menu-item" @click.stop="handleRefresh">
			检查更新
		</view>
		<view v-if="book && book.soduUpdatePageUrl" class="menu-item" @click.stop="handleViewUpdateSites">
			查看更新站点
		</view>
		<view v-if="book" class="menu-item delete" @click.stop="handleDeleteBook">
			从书架中移除
		</view>
	</view>
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
			stopPop() {},
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
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		text-align: center;
		background: rgba(0, 0, 0, 0.6);
		z-index: 100;

		.menu-item {
			position: relative;
			height: 100upx;
			width: 100vw;
			background-color: white;
			color: #555555;
			font-weight: 300;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30upx;

			&.book-name {
				font-weight: 500;
				font-size: 32upx;
			}

			&.delete {
				color: #DD524D;
				font-weight: 500;
			}

			&:not(:last-child):before {
				content: " ";
				position: absolute;
				left: 0;
				bottom: 0;
				right: 0;
				height: 1upx;
				border-bottom: 1upx solid #dbdbdb;
				-webkit-transform-origin: 0 0;
				transform-origin: 0 0;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
			}
		}


	}
</style>
