---
layout: post
title:  "ORB feature"
date:   2022-11-23 09:38:00 +0800
author:     "ZhouSh"
header-img: "img/in_post/ORB-feature/head.png"
header-mask: 0.4
tags:
    - SLAM
---
ORB特征由**关键点**和**描述子**两部分组成，关键点称为Oriented FAST，由FAST角点改进而来；描述子称为BRIEF（Binary Robust Independent Elementary Feature。下面先讲FAST，再介绍ORB。

## FAST

Fast是一种角点，主要检测局部像素灰度变化明显的地方，以速度快著称。步骤如下：

1. 在图像中选取像素p，假设它的亮度为Ip
2. 设置一个阈值T（如Ip的20%）
3. 以像素p为中心，选取半径为3的圆上的16个像素点
4. 如果选取的圆上有连续N个点亮度大于Ip+T或小于Ip-T，则像素p可被认为是特征点（N通常取9、11、12,被称为FAST-9、FAST-11、FAST-12）
5. 循环以上4步，对每个像素执行相同操作

为了更高效，可添加预测试操作，以快速排除绝大多数不是角点的像素。即直接检测领域圆上的第1、5、9、13个像素的亮度，只有这4个有3个亮度大于Ip+T或小于Ip-T，才可能是一个角点。

<img src="/img/in_post/ORB-feature/1.png" width="60%">

原始的FAST角点容易扎堆，所以在第一遍检测之后，还需要用非极大值抑制，在一定区域内仅保留最大点（ORB-SLAM中使用四叉树分裂得到更均匀的ORB分布）。

### FAST的问题

1. 数量：FAST角点数量很大且不确定
2. 方向：不具有方向信息
3. 尺度：存在尺度问题（由于固定取半径为3的圆，远看像角点的地方，接近看可能就不是角点）

## ORB

针对FAST存在的问题作出改进：

1. 数量：指定要提取的角点数N，对FAST角点分别计算Harris相应值，选取前N个最大相应值的角点
2. 方向：由灰度质心法（Intensity Centroid）计算旋转角，再根据旋转角旋转到统一方向
3. 尺度：构建图像金字塔，并在金字塔的每一层上检测角点实现尺度不变性（在ORB-SLAM中）

### Oriented FAST

灰度质心法：以图像块几何中心到灰度质心的向量作为特征方向

<img src="/img/in_post/ORB-feature/2.png" width="60%">

### Steer BRIEF

BRIEF是一种二进制描述子，其中的0和1编码了关键点附近两个像素p和q的大小关系。p和q按照某种分布随机选取，在ORB-SLAM2源码中，写死了一种pattern，是通过神经网络的训练，发现的一种效果很好的点对pattern。

<img src="/img/in_post/ORB-feature/3.png" width="60%">

原始的BRIEF不具有旋转不变性，因此在图像发生旋转时容易丢失，而ORB在Oriented FAST中计算了关键点的方向，所以可以利用该方向计算旋转之后的Steer BREIED使其具有旋转不变性。即将图像块根据计算出的方向进行旋转，使得所有特征拥有统一的方向，在此基础上描述就避免了旋转带来的差异。

<img src="/img/in_post/ORB-feature/4.png" width="60%">

## 参考
- 《slam十四讲》
- 《ORB : an efficient alternative to SIFT or SURF》