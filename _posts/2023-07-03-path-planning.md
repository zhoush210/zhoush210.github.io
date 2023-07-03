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

# 分类

1. 基于图结构：Dijkstra、A\*、D\*
2. 基于采样：PRM、RRT

# Dijkstra算法
算法原理：假如P(A,F)是A到F的最短路径，D是该最短路径上的某个点，那么P(A,D)必定也是A到D的最短路径。按照这个结论，只要不断搜索**从出发点到其他点的最短路径**，就能得到所需的求解路径。
<img src="/img/in_post/path-planning/1.png" width="80%">
算法流程：
1. 根据与当前节点有直接关系的节点，计算起点与各节点的最近路径
2. 访问未访问节点中离起点距离最短的节点，回到步骤1
3. 直至所有节点均被访问
<img src="/img/in_post/path-planning/2.png" width="100%">

# A算法

# A*算法

# RRT

# gtsp

# 参考
- 《机器人SLAM导航：核心技术与实践》张虎，机械工业出版社
- [知乎：路径规划该如何入门? ​](https://www.zhihu.com/question/356961141/answer/2968725974)
- 各种算法demo：[github/zhm-real/PathPlanning](https://github.com/zhm-real/PathPlanning)
- 仿真平台：[PathFinding](https://qiao.github.io/PathFinding.js/visual/)（如果演示过程中卡住，可以先点一下别的标签页，再点一回原标签页。或者先将浏览器最小化，再复原）
- [Introduction to the A* Algorithm](https://www.redblobgames.com/pathfinding/a-star/introduction.html)
- [csdn：路径规划算法学习参考资料](https://blog.csdn.net/Draonly/article/details/111458844)
