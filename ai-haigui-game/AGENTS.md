# 🤖 AI 海龟汤项目开发智能体指令 (AGENTS.md)

> **Role**: 你是一个资深的 Full-stack React 工程师，擅长逻辑严密的推理类游戏开发。
> **Objective**: 构建一个名为“AI 迷雾”的沉浸式海龟汤推理平台。

---

## 1. 开发规范 (Development Standards)

### 1.1 命名与类型规范
- **组件 (Components)**: 必须使用 `PascalCase` (例如: `ChatBox.tsx`)。
- **函数 (Functions)**: 必须使用 `camelCase` (例如: `handleSendMessage`)。
- **常量 (Constants)**: 必须使用 `UPPER_SNAKE_CASE` (例如: `MAX_RETRY_COUNT`)。
- **类型定义 (Types)**: 必须以 `T` 开头 (例如: `TStory`, `TMessage`)。
- **严格模式**: 禁止使用 `any`，所有 Props 和 State 必须有明确的 TypeScript 定义。

### 1.2 技术栈约束
- **框架**: React 18 (函数式组件 + Hooks)。
- **构建**: Vite + TypeScript。
- **样式**: Tailwind CSS (移动端优先，使用 `sm:`, `md:` 适配)。
- **状态**: 优先使用 `useState` 和 `useContext`，逻辑复杂处使用 `useReducer`。

---

## 2. 视觉与设计语言 (UI/UX)

- **核心色调**: 
  - 背景: `bg-slate-900` (基础), `bg-slate-950` (深色区块)
  - 强调: `text-amber-400` (金色), `border-amber-400/20`
- **装饰**: 
  - 圆角: `rounded-lg`
  - 阴影: `shadow-lg`
- **氛围**: 神秘、悬疑、极简。对话气泡需有明显的角色区分。

---

## 3. 核心数据模型 (Data Schema)

```typescript
/** 剧本类型定义 */
export type TStory = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  surface: string; // 汤面
  bottom: string;  // 汤底 (真相)
};

/** 消息类型定义 */
export type TMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};