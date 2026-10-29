// Estado da demonstração: o caso escolhido (ficha do motor) e as escolhas do cliente.
import { createContext, ReactNode, useContext, useState } from "react";
import { FICHAS } from "../dados/contrato";
import { ACIMA_DO_PADRAO, BASE, COB, Cob, DESCONTO, FIXAS, PACOTE, PLANOS, Plano } from "./produto";
import { cobFicha, temAdicional } from "./textos";

const FD: any = FICHAS;
export type Pagamento = "DEBITO" | "CARTAO" | "PIX";
type Valores = Record<Cob, number>;
type Ligadas = Record<Cob, boolean>;
export type CampoEditavel = "tipo" | "uso" | "endereco" | "vinculo" | "bens";
/** Valor que veio do banco para cada campo editável do Passo 1. */
export const DO_BANCO: Record<CampoEditavel, (f: any) => string> = { tipo: (f) => f.campos.tipo.valor, uso: (f) => f.campos.uso.valor, endereco: () => "BANCO", vinculo: (f) => f.campos.vinculo.valor, bens: () => "FAIXA" };

export type Estado = {
  caso: string; f: any; plano: Plano; rec: Plano;
  valores: Valores; ligadas: Ligadas; faixa: Record<Cob, [number, number] | null>;
  resp: Record<string, string>; edicoes: Partial<Record<CampoEditavel, string>>; vig: number; entend: [boolean, boolean]; ajustada: boolean; pagamento: Pagamento;
  /** O que o gerente mudou, em frases para o cliente (vazio enquanto ele não responde). */
  notasGerente: string[];
};

function sugerido(k: Cob, fx: [number, number] | null) {
  // valor sugerido: meio da faixa do motor (o mínimo deixa subseguro), no passo e dentro do limite do produto
  const P = COB[k], meio = fx ? (fx[0] + fx[1]) / 2 : P.padrao;
  return Math.min(P.max, Math.max(P.min, Math.round(meio / P.passo) * P.passo));
}

export function estadoDoCaso(caso: string): Estado {
  const f = FD.fichas[FD.casos[caso]];
  const faixa = {} as Estado["faixa"], valores = {} as Valores, ligadas = {} as Ligadas;
  (Object.keys(COB) as Cob[]).forEach((k) => {
    const c = cobFicha(f, k);
    faixa[k] = c ? [c.min, c.max] : null;
    valores[k] = sugerido(k, faixa[k]);
    ligadas[k] = true;
  });
  ligadas.rc = f.plano === "TOTAL" || temAdicional(f, "rc");
  return { caso, f, plano: f.plano, rec: f.plano, valores, ligadas, faixa, resp: {}, edicoes: {}, vig: 1, entend: [false, false], ajustada: false, pagamento: "DEBITO", notasGerente: [] };
}

/** Tipo e uso valem o que o cliente escolheu; o resto vem do banco. */
export const tipoAtual = (s: Estado) => s.edicoes.tipo || s.f.campos.tipo.valor;
export const usoAtual = (s: Estado) => s.edicoes.uso || s.f.campos.uso.valor;
/** Quantos dados do banco o cliente trocou (cada um baixa a confiança da análise). */
export const mudancas = (s: Estado) => (Object.keys(s.edicoes) as CampoEditavel[]).filter((k) => s.edicoes[k] && s.edicoes[k] !== DO_BANCO[k](s.f)).length;
/** Perguntas que continuam na tela: as que repetem um campo editável ou pedem a área (que o cliente não sabe de cabeça) saem. */
export const perguntasDaTela = (f: any) => f.perguntas.filter((p: any) => !["BENS", "AREA", "USO", "VINCULO", "TIPO"].includes(p.codigo));

const ORDEM_CONFIANCA = ["BAIXA", "MEDIA", "ALTA"];

/** Nível da análise: parte do motor, cai um nível por dado do banco trocado, sobe com as respostas. */
export function nivelDaAnalise(s: Estado) {
  const ps = perguntasDaTela(s.f), n = ps.length, feitas = ps.filter((p: any) => s.resp[p.codigo]).length;
  const i = ORDEM_CONFIANCA.indexOf(s.f.confianca) - mudancas(s) + (n && feitas === n ? 1 : 0);
  return { nivel: ORDEM_CONFIANCA[Math.max(0, Math.min(2, i))], feitas, n };
}

export const sugeridoDe = (s: Estado, k: Cob) => sugerido(k, s.faixa[k]);

export function incluidas(s: Estado, plano: Plano = s.plano): Cob[] {
  const l = [...FIXAS, ...PLANOS[plano].extras];
  if (plano !== "TOTAL" && s.ligadas.rc && !l.includes("rc")) l.push("rc");
  return l;
}
export function preco(s: Estado, plano: Plano = s.plano, valores: Valores = s.valores, ligadas: Ligadas = s.ligadas) {
  const custo = (k: Cob) => (COB[k].taxa * (Math.min(valores[k], COB[k].padrao) + ACIMA_DO_PADRAO * Math.max(0, valores[k] - COB[k].padrao))) / 1000;
  const p = PLANOS[plano];
  let v = BASE + p.pacotes * PACOTE;
  FIXAS.forEach((k) => (v += custo(k)));
  p.extras.forEach((k) => { if (ligadas[k]) v += custo(k); });
  if (plano !== "TOTAL" && ligadas.rc) v += custo("rc");
  return v;
}
/** Coberturas que o cliente pode ligar e desligar no plano: ficam na lista mesmo desligadas. */
export function opcionais(s: Estado, plano: Plano = s.plano): Cob[] {
  const l = [...PLANOS[plano].extras];
  if (plano !== "TOTAL" && temAdicional(s.f, "rc")) l.push("rc");
  return l;
}
/** O cliente mexeu no plano (valor diferente do sugerido ou cobertura desligada)? */
/** Quem ajustou: o gerente (proposta revisada) ou o próprio cliente (Personalizar). */
export const quemAjustou = (s: Estado): "gerente" | "cliente" | null => (s.ajustada ? "gerente" : ajustado(s) ? "cliente" : null);

export function ajustado(s: Estado): boolean {
  if (s.ajustada) return true;
  const rcPadrao = s.plano === "TOTAL" || temAdicional(s.f, "rc");
  if (opcionais(s).some((k) => (k === "rc" ? s.ligadas.rc !== rcPadrao : s.ligadas[k] === false))) return true;
  return [...FIXAS, ...opcionais(s)].some((k) => s.ligadas[k] !== false && s.valores[k] !== sugeridoDe(s, k));
}
export const precoFinal = (s: Estado) => preco(s) * (1 - DESCONTO[s.vig]);


const Ctx = createContext<{ s: Estado; set: (fn: (s: Estado) => Estado) => void; casos: Record<string, string> } | null>(null);

export function ProvedorEstado({ children }: { children: ReactNode }) {
  const [s, setS] = useState(() => estadoDoCaso("perfil_A_apto_urbano"));
  return <Ctx.Provider value={{ s, set: (fn) => setS(fn), casos: FD.casos }}>{children}</Ctx.Provider>;
}
export function useEstado() {
  const c = useContext(Ctx);
  if (!c) throw new Error("ProvedorEstado ausente");
  return c;
}
