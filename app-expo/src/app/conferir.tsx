// 5/5 · Conferir e contratar, no padrão de checkout de app de entrega: imóvel, plano, prazo e
// pagamento num lugar só, cada um com "Alterar". Antes de confirmar, uma folha repete tudo.
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { ajustado, incluidas, preco, precoFinal, tipoAtual, useEstado } from "@/logica/estado";
import { DESCONTO, PLANOS } from "@/logica/produto";
import { aprox, brl2, cidade, NOME_TIPO, titulo, uf } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { SeloAjustado, Botao, Card, Contador, Entra, haptic, Rotulo, T, Titulo, Toque } from "@/ui/base";
import { Tela } from "@/ui/tela";
import { useFolha } from "@/ui/folha";
import { C, F, TIPO } from "@/ui/tema";

function Linha({ ic, rot, titulo: t, sub }: { ic: string; rot?: string; titulo: string; sub?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center" }}><Feather name={ic as any} size={19} color={C.azul} /></View>
      <View style={{ flex: 1 }}>
        {rot ? <T s={{ fontSize: 12.5, color: C.suave }}>{rot}</T> : null}
        <T s={{ fontFamily: F.b, fontSize: 16 }}>{t}</T>
        {sub ? <T s={{ fontSize: 13, color: C.suave, lineHeight: 18 }}>{sub}</T> : null}
      </View>
    </View>
  );
}
/** Seção do checkout. `selo` fica no cabeçalho, ao lado do nome da seção: nunca por cima do conteúdo. */
function Secao({ rot, alterar, children, i, selo }: { rot: string; alterar?: () => void; children: React.ReactNode; i: number; selo?: React.ReactNode }) {
  return (
    <Card i={i}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <T s={{ ...TIPO.rotulo, color: C.suave }}>{rot}</T>
        <View style={{ flex: 1, flexDirection: "row" }}>{selo}</View>
        {alterar ? <Pressable onPress={alterar} hitSlop={12} accessibilityRole="button" accessibilityLabel={`Alterar ${rot.toLowerCase()}`}><T s={{ fontFamily: F.s, fontSize: 14, color: C.azulEscuro }}>Alterar</T></Pressable> : null}
      </View>
      {children}
    </Card>
  );
}

// Formas de pagamento oferecidas no app (débito em conta é o padrão do BB)
const PAGAMENTO = {
  DEBITO: { ic: "dollar-sign", titulo: "Débito na sua conta BB", sub: "Todo dia 10 · sem boleto", curto: "débito em conta" },
  CARTAO: { ic: "credit-card", titulo: "Cartão de crédito Ourocard", sub: "Cobrança mensal na fatura", curto: "cartão Ourocard" },
  PIX: { ic: "zap", titulo: "Pix automático", sub: "Autorização única, cobrança todo mês", curto: "Pix automático" },
} as const;

export default function Conferir() {
  const { s, set } = useEstado();
  const ajuda = useAjuda("conferir");
  const folha = useFolha();
  const [carregando, setCarregando] = useState(false);
  const f = s.f, p = PLANOS[s.plano], m = preco(s), fin = precoFinal(s);
  const nomePlano = p.nome + (s.plano !== "TOTAL" && s.ligadas.rc ? " + danos a terceiros" : "");
  const ok = s.entend[0] && s.entend[1];
  const trocarPagamento = () => {
    haptic.leve();
    folha.abrir(
      <View>
        {(Object.keys(PAGAMENTO) as (keyof typeof PAGAMENTO)[]).map((k, i) => {
          const on = s.pagamento === k, p = PAGAMENTO[k];
          return (
            <Pressable key={k} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => { haptic.toque(); set((x) => ({ ...x, pagamento: k })); folha.fechar(); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: C.divisoria }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center" }}><Feather name={p.ic} size={19} color={C.azul} /></View>
              <View style={{ flex: 1 }}><T s={{ fontFamily: on ? F.s : F.b, fontSize: 16, color: on ? C.azul : C.texto }}>{p.titulo}</T><T s={{ fontSize: 13, color: C.suave }}>{p.sub}</T></View>
              {on ? <Feather name="check" size={20} color={C.azul} /> : null}
            </Pressable>
          );
        })}
      </View>,
      "Como você quer pagar?",
    );
  };

  const finalizar = () => {
    setCarregando(true);
    setTimeout(() => { folha.fechar(); setCarregando(false); router.replace("/sucesso"); }, 900);
  };
  const confirmar = () => {
    haptic.leve();
    folha.abrir(
      <View>
        <T s={{ color: C.suave, fontSize: 14, marginBottom: 10 }}>Confira antes de confirmar. Depois, é só acompanhar em Meu seguro.</T>
        <View style={{ backgroundColor: C.fundo, borderRadius: 16, paddingHorizontal: 14 }}>
          {[["map-pin", "Imóvel", `${titulo(f.complemento)} · ${cidade(f)}/${uf(f)}`], ["shield", "Plano", nomePlano],
            ["calendar", "Vigência", `${s.vig} ${s.vig > 1 ? "anos" : "ano"} · começa amanhã`], [PAGAMENTO[s.pagamento].ic, "Pagamento", `12x de ${brl2(fin)} · ${PAGAMENTO[s.pagamento].curto}`]].map(([ic, r, t], i) => (
            <View key={r} style={{ paddingVertical: 12, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: "#E6E8EC" }}><Linha ic={ic} rot={r} titulo={t} /></View>
          ))}
        </View>
        <View style={{ gap: 10, marginTop: 16 }}>
          <BotaoConfirma onPress={finalizar} />
          <Botao tipo="claro" titulo="Voltar e alterar" onPress={() => folha.fechar()} />
        </View>
      </View>,
      "Está tudo certo?",
    );
  };

  return (
    <Tela passo={5} rotulo="Conferir e contratar" fala={`Confira e pronto. ${nomePlano}, ${titulo(f.complemento)}, ${cidade(f)}. Você paga ${brl2(fin)} por mês. Antes de contratar, confirme que entendeu o que o plano não cobre.`} onVoltar={() => router.back()} onFechar={() => router.dismissAll()} onAjuda={ajuda}
      rodape={<Botao titulo={`Contratar · 12x de ${brl2(fin)}`} desabilitado={!ok} carregando={carregando} onPress={confirmar} />}>
      <Titulo antes="Confira e " destaque="pronto" />
      <View style={{ height: 10 }} />
      <Secao i={1} rot="Imóvel protegido" alterar={() => router.navigate("/casa")}>
        <Linha ic="map-pin" titulo={titulo(f.complemento)} sub={`${cidade(f)}/${uf(f)} · ${NOME_TIPO[tipoAtual(s)].toLowerCase()} de ${f.campos.area.classe === "OBSERVADO" ? "" : "cerca de "}${f.campos.area.valor} m²`} />
      </Secao>
      <Secao i={2} rot="Seu plano" alterar={() => router.navigate("/plano")} selo={ajustado(s) ? <SeloAjustado gerente={s.ajustada} /> : null}>
        <Linha ic="shield" titulo={nomePlano} sub={`${incluidas(s).filter((k) => s.ligadas[k] !== false).length} coberturas · ${p.pacotes} ${p.pacotes > 1 ? "assistências" : "assistência"} · incêndio até ${aprox(s.valores.incendio)}`} />
      </Secao>
      <Secao i={3} rot="Vigência">
        <View style={{ flexDirection: "row", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((a) => (
            <Toque key={a} onPress={() => { haptic.toque(); set((x) => ({ ...x, vig: a })); }}
              style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 12, borderWidth: 1.5, borderColor: a === s.vig ? C.azul : C.borda, backgroundColor: a === s.vig ? C.azulFundo : C.branco }}>
              <T s={{ fontFamily: F.x, fontSize: 14, color: a === s.vig ? C.azulEscuro : C.texto }}>{a} {a > 1 ? "anos" : "ano"}</T>
              <T s={{ fontFamily: F.b, fontSize: 11.5, color: C.positivo }}>{DESCONTO[a] ? `−${(Math.round(DESCONTO[a] * 1000) / 10).toLocaleString("pt-BR")}%` : " "}</T>
            </Toque>
          ))}
        </View>
        <T s={{ fontSize: 13, color: C.suave, marginTop: 8 }}>{s.vig > 1 ? `Você economiza ${brl2((m - fin) * 12 * s.vig)} em ${s.vig} anos.` : "Escolha mais anos para ganhar desconto."}</T>
      </Secao>
      <Secao i={4} rot="Pagamento" alterar={trocarPagamento}>
        <Linha ic={PAGAMENTO[s.pagamento].ic} titulo={PAGAMENTO[s.pagamento].titulo} sub={PAGAMENTO[s.pagamento].sub} />
      </Secao>
      <Card i={5}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 }}><T s={{ color: C.suave }}>Plano {p.nome} por mês</T><T s={{ fontFamily: F.b }}>{brl2(m)}</T></View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 }}><T s={{ color: C.suave }}>Desconto de {s.vig} {s.vig > 1 ? "anos" : "ano"}</T><T s={{ fontFamily: F.b, color: C.positivo }}>− {brl2(m - fin)}</T></View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: C.borda, borderStyle: "dashed", marginTop: 8, paddingTop: 10 }}>
          <T s={{ fontFamily: F.b, fontSize: 16 }}>Você paga por mês</T>
          <Contador valor={fin} fmt={brl2} s={{ fontFamily: F.k, fontSize: 22, lineHeight: 28, color: C.azulEscuro }} />
        </View>
      </Card>
      <Entra i={6}><Rotulo>Antes de contratar</Rotulo></Entra>
      <Card i={7} style={{ paddingVertical: 6 }}>
        {["Entendi que nenhum plano cobre desgaste natural nem obra.", "Confirmo que o imóvel não está em obra ou reforma e é de alvenaria."].map((t, i) => {
          const on = s.entend[i];
          return (
            <Pressable key={t} accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => { haptic.toque(); set((x) => { const e: [boolean, boolean] = [...x.entend] as any; e[i] = !e[i]; return { ...x, entend: e }; }); }}
              style={{ flexDirection: "row", gap: 12, paddingVertical: 11, alignItems: "flex-start" }}>
              <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: on ? C.azul : C.borda, backgroundColor: on ? C.azul : C.branco, alignItems: "center", justifyContent: "center", transitionProperty: ["backgroundColor", "borderColor"], transitionDuration: 150 } as any}>
                {on ? <Feather name="check" size={15} color={C.branco} /> : null}
              </View>
              <T s={{ flex: 1, fontSize: 14.5 }}>{t}</T>
            </Pressable>
          );
        })}
      </Card>
      <T s={{ fontSize: 13, color: C.suave, marginTop: 4 }}>Mudou de ideia? Você pode desistir em até 7 dias pelo app, com o dinheiro de volta.</T>
    </Tela>
  );
}

function BotaoConfirma({ onPress }: { onPress: () => void }) {
  const [c, setC] = useState(false);
  return <Botao titulo="Confirmar contratação" carregando={c} onPress={() => { setC(true); onPress(); }} />;
}
