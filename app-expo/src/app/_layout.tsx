import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold } from "@expo-google-fonts/figtree";
import { Nunito_800ExtraBold, Nunito_800ExtraBold_Italic, Nunito_900Black, useFonts } from "@expo-google-fonts/nunito";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReducedMotionConfig, ReduceMotion, useReducedMotion } from "react-native-reanimated";
import { DEMO } from "@/config";
import { ProvedorEstado } from "@/logica/estado";
import { ProvedorAcessibilidade } from "@/ui/acessibilidade";
import { ProvedorFolha } from "@/ui/folha";
import { Moldura } from "@/ui/moldura";
import { C } from "@/ui/tema";

SplashScreen.preventAutoHideAsync();

export default function Raiz() {
  const [ok] = useFonts({ Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold, Nunito_800ExtraBold, Nunito_800ExtraBold_Italic, Nunito_900Black });
  const reduz = useReducedMotion() && !DEMO.animarSempre;
  useEffect(() => { if (ok) SplashScreen.hideAsync(); }, [ok]);
  if (!ok) return null;
  // Troca de tela: a do sistema (push nativo). Telas de bloqueio e sucesso entram com fade.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {DEMO.animarSempre ? <ReducedMotionConfig mode={ReduceMotion.Never} /> : null}
      <Moldura>
        <ProvedorAcessibilidade>
        <ProvedorEstado>
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
        </ProvedorEstado>
        </ProvedorAcessibilidade>
      </Moldura>
    </GestureHandlerRootView>
  );
}
