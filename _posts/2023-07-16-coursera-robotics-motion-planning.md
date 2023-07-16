---
layout: post
title:  "Robotics: Computational Motion Planning"
subtitle: "Coursera 笔记"
date:   2023-7-16 9:57:00 +0800
author:     "ZhouSh"
header-img: "img/bg-guidao9.jpg"
header-mask: 0.2
tags:
    - 机器人笔记
---

[coursera 课程链接](https://www.coursera.org/learn/robotics-motion-planning)

# Graph-based Path Planning

## 1.2.Grassfire Algorithm 
1. 将终点标记为0
2. 将终点周围所有离终点1步之遥的点标记为1
3. 将所有离终点2步之遥的点标记为2
4. 如此递增，直至起点被标记
5. 从起点依次寻找标记递减的点到终点，遇到相同标记的点可以任选其一
<img src="/img/in_post/coursera/Motion-Planning/1.png" width="40%">

网格中的数字代表“这个点抵达目的地节点的最小步数“，这些数字由目的地节点向外辐射的模式，就像火势蔓延一样，所以叫Grassfire。

## 1.3.Dijkstra's Algorithm

Dijkstra就是Grassfire在有权图上的扩展！好妙啊！
1. 将起点标记为0
2. 更新与当前节点相连的点到起点的最近距离
3. 如此递增，直至所有点都被访问
<img src="/img/in_post/coursera/Motion-Planning/2.png" width="40%">

和wxc讨论“一个新算法”，如果不将结束条件设置为“所有点都被访问”，而是“访问过的所有端点到起点的距离都大于终点到起点的距离”，可提前终止，减少搜索空间。不知道是不是有这么一种算法，叫什么名字。

## 1.4: A\* Algorithm

代价函数=实际代价+估计代价(启发函数)
<img src="/img/in_post/coursera/Motion-Planning/3.png" width="40%">

> Dijkstra和A\*详见之前的博文：[路径规划常用算法](https://zhoush210.github.io/2023/07/03/path-planning/)