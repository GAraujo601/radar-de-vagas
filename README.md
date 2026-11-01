# Radar de Vagas

Painel web que mostra quais habilidades mais aparecem em vagas de tecnologia e quais delas ainda faltam no meu perfil. Cola-se o texto de uma vaga, o Gemini extrai as habilidades, e o painel atualiza as lacunas.

**Demo:** https://radar-de-vagas-beta.vercel.app/

**Video-demo:** https://github.com/user-attachments/assets/df108ff4-d224-449a-93a4-f884af2a8652

A análise de vagas exige um código de acesso, para proteger a minha cota da API. Quem quiser testar pode pedir o código por mensagem. O painel de exemplo funciona sem ele, e o vídeo mostra o fluxo completo.


## Para que serve

Ao me candidatar a várias vagas, queria saber onde estavam as minhas lacunas de verdade, em vez de adivinhar. O painel acumula as vagas analisadas e mostra a frequência de cada habilidade, a minha compatibilidade e o que vale aprender primeiro.

## Como funciona

1. Na aba **Analisar vaga**, cola-se o texto da vaga e o código de acesso.
2. A rota `POST /api/analisar`, no servidor, chama a API do Gemini e pede somente JSON: cargo, empresa e lista de habilidades.
3. As habilidades são normalizadas (minúsculas, sem duplicatas como "JS" e "JavaScript").
4. A análise entra no painel, que recalcula o ranking, a compatibilidade e as lacunas com base na aba **Minhas habilidades**.

## Decisões de design

- **A chave do Gemini fica só no servidor.** O navegador nunca a vê. Ela e o modelo vêm de variáveis de ambiente.
- **Código de acesso e limite de texto.** O app é público, então a rota recusa chamadas sem o código (401) e textos acima de 6000 caracteres (413). Isso evita que alguém use a minha cota pela internet.
- **Sem banco de dados e sem login.** As análises novas ficam no `localStorage` do navegador de quem usa. É simples, e nada fica guardado no servidor.
- **Erros tratados na tela.** Timeout de 30 s, JSON inválido e indisponibilidade do modelo (503) geram uma mensagem clara.
- **Dados de exemplo identificados.** O painel começa com vagas fictícias e mostra um aviso visível, para ninguém confundir com dados reais.

## Stack

Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Recharts e API REST do Gemini.

## Como foi feito

O app foi gerado no v0 a partir de um prompt que eu escrevi, com a arquitetura, as regras da API e as decisões de segurança já definidas. Os prompts usados estão em [docs/prompts-v0.md](docs/prompts-v0.md).

Depois da geração, eu revisei o código antes de publicar:

- **Segredos:** conferi que a chave do Gemini e o código de acesso aparecem só como variáveis de ambiente (`process.env`), e que o `.env` está no `.gitignore`.
- **Rota da API:** li a rota `POST /api/analisar` e conferi as validações do código de acesso (401) e do limite de 6000 caracteres (413). No site publicado, testei que o campo bloqueia textos acima do limite.
- **Dados de exemplo:** confirmei que o `data/exemplos.json` só tem vagas fictícias.
- **Comportamento:** testei o fluxo completo com vagas reais, do texto colado até a atualização do painel.

## Limitações

- As habilidades extraídas dependem do modelo e podem variar entre execuções ou vir com nomes parecidos que a normalização não junta.
- Como as análises ficam no navegador, trocar de aparelho ou limpar os dados do site apaga o histórico.
- O painel mede frequência nas vagas que eu analiso, não o mercado inteiro. 
- O texto da vaga é enviado ao Gemini. Não cole dados pessoais nem confidenciais.
- A compatibilidade compara nomes de habilidades, não o nível de domínio.

## Como rodar

```bash
pnpm install
pnpm dev
```

Copie o `.env.example` para `.env.local` e preencha as três variáveis: `GEMINI_API_KEY`, `GEMINI_MODEL` e `ACCESS_CODE`.


## Próximos passos

- Testar a rota por requisição direta (código errado e texto acima do limite), para confirmar o 401 e o 413 fora da tela.
- Salvar as análises num banco, para o histórico sobreviver à troca de aparelho.
- Comparar as habilidades extraídas com uma avaliação manual, para medir a precisão.
