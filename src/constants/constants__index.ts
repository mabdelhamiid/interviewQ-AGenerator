// src/constants/index.ts
// ══════════════════════════════════════════
// كل الثوابت (بيانات ثابتة مش بتتغير)
// ══════════════════════════════════════════

import type { Category, Level, ApiKeys, ProviderInfo } from '../types'

export const CATEGORIES: Category[] = [
  { id: 'html',          label: 'HTML',             color: '#E34F26', icon: '⟨/⟩' },
  { id: 'css',           label: 'CSS',              color: '#3B82F6', icon: '✦'   },
  { id: 'javascript',    label: 'JavaScript',       color: '#EAB308', icon: 'JS'  },
  { id: 'react',         label: 'React',            color: '#38BDF8', icon: '⚛'   },
  { id: 'vue',           label: 'Vue.js',           color: '#42B883', icon: 'V'   },
  { id: 'angular',       label: 'Angular',          color: '#DD0031', icon: 'Δ'   },
  { id: 'typescript',    label: 'TypeScript',       color: '#60A5FA', icon: 'TS'  },
  { id: 'nextjs',        label: 'Next.js',          color: '#94A3B8', icon: '▲'   },
  { id: 'nodejs',        label: 'Node.js',          color: '#68A063', icon: '⬡'   },
  { id: 'performance',   label: 'Performance',      color: '#F97316', icon: '⚡'  },
  { id: 'security',      label: 'Security',         color: '#EF4444', icon: '🔒'  },
  { id: 'testing',       label: 'Testing',          color: '#A78BFA', icon: '🧪'  },
  { id: 'patterns',      label: 'Design Patterns',  color: '#14B8A6', icon: '🏗'  },
  { id: 'browser',       label: 'Browser APIs',     color: '#FBBF24', icon: '🌐'  },
  { id: 'algorithms',    label: 'Algorithms',       color: '#8B5CF6', icon: '⚙'  },
  { id: 'system',        label: 'System Design',    color: '#22C55E', icon: '🗺'  },
  { id: 'git',           label: 'Git & DevOps',     color: '#FB7185', icon: '⎇'   },
  { id: 'accessibility', label: 'Accessibility',    color: '#06B6D4', icon: '♿'  },
]

export const LEVELS: Level[] = [
  { id: 'junior', label: 'Junior', color: '#22C55E' },
  { id: 'mid',    label: 'Mid',    color: '#EAB308' },
  { id: 'senior', label: 'Senior', color: '#EF4444' },
]

export const PROVIDER_INFO: Record<keyof ApiKeys, ProviderInfo> = {
  google:     { label: 'Google Gemini', color: '#4285F4', getKeyLink: 'https://aistudio.google.com/app/apikey',       placeholder: 'AIza...',         instructions: 'مجاني تماماً بدون credit card' },
  groq:       { label: 'Groq',          color: '#F55036', getKeyLink: 'https://console.groq.com/keys',               placeholder: 'gsk_...',          instructions: 'مجاني بدون credit card'       },
  openrouter: { label: 'OpenRouter',    color: '#6366F1', getKeyLink: 'https://openrouter.ai/keys',                  placeholder: 'sk-or-v1-...',     instructions: 'مجاني للموديلات المجانية'     },
  mistral:    { label: 'Mistral AI',    color: '#FF7000', getKeyLink: 'https://console.mistral.ai/api-keys',         placeholder: 'sk-...',           instructions: 'free tier متاح'               },
  cohere:     { label: 'Cohere',        color: '#39594D', getKeyLink: 'https://dashboard.cohere.com/api-keys',       placeholder: 'sk-...',           instructions: 'trial مجاني'                  },
  anthropic:  { label: 'Anthropic',     color: '#D97706', getKeyLink: 'https://console.anthropic.com/settings/keys', placeholder: 'sk-ant-api03-...', instructions: 'مدفوع - محتاج رصيد'          },
  openai:     { label: 'OpenAI',        color: '#10A37F', getKeyLink: 'https://platform.openai.com/api-keys',        placeholder: 'sk-proj-...',      instructions: 'مدفوع - محتاج رصيد'          },
}

export const EMPTY_KEYS: ApiKeys = {
  google: '', groq: '', openrouter: '', mistral: '', cohere: '', anthropic: '', openai: '',
}

export const SYSTEM_PROMPT = `أنت خبير frontend developer senior ومُعِد أسئلة مقابلات احترافية.
القواعد الصارمة:
1. الأسئلة بالعربية فقط
2. الكود والمصطلحات التقنية بالإنجليزية
3. كل إجابة تحتوي على: شرح مفصل + كود عملي كامل + use cases حقيقية + best practices + أخطاء شائعة
4. استخدم ━━━ للفصل بين الأقسام
5. أجب بـ JSON فقط بدون أي نص أو markdown خارجه`

export const LOADING_MSGS = [
  '🧠 بيفكر في أصعب الأسئلة...',
  '📝 بيكتب شرح تفصيلي...',
  '🔍 بيضيف أمثلة وكود...',
  '✨ بيراجع الإجابات...',
  '⚡ لحظات وهيخلص...',
]

export const KEYS_STORAGE = 'interview_coach_api_keys'
export const QS_STORAGE   = 'interview_coach_questions'
export const MODEL_STORAGE = 'interview_coach_model'
