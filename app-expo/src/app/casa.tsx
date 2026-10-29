// 1/5 · Sua casa: o que o banco já sabe, tudo editável (o cliente pode ter outro imóvel ou algo
// pode ter mudado). A área não aparece: o motor usa por dentro. Mudar um dado do banco baixa a confiança.
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CampoEditavel, DO_BANCO, Estado, mudancas, perguntasDaTela, useEstado, tipoAtual, nivelDaAnalise } from "@/logica/estado";
import { PLANOS, Plano } from "@/logica/produto";
import { aprox, cidade, entre, NOME_TIPO, NOME_USO, NOME_VINCULO, perguntaCliente, titulo, uf } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { Botao, Card, Entra, haptic, Rotulo, T, Titulo } from "@/ui/base";
import { useFolha } from "@/ui/folha";
import { Tela } from "@/ui/tela";
import { C, EASE_OUT, F, SOMBRA } from "@/ui/tema";

const COR: Record<string, string> = { BAIXA: "#9AA8FF", MEDIA: C.azul, ALTA: C.azulEscuro };
const NOME: Record<string, string> = { BAIXA: "Baixa", MEDIA: "Média", ALTA: "Alta" };
const REFLUXO = LinearTransition.duration(220);


function Confianca({ s }: { s: Estado }) {
  const { nivel } = nivelDaAnalise(s);
  const w = useSharedValue(0);
  const alvo = { BAIXA: 0.3, MEDIA: 0.64, ALTA: 1 }[nivel]!;
  useEffect(() => { w.set(withTiming(alvo, { duration: 600, easing: EASE_OUT })); }, [alvo, w]);
  const st = useAnimatedStyle(() => ({ width: `${w.get() * 100}%` }));
  return (
    <Card i={3} style={{ paddingVertical: 14 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <T s={{ fontFamily: F.b, fontSize: 15 }}>Confiança da análise</T>
        <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: "#ECEEF4", overflow: "hidden" }}>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 4, backgroundColor: COR[nivel], transitionProperty: "backgroundColor", transitionDuration: 300 } as any, st]} />
        </View>
        <T s={{ fontFamily: F.x, fontSize: 15, color: COR[nivel] }}>{NOME[nivel]}</T>
      </View>
      <T s={{ fontSize: 13.5, lineHeight: 19, color: C.suave, marginTop: 8 }}>
        {mudancas(s) ? "Você mudou um dado que veio do banco, então vamos confirmar antes de contratar. " : ""}
        Nossa sugestão é uma estimativa feita com os dados que o banco tem, não uma certeza. Quanto mais você confirma, mais certa ela fica.
      </T>
    </Card>
  );
}

export default function Casa() {
  const { s, set } = useEstado();
  const ajuda = useAjuda("casa");
  const folha = useFolha();
  const f = s.f, c = f.campos, b = c.bens;

  if (f.elegibilidade === "NAO") {
    return (
      <Tela passo={1} rotulo="Informações do imóvel" onVoltar={() => router.back()} onFechar={() => router.dismissAll()} onAjuda={ajuda}
        fala="Este endereço já tem seguro. Não dá para fazer outra proposta para o mesmo endereço. O seu gerente pode revisar a apólice atual com você."
        rodape={<Botao titulo="Revisar com meu gerente" onPress={() => router.push("/gerente")} />}>
        <Titulo antes="Este endereço " destaque="já tem seguro" />
        <Entra i={1}><T s={{ color: C.suave, marginBottom: 16 }}>{titulo(f.complemento)} · {cidade(f)}/{uf(f)}</T></Entra>
        <Card i={2}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Feather name="shield" size={22} color={C.azul} />
            <View style={{ flex: 1 }}>
              <T s={{ fontFamily: F.b }}>Não dá para fazer outra proposta para o mesmo endereço.</T>
              <T s={{ fontSize: 13.5, color: C.suave, marginTop: 6 }}>Pelos seus dados, é provável que este imóvel já tenha o Seguro Residencial da BB. O seu gerente pode revisar a apólice atual com você.</T>
            </View>
          </View>
        </Card>
        <Card i={3}><T s={{ fontSize: 14, color: C.suave }}>Pela análise do imóvel, o plano que faria sentido hoje é o <T s={{ fontFamily: F.b, fontSize: 14 }}>{PLANOS[f.plano as Plano].nome}</T>. Serve só de referência para a conversa.</T></Card>
      </Tela>
    );
  }

  const endereco = `${titulo(f.complemento)} · ${cidade(f)}/${uf(f)}`;
  const CAMPOS: { k: CampoEditavel; rotulo: string; pergunta: string; opcoes: [string, string][] }[] = [
    { k: "tipo", rotulo: "Tipo", pergunta: "Qual o tipo do imóvel?", opcoes: Object.entries(NOME_TIPO) },
    { k: "uso", rotulo: "Uso", pergunta: "Qual é a utilização do imóvel?", opcoes: [["RESIDENCIAL_HABITUAL", NOME_USO.RESIDENCIAL_HABITUAL], ["LAZER_VERANEIO", NOME_USO.LAZER_VERANEIO], ["RESIDENCIAL_COMERCIAL", NOME_USO.RESIDENCIAL_COMERCIAL], ...(c.uso.valor === "RESIDENCIAL_LOCADO_A_TERCEIROS" ? [["RESIDENCIAL_LOCADO_A_TERCEIROS", NOME_USO.RESIDENCIAL_LOCADO_A_TERCEIROS] as [string, string]] : [])] },
    { k: "endereco", rotulo: "Endereço", pergunta: "Qual imóvel você quer proteger?", opcoes: [["BANCO", endereco], ["OUTRO", "Outro imóvel meu"]] },
    { k: "vinculo", rotulo: "Relação com o imóvel", pergunta: "Qual é a sua relação com o imóvel?", opcoes: Object.entries(NOME_VINCULO) },
    { k: "bens", rotulo: "Bens dentro de casa", pergunta: "Quanto valem os móveis, eletrodomésticos e eletrônicos?", opcoes: [["MENOS", `Menos de ${aprox(b.min)}`], ["FAIXA", entre(b.min, b.max)], ["MAIS", `Mais de ${aprox(b.max)}`]] },
  ];
  const atual = (k: CampoEditavel) => s.edicoes[k] || DO_BANCO[k](f);
  const nomeDe = (campo: (typeof CAMPOS)[number]) => {
    const v = atual(campo.k);
    if (campo.k === "endereco" && v === "OUTRO") return "Outro imóvel (vamos confirmar)";
    return (campo.opcoes.find(([cod]) => cod === v) || [v, v])[1];
  };
  const escolher = (campo: (typeof CAMPOS)[number]) => {
    const doBanco = DO_BANCO[campo.k](f);
    folha.abrir(
      <View>
        {campo.opcoes.map(([cod, nome], i) => {
          const on = cod === atual(campo.k);
          return (
            <Pressable key={cod} onPress={() => { haptic.toque(); set((x) => ({ ...x, edicoes: { ...x.edicoes, [campo.k]: cod } })); folha.fechar(); }}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: i < campo.opcoes.length - 1 ? 1 : 0, borderBottomColor: "#EEF0F3" }}>
              <View style={{ flex: 1 }}>
                <T s={{ fontSize: 16.5, fontFamily: on ? F.s : F.r, color: on ? C.azul : C.texto }}>{nome}</T>
                {cod === doBanco ? <T s={{ fontSize: 12.5, color: C.suave }}>Pelos dados do banco</T> : null}
              </View>
              {on ? <Feather name="check" size={20} color={C.azul} /> : <Feather name="chevron-right" size={20} color="#9EA2AA" />}
            </Pressable>
          );
        })}
      </View>,
      campo.pergunta,
    );
  };
  const ps = perguntasDaTela(f);
  const responder = (cod: string, op: string) => { haptic.toque(); set((x) => ({ ...x, resp: { ...x.resp, [cod]: op } })); };
  const lar = tipoAtual(s) === "APARTAMENTO" ? ["do ", "seu apê"] : ["da ", "sua casa"];
  const fala = `Já sabemos bastante ${lar.join("")}. ` + CAMPOS.map((cp) => `${cp.rotulo}: ${nomeDe(cp)}`).join(". ") + ". Toque em qualquer item para mudar.";

  return (
    <Tela passo={1} rotulo="Informações do imóvel" onVoltar={() => router.back()} onFechar={() => router.dismissAll()} onAjuda={ajuda} fala={fala}
      rodape={<Botao titulo="Avançar" onPress={() => router.push("/cobre")} />}>
      <Titulo antes={`Já sabemos bastante ${lar[0]}`} destaque={lar[1]} />
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15.5, marginBottom: 16 }}>Confira e toque no que precisar mudar.</T></Entra>
      <Entra i={2}>
        <View style={{ backgroundColor: C.branco, borderRadius: 18, ...SOMBRA, marginBottom: 12 }}>
          {CAMPOS.map((cp, i) => {
            const mudou = s.edicoes[cp.k] && s.edicoes[cp.k] !== DO_BANCO[cp.k](f);
            return (
              <Pressable key={cp.k} onPress={() => { haptic.toque(); escolher(cp); }}
                style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 13, backgroundColor: pressed ? "#F4F6FC" : "transparent", borderTopWidth: i ? 1 : 0, borderTopColor: "#EEF0F4", borderTopLeftRadius: i ? 0 : 18, borderTopRightRadius: i ? 0 : 18 })}>
                <View style={{ flex: 1 }}>
                  <T s={{ fontSize: 13, color: C.suave }}>{cp.rotulo}</T>
                  <T s={{ fontFamily: F.b, fontSize: 16 }}>{nomeDe(cp)}</T>
                  {mudou ? <Animated.View entering={FadeIn.duration(180)}><T s={{ fontSize: 12, color: C.azul, fontFamily: F.m }}>Alterado por você</T></Animated.View> : null}
                </View>
                <Feather name="chevron-right" size={20} color="#9EA2AA" />
              </Pressable>
            );
          })}
        </View>
      </Entra>
      <Confianca s={s} />
      {ps.length ? <Entra i={4}><Rotulo>{ps.length === 1 ? "Só uma pergunta" : `Só ${ps.length} perguntas rápidas`}</Rotulo></Entra> : null}
      {ps.map((p: any, i: number) => {
        const q = perguntaCliente(p, f), r = s.resp[p.codigo];
        return (
          <Card key={p.codigo} i={5 + i} style={{ paddingBottom: 8 }}>
            <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
              <T s={{ flex: 1, fontFamily: F.s, fontSize: 16, lineHeight: 22 }}>{q.texto}</T>
              {r ? <Animated.View entering={FadeIn.duration(200)}><Feather name="check-circle" size={20} color={C.azul} /></Animated.View> : null}
            </View>
            {q.ajuda ? <T s={{ fontSize: 13.5, color: C.suave, marginTop: 4 }}>{q.ajuda}</T> : null}
            <Animated.View layout={REFLUXO} style={{ marginTop: 8 }}>
              {q.opcoes.map((o) => {
                const on = r === o;
                return (
                  <Pressable key={o} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => responder(p.codigo, o)} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 11 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: on ? 7 : 2, borderColor: on ? C.azul : "#B5B9C1", transitionProperty: ["borderWidth", "borderColor"], transitionDuration: 160 } as any} />
                    <T s={{ flex: 1, fontSize: 15, fontFamily: on ? F.b : F.r, color: on ? C.azulEscuro : C.texto }}>{o}</T>
                  </Pressable>
                );
              })}
            </Animated.View>
            {r && q.notas?.[r] ? (
              <Animated.View entering={FadeIn.duration(200)} style={{ flexDirection: "row", gap: 8, backgroundColor: C.azulFundo, borderRadius: 12, padding: 12, marginTop: 2, marginBottom: 8 }}>
                <Feather name="info" size={16} color={C.azul} style={{ marginTop: 2 }} />
                <T s={{ flex: 1, fontSize: 13.5, lineHeight: 19, color: C.texto2 }}>{q.notas[r]}</T>
              </Animated.View>
            ) : null}
          </Card>
        );
      })}
    </Tela>
  );
}
