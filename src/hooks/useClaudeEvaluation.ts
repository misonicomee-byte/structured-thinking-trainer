import { useState } from 'react';
import type { Feedback } from '../types';

const WORKER_URL = import.meta.env.PROD
  ? 'https://structured-thinking-api.misonicomee.workers.dev/evaluate'
  : 'http://localhost:8787/evaluate';

interface EvaluationError {
  message: string;
  details?: string;
}

export function useClaudeEvaluation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<EvaluationError | null>(null);

  const evaluate = async (problemId: string, answer: string): Promise<Feedback | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problemId, answer })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Evaluation failed');
      }

      const data = await response.json();

      // Validate response structure
      if (
        typeof data.score !== 'number' ||
        !Array.isArray(data.strengths) ||
        !Array.isArray(data.improvements) ||
        !Array.isArray(data.suggestions)
      ) {
        throw new Error('Invalid response format');
      }

      return data as Feedback;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError({
        message: '評価の取得に失敗しました',
        details: errorMessage
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { evaluate, loading, error };
}
