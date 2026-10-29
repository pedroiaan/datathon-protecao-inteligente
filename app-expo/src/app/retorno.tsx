// Aviso de retorno do gerente na tela de bloqueio.
import { router } from "expo-router";
import { GERENTE } from "@/logica/produto";
import { Bloqueio } from "@/ui/bloqueio";

export default function Retorno() {
  return (
    <Bloqueio hora="9:58" avisos={[{ app: "BB", quando: "agora", titulo: `${GERENTE.nome} respondeu sobre o seu seguro`, texto: "Ele conferiu os dados e ajustou a proposta. Toque para ver o que mudou. Nada foi contratado.", onPress: () => router.replace("/ajustada") }]} />
  );
}
