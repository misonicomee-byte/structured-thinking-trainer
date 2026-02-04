import Anthropic from '@anthropic-ai/sdk';

const RATE_LIMIT = 10; // requests per IP per minute
const rateLimitMap = new Map();

// CORS headers
function getCorsHeaders(origin, env) {
  const allowedOrigin = env.ALLOWED_ORIGIN || 'https://misonicomee-byte.github.io';

  if (origin === allowedOrigin || origin === 'http://localhost:5173') {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
  }

  return {};
}

// Rate limiting
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + 60000 };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + 60000;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  rateLimitMap.set(ip, record);
  return true;
}

// Evaluation prompt
function createEvaluationPrompt(problemId, answer) {
  const prompts = {
    'problem-1': {
      scenario: '退院前カンファレンス準備のシナリオ',
      framework: 'MECE（漏れなく・ダブりなく）',
      criteria: [
        '論点が明確なカテゴリに分類されているか',
        '各カテゴリが重複していないか（ダブりなく）',
        '重要な論点が漏れていないか（漏れなく）',
        '具体的な検討事項が適切に列挙されているか'
      ]
    },
    'problem-2': {
      scenario: '「バタバタしている」原因分析',
      framework: 'ロジックツリー',
      criteria: [
        '問題が論理的に分解されているか',
        '因果関係が明確か',
        '根本原因の特定に向かっているか',
        '3-4階層の適切な深さで分析されているか'
      ]
    },
    'problem-3': {
      scenario: '新規連携先への説明準備',
      framework: 'ピラミッドストラクチャー',
      criteria: [
        '最重要メッセージが明確か',
        '論拠が主張を支えているか',
        '具体的な事実や実例が示されているか',
        '説得力のある構造になっているか'
      ]
    }
  };

  const problem = prompts[problemId] || prompts['problem-1'];

  return `あなたは在宅医療分野の構造化思考の専門家です。以下の回答を評価してください。

シナリオ: ${problem.scenario}
適用フレームワーク: ${problem.framework}

評価基準:
${problem.criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

受講者の回答:
${answer}

以下のJSON形式で評価を返してください:
{
  "score": <0-5の整数>,
  "strengths": ["良かった点1", "良かった点2"],
  "improvements": ["改善点1", "改善点2"],
  "suggestions": ["具体的な提案1", "具体的な提案2"]
}

採点基準:
- 0-1点: 構造化されておらず、フレームワークの理解が不足
- 2点: 基本的な構造はあるが、論理性や深さに課題
- 3点: フレームワークを適切に適用し、論理的
- 4点: 優れた構造化と深い分析
- 5点: 完璧な構造化思考の実践例

必ずJSONのみを返してください。`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: getCorsHeaders(origin, env)
      });
    }

    // Only allow POST to /evaluate
    if (request.method !== 'POST' || url.pathname !== '/evaluate') {
      return new Response('Not Found', { status: 404 });
    }

    // Check CORS
    const corsHeaders = getCorsHeaders(origin, env);
    if (Object.keys(corsHeaders).length === 0) {
      return new Response('Forbidden', { status: 403 });
    }

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: '評価リクエストが多すぎます。1分後に再試行してください。' }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    try {
      // Parse request
      const { problemId, answer } = await request.json();

      // Validate input
      if (!problemId || !answer || answer.trim().length < 10) {
        return new Response(
          JSON.stringify({ error: '回答が短すぎます。もう少し詳しく記述してください。' }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            }
          }
        );
      }

      // Call Claude API
      const anthropic = new Anthropic({
        apiKey: env.ANTHROPIC_API_KEY,
      });

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        temperature: 0,
        messages: [{
          role: 'user',
          content: createEvaluationPrompt(problemId, answer)
        }]
      });

      // Parse response
      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Claude');
      }

      const evaluation = JSON.parse(jsonMatch[0]);

      // Validate evaluation structure
      if (
        typeof evaluation.score !== 'number' ||
        !Array.isArray(evaluation.strengths) ||
        !Array.isArray(evaluation.improvements) ||
        !Array.isArray(evaluation.suggestions)
      ) {
        throw new Error('Invalid evaluation structure');
      }

      return new Response(
        JSON.stringify(evaluation),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );

    } catch (error) {
      console.error('Error:', error);

      return new Response(
        JSON.stringify({
          error: '評価の生成に失敗しました。しばらくしてから再試行してください。',
          details: error.message
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }
  }
};
