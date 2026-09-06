# Login pelo SUAP

O Diatinf X aceita dois caminhos de autenticação: usuário e senha próprios, e o
OAuth2 do SUAP do IFRN. Este documento descreve o segundo.

## Fluxo implementado

É o *authorization code grant*, o mesmo do cliente oficial
[cliente_suap_django](https://github.com/ifrn-oficial/cliente_suap_django).

1. O web pede `GET /auth/suap/url` e recebe `{ url, state }`. O `state` é guardado
   no `sessionStorage` do navegador.
2. O navegador vai para `https://suap.ifrn.edu.br/o/authorize/` com
   `response_type=code`, `client_id`, `redirect_uri`, `scope` e `state`.
3. O SUAP autentica e devolve o usuário para `SUAP_REDIRECT_URI` com `code` e `state`.
4. O web confere o `state` e envia `POST /auth/suap/callback { code }`.
5. A api troca o `code` por um `access_token` em `/o/token/`, lê o perfil em
   `/api/eu/` e cria ou vincula o usuário pelo campo `identificacao`, que é
   gravado em `User.suapId`.
6. A api devolve o mesmo JWT usado pelo login com senha.

O `@` do usuário criado pelo SUAP vem do e-mail institucional; havendo conflito,
a api tenta o nome e depois a matrícula, sempre garantindo unicidade.

## Configuração

No SUAP, registre a aplicação e preencha em `api/.env`:

```
SUAP_BASE_URL="https://suap.ifrn.edu.br"
SUAP_SCOPE="identificacao email documentos_pessoais"
SUAP_CLIENT_ID="..."
SUAP_CLIENT_SECRET="..."
SUAP_REDIRECT_URI="http://localhost:5173/suap/callback"
```

A aplicação registrada no SUAP precisa estar com:

- **Client type**: `Confidential`
- **Authorization grant type**: `Authorization code`
- **Redirect uris**: exatamente a mesma URI do `SUAP_REDIRECT_URI` (uma por linha,
  incluindo também a URL de produção quando o projeto for publicado)

Sem `SUAP_CLIENT_ID` e `SUAP_CLIENT_SECRET` preenchidos, a api responde `503` nas
rotas do SUAP e o restante do aplicativo continua funcionando com usuário e senha.
