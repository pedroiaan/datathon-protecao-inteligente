# Prompt para o Codex: slides do pitch (time Varetas)

> Cole tudo abaixo da linha no Codex, com o repositório `datathon-protecao-inteligente` aberto.

---

## Quem você é e o que vai fazer
Você é um designer de apresentações e desenvolvedor front-end sênior. Vai criar os **slides do pitch** do time **Varetas** no **Datathon Proteção Inteligente (IBMEC + BB Seguros/Brasilseg)**, desafio **Seguro Residencial**.

O pitch tem **5 minutos** (mais 5 de perguntas da banca), e o **vídeo gravado de até 5 minutos usa o mesmo conteúdo**. Os slides precisam estar **no mesmo nível visual do nosso app** (`app-expo/`): mesma paleta, mesmas fontes, mesmas ilustrações, mesmo cuidado com os detalhes.

## Antes de começar, leia (nesta ordem)
1. `README.md`: o projeto, as métricas, as premissas, as limitações e o uso de IA.
2. `app-expo/src/ui/tema.ts`: os tokens de cor, fonte e tipografia do app (a fonte da verdade do visual).
3. `obsidian/BB Datathon/14 - App v2/Demo - app e planilha lado a lado.md`: os 2 casos do vídeo e o canal.
4. `obsidian/BB Datathon/16 - Projeto por inteiro/11 - Assertividade de cada cálculo (do zero).md` e `12 - O motivo feito para você.md`.
5. `entrega/metricas.json` e `entrega/assertividade.json`: **os únicos números que podem aparecer**.
6. `obsidian/BB Datathon/01 - Briefing/Critérios de avaliação.md`: o que a banca pontua.
7. Abra 3 ou 4 telas do app em `app-expo/src/app/` (`casa.tsx`, `plano.tsx`, `cobre.tsx`) para pegar o padrão de cartões, listas, selos e botões.

## O que entregar
- `slides/index.html`: **um arquivo só**, em HTML, CSS e JS puro (sem framework e sem build). Slides em **16:9 (1920 × 1080)**, escalados para caber em qualquer tela sem distorcer.
  - Navegação por **← → espaço**; **F** para tela cheia; **N** abre ou fecha as notas do apresentador; número do slide discreto no canto.
  - **`@media print`** com um slide por página (1920 × 1080), para exportar em PDF pelo navegador como cópia de segurança.
- `slides/assets/`: copie de `app-expo/assets/ilustracoes/` e `app-expo/assets/icones/` **só** os PNGs que você usar. Não gere imagens novas.
- `slides/README.md`: como abrir, apresentar, exportar o PDF e trocar o vídeo da demonstração.
- Notas do apresentador em cada slide (`<aside class="notas">`), com **a fala sugerida** e o **tempo** do bloco.
- Fontes: só **Google Fonts** (Figtree e Nunito). Nenhuma outra dependência externa.

## Sistema visual (igual ao do app; obrigatório)

### Cores (tokens de `app-expo/src/ui/tema.ts`)
| Token | Hex | Uso |
|---|---|---|
| azul | `#465EFF` | cor principal: títulos em destaque, ícones, números |
| azulEscuro | `#2D37F5` | ênfase, estado "positivo" (**nunca verde**) |
| noite | `#1C2266` | fundos escuros (capa, slide do motor, fechamento) |
| azulFundo | `#F3F6FF` | fundo de cartões e áreas claras |
| azulClaro | `#E4ECFF` | trilhos, separadores suaves, chips |
| azulSuave | `#9AA8FF` | texto secundário sobre o fundo escuro |
| amarelo | `#FCFC30` | **só** para destaque pontual: selo, botão principal, sublinhado de 1 palavra |
| texto · texto2 · suave | `#111214` · `#3A3D46` · `#6C7077` | texto principal, secundário e de apoio |
| fundo · borda · divisoria | `#F7F7F8` · `#DFE1E6` · `#EEF0F4` | página clara, bordas, linhas |
| ambar / ambarClaro | `#8A5A00` / `#FFF4D6` | aviso de **estimativa** ou "no limite" |

**Regras de cor:**
- O app só usa **os azuis e o amarelo do BB**. **Não há verde** em lugar nenhum, nem para "certo".
- Coral e turquesa aparecem só dentro das ilustrações.
- No máximo **um** elemento amarelo por slide.

### Tipografia
- **Nunito 800/900** para títulos e números grandes (terminais arredondados).
- **Figtree 400/500/600/700** para todo o resto.
- Rótulos de seção e botões em **caixa alta** com espaçamento (como `TIPO.rotulo` e `TIPO.botao` do app).
- Escala para 1920 px de largura:

| Uso | Tamanho |
|---|---|
| Título do slide | Nunito 800, 64–72 px, letter-spacing −1 px |
| Número herói | Nunito 900, 140–180 px |
| Subtítulo | Figtree 500, 30–34 px |
| Corpo | Figtree 400, 26–28 px |
| Legenda e fonte | Figtree 500, 18–20 px, cor `suave` |

- **Destaque de uma palavra no título**, como o app faz em "Já sabemos bastante da *sua casa*": a palavra-chave em `azul` e itálico Nunito 800 (`Nunito_800ExtraBold_Italic`).
- Números com `font-variant-numeric: tabular-nums` e no formato brasileiro (R$ 1.234; 14,1%).
- Títulos com `text-wrap: balance`; parágrafos com `text-wrap: pretty`.

### Ilustrações e ícones
- Estilo da campanha **BB Digital Week**: pessoas em cartoon com contorno azul-escuro, cores chapadas e fundo em **blocos diagonais** azuis. Use os PNGs que já temos:
  - **Ilustrações:** `heroi_entrada.png`, `casa_protegida.png`, `cena_agua.png`, `cena_raio.png`, `cena_roubo.png`, `cena_vizinho_casa.png`, `cena_aluguel.png`, `gerente_ricardo.png` e `gerente_painel.png`.
  - **Ícones:** `ic_casa`, `ic_incendio`, `ic_agua`, `ic_eletricos`, `ic_roubo`, `ic_vidros`, `ic_terceiros`, `ic_chat`, `ic_seguranca`, `ic_cobertura`.
- Os blocos diagonais (como no herói do app) só na **capa**, no **slide do motor** e no **fechamento**. Faça com CSS (`clip-path` ou gradientes de corte reto), nunca com imagem gerada.
- Não use emoji, não use ícones de outras bibliotecas e não misture estilos.

### Detalhes (as regras de UI que usamos no app)
- **Cantos concêntricos:** raio de fora = raio de dentro + espaçamento. Cartões com raio 28 px, chips e botões em pílula (999 px).
- **Sombra para elevação, borda para estrutura:** cartões com sombra leve em camadas (`0 1px 2px rgba(28,34,102,.06), 0 12px 40px rgba(28,34,102,.12)`), sem borda grossa.
- **Uma ideia por slide.** No máximo **~30 palavras visíveis** por slide, fora números e rótulos. O resto vai para as notas do apresentador.
- **Hierarquia por tamanho e peso, não por cor:** um herói por slide (número ou frase), o resto bem menor.
- Margens generosas (mín. 120 px nas laterais), alinhamento à esquerda numa grade de 12 colunas, espaçamento em múltiplos de 8.
- **Movimento contido:** transição entre slides com fade e deslocamento de 12 px em 240 ms, curva `cubic-bezier(0.23, 1, 0.32, 1)` (a `EASE_OUT` do app). Pode haver uma entrada escalonada (~100 ms) dos itens de um slide, sempre a mesma em todos. Respeite `prefers-reduced-motion`.
- **Contraste AA** em todo texto, inclusive sobre o azul-noite.
- Nada pode cortar nem sair do quadro em 1920 × 1080. Confira cada slide.

### Texto (português do Brasil)
- Acentuação completa, frases curtas, voz ativa e "você" quando falar com o cliente.
- **Sem os vícios de texto de IA:**
  - nada de "não é X, é Y" nem "não só X, mas Y";
  - nada de listas de negações;
  - nada de perguntas que a própria frase responde ("O resultado? 3x mais");
  - nada de "revolucionar", "potencializar", "jornada transformadora";
  - nenhum travessão (—) em títulos.
- **Estimativa é dita como estimativa:** "cerca de", "estimamos".

## Números permitidos (não invente nenhum)
Use **só** estes, sempre com a fonte nas notas. Confira-os em `entrega/metricas.json` e `entrega/assertividade.json` antes de usar.

| Número | O que é | Fonte |
|---|---|---|
| 138 de 138 · 0 falhas · 0,7 s | casos processados, falhas, tempo total | `metricas.json` |
| 100% · 100% | casos com justificativa · coberturas fixas completas | `metricas.json` |
| Prático 66 · Total 38 · Essencial 34 | planos recomendados | `metricas.json` |
| clara 124 · no limite 14 | força da recomendação (no limite = a menos de 15% do limite; recebe a pergunta que decide o plano) | `metricas.json` |
| 2,75 perguntas contra ~20 campos · **86% menos esforço** | perguntas por caso contra uma cotação tradicional | `metricas.json` → `mercado` |
| 1 toque 63 · app com perguntas 49 · gerente 26 (19%) | jornada | `metricas.json` |
| 81% sem pessoa no meio | 1 toque + app com perguntas, entre os elegíveis | `metricas.json` → `mercado` |
| confiança alta 17 · média 101 · baixa 20 | confiança geral | `metricas.json` |
| área estimada: erro de **14,1%** contra **44,4%** do chute · **2 de cada 3** a menos de 20% da área real | acerto medido fora da amostra (5 dobras, 1.016 imóveis) | `assertividade.json` |
| faixa de área × padrão: **1,76×** contendo o real em **88%** (antes 2,7×) | quando faltam a área e o padrão (64 casos) | `assertividade.json` |
| padrão pelo IPTU: intervalo certo em **97,8%** | só descarta um extremo; o padrão exato acertaria 51% | `assertividade.json` |
| motivo: casa e cidade em **138 de 138** (antes 0) · **125** textos com estrutura única (antes 83) | personalização do motivo | `metricas.json` → `qualidade_do_motivo` |
| teste de justiça: trocar renda e idade muda **0** casos | responsabilidade | `metricas.json` |
| sem internet: 0 erros · sem nenhum arquivo externo: **137 de 138** planos iguais | o motor não depende das APIs | `obsidian/BB Datathon/16 - Projeto por inteiro/04 - Fontes externas e APIs.md` |

**Proibido nos slides:**
- dados de **sinistros da BB** ("53% dos acionamentos"): a fonte foi retirada do projeto;
- dizer que temos **acurácia da recomendação** (não há rótulo; o que medimos é o acerto das estimativas);
- o dado "17% das casas têm seguro", a não ser escrito "FenSeg, 2021".

## Roteiro: 12 slides em 5 minutos
Cada slide: **título**, **o que aparece** e, nas notas, **a fala** (escreva-a com base nisto) e o **tempo**.

**Bloco 1 · A dor (0:00–0:35)**
1. **Capa:** "Seguro residencial que *já sabe* da sua casa". Time Varetas, os 5 nomes (do README), "Datathon Proteção Inteligente · Seguro Residencial". Ilustração `heroi_entrada.png` sobre blocos diagonais azul-noite.
2. **A dor:** duas perguntas grandes: "Quantos m² tem a sua casa?" e "Quanto valem os seus bens?". Uma linha embaixo: o cliente não sabe responder, então desiste ou contrata uma proteção que não serve para a casa dele.

**Bloco 2 · A oportunidade (0:35–1:00)**
3. **O banco já sabe:** 5 chips com ícones: IPTU, conta de luz, compras para a casa, aluguel, financiamento. Herói: "**86% menos esforço**" (2,75 perguntas contra ~20 campos).
   - Frase: "One Click Buy pré-preenchido: pergunta só o que falta e usa o gerente como exceção."
   - Nas notas: o nome técnico é "STP com escalonamento humano" (STP = processamento direto, sem pessoa no meio).

**Bloco 3 · Como o motor decide (1:00–1:50)**
4. **O fluxo (fundo azul-noite):** 7 passos numa linha, cada um com ícone e uma palavra:
   - sinais → elegibilidade → necessidades → plano → faixas → perguntas → motivo.
   - Embaixo, as 3 necessidades em cartões: **Aluguel em jogo → Total** · **Roubo e vidros → Prático** · **Danos a terceiros → responsabilidade civil**. "O plano é o menor que cobre as necessidades."
   - Nas notas: a elegibilidade vem antes de tudo, e falta de sinal vira pergunta, nunca recusa.
5. **Quando falta dado, o motor estima e diz quanto acerta:**
   - à esquerda, a conta da área: "IPTU e conta de luz ÷ R$/m² da cidade", com **erro de 14,1%** contra **44,4%** de um chute;
   - à direita, os bens: "das notinhas (o mínimo comprovado) até o que a casa deve ter";
   - um selo âmbar: "estimativa sempre dita como estimativa".

**Bloco 4 · Dados de fora, sem depender da internet (1:50–2:10)**
6. Duas colunas:
   - **"Viram valor":** SINAPI/IBGE e CUB (custo de construção), IPCA/Banco Central (inflação), FipeZAP (aluguel).
   - **"Viram motivo":** ANEEL (quedas de energia), Atlas de Desastres/Defesa Civil (chuva e alagamento).
   - Faixa de baixo: "Sem internet: 0 erros. Sem nenhum arquivo externo: 137 de 138 planos iguais."

**Bloco 5 · Demonstração (2:10–3:40)**
7. **Demonstração:** o slide inteiro é um `<video src="assets/demo.mp4">` que o time vai gravar com a tela do app (`npx expo start --web`; o app fica à esquerda e a planilha do motor à direita).
   - Até o vídeo existir: um cartão com `heroi_entrada.png` e o texto "Demonstração: app + planilha do motor".
   - Nas notas, o roteiro da gravação:
     - **Sérgio, Porto Alegre** (casa, área estimada): notificação com o motivo; 2 perguntas feitas para ele; responde "sim, passam do limite" e o plano sobe de Essencial para Prático na hora; risco da cidade (distribuidora em último lugar na ANEEL); conferir o motivo inteiro.
     - **Luana, Goiânia:** 0 perguntas, 1 toque.
     - **Portal do gerente:** código legível (SR-RS-ESS-0015-1) e fila pelo que trava a contratação.

**Bloco 6 · O motivo e os resultados (3:40–4:25)**
8. **O motivo é o diferencial:** um cartão grande, como uma tela do app, com o motivo real do Sérgio, com as partes destacadas (casa e cidade · porquê · no limite · confiança com o acerto). Pegue o texto exato em `entrega/template_resultado_times.csv`, linha `IMO_CASO_00015_01`, coluna `justificativa_recomendacao`. Ao lado: "casa e cidade em 138 de 138 (antes 0)".
9. **Resultados na base comum:** grade de 6 números grandes:
   - 138/138 casos, 0 falhas;
   - 100% com justificativa;
   - Prático 66 · Total 38 · Essencial 34;
   - 81% sem pessoa no meio;
   - gerente em 19%;
   - 0 casos mudam ao trocar renda e idade.

**Bloco 7 · Responsabilidade, limites e próximos passos (4:25–5:00)**
10. **Responsabilidade:** 4 linhas curtas com ícone:
    - a idade nunca entra;
    - a renda só nos bens de quem não tem compras (0 casos na base);
    - o motor não usa IA (regras fixas: mesma entrada, mesma saída);
    - o gerente confirma o que o motor não sabe.
11. **Limitações e próximos passos:**
    - **Limitações:** o valor real dos bens não tem gabarito (o máximo é premissa); a base não traz MEI, favela nem área rural (vira declaração); o CUB de RJ, PE e CE é estimado por razão.
    - **Próximos passos:** piloto com dados reais do BB; calibrar limites com sinistros reais; a mesma API (`motor/api.py`) servindo agentes autônomos.
12. **Fechamento (blocos diagonais):** a frase "Um One Click Buy pré-preenchido, que pergunta só o que falta e usa o gerente como exceção." + "Varetas" + "Obrigado! Perguntas?" e `casa_protegida.png`.

## Antes de dizer que terminou (confira e conte o que conferiu)
- [ ] Abriu `slides/index.html` no navegador em 1920 × 1080 e em uma janela menor, e nada cortou nem transbordou.
- [ ] Todos os números batem com `entrega/metricas.json` e `entrega/assertividade.json`.
- [ ] Nenhum verde, nenhum emoji, nenhuma fonte além de Figtree e Nunito.
- [ ] No máximo um amarelo por slide; contraste AA conferido nos slides escuros.
- [ ] As notas do apresentador somam **5 minutos** de fala (cerca de 650 palavras no total).
- [ ] O PDF pelo navegador sai com um slide por página.
- [ ] Nenhuma frase com os vícios de texto de IA listados acima; acentos conferidos.
- [ ] Os PNGs usados estão em `slides/assets/` e abrem sem servidor (caminhos relativos).
