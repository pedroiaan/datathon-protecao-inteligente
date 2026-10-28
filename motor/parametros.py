"""Parâmetros do motor.

Toda premissa numérica fica aqui, separada da lógica, com a origem escrita ao
lado: cláusula das Condições Gerais (CG v1.4), print do app atual, fonte externa
(motor/externos/FONTES.md) ou "premissa do time".

Regra do projeto: renda, idade, dependentes e pet NÃO entram em nenhum parâmetro
de decisão (guardrail do guia; RN-07).
"""
import csv
from functools import lru_cache
from pathlib import Path

EXTERNOS = Path(__file__).resolve().parent / "externos"


def _ler_csv(nome):
    caminho = EXTERNOS / nome
    if not caminho.exists():
        return []
    with open(caminho, encoding="utf-8") as f:
        return list(csv.DictReader(f))


# --- Custo de reconstrução (R$/m²) --------------------------------------------
# Mínimo: SINAPI ago/2026 sem desoneração (IBGE). Máximo: CUB R8-N (Sinduscons).
CUSTO_M2_NEUTRO = (2100.0, 2500.0)  # usado se a UF não estiver nas tabelas


@lru_cache(maxsize=None)
def _tabela_custo():
    sinapi = {l["uf"]: float(l["sinapi_m2_sem_desoneracao"]) for l in _ler_csv("sinapi_uf.csv")}
    cub = {l["uf"]: float(l["cub_r8n_m2"]) for l in _ler_csv("cub_uf.csv")}
    return sinapi, cub


def custo_m2(uf):
    """(mínimo SINAPI, máximo CUB) em R$/m² para a UF; neutro se faltar a fonte."""
    sinapi, cub = _tabela_custo()
    lo, hi = sinapi.get(uf), cub.get(uf)
    if lo is None or hi is None:
        return CUSTO_M2_NEUTRO
    return (min(lo, hi), max(lo, hi))


def fonte_disponivel(uf):
    sinapi, cub = _tabela_custo()
    return uf in sinapi and uf in cub


# Ajuste pelo padrão construtivo cadastrado (premissa do time).
FATOR_PADRAO = {"ECONOMICO": 0.85, "NORMAL": 1.0, "SUPERIOR": 1.30, "NAO_DISPONIVEL": 1.0}

# Segundo risco (CG cl. 15.2): apartamento, casa em condomínio ou imóvel financiado.
# A estrutura é paga primeiro pelo seguro do condomínio/financiamento; o residencial
# cobre acabamentos e benfeitorias. Para desligar a regra, use (1.0, 1.0).
FRACAO_ACABAMENTOS = (0.25, 0.40)


# --- IPCA: compras de 36 meses a preço de hoje ---------------------------------
@lru_cache(maxsize=None)
def _ipca_12m():
    linhas = _ler_csv("ipca_mensal.csv")
    if not linhas:
        return 0.0
    fator = 1.0
    for l in linhas[-12:]:
        fator *= 1 + float(l["variacao_mensal_pct"]) / 100
    return fator - 1


IPCA_12M = _ipca_12m()
FATOR_IPCA = (1 + IPCA_12M) ** 1.5  # meio da janela de 36 meses = 18 meses


# --- Aluguel de mercado (FipeZAP set/2026) -------------------------------------
@lru_cache(maxsize=None)
def _tabela_aluguel():
    return {l["uf"]: float(l["aluguel_m2"]) for l in _ler_csv("fipezap_aluguel.csv")}


def aluguel_m2(uf):
    """R$/m² de aluguel na capital da UF (as 10 cidades da base são capitais); None se faltar."""
    return _tabela_aluguel().get(uf)


# --- Bens (três âncoras) -------------------------------------------------------
FATOR_ESTOQUE = 2.7   # estoque ≈ compras/ano × vida útil (~8 anos) = 2,7 × compras de 36 meses (premissa)
BENS_PISO = 15000     # cesta mínima de uma casa quando não há compras nem bens (premissa)

# --- Limites do produto (prints do app atual; máximos sem print são premissa) ---
LIMITES_PRODUTO = {
    "INCENDIO_RAIO_EXPLOSAO_FUMACA": (100000, 600000),
    "DANOS_POR_AGUA": (3000, 50000),
    "VENDAVAL_GRANIZO": (1000, 60000),
    "IMPACTO_VEICULOS_TERRESTRES": (1000, 20000),
    "QUEDA_AERONAVE": (1000, 20000),
    "DANOS_ELETRICOS": (5000, 30000),
    "ROUBO_FURTO_ARROMBAMENTO": (1000, 45000),
    "QUEBRA_DE_VIDROS": (1000, 25000),
    "RESPONSABILIDADE_CIVIL_FAMILIAR": (10000, 200000),
    "PERDA_PAGAMENTO_ALUGUEL": (5000, 30000),
    "DESPESAS_EMERGENCIAIS": (2000, 15000),
}
MESES_PERDA_ALUGUEL = (6, 12)

# --- Elegibilidade, plano e canal ----------------------------------------------
OBRA_LIMIAR_CONFIRMAR = 15000   # gasto em material de construção (24 meses) que pede confirmação
BENS_RELEVANTES = 25000         # bens totais a partir dos quais roubo pesa (Prático +2)
PORTATEIS_RELEVANTES = 8000     # eletrônicos a partir dos quais roubo pesa (Prático +1)
MATURIDADE_MIN_ONE_CLICK = 40   # comportamento digital, não atributo pessoal

# --- Confiança e perguntas ------------------------------------------------------
PESO_FONTE = {"CONFIRMADO": 1.0, "DOCUMENTO": 0.9, "TRANSACAO": 0.8, "INFERIDO": 0.6, "PRESUMIDO": 0.5}
MEIA_VIDA_MESES = {"vinculo": 12, "area": 120, "bens": 36, "uso": 12, "tipo": 120}
PESO_CONFIANCA = {"ALTA": 1.0, "MEDIA": 0.6, "BAIXA": 0.3}
MAX_PERGUNTAS = 3

# --- Legado do rascunho (substituídos na T2/T3) --------------------------------
FATOR_COMPRAS_NO_IMOVEL = (0.55, 0.85)
CONTEUDO_MINIMO = 10000
CONTEUDO_RELEVANTE = BENS_RELEVANTES
LIMITES_COBERTURA = LIMITES_PRODUTO
PROP = {
    "DANOS_POR_AGUA": ("incendio", 0.05, 0.15),
    "VENDAVAL_GRANIZO_CASA": ("incendio", 0.15, 0.30),
    "VENDAVAL_GRANIZO_APTO": ("incendio", 0.05, 0.15),
    "IMPACTO_VEICULOS_CASA": ("incendio", 0.05, 0.15),
    "IMPACTO_VEICULOS_APTO": ("incendio", 0.02, 0.06),
    "QUEDA_AERONAVE": ("incendio", 0.10, 0.25),
    "DESPESAS_EMERGENCIAIS": ("incendio", 0.03, 0.08),
}
ALUGUEL_ESTIMADO_MES = (0.004, 0.005)
