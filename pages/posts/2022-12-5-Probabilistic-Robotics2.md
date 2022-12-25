---
title: Recursive State Estimation
subtitle: Probabilistic Robotics Chapter2
desc: Probabilistic Robotics Chapter2Elementary Feature
headerImage: /image/probabilstic-robotics/head.webp
headerMask: 0.6
tag: slam
---

## 参考资料
[《Probabilistic Robotics》](https://gaoyichao.com/Xiaotu//resource/refs/PR.MIT.en.pdf)

[一个较好的中文翻译版（无处不在的小土）](https://gaoyichao.com/Xiaotu/?book=probabilistic_robotics&title=index)

[习题参考答案（github:pptacher probabilistic_robotics）](https://github.com/pptacher/probabilistic_robotics)

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

### 1.
机器人雷达测量范围为0~3m，平均分布。当传感器坏时（faulty），雷达输出为小于1m。雷达坏掉的先验概率为$p=0.01$。机器人获取雷达数据N次，每次测量结果都小于1，则雷达坏掉的后验概率为？

已知
$
P(X=faulty)=p=0.01, P(X=good)=1-p=0.99
$

因为
$
P(X=faulty|Z_{1:n})=\eta_1 P(Z_n|X=faulty,Z_{1:n-1}) P(X=faulty|Z_{1:n-1})=\eta_1 \times 1 \times P(X=faulty|Z_{1:n-1})
$

所以
$
P(X=faulty|Z_{1:n})=\eta_1 P(X=faulty|Z_{1:n-1})=\eta_2 P(X=faulty|Z_{1:n-2})=\cdots=\eta_n P(X=faulty|Z_0)=\eta_n P(X=faulty)=\eta_n p
$

因为
$
P(X=good|Z_{1:n})=\eta_1 P(Z_n|X=good,Z_{1:n-1}) P(X=good|Z_{1:n-1})=\eta_1 \times \frac{1}{3} \times P(X=good|Z_{1:n-1})
$

所以
$
P(X=good|Z_{1:n})=\eta_1 \frac{1}{3} P(X=good|Z_{1:n-1})=\eta_2 \frac{1}{3^2} P(X=good|Z_{1:n-2})=\cdots=\eta_n \frac{1}{3^n} P(X=good|Z_0)=\eta_n \frac{1}{3^n} P(X=good)=\eta_n \frac{1}{3^n} (1-p)
$

因为
$
\eta_n p+\eta_n \frac{1}{3^n} (1-p)=1
$

所以
$
\eta=\frac{1}{p+\frac{1}{3^n}(1-p)}
$

所以
$
P(X=faulty|Z_{1:n})=\eta_n p=\frac{p}{p+\frac{1}{3^n}(1-p)}=\frac{0.01}{0.01+\frac{1}{3^n}\times 0.99}
$

所以

$
n=1,P(X=faulty|Z_1)=0.0294118;
n=2,P(X=faulty|Z_{1:2})=0.0833333;
$

$
n=3,P(X=faulty|Z_{1:3})=0.214286;
n=4,P(X=faulty|Z_{1:4})=0.45;
$

$
n=5,P(X=faulty|Z_{1:5})=0.710526;
n=6,P(X=faulty|Z_{1:6})=0.880435;
$

$
n=7,P(X=faulty|Z_{1:7})=0.956693;
n=8,P(X=faulty|Z_{1:8})=0.956693;
$

$
n=9,P(X=faulty|Z_{1:9})=0.994995;
n=10,P(X=faulty|Z_{1:10})=0.998326;
$



