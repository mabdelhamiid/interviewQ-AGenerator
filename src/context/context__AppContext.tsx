// src/context/AppContext.tsx
// ══════════════════════════════════════════
// Global State للتطبيق كله
// الـ keys والـ model المختار والأسئلة
// ══════════════════════════════════════════

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { FC, ReactNode } from 'react'
import type { ApiKeys, Question } from '../types'
import { loadKeys, saveKeys, loadQuestions, saveQuestions, loadModel, saveModel } from '../utils/storage'

interface AppContextType {
  // Keys
  keys: ApiKeys
  setKeys: (keys: ApiKeys) => void
  // Model
  selectedModel: string
  setSelectedModel: (id: string) => void
  // Questions
  questionSets: Record<string, Question[]>
  addQuestions: (storeKey: string, questions: Question[]) => void
  clearQuestions: (storeKey: string) => void
  clearAllQuestions: () => void
  // Stats
  totalQuestions: number
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [keys,         setKeysState]      = useState<ApiKeys>(loadKeys)
  const [selectedModel, setModelState]   = useState<string>(loadModel)
  const [questionSets,  setQuestionSets] = useState<Record<string, Question[]>>(loadQuestions)

  // حفظ تلقائي لما الـ keys تتغير
  useEffect(() => { saveKeys(keys) }, [keys])

  // حفظ تلقائي لما الأسئلة تتغير
  useEffect(() => { saveQuestions(questionSets) }, [questionSets])

  // حفظ تلقائي لما الـ model يتغير
  useEffect(() => { saveModel(selectedModel) }, [selectedModel])

  const setKeys = useCallback((newKeys: ApiKeys) => {
    setKeysState(newKeys)
  }, [])

  const setSelectedModel = useCallback((id: string) => {
    setModelState(id)
  }, [])

  const addQuestions = useCallback((storeKey: string, questions: Question[]) => {
    setQuestionSets(prev => ({
      ...prev,
      [storeKey]: [...(prev[storeKey] || []), ...questions],
    }))
  }, [])

  const clearQuestions = useCallback((storeKey: string) => {
    setQuestionSets(prev => {
      const next = { ...prev }
      delete next[storeKey]
      return next
    })
  }, [])

  const clearAllQuestions = useCallback(() => {
    setQuestionSets({})
    localStorage.removeItem('interview_coach_questions')
  }, [])

  const totalQuestions = Object.values(questionSets).reduce((s, qs) => s + qs.length, 0)

  return (
    <AppContext.Provider value={{
      keys, setKeys,
      selectedModel, setSelectedModel,
      questionSets, addQuestions, clearQuestions, clearAllQuestions,
      totalQuestions,
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom Hook للاستخدام
export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be inside AppProvider')
  return ctx
}
