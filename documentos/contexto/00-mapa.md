# 00 · Mapa do projeto

O índice e a linha do tempo. Comece por aqui. Cada etapa tem um documento curto explicando **o que fizemos, por que importa e o que entender**.

**O plano a seguir:** [`PLANO_UNIFICADO.md`](../PLANO_UNIFICADO.md) · **Slides do plano:** [`apresentacao_plano.html`](../apresentacao_plano.html)

## Linha do tempo

| # | Etapa | Documento | Status |
|---|---|---|---|
| 01 | O problema e a nossa ideia | [01-problema-e-ideia.md](01-problema-e-ideia.md) | ✅ |
| 02 | Pesquisa de mercado e fontes oficiais | [02-pesquisa-e-fontes.md](02-pesquisa-e-fontes.md) | ✅ |
| 03 | Protótipos das jornadas | [03-prototipos.md](03-prototipos.md) | ✅ |
| 10 | T1 · Parâmetros e fontes no motor | [10-t1-parametros.md](10-t1-parametros.md) | ✅ |
| 11 | T2 · Imóvel e bens | [11-t2-imovel-e-bens.md](11-t2-imovel-e-bens.md) | ✅ |
| 12 | T3 · Elegibilidade, plano e coberturas | [12-t3-plano-e-coberturas.md](12-t3-plano-e-coberturas.md) | ✅ |
| 13 | T4 · Validação e planilhas v1 | [13-t4-planilhas-v1.md](13-t4-planilhas-v1.md) | ✅ |
| 14 | T5 e T6 · Confiança, testes, métricas e casos | [14-t5-t6-provas.md](14-t5-t6-provas.md) | ✅ |
| 15 | T7 · Demo lendo o motor | [15-t7-demo.md](15-t7-demo.md) | ✅ |
| 16 | T9 · API para agentes | [16-t9-api.md](16-t9-api.md) | ✅ |
| 17 | Revisão QA: elegibilidade, perfis do slide 14 e confiança por regra | [17-revisao-qa.md](17-revisao-qa.md) | ✅ |
| 18 | PR #13 aceito, ajustes e o vault do Obsidian | [18-analise-pr13.md](18-analise-pr13.md) | ✅ |
| 19 | Auditoria do código, métricas de mercado e backtest | [19-auditoria-codigo.md](19-auditoria-codigo.md) | ✅ |
| 20 | Fontes territoriais: S2iD, ANEEL e CUB oficial | [20-fontes-territoriais.md](20-fontes-territoriais.md) | ✅ |
| 21 | Pós-mentoria: motivo 2.0, média regional, gerente como último recurso e APIs ao vivo | [21-motivo-e-jornada.md](21-motivo-e-jornada.md) | ✅ |
| 22 | Renda liberada depois da mentoria do BB (RN-07 revisada, D-08) | [22-renda-liberada.md](22-renda-liberada.md) | ✅ |
| 23 | Perguntas obrigatórias × opcionais, sugestões P1 e o projeto inteiro no vault | [23-perguntas-e-documentacao.md](23-perguntas-e-documentacao.md) | ✅ |
| 24 | Críticas em papel de banca: o que corrigimos | [24-criticas-da-banca.md](24-criticas-da-banca.md) | ✅ |
| 25 | Recomendação por necessidades e documentação completa | [25-recomendacao-por-necessidades.md](25-recomendacao-por-necessidades.md) | ✅ |
| 26 | A assertividade de cada cálculo e o motivo feito para você | [26-assertividade-e-motivo.md](26-assertividade-e-motivo.md) | ✅ |
| 27 | Sinistros da BB fora e o motor sem as fontes externas | [27-sinistros-fora-e-fontes.md](27-sinistros-fora-e-fontes.md) | ✅ |
| 28 | Demo do vídeo: o app e a planilha do motor, lado a lado | [28-demo-app-e-planilha.md](28-demo-app-e-planilha.md) | ✅ |
| 29 | QA final e organização para a entrega | [29-qa-final-e-entrega.md](29-qa-final-e-entrega.md) | ✅ |
| 90 | Revisão do time (comece por aqui amanhã) | [90-revisao.md](90-revisao.md) | 📋 para revisar |

## Onde está cada coisa
| Pasta | O que tem |
|---|---|
| `motor/` | O código que gera as planilhas; `parametros.py` guarda todas as premissas |
| `motor/externos/` | As fontes externas salvas (SINAPI, CUB, IPCA, FipeZAP) e o `FONTES.md` |
| `tests/` | Os testes (`pytest`) |
| `entrega/` | As planilhas finais para entregar |
| `prototipos/` | Os protótipos das jornadas (a base é `indexprototipo_gerente.html`) |
| `documentos/` | Guia, pesquisa, planos, slides e estes documentos de contexto |
| `dados/` | As bases da organização (dados fictícios) |
| `referencias/fontes/` | Os PDFs originais das fontes |
| `obsidian/` | O vault do Obsidian do time: notas, regras, pitch e a especificação do app v2 (abra a pasta `obsidian/` no Obsidian) |

## Como trabalhamos no GitHub
- **Commits organizados direto na `main`**, um por etapa, sempre junto com o documento de contexto da etapa.
- **`main` sempre funciona.** Os testes rodam sozinhos a cada envio (GitHub Actions).
- **Commits:** `feat:` novidade · `fix:` correção · `docs:` documento · `data:` fonte de dados · `test:` teste.
- **Marcos:** tag `v1-planilhas` (as 2 planilhas completas) e `entrega` (versão final).
