// 每次构建 CLI 自动生成，切勿修改（修改后，构建时也将重写此文件）。
import Vue 		from 'vue';
import utils	from 'qbs-utils';

import qbsPage 	from './{name}.vue';

new Vue({
	el: '#app',
	components: {
		qbsPage
	}
});