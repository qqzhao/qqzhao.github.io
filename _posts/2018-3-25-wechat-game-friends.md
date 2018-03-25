---
layout: post
title: "微信小游戏关系链"
subtitle: "微信小游戏关系链的相关内容"
date: 2018-3-25
author: "qqzhao"
header-img: "img/bg-post.jpg"
catalog: true
tags: 
    - 微信
    - 小游戏
    - 关系链
---

# 微信小游戏关系链

### 引入

>微信小程序中可以使用关系链的地方很少，只有分享给个人，分享给群组，分享给群组仅限于知道是在同一个群里，基本无法获取群信息）。如果微信小游戏也这样弄，不能用关系链，那么游戏开发的空间就会少很多；况且之前火爆的跳一跳小游戏分明使用不少关系链。

前一段时间，微信小游戏开放的注册和开发，目前就差可以提交审核上线了，相信这也是迟早的事情。关系链的使用的相关的文档也开放出来了。下面就简单研究下。

### 使用

```js
/***********只能在 开放数据域 中调用************/
/*******************************************/
wx.getUserCloudStorage() //获取当前用户的托管数据
wx.getFriendCloudStorage() //获取当前用户也玩该小游戏的好友的用户数据
wx.getGroupCloudStorage()// 获取当前用户在某个群中也玩该小游戏的成员的用户数据

/*********可以同时在 主域 和开放数据域中************/
/*******************************************/
 wx.setUserCloudStorage() //可以将当前用户的游戏数据托管在微信后台。
 wx.removeUserCloudStorage() //删除用户托管数据中指定字段的数据
```

### 主域和开放数据域

可以看出微信为了避免关系链泄露，进行了域的隔离，分成了主域和开放数据域。
关于隔离，有以下两点：
* 代码层，主域和开放数据域中的代码不能相互 require
* 数据层，不能互相通信。开放数据域不能向主域发送消息；主域可以向开放数据域发送消息。

数据层隔离很容易理解，不能自己控制数据，存储到自己的后台。对于代码层，如果可以互相require，则不能达到隔离的目的。

#### 展示关系链数据的方法

使用两个域，并不影响将关系链的数据展示到用户的面前。展示的过程如下：
* 在开放域中通过关系链 API 获取到的用户数据，并处理
* 将数据绘制到 `sharedCanvas` 上.( `sharedCanvas` 是主域和开放数据域都可以访问的一个离屏画布。)
* 再在主域将 `sharedCanvas` 渲染上屏。

![]({{site.imagepath}}201803/data-flow.png)

#### 关于限制
* `sharedCanvas` 只能被绘制到上屏 `canvas` 上，不能被导出，即不能调用 toDataURL 和 getContext
* 上屏 `canvas`也不能被导出，即不能调用 `toDataURL`，其 `context` 不能调用 `getImageData`。
* 不能将上屏 canvas 和 sharedCanvas 以任意形式绘制到其他 canvas 上，包括 drawImage、createPattern、texImage2D、texSubImage2D。(其他可以导出)

说的更明白些，也就是：
* 不要有把关系链保存到服务器的想法
* 开放数据域 传出数据的唯一方法是，画图，传出来
* 即使是画图传递出来，显示出来，也禁止导出

<img src="{{site.imagepath}}201803/canvas-limit.png" width = "800"  alt="图标" />


#### 游戏数据

官方文档中对托管的数据有所限制：
* 每个openid所标识的微信用户在每个游戏上托管的数据不能超过128个key-value对。
* 上报的key-value列表当中每一项的key+value长度都不能超过1K(1024)字节。
* 上报的key-value列表当中每一个key长度都不能超过128字节

也即是目前每个小游戏中每个人可以有128K的空间，对于小游戏来说，应该足够了。但这样就不需要开发者搭建后台存游戏数据了吗？这里面如何取舍？这些问题还需要进一步研究。

### 参考

[1. 微信跳一跳微信好友排行怎么做的？](http://forum.cocos.com/t/topic/57106)

[2. 官方文档](https://mp.weixin.qq.com/debug/wxagame/dev/tutorial/open-ability/open-data.html?t=201832)

### 许可协议
* 本文遵守创作共享 <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/" target="_blank"><b>CC BY-NC-SA 3.0协议</b></a>
* 商业用途转载请联系作者