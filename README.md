# 使用以下方法安装

```
npm install -g webpack@3.6.0 webpack-dev-server@2.9.1 https://github.com/bluers/vug-cli.git
```

# API

```
vug     	# 显示可用API
vug init 	# 初始化项目目录（默认为fe)
vug start	# 执行菜单列表
vug upgrade # 更新vug工具

```

# 运行开发服务器
1. 执行vug-start，选择4，启动开发服务器
2. 控制台输入
   ```
	 npm run dev
	 ```

# 编译代码
1. 执行vug-start，选择6，编译全部文件
2. 控制台输入
   ```
	 npm run build
	 ```

# 注意事项  && 常见问题

1. 执行vug-start，启动开发服务器时，出现错误 "Cannot find module 'webpack'"

	继续执行vug-start，选择安装依赖包。

# 开发者注意事项

1. 每次更新需为一项完整功能，并在commit log中注明

2. 版本号规则是x.x.x，遵循GNU版本规则[http://blog.chinaunix.net/uid-22556372-id-1773412.html]

3. 更新版本提交后，需要<font color='#0099ff'>手动修改</font>package.json中的版本id（bundleid）,同时可选择性的更新版本号(version)，类似android中的bundleid及version。以及必须手动修改package.json中的版本号</font>，同时<font color='#0099ff'>生成一个tag名为当前bundleid</font>。
	例如版本号为1.0.2,bundleid为10，则tag为10。vug-cli将使用package.json与远程vug-cli库进行bundleid对比，非最新版本将再有网状态下自动升级。

```
	操作方式分两步：
		1. 修改vug-cli库下的package.json => 新bundleid = 旧bundleid+1，新version = 旧version x.x.x，并推送
		2. git tag -a x.x.x -m '此处填写该版本的详细变化';git push --tags
```
