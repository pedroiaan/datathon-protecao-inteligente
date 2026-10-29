// Meu seguro (refeito): cartão da apólice, atalhos para quando algo acontece, quanto cada
// cobertura protege, assistências, próximos passos com datas e o seguro que acompanha a casa.
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, withRepeat, Easing } from "react-native-reanimated";
import { ajustado, estadoDoCaso, tipoAtual, incluidas, precoFinal, useEstado } from "@/logica/estado";
import { COB, PACOTES, PLANOS } from "@/logica/produto";
import { aprox, brl2, cidade, titulo, uf } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { SeloAjustado, Botao, Card, Entra, haptic, Icone, Rotulo, T, Toque } from "@/ui/base";
import { Tela } from "@/ui/tela";
import { useFolha } from "@/ui/folha";
import { CasaProtegida } from "@/ui/ilustracoes";
import { C, EASE_OUT, F } from "@/ui/tema";

function Pulso() {
  const v = useSharedValue(0);
  useEffect(() => { v.set(withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1, false)); }, [v]);
  const st = useAnimatedStyle(() => ({ opacity: 0.6 * (1 - v.get()), transform: [{ scale: 1 + v.get() * 1.4 }] }));
  return (
    <View style={{ width: 9, height: 9 }}>
      <Animated.View style={[{ position: "absolute", width: 9, height: 9, borderRadius: 5, backgroundColor: "#FCFC30" }, st]} />
      <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: "#FCFC30" }} />
    </View>
  );
}

// O que cada cobertura paga, em palavras de cliente
const PAGA: Record<string, string> = {
  incendio: "Reconstruir e repor seus bens", eletricos: "Aparelhos queimados por pico de energia", agua: "Estragos de chuva, alagamento e cano",
  vendaval: "Telhado e janelas depois do vento", impacto: "Muro, portão e fachada", roubo: "O que levarem num arrombamento",
  vidros: "Janelas, box e espelhos", rc: "Danos que você cause a terceiros", aluguel: "Moradia enquanto a casa é reparada", despesas: "Emergências para o dano não aumentar",
};
const PRIORIDADE = ["incendio", "agua", "eletricos", "roubo", "rc", "vendaval", "vidros", "aluguel", "despesas", "impacto"];

/** Medidor: a barra cheia é o que calculamos para a sua casa; o preenchimento é quanto o seguro cobre. */
function Medidor({ fracao, ok, i }: { fracao: number; ok: boolean; i: number }) {
  const w = useSharedValue(0);
  useEffect(() => { w.set(withDelay(250 + i * 70, withTiming(fracao, { duration: 800, easing: EASE_OUT }))); }, [fracao, i, w]);
  const st = useAnimatedStyle(() => ({ width: `${w.get() * 100}%` }));
  return (
    <View style={{ height: 10, borderRadius: 5, backgroundColor: "#ECEEF2", overflow: "hidden" }}>
      <Animated.View style={[{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 5, backgroundColor: ok ? C.azul : "#9AA8FF" }, st]} />
    </View>
  );
}

export default function Meu() {
  const { s, set } = useEstado();
  const ajuda = useAjuda("meu");
  const folha = useFolha();
  const f = s.f, p = PLANOS[s.plano], inc = incluidas(s).filter((k) => s.ligadas[k] !== false);
  const dia = useMemo(() => (d: number) => { const x = new Date(2026, 9, 29); x.setDate(x.getDate() + d); return x.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", ""); }, []);

  const assistencia = () => folha.abrir(
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {[["Vazamento", "agua"], ["Sem luz", "raio"], ["Chaveiro", "key"], ["Vidro quebrado", "vidro"], ["Eletrodoméstico", "tool"], ["Outro", "plus"]].map(([n, ic]) => (
        <Toque key={n} onPress={() => { haptic.toque(); folha.fechar(); folha.toast(`Pedido aberto: ${n.toLowerCase()}. O profissional chega em até 3 h.`); }}
          style={{ width: "31.5%", alignItems: "center", paddingVertical: 14, borderRadius: 14, backgroundColor: C.fundo }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center", marginBottom: 6 }}><Icone n={ic} tam={19} /></View>
          <T s={{ fontFamily: F.m, fontSize: 13 }}>{n}</T>
        </Toque>
      ))}
      <T s={{ fontSize: 12.5, color: C.suave, marginTop: 6 }}>Atendimento 24h. Peças até R$ 100 incluídas, conforme o pacote.</T>
    </View>, "Qual é o problema?");
  const sinistro = () => folha.abrir(
    <View>
      <T s={{ color: C.suave, fontSize: 14, marginBottom: 8 }}>Conte o que aconteceu. Fotos ajudam, mas não são obrigatórias agora.</T>
      {[["Água ou alagamento", "agua"], ["Raio ou queda de energia", "raio"], ["Roubo ou arrombamento", "ladrao"], ["Vento ou granizo", "vento"], ["Incêndio", "fogo"]].map(([t, ic]) => (
        <Pressable key={t} onPress={() => { haptic.toque(); folha.fechar(); folha.toast("Aviso registrado. Retornamos em até 24 h."); }}
          style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#EEF0F3" }}>
          <Icone n={ic} tam={20} /><T s={{ flex: 1, fontFamily: F.b }}>{t}</T><Feather name="chevron-right" size={20} color={C.suave} />
        </Pressable>
      ))}
    </View>, "Avisar um sinistro");

  return (
    <Tela titulo="Meu seguro" onVoltar={() => router.dismissAll()} onAjuda={ajuda} fala={`${tipoAtual(s) === "APARTAMENTO" ? "Seu apê está protegido" : "Sua casa está protegida"}. Plano ${p.nome}, ativo a partir de amanhã, ${brl2(precoFinal(s))} por mês. Se acontecer alguma coisa, peça assistência ou avise um sinistro aqui.`}
      rodape={<Botao tipo="claro" titulo="Recomeçar" onPress={() => { set(() => estadoDoCaso(s.caso)); router.dismissAll(); }} />}>
      <Entra i={0}>
        <View style={{ backgroundColor: C.azul, borderRadius: 22, padding: 18, overflow: "hidden", marginBottom: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5 }}>
            <Pulso /><T s={{ fontFamily: F.b, fontSize: 13, color: C.branco }}>Ativo a partir de amanhã</T>
          </View>
          {/* selo numa linha própria: a casa ilustrada ocupa o canto direito do cartão */}
          <T s={{ fontFamily: F.x, fontSize: 24, lineHeight: 30, color: C.branco, marginTop: 12 }}>Plano {p.nome}</T>
          {ajustado(s) ? <View style={{ marginTop: 2, marginBottom: 2 }}><SeloAjustado claro gerente={s.ajustada} /></View> : null}
          <T s={{ fontSize: 14, color: C.branco, opacity: 0.9, maxWidth: 210 }}>{titulo(f.complemento)} · {cidade(f)}/{uf(f)}</T>
          <View style={{ flexDirection: "row", gap: 18, marginTop: 16 }}>
            {[["Apólice", "BB 4021-7781"], ["Vigência", `${s.vig} ${s.vig > 1 ? "anos" : "ano"}`], ["Por mês", brl2(precoFinal(s))]].map(([k, v]) => (
              <View key={k}><T s={{ fontSize: 12, color: C.branco, opacity: 0.9 }}>{k}</T><T s={{ fontFamily: F.x, fontSize: 14.5, color: C.branco }}>{v}</T></View>
            ))}
          </View>
          <View style={{ position: "absolute", right: -6, top: 26 }}><CasaProtegida tam={104} /></View>
        </View>
      </Entra>
      <Entra i={1}><Rotulo>Aconteceu alguma coisa?</Rotulo></Entra>
      <Entra i={2}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[["Pedir\nassistência", "tool", assistencia, true], ["Avisar\nsinistro", "sirene", sinistro, false], ["O que\ncobre", "shield", () => router.push("/cobre"), false], ["Tirar\ndúvida", "duvida", ajuda, false]].map(([n, ic, fn, urg]: any) => (
            <Toque key={n} onPress={() => { haptic.toque(); fn(); }} style={{ alignItems: "center", gap: 8, width: 78 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: urg ? C.amarelo : C.azulClaro }}><Icone n={ic} tam={23} cor={urg ? C.azulEscuro : C.azul} /></View>
              <T s={{ fontFamily: F.m, fontSize: 13, lineHeight: 16, textAlign: "center" }}>{n}</T>
            </Toque>
          ))}
        </View>
      </Entra>
      <Entra i={3}>
        <Toque onPress={() => folha.toast("Combinado: avisamos quando suas compras mudarem o valor da sua casa")}
          style={{ flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: C.amarelo, borderRadius: 16, padding: 15, marginTop: 18, marginBottom: 12 }}>
          <Feather name="shopping-bag" size={26} color={C.azulEscuro} />
          <View style={{ flex: 1 }}>
            <T s={{ fontFamily: F.x, color: C.azulEscuro }}>Seu seguro acompanha o seu lar</T>
            <T s={{ fontSize: 13.5, lineHeight: 18, color: C.azulEscuro }}>Comprou um móvel ou eletrônico grande? Avisamos quando valer a pena aumentar a proteção, sem refazer nada.</T>
          </View>
        </Toque>
      </Entra>
      <Card i={4}>
        <T s={{ fontFamily: F.x, fontSize: 18 }}>Sua proteção</T>
        <T s={{ fontSize: 13.5, color: C.suave, marginTop: 2, marginBottom: 12 }}>Quanto o seguro paga em cada situação, comparado com o que calculamos para o seu imóvel.</T>
        <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 14, height: 8, borderRadius: 4, backgroundColor: C.azul }} /><T s={{ fontSize: 12, color: C.suave }}>coberto pelo seguro</T></View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 14, height: 8, borderRadius: 4, backgroundColor: "#ECEEF2" }} /><T s={{ fontSize: 12, color: C.suave }}>calculado para o seu imóvel</T></View>
        </View>
        {PRIORIDADE.filter((k) => inc.includes(k as any)).slice(0, 4).map((k, i) => {
          const v = s.valores[k as keyof typeof s.valores], fx = s.faixa[k as keyof typeof s.faixa];
          const fracao = fx ? Math.min(1, v / fx[1]) : 1, ok = !fx || v >= fx[0];
          return (
            <View key={k} style={{ paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: "#EEF0F3" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center" }}><Icone n={COB[k as keyof typeof COB].ic} tam={17} /></View>
                <View style={{ flex: 1 }}>
                  <T s={{ fontFamily: F.b, fontSize: 15 }}>{COB[k as keyof typeof COB].curto}</T>
                  <T s={{ fontSize: 12.5, color: C.suave }}>{PAGA[k]}</T>
                </View>
                <View style={{ alignItems: "flex-end" }}><T s={{ fontSize: 11.5, color: C.suave }}>paga até</T><T s={{ fontFamily: F.x, fontSize: 16 }}>{aprox(v)}</T></View>
              </View>
              <Medidor fracao={fracao} ok={ok} i={i} />
              <T s={{ fontSize: 12, marginTop: 5, color: ok ? C.azulEscuro : "#5B66C9", fontFamily: F.b }}>
                {!fx ? "Valor padrão do produto" : ok ? (fracao >= 0.999 ? "Cobre tudo o que calculamos" : `Cobre o essencial: calculamos ${aprox(fx[0])} a ${aprox(fx[1])}`) : `Abaixo do calculado (${aprox(fx[0])} a ${aprox(fx[1])}). Ajuste em Personalizar.`}
              </T>
            </View>
          );
        })}
        <Pressable onPress={() => router.push("/cobre")} style={{ paddingTop: 8 }}><T s={{ fontFamily: F.x, fontSize: 14, color: C.azulEscuro }}>Ver as {inc.length} coberturas</T></Pressable>
      </Card>
      <Card i={5}>
        <T s={{ fontFamily: F.x, fontSize: 18, marginBottom: 10 }}>Assistências 24h</T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {PACOTES.slice(0, p.pacotes).map(([n, ic]) => (
            <View key={n} style={{ width: "31.5%", alignItems: "center", paddingVertical: 12, borderRadius: 14, backgroundColor: C.fundo }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center", marginBottom: 6 }}><Icone n={ic} tam={17} /></View>
              <T s={{ fontFamily: F.m, fontSize: 12.5, lineHeight: 16, textAlign: "center" }}>{n}</T>
            </View>
          ))}
        </View>
      </Card>
      <Card i={6}>
        <T s={{ fontFamily: F.x, fontSize: 18, marginBottom: 12 }}>Próximos passos</T>
        {[["Contratado", "Hoje, pelo app", "feito"], ["Apólice no seu e-mail", `Até ${dia(1)}`, "agora"], ["Primeira parcela", `${dia(12)} · débito BB`, ""], ["Desistência grátis até", `${dia(7)} · com o dinheiro de volta`, ""]].map(([t, d, e], i, a) => (
          <View key={t} style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ alignItems: "center", width: 14 }}>
              <View style={{ width: 13, height: 13, borderRadius: 7, marginTop: 4, borderWidth: 2.5, borderColor: e === "feito" ? C.positivo : e === "agora" ? C.azul : "#C9CCD3", backgroundColor: e === "feito" ? C.positivo : e === "agora" ? C.azulClaro : C.branco }} />
              {i < a.length - 1 ? <View style={{ flex: 1, width: 2, backgroundColor: "#E6E8EC" }} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: 14 }}><T s={{ fontFamily: F.b }}>{t}</T><T s={{ fontSize: 13.5, color: C.suave }}>{d}</T></View>
          </View>
        ))}
      </Card>
    </Tela>
  );
}
