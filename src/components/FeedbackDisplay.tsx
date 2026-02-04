import type { Feedback } from '../types';

interface FeedbackDisplayProps {
  feedback: Feedback;
  attempts: number;
  onRevise: () => void;
}

export function FeedbackDisplay({ feedback, attempts, onRevise }: FeedbackDisplayProps) {
  const { score, strengths, improvements, suggestions } = feedback;
  const percentage = (score / 5) * 100;

  const getScoreColor = () => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-blue-500';
    if (score >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = () => {
    if (score >= 4) return '優秀';
    if (score >= 3) return '良好';
    if (score >= 2) return '要改善';
    return '再学習推奨';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-gray-800">AI評価結果</h3>
          <span className="text-sm text-gray-500">試行回数: {attempts}</span>
        </div>

        {/* Score Display */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-700">スコア</span>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-primary">{score}</span>
              <span className="text-2xl text-gray-500">/ 5</span>
              <span className={`ml-3 px-3 py-1 rounded-full text-white text-sm font-medium ${
                score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-blue-500' : score >= 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {getScoreLabel()}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getScoreColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            良かった点
          </h4>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 bg-green-50 p-3 rounded-lg">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            改善点
          </h4>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg">
                <span className="text-yellow-600 font-bold">!</span>
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            具体的な提案
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                <span className="text-blue-600 font-bold">💡</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        {score < 4 && (
          <button
            onClick={onRevise}
            className="flex-1 px-6 py-3 bg-warning text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-all"
          >
            修正して再提出
          </button>
        )}
        {score >= 4 && (
          <div className="flex-1 text-center py-3 bg-green-50 text-green-700 font-semibold rounded-lg">
            ✨ 素晴らしい回答です！
          </div>
        )}
      </div>
    </div>
  );
}
