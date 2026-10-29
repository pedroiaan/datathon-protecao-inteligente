// Lista de coberturas editável (Personalizar do cliente e edição do gerente no portal).
// Compacta; um toque abre o campo para digitar o valor exato, dentro do limite do produto,
// com atalhos (mínimo, sugerido, máximo). Sem barra deslizante.
// Controlada: recebe a proposta `e` e `mudar`, então serve tanto ao estado do app quanto
// a uma proposta em edição que ainda não foi enviada.
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { Estado, incluidas, opcionais, sugeridoDe } from "../logica/estado";
import { COB, Cob, FIXAS } from "../logica/produto";
import { aprox, brl, ehApto, entre } from "../logica/textos";
import { Chave, haptic, Rotulo, T, Toque } from "./base";
import { C, F, SOMBRA } from "./tema";

export type Mudar = (fn: (e: Estado) => Estado) => void;

const REFLUXO = LinearTransition.duration(240);
const ABRE = FadeIn.duration(200).delay(60), FECHA = FadeOut.duration(120);

/** Explicação do valor. `gerente` muda a pessoa: o cliente lê "você"; o gerente lê "o cliente". */
function dica(s: Estado, k: Cob, gerente: boolean) {
  const fx = s.faixa[k], v = s.valores[k], quem = gerente ? "o cliente" : "você";
  if (k === "incendio" && fx && v < fx[0]) return { t: `Abaixo de ${aprox(fx[0])}, um incêndio grande deixaria parte do prejuízo com ${quem}.`, alerta: true };
  if (fx && v < fx[0]) return { t: `Abaixo da faixa calculada para o imóvel (${entre(fx[0], fx[1])}). Num sinistro, parte pode ficar com ${quem}.`, alerta: true };
  if (fx && v > fx[1] * 1.25) return { t: gerente ? "Acima do que calculamos para o imóvel: o cliente pagaria por uma proteção que talvez não use." : "Acima do que calculamos para o seu imóvel. Você pagaria por uma proteção que talvez não use.", alerta: false };
  if (k === "incendio") return { t: `Reconstruir ${ehApto(s.f) ? "pisos, armários e acabamentos" : "a casa"} e repor os bens custa ${fx ? entre(fx[0], fx[1]) : "o valor do imóvel"}.`, alerta: false };
  return { t: fx ? "Dentro da faixa calculada para o imóvel." : COB[k].desc, alerta: false };
}

function LinhaCobertura({ e, mudar, k, opcional, aberta, onAbrir, ultima, gerente }: { e: Estado; mudar: Mudar; k: Cob; opcional: boolean; aberta: boolean; onAbrir: () => void; ultima: boolean; gerente: boolean }) {
  const P = COB[k], fx = e.faixa[k], on = e.ligadas[k] !== false;
  const [texto, setTexto] = useState(e.valores[k].toLocaleString("pt-BR"));
  const [erro, setErro] = useState(false);
  const definir = (n: number) => {
    const v = Math.min(P.max, Math.max(P.min, Math.round(n / P.passo) * P.passo));
    setTexto(v.toLocaleString("pt-BR")); setErro(false);
    mudar((x) => ({ ...x, valores: { ...x.valores, [k]: v } }));
  };
  const digitar = (t: string) => {
    const n = +t.replace(/\D/g, "");
    setTexto(n ? n.toLocaleString("pt-BR") : "");
    const fora = n < P.min || n > P.max;
    setErro(fora);
    if (!fora) mudar((x) => ({ ...x, valores: { ...x.valores, [k]: n } }));
  };
  const d = erro ? { t: `Use um valor entre ${brl(P.min)} e ${brl(P.max)}.`, alerta: true } : dica(e, k, gerente);

  return (
    <Animated.View layout={REFLUXO} style={{ borderBottomWidth: ultima ? 0 : 1, borderBottomColor: C.divisoria }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
        {opcional ? <Chave on={on} onChange={() => mudar((x) => ({ ...x, ligadas: { ...x.ligadas, [k]: !x.ligadas[k] } }))} /> : null}
        <Pressable style={{ flex: 1 }} onPress={() => { haptic.toque(); onAbrir(); }}>
          <T s={{ fontFamily: F.b, fontSize: 15.5, color: on ? C.texto : C.suave }}>{P.curto}</T>
          <T s={{ fontSize: 12.5, color: C.suave }}>{fx ? (gerente ? "Para o imóvel: " : "Para seu imóvel: ") + entre(fx[0], fx[1]) : P.desc}</T>
        </Pressable>
        <Pressable onPress={() => { haptic.toque(); onAbrir(); }} accessibilityRole="button" accessibilityLabel={`${P.curto}: ${brl(e.valores[k])}. Mudar valor`} style={{ flexDirection: "row", alignItems: "center", gap: 4 }} hitSlop={8}>
          <T s={{ fontFamily: F.x, fontSize: 15.5, color: on ? C.azulEscuro : C.apagado, textDecorationLine: on ? "none" : "line-through" }}>{brl(e.valores[k])}</T>
          <Feather name={aberta ? "chevron-up" : "chevron-down"} size={18} color={C.azulEscuro} />
        </Pressable>
      </View>
      {aberta ? (
        <Animated.View entering={ABRE} exiting={FECHA} style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", height: 52, borderRadius: 12, backgroundColor: C.fundo, borderWidth: 1.5, borderColor: erro ? C.vermelho : C.azul, paddingHorizontal: 14 }}>
            <T s={{ fontFamily: F.b, fontSize: 17, color: C.suave, marginRight: 6 }}>R$</T>
            <TextInput value={texto} onChangeText={digitar} onBlur={() => definir(+texto.replace(/\D/g, "") || e.valores[k])} onSubmitEditing={() => definir(+texto.replace(/\D/g, "") || e.valores[k])}
              keyboardType="number-pad" returnKeyType="done" autoFocus selectTextOnFocus accessibilityLabel={`Valor de ${P.curto}`}
              style={{ flex: 1, fontFamily: F.x, fontSize: 20, color: C.texto, outlineStyle: "none" } as any} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
            <T s={{ fontSize: 12.5, color: C.suave }}>mín. {brl(P.min)}</T><T s={{ fontSize: 12.5, color: C.suave }}>máx. {brl(P.max)}</T>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[["Mínimo", P.min], ["Sugerido", sugeridoDe(e, k)], ["Máximo", P.max]].map(([n, v]) => (
              <Toque key={n as string} onPress={() => { haptic.toque(); definir(v as number); }} style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 10, backgroundColor: C.azulClaro }}>
                <T s={{ fontFamily: F.b, fontSize: 13.5, color: C.azulEscuro }}>{n as string}</T>
              </Toque>
            ))}
          </View>
          <T s={{ fontSize: 13, lineHeight: 18, color: d.alerta ? C.vermelho : C.suave, marginTop: 9 }}>{d.t}</T>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

/** As duas listas (coberturas do plano, que não saem, e as que se pode tirar), com uma linha aberta por vez. */
export function ListaCoberturas({ e, mudar, gerente = false }: { e: Estado; mudar: Mudar; gerente?: boolean }) {
  const [aberta, setAberta] = useState<Cob | null>(null);
  const fixas = incluidas(e).filter((k) => FIXAS.includes(k)), extras = opcionais(e);
  const abrir = (k: Cob) => setAberta(aberta === k ? null : k);
  return (
    <>
      <Animated.View layout={REFLUXO}><Rotulo>Coberturas do plano · não saem</Rotulo></Animated.View>
      <Animated.View layout={REFLUXO} style={{ backgroundColor: C.branco, borderRadius: 16, ...SOMBRA }}>
        {fixas.map((k, i) => <LinhaCobertura key={k + e.caso} e={e} mudar={mudar} k={k} opcional={false} aberta={aberta === k} onAbrir={() => abrir(k)} ultima={i === fixas.length - 1} gerente={gerente} />)}
      </Animated.View>
      {extras.length ? <>
        <Animated.View layout={REFLUXO}><Rotulo>{gerente ? "Coberturas que o cliente pode tirar" : "Coberturas que você pode tirar"}</Rotulo></Animated.View>
        <Animated.View layout={REFLUXO} style={{ backgroundColor: C.branco, borderRadius: 16, ...SOMBRA }}>
          {extras.map((k, i) => <LinhaCobertura key={k + e.caso} e={e} mudar={mudar} k={k} opcional aberta={aberta === k} onAbrir={() => abrir(k)} ultima={i === extras.length - 1} gerente={gerente} />)}
        </Animated.View>
      </> : null}
    </>
  );
}
