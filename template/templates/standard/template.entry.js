// 每次构建 CLI 自动生成，切勿修改（修改后，构建时也将重写此文件）。
import Vue 		from 'vue';
import utils	from 'qbs-utils';

import qbsPage 	from './{name}.vue';
import qbsMenu 	from '{parents}../templates/standard/components/menu/menu.vue';

$(function(){

	// 获取登录信息
	utils.API.api_user_currentlogin({
		transition:false,
		onSuccess:json=>{
			$('#js_username').text(json.data.realname);
			window._gUserData = json.data;

			new Vue({
				el: 'body',
				components: {
					qbsMenu,
					qbsPage
				}
			});
			$('#js_pageContent').addClass('g-page-transition-transition');
		},
		onError(data){
			if(data.error_code==302){
				utils.tip({'type':'error','text':'用户未登录，3秒钟后跳转到登录页面。' });
				setTimeout(function(){
					window.location.href=data.data.redirect;
				},3000);
			}else{
				utils.tip({'type':'error(','text':data.data?data.data.msg:'登录失败，未知错误'});
			}
		}
	})
})
