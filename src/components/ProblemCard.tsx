import type { Problem } from '../types';

interface ProblemCardProps {
  problem: Problem;
  problemNumber: number;
}

function renderTextWithCodeBlocks(text: string) {
  const parts = text.split(/(~~~[\s\S]*?~~~)/g);

  return parts.map((part, index) => {
    if (part.startsWith('~~~') && part.endsWith('~~~')) {
      const code = part.slice(3, -3).trim();
      return (
        <pre key={index} className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm my-3">
          {code}
        </pre>
      );
    }
    return (
      <span key={index} className="whitespace-pre-line">
        {part}
      </span>
    );
  });
}

export function ProblemCard({ problem, problemNumber }: ProblemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <span className="inline-block bg-primary text-white text-sm font-medium px-3 py-1 rounded">
          問題 {problemNumber}
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">
          {problem.title}
        </h2>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          シナリオ
        </h3>
        <div className="bg-secondary p-4 rounded-lg">
          <p className="text-gray-700 whitespace-pre-line">
            {problem.scenario}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          課題
        </h3>
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-warning">
          <div className="text-gray-800">
            {renderTextWithCodeBlocks(problem.question)}
          </div>
        </div>
      </div>
    </div>
  );
}
