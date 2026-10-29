// 4/5 · Personalizar: a lista editável de coberturas (src/ui/coberturas.tsx) sobre o estado do
// cliente, o preço ao vivo e o aviso quando o Prático fica igual ao Essencial.
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { ajustado, Estado, preco, sugeridoDe, useEstado } from "@/logica/estado";
import { COB, Cob, PLANOS } from "@/logica/produto";
import { brl2 } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { Botao, Contador, Entra, SeloAjustado, T, Titulo, Toque } from "@/ui/base";
import { ListaCoberturas } from "@/ui/coberturas";
import { useFolha } from "@/ui/folha";
import { Tela } from "@/ui/tela";
import { C, F } from "@/ui/tema";

const REFLUXO = LinearTransition.duration(240);

export default function Ajuste() {
  const { s, set } = useEstado();
  const ajuda = useAjuda("ajuste");
  const folha = useFolha();
  const sugeridos = Object.fromEntries((Object.keys(COB) as Cob[]).map((k) => [k, sugeridoDe(s, k)])) as Estado["valores"];
  const dif = preco(s) - preco(s, s.plano, sugeridos, Object.fromEntries((Object.keys(COB) as Cob[]).map((k) => [k, true])) as Estado["ligadas"]);
  const vira = s.plano === "PRATICO" && !s.ligadas.roubo && !s.ligadas.vidros;

  return (
    <Tela passo={4} rotulo="Personalizar" fala={`Ajuste do seu jeito. Plano ${PLANOS[s.plano].nome}, 12 vezes de ${brl2(preco(s))}. Toque num valor para mudar.`} onVoltar={() => router.back()} onFechar={() => router.dismissAll()} onAjuda={ajuda}
      rodape={<>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}><View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: 6, rowGap: 3 }}><T s={{ fontSize: 13, color: C.suave }}>Plano {PLANOS[s.plano].nome} · 12x de</T>{ajustado(s) ? <SeloAjustado gerente={s.ajustada} /> : null}</View>
            <T s={{ fontSize: 12.5, fontFamily: F.b, color: Math.abs(dif) < 0.01 ? C.suave : dif > 0 ? C.azulEscuro : C.positivo }}>{Math.abs(dif) < 0.01 ? "valores sugeridos" : `${dif > 0 ? "+" : "−"}${brl2(Math.abs(dif))} do sugerido`}</T></View>
          <Contador valor={preco(s)} fmt={brl2} s={{ fontFamily: F.k, fontSize: 24, lineHeight: 30, color: C.azulEscuro }} />
        </View>
        <Botao titulo="Salvar e avançar" onPress={() => router.push("/conferir")} />
      </>}>
      <Titulo antes="Ajuste do " destaque="seu jeito" />
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15.5, marginBottom: 4 }}>Toque num valor para mudar. Já sugerimos o meio da faixa calculada para o seu imóvel.</T></Entra>
      {vira ? (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} layout={REFLUXO} style={{ flexDirection: "row", gap: 10, backgroundColor: C.ambarClaro, borderRadius: 14, padding: 14, marginTop: 12 }}>
          <Feather name="alert-triangle" size={18} color={C.ambar} />
          <T s={{ flex: 1, fontSize: 14, color: "#5f3e00" }}>Sem roubo e sem vidros, o Prático fica igual ao Essencial, que custa {brl2(preco(s) - preco(s, "ESSENCIAL"))} a menos por mês.</T>
          <Toque onPress={() => { set((x) => ({ ...x, plano: "ESSENCIAL", ligadas: { ...x.ligadas, roubo: true, vidros: true } })); folha.toast("Plano trocado para o Essencial"); }}>
            <T s={{ fontFamily: F.x, fontSize: 14, color: C.azulEscuro, textDecorationLine: "underline" }}>Trocar</T>
          </Toque>
        </Animated.View>
      ) : null}
      <ListaCoberturas e={s} mudar={set} />
    </Tela>
  );
}
