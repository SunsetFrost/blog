---
title: Frp配置记录-内网穿透
description: Frp是一个反向代理软件，它体积轻量但功能很强大，可以使处于内网或防火墙后的设备对外界提供服务，它支持HTTP、TCP、UDP等众多协议。
thumbnail: /images/frp-thumbnail.jpg
date: 24 December 2021
categories: IT
---

## Frp配置记录-内网穿透
最近想远程控制下nas，再把项目后端部署上去，搞一套自动化构建，所以必须要一个公网IP。了解现行内网穿透实现方案后打算采用frp。

- [Frp配置记录-内网穿透](#frp配置记录-内网穿透)
- [VPS](#vps)
  - [速度测试](#速度测试)
  - [ssh key](#ssh-key)
  - [mac ssh restart](#mac-ssh-restart)
- [Frp](#frp)
  - [查看系统内核并下载对应Release](#查看系统内核并下载对应release)
  - [ssh配置](#ssh配置)
  - [Web Service配置](#web-service配置)
  - [自动后台运行](#自动后台运行)
  - [安装opkg](#安装opkg)
    - [管理员切换](#管理员切换)
- [后端项目部署](#后端项目部署)
  - [后端服务](#后端服务)
  - [使用自定义docker网桥](#使用自定义docker网桥)

## VPS
Vultr

### 速度测试
https://hnd-jp-ping.vultr.com

### ssh key
```sh
ssh-keygen -t rsa -C "your_email@example.com"

```
- add public ssh key to server

### mac ssh restart
```sh
sudo launchctl stop com.openssh.sshd
sudo launchctl start com.openssh.sshd
```

## Frp
### 查看系统内核并下载对应Release
```sh
arch
// AMD、ARM、x86、x86_64
```

- server, client下载frp  

>  Put frps and frps.ini onto your server A with public IP.
>
>  Put frpc and frpc.ini onto your server B in LAN (that can't be connected from public Internet).

### ssh配置
```sh
/usr/sbin/sshd -f /etc/config/ssh/sshd_config -p 22
```
  - client
  ```sh
  # frps.ini
  [common]
  bind_port = 7000

  ```
  - server
  ```sh
  # frpc.ini
  [common]
  server_addr = x.x.x.x
  server_port = 7000

  [ssh]
  type = tcp
  local_ip = 127.0.0.1
  local_port = 22
  remote_port = 6000

  ```
  - 依次server client
  ```sh
  // server
  ./frps -c ./frps.ini

  // client
  ./frpc -c ./frpc.ini

  // 其他机器
  ssh -oPort=6000 test@x.x.x.x
  ```


### Web Service配置
  - client
  ```sh
  # frps.ini
  [common]
  bind_port = 7000
  vhost_http_port = 8080

  ```
  - server
  ```sh
  # frpc.ini
  [common]
  server_addr = x.x.x.x
  server_port = 7000

  [web]
  type = http
  local_port = 80
  custom_domains = www.example.com

  ```
  - 依次server client
  ```sh
  // server
  ./frps -c ./frps.ini

  // client
  ./frpc -c ./frpc.ini

  // 其他机器
  访问http://www.example.com:8080即可
  ```

###   自动后台运行
nohup /path/to/your/fprs -c-c /path/to/your/frps.ini 
```sh
/nohup: ignoring input and appending output to '/share/homes/Frost/nohup.out'
```
- find process
```sh
ps -aux|grep frp| grep -v grep
[1]12345
```
- stop process
`kill -9 12345`


### 安装opkg
nas 没有nohub，无奈只能再安包
```sh
1 cd /tmp/
2 wget https://www.qnapclub.eu/en/qpkg/model/download/468616/Entware_1.02std.qpkg
3 sh Entware_1.02std.qpk
4 opkg update
```
#### 管理员切换
```sh
sudo -i
```

## 后端项目部署
### 后端服务
```sh
docker run --name node-container -dit -v `pwd`:/usr/code/ --network=host circleci/node
docker exec -it node-container bash
```

### 使用自定义docker网桥
```sh
docker network create -d macvlan --subnet=192.168.3.0/24 --gateway=192.168.3.207 -o parent=qvs0 mvlan

// 使用自定义网络新建docker
docker run --name node-container -dit -v `pwd`:/usr/code/ --network=mvlan --ip 192.168.3.209 circleci/node
```
