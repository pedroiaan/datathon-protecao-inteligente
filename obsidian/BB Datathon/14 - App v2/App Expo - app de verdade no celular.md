---
tags: [app, expo, prototipo, design, datathon-bb]
data: 2026-10-29
status: pronto para gravar (rodada 4, alinhado ao motor do Pedro)
pasta: app-expo/
---
# 📲 App Expo: o app de verdade, no celular

> [!tip] Como rodar (5 minutos)
> 1. Instale o **Expo Go** no celular.
> 2. No computador, na pasta `app-expo/` do repositório: `npm install` e depois `npx expo start`.
> 3. Leia o QR code com a câmera (iPhone) ou com o Expo Go (Android). Celular e computador na **mesma rede Wi-Fi**. Se não conectar: `npx expo start --tunnel`.
> 4. **Segure o relógio** da tela de bloqueio para trocar o caso (A, B, C, já segurado, inquilino, possível reforma).
> 5. **No computador (gravação):** `npx expo start --web` e abra no navegador. Em janela larga o app aparece **dentro de um iPhone** (moldura com Dynamic Island, barra de status e margens seguras reais). Para abrir direto num caso: `http://localhost:8081/?caso=perfil_B_casa_familiar`.

Substitui o [[Protótipo v4 - app do cliente]] (HTML) para a gravação. O HTML continua no repositório como referência e para mostrar o raio-X do motor no computador.

## Rodada 8 (29/10): ilustrações e ícones do ChatGPT no app
- **Entraram:** 16 ilustrações (pacote `Seguro_Residencial_Ilustracoes/PNG`, sem a folha de personagens) em `assets/ilustracoes/`, e as 5 folhas de ícones fatiadas em 28 `ic_*.png` em `assets/icones/`. Usamos os PNGs; os SVGs do pacote foram vetorizados automaticamente e são pesados.
- **Onde aparecem:** herói da entrada, as 12 situações do Passo 2, a casa do cartão Meu seguro, todos os ícones de conteúdo (fatos, coberturas, assistências, atalhos, pagamento, canais) e o Ricardo: rosto ilustrado nos avatares (Falar com o gerente, Ajuda, Portal) e cena no cabeçalho do Portal (`RostoGerente` em `base.tsx`).
- **Peso:** as ilustrações foram reduzidas para 768 px de largura (`npm run reduzir`), de ~24 MB para ~4,5 MB, para carregar rápido no Expo Go.
- **Scripts novos:** `npm run icones` (fatia as folhas; a I5 veio com ligação e vídeo na linha de baixo, já tratado), `npm run imagens` (liga em `imagens.ts` toda imagem que existe), `npm run reduzir`.
- **Falta:** os 6 visuais do prompt 2 (V1 a V6). Até chegarem, o app usa os desenhos atuais nesses lugares.

## Rodada 7 (29/10): prompt 2 (ícones e visuais) e app pronto para recebê-los
- Segundo prompt para o ChatGPT: 28 ícones ilustrados em 5 folhas e 6 visuais (papel de parede, casa do Meu seguro, casa da moeda da animação, emblemas dos 3 planos). Avaliação e decisões em [[Prompt das ilustrações (ChatGPT)]].
- `npm run icones` fatia as folhas; `src/ui/imagens.ts` liga cada PNG; sem o PNG fica o desenho atual.
- **Para o próximo chat:** quando os PNGs chegarem, coloque-os em `assets/ilustracoes/` e `assets/icones/`, rode `npm run icones`, descomente as linhas em `imagens.ts` e confira na pré-visualização (Passo 2, entrada, Meu seguro, planos, sucesso, tela de bloqueio).

## Rodada 6 (29/10): gerente edita a proposta; selo sem sobrepor
- **Gerente edita plano e coberturas** no pedido do cliente, com o mesmo seletor e a mesma lista do Personalizar; cada mudança vira frase para o cliente. Regras em [[Portal do gerente]].
- **Bug do selo "ajustado pelo gerente":** no Conferir ele ficava em `position: absolute` por cima do nome do plano. Agora fica **no cabeçalho da seção, ao lado de "SEU PLANO"**, no fluxo normal. Regra para todo o app (skills better-layout/better-ui): selo nunca absoluto sobre conteúdo; em linha com quebra (`flexWrap`) ou numa linha própria. Ajustado também em Plano, Personalizar (rodapé) e Meu seguro (linha própria, porque a casa ilustrada ocupa o canto do cartão).
- Refatoração: a lista de coberturas saiu do `ajuste.tsx` para `src/ui/coberturas.tsx` (controlada por `e` + `mudar`), e o `SeletorPlanos` aceita uma proposta em edição. O texto de aviso muda a pessoa: o cliente lê "você", o gerente lê "o cliente".

## Rodada 5 (29/10): portal do gerente e prompt das ilustrações
- **Portal do gerente** no mesmo app: fila de pedidos com o **código de cada cliente** (`SR-XXXX-XX`, só o gerente vê), pedido já preenchido com a ficha do motor e o que o cliente montou, sugestões de ajuste com chave e efeito no preço, e "Enviar". O cliente recebe só o que o gerente deixou ligado. Detalhes e regras em [[Portal do gerente]].
- No fluxo: "Chamar o Ricardo" → **"Abrir o portal do gerente"** (ou "Pular: simular resposta"). Atalho: segurar o relógio → "Abrir o portal do gerente". O cliente não vê mais protocolo nenhum.
- **Ilustrações finais:** prompt completo para o ChatGPT gerar 17 imagens no estilo do app ([[Prompt das ilustrações (ChatGPT)]]). O app já está pronto para recebê-las: `src/ui/imagens.ts` liga cada PNG, e sem o PNG fica o SVG.
- Código: `nivelDaAnalise` foi para `estado.tsx` (casa e portal usam); `comAjusteDoGerente` agora fica em `logica/gerente.ts`.

## Rodada 4 (29/10): sincronizado com o motor novo do Pedro e polido para o vídeo
**Base:** branch `app-celular`, criada a partir do último commit do Pedro em `origin/main` (motor novo, `necessidades`, `territorio`, perguntas SEGURO_EXISTENTE e POSSIVEL_REFORMA, RN-07 revisada). O meu trabalho anterior de F1/motor ficou guardado na branch `backup/rodada-guilherme-29-10` e foi **substituído** pelo do Pedro.

| Pedido | O que mudou |
|---|---|
| Moldura de iPhone | `src/ui/moldura.tsx`: no navegador largo o app roda numa tela de 393 × 852 (iPhone 15/16) com Dynamic Island, 9:41, sinal, Wi-Fi, bateria e indicador de início; escala para caber na janela. As margens seguras (54 em cima, 34 embaixo) são as do aparelho. No celular não há moldura. Liga e desliga em `src/config.ts` |
| Só azul, nada de verde | Tokens `positivo`/`positivoClaro` (azul BB) no lugar de todo verde: botões, chaves, selos, gráfico, ✓. Turquesa e coral só nas ilustrações. O verde do ícone do WhatsApp ficou (é a marca de outro app) |
| Fontes revisadas | Escala única `TIPO` em `src/ui/tema.ts` (tabela abaixo). Título do cabeçalho em CAIXA ALTA ("SEGURO RESIDENCIAL"); botões e rótulos de seção em caixa alta pelo token, não à mão |
| Gerente também "ajusta" | A proposta do gerente marca `ajustada`; o selo vira **"ajustado pelo gerente"** (ícone de pessoa com ✓) em Proposta ajustada, Plano, Personalizar, Conferir e Meu seguro. O ajuste do cliente continua "ajustado" (ícone de controles). Componente `SeloAjustado` |
| Trocar pagamento | "Alterar" em Pagamento abre a folha **Como você quer pagar?**: Débito na conta BB, Cartão Ourocard ou Pix automático. A escolha aparece na linha e na folha "Está tudo certo?" (`s.pagamento`) |
| Ajuda em todas as telas | Botão Ajuda também em Falar com o gerente, Gerente avisado e Proposta ajustada, com dúvidas próprias ("O gerente vê a mesma proposta?", "Preciso aceitar?") |
| Animação final | Agora aparece mesmo com "reduzir movimento" ligado no navegador (`DEMO.animarSempre`, só para a gravação). Casa maior (chaminé, porta, janela), gira como moeda, vira o círculo com ✓ desenhado e solta **faíscas** nas cores do BB. Texto certo para apê: "Seu apê está protegido" |
| Herói da entrada | Redesenhado em 2 camadas: os blocos diagonais ocupam a largura toda e a cena fica inteira (casa com telhado amarelo, janelas acesas, porta, árvore, escudo com ✓ e a pessoa apontando). Antes a casa era cortada e a pessoa flutuava num sofá |
| Ícones | Um conjunto só (Material Community, contorno) para o conteúdo: vidro, sofá, chuva, praia, raio, ferramentas, máquina, vassoura, inseto, escudo. Feather só nos controles (voltar, fechar, setas). Acabou o quadrado da vidraçaria |
| Apê × casa | Os títulos dos Passos 1 e 2 e o sucesso dizem "seu apê" quando o imóvel é apartamento; os textos de valores dizem "seu imóvel" |
| Perguntas novas do motor | SEGURO_EXISTENTE e POSSIVEL_REFORMA ganharam texto claro, o porquê da pergunta e uma **nota** conforme a resposta ("Sim, já tenho" → cancele o outro para não pagar duas vezes; "Está em obra" → danos da obra não entram). A resposta padrão do gerente é "Não" |
| Acessibilidade | Botões com rótulo para leitor de tela (Voltar, Fechar, Ajuda, Alterar pagamento), opções como rádio e confirmações como caixa de seleção |
| Seletor de casos | Rótulo = nome do cenário + cidade lida da ficha (A agora é Brasília, B Recife). Casos novos do motor aparecem sozinhos |
| Limpeza | Saiu a tela interna `galeria`. tsc, eslint e expo-doctor (20/20) limpos |

### Pronto para receber o motor de verdade
- **Contrato de dados:** `app-expo/src/dados/contrato.ts` tipa a ficha (`FichaMotor`, `Pergunta`, `Cobertura`, `Necessidade`). As telas leem a ficha só por ele; se o motor mudar um campo, ajusta-se ali.
- **Importar:** `python motor/gerar.py --entrega` → `cd app-expo && npm run dados` (ou `node scripts/dados.js caminho/fichas.js`). O script **confere cada ficha contra o contrato** e para com a lista do que falta, em vez de quebrar a tela no celular.
- **Perguntas por cliente:** cada ficha traz `perguntas[]`. Códigos conhecidos ganham texto, ajuda, opções e notas em `perguntaCliente` (`src/logica/textos.ts`); códigos novos aparecem com o texto do motor e Sim/Não, sem mexer no app.
- **Por que este plano:** vem de `necessidades[].provas` (motor novo) ou de `motivos_plano` (antigo), em `porQueDoPlano`.
- **Risco da cidade:** `territorio` (motor novo), com recuo para o texto da justificativa (antigo), em `territorioDe`.

### Onde cada fonte é usada (`TIPO` em `src/ui/tema.ts`)
| Token | Fonte | Uso |
|---|---|---|
| nav | Figtree 700, 15, caixa alta | Título do cabeçalho azul |
| display | Nunito 800, 28 | Título da tela ("Já sabemos bastante do *seu apê*") |
| titulo2 | Nunito 800, 20 | Título de cartão |
| numero | Nunito 800, 21 | Valores em destaque (R$ 50 mil a R$ 135 mil) |
| destaque | Figtree 600, 16 | Item de lista, pergunta |
| corpo | Figtree 400, 15 | Texto corrido |
| apoio | Figtree 400, 13,5 | Explicação curta |
| legenda | Figtree 500, 12,5 | Fonte do dado, rodapé |
| rotulo | Figtree 600, 12, caixa alta | Nome de seção (PAGAMENTO, VIGÊNCIA) |
| botao | Figtree 700, 15,5, caixa alta | Botões em pílula |

**Sobre Remotion:** a skill foi lida, mas o Remotion gera vídeo e não roda dentro do Expo Go. A animação final usa Reanimated seguindo os mesmos princípios (curvas, tempos, uma coisa de cada vez). Se o time quiser uma abertura em vídeo para o pitch, aí sim o Remotion entra.

## Rodada 3 (29/10): visual BB Digital Week, tudo editável, planos comparáveis
| Pedido | O que mudou |
|---|---|
| Aviso inicial curto | Uma frase e a origem: "O seguro do condomínio não cobre o que é seu: cerca de R$ 22 mil a R$ 60 mil em bens." (`avisoCurto` em `src/logica/textos.ts`) |
| Entrada refeita | Ilustração da casa no topo; fatos em lista agrupada estilo iOS (número em destaque, uma linha, fonte). Saíram os 3 cartões iguais (skill impeccable) |
| Fontes livres | **Figtree** no texto e **Nunito** nos títulos e números (Google Fonts, licença OFL). Tokens em `src/ui/tema.ts` |
| Ilustrações | Estilo da campanha **BB Digital Week**: pessoas em cartoon com contorno azul-escuro, cores chapadas da marca e fundos em blocos diagonais. Personagem posável (`Boneco`) em `src/ui/ilustracoes.tsx`; 10 situações + a da entrada. Personagens originais, só o estilo é referência |
| Passo 1 tudo editável | Tipo, uso, endereço (este imóvel ou outro), relação e bens, cada um por lista igual à do app BB. Saíram o tamanho em m² (fica só no cálculo) e o cadeado. Perguntas que repetiam um campo ou pediam a área saíram |
| Confiança explicada | "Nossa sugestão é uma estimativa feita com os dados que o banco tem, não uma certeza. Quanto mais você confirma, mais certa ela fica." Cada dado trocado baixa um nível |
| Passo 2 compara planos | Seletor Essencial / Prático / Total (controle segmentado do iOS, `src/ui/seletor.tsx`) com preço e selo "indicado"; a situação e a lista mudam na hora e o plano fica escolhido |
| Bug do Personalizar | A cobertura desligada sumia (a lista vinha das ligadas). Agora vem de `opcionais()` e fica apagada para religar |
| Plano ajustado | Selo discreto "ajustado" (ícone de controles) ao lado do nome do plano em Plano, Personalizar, Conferir e Meu seguro, quando valor ou cobertura saem do sugerido (`ajustado()` em `estado.tsx`) |
| Sucesso | A casa gira como uma moeda (1 volta e meia) e mostra o verso: o círculo com o ✓ desenhado, com vibração |
| Meu seguro | Gráfico de proteção só com os azuis do BB |

**Falta / a conferir (rodada 3):** resolvido na rodada 4 (chave azul, galeria apagada, animação visível no navegador).

## Rodada 2 (29/10): pedidos do time
| Pedido | O que mudou |
|---|---|
| Acessibilidade | Botão **Aa** no topo, ao lado do X: "Texto maior" (todas as letras do app crescem 20%) e "Ouvir esta tela" (leitura em voz alta, `expo-speech`) |
| Ajuda embaixo | O botão **Ajuda** foi para o rodapé, ao lado do botão principal, em todas as telas |
| 1/5 Sua casa: editar | Só **tipo** e **uso** podem ser alterados, pela lista igual à do app BB ("Qual o tipo do imóvel?": Apartamento, Casa, Casa em condomínio; "Qual é a utilização do imóvel?": Residencial, Lazer, Residencial e Comercial). Endereço, tamanho, relação e bens vêm do banco (cadeado) |
| 1/5 Confiança | Cada dado do banco trocado pelo cliente baixa a confiança um nível (Alta → Média → Baixa), com o aviso "vamos confirmar com você antes de contratar". Responder as perguntas sobe um nível. Saiu o selo de confiança de cada dado; ficou só a origem em texto discreto |
| 1/5 Perguntas | Reescritas com opções concretas. Bens: "Se você precisasse comprar de novo tudo o que tem em casa, quanto gastaria?" (menos de / entre / mais de, com os valores do motor). Acabamento: "Básico: piso cerâmico e armários simples · Médio: porcelanato e alguns planejados · Alto: pedra ou madeira nobre e tudo planejado" |
| 2/5 Uma situação por cobertura | 10 situações, cada uma com ilustração: alagamento, queda de raio, **danos a terceiros** ("Infiltração no apê de baixo"), arrombamento, vidro quebrado, vendaval, incêndio, batida de carro, casa interditada (aluguel), emergência (despesas) |
| 2/5 Compacto | Cada cobertura mostra só ícone, título e "até R$ X"; a seta abre a explicação e a franquia. Mostra 4 e "Ver todas as N coberturas". "Não cobre" mostra 2 e "Ver mais". Assistências numa faixa horizontal |
| Gerente | Saiu "seus extratos e sua renda não são mostrados" (o gerente já tem acesso) |
| Sucesso | Animação: a casinha aparece e se transforma no círculo com o ✓ (o ✓ é desenhado, com vibração de sucesso no mesmo instante) |
| Meu seguro | "Sua proteção" virou um gráfico explicativo: o que cada cobertura paga, "paga até R$ X" e um medidor do contratado contra o que calculamos para a casa ("Cobre o essencial" ou "Abaixo do calculado: ajuste em Personalizar") |
| Ambiente iOS | Troca de tela do iOS também no Android (`ios_from_right`), voltar arrastando da tela toda, notificações com vidro desfocado (`expo-blur`), títulos com espaçamento justo |

**Ilustrações:** a skill `image` gera imagens por IA (Gemini, GPT Image, Flux), mas precisa de chave de API, e não há nenhuma no computador. As 10 ilustrações foram desenhadas como cartoon vetorial (SVG, `src/ui/ilustracoes.tsx`): nítidas em qualquer tela, leves e no mesmo estilo. Com uma chave do Gemini dá para gerar versões em imagem e trocar.

**Skills usadas:** `animate-expo` (motion no React Native: molas, gestos, haptics, reduzir movimento), `apple-design` (fluidez do iOS: interrupção, materiais, tipografia, acessibilidade) e `image` (avaliada; sem chave de API).

## Por que Expo
- É um app nativo de verdade (React Native), rodando no celular pelo Expo Go, sem publicar em loja.
- Animações na thread de interface (Reanimated 4), gestos nativos (Gesture Handler 3) e vibração (expo-haptics).
- Navegação com a troca de tela do próprio sistema (Expo Router, pilha nativa), como no app do BB.
- Versões conferidas com `expo-doctor` para o SDK 58 do Expo Go.

## Fiel ao app do BB
Copiado dos prints do app atual (`Prints BB.zip`, out/2026):
- Cabeçalho azul `#465EFF` com seta, título e X; folha branca com cantos de 24 px por cima.
- Barra de progresso fina com o nome do passo em azul e "2/5" à direita (igual a "Seleção de planos 2/3").
- Botões em pílula: amarelo `#FCFC30` com texto azul (AVANÇAR) e azul-claro (PERSONALIZAR).
- Cards de plano com círculo de seleção, borda azul e fundo azul-claro no escolhido, preço em "12x de R$".
- Entrada igual à "Central de Seguros > Seguro Residencial" (ícone da casa, selo "Feito para você").
- Folhas de baixo com título, X e alça. Fonte: Nunito (a fonte do BB não é pública e tem o mesmo desenho arredondado).

## O que acrescentamos (o que o time pediu)
| Tela | O que tem |
|---|---|
| Aviso (bloqueio) | Notificação que justifica com fatos do imóvel: quanto vale o que o seguro do condomínio não cobre, gasto com vidraçaria, chuva registrada pela Defesa Civil. WhatsApp só como lembrete, sem link |
| Entrada | No lugar da foto genérica, "Por que te avisamos" com os mesmos fatos |
| 1/5 Sua casa | O que o banco já sabe, com a origem de cada dado (selos ✓ e ≈), medidor de confiança que sobe com as respostas e só as perguntas do motor |
| 2/5 O que te protege | "E se acontecer" (alagou, raio, vizinho, arrombamento, vendaval, incêndio) com sem × com seguro, junto com o que o plano cobre, franquias, o que não cobre e assistências |
| 3/5 Seleção de planos | 3 planos em lista, o recomendado primeiro com o motivo do motor; aviso do que fica descoberto se escolher menos |
| 4/5 Personalizar | Lista compacta; um toque abre o campo para digitar o valor exato, com mínimo, máximo e atalhos. Sem barra deslizante. Aviso quando o Prático vira Essencial |
| 5/5 Conferir | Checkout estilo iFood (imóvel, plano, vigência, pagamento, cada um com "Alterar") e a folha "Está tudo certo?" antes de confirmar |
| Sucesso | ✓ desenhado na tela, com vibração de sucesso |
| Meu seguro | Cartão da apólice com status, atalhos (assistência, sinistro, o que cobre, dúvida), barras de proteção, assistências, próximos passos com datas e "seu seguro acompanha a sua casa" |
| Ajuda (ícone ? no topo) | Dúvidas frequentes de cada tela; só no fim "Falar com meu gerente" |
| Gerente | Escolha do canal → gerente avisado → aviso de retorno → proposta ajustada → conferir |

## Animação (regras da skill animate-expo)
- **Troca de tela:** a do sistema (push nativo). Aviso, sucesso e Meu seguro entram com fade.
- **Folha de baixo:** sobe em 420 ms com a curva de gaveta do iOS; fecha arrastando, com a velocidade do dedo passada para a mola; vibração leve quando volta para o lugar.
- **Cards:** entram em cascata (45 ms entre eles) só ao abrir a tela.
- **Valores:** contam até o número novo quando mudam (situação, preço, vigência).
- **Toque:** todo botão encolhe 3% em 120 ms. A vibração é usada só na seleção de opção, no toque em aviso e no sucesso, uma vez por ação.
- **Reduzir movimento:** se o celular pedir, as animações viram fade.

## Números (nada à mão)
- `app-expo/src/dados/fichas.json` = cópia de `prototipos/fichas_demo.js` (motor). Atualizar com `npm run dados` depois de `python motor/gerar.py --entrega`.
- Valor sugerido = meio da faixa do motor; "e se acontecer" = mínimo da faixa; preço ilustrativo (mesma regra do v4: R$ 51 a R$ 128/mês).

## Como mexer
Ver `app-expo/README.md`. Telas em `src/app/` (uma rota por arquivo), regras e textos em `src/logica/`, visual em `src/ui/`. Antes de commitar: `npx tsc --noEmit` e `npx eslint src`.

## Pendências
- [ ] Testar no celular de verdade (a rodada 4 foi revisada na pré-visualização web, dentro da moldura de iPhone). Conferir: animação da casa virando ✓, arrastar a folha para fechar, vibração, teclado numérico no Personalizar, "Ouvir esta tela".
- [ ] Mudar tipo ou uso no Passo 1 baixa a confiança, mas não recalcula o plano: num app real, isso chama o motor de novo (API `/recomendar`).
- [ ] Antes de publicar de verdade: `DEMO.animarSempre = false` em `src/config.ts`, para respeitar "reduzir movimento".
- [ ] Nomes fictícios de demonstração: gerente Ricardo, apólice BB 4021-7781, protocolo BB-8K2.

Ligações: [[Protótipo v4 - app do cliente]] · [[Regras de design BB]] · [[App atual - falhas e nosso fluxo]] · [[Especificação do app v2 - ligado ao motor]]
