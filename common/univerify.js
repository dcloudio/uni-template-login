import Vuex from '@/store/index.js'

export function univerifyLogin(cb) {
	const commit = Vuex.commit;
	const PROVIDER = 'univerify';

	uni.getProvider({
		service: 'oauth',
		success: (res) => {
			if (res.provider.indexOf(PROVIDER) !== -1) {
				// 一键登录已在APP onLaunch的时候进行了预登陆，可以显著提高登录速度。登录成功后，预登陆状态会重置
				uni.login({
					provider: PROVIDER,
					success: (res) => {
						uni.closeAuthView();
						uni.showLoading();

						uniCloud.callFunction({
							name: 'user-center',
							data: {
								action: 'loginByUniverify',
								params: res.authResult
							},
							success: (e) => {
								console.log('login success', e);

								if (e.result.code == 0) {
									const username = e.result.username || e.result.mobile || '一键登录新用户'

									uni.setStorageSync('uni_id_token', e.result.token)
									uni.setStorageSync('username', username)
									uni.setStorageSync('login_type', 'online')

									commit('login', username)
									uni.switchTab({
										url: '../main/main',
									});
								} else {
									uni.showModal({
										title: `登录失败: ${e.result.code}`,
										content: e.result.msg,
										showCancel: false
									})
									console.log('登录失败', e);
								}

							},
							fail: (e) => {
								uni.showModal({
									title: `登录失败`,
									content: e.errMsg,
									showCancel: false
								})
							},
							complete: () => {
								uni.hideLoading()
							}
						})
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));

						univerifyErrorHandler(err, cb);
					}
				})
			} else {
				cb && cb()
			}
		},
		fail: (err) => {
			console.error('获取服务供应商失败：' + JSON.stringify(err));
			cb && cb()
		}
	});
}

export function univerifyErrorHandler(err, cb) {
	const state = Vuex.state;
	const obj = {
		showCancel: true,
		cancelText: '其他登录方式',
		success(res) {
			if (res.cancel) {
				cb && cb()
			}
		}
	}

	switch (true) {
		// 一键登录点击其他登录方式
		case err.code == 30002:
			uni.closeAuthView();
			cb && cb()
			break;
			// 未开通
		case err.code == 1000:
			uni.showModal(Object.assign({
				title: `登录失败: ${err.code}`,
				content: `${err.errMsg}，开通指南：https://ask.dcloud.net.cn/article/37965`,
				/* confirmText: '开通指南',
				cancelText: '确定',
				success: (res) => {
					if (res.confirm) {
						setTimeout(() => {
							plus.runtime.openWeb('https://ask.dcloud.net.cn/article/37965')
						}, 500)
					}
				} */
			}, obj));
			break;
			// 预登陆失败
		case err.code == 30005:
			uni.showModal(Object.assign({
				showCancel: false,
				title: `预登录失败: ${err.code}`,
				content: state.univerifyErrorMsg || err.errMsg
			}, obj));
			break;
			//用户关闭验证界面
		case err.code != 30003:
			uni.showModal(Object.assign({
				showCancel: false,
				title: '登录失败:',
				content: `${err.errMsg}，错误码: ${err.code}`,
			}, obj));
			break;
	}
}
