---
title: 【修机】Win11白屏闪烁故障原因及解决方法
date: 2023-10-02 21:14:21
tags:
  - PC
  - Fixing
  - Solution
  - 修机
  - Windows
categories: 修机
---

# Win11 白屏闪烁故障原因及解决方法

## 故障演示

<iframe src="//player.bilibili.com/player.html?aid=449210841&bvid=BV1jj411b7dz&cid=1286850679&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 500px; max-width: 100%；align:center; padding:20px 0;"> </iframe>

## 故障原因

一句话概括：KB5022913 补丁和 startallback 插件有冲突引起的

参考链接：

- https://www.chiphell.com/thread-2500922-1-1.html
- https://www.chiphell.com/thread-2500697-1-1.html

## 解决方案

强制重启三次电脑，自动进入安全模式后，卸载 KB5022913 补丁或 startallback 插件即可

也可进入 PE 进行卸载。
