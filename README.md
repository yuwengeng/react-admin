# react-guli

1.1. 项目描述/技术选型

1) 此项目为一个前后台分离的后台管理的 SPA, 包括前端 PC 应用和后端应用
2) 包括用户管理 / 商品分类管理 / 商品管理 / 权限管理等功能模块
3) 前端: 使用 React 全家桶 + Antd + Axios + ES6 + Webpack 等技术
4) 后端: 使用 Node + Express + Mongodb 等技术
5) 采用模块化、组件化、工程化的模式开发

1.2. 项目功能界面

[灵活运用JS开发技巧](https://juejin.im/post/5cc7afdde51d456e671c7e48?tdsourcetag=s_pctim_aiomsg)

- SPA应用 + 配合懒加载 解决首次加载时间长问题
本项目使用的是 react-loadable，它可以用很简单的方式实现路由的懒加载，设置延迟时间、加载动画、服务端渲染等功能

- 不eject配置webpack
[customize-cra](https://github.com/arackaf/customize-cra/blob/master/api.md)
const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(    
   addWebpackAlias({        
       ['@']: path.resolve(__dirname, 'src')   
   })
)
### 项目简介
脚手架快速构建，基于 [`React`]生态系统搭建的后台管理系统模板。实现了登陆/注销、路由懒加载、`axios`封装、简单权限管理等功能，它可以帮助你快速生成管理系统模板，你只需要添加具体业务代码即可

> 线上预览地址 [预览地址](https://ltadpoles.github.io/)
>[代码地址](https://github.com/ltadpoles/react-admin)

#### 基本功能

- [x] 路由懒加载
- [x] 面包屑导航
- [x] 常用 `UI` 展示
- [x] `echarts` 全屏展示
- [x] 登陆/注销功能
- [x] `axios` 封装
- [x] 简单权限管理

#### 项目结构

```
├── public                   # 不参与编译的资源文件
├── src                      # 主程序目录
│   ├── api                     # axios 封装
│   ├── assets                  # 资源文件
│   │   ├── font                    # 字体文件
│   │   └── images                  # 图片资源
│   ├── components              # 全局公共组件
│   │   ├── CustomBreadcrumb        # 面包屑导航
│   │   └── CustomMenu              # menu 菜单
│   ├── contatiners             # 页面结构组件
│   ├── routes                  # 路由目录
│   ├── store                   # redux 配置
│   ├── style                   # 样式目录
│   ├── utils                   # 工具类
│   ├── views                   # UI 页面
│   ├── APP.js                  # App.js
│   └── index.js                # index.js
├── .prettierrc.js           # 代码规范
├── config-overrides.js      # antd 样式按需加载
```

#### 懒加载

作为一个 `SPA` 级应用，有很多优势（响应速度更快、良好的前后端分离等等），但是也存在很多缺陷，首次加载耗时过长就是我们不得不面对的问题

其实从 `webpack4.0` 开始，它本身已经实现了按需加载组件，但是也有它自己的一些规则（比如文件大小），所以我们还是需要对页面的首次加载进行一些处理，而路由就是一个很好的切入点
本项目使用的是 [`react-loadable`](https://github.com/jamiebuilds/react-loadable)，它可以用很简单的方式实现路由的懒加载，设置延迟时间、加载动画、服务端渲染等功能

```
import Loadable from 'react-loadable';
import Loading from './my-loading-component'; // 这里可以放置你的 loading

const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```

当然，你也可以使用 `React.lazy` 和 `Suspense` 技术（[传送门](https://zh-hans.reactjs.org/docs/code-splitting.html)），不过，它不支持服务端渲染

### 登录逻辑

一般是将用户的登录信息存储在 `localStorage`中，注销的时候清除 `localStorage`

关于 `token` 可以直接存在本地，后台设定一个过期时间就可以了

还有一种情况就是用户登录之后，但是由于长时间没有操作导致 `token` 过期了，这个时候可能就会出现两种选择
- 让用户直接跳转到登录页面重新登录
- 查看本地是否存储了用户信息，如果有就更新用户的 `token` ，让其继续操作，反之则跳转到登录页面（这个取决于你将用户信息存储在哪里）

当然，具体要怎么做，还是取决于产品的需求，这里只是提供一种思路

### axios 封装

项目使用 `axios` 与后台进行交互，封装的部分有添加请求拦截器、响应拦截器、设置响应时间以及将 `token` 添加到请求头等功能

```js
import axios from 'axios'

// 这里取决于登录的时候将 token 存储在哪里
const token = localStorage.getItem('token')

const instance = axios.create({
    timeout: 5000
})

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // 将 token 添加到请求头
        token && (config.headers.Authorization = token)
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        // 相应错误处理
        // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
        switch (error.response.status) {
            case 401:
                break
            case 403:
                break
            case 404:
                break
            case 500:
                break
            default:
                console.log('其他错误信息')
        }
        return Promise.reject(error)
    }
)

export default instance

```

这里并没有对 `baseUrl` 进行设置，主要是考虑到项目中可能存在不止一个 `url`，比如图片这些资源可能存在七牛云或者阿里云这样的服务器上面，而后台接口又是另外一个`url` 了。所以添加了一个 `config` 文件，导出各个 `url`

```js
// 考虑到网站可能有好几个域名，所以单独提出来
export const API = 'http://rap2api.taobao.org/app/mock/234047'
export const URLAPI = ''
```

调用接口的时候就可以直接这样

```js
import {API} from './api/config'
import axios from './api'

axios.get({
    url: API + '/login'
})
```

当然，如果你并没有这样的需求，你完全可以取消 `config` 这个文件，将 `baseUrl` 一并封装进去

同样的，也并没有对常用的请求比如 `get` 、`post` 等进行封装，因为使用这些方式的时候可能会对数据做一些特定的操作，比如序列化等等，所以个人感觉意义并不是很大

#### 跨域

如果没有 将 `webpack` 的配置暴露出来，可直接在 `package.json` 中配置 `proxy`
```js
"proxy": {
    "/api": {
      "target": "http://100.100.100.100", //后端地址
      "changeOrigin": true
    }
 }
```
### 权限功能基本上是后台管理项目中不可或缺的部分

一般情况下，权限的控制体现在页面级别以及按钮级别（用户是否可以访问某个页面或者操作某个按钮，比如新增、删除），这个权限在用户注册、分配或者后期超级管理员更改的时候确定

#### 权限控制，具体实现方式：

- 用户登录，从后台获取注册时的角色（权限标识）
- 通过权限标识，对注册的 `menu` 菜单进行过滤，渲染到页面
```js
getMenu = menu => {
        let newMenu,
            auth = JSON.parse(localStorage.getItem('user')).auth // 获取存储的用户权限标识
        if (!auth) {
            return menu
        } else {
            // 过滤注册的 menu
            newMenu = menu.filter(res => res.auth && res.auth.indexOf(auth) !== -1)
            return newMenu
        }
    }
```
- 通过权限标识，对注册的路由数组进行过滤
```html
{routes.map(item => {
    return (
        <Route
            key={item.path}
            path={item.path}
            exact={item.exact}
            render={props =>
                !auth ? (
                    <item.component {...props} />
                ) : item.auth && item.auth.indexOf(auth) !== -1 ? (
                    <item.component {...props} />
                ) : (
                    // 这里也可以跳转到 403 页面
                    <Redirect to='/404' {...props} />
                )
            }></Route>
    )
})}
```
- 按钮权限，直接使用权限标识判断可否操作，隐藏或者展示即可

说明：这里对注册的路由数组进行过滤这一步进行说明，一般情况下前端路由都是提前注册好的，就算没有 `menu` 菜单导航，如果我们在地址栏直接输入路径也是可以访问的，这里进行一次过滤之后就可以避免这种情况。当然，我们也可以给每一个权限设定一个**可以访问的路径数组**，通过比较跳转的地址**是否存在这个数组当中**来进行相应的展示

#### 后台控制

- 用户登录，拿到需要展示的 `menu` 数组，直接渲染到页面（对菜单的筛选由后台完成）
- 通过权限标识，判断用户有没有某个按钮的操作权限

至于用户在地址栏直接输入地址去访问，这里有两种情况：

- 如果用户没有访问某一个页面的权限，那么使用其 `token` 请求后台数据的时候一定是不成功的，我们可以将这一个操作封装在 `axios` 请求中，通过不同的状态码进行页面跳转
- 我就是访问了一个没有请求的页面（这个页面还不给没权限的人看），那我们就采用过滤权限数组的方式对其操作进行阻止

当然，这里的第二种情况很少见…

---
### 第三方组件

#### 动画
 [`Animate.css`](https://github.com/daneden/animate.css) 动画库

```js
// 下载
yarn add animate.css

// link标签引入
<link rel="stylesheet" href="animate.min.css">
// 或者 import 引入
import 'animate.css'
```
然后在需要的盒子上面添加相应的类名即可，可以设置入场、离场动画，也可以设置动画时间、延时等

#### 富文本

富文本编辑器使用的是 `Antd` 官方推荐的 [`braft-editor`](https://github.com/margox/braft-editor)

> 一个基于`draft-js`的`Web`富文本编辑器，适用于`React`框架，兼容主流现代浏览器

```js
// 引入
import BraftEditor from 'braft-editor'

// 可以使用 BraftEditor.createEditorState 方法来将 raw 或者 html 格式的数据转换成 editorState 数据
editorState: BraftEditor.createEditorState('你好,<b>可爱的人! 很幸运在这里与你相遇!</b>')
```
更多具体的组件属性及实例方法，可以参考其文档 [传送门](https://www.yuque.com/braft-editor/be/gz44tn)

#### echarts

`echarts` 百度的文档很清晰，这里单独提出来主要记录开发过程中遇到的一个问题

在页面窗口变化的情况下我们可以使用 

```js
window.addEventListener('resize', function() {
    myChart.resize()
})
```
这种方式保证 `echarts` 的正常自适应

可是当我们在点击菜单收缩展开按钮的时候并不会触发 `window.resize` 方法，其实页面盒子的宽度已经发生了变化，只是 `echarts` 的 `resize` 事件已经触发结束了，这个时候我们只需要在 `componentDidUpdate` 这个生命周期中注册一个定时器延时触发 `resize` 事件就解决了，只是别忘了在 `componentWillUnmount` 生命周期中清除掉这个定时器

#### 加载进度条

加载进度条使用的是 [`nprogress`](https://github.com/rstacruz/nprogress) 

// 引入
import NProgress from 'nprogress'
// 开始加载
NProgress.start();
// 加载结束
NProgress.done();
// 移除进度条
NProgress.remove();
```

#### 全屏插件

全屏功能使用的是 [`screenfull`](https://github.com/sindresorhus/screenfull.js/) 插件

```js
if (screenfull.isEnabled) {
	screenfull.request(); // 全屏
}
.exit() // 退出
.toggle() // 可切换
```

也可以给它 注册 `change` 事件

```js
if (screenfull.isEnabled) {
	screenfull.on('change', () => {
		console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
	});
}
```
但是别忘了移除掉这个事件
```js
screenfull.off('change', callback);
```

#### 代码格式统一

`Create React App` 提供了一组最常见的错误规则，在开发运行时会有错误信息提示，

如果你也想在代码书写的时候就提示错误可以进行下面这个步骤： `Eslint` 规则，

yarn add eslint
```
> 添加一个 `.eslintrc.js` 文件或者在 `package.json` 文件中的 `eslintConfig` 对象中直接添加你需要使用的规则
更多规则可以[参考这里](https://note.youdao.com/)

项目中并没有使用 `eslint`，只是添加了 `pretter` 为项目统一了编码风格
至于如何在项目中集成 `pretter` ，具体的使用方式可以参考 [官方文档](https://www.html.cn/create-react-app/docs/setting-up-your-editor/)，这里就不在叙述了
