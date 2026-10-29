// Lista horizontal que desliza também no computador. No celular o dedo já arrasta a ScrollView;
// no navegador o mouse não arrasta e a rodinha rola a página para baixo, então a lista parecia
// travada (Passo 2: alagamento, queda de raio, danos a terceiros...). Aqui, no navegador:
// arrastar com o mouse desliza, a rodinha (vertical ou horizontal) desliza para o lado, e
// `focoX` centraliza o item escolhido.
import { ReactNode, useEffect, useRef } from "react";
import { Platform, ScrollView, StyleProp, ViewStyle } from "react-native";

export function Carrossel({ children, style, contentContainerStyle, focoX }: {
  children: ReactNode; style?: StyleProp<ViewStyle>; contentContainerStyle?: StyleProp<ViewStyle>; focoX?: number;
}) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const no: HTMLElement | undefined = (ref.current as any)?.getScrollableNode?.();
    if (!no) return;
    let inicio: { x: number; esquerda: number } | null = null;
    let arrastou = false;
    const roda = (e: WheelEvent) => {
      if (no.scrollWidth <= no.clientWidth) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const fim = no.scrollWidth - no.clientWidth;
      if ((d < 0 && no.scrollLeft <= 0) || (d > 0 && no.scrollLeft >= fim)) return; // na ponta, a página volta a rolar
      e.preventDefault();
      no.scrollLeft += d;
    };
    const desce = (e: MouseEvent) => { inicio = { x: e.clientX, esquerda: no.scrollLeft }; arrastou = false; };
    const move = (e: MouseEvent) => {
      if (!inicio) return;
      const dx = e.clientX - inicio.x;
      if (Math.abs(dx) > 4) { arrastou = true; no.style.cursor = "grabbing"; }
      no.scrollLeft = inicio.esquerda - dx;
    };
    const sobe = () => { inicio = null; no.style.cursor = "grab"; };
    // depois de arrastar, o clique que termina o gesto não escolhe o item embaixo do mouse
    const clique = (e: MouseEvent) => { if (arrastou) { e.stopPropagation(); e.preventDefault(); arrastou = false; } };
    no.style.cursor = "grab";
    no.addEventListener("wheel", roda, { passive: false });
    no.addEventListener("mousedown", desce);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", sobe);
    no.addEventListener("click", clique, true);
    return () => {
      no.removeEventListener("wheel", roda);
      no.removeEventListener("mousedown", desce);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", sobe);
      no.removeEventListener("click", clique, true);
    };
  }, []);

  useEffect(() => {
    if (focoX != null) ref.current?.scrollTo({ x: Math.max(0, focoX - 60), animated: true });
  }, [focoX]);

  return (
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} style={style} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
}
