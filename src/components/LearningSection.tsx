import { useState } from 'react';
import { learningContent } from '../lib/learningContent';

export function LearningSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeExample, setActiveExample] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">
              構造化の基本を学ぶ
            </h3>
            <p className="text-sm text-gray-600">
              回答前にポイントを確認しましょう
            </p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 pt-0 space-y-6">
          {/* Overview */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-800">{learningContent.overview}</p>
          </div>

          {/* Steps */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              構造化の3ステップ
            </h4>
            <div className="space-y-2">
              {learningContent.steps.map((step) => (
                <div key={step.number} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-800">{step.title}</div>
                    <div className="text-sm text-gray-600">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              実例から学ぶ
            </h4>

            {/* Example Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {learningContent.examples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveExample(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeExample === index
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  例題{index + 1}
                </button>
              ))}
            </div>

            {/* Active Example */}
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">
                {learningContent.examples[activeExample].title}
              </h5>

              <div className="space-y-3">
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="text-sm font-semibold text-red-700 mb-1">❌ 構造化できていない</div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {learningContent.examples[activeExample].bad}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm font-semibold text-green-700 mb-1">✅ 構造化した考え方</div>
                  <pre className="text-gray-700 text-sm font-mono whitespace-pre overflow-x-auto">
                    {learningContent.examples[activeExample].good}
                  </pre>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="text-sm font-semibold text-yellow-700 mb-1">💡 ポイント</div>
                  <p className="text-gray-700 text-sm">
                    {learningContent.examples[activeExample].insight}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">✨</span>
              明日から使える3つのコツ
            </h4>
            <div className="space-y-2">
              {learningContent.tips.map((tip, index) => (
                <div key={index} className="flex gap-3 items-start p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600 font-bold">#{index + 1}</span>
                  <p className="text-gray-700 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
