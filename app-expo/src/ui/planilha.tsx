// Painel-planilha da demonstração (só no navegador largo, ao lado do iPhone): mostra, a cada tela,
// a linha EXATA das 2 planilhas de entrega que o motor gerou para este cliente (template_resultado_times.csv
// e template_coberturas_times.csv) e a parte do motivo que a tela usa. Visual de Excel de propósito:
// a banca vê que o app roda sobre a saída do motor, não sobre dados inventados.
import { usePathname } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Estado, nivelDaAnalise, perguntasDaTela, useEstado } from "../logica/estado";
import { PLANOS } from "../logica/produto";

const XL = { verde: "#217346", verdeEscuro: "#185C37", grade: "#D4D4D4", cabecalho: "#F3F3F3", selecao: "#E8F2EC",
  destaque: "#FFF2CC", texto: "#1F1F1F", suave: "#616161", fundo: "#FFFFFF", janela: "#F3F3F3" };
const FONTE = "Segoe UI, Calibri, Aptos, Arial, sans-serif";
const LETRAS = "ABCDEFGHIJKLM";
type Aba = "resultado" | "coberturas" | "motivo";
type Etapa = { nome: string; aba: Aba; linhas: string[]; partes: string[]; coberturas?: "todas" | "extras" };

// Cada tela do app → o que a planilha destaca e qual parte do motivo ela mostra
const ETAPAS: { rota: RegExp; e: Etapa }[] = [
  { rota: /^\/$/, e: { nome: "0 · Notificação", aba: "resultado", linhas: ["cliente_id", "imovel_id", "elegivel"], partes: ["abertura"] } },
  { rota: /^\/seguro/, e: { nome: "Entrada no app", aba: "resultado", linhas: ["tipo_imovel_sugerido", "uso_imovel_sugerido", "tipo_vinculo_sugerido"], partes: ["em_jogo"] } },
  { rota: /^\/casa/, e: { nome: "1 · Sua casa", aba: "resultado", linhas: ["tipo_imovel_sugerido", "uso_imovel_sugerido", "tipo_vinculo_sugerido", "confianca_geral", "perguntas_confirmacao"], partes: ["confianca", "limite", "fato"] } },
  { rota: /^\/cobre/, e: { nome: "2 · O que cobre", aba: "coberturas", linhas: [], partes: ["risco", "em_jogo"], coberturas: "todas" } },
  { rota: /^\/plano/, e: { nome: "3 · Seu plano", aba: "resultado", linhas: ["plano_recomendado", "coberturas_recomendadas", "justificativa_recomendacao"], partes: ["porque", "menos", "limite", "acima"] } },
  { rota: /^\/ajuste/, e: { nome: "Personalizar", aba: "coberturas", linhas: [], partes: ["menos"], coberturas: "extras" } },
  { rota: /^\/conferir/, e: { nome: "4 · Conferir", aba: "motivo", linhas: [], partes: ["abertura", "porque", "fato", "em_jogo", "risco", "menos", "limite", "acima", "confirmar", "atencao", "confianca"] } },
  { rota: /^\/(sucesso|meu)/, e: { nome: "5 · Contratado", aba: "resultado", linhas: ["plano_recomendado", "coberturas_recomendadas", "confianca_geral"], partes: ["confianca"] } },
  { rota: /^\/(gerente|avisado|retorno|ajustada)/, e: { nome: "Gerente", aba: "resultado", linhas: ["confianca_geral", "perguntas_confirmacao"], partes: ["confirmar", "confianca"] } },
  { rota: /^\/painel/, e: { nome: "Portal do gerente", aba: "resultado", linhas: ["cliente_id", "imovel_id", "plano_recomendado", "confianca_geral", "perguntas_confirmacao"], partes: ["porque", "confianca"] } },
];
const NOME_PARTE: Record<string, string> = { abertura: "Abertura", porque: "Porquê", fato: "Fato dos vizinhos", em_jogo: "Valor em jogo",
  risco: "Risco da cidade", menos: "Se escolher menos", limite: "No limite", acima: "Plano acima", confirmar: "Confirmar", atencao: "Atenção",
  confianca: "Confiança", nao_elegivel: "Não elegível" };
const VALOR = new Set(["faixa_valor_min", "faixa_valor_max"]);
const reais = (v: any) => (v === "" || v == null ? "" : `R$ ${Number(v).toLocaleString("pt-BR")}`);

/** De onde veio cada campo da linha de resultado (ficha do motor). */
function origem(f: any, campo: string): string {
  const c = f.campos;
  const nat = (d: any) => `${d.classe === "OBSERVADO" ? "observado" : d.classe === "PRESUMIDO" ? "presumido" : "estimado"} · ${d.fonte}`;
  return ({
    tipo_imovel_sugerido: nat(c.tipo), uso_imovel_sugerido: nat(c.uso), tipo_vinculo_sugerido: nat(c.vinculo),
    plano_recomendado: `necessidades: ${(f.necessidades || []).filter((n: any) => n.sim).map((n: any) => n.codigo.toLowerCase()).join(", ") || "patrimônio"} · força ${f.forca}`,
    confianca_geral: f.confianca_motivo, elegivel: f.elegibilidade === "SIM" ? "nenhum impedimento do guia 9.1" : "",
    perguntas_confirmacao: `${f.perguntas.length} candidatas → ${perguntasDaTela(f).length} na tela do app`,
    coberturas_recomendadas: `${f.coberturas.length} linhas na planilha de coberturas`,
  } as Record<string, string>)[campo] || "";
}

function Celula({ children, w, fundo, negrito, direita, borda, linhas = 3 }: { children: ReactNode; w: number | string; fundo?: string; negrito?: boolean; direita?: boolean; borda?: boolean; linhas?: number }) {
  return (
    <View style={{ width: w as any, borderRightWidth: 1, borderBottomWidth: 1, borderColor: XL.grade, backgroundColor: fundo || XL.fundo, paddingHorizontal: 6, paddingVertical: 4, justifyContent: "center",
      ...(borda ? { outlineStyle: "solid", outlineWidth: 2, outlineColor: XL.verde, outlineOffset: -2, zIndex: 2 } as any : null) }}>
      <Text numberOfLines={linhas} style={{ fontFamily: FONTE, fontSize: 12.5, lineHeight: 17, color: XL.texto, fontWeight: negrito ? "700" : "400", textAlign: direita ? "right" : "left" }}>{children}</Text>
    </View>
  );
}

function Grade({ colunas, linhas, destaque }: { colunas: { nome: string; w: number }[]; linhas: string[][]; destaque: (i: number) => boolean }) {
  return (
    <View style={{ borderLeftWidth: 1, borderTopWidth: 1, borderColor: XL.grade }}>
      <View style={{ flexDirection: "row" }}>
        <Celula w={34} fundo={XL.cabecalho}> </Celula>
        {colunas.map((c, i) => <Celula key={c.nome} w={c.w} fundo={XL.cabecalho}><Text style={{ color: XL.suave }}>{LETRAS[i]}</Text></Celula>)}
      </View>
      <View style={{ flexDirection: "row" }}>
        <Celula w={34} fundo={XL.cabecalho} direita>1</Celula>
        {colunas.map((c) => <Celula key={c.nome} w={c.w} fundo="#E2EFDA" negrito linhas={2}>{c.nome}</Celula>)}
      </View>
      {linhas.map((l, i) => {
        const on = destaque(i);
        return (
          <View key={i} style={{ flexDirection: "row" }}>
            <Celula w={34} fundo={on ? XL.selecao : XL.cabecalho} direita negrito={on}>{i + 2}</Celula>
            {l.map((v, j) => <Celula key={j} w={colunas[j].w} fundo={on ? XL.destaque : undefined} direita={VALOR.has(colunas[j].nome)} borda={on && j === 1} linhas={on ? 6 : 2}>{v}</Celula>)}
          </View>
        );
      })}
    </View>
  );
}

function Indicador({ rotulo, valor, sub, alerta }: { rotulo: string; valor: string; sub?: string; alerta?: boolean }) {
  return (
    <View style={{ flex: 1, minWidth: 104, backgroundColor: XL.fundo, borderWidth: 1, borderColor: alerta ? "#C65911" : XL.grade, borderRadius: 4, padding: 8 }}>
      <Text style={{ fontFamily: FONTE, fontSize: 11, color: XL.suave, textTransform: "uppercase", letterSpacing: 0.5 }}>{rotulo}</Text>
      <Text style={{ fontFamily: FONTE, fontSize: 17, fontWeight: "700", color: alerta ? "#C65911" : XL.verdeEscuro }}>{valor}</Text>
      {sub ? <Text style={{ fontFamily: FONTE, fontSize: 11, color: XL.suave }} numberOfLines={2}>{sub}</Text> : null}
    </View>
  );
}

function indicadores(s: Estado) {
  const f = s.f, a = f.campos.area, ps = perguntasDaTela(f);
  const mudou = s.plano !== f.plano;
  return [
    { rotulo: "Plano", valor: PLANOS[s.plano].nome, sub: mudou ? `motor indicou ${PLANOS[f.plano as keyof typeof PLANOS].nome}; mudou pela resposta` : `força: ${f.forca === "no_limite" ? "no limite" : "clara"}`, alerta: mudou || f.forca === "no_limite" },
    { rotulo: "Confiança", valor: nivelDaAnalise(s).nivel.replace("MEDIA", "MÉDIA"), sub: `motor: ${f.confianca.replace("MEDIA", "MÉDIA")}` },
    { rotulo: "Área", valor: `${a.natureza === "ESTIMADO" ? "≈ " : ""}${a.valor} m²`, sub: a.natureza === "ESTIMADO" ? `estimada · ${f.acerto?.area || "IPTU e luz"}` : "cadastrada", alerta: a.natureza === "ESTIMADO" },
    { rotulo: "Perguntas na tela", valor: String(ps.length), sub: ps.length ? `${Object.keys(s.resp).length} respondidas` : "nenhuma: 1 toque" },
    { rotulo: "Jornada", valor: (f.jornada || f.canal).replace(/_/g, " ").toLowerCase(), sub: `canal: ${f.canal === "ONE_CLICK" ? "1 toque" : "gerente"}` },
  ];
}

export function PainelPlanilha({ onMenu }: { onMenu: () => void }) {
  const { s } = useEstado();
  const rota = usePathname();
  const etapa = (ETAPAS.find((x) => x.rota.test(rota)) || ETAPAS[0]).e;
  const [abaManual, setAbaManual] = useState<{ rota: string; aba: Aba } | null>(null);
  const aba = abaManual?.rota === rota ? abaManual.aba : etapa.aba;
  const f = s.f, pl = f.planilha;
  const extras = f.motivo_extras || {};
  // na tela Conferir a grade já mostra o motivo inteiro; e, se a resposta mudou o plano, o fato que
  // explicava o plano antigo ("o roubo pesa menos para você") sai para não contradizer a tela
  const nomes = etapa.aba === "motivo" ? [] : etapa.partes.filter((p) => !(p === "fato" && s.plano !== f.plano));
  const partes = nomes.map((p) => {
    const noTexto = (f.motivo_partes || []).find((x: any) => x.parte === p);
    return noTexto ? { parte: p, texto: noTexto.texto, noTexto: true } : extras[p] ? { parte: p, texto: extras[p], noTexto: false } : null;
  }).filter(Boolean) as { parte: string; texto: string; noTexto: boolean }[];
  const arquivo = aba === "coberturas" ? "template_coberturas_times.csv" : "template_resultado_times.csv";

  let grade: ReactNode = null, celula = "";
  if (!pl) grade = <Text style={{ fontFamily: FONTE, color: XL.suave }}>Esta ficha não tem a planilha (rode python motor/gerar.py --entrega e npm run dados).</Text>;
  else if (aba === "resultado") {
    const campos = Object.keys(pl.resultado);
    const on = (i: number) => etapa.linhas.includes(campos[i]);
    const i0 = campos.findIndex((c) => etapa.linhas.includes(c));
    celula = i0 >= 0 ? `B${i0 + 2}` : "B2";
    grade = <Grade colunas={[{ nome: "coluna do template", w: 190 }, { nome: "valor gerado pelo motor", w: 330 }, { nome: "de onde veio (ficha do motor)", w: 250 }]}
      linhas={campos.map((c) => [c, String(pl.resultado[c] || "—"), origem(f, c)])} destaque={on} />;
  } else if (aba === "coberturas") {
    const extrasPlano = PLANOS[s.plano].extras as string[];
    const MAPA: Record<string, string> = { ROUBO_FURTO_ARROMBAMENTO: "roubo", QUEBRA_DE_VIDROS: "vidros", RESPONSABILIDADE_CIVIL_FAMILIAR: "rc", PERDA_PAGAMENTO_ALUGUEL: "aluguel", DESPESAS_EMERGENCIAIS: "despesas" };
    const on = (i: number) => etapa.coberturas === "todas" || extrasPlano.includes(MAPA[pl.coberturas[i].cobertura]);
    celula = "C2";
    grade = <Grade colunas={[{ nome: "cobertura", w: 230 }, { nome: "faixa_valor_min", w: 100 }, { nome: "faixa_valor_max", w: 100 }, { nome: "confianca", w: 78 }, { nome: "regra_calculo_utilizada", w: 330 }]}
      linhas={pl.coberturas.map((c: any) => [c.cobertura, reais(c.faixa_valor_min), reais(c.faixa_valor_max), c.confianca_estimativa, c.regra_calculo_utilizada])} destaque={on} />;
  } else {
    const ps = f.motivo_partes || [];
    celula = "K2";
    grade = <Grade colunas={[{ nome: "parte do motivo", w: 150 }, { nome: "texto (justificativa_recomendacao, em ordem)", w: 520 }, { nome: "palavras", w: 70 }]}
      linhas={ps.map((p: any) => [NOME_PARTE[p.parte] || p.parte, p.texto, String(p.texto.split(" ").length)])} destaque={() => true} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: XL.janela, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#BDBDBD" }}>
      {/* Barra do Excel */}
      <View style={{ backgroundColor: XL.verde, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 40, gap: 10 }}>
        <View style={{ width: 22, height: 22, borderRadius: 3, backgroundColor: XL.fundo, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: FONTE, fontWeight: "800", color: XL.verde, fontSize: 13 }}>X</Text>
        </View>
        <Text style={{ fontFamily: FONTE, color: "#fff", fontSize: 14, flex: 1 }} numberOfLines={1}>{arquivo} · gerado por motor/gerar.py · {f.imovel_id}</Text>
        <Pressable onPress={onMenu} accessibilityRole="button" style={{ backgroundColor: XL.verdeEscuro, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{ fontFamily: FONTE, color: "#fff", fontSize: 12.5 }}>Trocar caso</Text>
        </Pressable>
      </View>
      {/* Etapa e indicadores */}
      <View style={{ paddingHorizontal: 12, paddingTop: 10, gap: 8 }}>
        <Text style={{ fontFamily: FONTE, fontSize: 13, color: XL.suave }}>
          Tela do app agora: <Text style={{ fontWeight: "700", color: XL.texto }}>{etapa.nome}</Text> · {f.local.replace("Sao Paulo", "São Paulo").replace("Brasilia", "Brasília").replace("Goiania", "Goiânia")} · {f.complemento}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{indicadores(s).map((x) => <Indicador key={x.rotulo} {...x} />)}</View>
      </View>
      {/* Barra de fórmulas: a parte do motivo que esta tela usa */}
      <View style={{ margin: 12, marginBottom: 8, backgroundColor: XL.fundo, borderWidth: 1, borderColor: XL.grade, flexDirection: "row" }}>
        <View style={{ width: 54, borderRightWidth: 1, borderColor: XL.grade, alignItems: "center", justifyContent: "center", paddingVertical: 6 }}>
          <Text style={{ fontFamily: FONTE, fontSize: 12.5, color: XL.texto }}>{celula}</Text>
        </View>
        <View style={{ width: 30, borderRightWidth: 1, borderColor: XL.grade, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 14, color: XL.suave }}>fx</Text>
        </View>
        <View style={{ flex: 1, padding: 8, gap: 6 }}>
          <Text style={{ fontFamily: FONTE, fontSize: 11, color: XL.suave, textTransform: "uppercase", letterSpacing: 0.5 }}>O motivo nesta tela (justificativa_recomendacao)</Text>
          {partes.length ? partes.map((p) => (
            <Text key={p.parte} style={{ fontFamily: FONTE, fontSize: 13.5, lineHeight: 19, color: XL.texto }}>
              <Text style={{ fontWeight: "700", color: XL.verdeEscuro }}>{NOME_PARTE[p.parte]}{p.noTexto ? "" : " (calculado pelo motor)"}: </Text>{p.texto}
            </Text>
          )) : etapa.aba === "motivo" ? (
            <Text style={{ fontFamily: FONTE, fontSize: 13.5, lineHeight: 19, color: XL.texto }}>
              <Text style={{ fontWeight: "700", color: XL.verdeEscuro }}>Motivo completo: </Text>
              {(f.motivo_partes || []).length} partes, {String(pl?.resultado?.justificativa_recomendacao || "").split(" ").length} palavras. É a coluna justificativa_recomendacao do CSV de entrega, parte por parte, na ordem em que o cliente lê.
            </Text>
          ) : <Text style={{ fontFamily: FONTE, fontSize: 13.5, color: XL.suave }}>Esta tela não usa uma parte do motivo.</Text>}
        </View>
      </View>
      {/* A planilha */}
      <ScrollView style={{ flex: 1, marginHorizontal: 12, backgroundColor: XL.fundo }} contentContainerStyle={{ paddingBottom: 12 }}>
        <ScrollView horizontal>{grade}</ScrollView>
      </ScrollView>
      {/* Abas */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 12, height: 34, borderTopWidth: 1, borderColor: XL.grade, backgroundColor: XL.janela }}>
        {(["resultado", "coberturas", "motivo"] as Aba[]).map((a) => (
          <Pressable key={a} onPress={() => setAbaManual({ rota, aba: a })} style={{ paddingHorizontal: 14, paddingVertical: 6, backgroundColor: a === aba ? XL.fundo : "transparent", borderBottomWidth: a === aba ? 3 : 0, borderColor: XL.verde }}>
            <Text style={{ fontFamily: FONTE, fontSize: 12.5, color: a === aba ? XL.verdeEscuro : XL.suave, fontWeight: a === aba ? "700" : "400" }}>{a}</Text>
          </Pressable>
        ))}
        <Text style={{ fontFamily: FONTE, fontSize: 11.5, color: XL.suave, marginLeft: "auto", paddingBottom: 8 }}>linhas amarelas = o que esta tela usa</Text>
      </View>
    </View>
  );
}
