<template>
	<view class="content">
		<view class=""></view>
		<view class="form-group">
			<view class="form-row">
				<text class="form-label">手机号：</text>
				<input class="form-input" type="text" auto-focus="true" v-model="mobile" placeholder="请输入手机号码" />
			</view>
			<view class="form-row">
				<text class="form-label">验证码：</text>
				<input class="form-input" type="form-input" v-model="code" placeholder="请输入验证码" />
				<view class="send-code-btn" @click="sendSmsCode">{{codeDuration ? codeDuration + 's' : '发送验证码' }}</view>
			</view>
			<view class="form-row">
				<text class="form-label">邀请码：</text>
				<input class="form-input" type="text" v-model="inviteCode" placeholder="邀请码(选填)" />
			</view>
			<view class="form-row">
				<text class="form-label">密码：</text>
				<input class="form-input" type="password" displayable v-model="password" placeholder="请输入密码" />
			</view>
			<view class="form-row">
				<text class="form-label">确认密码：</text>
				<input class="form-input" type="password" displayable v-model="confirmPassword" placeholder="请确认密码" />
			</view>
			<view class="form-submit">
				<button type="primary" class="primary" @tap="register">注册</button>
			</view>
		</view>
		<view class="download-app">
			<text @click="download">已有账号下载APP登录</text>
		</view>
	</view>
</template>

<script>
	// 为方便演示，此邀请注册页面放在项目内，实际可以单独做一个项目放置邀请注册页面

	export default {
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
				if (this.codeDuration) {
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
				uni.showLoading({
					title: '请稍等...',
					mask: true
				})
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
					},
					complete() {
						uni.hideLoading()
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
				uni.showLoading({
					title: '请稍后...'
				})
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
					success: (e) => {
						console.log("注册成功", e);

						if (e.result.code === 0) {
							uni.showModal({
								content: '注册成功，是否立即下载APP登录',
								success: (res) => {
									if (res.confirm) {
										this.download()
									}
								}
							})
						} else {
							uni.showModal({
								content: '注册失败：' + e.result.msg,
								showCancel: false
							})
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			download() {
				location.href = 'https://login.tpl.dcloud.net.cn/package/android-latest.apk'
			}
		}
	}
</script>

<style>
	.content {
		padding: 20px;
	}

	.form-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		height: 40px;
		background-color: #FFFFFF;
		border: solid 1px #DDDDDD;
		border-radius: 20px;
		overflow: hidden;
		margin-bottom: 10px;
	}

	.form-row .form-label {
		width: 80px;
		padding-left: 15px;
	}

	.form-row .form-input {
		flex: 1;
		margin: 0px 10px;
	}

	.send-code-btn {
		width: 120px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		background-color: #0FAEFF;
		color: #FFFFFF;
	}

	.form-submit {
		display: flex;
		flex-direction: row;
		margin-bottom: 10px;
	}

	.form-submit button {
		flex: 1;
		height: 40px;
		line-height: 40px;
		border-radius: 40px;
	}

	.download-app {
		text-align: center;
		color: #007AFF;
		text-decoration: underline;
	}
</style>
