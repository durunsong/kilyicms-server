/*
在 Neon 中，数据库存储在分支中。默认情况下，一个项目有一个分支和一个数据库。
你可以从上面的下拉菜单中选择要使用的分支和数据库。
运行下面的示例语句，尝试生成示例数据并进行查询，或点击
新建查询以清除编辑器。
*/

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    account VARCHAR(50) NOT NULL,
    create_time TIMESTAMP NOT NULL,
    is_delete SMALLINT NOT NULL DEFAULT 0,  -- 0 表示未删除，1 表示已删除
    password VARCHAR(255) NOT NULL,
    update_time TIMESTAMP NOT NULL,
    description TEXT,
    user_name VARCHAR(50),
    nick_name VARCHAR(50),
    role_ids JSONB,
    avatar VARCHAR(255),
    uuid UUID NOT NULL,
    token VARCHAR(255),
    roles JSONB
);
