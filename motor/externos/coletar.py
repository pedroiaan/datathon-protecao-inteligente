"""Atualiza as fontes externas que têm API pública. Rodar só quando quiser atualizar.

O motor NÃO chama este script: ele lê os CSVs desta pasta, para funcionar sem internet.
Uso:  python motor/externos/coletar.py
"""
import csv
import json
import urllib.request
from pathlib import Path

PASTA = Path(__file__).resolve().parent
IPCA_API = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json"


def atualizar_ipca():
    with urllib.request.urlopen(IPCA_API, timeout=20) as resp:
        dados = json.load(resp)
    with open(PASTA / "ipca_mensal.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["data", "variacao_mensal_pct"])
        for d in dados:
            w.writerow([d["data"], d["valor"]])
    print(f"IPCA: {len(dados)} meses gravados ({dados[0]['data']} a {dados[-1]['data']})")


if __name__ == "__main__":
    atualizar_ipca()
