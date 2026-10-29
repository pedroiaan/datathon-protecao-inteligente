// Portal do gerente · fila: os pedidos dos clientes, cada um com o código do cliente.
// O código só aparece aqui (o cliente não precisa ditar nada): o gerente abre o pedido e já
// encontra a ficha do motor e o que o cliente montou no app, tudo preenchido.
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { FICHAS } from "@/dados/contrato";
import { useEstado } from "@/logica/estado";
import { filaDoGerente, normalizaCodigo } from "@/logica/gerente";
import { GERENTE, PLANOS } from "@/logica/produto";
import { cidade, NOME_TIPO } from "@/logica/textos";
import { Card, Entra, haptic, Rotulo, T, Titulo, Toque, RostoGerente } from "@/ui/base";
import { useAjuda } from "@/ui/ajuda";
import { IMAGENS } from "@/ui/imagens";
import { Tela } from "@/ui/tela";
import { C, F, TIPO } from "@/ui/tema";

export default function Painel() {
  const ajuda = useAjuda("painel", { semGerente: true });
  const { s, casos } = useEstado();
  const [busca, setBusca] = useState("");
  const fila = filaDoGerente(casos, FICHAS.fichas, s.caso);
  const q = normalizaCodigo(busca), qNome = busca.trim().toLowerCase();
  const vistos = busca ? fila.filter((p) => normalizaCodigo(p.codigo).includes(q) || p.nome.toLowerCase().includes(qNome)) : fila;
  const abrir = (codigo: string) => { haptic.toque(); router.push({ pathname: "/painel/[codigo]", params: { codigo } }); };

  return (
    <Tela titulo="Portal do gerente" onVoltar={() => router.back()} onAjuda={ajuda}
      fala={`Portal do gerente. ${fila.length} pedidos de seguro residencial. O primeiro chegou agora: ${fila[0]?.nome}.`}
      heroi={
        <View style={{ paddingHorizontal: 20, paddingBottom: 18, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.amarelo, alignItems: "center", justifyContent: "center" }}>
              <RostoGerente tam={44} cor={C.azulEscuro} inicial={GERENTE.inicial} />
            </View>
            <View style={{ flex: 1 }}>
              <T s={{ fontFamily: F.x, fontSize: 20, lineHeight: 25, color: C.branco }}>Olá, {GERENTE.nome}</T>
              <T s={{ fontSize: 13.5, color: C.branco, opacity: 0.85 }}>Seguro Residencial · sua carteira</T>
            </View>
            {IMAGENS.gerente_painel ? <Image source={IMAGENS.gerente_painel} contentFit="contain" style={{ width: 108, height: 72 }} /> : null}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.branco, borderRadius: 14, paddingHorizontal: 14, height: 48 }}>
            <Feather name="search" size={18} color={C.suave} />
            <TextInput value={busca} onChangeText={setBusca} placeholder="Código do cliente (SR-...) ou nome" placeholderTextColor={C.apagado}
              autoCapitalize="characters" autoCorrect={false} accessibilityLabel="Buscar pelo código do cliente ou pelo nome"
              style={{ flex: 1, fontFamily: F.m, fontSize: 15.5, color: C.texto, outlineStyle: "none" } as any} />
            {busca ? <Toque onPress={() => setBusca("")} rotulo="Limpar busca"><Feather name="x-circle" size={18} color={C.suave} /></Toque> : null}
          </View>
        </View>
      }>
      <Titulo antes="Pedidos de " destaque="seguro" />
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15, marginBottom: 14 }}>Cada cliente tem um código. Abra o pedido: a ficha do motor e o que ele montou no app já vêm preenchidos.</T></Entra>
      <Rotulo>{busca ? `${vistos.length} encontrado${vistos.length === 1 ? "" : "s"}` : `${fila.length} pedidos`}</Rotulo>
      {vistos.map((p, i) => (
        <Card key={p.codigo} i={2 + i} style={{ padding: 0 }}>
          <Toque onPress={() => abrir(p.codigo)} rotulo={`Abrir pedido de ${p.nome}, código ${p.codigo}`} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 16 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: p.novo ? C.azul : C.azulClaro, alignItems: "center", justifyContent: "center" }}>
              <T s={{ fontFamily: F.k, fontSize: 14, color: p.novo ? C.branco : C.azul }}>{p.nome.split(" ").map((x) => x[0]).filter((x) => x === x.toUpperCase()).slice(0, 2).join("")}</T>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <T s={[TIPO.destaque, { flexShrink: 1 }]} numberOfLines={1}>{p.nome}</T>
                {p.novo ? <View style={{ backgroundColor: C.amarelo, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 1 }}><T s={{ fontFamily: F.s, fontSize: 11, lineHeight: 15, color: C.azulEscuro }}>NOVO</T></View> : null}
              </View>
              <T s={[TIPO.apoio, { color: C.suave }]} numberOfLines={1}>{NOME_TIPO[p.f.campos.tipo.valor] || "Imóvel"} · {cidade(p.f)} · {PLANOS[p.f.plano as keyof typeof PLANOS].nome}</T>
              <T s={[TIPO.legenda, { color: C.azul, letterSpacing: 0.6 }]}>{p.codigo} · {p.quando}</T>
            </View>
            <Feather name="chevron-right" size={20} color={C.suave} />
          </Toque>
        </Card>
      ))}
      {busca && !vistos.length ? <T s={{ color: C.suave, textAlign: "center", marginTop: 20 }}>Nenhum cliente com esse código. Confira as letras: o código não usa 0, O, 1, I nem L.</T> : null}
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 14, paddingHorizontal: 4 }}>
        <Feather name="lock" size={14} color={C.suave} />
        <T s={{ flex: 1, fontSize: 12.5, color: C.suave, lineHeight: 17 }}>Visível só para o gerente do cliente. Renda e idade não aparecem: não entram na análise.</T>
      </View>
    </Tela>
  );
}
