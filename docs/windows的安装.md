# windows的安装

大家都不喜欢瘟抖死，但是大家都在用，你知道我的，我是要给大家服务的...

资料：

- <https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/windows-setup-configuration-passes?view=windows-11>

<!-- more -->

## 概述

安装操作系统的过程基本上都是相同的，我所见到的是一般流程是把系统的文件复制到新的系统（当然这一步包括分区格式化、权限创建等一系列基础操作），创建引导（UEFI或者legacy），最后进入创建的基本系统并进行配置

## 过程

### Downlevel 或 pe

Downlevel好像是win提供的一个函数接口，当使用Setup.exe进行升级的时候需要用这个所以官网上这么叫吧应该。用pe其实也就是在没有操作系统的电脑上运行一个Windows然后运行Setup.exe。

如果不用一些一键安装工具（xxx一键安装工具）或者备份恢复工具（最经典的如ghost），即使是Setup.exe也依旧是可以比较简单的装的。

下面是一些更加详细的setup.exe配置阶段以及介绍。

### offlineServicing

根据自动化配置，对镜像进行进行一些修改，包括添加驱动，添加语言包，添加更新包等。此阶段结束后电脑会重新启动，也就是说引导在这一步已经装好了。

### specialize与generalize

specialize用我熟悉的话说就是进行locate设置，也就是进行时区设置，本地化等操作。

generalize（指定的时候才会使用，一般用于创建安装镜像）用于将系统通用化，删除特定的系统信息，可以指定下一次启动是oobe模式还是audit模式

### auditSystem

启动的答案文件设定启动后进入审计模式时，会先启动auditsystem，然后在系统级进行一些操作并尝试登录管理员用户

### auditUser

在auditsystem之后执行，是从系统空间进入用户空间进行操作，允许OEM 和公司测试，更新和添加驱动~~我们怎么没搞过这个~~

### “别来无恙”oobe

我们看到的别来无恙，海内存知己，这种微软语来自于全新体验（OOBE），这里允许用户进行个性化设置，是windows安装的最后阶段

## 我到底能做什么？

上面讲了一堆windows给的启动阶段介绍，但是这对实际的工作貌似意义不大，这里介绍一般安装过程中可以做的事情

### 安装位置

也就是系统本体的安装位置，如果盘符是顺的话，那么一般是C盘

### 启动分区

一般的EFI分区是隐藏的，但是pe系统一般会给他分配一个盘符，这样你就可以选定EFI分区用来启动

### 安装镜像

windows把安装镜像打包压缩成了win或者esd格式，并且可以把多个版本的内容打包在一个文件里，当安装的时候你需要指定wim文件（.iso文件里头是install.wim），并指定版本

### 无人值守？

一些安装工具会提供一些自动安装驱动，打开或者关闭一些系统功能的选项，实现原理也就是用上面的启动阶段的offlineservice或者修改oobe.xml实现无人值守功能

### BCDedit,BCDboot

这是windows原生的引导启动管理工具，可以用来修复或者新建启动项（当然只有windwos，可能他就是顶掉你grub的罪魁祸首）比如

```{bash}
bcdboot C:\Windows /s S:
```

就是在S分区创建C盘的启动项，当然也可以进行一些查阅，修改的操作，参阅<https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/bcdboot-command-line-options-techref-di?view=windows-11>

### oobe跳过联网

这是比较常见的，毕竟搞无人值守提前装驱动还是比较难的，所以有有的时候需要跳过oobe的联网功能，在`Shift+F10`打开cmd之后运行 `"oobe\\\\BypassNRO.cmd"`重新启动之后就可以跳过联网

### 直接用自动应答脚本安装

我从来没试过这么干，但是确实是可以的，或许在批量安装的时候可以用到，参阅<https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/update-windows-settings-and-scripts-create-your-own-answer-file-sxs?view=windows-11>有意思的是，ventoy支持直接启动自动应答文件进行安装，github上也有用于自动安装文件生成的工具~~我是不想折腾这玩意了~~。由于这种装法过于普适（对分区有选择的要求，可能你不小心给人盘格了），所以我们一般修机的时候也用不上
