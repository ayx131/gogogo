# Backend API 文档

## 概览

- Base URL: `http://127.0.0.1:3001`
- Content-Type: `application/json`
- 返回格式：
  - 成功：`{ success: true, ... }`
  - 失败：`{ success: false, message: string }`

---

## 1) 获取服务信息

- Method: `GET`
- Path: `/`
- 说明：返回服务名和可用接口列表。

### 响应示例

```json
{
  "success": true,
  "service": "AI Haigui Game Backend",
  "endpoints": {
    "test": "GET /api/test",
    "chat": "POST /api/chat"
  }
}
```

---

## 2) 健康检查

- Method: `GET`
- Path: `/api/test`
- 说明：用于确认服务是否在线。

### 响应示例

```json
{
  "success": true,
  "message": "Backend API is running.",
  "timestamp": 1710000000000
}
```

---

## 3) AI 对话接口

- Method: `POST`
- Path: `/api/chat`
- 说明：接收用户问题和剧本信息，调用 DeepSeek 后返回 AI 回答。

### 请求体

```json
{
  "question": "他是自杀吗？",
  "story": {
    "title": "玻璃杯里的海",
    "difficulty": "hard",
    "surface": "......",
    "bottom": "......"
  }
}
```

### 成功响应

```json
{
  "success": true,
  "answer": "无关"
}
```

### 失败响应

```json
{
  "success": false,
  "message": "Invalid request: question is required."
}
```

---

## 状态码说明

- `200`: 请求成功
- `400`: 参数错误（例如缺少 `question` / `story`）
- `404`: 路由不存在
- `500`: 服务器错误或配置错误（例如缺少 API Key）

---

## 环境变量

- `PORT`: 服务端口，默认 `3001`
- `FRONTEND_ORIGIN`: 前端来源，默认 `http://127.0.0.1:5173`
- `DEEPSEEK_API_URL`: DeepSeek 地址，默认 `https://api.deepseek.com/chat/completions`
- `DEEPSEEK_MODEL`: 模型，默认 `deepseek-chat`
- `DEEPSEEK_API_KEY`: DeepSeek 密钥（必填）

