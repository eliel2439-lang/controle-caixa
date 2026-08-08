# Controle de Caixa

Site estático (um `index.html` só) + uma função serverless (`api/data.js`) que
guarda os dados num banco Redis compartilhado — mesmo esquema que já usamos
no painel-prospeccao.

## Passo a passo (do zero)

### 1. Criar um repositório novo no GitHub
- Entra no GitHub, cria um repositório novo (ex: `controle-caixa`).
- Pode deixar vazio, sem README nem nada.

### 2. Subir os arquivos
- Abre o repositório novo, "Add file" → "Upload files".
- Arrasta **todos** os arquivos e pastas desse zip: `index.html`,
  `package.json`, `.gitignore`, este `README.md`, e a pasta `api` inteira.
- Commit changes.

### 3. Criar o projeto no Vercel
- No vercel.com, "Add New" → "Project".
- Escolhe o repositório `controle-caixa` que você acabou de criar.
- Framework: deixa em "Other" (ele detecta sozinho que é estático).
- Clica em "Deploy".

### 4. Criar o banco de dados (Redis)
- Depois que o projeto for criado, entra nele.
- Menu lateral → "Storage" (Armazenar).
- "Create Database" → escolhe **Redis** (o produto nativo da Vercel, o mesmo
  que já usamos no painel-prospeccao — o `redis-aero-tree`).
- **Se você quiser, pode conectar esse MESMO banco `redis-aero-tree`** que já
  existe (em vez de criar um banco novo) — como cada projeto usa um prefixo
  diferente (`controle-caixa:` aqui, outro lá no painel), os dados não se
  misturam mesmo estando no mesmo banco. Ou, se preferir manter tudo separado,
  cria um banco novo só pra esse projeto. Os dois jeitos funcionam.
- Depois de conectar, isso cria sozinho a variável de ambiente `REDIS_URL`
  nesse projeto.

### 5. Redeploy
- Aba "Deployments" → "..." no último deploy → "Redeploy" (pra pegar a
  variável de ambiente nova).

### 6. Testar
- Abre o link do site publicado.
- Lança algum gasto ou entrada de teste.
- Fecha a aba, abre de novo (ou testa em outro navegador) — se continuar lá,
  está funcionando.
- Se aparecer algum aviso de erro, me manda o texto dele.

## Rodando local pra testar antes de subir (opcional)
Precisa da CLI do Vercel instalada (`npm i -g vercel`), porque é ela que roda
a pasta `api/` localmente também:
```bash
vercel dev
```
