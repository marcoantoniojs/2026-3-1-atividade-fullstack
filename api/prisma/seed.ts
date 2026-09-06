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
  { author: "pedrolima", content: "Terminei o protótipo mobile first do trabalho de POS. Faltam os comentários encadeados.", minutesAgo: 96 },
  { author: "fernandadias", content: "Índice certo no Postgres transformou uma consulta de 2s em 30ms. Modelagem importa. #banco", minutesAgo: 180 },
  { author: "luispereira", content: "Descobri hoje que TypeScript não é só JavaScript com tipos. É JavaScript com paz de espírito.", minutesAgo: 320 },
];

const comments = [
  { post: 0, author: "pedrolima", content: "Sensacional, Maria! Quero ver." },
  { post: 0, author: "anacosta", content: "Compartilha o moodboard depois?" },
  { post: 0, author: "carloscosta", content: "A gente precisa de mais gente com essa energia às 6h da manhã." },
  { post: 0, author: "mariasilva", content: "Assim que sair do rascunho eu posto aqui!", replyTo: 0 },
  { post: 1, author: "ricardosantos", content: "Aqui o build passou, mas a variável de ambiente estava faltando." },
  { post: 1, author: "carloscosta", content: "Era isso mesmo. Obrigado!", replyTo: 4 },
  { post: 2, author: "carlanunes", content: "Isso deveria estar em todo checklist de entrega." },
  { post: 3, author: "mariasilva", content: "Ficou muito bom o header em navy com o dourado." },
  { post: 4, author: "luispereira", content: "Qual índice você usou?" },
];

const ratings = [
  { post: 0, user: "pedrolima", value: 3 },
  { post: 0, user: "anacosta", value: 2 },
  { post: 2, user: "joaosouza", value: 3 },
  { post: 2, user: "mariasilva", value: 3 },
  { post: 3, user: "carloscosta", value: 2 },
  { post: 4, user: "joaosouza", value: 3 },
  { post: 4, user: "ricardosantos", value: 3 },
  { post: 5, user: "pedrolima", value: 1 },
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
  for (const [index, comment] of comments.entries()) {
    const created = await prisma.comment.create({
      data: {
        content: comment.content,
        postId: postIds[comment.post],
        authorId: users.get(comment.author)!,
        parentId: comment.replyTo === undefined ? null : commentIds[comment.replyTo],
        createdAt: minutesAgo(posts[comment.post].minutesAgo - 1 - index),
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
