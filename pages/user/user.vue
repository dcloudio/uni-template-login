<template>
	<view class="content">
		<view class="btn-row">
			<button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
			<button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		computed: {
			...mapState(['hasLogin', 'forcedLogin'])
		},
		methods: {
			...mapMutations(['logout']),
			bindLogin() {
				uni.navigateTo({
					url: '../login/login',
				});
			},
			bindLogout() {
				this.logout();
        
        uniCloud.callFunction({
          name:'user-center',
          data:{
            action:'logout'
          },
          success:(e) => {
            
            console.log('logout success',e);
            
            if(e.result.code == 0){
              uni.removeStorageSync('uniIdToken')
              uni.removeStorageSync('username')
              /**
               * 如果需要强制登录跳转回登录页面
               */
              if (this.forcedLogin) {
              	uni.reLaunch({
              		url: '../login/login',
              	});
              }
            }else{
              uni.showModal({
                content:e.result.msg
              })
              console.log('登出失败',e);
            }
            
          },
          fail(e) {
            uni.showModal({
              content:JSON.stringify(e)
            })
          }
        })
        
				
			}
		}
	}
</script>

<style>

</style>
