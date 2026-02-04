export interface Problem {
  id: string;
  title: string;
  scenario: string;
  question: string;
}

export interface Feedback {
  score: number; // 0-5
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export interface Answer {
  problemId: string;
  content: string;
  score: number | null;
  feedback: Feedback | null;
  attempts: number;
  lastSaved: Date;
}

export interface AppState {
  problems: Problem[];
  answers: Record<string, Answer>;
  currentProblemIndex: number;
}
