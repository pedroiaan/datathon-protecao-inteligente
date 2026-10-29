# Handoff: contexto completo do projeto (Datathon BB, Seguro Residencial)

Cole este arquivo no início de uma conversa nova com qualquer assistente (Claude Code, claude.ai ou outro). Ele resume tudo o que foi feito e decidido até a noite de 28/10/2026.

> [!codigo] Código (atualizado 28/10 à noite)
> Mapa de cada arquivo e função: [[Mapa do código]]. O que foi corrigido e o que falta decidir: [[Auditoria do código - 28-10]]. Repositório oficial (público): https://github.com/pedroiaan/datathon-protecao-inteligente

## 1. Quem e o quê
- **Usuário:** Matheus (GitHub `matfsouza`), time de 5 pessoas (4 amigos + 1 integrante novo), pouca experiência em dados.
- **Evento:** Datathon Proteção Inteligente, Banco do Brasil / Brasilseg (com IBMEC). Desafio escolhido: **Seguro Residencial**.
- **Prazo:** entrega obrigatória **29/10/2026 até 10h**. Pitch de 5 min + 5 min de perguntas. 5 times, top 3 premiado.
- **Entrega:** 2 planilhas (`template_resultado_times.csv` com 138 linhas e `template_coberturas_times.csv` com uma linha por cobertura), código, README (com equipe, arquitetura, premissas, limitações, métricas, resultados e **uso de IA**), `requirements.txt` e versão do Python, vídeo de até 5 min com demonstração.
- **Foco certo:** motor + planilhas valem ~65% da nota. O app/protótipo é só a demonstração.

## 2. Regras que não podem ser quebradas (resumo)
Arquivo completo: `prototipo/REGRAS_DE_NEGOCIO_DATATHON.md` (58 regras + decisões do time + tabela de ideias proibidas). As principais:
- **RN-07 (revisada em 28/10):** idade e dado sensível nunca como atalho para risco ou patrimônio. **A renda foi liberada na mentoria do BB** (não é dado sensível) e entra como reforço combinado com outros sinais, nunca sozinha (decisão D-08). (Slide 14 da banca cita pets e crianças como sinal para RC familiar: usar como **necessidade confirmada pelo cliente**, nunca como inferência.)
- **RN-09:** estimativa nunca como fato; todo dado é observado, estimado ou confirmado.
- **RN-10:** coordenadas e endereços da base são fictícios; só município, UF e IBGE são reais.
- **RN-12:** o motor funciona sem dados externos; fontes externas só oficiais, atualizadas e documentadas.
- **RN-21/31/32:** todas as coberturas fixas do plano; faixas só com números; confiança baixa ainda tem faixa.
- Elegibilidade antes de recomendar; endereço que já tem seguro BB é inelegível.
- **Instrução para o assistente:** se uma ideia quebrar uma regra, diga "Isso não pode (RN-XX)", explique e sugira uma alternativa permitida.

## 3. Regras pessoais do Matheus (para o assistente)
- Nada de menção a IA/Claude em commits, PRs, issues ou textos da equipe; autor dos commits é o Matheus. Exceção: a seção curta "Uso de IA" do README, exigida pelo guia.
- Textos do repositório simples, com cara de projeto de aluno (skill stop-slop).
- Explicar termos técnicos em português simples.
- Não criar tarefas/planos antecipados no quadro do GitHub sem o time decidir.
- Ações destrutivas (apagar issues, etc.): passar o comando para o usuário rodar.

## 4. Onde está tudo
| O quê | Onde |
|---|---|
| Cérebro do projeto (Obsidian) | `C:\Users\maxom\OneDrive\Documentos\Obsidian Vault\BB Datathon` (comece por `00 - Painel.md`, `Regras e contexto.md` e a pasta `14 - App v2`) |
| **Próxima tarefa: construir o app** | Vault: `14 - App v2/Especificação do app v2 - ligado ao motor.md` |
| Histórico completo | Vault: `14 - App v2/Trajetória do projeto.md` |
| **Motor (versão de trabalho)** | Clone local `C:\Users\maxom\Documents\datathon-protecao-inteligente`, branch `revisao-qa-p1-p5`, ambiente `.venv` (Python 3.11) |
| PR com as correções do motor | https://github.com/pedroiaan/datathon-protecao-inteligente/pull/13 (fork: `matfsouza/datathon-protecao-inteligente`) |
| Repositório do Pedro (público) | https://github.com/pedroiaan/datathon-protecao-inteligente |
| Repositório do Matheus (privado, mais antigo) | https://github.com/matfsouza/datathon-bb-seguro-residencial · local `C:\Users\maxom\Documents\Claude BB Datathon` |
| Guia oficial | `docs/guia_datathon.md` (repo do Matheus) |
| Slides da banca (24 p.) | `C:\Users\maxom\Downloads\Conteudo_Brasilseg_Datathon_BBDW.pdf` |
| Guia de estudo do time (dados, perguntas da banca, vídeo) | `prototipo/GUIA_DA_EQUIPE_DADOS_E_PITCH.md` e vault `08 - Pitch` |
| Protótipo antigo do Matheus (só referência visual) | `prototipo/index.html` (números à mão, desatualizados) |
| Base do app v2 | `prototipos/indexprototipo_gerente.html` no clone do Pedro (já lê o motor) |

## 5. Decisões e achados principais
- Produto: planos Essencial / Prático / Total + coberturas adicionais permitidas (guia 9.2). Nomes do catálogo do datathon.
- Faixas = importância segurada. Casa: área × custo do m² (SINAPI mín, CUB oficial máx) × padrão. Apartamento, condomínio ou financiado: segundo risco (25% a 40% + bens). Bens: compras 36 meses × IPCA, até 2,7×.
- Área vazia (67%): estimada por IPTU e energia do município. Padrão vazio: faixa 0,85 a 1,30.
- Plano por pontos de sinais; crianças e pets só como necessidade informada (RC). Veraneio não puxa o Prático (roubo não cobre residência desocupada).
- Confiança por regra sobre a classe de cada dado crítico (observado, estimado, presumido), não por corte numa nota.
- Elegibilidade: já segurado com um imóvel = NAO; dois imóveis = pergunta.
- App: demonstração dentro do app do BB, ligada ao motor, com botões A/B/C, modo raio-X e tela do gerente. Não criar app separado.
- Fontes oficiais: SINAPI ago/2026 (IBGE), CUB oficial SP/DF/GO/BA, IPCA 12m 4,58% (API BCB 433), FipeZAP set/2026, Condições Gerais BB v1.4.

## 6. Estado agora (28/10, noite) e próximos passos
Motor pronto e auditado contra o guia: 49 testes, planilhas validadas, README final (faltam nomes da equipe), PR #13 aberto para o Pedro.
1. **Construir o app v2** seguindo a especificação no vault (`14 - App v2`).
2. Nomes da equipe no README.
3. Pedro aceitar o PR #13, ou o time escolher o repositório da entrega.
4. Gravar o vídeo de 5 min (roteiro na especificação e no guia do time).
5. Entrega até 29/10 às 10h.

## 6b. Estado do app (29/10, madrugada): app Expo pronto para gravar
O app de verdade está em **`app-expo/`** (Expo SDK 58, expo-router, Reanimated), feito na branch **`app-celular`** e enviado ao Pedro por PR. Tudo o que foi feito está em [[App Expo - app de verdade no celular]] (rodadas 1 a 8), [[Portal do gerente]] e [[Prompt das ilustrações (ChatGPT)]].
- **Fluxo:** aviso na tela de bloqueio → entrada → Passos 1 a 5 → sucesso (casa que gira e vira ✓) → Meu seguro. Lado do gerente: Ajuda → Falar com o gerente → **Portal do gerente** (código `SR-XXXX-XX` por cliente, pedido preenchido, sugestões, edição de plano e coberturas, envio). O cliente recebe a proposta com o selo "ajustado pelo gerente".
- **Visual:** 16 ilustrações e 28 ícones gerados no ChatGPT já estão no app (`assets/ilustracoes/`, `assets/icones/`, registro em `src/ui/imagens.ts`). Faltam os 6 visuais do prompt 2 (papel de parede, casa do Meu seguro v2, casa da moeda, emblemas dos planos). Quando chegarem: copiar os PNGs, `npm run reduzir`, `npm run imagens`.
- **Rodar:** `cd app-expo && npm install && npx expo start` (celular, Expo Go) ou `npx expo start --web` (moldura de iPhone no navegador). Abrir um caso direto: `/?caso=perfil_B_casa_familiar`.
- **Dados do motor:** `npm run dados` copia e confere as fichas (`src/dados/contrato.ts` é o contrato).
- **Antes de commitar:** `npx tsc --noEmit` e `npx eslint src`. Commits sem menção a IA (regra do time).

## 7. Primeira mensagem sugerida para o novo assistente
"Leia o HANDOFF_CONTEXTO.md e, no vault do Obsidian, `00 - Painel.md`, `Regras e contexto.md`, `14 - App v2/Trajetória do projeto.md` e `14 - App v2/App Expo - app de verdade no celular.md` (o app atual, em `app-expo/`). Siga as regras de negócio e as minhas regras pessoais. Depois me diga em 5 linhas o que entendeu e continue pelas pendências da nota do App Expo."
