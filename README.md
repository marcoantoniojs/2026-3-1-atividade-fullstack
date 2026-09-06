# 2026.3.1 - POS - Frondend web e Backend api restfull

## Informações gerais

- **Público alvo**: alunos da disciplina de **Programação orientada a serviços** do curso de [Infoweb](https://diatinf.ifrn.edu.br/cursos/tecnico-em-informatica-para-internet/) na [DIATINF](https://diatinf.ifrn.edu.br/) no [CNAT-IFRN](https://portal.ifrn.edu.br/campus/natalcentral/)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)
- **Objetivo**:
  1. Atividade avaliativa para construção de aplicativo com frontend web e backend api restfull

[A descrição da atividade](docs/atividade.md)

---
## Relato da atividade

**Aluno**: Ermesson Andrade — [github.com/Erm2k8](https://github.com/Erm2k8)

O aplicativo é o **Diatinf X**, uma réplica simplificada do X construída *mobile
first* com a paleta da identidade visual da DIATINF. O frontend web está em
`/web` e a api restfull em `/api`.

O protótipo que guiou a interface está em [docs/diatinf-x.jpg](docs/diatinf-x.jpg)
(mobile) e [docs/diatinf-x-desktop.jpg](docs/diatinf-x-desktop.jpg) (desktop). Os
tokens extraídos dele estão documentados em [docs/design-tokens.md](docs/design-tokens.md).

### Funcionalidades

- Feed global de publicações, que é a tela inicial e é pública
- Publicações somente de texto, com limite de 280 caracteres
- Comentários com **respostas encadeadas** em qualquer profundidade
- Avaliação de publicações com **1 a 3 estrelas**, uma por usuário, com média e total
- Pesquisa por conteúdo da publicação, nome do autor ou `@usuário`
- Lista das suas próprias publicações e perfis públicos com contagens
- **Social Stats**: quem você mais comenta e quem mais te comenta
- Autenticação por usuário e senha com JWT, e login pelo **OAuth2 do SUAP**

### Componentes e tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend (`/web`) | Vite, React 19, TypeScript, React Router, CSS puro com custom properties e CSS Modules |
| Backend (`/api`) | Node.js, Express 5, TypeScript, Zod, JSON Web Token, bcryptjs |
| Banco de dados | PostgreSQL (Neon) via Prisma ORM 7 com o driver adapter `@prisma/adapter-pg` |
| Autenticação | Usuário e senha com JWT, e OAuth2 do SUAP ([docs/suap.md](docs/suap.md)) |
| Publicação | Vercel, dois projetos no mesmo repositório ([docs/deploy.md](docs/deploy.md)) |

Não foi usado nenhum framework de CSS. A identidade visual foi reproduzida com
variáveis CSS e CSS Modules, o que mantém o bundle pequeno e o controle do
comportamento *mobile first* explícito.

O modelo de dados tem quatro entidades: `User`, `Post`, `Comment` — com
auto-relacionamento `parentId` para o encadeamento — e `Rating`, com restrição de
unicidade em `(postId, userId)` para garantir uma avaliação por usuário.

### Agente de IA

O desenvolvimento foi feito em *AI pair programming* com o **Claude Code**
(modelo Claude Opus 5), no formato de commits graduais: a cada etapa o agente
implementava, testava e apresentava o resultado para minha validação antes de
seguir para a próxima.

Como a IA foi usada:

- **Leitura do protótipo**: as duas imagens do protótipo foram passadas para o
  agente, que extraiu delas a paleta, a escala tipográfica, os raios, as sombras e
  os dois layouts, produzindo o `docs/design-tokens.md` antes de escrever CSS.
- **Verificação, não só geração**: o agente dirigiu o Chrome em modo headless pelo
  protocolo DevTools para emular os viewports de 320, 390, 768 e 1280 pixels,
  medir *overflow* horizontal, tirar capturas e comparar com o protótipo. Foi
  assim que apareceram e foram corrigidos a quebra de linha inconsistente no
  rodapé do card, os marcadores de lista nos comentários e o contraste dos
  comentários sobre o fundo cream.
- **Consulta às fontes oficiais**: em vez de supor os endpoints do SUAP, o agente
  leu o código dos clientes oficiais do IFRN para confirmar `/o/authorize/`,
  `/o/token/`, `/api/eu/` e o campo `identificacao`.
- **Testes de contrato da api**: cada endpoint foi exercitado com `curl`,
  incluindo os casos de erro (403 ao apagar publicação de outro usuário, 409 de
  usuário duplicado, 400 de avaliação fora de 1 a 3).

O que a IA errou e precisou de correção: montou um seed em que a data dos
comentários caía no futuro para publicações recentes, contou errado as
interações ao gerar os dados de demonstração, e chegou a versionar um arquivo de
build (`tsconfig.tsbuildinfo`). As decisões de escopo, o cadastro da aplicação no
SUAP e a validação de cada commit foram minhas.

### Execução do projeto

Pré-requisitos: Node.js 20 ou superior e uma base PostgreSQL (a Neon tem plano
gratuito).

**1. Backend**

```bash
cd api
npm install
cp .env.example .env      # preencha DATABASE_URL e JWT_SECRET
npx prisma migrate deploy
npx prisma db seed        # dados de demonstração (opcional)
npm run dev               # http://localhost:3333
```

**2. Frontend**, em outro terminal:

```bash
cd web
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:3333
npm run dev               # http://localhost:5173
```

Com o seed aplicado, entre com qualquer um dos usuários de demonstração
(`joaosouza`, `mariasilva`, `pedrolima`, ...) usando a senha `diatinf123`.

O login pelo SUAP exige `SUAP_CLIENT_ID` e `SUAP_CLIENT_SECRET` no `api/.env`;
sem eles, apenas essas rotas ficam indisponíveis e o restante do aplicativo
funciona normalmente. Veja [docs/suap.md](docs/suap.md).

**Vídeo do projeto em execução**: _a publicar_.

---
