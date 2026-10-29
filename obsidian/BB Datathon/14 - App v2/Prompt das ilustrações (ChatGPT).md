---
tags: [app, ilustracoes, design, prompt, datathon-bb]
data: 2026-10-29
status: enviado ao time para gerar
arquivo: app-expo/assets/ilustracoes/PROMPT_ChatGPT.md
---
# 🎨 Prompt das ilustrações (ChatGPT)

As ilustrações em SVG feitas no código funcionam, mas o time vai trocá-las por imagens geradas no ChatGPT, com mais acabamento. O prompt completo está em **`app-expo/assets/ilustracoes/PROMPT_ChatGPT.md`**: é só copiar e colar.

## O que tem no arquivo
1. **Passo a passo em português**: um chat só para todas as imagens; anexar a referência BB Digital Week; prompt mestre primeiro; uma imagem por mensagem; como pedir correção.
2. **Prompt mestre em inglês** (o modelo segue com mais precisão), com a **bíblia de estilo**:
   - **Tom (regras de negócio):** informar, nunca assustar ("o aviso justifica com fatos, não é isca"). Ninguém ferido, nenhum ladrão, nenhum dinheiro, nenhum texto ou logo.
   - **Estilo:** vetor chapado, personagens com braços e pernas alongados, contorno azul-marinho uniforme, sem degradê, sem 3D e sem sombra.
   - **Paleta com hex exato** e proporção 60/30/10. **Sem verde**, porque o app é só azul: plantas em turquesa.
   - **Tela:** PNG com **fundo transparente** (o app desenha o fundo em blocos), margem segura de 8% e faixa central de 1400 × 800.
   - **Teste da miniatura:** a cena tem que ler bem a 220 px de largura, que é o tamanho real no celular.
   - **Elenco fixo:** Bia (cliente), Davi, Seu Jorge (vizinho), Ricardo (gerente), com pele, cabelo e roupa definidos.
   - **Autochecagem antes de mostrar cada imagem**, com regra de refazer se algo falhar.
3. **17 pedidos de imagem**, cada um com o nome do arquivo e o tamanho: 00 folha de personagens (trava a consistência), 01 herói da entrada, 02 a 13 as situações do Passo 2 (vizinho e vendaval em versão apê e casa), 14 casa protegida, 15 Ricardo, 16 portal do gerente.
4. **Checklist de aprovação** e frases de correção que funcionam.

## Skills aplicadas dentro do prompt
- **imagegen-frontend-mobile:** bíblia de estilo travada antes de gerar, consistência entre imagens, paleta controlada, nada genérico ("AI tells" proibidos), legibilidade em tamanho real, refazer o que ficar fraco em vez de aceitar.
- **impeccable / better-ui:** um ponto focal por imagem, formas grandes, sem enfeite sem função, contorno de espessura única.
- **Regras de design BB** (vault, 13 - Design): azuis do BB, amarelo de destaque, turquesa e coral só em ilustração.
- **Regras do produto:** idade e renda não aparecem, nenhum medo como gatilho, diversidade, casas brasileiras reais (muro e portão, porcelanato, ventilador de teto).

## Como as imagens entram no app
- Salvar os PNGs em `app-expo/assets/ilustracoes/` com o nome exato.
- Descomentar a linha da imagem em `app-expo/src/ui/imagens.ts`.
- Enquanto a imagem não existe, o app mostra o SVG atual (`Ilustracao`, `HeroiCasa` e `CasaProtegida` em `ilustracoes.tsx` escolhem sozinhos). O fundo em blocos diagonais continua em código, por baixo da imagem transparente.

## Prompt 2: ícones e visuais (29/10)
O time gerou as 17 ilustrações e ficaram boas o bastante para o resto do app parecer genérico ao lado. O segundo prompt está em **`app-expo/assets/icones/PROMPT_ChatGPT_icones.md`**.

**O que ainda estava desenhado no código e entrou na lista (avaliação):**
| Item | Onde aparece | Por que trocar |
|---|---|---|
| 28 ícones ilustrados (5 folhas I1 a I5) | Coberturas, assistências, atalhos do Meu seguro, fatos da entrada, pagamento, canais do gerente | Eram ícones de biblioteca (Material/Feather), genéricos ao lado das ilustrações |
| V1 papel de parede | Tela de bloqueio (primeiro quadro do vídeo) | Era só um degradê em SVG |
| V2 casa do Meu seguro | Cartão azul de "Meu seguro" | A casa em SVG era a peça mais simples da tela (print do time) |
| V3 casa da moeda | Animação de contratação (frente da moeda que gira) | Mesma casa simples; o verso (círculo e ✓ desenhado) continua em código, porque é animado |
| V4 a V6 emblemas dos planos | Cartões de Seleção de planos | Os cartões só tinham texto; a família de 3 emblemas mostra o que cada plano soma |

**Decisões do prompt 2:**
- Continuar **no mesmo chat** das ilustrações (ou anexar 4 imagens da primeira leva), para o traço não mudar.
- **Ícones em folhas de 3 × 2** (células de 512 px, fundo transparente, ícone centrado com respiro), para o colega gerar 5 imagens em vez de 28. O script **`npm run icones`** (`app-expo/scripts/icones.js`, com pngjs) corta cada célula pela parte visível e grava `ic_<nome>.png`. Foi testado com uma folha falsa.
- Regras próprias dos ícones (a **bíblia dos ícones**): aparecem com 28 a 40 pt, então contorno grosso (6% da largura), no máximo 3 formas e 1 acento amarelo, mesmo tamanho visual em todos e teste a 32 px. Nada de texto, cifrão ou logo (nem o do Pix, nem bandeira de cartão).
- V4 a V6 com a mesma casa no mesmo lugar: Essencial (casa + guarda-chuva), Prático (+ caixa de ferramentas e cadeado), Total (+ casa vizinha e coração).

**No app (pronto para receber):**
- `src/ui/imagens.ts` tem as linhas comentadas de todos os PNGs (visuais em `IMAGENS`, ícones em `ICONES`) e o mapa `ICONE_DE` (nome usado na tela → ícone ilustrado).
- `Icone` usa o PNG quando existe, em 1,5× (o desenho tem respiro próprio e enche o círculo azul-claro). Ícones pequenos (menos de 18) e brancos sobre azul continuam vetoriais.
- `Papel`, `CasaProtegida` (prefere `meu_seguro_casa`), a frente da moeda em `sucesso.tsx` e os cartões de `plano.tsx` (emblema à direita, no fluxo, não por cima) trocam sozinhos.
- "Tirar dúvida" ganhou ícone próprio (`duvida`), separado do chat do gerente.

Ligações: [[App Expo - app de verdade no celular]] · [[Portal do gerente]] · [[Regras de design BB]]
