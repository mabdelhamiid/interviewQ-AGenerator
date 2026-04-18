// src/types/index.ts
// ══════════════════════════════════════════
// كل الـ TypeScript Types للمشروع
// ══════════════════════════════════════════

export interface AiModel {
  id: string
  label: string
  provider: keyof ApiKeys
  color: string
  icon: string
  free: boolean
  note: string
  getKey: (keys: ApiKeys) => string
  call: (prompt: string, system: string, key: string) => Promise<string>
}

export interface ApiKeys {
  google: string
  groq: string
  openrouter: string
  mistral: string
  cohere: string
  anthropic: string
  openai: string
}

export interface ProviderInfo {
  label: string
  color: string
  getKeyLink: string
  placeholder: string
  instructions: string
}

export interface Question {
  q: string
  a: string
  modelId: string
  modelLabel: string
  modelColor: string
  modelIcon: string
}

export interface Category {
  id: string
  label: string
  color: string
  icon: string
}

export interface Level {
  id: string
  label: string
  color: string
}
