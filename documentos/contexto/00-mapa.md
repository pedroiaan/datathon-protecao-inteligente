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
| 11 | T2 · Imóvel e bens | [11-t2-imovel-e-bens.md](11-t2-imovel-e-bens.md) | ⏳ |
| 12 | T3 · Elegibilidade, plano e coberturas | [12-t3-plano-e-coberturas.md](12-t3-plano-e-coberturas.md) | ⏳ |
| 13 | T4 · Validação e planilhas v1 | [13-t4-planilhas-v1.md](13-t4-planilhas-v1.md) | ⏳ |
| 14 | T5 e T6 · Confiança, testes, métricas e casos | [14-t5-t6-provas.md](14-t5-t6-provas.md) | ⏳ |
| 15 | T7 · Demo lendo o motor | [15-t7-demo.md](15-t7-demo.md) | ⏳ |
| 90 | Revisão do time | [90-revisao.md](90-revisao.md) | ⏳ |

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

## Como trabalhamos no GitHub
- **Uma tarefa = um branch = um pull request**, com o documento de contexto da etapa junto.
- **`main` sempre funciona.** Os testes rodam sozinhos a cada envio (GitHub Actions).
- **Commits:** `feat:` novidade · `fix:` correção · `docs:` documento · `data:` fonte de dados · `test:` teste.
- **Marcos:** tag `v1-planilhas` (as 2 planilhas completas) e `entrega` (versão final).
