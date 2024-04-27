**JupyterLab**

**概述**

你不觉得每次都用概述开头很奇怪吗

**安装环境**

你可以使用anaconda来安装虚拟环境，但是这里使用miniconda

注意，该安装包源可能在国外，你的网速会比较慢

我们推荐你直接使用用户级别的安装，而不是ROOT用户，为了避免污染其他用户和机器的环境

这里以用户jupyter为例

执行安装命令

  -----------------------------------------------------------------------
  Bash\
  curl
  https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
  \| bash

  -----------------------------------------------------------------------

他会自己下载后安装，然后你会被要求查阅一些文本以及同意协议之类的，总之安装完成后执行

  -----------------------------------------------------------------------
  Bash\
  sudo -

  -----------------------------------------------------------------------

然后执行

  -----------------------------------------------------------------------
  Bash\
  conda init

  -----------------------------------------------------------------------

此时应该会初始化终端，你可以看到终端左侧有一个括号（bash），说明初始化完成

添加源，这部分推荐你参考 [Tuna
Conda](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/) 的内容

务必替换源，否则jupyterLab插件加载将会报错

**安装JupyterLab**

创建一个虚拟环境用于存放jupyter，由于python 3.7结束维护
我们使用python3.8 ，实际上更推荐你使用python3.10 作为日常使用版本

  -----------------------------------------------------------------------
  Bash\
  conda create -n Jupyter python=3.8

  -----------------------------------------------------------------------

然后安装jupyterlab，推荐使用conda安装

  -----------------------------------------------------------------------
  Bash\
  conda install jupyterlab

  -----------------------------------------------------------------------

然后安装一下notebook

  -----------------------------------------------------------------------
  Bash\
  pip install notebook

  -----------------------------------------------------------------------

安装完后生成一下配置文件

  -----------------------------------------------------------------------
  Bash\
  jupyter-lab \--generate-config

  -----------------------------------------------------------------------

记住生成的位置，然后现在生成一个访问密码：

  -----------------------------------------------------------------------
  Plain Text\
  jupyter-notebook password

  -----------------------------------------------------------------------

记得保存生成的秘钥，然后前往配置文件，就是刚刚生成的那个路径，一般在./jupyter里

  -----------------------------------------------------------------------
  Bash\
  nano jupyter_lab_config.py

  -----------------------------------------------------------------------

替换配置文件为：

  --------------------------------------------------------------------------
  Python\
  \# Configuration file for lab.\
  \
  c = get_config() #noqa\
  \# 跨域设置\
  c.ServerApp.allow_origin=\"\*\"\
  \# 安装pip install
  jupyter-resource-usage后显式CPU使用率，不安装这个选项无意义\
  c.ResourceUseDisplay.track_cpu_percent = True\
  #这里填写远程访问的IP名，如果对外开放访问使用
  0.0.0.0，否则填局域网的IP地址\
  c.ServerApp.ip = \'0.0.0.0\'\
  \# 这里的密码填写上面生成的密钥\
  c.PasswordIdentityProvider.hashed_password =
  \'argon2:整个字符串替换为你的密码编码\'\
  c.ServerApp.open_browser = False\
  \# 打开jupyter lab的端口，端口自定义\
  c.ServerApp.port = 8866\
  \# 允许远程访问\
  c.ServerApp.allow_remote_access = True\
  \# jupyter lab工作文件的路径，根据你的需求设置\
  c.ServerApp.root_dir = \'jupyterCode\'\
  \
  \# 跨站请求伪造（Cross-Site Request Forgery, XSRF）保护的启用或禁用\
  c.ServerApp.disable_check_xsrf = True\
  \# kernel是否自动重启\
  c.KernelManager.autorestart = True\
  \# 是否运行修改密码\
  c.ServerApp.allow_password_change = True\
  \# 是否有退出按钮\
  c.ServerApp.quit_button = False\
  \#
  长时间不允许自动停止，不建议开启，否则jupyter会在运行一段时间后自己关闭\
  c.ServerApp.shutdown_no_activity_timeout = 0\
  \# 启动terminal\
  c.ServerApp.terminals_enabled = True\
  \# terminal路径\
  c.ServerApp.terminado_settings = {\'shell_command\' : \[\'/bin/bash\'\]}\
  \# 是否允许root运行\
  c.ServerApp.allow_root = False\
  \# memory监控\
  c.ResourceUseDisplay.mem_limit = 32\*1024\*1024\*1024\
  \# cpu监控\
  c.ResourceUseDisplay.track_cpu_percent = True\
  \# cpu核数\
  c.ResourceUseDisplay.cpu_limit = 4

  --------------------------------------------------------------------------

记得仔细核对配置清单，然后尝试启动服务看看是否有报错、是否能通过密码正确访问

  -----------------------------------------------------------------------
  Bash\
  jupyter-lab \--no-browser

  -----------------------------------------------------------------------

启动后观察是否有WARN 或ERROR ，排查故障

**启用System服务**

由于我们是用户级别，没有权限直接操作系统的systemd
，好消息是，如果你的systemd版本足够，那么可以以用户身份启用任务。假设你的用户名为jupyter，那么：

  -----------------------------------------------------------------------
  Bash\
  mkdir -p \~/.config/systemd/user

  -----------------------------------------------------------------------

然后创建一个Jupyter服务

  -----------------------------------------------------------------------
  Bash\
  nano \~/.config/systemd/user/jupyter.service

  -----------------------------------------------------------------------

内容为

  -----------------------------------------------------------------------
  Bash\
  \[Unit\]\
  Description=\"Jupyter Lab Service\"\
  After=network.target\
  \
  \[Service\]\
  Type=simple\
  WorkingDirectory=/home/jupyter\
  ExecStart=/home/jupyter/miniconda3/envs/Jupyter/bin/jupyter-lab\
  Restart=always\
  \[Install\]\
  WantedBy=multi-user.target

  -----------------------------------------------------------------------

WorkingDirectory ：填写你的家目录

ExecStart
：执行路径，其中的Jupyter是你的环境变量的名称，本教程创建的为Jupyter

然后重载内核

  -----------------------------------------------------------------------
  Bash\
  systemctl \--user daemon-reload

  -----------------------------------------------------------------------

启动服务

  -----------------------------------------------------------------------
  Bash\
  systemctl \--user start jupyter.service

  -----------------------------------------------------------------------

查看状态和日志分别使用

  -----------------------------------------------------------------------
  Bash\
  systemctl \--user status jupyter\
  \#\
  journalctl \--user -xue jupyter

  -----------------------------------------------------------------------

**启用Nginx**

[参考资料](https://blog.csdn.net/qq_35808136/article/details/89677749)

jupyter 服务不能单纯的使用反代理设置，需要设置反代理websocket

这里不在赘述nginx的普通反代理方法，需要添加一些反代理头即可兼容ws的反代理（大概？）

  -----------------------------------------------------------------------
  Plain Text\
  location / {\
  proxy_pass http://127.0.0.1:8866; #通过配置端口指向部署websocker的项目\
  proxy_set_header Upgrade \$http_upgrade;\
  proxy_set_header Connection \"Upgrade\";\
  proxy_set_header X-real-ip \$remote_addr;\
  proxy_set_header X-Forwarded-For \$remote_addr;\
  }

  -----------------------------------------------------------------------

更多内容移步参考资料
