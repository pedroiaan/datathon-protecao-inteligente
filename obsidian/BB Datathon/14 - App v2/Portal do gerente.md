---
tags: [app, expo, gerente, regras-de-negocio, datathon-bb]
data: 2026-10-29
status: pronto no app (branch app-celular)
pasta: app-expo/src/app/painel/
---
# 🧑‍💼 Portal do gerente

O lado do gerente no mesmo app e no mesmo visual do BB. Ele vê o pedido do cliente de forma simplificada, já preenchido, e sugere ajustes de personalização. O cliente recebe a proposta marcada **"ajustado pelo gerente"** e decide.

## Como chegar (demonstração)
- No fluxo do cliente: **Ajuda → Falar com meu gerente → Chamar o Ricardo → "Abrir o portal do gerente"**.
- Atalho: na tela de bloqueio, **segure o relógio → "Abrir o portal do gerente"**.
- Direto no navegador: `/painel` (fila) ou `/painel/SR-XXXX-XX` (um cliente).

## Código do cliente
- Cada cliente tem um código fixo, no formato **`SR-XXXX-XX`**, gerado do `cliente_id` + `imovel_id` da ficha do motor (hash FNV-1a). Mesmo cliente e imóvel = mesmo código, sempre.
- O alfabeto não tem 0/O nem 1/I/L, para ditar por telefone sem erro.
- **O código só aparece no portal.** O cliente não vê nem precisa ditar nada: o pedido chega ao gerente com tudo o que ele montou no app.
- A busca aceita o código completo, parte dele (`G5CR`), sem hífen ou em minúsculas, e também o nome.
- Função: `codigoDoCliente(f)` em `app-expo/src/logica/gerente.ts`.

## Tela 1: fila de pedidos (`/painel`)
Cabeçalho azul com "Olá, Ricardo" e a busca. Um cartão por cliente: iniciais, nome (fictício), tipo do imóvel, cidade, plano, código e há quanto tempo chegou. O pedido do cliente da demonstração vem primeiro, com o selo **NOVO**; os outros casos do motor aparecem como a carteira. Rodapé: "Visível só para o gerente do cliente. Renda e idade não aparecem."

## Tela 2: pedido do cliente (`/painel/[codigo]`)
| Bloco | O que mostra | De onde vem |
|---|---|---|
| Cabeçalho | Código, nome, "pediu ajuda agora" | Fila |
| O imóvel | Tipo e complemento, cidade, uso e relação, bens (faixa), confiança da análise com o motivo | Ficha do motor (`campos`, `confianca_motivo`) e as edições do cliente |
| Confirmar com o cliente | Pendências de elegibilidade (ex.: já tem outro seguro) | `pendencias` |
| O que o cliente montou | Plano escolhido × indicado, mensalidade, selo "ajustado" se o cliente mexeu, valor de cada cobertura (em vermelho se abaixo da faixa) | Estado do app |
| Por que o motor indicou | Até 3 provas | `necessidades[].provas` ou `motivos_plano` |
| Sugestões | Cada uma com título, motivo, efeito no preço e uma chave liga/desliga | `sugestoesDoGerente()` |
| Rodapé | Nova mensalidade (com a antiga riscada) e "Enviar para {nome}" | `aplicarSugestoes()` |

### Editar a proposta (edição manual)
Abaixo das sugestões, **"Editar plano e coberturas"** abre o **mesmo seletor de planos e a mesma lista de coberturas do Personalizar do cliente** (componentes compartilhados `SeletorPlanos` e `ListaCoberturas`, em `src/ui/`), agindo sobre a proposta em edição e não sobre o app do cliente:
- trocar o plano (Essencial, Prático ou Total), com o preço de cada um;
- tocar no valor de uma cobertura para digitar o valor exato ou usar Mínimo / Sugerido / Máximo, dentro do limite do produto, com o aviso quando fica abaixo da faixa do motor (escrito para o gerente: "parte pode ficar com o cliente");
- ligar e desligar as coberturas que o cliente pode tirar;
- "Desfazer edições" volta à proposta só com as sugestões.

Regras:
- A edição manual fica **por cima das sugestões**. Se o gerente editar à mão o mesmo item de uma sugestão (ex.: roubo), **vale a edição**; a sugestão mostra "Você editou este item abaixo: vale a sua edição".
- Só o que difere é guardado (`Ajustes` em `gerente.ts`: plano, valores, ligadas). Cada mudança vira uma frase para o cliente: "Mudou o plano para o Total.", "Danos por água: de R$ 40.500 para R$ 3.000.", "Incluiu danos a terceiros.", "Tirou vidros da proposta."
- O cabeçalho da seção resume: "Plano Total · 3 mudanças para o cliente".

Ao enviar: folha de confirmação com as frases que o cliente vai ler → aviso na tela de bloqueio do cliente → **Proposta ajustada** só com o que o gerente deixou ligado.

## Regras de negócio das sugestões
O gerente **confirma dados e ajusta valores dentro da faixa do motor**. Ele não muda a regra, não vê renda nem idade e não contrata nada.

| Sugestão | Quando aparece | O que faz | O cliente lê |
|---|---|---|---|
| Confirmar dados estimados | Há perguntas do motor sem resposta | Responde as perguntas abertas (o gerente pergunta: outro seguro, área, acabamento...) | "Confirmou com você os dados que eram estimativa..." |
| Voltar ao plano indicado | Cliente escolheu plano diferente do indicado | Volta ao plano do motor | "Sugeriu o plano X, o indicado para o seu imóvel." |
| Incêndio de volta | Cliente baixou incêndio abaixo do custo de reconstrução | Volta ao valor sugerido (meio da faixa) | "Incêndio voltou para R$ X, o suficiente para reconstruir." |
| Quebra de vidros | Há gastos com vidraçaria e o valor está abaixo do teto da faixa | Sobe para o teto da faixa | "...perto do que você gastou com vidraçaria" |
| Roubo | Há faixa de roubo, imóvel não é de temporada e o valor está abaixo do teto | Sobe para o teto da faixa (eletrônicos e portáteis) | "Roubo foi para R$ X..." |
| Danos a terceiros | Motor marcou RC como adicional (vizinho colado, dependentes ou pet) e está desligada | Liga RC | "Incluiu danos a terceiros..." |
| Imóvel de temporada | Uso = lazer/veraneio | Só orientação, não muda a proposta | "Explicou que, com o imóvel vazio, o roubo não é coberto..." |

- Todas vêm **ligadas**; o gerente desliga as que não quer. Se desligar todas, o cliente lê "Revisou a proposta com você e manteve como estava."
- O atalho "Pular: simular resposta" aplica todas (`comAjusteDoGerente`).
- Respostas padrão das perguntas sensíveis: **"Não"** para "já tem outro seguro" e "está em obra".

## Onde está no código
- `app-expo/src/logica/gerente.ts`: código do cliente, fila, sugestões, edição manual (`Ajustes`, `somaAjustes`) e a proposta final (`propostaDoGerente`), efeito no preço.
- `app-expo/src/app/painel.tsx` (fila) e `app-expo/src/app/painel/[codigo].tsx` (pedido). A fila fica em `painel.tsx` e não em `painel/index.tsx` porque as rotas tipadas do Expo tratavam o índice como `/painel/index`.
- `app-expo/src/ui/coberturas.tsx` (lista editável, compartilhada com o Personalizar) e `app-expo/src/ui/seletor.tsx` (seletor de planos, compartilhado com o Passo 2).
- `Estado.notasGerente` guarda as frases que o cliente lê em `ajustada.tsx`.
- Nomes fictícios dos clientes: `NOME_CLIENTE` em `produto.ts` (o motor só tem o código do cliente).
- Ajuda do portal: `useAjuda("painel", { semGerente: true })`, com dúvidas próprias (de onde vem o código, posso mudar a regra?, o cliente precisa aceitar?, por que não aparecem renda e idade?).

## Num sistema real
- O pedido chegaria por API (`/pedidos?gerente=...`) com a ficha do motor e o estado do app; aqui a fila é montada com as fichas de `fichas.json`.
- O código seria gerado no servidor e o acesso restrito à carteira do gerente.

Ligações: [[App Expo - app de verdade no celular]] · [[Prompt das ilustrações (ChatGPT)]] · [[Especificação do app v2 - ligado ao motor]] · [[Trajetória do projeto]]
