# Gestão 360° Ultra

Projeto pronto para versionar no GitHub e publicar no Vercel.

## Estrutura

- `index.html` — painel Gestão 360° completo.
- `api/data.js` — endpoint GET/POST usado pelo painel para sincronização de dados quando publicado no Vercel.
- `package.json` / `package-lock.json` — configuração do projeto Node/Vercel.
- `.gitignore` — ignora arquivos locais e de ambiente.

## Publicar

1. Extraia o ZIP.
2. Crie um repositório no GitHub.
3. Envie **todos os arquivos e a pasta `api`** para a raiz do repositório.
4. No Vercel, importe esse repositório.
5. Publique o projeto. O `index.html` é servido na raiz e `/api/data` funciona como função serverless.

## Persistência dos dados

O painel continua usando armazenamento local do navegador como fallback. Para sincronizar os mesmos dados entre navegadores/dispositivos, conecte um banco Redis compatível com REST (por exemplo Upstash) no projeto da Vercel e configure uma destas duplas de variáveis de ambiente:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

ou

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Sem essas variáveis, a interface continua funcionando pelo `localStorage`; a memória da função `/api/data` não deve ser considerada persistente.

## GitHub Pages

Se publicar somente como GitHub Pages, o HTML abre normalmente, mas rotas serverless como `/api/data` não são executadas pelo GitHub Pages. Nesse caso os dados ficam no navegador via `localStorage`. Para usar a API e sincronização, publique o repositório também no Vercel.
