# 自定义组件

小程序有许多的[内置组件](https://developers.weixin.qq.com/miniprogram/dev/component/)，比如之前学习过的 `view`、`image`、`scroll-view`、`swiper`等，除此之外小程序也允许开发者自定义组件。

## 5.1 组件基础

自定义组件的结构与页面是一致的，即也包含有4个部分，分别为:

- `.wxml` 组件的布局结构
- `.js` 组件的处理逻辑
- `.json` 组件的配置文件
- `.wxss` 组件的布局样式

### 5.1.1 创建组件

通常习惯将组件放到独立的目录 `components` 当中，这个目录需要我们手动进行创建。

创建一个叫 `authorization` 的组件来学习组件创建的步骤，在 `components` 目录中新建 `authorization` 目录，然后在右键在菜单中找到【新建 Component】，输入**组件名称**后会自动创建组件。

![创建组件](./assets/component/picture_2.jpg)

组件和页面的结构是一致的，但也是有区别的，先简单有个了解：

- 组件的配置文件中配置项 `component: true`
- 组件的 `.js` 文件中调用 `Component` 函数

### 5.1.2 注册组件

组件的注册分为页面注册和全局注册两种情况：

页面注册是在使用组件的页面配置中通过 `usingComponents` 进行注册，只能在当前页面中使用注册的组件，如下代码所示：

```json
{
  "usingComponents": {
    "authorization": "/components/authorization/index"
  }
}
```

```xml
<!-- pages/index/index.wxml -->
<!-- 双标签用法 -->
<authorization></authorization>
<!-- 单标签用法(一定要闭合) -->
<authorization />
```

全局注册是在 `app.json` 文件中通过 `usingComponents` 对自定义组件进行注册，注册的组件可以任意页面中使用全局注册的组件，如下代码所示：

```json{4-6}
{
  "pages": [...],
  "window": {...},
  "usingComponents": {
    "authorization": "/components/authorization/index"
  },
  "sitemapLocation": "sitemap.json"
}
```

以上示例重点演示了组件的创建及注册步骤，组件功能并不同我们的重心，因此关于组件的布局结构、样式以并未详细展开，不过关于布局和样式部分和页面并没有太大的差别，同学们课下自行练习一下。

## 5.2 组件进阶

本节来学习如何处理组件的逻辑。

### 5.2.1 数据与属性

组件的数据由两部分构成：

- `data` 组件本身内部定义的数据
- `properties` 通过组件属性从外部传入组件内部的数据（类似 Vue 的 props）

```javascript
// components/authorization/index
Component({
  // 初始组件内部数据
  data: {
    message: '组件中初始的数据'
  },
  // 定义组件的属性，接收外部传入的数据
  properties: {
    isLogin: {
      type: Boolean,
      value: true,
    },
    tips: String,
  },
})
```

上述代码中 `properties` 中定义了两个属性分别为 `isLogin` 和 `tips`，在应用组件时传入数据：

```xml
<authorization is-login="{{false}}" tips="用户未登录"></authorization>
```

::: tip 提示
应用组件属性名采用 kebab-case 命名法，即 `is-login` 这种形式，而在组件定义 `properties` 时采用的是小驼峰命名法，即 `isLogin`。
:::

查看或调试传入组件的数据与页面数据的查看方式不同，具体查看如下图所示：

![创建组件](./assets/component/picture_3.jpg)

### 5.2.2 生命周期和方法

前面我们分别学习了应用级别和页面级别的生命周期，组件也有生命周期函数，通过 `lifetimes` 来定义，主要的生命周期函数有：

- `created` 组件实例刚刚被创建好时，`created` 生命周期被触发，该生命周期中无法调用 `setData`，一般为组件添加一些自定义属性字段。

- `attached` 在组件完全初始化完毕、进入页面节点树后，`attached` 生命周期被触发。

```javascript{15-25}
// components/authorization/index.js
Component({
  data: {
    message: '组件中初始的数据',
  },
  properties: {
    isLogin: {
      type: Boolean,
      value: true,
    },
    tips: String,
  },

  // 组件生命周期
  lifetimes: {
    created() {
      // this.setData({message: '此时不能调用 setData'})
      // 为当前组件实例自定义属性 author
      this.author = 'itcast';
    },
    attached() {
      // 没有什么限制了，可以执行任意的操作
      this.setData({ message: '组件进入到页面节点了...' });
    },
  },
});
```

为了帮助大家理解可以对照 `Vue` 来学习，`create` 与 `Vue` 组件的 `create` 比较接近，`attached` 与 `Vue` 组件中的 `mounted` 比较类似，在处理一般情的逻辑时 `attached` 使用较多一些。

接下来学习如何在组件中定义方法，在组件中定义方法与页面也有所不同，组件中的方法必须要定义在 `methods` 属性当中：

```javascript{11-14,18-24}
// components/authorization/index.js
Component({
  data: {
    message: '组件中初始的数据',
  },
  properties: {...},
  // 组件生命周期
  lifetimes: {
    created() {...},
    attached() {
      // 检测用户登录状态
      const isLogin = this.checkLogin();
      // 更新渲染
      this.setData({ isLogin });
    },
  },

  methods: {
    // 假设有个方法用于检测登录
    checkLogin() {
      // 读取本地存储的数据
      return !!wx.getStorageSync('token');
    },
  },
});
```

### 5.2.3 组件模板

小程序的组件模板其实就是插槽功能，通过 `<slot>` 在组件内部定义插槽位置，以 `authorization` 组件为例其用法如下所示：

在组件内定定义 `slot` 插槽，插槽其实就是个占位符号

```xml
<view class="container">
  <slot wx:if="{{isLogin}}"></slot>
  <text wx:else>{{message}}</text>
</view>
```
在首页面应用组件并在组件开始和结束位置中间插入内容，被插入的内容就会被渲染到插槽的位置上：

```xml
<authorization is-login="{{true}}" tips="用户未登录">
  <view>这里的内容会填充到 slot 插槽的位置</view>
  <view>这里内容也会填充到 slot 插槽的位置</view>
</authorization>
```

默认情况小程序在一个组件中只能支持一个插槽，如果需要多个插槽需要启用多 `slot` 支持，启用方式如下所示：

```javascript
Component({
  options: {
    // 启用多插槽支持
    multipleSlots: true
  }
  // ...
})
```

启用了多插槽支持后通过 `name` 为插槽命名：

```html{2,6}
<view class="container">
  <slot name="content" wx:if="{{isLogin}}"></slot>
  <text wx:else>{{message}}</text>
</view>
<view class="layout">
  ￥<slot name="number"></slot>
</view>
```

在应用组件时通过 `slot` 属性指定将内容放入哪个插槽的位置：

```xml{2,6}
<authorization is-login="{{true}}" tips="用户未登录">
  <view slot="content">
    <view>这里的内容会填充到 slot 插槽的位置</view>
    <view>这里内容也会填充到 slot 插槽的位置</view>
  </view>
  <text slot="number">1000</text>
</authorization>
```


## 5.3 Vant 组件

Vant 提供了微信小程序版本的[组件库](https://vant-contrib.gitee.io/vant-weapp/#/home)，它本质上就是自定义的小程序组件，我们来学习如何在小程序中引入 Vant 组件库。

### 5.3.1 快速上手

第 1 步：安装 vant 组件库

```bash
npm i @vant/weapp -S --production
```

第 2 步：如下图所示构建 Vant 组件库，构建时会去检查 `package.json` 中记录的依赖，因此务必何证 `package.json` 文件的存在。

![构建npm](./assets/component/picture_5.jpg)

第 3 步：以按钮组件为例，演示使用 Vant 组件的使用方法，推荐全局注册组件 Vant 组件

```json
{
  "usingComponents": {
    "van-button": "@vant/weapp/button/index"
  }
}
```

在使用 Vant 组件时需要将小程序全局配置中的 `style` 去掉：

![Vant组件](./assets/component/picture_7.jpg)


### 5.3.2 Cell 单元格

首先要在 `app.json` 中全局注册组件：

```json
{
  "usingComponents": {
    "van-cell": "@vant/weapp/cell/index",
    "van-cell-group": "@vant/weapp/cell-group/index"
  }
}
```

`van-cell` 组件可以独立使用，也可以配置 `van-cell-group` 一起使用：

```xml
<van-cell-group custom-class="cell-group" inset>
  <van-cell size="large" title="北京富力家园">
    <text class="tags fail">审核失败</text>
  </van-cell>
  <van-cell title="房间号" value="1号楼1单元101室" border="{{ false }}" />
  <van-cell title="业主" value="内容" border="{{ false }}" />
</van-cell-group>
```

### 5.3.3 SwipeCell 滑动单元格

同样的先在 `app.json` 中全局注册组件：

```json{5}
{
  "usingComponents": {
    "van-cell": "@vant/weapp/cell/index",
    "van-cell-group": "@vant/weapp/cell-group/index",
    "van-swipe-cell": "@vant/weapp/swipe-cell/index"
  },
}
```

然后将需要侧向滑动的盒子用 `van-swipe-cell` 组件包裹起来即可：

```xml{1,9,10}
<van-swipe-cell right-width="{{ 65 }}">
  <van-cell-group>
    <van-cell size="large" title="北京富力家园">
      <text class="tags fail">审核失败</text>
    </van-cell>
    <van-cell title="房间号" value="1号楼1单元101室" border="{{ false }}" />
    <van-cell title="业主" value="内容" border="{{ false }}" />
  </van-cell-group>
  <view slot="right">删除</view>
</van-swipe-cell>
```

### 5.3.4 样式覆盖

Vant 组件中的组件提供了非常整齐美观的样式，但是开发中在所难免需要对原有样式进行个修改，官方介绍了3种方式来覆盖原来的样式：

1. 简单粗暴，通过调试工具查找要修改样式的盒子，找到已定义的类名，然后强制覆盖原有的样式

```css
.van-swipe-cell__right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px !important;
  margin-left: -20px;
  text-align: center;
  color: #fff;
  background-color: #eb5757;
}
```

2. 通过外部样式类

Vant 大部分组件都支持 `custom-class` 来指定一个类名，通过这个类名来修改组件根节点的样式，以 `van-cell-group` 为例：

```xml
<van-cell-group custom-class="cell-group">
  <van-cell size="large" title="北京富力家园">
    <text class="tags fail">审核失败</text>
  </van-cell>
  <van-cell title="房间号" value="1号楼1单元101室" border="{{ false }}" />
  <van-cell title="业主" value="内容" border="{{ false }}" />
</van-cell-group>
```
上述代码中 `van-cell-group` 组件使用 `custom-class` 指定了一个类名 `cell-group`，其样式如下所示：

```css
.cell-group {
  margin-bottom: 20rpx !important;
}
```

::: tip 提示:
在进行样式覆盖时优先不够的情况下使用 !important
:::

3. 使用样式变量

新版本的 css 支持定义变量，其语法样式为: `--变量名: 值`，定义的变量通过 `var` 关键字来使用：

举例说明：

```css
.box {
  --my-cusotm-color: pink;
  backgound-color: var(--my-cusotm-color);
}
```

上述代码中定义的变量只能用在 `.box` 盒子及后代元素上，如果希望整个页面都能使用这个变量，可以这样定义：

```css
page {
  --my-cusotm-color: pink;
}

.box {
  backgound-color: var(--my-cusotm-color);
}

.navs {
  backgound-color: var(--my-cusotm-color);
}
```

了解了 css 变量的基本用法后，咱们修改 vant 中 css 变量覆盖原来样式：

```css
page {
  --cell-large-title-font-size: 30rpx;
  --cell-text-color: #c3c3c5;
  --cell-value-color: #686868;
}
```