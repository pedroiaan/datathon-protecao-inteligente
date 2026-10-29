/* global __dirname */
// Copia as fichas do motor (prototipos/fichas_demo.js, gerado por motor/gerar.py --entrega)
// para src/dados/fichas.json, que o app importa. Rode: npm run dados
// Antes de gravar, confere cada ficha contra o contrato do app (src/dados/contrato.ts):
// campo faltando vira aviso aqui, não tela quebrada no celular.
const fs = require("fs");
const path = require("path");
const origem = process.argv[2] || path.join(__dirname, "..", "..", "prototipos", "fichas_demo.js");
const texto = fs.readFileSync(origem, "utf8");
const json = JSON.parse(texto.slice(texto.indexOf("{"), texto.lastIndexOf("}") + 1));

const OBRIGATORIOS = ["local", "complemento", "campos", "valor_imovel", "elegibilidade", "plano", "coberturas", "perguntas", "confianca", "sinais"];
const CAMPOS = ["tipo", "vinculo", "uso", "area", "bens"];
const PLANOS = ["ESSENCIAL", "PRATICO", "TOTAL"];
const problemas = [];
for (const [caso, id] of Object.entries(json.casos || {})) if (!json.fichas[id]) problemas.push(`caso ${caso}: ficha ${id} não existe`);
for (const [id, f] of Object.entries(json.fichas)) {
  OBRIGATORIOS.filter((k) => f[k] === undefined).forEach((k) => problemas.push(`${id}: falta "${k}"`));
  CAMPOS.filter((k) => !f.campos?.[k] || f.campos[k].valor === undefined).forEach((k) => problemas.push(`${id}: falta campos.${k}.valor`));
  if (f.plano && !PLANOS.includes(f.plano)) problemas.push(`${id}: plano desconhecido "${f.plano}"`);
  (f.perguntas || []).filter((p) => !p.codigo || !p.texto).forEach(() => problemas.push(`${id}: pergunta sem codigo/texto`));
}
if (problemas.length) {
  console.error("Fichas fora do contrato do app:\n- " + problemas.join("\n- "));
  process.exit(1);
}
fs.writeFileSync(path.join(__dirname, "..", "src", "dados", "fichas.json"), JSON.stringify(json));
console.log("fichas.json:", Object.keys(json.fichas).length, "fichas,", Object.keys(json.casos || {}).length, "casos. Contrato ok.");
