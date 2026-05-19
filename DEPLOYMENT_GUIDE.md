# 校园人格测试项目部署指南

## 项目概述

这是一个基于五大人格维度的校园人格测试网页应用，支持多人数据统计和分析。本指南将帮助您将项目部署到GitHub和Cloudflare Pages，并使用Cloudflare Workers KV进行数据存储。

## 部署步骤

### 1. GitHub仓库创建与代码上传

#### 1.1 创建GitHub仓库
1. 登录您的GitHub账号
2. 点击页面右上角的「+」图标，选择「New repository」
3. 填写仓库信息：
   - Repository name: `campus-personality-test`
   - Description: `基于五大人格维度的校园人格测试网页应用`
   - 选择「Public」或「Private」
   - 不要勾选「Add a README file」、「.gitignore」或「license」（因为我们已有这些文件）
4. 点击「Create repository」

#### 1.2 上传项目代码
```bash
# 进入项目目录
cd /home/user/vibecoding/workspace/personality-test

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 连接到GitHub远程仓库
git remote add origin https://github.com/[您的GitHub用户名]/campus-personality-test.git

# 推送代码到GitHub
git push -u origin main
```

### 2. Cloudflare Pages部署

#### 2.1 创建Cloudflare账号
如果您还没有Cloudflare账号，请访问[Cloudflare官网](https://www.cloudflare.com/)注册一个免费账号。

#### 2.2 部署到Cloudflare Pages
1. 登录Cloudflare控制台
2. 在左侧导航栏点击「Workers & Pages」
3. 点击「创建应用程序」>「Pages」>「连接到Git」
4. 选择GitHub并授权Cloudflare访问您的GitHub账号
5. 选择您的`campus-personality-test`仓库
6. 配置构建设置：
   - 生产分支：`main`
   - 构建命令：`exit 0`（因为这是静态网站，不需要构建）
   - 构建输出目录：`/`（根目录）
7. 点击「保存并部署」
8. 部署完成后，您的网站将获得一个`*.pages.dev`的域名

### 3. Cloudflare Workers KV配置（数据存储）

#### 3.1 创建KV命名空间
1. 在Cloudflare控制台中，点击左侧导航栏的「Workers & Pages」
2. 点击顶部的「KV」标签
3. 点击「创建命名空间」
4. 输入名称：`personality_test_data`
5. 点击「创建」

#### 3.2 创建Worker
1. 在Cloudflare控制台中，点击左侧导航栏的「Workers & Pages」
2. 点击「创建应用程序」>「Worker」>「创建Worker」
3. 输入名称：`personality-test-api`
4. 点击「部署」

#### 3.3 编写Worker代码
1. 点击您刚创建的Worker
2. 点击「编辑代码」
3. 替换默认代码为以下内容：

```javascript
export default {
  async fetch(request, env, ctx) {
    // 处理CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response("OK", { headers: corsHeaders });
    }

    // 处理POST请求（保存测试结果）
    if (request.method === "POST" && request.url.includes("/api/save")) {
      try {
        const data = await request.json();
        const timestamp = new Date().toISOString();
        const key = `test_result_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
        
        await env.PERSONALITY_TEST_DATA.put(key, JSON.stringify(data));
        
        return new Response(JSON.stringify({ success: true, message: "测试结果已保存" }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    // 处理GET请求（获取统计数据）
    if (request.method === "GET" && request.url.includes("/api/stats")) {
      try {
        const { keys } = await env.PERSONALITY_TEST_DATA.list();
        const results = [];
        
        for (const key of keys) {
          const value = await env.PERSONALITY_TEST_DATA.get(key.name);
          if (value) {
            results.push(JSON.parse(value));
          }
        }
        
        return new Response(JSON.stringify({ success: true, data: results }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
```

4. 点击「保存并部署」

#### 3.4 绑定KV命名空间到Worker
1. 在Worker页面，点击「设置」标签
2. 点击「变量」
3. 在「KV命名空间绑定」部分，点击「添加绑定」
4. 输入变量名：`PERSONALITY_TEST_DATA`
5. 选择您刚创建的KV命名空间：`personality_test_data`
6. 点击「保存」

### 4. 更新前端代码以使用Cloudflare API

#### 4.1 修改script.js文件
```javascript
// 将Firebase相关代码替换为Cloudflare API
// 移除Firebase配置和初始化代码

// 修改saveTestResult函数
function saveTestResult(scores, personalityType) {
    const testResult = {
        timestamp: new Date().toISOString(),
        scores: scores,
        personalityType: personalityType.id,
        testDuration: (new Date() - testStartTime) / 1000, // 秒
        userInfo: userInfo
    };
    
    // 保存到Cloudflare KV
    fetch('https://personality-test-api.[您的workers子域名].workers.dev/api/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testResult)
    })
    .then(response => response.json())
    .then(data => {
        console.log('测试结果已保存:', data);
    })
    .catch(error => {
        console.error('保存测试结果时出错:', error);
    });
}

// 修改loadStatsData函数
function loadStatsData() {
    fetch('https://personality-test-api.[您的workers子域名].workers.dev/api/stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const totalTests = data.data.length;
                document.getElementById('total-tests').textContent = totalTests;
                document.getElementById('stats-total-tests').textContent = totalTests;
            }
        })
        .catch(error => {
            console.error('获取统计数据时出错:', error);
        });
}

// 修改updateResultCharts和updateStatsCharts函数以使用新的API
```

### 5. 重新部署前端代码

```bash
# 提交更改
git add script.js
git commit -m "Update API to use Cloudflare Workers"
git push origin main

# Cloudflare Pages会自动重新部署
```

## 管理员访问数据

### 查看测试数据
1. 登录Cloudflare控制台
2. 点击左侧导航栏的「Workers & Pages」
3. 点击顶部的「KV」标签
4. 选择您的`personality_test_data`命名空间
5. 您可以在这里查看所有存储的测试结果

### 导出数据
1. 使用Cloudflare API或Wrangler CLI导出数据
2. 示例Wrangler命令：
```bash
wrangler kv:key list --namespace-id [您的KV命名空间ID] --format=json > test_results.json
```

## 自定义域名设置（可选）

1. 在Cloudflare Pages项目页面，点击「自定义域」
2. 输入您的域名（需要先将域名的DNS服务器设置为Cloudflare）
3. 按照提示完成DNS配置
4. 几分钟后，您的网站将可以通过自定义域名访问

## 维护和更新

### 更新前端代码
1. 修改本地代码
2. 提交并推送更改到GitHub
3. Cloudflare Pages会自动重新部署

### 更新Worker代码
1. 在Cloudflare控制台中编辑Worker代码
2. 点击「保存并部署」

## 注意事项

1. Cloudflare KV免费套餐限制：
   - 1 GB存储空间
   - 每日100,000次读取
   - 每日1,000次写入
   - 每日1,000次删除
   - 每日1,000次列表操作

2. 如果测试量较大，可能需要升级到付费套餐

3. 确保您的Worker和KV命名空间设置正确

4. 定期备份您的数据

## 故障排除

1. 如果遇到CORS错误，请检查Worker中的CORS设置
2. 如果数据无法保存，请检查Worker日志和KV绑定
3. 如果统计数据不显示，请检查API URL是否正确

## 联系和支持

如有任何问题或需要帮助，请联系项目维护者。