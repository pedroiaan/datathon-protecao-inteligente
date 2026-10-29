// Falar com o gerente: só depois das dúvidas frequentes (último recurso). Escolhe o canal e pronto.
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { GERENTE } from "@/logica/produto";
import { Botao, Card, Entra, haptic, Icone, Rotulo, T, Titulo, Toque, RostoGerente } from "@/ui/base";
import { useAjuda } from "@/ui/ajuda";
import { Tela } from "@/ui/tela";
import { C, F } from "@/ui/tema";

export default function Gerente() {
  const ajuda = useAjuda("gerente");
  const [canal, setCanal] = useState("chat");
  return (
    <Tela titulo="Falar com o gerente" onAjuda={ajuda} fala={`Falar com seu gerente. O ${GERENTE.nome} recebe a proposta que você está vendo. Escolha como prefere: chat, ligação ou vídeo.`} onVoltar={() => router.back()} rodape={<Botao titulo={`Chamar o ${GERENTE.nome}`} onPress={() => router.push("/avisado")} />}>
      <Titulo antes="Falar com seu " destaque="gerente" />
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15.5, marginBottom: 16 }}>Ele recebe a proposta que você está vendo. Você não precisa repetir nada.</T></Entra>
      <Card i={2} style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: C.azul, alignItems: "center", justifyContent: "center" }}>
          <RostoGerente tam={58} inicial={GERENTE.inicial} />
          <View style={{ position: "absolute", right: 1, bottom: 1, width: 14, height: 14, borderRadius: 7, backgroundColor: "#FCFC30", borderWidth: 2.5, borderColor: C.branco }} />
        </View>
        <View><T s={{ fontFamily: F.x, fontSize: 17 }}>{GERENTE.nome}</T><T s={{ fontSize: 13.5, color: C.suave }}>Seu gerente · responde em cerca de 15 min</T></View>
      </Card>
      <Entra i={3}><Rotulo>Como prefere?</Rotulo></Entra>
      <Entra i={4}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[["chat", "Chat no app", "message-circle"], ["ligacao", "Me ligue", "phone"], ["video", "Vídeo", "video"]].map(([id, n, ic]) => (
            <Toque key={id} onPress={() => { haptic.toque(); setCanal(id); }} style={{ flex: 1, alignItems: "center", gap: 7, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: canal === id ? C.azul : C.borda, backgroundColor: canal === id ? C.azulFundo : C.branco }}>
              <Icone n={ic} tam={22} /><T s={{ fontFamily: F.b, fontSize: 13.5, color: canal === id ? C.azulEscuro : C.texto }}>{n}</T>
            </Toque>
          ))}
        </View>
      </Entra>
      <Entra i={5}><T s={{ fontSize: 13, color: C.suave, marginTop: 16 }}>O {GERENTE.nome} vê a mesma proposta que você e de onde veio cada dado, e continua a conversa de onde você parou.</T></Entra>
    </Tela>
  );
}
