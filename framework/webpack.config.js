//发布基础地址
const DIST_BASE_URL = '/fe/dist';


const webpack           = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin= require('clean-webpack-plugin');

const log 			  = console.log;
const spawn  			  = require('child_process').spawn;
const isDebug			  = true;

const argvs = process.argv.splice(2).join(' ');
if(argvs.indexOf('-build') != -1){
	isDebug = false;
}


const path           = require("path");
const glob           = require("glob");

const configs		   = glob.sync("./src/pages/**/*.json");

const entrys		   = glob.sync("./src/pages/**/*.entry.js");

const template_path  = './node_modules/vug-templates/templates'

const webpackEntrys  = {};
const webpackPlugins = [];

// 动态创建 html 文件，不用 html 插件，提高编译速度
function CreateHtml() {}
CreateHtml.prototype.apply = function(compiler) {
  	compiler.plugin("emit", function(compilation, callback) { 
		const tasks = [];
		configs.forEach(config=>{
			const scripts;
			const jsFile;
			const savePath =  config.replace('./src/pages/','').replace('.json','.html');
			const base_url, dist_base_url;
			if(isDebug){
				base_url = 'http://localhost:9876';
				dist_base_url = ''
			}else{
				base_url = ''
				dist_base_url = DIST_BASE_URL;
			}
			jsFile   = config.replace('./src/pages/','').replace('.json','.js');
			scripts  = `
					<script src="${base_url}${dist_base_url}/common.js"></script>
					<script src="${base_url}${dist_base_url}/${jsFile}""></script>
				</body>
				</html>`;

			const rf    = require("fs");  
			const template = JSON.parse(rf.readFileSync(config).toString()).template;
			const data  = rf.readFileSync(path.join(template_path, template, "/layout.html"),"utf-8");  
			const fileContents = data.replace(/<!--placeholder-->(.|\n)*/gi,scripts);

			compilation.assets[savePath] = {
		      source: function() {
		        return fileContents;
		      },
		      size: function() {
		        return fileContents.length;
		      }
		    };
		})
		callback();
	});
};
 
(function(){
	const entryName = '';
	const obj 	  = null;
	entrys.forEach(entry=>{
		entryName = entry.replace('./src/pages/','').replace('.entry.js','');
		webpackEntrys[entryName] = entry;
	});
})();

webpackPlugins.push(new webpack.optimize.CommonsChunkPlugin('common.js'));

webpackPlugins.push(new CreateHtml());

if(!isDebug){
	webpackPlugins.push(
		new CleanWebpackPlugin(['dist'], {
			verbose: true, 
			dry: false
		})
	);
	webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({
		output: {
			comments: false,  // remove all comments
		},
		compress: {
			warnings: false
		}
	}));
}else{
	webpackPlugins.push(new OpenBrowserPlugin({url: 'http://localhost:9876'}));
	webpackPlugins.push(new webpack.HotModuleReplacementPlugin());
}


const webpack_config = {
	entry:webpackEntrys,

	output: {
		filename: '[name].js',
		path: path.join(__dirname, "dist"),
	},
	
	module: {
		loaders:[
			{test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel'},
			{test: /\.vue$/, loader: 'vue'},
			{test: /\.less$/, loader: 'style!css!less'},
			{test: /\.css$/, loader: 'style-loader!css-loader'},
      {
      	test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)/,
      	loader: 'url-loader?limit=500&name=' + (isDebug?'../[name].[hash].[ext]':'[name].[hash].[ext]&publicPath=../assets/&outputPath=./assets/')
      },
		]
	},
	babel:{
		presets:['es2015']
	},
	resolve: {
	  alias: {
	    'vue$': 'vue/dist/vue.common.js'
	  }
	},
  	plugins:webpackPlugins,

	devServer: {
	    historyApiFallback: true,
	    hot: true,
	    inline: true,
	    progress: true,
	    port:9876
	}
};

// console.log(webpack_config);

module.exports = webpack_config;