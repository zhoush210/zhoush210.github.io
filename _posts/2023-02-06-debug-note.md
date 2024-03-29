---
layout: post
title:  "记一次debug"
subtitle: ""
date:   2023-2-6 16:27:00 +0800
author:     "ZhouSh"
header-img: "img/bg-little-universe.jpg"
header-mask: 0
tags:
    - 值得一记
---

这次debug历时5天，最终结论是**读写冲突**，需要在**读写某变量时加锁**。

首先，直观的现象是在建图运行了几分钟之后，cartographer node会崩溃，且没有报错信息。而且属于偶现问题，尤其是第一个半天尝试复现问题时，机器在原地连续运行了半小时以上都不会崩溃。直到认为该问题暂时不会出现，尝试再次跑机器建图时，又在同样的地方崩溃。开始玄学怀疑这个地方有磁场干扰之类的，于是跑另一个方向建图，跑了类似距离之后也会崩溃，于是怀疑只有机器运动时会复现bug。debug时每次都要跑这么远可太麻烦了，尝试在原地转圈，果不其然，终于可以稳定复现bug了。基本上，原地转圈1.5min后会崩溃，有时需要3.5min。

可稳定复现bug后尝试gdb调试，可以用vscode配合gdb调试，或直接用命令行gdb调试。前者方便设置断点及观察变量，后者对机器要求小但很麻烦。（后来才知道gdb可以不设置断点，直接跑到崩溃后，用`bt`查看报错函数索引，非常方便。)

第一次在机器上gdb时凑巧很久都不崩溃，误以为debug模式不会复现。于是用最老土的方式：增加注释。但因为是多线程，每次崩溃的上一个输出都不同，就不知道是哪部分的问题。而用vscode debug时，代码茫茫多，断点不知从何设起。

想到取消图像看看有没有问题，毕竟我的工作就是增加了图像这个部分。果然不用图像就不会出现bug。于是注释了几行关键代码，就不出现bug了，再在这几行代码增加注释，发现是稳定在某个DBoW2库函数中崩溃，问题出现在何处知道了，但原因还是毫无头绪。

芝姐多次提醒，还是得用gdb调出报错信息。于是决定跑到出现bug为止，这次居然在3.5分钟复现了。后面的每一次都在1.5分钟后复现。

gdb给出的信息是
```
Thread 10 "cartographer_no" received signal SIGSEGV, Segmentation fault.
0x00007ffff72cd20a in std::less<unsigned int>::operator() (this=0x555561e79d30, 
    __x=<error reading variable>, 
    __y=@0x5555627ad060: 724536)
    at /usr/include/c++/7/bits/stl_function.h:386
386	      { return __x < __y; }
```

在用vscode gdb多次观察DBoW2::score函数运行时的变量情况后发现，某变量会突然变得很奇怪。在跟芝姐讲这个问题时反应过来，应该是这个函数的上一层，传入参数时出了问题，毕竟这是个DBoW库函数。芝姐问到这个变量在哪写入的，于是我盲猜是读写冲突（后来想应该是有迹可循的，毕竟这个变量在库函数内部运行时突然变得很奇怪且无法访问），加锁后bug不复现。

后来想到，《C++ Primer》中提到：**不能在范围for循环（`for(auto a:A)`）中向vector对象添加元素。任何一种可能改变vector对象容量的操作，比如push_back，都会使该vector对象的迭代器失效。**
```
vector<int> A = {1, 2, 3};
for (auto a : A)
{
  A.push_back(1);
  cout << a << ", ";
}
cout << endl;
```
> 输出：1, 0, 1781690384,

多线程读写时，某变量突然变得很奇怪，应该也是同样的道理。

在长时间debug且大部分时间毫无进展及头绪时，会焦虑、迷茫。不过最终还是解决了，可以作为一次很好的经验。

总结：
1. gdb yyds。gdb不设置断点，直接跑到崩溃后，用`bt`查看报错函数索引，很方便。
2. 仔细查看报错信息。（一开始没注意，后来才看到是变量无法访问，下次看到变量无法访问可以检查是否读写冲突）
3. [小黄鸭调试法](https://baike.baidu.com/item/%E5%B0%8F%E9%BB%84%E9%B8%AD%E8%B0%83%E8%AF%95%E6%B3%95/16569594)yyds。多讨论，多请教。
4. 补充关于锁的应用的经验。**多线程访问共享资源、多线程间的状态同步**，需要用到锁。
[[参考1]](https://zhuanlan.zhihu.com/p/91062516) [[参考2]](https://www.jianshu.com/p/560283858587) [[参考3]](https://blog.csdn.net/weixin_43265881/article/details/123332519)