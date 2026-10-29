// Portal do gerente · pedido de um cliente, aberto pelo código. Tudo já vem preenchido:
// dados do imóvel (com a origem e a confiança), o que o cliente montou e por que o motor indicou
// o plano. O gerente liga ou desliga as sugestões, edita plano e coberturas se quiser, vê o preço
// novo e envia; o cliente decide.
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FICHAS, porQueDoPlano } from "@/dados/contrato";
import { ajustado, incluidas, nivelDaAnalise, preco, useEstado } from "@/logica/estado";
import { Ajustes, efeitoNoPreco, estadoDoPedido, filaDoGerente, propostaDoGerente, SEM_AJUSTES, somaAjustes, sugestoesDoGerente, temAjustes } from "@/logica/gerente";
import { COB, PLANOS } from "@/logica/produto";
import { brl, brl2, cidade, entre, NOME_TIPO, NOME_USO, NOME_VINCULO, titulo, uf } from "@/logica/textos";
import { useAjuda } from "@/ui/ajuda";
import { Botao, Card, Chave, Contador, Entra, haptic, Rotulo, SeloAjustado, T, Toque } from "@/ui/base";
import { ListaCoberturas, Mudar } from "@/ui/coberturas";
import { useFolha } from "@/ui/folha";
import { SeletorPlanos } from "@/ui/seletor";
import { Tela } from "@/ui/tela";
import { C, F, TIPO } from "@/ui/tema";

const NIVEL: Record<string, string> = { BAIXA: "Baixa", MEDIA: "Média", ALTA: "Alta" };

function Linha({ rot, valor, sub, ultima }: { rot: string; valor: string; sub?: string; ultima?: boolean }) {
  return (
    <View style={{ paddingVertical: 11, borderBottomWidth: ultima ? 0 : 1, borderBottomColor: C.divisoria }}>
      <T s={[TIPO.legenda, { color: C.suave }]}>{rot}</T>
      <T s={TIPO.destaque}>{valor}</T>
      {sub ? <T s={[TIPO.apoio, { color: C.suave }]}>{sub}</T> : null}
    </View>
  );
}

export default function PedidoDoCliente() {
  const ajuda = useAjuda("painel", { semGerente: true });
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const { s, set, casos } = useEstado();
  const folha = useFolha();
  const pedido = filaDoGerente(casos, FICHAS.fichas, s.caso).find((p) => p.codigo === codigo);
  const base = pedido ? estadoDoPedido(pedido, s) : null;
  const sugs = base ? sugestoesDoGerente(base) : [];
  const [sel, setSel] = useState<string[] | null>(null);
  const ligadas = sel ?? sugs.map((x) => x.id);
  // Edição manual do gerente (plano e coberturas), por cima das sugestões
  const [ajustes, setAjustes] = useState<Ajustes>(SEM_AJUSTES);
  const [editando, setEditando] = useState(false);

  if (!pedido || !base) {
    return (
      <Tela titulo="Pedido do cliente" onVoltar={() => router.back()} onAjuda={ajuda}>
        <T s={{ color: C.suave }}>Código {codigo} não encontrado na sua carteira.</T>
      </Tela>
    );
  }

  const f = base.f, b = f.campos.bens, proposta = propostaDoGerente(base, ligadas, ajustes);
  const antes = preco(base), depois = preco(proposta), nivel = nivelDaAnalise(base).nivel;
  const cobs = incluidas(base).filter((k) => base.ligadas[k] !== false);
  const alterna = (id: string) => setSel(ligadas.includes(id) ? ligadas.filter((x) => x !== id) : [...ligadas, id]);
  // A lista e o seletor editam a proposta; aqui a mudança vira ajuste guardado (só o que difere)
  const mudar: Mudar = (fn) => setAjustes((a) => { const atual = propostaDoGerente(base, ligadas, a); return somaAjustes(a, atual, fn(atual)); });
  const editados = new Set<string>([...Object.keys(ajustes.valores), ...Object.keys(ajustes.ligadas), ...(ajustes.plano ? ["plano"] : [])]);
  const nMudancas = proposta.notasGerente.filter((n) => !n.startsWith("Revisou")).length;

  const enviar = () => {
    haptic.leve();
    folha.abrir(
      <View style={{ gap: 12 }}>
        <T s={{ color: C.texto2 }}>{pedido.nome} {pedido.nome.includes(" e ") ? "recebem" : "recebe"} um aviso no app com a proposta marcada “ajustado pelo gerente”. Nada é contratado sem ele.</T>
        {proposta.notasGerente.map((n) => (
          <View key={n} style={{ flexDirection: "row", gap: 8 }}><Feather name="check" size={16} color={C.azul} style={{ marginTop: 3 }} /><T s={{ flex: 1, fontSize: 14.5 }}>{n}</T></View>
        ))}
        <View style={{ marginTop: 6, gap: 10 }}>
          <Botao titulo="Enviar proposta" onPress={() => { haptic.sucesso(); folha.fechar(); set(() => proposta); setTimeout(() => router.replace("/retorno"), 220); }} />
          <Botao tipo="claro" titulo="Revisar" onPress={() => folha.fechar()} />
        </View>
      </View>,
      `Enviar para ${pedido.nome.split(" ")[0]}?`,
    );
  };

  return (
    <Tela titulo="Pedido do cliente" onVoltar={() => router.back()} onAjuda={ajuda}
      fala={`${pedido.nome}, código ${pedido.codigo}. ${NOME_TIPO[f.campos.tipo.valor] || "Imóvel"} em ${cidade(f)}. Plano ${PLANOS[base.plano].nome}, ${brl2(antes)} por mês. ${sugs.length} sugestões de ajuste.`}
      rodape={
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View><T s={[TIPO.legenda, { color: C.suave }]}>Nova proposta · 12x de</T>{depois !== antes ? <T s={[TIPO.legenda, { color: C.suave, textDecorationLine: "line-through" }]}>{brl2(antes)}</T> : null}</View>
            <Contador valor={depois} fmt={brl2} s={{ fontFamily: F.k, fontSize: 22, lineHeight: 28, color: C.azulEscuro }} />
          </View>
          <Botao titulo={`Enviar para ${pedido.nome.split(" ")[0]}`} onPress={enviar} />
        </View>
      }>
      <Entra i={0}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <View style={{ backgroundColor: C.azulClaro, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}><T s={[TIPO.legenda, { color: C.azulEscuro, letterSpacing: 0.8 }]}>{pedido.codigo}</T></View>
          <T s={[TIPO.legenda, { color: C.suave }]}>{pedido.novo ? "Pediu ajuda agora pelo app" : `Pedido ${pedido.quando}`}</T>
        </View>
      </Entra>
      <Entra i={0}><T s={TIPO.display}>{pedido.nome}</T></Entra>
      <Entra i={1}><T s={{ color: C.suave, fontSize: 15, marginBottom: 14 }}>{pedido.novo ? "Viu a proposta no app e quer falar com você antes de contratar." : "Proposta do motor; o cliente ainda não abriu o app."}</T></Entra>

      <Rotulo>O imóvel</Rotulo>
      <Card i={2} style={{ paddingVertical: 4 }}>
        <Linha rot="Imóvel" valor={`${NOME_TIPO[f.campos.tipo.valor] || "Imóvel"} · ${titulo(f.complemento)}`} sub={`${cidade(f)}/${uf(f)}`} />
        <Linha rot="Uso e relação" valor={`${NOME_USO[f.campos.uso.valor] || f.campos.uso.valor} · ${NOME_VINCULO[f.campos.vinculo.valor] || f.campos.vinculo.valor}`} />
        <Linha rot="Bens dentro de casa" valor={entre(b.min, b.max)} sub="Pelas compras dos últimos 3 anos" />
        <Linha rot="Confiança da análise" valor={NIVEL[nivel]} sub={f.confianca_motivo.replace(/^./, (c: string) => c.toUpperCase())} ultima />
      </Card>

      {f.pendencias.length ? (
        <Entra i={3}>
          <View style={{ flexDirection: "row", gap: 10, backgroundColor: C.ambarClaro, borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <Feather name="alert-circle" size={18} color={C.ambar} style={{ marginTop: 1 }} />
            <View style={{ flex: 1, gap: 4 }}>
              <T s={{ fontFamily: F.s, color: C.ambar }}>Confirmar com o cliente</T>
              {f.pendencias.map((p: any) => <T key={p.codigo} s={{ fontSize: 14, color: C.texto2 }}>{p.texto.replace(/^./, (c: string) => c.toUpperCase())}</T>)}
            </View>
          </View>
        </Entra>
      ) : null}

      <Rotulo>O que o cliente montou</Rotulo>
      <Card i={4}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <T s={TIPO.titulo2}>Plano {PLANOS[base.plano].nome}</T>
            <T s={[TIPO.apoio, { color: C.suave }]}>{base.plano === base.rec ? "É o plano indicado pelo motor" : `O motor indicou o ${PLANOS[base.rec].nome}`}</T>
            {ajustado(base) ? <SeloAjustado /> : null}
          </View>
          <T s={TIPO.numero}>{brl2(antes)}</T>
        </View>
        <View style={{ marginTop: 12, gap: 6 }}>
          {cobs.map((k) => (
            <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
              <T s={[TIPO.apoio, { flex: 1 }]} numberOfLines={1}>{COB[k].curto}</T>
              <T s={[TIPO.apoio, { fontFamily: F.b, color: base.faixa[k] && base.valores[k] < base.faixa[k]![0] ? C.vermelho : C.texto }]}>{brl(base.valores[k])}</T>
            </View>
          ))}
        </View>
      </Card>

      <Rotulo>Por que o motor indicou</Rotulo>
      <Card i={5} style={{ gap: 8 }}>
        {porQueDoPlano(f).slice(0, 3).map((m) => (
          <View key={m} style={{ flexDirection: "row", gap: 8 }}><T s={{ color: C.azul }}>•</T><T s={[TIPO.apoio, { flex: 1, color: C.texto2 }]}>{m}</T></View>
        ))}
      </Card>

      <Rotulo>Sugestões para {pedido.nome.split(" ")[0]}</Rotulo>
      <Card i={6} style={{ paddingVertical: 4 }}>
        {sugs.length ? sugs.map((x, i) => {
          const on = ligadas.includes(x.id), d = efeitoNoPreco(base, x);
          return (
            <View key={x.id} style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 13, borderBottomWidth: i < sugs.length - 1 ? 1 : 0, borderBottomColor: C.divisoria }}>
              <View style={{ flex: 1, gap: 3 }}>
                <T s={[TIPO.destaque, { color: on ? C.texto : C.suave }]}>{x.titulo}</T>
                <T s={[TIPO.apoio, { color: C.suave }]}>{x.porque}</T>
                <T s={[TIPO.legenda, { color: C.azul }]}>{editados.has(x.id) ? "Você editou este item abaixo: vale a sua edição" : !x.muda ? "Só orientação" : Math.abs(d) < 0.005 ? "Não muda o preço" : `${d > 0 ? "+" : "−"} ${brl2(Math.abs(d))} por mês`}</T>
              </View>
              <Chave on={on} onChange={() => alterna(x.id)} />
            </View>
          );
        }) : <T s={[TIPO.apoio, { color: C.suave, paddingVertical: 12 }]}>Nada a ajustar: a proposta já está dentro do que o motor calculou.</T>}
      </Card>

      {/* Edição manual: o mesmo seletor e a mesma lista do Personalizar do cliente, sobre a proposta em edição */}
      <Rotulo>Editar a proposta</Rotulo>
      <Card i={7} style={{ padding: 0 }}>
        <Toque onPress={() => { haptic.toque(); setEditando(!editando); }} rotulo={editando ? "Fechar edição do plano e das coberturas" : "Editar plano e coberturas"}
          style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 16 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.azulClaro, alignItems: "center", justifyContent: "center" }}><Feather name="sliders" size={18} color={C.azul} /></View>
          <View style={{ flex: 1 }}>
            <T s={TIPO.destaque}>Editar plano e coberturas</T>
            <T s={[TIPO.apoio, { color: C.suave }]}>{temAjustes(ajustes) ? `Plano ${PLANOS[proposta.plano].nome} · ${nMudancas} ${nMudancas === 1 ? "mudança" : "mudanças"} para o cliente` : "Troque o plano ou o valor de cada cobertura"}</T>
          </View>
          <Feather name={editando ? "chevron-up" : "chevron-down"} size={20} color={C.azulEscuro} />
        </Toque>
      </Card>
      {editando ? (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)} style={{ marginBottom: 14 }}>
          <SeletorPlanos e={proposta} mudar={mudar} />
          <ListaCoberturas e={proposta} mudar={mudar} gerente />
          {temAjustes(ajustes) ? (
            <Toque onPress={() => { haptic.leve(); setAjustes(SEM_AJUSTES); }} rotulo="Desfazer as edições manuais" style={{ alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 12, marginTop: 6 }}>
              <Feather name="rotate-ccw" size={15} color={C.azulEscuro} /><T s={{ fontFamily: F.s, fontSize: 14, color: C.azulEscuro }}>Desfazer edições</T>
            </Toque>
          ) : null}
        </Animated.View>
      ) : null}
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center", paddingHorizontal: 4 }}>
        <Feather name="info" size={14} color={C.suave} />
        <T s={{ flex: 1, fontSize: 12.5, color: C.suave, lineHeight: 17 }}>As sugestões ficam dentro da faixa do motor. O cliente vê o que mudou e decide; nada é contratado sem ele.</T>
      </View>
    </Tela>
  );
}
