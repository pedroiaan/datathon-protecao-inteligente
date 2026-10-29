# App do Seguro Residencial (Expo)

Protótipo do app do BB com a nossa jornada de Seguro Residencial, para rodar no celular pelo **Expo Go** e gravar a tela. Não é um app oficial do Banco do Brasil e não é publicado.

## Como rodar no celular
1. Instale o **Expo Go** no celular (App Store ou Google Play).
2. No computador, dentro desta pasta:
   ```bash
   npm install
   npx expo start
   ```
3. Leia o QR code com a câmera (iPhone) ou com o Expo Go (Android). O celular e o computador precisam estar na mesma rede Wi-Fi. Se não conectar, use `npx expo start --tunnel`.

Para ver no navegador: `npx expo start --web`. Em janela larga o app aparece dentro de uma moldura de iPhone (bom para gravar no computador). Abra direto num caso com `/?caso=perfil_B_casa_familiar`. Liga e desliga em `src/config.ts`.

## Para gravar
- **Segure o relógio** da tela de bloqueio para trocar o caso (perfis A, B e C do slide 14, "Já tem seguro", inquilino, possível reforma).
- Toque no aviso do App BB para entrar. "Recomeçar a demonstração", no fim, volta para o aviso.
- Animações e vibração (haptics) aparecem no celular de verdade. Para a gravação as animações aparecem mesmo com "reduzir movimento" ligado (`DEMO.animarSempre` em `src/config.ts`); num app publicado, deixe `false`.

## Portal do gerente
Depois de "Chamar o Ricardo", toque em **Abrir o portal do gerente** (ou segure o relógio na tela de bloqueio). A fila mostra cada cliente com o seu código (`SR-XXXX-XX`); o pedido abre preenchido e o gerente liga ou desliga as sugestões antes de enviar. Regras em `src/logica/gerente.ts`.

## Ilustrações finais
Ilustrações e ícones foram gerados no ChatGPT com os prompts `assets/ilustracoes/PROMPT_ChatGPT.md` (ilustrações) e `assets/icones/PROMPT_ChatGPT_icones.md` (ícones e visuais). Para trocar ou acrescentar imagens:
```bash
npm run icones    # fatia assets/icones/folha_I1..I5.png em ic_<nome>.png
npm run reduzir   # reduz para 768 px as ilustrações grandes de assets/ilustracoes/
npm run imagens   # liga em src/ui/imagens.ts toda imagem que existe
```
Sem o PNG, o app usa o desenho em SVG ou o ícone vetorial.

## De onde vêm os números
`src/dados/fichas.json` é uma cópia de `prototipos/fichas_demo.js`, que o motor gera. Depois de rodar `python motor/gerar.py --entrega`, atualize com:
```bash
npm run dados                      # ou: node scripts/dados.js caminho/para/fichas.js
```
O script confere cada ficha contra o contrato do app (`src/dados/contrato.ts`) e para com a lista do que falta. Cada ficha traz as próprias perguntas (`perguntas[]`): códigos conhecidos ganham texto e opções claras em `perguntaCliente` (`src/logica/textos.ts`); códigos novos aparecem com o texto do motor e Sim/Não.
Preço é ilustrativo (o motor não calcula prêmio): taxa por mil dos prints do app atual até o valor padrão e 10% dela acima disso (`src/logica/produto.ts`).

## Onde está cada coisa
| Pasta | O quê |
|---|---|
| `src/app/` | As telas (cada arquivo é uma rota do Expo Router): `index` aviso, `seguro` entrada, `casa` 1/5, `cobre` 2/5, `plano` 3/5, `ajuste` 4/5, `conferir` 5/5, `sucesso`, `meu`, `gerente`, `avisado`, `retorno`, `ajustada`; `painel/` é o portal do gerente (fila e pedido) |
| `src/dados/` | Fichas do motor (`fichas.json`) e o contrato de tipos que as telas usam (`contrato.ts`) |
| `src/logica/` | Produto e preço (`produto.ts`), textos do cliente e dúvidas frequentes (`textos.ts`), estado da demo (`estado.tsx`) |
| `src/ui/` | Visual do BB: cabeçalho azul, folha branca, botões em pílula (`base.tsx`), folha de baixo e aviso rápido (`folha.tsx`), ajuda (`ajuda.tsx`), tela de bloqueio (`bloqueio.tsx`), ilustrações (`ilustracoes.tsx`), moldura de iPhone na web (`moldura.tsx`), tokens de cor e escala tipográfica `TIPO` (`tema.ts`) |

Conferência antes de subir: `npx tsc --noEmit` e `npx eslint src`.
