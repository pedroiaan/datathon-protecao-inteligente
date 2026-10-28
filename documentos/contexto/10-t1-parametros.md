# 10 · T1 · Parâmetros e fontes no motor

**Em uma frase:** o motor passou a ler as fontes oficiais salvas no projeto e perdeu qualquer parâmetro que use renda.

**Onde estamos:** Fase 1 · Tarefa T1 do [`PLANO_UNIFICADO.md`](../PLANO_UNIFICADO.md) · issue #1

## O que fizemos
- `motor/parametros.py` agora lê `motor/externos/`:
  - `custo_m2(uf)` devolve **(SINAPI, CUB)**, o mínimo e o máximo do custo de reconstrução por m²;
  - `FATOR_IPCA` = **1,0694**, calculado do CSV do Banco Central;
  - `aluguel_m2(uf)` vem do FipeZAP de set/2026.
- **Limites do produto** (`LIMITES_PRODUTO`), tirados das prints do app. Exemplo: incêndio mínimo de R$ 100 mil.
- **Saíram os parâmetros de renda.** A escolha do plano não tem mais o "freio" de orçamento, e a responsabilidade civil não escala mais pela renda.
- **`motor/externos/coletar.py`:** atualiza o IPCA pela API do Banco Central quando alguém quiser. O motor nunca chama esse script.
- **Testes** (`tests/test_motor.py`) e **automação no GitHub** (`.github/workflows/testes.yml`): a cada envio, o GitHub roda os testes e gera as 138 planilhas.
- `requirements.txt` e `.python-version` (3.11).

## Por que importa
- **Critério da banca:** uso inteligente dos dados (15%), com fontes oficiais documentadas; privacidade e responsabilidade (10%), sem renda como atalho.
- **No pitch:** "cada número tem fonte oficial".

## O que você precisa entender
- **Fonte salva × API ao vivo:** o motor lê arquivos do próprio projeto. Se a internet cair na hora da banca, nada quebra, e o resultado é sempre o mesmo. As APIs só servem para **atualizar** esses arquivos.
- **Valor neutro:** se faltar uma fonte (por exemplo, uma UF fora da tabela), o motor usa um valor neutro (R$ 2.100 a 2.500/m²). A confiança daquela faixa deve cair, e isso é ligado na T5.
- **Constantes "legado":** algumas constantes antigas ficaram no fim do arquivo, só para o motor continuar rodando até a T2 e a T3 as substituírem.

## Decisões e o que descartamos
| Decidimos | Em vez de | Porque |
|---|---|---|
| Tirar a renda de tudo | Usar a renda como "freio" do plano | O guia proíbe atributos pessoais como atalho; a escolha passa a usar só sinais do imóvel |
| Aluguel por UF (as 10 cidades são capitais) | Por município | Mais simples e equivalente nesta base |

## Como conferir
```bash
python -m pytest -q
python motor/gerar.py
```
Resultado esperado: 5 testes passando e "casos": 138.

## Pendências e riscos
- Sem o freio da renda, o **Total subiu para 82 de 138 casos**. A tabela de pontos da T3 reequilibra.
- **6 valores de CUB** ainda estão marcados `validar` (issue #11).

## Frase para o pitch
> "Nenhuma decisão do nosso motor usa renda ou idade. E nós provamos isso com teste."

## Próximo passo
- [11 · T2 Imóvel e bens](11-t2-imovel-e-bens.md)
