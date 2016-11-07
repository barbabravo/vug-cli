<template>
	<div v-if="loaded" transition="menu-transition">
	    <div v-for="menu in menus" class="panel panel-info">
	        <div class="panel-heading">
	            <h4 class="panel-title">
	                <a data-toggle="collapse" data-parent="#js_user_menu" href="#js_menu_{{ $index }}" aria-expanded="true">
	                    <span class="glyphicon {{menu.icon}}" aria-hidden="true"></span>
	                    <span class="normal"> {{ menu.name }}</span>
	                </a>
	            </h4>
	        </div>
	        <div id="js_menu_{{ $index }}" class="panel-collapse collapse" :class="isIn(menu)">
	            <div class="panel-body">
	                <div class="list-group">
	                    <a v-for="n in menu.children"  :href="n.url" class="list-group-item a" v-bind:class="{'selected':n.selected}" >{{n.name}}</a>
	                </div>
	            </div>
	        </div>
	    </div>
    </div>
</template>


<style lang="less" scoped>

	.menu-transition-transition {
	  transition: all 0.2s ease;
	  -webkit-opacity: 1;
	  -moz-opacity: 1;
	  -o-opacity: 1;
	  -ms-opacity: 1;
	  opacity: 1;
	  -webkit-transform:translate(0px);
	  -moz-transform:translate(0px);
	  -o-transform:translate(0px);
	  -ms-transform:translate(0px);
	  transform:translate(0px);
	}
	.menu-transition-enter{
	  -webkit-opacity:0;
	  -moz-opacity:0;
	  -o-opacity:0;
	  -ms-opacity:0;
	  opacity:0;
	  -webkit-transform:translate(-50px);
	  -moz-transform:translate(-50px);
	  -o-transform:translate(-50px);
	  -ms-transform:translate(-50px);
	  transform:translate(-50px);
	}

	.panel-group{
		margin-bottom: 5px;
	    .panel{
	    	a{text-decoration: none;} 
	    	.panel-body {
			    padding: 5px;

				.list-group {
					margin-bottom:0;

					.list-group-item{
						&:before{
							display: none;
							position: absolute;
							left: 0;
							top: 0;
							font-size: 0;
							width: 4px;
							height: 100%;
							background-color: rgb(51, 122, 183);
							content: ".";
						}

						&:hover:before,
						&.selected:before
						{
							display: block;
						}

					}
				}
			}
	    }
	}
</style>




<script>
import Vue 		from 'vue';
import utils from 'qbs-utils';

utils.extend({
	api_menu_list:{
		url:'/api/menu/list?ajaxID=578c94c5a64905a12d749997'
	}
})


export default Vue.extend({

	ready(){
		this.loadData();
	},

	data(){
		return {
			menus:[],
			loaded:false
		}
	},

	methods:{

		loadData(){

			function setMenuState(data){
				var url_regexp = new RegExp('^https?:\/\/(' + location.host + '|localhost:8080)', 'ig')
				var url = location.href.replace(url_regexp,'');
				if(url.indexOf('?')!=-1){
					url = url.substring(0,url.indexOf('?'));
				}
				data.forEach(i=>{
					i.children = i.children || [];
					i.children.forEach(j=>{
						j.selected = j.url == url;
					})
				})
			}

			var menu = sessionStorage.getItem('G-USER-MENU-'+window._gUserData.id);
			if(menu){
				menu = JSON.parse(menu);
				setMenuState(menu);
				this.$data.menus  = menu;
				this.$data.loaded =true;
			}else{
				// 用户菜单
				utils.API.api_menu_list({
					onSuccess:json=>{
						setMenuState(json.data);
						this.$data.menus  = json.data;
						this.$data.loaded =true;
						sessionStorage.setItem('G-USER-MENU-'+window._gUserData.id,JSON.stringify(json.data));
					},
					onError(data){
						utils.tip({'type':'error(','text':data.data.msg});
					}
				});
			}
		},
		isIn(menus){
			var url_regexp = new RegExp('^https?:\/\/(' + location.host + '|localhost:8080)', 'ig')
			var url = location.href.replace(url_regexp,'');
			if(url.indexOf('?') != -1 ){
				url = url.substring(0,url.indexOf('?'));
			}
			for(var i =0;i<menus.children.length;i++){
				if(menus.children[i].url === url){
					return 'in';
				}
			}
			return '';
		}
	},

});
</script>