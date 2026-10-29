// Produto: nomes, limites e franquias vistos no app atual do BB (vault: 13 - Design/App atual).
// Preço é ILUSTRATIVO: o motor não calcula prêmio. Até o valor padrão de cada cobertura vale a taxa
// por mil tirada dos prints; acima dele, cada real a mais custa 10% da taxa.

export type Cob = "incendio" | "eletricos" | "agua" | "vendaval" | "impacto" | "roubo" | "vidros" | "rc" | "aluguel" | "despesas";
export type Plano = "ESSENCIAL" | "PRATICO" | "TOTAL";

export const COB: Record<Cob, {
  nome: string; curto: string; desc: string; ic: string;
  min: number; max: number; padrao: number; passo: number; taxa: number; fr: [number, number];
}> = {
  incendio: { nome: "Incêndio, queda de raio, explosão e fumaça", curto: "Incêndio", desc: "Reconstrói o que queimou e repõe seus bens.", ic: "fogo", min: 100000, max: 600000, padrao: 300000, passo: 1000, taxa: 0.03, fr: [0, 0] },
  eletricos: { nome: "Danos elétricos", curto: "Danos elétricos", desc: "Aparelhos queimados por pico de energia ou raio.", ic: "raio", min: 5000, max: 30000, padrao: 10000, passo: 500, taxa: 0.4, fr: [0.1, 450] },
  agua: { nome: "Danos por água", curto: "Danos por água", desc: "Chuva, alagamento ou cano que estoura.", ic: "agua", min: 3000, max: 50000, padrao: 5000, passo: 500, taxa: 0.5, fr: [0.1, 1000] },
  vendaval: { nome: "Vendaval, furacão, tornado, ciclone e granizo", curto: "Vendaval", desc: "Vento forte, ciclone e granizo.", ic: "vento", min: 1000, max: 60000, padrao: 20000, passo: 500, taxa: 0.05, fr: [0.1, 500] },
  impacto: { nome: "Queda de aeronave e impacto de veículos", curto: "Impacto de veículo", desc: "Carro que bate no muro, queda de aeronave.", ic: "carro", min: 10000, max: 20000, padrao: 10000, passo: 1000, taxa: 0.04, fr: [0.1, 400] },
  roubo: { nome: "Roubo ou furto de bens mediante arrombamento", curto: "Roubo", desc: "Repõe o que levarem num arrombamento.", ic: "ladrao", min: 1000, max: 45000, padrao: 3000, passo: 500, taxa: 3.5, fr: [0.1, 400] },
  vidros: { nome: "Quebra de vidros", curto: "Vidros", desc: "Janelas, box, espelhos e tampos.", ic: "vidro", min: 1000, max: 25000, padrao: 1500, passo: 500, taxa: 3.58, fr: [0, 150] },
  rc: { nome: "Responsabilidade civil familiar", curto: "Danos a terceiros", desc: "Danos que você ou sua família causem a outras pessoas.", ic: "vizinho", min: 10000, max: 200000, padrao: 40000, passo: 1000, taxa: 0.35, fr: [0, 0] },
  aluguel: { nome: "Perda ou pagamento de aluguel", curto: "Aluguel", desc: "Paga a moradia enquanto a casa é reparada.", ic: "casa", min: 5000, max: 30000, padrao: 10000, passo: 500, taxa: 1, fr: [0, 0] },
  despesas: { nome: "Despesas emergenciais", curto: "Emergências", desc: "Lona, escoramento e chaveiro para o dano não aumentar.", ic: "sirene", min: 2000, max: 15000, padrao: 5000, passo: 500, taxa: 2.004, fr: [0, 0] },
};
export const FIXAS: Cob[] = ["incendio", "eletricos", "agua", "vendaval", "impacto"];
export const PLANOS: Record<Plano, { nome: string; extras: Cob[]; pacotes: number; frase: string }> = {
  ESSENCIAL: { nome: "Essencial", extras: [], pacotes: 1, frase: "O básico: fogo, água, vento e danos elétricos." },
  PRATICO: { nome: "Prático", extras: ["roubo", "vidros"], pacotes: 3, frase: "Soma roubo com arrombamento e quebra de vidros." },
  TOTAL: { nome: "Total", extras: ["roubo", "vidros", "rc", "aluguel", "despesas"], pacotes: 6, frase: "Soma danos a terceiros, aluguel e emergências." },
};
export const ORDEM_PLANO: Plano[] = ["ESSENCIAL", "PRATICO", "TOTAL"];
export const PACOTES: [string, string][] = [["Casa em apuros", "ferramentas"], ["Casa funcionando", "maquina"], ["Casa limpa", "vassoura"], ["Casa arrumada", "sofa"], ["Casa sem pragas", "inseto"], ["Casa segura", "escudo"]];
export const BASE = 18.34, PACOTE = 4.5, ACIMA_DO_PADRAO = 0.1;
export const DESCONTO: Record<number, number> = { 1: 0, 2: 0.05, 3: 0.096, 4: 0.14, 5: 0.18 };
export const MAPA_COB: Record<string, Cob> = {
  INCENDIO_RAIO_EXPLOSAO_FUMACA: "incendio", DANOS_ELETRICOS: "eletricos", DANOS_POR_AGUA: "agua", VENDAVAL_GRANIZO: "vendaval",
  IMPACTO_VEICULOS_TERRESTRES: "impacto", ROUBO_FURTO_ARROMBAMENTO: "roubo", QUEBRA_DE_VIDROS: "vidros",
  RESPONSABILIDADE_CIVIL_FAMILIAR: "rc", PERDA_PAGAMENTO_ALUGUEL: "aluguel", DESPESAS_EMERGENCIAIS: "despesas",
};
export const GERENTE = { nome: "Ricardo", inicial: "RG" };
/** Nomes fictícios dos clientes da demonstração (o motor só tem o código do cliente). */
export const NOME_CLIENTE: Record<string, string> = {
  perfil_A_apto_urbano: "Beatriz Lima", perfil_B_casa_familiar: "Davi e Ana Rocha", perfil_C_casa_lazer: "Marta Souza",
  nao_elegivel_seguro_existente: "Jorge Almeida", one_click_limpo: "Paulo Mendes", inquilino_total: "Carla Nunes", elegibilidade_a_confirmar: "Rui Costa",
};
/** Nome de cada cenário da demonstração; a cidade vem da própria ficha (rotuloCaso em textos.ts). */
export const NOME_CASO: Record<string, string> = {
  perfil_A_apto_urbano: "A · Apto urbano", perfil_B_casa_familiar: "B · Casa familiar", perfil_C_casa_lazer: "C · Imóvel de lazer",
  one_click_limpo: "Sem pendências", inquilino_total: "Inquilino", nao_elegivel_seguro_existente: "Já tem seguro",
  elegibilidade_a_confirmar: "Possível reforma",
};
