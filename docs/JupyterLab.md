# JupyterLab 安装与配置指南

## 概述

本教程将指导你在 Linux 系统上以普通用户身份安装和配置 JupyterLab，并通过 systemd 用户服务实现后台运行，最后使用 Nginx 进行反向代理。

## 安装环境

你可以使用anaconda来安装虚拟环境，但是这里使用miniconda

> 注意：Miniconda 安装源在国外，下载可能较慢。推荐使用国内镜像加速。

### 1. 下载并安装 Miniconda

以用户 `jupyter` 为例，执行以下命令：

```bash
curl https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh | bash
```

安装过程中按提示阅读协议并同意，安装完成后执行：

```bash
sudo -
conda init
```

初始化后，终端提示符前会出现 `(base)` 字样，说明 conda 已就绪。

### 2. 配置国内镜像源

强烈建议更换为国内镜像源，否则后续 JupyterLab 插件加载可能失败。参考 [清华 TUNA 镜像站帮助](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)。

## 安装 JupyterLab

### 1. 创建虚拟环境

创建一个名为 `Jupyter` 的虚拟环境，指定 Python 版本（本例使用 Python 3.8，你也可以选择 3.10 或更高）：

```bash
conda create -n Jupyter python=3.8
```

### 2. 安装 JupyterLab

推荐使用 conda 安装：

```bash
conda install jupyterlab
```

同时安装 notebook 组件：

```bash
pip install notebook
```

### 3. 生成配置文件

```bash
jupyter-lab --generate-config
```

记下生成的配置文件路径（通常位于 `~/.jupyter/jupyter_lab_config.py`）。

### 4. 设置访问密码

```bash
jupyter-notebook password
```

按照提示输入密码，系统会生成一个哈希密码并保存在 `~/.jupyter/jupyter_server_config.json` 中。**请保存好这个哈希值**，后续配置需要用到。

### 5. 修改配置文件

编辑配置文件 `~/.jupyter/jupyter_lab_config.py`：

```bash
nano ~/.jupyter/jupyter_lab_config.py
```

将内容替换为以下配置（根据实际情况调整）：

```python
# Configuration file for lab.

c = get_config()  # noqa

# 跨域设置
c.ServerApp.allow_origin = '*'

# 安装 pip install jupyter-resource-usage 后可显示 CPU 使用率
c.ResourceUseDisplay.track_cpu_percent = True

# 监听所有网络接口（如需远程访问设为 '0.0.0.0'）
c.ServerApp.ip = '0.0.0.0'

# 此处填写上面生成的密码哈希值
c.PasswordIdentityProvider.hashed_password = 'argon2:...'

# 禁止自动打开浏览器
c.ServerApp.open_browser = False

# 自定义端口
c.ServerApp.port = 8866

# 允许远程访问
c.ServerApp.allow_remote_access = True

# JupyterLab 工作目录
c.ServerApp.root_dir = '/home/jupyter/jupyterCode'

# 禁用跨站请求伪造保护（按需设置）
c.ServerApp.disable_check_xsrf = True

# 内核自动重启
c.KernelManager.autorestart = True

# 允许修改密码
c.ServerApp.allow_password_change = True

# 隐藏退出按钮
c.ServerApp.quit_button = False

# 空闲超时自动关闭（0 表示永不关闭）
c.ServerApp.shutdown_no_activity_timeout = 0

# 启用终端
c.ServerApp.terminals_enabled = True
c.ServerApp.terminado_settings = {'shell_command': ['/bin/bash']}

# 禁止 root 运行
c.ServerApp.allow_root = False

# 内存限制（32GB）
c.ResourceUseDisplay.mem_limit = 32 * 1024 * 1024 * 1024

# CPU 监控
c.ResourceUseDisplay.track_cpu_percent = True
c.ResourceUseDisplay.cpu_limit = 4
```

保存退出后，尝试手动启动 JupyterLab 验证配置：

```bash
jupyter-lab --no-browser
```

观察启动日志，确认无错误或警告，并通过浏览器访问 `http://<服务器IP>:8866` 测试密码登录是否正常。

## 启用 Systemd 用户服务

由于是普通用户，无法使用系统级 systemd，但可以启用用户级服务。

### 1. 创建用户服务目录

```bash
mkdir -p ~/.config/systemd/user
```

### 2. 创建服务单元文件

```bash
nano ~/.config/systemd/user/jupyter.service
```

内容如下：

```bash
[Unit]
Description="Jupyter Lab Service"
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/jupyter
ExecStart=/home/jupyter/miniconda3/envs/Jupyter/bin/jupyter-lab
Restart=always

[Install]
WantedBy=multi-user.target
```

> 注意：将 `WorkingDirectory` 和 `ExecStart` 中的路径替换为实际路径，确保 `ExecStart` 指向虚拟环境中的 `jupyter-lab` 可执行文件。

### 3. 重新加载 systemd 用户配置

```bash
systemctl --user daemon-reload
```

### 4. 启动服务并设置开机自启

```bash
systemctl --user start jupyter.service
systemctl --user enable jupyter.service
```

### 5. 查看服务状态与日志

```bash
# 查看状态
systemctl --user status jupyter

# 查看日志
journalctl --user -xeu jupyter
```

## 配置 Nginx 反向代理

如果需要通过域名访问 JupyterLab，并希望 Nginx 处理 HTTPS，可参考以下配置。关键是要支持 WebSocket 升级。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name jupyter.example.com;

    location / {
        proxy_pass http://127.0.0.1:8866;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

更多细节可参考 [CSDN 文章](https://blog.csdn.net/qq_35808136/article/details/89677749) 或 [Jupyter 官方文档](https://jupyter-server.readthedocs.io/en/latest/operators/public-server.html)。

## 常见问题排查

- **无法访问 8866 端口**：检查防火墙是否开放该端口。
- **密码登录失败**：确认配置文件中 `hashed_password` 的值与 `jupyter-notebook password` 生成的哈希一致。
- **插件加载报错**：确保已更换国内镜像源并重新安装相关包。
- **systemd 服务启动失败**：使用 `journalctl --user -xeu jupyter` 查看详细错误，检查路径是否正确、是否有权限问题。

完成以上步骤后，你就可以通过浏览器安全地访问个人专属的 JupyterLab 环境了。
