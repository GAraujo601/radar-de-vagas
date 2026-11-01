Prompt usado:

Crie um app Next.js (App Router, TypeScript, Tailwind, shadcn/ui, recharts) chamado "Radar de Vagas", em português do Brasil, tema claro e visual limpo.

Objetivo: painel que mostra quais habilidades mais aparecem em vagas de tecnologia e quais delas ainda faltam para mim.

Uma página com 3 abas:
1. "Painel": gráfico de barras horizontais com as 10 habilidades mais frequentes; cartão "Minhas lacunas" (habilidades frequentes que não estão na minha lista); tabela de análises (cargo, empresa, habilidades).
2. "Analisar vaga": campo para colar o texto da vaga, campo "código de acesso" e botão "Analisar com IA". Mostra o resultado e adiciona ao painel.
3. "Minhas habilidades": lista editável, começando com: Python, JavaScript, HTML, CSS, SQL, Git, n8n, prompt engineering, APIs, Gemini.

Dados:
- Comece com 8 análises de EXEMPLO (fictícias) em data/exemplos.json e mostre o aviso visível "Dados de exemplo".
- Novas análises ficam no localStorage do navegador.
- Normalize os nomes das habilidades (minúsculas, sem duplicatas como "JS" e "JavaScript").

API (rota server-side POST /api/analisar):
- Recebe { texto, codigo }. Responde 401 se codigo for diferente de process.env.ACCESS_CODE. Responde 413 se texto passar de 6000 caracteres.
- Chama a API REST do Gemini (generateContent) com a chave em process.env.GEMINI_API_KEY (header x-goog-api-key) e o modelo em process.env.GEMINI_MODEL. Nunca exponha a chave no navegador.
- Peça ao modelo SOMENTE JSON: { "cargo": string, "empresa": string, "habilidades": string[] }, usando apenas o que está no texto.
- Trate erros (timeout de 30 s, JSON inválido, 503) com mensagem clara na tela.

Sem banco de dados e sem login. Interface responsiva, que funcione em pc, iPad e no celular.

Correções feitas/Novo prompt:
Altere a coloração para azul (referência:azul do icone do google docs).
Adapte as vagas para cargos de início de carreira como estagio, junior, apprenticeship...
