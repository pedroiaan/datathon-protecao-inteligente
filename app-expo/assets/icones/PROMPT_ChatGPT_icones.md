# Ícones e visuais do app Seguro Residencial: prompt 2 para o ChatGPT

Segunda leva, depois das 17 ilustrações. Agora são **os ícones e os visuais que ainda estão desenhados no código** e ficariam abaixo da qualidade das ilustrações novas:

- **28 ícones ilustrados:** coberturas, assistências, atalhos do Meu seguro, fatos da entrada, pagamento e canais do gerente. Saem em **5 folhas** (grade de 3 × 2), não um por um; o Guilherme fatia no computador.
- **6 visuais:** papel de parede da tela de bloqueio (o primeiro quadro do vídeo), casa do cartão "Meu seguro", casa da animação de contratação, e uma imagem para cada plano (Essencial, Prático, Total).

## Como usar (passo a passo)

1. **De preferência, continue no MESMO chat das ilustrações.** Assim o ChatGPT mantém o traço, as cores e a linha. Se não der, abra um chat novo e **anexe 4 imagens da primeira leva**: `00_personagens.png`, `heroi_entrada.png`, `cena_agua.png` e `casa_protegida.png`.
2. Cole o **PROMPT MESTRE 2** (bloco 1) inteiro. Ele responde com a folha de ícones I1.
3. Confira a I1 com o checklist do fim. Se o estilo dos ícones não estiver certo, corrija **antes** de seguir: as outras folhas copiam a I1.
4. Cole os pedidos seguintes, **um por mensagem**, na ordem: I2, I3, I4, I5 e depois V1 a V6.
5. Baixe tudo em **PNG com fundo transparente** (exceto o papel de parede V1, que tem fundo) e salve com o **nome exato** da tabela. Mande tudo para o Guilherme.

## O que entregar

### Ícones (5 folhas, pasta `app-expo/assets/icones/`)
| Folha | Arquivo | Tamanho | Ícones, na ordem (linha de cima, da esquerda para a direita; depois a linha de baixo) |
|---|---|---|---|
| I1 | `folha_I1.png` | 1536 × 1024 | incendio · eletricos · agua · vendaval · impacto · roubo |
| I2 | `folha_I2.png` | 1536 × 1024 | vidros · terceiros · casa · emergencia · chuva · temporada |
| I3 | `folha_I3.png` | 1536 × 1024 | reparos · eletrodomesticos · limpeza · moveis · pragas · seguranca |
| I4 | `folha_I4.png` | 1536 × 1024 | assistencia · cobertura · duvida · chaveiro · debito · cartao |
| I5 | `folha_I5.png` | 1536 × 1024 | pix · chat · ligacao · video · (vazio) · (vazio) |

Cada ícone vira `ic_<nome>.png` (ex.: `ic_incendio.png`) quando o Guilherme roda `npm run icones`.

### Visuais (pasta `app-expo/assets/ilustracoes/`)
| Nº | Arquivo | Tamanho | Onde aparece |
|---|---|---|---|
| V1 | `papel_parede.png` | 1024 × 1536 | Fundo da tela de bloqueio, com o aviso do BB (primeiro quadro do vídeo) |
| V2 | `meu_seguro_casa.png` | 1024 × 1024 | Cartão azul de "Meu seguro", canto direito |
| V3 | `sucesso_casa.png` | 1024 × 1024 | Frente da "moeda" que gira na animação de contratação |
| V4 | `plano_essencial.png` | 1024 × 1024 | Cartão do plano Essencial (Seleção de planos) |
| V5 | `plano_pratico.png` | 1024 × 1024 | Cartão do plano Prático |
| V6 | `plano_total.png` | 1024 × 1024 | Cartão do plano Total |

No celular, os ícones aparecem **entre 28 e 40 pontos**, dentro de um círculo azul-claro que o app já desenha. Por isso o prompt pede formas grossas e no máximo 3 elementos por ícone.

---

## 1. PROMPT MESTRE 2 (colar primeiro, inteiro)

```
We are continuing the same project: the home-insurance journey ("Seguro Residencial") inside the mobile app of a large Brazilian retail bank. You already drew the illustration set with a STYLE BIBLE (flat 2D vector, uniform dark-navy outline #1B1F6B, flat brand colors, no gradients, no 3D, no text, no logos, calm tone). Everything in that bible still applies. If the previous images are not in this conversation, the attached images are the reference: match their line, color and mood exactly.

Now you will create the rest of the app's visual system so nothing in the app looks generic next to those illustrations: 28 SPOT ICONS (delivered on 5 grid sheets) and 6 VISUALS. Read and lock the ICON BIBLE below before drawing.

=== ICON BIBLE ===

1. WHAT A SPOT ICON IS HERE
- A tiny illustration of one object or idea, in the same world as the illustrations (same outline color, same palette, same rounded shapes), but much simpler.
- It will be displayed very small: 28 to 40 points on a phone, centered inside a light-blue circle (#E4ECFF) that the app draws. Do NOT draw that circle; the icon itself has a transparent background.
- One idea per icon. At most 3 shapes. No people, no faces, no hands (except where stated), no scenery, no ground, no sparkles, no motion lines.

2. DRAWING RULES
- Uniform dark-navy outline #1B1F6B, thick: about 6% of the icon's width (about 22 px when the icon is 380 px wide). Same thickness on every icon of every sheet. Round caps and joins.
- Flat fills only, from this palette: brand blue #465EFF (main fill), deep blue #2D37F5 (secondary), white #FFFFFF, light blue #E4ECFF, yellow #FCFC30 (ONE accent per icon), turquoise #3BE0C9 or coral #FF6F68 only where they carry meaning (flame, plant, alert).
- Composition: front view or a gentle 3/4 view, the same on every icon. Centered, optically balanced, with a slight bottom weight.
- Every icon fills the same optical size: it fits inside a 380 x 380 px square centered in its 512 x 512 cell. Wide objects are as wide as tall objects are tall.
- Thumbnail test: shrink to 32 px; the object must still be recognizable by silhouette alone. If not, simplify.
- FORBIDDEN: text, letters, numbers, currency symbols, logos (no bank logo, no Pix logo, no card brand), gradients, shadows, 3D, glossy highlights, thin lines, green, purple, black fills, tiny details.

3. SHEET FORMAT (very important: the sheets will be cut automatically)
- Each sheet: 1536 x 1024 px, TRANSPARENT background, a 3-column x 2-row grid of invisible 512 x 512 cells.
- One icon per cell, centered in its cell, never crossing into another cell, with at least 60 px of empty space to every cell edge.
- Do not draw grid lines, frames, labels, numbers or captions. Only the icons.
- Order: top row left to right, then bottom row left to right, exactly as listed in each request.

4. SELF-CHECK BEFORE SHOWING EACH SHEET (redraw if any item fails)
- 6 icons (or the stated number), in the requested order, each inside its own cell with clear empty space around it.
- Same outline thickness and color as the illustrations, same optical size across all icons.
- Only palette colors, one yellow accent at most per icon, no green.
- No text, no numbers, no logos, no currency symbols.
- Each icon readable at 32 px.

5. HOW TO REPLY
Generate exactly one image per request, then write one line: the sheet or visual id, the file name, and anything you could not follow.

=== FIRST TASK: SHEET I1 ===
File: folha_I1.png. 1536 x 1024, transparent, 3 x 2 grid as described.
Top row:
1. incendio (fire): a single rounded flame, coral #FF6F68 outer flame with a yellow inner flame, sitting on a short deep-blue log.
2. eletricos (power surge): a white wall power outlet (rounded square, two round holes) with a yellow lightning bolt crossing its upper right corner.
3. agua (water damage): a big brand-blue water drop with a white highlight curve, and two small wave lines under it in light blue.
Bottom row:
4. vendaval (windstorm): two thick curved wind swirls in brand blue and white, with one small yellow roof tile flying between them.
5. impacto (vehicle impact): the front of a small deep-blue car seen from the side, touching a short white wall with a crack.
6. roubo (burglary): a white front door slightly open with a broken padlock (yellow body, open shackle) hanging from it.
```

---

## 2. PEDIDOS (colar um por mensagem, na ordem)

```
SHEET I2. File: folha_I2.png. 1536 x 1024, transparent, 3 x 2 grid, same ICON BIBLE.
Top row:
1. vidros (broken glass): a window pane in light blue with a white frame and a bold star-shaped crack.
2. terceiros (damage to others): two small house fronts side by side, the left one brand blue, the right one white, with one water drop falling from the left onto the right.
3. casa (home / rebuild): a simple house front, white walls, yellow roof, brand-blue door.
Bottom row:
4. emergencia (emergency): a rounded emergency beacon light, coral dome on a deep-blue base, with three short yellow rays.
5. chuva (heavy rain): a white cloud with navy outline and four slanted brand-blue rain drops.
6. temporada (holiday home): a small white house with a yellow roof next to a turquoise palm tree.
```

```
SHEET I3. File: folha_I3.png. 1536 x 1024, transparent, 3 x 2 grid, same ICON BIBLE. These are the home-assistance service packages.
Top row:
1. reparos (home in trouble / repairs): a brand-blue toolbox with a yellow handle and a white wrench resting on top.
2. eletrodomesticos (appliances working): a white front-loading washing machine with a brand-blue round door and a small yellow knob.
3. limpeza (clean home): a broom with a yellow brush and a deep-blue handle, with one small white sparkle-free shine curve.
Bottom row:
4. moveis (tidy home / belongings): a brand-blue two-seat sofa with one white cushion.
5. pragas (pest control): a simple round coral beetle seen from above, inside a brand-blue "no" ring (circle with diagonal bar).
6. seguranca (safe home): a brand-blue shield with a small white house inside it and a yellow keyhole on the house door.
```

```
SHEET I4. File: folha_I4.png. 1536 x 1024, transparent, 3 x 2 grid, same ICON BIBLE.
Top row:
1. assistencia (ask for assistance): a deep-blue round phone handset over a small yellow wrench, crossed like a badge.
2. cobertura (what the plan covers): a brand-blue shield with a big white check mark.
3. duvida (ask a question): a white rounded chat bubble with navy outline holding a bold brand-blue question mark shape drawn as a curve and a dot (a symbol, not a letter typeface).
Bottom row:
4. chaveiro (locksmith): a yellow key with a round head, slightly tilted, with a small brand-blue key ring.
5. debito (debit from bank account): a brand-blue wallet with a white flap and a yellow clasp.
6. cartao (credit card): a brand-blue card tilted slightly, with a yellow chip and a white stripe. No numbers, no brand, no text.
```

```
SHEET I5. File: folha_I5.png. 1536 x 1024, transparent, same 3 x 2 grid, but only the first 4 cells are used; cells 5 and 6 stay empty.
Top row:
1. pix (instant payment): two bold curved arrows forming a circle, one brand blue and one turquoise, with a small yellow lightning bolt in the center. Do NOT draw the official Pix logo or any diamond-shaped logo.
2. chat (chat in the app): two overlapping speech bubbles, the front one brand blue with three white dots, the back one white.
3. ligacao (phone call): a deep-blue phone handset with two short yellow sound arcs.
Bottom row:
4. video (video call): a white rounded screen with a brand-blue camera lens circle and a small yellow recording dot.
5. (leave empty)
6. (leave empty)
```

```
VISUAL V1. File: papel_parede.png. 1024 x 1536 (portrait), FULL BACKGROUND (not transparent).
Phone lock-screen wallpaper in the same visual world. Deep navy #1C2266 base. Large soft flat shapes, no gradients: a big brand-blue #465EFF circle partly off the top-left corner, a deep-blue #2D37F5 diagonal band crossing the lower half, a turquoise #3BE0C9 quarter circle in the bottom-left corner at low opacity (about 35%), and a thin yellow #FCFC30 arc near the bottom right. Optional: very subtle paper grain over everything (2 to 3% opacity). Keep the top 45% calm and dark enough for a big white clock and white notification cards to be read over it. No house, no people, no text, no logo. Elegant and quiet.
```

```
VISUAL V2. File: meu_seguro_casa.png. 1024 x 1024, transparent.
The house for the "My insurance" card. The card behind it is brand blue #465EFF, so design for that background. A cozy single-story house in a gentle 3/4 view: white walls, a bold yellow #FCFC30 roof, two warm pale-yellow #FFF6A8 lit windows, a deep-blue door, a small turquoise bush on one side. On the upper right of the roof, a white round badge with a bold deep-blue check mark, slightly overlapping the roof edge. A soft flat pale-yellow circle glow behind the house (flat, about 30% opacity). Navy outline #1B1F6B everywhere. No ground, no people, no sparkles. The house fills about 75% of the canvas, centered.
```

```
VISUAL V3. File: sucesso_casa.png. 1024 x 1024, transparent.
The front face of a "coin" that spins in the contract-success animation (it flips and reveals a check mark that the app draws itself). Draw ONLY the house, perfectly front-facing and symmetrical, centered: white walls, a thick yellow #FCFC30 roof drawn as a rounded chevron, a coral chimney on the right, a pale-yellow square window with a deep-blue cross on the left, a brand-blue arched door on the right with a yellow knob. Navy outline #1B1F6B. It sits on a brand-blue background inside a translucent white circle that the app draws, so keep the house within the central 70% of the canvas. No badge, no check, no ground, no sparkles.
```

```
VISUAL V4. File: plano_essencial.png. 1024 x 1024, transparent.
Small emblem illustration for the ESSENTIAL plan (basic protection: fire, power surge, water, wind, vehicle impact). A simple white house front with a yellow roof, under a brand-blue umbrella held open above it. Nothing else. Centered, fills 70% of the canvas, navy outline, flat colors.
```

```
VISUAL V5. File: plano_pratico.png. 1024 x 1024, transparent.
Small emblem for the PRACTICAL plan (everything in Essential plus burglary and broken glass, plus more home assistance). The same house and umbrella as V4, plus a small brand-blue toolbox with a yellow handle at the bottom right and a small yellow padlock at the bottom left. Same scale and position of the house as V4, so the three plan images feel like a family.
```

```
VISUAL V6. File: plano_total.png. 1024 x 1024, transparent.
Small emblem for the TOTAL plan (everything, including damage to third parties and rent if the home becomes unlivable). The same house, umbrella, toolbox and padlock as V5, plus a second small neighbor house (white with a coral roof) behind and to the right, and a small coral heart above the umbrella. Same scale and position of the main house as V4 and V5.
```

---

## 3. CHECKLIST DE APROVAÇÃO

**Folhas de ícones (I1 a I5)**
- [ ] Fundo transparente e 6 ícones (4 na I5) na ordem pedida.
- [ ] Cada ícone bem no meio da sua "célula", com espaço vazio em volta. Nenhum encosta no vizinho (é isso que permite cortar automaticamente).
- [ ] Contorno azul-marinho grosso, da mesma espessura em todos, e todos do mesmo "tamanho visual".
- [ ] Nenhum texto, número, cifrão, logo (Pix, bandeira de cartão, BB) ou grade desenhada.
- [ ] Reduza a imagem até cada ícone ficar com uns 32 px: ainda dá para reconhecer?

**Visuais (V1 a V6)**
- [ ] V1 com fundo; V2 a V6 transparentes.
- [ ] V1: a parte de cima é calma e escura (o relógio e os avisos ficam ali).
- [ ] V4, V5 e V6 com a mesma casa, no mesmo lugar e no mesmo tamanho (eles aparecem lado a lado).
- [ ] Mesmo traço e mesmas cores das ilustrações da primeira leva.

**Correções que funcionam:** "refaça a folha I2 com o contorno igual ao da I1", "o ícone 3 da I4 tem texto, troque por um símbolo desenhado", "afaste os ícones das bordas das células", "a casa do V5 tem que estar no mesmo lugar da V4".

## 4. Depois de gerar

Coloque as folhas em `app-expo/assets/icones/` e os visuais em `app-expo/assets/ilustracoes/`, com os nomes acima, e avise. Os passos no código ficam no fim de `app-expo/src/ui/imagens.ts`: fatiar as folhas com `npm run icones` e descomentar a linha de cada imagem. Enquanto uma imagem não chega, o app continua com o desenho atual.
