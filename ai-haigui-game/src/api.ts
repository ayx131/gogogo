import type { TStory } from './types';

export type Story = TStory;

/**
 * API 根路径（不含末尾斜杠）。
 * - 开发：留空，使用相对路径 `/api/chat`，由 Vite proxy 转发到后端。
 * - 生产：若前后端不同域，可设为完整后端地址，例如 `https://api.example.com`。
 */
const API_ROOT = import.meta.env.VITE_AI_API_URL || '';

export async function askAI(question: string, story: Story): Promise<string> {
  try {
    const response = await fetch(`${API_ROOT}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        story,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const errorMessage =
        errorBody && typeof errorBody.message === 'string'
          ? errorBody.message
          : `后端接口请求失败，HTTP 状态码：${response.status}`;
      throw new Error(errorMessage);
    }

    const data = (await response.json()) as {
      content?: string;
      answer?: string;
      success?: boolean;
    };
    const rawAnswer = (data.content || data.answer || '').trim();

    if (!rawAnswer) {
      throw new Error('AI 接口未返回有效回答。');
    }

    // 规范化回答，统一映射到“是/否/无关”
    const cleaned = rawAnswer
      .replace(/\s+/g, '')
      .replace(/[。．\.！!？?]/g, '');

    const normalizedMap: Record<string, '是' | '否' | '无关'> = {
      是: '是',
      不是: '否',
      否: '否',
      无关: '无关',
      与此无关: '无关',
    };

    const normalized = normalizedMap[cleaned];

    if (normalized === '是' || normalized === '否' || normalized === '无关') {
      return normalized;
    }

    // 对于后端兜底提示语或温和提示，直接透传给 UI 展示。
    return rawAnswer;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AI 调用失败：${error.message}`);
    }
    throw new Error('AI 调用失败：未知错误。');
  }
}

