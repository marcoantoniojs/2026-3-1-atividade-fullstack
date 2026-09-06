# Diatinf X — Sistema de design

Tokens extraídos dos protótipos [diatinf-x.jpg](diatinf-x.jpg) (mobile) e
[diatinf-x-desktop.jpg](diatinf-x-desktop.jpg) (desktop), alinhados à
[identidade visual da DIATINF](https://diatinf.ifrn.edu.br/identidade-visual/).

## Paleta

| Token | Valor | Uso |
| --- | --- | --- |
| `--navy-900` | `#0C3453` | Cabeçalho, barra de navegação, texto principal, botão "Comentar" |
| `--navy-700` | `#164B72` | Hover e gradiente da barra lateral no desktop |
| `--orange-600` | `#CE701B` | Item ativo da navegação, hover de botão primário |
| `--orange-500` | `#F1881D` | Ação primária: novo post, busca, meus posts |
| `--gold-400` | `#FDC616` | Logotipo "Diatinf X", estrelas de avaliação, chip do usuário |
| `--cream-100` | `#F9EBC2` | Fundo da coluna de feed e dos comentários |
| `--steel-300` | `#A4BCCC` | Barra lateral direita (Social Stats), texto secundário sobre navy |
| `--surface` | `#FFFFFF` | Cards de publicação |
| `--text` | `#0C3453` | Texto principal |
| `--text-muted` | `#5B7285` | Arroba, horário, texto de apoio |
| `--border` | `rgba(12,52,83,.12)` | Contornos de card, campo e chip |

## Tipografia

Família `Inter`, com fallback para `system-ui`. Pesos 400, 600, 700 e 800.

Escala: `12 · 13 · 14 · 16 · 18 · 22 · 28 · 32` px.

O logotipo usa 28–32px, peso 800, `letter-spacing: -0.5px` e `--gold-400`.

## Espaçamento, raios e sombra

- Espaçamento em base 4: `4 · 8 · 12 · 16 · 24 · 32 · 48` px.
- Raios: `sm 6px`, `md 10px`, `lg 16px`, `pill 999px`.
- Sombra: `0 1px 2px rgba(12,52,83,.08), 0 2px 8px rgba(12,52,83,.10)`.

## Layout

**Mobile (< 768px) — referência principal, o projeto é mobile first.**
Cabeçalho navy fixo com logotipo, linha do usuário e botões de busca / novo post /
menu. Abaixo, a coluna de feed em `--cream-100`. No rodapé, uma barra de navegação
navy com quatro destinos (Home, Global Feed, Meus Posts, Social Stats), com o item
ativo destacado em `--orange-600`.

**Desktop (>= 1024px).**
Cabeçalho navy ocupando toda a largura, com logotipo à esquerda, campo de busca
centralizado com botão laranja e chip em `--gold-400` com os dados do usuário à
direita. O conteúdo usa um grid de três colunas (`260px | 1fr (máx. 640px) | 300px`):
barra lateral navy com os botões laranja "Novo Post" e "Meus Posts", coluna de feed
em `--cream-100` e barra lateral em `--steel-300` com "Quem você mais comenta" e
"Quem mais te comenta". A barra de navegação inferior é ocultada.
