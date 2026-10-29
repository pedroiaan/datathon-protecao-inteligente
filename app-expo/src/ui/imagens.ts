// Imagens finais em PNG, geradas pelo time no ChatGPT:
//   - ilustrações e visuais: assets/ilustracoes/ (prompts assets/ilustracoes/PROMPT_ChatGPT.md e,
//     para papel de parede, casas e planos, assets/icones/PROMPT_ChatGPT_icones.md);
//   - ícones: assets/icones/ (mesmo prompt 2; as folhas são fatiadas com `npm run icones`).
// Enquanto um arquivo não existe, a tela usa o desenho atual (SVG ou ícone vetorial): nada quebra.
// Para ligar uma imagem: salve o PNG com o nome da tabela do prompt e descomente a linha dela.
// O require precisa ser literal (o Metro empacota na hora).

export type NomeImagem =
  | "heroi_entrada" | "casa_protegida" | "gerente_ricardo" | "gerente_painel"
  | "cena_agua" | "cena_raio" | "cena_vizinho_apto" | "cena_vizinho_casa" | "cena_roubo" | "cena_vidros"
  | "cena_vento_apto" | "cena_vento_casa" | "cena_fogo" | "cena_impacto" | "cena_aluguel" | "cena_despesas"
  | "papel_parede" | "meu_seguro_casa" | "sucesso_casa" | "plano_essencial" | "plano_pratico" | "plano_total";

// require() de um PNG devolve um número (o id do recurso empacotado)
export const IMAGENS: Partial<Record<NomeImagem, number>> = {
  // --- prompt 1: ilustrações ---
  heroi_entrada: require("../../assets/ilustracoes/heroi_entrada.png"),
  casa_protegida: require("../../assets/ilustracoes/casa_protegida.png"),
  gerente_ricardo: require("../../assets/ilustracoes/gerente_ricardo.png"),
  gerente_painel: require("../../assets/ilustracoes/gerente_painel.png"),
  cena_agua: require("../../assets/ilustracoes/cena_agua.png"),
  cena_raio: require("../../assets/ilustracoes/cena_raio.png"),
  cena_vizinho_apto: require("../../assets/ilustracoes/cena_vizinho_apto.png"),
  cena_vizinho_casa: require("../../assets/ilustracoes/cena_vizinho_casa.png"),
  cena_roubo: require("../../assets/ilustracoes/cena_roubo.png"),
  cena_vidros: require("../../assets/ilustracoes/cena_vidros.png"),
  cena_vento_apto: require("../../assets/ilustracoes/cena_vento_apto.png"),
  cena_vento_casa: require("../../assets/ilustracoes/cena_vento_casa.png"),
  cena_fogo: require("../../assets/ilustracoes/cena_fogo.png"),
  cena_impacto: require("../../assets/ilustracoes/cena_impacto.png"),
  cena_aluguel: require("../../assets/ilustracoes/cena_aluguel.png"),
  cena_despesas: require("../../assets/ilustracoes/cena_despesas.png"),
  // --- prompt 2: visuais ---
  // papel_parede: require("../../assets/ilustracoes/papel_parede.png"),
  // meu_seguro_casa: require("../../assets/ilustracoes/meu_seguro_casa.png"),
  // sucesso_casa: require("../../assets/ilustracoes/sucesso_casa.png"),
  // plano_essencial: require("../../assets/ilustracoes/plano_essencial.png"),
  // plano_pratico: require("../../assets/ilustracoes/plano_pratico.png"),
  // plano_total: require("../../assets/ilustracoes/plano_total.png"),
};

/** Nome da imagem da situação do Passo 2 (vizinho e vento mudam entre apê e casa). */
export const imagemDaCena = (id: string, predio: boolean): NomeImagem =>
  (id === "vizinho" || id === "vento" ? `cena_${id}_${predio ? "apto" : "casa"}` : `cena_${id}`) as NomeImagem;

// ---------- ícones ilustrados (prompt 2, folhas I1 a I5) ----------
export type NomeIcone =
  | "incendio" | "eletricos" | "agua" | "vendaval" | "impacto" | "roubo"
  | "vidros" | "terceiros" | "casa" | "emergencia" | "chuva" | "temporada"
  | "reparos" | "eletrodomesticos" | "limpeza" | "moveis" | "pragas" | "seguranca"
  | "assistencia" | "cobertura" | "duvida" | "chaveiro" | "debito" | "cartao"
  | "pix" | "chat" | "ligacao" | "video";

export const ICONES: Partial<Record<NomeIcone, number>> = {
  incendio: require("../../assets/icones/ic_incendio.png"),
  eletricos: require("../../assets/icones/ic_eletricos.png"),
  agua: require("../../assets/icones/ic_agua.png"),
  vendaval: require("../../assets/icones/ic_vendaval.png"),
  impacto: require("../../assets/icones/ic_impacto.png"),
  roubo: require("../../assets/icones/ic_roubo.png"),
  vidros: require("../../assets/icones/ic_vidros.png"),
  terceiros: require("../../assets/icones/ic_terceiros.png"),
  casa: require("../../assets/icones/ic_casa.png"),
  emergencia: require("../../assets/icones/ic_emergencia.png"),
  chuva: require("../../assets/icones/ic_chuva.png"),
  temporada: require("../../assets/icones/ic_temporada.png"),
  reparos: require("../../assets/icones/ic_reparos.png"),
  eletrodomesticos: require("../../assets/icones/ic_eletrodomesticos.png"),
  limpeza: require("../../assets/icones/ic_limpeza.png"),
  moveis: require("../../assets/icones/ic_moveis.png"),
  pragas: require("../../assets/icones/ic_pragas.png"),
  seguranca: require("../../assets/icones/ic_seguranca.png"),
  assistencia: require("../../assets/icones/ic_assistencia.png"),
  cobertura: require("../../assets/icones/ic_cobertura.png"),
  duvida: require("../../assets/icones/ic_duvida.png"),
  chaveiro: require("../../assets/icones/ic_chaveiro.png"),
  debito: require("../../assets/icones/ic_debito.png"),
  cartao: require("../../assets/icones/ic_cartao.png"),
  pix: require("../../assets/icones/ic_pix.png"),
  chat: require("../../assets/icones/ic_chat.png"),
  ligacao: require("../../assets/icones/ic_ligacao.png"),
  video: require("../../assets/icones/ic_video.png"),
};

/** Nome usado nas telas (`<Icone n="fogo" />`) → ícone ilustrado. Sem par aqui, fica o vetorial. */
export const ICONE_DE: Record<string, NomeIcone> = {
  fogo: "incendio", raio: "eletricos", agua: "agua", vento: "vendaval", carro: "impacto", ladrao: "roubo",
  vidro: "vidros", vizinho: "terceiros", casa: "casa", sirene: "emergencia", chuva: "chuva", praia: "temporada",
  ferramentas: "reparos", maquina: "eletrodomesticos", tool: "reparos", vassoura: "limpeza", sofa: "moveis", inseto: "pragas",
  escudo: "seguranca", shield: "cobertura", "message-circle": "chat", duvida: "duvida", chave: "chaveiro", key: "chaveiro",
  "dollar-sign": "debito", "credit-card": "cartao", zap: "pix", phone: "ligacao", video: "video",
};
