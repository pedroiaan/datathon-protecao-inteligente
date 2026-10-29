// Tela de bloqueio do celular com os avisos (notificações) do app BB.
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { haptic, T, Toque } from "./base";
import { Papel } from "./ilustracoes";
import { C, EASE_OUT, F } from "./tema";

export type Aviso = { app: "BB" | "WhatsApp"; quando: string; titulo?: string; texto: string; fonte?: string; onPress: () => void };

function Notificacao({ a, i }: { a: Aviso; i: number }) {
  const entering = useMemo(() => FadeInDown.duration(480).delay(300 + i * 220).easing(EASE_OUT), [i]);
  return (
    <Animated.View entering={entering}>
      <Toque onPress={() => { haptic.leve(); a.onPress(); }} style={{ borderRadius: 22, overflow: "hidden", marginBottom: 10 }}>
        {/* vidro das notificações do iOS: desfoque fixo (nunca animado) + véu claro */}
        <BlurView intensity={50} tint="light" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ backgroundColor: "rgba(245,246,250,0.72)", padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <View style={{ width: 22, height: 22, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: a.app === "BB" ? C.amarelo : "#25D366" }}>
            {a.app === "BB" ? <T s={{ fontFamily: F.k, fontSize: 10, color: C.azulEscuro, lineHeight: 12 }}>BB</T> : <Feather name="message-circle" size={13} color="#fff" />}
          </View>
          <T s={{ fontSize: 13, color: "#4a4d55" }}>{a.app === "BB" ? "App BB" : "WhatsApp · BB (conta oficial)"} · {a.quando}</T>
        </View>
        {a.titulo ? <T s={{ fontFamily: F.x, fontSize: 16, lineHeight: 21, marginBottom: 2 }}>{a.titulo}</T> : null}
        <T s={{ fontSize: 15, lineHeight: 20.5 }}>{a.texto}</T>
        {a.fonte ? <T s={{ fontSize: 12, lineHeight: 16, color: C.suave, marginTop: 7 }}>{a.fonte}</T> : null}
        </View>
      </Toque>
    </Animated.View>
  );
}

export function Bloqueio({ hora, avisos, onSegurarRelogio }: { hora: string; avisos: Aviso[]; onSegurarRelogio?: () => void }) {
  const ins = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: C.noite }}>
      <StatusBar style="light" />
      <Papel />
      <View style={{ flex: 1, paddingTop: ins.top + 46, paddingHorizontal: 12, paddingBottom: ins.bottom + 18 }}>
        <Pressable onLongPress={onSegurarRelogio} delayLongPress={700}>
          <T s={{ fontFamily: F.x, fontSize: 88, lineHeight: 96, color: C.branco, textAlign: "center", letterSpacing: -1 }}>{hora}</T>
          <T s={{ fontFamily: F.m, fontSize: 18, color: C.branco, textAlign: "center", opacity: 0.92, marginBottom: 34 }}>quinta-feira, 29 de outubro</T>
        </Pressable>
        {avisos.map((a, i) => <Notificacao key={i} a={a} i={i} />)}
        <T s={{ marginTop: "auto", textAlign: "center", color: C.branco, opacity: 0.8, fontFamily: F.m, fontSize: 14 }}>Toque num aviso para abrir o app</T>
      </View>
    </View>
  );
}
