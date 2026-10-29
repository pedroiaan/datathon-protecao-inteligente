// Proposta ajustada pelo gerente: ele confirma dados, não muda a regra. O cliente decide.
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { preco, useEstado } from "@/logica/estado";
import { comAjusteDoGerente } from "@/logica/gerente";
import { GERENTE, PLANOS } from "@/logica/produto";
import { brl2 } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { Botao, Card, Contador, Entra, SeloAjustado, T, Titulo } from "@/ui/base";
import { Tela } from "@/ui/tela";
import { C, F } from "@/ui/tema";

export default function Ajustada() {
  const { s, set } = useEstado();
  const ajuda = useAjuda("gerente");
  useEffect(() => { set(comAjusteDoGerente); }, [set]);
  // O que o gerente mudou vem do portal (sugestões escolhidas por ele); no atalho "Simular resposta", todas.
  const ms = s.notasGerente;
  return (
    <Tela titulo="Proposta ajustada" onAjuda={ajuda} onVoltar={() => router.dismissAll()} rodape={<Botao titulo="Conferir e contratar" onPress={() => router.push("/conferir")} />}>
      <Titulo antes={`${GERENTE.nome} `} destaque="ajustou" depois=" sua proposta" />
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15.5, marginBottom: 16 }}>Nada foi contratado. Veja o que mudou e decida.</T></Entra>
      <Card i={2}>
        {ms.map((m, i) => (
          <View key={m} style={{ flexDirection: "row", gap: 10, paddingVertical: 10, borderBottomWidth: i < ms.length - 1 ? 1 : 0, borderBottomColor: "#EEF0F3" }}>
            <Feather name="check" size={18} color={C.positivo} style={{ marginTop: 2 }} /><T s={{ flex: 1, fontSize: 14.5 }}>{m}</T>
          </View>
        ))}
      </Card>
      <Card i={3} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ gap: 6 }}><T s={{ fontFamily: F.b }}>Plano {PLANOS[s.plano].nome} · 12x de</T><SeloAjustado gerente /></View>
        <Contador valor={preco(s)} fmt={brl2} s={{ fontFamily: F.k, fontSize: 21, lineHeight: 27, color: C.azulEscuro }} />
      </Card>
    </Tela>
  );
}
