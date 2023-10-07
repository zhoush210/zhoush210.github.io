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
<img src="/img/in_post/coursera/Motion-Planning/1.png" width="30%">

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

## 练习

If you use the Grassfire or breadth first search procedure to plan a path through a grid from a node A to a node B, then you use the same procedure to plan a path from node B to node A, are the two paths guaranteed to be the same except in opposite directions?

Answer: No.

暂时没有想到例子，我认为都是有多条最短路径，就算运行2次都是从A到B，结果也会不同，而不是因为从B到A造成结果不同。我觉得这题的表述不对，出的不好。

## 2.1.Introduction to Configuration Space

配置空间（configuration space）是指描述机器人的自由度和可行动姿态的抽象空间。它是一个多维空间，其中每个维度表示机器人的一个自由度，例如关节角度或笛卡尔坐标。配置空间中的每个点都代表着机器人可能的姿态或配置。

机器人的配置空间是指由其全部可达到的配置（位置）所组成的一个集合。某机器人无法到达的特定$t_x$和$t_y$配置，被称为是配置空间障碍。
<img src="/img/in_post/coursera/Motion-Planning/4.png" width="60%">
<img src="/img/in_post/coursera/Motion-Planning/5.png" width="60%">
<img src="/img/in_post/coursera/Motion-Planning/6.png" width="60%">

## 2.2.RR arm
下图是一个拥有两个转动关节的简易二维机械臂，它的配置可以用转动角$\theta_1$和$\theta_2$组成的元组表示，两个角的活动范围均为0～360度，则右图是它的配置空间。
<img src="/img/in_post/coursera/Motion-Planning/7.png" width="60%">
<img src="/img/in_post/coursera/Motion-Planning/8.png" width="60%">

## 2.3.Piano Mover’s Problem

下面是一个可以在x、y方向平移，且可以旋转的机器人，其配置可以用$\{t_x,t_y,\theta\}$表示，其配置空间是3维的。
<img src="/img/in_post/coursera/Motion-Planning/9.png" width="70%">