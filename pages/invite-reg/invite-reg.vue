<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">手机：</text>
				<m-input class="m-input" type="text" clearable focus v-model="mobile" placeholder="请输入手机号码"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">验证码：</text>
				<m-input type="text" v-model="code" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn" @click="sendSmsCode">{{codeDuration ? codeDuration + 's' : '发送验证码' }}</view>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">确认密码：</text>
				<m-input type="password" displayable v-model="confirmPassword" placeholder="请确认密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="register">注册</button>
		</view>
	</view>
</template>

<script>
	// 为方便演示，此邀请注册页面放在项目内，实际可以单独做一个项目放置邀请注册页面
	import mInput from '../../components/m-input.vue';

	export default {
		components: {
			mInput
		},
		data() {
			return {
				mobile: '',
				code: '',
				password: '',
				confirmPassword: '',
				codeDuration: 0,
				inviteCode: ''
			}
		},
		onLoad(options) {
			this.inviteCode = options.invite_code
		},
		methods: {
			sendSmsCode() {
				if(this.codeDuration) {
					uni.showModal({
						content: `请在${this.codeDuration}秒后重试`,
						showCancel: false
					})
				}
				if (!/^1\d{10}$/.test(this.mobile)) {
					uni.showModal({
						content: '手机号码填写错误',
						showCancel: false
					})
					return
				}
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'sendSmsCode',
						params: {
							mobile: this.mobile,
							type: 'register'
						}
					},
					success: (e) => {
						if (e.result.code == 0) {
							uni.showModal({
								content: '验证码发送成功，请注意查收',
								showCancel: false
							})
							this.codeDuration = 60
							this.codeInterVal = setInterval(() => {
								this.codeDuration--
								if (this.codeDuration === 0) {
									if (this.codeInterVal) {
										clearInterval(this.codeInterVal)
										this.codeInterVal = null
									}
								}
							}, 1000)
						} else {
							uni.showModal({
								content: '验证码发送失败：' + e.result.msg,
								showCancel: false
							})
						}
			
					},
					fail(e) {
						uni.showModal({
							content: '验证码发送失败',
							showCancel: false
						})
					}
				})
			},
			register() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (!/^1\d{10}$/.test(this.mobile)) {
					uni.showModal({
						content: '手机号码填写错误',
						showCancel: false
					})
					return
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				if (this.password !== this.confirmPassword) {
					uni.showToast({
						icon: 'none',
						title: '两次密码输入不一致'
					});
					return;
				}
				if (this.code === '') {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的验证码'
					});
					return;
				}

				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'inviteLogin',
						params: {
							mobile: this.mobile,
							code: this.code,
							inviteCode: this.inviteCode,
							password: this.password
						}
					},
					success(e) {
						console.log("注册成功", e);

						if (e.result.code === 0) {
							uni.showToast({
								title: '注册成功'
							});
							uni.setStorageSync('uniIdToken', e.result.token)
							uni.setStorageSync('username', e.result.username)
							uni.reLaunch({
								url: '../main/main',
							});
						} else {
							uni.showModal({
								content: JSON.stringify(e.result),
								showCancel: false
							})
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>

<style>
	.send-code-btn {
		width: 120px;
		text-align: center;
		background-color: #0FAEFF;
		color: #FFFFFF;
	}
</style>
