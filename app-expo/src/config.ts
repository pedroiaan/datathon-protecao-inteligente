// Configuração da demonstração (vídeo e pitch).
export const DEMO = {
  /** Mostra as animações mesmo com "reduzir movimento" ligado no aparelho ou no navegador.
   *  Ligado para a gravação; num app publicado, deixe false para respeitar a acessibilidade. */
  animarSempre: true,
  /** No navegador largo, mostra o app dentro de uma moldura de iPhone. */
  molduraNoNavegador: true,
  /** No navegador largo, mostra ao lado do iPhone a planilha que o motor gerou para o caso
   *  (src/ui/planilha.tsx) e abre o menu dos 2 casos do vídeo antes da notificação. */
  planilhaAoLado: true,
};
