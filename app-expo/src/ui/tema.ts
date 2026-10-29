// Tokens do app (cores, fontes, tipografia, sombra e curvas). Copiados do app do BB
// (prints de out/2026 e vault: 13 - Design/Regras de design BB). Nenhuma tela usa cor solta:
// tudo sai daqui. O app segue só os azuis e o amarelo do BB; não há verde.
import { Easing, TextStyle } from "react-native";
import { Easing as EasingR } from "react-native-reanimated";

export const C = {
  azul: "#465EFF", azulEscuro: "#2D37F5", azulClaro: "#E4ECFF", azulBotao: "#D9E1FF", azulFundo: "#F3F6FF", azulSuave: "#9AA8FF",
  amarelo: "#FCFC30", texto: "#111214", texto2: "#3A3D46", suave: "#6C7077", apagado: "#8A8E97",
  fundo: "#F7F7F8", borda: "#DFE1E6", divisoria: "#EEF0F4", trilho: "#DCDDE0", branco: "#FFFFFF",
  // estados: "positivo" (coberto, confirmado, ligado) usa o azul do BB, nunca verde
  positivo: "#2D37F5", positivoClaro: "#E8EEFF",
  vermelho: "#C8312B", vermelhoClaro: "#FDECEA", ambar: "#8A5A00", ambarClaro: "#FFF4D6", noite: "#1C2266",
};

// Fontes de licença livre (SIL Open Font License, Google Fonts). A fonte do BB não é pública:
// Figtree no texto e na interface; Nunito nos títulos e nos números (terminais arredondados).
export const F = {
  r: "Figtree_400Regular", m: "Figtree_500Medium", b: "Figtree_600SemiBold", s: "Figtree_700Bold",
  x: "Nunito_800ExtraBold", k: "Nunito_900Black", xi: "Nunito_800ExtraBold_Italic",
};

/** Escala tipográfica: onde cada fonte é usada. Use estes estilos em vez de tamanhos soltos. */
export const TIPO = {
  nav: { fontFamily: F.s, fontSize: 15, lineHeight: 20, letterSpacing: 1.1, textTransform: "uppercase" },      // título do cabeçalho azul
  display: { fontFamily: F.x, fontSize: 28, lineHeight: 33, letterSpacing: -0.5 },                               // título da tela
  titulo2: { fontFamily: F.x, fontSize: 20, lineHeight: 25, letterSpacing: -0.3 },                               // título de cartão
  numero: { fontFamily: F.x, fontSize: 21, lineHeight: 26, letterSpacing: -0.3 },                                // valores em destaque
  destaque: { fontFamily: F.b, fontSize: 16, lineHeight: 22 },                                                   // item de lista, pergunta
  corpo: { fontFamily: F.r, fontSize: 15, lineHeight: 21 },                                                      // texto corrido
  apoio: { fontFamily: F.r, fontSize: 13.5, lineHeight: 19 },                                                    // explicação curta
  legenda: { fontFamily: F.m, fontSize: 12.5, lineHeight: 17 },                                                  // origem, rodapé
  rotulo: { fontFamily: F.b, fontSize: 12, lineHeight: 16, letterSpacing: 0.9, textTransform: "uppercase" },     // nome de seção
  botao: { fontFamily: F.s, fontSize: 15.5, lineHeight: 20, letterSpacing: 0.7, textTransform: "uppercase" },    // botões em pílula
} satisfies Record<string, TextStyle>;

export const SOMBRA = {
  shadowColor: "#18181B", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2,
};
export const EASE_OUT = EasingR.bezier(0.23, 1, 0.32, 1);
export const EASE_IN_OUT = EasingR.bezier(0.77, 0, 0.175, 1);
export const EASE_SHEET = EasingR.bezier(0.32, 0.72, 0, 1);
export { Easing };
