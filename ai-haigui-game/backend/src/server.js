const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5173';
const deepseekApiUrl =
  process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
const deepseekModel = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const normalizeAnswer = (rawAnswer) => {
  const cleaned = (rawAnswer || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[。．\.！!？?]/g, '');

  if (cleaned === '是') return '是';
  if (cleaned === '不是' || cleaned === '否') return '不是';
  if (cleaned === '与此无关' || cleaned === '无关') return '与此无关';
  return null;
};

const hasSpoilerRisk = (answer, storyTruth, keywords) => {
  if (!answer) return false;
  const compact = answer.replace(/\s+/g, '');

  if (storyTruth && storyTruth.length >= 6) {
    const truthSnippet = storyTruth.slice(0, 12).replace(/\s+/g, '');
    if (truthSnippet && compact.includes(truthSnippet)) return true;
  }

  if (Array.isArray(keywords)) {
    const hitKeyword = keywords.some((k) => {
      if (!k || typeof k !== 'string') return false;
      return compact.includes(k.replace(/\s+/g, ''));
    });
    if (hitKeyword) return true;
  }

  if (compact.includes('真相是') || compact.includes('挑战成功')) return true;
  return false;
};

app.use(
  cors({
    origin: [frontendOrigin, 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json());

// Lightweight request logger for local debugging and troubleshooting.
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(
      `[${new Date().toISOString()}] ${requestId} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'AI Haigui Game Backend',
    endpoints: {
      test: 'GET /api/test',
      chat: 'POST /api/chat',
    },
  });
});

app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running.',
    timestamp: Date.now(),
  });
});

app.post('/api/chat', asyncHandler(async (req, res) => {
  const { question, story } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_AI_API_KEY;

  if (!apiKey) {
    throw new ApiError(500, 'Server config error: missing DEEPSEEK_API_KEY.');
  }

  if (!question || typeof question !== 'string') {
    throw new ApiError(400, 'Invalid request: question is required.');
  }

  if (!story || typeof story !== 'object') {
    throw new ApiError(400, 'Invalid request: story is required.');
  }

  const storyFace = story.face || story.surface || '';
  const storyTruth = story.truth || story.bottom || '';
  const storyCoreLogic = story.coreLogic || '（未提供）';
  const storyKeywords = Array.isArray(story.keywords) ? story.keywords : [];

  const systemPrompt = `
## Role
你是一名资深“海龟汤”游戏主持人。你冷静、毒舌且逻辑极其严密。

## Game Data
- 汤面（题目）：${storyFace}
- 汤底（真相）：${storyTruth}
- 核心逻辑：${storyCoreLogic}

## Constraints (最高指令)
1. 回复限制：你只能回答“是”、“不是”或“与此无关”。
2. 禁止剧透：严禁直接复读汤底原话。禁止在玩家未猜中前提到关键词：${storyKeywords.join('、') || '（无）'}。
3. 即使玩家猜中，也不要输出汤底全文；仍只回复“是”。
4. 拒绝闲聊：如果玩家问与游戏无关的问题（如“你是谁”、“天气如何”），统一回复“与此无关”。

## Examples
玩家：他是自杀吗？ -> AI：是。
玩家：他是不是因为发现信封是空的才绝望？ -> AI：不是。
玩家：今天晚饭吃什么？ -> AI：与此无关。
`.trim();

  const userPrompt = `
剧本标题：${story.title || ''}
难度：${story.difficulty || ''}
汤面：${storyFace}
汤底（仅供参考，不可泄露）：${storyTruth}

玩家问题：${question}
请严格遵守系统规则进行回答。
`.trim();

  const response = await fetch(deepseekApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: deepseekModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new ApiError(
      response.status,
      errorText || `DeepSeek request failed with status ${response.status}.`,
    );
  }

  const data = await response.json();
  let aiContent = data?.choices?.[0]?.message?.content?.trim() || '';

  // 1) 长度兜底：避免模型跑偏长篇输出
  if (aiContent.length > 30 && !aiContent.includes('【挑战成功】')) {
    // eslint-disable-next-line no-console
    console.warn('AI 回复过长，触发 Fallback');
    aiContent =
      '主持人无法理解你的复杂表述，请尝试更简短的提问（例如：某某是自杀吗？）。';
  }

  // 2) 空回复兜底
  if (!aiContent) {
    aiContent = '主持人陷入了沉思，请换个角度提问。';
  }

  // 安全兜底：若出现疑似剧透则强制无关
  let safeAnswer = normalizeAnswer(aiContent);
  if (!safeAnswer || hasSpoilerRisk(aiContent, storyTruth, storyKeywords)) {
    safeAnswer = '与此无关';
  }

  res.status(200).json({
    success: true,
    content: aiContent,
    answer: safeAnswer,
  });
}));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  const status = error instanceof ApiError ? error.status : 500;
  const message =
    error instanceof Error ? error.message : 'Internal server error.';

  // eslint-disable-next-line no-console
  console.error(
    `[ERROR] ${req.method} ${req.originalUrl} -> ${status}: ${message}`,
  );

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(status).json({
    success: false,
    message,
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log('GET  /           -> 服务信息');
  // eslint-disable-next-line no-console
  console.log('GET  /api/test   -> 测试');
  // eslint-disable-next-line no-console
  console.log('POST /api/chat   -> AI 对话');
});

