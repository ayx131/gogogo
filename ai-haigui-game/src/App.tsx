import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Result } from './pages/Result';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/game/:id', element: <Game /> },
  { path: '/result/:storyId', element: <Result /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

