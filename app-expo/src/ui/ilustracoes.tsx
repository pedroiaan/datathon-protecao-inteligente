// Ilustrações no estilo da campanha BB Digital Week: pessoas em cartoon com braços e pernas
// alongados, cores chapadas da marca (azul, amarelo, turquesa, coral), contorno fino azul-escuro
// e fundos em blocos diagonais. Tudo em SVG nativo, nítido em qualquer tela.
import type { ReactElement, ReactNode } from "react";
import { Image } from "expo-image";
import { View } from "react-native";
import { IMAGENS, imagemDaCena } from "./imagens";
import Svg, { Circle, Defs, Ellipse, G, Line, Path, Polygon, RadialGradient, Rect, Stop } from "react-native-svg";

const AZ = "#465EFF", AZE = "#2D37F5", AZC = "#E4ECFF", AM = "#FCFC30", AMC = "#FFF6A8", TQ = "#3BE0C9", CO = "#FF6F68", RS = "#FF8FB8";
const LN = "#1B1F6B", BR = "#FFFFFF", CI = "#B9C3E8";
const PELE = ["#F6C7A4", "#C98A5E", "#8A5634", "#F2B28A"];
type P = { h?: number };

// ---------- personagem ----------
type Pose = { be: number[]; bd: number[]; pe: number[]; pd: number[] };
const POSES: Record<string, Pose> = {
  surpreso: { be: [-14, -38, -15, -50], bd: [14, -38, 16, -50], pe: [-6, 18, -9, 38], pd: [7, 18, 10, 38] },
  cabeca: { be: [-15, -32, -7, -44], bd: [15, -32, 7, -44], pe: [-5, 19, -7, 38], pd: [6, 19, 8, 38] },
  aponta: { be: [-9, -14, -8, -2], bd: [17, -27, 30, -32], pe: [-8, 18, -15, 37], pd: [8, 18, 13, 38] },
  caminha: { be: [-11, -15, -17, -5], bd: [9, -14, 11, -2], pe: [-9, 17, -17, 36], pd: [9, 17, 14, 38] },
  segura: { be: [-4, -13, 9, -17], bd: [13, -14, 17, -19], pe: [-6, 19, -8, 38], pd: [7, 19, 9, 38] },
  celular: { be: [-9, -14, -9, -2], bd: [11, -13, 6, -26], pe: [-5, 19, -6, 38], pd: [6, 19, 9, 38] },
  sobe: { be: [6, -40, 12, -50], bd: [14, -38, 20, -48], pe: [2, 16, -2, 32], pd: [11, 8, 16, 18] },
  vento: { be: [-14, -22, -24, -28], bd: [12, -36, 13, -50], pe: [-10, 17, -18, 36], pd: [6, 18, 4, 38] },
  sentado: { be: [-8, -12, 4, -16], bd: [12, -12, 14, -22], pe: [16, 2, 18, 22], pd: [20, 4, 24, 24] },
};
const membro = (pts: number[], ox: number, oy: number) => `M${ox} ${oy} L${pts[0]} ${pts[1]} L${pts[2]} ${pts[3]}`;

function Cabelo({ tipo, cor }: { tipo: string; cor: string }) {
  if (tipo === "cacheado") return <G fill={cor} stroke={LN} strokeWidth={1.2}><Circle cx="-6" cy="-46" r="5" /><Circle cx="0" cy="-49" r="5.5" /><Circle cx="6" cy="-46" r="5" /><Circle cx="8" cy="-40" r="3.6" /><Circle cx="-8" cy="-40" r="3.6" /></G>;
  if (tipo === "longo") return <Path d="M-9 -42 Q-10 -52 0 -52 Q11 -52 10 -42 Q16 -30 9 -22 Q4 -30 6 -40 Q0 -45 -6 -40 Q-4 -30 -10 -24 Q-15 -32 -9 -42 Z" fill={cor} stroke={LN} strokeWidth={1.2} strokeLinejoin="round" />;
  if (tipo === "rabo") return <G><Path d="M8 -46 Q20 -48 18 -34 Q14 -40 9 -40 Z" fill={cor} stroke={LN} strokeWidth={1.2} /><Path d="M-9 -41 Q-10 -52 0 -52 Q10 -52 9 -41 Q2 -46 -9 -41 Z" fill={cor} stroke={LN} strokeWidth={1.2} /></G>;
  return <Path d="M-9 -40 Q-11 -53 1 -52 Q11 -51 9 -41 Q5 -46 -2 -45 Q-6 -45 -9 -40 Z" fill={cor} stroke={LN} strokeWidth={1.2} strokeLinejoin="round" />;
}

/** Personagem posável. (x, y) = quadril; s = escala; espelho vira para a esquerda. */
export function Boneco({ x, y, s = 1, pose = "surpreso", camisa = CO, calca = AZ, pele = PELE[0], cabelo = "#2A1F4A", tipo = "curto", espelho = false, extra }: {
  x: number; y: number; s?: number; pose?: string; camisa?: string; calca?: string; pele?: string; cabelo?: string; tipo?: string; espelho?: boolean; extra?: ReactNode;
}) {
  const p = POSES[pose];
  const traco = (d: string, cor: string, w: number) => (
    <G><Path d={d} stroke={LN} strokeWidth={w + 2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /><Path d={d} stroke={cor} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /></G>
  );
  const sapato = (pt: number[]) => <Ellipse cx={pt[2] + 2} cy={pt[3] + 1} rx="5" ry="2.6" fill={LN} />;
  const mao = (pt: number[]) => <Circle cx={pt[2]} cy={pt[3]} r="3" fill={pele} stroke={LN} strokeWidth={1.1} />;
  return (
    <G transform={`translate(${x} ${y}) scale(${espelho ? -s : s} ${s})`}>
      {traco(membro(p.be, -6, -27), camisa, 5)}{mao(p.be)}
      {traco(membro(p.pe, -4, 0), calca, 6.5)}{sapato(p.pe)}
      <Path d="M-10 -30 Q0 -35 10 -30 L8 3 Q0 6 -8 3 Z" fill={camisa} stroke={LN} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M-8 2 L8 2 L9 7 L-9 7 Z" fill={calca} stroke={LN} strokeWidth={1.2} strokeLinejoin="round" />
      {traco(membro(p.pd, 4, 0), calca, 6.5)}{sapato(p.pd)}
      <Rect x="-2.4" y="-35" width="4.8" height="6" fill={pele} stroke={LN} strokeWidth={1} />
      {tipo === "longo" ? <Cabelo tipo={tipo} cor={cabelo} /> : null}
      <Ellipse cx="0" cy="-42" rx="8.2" ry="9" fill={pele} stroke={LN} strokeWidth={1.3} />
      {tipo !== "longo" ? <Cabelo tipo={tipo} cor={cabelo} /> : <Path d="M-8 -43 Q-8 -52 0 -52 Q8 -52 8 -43 Q2 -47 -8 -43 Z" fill={cabelo} />}
      <Circle cx="3.2" cy="-41" r="1.1" fill={LN} /><Path d="M1.5 -37.2 Q3.5 -36 5.4 -37.4" stroke={LN} strokeWidth={0.9} fill="none" strokeLinecap="round" />
      {traco(membro(p.bd, 6, -27), camisa, 5)}{mao(p.bd)}
      {extra}
    </G>
  );
}

/** Moldura de cada cena: fundo em blocos diagonais (como na BB Digital Week) e chão suave. */
function Cena({ h = 128, fundo = [TQ, AM], children }: { h?: number; fundo?: [string, string]; children: ReactNode }) {
  return (
    <Svg width="100%" height={h} viewBox="0 0 240 140">
      <Polygon points="0,140 0,62 96,0 168,0" fill={fundo[0]} opacity={0.32} />
      <Polygon points="240,140 132,140 240,40" fill={fundo[1]} opacity={0.45} />
      <Ellipse cx="120" cy="131" rx="104" ry="6" fill={LN} opacity={0.08} />
      {children}
    </Svg>
  );
}
const Gota = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => <Path d={`M${x} ${y}q${3 * s} ${5 * s} 0 ${7 * s}q${-3 * s} ${-2 * s} 0 ${-7 * s}z`} fill="#6FA2FF" stroke={LN} strokeWidth={0.8} />;
const Brilho = ({ x, y, cor = AM }: { x: number; y: number; cor?: string }) => <Path d={`M${x} ${y - 6}l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z`} fill={cor} stroke={LN} strokeWidth={0.8} strokeLinejoin="round" />;
const Linhas = ({ x, y, cor = LN }: { x: number; y: number; cor?: string }) => <G stroke={cor} strokeWidth={1.6} strokeLinecap="round"><Line x1={x} y1={y} x2={x + 7} y2={y - 4} /><Line x1={x + 2} y1={y + 6} x2={x + 10} y2={y + 5} /><Line x1={x} y1={y + 12} x2={x + 7} y2={y + 15} /></G>;

// ---------- as 10 situações ----------
export function Agua({ h }: P) {
  return (
    <Cena h={h} fundo={[TQ, AM]}>
      <Rect x="30" y="20" width="180" height="108" rx="12" fill={BR} stroke={LN} strokeWidth={1.6} />
      <Rect x="148" y="30" width="48" height="38" rx="6" fill={AZC} stroke={LN} strokeWidth={1.4} />
      <Path d="M150 46q8-9 18-4q9-8 20 1q8 1 6 9h-42q-6-1-2-6z" fill="#9AA6C8" stroke={LN} strokeWidth={1} />
      <G stroke={AZ} strokeWidth={2} strokeLinecap="round"><Line x1="160" y1="58" x2="157" y2="64" /><Line x1="171" y1="58" x2="168" y2="64" /><Line x1="182" y1="58" x2="179" y2="64" /></G>
      <Path d="M48 20v20q0 6 7 6h8" stroke={LN} strokeWidth={6} fill="none" strokeLinecap="round" /><Path d="M48 20v20q0 6 7 6h8" stroke="#C9CFE3" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <Gota x={66} y={50} /><Gota x={70} y={62} s={0.8} />
      <Path d="M30 98q15-7 30 0t30 0t30 0t30 0t30 0t30 0v18a12 12 0 0 1-12 12H42a12 12 0 0 1-12-12z" fill="#7FB0FF" stroke={LN} strokeWidth={1.4} />
      <Path d="M44 108q8-4 16 0M132 112q8-4 16 0" stroke={BR} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <G transform="rotate(-8 168 96)"><Rect x="146" y="86" width="44" height="14" rx="5" fill={CO} stroke={LN} strokeWidth={1.3} /><Rect x="142" y="80" width="10" height="20" rx="4" fill="#E2554F" stroke={LN} strokeWidth={1.2} /><Rect x="184" y="80" width="10" height="20" rx="4" fill="#E2554F" stroke={LN} strokeWidth={1.2} /></G>
      <Boneco x={98} y={98} s={0.82} pose="surpreso" camisa={AM} calca={AZE} pele={PELE[1]} cabelo="#1E1A33" tipo="cacheado" />
      <Linhas x={120} y={40} />
    </Cena>
  );
}
export function Raio({ h }: P) {
  return (
    <Cena h={h} fundo={[AM, TQ]}>
      <Path d="M24 40q10-16 28-10q12-14 30-2q14 0 12 14h-62q-12 0-8-2z" fill="#7B86A8" stroke={LN} strokeWidth={1.3} />
      <Path d="M58 44 L46 72 L58 72 L50 98 L76 62 L63 62 L71 44Z" fill={AM} stroke={LN} strokeWidth={1.4} strokeLinejoin="round" />
      <Rect x="128" y="62" width="74" height="48" rx="6" fill={LN} /><Rect x="133" y="67" width="64" height="36" rx="3" fill="#33395E" />
      <Path d="M142 78l7 6 6-9 6 11 6-7M175 74l5 7" stroke={CO} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M158 58q-4-8 2-14M168 58q4-9-1-15" stroke={CI} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Rect x="158" y="110" width="14" height="6" fill={LN} /><Rect x="146" y="116" width="38" height="5" rx="2" fill={LN} />
      <Brilho x={204} y={60} cor={AM} /><Brilho x={124} y={56} cor={CO} />
      <Boneco x={96} y={92} s={0.86} pose="aponta" camisa={TQ} calca={AZ} pele={PELE[0]} cabelo="#3B2A1A" tipo="rabo" />
    </Cena>
  );
}
export function Vizinho({ h }: P) {
  return (
    <Cena h={h} fundo={[RS, TQ]}>
      <Rect x="40" y="8" width="160" height="58" rx="8" fill={AZC} stroke={LN} strokeWidth={1.5} />
      <Rect x="56" y="22" width="30" height="34" rx="5" fill={BR} stroke={LN} strokeWidth={1.3} /><Circle cx="71" cy="40" r="9" fill="#C9D3F5" stroke={LN} strokeWidth={1.2} /><Circle cx="71" cy="40" r="4.6" fill="#7FB0FF" />
      <Path d="M86 52q16 0 26 10" stroke="#7FB0FF" strokeWidth={5} fill="none" strokeLinecap="round" /><Ellipse cx="116" cy="64" rx="16" ry="3" fill="#7FB0FF" opacity={0.85} />
      <Boneco x={160} y={46} s={0.5} pose="cabeca" camisa={AZ} calca={LN} pele={PELE[2]} cabelo="#1E1A33" tipo="curto" />
      <Rect x="40" y="68" width="160" height="58" rx="8" fill={BR} stroke={LN} strokeWidth={1.5} />
      <Path d="M100 70q8 6 0 12q14 2 18-4q6 6 12 0" fill="#D9C27A" opacity={0.7} />
      <Gota x={112} y={80} /><Gota x={120} y={92} s={0.8} />
      <Boneco x={78} y={112} s={0.58} pose="cabeca" camisa={CO} calca={AZE} pele={PELE[0]} cabelo="#C24E2E" tipo="longo" />
      <Path d="M112 114h22l-3 10h-16z" fill={CI} stroke={LN} strokeWidth={1.2} strokeLinejoin="round" />
    </Cena>
  );
}
export function Roubo({ h }: P) {
  return (
    <Cena h={h} fundo={[AM, RS]}>
      <Rect x="34" y="18" width="70" height="108" rx="6" fill={CI} stroke={LN} strokeWidth={1.4} />
      <G transform="rotate(-16 40 70)"><Rect x="40" y="22" width="60" height="104" rx="5" fill={AZ} stroke={LN} strokeWidth={1.4} /><Circle cx="90" cy="74" r="3.6" fill={AM} stroke={LN} strokeWidth={1} /></G>
      <Path d="M92 72l10-6m-8 14l11-2" stroke={LN} strokeWidth={2} strokeLinecap="round" />
      <Rect x="146" y="54" width="62" height="40" rx="5" fill="none" stroke={LN} strokeWidth={1.6} strokeDasharray="5 4" />
      <Rect x="150" y="94" width="54" height="30" rx="4" fill={TQ} stroke={LN} strokeWidth={1.4} />
      <Boneco x={126} y={96} s={0.8} pose="cabeca" camisa={RS} calca={LN} pele={PELE[3]} cabelo="#2A1F4A" tipo="curto" espelho />
      <Linhas x={140} y={30} />
    </Cena>
  );
}
export function Vidros({ h }: P) {
  return (
    <Cena h={h} fundo={[TQ, AM]}>
      <Rect x="108" y="14" width="108" height="98" rx="8" fill={AZE} stroke={LN} strokeWidth={1.5} />
      <Rect x="116" y="22" width="44" height="82" rx="4" fill={AZC} /><Rect x="164" y="22" width="44" height="82" rx="4" fill={AZC} />
      <Path d="M186 46l-9 12 11 5-7 15M186 46l13 7-4 13 9 6M186 46l-16-4M188 64l16 16" stroke={LN} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M126 36l10 10M136 30l6 6" stroke={BR} strokeWidth={3} strokeLinecap="round" />
      <G fill="#B5D0FF" stroke={LN} strokeWidth={0.8}><Path d="M176 120l7-6 4 8z" /><Path d="M196 122l6-8 6 7z" /></G>
      <Circle cx="186" cy="46" r="8" fill={BR} stroke={LN} strokeWidth={1.3} /><Path d="M179 43q7 4 14 0M186 38v16" stroke={CO} strokeWidth={1.6} fill="none" />
      <Boneco x={62} y={92} s={0.82} pose="cabeca" camisa={AM} calca={AZ} pele={PELE[1]} cabelo="#1E1A33" tipo="cacheado" />
      <Path d="M88 52q40-30 90-8" stroke={LN} strokeWidth={1.2} strokeDasharray="3 4" fill="none" />
    </Cena>
  );
}
export function Vento({ h }: P) {
  return (
    <Cena h={h} fundo={[AM, TQ]}>
      <Path d="M14 34h52a11 11 0 1 0-11-11M14 52h74a11 11 0 1 1-11 11M14 70h30" stroke={LN} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d="M14 34h52a11 11 0 1 0-11-11M14 52h74a11 11 0 1 1-11 11M14 70h30" stroke={BR} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M132 66 L172 34 L212 66 Z" fill={AZE} stroke={LN} strokeWidth={1.5} strokeLinejoin="round" />
      <Rect x="140" y="64" width="64" height="58" rx="6" fill={AZ} stroke={LN} strokeWidth={1.5} />
      <Rect x="151" y="76" width="16" height="16" rx="3" fill={AM} stroke={LN} strokeWidth={1.2} /><Rect x="180" y="84" width="15" height="38" rx="3" fill={AZC} stroke={LN} strokeWidth={1.2} />
      <G transform="rotate(-28 196 30)"><Rect x="188" y="22" width="18" height="9" rx="2" fill={CO} stroke={LN} strokeWidth={1.1} /></G>
      <G transform="rotate(20 222 52)"><Rect x="214" y="46" width="15" height="8" rx="2" fill={CO} stroke={LN} strokeWidth={1.1} /></G>
      <Boneco x={92} y={92} s={0.82} pose="vento" camisa={CO} calca={AZE} pele={PELE[0]} cabelo="#3B2A1A" tipo="longo"
        extra={<G><Path d="M13 -50 L13 -56" stroke={LN} strokeWidth={1.4} /><Path d="M-6 -60 Q13 -78 34 -58 Q13 -64 -6 -60 Z" fill={TQ} stroke={LN} strokeWidth={1.3} transform="rotate(24 13 -60)" /></G>} />
    </Cena>
  );
}
export function Fogo({ h }: P) {
  return (
    <Cena h={h} fundo={[CO, AM]}>
      <Rect x="104" y="28" width="112" height="98" rx="10" fill={BR} stroke={LN} strokeWidth={1.5} />
      <Rect x="114" y="38" width="92" height="22" rx="4" fill={AZC} stroke={LN} strokeWidth={1.2} />
      <Rect x="116" y="80" width="54" height="46" rx="4" fill={AZ} stroke={LN} strokeWidth={1.3} /><Circle cx="130" cy="90" r="4" fill={AM} stroke={LN} strokeWidth={1} /><Circle cx="148" cy="90" r="4" fill={AM} stroke={LN} strokeWidth={1} />
      <Path d="M150 80c-14 0-19-10-15-21 3-7 8-9 8-19 9 6 12 12 11 18 3-3 4-6 4-9 7 7 9 13 7 20-2 7-7 11-15 11z" fill={CO} stroke={LN} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M150 80c-6 0-9-5-7-10 1-3 4-5 4-9 5 4 7 7 6 11 1-1 2-2 2-4 3 3 4 6 3 9-1 2-4 3-8 3z" fill={AM} />
      <Boneco x={72} y={92} s={0.84} pose="segura" camisa={TQ} calca={LN} pele={PELE[2]} cabelo="#1E1A33" tipo="curto"
        extra={<G><Rect x="10" y="-30" width="9" height="18" rx="3" fill={CO} stroke={LN} strokeWidth={1.2} /><Path d="M19 -26 Q34 -28 46 -18" stroke={BR} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9} /></G>} />
    </Cena>
  );
}
export function Impacto({ h }: P) {
  return (
    <Cena h={h} fundo={[TQ, RS]}>
      <Rect x="20" y="52" width="104" height="72" rx="4" fill="#E8D3AE" stroke={LN} strokeWidth={1.4} />
      <G stroke="#C4A877" strokeWidth={1.4}><Line x1="20" y1="76" x2="124" y2="76" /><Line x1="20" y1="100" x2="124" y2="100" /><Line x1="56" y1="52" x2="56" y2="76" /><Line x1="92" y1="76" x2="92" y2="100" /><Line x1="56" y1="100" x2="56" y2="124" /></G>
      <Path d="M114 66l-9 12 7 6-5 12" stroke={LN} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <G transform="rotate(-7 168 96)">
        <Path d="M116 104v-14q0-6 6-8l14-4 12-16h40q8 0 12 8l8 16q8 2 8 10v8z" fill={CO} stroke={LN} strokeWidth={1.5} strokeLinejoin="round" />
        <Path d="M152 66h32l8 15h-48z" fill={AZC} stroke={LN} strokeWidth={1.2} /><Circle cx="136" cy="106" r="10" fill={LN} /><Circle cx="136" cy="106" r="4" fill={CI} /><Circle cx="196" cy="106" r="10" fill={LN} /><Circle cx="196" cy="106" r="4" fill={CI} />
      </G>
      <Brilho x={108} y={44} /><Brilho x={124} y={30} cor={CO} />
      <Boneco x={222} y={92} s={0.62} pose="cabeca" camisa={AM} calca={AZE} pele={PELE[1]} cabelo="#2A1F4A" tipo="rabo" espelho />
    </Cena>
  );
}
export function Aluguel({ h }: P) {
  return (
    <Cena h={h} fundo={[AM, TQ]}>
      <Path d="M18 64 L56 34 L94 64 Z" fill="#8D96B4" stroke={LN} strokeWidth={1.4} strokeLinejoin="round" /><Rect x="26" y="62" width="60" height="62" rx="5" fill={CI} stroke={LN} strokeWidth={1.4} />
      <G transform="rotate(-12 56 88)"><Rect x="14" y="82" width="86" height="11" rx="2" fill={AM} stroke={LN} strokeWidth={1.1} /><G fill={LN}><Rect x="22" y="82" width="7" height="11" /><Rect x="41" y="82" width="7" height="11" /><Rect x="60" y="82" width="7" height="11" /><Rect x="79" y="82" width="7" height="11" /></G></G>
      <Rect x="164" y="34" width="58" height="90" rx="6" fill={AZ} stroke={LN} strokeWidth={1.5} />
      <G fill={AM} stroke={LN} strokeWidth={1}><Rect x="173" y="46" width="13" height="12" rx="2" /><Rect x="199" y="46" width="13" height="12" rx="2" /><Rect x="173" y="68" width="13" height="12" rx="2" /><Rect x="199" y="68" width="13" height="12" rx="2" /></G>
      <Rect x="196" y="98" width="16" height="26" rx="2" fill={AZC} stroke={LN} strokeWidth={1.1} />
      <Boneco x={128} y={92} s={0.8} pose="caminha" camisa={CO} calca={LN} pele={PELE[0]} cabelo="#C24E2E" tipo="longo"
        extra={<G><Rect x="4" y="-2" width="16" height="22" rx="3" fill={TQ} stroke={LN} strokeWidth={1.2} /><Path d="M8 -2v-4h8v4" stroke={LN} strokeWidth={1.4} fill="none" /></G>} />
    </Cena>
  );
}
export function Despesas({ h }: P) {
  return (
    <Cena h={h} fundo={[TQ, AM]}>
      <Path d="M30 70 L92 28 L154 70 Z" fill={AZE} stroke={LN} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M56 52 L94 28 L126 48 L118 62 L62 62Z" fill={TQ} stroke={LN} strokeWidth={1.2} strokeLinejoin="round" />
      <Rect x="40" y="68" width="104" height="56" rx="6" fill={AZ} stroke={LN} strokeWidth={1.5} /><Rect x="54" y="80" width="18" height="18" rx="3" fill={AM} stroke={LN} strokeWidth={1.1} /><Rect x="100" y="86" width="18" height="38" rx="3" fill={AZC} stroke={LN} strokeWidth={1.1} />
      <G stroke={LN} strokeWidth={3} strokeLinecap="round"><Line x1="176" y1="124" x2="156" y2="38" /><Line x1="196" y1="124" x2="176" y2="38" /><Line x1="171" y1="102" x2="191" y2="102" /><Line x1="166" y1="80" x2="186" y2="80" /><Line x1="161" y1="58" x2="181" y2="58" /></G>
      <Boneco x={176} y={70} s={0.62} pose="sobe" camisa={AM} calca={AZE} pele={PELE[2]} cabelo="#1E1A33" tipo="curto" espelho
        extra={<Path d="M-12 -54 Q0 -64 12 -54 L12 -51 L-12 -51 Z" fill={CO} stroke={LN} strokeWidth={1.2} />} />
      <Rect x="204" y="108" width="26" height="16" rx="3" fill={CO} stroke={LN} strokeWidth={1.3} /><Path d="M211 108v-5h12v5" stroke={LN} strokeWidth={2} fill="none" />
    </Cena>
  );
}

export const ILU: Record<string, (p: P) => ReactElement> = {
  agua: Agua, raio: Raio, vizinho: Vizinho, roubo: Roubo, vento: Vento, fogo: Fogo, impacto: Impacto, vidros: Vidros, aluguel: Aluguel, despesas: Despesas,
};

/** Situação do Passo 2: a imagem final, se já chegou (sobre o mesmo fundo em blocos), ou o desenho em SVG. */
export function Ilustracao({ id, predio, h = 128 }: { id: string; predio: boolean; h?: number }) {
  const img = IMAGENS[imagemDaCena(id, predio)];
  if (!img) { const Desenho = ILU[id]; return <Desenho h={h} />; }
  return (
    <View style={{ height: h }}>
      <View style={{ position: "absolute", left: 0, right: 0, top: 0 }}><Cena h={h}>{null}</Cena></View>
      <Image source={img} contentFit="contain" style={{ width: "100%", height: h }} />
    </View>
  );
}

/** Herói da entrada: casa inteira (telhado, porta, janelas acesas), escudo com check e a pessoa
 *  apontando para ela. Duas camadas: o fundo em blocos preenche a largura (slice) e a cena fica
 *  inteira e centrada (meet), então nada é cortado em telas largas ou estreitas.
 *  Com a imagem final (IMAGENS.heroi_entrada), ela substitui só a cena; o fundo continua em SVG. */
export function HeroiCasa({ h = 190 }: P) {
  const img = IMAGENS.heroi_entrada;
  return (
    <View style={{ height: h }}>
      <Svg style={{ position: "absolute" }} width="100%" height={h} viewBox="0 0 360 200" preserveAspectRatio="xMidYMax slice">
        <Polygon points="-40,200 -40,120 170,-20 250,-20" fill={TQ} />
        <Polygon points="400,200 210,200 400,40" fill={AM} />
        <Polygon points="-40,200 -40,166 40,200" fill={CO} />
      </Svg>
      {img ? <Image source={img} contentFit="contain" style={{ width: "100%", height: h }} accessibilityIgnoresInvertColors /> : <Svg width="100%" height={h} viewBox="0 0 360 200">
        {/* chão e vegetação */}
        <Ellipse cx="182" cy="170" rx="118" ry="7" fill={AZE} opacity={0.35} />
        <Rect x="276" y="128" width="5" height="40" rx="2" fill={LN} />
        <Circle cx="278" cy="120" r="19" fill={TQ} stroke={LN} strokeWidth={1.5} />
        <Circle cx="268" cy="132" r="11" fill={TQ} stroke={LN} strokeWidth={1.5} />
        {/* casa */}
        <Rect x="138" y="54" width="15" height="30" rx="2" fill={CO} stroke={LN} strokeWidth={1.5} />
        <Rect x="124" y="92" width="114" height="76" rx="4" fill={BR} stroke={LN} strokeWidth={1.6} />
        <Path d="M110 98 L181 42 L252 98 Z" fill={AM} stroke={LN} strokeWidth={1.6} strokeLinejoin="round" />
        <Circle cx="181" cy="75" r="8" fill={BR} stroke={LN} strokeWidth={1.3} />
        <Rect x="136" y="108" width="26" height="24" rx="3" fill={AMC} stroke={LN} strokeWidth={1.3} />
        <Path d="M149 108v24M136 120h26" stroke={LN} strokeWidth={1.1} />
        <Rect x="200" y="108" width="26" height="24" rx="3" fill={AMC} stroke={LN} strokeWidth={1.3} />
        <Path d="M213 108v24M200 120h26" stroke={LN} strokeWidth={1.1} />
        <Path d="M169 168v-30a12 12 0 0 1 24 0v30z" fill={AZ} stroke={LN} strokeWidth={1.4} />
        <Circle cx="187" cy="154" r="1.8" fill={AM} />
        <Rect x="160" y="166" width="42" height="4" rx="2" fill={CI} stroke={LN} strokeWidth={1} />
        {/* escudo com check: a casa protegida */}
        <Circle cx="252" cy="62" r="25" fill={AM} opacity={0.45} />
        <Path d="M252 40 L271 47 V62 C271 74 263 82 252 86 C241 82 233 74 233 62 V47 Z" fill={AZ} stroke={LN} strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M243.5 63 L250 69.5 L261.5 56" stroke={BR} strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* pessoa apontando para a casa */}
        <Boneco x={88} y={139} s={0.76} pose="aponta" camisa={CO} calca={AZE} pele={PELE[1]} cabelo="#1E1A33" tipo="cacheado" />
        <Brilho x={110} y={56} cor={AM} /><Brilho x={300} y={92} cor={BR} /><Brilho x={58} y={86} cor={BR} />
      </Svg>}
    </View>
  );
}

/** Casa do cartão "Meu seguro": a versão do prompt 2 (meu_seguro_casa), senão a do prompt 1, senão o SVG. */
export function CasaProtegida({ tam = 120 }: { tam?: number }) {
  const img = IMAGENS.meu_seguro_casa ?? IMAGENS.casa_protegida;
  if (img) return <Image source={img} contentFit="contain" style={{ width: tam, height: tam }} />;
  return (
    <Svg width={tam} height={tam * 0.85} viewBox="0 0 130 110">
      <Path d="M12 56 L65 14 L118 56" fill="none" stroke={AM} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="26" y="52" width="78" height="56" rx="6" fill={AZE} /><Rect x="38" y="64" width="18" height="18" rx="3" fill={AM} /><Rect x="72" y="72" width="20" height="36" rx="3" fill={AZC} />
      <Circle cx="104" cy="30" r="14" fill={BR} /><Path d="M97 30l5 5 9-10" stroke={AZE} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Papel de parede da tela de bloqueio (azul do BB com luzes suaves). */
export function Papel() {
  if (IMAGENS.papel_parede) return <Image source={IMAGENS.papel_parede} contentFit="cover" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />;
  return (
    <Svg style={{ position: "absolute", top: 0, left: 0 }} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 390 844">
      <Defs>
        <RadialGradient id="a" cx="20%" cy="12%" r="60%"><Stop offset="0" stopColor="#465EFF" stopOpacity="0.95" /><Stop offset="1" stopColor="#465EFF" stopOpacity="0" /></RadialGradient>
        <RadialGradient id="b" cx="90%" cy="70%" r="55%"><Stop offset="0" stopColor="#2D37F5" stopOpacity="0.9" /><Stop offset="1" stopColor="#2D37F5" stopOpacity="0" /></RadialGradient>
        <RadialGradient id="c" cx="25%" cy="98%" r="45%"><Stop offset="0" stopColor="#3BE0C9" stopOpacity="0.6" /><Stop offset="1" stopColor="#3BE0C9" stopOpacity="0" /></RadialGradient>
      </Defs>
      <Rect width="390" height="844" fill="#1C2266" /><Rect width="390" height="844" fill="url(#a)" /><Rect width="390" height="844" fill="url(#b)" /><Rect width="390" height="844" fill="url(#c)" />
    </Svg>
  );
}
export { AMC };
