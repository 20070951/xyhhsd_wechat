# 踢球报名小程序

## 项目简介
这是一个用于组织和管理足球活动报名的微信小程序。用户可以发起活动、参与报名、查看活动详情等。

## 功能特点
1. 活动发起
   - 设置活动时间、地点
   - 设置参与人数上限
   - 设置报名截止时间
   - 设置活动费用
   - 上传活动图片

2. 活动报名
   - 一键报名
   - 填写个人信息
   - 在线支付
   - 取消报名

3. 活动管理
   - 查看报名列表
   - 导出报名信息
   - 发送活动通知
   - 修改活动信息

4. 个人中心
   - 我的活动
   - 报名历史
   - 收藏活动
   - 个人设置

## 技术架构
- 前端框架：微信小程序原生框架
- 开发语言：TypeScript
- UI组件：WeUI
- 状态管理：Mobx
- 后端服务：云开发

## 目录结构
```
├── miniprogram/         // 小程序源码
│   ├── components/     // 自定义组件
│   ├── pages/         // 页面文件
│   ├── services/      // 服务层
│   ├── store/         // 状态管理
│   ├── utils/         // 工具函数
│   └── app.ts         // 入口文件
├── typings/           // 类型定义文件
└── project.config.json // 项目配置文件
```

## 开发规范
1. 使用TypeScript进行开发
2. 遵循小程序开发规范
3. 使用ESLint进行代码检查
4. 组件化开发
5. 统一的错误处理机制

## 安装和运行
1. 克隆代码库
2. 安装依赖：`npm install`
3. 使用微信开发者工具打开项目
4. 开始开发

## 贡献指南
欢迎提交Issue和Pull Request

## 版本历史
- v0.1.0 (开发中) - 基础功能开发 