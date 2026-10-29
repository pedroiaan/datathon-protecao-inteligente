// Portal do gerente: código de cada cliente, fila de pedidos e sugestões de ajuste.
// Regra: o gerente confirma dados e ajusta valores DENTRO da faixa do motor; não muda a regra,
// não vê renda nem idade e não contrata nada. O cliente recebe a proposta marcada
// "ajustado pelo gerente" e decide.
import { porQueDoPlano } from "../dados/contrato";
import { estadoDoCaso, Estado, incluidas, preco, sugeridoDe } from "./estado";
import { COB, Cob, NOME_CLIENTE, Plano, PLANOS } from "./produto";
import { aprox, brl, OPCOES, perguntaCliente, temAdicional } from "./textos";

const SIGLA_PLANO: Record<string, string> = { ESSENCIAL: "ESS", PRATICO: "PRA", TOTAL: "TOT" };

/** Código do cliente para o gerente: diz onde e o quê, sem precisar decorar.
 *  SR-RS-ESS-0015-1 = Seguro Residencial · estado do imóvel · plano indicado pelo motor · nº do caso e do imóvel.
 *  Sempre o mesmo para o mesmo cliente e imóvel; dá para ditar por telefone e filtrar por parte ("RS", "ESS"). */
export function codigoDoCliente(f: any): string {
  const uf = String(f.local || "").split("/")[1] || "BR";
  const [, caso = "0", imovel = "1"] = String(f.imovel_id).match(/(\d+)_(\d+)$/) || [];
  return `SR-${uf}-${SIGLA_PLANO[f.plano] || "SEG"}-${caso.slice(-4).padStart(4, "0")}-${Number(imovel)}`;
}
/** Busca tolerante: "sr-rs-ess-0015-1", "0015", "RSESS" e "SR RS ESS 0015 1" acham o mesmo cliente. */
export const normalizaCodigo = (t: string) => t.toUpperCase().replace(/[^0-9A-Z]/g, "").replace(/^SR/, "");

/** Por que o pedido precisa (ou não) do gerente: o que trava a contratação vem primeiro na fila. */
export function prioridadeDoPedido(f: any): { nivel: 0 | 1 | 2; rotulo: string } {
  const obrig = (f.perguntas || []).filter((p: any) => p.obrigatoria).length;
  if (f.jornada === "GERENTE") return { nivel: 0, rotulo: "precisa de você" };
  if (obrig) return { nivel: 0, rotulo: `trava: ${obrig} pergunta${obrig > 1 ? "s" : ""} obrigatória${obrig > 1 ? "s" : ""}` };
  if (f.confianca === "BAIXA") return { nivel: 1, rotulo: "confiança baixa" };
  return { nivel: 2, rotulo: "pronto para 1 toque" };
}

export const nomeDoCliente = (caso: string, f: any) => NOME_CLIENTE[caso] || `Cliente ${f.cliente_id}`;

export type Pedido = { caso: string; codigo: string; nome: string; f: any; quando: string; novo: boolean; prioridade: { nivel: 0 | 1 | 2; rotulo: string } };

/** Fila do gerente: o pedido que acabou de chegar primeiro; depois a carteira, do que trava a
 *  contratação (pergunta obrigatória, jornada do gerente) para o que já está pronto para 1 toque. */
export function filaDoGerente(casos: Record<string, string>, fichas: Record<string, any>, casoAtual: string): Pedido[] {
  const horas = ["há 12 min", "há 40 min", "há 1 h", "há 2 h", "ontem", "ontem", "ontem", "ontem", "ontem"];
  const vistos = new Set<string>();
  const unicos = [casoAtual, ...Object.keys(casos)].filter((k) => casos[k] && !vistos.has(casos[k]) && vistos.add(casos[k]));
  const resto = unicos.slice(1).sort((a, b) => prioridadeDoPedido(fichas[casos[a]]).nivel - prioridadeDoPedido(fichas[casos[b]]).nivel);
  return [unicos[0], ...resto].filter(Boolean).map((k, i) => {
    const f = fichas[casos[k]];
    return { caso: k, codigo: codigoDoCliente(f), nome: nomeDoCliente(k, f), f, quando: i === 0 ? "agora" : horas[i - 1], novo: i === 0, prioridade: prioridadeDoPedido(f) };
  });
}

/** Estado do cliente para o gerente: o que o cliente montou (se for o da demo) ou a proposta do motor. */
export const estadoDoPedido = (p: Pedido, atual: Estado) => (p.caso === atual.caso ? atual : estadoDoCaso(p.caso));

// ---------- sugestões ----------
export type Sugestao = {
  id: string;
  titulo: string;
  porque: string;
  /** Muda a proposta (false = só orientação ao cliente). */
  muda: boolean;
  aplicar: (s: Estado) => Estado;
  /** Frase que o cliente lê em "Proposta ajustada". */
  nota: (s: Estado) => string;
};

const teto = (s: Estado, k: Cob) => {
  const fx = s.faixa[k];
  return fx ? Math.min(COB[k].max, Math.round(fx[1] / COB[k].passo) * COB[k].passo) : s.valores[k];
};
const comValor = (s: Estado, k: Cob, v: number): Estado => ({ ...s, valores: { ...s.valores, [k]: v } });
/** Como o gerente lê cada pergunta do motor (curto; o cliente vê o texto completo de perguntaCliente). */
const ASSUNTO: Record<string, string> = {
  BENS: "valor dos bens", PADRAO: "acabamento", AREA: "área", USO: "uso do imóvel", VINCULO: "relação com o imóvel", TIPO: "tipo do imóvel",
  SEGURO_EXISTENTE: "se já tem outro seguro", POSSIVEL_REFORMA: "se está em obra", RECEBE_ALUGUEL: "se recebe aluguel", RC_FAMILIA: "danos a terceiros",
};
const assunto = (p: any, f: any) => (p.codigo === "AREA" ? `área (≈ ${f.campos.area.valor} m²)` : ASSUNTO[p.codigo] || perguntaCliente(p, f).texto);
const pendentes = (s: Estado) => s.f.perguntas.filter((p: any) => !s.resp[p.codigo]);

/** O que o gerente pode sugerir para este cliente, a partir da ficha do motor e do que o cliente montou. */
export function sugestoesDoGerente(s: Estado): Sugestao[] {
  const f = s.f, l: Sugestao[] = [], lazer = f.campos.uso.valor === "LAZER_VERANEIO";
  const abertas = pendentes(s);
  if (abertas.length) l.push({
    id: "confirmar", muda: true,
    titulo: abertas.length === 1 ? "Confirmar 1 dado estimado" : `Confirmar ${abertas.length} dados estimados`,
    porque: "Perguntar: " + abertas.map((p: any) => assunto(p, f)).join(", ") + ".",
    aplicar: (e) => {
      const resp = { ...e.resp };
      e.f.perguntas.forEach((p: any) => { if (!resp[p.codigo]) resp[p.codigo] = (OPCOES[p.codigo] || ["Sim"])[0]; });
      return { ...e, resp };
    },
    nota: () => "Confirmou com você os dados que eram estimativa. A confiança da análise ficou alta.",
  });
  if (s.plano !== s.rec) l.push({
    id: "plano", muda: true,
    titulo: `Voltar ao plano ${PLANOS[s.rec].nome}`,
    porque: porQueDoPlano(f)[0] || `O motor indicou o ${PLANOS[s.rec].nome} para este imóvel.`,
    aplicar: (e) => ({ ...e, plano: e.rec, ligadas: e.rec === "TOTAL" ? { ...e.ligadas, rc: true } : e.ligadas }),
    nota: (e) => `Sugeriu o plano ${PLANOS[e.rec].nome}, o indicado para o seu imóvel.`,
  });
  if (s.faixa.incendio && s.valores.incendio < s.faixa.incendio[0]) l.push({
    id: "incendio", muda: true,
    titulo: `Incêndio de volta para ${brl(sugeridoDe(s, "incendio"))}`,
    porque: `O cliente baixou para ${brl(s.valores.incendio)}, abaixo do custo de reconstruir. Num sinistro grande, a diferença fica com ele.`,
    aplicar: (e) => comValor(e, "incendio", sugeridoDe(e, "incendio")),
    nota: (e) => `Incêndio voltou para ${brl(e.valores.incendio)}, o suficiente para reconstruir.`,
  });
  if (f.sinais.vidracaria > 0 && s.faixa.vidros && s.valores.vidros < teto(s, "vidros")) l.push({
    id: "vidros", muda: true,
    titulo: `Quebra de vidros para ${brl(teto(s, "vidros"))}`,
    porque: `Gastou ${aprox(f.sinais.vidracaria)} com vidraçaria nos últimos 2 anos.`,
    aplicar: (e) => (incluidas(e).includes("vidros") ? comValor(e, "vidros", teto(e, "vidros")) : e),
    nota: (e) => `Quebra de vidros subiu para ${brl(e.valores.vidros)}, perto do que você gastou com vidraçaria (${aprox(f.sinais.vidracaria)}).`,
  });
  if (!lazer && s.faixa.roubo && s.valores.roubo < teto(s, "roubo")) l.push({
    id: "roubo", muda: true,
    titulo: `Roubo para ${brl(teto(s, "roubo"))}`,
    porque: "Valor dos eletrônicos e portáteis nas compras dos últimos 3 anos.",
    aplicar: (e) => (incluidas(e).includes("roubo") ? comValor(e, "roubo", teto(e, "roubo")) : e),
    nota: (e) => `Roubo foi para ${brl(e.valores.roubo)}, o valor dos seus eletrônicos e portáteis.`,
  });
  if (temAdicional(f, "rc") && !s.ligadas.rc) l.push({
    id: "rc", muda: true,
    titulo: "Incluir danos a terceiros",
    porque: (f.adicionais.find((a: any) => a.cobertura === "RESPONSABILIDADE_CIVIL_FAMILIAR")?.motivo || "Vizinho colado e dependentes ou pet em casa.").replace(/^./, (c: string) => c.toUpperCase()),
    aplicar: (e) => ({ ...e, ligadas: { ...e.ligadas, rc: true } }),
    nota: () => "Incluiu danos a terceiros: se algo da sua casa atingir o vizinho, o seguro paga o conserto.",
  });
  if (lazer) l.push({
    id: "lazer", muda: false,
    titulo: "Explicar: imóvel de temporada",
    porque: "Com o imóvel vazio boa parte do tempo, roubo não é coberto. O Essencial continua o mais indicado.",
    aplicar: (e) => e,
    nota: () => "Explicou que, com o imóvel vazio, o roubo não é coberto: o Essencial continua o mais indicado.",
  });
  return l;
}

// ---------- edição manual do gerente ----------
/** O que o gerente mudou à mão, por cima das sugestões. Só guarda o que difere: o resto segue a proposta. */
export type Ajustes = { plano?: Plano; valores: Partial<Record<Cob, number>>; ligadas: Partial<Record<Cob, boolean>> };
export const SEM_AJUSTES: Ajustes = { valores: {}, ligadas: {} };
export const temAjustes = (a: Ajustes) => !!a.plano || Object.keys(a.valores).length > 0 || Object.keys(a.ligadas).length > 0;

function comAjustes(e: Estado, a: Ajustes): Estado {
  const plano = a.plano ?? e.plano;
  const ligadas = { ...e.ligadas, ...(a.plano === "TOTAL" ? { rc: true } : {}), ...a.ligadas };
  return { ...e, plano, valores: { ...e.valores, ...a.valores }, ligadas };
}

/** Junta a mudança feita na tela (antes → depois) aos ajustes que já existiam. */
export function somaAjustes(a: Ajustes, antes: Estado, depois: Estado): Ajustes {
  const r: Ajustes = { plano: a.plano, valores: { ...a.valores }, ligadas: { ...a.ligadas } };
  if (depois.plano !== antes.plano) r.plano = depois.plano;
  (Object.keys(COB) as Cob[]).forEach((k) => {
    if (depois.valores[k] !== antes.valores[k]) r.valores[k] = depois.valores[k];
    if (depois.ligadas[k] !== antes.ligadas[k]) r.ligadas[k] = depois.ligadas[k];
  });
  return r;
}

/** Frases para o cliente sobre o que o gerente mudou à mão (comparado com o que o cliente tinha). */
function notasDosAjustes(base: Estado, fim: Estado, a: Ajustes): string[] {
  const n: string[] = [];
  if (a.plano && fim.plano !== base.plano) n.push(`Mudou o plano para o ${PLANOS[fim.plano].nome}.`);
  (Object.keys(a.ligadas) as Cob[]).forEach((k) => {
    if (fim.ligadas[k] !== base.ligadas[k]) n.push(fim.ligadas[k] ? `Incluiu ${COB[k].curto.toLowerCase()}.` : `Tirou ${COB[k].curto.toLowerCase()} da proposta.`);
  });
  (Object.keys(a.valores) as Cob[]).forEach((k) => {
    if (fim.valores[k] !== base.valores[k] && incluidas(fim).includes(k) && fim.ligadas[k] !== false)
      n.push(`${COB[k].curto}: de ${brl(base.valores[k])} para ${brl(fim.valores[k])}.`);
  });
  return n;
}

/** Proposta que o gerente envia: sugestões ligadas + edição manual. Se ele editou à mão o mesmo item
 *  de uma sugestão, vale a edição (e só ela vira frase para o cliente). */
export function propostaDoGerente(base: Estado, ids: string[], a: Ajustes = SEM_AJUSTES): Estado {
  const editados = new Set<string>([...Object.keys(a.valores), ...Object.keys(a.ligadas), ...(a.plano ? ["plano"] : [])]);
  let e = base;
  const notas: string[] = [];
  sugestoesDoGerente(base).filter((x) => ids.includes(x.id)).forEach((x) => { e = x.aplicar(e); if (!editados.has(x.id)) notas.push(x.nota(e)); });
  e = comAjustes(e, a);
  notas.push(...notasDosAjustes(base, e, a));
  return { ...e, ajustada: true, notasGerente: notas.length ? notas : ["Revisou a proposta com você e manteve como estava."] };
}

/** Só as sugestões escolhidas, sem edição manual. */
export const aplicarSugestoes = (s: Estado, ids: string[]): Estado => propostaDoGerente(s, ids);

/** Resposta padrão do gerente (atalho "Simular resposta"): todas as sugestões. */
export const comAjusteDoGerente = (s: Estado): Estado => (s.ajustada ? s : aplicarSugestoes(s, sugestoesDoGerente(s).map((x) => x.id)));

/** Quanto cada sugestão muda a mensalidade, sozinha. */
export const efeitoNoPreco = (s: Estado, x: Sugestao) => preco(x.aplicar(s)) - preco(s);
