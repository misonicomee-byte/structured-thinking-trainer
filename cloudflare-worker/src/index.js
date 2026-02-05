const RATE_LIMIT = 10; // requests per IP per minute
const rateLimitMap = new Map();

// Problem titles
const PROBLEM_TITLES = {
  'problem-1': '退院前カンファレンス準備',
  'problem-2': '業務が忙しい原因分析',
  'problem-3': '新規連携先への説明'
};

// Send Chatwork notification
async function sendChatworkNotification(env, problemId, answer, evaluation) {
  console.log('Starting Chatwork notification...');

  if (!env.CHATWORK_API_TOKEN) {
    console.error('CHATWORK_API_TOKEN not configured');
    return;
  }

  if (!env.CHATWORK_ROOM_ID) {
    console.error('CHATWORK_ROOM_ID not configured');
    return;
  }

  const problemTitle = PROBLEM_TITLES[problemId] || problemId;
  const answerPreview = answer.length > 200 ? answer.substring(0, 200) + '...' : answer;

  const message = `[info][title]構造化思考トレーニング - AI評価完了[/title]
📝 問題: ${problemTitle}
📊 スコア: ${evaluation.score}/5点

【回答内容】
${answerPreview}

【✅ 良かった点】
${evaluation.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

【💡 改善点】
${evaluation.improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

【🎯 具体的な提案】
${evaluation.suggestions.map((sug, i) => `${i + 1}. ${sug}`).join('\n')}[/info]`;

  try {
    console.log(`Sending to Chatwork room: ${env.CHATWORK_ROOM_ID}`);
    const response = await fetch(`https://api.chatwork.com/v2/rooms/${env.CHATWORK_ROOM_ID}/messages`, {
      method: 'POST',
      headers: {
        'X-ChatWorkToken': env.CHATWORK_API_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `body=${encodeURIComponent(message)}`
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Chatwork API error: ${response.status} - ${errorText}`);
    } else {
      const result = await response.json();
      console.log('Chatwork notification sent successfully:', result);
    }
  } catch (error) {
    console.error('Failed to send Chatwork notification:', error.message, error.stack);
  }
}

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
  async fetch(request, env, ctx) {
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

      // Call Claude API directly with fetch
      if (!env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not configured');
      }

      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1024,
          temperature: 0,
          messages: [{
            role: 'user',
            content: createEvaluationPrompt(problemId, answer)
          }]
        })
      });

      if (!claudeResponse.ok) {
        const errorData = await claudeResponse.text();
        throw new Error(`Claude API error: ${claudeResponse.status} - ${errorData}`);
      }

      const message = await claudeResponse.json();

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

      // Send Chatwork notification (use waitUntil to ensure it completes)
      ctx.waitUntil(
        sendChatworkNotification(env, problemId, answer, evaluation)
      );

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
