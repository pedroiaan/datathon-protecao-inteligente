import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold } from "@expo-google-fonts/figtree";
import { Nunito_800ExtraBold, Nunito_800ExtraBold_Italic, Nunito_900Black, useFonts } from "@expo-google-fonts/nunito";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReducedMotionConfig, ReduceMotion, useReducedMotion } from "react-native-reanimated";
import { DEMO } from "@/config";
import { ProvedorEstado } from "@/logica/estado";
import { ProvedorAcessibilidade } from "@/ui/acessibilidade";
import { ProvedorFolha } from "@/ui/folha";
import { MenuDemo } from "@/ui/menuDemo";
import { Moldura } from "@/ui/moldura";
import { PainelPlanilha } from "@/ui/planilha";
import { C } from "@/ui/tema";

SplashScreen.preventAutoHideAsync();

export default function Raiz() {
  const [ok] = useFonts({ Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold, Nunito_800ExtraBold, Nunito_800ExtraBold_Italic, Nunito_900Black });
  const reduz = useReducedMotion() && !DEMO.animarSempre;
  // Menu da demonstração: abre antes da notificação, para escolher um dos 2 casos do vídeo
  const [menu, setMenu] = useState(true);
  // Trocar de caso durante a gravação sem nada visível na tela: recarregar a página ou apertar M
  useEffect(() => {
    if (Platform.OS !== "web" || !DEMO.planilhaAoLado) return;
    const tecla = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "m" && !(e.target as HTMLElement)?.closest?.("input, textarea")) setMenu(true); };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);
  useEffect(() => { if (ok) SplashScreen.hideAsync(); }, [ok]);
  if (!ok) return null;
  // Troca de tela: a do sistema (push nativo). Telas de bloqueio e sucesso entram com fade.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {DEMO.animarSempre ? <ReducedMotionConfig mode={ReduceMotion.Never} /> : null}
      <ProvedorEstado>
      <Moldura lado={DEMO.planilhaAoLado ? <PainelPlanilha /> : undefined}
        sobre={DEMO.planilhaAoLado && menu ? <MenuDemo onFechar={() => setMenu(false)} /> : undefined}>
        <ProvedorAcessibilidade>
          <ProvedorFolha>
            {/* Transição do iOS também no Android (ios_from_right), com voltar arrastando da tela toda */}
            <Stack screenOptions={{ headerShown: false, animation: reduz ? "fade" : "ios_from_right", fullScreenGestureEnabled: true, animationMatchesGesture: true, contentStyle: { backgroundColor: C.azul } }}>
              <Stack.Screen name="index" options={{ animation: "fade" }} />
              <Stack.Screen name="seguro" options={{ animation: "fade" }} />
              <Stack.Screen name="sucesso" options={{ animation: "fade", gestureEnabled: false }} />
              <Stack.Screen name="meu" options={{ animation: "fade", gestureEnabled: false }} />
              <Stack.Screen name="retorno" options={{ animation: "fade", gestureEnabled: false }} />
            </Stack>
          </ProvedorFolha>
        </ProvedorAcessibilidade>
      </Moldura>
      </ProvedorEstado>
    </GestureHandlerRootView>
  );
}
