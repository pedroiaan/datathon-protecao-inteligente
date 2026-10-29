/* global __dirname */
// Fatia as folhas de ícones geradas no ChatGPT (assets/icones/folha_I1.png ... folha_I5.png,
// grade de 3 colunas x 2 linhas) em um PNG por ícone: assets/icones/ic_<nome>.png.
// Cada célula é recortada pela parte visível (alfa), centralizada num quadrado com margem.
// Rode: npm run icones   (depois descomente as linhas em src/ui/imagens.ts)
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const PASTA = path.join(__dirname, "..", "assets", "icones");
const FOLHAS = {
  folha_I1: ["incendio", "eletricos", "agua", "vendaval", "impacto", "roubo"],
  folha_I2: ["vidros", "terceiros", "casa", "emergencia", "chuva", "temporada"],
  folha_I3: ["reparos", "eletrodomesticos", "limpeza", "moveis", "pragas", "seguranca"],
  folha_I4: ["assistencia", "cobertura", "duvida", "chaveiro", "debito", "cartao"],
  // a I5 veio com pix e chat em cima e ligação e vídeo embaixo (células 3 e 6 vazias); null = célula vazia
  folha_I5: ["pix", "chat", null, "ligacao", "video", null],
};
const ALFA_MIN = 16;   // abaixo disso o pixel conta como fundo
const MARGEM = 0.06;   // respiro em volta do ícone recortado

function recorta(img, x0, y0, w, h) {
  let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    if (img.data[(img.width * y + x) * 4 + 3] > ALFA_MIN) {
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return null; // célula vazia
  const lado = Math.ceil(Math.max(maxX - minX + 1, maxY - minY + 1) * (1 + 2 * MARGEM));
  const out = new PNG({ width: lado, height: lado }); // começa transparente
  const dx = Math.floor((lado - (maxX - minX + 1)) / 2), dy = Math.floor((lado - (maxY - minY + 1)) / 2);
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    const i = (img.width * y + x) * 4, o = (lado * (y - minY + dy) + (x - minX + dx)) * 4;
    img.data.copy(out.data, o, i, i + 4);
  }
  return out;
}

let feitos = 0;
const faltando = [];
for (const [folha, nomes] of Object.entries(FOLHAS)) {
  const arq = path.join(PASTA, folha + ".png");
  if (!fs.existsSync(arq)) { faltando.push(folha); continue; }
  const img = PNG.sync.read(fs.readFileSync(arq));
  const cw = Math.floor(img.width / 3), ch = Math.floor(img.height / 2);
  nomes.forEach((nome, n) => {
    if (!nome) return;
    const ic = recorta(img, (n % 3) * cw, Math.floor(n / 3) * ch, cw, ch);
    if (!ic) { console.warn(`${folha}: célula ${n + 1} (${nome}) vazia`); return; }
    fs.writeFileSync(path.join(PASTA, `ic_${nome}.png`), PNG.sync.write(ic));
    feitos++;
  });
}
console.log(`${feitos} ícones gravados em assets/icones/.` + (faltando.length ? ` Faltam as folhas: ${faltando.join(", ")}.` : ""));
