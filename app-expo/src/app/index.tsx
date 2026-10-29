// 0 · Aviso na tela de bloqueio. O aviso justifica com fatos do próprio imóvel (não é isca).
// Segurar o relógio troca o caso da demonstração (perfis A, B e C do slide 14).
// Também dá para abrir direto num caso pelo endereço: /?caso=perfil_B_casa_familiar
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { estadoDoCaso, useEstado } from "@/logica/estado";
import { FICHAS } from "@/dados/contrato";
import { avisoCurto, cidade, ehApto, naCidade, rotuloCaso } from "@/logica/textos";
import { haptic, T, Toque } from "@/ui/base";
import { Bloqueio } from "@/ui/bloqueio";
import { useFolha } from "@/ui/folha";
import { C, F } from "@/ui/tema";

export default function Aviso() {
  const { s, set, casos } = useEstado();
  const folha = useFolha();
  const f = s.f, aviso = avisoCurto(f);
  const { caso } = useLocalSearchParams<{ caso?: string }>();
  useEffect(() => { if (caso && casos[caso] && caso !== s.caso) set(() => estadoDoCaso(caso)); }, [caso, casos, s.caso, set]);

  const trocarCaso = () => {
    haptic.leve();
    folha.abrir(
      <View style={{ gap: 8, paddingTop: 4 }}>
        <T s={{ color: C.suave, fontSize: 13.5 }}>Só para a demonstração. Os dados vêm da ficha do motor.</T>
        {Object.keys(casos).map((k) => (
          <Toque key={k} onPress={() => { haptic.toque(); set(() => estadoDoCaso(k)); folha.fechar(); }}
            style={{ borderRadius: 14, borderWidth: 2, borderColor: k === s.caso ? C.azul : C.borda, backgroundColor: k === s.caso ? C.azulFundo : C.branco, padding: 14 }}>
            <T s={{ fontFamily: F.b, color: k === s.caso ? C.azul : C.texto }}>{rotuloCaso(k, FICHAS.fichas[casos[k]])}</T>
          </Toque>
        ))}
        <Toque onPress={() => { haptic.toque(); folha.fechar(); setTimeout(() => router.push("/painel"), 220); }} rotulo="Abrir o portal do gerente"
          style={{ borderRadius: 14, backgroundColor: C.azul, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
          <T s={{ flex: 1, fontFamily: F.b, color: C.branco }}>Abrir o portal do gerente</T>
          <T s={{ color: C.branco }}>›</T>
        </Toque>
      </View>,
      "Trocar o caso",
    );
  };

  return (
    <Bloqueio
      hora="9:41"
      onSegurarRelogio={trocarCaso}
      avisos={[
        { app: "BB", quando: "agora", titulo: `${naCidade(f)}: o que está protegido?`, texto: aviso.texto, fonte: aviso.fonte,
          onPress: () => router.push("/seguro") },
        { app: "WhatsApp", quando: "2 min", texto: `Sua análise de proteção ${ehApto(f) ? "do apê" : "da casa"} em ${cidade(f)} está no app do BB, em Seguros. Não enviamos links.`,
          onPress: () => router.push("/seguro") },
      ]}
    />
  );
}
