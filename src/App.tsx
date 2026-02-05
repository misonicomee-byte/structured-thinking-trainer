import { useState } from 'react';
import { useApp } from './contexts/AppContext';
import { ProblemCard } from './components/ProblemCard';
import { AnswerInput } from './components/AnswerInput';
import { ProgressTracker } from './components/ProgressTracker';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { LearningSection } from './components/LearningSection';
import { VideoPlayer } from './components/VideoPlayer';
import { useClaudeEvaluation } from './hooks/useClaudeEvaluation';

function App() {
  const { state, updateAnswer, setCurrentProblemIndex, setFeedback } = useApp();
  const { evaluate, loading, error } = useClaudeEvaluation();
  const [isRevising, setIsRevising] = useState(false);

  const currentProblem = state.problems[state.currentProblemIndex];
  const currentAnswer = state.answers[currentProblem.id];

  const handleAnswerChange = (content: string) => {
    updateAnswer(currentProblem.id, content);
  };

  const handleSubmit = async () => {
    const feedback = await evaluate(currentProblem.id, currentAnswer.content);
    if (feedback) {
      setFeedback(currentProblem.id, feedback.score, feedback);
      setIsRevising(false);
    }
  };

  const handleRevise = () => {
    setIsRevising(true);
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

            {/* Training Video */}
            <VideoPlayer />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Learning Section */}
            <LearningSection />

            <ProblemCard
              problem={currentProblem}
              problemNumber={state.currentProblemIndex + 1}
            />

            <AnswerInput
              value={currentAnswer.content}
              onChange={handleAnswerChange}
              disabled={loading || (!isRevising && currentAnswer.feedback !== null)}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">{error.message}</p>
                {error.details && (
                  <p className="text-red-600 text-sm mt-1">{error.details}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            {(isRevising || currentAnswer.feedback === null) && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!currentAnswer.content.trim() || loading}
                  className="px-8 py-3 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      評価中...
                    </>
                  ) : (
                    'AI評価を受ける'
                  )}
                </button>
              </div>
            )}

            {/* Feedback Display */}
            {!isRevising && currentAnswer.feedback && (
              <FeedbackDisplay
                feedback={currentAnswer.feedback}
                attempts={currentAnswer.attempts}
                onRevise={handleRevise}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
