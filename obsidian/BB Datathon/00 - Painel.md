---
tags: [painel, datathon-bb]
---
# 🏠 Datathon BB: Seguro Residencial

> [!tip] Comece por aqui
> Novo assistente? Leia [[HANDOFF_CONTEXTO]] e depois [[Trajetória do projeto]]. Regras: [[Regras e contexto]] e [[Regras de negócio]].
> **Próxima tarefa:** [[Especificação do app v2 - ligado ao motor]].

> [!codigo] Código do motor (atualizado 28/10 à noite)
> **Comece por [[Visão geral do motor (comece aqui)]]. Tudo em detalhe: [[00 - Índice (leia nesta ordem)]] (pasta 16).** Depois: [[Mapa do código]] (cada arquivo e função) · [[Auditoria do código - 28-10]] (erros e correções) · [[Métricas do mercado x as nossas]] · [[Log de alterações do código]]
> **155 testes** · 0 erros nas planilhas · Prático 66 · Total 38 · Essencial 34 · elegível 138 (16 com pergunta obrigatória do seguro BB) · gerente em 26 casos (19%) · respostas para a banca em [[08 - Perguntas da banca e respostas]]

> [!fonte] Dados externos em uso
> SINAPI · CUB oficial (7 UFs) · IPCA · FipeZAP · [[Atlas Digital de Desastres]] (S2iD) · [[ANEEL continuidade]]. Tudo salvo no projeto: o motor roda sem internet.

> [!success] Pós-mentoria executado (28/10)
> [[Plano - motivo, dados faltantes e gerente]]: motivo 2.0 (0 genéricos, 100% com fato do cliente), média regional em degraus, gerente só em último caso (71 → 35) e SINAPI/IPCA ao vivo pelas APIs do IBGE e do BC.

> [!decisao] Renda liberada (mentoria BB, 28/10) e relatório de validação
> A renda não é dado sensível: a RN-07 foi revisada (decisão D-08 em [[Regras de negócio]]). No motor, ela só reforça os bens de quem não tem compras (erro 40,5% → 22,7% fora da amostra). **91 testes**; as 2 planilhas não mudaram. Relatório completo: `documentos/RELATORIO_VALIDACAO.md` (branch `validacao/renda-liberada-e-relatorio`).

> [!warning] Para o time decidir
> Família mudando o plano em 18 casos (RN-07) · limites de danos elétricos e água que são premissa · "valor sugerido" no meio da faixa. Detalhes na [[Auditoria do código - 28-10]].

> [!info] Datas e links
> **Entrega:** 29/10 às 10h · **Mentoria:** 28/10 às 14h · **Equipe:** 5 · **Concorrência:** 5 equipes, top 3 premiado
> [Repositório oficial (público)](https://github.com/pedroiaan/datathon-protecao-inteligente) · [Repositório antigo do Matheus](https://github.com/matfsouza/datathon-bb-seguro-residencial) · [Quadro de tarefas](https://github.com/users/matfsouza/projects/1) · [[Reuniões]]

## Mapa do vault
- **01 - Briefing:** [[Entenda a entrega (explicação simples)]] (comece aqui), [[Desafio - resumo]], [[Guia oficial do datathon]], [[Critérios de avaliação]], [[Elegibilidade residencial]], [[Templates de entrega]], [[Transcrição da apresentação]], [[Perguntas para a mentoria]]
- **02 - Dados:** [[Dicionário de dados]], [[Achados iniciais dos dados]], [[Enriquecimento externo]]
- **03 - Solução:** [[Plano de preenchimento das planilhas]] (plano atual), [[Como calcular o valor dos bens e da casa]], [[Bens sem nota - método em 3 camadas]], [[Onde está a inovação]] (estratégia), [[Jornada dentro do app - ideias v3]] (atual), [[Planos de jornada para o debate]] (antiga), [[O sistema na prática - 4 cenas]], [[Como o motor funciona - exemplo real]], [[Ideias]]
- **04 - Tecnologia:** [[Aplicação em Python]], [[Stack e glossário]]
- **05 - Pesquisa:** [[Dicas para vencer]], [[Métricas de bancos e seguradoras]], [[Ferramentas da equipe]]
- **06 - Git e Entregas:** [[Log de commits]]
- **07 - Equipe e Tarefas:** [[Cronograma]], [[Reuniões]], [[Pauta da reunião - escolha das ideias]]
- **08 - Pitch:** [[Guia da equipe - dados e pitch]] (estudar), [[Roteiro do pitch]]
- **09 - Conceitos:** [[Grau de confiança]], [[Motivo da recomendação]], [[Perguntas de confirmação]], [[Jornada do cliente]], [[Jornada do gerente]], [[Click-to-buy]], [[Personalizar sem decidir pela pessoa]], [[Alternativas comparáveis]]
- **10 - Coberturas:** [[Reconstrução]], [[Conteúdo]], [[Danos elétricos]], [[Perda de aluguel]], [[Responsabilidade civil familiar]], [[Sexta cobertura]]
- **11 - Fontes externas:** [[SINAPI]], [[Atlas Digital de Desastres]], [[INPE ELAT]], [[SINESP]], [[SGB setorização de risco]], [[Imagem de satélite]]
- **12 - Inovação:** [[Ideias v2 - proposta para o time]] (atual), [[Ideias descartadas ou adiadas]], [[Ideias de equilíbrio]], [[Ideias de inovação]], [[Referências de mercado]]
- **15 - Código:** [[Mapa do código]], [[Auditoria do código - 28-10]], [[Métricas do mercado x as nossas]], [[Log de alterações do código]]
- **14 - App v2:** [[App Expo - app de verdade no celular]] (app para gravar, rodada 8, branch `app-celular`), [[Portal do gerente]], [[Prompt das ilustrações (ChatGPT)]], [[Protótipo v4 - app do cliente]], [[Especificação do app v2 - ligado ao motor]], [[Trajetória do projeto]]
- **13 - Design:** [[App atual - falhas e nosso fluxo]] (protótipo), [[Regras de design BB]], [[Análise do visual do BB]], [[Catálogo do Seguro Residencial BB]]

Para abrir o grafo, use `Ctrl+G`. As cores separam as pastas.

## Status
- [x] Repositório no GitHub (público: pedroiaan/datathon-protecao-inteligente)
- [x] Áudio da apresentação transcrito
- [x] Quadro de tarefas criado (vazio até ter o plano)
- [ ] Convidar a equipe no repositório e no quadro
- [ ] Pasta compartilhada no Google Drive
- [x] Dados e guia oficial recebidos, no repositório e no [[Dicionário de dados]]
- [x] Declaração curta de uso de IA no README
- [x] Definir o MVP e o modelo (motor de regras, ver [[Mapa do código]])
- [ ] Mentoria com as [[Perguntas para a mentoria|perguntas]]
- [ ] Template + código + vídeo de 5 min
