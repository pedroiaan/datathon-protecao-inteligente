// Ajuda: dúvidas frequentes da tela; o gerente aparece só no fim (último recurso).
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useEstado } from "../logica/estado";
import { GERENTE } from "../logica/produto";
import { faqDaTela } from "../logica/textos";
import { Botao, haptic, RostoGerente, T } from "./base";
import { useFolha } from "./folha";
import { C, F } from "./tema";

const REFLUXO = LinearTransition.duration(220);
const APARECE = FadeIn.duration(200);

function Duvida({ q, r }: { q: string; r: string }) {
  const [on, setOn] = useState(false);
  return (
    <Animated.View layout={REFLUXO} style={{ borderBottomWidth: 1, borderBottomColor: "#EEF0F3" }}>
      <Pressable onPress={() => { haptic.toque(); setOn(!on); }} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 15 }}>
        <T s={{ flex: 1, fontFamily: F.b, fontSize: 15.5 }}>{q}</T>
        <Feather name={on ? "minus" : "plus"} size={20} color={C.azul} />
      </Pressable>
      {on ? <Animated.View entering={APARECE}><T s={{ color: "#3a3d44", marginBottom: 15 }}>{r}</T></Animated.View> : null}
    </Animated.View>
  );
}

/** Dúvidas da tela. No portal do gerente (semGerente) não há o bloco "Falar com meu gerente". */
export function useAjuda(tela: string, { semGerente = false } = {}) {
  const { s } = useEstado();
  const folha = useFolha();
  return () => folha.abrir(
    <View>
      <T s={{ color: C.suave, fontSize: 13.5, marginBottom: 2 }}>Sobre esta tela. A maioria das dúvidas se resolve aqui.</T>
      {faqDaTela(tela, s.f).map(([q, r]) => <Duvida key={q} q={q} r={r} />)}
      {semGerente ? null : <>
      <Animated.View layout={REFLUXO} style={{ marginTop: 18, backgroundColor: C.azulClaro, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.azul, alignItems: "center", justifyContent: "center" }}>
          <RostoGerente tam={44} inicial={GERENTE.inicial} />
        </View>
        <View style={{ flex: 1 }}>
          <T s={{ fontFamily: F.b }}>Ainda com dúvida?</T>
          <T s={{ fontSize: 13, color: C.suave }}>O {GERENTE.nome} vê a mesma proposta que você.</T>
        </View>
      </Animated.View>
      <Animated.View layout={REFLUXO} style={{ marginTop: 12 }}>
        <Botao tipo="azul" titulo="Falar com meu gerente" onPress={() => { folha.fechar(); setTimeout(() => router.push("/gerente"), 220); }} />
      </Animated.View>
      </>}
    </View>,
    "Dúvidas frequentes",
  );
}
