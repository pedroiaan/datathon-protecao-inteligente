// Moldura de iPhone para a demonstração no navegador: o app roda dentro de uma tela de 393 x 852
// (iPhone 15/16), com Dynamic Island, barra de status, indicador de início e as margens seguras reais.
// No celular (Expo Go) não há moldura: o app ocupa a tela do aparelho.
import { ReactNode } from "react";
import { Dimensions, Platform, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaFrameContext, SafeAreaInsetsContext, SafeAreaProvider } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";
import { DEMO } from "../config";

export const TELA = { w: 393, h: 852 };
const BORDA = 12;
const INSETS = { top: 54, bottom: 34, left: 0, right: 0 };

export const naMoldura = () => DEMO.molduraNoNavegador && Platform.OS === "web" && typeof window !== "undefined"
  && window.innerWidth > 480 && window.innerWidth / window.innerHeight > 0.8; // janela larga (no celular em pé, sem moldura)
/** Altura útil da tela do app (a da moldura no navegador, a do aparelho no celular). */
export const alturaTela = () => (naMoldura() ? TELA.h : Dimensions.get("window").height);

function BarraStatus() {
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 34, paddingTop: 6, zIndex: 50 }}>
      <Text style={{ color: "#fff", fontFamily: "Figtree_700Bold", fontSize: 16 }}>9:41</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Svg width={18} height={12} viewBox="0 0 18 12"><Rect x="0" y="8" width="3" height="4" rx="1" fill="#fff" /><Rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#fff" /><Rect x="10" y="3" width="3" height="9" rx="1" fill="#fff" /><Rect x="15" y="0" width="3" height="12" rx="1" fill="#fff" /></Svg>
        <Svg width={16} height={12} viewBox="0 0 16 12"><Path d="M8 11.5 1 4.3a9.9 9.9 0 0 1 14 0Z" fill="#fff" /></Svg>
        <Svg width={27} height={13} viewBox="0 0 27 13"><Rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#fff" strokeOpacity={0.45} fill="none" /><Rect x="2" y="2" width="19" height="9" rx="2.2" fill="#fff" /><Rect x="24.5" y="4.5" width="2" height="4" rx="1" fill="#fff" fillOpacity={0.45} /></Svg>
      </View>
    </View>
  );
}

export function Moldura({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (!naMoldura()) return <SafeAreaProvider>{children}</SafeAreaProvider>;
  const escala = Math.min(1, (height - 40) / (TELA.h + BORDA * 2), (width - 40) / (TELA.w + BORDA * 2));
  return (
    // overflow "clip" (só no navegador): o aparelho em escala não deixa a página rolar quando algo recebe foco
    <View ref={(n: any) => { if (n?.style) n.style.overflow = "clip"; }} style={{ flex: 1, backgroundColor: "#E7EAF3", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <View style={{ width: TELA.w + BORDA * 2, height: TELA.h + BORDA * 2, borderRadius: 68, backgroundColor: "#0B0C12", padding: BORDA, transform: [{ scale: escala }],
        shadowColor: "#1B1F6B", shadowOpacity: 0.28, shadowRadius: 40, shadowOffset: { width: 0, height: 24 } }}>
        <View style={{ flex: 1, borderRadius: 56, overflow: "hidden", backgroundColor: "#000" }}>
          {/* As margens seguras de um iPhone real, para o app se comportar como no aparelho */}
          <SafeAreaFrameContext.Provider value={{ x: 0, y: 0, width: TELA.w, height: TELA.h }}>
            <SafeAreaInsetsContext.Provider value={INSETS}>{children}</SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
          <BarraStatus />
          <View pointerEvents="none" style={{ position: "absolute", top: 11, left: (TELA.w - 124) / 2, width: 124, height: 36, borderRadius: 20, backgroundColor: "#000", zIndex: 60 }} />
          <View pointerEvents="none" style={{ position: "absolute", bottom: 8, left: (TELA.w - 136) / 2, width: 136, height: 5, borderRadius: 3, backgroundColor: "#111214", opacity: 0.85, zIndex: 60 }} />
        </View>
      </View>
    </View>
  );
}
