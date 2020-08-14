<template>
	<view class="content">
		<view class="invite-qrcode" v-if="inviteUrl">
			<!-- #ifdef H5 -->
			<view class="invite-qrcode-tips">请长按复制下面的链接发送给好友</view>
			<view class="invite-url">{{inviteUrl}}</view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view @click="copyInviteUrl">
				<view class="invite-qrcode-tips">点击下面的链接复制后发送给好友</view>
				<view class="invite-url">{{inviteUrl}}</view>
			</view>
			<!-- #endif -->
			<view class="invited-users">
				<view class="invited-users-title">我邀请的用户</view>
				<view>
					<view class="invited-users-empty" v-if="invitedUser.length === 0">
						还没有用户接受邀请哦
					</view>
					<view class="invited-users-item" v-for="(item,index) in invitedUser">
						<text class="username">{{item.username || '新用户'}}</text>
						<text class="mobile">{{item.mobile}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				inviteUrl: '',
				invitedUser: []
			}
		},
		onLoad() {
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'getInviteCode'
				},
				success: (res) => {
					console.log(res);
					if (res.result.code === 0) {
						// 这里请修改为真实的邀请页面url
						this.inviteUrl = 'http://localhost:8080/#/pages/invite-reg/invite-reg?invite_code=' + res.result.inviteCode
					} else {
						uni.showModal({
							content: '获取用户邀请码失败:' + res.result.msg,
							showCancel: false
						})
					}
				},
				fail: (err) => {
					uni.showModal({
						content: '获取用户邀请码失败，请稍后再试',
						showCancel: false
					})
				}
			})
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'getInvitedUser'
				},
				success: (res) => {
					console.log(res);
					if (res.result.code === 0) {
						// 这里请修改为真实的邀请页面url
						this.invitedUser = res.result.invitedUser
					} else {
						uni.showModal({
							content: '获取被邀请用户列表失败:' + res.result.msg,
							showCancel: false
						})
					}
				},
				fail: (err) => {
					uni.showModal({
						content: '获取被邀请用户列表失败，请稍后再试',
						showCancel: false
					})
				}
			})
		},
		methods: {
			copyInviteUrl() {
				uni.setClipboardData({
					data: this.inviteUrl
				})
			}
		}
	}
</script>

<style>
	.invite-qrcode {
		display: flex;
		padding: 20px;
		flex-direction: column;
	}

	.invite-qrcode-tips {
		padding: 10px 0px;
		color: #666666;
		line-height: 1.2em;
	}

	.invite-url {
		color: #999999;
		font-size: 12px;
		line-height: 1.2em;
		/* #ifdef H5 */
		user-select: auto;
		/* #endif */
	}

	.invited-users {
		background-color: #FFFFFF;
		margin-top: 10px;
		border-radius: 5px;
		padding: 10px 0px;
	}

	.invited-users-title {
		text-align: center;
		margin-bottom: 10px;
	}

	.invited-users-empty {
		font-size: 12px;
		color: #999999;
		text-align: center;
	}

	.invited-users-item {
		display: flex;
		flex-direction: row;
		border-bottom: solid 1px #DDDDDD;
	}
	
	.invited-users-item:last-child {
		border-bottom: none;
	}

	.invited-users-item .username,
	.invited-users-item .mobile {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #666666;
		line-height: 24px;
	}
</style>
