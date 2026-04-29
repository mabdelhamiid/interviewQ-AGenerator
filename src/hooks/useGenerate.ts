import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { LOADING_MSGS } from '../constants'
import { AI_MODELS } from '../constants/models'
import { robustParseJSON, buildPrompt } from '../utils/parser'
import type { Category, Level, Question } from '../types'

interface Params {
  storeKey    : string
  currentCat  : Category
  currentLevel: Level
}

export function useGenerate({ storeKey, currentCat, currentLevel }: Params) {
  const { keys, selectedModel, addQuestions, questionSets, toast } = useAppContext()
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [loadingMsg, setLoadingMsg] = useState('')

  const currentQs    = questionSets[storeKey] || []
  const currentModel = AI_MODELS.find(m => m.id === selectedModel) ?? AI_MODELS[0]

  async function generate(count: number) {
    const apiKey = currentModel.getKey(keys)
    if (!apiKey) {
      const msg = `محتاج API Key للـ ${currentModel.label} — روح الإعدادات`
      setError(msg)
      toast(msg, 'warning')
      return
    }

    setLoading(true)
    setError(null)
    let mi = 0
    setLoadingMsg(LOADING_MSGS[0])

    const iv = setInterval(() => {
      mi = (mi + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[mi])
    }, 2500)

    try {
      const prompt = buildPrompt(currentCat.label, currentLevel.label, currentQs, count)
      const raw    = await currentModel.call(
        prompt,
        'أنت خبير frontend developer. أجب بـ JSON فقط. الأسئلة بالعربية والكود بالإنجليزية. كل إجابة: شرح مفصل + كود + use cases + best practices. استخدم ━━━ للفصل.',
        apiKey,
      )
      const parsed = robustParseJSON(raw)
      const newQs: Question[] = (parsed.questions || [])
        .filter((q: { q: string; a: string }) => q.q && q.a)
        .map((q: { q: string; a: string }) => ({
          q: q.q, a: q.a,
          modelId   : currentModel.id,
          modelLabel: currentModel.label,
          modelColor: currentModel.color,
          modelIcon : currentModel.icon,
        }))

      if (newQs.length === 0) throw new Error('مرجعش أسئلة — جرب مرة تانية')

      addQuestions(storeKey, newQs)
      toast(`تم توليد ${newQs.length} سؤال بنجاح`, 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'حصل خطأ غير متوقع'
      setError(msg)
      toast(msg, 'error')
    } finally {
      clearInterval(iv)
      setLoading(false)
    }
  }

  return { loading, error, loadingMsg, generate, currentModel, currentQs }
}
