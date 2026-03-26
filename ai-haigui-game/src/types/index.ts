export type TStory = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  face: string;
  truth: string;
  coreLogic: string;
  keywords: string[];
};

export type TMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

