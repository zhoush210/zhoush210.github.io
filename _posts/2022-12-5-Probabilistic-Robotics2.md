---
layout: post
title:  "笔记：Probabilistic Robotics Chapter2"
subtitle: "Recursive State Estimation"
date:   2022-12-5 13:47:00 +0800
author:     "ZhouSh"
header-img: "img/in_post/Probabilistic-Robotics/head1.png"
header-mask: 0.4
tags:
    - 概率机器人
---
[《Probabilistic Robotics》](https://gaoyichao.com/Xiaotu//resource/refs/PR.MIT.en.pdf)

[一个较好的中文翻译版（无处不在的小土）](https://gaoyichao.com/Xiaotu/?book=probabilistic_robotics&title=index)

## Notes

### 2.2 Basic Concepts in Probability

1. 假设所有随机变量都有概率密度函数（PDF，probability dendity function）

2. 一维正态分布的PDF（高斯函数）：

    $
    p(x)=(2\pi\sigma)^{-\frac{1}{2}} exp\lbrace-\frac{1}{2}\frac{(x-\mu)^2}{\sigma^2}\rbrace
    $

3. 多元正态分布的PDF：

    $
    p(x)=det(2\pi\Sigma)^{-\frac{1}{2}} exp\lbrace-\frac{1}{2}(x-\mu)^T\Sigma^{-1}(x-\mu)\rbrace
    $

    其中，$\mu$是平均向量，$\Sigma$是一个半正定对称矩阵，协方差。$\Sigma=\sigma^2$时，和一元正态分布函数等价
    > [正定矩阵](https://baike.baidu.com/item/%E6%AD%A3%E5%AE%9A%E7%9F%A9%E9%98%B5/11030459)的性质类似复数中的正实数
    >
    >[半正定矩阵](https://baike.baidu.com/item/%E5%8D%8A%E6%AD%A3%E5%AE%9A%E7%9F%A9%E9%98%B5/2152711)，设A是n阶方阵或实对称矩阵，如果对任何非零向量X，都有$X^TAX\geq0$ ，就称A为半正定矩阵

4. PDF的值不以1为上限

5. 贝叶斯定律：

    $
    p(x|y)=\frac{p(y|x)p(x)}{p(y)}=\eta\ p(y|x)p(x)
    $

    其中$\eta$为归一化常数。如果要从y推出x，则称$p(x)$为先验分布，y为data，$p(x\|y)$为后验分布

6. 期望：

    $
    E[X]=\sum_x x\ p(x)
    $

7. 协方差：

    $
    Cov[X]=E[X-E[X]]^2=E(X^2+E(X)^2-2XE(X))=E[X^2]-E[X]^2
    $

8. 熵：假设x的概率为 $p(x)$，则编码x需要 $-log_2 p(x)$ 位字节

    $
    H_p(x)=E[-log_2 p(x)]
    $

### 2.3 Robot Environment Interaction

1. A state $x_t$ will be called $complete$ if it is the best predictor of the futrue.

2. belief（包含t时刻的测量）：
    $
    bel(x_t)=p(x_t|z_{1:\ t},u_{1:\ t})
    $

    belief（不包含t时刻的测量）：
    $
    \overline {bel}(x_t)=p(x_t|z_{1:\ t-1},u_{1:\ t})
    $

### 2.4 Bayes Filters

1. 伪代码：$u_t$是控制，$z_t$是观测

    Algorithm Bayes_filter $(bel(x_{t-1}),u_t,z_t)$:

    for all $x_t$ do

    $\overline {bel}(x_t)=\sum_{x_{t-1}} p(x_t\|u_t,x_{t-1})bel(x_{t-1})$

    ${bel}(x_t)=\eta \  p(z_t\|x_t) \  \overline{bel}(x_t)$

    endfor

    return $bel(x_t)$

## Exercises


