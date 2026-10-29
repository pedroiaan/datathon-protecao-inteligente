/* global __dirname */
// Reduz pela metade (média de 2 × 2, com alfa pré-multiplicado) as ilustrações maiores que 1000 px
// de largura em assets/ilustracoes/. No celular elas aparecem com até ~390 pt, então 768 px basta
// e o arquivo fica ~4× menor (carrega rápido no Expo Go). Roda no lugar: npm run reduzir
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const PASTA = path.join(__dirname, "..", "assets", "ilustracoes");
for (const f of fs.readdirSync(PASTA).filter((x) => x.endsWith(".png"))) {
  const arq = path.join(PASTA, f);
  const img = PNG.sync.read(fs.readFileSync(arq));
  if (img.width <= 1000) continue;
  const w = Math.floor(img.width / 2), h = Math.floor(img.height / 2), out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const i = (img.width * (2 * y + dy) + 2 * x + dx) * 4, al = img.data[i + 3];
      r += img.data[i] * al; g += img.data[i + 1] * al; b += img.data[i + 2] * al; a += al;
    }
    const o = (w * y + x) * 4;
    out.data[o] = a ? Math.round(r / a) : 0; out.data[o + 1] = a ? Math.round(g / a) : 0; out.data[o + 2] = a ? Math.round(b / a) : 0; out.data[o + 3] = Math.round(a / 4);
  }
  const antes = fs.statSync(arq).size;
  fs.writeFileSync(arq, PNG.sync.write(out, { colorType: 6, deflateLevel: 9 }));
  console.log(`${f}: ${img.width}→${w} px, ${Math.round(antes / 1024)}→${Math.round(fs.statSync(arq).size / 1024)} KB`);
}
