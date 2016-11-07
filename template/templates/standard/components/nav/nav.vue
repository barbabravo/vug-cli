<template>
	<div class="row" style="margin-right:0;margin-left:0;">
		<ol class="breadcrumb col-sm-6 col-md-4">
			<li ><a href="/">首页</a></li>
			<li v-for="nav in navs.navs"><a :href="nav.url">{{nav.title}}</a></li>
			<li class="active">{{navs.title}}</li>
		</ol>
		<p class="breadcrumb col-sm-3 col-md-4 white_space">
			<span v-if="navs.describe">
				<span class="glyphicon glyphicon-th"></span>
				介绍：{{navs.describe}}
			</span>
			<span v-if="!navs.describe">&nbsp;</span>
		</p>
		<p class="breadcrumb col-sm-3 col-md-4 text-right white_space">
			<span class="glyphicon glyphicon-exclamation-sign text-danger"></span> 建议使用 chrome 浏览器浏览
		</p>
	</div>
</template>

<style lang="less" scoped>
	.breadcrumb{
		border-radius:0;
		&:first-child{
		    border-top-left-radius: 5px;
		    border-bottom-left-radius: 5px;
    	}
		&:last-child{
		    border-top-right-radius: 5px;
		    border-bottom-right-radius: 5px;
    	}
	}

	.white_space{
		text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	}

</style>


<script>
import Vue from "vue";
export default Vue.extend({
	props: ['navs'],
})
</script>