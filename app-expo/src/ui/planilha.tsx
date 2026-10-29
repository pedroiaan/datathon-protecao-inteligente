// Painel-planilha da demonstração (só no navegador largo, ao lado do iPhone): mostra, a cada tela,
// a linha EXATA das 2 planilhas de entrega que o motor gerou para este cliente (template_resultado_times.csv
// e template_coberturas_times.csv) e a parte do motivo que a tela usa.
// Só acompanha o app: não rola e não tem aba clicável; o único clique é o "Trocar cliente" do cabeçalho,
// para o vídeo ser gravado sem edição. Tem a cara de planilha (letras, números de linha, grade),
// com as cores e as fontes do app.
import { usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Estado, nivelDaAnalise, perguntasDaTela, useEstado } from "../logica/estado";
import { COB, MAPA_COB, NOME_CLIENTE, PLANOS } from "../logica/produto";
import { C, F } from "./tema";

type Aba = "resultado" | "coberturas" | "motivo";
type Etapa = { nome: string; aba: Aba; linhas: string[]; partes: string[]; coberturas?: "todas" | "extras" };

// Cada tela do app → o que a planilha destaca e qual parte do motivo ela mostra
const ETAPAS: { rota: RegExp; e: Etapa }[] = [
  { rota: /^\/$/, e: { nome: "Notificação", aba: "resultado", linhas: ["cliente_id", "imovel_id", "elegivel"], partes: ["abertura"] } },
  { rota: /^\/seguro/, e: { nome: "Entrada no app", aba: "resultado", linhas: ["tipo_imovel_sugerido", "uso_imovel_sugerido", "tipo_vinculo_sugerido"], partes: ["em_jogo"] } },
  { rota: /^\/casa/, e: { nome: "1 · Sua casa", aba: "resultado", linhas: ["tipo_imovel_sugerido", "uso_imovel_sugerido", "tipo_vinculo_sugerido", "confianca_geral", "perguntas_confirmacao"], partes: ["confianca", "limite", "fato"] } },
  { rota: /^\/cobre/, e: { nome: "2 · O que cobre", aba: "coberturas", linhas: [], partes: ["risco", "em_jogo"], coberturas: "todas" } },
  { rota: /^\/plano/, e: { nome: "3 · Seu plano", aba: "resultado", linhas: ["plano_recomendado", "coberturas_recomendadas", "justificativa_recomendacao"], partes: ["porque", "menos", "limite", "acima"] } },
  { rota: /^\/ajuste/, e: { nome: "Personalizar", aba: "coberturas", linhas: [], partes: ["menos"], coberturas: "extras" } },
  { rota: /^\/conferir/, e: { nome: "4 · Conferir", aba: "motivo", linhas: [], partes: [] } },
  { rota: /^\/(sucesso|meu)/, e: { nome: "5 · Contratado", aba: "resultado", linhas: ["plano_recomendado", "coberturas_recomendadas", "confianca_geral"], partes: ["confianca"] } },
  { rota: /^\/(gerente|avisado|retorno|ajustada)/, e: { nome: "Gerente", aba: "resultado", linhas: ["confianca_geral", "perguntas_confirmacao"], partes: ["confirmar", "confianca"] } },
  { rota: /^\/painel/, e: { nome: "Portal do gerente", aba: "resultado", linhas: ["cliente_id", "imovel_id", "plano_recomendado", "confianca_geral", "perguntas_confirmacao"], partes: ["porque", "confianca"] } },
];
const NOME_PARTE: Record<string, string> = { abertura: "Abertura", porque: "Porquê", fato: "Fato dos vizinhos", em_jogo: "Valor em jogo",
  risco: "Risco da cidade", menos: "Se escolher menos", limite: "No limite", acima: "Plano acima", confirmar: "Confirmar", atencao: "Atenção",
  confianca: "Confiança", nao_elegivel: "Não elegível" };
const LETRAS = "ABCDE";
const DESTAQUE = "#FFF7C2";   // o amarelo do BB, bem claro, como a célula selecionada
const reais = (v: any) => (v === "" || v == null ? "" : `R$ ${Number(v).toLocaleString("pt-BR")}`);
const nivelTexto = (n: string) => n.replace("MEDIA", "Média").replace("ALTA", "Alta").replace("BAIXA", "Baixa");

/** De onde veio cada campo da linha de resultado (ficha do motor). */
function origem(f: any, campo: string): string {
  const c = f.campos;
  const nat = (d: any) => `${d.classe === "OBSERVADO" ? "observado" : d.classe === "PRESUMIDO" ? "presumido" : "estimado"}: ${d.fonte}`;
  return ({
    tipo_imovel_sugerido: nat(c.tipo), uso_imovel_sugerido: nat(c.uso), tipo_vinculo_sugerido: nat(c.vinculo),
    plano_recomendado: `necessidades: ${(f.necessidades || []).filter((n: any) => n.sim).map((n: any) => n.codigo.toLowerCase()).join(", ") || "patrimônio"} · força ${f.forca === "no_limite" ? "no limite" : "clara"}`,
    confianca_geral: f.confianca_motivo, elegivel: f.elegibilidade === "SIM" ? "nenhum impedimento do guia 9.1" : "",
    perguntas_confirmacao: `${f.perguntas.length} candidatas → ${perguntasDaTela(f).length} na tela do app`,
    coberturas_recomendadas: `${f.coberturas.length} linhas na aba coberturas`,
    cliente_id: "base Teste Comum", imovel_id: "base Teste Comum",
  } as Record<string, string>)[campo] || "";
}

type Coluna = { nome: string; flex: number; direita?: boolean };

function Grade({ colunas, linhas, destaque, linhasNoDestaque = 2 }: { colunas: Coluna[]; linhas: string[][]; destaque: (i: number) => boolean; linhasNoDestaque?: number }) {
  const celula = { paddingHorizontal: 8, paddingVertical: 3.5, borderRightWidth: 1, borderColor: C.divisoria, justifyContent: "center" as const };
  return (
    <View style={{ borderRadius: 14, borderWidth: 1, borderColor: C.borda, overflow: "hidden", backgroundColor: C.branco }}>
      {/* letras das colunas */}
      <View style={{ flexDirection: "row", backgroundColor: C.fundo, borderBottomWidth: 1, borderColor: C.divisoria }}>
        <View style={[celula, { width: 30, paddingVertical: 2 }]} />
        {colunas.map((c, i) => (
          <View key={c.nome} style={[celula, { flex: c.flex, paddingVertical: 2, alignItems: "center" }]}>
            <Text style={{ fontFamily: F.m, fontSize: 10.5, color: C.apagado }}>{LETRAS[i]}</Text>
          </View>
        ))}
      </View>
      {/* nomes das colunas (linha 1 do CSV) */}
      <View style={{ flexDirection: "row", backgroundColor: C.azulFundo, borderBottomWidth: 1, borderColor: C.borda }}>
        <View style={[celula, { width: 30, alignItems: "flex-end" }]}><Text style={{ fontFamily: F.m, fontSize: 11, color: C.apagado }}>1</Text></View>
        {colunas.map((c) => (
          <View key={c.nome} style={[celula, { flex: c.flex }]}>
            <Text numberOfLines={1} style={{ fontFamily: F.s, fontSize: 11.5, color: C.azulEscuro, textAlign: c.direita ? "right" : "left" }}>{c.nome}</Text>
          </View>
        ))}
      </View>
      {linhas.map((l, i) => {
        const on = destaque(i);
        return (
          <View key={i} style={{ flexDirection: "row", backgroundColor: on ? DESTAQUE : C.branco, borderBottomWidth: i < linhas.length - 1 ? 1 : 0, borderColor: C.divisoria }}>
            <View style={[celula, { width: 30, alignItems: "flex-end", borderLeftWidth: 3, borderLeftColor: on ? C.azul : "transparent", paddingLeft: 2 }]}>
              <Text style={{ fontFamily: on ? F.s : F.m, fontSize: 11, color: on ? C.azul : C.apagado }}>{i + 2}</Text>
            </View>
            {l.map((v, j) => (
              <View key={j} style={[celula, { flex: colunas[j].flex }]}>
                <Text numberOfLines={on ? linhasNoDestaque : 1}
                  style={{ fontFamily: on && j === 1 ? F.b : F.r, fontSize: 12, lineHeight: 16, color: on ? C.texto : C.apagado, textAlign: colunas[j].direita ? "right" : "left" }}>
                  {v || " "}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function indicadores(s: Estado) {
  const f = s.f, a = f.campos.area, ps = perguntasDaTela(f);
  const mudou = s.plano !== f.plano;
  return [
    { rotulo: "Plano", valor: PLANOS[s.plano].nome, sub: mudou ? `era ${PLANOS[f.plano as keyof typeof PLANOS].nome}: mudou pela resposta` : f.forca === "no_limite" ? "no limite" : "decisão clara", alerta: mudou || f.forca === "no_limite" },
    { rotulo: "Confiança", valor: nivelTexto(nivelDaAnalise(s).nivel), sub: `motor: ${nivelTexto(f.confianca)}` },
    { rotulo: "Área", valor: `${a.natureza === "ESTIMADO" ? "≈ " : ""}${a.valor} m²`, sub: a.natureza === "ESTIMADO" ? "estimada pelo IPTU e luz" : "cadastrada", alerta: a.natureza === "ESTIMADO" },
    { rotulo: "Perguntas", valor: String(ps.length), sub: ps.length ? `${ps.filter((p: any) => s.resp[p.codigo]).length} respondida(s)` : "1 toque" },
    { rotulo: "Jornada", valor: f.jornada === "UM_TOQUE" ? "1 toque" : f.jornada === "GERENTE" ? "Gerente" : "App + perguntas", sub: f.canal === "ONE_CLICK" ? "sem pessoa no meio" : "com o gerente" },
  ];
}

export function PainelPlanilha({ onTrocar }: { onTrocar: () => void }) {
  const { s } = useEstado();
  const rota = usePathname();
  const etapa = (ETAPAS.find((x) => x.rota.test(rota)) || ETAPAS[0]).e;
  const aba = etapa.aba;
  const f = s.f, pl = f.planilha, extras = f.motivo_extras || {};
  // se a resposta mudou o plano, o fato que explicava o plano antigo sai para não contradizer a tela
  const partes = etapa.partes.filter((p) => !(p === "fato" && s.plano !== f.plano)).map((p) => {
    const noTexto = (f.motivo_partes || []).find((x: any) => x.parte === p);
    return noTexto ? { parte: p, texto: noTexto.texto, noTexto: true } : extras[p] ? { parte: p, texto: extras[p], noTexto: false } : null;
  }).filter(Boolean).slice(0, 3) as { parte: string; texto: string; noTexto: boolean }[];
  const arquivo = aba === "coberturas" ? "template_coberturas_times.csv" : "template_resultado_times.csv";
  const cidadeUf = f.local.replace("Sao Paulo", "São Paulo").replace("Brasilia", "Brasília").replace("Goiania", "Goiânia");

  let grade = null, celula = "B2";
  if (pl && aba === "resultado") {
    const campos = Object.keys(pl.resultado);
    const i0 = campos.findIndex((c) => etapa.linhas.includes(c));
    celula = `B${Math.max(0, i0) + 2}`;
    grade = <Grade colunas={[{ nome: "coluna", flex: 2.2 }, { nome: "valor gerado pelo motor", flex: 3.6 }, { nome: "de onde veio", flex: 3 }]}
      linhas={campos.map((c) => [c, String(pl.resultado[c] || "—"), etapa.linhas.includes(c) ? origem(f, c) : ""])}
      destaque={(i) => etapa.linhas.includes(campos[i])} />;
  } else if (pl && aba === "coberturas") {
    const extrasPlano = PLANOS[s.plano].extras as string[];
    const on = (i: number) => etapa.coberturas === "todas" || extrasPlano.includes(MAPA_COB[pl.coberturas[i].cobertura]);
    celula = "D2";
    grade = <Grade colunas={[{ nome: "cobertura", flex: 3 }, { nome: "faixa_valor_min", flex: 1.6, direita: true }, { nome: "faixa_valor_max", flex: 1.6, direita: true }, { nome: "confianca", flex: 1.1 }]}
      linhas={pl.coberturas.map((c: any) => [COB[MAPA_COB[c.cobertura]]?.curto || (c.cobertura === "QUEDA_AERONAVE" ? "Queda de aeronave" : c.cobertura), reais(c.faixa_valor_min), reais(c.faixa_valor_max), nivelTexto(c.confianca_estimativa)])}
      destaque={on} linhasNoDestaque={1} />;
  } else if (pl) {
    celula = "K2";
    grade = <Grade colunas={[{ nome: "parte do motivo", flex: 1.6 }, { nome: "justificativa_recomendacao, na ordem", flex: 6 }, { nome: "palavras", flex: 0.9, direita: true }]}
      linhas={(f.motivo_partes || []).map((p: any) => [NOME_PARTE[p.parte] || p.parte, p.texto, String(p.texto.split(" ").length)])}
      destaque={() => true} linhasNoDestaque={4} />;
  }

  return (
    <View pointerEvents="box-none" style={{ flex: 1, backgroundColor: C.branco, borderRadius: 28, overflow: "hidden", userSelect: "none",
      boxShadow: "0 1px 2px rgba(28,34,102,0.06), 0 12px 40px rgba(28,34,102,0.14)" } as any}>
      {/* Cabeçalho: de onde vêm os dados e a etapa do app */}
      <View style={{ backgroundColor: C.noite, paddingHorizontal: 22, paddingTop: 16, gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontFamily: F.s, fontSize: 11.5, letterSpacing: 1.2, color: C.azulSuave, textTransform: "uppercase" }}>Planilha gerada pelo motor · {NOME_CLIENTE[s.caso] || f.cliente_id}</Text>
            <Text numberOfLines={1} style={{ fontFamily: F.x, fontSize: 19, color: C.branco }}>{cidadeUf} · {f.imovel_id}</Text>
          </View>
          <View style={{ backgroundColor: C.amarelo, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Text style={{ fontFamily: F.s, fontSize: 12.5, color: C.noite }}>Tela: {etapa.nome}</Text>
          </View>
          {/* o único controle do painel: trocar o cliente da demonstração (fora do iPhone, no estilo do app) */}
          <Pressable onPress={onTrocar} accessibilityRole="button" accessibilityLabel={`Trocar o cliente. Agora: ${NOME_CLIENTE[s.caso] || f.cliente_id}`}
            style={({ hovered, pressed }: any) => ({ flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6,
              backgroundColor: hovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.28)",
              transform: [{ scale: pressed ? 0.96 : 1 }], transitionProperty: "background-color, transform", transitionDuration: "150ms", cursor: "pointer" } as any)}>
            <Feather name="repeat" size={14} color={C.branco} />
            <Text style={{ fontFamily: F.s, fontSize: 12.5, color: C.branco }}>Trocar cliente</Text>
          </Pressable>
        </View>
        {/* abas só indicam o arquivo da tela (não são clicáveis) */}
        <View style={{ flexDirection: "row", gap: 20 }}>
          {(["resultado", "coberturas", "motivo"] as Aba[]).map((a) => (
            <View key={a} style={{ paddingBottom: 9, borderBottomWidth: 3, borderColor: a === aba ? C.amarelo : "transparent" }}>
              <Text style={{ fontFamily: a === aba ? F.s : F.m, fontSize: 13, color: a === aba ? C.branco : C.azulSuave }}>{a}</Text>
            </View>
          ))}
          <Text numberOfLines={1} style={{ marginLeft: "auto", fontFamily: F.r, fontSize: 12, color: C.azulSuave, paddingBottom: 9 }}>{arquivo}</Text>
        </View>
      </View>

      <View style={{ flex: 1, padding: 18, gap: 14 }}>
        {/* As métricas do momento */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {indicadores(s).map((x) => (
            <View key={x.rotulo} style={{ flex: 1, backgroundColor: x.alerta ? C.ambarClaro : C.azulFundo, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 9, gap: 1 }}>
              <Text style={{ fontFamily: F.s, fontSize: 10.5, letterSpacing: 0.8, textTransform: "uppercase", color: x.alerta ? C.ambar : C.suave }}>{x.rotulo}</Text>
              <Text numberOfLines={1} style={{ fontFamily: F.x, fontSize: 18, lineHeight: 23, color: x.alerta ? C.ambar : C.azulEscuro }}>{x.valor}</Text>
              <Text numberOfLines={1} style={{ fontFamily: F.r, fontSize: 11, color: C.suave }}>{x.sub}</Text>
            </View>
          ))}
        </View>

        {/* Barra de fórmulas: o pedaço do motivo que esta tela usa */}
        <View style={{ flexDirection: "row", borderRadius: 14, borderWidth: 1, borderColor: C.borda, overflow: "hidden" }}>
          <View style={{ width: 56, backgroundColor: C.azulFundo, alignItems: "center", justifyContent: "center", gap: 2, borderRightWidth: 1, borderColor: C.borda }}>
            <Text style={{ fontFamily: F.xi, fontSize: 16, color: C.azul }}>fx</Text>
            <Text style={{ fontFamily: F.m, fontSize: 11, color: C.apagado }}>{celula}</Text>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 6 }}>
            <Text style={{ fontFamily: F.s, fontSize: 10.5, letterSpacing: 0.8, textTransform: "uppercase", color: C.suave }}>O motivo nesta tela</Text>
            {aba === "motivo" ? (
              <Text style={{ fontFamily: F.r, fontSize: 13.5, lineHeight: 19, color: C.texto }}>
                <Text style={{ fontFamily: F.s, color: C.azulEscuro }}>Motivo completo: </Text>
                {(f.motivo_partes || []).length} partes, {String(pl?.resultado?.justificativa_recomendacao || "").split(" ").length} palavras. É a coluna justificativa_recomendacao do CSV, parte por parte, na ordem em que o cliente lê.
              </Text>
            ) : partes.length ? partes.map((p) => (
              <Text key={p.parte} numberOfLines={3} style={{ fontFamily: F.r, fontSize: 13.5, lineHeight: 19, color: C.texto }}>
                <Text style={{ fontFamily: F.s, color: C.azulEscuro }}>{NOME_PARTE[p.parte]}{p.noTexto ? "" : " (calculado pelo motor)"}: </Text>{p.texto}
              </Text>
            )) : <Text style={{ fontFamily: F.r, fontSize: 13.5, color: C.suave }}>Esta tela não usa uma parte do motivo.</Text>}
          </View>
        </View>

        {/* A planilha (cabe inteira: sem rolagem) */}
        <View style={{ flex: 1, overflow: "hidden" }}>
          {grade || <Text style={{ fontFamily: F.r, color: C.suave }}>Esta ficha não tem a planilha (rode python motor/gerar.py --entrega e npm run dados).</Text>}
        </View>
        <Text style={{ fontFamily: F.r, fontSize: 11.5, color: C.apagado }}>
          Linhas em amarelo: o que esta tela do app usa. Valores copiados do CSV de entrega, sem edição.
        </Text>
      </View>
    </View>
  );
}
