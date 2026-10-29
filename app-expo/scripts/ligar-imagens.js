/* global __dirname */
// Liga em src/ui/imagens.ts toda imagem cujo PNG já existe em assets/ (descomenta a linha do require)
// e desliga a que sumiu. Rode depois de copiar PNGs novos e de `npm run icones`: npm run imagens
const fs = require("fs");
const path = require("path");

const ARQ = path.join(__dirname, "..", "src", "ui", "imagens.ts");
const UI = path.dirname(ARQ);
let ligadas = 0, desligadas = 0;
const linhas = fs.readFileSync(ARQ, "utf8").split("\n").map((l) => {
  const m = l.match(/^(\s*)(\/\/ )?(\w+: require\("([^"]+)"\),)$/);
  if (!m) return l;
  const existe = fs.existsSync(path.resolve(UI, m[4]));
  if (existe) { ligadas++; return m[1] + m[3]; }
  desligadas++;
  return m[1] + "// " + m[3];
});
fs.writeFileSync(ARQ, linhas.join("\n"));
console.log(`imagens.ts: ${ligadas} imagens ligadas, ${desligadas} ainda sem arquivo (ficam no desenho atual).`);
