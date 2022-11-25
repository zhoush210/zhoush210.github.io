---
layout: post
title:  "论文笔记：cartographer"
subtitle: "Real-Time Loop Closure in 2D LIDAR SLAM"
date:   2022-11-25 09:05:00 +0800
author:     "ZhouSh"
header-img: "img/in_post/cartographer/head.png"
header-mask: 0
tags:
    - SLAM
---
论文：[Real-Time Loop Closure in 2D LIDAR SLAM](/doc/cartographer%20-%202016%20-%20Real%20time%20loop%20closure%20in%202D%20LIDAR%20SLAM%20-%20Hess%20et%20al.pdf)
## Abstract
为了实现实时的回环检测，cartographer使用**分支定界法**计算**scan-to-map**匹配作为约束
## Introduction
本文的重点是减少大量数据下回环所需的**计算量**
## Related work
### 匹配
- Scan-to-scan matching：累计漂移误差大
- Scan-to-map matching：累计漂移误差小，需要好的初始值，用高斯牛顿法找局部最优值
- Pixel-accurate scan matching：漂移误差小，但计算量大
    - 减少计算量的策略：通过laser特征提取匹配
    - 加强回环检测的策略：直方图统计匹配、提取laser特征、机器学习

> **scan to scan match**：两帧激光雷达数据之间的匹配。假如当前帧的激光雷达数据为A，和它匹配的另一帧激光雷达数据为B，如果以A为起始帧，B为目标帧，那么A经过一个相对平移和旋转变换到B，我们目的就是求出这个相对平移量和旋转角度。目前来说，匹配效果最好的算法就是ICP（Iterative Closest Point）方法，它充分利用了激光雷达每个数据点来进行匹配，后来所有ICP变种基本都是为了提高计算效率而演化的，如何减小循环次数加快收敛等等。[参考](https://www.jianshu.com/p/12cafbd14797)
>
> **scan to map match**：即激光雷达扫描数据直接与地图进行匹配，得到实际位置坐标[x,y,theta]。这种方式一边计算位置，一边把新扫描到的数据及时加入到先前地图中。[参考](https://www.jianshu.com/p/12cafbd14797)

### 减少局部累计误差
- 粒子滤波：对于grid-based SLAM，占用计算资源过多
- 基于图优化的SLAM：node表示位姿和特征，边表示观测约束

> **粒子滤波**：通过寻找一组在状态空间中传播的随机样本来近似的表示概率密度函数，用样本均值代替积分运算，进而获得系统状态的最小方差估计的过程，这些样本被形象的称为“粒子”，故而叫粒子滤波。[参考](https://baike.baidu.com/item/%E7%B2%92%E5%AD%90%E6%BB%A4%E6%B3%A2/2128986) ；[附一个非常生动的说明](https://zhuanlan.zhihu.com/p/161617286)
>
> **基于图优化的SLAM**：[参考](https://zhuanlan.zhihu.com/p/41424435)

## System overview
![img](/img/in_post/cartographer/system.png)
1. 将laser scan插入submap中最合适的位置，假设该位置短时间内足够准确
2. Scan matching针对于当前submap进行，所以只依赖于当前scan，会累积全局误差
3. 位姿优化：
  - 当submap完成后（即没有新scan插入submap），submap将进行扫描匹配以检测回环
  - 所有结束的submap和scan会自动进行回环
  - If they are close enough based on current pose estimates, a scan matcher tries to find the scan in the submap.（没理解指谁和谁比较，submap不是由scan组成的吗？包含的关系还能远吗？）
  - 若在当前估计位姿周围的搜索窗口中找到了较好匹配，则将其作为回环约束加入优化问题
  - 软约束：回环扫描匹配需比新增scan快一些，否则会有明显滞后
    - 通过branch-and-bound和子图预算栅格加速回环检测（如何实现？）

## Local 2D SLAM
- 局部slam和全局slam的优化对象都是 pose（ξ x , ξ y , ξ θ）
- 不平稳测量平台（如背包）需要结合IMU，获取雷达相对于重力的方向，以将scan映射到2D平面
- scan matching：用非线性优化对齐scan和submap，会产生累计误差，由全局方法消除

### A. scans
1. submap的构造是重复对齐scan和submap坐标系的迭代过程
2. scan坐标系--->submap坐标系：
<img src="/img/in_post/cartographer/1.png" width="60%">

### B. submaps
（翻译成子图的话，这里的图是map而不是graph，容易产生歧义）
1. submap由几个连续的scan构建
2. submap采用栅格地图的形式，每格边长5cm，每格的值表示该格阻塞(有障碍物)的概率
3. pixel：某格点周围一圈格点
4. 新增scan时，击中则更新击中点，为击中则更新一条射线
5. 更新每格概率：
<img src="/img/in_post/cartographer/2.png" width="60%">

### C. Ceres scan matchng
> 除第一个submap外，新增scan会插入相邻两个submap

将scan插入submap之前，需要用基于ceres的scan matcher根据当前局部submap优化pose ξ 
<img src="/img/in_post/cartographer/3.png" width="60%">
1. Tξ将hk由scan坐标系变换至submap坐标系
2. Msmooth是平滑函数，用双三次插值减小[0，1]外点的影响

> bicubic函数：
<img src="/img/in_post/cartographer/4.png" width="30%">

## Closing loops
1. 大空间通过创建许多小submap处理
2. 用稀疏位姿矫正（SPA）来优化所有scan和submap
3. 插入scan的相对位姿存储在内存中，将在优化回环时使用。
4. 一旦submap结束（不再新增scan），scan和submap就进行回环检测
5. Scan matcher在后台运行，一旦找到好的匹配，就将相对位姿加入优化问题

### A. Optimization problem
1. 回环优化和扫描匹配一样，也是一个非线性最小二乘问题
2. 每隔几秒，用ceres计算下述问题的解：（Sparse Pose Adjustment）
<img src="/img/in_post/cartographer/5.png" width="60%">
  - Em=ξmi (i=1,...,m)是submap位姿，Es=ξsj (i=1,...,s)是scan位姿，在给定约束条件下进行优化
  - 这些约束用相对位姿 ξij 和相关协方差矩阵 Σij 描述
  - 对于一对submap i和scan j，位姿 ξij 描述了submap坐标系中scan匹配到的位置
  - 此类约束的残差由下式计算：
<img src="/img/in_post/cartographer/6.png" width="70%">
  - 损失函数ρ（例如huber损失函数）用于减少异常值的影响。这些异常值可能出现在scan matching向优化问题SPA增加不正确的约束时，例如像办公室隔间这样的局部对称空间。

> hube loss: 相比于最小二乘的线性回归，HuberLoss降低了对离群点的惩罚程度。当预测偏差小于 δ 时，采用平方误差；当预测偏差大于 δ 时，采用线性误差。[参考](https://www.cnblogs.com/nowgood/p/Huber-Loss.html)
<img src="/img/in_post/cartographer/7.png" width="60%">

### B. Branch-and-bound scan matching（BBS）
1. pixel-accurate scan matching：
<img src="/img/in_post/cartographer/8.png" width="60%">
  - W是搜索窗口，M nearest是submap周围一圈格点
  - 使用前面的CS公式可以提高匹配质量
2. 搜索步长对效率有很大影响
  - 选择角度步长 δθ 使得扫描范围最大dmax处的扫描点移动不超过pixel的半径r，由余弦定理得：
<img src="/img/in_post/cartographer/9.png" width="60%">
  - 计算一个完整的步数，覆盖给定的搜索窗口（例如Wx=Wy=7m，Wθ=30度），并对其取整
<img src="/img/in_post/cartographer/10.png" width="60%">
  - 产生一个有限集合W形成以估计位姿ξ0为中心的搜索窗口
<img src="/img/in_post/cartographer/11.png" width="70%">
3. 朴素的暴力搜索太慢
<img src="/img/in_post/cartographer/12.png" width="70%">
4. 用Branch-and-bound分支定界法在较大搜索窗口下求解BBS问题
<img src="/img/in_post/cartographer/13.png" width="70%">

> 分支定界法：通常，把全部可行解空间反复地分割为越来越小的子集，称为分支；并且对每个子集内的解集计算一个目标下界（对于最小值问题），这称为定界。在每次分枝后，凡是界限超出已知可行解集目标值的那些子集不再进一步分枝，这样，许多子集可不予考虑，这称剪枝。这就是分枝定界法的主要思路。[参考](https://baike.baidu.com/item/%E5%88%86%E6%94%AF%E5%AE%9A%E7%95%8C%E6%B3%95/9902038)

  要将分支定界法具体化，我们需要选择节点选择、分支、上界计算的方法

#### 1. Node selection
默认采用深度优先搜索DFS（利用栈的先进后出实现）
1. 为避免加入坏匹配作为回环，引入一个分数阈值，小于阈值不予考虑。在实践中，通常不会超过阈值，这降低了节点选择和初始值的重要性。
2. 计算每个子节点的分数上限，首先访问上限最大 最有希望的子节点
<img src="/img/in_post/cartographer/14.png" width="70%">

#### 2. Branching rule
  1. 树上的每个节点用一组整数表示 c=（cx，cy，cθ，ch），高度ch处的节点有2^ch*2^ch种组合，但只表示特定的旋转。子节点的高度为0，则对应可行解。
<img src="/img/in_post/cartographer/15.png" width="60%">
  2. 将节点分为4个子节点

> 分支：对一个大的步长在 x 和 y 方向进行对半拆分，而 θ 不变。对 x 和 y 都进行减半操作，相当于“分田”，在空间坐标上将搜索空间划分为四个更小的区域 [参考](https://zhuanlan.zhihu.com/p/364015137)

#### 3. Computing upper bounds
<img src="/img/in_post/cartographer/16.png" width="60%">

  1. 为了提高效率，使用预算网格图
<img src="/img/in_post/cartographer/17.png" width="70%">

  2. M_precomp和M_nearest一样有pixel结构，但每个pixel存储着2^h*2^h大的搜索窗口中的最大值
<img src="/img/in_post/cartographer/18.png" width="60%">

  3. 对于每个预算格，计算从这格开始的2^h宽的行的最大值。用它作为中间结果，构建下一个预算图。用这种方式，时间复杂度是O(n)，n为每个预算图中pixel个数
  4. 另一种计算上界的方式是计算分辨率较低（将分辨率依次减半）的概率栅格图，较省空间，但效果较差。

> 预算图的内核思想：运动是相对的，与其遍历计算所有可能位姿对应的scan（墙），不如计算固定位姿扫描到的 ”移动“ 的墙。

## Conclusions
1. cartographer是一个2D SLAM系统，将scan-to-submap匹配回环检测和图优化相结合
2. 单个子图轨迹由基于栅格的local SLAM建立
3. 在后端，所有scan和submap都用pixel-accurate扫描匹配，以创建回环约束
4. scan和submap的约束在后端周期性进行优化

## Cartographer 代码
[cartographer函数关系图](https://raw.githubusercontent.com/Sylviazsh/my_Graphviz/ad9664b28ac536cdc1b6400c96356e19bd959320/cartographer.svg)
![cartographer函数关系图](https://raw.githubusercontent.com/Sylviazsh/my_Graphviz/ad9664b28ac536cdc1b6400c96356e19bd959320/cartographer.svg)


[cartographer代码注释](https://github.com/ZhouShihui210/cartographer_detailed_comments_ws)
