// Folha de baixo (bottom sheet) no visual do BB, que se fecha arrastando, e o aviso rápido (toast).
// A folha vive acima das telas, por isso não é uma rota formSheet: precisa do mesmo comportamento
// no iPhone, no Android e na pré-visualização web.
import { Feather } from "@expo/vector-icons";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { haptic, T } from "./base";
import { alturaTela } from "./moldura";
import { C, EASE_OUT, EASE_SHEET, F } from "./tema";

const ALTURA = alturaTela();

function project(velocity: number, decelerationRate = 0.998) {
  "worklet";
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}
function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  "worklet";
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

type Api = { abrir: (c: ReactNode, titulo?: string) => void; fechar: () => void; toast: (m: string) => void };
const Ctx = createContext<Api | null>(null);
export const useFolha = () => { const c = useContext(Ctx); if (!c) throw new Error("ProvedorFolha ausente"); return c; };

export function ProvedorFolha({ children }: { children: ReactNode }) {
  const [folha, setFolha] = useState<{ c: ReactNode; titulo?: string; id: number } | null>(null);
  const [fechando, setFechando] = useState(false);
  const [msg, setMsg] = useState<{ t: string; id: number } | null>(null);
  const pedeFechar = useCallback(() => setFechando(true), []);
  const aoFechar = useCallback(() => { setFolha(null); setFechando(false); }, []);
  const aoFimToast = useCallback(() => setMsg(null), []);
  const api: Api = {
    abrir: (c, titulo) => { setFechando(false); setFolha({ c, titulo, id: Date.now() }); },
    fechar: () => setFechando(true),
    toast: (t) => setMsg({ t, id: Date.now() }),
  };
  return (
    <Ctx.Provider value={api}>
      {children}
      {folha ? <Folha key={folha.id} titulo={folha.titulo} fechando={fechando} onPedeFechar={pedeFechar} onFechada={aoFechar}>{folha.c}</Folha> : null}
      {msg ? <Toast key={msg.id} texto={msg.t} onFim={aoFimToast} /> : null}
    </Ctx.Provider>
  );
}

function Folha({ children, titulo, fechando, onPedeFechar, onFechada }: { children: ReactNode; titulo?: string; fechando: boolean; onPedeFechar: () => void; onFechada: () => void }) {
  const ins = useSafeAreaInsets();
  const y = useSharedValue(ALTURA);
  const contexto = useSharedValue(0);
  const [h, setH] = useState(ALTURA * 0.6);

  useEffect(() => { y.set(withTiming(0, { duration: 420, easing: EASE_SHEET })); }, [y]);
  useEffect(() => {
    if (fechando) y.set(withTiming(h + 40, { duration: 260, easing: EASE_OUT }, (ok) => { if (ok) scheduleOnRN(onFechada); }));
  }, [fechando, h, y, onFechada]);

  const pan = usePanGesture({
    activeOffsetY: [-10, 10],
    onActivate: () => { contexto.set(y.get()); },
    onUpdate: (e) => { const n = contexto.get() + e.translationY; y.set(n >= 0 ? n : rubberband(n, h)); },
    onDeactivate: (e) => {
      if (y.get() + project(e.velocityY) > h * 0.4) {
        y.set(withSpring(h + 40, { duration: 300, dampingRatio: 1, velocity: e.velocityY, overshootClamping: true }, (ok) => { if (ok) scheduleOnRN(onFechada); }));
      } else {
        y.set(withSpring(0, { duration: 300, dampingRatio: 0.8, velocity: e.velocityY }));
        scheduleOnRN(haptic.leve);
      }
    },
  });

  const folhaSt = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  const veuSt = useAnimatedStyle(() => ({ opacity: interpolate(y.get(), [0, h], [1, 0], Extrapolation.CLAMP) }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,12,30,0.45)" }, veuSt]}>
        <Pressable style={{ flex: 1 }} onPress={onPedeFechar} />
      </Animated.View>
      <Animated.View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={[est.folha, { paddingBottom: ins.bottom + 16 }, folhaSt]}>
        <GestureDetector gesture={pan}>
          <View style={{ paddingTop: 10, paddingHorizontal: 20, paddingBottom: titulo ? 6 : 0 }}>
            <View style={est.alca} />
            {titulo ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <T s={{ flex: 1, fontFamily: F.x, fontSize: 21, lineHeight: 27 }}>{titulo}</T>
                <Pressable onPress={onPedeFechar} hitSlop={14}><Feather name="x" size={24} color={C.texto} /></Pressable>
              </View>
            ) : null}
          </View>
        </GestureDetector>
        <ScrollView style={{ maxHeight: ALTURA * 0.72 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 6 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function Toast({ texto, onFim }: { texto: string; onFim: () => void }) {
  const ins = useSafeAreaInsets();
  const y = useSharedValue(-140);
  useEffect(() => {
    y.set(withTiming(0, { duration: 380, easing: EASE_SHEET }));
    const t = setTimeout(() => y.set(withTiming(-140, { duration: 260, easing: EASE_OUT }, (ok) => { if (ok) scheduleOnRN(onFim); })), 2600);
    return () => clearTimeout(t);
  }, [y, onFim]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  return (
    <Animated.View pointerEvents="none" style={[est.toast, { top: ins.top + 8 }, st]}>
      <Feather name="check-circle" size={20} color={C.amarelo} />
      <T s={{ flex: 1, fontFamily: F.b, color: C.branco, fontSize: 14.5 }}>{texto}</T>
    </Animated.View>
  );
}

const est = StyleSheet.create({
  folha: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: C.branco, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  alca: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#D5D8DE", alignSelf: "center" },
  toast: { position: "absolute", left: 16, right: 16, backgroundColor: C.texto, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, flexDirection: "row", alignItems: "center", gap: 10 },
});
