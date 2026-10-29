// O gerente recebeu: o cliente acompanha como num app de entrega.
import { router } from "expo-router";
import { View } from "react-native";
import { GERENTE } from "@/logica/produto";
import { Botao, Card, Entra, T, Titulo } from "@/ui/base";
import { useAjuda } from "@/ui/ajuda";
import { Tela } from "@/ui/tela";
import { C, F } from "@/ui/tema";

export default function Avisado() {
  const ajuda = useAjuda("gerente");
  const passos = [["Proposta enviada", "Agora, com tudo o que você montou no app", "feito"], [`${GERENTE.nome} está revendo os dados`, "Ele confirma o que é estimativa, sem mudar as regras", "agora"], ["Proposta ajustada volta para você", "Você decide se contrata", ""]];
  return (
    <Tela titulo="Falar com o gerente" onAjuda={ajuda} onVoltar={() => router.back()} rodape={<>
        {/* Demonstração: o mesmo pedido, visto do lado do gerente (já preenchido pelo código do cliente) */}
        <Botao titulo="Abrir o portal do gerente" onPress={() => router.push("/painel")} />
        <Botao tipo="claro" titulo="Pular: simular resposta" onPress={() => router.replace("/retorno")} />
      </>}>
      <Titulo antes={`${GERENTE.nome} `} destaque="já recebeu" />
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15.5, marginBottom: 16 }}>Você pode fechar o app. Avisamos aqui quando ele responder.</T></Entra>
      <Card i={2}>
        {passos.map(([t, d, e], i) => (
          <View key={t} style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ alignItems: "center", width: 14 }}>
              <View style={{ width: 13, height: 13, borderRadius: 7, marginTop: 4, borderWidth: 2.5, borderColor: e === "feito" ? C.positivo : e === "agora" ? C.azul : "#C9CCD3", backgroundColor: e === "feito" ? C.positivo : e === "agora" ? C.azulClaro : C.branco }} />
              {i < passos.length - 1 ? <View style={{ flex: 1, width: 2, backgroundColor: "#E6E8EC" }} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: 16 }}><T s={{ fontFamily: F.b }}>{t}</T><T s={{ fontSize: 13.5, color: C.suave }}>{d}</T></View>
          </View>
        ))}
      </Card>
    </Tela>
  );
}
