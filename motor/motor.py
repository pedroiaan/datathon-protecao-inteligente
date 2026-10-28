"""Motor de recomendação do Seguro Residencial — RASCUNHO (spike).

Regras explicáveis, sem ML. Para cada cliente-imóvel gera uma "ficha" com:
dados inferidos (com natureza e confiança), elegibilidade, plano, motivos,
alternativa, coberturas com faixa mín/máx, perguntas e canal sugerido.
A mesma ficha alimenta os CSVs da entrega, a tela do cliente e a do gerente.
"""
import json
import zipfile
from pathlib import Path

import numpy as np
import pandas as pd

import parametros as P

TABELAS = ["clientes", "enderecos_imoveis", "sinais_imobiliarios", "bens_compras", "territorio"]


def carregar(origem):
    """Lê as tabelas de uma pasta ou direto de um .zip do pacote."""
    origem = Path(origem)
    if origem.suffix == ".zip":
        with zipfile.ZipFile(origem) as z:
            dados = {t: pd.read_csv(z.open(f"{t}.csv"), encoding="utf-8-sig") for t in TABELAS}
            dados["template"] = pd.read_csv(z.open("template_resultado_times.csv"), encoding="utf-8-sig")
            dados["catalogo"] = pd.read_csv(z.open("catalogo_coberturas_fixas_planos.csv"), encoding="utf-8-sig")
        return dados
    dados = {t: pd.read_csv(origem / f"{t}.csv", encoding="utf-8-sig") for t in TABELAS}
    dados["template"] = pd.read_csv(origem / "template_resultado_times.csv", encoding="utf-8-sig")
    dados["catalogo"] = pd.read_csv(origem / "catalogo_coberturas_fixas_planos.csv", encoding="utf-8-sig")
    return dados


# --- Calibração (roda na base de desenvolvimento) -----------------------------

def calibrar(dados):
    """Aprende R$ de IPTU e de energia por m² por município, nos imóveis com área
    cadastrada, e o erro típico da estimativa para montar a faixa."""
    m = dados["enderecos_imoveis"].merge(dados["sinais_imobiliarios"], on=["imovel_id", "cliente_id"])
    a = m[m.area_cadastrada_m2 > 0].copy()
    a["iptu_m2"] = a.pagamento_iptu_anual / a.area_cadastrada_m2
    a["energia_m2"] = a.energia_media_mensal_6m / a.area_cadastrada_m2
    por_mun = a.groupby("codigo_ibge_municipio")[["iptu_m2", "energia_m2"]].median()
    geral = a[["iptu_m2", "energia_m2"]].median()
    cal = {
        "iptu_m2": {str(k): v for k, v in por_mun.iptu_m2.items()},
        "energia_m2": {str(k): v for k, v in por_mun.energia_m2.items()},
        "iptu_m2_geral": geral.iptu_m2,
        "energia_m2_geral": geral.energia_m2,
    }
    est = a.apply(lambda r: _area_estimada(r, cal), axis=1)
    razao = a.area_cadastrada_m2 / est
    cal["razao_q10"], cal["razao_q90"] = float(razao.quantile(0.10)), float(razao.quantile(0.90))
    cal["erro_mediano_m2"] = float((a.area_cadastrada_m2 - est).abs().median())
    cal["n_calibracao"] = int(len(a))
    return cal


def _area_estimada(r, cal):
    k = str(r.codigo_ibge_municipio)
    por_iptu = r.pagamento_iptu_anual / cal["iptu_m2"].get(k, cal["iptu_m2_geral"])
    por_energia = r.energia_media_mensal_6m / cal["energia_m2"].get(k, cal["energia_m2_geral"])
    return 0.6 * por_iptu + 0.4 * por_energia


# --- Utilidades ----------------------------------------------------------------

def dado(valor, natureza, confianca, fonte):
    return {"valor": valor, "natureza": natureza, "confianca": confianca, "fonte": fonte}


def arred(v):
    passo = 500 if v < 20000 else 1000
    return int(round(v / passo) * passo)


def faixa(lo, hi, cob):
    piso, teto = P.LIMITES_COBERTURA.get(cob, (0, float("inf")))
    lo, hi = max(piso, min(lo, teto)), max(piso, min(hi, teto))
    lo, hi = arred(min(lo, hi)), arred(max(lo, hi))
    return lo, max(hi, lo)


def pior(*confs):
    ordem = ["BAIXA", "MEDIA", "ALTA"]
    return min(confs, key=ordem.index)


def brl(v):
    return f"R$ {v:,.0f}".replace(",", ".")


# --- Inferências sobre o imóvel ------------------------------------------------

def inferir_tipo(r):
    if r.possui_termo_apartamento == "SIM":
        return dado("APARTAMENTO", "INFERIDO", "ALTA", "termo 'apartamento' no endereço")
    if r.possui_termo_condominio == "SIM":
        conf = "ALTA" if r.pagamento_condominio_mensal > 0 else "MEDIA"
        return dado("CASA_EM_CONDOMINIO", "INFERIDO", conf, "termos 'casa' + 'condomínio' no endereço e pagamento de condomínio")
    return dado("CASA", "INFERIDO", "ALTA", "termo 'casa' no endereço, sem condomínio")


def inferir_vinculo(r):
    if r.pagamento_aluguel_recorrente == "SIM":
        return dado("INQUILINO", "OBSERVADO", "ALTA", f"aluguel recorrente de {brl(r.valor_aluguel_recorrente)}/mês")
    if r.parcela_financiamento_imobiliario > 0:
        return dado("FINANCIADO", "OBSERVADO", "ALTA", f"parcela de financiamento de {brl(r.parcela_financiamento_imobiliario)}/mês")
    if r.credito_recorrente_compativel_aluguel == "SIM" and r.endereco_principal_compativel == "NAO":
        return dado("PROPRIETARIO_LOCADOR", "INFERIDO", "MEDIA", f"recebe crédito recorrente compatível com aluguel ({brl(r.valor_medio_credito_recorrente)}/mês)")
    return dado("PROPRIETARIO", "INFERIDO", "MEDIA", "sem aluguel pago nem financiamento: provável imóvel quitado")


def inferir_uso(r, outro_principal):
    if r.endereco_principal_compativel == "SIM":
        return dado("RESIDENCIAL_HABITUAL", "OBSERVADO", "ALTA", "endereço compatível com o endereço principal do cliente")
    if r.credito_recorrente_compativel_aluguel == "SIM":
        return dado("RESIDENCIAL_LOCADO_A_TERCEIROS", "INFERIDO", "MEDIA", "não é o endereço principal e há crédito de aluguel")
    if outro_principal:
        return dado("LAZER_VERANEIO", "INFERIDO", "BAIXA", "cliente mora em outro imóvel cadastrado")
    return dado("RESIDENCIAL_HABITUAL", "INFERIDO", "BAIXA", "único imóvel, mas endereço não bate com o principal (cadastro desatualizado?)")


def inferir_area(r, cal):
    if r.area_cadastrada_m2 > 0:
        a = float(r.area_cadastrada_m2)
        d = dado(round(a), "OBSERVADO", "ALTA", f"área cadastrada ({r.origem_area})")
        d["min"], d["max"] = a, a
        return d
    a = _area_estimada(r, cal)
    d = dado(round(a), "ESTIMADO", "MEDIA",
             f"estimada pelo IPTU ({brl(r.pagamento_iptu_anual)}/ano) e energia ({brl(r.energia_media_mensal_6m)}/mês) "
             f"comparados a imóveis de {r.municipio_real}")
    d["min"], d["max"] = a * cal["razao_q10"], a * cal["razao_q90"]
    return d


def inferir_conteudo(r, bens):
    """Conteúdo pelo cruzamento de duas fontes: bens vinculados (ponderados pela
    probabilidade de estarem no imóvel) e compras de 36 meses."""
    pond = bens.valor_bem_ponderado_referencia.sum()
    total_bens = bens.valor_cadastrado.sum()
    compras = r.compras_moveis_36m + r.compras_eletrodomesticos_36m + r.compras_eletronicos_36m
    c_lo, c_hi = compras * P.FATOR_COMPRAS_NO_IMOVEL[0], compras * P.FATOR_COMPRAS_NO_IMOVEL[1]
    lo = max(P.CONTEUDO_MINIMO, min(pond, c_lo))
    hi = max(lo, max(total_bens, c_hi))
    alta = bens.loc[bens.nivel_confianca_vinculo == "ALTA", "valor_cadastrado"].sum()
    conf = "MEDIA" if total_bens and alta / total_bens >= 0.6 else "BAIXA"
    d = dado(arred((lo + hi) / 2), "ESTIMADO", conf,
             f"{len(bens)} bens vinculados ({brl(pond)} ponderado pela chance de estarem no imóvel) "
             f"e {brl(compras)} em compras de móveis/eletro nos últimos 36 meses")
    d["min"], d["max"] = lo, hi
    eletro_bens = bens.loc[bens.tipo_bem.isin(["ELETRONICO", "ELETRODOMESTICO"]), "valor_bem_ponderado_referencia"].sum()
    eletro_compras = r.compras_eletrodomesticos_36m + r.compras_eletronicos_36m
    d["eletro_min"] = min(eletro_bens, eletro_compras * P.FATOR_COMPRAS_NO_IMOVEL[0])
    d["eletro_max"] = max(eletro_bens, eletro_compras * P.FATOR_COMPRAS_NO_IMOVEL[1])
    return d


def valor_imovel(r, tipo, area):
    cub = P.custo_m2(r.uf_real)[1] * P.FATOR_PADRAO.get(r.padrao_construtivo_cadastrado, 1.0)
    cheio = (area["min"] * cub, area["max"] * cub)
    if tipo["valor"] == "APARTAMENTO":
        f_lo, f_hi = P.FRACAO_ACABAMENTOS
        segurado = (cheio[0] * f_lo, cheio[1] * f_hi)
    else:
        segurado = cheio
    return {"cub_m2": cub, "cheio": cheio, "segurado": segurado}


# --- Elegibilidade -------------------------------------------------------------

def avaliar_elegibilidade(r):
    pendencias = []
    if r.gastos_material_construcao_24m >= P.OBRA_LIMIAR_CONFIRMAR:
        pendencias.append({
            "codigo": "POSSIVEL_REFORMA",
            "texto": f"gastos de {brl(r.gastos_material_construcao_24m)} em material de construção em 24 meses podem indicar reforma (imóvel em reforma não é aceito)",
            "pergunta": f"Notamos {brl(r.gastos_material_construcao_24m)} em material de construção nos últimos 2 anos. O imóvel está em obra ou reforma agora?",
        })
    if r.possui_seguro_residencial == "SIM":
        pendencias.append({
            "codigo": "SEGURO_EXISTENTE",
            "texto": "cliente já possui seguro residencial; não pode haver duas propostas BB para o mesmo endereço",
            "pergunta": "Você já tem seguro residencial da BB Seguros para este endereço?",
        })
    situacao = "CONDICIONAL" if pendencias else "SIM"
    return situacao, pendencias


# --- Plano ---------------------------------------------------------------------

def escolher_plano(r, tipo, vinculo, uso, conteudo):
    motivos = [{"plano": "ESSENCIAL", "peso": 0, "codigo": "BASE",
                "texto": "as coberturas básicas protegem estrutura e bens contra incêndio, água, vento e danos elétricos"}]
    pratico, total = 0, 0

    if conteudo["valor"] >= P.CONTEUDO_RELEVANTE:
        pratico += 2
        motivos.append({"plano": "PRATICO", "peso": 2, "codigo": "CONTEUDO_ALTO",
                        "texto": f"seus bens são estimados em cerca de {brl(conteudo['valor'])}, e proteção contra roubo passa a fazer diferença"})
    elif conteudo["valor"] >= 15000:
        pratico += 1
        motivos.append({"plano": "PRATICO", "peso": 1, "codigo": "CONTEUDO_MEDIO",
                        "texto": f"bens estimados em cerca de {brl(conteudo['valor'])}"})
    if tipo["valor"] == "CASA":
        pratico += 1
        motivos.append({"plano": "PRATICO", "peso": 1, "codigo": "CASA_SEM_CONDOMINIO",
                        "texto": "casa fora de condomínio tem mais exposição a arrombamento"})
    if uso["valor"] == "LAZER_VERANEIO":
        pratico += 1
        motivos.append({"plano": "PRATICO", "peso": 1, "codigo": "IMOVEL_DESOCUPADO",
                        "texto": "imóvel de veraneio fica vazio boa parte do tempo"})
    if r.gastos_vidracaria_24m > 0:
        pratico += 1
        motivos.append({"plano": "PRATICO", "peso": 1, "codigo": "VIDROS",
                        "texto": f"gastos recentes com vidraçaria ({brl(r.gastos_vidracaria_24m)}) indicam vidros relevantes no imóvel"})

    if vinculo["valor"] == "INQUILINO":
        total += 2
        motivos.append({"plano": "TOTAL", "peso": 2, "codigo": "INQUILINO",
                        "texto": f"se o imóvel ficar inabitável, você continua pagando {brl(r.valor_aluguel_recorrente)} de aluguel"})
    elif vinculo["valor"] == "PROPRIETARIO_LOCADOR":
        total += 2
        motivos.append({"plano": "TOTAL", "peso": 2, "codigo": "RENDA_ALUGUEL",
                        "texto": f"o imóvel gera cerca de {brl(r.valor_medio_credito_recorrente)}/mês de aluguel, que pode ser perdido após um sinistro"})
    elif vinculo["valor"] == "FINANCIADO":
        total += 1
        motivos.append({"plano": "TOTAL", "peso": 1, "codigo": "FINANCIADO",
                        "texto": f"a parcela de {brl(r.parcela_financiamento_imobiliario)} continua mesmo se precisar morar em outro lugar"})
    if r.quantidade_dependentes > 0:
        total += 1
        motivos.append({"plano": "TOTAL", "peso": 1, "codigo": "DEPENDENTES",
                        "texto": f"{r.quantidade_dependentes} dependente(s): responsabilidade civil familiar cobre danos causados a terceiros"})
    if r.possui_pet_informado == "SIM":
        total += 1
        motivos.append({"plano": "TOTAL", "peso": 1, "codigo": "PET",
                        "texto": "pet informado: responsabilidade civil cobre danos que ele cause a vizinhos"})

    plano = "ESSENCIAL"
    if pratico >= 2 or total >= 2:
        plano = "PRATICO"
    if total >= 2:
        plano = "TOTAL"
    ideal = plano
    adicionais = []

    alternativa = _alternativa(plano, ideal)
    return plano, motivos, {"pratico": pratico, "total": total}, adicionais, alternativa


def _alternativa(plano, ideal):
    if ideal != plano:
        nome = {"PRATICO": "Prático", "TOTAL": "Total"}[ideal]
        return {"plano": ideal, "texto": f"{nome}: proteção mais completa, indicada pelo seu perfil, se o orçamento permitir"}
    return {
        "ESSENCIAL": {"plano": "PRATICO", "texto": "Prático: acrescenta roubo/furto e quebra de vidros"},
        "PRATICO": {"plano": "TOTAL", "texto": "Total: acrescenta perda de aluguel, responsabilidade civil e despesas emergenciais"},
        "TOTAL": {"plano": "PRATICO", "texto": "Prático: mais barato, sem perda de aluguel nem responsabilidade civil"},
    }[plano]


# --- Coberturas ----------------------------------------------------------------

def dimensionar(cob, r, tipo, vinculo, area, conteudo, imovel):
    apto = tipo["valor"] == "APARTAMENTO"
    inc_lo = imovel["segurado"][0] + conteudo["min"]
    inc_hi = imovel["segurado"][1] + conteudo["max"]
    c_area, c_cont = area["confianca"], conteudo["confianca"]
    obs = ""
    if vinculo["valor"] == "INQUILINO":
        obs = "Imóvel alugado: indicar beneficiários distintos (locador para o imóvel, locatário para o conteúdo)."

    def prop(chave):
        _, a, b = P.PROP[chave]
        return inc_lo * a, inc_hi * b

    if cob == "INCENDIO_RAIO_EXPLOSAO_FUMACA":
        lo, hi = faixa(inc_lo, inc_hi, cob)
        regra = (f"área ({area['min']:.0f}–{area['max']:.0f} m²) × custo de reconstrução {brl(imovel['cub_m2'])}/m²"
                 + (" × fração da estrutura do apartamento" if apto else "") + " + conteúdo estimado")
        return lo, hi, pior(c_area, c_cont), "área, IPTU, energia, UF, padrão, bens, compras 36m", regra, \
            "Cobertura principal: reconstruir o imóvel e repor os bens.", "Área do imóvel e valor dos bens", obs
    if cob == "DANOS_POR_AGUA":
        lo, hi = faixa(*prop("DANOS_POR_AGUA"), cob)
        return lo, hi, pior(c_area, c_cont), "faixa de incêndio", "5% a 15% da faixa de incêndio", \
            "Vazamentos e rompimentos danificam acabamentos e bens, não o imóvel inteiro.", "", ""
    if cob == "VENDAVAL_GRANIZO":
        lo, hi = faixa(*prop("VENDAVAL_GRANIZO_APTO" if apto else "VENDAVAL_GRANIZO_CASA"), cob)
        return lo, hi, pior(c_area, c_cont), "faixa de incêndio, tipo do imóvel", \
            ("5% a 15%" if apto else "15% a 30%") + " da faixa de incêndio", \
            "Casa expõe telhado e fachada; apartamento expõe sobretudo janelas.", "", ""
    if cob == "IMPACTO_VEICULOS_TERRESTRES":
        lo, hi = faixa(*prop("IMPACTO_VEICULOS_APTO" if apto else "IMPACTO_VEICULOS_CASA"), cob)
        return lo, hi, pior(c_area, c_cont), "faixa de incêndio, tipo do imóvel", \
            ("2% a 6%" if apto else "5% a 15%") + " da faixa de incêndio", \
            "Impacto atinge muro, portão e fachada; menor em apartamento.", "", ""
    if cob == "QUEDA_AERONAVE":
        lo, hi = faixa(*prop("QUEDA_AERONAVE"), cob)
        return lo, hi, pior(c_area, c_cont), "faixa de incêndio", "10% a 25% da faixa de incêndio", \
            "Evento raro; faixa proporcional ao valor protegido.", "", ""
    if cob == "DANOS_ELETRICOS":
        lo, hi = faixa(conteudo["eletro_min"], conteudo["eletro_max"], cob)
        return lo, hi, c_cont, "bens eletrônicos/eletrodomésticos, compras 36m", \
            "valor ponderado de eletrônicos e eletrodomésticos vs. compras dessas categorias", \
            "Picos de energia atingem eletrônicos e eletrodomésticos.", "Principais aparelhos da casa", ""
    if cob == "ROUBO_FURTO_ARROMBAMENTO":
        lo, hi = faixa(conteudo["min"] * 0.6, conteudo["max"], cob)
        return lo, hi, c_cont, "bens vinculados, compras 36m", "60% do conteúdo mínimo a 100% do conteúdo máximo", \
            "Repor bens levados em arrombamento, a valor de reposição.", "Bens de maior valor (notebook, TV, bicicleta)", ""
    if cob == "QUEBRA_DE_VIDROS":
        base = (2000, 5000) if apto else (3000, 8000)
        hi = max(base[1], r.gastos_vidracaria_24m * 1.2)
        lo, hi = faixa(base[0], hi, cob)
        return lo, hi, "MEDIA" if r.gastos_vidracaria_24m > 0 else "BAIXA", "tipo do imóvel, gastos com vidraçaria 24m", \
            "faixa de referência por tipo, ampliada pelos gastos com vidraçaria", \
            "Janelas, box e tampos de vidro.", "Há vidros grandes (sacada, box, fachada)?", ""
    if cob == "RESPONSABILIDADE_CIVIL_FAMILIAR":
        base = 30000 + 15000 * r.quantidade_dependentes + (10000 if r.possui_pet_informado == "SIM" else 0)
        lo, hi = faixa(base, base * 2, cob)
        return lo, hi, "MEDIA", "dependentes, pet", "R$ 30 mil + R$ 15 mil por dependente + R$ 10 mil se pet; máximo = 2 × mínimo", \
            "Danos que a família ou o pet causem a terceiros.", "", ""
    if cob == "PERDA_PAGAMENTO_ALUGUEL":
        m_lo, m_hi = P.MESES_PERDA_ALUGUEL
        if vinculo["valor"] == "INQUILINO":
            mensal, conf, fonte = (r.valor_aluguel_recorrente,) * 2, "ALTA", "aluguel pago"
        elif vinculo["valor"] == "PROPRIETARIO_LOCADOR":
            mensal, conf, fonte = (r.valor_medio_credito_recorrente,) * 2, "MEDIA", "aluguel recebido"
        else:
            mensal = (imovel["cheio"][0] * P.ALUGUEL_ESTIMADO_MES[0], imovel["cheio"][1] * P.ALUGUEL_ESTIMADO_MES[1])
            conf, fonte = "BAIXA", "aluguel estimado em 0,4%–0,5% do valor do imóvel"
        lo, hi = faixa(mensal[0] * m_lo, mensal[1] * m_hi, cob)
        return lo, hi, conf, fonte, f"aluguel mensal × {m_lo} a {m_hi} meses", \
            "Pagar moradia provisória (ou repor o aluguel perdido) enquanto o imóvel é reparado.", \
            "" if conf == "ALTA" else "Valor de aluguel de um imóvel equivalente", ""
    if cob == "DESPESAS_EMERGENCIAIS":
        lo, hi = faixa(*prop("DESPESAS_EMERGENCIAIS"), cob)
        return lo, hi, pior(c_area, c_cont), "faixa de incêndio", "3% a 8% da faixa de incêndio", \
            "Medidas urgentes para evitar que o dano aumente.", "", ""
    raise ValueError(cob)


# --- Perguntas e confiança -----------------------------------------------------

def montar_perguntas(r, pendencias, uso, vinculo, area, conteudo):
    cand = [(100, p["pergunta"], p["codigo"]) for p in pendencias]
    if uso["confianca"] == "BAIXA":
        cand.append((70, "Este imóvel é onde você mora, uma casa de veraneio ou está alugado para outra pessoa?", "USO"))
    if r.credito_recorrente_compativel_aluguel == "SIM" and vinculo["valor"] != "PROPRIETARIO_LOCADOR":
        cand.append((60, "Você recebe aluguel referente a este imóvel?", "RECEBE_ALUGUEL"))
    if area["natureza"] == "ESTIMADO":
        cand.append((50, f"Estimamos que o imóvel tem cerca de {area['valor']} m². Confere?", "AREA"))
    if conteudo["confianca"] == "BAIXA":
        cand.append((40, f"Seus móveis e eletrônicos valem por volta de {brl(conteudo['valor'])}?", "CONTEUDO"))
    if vinculo["valor"] == "PROPRIETARIO":
        cand.append((30, "O imóvel é seu e já está quitado?", "VINCULO"))
    cand.sort(key=lambda x: -x[0])
    return [{"prioridade": p, "texto": t, "codigo": c} for p, t, c in cand[:P.MAX_PERGUNTAS]], len(cand)


def confianca_geral(campos, elegibilidade):
    pesos = {"tipo": 1, "vinculo": 1, "uso": 1, "area": 2, "conteudo": 2}
    score = sum(pesos[k] * P.PESO_CONFIANCA[campos[k]["confianca"]] for k in pesos) / sum(pesos.values())
    score = round(score * 100)
    nivel = "ALTA" if score >= 80 else "MEDIA" if score >= 55 else "BAIXA"
    if elegibilidade != "SIM" and nivel == "ALTA":
        nivel = "MEDIA"
    return nivel, score


# --- Orquestração --------------------------------------------------------------

def processar(dados, cal):
    c, e, s, b = dados["clientes"], dados["enderecos_imoveis"], dados["sinais_imobiliarios"], dados["bens_compras"]
    m = e.merge(s, on=["imovel_id", "cliente_id"]).merge(c, on="cliente_id")
    principais = m[m.endereco_principal_compativel == "SIM"].groupby("cliente_id").imovel_id.apply(set).to_dict()
    bens_por_imovel = dict(tuple(b.groupby("imovel_id_referencia")))
    catalogo = dados["catalogo"].groupby("plano").cobertura_fixa.apply(list).to_dict()
    vazio = b.iloc[0:0]

    fichas = []
    for r in m.itertuples(index=False):
        outro_principal = bool(principais.get(r.cliente_id, set()) - {r.imovel_id})
        tipo, vinculo = inferir_tipo(r), inferir_vinculo(r)
        uso, area = inferir_uso(r, outro_principal), inferir_area(r, cal)
        conteudo = inferir_conteudo(r, bens_por_imovel.get(r.imovel_id, vazio))
        imovel = valor_imovel(r, tipo, area)
        eleg, pendencias = avaliar_elegibilidade(r)
        plano, motivos, pontos, adicionais, alternativa = escolher_plano(r, tipo, vinculo, uso, conteudo)

        coberturas = []
        for cob in catalogo[plano] + adicionais:
            lo, hi, conf, dados_u, regra, just, confirmar, obs = dimensionar(cob, r, tipo, vinculo, area, conteudo, imovel)
            coberturas.append({"cobertura": cob, "tipo": "ADICIONAL" if cob in adicionais else "FIXA",
                               "min": lo, "max": hi, "confianca": conf, "dados_utilizados": dados_u,
                               "regra": regra, "justificativa": just, "confirmar": confirmar, "observacao": obs})

        perguntas, n_cand = montar_perguntas(r, pendencias, uso, vinculo, area, conteudo)
        campos = {"tipo": tipo, "vinculo": vinculo, "uso": uso, "area": area, "conteudo": conteudo}
        nivel, score = confianca_geral(campos, eleg)
        one_click = (r.usuario_app == "SIM" and r.indice_maturidade_digital >= P.MATURIDADE_MIN_ONE_CLICK
                     and eleg == "SIM" and nivel != "BAIXA")
        fichas.append({
            "cliente_id": r.cliente_id, "imovel_id": r.imovel_id,
            "local": f"{r.municipio_real}/{r.uf_real}", "complemento": r.complemento,
            "perfil": {"idade": int(r.idade), "renda": int(r.renda_mensal), "origem_renda": r.origem_renda,
                       "dependentes": int(r.quantidade_dependentes), "pet": r.possui_pet_informado,
                       "usuario_app": r.usuario_app, "maturidade_digital": int(r.indice_maturidade_digital)},
            "campos": {k: {kk: (float(vv) if isinstance(vv, (np.floating, np.integer)) else vv) for kk, vv in v.items()}
                       for k, v in campos.items()},
            "valor_imovel": {"cub_m2": round(imovel["cub_m2"]), "min": arred(imovel["cheio"][0]), "max": arred(imovel["cheio"][1])},
            "elegibilidade": eleg, "pendencias": pendencias,
            "plano": plano, "motivos": motivos, "pontos": pontos, "alternativa": alternativa,
            "motivos_plano": separar_motivos(plano, motivos)[0], "motivos_acima": separar_motivos(plano, motivos)[1],
            "coberturas": coberturas, "perguntas": perguntas, "perguntas_candidatas": n_cand,
            "confianca": nivel, "confianca_score": score,
            "canal": "ONE_CLICK" if one_click else "GERENTE",
        })
    return fichas


ORDEM_PLANO = {"ESSENCIAL": 0, "PRATICO": 1, "TOTAL": 2}
NOME_PLANO = {"ESSENCIAL": "Essencial", "PRATICO": "Prático", "TOTAL": "Total"}


def separar_motivos(plano, motivos):
    """Motivos que sustentam o plano escolhido vs. sinais que puxariam para um plano acima."""
    a_favor = sorted([m for m in motivos if m["peso"] > 0 and ORDEM_PLANO[m["plano"]] <= ORDEM_PLANO[plano]],
                     key=lambda m: (-ORDEM_PLANO[m["plano"]], -m["peso"]))[:3]
    a_favor += [m for m in motivos if m["codigo"] == "ORCAMENTO"]
    if not a_favor:
        a_favor = [m for m in motivos if m["codigo"] == "BASE"]
    acima = [m for m in motivos if m["peso"] > 0 and ORDEM_PLANO[m["plano"]] > ORDEM_PLANO[plano]][:2]
    return a_favor, acima


def justificativa(f):
    texto = f"Plano {NOME_PLANO[f['plano']]} porque " + "; ".join(m["texto"] for m in f["motivos_plano"]) + "."
    texto += f" Alternativa: {f['alternativa']['texto']}"
    if f["motivos_acima"]:
        texto += " (pesaria a favor: " + "; ".join(m["texto"] for m in f["motivos_acima"]) + ")"
    texto += "."
    if f["pendencias"]:
        texto += " Elegibilidade a confirmar: " + "; ".join(p["texto"] for p in f["pendencias"]) + "."
    return texto


def para_templates(fichas, template):
    idx = {(f["cliente_id"], f["imovel_id"]): f for f in fichas}
    linhas = []
    for t in template.itertuples(index=False):
        f = idx[(t.cliente_id, t.imovel_id)]
        linhas.append({
            "cliente_id": f["cliente_id"], "imovel_id": f["imovel_id"],
            "elegivel": f["elegibilidade"],
            "motivo_inelegibilidade": "; ".join(p["texto"] for p in f["pendencias"]),
            "tipo_imovel_sugerido": f["campos"]["tipo"]["valor"],
            "uso_imovel_sugerido": f["campos"]["uso"]["valor"],
            "tipo_vinculo_sugerido": f["campos"]["vinculo"]["valor"],
            "plano_recomendado": f["plano"],
            "coberturas_recomendadas": "; ".join(c["cobertura"] for c in f["coberturas"]),
            "confianca_geral": f["confianca"],
            "justificativa_recomendacao": justificativa(f),
            "perguntas_confirmacao": " | ".join(p["texto"] for p in f["perguntas"]),
            "fontes_publicas_adicionais": "Custo de reconstrução por m² por UF (aproximação do CUB/Sinduscon, tabela local em parametros.py)",
        })
    resultado = pd.DataFrame(linhas, columns=template.columns)
    cob = pd.DataFrame([{
        "cliente_id": f["cliente_id"], "imovel_id": f["imovel_id"], "cobertura": c["cobertura"],
        "faixa_valor_min": c["min"], "faixa_valor_max": c["max"], "confianca_estimativa": c["confianca"],
        "dados_utilizados": c["dados_utilizados"], "regra_calculo_utilizada": c["regra"],
        "justificativa": c["justificativa"], "informacao_a_confirmar": c["confirmar"],
        "observacao": ("Cobertura adicional. " if c["tipo"] == "ADICIONAL" else "") + c["observacao"],
    } for f in fichas for c in f["coberturas"]])
    return resultado, cob
