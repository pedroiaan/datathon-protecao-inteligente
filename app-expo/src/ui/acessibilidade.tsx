// Acessibilidade: texto maior (todo o app cresce junto) e leitura da tela em voz alta.
import * as Speech from "expo-speech";
import { createContext, ReactNode, useContext, useState } from "react";

const Ctx = createContext<{ escala: number; maior: boolean; setMaior: (v: boolean) => void }>({ escala: 1, maior: false, setMaior: () => {} });

export function ProvedorAcessibilidade({ children }: { children: ReactNode }) {
  const [maior, setMaior] = useState(false);
  return <Ctx.Provider value={{ escala: maior ? 1.2 : 1, maior, setMaior }}>{children}</Ctx.Provider>;
}
export const useAcessibilidade = () => useContext(Ctx);

export async function ouvir(texto: string, aoFim?: () => void) {
  if (await Speech.isSpeakingAsync()) { Speech.stop(); aoFim?.(); return false; }
  Speech.speak(texto, { language: "pt-BR", rate: 1.0, onDone: aoFim, onStopped: aoFim });
  return true;
}
export const pararDeOuvir = () => Speech.stop();
