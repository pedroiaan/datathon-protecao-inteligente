# 28 · Demo do vídeo: o app e a planilha do motor, lado a lado

**Em uma frase:** o app (Expo) agora roda os 2 casos do vídeo com os dados do motor e mostra, ao lado, a planilha de entrega que gerou cada tela.

**Onde estamos:** dia da entrega (29/10) · vault: `14 - App v2/Demo - app e planilha lado a lado.md`

## O que fizemos
- `motor/motivo.py`: `justificativa_partes` (o motivo em partes nomeadas); o texto do CSV não mudou.
- `motor/gerar.py`: `CASOS_DO_VIDEO` (00036_02 Goiânia e 00015_01 Porto Alegre); cada ficha do app leva as suas linhas dos 2 CSVs, o motivo em partes e as frases extras.
- App: menu da demonstração, painel no estilo do Excel à direita do iPhone, uma aba e uma parte do motivo por tela, pergunta decisiva que muda o plano e portal do gerente com código legível (`SR-RS-ESS-0015-1`) e fila por prioridade.

## Resultado
Conferido no navegador: menu, notificação, Passo 1 (a resposta "sim" sobe o plano para o Prático), Passo 2, plano, conferir e troca de caso. O typecheck passou. As planilhas de entrega continuaram idênticas. Os testes automáticos não foram rodados (pedido do time, para economizar).

## Próximo passo
Gravar o vídeo seguindo a nota do vault.
