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

计算凸包的**朴素算法**：
<img src="/img/in_post/Computational-Geometry/1.png" width="100%">
- 退化情况：相对于由p和q所确定的直线,一个点r的位置并不是非左即右,有可能正好落在这条直线上。
- 舍入误差：由于计算过程中是浮点运算，必然存在舍入误差，影响测试精度。
- 时间复杂度为 $\mathcal{O}(n^3)$。

计算凸包的**递增式策略**：

按x坐标从左至右遍历顶点，计算出构成上凸包(upper hull)的那些顶点，再自右向左扫描,计算出下凸包(lower hull)。

若按照顺时针方向沿着多边形的边界行进,则在每个顶点处都要改变方向。若是凸多边形,则必然每次都是向右转。令$l_{upper}$为从左向右存放上凸包各顶点的一个列表，将$p_i$接在$l_{upper}$最后，再检查$l_{upper}$中最末尾的三个点,看它们是否构成一个右拐(right-turn)，若不是，就必须将中间的(即倒数第二个)顶点从上凸包中剔除出去。
<img src="/img/in_post/Computational-Geometry/2.png" width="100%">
<img src="/img/in_post/Computational-Geometry/3.png" width="100%">
- 当点x坐标相同时，按照y坐标对它们排序。
- 退化情况：将共线的点看成是构成一个左拐。
- 时间复杂度为 $\mathcal{O}(n\log n)$。

# 2.线段求交:专题图叠合

## 2.1.线段求交

依次检查每一对线段是否相交需要$\mathcal{O}(n^2)$时间。

为避免对所有的线段对进行测试，考虑只有那些相互靠近的线段，才可能相交，相距甚远的线段不可能相交。

首先可以通过**投影**，排除不可能相交的线段对。相当于用一条假想直线 $l$ 自上而下扫过整个平面，跟踪记录所有与之相交的线段，以找出所需的所有线段对。这类算法被称为**平面扫描算法**(plane sweep algorithm)，其中使用到的直线 $l$ 被称为**扫描线**(sweep line)。与当前扫描线相交的所有线段构成的集合，被称为**扫描线的状态**(status)。只有在某些特定的位置，才需要对扫描线的状态进行更新，我们称这些位置为平面扫描算法的**事件点**(event point)。就本算法而言，这里的事件点就是各线段的端点。只有在扫描线触及某个事件点的时候,算法才会进行实质的处理⎯⎯更新扫描线的状态,并进
行一些相交测试。
<img src="/img/in_post/Computational-Geometry/4.png" width="40%">
<img src="/img/in_post/Computational-Geometry/5.png" width="30%">

与同一扫描线相交的两条线段,在水平方向上仍然有可能相距很远。我们可以沿着扫描线,将与之相交的所有线段自左向右排序。只有当其中的某两条线段沿水平方向相邻时,才需要对其进行测试。