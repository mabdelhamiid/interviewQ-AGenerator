import type { AiModel } from '../types'

// ── Generic OpenAI-compatible helper ──
const openAICompat = (base: string, model: string, label: string) =>
  async (prompt: string, system: string, key: string): Promise<string> => {
    const r = await fetch(`${base}/v1/chat/completions`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body   : JSON.stringify({ model, max_tokens: 8000, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] }),
    })
    if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `${label} ${r.status}`) }
    return (await r.json()).choices?.[0]?.message?.content || ''
  }

// ── Gemini ──
const geminiCall = (model: string) => async (prompt: string, system: string, key: string): Promise<string> => {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 8192 },
    }),
  })
  if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Gemini ${r.status}`) }
  return (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ── Anthropic ──
const claudeCall = (model: string) => async (prompt: string, system: string, key: string): Promise<string> => {
  const r = await fetch('/anthropic/v1/messages', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body   : JSON.stringify({ model, max_tokens: 8000, system, messages: [{ role: 'user', content: prompt }] }),
  })
  if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Claude ${r.status}`) }
  return (await r.json()).content?.[0]?.text || ''
}

export const AI_MODELS: AiModel[] = [
  // ── Google Gemini (مجاني) ──
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', provider: 'google',   color: '#4285F4', icon: '◆', free: true,  note: 'مجاني · الأسرع',         getKey: k => k.google,     call: geminiCall('gemini-2.0-flash')   },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'google',   color: '#4285F4', icon: '◆', free: true,  note: 'مجاني · موثوق',          getKey: k => k.google,     call: geminiCall('gemini-1.5-flash')   },
  { id: 'gemini-1.5-pro',   label: 'Gemini 1.5 Pro',   provider: 'google',   color: '#4285F4', icon: '◆', free: true,  note: 'مجاني · الأقوى',         getKey: k => k.google,     call: geminiCall('gemini-1.5-pro')     },

  // ── Groq (مجاني) ──
  { id: 'groq-llama3-70b',  label: 'Llama 3.3 70B',    provider: 'groq',     color: '#F55036', icon: '⚡', free: true,  note: 'مجاني · أسرع API',       getKey: k => k.groq,       call: openAICompat('/groq/openai', 'llama-3.3-70b-versatile', 'Groq')     },
  { id: 'groq-llama3-8b',   label: 'Llama 3.1 8B',     provider: 'groq',     color: '#F55036', icon: '⚡', free: true,  note: 'مجاني · خفيف وسريع',     getKey: k => k.groq,       call: openAICompat('/groq/openai', 'llama-3.1-8b-instant', 'Groq')        },
  { id: 'groq-gemma2',      label: 'Gemma 2 9B',       provider: 'groq',     color: '#F55036', icon: '⚡', free: true,  note: 'مجاني · من Google',      getKey: k => k.groq,       call: openAICompat('/groq/openai', 'gemma2-9b-it', 'Groq')                },

  // ── Cerebras (مجاني · الأسرع) ──
  { id: 'cbr-llama4-scout', label: 'Llama 4 Scout',    provider: 'cerebras', color: '#7C3AED', icon: '🧠', free: true,  note: 'مجاني · أسرع inference', getKey: k => k.cerebras,   call: openAICompat('/cerebras', 'llama-4-scout-17b-16e-instruct', 'Cerebras') },
  { id: 'cbr-llama3-70b',   label: 'Llama 3.1 70B',    provider: 'cerebras', color: '#7C3AED', icon: '🧠', free: true,  note: 'مجاني · جودة عالية',     getKey: k => k.cerebras,   call: openAICompat('/cerebras', 'llama3.1-70b', 'Cerebras')                  },

  // ── Together.ai (مجاني) ──
  { id: 'tgt-llama3-70b',   label: 'Llama 3 70B',      provider: 'together', color: '#0EA5E9', icon: '🤝', free: true,  note: 'free credits',           getKey: k => k.together,   call: openAICompat('/together', 'meta-llama/Llama-3-70b-chat-hf', 'Together')  },
  { id: 'tgt-qwen2-72b',    label: 'Qwen2.5 72B',      provider: 'together', color: '#0EA5E9', icon: '🤝', free: true,  note: 'free credits',           getKey: k => k.together,   call: openAICompat('/together', 'Qwen/Qwen2.5-72B-Instruct-Turbo', 'Together') },

  // ── OpenRouter (مجاني) ──
  { id: 'or-deepseek-r1',   label: 'DeepSeek R1',      provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · reasoning',    getKey: k => k.openrouter, call: openAICompat('/openrouter/api', 'deepseek/deepseek-r1:free', 'OpenRouter')           },
  { id: 'or-deepseek-v3',   label: 'DeepSeek V3',      provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · شامل',         getKey: k => k.openrouter, call: openAICompat('/openrouter/api', 'deepseek/deepseek-chat-v3-0324:free', 'OpenRouter') },
  { id: 'or-qwen3',         label: 'Qwen3 235B',       provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · ضخم',          getKey: k => k.openrouter, call: openAICompat('/openrouter/api', 'qwen/qwen3-235b-a22b:free', 'OpenRouter')           },
  { id: 'or-llama4',        label: 'Llama 4 Scout',    provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · Meta أحدث',    getKey: k => k.openrouter, call: openAICompat('/openrouter/api', 'meta-llama/llama-4-scout:free', 'OpenRouter')       },

  // ── Mistral (مجاني) ──
  { id: 'mistral-small',    label: 'Mistral Small',    provider: 'mistral',  color: '#FF7000', icon: '🌪', free: true,  note: 'مجاني · سريع',          getKey: k => k.mistral,    call: openAICompat('/mistral', 'mistral-small-latest', 'Mistral')              },

  // ── Anthropic (مدفوع) ──
  { id: 'claude-haiku',     label: 'Claude Haiku',     provider: 'anthropic', color: '#D97706', icon: '🔶', free: false, note: 'مدفوع · سريع',         getKey: k => k.anthropic,  call: claudeCall('claude-haiku-4-5-20251001') },
  { id: 'claude-sonnet',    label: 'Claude Sonnet',    provider: 'anthropic', color: '#D97706', icon: '🔶', free: false, note: 'مدفوع · الأقوى',        getKey: k => k.anthropic,  call: claudeCall('claude-sonnet-4-6')         },

  // ── OpenAI (مدفوع) ──
  { id: 'gpt-4o-mini',      label: 'GPT-4o Mini',      provider: 'openai',   color: '#10A37F', icon: '🟢', free: false, note: 'مدفوع · رخيص',          getKey: k => k.openai,     call: openAICompat('/openai', 'gpt-4o-mini', 'OpenAI') },
  { id: 'gpt-4o',           label: 'GPT-4o',           provider: 'openai',   color: '#10A37F', icon: '🟢', free: false, note: 'مدفوع · الأقوى',        getKey: k => k.openai,     call: openAICompat('/openai', 'gpt-4o', 'OpenAI')      },
]
