# 2026.3.1 - POS - Frondend web e Backend api restfull

## Informações gerais

- **Público alvo**: alunos da disciplina de **Programação orientada a serviços** do curso de [Infoweb](https://diatinf.ifrn.edu.br/cursos/tecnico-em-informatica-para-internet/) na [DIATINF](https://diatinf.ifrn.edu.br/) no [CNAT-IFRN](https://portal.ifrn.edu.br/campus/natalcentral/)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)

- **Aluno**: Marco Antonio Cavalcanti da Silva - Github: https://github.com/marcoantoniojs
- **Objetivo**:
  1. Atividade avaliativa para construção de aplicativo com frontend web e backend api restfull

[A descrição da atividade](docs/atividade.md)

---
## Relato da atividade

O aplicativo é o **Diatinf X**, uma réplica simplificada do X construída *mobile
first* com a paleta da identidade visual da DIATINF. O frontend web está em
`/web` e a api restfull em `/api`.

### Componentes e tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend (`/web`) | Vite, React 19, TypeScript, React Router, CSS puro com custom properties e CSS Modules |
| Backend (`/api`) | Node.js, Express 5, TypeScript, Zod, JSON Web Token, bcryptjs |
| Banco de dados | PostgreSQL (Neon) via Prisma ORM 7 com o driver adapter `@prisma/adapter-pg` |
| Autenticação | Usuário e senha com JWT, e OAuth2 do SUAP ([docs/suap.md](docs/suap.md)) |
| Publicação | Vercel, dois projetos no mesmo repositório ([docs/deploy.md](docs/deploy.md)) |


### Agente de IA

O desenvolvimento foi feito em *AI pair programming* com o **Claude Code**
(modelo Claude Opus 5), no formato de commits graduais: a cada etapa o agente
implementava, testava e apresentava o resultado para minha validação antes de
seguir para a próxima.

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

**Vídeo do projeto em execução**: