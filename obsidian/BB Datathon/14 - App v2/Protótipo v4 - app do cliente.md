---
tags: [app, prototipo, design, datathon-bb]
data: 2026-10-29
status: pronto para gravar o vídeo
arquivo: prototipos/app_v4.html
---
# 📱 Protótipo v4: app do cliente (para o vídeo)

> [!tip] Como abrir
> Dois cliques em `prototipos/app_v4.html`. O arquivo lê `prototipos/fichas_demo.js`, que o motor gera (`python motor/gerar.py --entrega`). As fontes vêm do Google Fonts: com internet o visual fica certo, sem internet cai numa fonte do sistema.
> - **No computador:** celular à esquerda e painel à direita, com perfis A/B/C, atalho para cada tela, "app atual × nossa proposta" e o **raio-X do motor**.
> - **No celular** (ou numa janela com menos de 500 px): o app ocupa a tela inteira, sem moldura. É o modo para gravar.
> - **Teclas:** ← → navegam · X liga e desliga o raio-X · R recomeça.

## O que mudou em relação ao protótipo anterior
Pedido do time em 29/10, com os prints do app atual (`Prints BB.zip`) e do protótipo antigo (`indexprototipo_gerente.html`).

| Pedido | O que foi feito |
|---|---|
| O aviso tem de **justificar**, não pescar ("não é anzol") | A notificação traz 2 fatos do próprio imóvel, com origem: quanto vale o que o seguro do condomínio **não** cobre (pelas compras) e um fato forte (gasto com vidraçaria, chuva registrada pela Defesa Civil ou ranking de energia da ANEEL). Linha final: "Com base em... Toque para ver; você decide." O WhatsApp é só lembrete, sem link. |
| Juntar "E se acontecer" com "O que cobre" | Uma tela só (**Passo 2**): situações em chips (alagou, raio, vizinho, arrombamento, vendaval, incêndio) com "sem seguro × com o plano" e, abaixo, cada cobertura com a franquia em uma linha, o que **não** cobre e as assistências. |
| Nova ordem | **Aviso → 1 Sua casa → 2 O que te protege → 3 Seu plano → 4 Ajustar → 5 Conferir → Meu seguro**. |
| Ajustar sem barra deslizante, mais compacto, valor exato | Lista compacta com o valor sugerido ao lado. Um toque abre o campo para digitar o valor exato, com mínimo e máximo do produto, atalhos (mínimo, sugerido, máximo) e aviso quando sai da faixa calculada. Valor fora do limite não passa. |
| Conferir no estilo iFood | Checkout com imóvel, plano, prazo e pagamento, cada um com "Alterar". Ao tocar em contratar, uma folha repete tudo ("Está tudo certo?") antes de confirmar. |
| Refazer **Meu seguro** | Cartão da apólice com status, atalhos (pedir assistência, avisar sinistro, o que cobre, tirar dúvida), barras de quanto cada cobertura protege, assistências, próximos passos com datas (apólice, 1ª parcela, prazo de desistência) e o cartão "seu seguro acompanha a sua casa". |
| Ajuda com **dúvidas frequentes**; gerente só no fim | O botão Ajuda abre uma folha com as dúvidas **daquela tela**. Só no fim aparece "Ainda com dúvida? Falar com meu gerente". A tela do gerente ficou enxuta: o gerente e a escolha do canal (chat, ligação, vídeo). |
| Fluxo completo | Gerente avisado → notificação de retorno → **proposta ajustada** (o que o gerente mudou) → Conferir. O painel do gerente continua em `indexprototipo_gerente.html` (link no painel lateral). |

## De onde vêm os números (regra: nada à mão)
| Na tela | Origem |
|---|---|
| Fatos do aviso e de "Por que te avisamos" | Ficha do motor: bens (compras de 3 anos), vínculo, segundo risco, `sinais.vidracaria`, frases da Defesa Civil e da ANEEL que o motor já põe na justificativa |
| Dados da casa e selos (✓ observado, ≈ estimado) | `campos.*.valor`, `classe` e `fonte` |
| Perguntas | `perguntas[]` do motor, na ordem, com "deixa sua proteção até R$ X mais precisa" (`reduz_faixa_ate`) |
| Plano recomendado e motivo | `plano`, `motivos_plano`, `adicionais` |
| Valor sugerido de cada cobertura | **Meio da faixa** do motor, dentro do limite do produto (auditoria 28/10: o mínimo deixa subseguro) |
| "E se acontecer" | **Mínimo** da faixa do motor (estimativa conservadora, sem exagero); com seguro = franquia + o que passar do valor contratado |
| Franquias e limites | Prints do app atual ([[App atual - falhas e nosso fluxo]]) |
| **Preço** | **Ilustrativo** (o motor não calcula prêmio). Até o valor padrão de cada cobertura, usa a taxa por mil tirada dos prints do app atual; acima dele, cada real a mais custa 10% da taxa. Pacote de assistência: R$ 4,50. Resultado: de R$ 51 a R$ 128/mês nos casos da demo (perfil A: Prático R$ 85,23; perfil B: Total R$ 128,35; perfil C: Essencial R$ 52,13) |

## Visual e animação
- **Visual BB** ([[Regras de design BB]]): azul `#465EFF` no cabeçalho, amarelo `#FCFC30` só no botão principal, Nunito nos títulos com uma palavra em itálico ("da *sua casa*"), Inter no texto, cards brancos com sombra leve, ícones de traço.
- **Animação** (filosofia de Emil Kowalski): só `transform` e `opacity`. Curvas fortes de saída (`cubic-bezier(.23,1,.32,1)`) e de gaveta do iOS (`.32,.72,0,1`). Troca de tela em 340 ms. Folhas sobem de baixo em 420 ms. Cards entram em cascata de 45 ms. Valores contam até o número novo. Botões encolhem a 97% ao toque. O ✓ de sucesso é desenhado na tela. Quem pede menos movimento no sistema recebe só fades.
- **Acessibilidade:** botão **Aa** (texto 18% maior) e **Ouvir** (leitura em voz alta) em todas as telas.

## Como mexer no arquivo
Tudo está em `prototipos/app_v4.html`, um arquivo só:
- `TELAS.<id>`: cada tela tem `html()` (o que desenha), `pronto()` (o que roda depois), `cta()` (botão amarelo) e os textos `antes` e `depois` do painel.
- `COB` e `PLANOS`: nomes, limites, franquias e taxas do produto. `preco()`, `PACOTE` e `ACIMA_DO_PADRAO`: a conta do preço ilustrativo.
- `fatosDoAviso(f)`: escolhe os fatos do aviso. `cenarios()`: as situações "e se".
- `faqDaTela()`: as dúvidas frequentes de cada tela.
- Casos: `FICHAS_DEMO.casos` (A, B, C, já segurado, inquilino, a confirmar).

## Pendências
- [x] **Preço suavizado (29/10):** a tabela linear do app atual dava Prático R$ 190/mês (A) e Total R$ 283/mês (B) com os valores do motor. Agora o valor acima do padrão custa 10% da taxa (`ACIMA_DO_PADRAO` em `app_v4.html`), e tudo fica entre R$ 51 e R$ 128/mês. Se a banca perguntar: o preço é ilustrativo, o produto do datathon é a recomendação.
- [ ] Gravar no modo celular (janela estreita) e testar no celular de verdade.
- [ ] Nomes fictícios (gerente Ricardo, apólice BB 4021-7781, protocolo BB-8K2) são de demonstração.
- [ ] Combinar com o roteiro do vídeo ([[Especificação do app v2 - ligado ao motor]], seção 7).

Ligações: [[Especificação do app v2 - ligado ao motor]] · [[App atual - falhas e nosso fluxo]] · [[Regras de design BB]] · [[Jornada do cliente]] · [[Jornada do gerente]] · [[Motivo da recomendação]]
