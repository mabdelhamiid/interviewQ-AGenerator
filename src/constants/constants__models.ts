// src/constants/models.ts
// ══════════════════════════════════════════
// كل الـ AI Models
// ══════════════════════════════════════════

import type { AiModel } from '../types'

// Helper: بيعمل Groq call
const groqCall = (model: string) => async (prompt: string, system: string, key: string) => {
  const r = await fetch('/groq/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, max_tokens: 8000, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] }),
  })
  if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Groq ${r.status}`) }
  return (await r.json()).choices?.[0]?.message?.content || ''
}

// Helper: بيعمل OpenRouter call
const openRouterCall = (model: string) => async (prompt: string, system: string, key: string) => {
  const r = await fetch('/openrouter/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, 'HTTP-Referer': 'http://localhost:5173', 'X-Title': 'Interview Coach' },
    body: JSON.stringify({ model, max_tokens: 8000, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] }),
  })
  if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `OpenRouter ${r.status}`) }
  return (await r.json()).choices?.[0]?.message?.content || ''
}

// Helper: بيعمل Gemini call
const geminiCall = (model: string) => async (prompt: string, system: string, key: string) => {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 8192 },
    }),
  })
  if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Gemini ${r.status}`) }
  return (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export const AI_MODELS: AiModel[] = [
  // ── Google Gemini (مجاني) ──
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', provider: 'google', color: '#4285F4', icon: '◆', free: true,  note: 'مجاني · الأسرع',         getKey: k => k.google,     call: geminiCall('gemini-2.0-flash')    },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'google', color: '#4285F4', icon: '◆', free: true,  note: 'مجاني · موثوق',          getKey: k => k.google,     call: geminiCall('gemini-1.5-flash')    },
  { id: 'gemini-1.5-pro',   label: 'Gemini 1.5 Pro',   provider: 'google', color: '#4285F4', icon: '◆', free: true,  note: 'مجاني · الأقوى',         getKey: k => k.google,     call: geminiCall('gemini-1.5-pro')      },
  // ── Groq (مجاني) ──
  { id: 'groq-llama3-70b',  label: 'Llama 3.3 70B',    provider: 'groq',   color: '#F55036', icon: '⚡', free: true,  note: 'مجاني · أسرع API',       getKey: k => k.groq,       call: groqCall('llama-3.3-70b-versatile')  },
  { id: 'groq-llama3-8b',   label: 'Llama 3.1 8B',     provider: 'groq',   color: '#F55036', icon: '⚡', free: true,  note: 'مجاني · خفيف وسريع',     getKey: k => k.groq,       call: groqCall('llama-3.1-8b-instant')     },
  { id: 'groq-mixtral',     label: 'Mixtral 8x7B',     provider: 'groq',   color: '#F55036', icon: '⚡', free: true,  note: 'مجاني · ممتاز للكود',    getKey: k => k.groq,       call: groqCall('mixtral-8x7b-32768')       },
  { id: 'groq-gemma2',      label: 'Gemma 2 9B',       provider: 'groq',   color: '#F55036', icon: '⚡', free: true,  note: 'مجاني · من Google',      getKey: k => k.groq,       call: groqCall('gemma2-9b-it')             },
  // ── OpenRouter (مجاني) ──
  { id: 'or-deepseek-r1',   label: 'DeepSeek R1',      provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · reasoning قوي', getKey: k => k.openrouter, call: openRouterCall('deepseek/deepseek-r1:free')             },
  { id: 'or-deepseek-v3',   label: 'DeepSeek V3',      provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · شامل',         getKey: k => k.openrouter, call: openRouterCall('deepseek/deepseek-chat-v3-0324:free')   },
  { id: 'or-qwen3',         label: 'Qwen3 235B',       provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · ضخم جداً',      getKey: k => k.openrouter, call: openRouterCall('qwen/qwen3-235b-a22b:free')             },
  { id: 'or-llama4',        label: 'Llama 4 Scout',    provider: 'openrouter', color: '#6366F1', icon: '🔀', free: true, note: 'مجاني · Meta أحدث',     getKey: k => k.openrouter, call: openRouterCall('meta-llama/llama-4-scout:free')         },
  // ── Mistral ──
  { id: 'mistral-small',    label: 'Mistral Small',    provider: 'mistral', color: '#FF7000', icon: '🌪', free: true,  note: 'مجاني · سريع',
    getKey: k => k.mistral,
    call: async (p, s, k) => {
      const r = await fetch('/mistral/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${k}` }, body: JSON.stringify({ model: 'mistral-small-latest', max_tokens: 8000, messages: [{ role: 'system', content: s }, { role: 'user', content: p }] }) })
      if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Mistral ${r.status}`) }
      return (await r.json()).choices?.[0]?.message?.content || ''
    }
  },
  // ── Anthropic (مدفوع) ──
  { id: 'claude-haiku',     label: 'Claude Haiku',     provider: 'anthropic', color: '#D97706', icon: '🔶', free: false, note: 'مدفوع · سريع',
    getKey: k => k.anthropic,
    call: async (p, s, k) => {
      const r = await fetch('/anthropic/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': k, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 8000, system: s, messages: [{ role: 'user', content: p }] }) })
      if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Claude ${r.status}`) }
      return (await r.json()).content?.[0]?.text || ''
    }
  },
  { id: 'claude-sonnet',    label: 'Claude Sonnet',    provider: 'anthropic', color: '#D97706', icon: '🔶', free: false, note: 'مدفوع · الأقوى',
    getKey: k => k.anthropic,
    call: async (p, s, k) => {
      const r = await fetch('/anthropic/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': k, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 8000, system: s, messages: [{ role: 'user', content: p }] }) })
      if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Claude ${r.status}`) }
      return (await r.json()).content?.[0]?.text || ''
    }
  },
  // ── OpenAI (مدفوع) ──
  { id: 'gpt-4o-mini',      label: 'GPT-4o Mini',      provider: 'openai',    color: '#10A37F', icon: '🟢', free: false, note: 'مدفوع · رخيص',
    getKey: k => k.openai,
    call: async (p, s, k) => {
      const r = await fetch('/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${k}` }, body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 8000, messages: [{ role: 'system', content: s }, { role: 'user', content: p }] }) })
      if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `OpenAI ${r.status}`) }
      return (await r.json()).choices?.[0]?.message?.content || ''
    }
  },
  { id: 'gpt-4o',           label: 'GPT-4o',           provider: 'openai',    color: '#10A37F', icon: '🟢', free: false, note: 'مدفوع · الأقوى',
    getKey: k => k.openai,
    call: async (p, s, k) => {
      const r = await fetch('/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${k}` }, body: JSON.stringify({ model: 'gpt-4o', max_tokens: 8000, messages: [{ role: 'system', content: s }, { role: 'user', content: p }] }) })
      if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `OpenAI ${r.status}`) }
      return (await r.json()).choices?.[0]?.message?.content || ''
    }
  },
]
