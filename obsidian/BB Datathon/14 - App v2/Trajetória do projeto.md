---
tags: [historico, datathon-bb]
atualizado: 2026-10-28
---
# Trajetória do projeto (27/10 a 28/10/2026)

Linha do tempo das decisões, para quem chega agora. Detalhes em cada nota ligada.

## 27/10: abertura e organização
- Abertura do datathon (BB + Brasilseg + IBMEC). Escolhemos o **Seguro Residencial**. Áudio transcrito: [[Transcrição da apresentação]].
- Repositório privado do Matheus criado (`matfsouza/datathon-bb-seguro-residencial`), com dados e guia oficial. Regra: nada de menção a IA nos commits; só a seção curta "Uso de IA" no README (exigida pelo guia).
- Vault Obsidian montado como "cérebro" do projeto (só local). Quadro do GitHub vazio até o time decidir.
- Regras do guia viraram regras invioláveis: [[Regras e contexto]], [[Regras de negócio]] (58 RN). Principal: **RN-07, renda e idade nunca como atalho** (renda tem correlação 0,87 com bens: é a armadilha).
- Ideias de inovação e jornada: [[Ideias v2 - proposta para o time]], [[Jornada dentro do app - ideias v3]]. Matheus corrigiu: One Click Buy é só um exemplo do guia; o foco é jornada dentro do app do BB, sem trocar de canal.
- Design BB analisado a partir de prints do app: [[Regras de design BB]], [[App atual - falhas e nosso fluxo]].

## 28/10 manhã: protótipo e plano das planilhas
- Protótipo de 8 telas no visual do BB (`prototipo/index.html` do Matheus), com o caso real CASO_00005 de Curitiba, simulador "e se acontecer", ajuda humana em todas as telas, modo simples e voz.
- Especificação do protótipo para as IAs do grupo: `prototipo/ESPECIFICACAO_PROTOTIPO.md`.
- Método de valor: faixa = importância segurada; casa = reconstrução sem terreno; apartamento = segundo risco (acabamentos + bens); bens a valor de novo (IPCA). [[Como calcular o valor dos bens e da casa]].
- Matheus redirecionou: **o foco é o motor + as 2 planilhas** (~65% da nota). Plano: [[Plano de preenchimento das planilhas]]. Fontes oficiais conferidas (SINAPI ago/2026, IPCA 4,58% via API do Banco Central, FipeZAP).

## 28/10 tarde: o motor do Pedro
- Pedro construiu o motor completo no repositório público `pedroiaan/datathon-protecao-inteligente`: regras explicáveis em Python 3.11, 35 testes, planilhas validadas, protótipo do gerente lendo as fichas, API.
- **Revisão QA simulando a banca** ([[Revisão QA - repositório do Pedro]]). Achados: P1 clientes já segurados saíam elegíveis; P2 perfis contrastantes diferentes do slide 14; P3 crianças e pets ignorados (slide 14 cita RC familiar); P4 zero casos de confiança BAIXA; P5 CUB de 6 estados vindo de agregador; P6 repositório público; P7 dois repositórios.

## 28/10 noite: correções no motor ([[Correções P1-P5 no motor]])
1. **Seguro existente:** um imóvel → NAO (24 casos); dois → SIM + "qual já tem seguro?".
2. **Perfis do slide 14:** A apartamento urbano, B casa familiar, C imóvel de lazer + não elegível.
3. **Crianças e pets:** só como necessidade informada. Crianças **e** pet = +1 Total. Descartado "qualquer um = +1" (o Total ia a 65%).
4. **Confiança:** primeiro com desconto por completude (deixou 101 de 138 casos a 3 pontos do corte, instável). **Trocada por regra sobre a classe de cada dado** (observado, estimado, presumido). Mexer 20% nos pesos: 0 casos mudam.
5. **CUB só oficial** (SP, DF, GO, BA); demais = SINAPI × 1,09.
6. **Padrão construtivo vazio** → faixa 0,85 a 1,30 + pergunta.
7. **Perguntas pelo valor da informação** (R$ que cada resposta tira da faixa).
8. **Justiça por quinto de renda** e regra dos 80% na elegibilidade (0,91).

## 28/10 madrugada: auditoria contra o guia
- **Incoerência achada:** veraneio ganhava Prático "porque fica vazio", mas o roubo não cobre residência desocupada. Corrigido: veraneio sem ponto de Prático.
- **Cobertura adicional** (guia 9.2): RC familiar para crianças ou pets em prédio/condomínio (41 casos).
- Métricas do guia §8 que faltavam: estabilidade do plano (1 caso com ±5%), falhas (0), elegibilidade por regra.
- **README final** com as 11 seções do guia §6 (faltam nomes da equipe). `FONTES.md` com licença.
- Guia de estudo do time: [[Guia da equipe - dados e pitch]].
- **PR aberto:** fork `matfsouza/datathon-protecao-inteligente`, branch `revisao-qa-p1-p5` (7 commits do Matheus) → [pedroiaan/datathon-protecao-inteligente#13](https://github.com/pedroiaan/datathon-protecao-inteligente/pull/13).

## Decisão sobre o app (28/10)
- O app **não precisa ser real**; é demonstração. Continuar **dentro do app do BB**, ligado ao motor, com botões A/B/C, modo raio-X e tela do gerente. Não criar app separado.
- Plano de construção: [[Especificação do app v2 - ligado ao motor]].

## 29/10: app Expo alinhado ao motor do Pedro (rodada 4)
- O Pedro atualizou o motor e o vault (necessidades com provas, território, RN-07 revisada: renda só como sinal complementar de bens; idade nunca). O app foi refeito em cima desse commit, na branch `app-celular`; a minha versão anterior do F1/motor ficou em `backup/rodada-guilherme-29-10`.
- App: moldura de iPhone para gravar no computador, só azuis do BB, escala tipográfica, selo "ajustado pelo gerente", pagamento trocável, Ajuda em todas as telas, herói e animação final refeitos, contrato de dados e importação com conferência. Detalhes em [[App Expo - app de verdade no celular]].

## 29/10: portal do gerente e ilustrações finais (rodada 5)
- Portal do gerente dentro do app: código fixo por cliente (só o gerente vê), pedido pré-preenchido, sugestões dentro da faixa do motor, envio para o cliente decidir. Regras em [[Portal do gerente]].
- Prompt para o ChatGPT gerar as 17 ilustrações finais, com as regras das skills dentro do próprio prompt. Enviado ao time; o app troca o SVG pela imagem quando o PNG chega. Ver [[Prompt das ilustrações (ChatGPT)]].

## 29/10: gerente edita a proposta (rodada 6)
- O gerente agora edita plano e coberturas antes de devolver a proposta (mesmos componentes do Personalizar). O selo "ajustado pelo gerente" que cobria o texto no Conferir foi para o cabeçalho da seção. Ver [[Portal do gerente]].

## 29/10: prompt 2, ícones e visuais (rodada 7)
- As ilustrações do ChatGPT ficaram boas; o resto do app precisava acompanhar. Prompt 2 enviado ao time (28 ícones em folhas + 6 visuais), e o app pronto para trocar cada peça sozinho. Ver [[Prompt das ilustrações (ChatGPT)]].

## 29/10: imagens do ChatGPT no app e PR para o Pedro (rodada 8)
- 16 ilustrações e 28 ícones no app; reduzidas para carregar rápido. Branch `app-celular` atualizada com o `main` do Pedro e enviada por PR, com o vault atualizado (inclusive o HANDOFF_CONTEXTO, para continuar em outro chat).

## Números atuais do motor (base comum, 138 casos)
| Métrica | Valor |
|---|---|
| Testes | 49 passando |
| Planos | Prático 59 · Total 49 · Essencial 30 · 41 RC adicionais |
| Elegibilidade | SIM 114 · NAO 24 · 13 com pendência |
| Confiança | ALTA 17 · MÉDIA 101 · BAIXA 20 |
| Perguntas | 2,72 por caso |
| Justiça (renda e idade) | 0 casos mudam |
| Estabilidade | plano ±5%: 1 caso · confiança pesos ±20%: 0 casos |
| Faixa de incêndio por confiança | ALTA 1,92 · MÉDIA 2,35 · BAIXA 2,64 |
| Tempo | ~0,5 s |

## Pendências para a entrega (29/10, 10h)
1. Pedro aceitar o PR #13 (ou o time decidir qual repositório entrega).
2. Nomes da equipe e integrantes no README.
3. Construir o app v2 ([[Especificação do app v2 - ligado ao motor]]).
4. Gravar o vídeo de 5 min.
5. Tornar o repositório privado antes da entrega, se a organização permitir (hoje está público).
6. Perguntar à organização sobre "instalações e pequenos reparos" (está no guia, falta no catálogo CSV).
