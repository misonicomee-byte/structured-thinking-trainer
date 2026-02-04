import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Answer } from '../types';
import { problems } from '../lib/problems';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextValue {
  state: AppState;
  updateAnswer: (problemId: string, content: string) => void;
  setFeedback: (problemId: string, score: number, feedback: any) => void;
  setCurrentProblemIndex: (index: number) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialAnswers: Record<string, Answer> = problems.reduce((acc, problem) => {
  acc[problem.id] = {
    problemId: problem.id,
    content: '',
    score: null,
    feedback: null,
    attempts: 0,
    lastSaved: new Date()
  };
  return acc;
}, {} as Record<string, Answer>);

export function AppProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useLocalStorage<Record<string, Answer>>(
    'structured-thinking-answers',
    initialAnswers
  );
  const [currentProblemIndex, setCurrentIndex] = useLocalStorage<number>(
    'structured-thinking-current-problem',
    0
  );

  const state: AppState = {
    problems,
    answers,
    currentProblemIndex
  };

  const updateAnswer = (problemId: string, content: string) => {
    setAnswers(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        content,
        lastSaved: new Date()
      }
    }));
  };

  const setFeedback = (problemId: string, score: number, feedback: any) => {
    setAnswers(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        score,
        feedback,
        attempts: prev[problemId].attempts + 1
      }
    }));
  };

  const setCurrentProblemIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        updateAnswer,
        setFeedback,
        setCurrentProblemIndex
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
