// src/utils/parser.ts
// ══════════════════════════════════════════
// Parser قوي للـ JSON الجاي من الـ AI
// ══════════════════════════════════════════

export function robustParseJSON(raw: string): { questions: Array<{ q: string; a: string }> } {
  if (!raw?.trim()) throw new Error('الرد فاضي من الـ AI')

  // 1. نظّف الـ markdown
  const text = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '') // شيل reasoning بعض الموديلات
    .trim()

  // 2. جرب parse مباشرة
  try { return JSON.parse(text) } catch {
    // Fall through to more tolerant parsing.
  }

  // 3. ابحث عن أول { لحد آخر }
  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start !== -1 && end !== -1) {
    const extracted = text.slice(start, end + 1)
    try { return JSON.parse(extracted) } catch {
      // Fall through to recovery heuristics.
    }

    // 4. حاول تصليح الـ JSON المقطوع
    let fixed = extracted
    // شيل آخر entry ناقص
    fixed = fixed.replace(/,\s*\{[^}]*$/, '')
    // أضف brackets ناقصة
    const opens  = (fixed.match(/\[/g) || []).length
    const closes = (fixed.match(/\]/g) || []).length
    const openBr = (fixed.match(/\{/g) || []).length
    const closBr = (fixed.match(/\}/g) || []).length
    for (let i = 0; i < opens  - closes; i++) fixed += ']'
    for (let i = 0; i < openBr - closBr; i++) fixed += '}'
    try { return JSON.parse(fixed) } catch {
      // Fall through to manual extraction.
    }
  }

  // 5. استخراج يدوي للأسئلة كـ fallback
  const questions: Array<{ q: string; a: string }> = []
  const qMatches = [...text.matchAll(/"q"\s*:\s*"((?:[^"\\]|\\.)*)"/g)]
  const aMatches = [...text.matchAll(/"a"\s*:\s*"((?:[^"\\]|\\[\s\S])*)"/g)]
  const count = Math.min(qMatches.length, aMatches.length)
  for (let i = 0; i < count; i++) {
    const q = qMatches[i][1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
    const a = aMatches[i][1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
    if (q && a) questions.push({ q, a })
  }
  if (questions.length > 0) return { questions }

  throw new Error('فشل في قراءة الرد — جرب مرة تانية أو غيّر الـ model')
}

export function buildPrompt(cat: string, level: string, existing: Array<{ q: string }>, count: number): string {
  const prev = existing.slice(-15).map(q => q.q).join('\n- ')
  return `أنشئ ${count} أسئلة مقابلة frontend احترافية جديدة ومختلفة.
  الموضوع: ${cat}
المستوى: ${level}
${prev ? `\nلا تكرر:\n- ${prev}\n` : ''}
أرجع JSON فقط بهذا الشكل الدقيق:
{"questions":[{"q":"نص السؤال بالعربية","a":"الإجابة الشاملة مع كود وأمثلة وsections مفصولة بـ ━━━"}]}`
}
