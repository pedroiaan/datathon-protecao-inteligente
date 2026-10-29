// 2/5 · O que te protege: uma situação "e se acontecer" para cada cobertura (sem × com seguro)
// e a lista compacta do que o plano cobre (abre com a seta; mostra 4 e "ver todas").
// Prejuízo de cada situação = mínimo da faixa do motor (estimativa conservadora, sem exagero).
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { Estado, incluidas, tipoAtual, useEstado } from "@/logica/estado";
import { COB, Cob, ORDEM_PLANO, PACOTES, PLANOS } from "@/logica/produto";
import { aprox, brl, franquiaTexto, planoDono } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { Botao, Card, Contador, Entra, haptic, Icone, Rotulo, T, Titulo, Toque } from "@/ui/base";
import { Ilustracao } from "@/ui/ilustracoes";
import { SeletorPlanos } from "@/ui/seletor";
import { Tela } from "@/ui/tela";
import { C, F } from "@/ui/tema";

const TROCA_IN = FadeIn.duration(240), TROCA_OUT = FadeOut.duration(140);
const REFLUXO = LinearTransition.duration(240);
const LIMITE = 4;

type Cena = { id: string; cob: Cob; rot: string; t: string; d: string; prej: number };
function cenarios(s: Estado): Cena[] {
  const f = s.f, b = f.campos.bens, predio = tipoAtual(s) !== "CASA";
  const min = (k: Cob, alt: number) => (s.faixa[k] ? s.faixa[k]![0] : alt);
  return [
    { id: "agua", cob: "agua", rot: "Alagamento", t: "Chuva forte e cano estourado", d: "A água molha piso, móveis e aparelhos.", prej: min("agua", b.molhaveis ? b.molhaveis.min : b.min) },
    { id: "raio", cob: "eletricos", rot: "Queda de raio", t: "Pico de energia na tempestade", d: "Queima TV, geladeira e notebook ligados na tomada.", prej: min("eletricos", b.eletricos ? b.eletricos.min : 8000) },
    { id: "vizinho", cob: "rc", rot: "Danos a terceiros", t: predio ? "Infiltração no apê de baixo" : "Um galho da sua casa cai no carro do vizinho", d: predio ? "A água da sua máquina desce para o vizinho. Quem causa, paga o conserto." : "Quem causa o dano paga o conserto.", prej: min("rc", 30000) },
    { id: "roubo", cob: "roubo", rot: "Arrombamento", t: "Arrombaram a porta", d: "Levaram notebook, celular e TV.", prej: min("roubo", b.portateis ? b.portateis.min : 5000) },
    { id: "vidros", cob: "vidros", rot: "Vidro quebrado", t: "Uma bola quebra a janela", d: "Janelas, box e espelhos.", prej: min("vidros", 2000) },
    { id: "vento", cob: "vendaval", rot: "Vendaval", t: predio ? "Vento quebra a janela" : "Vento arranca as telhas", d: "E a chuva entra junto.", prej: min("vendaval", 5000) },
    { id: "fogo", cob: "incendio", rot: "Incêndio", t: "Um curto na cozinha", d: "O fogo atinge armários, piso e móveis.", prej: Math.round((s.valores.incendio * 0.25) / 1000) * 1000 },
    { id: "impacto", cob: "impacto", rot: "Batida de carro", t: "Um carro bate no muro", d: "Muro, portão e fachada danificados.", prej: min("impacto", 10000) },
    { id: "aluguel", cob: "aluguel", rot: "Casa interditada", t: "A casa precisa de reforma depois do sinistro", d: "Você precisa morar em outro lugar por alguns meses.", prej: min("aluguel", 12000) },
    { id: "despesas", cob: "despesas", rot: "Emergência", t: "Telhado aberto depois da tempestade", d: "Lona, escoramento e chaveiro na hora, para o dano não aumentar.", prej: min("despesas", 2500) },
  ];
}

function LinhaCob({ k, s, aberta, onAbrir, ultima }: { k: Cob; s: Estado; aberta: boolean; onAbrir: () => void; ultima: boolean }) {
  const P = COB[k], adicional = k === "rc" && s.plano !== "TOTAL";
  return (
    <Animated.View layout={REFLUXO} style={{ borderBottomWidth: ultima ? 0 : 1, borderBottomColor: "#EEF0F3" }}>
      <Pressable onPress={() => { haptic.toque(); onAbrir(); }} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}>
        <View style={{ width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: C.azulClaro }}><Icone n={P.ic} tam={19} /></View>
        <T s={{ flex: 1, fontFamily: F.b, fontSize: 15 }} numberOfLines={1}>{P.curto}{adicional ? " · adicional" : ""}</T>
        <T s={{ fontFamily: F.x, color: C.azulEscuro, fontSize: 14.5 }}>até {aprox(s.valores[k])}</T>
        <Feather name={aberta ? "chevron-up" : "chevron-down"} size={18} color="#8D9199" />
      </Pressable>
      {aberta ? (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)} style={{ paddingLeft: 50, paddingBottom: 12 }}>
          <T s={{ fontSize: 13.5, color: "#3a3d44" }}>{P.nome}. {P.desc}</T>
          <T s={{ fontSize: 12.5, color: C.azulEscuro, marginTop: 4, fontFamily: F.b }}>{franquiaTexto(k)}</T>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export default function Cobre() {
  const { s } = useEstado();
  const ajuda = useAjuda("cobre");
  const [cena, setCena] = useState("agua");
  const [aberta, setAberta] = useState<Cob | null>(null);
  const [todas, setTodas] = useState(false);
  const [naoTodas, setNaoTodas] = useState(false);
  const cs = cenarios(s), c = cs.find((x) => x.id === cena)!, inc = incluidas(s), p = PLANOS[s.plano];
  const temCob = inc.includes(c.cob) && s.ligadas[c.cob];
  const P = COB[c.cob];
  const apto = tipoAtual(s) === "APARTAMENTO";
  const paga = temCob ? Math.min(c.prej, P.fr[0] ? Math.max(P.fr[1], P.fr[0] * c.prej) : P.fr[1]) + Math.max(0, c.prej - s.valores[c.cob]) : c.prej;
  const nao = ORDEM_PLANO.slice(ORDEM_PLANO.indexOf(s.plano) + 1).flatMap((pl) => PLANOS[pl].extras).filter((k, i, a) => a.indexOf(k) === i && !inc.includes(k));
  const fora: [string, string][] = [
    ...nao.map((k) => [COB[k].curto, `Vem no ${PLANOS[planoDono(k)].nome}.`] as [string, string]),
    ["Desgaste e falta de manutenção", "Cano velho, infiltração antiga e cupim não entram em nenhum plano."],
    ["Obra ou reforma", "Imóvel em obra não pode ser segurado até a obra acabar."],
    ...(s.f.campos.uso.valor === "LAZER_VERANEIO" ? [["Roubo com a casa vazia", "O roubo não cobre residência desocupada."] as [string, string]] : []),
  ];
  const lista = todas ? inc : inc.slice(0, LIMITE);
  const fala = `E se acontecer ${apto ? "no seu apê" : "na sua casa"}? ${c.t}. Sem seguro, sai do seu bolso ${brl(c.prej)}. ${temCob ? `Com o ${p.nome}, você paga ${brl(paga)}.` : `O ${p.nome} não tem essa cobertura.`} O ${p.nome} cobre ${inc.map((k) => COB[k].curto).join(", ")}.`;

  return (
    <Tela passo={2} rotulo="O que te protege" onVoltar={() => router.back()} onFechar={() => router.dismissAll()} onAjuda={ajuda} fala={fala}
      rodape={<Botao titulo="Avançar" onPress={() => router.push("/plano")} />}>
      <Titulo antes={apto ? "E se acontecer no " : "E se acontecer na "} destaque={apto ? "seu apê" : "sua casa"} depois="?" />
      <Entra i={1}>
        <T s={{ fontSize: 14.5, color: C.suave, marginBottom: 14 }}>Compare os planos: toque em um para ver o que ele cobre em cada situação.</T>
        <View style={{ marginTop: 6, marginBottom: 14 }}><SeletorPlanos /></View>
      </Entra>
      <Entra i={1}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 6, marginBottom: 12 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {cs.map((x) => {
            const on = x.id === cena;
            return (
              <Toque key={x.id} onPress={() => { haptic.toque(); setCena(x.id); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: on ? C.azul : C.branco, borderWidth: 1.5, borderColor: on ? C.azul : C.borda }}>
                <Icone n={COB[x.cob].ic} tam={15} cor={on ? C.branco : C.azul} />
                <T s={{ fontFamily: F.b, fontSize: 13.5, color: on ? C.branco : C.texto }}>{x.rot}</T>
              </Toque>
            );
          })}
        </ScrollView>
      </Entra>
      <Card i={2} style={{ padding: 0, overflow: "hidden" }}>
        <View style={{ height: 136, backgroundColor: C.azulFundo, alignItems: "center", justifyContent: "center" }}>
          <Animated.View key={c.id} entering={TROCA_IN} exiting={TROCA_OUT} style={{ width: "86%" }}><Ilustracao id={c.id} predio={tipoAtual(s) !== "CASA"} h={128} /></Animated.View>
        </View>
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <T s={{ fontFamily: F.x, fontSize: 17 }}>{c.t}</T>
          <T s={{ fontSize: 13.5, color: C.suave, marginTop: 2 }}>{c.d}</T>
        </View>
        <View style={{ flexDirection: "row", gap: 10, padding: 16 }}>
          <View style={{ flex: 1, borderRadius: 14, padding: 12, backgroundColor: C.vermelhoClaro }}>
            <T s={{ fontSize: 12.5, lineHeight: 16, color: C.vermelho }}>Sem seguro, sai do seu bolso</T>
            <Contador valor={c.prej} fmt={brl} s={{ fontFamily: F.k, fontSize: 22, lineHeight: 28, color: C.vermelho, marginTop: 4 }} />
          </View>
          <View style={{ flex: 1, borderRadius: 14, padding: 12, backgroundColor: temCob ? C.positivoClaro : "#F1F2F4" }}>
            <T s={{ fontSize: 12.5, lineHeight: 16, color: temCob ? C.positivo : C.suave }}>{temCob ? `Com o ${p.nome}, você paga` : `Não está no ${p.nome}`}</T>
            <Contador valor={paga} fmt={brl} s={{ fontFamily: F.k, fontSize: 22, lineHeight: 28, color: temCob ? C.positivo : C.suave, marginTop: 4 }} />
          </View>
        </View>
        <T s={{ fontSize: 12, color: C.suave, paddingHorizontal: 16, paddingBottom: 14, marginTop: -6 }}>
          {temCob ? `Estimativa mínima para o seu imóvel. Você paga só a franquia${c.prej > s.valores[c.cob] ? " e o que passar do valor contratado" : ""}.` : `${P.curto} vem no ${PLANOS[planoDono(c.cob)].nome}.`}
        </T>
      </Card>

      <Entra i={3}><Rotulo>{`O que o ${p.nome} cobre · ${inc.length}`}</Rotulo></Entra>
      <Card i={4} style={{ paddingVertical: 2 }}>
        {lista.map((k, i) => <LinhaCob key={k} k={k} s={s} aberta={aberta === k} onAbrir={() => setAberta(aberta === k ? null : k)} ultima={i === lista.length - 1 && inc.length <= LIMITE} />)}
        {inc.length > LIMITE ? (
          <Animated.View layout={REFLUXO}>
            <Pressable onPress={() => { haptic.toque(); setTodas(!todas); }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 13 }}>
              <T s={{ fontFamily: F.x, fontSize: 14, color: C.azul }}>{todas ? "Ver menos" : `Ver todas as ${inc.length} coberturas`}</T>
              <Feather name={todas ? "chevron-up" : "chevron-down"} size={17} color={C.azul} />
            </Pressable>
          </Animated.View>
        ) : null}
      </Card>

      <Animated.View layout={REFLUXO}><Rotulo>Não cobre</Rotulo></Animated.View>
      <Animated.View layout={REFLUXO}>
        <Card style={{ paddingVertical: 4 }}>
          {(naoTodas ? fora : fora.slice(0, 2)).map(([t, d]) => (
            <View key={t} style={{ flexDirection: "row", gap: 12, paddingVertical: 10, alignItems: "center" }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F2F4" }}><Feather name="x" size={15} color="#9A9EA6" /></View>
              <View style={{ flex: 1 }}><T s={{ fontFamily: F.b, fontSize: 14.5 }}>{t}</T><T s={{ fontSize: 12.5, color: C.suave, lineHeight: 17 }}>{d}</T></View>
            </View>
          ))}
          {fora.length > 2 ? (
            <Pressable onPress={() => { haptic.toque(); setNaoTodas(!naoTodas); }} style={{ alignItems: "center", paddingVertical: 10 }}>
              <T s={{ fontFamily: F.x, fontSize: 14, color: C.azul }}>{naoTodas ? "Ver menos" : `Ver mais ${fora.length - 2}`}</T>
            </Pressable>
          ) : null}
        </Card>
      </Animated.View>

      <Animated.View layout={REFLUXO}>
        <Rotulo>{`Assistências 24h · ${p.pacotes} ${p.pacotes > 1 ? "pacotes" : "pacote"}`}</Rotulo>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {PACOTES.map(([n, ic], i) => (
            <View key={n} style={{ width: 96, backgroundColor: C.branco, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 6, alignItems: "center", opacity: i < p.pacotes ? 1 : 0.35 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center", marginBottom: 5 }}><Icone n={ic} tam={16} /></View>
              <T s={{ fontFamily: F.m, fontSize: 12, lineHeight: 15, textAlign: "center" }}>{n}</T>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Tela>
  );
}
