# Publicação na Vercel

O repositório contém dois projetos independentes. Na Vercel, crie **duas
aplicações** apontando para o mesmo repositório, mudando apenas o *Root Directory*.

## 1. Backend (`api`)

- **Root Directory**: `api`
- **Framework Preset**: Other

O `api/vercel.json` reescreve todas as rotas para `api/api/index.ts`, que exporta
o mesmo `createApp()` usado em desenvolvimento — a api roda como função
serverless sem duplicar código. O `postinstall` executa `prisma generate`, que é
obrigatório porque o Prisma Client não é versionado.

Variáveis de ambiente:

| Variável | Valor |
| --- | --- |
| `DATABASE_URL` | a string de conexão **pooled** da Neon (a que contém `-pooler`) |
| `JWT_SECRET` | um segredo longo e aleatório, diferente do usado em desenvolvimento |
| `JWT_EXPIRES_IN` | `7d` |
| `WEB_ORIGIN` | a URL do frontend publicado, sem barra no final |
| `SUAP_BASE_URL` | `https://suap.ifrn.edu.br` |
| `SUAP_SCOPE` | `identificacao email documentos_pessoais` |
| `SUAP_CLIENT_ID` | do cadastro da aplicação no SUAP |
| `SUAP_CLIENT_SECRET` | do cadastro da aplicação no SUAP |
| `SUAP_REDIRECT_URI` | `https://<frontend>.vercel.app/suap/callback` |

A migração roda a partir da sua máquina, apontando para o mesmo banco:

```bash
cd api
npx prisma migrate deploy
```

## 2. Frontend (`web`)

- **Root Directory**: `web`
- **Framework Preset**: Vite

O `web/vercel.json` reescreve todas as rotas para `index.html`, o que é necessário
para o roteamento no cliente do React Router funcionar em links diretos como
`/perfil/mariasilva`.

Variável de ambiente:

| Variável | Valor |
| --- | --- |
| `VITE_API_URL` | a URL da api publicada, sem barra no final |

## 3. Depois de publicar

1. Ajuste `WEB_ORIGIN` na api com a URL real do frontend e faça um novo deploy —
   sem isso o CORS bloqueia as requisições do navegador.
2. Acrescente `https://<frontend>.vercel.app/suap/callback` à lista de
   *Redirect uris* da aplicação no SUAP.
3. Rode o seed uma única vez, se quiser os dados de demonstração em produção:
   `cd api && npx prisma db seed`.
