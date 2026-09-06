import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

const people = [
  { username: "joaosouza", name: "João Souza", bio: "Estudante de Informática para Internet no CNAT-IFRN." },
  { username: "mariasilva", name: "Maria Silva", bio: "Designer de produto e entusiasta de tipografia." },
  { username: "pedrolima", name: "Pedro Lima", bio: "Front-end em formação. Café e CSS." },
  { username: "carloscosta", name: "Carlos Costa", bio: "Back-end, containers e uma briga eterna com o deploy." },
  { username: "anacosta", name: "Ana Costa", bio: "Curiosa por acessibilidade na web." },
  { username: "luispereira", name: "Luís Pereira", bio: "Aprendendo TypeScript do zero." },
  { username: "fernandadias", name: "Fernanda Dias", bio: "Banco de dados e modelagem." },
  { username: "ritafernandes", name: "Rita Fernandes", bio: "Testes automatizados e qualidade." },
  { username: "ricardosantos", name: "Ricardo Santos", bio: "Redes e infraestrutura." },
  { username: "carlanunes", name: "Carla Nunes", bio: "UX writing e conteúdo digital." },
];

const posts = [
  { author: "mariasilva", content: "Acordando com uma ideia incrível para um novo projeto de design. #criatividade", minutesAgo: 2 },
  { author: "carloscosta", content: "Alguém mais com problemas no deploy hoje? #devlife", minutesAgo: 15 },
  { author: "anacosta", content: "Dica do dia: contraste de cor não é enfeite, é acessibilidade. Testem seus botões. #a11y", minutesAgo: 47 },
  { author: "joaosouza", content: "Comecei o trabalho de POS hoje: um clone simplificado do X, mobile first. #diatinfx", minutesAgo: 60 },
  { author: "pedrolima", content: "Terminei o protótipo mobile first do trabalho de POS. Faltam os comentários encadeados.", minutesAgo: 96 },
  { author: "fernandadias", content: "Índice certo no Postgres transformou uma consulta de 2s em 30ms. Modelagem importa. #banco", minutesAgo: 180 },
  { author: "mariasilva", content: "Enquete: qual paleta combina mais com a identidade da DIATINF? #design", minutesAgo: 240 },
  { author: "luispereira", content: "Descobri hoje que TypeScript não é só JavaScript com tipos. É JavaScript com paz de espírito.", minutesAgo: 320 },
];

const comments = [
  { post: 0, author: "pedrolima", content: "Sensacional, Maria! Quero ver.", minutesAgo: 1 },
  { post: 0, author: "anacosta", content: "Compartilha o moodboard depois?", minutesAgo: 1 },
  { post: 0, author: "carloscosta", content: "A gente precisa de mais gente com essa energia às 6h da manhã.", minutesAgo: 1 },
  { post: 0, author: "mariasilva", content: "Assim que sair do rascunho eu posto aqui!", replyTo: 0, minutesAgo: 0 },

  { post: 1, author: "ricardosantos", content: "Aqui o build passou, mas faltava uma variável de ambiente.", minutesAgo: 10 },
  { post: 1, author: "carloscosta", content: "Era isso mesmo. Obrigado!", replyTo: 4, minutesAgo: 8 },

  { post: 2, author: "carlanunes", content: "Isso deveria estar em todo checklist de entrega.", minutesAgo: 40 },
  { post: 2, author: "joaosouza", content: "Salvei esse post. Vou revisar os contrastes do meu protótipo.", minutesAgo: 30 },

  { post: 3, author: "pedrolima", content: "Boa, João! Já testei aqui e ficou rápido.", minutesAgo: 50 },
  { post: 3, author: "mariasilva", content: "O feed ficou ótimo com o fundo cream.", minutesAgo: 45 },
  { post: 3, author: "pedrolima", content: "Concordo com a Maria, ficou leve.", replyTo: 9, minutesAgo: 40 },
  { post: 3, author: "carloscosta", content: "Já subiu na Vercel?", minutesAgo: 35 },

  { post: 4, author: "mariasilva", content: "Ficou muito bom o header em navy com o dourado.", minutesAgo: 80 },
  { post: 4, author: "joaosouza", content: "Manda o link do repositório depois?", minutesAgo: 70 },

  { post: 5, author: "luispereira", content: "Qual índice você usou?", minutesAgo: 150 },

  { post: 6, author: "joaosouza", content: "Voto na navy com o dourado.", minutesAgo: 230 },
  { post: 6, author: "mariasilva", content: "Foi a mais votada até agora!", replyTo: 15, minutesAgo: 225 },
  { post: 6, author: "joaosouza", content: "Combina demais com a identidade da DIATINF.", replyTo: 16, minutesAgo: 220 },
  { post: 6, author: "pedrolima", content: "Eu curti o cream de fundo.", minutesAgo: 210 },
  { post: 6, author: "joaosouza", content: "Fechou, vou aplicar no protótipo hoje.", minutesAgo: 190 },
  { post: 6, author: "joaosouza", content: "Atualizei os tokens de cor no repositório.", replyTo: 19, minutesAgo: 185 },
];

const ratings = [
  { post: 0, user: "pedrolima", value: 3 },
  { post: 0, user: "anacosta", value: 2 },
  { post: 2, user: "joaosouza", value: 3 },
  { post: 2, user: "mariasilva", value: 3 },
  { post: 3, user: "pedrolima", value: 3 },
  { post: 3, user: "mariasilva", value: 2 },
  { post: 4, user: "carloscosta", value: 2 },
  { post: 5, user: "joaosouza", value: 3 },
  { post: 5, user: "ricardosantos", value: 3 },
  { post: 6, user: "joaosouza", value: 2 },
  { post: 7, user: "pedrolima", value: 1 },
];

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000);
}

async function main() {
  await prisma.rating.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("diatinf123", 10);

  const users = new Map<string, string>();
  for (const person of people) {
    const user = await prisma.user.create({ data: { ...person, passwordHash } });
    users.set(person.username, user.id);
  }

  const postIds: string[] = [];
  for (const post of posts) {
    const created = await prisma.post.create({
      data: {
        content: post.content,
        authorId: users.get(post.author)!,
        createdAt: minutesAgo(post.minutesAgo),
      },
    });
    postIds.push(created.id);
  }

  const commentIds: string[] = [];
  for (const comment of comments) {
    const created = await prisma.comment.create({
      data: {
        content: comment.content,
        postId: postIds[comment.post],
        authorId: users.get(comment.author)!,
        parentId: comment.replyTo === undefined ? null : commentIds[comment.replyTo],
        createdAt: minutesAgo(comment.minutesAgo),
      },
    });
    commentIds.push(created.id);
  }

  for (const rating of ratings) {
    await prisma.rating.create({
      data: {
        value: rating.value,
        postId: postIds[rating.post],
        userId: users.get(rating.user)!,
      },
    });
  }

  console.log(
    `Seed concluído: ${people.length} usuários, ${posts.length} publicações, ${comments.length} comentários, ${ratings.length} avaliações.`
  );
  console.log('Senha de todos os usuários de teste: "diatinf123"');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
