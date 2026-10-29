---
tags: [app, demo, video, planilha, motor]
data: 2026-10-29
status: pronto para gravar
pasta: app-expo/
---
# 🎬 Demo do vídeo: o app e a planilha do motor, lado a lado

> [!tip] Como gravar (sem editar o vídeo depois)
> 1. Na pasta `app-expo/`: `npm install` (só na primeira vez) e `npx expo start --web`.
> 2. Abra `http://localhost:8081` numa janela larga (1600 × 900 fica ótimo).
> 3. Aparece o **menu da demonstração**: escolha o caso e grave. Para trocar de cliente a qualquer momento: o botão **Trocar cliente**, no canto superior esquerdo (fora do iPhone e da planilha), ou a tecla **M**, ou recarregar a página.
> 4. O app fica à **esquerda** (dentro de um iPhone) e a **planilha do motor** à **direita**, mudando a cada tela.

> [!info] A planilha só acompanha o app (29/10)
> Não rola, não tem aba clicável e não aceita clique: muda sozinha a cada tela do app. Cabe inteira ao lado do iPhone e usa as cores e as fontes do app (azul do BB, Figtree e Nunito), mantendo a cara de planilha: letras das colunas, números das linhas, grade e a barra de fórmulas com o motivo. O menu tem fundo escuro e desfocado.

## Os dois casos
| | Caso 1 · "Já sabemos tudo" | Caso 2 · "Faltam dados" |
|---|---|---|
| Cliente (nome da demo) | Luana Prado | Sérgio Becker |
| Imóvel | `IMO_CASO_00036_02`: apartamento de 50 m² em Goiânia | `IMO_CASO_00015_01`: casa em Porto Alegre |
| Dados | Área cadastrada; paga R$ 950 de aluguel | **Área estimada** (≈ 127 m², pelo IPTU e pela luz) e **padrão desconhecido** |
| Plano do motor | **Total**, confiança **alta** | **Essencial no limite**, confiança **média** |
| Perguntas na tela | **0** → contrata em 1 toque | **2**: "Seus eletrônicos valem mais de R$ 10 mil?" e "Como é o acabamento?" |
| O momento do vídeo | O caminho rápido | Responder **"Sim, passam do limite"** sobe o plano para o **Prático** na hora; a planilha avisa "motor indicou Essencial; mudou pela resposta" |

Os casos estão em `motor/gerar.py` (`CASOS_DO_VIDEO`). Para trocar, mude ali, rode `python motor/gerar.py --entrega` e `npm run dados`.

## O que a planilha mostra em cada tela
Os dados são a **linha exata** das duas planilhas de entrega (`template_resultado_times.csv` e `template_coberturas_times.csv`), copiadas pelo `gerar.py` para a ficha do app. Nada é digitado à mão.

| Tela do app | Aba | Linhas em amarelo | Parte do motivo (barra de fórmulas) |
|---|---|---|---|
| Notificação | resultado | cliente_id, imovel_id, elegivel | Abertura ("Para a sua casa de cerca de 127 m² em Porto Alegre…") |
| Entrada | resultado | tipo, uso, vínculo | Valor em jogo |
| 1 · Sua casa | resultado | tipo, uso, vínculo, confiança, perguntas | Confiança (com o acerto), No limite, Fato dos vizinhos |
| 2 · O que cobre | coberturas | todas as coberturas, com mínimo, máximo e regra | Risco da cidade, Valor em jogo |
| 3 · Seu plano | resultado | plano, coberturas, justificativa | Porquê, Se escolher menos, No limite / Plano acima |
| Personalizar | coberturas | as coberturas extras do plano | Se escolher menos |
| 4 · Conferir | motivo | o motivo inteiro, parte por parte | Resumo: N partes, X palavras |
| Contratado | resultado | plano, coberturas, confiança | Confiança |
| Gerente e portal | resultado | confiança, perguntas (e ids no portal) | Confirmar, Porquê, Confiança |

**Os indicadores no topo** (as métricas do momento): plano (com a força "clara" ou "no limite", e o aviso quando a resposta mudou o plano), confiança (a do motor e a de agora), área (cadastrada ou estimada, com o acerto da conta), perguntas na tela (quantas e quantas respondidas) e jornada.

**"(calculado pelo motor)"** marca uma frase que o motor calculou mas que saiu do texto final para caber em 140 palavras (ex.: o risco da cidade no caso 2). O app usa essas frases na tela certa, para conscientizar, sem inventar nada.

## O motivo, distribuído pelas telas
O motor passou a entregar o motivo **em partes nomeadas** (`motivo.justificativa_partes`): abertura, porquê, fato dos vizinhos, valor em jogo, risco da cidade, se escolher menos, no limite ou plano acima, confirmar e confiança. A coluna `justificativa_recomendacao` do CSV é a junção dessas partes. **O texto entregue não mudou**: as planilhas saíram idênticas.

## O código do gerente
**Antes:** `SR-4F7K-2Q`, aleatório: só servia para quem já sabia o código.
**Agora:** `SR-RS-ESS-0015-1` = Seguro Residencial · **estado** do imóvel · **plano** indicado pelo motor (ESS, PRA ou TOT) · **número do caso** e do imóvel.
- Dá para buscar por **pedaço**: "RS" lista os clientes do Rio Grande do Sul; "ESS", os do Essencial; "0015", o caso.
- **A fila vem ordenada pelo que trava a contratação:** primeiro o pedido que acabou de chegar; depois "precisa de você" (jornada do gerente ou pergunta obrigatória); depois "confiança baixa"; por último, "pronto para 1 toque".
- **No topo do portal:** pedidos, quantos precisam do gerente e quantos estão prontos.

## Que canal é o nosso (resposta para a banca)
Não é um nome inventado: é a **combinação de três conceitos que existem**:
- **One Click Buy** (o que o BB usa hoje): comprar em poucos passos. Mas o cliente preenche tudo.
- **Pré-preenchimento (prefill):** o banco já sabe e preenche. As seguradoras digitais dos EUA preenchem a cotação pelo endereço.
- **STP com exceção humana** (*straight-through processing*, processamento direto do começo ao fim): quem tem os dados completos segue direto, sem pessoa no meio (o caso 1). Só a exceção vai para uma pessoa, e aí entra o **aconselhamento híbrido** (*human-in-the-loop*): o gerente só onde falta algo que trava.

> **Frase para o pitch:** "É um One Click Buy pré-preenchido, que pergunta só o que falta e usa o gerente como exceção, não como regra." O nome técnico mais próximo é **STP com escalonamento humano**.

## Arquivos
| Arquivo | O que faz |
|---|---|
| `motor/gerar.py` | `CASOS_DO_VIDEO`; grava, por ficha, `planilha` (as linhas dos 2 CSVs), `motivo_partes` e `motivo_extras` |
| `motor/motivo.py` | `justificativa_partes(f)`: o motivo em partes; `justificativa(f)` junta |
| `app-expo/src/ui/planilha.tsx` | O painel no estilo do Excel (etapa → aba, linhas e parte do motivo) |
| `app-expo/src/ui/menuDemo.tsx` | O menu dos 2 casos |
| `app-expo/src/ui/moldura.tsx` · `src/app/_layout.tsx` | O iPhone à esquerda, a planilha à direita e o menu por cima |
| `app-expo/src/logica/estado.tsx` · `textos.ts` | A pergunta decisiva (`DECIDE_PLANO`) e o plano que muda com a resposta |
| `app-expo/src/logica/gerente.ts` · `src/app/painel.tsx` | Código novo, fila por prioridade e números da carteira |
| `app-expo/src/config.ts` | `planilhaAoLado`: liga e desliga a planilha e o menu |

No celular (Expo Go) nada muda: sem moldura, sem planilha e sem menu (o caso continua sendo trocado segurando o relógio).

Ligações: [[App Expo - app de verdade no celular]] · [[Portal do gerente]] · [[12 - O motivo feito para você]]


## Correção do Passo 2 (29/10)
No navegador, a lista de situações (alagamento, queda de raio, danos a terceiros…) não deslizava: o mouse não arrasta listas laterais e a rodinha rolava a página. Agora (`src/ui/carrossel.tsx`) dá para **arrastar com o mouse**, usar a **rodinha** e, ao escolher uma situação, ela é **centralizada**. Vale também para a faixa de assistências. No celular nada muda.
