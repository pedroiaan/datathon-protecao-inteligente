// Seletor de planos no estilo do controle segmentado do iOS: a pílula mede cada opção uma vez
// e desliza com transform (largura animada é a exceção permitida: elemento absoluto e sem filhos).
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Estado, preco, useEstado } from "../logica/estado";
import { ORDEM_PLANO, PLANOS, Plano } from "../logica/produto";
import { brl } from "../logica/textos";
import { haptic, T } from "./base";
import { C, EASE_IN_OUT, F, SOMBRA } from "./tema";

/** Sem props, muda o plano do cliente; com `e` e `mudar`, muda uma proposta em edição (portal do gerente). */
export function SeletorPlanos({ e, mudar }: { e?: Estado; mudar?: (fn: (x: Estado) => Estado) => void } = {}) {
  const app = useEstado();
  const s = e ?? app.s, set = mudar ?? app.set;
  const [medidas, setMedidas] = useState<Record<string, { x: number; w: number }>>({});
  const x = useSharedValue(0), w = useSharedValue(0);
  useEffect(() => {
    const m = medidas[s.plano];
    if (!m) return;
    const primeira = w.get() === 0;
    x.set(primeira ? m.x : withTiming(m.x, { duration: 260, easing: EASE_IN_OUT }));
    w.set(primeira ? m.w : withTiming(m.w, { duration: 260, easing: EASE_IN_OUT }));
  }, [s.plano, medidas, x, w]);
  const pilula = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }], width: w.get() }));
  const escolher = (k: Plano) => { if (k === s.plano) return; haptic.toque(); set((e) => ({ ...e, plano: k, ligadas: k === "TOTAL" ? { ...e.ligadas, rc: true } : e.ligadas })); };

  return (
    <View style={{ backgroundColor: "#E9ECF5", borderRadius: 14, padding: 4, flexDirection: "row" }}>
      <Animated.View style={[{ position: "absolute", top: 4, bottom: 4, left: 0, borderRadius: 11, backgroundColor: C.branco, ...SOMBRA }, pilula]} />
      {ORDEM_PLANO.map((k) => {
        const on = k === s.plano, rec = k === s.rec;
        return (
          <Pressable key={k} onPress={() => escolher(k)} onLayout={(e: LayoutChangeEvent) => { const { x: px, width } = e.nativeEvent.layout; setMedidas((m) => ({ ...m, [k]: { x: px, w: width } })); }}
            style={{ flex: 1, alignItems: "center", paddingVertical: 8 }} hitSlop={4}>
            <T s={{ fontFamily: on ? F.x : F.b, fontSize: 15, color: on ? C.azulEscuro : "#4A4E58" }}>{PLANOS[k].nome}</T>
            <T s={{ fontSize: 12, color: on ? C.azul : C.suave }}>{brl(preco(s, k))}/mês</T>
            {rec ? <View style={{ position: "absolute", top: -9, backgroundColor: C.amarelo, borderRadius: 999, paddingHorizontal: 6, paddingVertical: 1 }}><T s={{ fontFamily: F.s, fontSize: 9.5, color: C.azulEscuro, lineHeight: 13 }}>INDICADO</T></View> : null}
          </Pressable>
        );
      })}
    </View>
  );
}
