<template>
	<view class="uni-popup-share">
		<view class="uni-share-title"><text class="uni-share-title-text">{{title}}</text></view>
		<view class="uni-share-content">
			<view class="uni-share-content-box">
				<view class="uni-share-content-item" v-for="(item,index) in bottomData" :key="index" @click.stop="select(item,index)">
					<image class="uni-share-image" :src="item.icon" mode="aspectFill"></image>
					<text class="uni-share-text">{{item.text}}</text>
				</view>

			</view>
		</view>
		<view class="uni-share-button-box">
			<button class="uni-share-button" @click="close">取消</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniPopupShare',
		props: {
			title: {
				type: String,
				default: '分享到'
			},
			shareType: {
				type: String,
				default: 'link'
			}
		},
		inject: ['popup'],
		data() {
			return {
				providerList: []
			}
		},
		computed: {
			bottomData() {
				let tempBottomData = []
				switch (this.shareType) {
					case 'link':
						tempBottomData = this.providerList.concat([{
							text: '复制链接',
							icon: '/static/img/more.png',
							name: 'more'
						}])
						break;
					case 'image':
						tempBottomData = this.providerList.concat([{
							text: '更多',
							icon: '/static/img/more.png',
							name: 'more'
						}])
						break;
					default:
						break;
				}
				return tempBottomData
			}
		},
		created() {
			uni.getProvider({
				service: 'share',
				success: (e) => {
					console.log('success', e);
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									text: '微信',
									name: 'weixin',
									type: 'WXSceneSession',
									icon: '/static/img/weixin.png',
									sort: 0
								})
								break;
							case 'qq':
								data.push({
									text: 'QQ',
									name: 'qq',
									icon: '/static/img/qq.png',
									sort: 1
								})
								break;
							// case 'sinaweibo':
							// 	data.push({
							// 		text: '新浪微博',
							// 		name: 'sinaweibo',
							// 		icon: '/static/img/sinaweibo.png',
							// 		sort: 2
							// 	})
							// 	break;
							default:
								break;
						}
					}
					this.providerList = data.sort((x, y) => {
						return x.sort - y.sort
					});

				},
				fail: (e) => {
					console.log('获取分享通道失败', e);
					uni.showModal({
						content: '获取分享通道失败',
						showCancel: false
					})
				}
			});
		},
		methods: {
			/**
			 * 选择内容
			 */
			select(item, index) {
				this.$emit('select', {
					item,
					index
				})
				this.popup.close()
			},
			/**
			 * 关闭窗口
			 */
			close() {
				this.popup.close()
			}
		}
	}
</script>
<style scoped>
	.uni-popup-share {
		background-color: #fff;
	}

	.uni-share-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 40px;
	}

	.uni-share-title-text {
		font-size: 14px;
		color: #666;
	}

	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 10px;
	}

	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		width: 360px;
	}

	.uni-share-content-item {
		width: 90px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		padding: 10px 0;
		align-items: center;
	}

	.uni-share-content-item:active {
		background-color: #f5f5f5;
	}

	.uni-share-image {
		width: 30px;
		height: 30px;
	}

	.uni-share-text {
		margin-top: 10px;
		font-size: 14px;
		color: #3B4144;
	}

	.uni-share-button-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: 10px 15px;
	}

	.uni-share-button {
		flex: 1;
		border-radius: 50px;
		color: #666;
		font-size: 16px;
	}

	.uni-share-button::after {
		border-radius: 50px;
	}
</style>
