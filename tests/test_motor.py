"""Testes do motor. Cada bloco corresponde a uma tarefa do PLANO_UNIFICADO.md."""
import parametros as P


# --- T1: parâmetros e fontes ----------------------------------------------------
def test_custo_m2_pr():
    assert P.custo_m2("PR") == (2287.42, 2738.93)


def test_custo_m2_uf_desconhecida_usa_neutro():
    assert P.custo_m2("XX") == P.CUSTO_M2_NEUTRO


def test_fator_ipca():
    assert 1.06 < P.FATOR_IPCA < 1.08


def test_aluguel_m2_curitiba():
    assert P.aluguel_m2("PR") == 49.44


def test_sem_parametro_de_renda():
    assert not [n for n in dir(P) if "RENDA" in n.upper()]
