# Proteção Inteligente · Seguro Residencial

Projeto para o **Datathon Proteção Inteligente** (IBMEC + BB Seguros / Brasilseg).

## Equipe
- **Nome da equipe:** Varetas
- **Integrantes:**
  - Eduardo Vieira Ponce Firmino
  - Luís Guilherme Lebedeff
  - Matheus Ferreira de Souza
  - Pedro Ian Guedes Carvalho
  - Vinicius Ferreira Assunção
- **Desafio:** Seguro Residencial

## Onde está cada entrega (guia, seção 6)
| Entregável do guia | Onde está |
|---|---|
| Templates preenchidos (138 casos) | `entrega/template_resultado_times.csv` e `entrega/template_coberturas_times.csv` (versão para leitura em Excel: `documentos/planilhas_para_leitura.xlsx`) |
| README | este arquivo |
| Códigos | `motor/` (motor de regras em Python), `app-expo/` (app da demonstração), `tests/` (155 testes) |
| Dependências | `requirements.txt` + `.python-version` (Python 3.11); app: `app-expo/package.json` (Node 22) |
| Dados externos | `motor/externos/` (cópias) e `motor/externos/FONTES.md` (fonte, data, licença, método, transformação e limitações) |
| Apresentação | `slides/index.html` (pitch de 5 min) e o vídeo de até 5 min (link na entrega) |
| Métricas e evidências | `entrega/metricas.json`, `entrega/assertividade.json`, `entrega/casos_contrastantes.json` |

## Objetivo
Responder, para cada cliente e imóvel, "quanto proteger esta casa e com qual plano?" usando só o que o banco já sabe: é elegível? qual plano? quais coberturas e com que faixa de valor? o que foi observado, o que foi estimado e o que precisa ser confirmado? por que esse plano e não outro?

A solução é um **motor de regras explicável**, sem machine learning. Cada decisão tem uma regra escrita, uma fonte e um teste. A mesma saída (a "ficha" do caso) alimenta as duas planilhas, o app do cliente (1 toque), o painel do gerente e uma API para agentes.

## Como rodar
Python 3.11 (registrado em `.python-version`).

```bash
pip install -r requirements.txt
python -m pytest -q                 # 155 testes
python motor/gerar.py --entrega     # gera, valida e copia as planilhas para entrega/
```

- **App (demonstração do vídeo):** Node 22. Na pasta `app-expo/`: `npm install` e `npx expo start --web`, depois abra `http://localhost:8081` numa janela larga. O app aparece dentro de um iPhone, com a planilha que o motor gerou para o cliente ao lado e um menu com os 2 casos do vídeo. No celular: Expo Go + `npx expo start`. Para atualizar as fichas do app depois de mudar o motor: `python motor/gerar.py --entrega` e `npm run dados` (em `app-expo/`).
- **Slides:** abra `slides/index.html` no navegador (← → para navegar, F tela cheia, N notas do apresentador). Instruções em `slides/README.md`.
- **Demo antiga (HTML):** abra `prototipos/indexprototipo_gerente.html` com dois cliques. Os botões A, B e C mostram os perfis do slide 14 com a ficha real do motor.
- **API (opcional):** `pip install -r requirements-api.txt` e `uvicorn api:app --app-dir motor --port 8000`. Documentação em `/docs`.
- Os testes também rodam sozinhos no GitHub a cada envio (`.github/workflows/testes.yml`).

## Arquitetura

```
dados/desenvolvimento ──► calibrar()  (R$ de IPTU e de energia por m², por município)
                                │
dados/teste_comum ──► processar_caso() para cada cliente-imóvel
   1. inferir tipo, vínculo, uso, área e bens  → cada dado com natureza, fonte e confiança
   2. elegibilidade (guia 9.1)                 → SIM / NAO / SIM + pergunta
   3. plano pelas necessidades                 → aluguel → Total; roubo e vidros → Prático; terceiros → RC
   4. faixa mín/máx de cada cobertura          → SINAPI, CUB, IPCA, FipeZAP, condições gerais
   5. até 3 perguntas, pelo valor da informação
   6. confiança por regra + jornada (1 toque, app com perguntas, gerente só em último caso)
   7. motivo feito para o cliente: casa e cidade, porquê, fato que o diferencia dos vizinhos,
      risco da cidade, o que fica descoberto em reais, confiança com o acerto medido (motor/motivo.py)
                                │
                     ficha (JSON) ──► 2 planilhas · métricas · demo · API
```

| Arquivo | O que faz |
|---|---|
| `motor/motor.py` | Toda a lógica: inferências, elegibilidade, plano, coberturas, perguntas, confiança, planilhas |
| `motor/parametros.py` | Todas as premissas numéricas, com a origem escrita ao lado |
| `motor/metricas.py` | Métricas do guia §8 e casos contrastantes |
| `motor/assertividade.py` | Quanto acerta cada cálculo que completa um dado faltante (validação em 5 dobras, comparação com o chute) |
| `motor/templates.py` | Valida as planilhas contra as regras do guia antes de gravar |
| `motor/gerar.py` | Roda tudo de ponta a ponta |
| `motor/api.py` | API de demonstração (ficha e recálculo com as respostas do cliente) |
| `motor/externos/` | Fontes externas salvas + `FONTES.md` (fonte, data, licença, método, limitações) |
| `entrega/` | As 2 planilhas, `metricas.json`, `casos_contrastantes.json` e `assertividade.json` |
| `tests/` | Testes automáticos (motor, assertividade, motivo, API e coletor) |
| `app-expo/` | App do cliente e portal do gerente (Expo/React Native). No navegador largo mostra, ao lado do iPhone, a planilha que o motor gerou para o cliente |
| `slides/` | Slides do pitch (HTML) |
| `prototipos/` | Protótipo HTML anterior e `fichas_demo.js` (fichas do motor para os apps, geradas pelo `gerar.py`) |
| `obsidian/` | Vault do time: regras de negócio, decisões, explicação de cada cálculo do zero, pitch (abra a pasta no Obsidian) |
| `dados/` | Bases da organização (fictícias): desenvolvimento e Teste Comum |
| `documentos/contexto/` | Um documento curto por etapa (comece pelo `00-mapa.md`) |

## Premissas principais
- **Faixa = importância segurada** (quanto segurar), não valor de sinistro.
- **Casa:** reconstrução = área × custo do m² (mínimo SINAPI/IBGE, máximo CUB oficial) × padrão construtivo. Terreno não entra.
- **Apartamento, casa em condomínio ou financiado:** segundo risco (CG cl. 15.2). A estrutura tem seguro próprio; segura-se 25% a 40% (acabamentos) + bens.
- **Bens:** compras de 36 meses e bens vinculados, corrigidos pelo IPCA (Banco Central), até 2,7 × as compras (estoque). Sem compras nem bens ligados ao imóvel: média da região combinada com a renda (média geométrica; erro mediano fora da amostra de 40,0% só com a região para 22,3%).
- **Área sem cadastro (67% dos casos):** IPTU^0,6 × energia^0,4 (média geométrica), cada um dividido pelo R$/m² do município. Os pesos foram confirmados por regressão (0,59 e 0,42). Erro mediano fora da amostra de 14,1% (o chute erra 44,4%). A renda não ajuda aqui (correlação 0,01 com a área).
- **Padrão construtivo vazio:** com área cadastrada, o IPTU/m² descarta um extremo (acerta o intervalo em 97,8%; não acerta o padrão exato, por isso é intervalo). Sem área e sem padrão (64 casos), faixa calibrada de área × padrão: contém o valor real em 88% dos testes, 1,76× de largura (o pior caso dava 2,7×). E a pergunta do acabamento.
- **Plano:** pelas três necessidades do cliente (aluguel em jogo → Total; roubo e vidros → Prático; danos a terceiros → RC familiar), cada uma com a prova e a força ("clara" ou "no limite", com pergunta decisiva). Explicação completa no vault: `obsidian/BB Datathon/16 - Projeto por inteiro/02 - O motor passo a passo.md`.
- **Idade não entra em nenhuma decisão** (guia: "não utilize dados sensíveis ou atributos pessoais como atalho para risco ou patrimônio"). Dependentes e pet só como necessidade de RC familiar, nunca em valor, risco, canal ou confiança.
- **Renda:** na mentoria de 28/10, o Banco do Brasil confirmou que renda não é dado sensível (a LGPD, art. 5º, II, também não a lista). Ela entra num ponto só: os bens de quem não tem compras nem bens ligados ao imóvel, sempre combinada com a média da região, e o cliente lê no motivo que a renda foi usada. Quem tem compras segue pelas compras. Elegibilidade, canal e confiança não usam renda. Desligável em `parametros.RENDA_NOS_BENS_SEM_COMPRAS`.

## Elegibilidade (guia 9.1)
| Regra | Como o motor trata |
|---|---|
| Situação cadastral tombado, desapropriado ou condenado | `NAO` |
| Endereço que já tem seguro BB | Um imóvel só → `NAO`. Dois imóveis → `SIM` + "qual já tem seguro?" |
| Construção ou reforma | Gasto alto com material de construção → `SIM` + pergunta (o gasto sugere, mas não prova) |
| Parede de material combustível | `SIM` + pergunta sobre madeira pré-fabricada ABNT |
| Comunidade, favela, atividade rural, MEI fora da lista | A base não tem esses dados: confirmação na contratação (ver limitações) |

## Limitações
- Não há sinistros nem rótulos de plano na base, então não há acurácia de recomendação a medir. O que **tem** gabarito (área e padrão cadastrados) é medido fora da amostra em `entrega/assertividade.json`. O que não tem (valor dos bens, uso, vínculo) é declarado como tal, com a concordância entre fontes.
- O máximo dos bens (2,7 × as compras, ~8 anos de vida útil) é premissa: não há dado do valor real do que está dentro das casas.
- Favela/comunidade, atividade rural e MEI não aparecem nos dados. Precisam de declaração do cliente na contratação.
- O CUB de RJ, PE e CE não foi conferido em fonte oficial. Nessas UFs o máximo é SINAPI × razão CUB/SINAPI das 7 UFs oficiais (≈ 1,14).
- Custos e aluguel são médias do estado ou da capital, não do bairro.
- O catálogo do datathon não tem "instalações e pequenos reparos", que o guia lista no Essencial. Seguimos o catálogo, que é a nomenclatura de conferência.
- Os valores de vendaval, danos por água, RC e despesas emergenciais são proporções premissa do time (em `parametros.py` e `motor.dimensionar()`), sem dado de sinistro para calibrar.
- O dado de acionamentos do Seguro Residencial BB (matéria de imprensa) foi retirado em 29/10: era fonte secundária, sem como auditar, e só aparecia no texto.
- A base não traz risco de território. Usamos registros oficiais da Defesa Civil (Atlas/S2iD) e o ranking de energia da ANEEL por município, só no texto do motivo; o risco de furto segue sem fonte.

## Métricas (base comum, 138 casos)
| Métrica | Resultado |
|---|---|
| Casos processados / com justificativa / coberturas fixas completas | 100% · 100% · 100% |
| Falhas na execução | 0 |
| Planos | Prático 66 · Total 38 · Essencial 34, pelas necessidades: aluguel em jogo → Total; roubo e vidros → Prático; danos a terceiros → RC |
| Força da recomendação | clara 124 · no limite 14 (a menos de 15% do limite; recebem a pergunta que decide o plano) |
| Coberturas adicionais | 93 (RC familiar para quem mora em prédio ou condomínio, ou tem dependentes ou pet) |
| Elegibilidade | SIM 138 · NÃO só com prova (situação cadastral irregular; nenhum na base) · 37 com confirmação pendente, 16 deles "provável seguro BB" (o app pergunta; RN-19) |
| Confiança | ALTA 17 · MÉDIA 101 · BAIXA 20 (14%) |
| Jornada | 1 toque 63 (nenhuma pergunta obrigatória) · app com perguntas 49 (elegibilidade, uso duvidoso, confiança baixa, modo simples) · gerente 26 (19%: obra 10, sem app 16) |
| Qualidade do motivo | 0 motivos genéricos · 100% com fato do próprio cliente e valor em risco · 0 termos internos · mediana de 127 palavras (máx. 140) |
| Personalização do motivo | casa e cidade em 138 de 138 (antes 0) · 125 esqueletos únicos (antes 83) · frase mais repetida em 32 motivos (antes 93) · fato dos vizinhos em 38% · risco oficial da cidade em 47% |
| Perguntas por caso | 2,75 (0,46 obrigatória; as demais só ajustam o valor e vêm marcadas "(opcional)"); 80 casos sem pergunta que trave |
| Teste de justiça (troca renda e idade) | 0 casos mudam (todos os 138 têm compras ou bens; a renda só entra sem eles) |
| Bens sem compras: só região × região + renda (fora da amostra, 2.578 imóveis) | erro mediano 40,0% → 22,3% |
| Dependentes e pet mudando plano, valor ou confiança | 0 casos (só pedem a RC familiar como adicional ou pergunta) |
| Estabilidade do plano (valores ±5%) | 1 caso muda (perto do limiar de eletrônicos) |
| Estabilidade da confiança (pesos ±20%) | 0 casos mudam |
| Faixa de incêndio por confiança (máx ÷ mín) | ALTA 1,89 · MÉDIA 2,14 · BAIXA 2,16 |
| Sensibilidade (área +10%) | incêndio +4,1% em média, 0 quedas |
| Regra dos 80% na elegibilidade por faixa de renda | 1,00 |
| Reprodutibilidade | duas rodadas geram arquivos idênticos |
| Tempo | ~0,5 s para os 138 casos |

### Métricas de mercado e validação
| Métrica | Resultado | Como |
|---|---|---|
| 1 toque puro · sem pessoa no meio | 45,7% · 81,2% dos elegíveis | Sem pergunta obrigatória · 1 toque + app com perguntas de sim/não |
| Esforço | 2,7 perguntas × 19,9 campos de uma cotação tradicional (86,4% menos) | 5 dados do imóvel + 6 declarações de elegibilidade + 1 valor por cobertura |
| ITV do incêndio (segurado ÷ valor em risco) | máximo 1,48 · mínimo 0,62 · sugerido ÷ cenário pessimista 0,67 | O valor sugerido evita o mínimo; contra o pior cenário ele cobre 67% (medida sem circularidade) |
| Fora da amostra: área | erro mediano 14,1% (chute 44,4%); 65% a menos de 20% da real; a faixa contém a área real em 81% (meta 80%) | Validação cruzada em 5 dobras: aprende em 4/5 da base de desenvolvimento, mede no 1/5 que não viu |
| Fora da amostra: padrão pelo IPTU/m² | intervalo certo em 97,8% dos 182 estreitados (padrão exato: 51%, contra 63% do chute) | Mesmo método |
| Fora da amostra: área × padrão (sem os dois) | faixa 1,76× contendo o real em 88% (pior caso: 2,7× e 98%) | Mesmo método |
| Sem gabarito: tipo · vínculo · bens | termo × complemento concordam em 100% · 0 conflitos aluguel × financiamento · compras × bens cadastrados 0,63 | Concordância entre fontes; a luz não separa casa vazia (uso vira pergunta) |

Tudo em `entrega/metricas.json`.

**Reprodutibilidade:** as planilhas entregues usam os dados externos salvos no repositório (SINAPI set/2026, IPCA até set/2026). Rodar `python motor/externos/coletar.py --ao-vivo` renova essas fontes pelas APIs e, de propósito, muda as faixas; sem o coletor, duas gerações dão arquivos idênticos.

## Resultados: os 2 casos da demonstração
| Cliente (nome da demo) | Caso | O que mostra |
|---|---|---|
| Luana · apartamento de 50 m² em Goiânia | `IMO_CASO_00036_02` | Dados completos: plano Total (paga aluguel), confiança alta, **nenhuma pergunta**, contrata em 1 toque |
| Sérgio · casa em Porto Alegre | `IMO_CASO_00015_01` | Área estimada e padrão desconhecido: Essencial **no limite**, confiança média, **2 perguntas feitas para ele**; ao responder que os eletrônicos passam de R$ 10 mil, o plano sobe para o Prático na hora |

## Resultados: casos contrastantes (slide 14)
| Perfil | Caso | Plano | Por quê |
|---|---|---|---|
| A · Apartamento urbano | `IMO_CASO_00004_01` | Prático + RC | Bens e eletrônicos comprovados altos; dependentes ou pet → RC adicional |
| B · Casa familiar | `IMO_CASO_00001_01` | Prático + RC | Casa em condomínio com bens e eletrônicos altos; a família pede a RC familiar como adicional, sem mudar o plano |
| C · Imóvel de lazer | `IMO_CASO_00010_01` | Essencial + RC | Apartamento de veraneio que fica vazio: o roubo do Prático não cobre residência desocupada |
| Já segurado? | `IMO_CASO_00014_01` | Prático + RC | Provável seguro BB no endereço: vira pergunta obrigatória ("O seu seguro atual é da BB?"); se sim, não há nova proposta |

## Fontes externas
SINAPI (IBGE, pela API SIDRA, set/2026), CUB oficial (Sinduscons de SP, DF, GO, BA, MG, RS e PR), IPCA (Banco Central, API SGS 433; `coletar.py --ao-vivo` renova os dois), FipeZAP Locação (Fipe), Atlas Digital de Desastres / S2iD (Sedec/MIDR, 1991–2025) e Ranking de Continuidade 2025 da ANEEL (os dois só no texto do motivo) e Condições Gerais BB Seguro Residencial v1.4. Detalhes, licença e limitações em `motor/externos/FONTES.md`.

## Privacidade e responsabilidade
- Só dados do pacote e fontes públicas. Os dados do pacote são fictícios.
- Minimização: idade e origem da renda não são lidas por nenhuma regra (teste automático). A renda é lida num ponto só (bens sem compras), ligado por um parâmetro, e o texto do cliente avisa quando ela foi usada.
- Controle humano: toda estimativa vira pergunta ou vai para o gerente; nada é contratado sem confirmação.
- Nenhuma credencial ou dado restrito no repositório.

## Uso de IA
Usamos ferramentas de IA **como apoio**. Todas as regras, os parâmetros, as decisões de produto e os resultados foram decididos, executados e conferidos pela equipe, que entende, executa e defende o código e a solução. A responsabilidade pela entrega é nossa.

| Para quê | Ferramenta | Como usamos | O que a equipe fez |
|---|---|---|---|
| Entender a proposta | Claude (Anthropic) | Leitura e resumo do guia, das condições gerais e das regras do produto; dúvidas sobre seguro residencial | Conferimos com os documentos oficiais e com a mentoria do BB; as regras ficaram escritas em `obsidian/BB Datathon/Regras de negócio.md` |
| Sugestões de ideias | Claude | Debate de ideias para a recomendação, o motivo, as perguntas e a jornada | Escolhemos o que entrava e descartamos o resto (registro em `documentos/contexto/`) |
| Desenvolver o motor (Python) | Claude Code | Escrita e revisão de código com testes primeiro (155 testes), revisão de código e auditorias | Cada regra foi validada contra o guia e os números conferidos na base; os parâmetros têm a origem escrita em `motor/parametros.py` |
| Desenvolver o app (Expo) | Claude Code | Telas, painel-planilha da demonstração e correções | Testamos as jornadas no navegador |
| Ilustrações e ícones do app | ChatGPT (geração de imagens) | Imagens no estilo do app, a partir de um prompt nosso (`app-expo/assets/ilustracoes/PROMPT_ChatGPT.md`) | Escolhemos, recortamos e revisamos as imagens |
| Verificar APIs e fontes externas | Claude | Pesquisa de fontes públicas e conferência das APIs (IBGE/SIDRA, Banco Central/SGS, ANEEL, Atlas de Desastres) | Testamos cada API; fonte, data, licença e limitações em `motor/externos/FONTES.md`. Uma fonte de imprensa foi descartada por não ser auditável |
| Slides e pitch | Claude e Codex (OpenAI) | Claude estruturou o roteiro e escreveu o prompt de design; o Codex gerou `slides/index.html` com as cores, fontes e ilustrações do app | Escolhemos a ordem final (5 slides + demonstração ao vivo), conferimos cada número com `entrega/metricas.json` e apresentamos com as nossas palavras |

**Em que momentos a IA mais ajudou:**
- **Leitura do guia e das regras:** transformar o guia, as condições gerais e a mentoria em regras de negócio numeradas (RN-01 a RN-58), que viraram a base das decisões.
- **Auditorias e QA:** revisões de código encontraram erros que corrigimos antes da entrega (ex.: a faixa do incêndio que somava o pior caso da área e do padrão; o texto do motivo que citava um valor que o cliente não tinha visto; um pacote de assistência a menos no Prático do app).
- **Medir em vez de supor:** a validação em 5 dobras de cada cálculo de dado faltante (`motor/assertividade.py`) e o teste do motor sem internet.
- **Fontes externas:** encontrar as APIs oficiais (IBGE, Banco Central) e conferir licença e data; descartamos uma fonte de imprensa que não dava para auditar.
- **App e demonstração:** telas, correções de navegação no navegador e o painel que mostra a planilha do motor ao lado do app.
- **Documentação:** o vault do Obsidian explica cada cálculo do zero, para todos do time saberem defender a solução.

**O que a IA não faz na solução:** o motor não chama nenhum modelo de IA. Ele é feito de regras determinísticas: a mesma entrada gera sempre a mesma saída, sem enviar dado de cliente a serviço externo. A base usada é a fictícia fornecida pela organização.

## Relato
Caminhos testados e descartados estão em `documentos/contexto/` (seção "Decisões e o que descartamos" de cada etapa). Exemplos: confiança por corte numa nota (descartada por instabilidade), qualquer criança ou pet levando ao Total (inflava o Total para 65%), CUB de agregador (fonte não oficial).
