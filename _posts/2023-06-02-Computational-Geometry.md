---
layout: post
title:  "Computational Geometry: Algorithms and Applications"
subtitle: "《计算几何》Mark de Berg"
date:   2023-6-2 10:51:00 +0800
author:     "ZhouSh"
header-img: "img/bg-guidao9.jpg"
header-mask: 0.2
tags:
    - 机器人笔记
---
- [《计算几何:算法与应用》pdf](https://search.zhelper.net/?[%7B%22name%22:%22zlib.app%22,%22url%22:%22https://worker.zlib.app%22,%22type%22:%22full%22,%22sensitive%22:false,%22detail%22:false,%22download%22:%22https://worker.zlib.app/download/%22%7D]#%E8%AE%A1%E7%AE%97%E5%87%A0%E4%BD%95%E2%80%94%E2%80%94%E7%AE%97%E6%B3%95%E4%B8%8E%E5%BA%94%E7%94%A8)
- 本书网站 [geobook](http://www.cs.uu.nl/geobook/) 提供了本书各版本的勘误、所有插图、所有算法的
伪代码,以及其它资源。

# 1.计算几何:导言
## 1.1.凸包的例子

**凸包**：凸包中的任意两点的连线段在凸包内部。

在计算机科学和数学中，**退化情况**（Degenerate Case）指的是问题或情况变得异常简单或特殊，以至于常规的算法或方法无法适用或失去有效性。在这种情况下，问题的某些参数或条件会导致解决方案变得不明确、不唯一或无法得到正确的结果。

计算凸包的朴素算法：
<img src="/img/in_post/Computational-Geometry/1.png" width="100%">
