import { useApp } from './contexts/AppContext';
import { ProblemCard } from './components/ProblemCard';
import { AnswerInput } from './components/AnswerInput';
import { ProgressTracker } from './components/ProgressTracker';

function App() {
  const { state, updateAnswer, setCurrentProblemIndex } = useApp();
  const currentProblem = state.problems[state.currentProblemIndex];
  const currentAnswer = state.answers[currentProblem.id];

  const handleAnswerChange = (content: string) => {
    updateAnswer(currentProblem.id, content);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">
            構造化思考トレーニング
          </h1>
          <p className="text-sm mt-1 opacity-90">
            ごうホームクリニック - 職員向けスキルアップツール
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <ProgressTracker
              answers={state.answers}
              totalProblems={state.problems.length}
              currentProblemIndex={state.currentProblemIndex}
              onProblemSelect={setCurrentProblemIndex}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProblemCard
              problem={currentProblem}
              problemNumber={state.currentProblemIndex + 1}
            />

            <AnswerInput
              value={currentAnswer.content}
              onChange={handleAnswerChange}
            />

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={!currentAnswer.content.trim()}
                className="px-8 py-3 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                AI評価を受ける
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
