import { useState, useEffect } from 'react';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AnswerInput({ value, onChange, disabled = false }: AnswerInputProps) {
  const [charCount, setCharCount] = useState(value.length);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCharCount(newValue.length);

    // Show saving indicator briefly
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          あなたの回答
        </h3>
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
              保存中...
            </span>
          )}
          <span className="text-sm text-gray-500">
            {charCount} 文字
          </span>
        </div>
      </div>

      <textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="構造化思考を使って回答を記述してください..."
        className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <div className="mt-2 text-sm text-gray-500">
        <p>💡 ヒント: MECE、ロジックツリー、ピラミッドストラクチャーなどのフレームワークを活用しましょう</p>
      </div>
    </div>
  );
}
