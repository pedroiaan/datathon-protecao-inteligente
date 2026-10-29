// Formatos e textos do cliente. Mesmas regras do motor (motor.aprox / motor.entre) e do protótipo v4.
import { porQueDoPlano, territorioDe } from "../dados/contrato";
import { COB, Cob, FIXAS, MAPA_COB, ORDEM_PLANO, PLANOS, Plano, NOME_CASO } from "./produto";

export const brl = (v: number) => "R$ " + Math.round(v).toLocaleString("pt-BR");
export const brl2 = (v: number) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function aprox(v: number) {
  if (v >= 1e6) { const m = Math.floor(v / 1e5 + 0.5) / 10; return "R$ " + String(m).replace(".", ",") + (m < 2 ? " milhão" : " milhões"); }
  if (v >= 1e4) return "R$ " + Math.floor(v / 1000 + 0.5) + " mil";
  if (v >= 1000) { const m = Math.floor(v / 100 + 0.5) / 10; return "R$ " + String(m).replace(".", ",") + " mil"; }
  return brl(Math.round(v / 10) * 10);
}
export const entre = (a: number, b: number) => { const x = aprox(a), y = aprox(b); return x === y ? "cerca de " + x : "de " + x + " a " + y; };
const ACENTO: Record<string, string> = { "Sao Paulo": "São Paulo", "Sao Luis": "São Luís", Brasilia: "Brasília", Goiania: "Goiânia", Belem: "Belém", Florianopolis: "Florianópolis", Maceio: "Maceió", Vitoria: "Vitória" };
export const titulo = (s: string) => String(s || "").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()).replace(/\bApto\b/, "apto");
export const cidade = (f: any) => { const c = f.local.split("/")[0]; return ACENTO[c] || c; };
export const uf = (f: any) => f.local.split("/")[1];
/** Rótulo do caso no seletor da demonstração: nome do cenário + cidade da ficha. Casos novos do motor aparecem pelo código. */
export const rotuloCaso = (k: string, f: any) => `${NOME_CASO[k] || k.replace(/_/g, " ")} (${cidade(f)})`;
export const ehApto = (f: any) => f.campos.tipo.valor === "APARTAMENTO";
export const naCidade = (f: any) => (ehApto(f) ? "Seu apê" : "Sua casa") + " em " + cidade(f);
export const cobFicha = (f: any, k: Cob) => f.coberturas.find((c: any) => MAPA_COB[c.cobertura] === k);
export const temAdicional = (f: any, k: Cob) => f.adicionais.some((a: any) => MAPA_COB[a.cobertura] === k);

// fatos do território que o motor já pôs na justificativa da cobertura
export function chuvaDaCidade(f: any) {
  const t = territorioDe(f);
  return t.agua10 > 0 ? { dez: t.agua10 } : null;
}
export function energiaDaCidade(f: any) {
  const t = territorioDe(f);
  return t.energiaTotal ? { pos: t.energiaPos, total: t.energiaTotal } : null;
}

/** Fatos do aviso: o que já protege e o que não, em reais, e um fato forte do imóvel. Cada um com origem. */
export function fatosDoAviso(f: any): { t: string; o: string }[] {
  const v = f.campos.vinculo.valor, b = f.campos.bens, vi = f.valor_imovel, fatos: { t: string; o: string }[] = [];
  if (v === "INQUILINO") fatos.push({ t: `Você paga ${brl(f.sinais.aluguel)} de aluguel. Se o imóvel ficar inabitável, ele continua.`, o: "suas transações" });
  else if (vi.segundo_risco) fatos.push({ t: `${v === "FINANCIADO" && f.campos.tipo.valor === "CASA" ? "O seguro do financiamento" : "O seguro do condomínio"} cobre o prédio, não o que é seu: pelas suas compras, isso vale ${entre(b.min, b.max)}.`, o: "suas compras de 3 anos" });
  else fatos.push({ t: `Reconstruir ${ehApto(f) ? "o apê" : "a casa"} custaria ${aprox((vi.reconstrucao_min + vi.reconstrucao_max) / 2)}, fora ${entre(b.min, b.max)} em bens.`, o: "custo oficial de obra (IBGE)" });
  const chuva = chuvaDaCidade(f), luz = energiaDaCidade(f);
  if (f.campos.uso.valor === "LAZER_VERANEIO") fatos.push({ t: "Como ele fica vazio parte do tempo, um cano estourado pode passar dias sem ninguém ver.", o: "imóvel de lazer" });
  else if (f.sinais.vidracaria > 0) fatos.push({ t: `Você gastou ${aprox(f.sinais.vidracaria)} com vidraçaria nos últimos 2 anos.`, o: "suas transações" });
  if (chuva && chuva.dez > 0) fatos.push({ t: `${cidade(f)} teve ${chuva.dez} registros de chuva forte e alagamento em 10 anos.`, o: "Defesa Civil" });
  else if (luz && luz.pos > luz.total / 2) fatos.push({ t: `A distribuidora de energia da sua cidade ficou em ${luz.pos}º de ${luz.total} no ranking de quedas.`, o: "ANEEL 2025" });
  return fatos;
}

/** Aviso da tela de bloqueio: uma frase só, com o fato que mais pesa, e a origem. */
export function avisoCurto(f: any): { texto: string; fonte: string } {
  const v = f.campos.vinculo.valor, b = f.campos.bens, vi = f.valor_imovel;
  if (v === "INQUILINO") return { texto: `Se o imóvel ficar inabitável, o aluguel de ${brl(f.sinais.aluguel)} continua.`, fonte: "Pelas suas transações. Toque para ver." };
  if (vi.segundo_risco) return { texto: `O seguro do ${v === "FINANCIADO" && f.campos.tipo.valor === "CASA" ? "financiamento" : "condomínio"} não cobre o que é seu: cerca de ${aprox(b.min)} a ${aprox(b.max)} em bens.`, fonte: "Pelas suas compras. Toque para ver." };
  return { texto: `Reconstruir ${ehApto(f) ? "o apê" : "a casa"} custaria cerca de ${aprox((vi.reconstrucao_min + vi.reconstrucao_max) / 2)}.`, fonte: "Pelo custo oficial de obra. Toque para ver." };
}

/** Fatos da entrada do produto: número em destaque, uma linha de texto e a origem. */
export function fatosCurtos(f: any): { valor: string; texto: string; fonte: string; ic: string }[] {
  const v = f.campos.vinculo.valor, b = f.campos.bens, vi = f.valor_imovel, fatos: { valor: string; texto: string; fonte: string; ic: string }[] = [];
  if (v === "INQUILINO") fatos.push({ valor: `${brl(f.sinais.aluguel)} por mês`, texto: "de aluguel continuam se o imóvel ficar inabitável", fonte: "suas transações", ic: "casa" });
  else if (vi.segundo_risco) fatos.push({ valor: `${aprox(b.min)} a ${aprox(b.max)}`, texto: `em bens que o seguro do ${v === "FINANCIADO" && f.campos.tipo.valor === "CASA" ? "financiamento" : "condomínio"} não cobre`, fonte: "suas compras de 3 anos", ic: "sofa" });
  else fatos.push({ valor: aprox((vi.reconstrucao_min + vi.reconstrucao_max) / 2), texto: `para reconstruir ${ehApto(f) ? "o apê" : "a casa"}, fora os bens`, fonte: "custo oficial de obra (IBGE)", ic: "casa" });
  if (f.campos.uso.valor === "LAZER_VERANEIO") fatos.push({ valor: "Casa de temporada", texto: "vazia parte do tempo: um vazamento pode passar dias sem ninguém ver", fonte: "seu cadastro", ic: "praia" });
  else if (f.sinais.vidracaria > 0) fatos.push({ valor: aprox(f.sinais.vidracaria), texto: "gastos com vidraçaria nos últimos 2 anos", fonte: "suas transações", ic: "vidro" });
  const chuva = chuvaDaCidade(f), luz = energiaDaCidade(f);
  if (chuva && chuva.dez > 0) fatos.push({ valor: `${chuva.dez} ${chuva.dez > 1 ? "registros" : "registro"}`, texto: `de chuva forte e alagamento em ${cidade(f)} em 10 anos`, fonte: "Defesa Civil", ic: "chuva" });
  else if (luz && luz.pos > luz.total / 2) fatos.push({ valor: `${luz.pos}º de ${luz.total}`, texto: "a distribuidora da sua cidade no ranking de quedas de energia", fonte: "ANEEL 2025", ic: "raio" });
  return fatos;
}

export function origem(d: any) {
  const fo = (d.fonte || "").toLowerCase();
  if (fo.includes("parcela")) return "parcela no BB";
  if (fo.includes("aluguel")) return "transações";
  if (fo.includes("compras")) return "pelas compras";
  if (fo.includes("área cadastrada")) return "cadastro do IPTU";
  if (fo.includes("iptu")) return "estimado pelo IPTU";
  if (fo.includes("endereço")) return d.classe === "OBSERVADO" ? "pelo endereço" : "estimado";
  if (fo.includes("mora em outro")) return "a confirmar";
  if (fo.includes("sem aluguel")) return "estimado";
  return d.classe === "OBSERVADO" ? "cadastro" : "estimado";
}

export const OPCOES: Record<string, string[]> = {
  BENS: ["Sim, por aí", "É menos", "É mais"], AREA: ["Confere", "Não, é outra"], PADRAO: ["Simples", "Normal", "Alto padrão"],
  USO: ["Moro aqui", "É de veraneio", "Está alugado"], VINCULO: ["Sim", "Não"], RC_FAMILIA: ["Quero", "Agora não"],
  SEGURO_EXISTENTE: ["Não", "Sim"], POSSIVEL_REFORMA: ["Não", "Sim, está em obra"], RECEBE_ALUGUEL: ["Sim", "Não"],
  TIPO: ["Apartamento", "Casa"], MATERIAL: ["Sim", "Não"],
};

export const NOME_VINCULO: Record<string, string> = { INQUILINO: "Alugado, você é inquilino", FINANCIADO: "Seu, financiado", PROPRIETARIO: "Seu, quitado", PROPRIETARIO_LOCADOR: "Seu, alugado para outra pessoa" };
export const NOME_USO: Record<string, string> = { RESIDENCIAL_HABITUAL: "Residencial", LAZER_VERANEIO: "Lazer", RESIDENCIAL_LOCADO_A_TERCEIROS: "Residencial, alugado para outra pessoa", RESIDENCIAL_COMERCIAL: "Residencial e Comercial" };
// Opções iguais às do app do BB ("Qual o tipo do imóvel?" e "Qual é a utilização do imóvel?")
export const OPCOES_TIPO = ["APARTAMENTO", "CASA", "CASA_EM_CONDOMINIO"];
export const OPCOES_USO = ["RESIDENCIAL_HABITUAL", "LAZER_VERANEIO", "RESIDENCIAL_COMERCIAL"];

/** Pergunta em linguagem clara, com opções concretas (o texto do motor é curto demais para o cliente). */
export function perguntaCliente(p: any, f: any): { texto: string; ajuda?: string; opcoes: string[]; notas?: Record<string, string> } {
  const b = f.campos.bens, apto = ehApto(f);
  switch (p.codigo) {
    case "BENS": return { texto: "Se você precisasse comprar de novo tudo o que tem em casa, quanto gastaria?", ajuda: `Pense em móveis, eletrodomésticos e eletrônicos. Pelas suas compras, estimamos ${entre(b.min, b.max)}.`,
      opcoes: [`Menos de ${aprox(b.min)}`, `De ${aprox(b.min)} a ${aprox(b.max)}`, `Mais de ${aprox(b.max)}`] };
    case "PADRAO": return { texto: `Como é o acabamento ${apto ? "do seu apê" : "da sua casa"}?`, ajuda: "Isso muda quanto custa refazer pisos, armários e paredes.",
      opcoes: ["Básico: piso cerâmico e armários simples", "Médio: porcelanato e alguns móveis planejados", "Alto: pedra ou madeira nobre e tudo planejado"] };
    case "AREA": return { texto: `${apto ? "O apê" : "A casa"} tem cerca de ${f.campos.area.valor} m²?`, ajuda: "Estimamos pelo IPTU. É a área construída, sem contar quintal ou garagem aberta.", opcoes: ["Sim, por aí", "É menor", "É maior"] };
    case "USO": return { texto: "Você mora neste imóvel?", opcoes: ["Sim, é onde eu moro", "Não, uso para temporada ou lazer", "Não, está alugado para outra pessoa"] };
    case "VINCULO": return { texto: "O imóvel é seu e já está pago?", opcoes: ["Sim, é meu e está quitado", "É meu, mas ainda pago o financiamento", "Não, eu moro de aluguel"] };
    case "RECEBE_ALUGUEL": return { texto: "Você recebe aluguel deste imóvel?", opcoes: ["Sim, ele está alugado", "Não"] };
    case "TIPO": return { texto: "O imóvel é um apartamento ou uma casa?", opcoes: ["Apartamento", "Casa", "Casa em condomínio"] };
    case "POSSIVEL_REFORMA": return { texto: `${apto ? "O apê" : "A casa"} está em obra ou reforma agora?`, ajuda: "Vimos compras de material de construção. Obra em andamento muda o que o seguro cobre.", opcoes: ["Não, a obra já acabou", "Sim, está em obra agora"],
      notas: { "Sim, está em obra agora": "Durante a obra o seguro não cobre danos causados por ela. Você pode contratar agora ou voltar quando terminar." } };
    case "SEGURO_EXISTENTE": return { texto: "Você já tem outro seguro para este imóvel?", ajuda: "Vimos pagamentos que parecem de um seguro residencial. Dois seguros para o mesmo bem não somam a indenização.", opcoes: ["Não tenho", "Sim, já tenho"],
      notas: { "Sim, já tenho": "Tudo bem. Compare com o que você tem: se ficar com este, cancele o outro para não pagar duas vezes." } };
    case "RC_FAMILIA": return { texto: p.texto, opcoes: ["Quero essa proteção", "Agora não"] };
    default: return { texto: p.texto, opcoes: OPCOES[p.codigo] || ["Sim", "Não"] };
  }
}
export const NOME_TIPO: Record<string, string> = { APARTAMENTO: "Apartamento", CASA: "Casa", CASA_EM_CONDOMINIO: "Casa em condomínio" };

export function franquiaTexto(k: Cob) {
  const P = COB[k];
  return P.fr[0] ? `Franquia 10%, mín. ${brl(P.fr[1])}` : P.fr[1] ? `Franquia ${brl(P.fr[1])}` : "Sem franquia";
}
export function planoDono(k: Cob): Plano {
  return ORDEM_PLANO.find((pl) => [...FIXAS, ...PLANOS[pl].extras].includes(k)) as Plano;
}

/** Dúvidas frequentes de cada tela (a Ajuda resolve antes do gerente). */
export function faqDaTela(tela: string, f: any): [string, string][] {
  const rec = PLANOS[f.plano as Plano].nome;
  const comum: [string, string] = ["Vocês usam minha renda ou minha idade?", "A idade nunca entra. A renda só ajuda a estimar o valor dos seus bens quando faltam compras para a casa, e sempre junto com a média da sua região. O que decide é o imóvel e as suas transações."];
  const F: Record<string, [string, string][]> = {
    seguro: [["Por que recebi esse aviso?", "Porque o seu imóvel não tem o Seguro Residencial e alguns dados mostram o que ficaria descoberto. Você não precisa contratar; o aviso é para você decidir com informação."], comum,
      ["O BB pede senha ou manda link?", "Nunca. O seguro só aparece aqui dentro do app. Desconfie de mensagens com link pedindo dados."]],
    casa: [["Como o banco sabe esses dados?", "Do seu cadastro, do endereço e das transações na sua conta, como a parcela do financiamento e as compras de móveis e eletrônicos. Cada dado mostra de onde veio."],
      ["O que quer dizer 'estimado'?", "É um valor que calculamos, não um dado que você informou. Por isso ele aparece com ≈ e você pode corrigir respondendo às perguntas."],
      ["E se algum dado estiver errado?", "É só responder às perguntas da tela. A proposta se ajusta na hora, sem preencher formulário."], comum],
    cobre: [["O que é franquia?", "É a parte do prejuízo que fica com você em cada pedido. Exemplo: em danos por água, 10% do prejuízo, com mínimo de R$ 1.000."],
      ["O seguro do condomínio já não cobre?", "Ele cobre a estrutura do prédio e as áreas comuns. O que é seu, como móveis, aparelhos, pisos e armários, fica de fora."],
      ["De onde vêm esses valores?", "Das suas compras dos últimos 3 anos corrigidas pela inflação e do custo oficial de obra do seu estado. Usamos sempre o valor mais baixo da estimativa."],
      ["Cobre cano velho ou infiltração antiga?", "Não. Desgaste e falta de manutenção não entram em nenhum plano. Cano que estoura de repente, sim."]],
    plano: [[`Por que o ${rec}?`, porQueDoPlano(f).slice(0, 3).join(". ") + "."],
      ["Posso escolher outro plano?", "Pode. Se escolher um plano menor, mostramos o que fica descoberto. A decisão é sua."],
      ["O que são as assistências?", "Serviços 24h para o dia a dia da casa, como encanador, eletricista e chaveiro. Cada plano tem uma quantidade de pacotes."]],
    ajuste: [["Quanto colocar em incêndio?", "O suficiente para reconstruir e repor seus bens. Abaixo disso, num incêndio grande, parte do prejuízo fica com você."],
      ["Posso tirar uma cobertura?", "As coberturas básicas do plano não saem; só o valor muda. As extras você liga e desliga."],
      ["Por que o preço mudou?", "Cada cobertura custa conforme o valor protegido. O app mostra a diferença na hora."]],
    conferir: [["Posso desistir depois?", "Sim. Em até 7 dias, pelo app, com o dinheiro de volta."],
      ["Quando começa a valer?", "No dia seguinte à contratação. A apólice chega no seu e-mail e fica em Meu seguro."],
      ["Vale a pena contratar por mais anos?", "Você ganha desconto e trava o preço. Dá para cancelar depois, com devolução proporcional."]],
    painel: [["De onde vem o código do cliente?", "É gerado a partir do cliente e do imóvel, sempre igual. Só aparece aqui no portal: o cliente não precisa ditar nada."],
      ["Posso mudar a regra do motor?", "Não. As sugestões ficam dentro da faixa que o motor calculou. Fora dela, a proposta volta para a análise."],
      ["O cliente precisa aceitar?", "Sim. Ele recebe a proposta marcada 'ajustado pelo gerente', vê o que mudou e decide. Nada é contratado sem ele."],
      ["Por que não aparecem renda e idade?", "Porque não entram na análise. A renda só ajuda a estimar bens quando faltam compras, e fica dentro do motor."]],
    gerente: [["O gerente vê a mesma proposta?", "Vê. Ele recebe a proposta exatamente como está na sua tela, com os ajustes que você fez, e pode sugerir valores diferentes."],
      ["Preciso aceitar o que ele sugerir?", "Não. A proposta ajustada aparece marcada como 'ajustado pelo gerente' e você confere tudo antes de contratar."],
      ["Quanto tempo ele leva para responder?", "Em horário comercial, poucos minutos. Você recebe um aviso no app quando a proposta chegar."]],
    meu: [["Como peço um encanador ou chaveiro?", "Toque em 'Pedir assistência', escolha o problema e acompanhe o profissional pelo app."],
      ["Como aviso um sinistro?", "Em 'Avisar sinistro'. Conte o que aconteceu; fotos ajudam, mas não são obrigatórias no primeiro aviso."]],
  };
  return F[tela] || F.casa;
}
