//发布基础地址
var DIST_BASE_URL = "/dist";
var webpack = require("webpack");
var OpenBrowserPlugin = require("open-browser-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

var log = console.log;
var spawn = require("child_process").spawn;

var isDebug = true;

var arguments = process.argv.splice(2);
var arguments_str = arguments.join(" ");
var isBuildOne = arguments[1] ? true : false;

if (arguments_str.indexOf("-build") != -1) {
  isDebug = false;
}

var path = require("path");
var rf = require("fs");
var glob = require("glob");
var _ = require("lodash");
var crypto = require("crypto");

var configs = glob.sync("./src/pages/**/*.json");

var entrys = glob.sync("./src/pages/**/*.entry.js");

if (isBuildOne) {
  configs = glob.sync("./src/pages/" + arguments[1] + "/*.json");
  entrys = glob.sync("./src/pages/" + arguments[1] + "/*.entry.js");
}

var template_path = "./node_modules/vug-templates/templates";

var CURRENT_PATH = process.cwd();

var webpackEntrys = {};
var webpackPlugins = [
  new webpack.ProvidePlugin({
    //每个项目各不相同，可自行调整要全局声明的类库变量
    // $: 'jquery',
    // _: 'lodash'
  }),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: isDebug ? '"development"' : '"production"'
    }
  })
];

// 动态创建 html 文件，不用 html 插件，提高编译速度
function CreateHtml() {}
CreateHtml.prototype.apply = function(compiler) {
  compiler.plugin("emit", function(compilation, callback) {
    var tasks = [];
    configs.forEach(config => {
      var scripts;
      var commonFile;
      var jsFile;
      var savePath = config
        .replace("./src/pages/", "")
        .replace(".json", ".html");
      var base_url, dist_base_url;
      if (isDebug) {
        base_url = "http://localhost:9876";
        dist_base_url = "";
      } else {
        base_url = "";
        dist_base_url = DIST_BASE_URL;
      }
      commonFile = "common.js";
      jsFile = config.replace("./src/pages/", "").replace(".json", ".js");

      // name
      // hash
      // renderedHash
      // console.log(compilation.chunks)

      if (!isDebug) {
        var common_hash = _.result(
          _.find(compilation.chunks, function(chr) {
            return chr.name == "common";
          }),
          "renderedHash"
        );
        var jsFile_hash = _.result(
          _.find(compilation.chunks, function(chr) {
            return chr.name == jsFile.substr(0, jsFile.length - 3);
          }),
          "renderedHash"
        );
        commonFile = "common." + common_hash + ".js";
        jsFile =
          jsFile.substr(0, jsFile.length - 3) + "." + jsFile_hash + ".js";
      }

      scripts = `
                    <script src="${base_url}${dist_base_url}/${commonFile}"></script>
                    <script src="${base_url}${dist_base_url}/${jsFile}"></script>
                </body>
                </html>`;

      var json_content = JSON.parse(rf.readFileSync(config).toString());

      var template = json_content["template"];
      eval(
        'var header_placeholder_path = json_content["head-placeholder"]?json_content["head-placeholder"]:"";'
      );
      eval(
        'var dom_placeholder_path = json_content["dom-placeholder"]?json_content["dom-placeholder"]:"";'
      );

      // console.log("header_placeholder_path:",header_placeholder_path);
      // console.log("dom_placeholder_path:",dom_placeholder_path);

      header_placeholder_path = _.isArray(header_placeholder_path)
        ? header_placeholder_path
        : [header_placeholder_path];
      dom_placeholder_path = _.isArray(dom_placeholder_path)
        ? dom_placeholder_path
        : [dom_placeholder_path];

      var header_data = "";
      var dompreloader_data = "";

      header_placeholder_path.forEach(function(file_path) {
        if (!file_path) {
          return;
        }
        var page_path = config.replace(/\/[^\/]+?\.json$/gi, "");
        var file_path = path.resolve(CURRENT_PATH, page_path, file_path);
        header_data += rf.existsSync(file_path)
          ? rf.readFileSync(file_path, "utf-8")
          : "";
      });

      dom_placeholder_path.forEach(function(file_path) {
        if (!file_path) {
          return;
        }
        var page_path = config.replace(/\/[^\/]+?\.json$/gi, "");
        var file_path = path.resolve(CURRENT_PATH, page_path, file_path);
        dompreloader_data += rf.existsSync(file_path)
          ? rf.readFileSync(file_path, "utf-8")
          : "";
      });

      var data = rf.readFileSync(
        path.join(template_path, template, "/layout.html"),
        "utf-8"
      );
      data = data.replace(/<!--header-->/gi, header_data);
      data = data.replace(/<!--dompreloader-->/gi, dompreloader_data);

      var fileContents = data.replace(/<!--placeholder-->(.|\n)*/gi, scripts);

      compilation.assets[savePath] = {
        source: function() {
          return fileContents;
        },
        size: function() {
          return fileContents.length;
        }
      };
    });
    callback();
  });
};

(function() {
  var entryName = "";
  var obj = null;
  entrys.forEach(entry => {
    entryName = entry.replace("./src/pages/", "").replace(".entry.js", "");
    webpackEntrys[entryName] = entry;
  });
  // webpackEntrys.common = ['jquery','vue','lodash'];//每个项目各不相同，根本每个项目不同增加或删除要提取的公共部分
  webpackEntrys.common = ["vue"]; //每个项目各不相同，根本每个项目不同增加或删除要提取的公共部分
})();

webpackPlugins.push(new CreateHtml());

if (!isDebug) {
  if (!isBuildOne) {
    webpackPlugins.push(
      new CleanWebpackPlugin(["dist"], {
        verbose: true,
        dry: false
      })
    );
  } else {
    webpackPlugins.push(
      new CleanWebpackPlugin(["dist/" + arguments[1]], {
        verbose: true,
        dry: false
      })
    );
  }
} else {
  webpackPlugins.push(new OpenBrowserPlugin({ url: "http://localhost:9876" }));
  webpackPlugins.push(new webpack.HotModuleReplacementPlugin());
}

var webpack_config = {
  entry: webpackEntrys,

  output: {
    filename: isDebug ? "[name].js" : "[name].[chunkhash].js",
    path: path.join(__dirname, "dist")
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{ loader: "vue-loader" }]
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)/,
        use: {
          loader: "file-loader",
          options: {
            name: isDebug ? "../[name].[hash].[ext]" : "[name].[hash].[ext]",
            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
            publicPath: "../assets/",
            outputPath: "./assets/"
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      //每个项目各不相同，可自行增加别名
      // 'jquery':'jquery/dist/jquery.min.js',
      vue$: "vue/dist/vue.common.js",
      "@": path.resolve(__dirname, "src")
    }
  },
  plugins: webpackPlugins,
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "common",
          chunks: "initial"
        }
      }
    },
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          sourceMap: false,
          parallel: 8,
          output: {
            comments: false
          },
          compress: {
            warnings: false
          }
        }
      })
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    host: "0.0.0.0",
    port: 9876,
    disableHostCheck: true,
    proxy: {
      "/accountweb/**": {
        target: "http://192.168.11.37:8080/",
        // pathRewrite:{'^/kaihu' : '/accountweb'},
        changeOrigin: true,
        secure: false
      }
    }
  }
};

module.exports = webpack_config;
