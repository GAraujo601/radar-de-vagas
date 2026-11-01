'use client'

import { useState, useRef } from 'react'
import { ArrowRight, CheckCircle2, FileText, LoaderCircle, LockKeyhole, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Field, FieldLabel, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Analysis, isAnalysisResult, normalizeSkills, skillLabel } from '@/lib/skills'

export function AnalyzeForm({ onAdd, onDashboard }: { onAdd: (analysis: Analysis) => void; onDashboard: () => void }) {
  const [text, setText] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Analysis | null>(null)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pending.current) return
    if (text.length > 6000) { setError('O texto deve ter no máximo 6.000 caracteres.'); return }
    pending.current = true; setBusy(true); setError(''); setResult(null)
    try {
      const response = await fetch('/api/analisar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texto: text, codigo: code }), signal: AbortSignal.timeout(35000) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Não foi possível analisar a vaga.')
      if (!isAnalysisResult(data)) throw new Error('A resposta da IA não está no formato esperado. Tente novamente.')
      const analysis = { ...data, id: crypto.randomUUID(), habilidades: normalizeSkills(data.habilidades), exemplo: false }
      onAdd(analysis); setResult(analysis); setText(''); setCode('')
    } catch (err) { setError(err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError') ? 'A análise demorou demais. Tente novamente.' : err instanceof TypeError ? 'Falha de conexão. Confira sua internet e tente novamente.' : err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.') }
    finally { pending.current = false; setBusy(false) }
  }
  return <div className="grid items-start gap-6 lg:grid-cols-[1.65fr_1fr]"><Card><CardHeader><CardTitle>Analisar uma nova vaga</CardTitle><CardDescription>Transforme uma descrição de vaga em um caminho mais claro.</CardDescription></CardHeader><CardContent><form onSubmit={submit}><FieldGroup><Field data-invalid={text.length > 6000}><FieldLabel htmlFor="job-text">Texto da vaga</FieldLabel><Textarea id="job-text" placeholder="Cole aqui a descrição completa da vaga, incluindo o cargo, a empresa e os requisitos..." className="min-h-64 resize-y" value={text} onChange={e => setText(e.target.value)} required disabled={busy} aria-invalid={text.length > 6000} /><FieldDescription>{text.length.toLocaleString('pt-BR')} / 6.000 caracteres · Não inclua dados pessoais ou confidenciais.</FieldDescription></Field><Field><FieldLabel htmlFor="access-code">Código de acesso</FieldLabel><Input id="access-code" type="password" autoComplete="off" maxLength={256} placeholder="Digite seu código de acesso" value={code} onChange={e => setCode(e.target.value)} required disabled={busy} /><FieldDescription>Seu código autoriza o uso da IA e não é salvo no navegador.</FieldDescription></Field>{error && <Alert variant="destructive"><AlertTitle>Não foi possível concluir</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}<Button type="submit" disabled={busy || !text.trim() || !code || text.length > 6000}>{busy ? <LoaderCircle className="animate-spin" /> : <Sparkles />}{busy ? 'Analisando sua vaga...' : 'Analisar com IA'}</Button></FieldGroup></form>{result && <div className="mt-6 flex flex-col gap-4" role="status"><Alert><CheckCircle2 /><AlertTitle>Análise adicionada ao painel</AlertTitle><AlertDescription>{result.cargo} · {result.empresa}</AlertDescription></Alert><div className="flex flex-wrap gap-2">{result.habilidades.map(s => <Badge key={s} variant="secondary">{skillLabel(s)}</Badge>)}{!result.habilidades.length && <p>Nenhuma habilidade explícita encontrada.</p>}</div><Button variant="outline" onClick={onDashboard}>Ver meu painel<ArrowRight /></Button></div>}</CardContent></Card><Card><CardHeader><CardTitle>Da vaga ao próximo passo</CardTitle><CardDescription>A IA organiza. Você decide onde evoluir.</CardDescription></CardHeader><CardContent className="flex flex-col gap-7">{[{ icon: FileText, title: '1. Cole a descrição', text: 'Use o texto de qualquer vaga de tecnologia que chamou sua atenção.' }, { icon: Sparkles, title: '2. Deixe a IA organizar', text: 'O Gemini identifica cargo, empresa e habilidades mencionadas no texto.' }, { icon: TargetIcon, title: '3. Encontre seu foco', text: 'Veja o que você já sabe e o que pode aprender para chegar mais perto.' }].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><div className="feature-icon"><Icon className="size-5" /></div><div><h3 className="mb-1 font-medium">{title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{text}</p></div></div>)}<p className="flex gap-2 border-t pt-5 text-xs leading-relaxed text-muted-foreground"><LockKeyhole className="size-4 shrink-0" />O texto é enviado ao Gemini para análise. O resultado fica neste navegador. A IA pode errar; confira as habilidades extraídas.</p></CardContent></Card></div>
}
function TargetIcon(props: React.ComponentProps<typeof CheckCircle2>) { return <CheckCircle2 {...props} /> }
