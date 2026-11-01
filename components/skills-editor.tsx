'use client'
import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { normalizeSkills, skillLabel } from '@/lib/skills'

export function SkillsEditor({ skills, onChange }: { skills: string[]; onChange: (skills: string[]) => void }) {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  function add(e: React.FormEvent) { e.preventDefault(); const next = normalizeSkills([...skills, ...value.split(',')]); onChange(next); setMessage(next.length === skills.length ? 'Essa habilidade já está na sua lista.' : 'Habilidade adicionada ao seu perfil.'); setValue('') }
  return <Card className="max-w-3xl"><CardHeader><CardTitle>Seu repertório, seu ponto de partida</CardTitle><CardDescription>Adicione as habilidades que você já tem. Seu painel se atualiza automaticamente.</CardDescription></CardHeader><CardContent><form onSubmit={add}><Field><FieldLabel htmlFor="skill">Adicionar habilidade</FieldLabel><div className="flex gap-2"><Input id="skill" placeholder="Ex.: React, Docker, TypeScript" maxLength={100} value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault() }} /><Button type="submit" disabled={!value.trim()}><Plus /><span className="hidden sm:inline">Adicionar</span></Button></div><FieldDescription>Separe por vírgulas para adicionar mais de uma. Nomes equivalentes, como JS e JavaScript, são unificados.</FieldDescription></Field></form><div className="my-7 flex flex-wrap gap-3">{skills.map(s => <div key={s} className="skill-chip"><Check className="size-3.5" /><span>{skillLabel(s)}</span><button type="button" className="rounded p-1 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary" onClick={() => { onChange(skills.filter(v => v !== s)); setMessage(`${skillLabel(s)} removida.`) }} aria-label={`Remover ${skillLabel(s)}`}><X className="size-3.5" /></button></div>)}{!skills.length && <p className="text-muted-foreground">Sua lista está vazia. Adicione sua primeira habilidade acima.</p>}</div><div className="flex flex-wrap justify-between gap-3 border-t pt-4 text-xs text-muted-foreground"><span>{skills.length} habilidades no seu perfil</span><span role="status">{message || 'Alterações salvas automaticamente neste navegador'}</span></div></CardContent></Card>
}
