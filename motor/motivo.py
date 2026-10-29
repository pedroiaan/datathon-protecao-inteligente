"""Motivo e porquê: os textos que o cliente lê (mentoria de 28/10).

O que diferencia a recomendação é o porquê. Todo motivo segue o mesmo roteiro:
1. um fato do cliente (vem das contas e do cadastro dele);
2. quanto está em jogo (o valor em risco que o motor calculou);
3. como o plano resolve;
4. o que fica descoberto se escolher menos;
5. o que ainda falta confirmar, em linguagem simples.

Regras: só fatos do imóvel e das transações, nunca idade (RN-07); a renda só aparece
quando entrou na estimativa dos bens, e então o texto diz isso; estimativa
sempre dita como estimativa (RN-09); nada inventado, todo número tem origem (RN-53).
Este módulo só escreve texto: não decide plano, valor, canal nem confiança.
"""
import re

import parametros as P


# --- Números como gente fala ---------------------------------------------------
def _decimal(x):
    return f"{x:.1f}".replace(".", ",").replace(",0", "")


def reais(v):
    """R$ 950 · R$ 4,5 mil · R$ 49 mil · R$ 1,2 milhão (sem precisão falsa)."""
    v = float(v)
    if v >= 999_500:   # limites pelo valor já arredondado: nada de "R$ 1000 mil"
        x = round(v / 1_000_000, 1)
        return f"R$ {_decimal(x)} {'milhão' if x < 2 else 'milhões'}"
    if v >= 9_950:
        return f"R$ {round(v / 1000):.0f} mil"
    if v >= 999.5:
        return f"R$ {_decimal(round(v / 1000, 1))} mil"
    return f"R$ {round(v):.0f}"


def faixa_reais(lo, hi):
    """'de R$ 23 mil a R$ 61 mil', ou 'cerca de R$ 30 mil' quando os dois arredondam igual."""
    a, b = reais(min(lo, hi)), reais(max(lo, hi))
    return f"cerca de {a}" if a == b else f"de {a} a {b}"


NOME_PLANO = {"ESSENCIAL": "Essencial", "PRATICO": "Prático", "TOTAL": "Total"}
# Palavras do motor que não podem aparecer no texto do cliente (métrica e teste)
TERMOS_INTERNOS = ("presumido", "estimado:", "sinais ainda são fracos", "não há sinais", "o cliente ",
                   "segundo risco", "elegibilidade a confirmar", "PRESUMIDO", "INFERIDO")



# --- O fato que diferencia o cliente dos vizinhos ---------------------------------
# A base grava as cidades sem acento; o cliente lê o nome certo, com a preposição certa
NOME_CIDADE = {"Sao Paulo": "São Paulo", "Brasilia": "Brasília", "Goiania": "Goiânia"}
CIDADE_COM_NO = {"Rio de Janeiro"}


def nome_cidade(f):
    cidade = f["local"].split("/")[0]
    return NOME_CIDADE.get(cidade, cidade)


def na_cidade(f):
    """'em São Paulo', 'no Rio de Janeiro'."""
    cidade = nome_cidade(f)
    return f"{'no' if cidade in CIDADE_COM_NO else 'em'} {cidade}"


def da_cidade(f):
    """'de São Paulo', 'do Rio de Janeiro'."""
    cidade = nome_cidade(f)
    return f"{'do' if cidade in CIDADE_COM_NO else 'de'} {cidade}"


def _grupo(f, nivel):
    """Com quem o cliente foi comparado, sem nunca dar o nome errado da cidade."""
    uf = f["local"].split("/")[1]
    casa = "apartamento" if f["campos"]["tipo"]["valor"] == "APARTAMENTO" else "casa"
    return {"município e tipo": f"clientes com {casa} {na_cidade(f)}", "município": f"clientes {da_cidade(f)}",
            "estado": f"clientes de {uf}"}.get(nivel, "nossos clientes")


def _posicao(v):
    """'mais do que 9 em cada 10', 'menos do que 3 em cada 4' ou None (o meio não diferencia ninguém)."""
    x = v["valor"]
    if x > v["p90"]:
        return "mais", "9 em cada 10"
    if x > v["p75"]:
        return "mais", "3 em cada 4"
    if x < v["p10"]:
        return "menos", "9 em cada 10"
    if x < v["p25"]:
        return "menos", "3 em cada 4"
    return None


def fato_distintivo(f):
    """Uma frase com o fato em que o cliente mais se afasta dos vizinhos, ligado ao plano:
    Total de inquilino → o aluguel; Prático → eletrônicos (ou compras) acima dos vizinhos;
    Essencial → eletrônicos abaixo (explica por que o roubo pesa menos) ou compras acima.
    None quando o cliente está no meio: não inventamos diferença (RN-53)."""
    viz, plano = f.get("vizinhos") or {}, f["plano"]
    tentativas = {"TOTAL": [("aluguel", "mais"), ("eletronicos", "mais"), ("compras", "mais")],
                  "PRATICO": [("eletronicos", "mais"), ("compras", "mais")],
                  "ESSENCIAL": [("eletronicos", "menos"), ("compras", "mais"), ("compras", "menos")]}[plano]
    ja_ditos = {"eletronicos": "ELETRONICOS", "compras": "BENS_ALTOS", "aluguel": "INQUILINO"}
    ditos = {m["codigo"] for m in f.get("motivos_plano", [])}   # o que o porquê mostrou ao cliente
    for campo, lado in tentativas:
        v = viz.get(campo)
        pos = _posicao(v) if v else None
        if not pos or pos[0] != lado:
            continue
        grupo = _grupo(f, v["nivel"])
        if ja_ditos[campo] in ditos:   # o porquê já deu o valor (corrigido pelo IPCA): aqui, só a comparação
            rotulo = {"eletronicos": "Em eletrônicos", "compras": "Em compras para a casa", "aluguel": "No aluguel"}[campo]
            return f"{rotulo}, você está {'acima' if lado == 'mais' else 'abaixo'} de {pos[1]} {grupo}."
        if campo == "aluguel":
            return f"O seu aluguel, de {reais(v['valor'])} por mês, é maior que o de {pos[1]} {grupo} que pagam aluguel."
        oque = "em eletrônicos" if campo == "eletronicos" else "para a casa"
        texto = f"Você comprou {reais(v['valor'])} {oque} em 3 anos, {pos[0]} do que {pos[1]} {grupo}"
        if lado == "menos":   # nunca como crítica: explica por que o Essencial basta
            return f"{texto}: o roubo pesa menos para você."
        if plano == "ESSENCIAL":
            return f"{texto}: um incêndio ou um dano elétrico levaria mais do que na maioria das casas."
        return f"{texto}."
    return None


# --- Motivos do Essencial (antes: "não há sinais fortes", um não-argumento) ----
def motivos_de_patrimonio(vinculo, bens):
    """Para quem não tem sinal de roubo nem de terceiros, o porquê é o próprio patrimônio
    e a cobertura mais acionada (danos elétricos). Peso 0: não muda o plano."""
    motivos = []
    if vinculo == "PROPRIETARIO":
        motivos.append(("PATRIMONIO", "não há aluguel nem financiamento nas suas contas, então um incêndio "
                                      "sairia todo do seu bolso"))
    elif vinculo == "FINANCIADO":
        motivos.append(("PATRIMONIO", "o seguro do financiamento protege a estrutura para o banco, não o que está dentro da casa"))
    e = bens["eletricos"]
    valem = "estimamos que seus eletrônicos e eletrodomésticos valem" if bens.get("regional") else \
        "seus eletrônicos e eletrodomésticos valem hoje"
    texto = f"{valem} {faixa_reais(e['min'], e['max'])}, e um pico de energia pode queimar vários de uma vez"
    motivos.append(("APARELHOS", texto))
    return [{"plano": "ESSENCIAL", "peso": 0, "codigo": c, "texto": t} for c, t in motivos]


# --- Partes da justificativa ----------------------------------------------------
FALA_DOS_BENS = ("BENS_ALTOS", "APARELHOS")   # motivos que já dizem quanto valem os bens


def _em_jogo(f):
    """Quanto o cliente perderia: reconstrução (ou acabamentos) e bens, a preço de hoje.
    Se um motivo já falou dos bens, não repete o número."""
    vi, bens, vinc = f["valor_imovel"], f["campos"]["bens"], f["campos"]["vinculo"]["valor"]
    rec = (vi["reconstrucao_min"] + vi["reconstrucao_max"]) / 2
    ja_falou = any(m["codigo"] in FALA_DOS_BENS for m in f["motivos_plano"])
    seus = "os seus bens" if ja_falou else f"os seus bens, {faixa_reais(bens['min'], bens['max'])}"
    if vi["segundo_risco"]:
        a, b = P.FRACAO_ACABAMENTOS
        quem = "do condomínio" if f["campos"]["tipo"]["valor"] != "CASA" else "do financiamento"
        return f"A estrutura tem o seguro {quem}; o seu protege os acabamentos, cerca de {reais(rec * (a + b) / 2)}, e {seus}."
    if vi.get("estrutura_do_locador"):
        return (f"O imóvel é do proprietário, e o seu seguro protege {seus}; "
                f"se o contrato pedir, inclua a reconstrução, cerca de {reais(rec)}.")
    dono = ", que é do proprietário," if vinc == "INQUILINO" else ""
    return f"Reconstruir o imóvel{dono} custaria cerca de {reais(rec)} pelo custo oficial do IBGE, fora {seus}."


def _provas(f, codigo):
    return {p["codigo"] for n in f.get("necessidades", []) if n["codigo"] == codigo for p in n["provas"]}


def _se_escolher_menos(f):
    """A frase do slide 23 da Brasilseg, com quanto fica descoberto em reais para este cliente."""
    plano, cods = f["plano"], {m["codigo"] for m in f["motivos"]}
    if plano == "PRATICO":
        bens, provas = f["campos"]["bens"], _provas(f, "ROUBO")
        if "ELETRONICOS" in provas:
            oque = f"{reais(bens['portateis']['min'])} em eletrônicos"
        elif bens.get("regional"):   # sem compras, o valor é da região: dizer que é estimativa (RN-09)
            oque = f"os bens que estimamos em {reais(bens['min'])}"
        else:
            oque = f"{reais(bens['min'])} em bens"
        onde = "no seu apartamento" if f["campos"]["tipo"]["valor"] == "APARTAMENTO" else "na sua casa"
        return f"Se você escolher menos, {oque} {onde} ficam descobertos contra roubo e quebra de vidros."
    if plano == "TOTAL":
        if "INQUILINO" in cods:
            aluguel = (f.get("vizinhos") or {}).get("aluguel")
            quanto = f"os {reais(aluguel['valor'])} de aluguel por mês" if aluguel else "o aluguel"
            return f"Se você escolher menos e o imóvel ficar inabitável, {quanto} ficarão descobertos."
        if "RECEBE_ALUGUEL" in cods:
            return "Se você escolher menos, a renda do aluguel ficará descoberta enquanto o imóvel é reparado."
        return "Se você escolher menos, danos a terceiros ficarão descobertos e sairiam do seu bolso."
    return ""


def _no_limite(f):
    """Recomendação decidida por pouco (a menos de 15% do limite): dizer com franqueza e apontar a pergunta."""
    if f.get("forca") != "no_limite" or f["plano"] == "TOTAL":
        return ""
    if f["plano"] == "ESSENCIAL":
        return "Você está perto de precisar do Prático, que cobre roubo e vidros: a pergunta sobre os seus bens decide."
    return "A sua necessidade de proteção contra roubo está perto do limite: a pergunta sobre os seus bens confirma."


def _opcao_acima(f):
    acima = {"ESSENCIAL": "PRATICO", "PRATICO": "TOTAL"}.get(f["plano"])
    if not acima:
        return ""
    oque = {"PRATICO": "roubo e vidros", "TOTAL": "danos a terceiros e perda de aluguel"}[acima]
    if acima == "TOTAL" and any(a["cobertura"] == "RESPONSABILIDADE_CIVIL_FAMILIAR" for a in f.get("adicionais", [])):
        oque = "perda de aluguel e despesas emergenciais"
    return f"O {NOME_PLANO[acima]} acrescenta {oque}."


EXPLICA_CAMPO = {
    ("uso", "PRESUMIDO"): "falta confirmar se você mora no imóvel",
    ("area", "PRESUMIDO"): "a área veio da média de imóveis parecidos na sua região",
    ("bens", "PRESUMIDO"): "sem compras ligadas ao imóvel, usamos a média de casas parecidas na sua região",
    ("area", "ESTIMADO"): "a área veio do seu IPTU e da sua conta de luz, comparados aos de {cidade}",
    ("tipo", "ESTIMADO"): "o endereço não deixa claro se é casa ou apartamento",
    ("vinculo", "ESTIMADO"): "a sua relação com o imóvel foi deduzida das suas contas",
    ("uso", "ESTIMADO"): "o uso do imóvel foi deduzido das suas contas",
    ("bens", "ESTIMADO"): "o valor dos bens foi estimado pelas compras",
}
NIVEL = {"ALTA": "alta", "MEDIA": "média", "BAIXA": "baixa"}


def _confianca(f, com_acerto=True):
    """Uma frase: o nível e a principal razão, na ordem do que mais pesa (presumido antes de estimado)."""
    if f["confianca"] == "ALTA":
        return "Confiança alta: os dados vêm do seu cadastro e das suas contas."
    for chave in [(k, c) for c in ("PRESUMIDO", "ESTIMADO") for k in ("uso", "area", "bens", "tipo", "vinculo")]:
        if f["campos"][chave[0]].get("classe") == chave[1] and chave in EXPLICA_CAMPO:
            texto = EXPLICA_CAMPO[chave].format(cidade=nome_cidade(f))
            if chave == ("bens", "PRESUMIDO") and f["campos"]["bens"].get("usou_renda"):
                texto += " e a sua renda"
            acerto = (f.get("acerto") or {}).get(chave[0]) if chave[1] == "ESTIMADO" and com_acerto else ""
            if acerto:   # o acerto medido (assertividade.py), nunca escrito à mão
                texto += f" ({acerto})"
            return f"Confiança {NIVEL[f['confianca']]}: {texto}."
    return f"Confiança {NIVEL[f['confianca']]} até a sua resposta."


def _nao_elegivel(f):
    if "SITUACAO_CADASTRAL" in {p["codigo"] for p in f["pendencias"]}:
        return "Não podemos fazer uma nova proposta: o cadastro indica imóvel tombado, desapropriado ou condenado."
    return ("Não podemos fazer uma nova proposta: este endereço já deve ter o seguro residencial da BB, e só pode haver "
            "um por endereço. Use a recomendação abaixo para revisar a apólice atual.")


TIPO_NO_TEXTO = {"APARTAMENTO": "o seu apartamento", "CASA": "a sua casa", "CASA_EM_CONDOMINIO": "a sua casa em condomínio"}
# 140 palavras (~1 minuto de leitura): com 130, o fato dos vizinhos e o risco da cidade cabiam em menos de 30% dos motivos
MAX_PALAVRAS = 140


def _tem_rc_adicional(f):
    return any(a["cobertura"] == "RESPONSABILIDADE_CIVIL_FAMILIAR" for a in f.get("adicionais", []))


def _abertura(f):
    """'Para o seu apartamento de cerca de 80 m² em São Paulo, recomendamos o plano Prático.'
    Área cadastrada: '80 m²'; estimada pelos sinais: 'cerca de 80 m²'; da região: sem área (RN-09)."""
    a = f["campos"]["area"]
    tam = "" if a.get("regional") else f" de cerca de {a['valor']} m²" if a["natureza"] == "ESTIMADO" else f" de {a['valor']} m²"
    rc = " com a responsabilidade civil familiar" if _tem_rc_adicional(f) else ""
    return f"Para {TIPO_NO_TEXTO[f['campos']['tipo']['valor']]}{tam} {na_cidade(f)}, recomendamos o plano {NOME_PLANO[f['plano']]}{rc}."


def _motivo_rc(f):
    """Por que a RC entra, pelo tipo do imóvel e pela família (necessidade C)."""
    if not _tem_rc_adicional(f):
        return ""
    provas, tipo = _provas(f, "TERCEIROS"), f["campos"]["tipo"]["valor"]
    lugar = "no prédio" if tipo == "APARTAMENTO" else "no condomínio" if tipo == "CASA_EM_CONDOMINIO" else ""
    if lugar and "FAMILIA" in provas:
        return f"{lugar} e com dependentes ou pet, um acidente seu pode atingir outras pessoas"
    if lugar:
        return f"{lugar}, um vazamento ou incêndio {'no seu apartamento' if tipo == 'APARTAMENTO' else 'na sua casa'} pode atingir o vizinho"
    return "com dependentes ou pet em casa, um acidente pode atingir outras pessoas"


def _porque(f):
    rc = _motivo_rc(f)
    itens = [m["texto"] for m in f["motivos_plano"]] + ([rc] if rc else [])
    if len(itens) > 1:   # "e, no prédio, ..." com vírgula quando o último item abre com o lugar
        itens[-1] = ("e, " if rc else "e ") + itens[-1]
    return f"Isso porque {'; '.join(itens)}." if itens else ""


def risco_do_lugar(f):
    """Uma frase com o dado oficial da cidade, escolhida pelo que mais pesa ali:
    1. distribuidora entre as 25% piores do ranking de quedas da ANEEL → danos elétricos;
    2. senão, chuva forte, alagamento ou enxurrada registrados pela Defesa Civil de 2016 a 2025 → alagamento;
    3. senão, vendaval ou granizo de 2016 a 2025 → vendaval. Sem registro, sem frase:
    ausência de registro não prova ausência de risco, e não inventamos (RN-53)."""
    t = f.get("territorio") or {}
    lugar = na_cidade(f)
    lugar = lugar[0].upper() + lugar[1:]
    pos, tot = t.get("energia_posicao"), t.get("energia_total")
    if pos and tot and pos >= 0.75 * tot:
        onde = "em último lugar" if pos == tot else "entre as piores"
        return (f"{lugar}, a distribuidora de luz ficou {onde} no ranking de quedas de energia da ANEEL "
                f"({pos}º de {tot}, 2025); o plano cobre danos elétricos.")
    for chave, nome, cobre in (("agua_10_anos", "chuva forte, alagamento ou enxurrada", "alagamento"),
                               ("vento_10_anos", "vendaval ou granizo", "vendaval e granizo")):
        n = t.get(chave)
        if n:
            vezes = "1 ocorrência" if n == 1 else f"{n} ocorrências"
            return f"{lugar}, a Defesa Civil registrou {vezes} de {nome} de 2016 a 2025; o plano cobre {cobre}."
    return ""


def _cabe(partes, limite=None):
    """Tira as frases menos importantes até o texto caber em `limite` palavras.
    `partes`: (prioridade, nome, texto) na ordem de leitura; quanto menor a prioridade, antes sai.
    As de prioridade 90 ou mais (abertura, porquê, o que fica descoberto, confirmação, confiança) nunca saem."""
    limite = limite or MAX_PALAVRAS
    partes = [(p, n, t) for p, n, t in partes if t]
    while sum(len(t.split()) for _, _, t in partes) > limite:
        tiravel = [p for p, _, _ in partes if p < 90]
        if not tiravel:
            break
        menor = min(tiravel)
        partes.pop(next(i for i, (p, _, _) in enumerate(partes) if p == menor))
    return [(n, t) for _, n, t in partes]


def justificativa_partes(f):
    """O motivo em partes nomeadas, na ordem de leitura (o app mostra cada parte na tela certa):
    nao_elegivel, abertura, porque, fato, em_jogo, risco, menos, limite ou acima, confirmar, atencao, confianca.
    A casa e a cidade dele; o porquê (provas das necessidades); o fato que o diferencia dos
    vizinhos; quanto está em jogo; o risco da cidade; o que fica descoberto em reais; o que
    confirmar; e a confiança em números. Até 140 palavras: as frases menos importantes saem
    primeiro (opção acima, valor em jogo, risco da cidade, fato dos vizinhos): o porquê e a lacuna já
    trazem os valores em reais, e o que é só deste cliente vale mais que o que se repete."""
    partes = [(100, "nao_elegivel", _nao_elegivel(f))] if f["elegibilidade"] == "NAO" else []
    porque, menos = _porque(f), (_se_escolher_menos(f) if f["elegibilidade"] == "SIM" else "")
    # o valor em jogo sai cedo, a não ser que seja o único jeito de o texto ter dois valores em reais
    em_jogo = 93 if (porque + menos).count("R$") < 2 else 60
    partes += [(100, "abertura", _abertura(f)), (95, "porque", porque), (72, "fato", fato_distintivo(f)),
               (em_jogo, "em_jogo", _em_jogo(f)), (70, "risco", risco_do_lugar(f))]
    if f["elegibilidade"] == "SIM":   # alternativas só fazem sentido para uma proposta nova (RN-37)
        partes.append((90, "menos", menos))
        if not f["pendencias"]:   # com elegibilidade a confirmar, o texto prioriza a confirmação (RN-51: equilíbrio)
            limite = _no_limite(f)
            # no Essencial, o plano acima é a única alternativa do texto (RN-37): não sai
            partes.append((92, "limite", limite) if limite else (91 if f["plano"] == "ESSENCIAL" else 50, "acima", _opcao_acima(f)))
    if f["pendencias"] and f["elegibilidade"] == "SIM":
        perguntas = [p["pergunta"] for p in f["pendencias"] if p.get("pergunta")]
        if perguntas:
            partes.append((98, "confirmar", "Antes de contratar: " + " ".join(perguntas)))
    if f["avisos"]:   # a cláusula fica nas colunas técnicas; o cliente lê só o efeito
        partes.append((97, "atencao", "Atenção: " + "; ".join(re.sub(r" \(CG[^)]*\)", "", a) for a in f["avisos"]) + "."))
    saida = _cabe(partes + [(96, "confianca", _confianca(f))])
    if sum(len(t.split()) for _, t in saida) > MAX_PALAVRAS:   # com perguntas de elegibilidade, o acerto em números dá lugar a elas
        saida = _cabe(partes + [(96, "confianca", _confianca(f, com_acerto=False))])
    return saida


def justificativa(f):
    """O texto da coluna justificativa_recomendacao: as partes de justificativa_partes, juntas."""
    return " ".join(t for _, t in justificativa_partes(f))
