// Entrada do produto (Central de Seguros > Seguro Residencial), no lugar da foto genérica do app atual:
// ilustração da casa protegida e o porquê em fatos curtos do próprio imóvel, cada um com a origem.
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { tipoAtual, useEstado } from "@/logica/estado";
import { cidade, fatosCurtos } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { Botao, Entra, Icone, T } from "@/ui/base";
import { HeroiCasa } from "@/ui/ilustracoes";
import { Tela } from "@/ui/tela";
import { C, F, SOMBRA } from "@/ui/tema";

export default function Seguro() {
  const { s } = useEstado();
  const ajuda = useAjuda("seguro");
  const fatos = fatosCurtos(s.f), apto = tipoAtual(s) === "APARTAMENTO";
  return (
    <Tela titulo="Central de Seguros" onVoltar={() => router.back()} onAjuda={ajuda}
      fala={"Seguro Residencial. Por que te avisamos. " + fatos.map((x) => `${x.valor} ${x.texto}`).join(". ")}
      heroi={<View style={{ marginTop: 4, marginBottom: -20 }}><HeroiCasa h={196} /></View>}
      rodape={<Botao titulo="Ver minha proposta" onPress={() => router.push("/casa")} />}>
      <Entra i={0}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
          <T s={{ flex: 1, fontFamily: F.x, fontSize: 24, lineHeight: 29, letterSpacing: -0.4 }} numberOfLines={1}>Seguro Residencial</T>
          <View style={{ backgroundColor: C.amarelo, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 }}>
            <T s={{ fontFamily: F.b, color: C.azulEscuro, fontSize: 12.5 }}>Feito para você</T>
          </View>
        </View>
        <T s={{ fontSize: 16, lineHeight: 23, color: "#3A3D46", marginTop: 6, marginBottom: 22 }}>
          Olhamos {apto ? "o seu apê" : "a sua casa"} em {cidade(s.f)}. Isto é o que ficaria com você se algo acontecer:
        </T>
      </Entra>
      <Entra i={1}>
        <View style={{ backgroundColor: C.branco, borderRadius: 18, paddingHorizontal: 16, ...SOMBRA }}>
          {fatos.map((x, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 14, paddingVertical: 16, borderTopWidth: i ? 1 : 0, borderTopColor: "#EEF0F4" }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.azulFundo, alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                <Icone n={x.ic} tam={21} />
              </View>
              <View style={{ flex: 1 }}>
                <T s={{ fontFamily: F.x, fontSize: 21, lineHeight: 26, color: C.azulEscuro, letterSpacing: -0.3 }}>{x.valor}</T>
                <T s={{ fontSize: 15, lineHeight: 21, color: C.texto }}>{x.texto}</T>
                <T s={{ fontSize: 12.5, color: "#8A8E97", marginTop: 3 }}>Fonte: {x.fonte}</T>
              </View>
            </View>
          ))}
        </View>
      </Entra>
      <Entra i={2}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 16, paddingHorizontal: 4 }}>
          <Feather name="shield" size={15} color={C.suave} />
          <T s={{ flex: 1, fontSize: 13, color: C.suave, lineHeight: 18 }}>Usamos dados do imóvel e das suas transações. A idade nunca entra na análise.</T>
        </View>
      </Entra>
    </Tela>
  );
}
