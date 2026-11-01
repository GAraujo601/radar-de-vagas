'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, ChartNoAxesCombined, CircleHelp, CodeXml, Info, Monitor, Radar, Sparkles, X } from 'lucide-react'
import examples from '@/data/exemplos.json'
import { Analysis, initialSkills, isAnalysisResult, normalizeSkills } from '@/lib/skills'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dashboard } from '@/components/dashboard'
import { AnalyzeForm } from '@/components/analyze-form'
import { SkillsEditor } from '@/components/skills-editor'

const STORAGE_KEY = 'radar-de-vagas-v1'
export function RadarApp() {
  const [tab, setTab] = useState('painel')
  const [skills, setSkills] = useState(initialSkills)
  const [saved, setSaved] = useState<Analysis[]>([])
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState('')
  const [help, setHelp] = useState(false)
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) { const data = JSON.parse(raw); if (!Array.isArray(data.skills) || !data.skills.every((s: unknown) => typeof s === 'string') || !Array.isArray(data.analyses) || !data.analyses.every((a: unknown) => isAnalysisResult(a) && typeof (a as Analysis).id === 'string')) throw new Error('invalid'); setSkills(normalizeSkills(data.skills)); setSaved(data.analyses.map((a: Analysis) => ({ ...a, exemplo: false, habilidades: normalizeSkills(a.habilidades) }))) } } catch { setStorageError('Não foi possível recuperar os dados locais. O painel está usando os exemplos; novas alterações tentarão salvar novamente.') } finally { setReady(true) }
  }, [])
  function persist(nextSkills: string[], nextSaved: Analysis[]) { setSkills(nextSkills); setSaved(nextSaved); try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ skills: nextSkills, analyses: nextSaved })); setStorageError('') } catch { setStorageError('Não foi possível salvar no navegador. Suas alterações estão apenas nesta sessão; verifique o espaço e as permissões de armazenamento.') } }
  const analyses = [...saved, ...examples]
  return <div className="min-h-screen"><header className="site-header"><div className="page-width flex h-[76px] items-center justify-between gap-4"><a href="/" className="flex items-center gap-3" aria-label="Radar de Vagas, início"><div className="brand-icon"><Radar className="size-6" strokeWidth={1.8} /></div><span className="text-lg font-semibold tracking-tight">Radar de Vagas<span className="ml-2 hidden text-[10px] font-medium tracking-normal text-muted-foreground sm:inline">BETA</span></span></a><div className="flex items-center gap-4"><span className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><span className="size-1.5 rounded-full bg-primary" />Seu próximo passo, com clareza.</span><Button variant="ghost" size="sm" onClick={() => setHelp(!help)} aria-expanded={help}><CircleHelp /><span className="hidden sm:inline">Como funciona</span></Button></div></div></header>
    <main className="page-width py-8 md:py-10" data-ready={ready}>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"><span className="h-px w-5 bg-primary" />Menos achismo. Mais direção.</div><h1 className="text-3xl font-semibold tracking-[-0.035em] md:text-[34px]">Seu próximo passo começa aqui.</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Entenda o que o mercado pede. Descubra o que falta no seu repertório.</p></div><Button onClick={() => setTab('analisar')} size="lg"><Sparkles />Analisar nova vaga<ArrowUpRight /></Button></div>
      {help && <Alert className="mb-5"><Info /><AlertTitle>Um radar para orientar seu aprendizado</AlertTitle><AlertDescription>Cadastre suas habilidades, cole vagas na aba Analisar vaga e compare as tecnologias mais frequentes. A compatibilidade é a proporção de habilidades identificadas que você já possui, não uma previsão de contratação. Os dados são locais: limpar os dados do navegador apaga suas análises.</AlertDescription><button onClick={() => setHelp(false)} aria-label="Fechar ajuda" className="absolute right-3 top-3"><X className="size-4" /></button></Alert>}
      <Tabs value={tab} onValueChange={v => setTab(String(v))} className="gap-6"><div className="tabs-row"><TabsList variant="line"><TabsTrigger value="painel"><ChartNoAxesCombined />Painel</TabsTrigger><TabsTrigger value="analisar"><Sparkles />Analisar vaga</TabsTrigger><TabsTrigger value="habilidades"><CodeXml /><span>Minhas habilidades</span><span className="tab-count hidden sm:inline">{skills.length}</span></TabsTrigger></TabsList><span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground lg:flex"><Monitor className="size-3.5" />Seus dados ficam neste navegador</span></div>
      {storageError && <Alert variant="destructive"><AlertTitle>Atenção ao armazenamento</AlertTitle><AlertDescription>{storageError}</AlertDescription></Alert>}
      <TabsContent value="painel" className="flex flex-col gap-6"><Alert className="example-alert"><Info /><AlertTitle><span className="flex flex-wrap items-center gap-x-3 gap-y-1"><strong>Dados de exemplo</strong><span className="font-normal">Seu radar começa com 8 vagas fictícias. Adicione vagas reais para deixá-lo com a sua cara.</span></span></AlertTitle><AlertDescription className="sr-only">As estatísticas incluem os exemplos e suas análises.</AlertDescription></Alert><Dashboard analyses={analyses} skills={skills} onEditSkills={() => setTab('habilidades')} /></TabsContent>
      <TabsContent value="analisar"><AnalyzeForm onAdd={a => persist(skills, [a, ...saved])} onDashboard={() => setTab('painel')} /></TabsContent><TabsContent value="habilidades"><SkillsEditor skills={skills} onChange={s => persist(s, saved)} /></TabsContent></Tabs>
      <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t py-6 text-[11px] text-muted-foreground sm:flex-row"><span className="flex items-center gap-2"><Radar className="size-4" />Radar de Vagas<span className="mx-1">/</span>Aprenda com direção.</span><span>Feito para transformar possibilidades em próximos passos.</span></footer>
    </main></div>
}
