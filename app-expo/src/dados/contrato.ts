// Contrato entre o motor (motor/motor.py → prototipos/fichas_demo.js → src/dados/fichas.json) e o app.
// O app só lê a ficha por estes tipos e funções. Quando o motor final mudar um campo, ajuste aqui
// e as telas continuam iguais. Cada cliente traz as próprias perguntas (perguntas[]) e o app
// mostra qualquer código: os conhecidos ganham texto e opções claras (textos.perguntaCliente),
// os novos aparecem com o texto do motor e "Sim / Não".
import bruto from "./fichas.json";

export type Classe = "OBSERVADO" | "ESTIMADO" | "PRESUMIDO";
export interface Campo<V = any> { valor: V; natureza: string; classe?: Classe; fonte: string; min?: number; max?: number; [k: string]: any }
export interface Pergunta { codigo: string; texto: string; prioridade: number; reduz_faixa_ate?: number; obrigatoria?: boolean }
export interface Cobertura { cobertura: string; tipo: "FIXA" | "ADICIONAL"; min: number; max: number; confianca: string; regra: string; justificativa: string; confirmar?: string; observacao?: string }
export interface Prova { codigo: string; texto: string }
export interface Necessidade { codigo: string; sim: boolean; forca: string; provas: Prova[]; cobertura: string; pergunta: string | null }
export interface FichaMotor {
  cliente_id: string; imovel_id: string; local: string; complemento: string;
  campos: { tipo: Campo<string>; vinculo: Campo<string>; uso: Campo<string>; area: Campo<number>; bens: Campo<number> };
  valor_imovel: { reconstrucao_min: number; reconstrucao_max: number; segundo_risco: boolean; [k: string]: any };
  elegibilidade: "SIM" | "NAO"; pendencias: { codigo: string; texto: string; pergunta?: string }[]; avisos: string[];
  plano: "ESSENCIAL" | "PRATICO" | "TOTAL"; motivos: any[]; motivos_plano: Prova[]; adicionais: { cobertura: string; motivo: string }[];
  necessidades?: Necessidade[]; territorio?: { agua_10_anos?: number; vento_10_anos?: number; energia_posicao?: number; energia_total?: number };
  coberturas: Cobertura[]; perguntas: Pergunta[]; confianca: "ALTA" | "MEDIA" | "BAIXA"; confianca_motivo: string;
  canal: string; jornada?: string; sinais: { parcela: number; aluguel: number; vidracaria: number; obra: number };
  por_que_nao_abaixo?: string; por_que_nao_acima?: string; fontes: string[];
}
export interface Fichas { casos: Record<string, string>; fichas: Record<string, FichaMotor> }

export const FICHAS = bruto as unknown as Fichas;

/** Risco da cidade: o motor novo entrega pronto em `territorio`; o antigo só no texto da justificativa. */
export function territorioDe(f: FichaMotor) {
  const t = f.territorio;
  if (t) return { agua10: t.agua_10_anos ?? 0, vento10: t.vento_10_anos ?? 0, energiaPos: t.energia_posicao ?? 0, energiaTotal: t.energia_total ?? 0 };
  const just = (cob: string) => f.coberturas.find((c) => c.cobertura === cob)?.justificativa || "";
  const agua = just("DANOS_POR_AGUA").match(/\((\d+) nos últimos 10 anos/);
  const luz = just("DANOS_ELETRICOS").match(/ficou em (\d+)º de (\d+)/);
  return { agua10: agua ? +agua[1] : 0, vento10: 0, energiaPos: luz ? +luz[1] : 0, energiaTotal: luz ? +luz[2] : 0 };
}

/** Por que o plano foi indicado, em frases do próprio motor (necessidades com prova, ou os motivos do plano). */
export function porQueDoPlano(f: FichaMotor): string[] {
  const provas = (f.necessidades || []).filter((n) => n.sim).flatMap((n) => n.provas.map((p) => p.texto));
  const textos = provas.length ? provas : f.motivos_plano.map((m) => m.texto);
  return [...new Set(textos)].map((t) => t.charAt(0).toUpperCase() + t.slice(1));
}
