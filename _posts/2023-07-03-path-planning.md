---
layout: post
title:  "路径规划常用算法"
subtitle: ""
date:   2023-7-3 11:30:00 +0800
author:     "ZhouSh"
header-img: "img/bg-guidao9.jpg"
header-mask: 0.2
tags:
    - 机器人笔记
---

# 算法分类

1. 基于图结构：Dijkstra、A\*、D\*
2. 基于采样：PRM、RRT

# Dijkstra算法

<img src="/img/in_post/path-planning/Dijkstra.gif" width="50%">
**算法原理：**假如P(A,F)是A到F的最短路径，D是该最短路径上的某个点，那么P(A,D)必定也是A到D的最短路径。按照这个结论，只要不断搜索**从出发点到其他点的最短路径**，就能得到所需的求解路径。
<img src="/img/in_post/path-planning/1.png" width="70%">
**算法流程：**
1. 根据与当前节点有直接关系的节点，计算起点与各节点的最近路径
2. 访问**未访问节点**中离起点距离最短的节点，回到步骤1
3. 直至所有节点均被访问
<img src="/img/in_post/path-planning/2.png" width="100%">

# A*算法

<img src="/img/in_post/path-planning/Astar.gif" width="50%">
**算法原理：**在代价函数中加入**该节点到目标节点**的估计代价（启发函数），降低搜索节点的范围。

$
f_{代价函数}(x)=g_{实际代价}(x)+h_{估计代价(启发函数)}(x)
\tag{1}
$

$
h(x)<cost^*(x,target)
\tag{2}
$

算法流程同Dijkstra，仅在计算距离（代价）时有差别。估计代价h(x)越小，搜索节点的范围越大。当估计代价h(x)为0时，A\*算法退化为Dijkstra算法。但估计代价h(x)也不能过大，必须满足式（2），才能保证A\*算法的完备性。

h(x)的常见形式有曼哈顿距离、对角线距离、欧氏距离等。当栅格地图中只允许向4个方向（上、下、左、右）移动时，选用**曼哈顿距离**；当栅格地图中允许向8个方向（上、下、左、右、左上、左下、右上、右下）移动时，选用**对角线距离**；当栅格地图中允许向任意方向移动时，选用**欧氏距离**。

<img src="/img/in_post/path-planning/3.png" width="70%">

# PRM算法

**算法原理：**全名Probabilistic Road Map，也称概率路线图算法，将机器人所处的连续空间用**随机采样**离散化，再在离散采样点上进行路径搜索。

**算法流程：**
1. 随机采样：在地图上抛撒一些随机点，利用这些随机点对地图中的连续空间进行离散化
2. 移除无效采样点：将落在障碍物上的采样点删除
3. 连接：按照最近邻规则将采样点与周围相邻点进行连接
4. 移除无效连接：将横穿障碍物的连接删除，这样就构建出了所谓的PRM路线图
5. 添加导航任务的源节点和目标节点：将源节点和目标节点与PRM路线图相连
6. 搜索路径：在构建出来的PRM路线图上利用A*算法搜索源节点到目标节点之间的路径
<img src="/img/in_post/path-planning/4.png" width="100%">

# RRT算法

<img src="/img/in_post/path-planning/RRT_2D.gif" width="50%">
**算法原理：**全名Rapidly-Exploring Random Tree，快速搜索随机树，一边通过采样方式构建树结构，一边进行路径搜索。

**算法流程：**
1. 初始化：设置起始点作为树的根节点。
2. 随机采样：随机生成一个点，并将其作为新的目标点。
3. 扩展树：从树中找到距离新目标点最近的节点，然后在该节点和新目标点之间生成一条新的路径段。确保路径段不会穿越障碍物或违反运动约束。
4. 添加节点：将生成的新节点添加到树中。
5. 判断终止条件：检查新节点是否接近目标点，如果满足终止条件，则生成了一条可行路径。
6. 重复步骤2至步骤5，直到达到指定的迭代次数或找到了可行路径。
<img src="/img/in_post/path-planning/5.png" width="100%">

# 参考
- 《机器人SLAM导航：核心技术与实践》张虎，机械工业出版社
- [知乎：路径规划该如何入门? ​](https://www.zhihu.com/question/356961141/answer/2968725974)
- 各种算法demo：[github/zhm-real/PathPlanning](https://github.com/zhm-real/PathPlanning)
- 仿真平台：[PathFinding](https://qiao.github.io/PathFinding.js/visual/)（如果演示过程中卡住，可以先点一下别的标签页，再点一回原标签页。或者先将浏览器最小化，再复原）
- [Introduction to the A* Algorithm](https://www.redblobgames.com/pathfinding/a-star/introduction.html)
- [csdn：路径规划算法学习参考资料](https://blog.csdn.net/Draonly/article/details/111458844)
