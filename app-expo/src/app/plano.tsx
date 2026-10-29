// 3/5 · Seleção de planos, no formato do app BB (cards com seleção, Personalizar e Avançar),
// mas em lista vertical, com o recomendado primeiro e o motivo do motor.
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { ajustado, incluidas, preco, useEstado } from "@/logica/estado";
import { COB, FIXAS, ORDEM_PLANO, PLANOS, Plano } from "@/logica/produto";
import { brl2 } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { SeloAjustado, Botao, Entra, haptic, T, Titulo, Toque } from "@/ui/base";
import { IMAGENS } from "@/ui/imagens";
import { Tela } from "@/ui/tela";
import { C, F } from "@/ui/tema";

const REFLUXO = LinearTransition.duration(220);
/** Emblema de cada plano (prompt 2, V4 a V6); sem o PNG, o cartão fica só com o texto. */
const EMBLEMA: Record<Plano, number | undefined> = { ESSENCIAL: IMAGENS.plano_essencial, PRATICO: IMAGENS.plano_pratico, TOTAL: IMAGENS.plano_total };

export default function PlanoTela() {
  const { s, set } = useEstado();
  const ajuda = useAjuda("plano");
  const f = s.f, rec = s.rec;
  const ordem: Plano[] = [rec, ...ORDEM_PLANO.filter((p) => p !== rec).reverse()];
  const motivos: string[] = f.motivos_plano.map((m: any) => m.texto.charAt(0).toUpperCase() + m.texto.slice(1));
  f.adicionais.forEach((a: any) => motivos.push("Adicional de danos a terceiros: " + a.motivo.split(";")[0]));
  const escolher = (k: Plano) => { haptic.toque(); set((x) => ({ ...x, plano: k, ligadas: k === "TOTAL" ? { ...x.ligadas, rc: true } : x.ligadas })); };
  const abaixo = ORDEM_PLANO.indexOf(s.plano) < ORDEM_PLANO.indexOf(rec);
  const falta = PLANOS[rec].extras.filter((k) => !PLANOS[s.plano].extras.includes(k)).map((k) => COB[k].curto.toLowerCase());

  return (
    <Tela passo={3} rotulo="Seleção de planos" fala={`Qual é o melhor plano para o seu lar? Recomendamos o ${PLANOS[rec].nome}. ${motivos.join(". ")}.`} onVoltar={() => router.back()} onFechar={() => router.dismissAll()} onAjuda={ajuda}
      rodape={<><Botao tipo="claro" titulo="Personalizar" onPress={() => router.push("/ajuste")} /><Botao titulo="Avançar" onPress={() => router.push("/conferir")} /></>}>
      <Titulo antes="Qual é o melhor plano para o " destaque="seu lar" depois="?" />
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15.5, marginBottom: 18 }}>Recomendamos o {PLANOS[rec].nome}. Você pode escolher outro.</T></Entra>
      {ordem.map((k, i) => {
        const p = PLANOS[k], on = k === s.plano, n = FIXAS.length + p.extras.length + (k !== "TOTAL" && s.ligadas.rc ? 1 : 0);
        return (
          <Entra key={k} i={2 + i}>
            <Toque onPress={() => escolher(k)} style={{ borderRadius: 18, borderWidth: on ? 2.5 : 1.5, borderColor: on ? C.azulEscuro : C.borda, backgroundColor: on ? C.azulFundo : C.branco, padding: 18, marginBottom: 14, marginTop: k === rec ? 10 : 0 }}>
              {k === rec ? <View style={{ position: "absolute", top: -12, left: 16, backgroundColor: C.amarelo, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}><T s={{ fontFamily: F.x, fontSize: 11.5, color: C.azulEscuro, letterSpacing: 0.4 }}>RECOMENDADO PARA VOCÊ</T></View> : null}
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                {on ? <Feather name="check-circle" size={24} color={C.azulEscuro} /> : <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#8D9199" }} />}
                <T s={{ fontFamily: F.m, fontSize: 15.5 }}>12x de <T s={{ fontFamily: F.x, fontSize: 17 }}>{brl2(preco(s, k))}</T></T>
              </View>
              {/* Nome e números à esquerda; o emblema do plano (prompt 2, V4 a V6), se já chegou, à direita no fluxo */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: 8, rowGap: 4, marginTop: 10 }}><T s={{ fontFamily: F.x, fontSize: 24, lineHeight: 30, color: on ? C.azulEscuro : C.texto }}>{p.nome}</T>{on && ajustado(s) ? <SeloAjustado gerente={s.ajustada} /> : null}</View>
                  <T s={{ fontSize: 15, color: "#3a3d44" }}>{n} coberturas</T>
                  <T s={{ fontSize: 15, color: "#3a3d44" }}>{p.pacotes} {p.pacotes > 1 ? "assistências" : "assistência"}</T>
                </View>
                {EMBLEMA[k] ? <Image source={EMBLEMA[k]} contentFit="contain" style={{ width: 76, height: 76, marginTop: 8 }} /> : null}
              </View>
              <T s={{ fontSize: 14.5, marginTop: 8 }}>{p.frase}</T>
              {k === rec ? (
                <View style={{ backgroundColor: on ? C.branco : C.azulClaro, borderRadius: 14, padding: 13, marginTop: 12 }}>
                  <T s={{ fontFamily: F.x, fontSize: 13.5, color: C.azulEscuro, marginBottom: 4 }}>Por que este plano</T>
                  {motivos.map((m) => <T key={m} s={{ fontSize: 14, lineHeight: 20, marginTop: 3 }}>•  {m}</T>)}
                </View>
              ) : null}
            </Toque>
          </Entra>
        );
      })}
      {abaixo ? (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} layout={REFLUXO}
          style={{ flexDirection: "row", gap: 10, backgroundColor: C.vermelhoClaro, borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <Feather name="alert-triangle" size={18} color={C.vermelho} />
          <T s={{ flex: 1, fontSize: 14, color: "#7c1d18" }}>No {PLANOS[s.plano].nome}, {falta.join(", ").replace(/, ([^,]*)$/, " e $1")} {falta.length > 1 ? "saem" : "sai"} do seu bolso. Foi por isso que recomendamos o {PLANOS[rec].nome}.</T>
        </Animated.View>
      ) : null}
      <Animated.View layout={REFLUXO}>
        <T s={{ fontSize: 12.5, color: C.suave }}>Preço ilustrativo. A recomendação e os valores vêm da análise do seu imóvel. {incluidas(s).length} coberturas no plano escolhido.</T>
      </Animated.View>
    </Tela>
  );
}
