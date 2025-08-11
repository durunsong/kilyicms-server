/*
在 Neon 中，数据库存储在分支中。默认情况下，一个项目有一个分支和一个数据库。
你可以从上面的下拉菜单中选择要使用的分支和数据库。
运行下面的示例语句，尝试生成示例数据并进行查询，或点击
新建查询以清除编辑器。
*/

CREATE TABLE IF NOT EXISTS kilyicms_users (
    id SERIAL PRIMARY KEY,                        -- 用户ID，自增主键
    account VARCHAR(50) UNIQUE NOT NULL,          -- 账户名，唯一且非空
    password VARCHAR(255) NOT NULL,               -- 密码，非空
    user_name VARCHAR(50),                        -- 用户名
    nick_name VARCHAR(50),                        -- 昵称
    email VARCHAR(100) UNIQUE,                    -- 邮箱，唯一
    phone VARCHAR(20) UNIQUE,                     -- 手机号，唯一
    role_ids JSONB DEFAULT '[]',                  -- 角色ID列表（JSON数组）
    roles JSONB DEFAULT '[]',                     -- 角色信息（JSON数组）
    avatar TEXT,                                  -- 用户头像URL
    uuid UUID DEFAULT gen_random_uuid(),          -- 用户UUID，自动生成
    token TEXT,                                   -- 登录Token
    is_active BOOLEAN DEFAULT TRUE,               -- 账户是否激活
    is_delete BOOLEAN DEFAULT FALSE,              -- 是否删除（软删除标志）
    create_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,  -- 创建时间，默认当前时间
    update_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,  -- 更新时间，默认当前时间
    last_login TIMESTAMPTZ,                       -- 最后登录时间
    description TEXT,                             -- 用户描述
    failed_login_attempts INT DEFAULT 0,          -- 登录失败次数
    last_failed_login TIMESTAMPTZ,                -- 最后登录失败时间
    login_ip VARCHAR(45),                         -- 最后登录IP地址
    gender CHAR(1) DEFAULT 'U',                   -- 性别：M（男），F（女），U（未知）
    birth_date DATE,                              -- 出生日期
    address TEXT,                                 -- 地址
    social_links JSONB DEFAULT '{}',              -- 社交账号链接（如 GitHub, Twitter）
    CONSTRAINT check_gender CHECK (gender IN ('M', 'F', 'U')) -- 性别校验
);
