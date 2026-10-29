// Menu da demonstração (navegador largo): antes da notificação, escolhe qual dos 2 casos do vídeo
// vai rodar. Os casos e os números vêm das fichas do motor (FICHAS.video), nada escrito à mão.
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { FICHAS } from "../dados/contrato";
import { estadoDoCaso, perguntasDaTela, useEstado } from "../logica/estado";
import { NOME_CASO, NOME_CLIENTE, PLANOS } from "../logica/produto";
import { cidade, NOME_TIPO } from "../logica/textos";
import { C, F } from "./tema";

const FD: any = FICHAS;

export function MenuDemo({ onFechar }: { onFechar: () => void }) {
  const { set, casos } = useEstado();
  const video: string[] = FD.video?.length ? FD.video : Object.keys(casos).slice(0, 2);
  const escolher = (k: string) => {
    set(() => estadoDoCaso(k));
    if (router.canDismiss()) router.dismissAll();
    router.replace("/");
    onFechar();
  };
  return (
    // fundo escuro e desfocado: o app e a planilha ficam atrás, sem disputar atenção com os 2 cartões
    <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(12,16,40,0.86)", backdropFilter: "blur(8px)", alignItems: "center", justifyContent: "center", zIndex: 100 } as any}>
      <View style={{ width: 760, maxWidth: "94%", backgroundColor: "#fff", borderRadius: 28, padding: 28, gap: 18 } as any}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: F.s, fontSize: 13, color: "#465EFF", letterSpacing: 1 }}>DEMONSTRAÇÃO · SEGURO RESIDENCIAL</Text>
          <Text style={{ fontFamily: F.x, fontSize: 26, color: "#1F1F1F" }}>Qual cliente vamos atender?</Text>
          <Text style={{ fontFamily: F.r, fontSize: 14.5, color: "#616161" }}>Dois casos reais da base Teste Comum. O app à esquerda e, à direita, a planilha que o motor gerou para o mesmo cliente. Para voltar aqui: recarregue a página ou aperte M.</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
          {video.map((k) => {
            const f = FD.fichas[casos[k]], ps = perguntasDaTela(f);
            const area = f.campos.area.natureza === "ESTIMADO" ? `≈ ${f.campos.area.valor} m² (estimada)` : `${f.campos.area.valor} m² (cadastrada)`;
            return (
              <Pressable key={k} onPress={() => escolher(k)} accessibilityRole="button"
                style={({ hovered }: any) => ({ flex: 1, minWidth: 300, borderWidth: 2, borderColor: hovered ? "#465EFF" : "#D4D4D4", borderRadius: 20, padding: 18, gap: 10, backgroundColor: hovered ? "#F3F6FF" : "#fff" })}>
                <Text style={{ fontFamily: F.s, fontSize: 13, color: "#465EFF" }}>{NOME_CASO[k] || k}</Text>
                <Text style={{ fontFamily: F.x, fontSize: 20, color: "#1F1F1F" }}>{NOME_CLIENTE[k] || f.cliente_id}</Text>
                <Text style={{ fontFamily: F.r, fontSize: 14, color: "#404040" }}>{NOME_TIPO[f.campos.tipo.valor]} em {cidade(f)} · {area}</Text>
                <View style={{ gap: 4 }}>
                  {[["Plano do motor", `${PLANOS[f.plano as keyof typeof PLANOS].nome}${f.forca === "no_limite" ? " (no limite)" : ""}`],
                    ["Confiança", f.confianca.replace("MEDIA", "MÉDIA")],
                    ["Perguntas no app", ps.length ? `${ps.length}: ${ps.map((p: any) => p.codigo === "DECIDE_PLANO" ? "decide o plano" : p.codigo === "PADRAO" ? "acabamento" : p.codigo.toLowerCase()).join(", ")}` : "nenhuma: contrata em 1 toque"],
                    ["Imóvel", f.imovel_id]].map(([r, v]) => (
                    <View key={r} style={{ flexDirection: "row", gap: 8 }}>
                      <Text style={{ fontFamily: F.r, fontSize: 13, color: "#757575", width: 118 }}>{r}</Text>
                      <Text style={{ fontFamily: F.b, fontSize: 13, color: "#1F1F1F", flex: 1 }}>{v}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ backgroundColor: C.amarelo, borderRadius: 999, paddingVertical: 11, alignItems: "center", marginTop: 4 }}>
                  <Text style={{ fontFamily: F.s, color: C.azulEscuro, fontSize: 14, letterSpacing: 0.6, textTransform: "uppercase" }}>Começar por este caso</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

