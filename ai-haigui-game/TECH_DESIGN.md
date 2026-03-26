# AI 海龟汤游戏技术设计文档 (Technical Design)

## 1. 项目概览
本项旨在构建一个基于大语言模型（LLM）驱动的互动推理游戏。玩家通过提问，由 AI 扮演的“汤主”根据隐藏真相判定提问的关联度，引导玩家还原故事全貌。

---

## 2. 技术栈架构 (Tech Stack)

| 维度 | 选型 | 作用 |
| :--- | :--- | :--- |
| **构建工具** | **Vite + TS** | 极速热更新与类型安全，减少开发阶段的逻辑漏洞。 |
| **前端框架** | **React 18** | 声明式渲染 UI，利用组件化高效管理复杂的对话状态。 |
| **样式方案** | **Tailwind CSS** | 快速实现深色悬疑风格（Dark Mode），适配移动端响应式。 |
| **状态管理** | **React Hooks** | `useState` 管理实时对话，`useContext` 维护全局通关进度。 |
| **路由** | **React Router** | 驱动首页大厅、游戏间与结算页面的无缝切换。 |
| **AI 引擎** | **DeepSeek-V3** | **核心推荐**：推理能力强，接口兼容 OpenAI，Token 成本极低。 |

---

## 3. 项目结构 (Project Structure)

```text
src/
├── components/      # 复用 UI 组件
│   ├── GameCard.tsx    # 剧本展示卡片
│   ├── ChatBox.tsx     # 聊天记录容器
│   ├── Message.tsx     # 单条气泡（区分角色与类型）
│   └── StoryReveal.tsx # 汤底揭晓动画组件
├── pages/           # 页面路由组件
│   ├── Home.tsx        # 剧本大厅（列表页）
│   ├── Game.tsx        # 游戏核心逻辑页
│   └── Result.tsx      # 结局展示与复盘页
├── data/            
│   └── stories.ts      # 静态剧本数据库（ID/标题/汤面/汤底）
├── types/           
│   └── index.ts        # TypeScript 类型定义（Story/Message）
├── App.tsx          # 路由分发中心
└── main.tsx         # 项目入口

export interface Story {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  surface: string; // 汤面：公开给玩家的信息
  bottom: string;  // 汤底：AI 掌握的真相（不可泄露）
}


export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string; // [是/否/无关] 或 玩家提问
  timestamp: number;
}
