import type { Answer } from '../types';

interface ProgressTrackerProps {
  answers: Record<string, Answer>;
  totalProblems: number;
  currentProblemIndex: number;
  onProblemSelect: (index: number) => void;
}

export function ProgressTracker({
  answers,
  totalProblems,
  currentProblemIndex,
  onProblemSelect
}: ProgressTrackerProps) {
  const problemIds = Object.keys(answers);
  const totalScore = problemIds.reduce((sum, id) => {
    return sum + (answers[id]?.score || 0);
  }, 0);
  const maxScore = totalProblems * 5;
  const completedProblems = problemIds.filter(id => answers[id]?.score !== null).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        進捗状況
      </h3>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            完了: {completedProblems} / {totalProblems} 問
          </span>
          <span className="text-2xl font-bold text-primary">
            {totalScore} / {maxScore} 点
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-accent h-3 rounded-full transition-all duration-500"
            style={{ width: `${(totalScore / maxScore) * 100}%` }}
          />
        </div>
      </div>

      {/* Individual Problem Status */}
      <div className="space-y-2">
        {Array.from({ length: totalProblems }, (_, index) => {
          const problemId = `problem-${index + 1}`;
          const answer = answers[problemId];
          const isCompleted = answer?.score !== null;
          const isCurrent = index === currentProblemIndex;

          return (
            <button
              key={problemId}
              onClick={() => onProblemSelect(index)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                isCurrent
                  ? 'bg-primary text-white shadow-md'
                  : isCompleted
                  ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  問題 {index + 1}
                </span>
                {isCompleted && (
                  <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-accent'}`}>
                    {answer.score} / 5
                  </span>
                )}
                {!isCompleted && answer?.content && (
                  <span className={`text-sm ${isCurrent ? 'text-white opacity-75' : 'text-gray-500'}`}>
                    下書き保存済み
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Score Guide */}
      {totalScore > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            評価の目安
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>0-7点:</span>
              <span>基礎を固めましょう</span>
            </div>
            <div className="flex justify-between">
              <span>8-11点:</span>
              <span>良い進歩です</span>
            </div>
            <div className="flex justify-between">
              <span>12-15点:</span>
              <span>優秀です！</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
