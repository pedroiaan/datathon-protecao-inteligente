// Contratado: o momento raro da jornada, onde cabe a celebração. A casa surge, gira como uma moeda
// e, ao parar, mostra o outro lado: o círculo com o ✓ (a casa ficou protegida). O ✓ é desenhado
// com a vibração de sucesso no mesmo instante. Com "reduzir movimento", vai direto ao ✓.
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, SharedValue, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tipoAtual, useEstado } from "@/logica/estado";
import { PLANOS } from "@/logica/produto";
import { Botao, haptic, T } from "@/ui/base";
import { IMAGENS } from "@/ui/imagens";
import { C, EASE_IN_OUT, EASE_OUT, F } from "@/ui/tema";

const ACirculo = Animated.createAnimatedComponent(Circle);
const ACaminho = Animated.createAnimatedComponent(Path);
const VOLTA = 2 * Math.PI * 54;
const ENTRA = 450, GIRA = 1100, VOLTAS = 540;            // 1 volta e meia: termina mostrando o verso
const T_FIM_GIRO = ENTRA + 250 + GIRA;
const TAM = 172;
// Faíscas nas cores do BB que saem do círculo quando o ✓ aparece (ângulo, distância, cor, raio)
const FAISCAS = [0, 45, 90, 135, 180, 225, 270, 315].map((g, i) => ({ g, d: i % 2 ? 104 : 120, cor: [C.amarelo, "#3BE0C9", C.branco, "#FF6F68"][i % 4], r: i % 2 ? 4 : 6 }));

function Faisca({ g, d, cor, r, p }: { g: number; d: number; cor: string; r: number; p: SharedValue<number> }) {
  const st = useAnimatedStyle(() => {
    const v = p.get(), rad = (g * Math.PI) / 180, k = d * (0.55 + 0.45 * v);
    return { opacity: v > 0 && v < 1 ? 1 - v * v : 0, transform: [{ translateX: Math.cos(rad) * k }, { translateY: Math.sin(rad) * k }, { scale: 1 - 0.5 * v }] };
  });
  return <Animated.View pointerEvents="none" style={[{ position: "absolute", left: TAM / 2 - r, top: TAM / 2 - r, width: r * 2, height: r * 2, borderRadius: r, backgroundColor: cor }, st]} />;
}

/** Lado visível da "moeda" a partir do ângulo (frente entre -90° e 90°, a cada volta). */
function frente(rot: number) {
  "worklet";
  const a = ((rot % 360) + 360) % 360;
  return a < 90 || a > 270;
}

export default function Sucesso() {
  const { s } = useEstado();
  const ins = useSafeAreaInsets();
  const apto = tipoAtual(s) === "APARTAMENTO";
  const surge = useSharedValue(0), rot = useSharedValue(0), anel = useSharedValue(VOLTA), traco = useSharedValue(80), pulso = useSharedValue(1), faisca = useSharedValue(0);

  useEffect(() => {
    surge.set(withSpring(1, { duration: ENTRA, dampingRatio: 1 }));
    rot.set(withDelay(ENTRA + 250, withTiming(VOLTAS, { duration: GIRA, easing: EASE_IN_OUT })));
    anel.set(withDelay(T_FIM_GIRO - 120, withTiming(0, { duration: 480, easing: EASE_OUT })));
    traco.set(withDelay(T_FIM_GIRO + 180, withTiming(0, { duration: 340, easing: EASE_OUT })));
    pulso.set(withDelay(T_FIM_GIRO + 220, withSequence(withTiming(1.06, { duration: 150, easing: EASE_OUT }), withSpring(1, { duration: 400, dampingRatio: 0.8 }))));
    faisca.set(withDelay(T_FIM_GIRO + 200, withTiming(1, { duration: 700, easing: EASE_OUT })));
    const t = setTimeout(() => haptic.sucesso(), T_FIM_GIRO + 180);
    return () => clearTimeout(t);
  }, [surge, rot, anel, traco, pulso, faisca]);

  const moeda = useAnimatedStyle(() => ({
    opacity: surge.get(),
    transform: [{ perspective: 700 }, { scale: (0.88 + 0.12 * surge.get()) * pulso.get() }, { rotateY: `${rot.get()}deg` }],
  }));
  const ladoFrente = useAnimatedStyle(() => ({ opacity: frente(rot.get()) ? 1 : 0 }));
  const ladoVerso = useAnimatedStyle(() => ({ opacity: frente(rot.get()) ? 0 : 1, transform: [{ rotateY: "180deg" }] }));
  const pAnel = useAnimatedProps(() => ({ strokeDashoffset: anel.get() }));
  const pTraco = useAnimatedProps(() => ({ strokeDashoffset: traco.get() }));
  const entra = useMemo(() => FadeInDown.duration(420).delay(T_FIM_GIRO + 300).easing(EASE_OUT), []);

  return (
    <View style={{ flex: 1, backgroundColor: C.azul, alignItems: "center", justifyContent: "center", padding: 30, paddingBottom: ins.bottom + 30 }}>
      <StatusBar style="light" />
      <Animated.View style={[{ width: TAM, height: TAM }, moeda]}>
        <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }, ladoFrente]}>
          <View style={{ width: TAM, height: TAM, borderRadius: TAM / 2, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}>
            {/* Frente da moeda: a casa ilustrada (prompt 2, V3) quando chegar; até lá, o desenho em SVG */}
            {IMAGENS.sucesso_casa ? <Image source={IMAGENS.sucesso_casa} contentFit="contain" style={{ width: TAM * 0.78, height: TAM * 0.78 }} /> : (
            <Svg width={118} height={108} viewBox="0 0 130 120">
              <Rect x="86" y="18" width="12" height="26" rx="2" fill="#FF6F68" />
              <Rect x="24" y="54" width="82" height="60" rx="6" fill={C.branco} />
              <Path d="M10 60 L65 14 L120 60" fill="none" stroke={C.amarelo} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
              <Rect x="36" y="68" width="20" height="18" rx="3" fill={C.amarelo} /><Path d="M46 68v18M36 77h20" stroke={C.azul} strokeWidth={1.6} />
              <Path d="M70 114V86a9 9 0 0 1 18 0v28z" fill={C.azul} /><Circle cx="83" cy="101" r="1.8" fill={C.amarelo} />
            </Svg>)}
          </View>
        </Animated.View>
        <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }, ladoVerso]}>
          <Svg width={TAM} height={TAM} viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.12)" />
            <ACirculo cx="60" cy="60" r="54" fill="none" stroke={C.amarelo} strokeWidth={6} strokeLinecap="round" strokeDasharray={VOLTA} animatedProps={pAnel} />
            <ACaminho d="M38 62l15 15 30-32" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} animatedProps={pTraco} />
          </Svg>
        </Animated.View>
        {FAISCAS.map((x) => <Faisca key={x.g} {...x} p={faisca} />)}
      </Animated.View>
      <Animated.View entering={entra} style={{ alignItems: "center", marginTop: 24, width: "100%" }}>
        <T s={{ fontFamily: F.x, fontSize: 30, lineHeight: 36, color: C.branco, textAlign: "center", letterSpacing: -0.5 }}>{apto ? "Seu apê está" : "Sua casa está"}{"\n"}<T s={{ fontFamily: F.xi, fontSize: 30, color: C.amarelo }}>{apto ? "protegido" : "protegida"}</T></T>
        <T s={{ color: C.branco, opacity: 0.9, textAlign: "center", marginTop: 10, fontSize: 16, lineHeight: 23, maxWidth: 300 }}>Plano {PLANOS[s.plano].nome} contratado. A apólice chega no seu e-mail e já fica no app.</T>
        <View style={{ width: "100%", marginTop: 30 }}><Botao titulo="Ver meu seguro" onPress={() => router.replace("/meu")} /></View>
      </Animated.View>
    </View>
  );
}
