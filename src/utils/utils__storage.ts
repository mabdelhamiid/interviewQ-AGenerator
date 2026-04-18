// src/utils/storage.ts
// ══════════════════════════════════════════
// كل حاجة خاصة بالـ localStorage
// ══════════════════════════════════════════

import type { ApiKeys, Question } from '../types'
import { EMPTY_KEYS, KEYS_STORAGE, QS_STORAGE, MODEL_STORAGE } from '../constants'

export function loadKeys(): ApiKeys {
  try {
    const saved = localStorage.getItem(KEYS_STORAGE)
    return { ...EMPTY_KEYS, ...JSON.parse(saved || '{}') }
  } catch {
    return EMPTY_KEYS
  }
}

export function saveKeys(keys: ApiKeys): void {
  try { localStorage.setItem(KEYS_STORAGE, JSON.stringify(keys)) } catch {
    // Ignore storage write failures and keep the app usable.
  }
}

export function loadQuestions(): Record<string, Question[]> {
  try {
    const saved = localStorage.getItem(QS_STORAGE)
    return JSON.parse(saved || '{}')
  } catch {
    return {}
  }
}

export function saveQuestions(qs: Record<string, Question[]>): void {
  try { localStorage.setItem(QS_STORAGE, JSON.stringify(qs)) } catch {
    // Ignore storage write failures and keep the app usable.
  }
}

export function loadModel(): string {
  return localStorage.getItem(MODEL_STORAGE) || 'gemini-2.0-flash'
}

export function saveModel(modelId: string): void {
  try { localStorage.setItem(MODEL_STORAGE, modelId) } catch {
    // Ignore storage write failures and keep the app usable.
  }
}
