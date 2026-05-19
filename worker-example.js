// Cloudflare Worker 示例代码
// 用于存储和获取人格测试数据

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
        
        return new Response(JSON.stringify({ success: true, message: "测试结果已保存", key: key }), {
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
        
        // 限制返回的结果数量，避免超出响应大小限制
        const maxResults = 100;
        const keysToProcess = keys.slice(0, maxResults);
        
        for (const key of keysToProcess) {
          const value = await env.PERSONALITY_TEST_DATA.get(key.name);
          if (value) {
            results.push(JSON.parse(value));
          }
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: results,
          totalCount: keys.length,
          returnedCount: results.length
        }), {
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

    // 处理GET请求（获取单个测试结果）
    if (request.method === "GET" && request.url.includes("/api/result/")) {
      try {
        const urlParts = request.url.split("/");
        const key = urlParts[urlParts.length - 1];
        
        const value = await env.PERSONALITY_TEST_DATA.get(key);
        
        if (value) {
          return new Response(JSON.stringify({ success: true, data: JSON.parse(value) }), {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          });
        } else {
          return new Response(JSON.stringify({ success: false, message: "未找到测试结果" }), {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          });
        }
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

    // 处理DELETE请求（删除测试结果）
    if (request.method === "DELETE" && request.url.includes("/api/result/")) {
      try {
        const urlParts = request.url.split("/");
        const key = urlParts[urlParts.length - 1];
        
        await env.PERSONALITY_TEST_DATA.delete(key);
        
        return new Response(JSON.stringify({ success: true, message: "测试结果已删除" }), {
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

    // 健康检查端点
    if (request.method === "GET" && request.url.includes("/api/health")) {
      return new Response(JSON.stringify({ success: true, message: "API服务正常运行" }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};