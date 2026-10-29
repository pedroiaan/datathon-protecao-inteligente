// Componentes no visual do app do BB: tela com cabeçalho azul e folha branca, botões em pílula,
// cards, selos, chave liga/desliga, contador de valores e entrada em cascata.
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useAcessibilidade } from "./acessibilidade";
import { ICONE_DE, ICONES, IMAGENS } from "./imagens";
import { C, EASE_OUT, F, SOMBRA, TIPO } from "./tema";

export const haptic = {
  toque: () => Platform.OS !== "web" && Haptics.selectionAsync(),
  leve: () => Platform.OS !== "web" && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  sucesso: () => Platform.OS !== "web" && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  erro: () => Platform.OS !== "web" && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

/** Texto do app. Com "Texto maior" ligado, tamanho e entrelinha crescem 20% em todo o app. */
export function T({ children, s, style, numberOfLines }: { children: ReactNode; s?: StyleProp<TextStyle>; style?: StyleProp<TextStyle>; numberOfLines?: number }) {
  const { escala } = useAcessibilidade();
  const st = StyleSheet.flatten([{ fontFamily: F.r, fontSize: 15, color: C.texto, lineHeight: 21 }, s, style]) as TextStyle;
  const tam = escala === 1 ? st : { ...st, fontSize: (st.fontSize || 15) * escala, lineHeight: st.lineHeight ? st.lineHeight * escala : undefined };
  return <Text numberOfLines={numberOfLines} style={tam}>{children}</Text>;
}

// Ícones de conteúdo: um só conjunto (Material Community, contorno). Feather fica só para a navegação.
const MCI: Record<string, string> = {
  fogo: "fire", carro: "car-side", vidro: "window-closed-variant", sirene: "alarm-light-outline", raio: "flash-outline", agua: "water-outline",
  vento: "weather-windy", ladrao: "lock-open-alert-outline", vizinho: "account-multiple-outline", casa: "home-outline", sofa: "sofa-outline",
  chuva: "weather-pouring", praia: "beach", ferramentas: "tools", maquina: "washing-machine", vassoura: "broom", inseto: "bug-outline",
  escudo: "shield-home-outline", chave: "key-variant", tomada: "power-plug-outline", mais: "plus", duvida: "chat-question-outline",
};
const FEA: Record<string, string> = {};
/** Ícone de conteúdo. Se o ícone ilustrado (PNG do prompt 2) já chegou, ele entra no lugar do vetorial,
 *  um pouco maior (1,5×): o desenho tem respiro próprio e enche o círculo azul-claro que o envolve.
 *  Ícones pequenos (abaixo de 18) e brancos sobre fundo azul (ex.: chip selecionado) ficam vetoriais. */
export function Icone({ n, tam = 20, cor = C.azul }: { n: string; tam?: number; cor?: string }) {
  const arte = ICONES[ICONE_DE[n]];
  if (arte && tam >= 18 && cor !== C.branco) return <Image source={arte} contentFit="contain" style={{ width: tam * 1.5, height: tam * 1.5 }} />;
  if (MCI[n]) return <MaterialCommunityIcons name={MCI[n] as any} size={tam} color={cor} />;
  return <Feather name={(FEA[n] || n) as any} size={tam} color={cor} />;
}

/** Rosto do gerente dentro do círculo do avatar (o pai define tamanho e cor do círculo).
 *  Com a ilustração do Ricardo (gerente_ricardo), mostra o rosto ampliado e recortado; senão, as iniciais. */
export function RostoGerente({ tam, cor = C.branco, inicial }: { tam: number; cor?: string; inicial: string }) {
  if (!IMAGENS.gerente_ricardo) return <T s={{ fontFamily: F.k, fontSize: Math.round(tam * 0.34), color: cor }}>{inicial}</T>;
  return (
    <View style={{ position: "absolute", top: 0, left: 0, width: tam, height: tam, borderRadius: tam / 2, overflow: "hidden", alignItems: "center" }}>
      <Image source={IMAGENS.gerente_ricardo} contentFit="contain" style={{ width: tam * 1.7, height: tam * 1.7, marginTop: tam * 0.02 }} accessibilityLabel="Foto ilustrada do gerente" />
    </View>
  );
}

/** Pressável com escala de 3% em 120ms (feedback no toque). */
export function Toque({ onPress, children, style, desabilitado, hit = 8, rotulo }: { onPress?: () => void; children: ReactNode; style?: StyleProp<ViewStyle>; desabilitado?: boolean; hit?: number; rotulo?: string }) {
  const [p, setP] = useState(false);
  // flex, largura e margens são do lugar do botão na linha: vão para o Pressable, não para o conteúdo
  const { flex, width, alignSelf, margin, marginTop, marginBottom, marginHorizontal, ...dentro } = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const fora = { flex, width, alignSelf, margin, marginTop, marginBottom, marginHorizontal };
  return (
    <Pressable style={fora} onPress={onPress} disabled={desabilitado} accessibilityRole="button" accessibilityLabel={rotulo} accessibilityState={{ disabled: !!desabilitado }} onPressIn={() => setP(true)} onPressOut={() => setP(false)} hitSlop={hit} pressRetentionOffset={16}>
      <Animated.View style={[est.toque, p && est.toqueOn, dentro, flex ? { flex: 1 } : null]}>{children}</Animated.View>
    </Pressable>
  );
}

export function Botao({ titulo, onPress, tipo = "amarelo", desabilitado, carregando, icone }: { titulo: string; onPress?: () => void; tipo?: "amarelo" | "claro" | "azul" | "branco"; desabilitado?: boolean; carregando?: boolean; icone?: string }) {
  const fundo = { amarelo: C.amarelo, claro: C.azulBotao, azul: C.azul, branco: C.branco }[tipo];
  const cor = tipo === "azul" ? C.branco : C.azul;
  return (
    <Toque onPress={onPress} desabilitado={desabilitado || carregando} style={[est.botao, { backgroundColor: fundo, opacity: desabilitado ? 0.45 : 1 }]}>
      {carregando ? <Girando cor={cor} /> : icone ? <Icone n={icone} cor={cor} tam={19} /> : null}
      <T s={[TIPO.botao, { color: cor }]}>{carregando ? "Contratando" : titulo}</T>
    </Toque>
  );
}

function Girando({ cor }: { cor: string }) {
  const r = useSharedValue(0);
  useEffect(() => { r.set(withTiming(360 * 40, { duration: 700 * 40, easing: (t) => t })); }, [r]);
  const st = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.get()}deg` }] }));
  return <Animated.View style={[{ width: 18, height: 18, borderRadius: 9, borderWidth: 2.5, borderColor: cor, borderRightColor: "transparent" }, st]} />;
}

export function Card({ children, style, i }: { children: ReactNode; style?: StyleProp<ViewStyle>; i?: number }) {
  const conteudo = <View style={[est.card, style]}>{children}</View>;
  return i === undefined ? conteudo : <Entra i={i}>{conteudo}</Entra>;
}

/** Entrada em cascata (45ms entre itens): só no que o cliente acabou de abrir. */
export function Entra({ i = 0, children, style }: { i?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const entering = useMemo(() => FadeInDown.duration(340).delay(90 + i * 45).easing(EASE_OUT), [i]);
  return <Animated.View entering={entering} style={style}>{children}</Animated.View>;
}

export function Selo({ texto, tipo }: { texto: string; tipo: "obs" | "est" | "conf" | "adic" | "fixa" }) {
  const cores = { obs: [C.positivoClaro, C.positivo], est: [C.ambarClaro, C.ambar], conf: [C.azulClaro, C.azulEscuro], adic: [C.amarelo, C.azulEscuro], fixa: [C.azulClaro, C.azulEscuro] }[tipo];
  return <View style={[est.selo, { backgroundColor: cores[0] }]}><T s={{ fontFamily: F.b, fontSize: 11.5, color: cores[1], lineHeight: 15 }}>{texto}</T></View>;
}

/** Selo discreto de plano ajustado pelo cliente (o nome do plano não muda). */
export function SeloAjustado({ claro = false, gerente = false }: { claro?: boolean; gerente?: boolean }) {
  return (
    <View accessibilityLabel={gerente ? "Plano ajustado pelo gerente" : "Plano ajustado por você"} style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start", flexShrink: 0, gap: 4, backgroundColor: claro ? "rgba(255,255,255,0.18)" : C.azulClaro, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 }}>
      <Feather name={gerente ? "user-check" : "sliders"} size={11} color={claro ? C.branco : C.azulEscuro} />
      <T s={{ fontFamily: F.b, fontSize: 11.5, lineHeight: 15, color: claro ? C.branco : C.azulEscuro }}>{gerente ? "ajustado pelo gerente" : "ajustado"}</T>
    </View>
  );
}

export function Titulo({ antes, destaque, depois = "", i = 0 }: { antes: string; destaque: string; depois?: string; i?: number }) {
  return (
    <Entra i={i}>
      <T s={est.titulo}>{antes}<T s={[est.titulo, { fontFamily: F.xi, color: C.azul }]}>{destaque}</T>{depois}</T>
    </Entra>
  );
}

export function Rotulo({ children }: { children: ReactNode }) {
  return <T s={[TIPO.rotulo, { color: C.suave, marginTop: 22, marginBottom: 10, marginLeft: 2 }]}>{children}</T>;
}

/** Chave liga/desliga. Transição CSS de 180ms (estado de dois valores, sem gesto). */
export function Chave({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <Pressable onPress={() => { haptic.toque(); onChange(); }} hitSlop={10}>
      <Animated.View style={[est.chave, { backgroundColor: on ? C.positivo : "#C9CCD3" }]}>
        <Animated.View style={[est.bola, { transform: [{ translateX: on ? 18 : 0 }] }]} />
      </Animated.View>
    </Pressable>
  );
}

/** Número que conta até o valor novo (troca de estado, não gesto). */
export function Contador({ valor, fmt, s }: { valor: number; fmt: (v: number) => string; s?: StyleProp<TextStyle> }) {
  const [mostra, setMostra] = useState(valor);
  const de = useRef(valor);
  useEffect(() => {
    const ini = de.current, t0 = Date.now();
    if (ini === valor) return;
    let id: any;
    const passo = () => {
      const p = Math.min(1, (Date.now() - t0) / 420), e = 1 - Math.pow(1 - p, 3);
      setMostra(ini + (valor - ini) * e);
      if (p < 1) id = requestAnimationFrame(passo); else de.current = valor;
    };
    id = requestAnimationFrame(passo);
    return () => { cancelAnimationFrame(id); de.current = valor; };
  }, [valor]);
  return <T s={[{ fontVariant: ["tabular-nums"] }, s]}>{fmt(mostra)}</T>;
}

export const est = StyleSheet.create({
  toque: { transform: [{ scale: 1 }], transitionProperty: "transform", transitionDuration: 120, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" } as any,
  toqueOn: { transform: [{ scale: 0.97 }] },
  botao: { height: 54, borderRadius: 30, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, paddingHorizontal: 18 },
  card: { backgroundColor: C.branco, borderRadius: 16, padding: 16, marginBottom: 12, ...SOMBRA },
  selo: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, alignSelf: "flex-start" },
  titulo: { ...TIPO.display, color: C.texto, marginBottom: 6 },
  chave: { width: 46, height: 28, borderRadius: 14, padding: 3, transitionProperty: "backgroundColor", transitionDuration: 180 } as any,
  bola: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.branco, ...SOMBRA, transitionProperty: "transform", transitionDuration: 200, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" } as any,
});
