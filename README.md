<div align="center">
  <img alt="Kilyicms Logo" width="120" height="120" src="https://kilyicms-server.vercel.app/images/logo.png">
  <h1>Kilyicms</h1>
  <span><a href="./README.EN.md">English</a> | 中文</span>
</div>

# kilyicms-server

这是使用 **Node.js**、**Express**、**Neon** 云数据库、**CORS**、**JWT** 和 **Bcrypt** 开发的 KilyiCMS 后端项目。项目通过 **Vercel** 进行无服务器部署，旨在提供一个简洁、易于扩展的后端 API。

## 🎯 功能特性

- 🔒 **用户认证**：使用 JWT 实现用户注册、登录、权限验证。
- 🔑 **密码加密**：使用 Bcrypt 进行用户密码的安全加密。
- 🌐 **跨域支持**：集成 CORS 支持跨域请求。
- 📅 **时间处理**：使用 Moment.js 处理时间和日期格式。
- 🗄️ **云数据库**：使用 Neon 云数据库作为 PostgreSQL 数据库的无服务器解决方案。
- 🔧 **日志记录**：使用 Morgan 和 Debug 进行开发和生产环境的日志记录。
- 🧰 **环境变量**：使用 Dotenv 加载环境配置。

## 🛠️ 技术栈

- **Node.js**：JavaScript 运行环境
- **Express**：轻量级 Web 应用框架
- **Neon**：云端 PostgreSQL 数据库
- **JWT (jsonwebtoken)**：用于 API 鉴权
- **Bcrypt**：用于密码加密
- **CORS**：跨域资源共享中间件
- **EJS**：模板引擎
- **Morgan**：HTTP 请求日志中间件

## 📦 项目结构

```mariadb
kilyicms-db/
├── index.js # 入口文件
├── bin/ # 控制器目录/状态管理
├── models/ # 数据库模型
├── routes/ # 路由配置
├── middlewares/ # 中间件
├── config/ # 配置文件
├── db/  # 数据库连接配置
├── utils/ # 工具函数
├── public/ # 静态资源管理
├── views/ # 特殊页面处理(中转页)
├── sql/  # Neon数据库文件示例
├── .env # 环境变量配置文件
└── README.md # 项目说明
```

## 🔧 环境变量配置

手动创建`.env` 文件配置环境变量
项目使用 `.env` 文件配置环境变量。以下是示例：

```mariadb
# 端口号
PORT='3000'

# 数据库配置
DATABASE_URL=postgres://username:password@neon.example.com/dbname

# JWT_SECRET --- 用于生成和验证JWT的密钥
JWT_SECRET = 'xxxxxxxxxxx-xxx-xx-xxxx'

```

## 数据库文档和控制台

https://console.neon.tech/


### 🚀 安装和启动

```pnpm
1. 克隆项目
git clone https://github.com/durunsong/kilyicms-db.git
cd kilyicms-db

2. 安装依赖
npm install
3. 配置环境变量
在项目根目录下创建 .env 文件，并根据上面的示例添加配置。

4. 启动开发服务器
npm run start

5. 部署到 Vercel
在 Vercel 中导入项目，并在环境配置中设置 .env 中的变量。
```

### 📌 API 设计

```pnpm
# 遵从RESTful 风格
/    ---get
/api/users  ---get post put delete
/db-version ---get
api/users/login  ---post
/api/users/register ---post
/api/users/userInfo  ---get
/api/users/deleteList ---get post put delete
/api/users/restore  ---post

# 状态
200 --成功
401 -- Unauthorized
403 -- 无权访问
404 -- 请求错误
409 -- 自定义错误状态
500 -- 服务错误
....
```

### 🗂️ 数据库设计

### 用户表 (users)

| 字段名         | 类型           | 描述         |
| -------------- | -------------- | ------------|
| `uuid`         | `UUID`         | 主键         |
| `user_name`    | `VARCHAR(255)` | 用户名       |
| `password`     | `VARCHAR(255)` | 密码（加密） |
| `created_time` | `TIMESTAMP`    | 创建时间     |
| `roles`        | `JSONB`        | 角色         |
| `......`       | `......`       | .....        |

## 💕 感谢 Star

小项目获取 star 不易，如果你喜欢这个项目的话，欢迎支持一个 star！这是作者持续维护的唯一动力（小声：毕竟是免费的）
