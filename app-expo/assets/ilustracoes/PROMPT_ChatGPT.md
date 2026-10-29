# Ilustrações do app Seguro Residencial: prompt para o ChatGPT

Guia para gerar **as 17 ilustrações finais** do app no ChatGPT (geração de imagem). Elas substituem os desenhos em SVG do protótipo, sem mexer no código: cada arquivo tem um nome fixo e o app troca o desenho pela imagem assim que ela chega.

## Como usar (passo a passo)

1. Abra **um chat novo** no ChatGPT e gere tudo **no mesmo chat**. É isso que mantém os personagens e o traço iguais de uma imagem para outra.
2. Se tiver, **anexe a imagem de referência da campanha BB Digital Week** (a que o time já usa) junto com a primeira mensagem. Ela serve só de referência de estilo; nada dela é copiado.
3. Cole o **PROMPT MESTRE** (bloco 1) inteiro. O ChatGPT vai responder com a folha de personagens (imagem 00).
4. Confira a imagem 00 com o checklist do fim deste arquivo. Se algo estiver errado, peça para refazer a 00 antes de seguir: todo o resto copia dela.
5. Cole os pedidos das imagens 01 a 16, **um por mensagem** e na ordem. Depois de cada imagem, confira com o checklist e, se precisar, peça "refaça a imagem NN corrigindo: ...".
6. Se em algum momento o traço ou os personagens mudarem, mande: "Volte para a bíblia de estilo e para a folha de personagens (imagem 00) e refaça a imagem NN."
7. Baixe cada imagem em **PNG com fundo transparente** e salve com o **nome exato** da tabela abaixo. Envie os arquivos para o Guilherme (pasta `app-expo/assets/ilustracoes/`).

## O que entregar

| Nº | Arquivo | Tamanho | Onde aparece no app |
|---|---|---|---|
| 00 | `00_personagens.png` | 1536 × 1024 | Referência interna (não vai para o app) |
| 01 | `heroi_entrada.png` | 1536 × 1024 | Topo da tela "Seguro Residencial", sobre o cabeçalho azul |
| 02 | `cena_agua.png` | 1536 × 1024 | Passo 2, situação "Alagamento" |
| 03 | `cena_raio.png` | 1536 × 1024 | Passo 2, "Queda de raio" |
| 04 | `cena_vizinho_apto.png` | 1536 × 1024 | Passo 2, "Danos a terceiros" (apartamento) |
| 05 | `cena_vizinho_casa.png` | 1536 × 1024 | Passo 2, "Danos a terceiros" (casa) |
| 06 | `cena_roubo.png` | 1536 × 1024 | Passo 2, "Arrombamento" |
| 07 | `cena_vidros.png` | 1536 × 1024 | Passo 2, "Vidro quebrado" |
| 08 | `cena_vento_apto.png` | 1536 × 1024 | Passo 2, "Vendaval" (apartamento) |
| 09 | `cena_vento_casa.png` | 1536 × 1024 | Passo 2, "Vendaval" (casa) |
| 10 | `cena_fogo.png` | 1536 × 1024 | Passo 2, "Incêndio" |
| 11 | `cena_impacto.png` | 1536 × 1024 | Passo 2, "Batida de carro" |
| 12 | `cena_aluguel.png` | 1536 × 1024 | Passo 2, "Casa interditada" |
| 13 | `cena_despesas.png` | 1536 × 1024 | Passo 2, "Emergência" |
| 14 | `casa_protegida.png` | 1024 × 1024 | Cartão azul de "Meu seguro" |
| 15 | `gerente_ricardo.png` | 1024 × 1024 | Telas "Falar com o gerente" e retorno do gerente |
| 16 | `gerente_painel.png` | 1536 × 1024 | Portal do gerente (tela vazia, antes de abrir um cliente) |

No app, as cenas aparecem pequenas: cerca de **220 × 130 pontos** no celular. Por isso o prompt pede formas grandes, poucos objetos e nada de detalhe miúdo.

---

## 1. PROMPT MESTRE (colar primeiro, inteiro)

```
You are the lead illustrator and art director for the mobile app of a large Brazilian retail bank. You will create a SET of 17 flat vector illustrations for the bank's home-insurance journey ("Seguro Residencial"). Every image must look like it was drawn by the same artist on the same day. Before drawing anything, read and lock this STYLE BIBLE. Apply it to every image in this conversation. If a later request seems to conflict with it, the bible wins.

=== STYLE BIBLE ===

1. PURPOSE AND TONE (business rules, non-negotiable)
- The app shows a client what would be left uncovered if something happened at home, using facts. It informs; it never scares. The tone is calm, warm, competent, slightly playful. Think "a friend explaining", not "an alarm".
- Show the moment right after a household incident, with the person reacting calmly (surprised, thoughtful, hand on head, taking action). Never panic, crying, screaming, injury, blood, victims, or danger to people.
- Never draw criminals, thieves, masks, weapons or violence. A burglary is shown only by its traces (a forced door, an empty shelf).
- Never draw money, coins, bills, price tags, charts, contracts or shields with dollar signs.
- Never draw text, letters, numbers, words, logos, brand marks, app icons, UI, watermarks or signatures. No bank logo. Screens of phones, TVs and laptops are plain flat color.
- The cast is diverse in skin tone, age and body type, and always dignified. Everyday Brazilian homes: apartments with white walls, light porcelain floors, a ceiling fan, sliding windows; houses with a front wall and gate ("muro e portão"), a ceramic roof, a water tank.

2. ILLUSTRATION STYLE
- Flat 2D vector editorial cartoon, like a premium fintech brand campaign. Inspired by the attributes of the attached reference (if any): elongated arms and legs, small heads, playful proportions, bold flat color, diagonal color blocks. Do NOT copy any character, pose or composition from the reference; create original characters.
- Characters: body about 6 heads tall, long thin limbs, small oval head, simple face (two small dot eyes, short curved eyebrows, small curved mouth, no nose or a tiny line). Simplified mitten-like hands with at most 4 fingers visible; hands drawn clearly, never melted or extra fingers.
- Line: one uniform dark-navy outline (#1B1F6B) around every shape, about 4 px thick at 1536 px width, round caps and joins. The same thickness everywhere, in every image. No sketchy or variable lines.
- Fills: solid flat colors only. No gradients, no 3D, no glossy highlights, no realistic lighting, no drop shadows on objects. You may add ONE flat shade tone per object (the same hue about 12% darker) for depth, sparingly.
- Accents: tiny four-point sparkles and short motion lines (3 short strokes) in the navy line color or yellow, max 3 per image.
- Ground: a soft flat ellipse under the scene in #1B1F6B at 10% opacity. No floor rectangle, no room box, no horizon.
- Shapes are big, simple and readable. Every object reads as a silhouette. No small clutter, no patterns, no textures, no tiny details that disappear when the image is shrunk.

3. EXACT COLOR PALETTE (use only these; hex codes are strict)
- Brand blue #465EFF and deep blue #2D37F5: main surfaces, clothes, furniture, the car.
- Light blue #E4ECFF: walls, light surfaces, glass. Light gray-blue #B9C3E8: metal, smoke, secondary objects.
- Yellow #FCFC30 (pale yellow #FFF6A8): highlights, roofs, light from windows, lightning, sparkles.
- Turquoise #3BE0C9: plants, trees, small accents (there is NO green in this brand; all plants are turquoise).
- Coral #FF6F68 (and pink #FF8FB8 very sparingly): clothes accents, flames, warm details.
- Water blue #6FA2FF for water and rain. White #FFFFFF for walls, appliances, paper.
- Outline navy #1B1F6B. Skin tones #F6C7A4, #F2B28A, #C98A5E, #8A5634. Hair #1E1A33, #2A1F4A, gray hair #B9C3E8.
- Balance per image: about 60% blues and white, 30% one warm accent (yellow or coral), 10% turquoise and small accents.
- FORBIDDEN: any green, purple, brown wood tones, black fills, orange-red alarm tones, gray backgrounds, neon, gradients.

4. CANVAS AND COMPOSITION
- PNG with a TRANSPARENT background. Nothing behind the scene: no colored rectangle, no sky box, no frame. The app draws its own background.
- Landscape 1536 x 1024 unless the request says otherwise. Keep everything inside the central safe area: 8% margin on all sides, and all important content within a horizontal band 1400 x 800 px in the center (the app may crop the top and bottom a little).
- One focal point per image, read in under one second. At most 2 characters and about 6 objects.
- Consistent scale across the set: a standing adult is about 60% of the canvas height. Furniture and houses keep the same proportions to people in every image.
- Thumbnail test: the image must still be clear when shrunk to 220 px wide. If a detail would vanish at that size, remove it or make it bigger.

5. FIXED CAST (the same people in every image; names are internal, never written)
- BIA, the main client: Brazilian woman, about 30, warm medium-brown skin #C98A5E, big dark curly hair #1E1A33 (rounded cloud shape), coral #FF6F68 short-sleeve top, deep blue #2D37F5 trousers, navy shoes. Friendly, practical.
- DAVI, her partner: man, about 35, light tan skin #F2B28A, short dark hair #2A1F4A, yellow #FCFC30 t-shirt, brand blue #465EFF trousers, navy shoes.
- SEU JORGE, the neighbor: older man, about 65, dark skin #8A5634, short gray hair and short gray beard #B9C3E8, turquoise #3BE0C9 shirt, deep blue trousers, round glasses.
- RICARDO, the bank relationship manager: man, about 45, light skin #F6C7A4, short neat dark hair #2A1F4A, light blue #E4ECFF shirt, deep blue #2D37F5 blazer and trousers, navy tie, a plain yellow #FCFC30 lanyard with a blank card (no text, no logo). Calm, trustworthy smile.
- A SERVICE TECHNICIAN appears only in image 13: person of any gender, skin #F2B28A, turquoise #3BE0C9 work overalls, yellow cap, no logos.
Keep each person's face shape, hair shape, skin tone, clothes and proportions identical across images.

6. SELF-CHECK BEFORE SHOWING EACH IMAGE (regenerate silently if any item fails)
- Transparent background, nothing touching the edges, content inside the safe band.
- Only palette colors; no green, no gradients, no shadows, no 3D.
- Same outline color and thickness as image 00.
- Characters match the cast sheet exactly.
- No text, numbers, logos or UI anywhere (check screens, boxes, clothes, cars, walls).
- One clear focal point; readable at 220 px wide.
- Calm tone: nobody hurt, no criminal, no money.
- Hands and faces drawn cleanly (count the fingers).

7. HOW TO REPLY
For each request, generate exactly one image at the requested size, then write one line: the image number, the file name, and any rule you could not follow. Do not add captions inside the image.

=== FIRST TASK: IMAGE 00, CHARACTER SHEET ===
File name: 00_personagens.png. Size 1536 x 1024, transparent background.
Draw the four main characters (Bia, Davi, Seu Jorge, Ricardo) standing side by side in a neutral relaxed pose, full body, front 3/4 view, evenly spaced, same ground line, each on a soft 10% navy ground ellipse. Below them, a row of 12 flat color circles showing the palette (#465EFF, #2D37F5, #E4ECFF, #B9C3E8, #FCFC30, #FFF6A8, #3BE0C9, #FF6F68, #6FA2FF, #FFFFFF with navy outline, #1B1F6B, #C98A5E). No names, no labels, no text. This sheet is the reference for every next image.
```

---

## 2. PEDIDOS DAS IMAGENS (colar um por mensagem, na ordem)

```
IMAGE 01. File: heroi_entrada.png. 1536 x 1024, transparent.
Scene: the opening illustration of the insurance product, the welcome moment. A single-story house seen from the front, centered: white walls, a big yellow #FCFC30 triangular roof with navy outline, a small coral chimney on the left of the roof, a round white attic window, two square windows with pale yellow #FFF6A8 light and a navy cross frame, an arched brand blue door with a small yellow knob, a light gray-blue doorstep. To the upper right of the roof, a brand blue shield badge with a bold white check mark, with a soft pale yellow circle glow behind it (flat, not gradient). On the left, Bia standing, smiling, one arm extended pointing at the house. On the right, a rounded turquoise tree (two overlapping circles) with a navy trunk. Two small sparkles. The house is the focal point. Mood: "your home, understood and protected". This image will sit on a brand blue #465EFF background, so keep the whole composition with strong navy outlines and no blue large areas touching the edges.
```

```
IMAGE 02. File: cena_agua.png. 1536 x 1024, transparent.
Situation: heavy rain and a burst pipe flooding an apartment living room. Show a low layer of water blue #6FA2FF with simple white wave lines covering the floor, reaching the bottom of a brand blue sofa. On the left wall, a light gray-blue pipe with a small crack spraying three water drops. A sliding window on the right with rain lines outside. Bia stands in the water up to her ankles, lifting a closed laptop above the water with both hands, eyebrows raised, calm and practical. A coral cushion floats on the water. Focal point: Bia saving the laptop. No damage to people.
```

```
IMAGE 03. File: cena_raio.png. 1536 x 1024, transparent.
Situation: a power surge during a thunderstorm. On the right, a window showing a dark deep blue #2D37F5 sky with one big yellow zigzag lightning bolt. On the left, a flat TV on a low brand blue rack, its screen plain light blue, with a small yellow zigzag spark coming out of the power cord at the wall outlet. Bia, between them, has just unplugged the cord: she holds the plug in one hand and covers her mouth with the other, surprised. A white fridge partially visible at the far left edge (inside the safe area). Focal point: the spark at the outlet and Bia's reaction.
```

```
IMAGE 04. File: cena_vizinho_apto.png. 1536 x 1024, transparent.
Situation: water from the client's apartment leaks into the neighbor's apartment below ("infiltração no apê de baixo"). Show a clean cutaway of two stacked apartments separated by a thick white slab with navy outline. Upper floor: a white washing machine with a small puddle of water blue #6FA2FF under it, and Bia looking down at the floor with a hand on her head. Lower floor: a light blue ceiling with a water stain and three drops falling into a turquoise bucket held by Seu Jorge, who looks up, patient, eyebrows raised. Both floors equally readable. Focal point: the drops crossing from upstairs to downstairs.
```

```
IMAGE 05. File: cena_vizinho_casa.png. 1536 x 1024, transparent.
Situation: a branch from the client's tree fell on the neighbor's car. On the left, part of the client's house front wall (white, with a yellow roof edge) and a turquoise tree whose one thick branch has broken and rests on the roof of a brand blue hatchback car on the right. Three small impact lines and a tiny dent on the car roof. Seu Jorge stands next to his car with one hand on his head, surprised but calm. Bia comes from the left with an apologetic open-hand gesture. Focal point: the branch on the car.
```

```
IMAGE 06. File: cena_roubo.png. 1536 x 1024, transparent.
Situation: the client comes home and finds the door forced open. Center-left: a brand blue front door slightly open, with a broken lock shown as a few short navy splinter lines and two small light gray-blue wood chips on the floor. Center-right: a low white TV rack that is empty, showing the clean light outline (a lighter rectangle on the wall) where the TV used to hang, and an empty spot where a laptop used to be. Bia stands at the doorway holding her keys, one hand on her cheek, surprised. NO thief, NO person running, NO mask. Focal point: the empty shelf outline and the open door.
```

```
IMAGE 07. File: cena_vidros.png. 1536 x 1024, transparent.
Situation: a ball breaks a window. A large sliding window seen from inside, light blue #E4ECFF glass with a star-shaped crack and a few flat triangular glass shards in mid-air. A white-and-navy soccer ball has just come through the hole, with three motion lines behind it. Bia, inside, takes one step back with both hands up, surprised, slightly smiling (an accident, not a crime). Focal point: the ball and the crack.
```

```
IMAGE 08. File: cena_vento_apto.png. 1536 x 1024, transparent.
Situation: a windstorm hits an apartment. A tall sliding window has one glass panel cracked, curtains in pink #FF8FB8 blowing strongly inward, rain lines in water blue entering at an angle, and three wind swirl lines. Bia leans forward holding one curtain with both hands, hair blown back, determined. A small turquoise potted plant tipped over on the floor. Focal point: the open window with flying curtains.
```

```
IMAGE 09. File: cena_vento_casa.png. 1536 x 1024, transparent.
Situation: a windstorm lifts tiles off a house roof. A single-story white house with a yellow #FCFC30 ceramic roof; three yellow roof tiles flying off to the right, following curved wind lines, rain lines in water blue. The turquoise tree beside the house bends with the wind. Davi stands in front of the house holding his cap on his head with one hand, looking up at the roof. Focal point: the flying tiles.
```

```
IMAGE 10. File: cena_fogo.png. 1536 x 1024, transparent.
Situation: a short circuit starts a small fire in the kitchen. A row of white kitchen cabinets with a light gray-blue cooktop; above one outlet near the upper cabinet, a small contained flame drawn as flat coral #FF6F68 and yellow #FCFC30 teardrop shapes, with a soft light gray-blue smoke cloud. Bia stands at a safe distance using a small coral fire extinguisher, spraying a white puff toward the base of the flame, focused and in control. No big fire, no one hurt. Focal point: the extinguisher meeting the flame.
```

```
IMAGE 11. File: cena_impacto.png. 1536 x 1024, transparent.
Situation: a car hits the front wall of the house. A white front wall (muro) with a brand blue metal gate on the left; on the right, a deep blue #2D37F5 car whose front bumper touches the wall, where there is a crack in navy lines and a few small white wall fragments on the ground, plus three small impact sparkles. Davi stands on the sidewalk looking at the crack with one hand on his chin. The car driver is not shown (empty car, windows light blue). Focal point: the crack where the car touches the wall.
```

```
IMAGE 12. File: cena_aluguel.png. 1536 x 1024, transparent.
Situation: after a serious incident, the house needs repairs and the family must live somewhere else for a few months. On the left, the house front partly covered by light gray-blue scaffolding and a turquoise protective screen. On the right, Bia carries a white cardboard box (no text) and Davi rolls a brand blue suitcase, both walking to the right, calm, Bia looking back at the house. A yellow key on a ring in Davi's hand. Focal point: the couple leaving with box and suitcase.
```

```
IMAGE 13. File: cena_despesas.png. 1536 x 1024, transparent.
Situation: emergency service right after a storm, to stop the damage from getting worse. A house with a yellow roof where one part is covered by a large brand blue tarp tied with navy ropes. The service technician (turquoise overalls, yellow cap) stands on a light gray-blue ladder leaning safely against the wall, fixing the last corner of the tarp. Bia stands at the bottom holding the ladder steady with one hand and her phone in the other, relieved. A few last rain drops. Focal point: the tarp being secured.
```

```
IMAGE 14. File: casa_protegida.png. 1024 x 1024, transparent.
Small icon-like illustration for the "My insurance" card, which has a brand blue #465EFF background. A simple house front centered: white walls, a big yellow #FCFC30 roof drawn as a thick rounded chevron stroke, one pale yellow square window, a light blue door. On the upper right corner of the house, a white circle badge with a bold deep blue #2D37F5 check mark. Outline in navy #1B1F6B, but make sure the white and yellow shapes stand out on a brand blue background. No people, no ground ellipse, no sparkles. Fill about 70% of the canvas.
```

```
IMAGE 15. File: gerente_ricardo.png. 1024 x 1024, transparent.
Portrait of Ricardo, the bank relationship manager, from the waist up, centered, slightly turned to the right, friendly smile, one hand raised in a small greeting wave, the other holding a white tablet against his chest (screen not visible). Light blue shirt, deep blue blazer, navy tie, plain yellow lanyard with a blank card (no text, no logo). Exactly the same face, hair and clothes as in image 00. No background, no desk. This image appears inside a circle avatar and in a card, so keep him centered with 10% margin.
```

```
IMAGE 16. File: gerente_painel.png. 1536 x 1024, transparent.
Scene for the manager portal, the moment before he opens a client's request. Ricardo sits at a simple light blue desk, looking at a white tablet in his hands with a calm, attentive expression. Floating to the right of him, three simple white cards with navy outline stacked diagonally, each with a small brand blue house glyph and two gray-blue blank bars (no text), the front card with a yellow check circle. A turquoise plant in a white pot on the desk. Focal point: Ricardo reviewing the cards. Mood: organized, attentive, human.
```

---

## 3. CHECKLIST DE APROVAÇÃO (para cada imagem)

- [ ] Fundo **transparente** (no ChatGPT aparece xadrez ou branco; ao baixar, confira que é PNG sem fundo). Se vier com fundo, peça: "same image, transparent background, PNG".
- [ ] Nenhum texto, número, logo ou marca (olhe telas, caixas, carros, roupas).
- [ ] Nenhum verde. Plantas em turquesa.
- [ ] Sem degradê, sem 3D, sem sombra. Contorno azul-escuro de espessura igual à da imagem 00.
- [ ] Personagens iguais aos da folha 00 (cabelo, pele, roupa, proporção).
- [ ] Mãos e rostos limpos (conte os dedos).
- [ ] Tom calmo: ninguém machucado, nenhum ladrão, nenhum dinheiro.
- [ ] Dá para entender a cena com a imagem pequena (afaste o rosto da tela ou reduza a 220 px).
- [ ] Nada encostando na borda; o principal no centro.

**Pedidos de correção que funcionam bem:** "refaça a imagem 07 mantendo tudo, mas com a Bia igual à folha 00", "a linha está mais grossa que na 00, iguale", "tire o verde da planta, use #3BE0C9", "remova o texto da caixa", "fundo transparente".

## 4. Depois de gerar

Coloque os PNGs em `app-expo/assets/ilustracoes/` com os nomes da tabela e avise. Para ligar cada imagem no app basta descomentar a linha dela em `app-expo/src/ui/imagens.ts`; enquanto a imagem não existe, o app continua mostrando o desenho em SVG.
