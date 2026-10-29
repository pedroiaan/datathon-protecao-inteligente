// Tela do app no visual do BB: cabeçalho azul (voltar, título, acessibilidade, fechar), folha branca
// arredondada com a barra de progresso, e rodapé com o botão principal e o botão de Ajuda ao lado.
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ReactNode, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ouvir, pararDeOuvir, useAcessibilidade } from "./acessibilidade";
import { Chave, haptic, T, Toque } from "./base";
import { useFolha } from "./folha";
import { C, EASE_IN_OUT, F, TIPO } from "./tema";

/** Barra de progresso do fluxo, igual à do app ("Seleção de planos  2/3"). */
function Progresso({ passo, total, rotulo }: { passo: number; total: number; rotulo: string }) {
  const w = useSharedValue((passo - 1) / total);
  useEffect(() => { w.set(withTiming(passo / total, { duration: 450, easing: EASE_IN_OUT })); }, [passo, total, w]);
  const st = useAnimatedStyle(() => ({ width: `${w.get() * 100}%` }));
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
      <View style={{ height: 6, backgroundColor: C.trilho }}><Animated.View style={[{ position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: C.azul }, st]} /></View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <T s={{ fontFamily: F.m, fontSize: 16.5, color: C.azul }}>{rotulo}</T>
        <T s={{ fontFamily: F.m, fontSize: 16.5 }}>{passo}/{total}</T>
      </View>
    </View>
  );
}

/** Painel de acessibilidade (botão Aa): texto maior e leitura da tela em voz alta. */
function PainelAcessibilidade({ fala }: { fala: string }) {
  const { maior, setMaior } = useAcessibilidade();
  const [lendo, setLendo] = useState(false);
  useEffect(() => () => { pararDeOuvir(); }, []);
  return (
    <View style={{ gap: 4, paddingBottom: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EEF0F3" }}>
        <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center" }}><T s={{ fontFamily: F.k, color: C.azul, fontSize: 17 }}>Aa</T></View>
        <View style={{ flex: 1 }}><T s={{ fontFamily: F.b, fontSize: 16 }}>Texto maior</T><T s={{ fontSize: 13, color: C.suave }}>Aumenta todas as letras do app</T></View>
        <Chave on={maior} onChange={() => setMaior(!maior)} />
      </View>
      <Toque onPress={async () => { haptic.leve(); setLendo(await ouvir(fala, () => setLendo(false))); }} style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14 }}>
        <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: lendo ? C.azul : C.azulClaro, alignItems: "center", justifyContent: "center" }}>
          <Feather name={lendo ? "pause" : "volume-2"} size={20} color={lendo ? C.branco : C.azul} />
        </View>
        <View style={{ flex: 1 }}><T s={{ fontFamily: F.b, fontSize: 16 }}>{lendo ? "Parar a leitura" : "Ouvir esta tela"}</T><T s={{ fontSize: 13, color: C.suave }}>Lemos em voz alta o que está na tela</T></View>
      </Toque>
    </View>
  );
}

export function Tela({ titulo = "Seguro Residencial", passo, rotulo = "", onVoltar, onFechar, onAjuda, heroi, rodape, children, rolagem = true, fundoFolha = C.fundo, fala }: {
  titulo?: string; passo?: number; rotulo?: string; onVoltar?: () => void; onFechar?: () => void; onAjuda?: () => void;
  heroi?: ReactNode; rodape?: ReactNode; children: ReactNode; rolagem?: boolean; fundoFolha?: string; fala?: string;
}) {
  const ins = useSafeAreaInsets();
  const folha = useFolha();
  const acess = () => { haptic.leve(); folha.abrir(<PainelAcessibilidade fala={fala || titulo} />, "Acessibilidade"); };
  return (
    <View style={{ flex: 1, backgroundColor: C.azul }}>
      <StatusBar style="light" />
      <View style={{ paddingTop: ins.top + 6, paddingHorizontal: 16, paddingBottom: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
        {onVoltar ? <Toque onPress={onVoltar} hit={12} rotulo="Voltar"><Feather name="arrow-left" size={26} color={C.branco} /></Toque> : null}
        <T s={[TIPO.nav, { flex: 1, color: C.branco }]} numberOfLines={1}>{titulo}</T>
        <Toque onPress={acess} hit={10} rotulo="Acessibilidade: texto maior e ouvir a tela" style={{ height: 32, paddingHorizontal: 11, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
          <T s={{ fontFamily: F.k, fontSize: 15, color: C.branco, lineHeight: 19 }}>Aa</T>
        </Toque>
        {onFechar ? <Toque onPress={onFechar} hit={12} rotulo="Fechar e voltar ao início"><Feather name="x" size={26} color={C.branco} /></Toque> : null}
      </View>
      {heroi}
      <View style={{ flex: 1, backgroundColor: fundoFolha, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}>
        {passo ? <Progresso passo={passo} total={5} rotulo={rotulo} /> : null}
        {rolagem ? (
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 28 }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : children}
      </View>
      {rodape || onAjuda ? (
        <View style={{ backgroundColor: C.branco, paddingHorizontal: 20, paddingTop: 14, paddingBottom: ins.bottom + 14, flexDirection: "row", alignItems: "flex-end", gap: 10 }}>
          <View style={{ flex: 1, gap: 12 }}>{rodape}</View>
          {onAjuda ? (
            <Toque rotulo="Ajuda: dúvidas frequentes" onPress={() => { haptic.leve(); onAjuda(); }} style={{ width: 60, height: 54, borderRadius: 18, borderWidth: 1.5, borderColor: C.azul, alignItems: "center", justifyContent: "center", gap: 1 }}>
              <Feather name="help-circle" size={21} color={C.azul} />
              <T s={{ fontFamily: F.b, fontSize: 11.5, color: C.azul, lineHeight: 14 }}>Ajuda</T>
            </Toque>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
