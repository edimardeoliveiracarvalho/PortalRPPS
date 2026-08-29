export interface SeguradoAtivo {
  competencia: string;
  quantidadeAtivos: number;
  quantidadeInativos: number;
}

export interface RetornoMetaAtuarial {
  competencia: string;
  metaAtuarialFormula: string;
  retornoValor: number;
  retornoPercentual: number;
  metaAtuarialPercentual: number;
  retornoAcumulado: number;
  metaAcumulada: number;
  atingiuMeta: boolean;
}

export interface MovimentacaoFinanceira {
  tipo: "receita" | "despesa" | "transferenciaRecebida";
  fundo: "reparticao" | "capitalizacao" | "orgaoGerenciador";
  competencia: string;
  categoria: string;
  valor: number;
}

export interface HistoricoInvestimento {
  competencia: string;
  saldoInicial: number;
  aplicacoes: number;
  resgates: number;
  rendimentos: number;
  rentabilidadeMes: number;
  rentabilidadePercentual?: number;
  saldoFinal: number;
  participacaoCarteira: number;
  participacaoCarteiraConsolidada?: number;
}

export interface Investimento {
  id: number;
  nome: string;
  cnpj: string;
  status: string;
  fundo?: "capitalizacao" | "reparticao" | "orgaoGerenciador" | string;
  gestor: string;
  cnpjGestor: string;
  administrador: string;
  cnpjAdministrador: string;
  enquadramento: string;
  ativoEstressado: boolean;
  segmento: "fundosImobiliarios" | "rendaFixa" | "estruturados" | "rendaVariavel" | "exterior" | "variavel" | "exterior" | "emprestimoConsignado" | "exterior" | "fundosImobiliarios" | "rendaFixa" | "estruturados" | "rendaVariavel" | "exterior" | string;
  tipoAtivo: string;
  benchmark: string;
  historico: HistoricoInvestimento[];
}

export interface EvolucaoCarteira {
  competencia: string;
  valorCarteiraConsolidada: number;
}

export interface FundoRiscoConsignado {
  saldoInicial: number;
  entradas: number;
  saidas: number;
  saldoFinal: number;
}

export interface EmprestimoConsignado {
  competencia: string;
  quantidadeContratos: number;
  prazoMedio: number;
  saldoInicial: number;
  valorEmprestado: number;
  valorAmortizado: number;
  saldoCarteira: number;
  concessoesMes?: number;
  amortizacoesMes?: number;
  jurosMes?: number;
  inadimplencia?: number;
  contratosAtivos?: number;
  retornoFinanceiro?: number;
  retornoPercentual?: number;
  contratosNovos?: number;
  contratosQuitados?: number;
  prazosContratados?: number[];
  fundoRisco?: FundoRiscoConsignado;
}

export interface CRP {
  tipo: string;
  numero: string;
  status: string;
  emissao: string;
  validade: string;
  situacao: string;
}

export interface Beneficio {
  competencia: string;
  fundo: "reparticao" | "capitalizacao" | "consolidado";
  aposentados: number;
  valorAposentados: number;
  pensionistas: number;
  valorPensionistas: number;
  totalBeneficiarios: number;
  valorTotal: number;
  novosAposentados: number;
  novosPensionistas: number;
}

export interface AgendaReuniao {
  colegiado: "comiteInvestimentos" | "conselhoFiscal" | "conselhoDeliberativo" | "conselhoPrevidenciaComplementar";
  local: string;
  data: string;
  competencia: string;
  horario: string;
}

export const ultimaAtualizacao: { data: string; hora: string; textoExtenso: string } =
  typeof __APP_BUILD_INFO__ !== "undefined"
    ? __APP_BUILD_INFO__
    : {
        data: "28/08/2026",
        hora: "16:34",
        textoExtenso: "28 de Agosto de 2026"
      };


export const seguradosAtivos: SeguradoAtivo[] = [
  {"competencia":"2022-01","quantidadeAtivos":11329,"quantidadeInativos":3845},
  {"competencia":"2022-02","quantidadeAtivos":11296,"quantidadeInativos":3885},
  {"competencia":"2022-03","quantidadeAtivos":11220,"quantidadeInativos":3893},
  {"competencia":"2022-04","quantidadeAtivos":11214,"quantidadeInativos":3908},
  {"competencia":"2022-05","quantidadeAtivos":11191,"quantidadeInativos":3917},
  {"competencia":"2022-06","quantidadeAtivos":11234,"quantidadeInativos":3923},
  {"competencia":"2022-07","quantidadeAtivos":11429,"quantidadeInativos":3946},
  {"competencia":"2022-08","quantidadeAtivos":11549,"quantidadeInativos":3974},
  {"competencia":"2022-09","quantidadeAtivos":11577,"quantidadeInativos":3991},
  {"competencia":"2022-10","quantidadeAtivos":11553,"quantidadeInativos":4014},
  {"competencia":"2022-11","quantidadeAtivos":11500,"quantidadeInativos":4026},
  {"competencia":"2022-12","quantidadeAtivos":11461,"quantidadeInativos":4061},
  {"competencia":"2023-01","quantidadeAtivos":11437,"quantidadeInativos":4098},
  {"competencia":"2023-02","quantidadeAtivos":11436,"quantidadeInativos":4124},
  {"competencia":"2023-03","quantidadeAtivos":11366,"quantidadeInativos":4143},
  {"competencia":"2023-04","quantidadeAtivos":11321,"quantidadeInativos":4174},
  {"competencia":"2023-05","quantidadeAtivos":11263,"quantidadeInativos":4199},
  {"competencia":"2023-06","quantidadeAtivos":11314,"quantidadeInativos":4226},
  {"competencia":"2023-07","quantidadeAtivos":11351,"quantidadeInativos":4253},
  {"competencia":"2023-08","quantidadeAtivos":11345,"quantidadeInativos":4276},
  {"competencia":"2023-09","quantidadeAtivos":11326,"quantidadeInativos":4294},
  {"competencia":"2023-10","quantidadeAtivos":11362,"quantidadeInativos":4306},
  {"competencia":"2023-11","quantidadeAtivos":11401,"quantidadeInativos":4339},
  {"competencia":"2023-12","quantidadeAtivos":11454,"quantidadeInativos":4386},
  {"competencia":"2024-01","quantidadeAtivos":11500,"quantidadeInativos":4407},
  {"competencia":"2024-02","quantidadeAtivos":11518,"quantidadeInativos":4441},
  {"competencia":"2024-03","quantidadeAtivos":11541,"quantidadeInativos":4465},
  {"competencia":"2024-04","quantidadeAtivos":11501,"quantidadeInativos":4483},
  {"competencia":"2024-05","quantidadeAtivos":11585,"quantidadeInativos":4496},
  {"competencia":"2024-06","quantidadeAtivos":11608,"quantidadeInativos":4508},
  {"competencia":"2024-07","quantidadeAtivos":11592,"quantidadeInativos":4526},
  {"competencia":"2024-08","quantidadeAtivos":11578,"quantidadeInativos":4558},
  {"competencia":"2024-09","quantidadeAtivos":11561,"quantidadeInativos":4578},
  {"competencia":"2024-10","quantidadeAtivos":11586,"quantidadeInativos":4605},
  {"competencia":"2024-11","quantidadeAtivos":11611,"quantidadeInativos":4625},
  {"competencia":"2024-12","quantidadeAtivos":11629,"quantidadeInativos":4658},
  {"competencia":"2025-01","quantidadeAtivos":11633,"quantidadeInativos":4676},
  {"competencia":"2025-02","quantidadeAtivos":11632,"quantidadeInativos":4710},
  {"competencia":"2025-03","quantidadeAtivos":11594,"quantidadeInativos":4722},
  {"competencia":"2025-04","quantidadeAtivos":11479,"quantidadeInativos":4750},
  {"competencia":"2025-05","quantidadeAtivos":11450,"quantidadeInativos":4779},
  {"competencia":"2025-06","quantidadeAtivos":11469,"quantidadeInativos":4792},
  {"competencia":"2025-07","quantidadeAtivos":11446,"quantidadeInativos":4815},
  {"competencia":"2025-08","quantidadeAtivos":11520,"quantidadeInativos":4841},
  {"competencia":"2025-09","quantidadeAtivos":11497,"quantidadeInativos":4858},
  {"competencia":"2025-10","quantidadeAtivos":11457,"quantidadeInativos":4877},
  {"competencia":"2025-11","quantidadeAtivos":11406,"quantidadeInativos":4915},
  {"competencia":"2025-12","quantidadeAtivos":11397,"quantidadeInativos":4966},
  {"competencia":"2026-01","quantidadeAtivos":11310,"quantidadeInativos":4985},
  {"competencia":"2026-02","quantidadeAtivos":11309,"quantidadeInativos":5025},
  {"competencia":"2026-03","quantidadeAtivos":11359,"quantidadeInativos":5046},
  {"competencia":"2026-04","quantidadeAtivos":11330,"quantidadeInativos":5064},
  {"competencia":"2026-05","quantidadeAtivos":11292,"quantidadeInativos":5088},
  {"competencia":"2026-06","quantidadeAtivos":11265,"quantidadeInativos":5099},
  {"competencia":"2026-07","quantidadeAtivos":11263,"quantidadeInativos":5120}
];

export const retornoMetaAtuarial: RetornoMetaAtuarial[] = [
  {"competencia":"2025-01","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":10324486.86,"retornoPercentual":0.0094,"metaAtuarialPercentual":0.0059,"retornoAcumulado":0.0094,"metaAcumulada":0.0059,"atingiuMeta":true},
  {"competencia":"2025-02","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":8402893.50,"retornoPercentual":0.0084,"metaAtuarialPercentual":0.0174,"retornoAcumulado":0.0178,"metaAcumulada":0.0235,"atingiuMeta":false},
  {"competencia":"2025-03","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":10767597.19,"retornoPercentual":0.0090,"metaAtuarialPercentual":0.0099,"retornoAcumulado":0.0269,"metaAcumulada":0.0337,"atingiuMeta":false},
  {"competencia":"2025-04","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":11347278.61,"retornoPercentual":0.0103,"metaAtuarialPercentual":0.0086,"retornoAcumulado":0.0375,"metaAcumulada":0.0427,"atingiuMeta":true},
  {"competencia":"2025-05","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":14197600.83,"retornoPercentual":0.0129,"metaAtuarialPercentual":0.0069,"retornoAcumulado":0.0509,"metaAcumulada":0.0499,"atingiuMeta":true},
  {"competencia":"2025-06","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":10209734.12,"retornoPercentual":0.0084,"metaAtuarialPercentual":0.0067,"retornoAcumulado":0.0597,"metaAcumulada":0.0570,"atingiuMeta":true},
  {"competencia":"2025-07","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":9906466.85,"retornoPercentual":0.0083,"metaAtuarialPercentual":0.0069,"retornoAcumulado":0.0685,"metaAcumulada":0.0643,"atingiuMeta":true},
  {"competencia":"2025-08","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":8876103.56,"retornoPercentual":0.0082,"metaAtuarialPercentual":0.0032,"retornoAcumulado":0.0773,"metaAcumulada":0.0677,"atingiuMeta":true},
  {"competencia":"2025-09","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":11995533.87,"retornoPercentual":0.0092,"metaAtuarialPercentual":0.0091,"retornoAcumulado":0.0871,"metaAcumulada":0.0775,"atingiuMeta":true},
  {"competencia":"2025-10","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":13002893.68,"retornoPercentual":0.0105,"metaAtuarialPercentual":0.0052,"retornoAcumulado":0.0986,"metaAcumulada":0.0831,"atingiuMeta":true},
  {"competencia":"2025-11","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":8008403.23,"retornoPercentual":0.0085,"metaAtuarialPercentual":0.0061,"retornoAcumulado":0.1080,"metaAcumulada":0.0898,"atingiuMeta":true},
  {"competencia":"2025-12","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":11639133.68,"retornoPercentual":0.0092,"metaAtuarialPercentual":0.0076,"retornoAcumulado":0.1182,"metaAcumulada":0.0981,"atingiuMeta":true},
  {"competencia":"2026-01","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":13125943.54,"retornoPercentual":0.0107,"metaAtuarialPercentual":0.0081,"retornoAcumulado":0.0107,"metaAcumulada":0.0081,"atingiuMeta":true},
  {"competencia":"2026-02","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":9918060.33,"retornoPercentual":0.0093,"metaAtuarialPercentual":0.0118,"retornoAcumulado":0.0200,"metaAcumulada":0.0201,"atingiuMeta":false},
  {"competencia":"2026-03","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":13456653.28,"retornoPercentual":0.0099,"metaAtuarialPercentual":0.0136,"retornoAcumulado":0.0301,"metaAcumulada":0.0340,"atingiuMeta":false},
  {"competencia":"2026-04","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":21833448.34,"retornoPercentual":0.0176,"metaAtuarialPercentual":0.0115,"retornoAcumulado":0.0483,"metaAcumulada":0.0459,"atingiuMeta":true},
  {"competencia":"2026-05","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":14192289.28,"retornoPercentual":0.0122,"metaAtuarialPercentual":0.0106,"retornoAcumulado":0.0611,"metaAcumulada":0.0570,"atingiuMeta":true},
  {"competencia":"2026-06","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":13858350.44,"retornoPercentual":0.0105,"metaAtuarialPercentual":0.0064,"retornoAcumulado":0.0722,"metaAcumulada":0.0638,"atingiuMeta":true},
  {"competencia":"2026-07","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":9227308.35,"retornoPercentual":0.0079,"metaAtuarialPercentual":0.0055,"retornoAcumulado":0.0806,"metaAcumulada":0.0697,"atingiuMeta":true}
];

export const movimentacoesFinanceiras: MovimentacaoFinanceira[] = [
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-01","categoria":"Contribuição Patronal","valor":3932304.8600000003},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-01","categoria":"Contribuição do Servidor","valor":3933299.58},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-01","categoria":"Contribuição de Inativos e Pensionistas","valor":274903.13},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-01","categoria":"Rendimento de Aplicação","valor":42359.53},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-01","categoria":"Compensação Previdenciária","valor":3678629.72},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-01","categoria":"Outras Receitas","valor":0.0},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Contribuição Patronal","valor":2447049.91},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Contribuição do Servidor","valor":2448122.48},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Contribuição de Inativos e Pensionistas","valor":132313.15},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Rendimento de Aplicação","valor":9806978.73},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Juros de Empréstimos Consignados","valor":40969.27},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Compensação Previdenciária","valor":33903.35},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Parcelamentos","valor":23719.12},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-01","categoria":"Outras Receitas","valor":3944.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Taxa de Administração","valor":765449.28},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Rendimento de Aplicação","valor":198292.55},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Outras Receitas","valor":22.65},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-01","categoria":"Aposentadorias","valor":14276644.76},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-01","categoria":"Pensões","valor":2103967.48},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-01","categoria":"Compensação Previdenciária","valor":0.0},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-01","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-01","categoria":"Aposentadorias","valor":6594786.0},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-01","categoria":"Pensões","valor":1039505.95},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-01","categoria":"Compensação Previdenciária","valor":0.0},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-01","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Folha de Pagamento","valor":219731.35},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"SAMA","valor":694259.26},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"PASEP","valor":17363.33},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Pessoa Física","valor":32096.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Pessoa Jurídica","valor":274351.07},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Previdência Complementar","valor":7552.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Bens Permanentes","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Outras Despesas","valor":16124.48},
  {"tipo":"transferenciaRecebida","fundo":"reparticao","competencia":"2026-01","categoria":"Aporte por Insuficiência Financeira","valor":9000000.0},
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-01","categoria":"Interferência Financeira","valor":1500000.0},

  {"tipo":"receita","fundo":"reparticao","competencia":"2026-02","categoria":"Contribuição Patronal","valor":3985068.61},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-02","categoria":"Contribuição do Servidor","valor":3983027.51},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-02","categoria":"Contribuição de Inativos e Pensionistas","valor":275662.27},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-02","categoria":"Rendimento de Aplicação","valor":74506.48},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-02","categoria":"Compensação Previdenciária","valor":2004984.5},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-02","categoria":"Outras Receitas","valor":0.0},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Contribuição Patronal","valor":2435152.94},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Contribuição do Servidor","valor":2433378.36},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Contribuição de Inativos e Pensionistas","valor":132251.21000000002},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Rendimento de Aplicação","valor":9094796.83},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Juros de Empréstimos Consignados","valor":30202.46},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Compensação Previdenciária","valor":37254.41},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Parcelamentos","valor":23871.68},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-02","categoria":"Outras Receitas","valor":3944.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Taxa de Administração","valor":770606.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Rendimento de Aplicação","valor":179619.87},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Outras Receitas","valor":14270.54},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-02","categoria":"Aposentadorias","valor":14388257.49},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-02","categoria":"Pensões","valor":2105381.89},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-02","categoria":"Compensação Previdenciária","valor":76302.59},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-02","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-02","categoria":"Aposentadorias","valor":6603888.96},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-02","categoria":"Pensões","valor":1031996.98},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-02","categoria":"Compensação Previdenciária","valor":4318.26},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-02","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Folha de Pagamento","valor":216886.73},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"SAMA","valor":695182.75},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"PASEP","valor":9637.64},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Pessoa Física","valor":32096.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Pessoa Jurídica","valor":236304.95},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Previdência Complementar","valor":7552.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Bens Permanentes","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Outras Despesas","valor":20793.0},
  {"tipo":"transferenciaRecebida","fundo":"reparticao","competencia":"2026-02","categoria":"Aporte por Insuficiência Financeira","valor":9000000.0},
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-02","categoria":"Interferência Financeira","valor":750000.0},

  {"tipo":"receita","fundo":"reparticao","competencia":"2026-03","categoria":"Contribuição Patronal","valor":4097224.33},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-03","categoria":"Contribuição do Servidor","valor":4094052.98},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-03","categoria":"Contribuição de Inativos e Pensionistas","valor":316432.38999999996},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-03","categoria":"Rendimento de Aplicação","valor":98006.42},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-03","categoria":"Compensação Previdenciária","valor":3855518.31},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-03","categoria":"Outras Receitas","valor":0.0},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Contribuição Patronal","valor":2578069.5300000003},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Contribuição do Servidor","valor":2553339.74},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Contribuição de Inativos e Pensionistas","valor":152607.14},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Rendimento de Aplicação","valor":15589933.299999999},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Juros de Empréstimos Consignados","valor":65222.64},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Compensação Previdenciária","valor":21980.38},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Parcelamentos","valor":23996.98},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-03","categoria":"Outras Receitas","valor":3944.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Taxa de Administração","valor":799651.74},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Rendimento de Aplicação","valor":207327.77},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Outras Receitas","valor":30389.76},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-03","categoria":"Aposentadorias","valor":15113732.8},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-03","categoria":"Pensões","valor":2264353.07},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-03","categoria":"Compensação Previdenciária","valor":104395.04},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-03","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-03","categoria":"Aposentadorias","valor":6885471.26},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-03","categoria":"Pensões","valor":1146187.71},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-03","categoria":"Compensação Previdenciária","valor":283.79},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-03","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Folha de Pagamento","valor":212766.42},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"SAMA","valor":697345.29},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"PASEP","valor":9644.97},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Pessoa Física","valor":33540.32},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Pessoa Jurídica","valor":138806.44},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Previdência Complementar","valor":7891.84},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Bens Permanentes","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Outras Despesas","valor":38324.85},
  {"tipo":"transferenciaRecebida","fundo":"reparticao","competencia":"2026-03","categoria":"Aporte por Insuficiência Financeira","valor":11900000.0},
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-03","categoria":"Interferência Financeira","valor":750000.0},

  {"tipo":"receita","fundo":"reparticao","competencia":"2026-04","categoria":"Contribuição Patronal","valor":4163794.3699999996},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-04","categoria":"Contribuição do Servidor","valor":4153661.25},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-04","categoria":"Contribuição de Inativos e Pensionistas","valor":317902.38},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-04","categoria":"Rendimento de Aplicação","valor":174517.49},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-04","categoria":"Compensação Previdenciária","valor":1116408.96},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-04","categoria":"Outras Receitas","valor":0.0},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Contribuição Patronal","valor":2601825.74},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Contribuição do Servidor","valor":2605465.89},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Contribuição de Inativos e Pensionistas","valor":148849.06},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Rendimento de Aplicação","valor":16092586.549999999},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Juros de Empréstimos Consignados","valor":85947.18},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Compensação Previdenciária","valor":41694.58},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Parcelamentos","valor":24133.44},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-04","categoria":"Outras Receitas","valor":3944.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Taxa de Administração","valor":811874.61},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Rendimento de Aplicação","valor":203528.16},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Outras Receitas","valor":11066.89},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-04","categoria":"Aposentadorias","valor":15176059.45},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-04","categoria":"Pensões","valor":2231979.18},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-04","categoria":"Compensação Previdenciária","valor":131654.56},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-04","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-04","categoria":"Aposentadorias","valor":6890604.42},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-04","categoria":"Pensões","valor":1109636.16},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-04","categoria":"Compensação Previdenciária","valor":283.79},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-04","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Folha de Pagamento","valor":230141.6},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"SAMA","valor":697551.27},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"PASEP","valor":10373.69},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Pessoa Física","valor":33540.32},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Pessoa Jurídica","valor":98134.85},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Previdência Complementar","valor":7891.84},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Bens Permanentes","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Outras Despesas","valor":15174.51},
  {"tipo":"transferenciaRecebida","fundo":"reparticao","competencia":"2026-04","categoria":"Aporte por Insuficiência Financeira","valor":6100000.0},
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-04","categoria":"Interferência Financeira","valor":700000.0},

  {"tipo":"receita","fundo":"reparticao","competencia":"2026-05","categoria":"Contribuição Patronal","valor":4072195.07},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-05","categoria":"Contribuição do Servidor","valor":4083320.14},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-05","categoria":"Contribuição de Inativos e Pensionistas","valor":320458.28},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-05","categoria":"Rendimento de Aplicação","valor":168148.38999999998},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-05","categoria":"Compensação Previdenciária","valor":2148149.25},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-05","categoria":"Outras Receitas","valor":0.0},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Contribuição Patronal","valor":2484623.7199999997},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Contribuição do Servidor","valor":2484643.49},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Contribuição de Inativos e Pensionistas","valor":148849.06},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Rendimento de Aplicação","valor":13072531.94},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Juros de Empréstimos Consignados","valor":97789.19},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Compensação Previdenciária","valor":17985.67},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Parcelamentos","valor":24352.42},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-05","categoria":"Outras Receitas","valor":3944.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Taxa de Administração","valor":786786.1399999999},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Rendimento de Aplicação","valor":209284.12},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Outras Receitas","valor":29146.01},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-05","categoria":"Aposentadorias","valor":15247965.72},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-05","categoria":"Pensões","valor":2248173.46},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-05","categoria":"Compensação Previdenciária","valor":147287.18},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-05","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-05","categoria":"Aposentadorias","valor":6914142.08},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-05","categoria":"Pensões","valor":1124353.83},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-05","categoria":"Compensação Previdenciária","valor":283.79},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-05","categoria":"Outras Despesas","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Folha de Pagamento","valor":205150.78},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"SAMA","valor":698993.13},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"PASEP","valor":10264.69},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Pessoa Física","valor":33540.15},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Pessoa Jurídica","valor":117501.32},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Previdência Complementar","valor":7891.8},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Bens Permanentes","valor":0.0},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Outras Despesas","valor":29172.45},
  {"tipo":"transferenciaRecebida","fundo":"reparticao","competencia":"2026-05","categoria":"Aporte por Insuficiência Financeira","valor":9000000.0},
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-05","categoria":"Interferência Financeira","valor":700000.0},

  {"tipo":"receita","fundo":"reparticao","competencia":"2026-06","categoria":"Contribuição Patronal","valor":4147683.87},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-06","categoria":"Contribuição do Servidor","valor":4148301.55},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-06","categoria":"Contribuição de Inativos e Pensionistas","valor":322148.40},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-06","categoria":"Rendimento de Aplicação","valor":182754.90},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-06","categoria":"Compensação Previdenciária","valor":4553317.59},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-06","categoria":"Outras Receitas","valor":0.00},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Contribuição Patronal","valor":2683565.66},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Contribuição do Servidor","valor":2682067.04},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Contribuição de Inativos e Pensionistas","valor":148072.04},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Rendimento de Aplicação","valor":12573562.18},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Juros de Empréstimos Consignados","valor":110594.79},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Compensação Previdenciária","valor":20273.80},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Parcelamentos","valor":24527.21},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-06","categoria":"Outras Receitas","valor":3944.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Taxa de Administração","valor":821655.90},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Rendimento de Aplicação","valor":224033.86},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Outras Receitas","valor":33494.65},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-06","categoria":"Aposentadorias","valor":21353042.76},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-06","categoria":"Pensões","valor":3152457.82},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-06","categoria":"Compensação Previdenciária","valor":262096.87},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-06","categoria":"Outras Despesas","valor":0.00},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-06","categoria":"Aposentadorias","valor":9667004.20},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-06","categoria":"Pensões","valor":1513194.82},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-06","categoria":"Compensação Previdenciária","valor":283.79},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-06","categoria":"Outras Despesas","valor":0.00},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Folha de Pagamento","valor":323915.98},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"SAMA","valor":699817.05},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"PASEP","valor":10252.16},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Pessoa Física","valor":50310.31},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Pessoa Jurídica","valor":115672.06},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Previdência Complementar","valor":11837.72},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Bens Permanentes","valor":1300.00},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Outras Despesas","valor":28282.76},
  {"tipo":"transferenciaRecebida","fundo":"reparticao","competencia":"2026-06","categoria":"Aporte por Insuficiência Financeira","valor":9000000.00},
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Interferência Financeira","valor":700000.00},

  {"tipo":"receita","fundo":"reparticao","competencia":"2026-07","categoria":"Contribuição Patronal","valor":4186382.90},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-07","categoria":"Contribuição do Servidor","valor":4198708.76},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-07","categoria":"Contribuição de Inativos e Pensionistas","valor":324544.55},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-07","categoria":"Rendimento de Aplicação","valor":182510.24},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-07","categoria":"Compensação Previdenciária","valor":1761719.84},
  {"tipo":"receita","fundo":"reparticao","competencia":"2026-07","categoria":"Outras Receitas","valor":0.00},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Contribuição Patronal","valor":2692588.03},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Contribuição do Servidor","valor":2698780.70},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Contribuição de Inativos e Pensionistas","valor":146681.15},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Rendimento de Aplicação","valor":7904222.57},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Juros de Empréstimos Consignados","valor":132463.08},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Compensação Previdenciária","valor":24715.08},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Parcelamentos","valor":32760.28},
  {"tipo":"receita","fundo":"capitalizacao","competencia":"2026-07","categoria":"Outras Receitas","valor":3944.85},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Taxa de Administração","valor":844583.24},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Rendimento de Aplicação","valor":250441.03},
  {"tipo":"receita","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Outras Receitas","valor":38515.27},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-07","categoria":"Aposentadorias","valor":15382252.73},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-07","categoria":"Pensões","valor":2264090.54},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-07","categoria":"Compensação Previdenciária","valor":190358.86},
  {"tipo":"despesa","fundo":"reparticao","competencia":"2026-07","categoria":"Outras Despesas","valor":0.00},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-07","categoria":"Aposentadorias","valor":6925871.02},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-07","categoria":"Pensões","valor":1083731.41},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-07","categoria":"Compensação Previdenciária","valor":283.79},
  {"tipo":"despesa","fundo":"capitalizacao","competencia":"2026-07","categoria":"Outras Despesas","valor":0.00},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Folha de Pagamento","valor":238889.40},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"SAMA","valor":700434.99},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"PASEP","valor":10791.84},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Pessoa Física","valor":50310.31},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Pessoa Jurídica","valor":137766.67},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Previdência Complementar","valor":11837.72},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Bens Permanentes","valor":0.00},
  {"tipo":"despesa","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Outras Despesas","valor":39910.26},
  {"tipo":"transferenciaRecebida","fundo":"reparticao","competencia":"2026-07","categoria":"Aporte por Insuficiência Financeira","valor":9000000.00},
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-07","categoria":"Interferência Financeira","valor":1550000.00}
];

export const crp: CRP[] = [
  {"tipo":"CRP","numero":"987691-236629","status":"ativa","emissao":"2024-09-16","validade":"2025-03-15","situacao":"vencida"},
  {"tipo":"CRP","numero":"987691-241916","status":"ativa","emissao":"2025-03-15","validade":"2025-09-11","situacao":"vencida"},
  {"tipo":"CRP","numero":"987691-247191","status":"ativa","emissao":"2025-09-11","validade":"2026-03-10","situacao":"vencida"},
  {"tipo":"CRP","numero":"987691-252301","status":"ativa","emissao":"2026-03-11","validade":"2026-09-07","situacao":"vigente"}
];

export const emprestimosConsignados: EmprestimoConsignado[] = [
  {
    "competencia": "2025-09",
    "quantidadeContratos": 9,
    "prazoMedio": 44,
    "saldoInicial": 0.0,
    "valorEmprestado": 134052.23,
    "valorAmortizado": 0.0,
    "saldoCarteira": 134052.23,
    "concessoesMes": 134052.23,
    "amortizacoesMes": 0.0,
    "jurosMes": 36.93,
    "inadimplencia": 0,
    "contratosAtivos": 9,
    "retornoFinanceiro": 36.93,
    "retornoPercentual": 0.06,
    "contratosNovos": 9,
    "contratosQuitados": 0,
    "prazosContratados": [45, 24, 48, 11, 24, 50, 40, 96, 60],
    "fundoRisco": {
      "saldoInicial": 0.0,
      "entradas": 0.0,
      "saidas": 0.0,
      "saldoFinal": 0.0
    }
  },
  {
    "competencia": "2025-10",
    "quantidadeContratos": 90,
    "prazoMedio": 63,
    "saldoInicial": 134052.23,
    "valorEmprestado": 1912609.99,
    "valorAmortizado": 4769.91,
    "saldoCarteira": 2041892.31,
    "concessoesMes": 1912609.99,
    "amortizacoesMes": 4769.91,
    "jurosMes": 4506.32,
    "inadimplencia": 0,
    "contratosAtivos": 99,
    "retornoFinanceiro": 4506.32,
    "retornoPercentual": 3.36,
    "contratosNovos": 90,
    "contratosQuitados": 0,
    "prazosContratados": [96, 28, 25, 40, 48, 18, 96, 96, 49, 72, 96, 96, 96, 96, 96, 96, 20, 42, 96, 96, 45, 24, 96, 30, 38, 40, 96, 40, 10, 40, 40, 48, 96, 36, 96, 67, 36, 96, 36, 96, 96, 60, 29, 96, 96, 42, 96, 96, 48, 30, 60, 72, 41, 31, 96, 42, 40, 36, 96, 42, 29, 96, 96, 96, 48, 96, 53, 24, 96, 96, 96, 42, 96, 36, 96, 96, 96, 23, 71, 96, 60, 42, 12, 36, 36, 24, 12, 96, 96, 35],
    "fundoRisco": {
      "saldoInicial": 0.0,
      "entradas": 345.48,
      "saidas": 0.0,
      "saldoFinal": 345.48
    }
  },
  {
    "competencia": "2025-11",
    "quantidadeContratos": 58,
    "prazoMedio": 62,
    "saldoInicial": 2041892.31,
    "valorEmprestado": 1038008.48,
    "valorAmortizado": 26508.72,
    "saldoCarteira": 3053392.07,
    "concessoesMes": 1038008.48,
    "amortizacoesMes": 26508.72,
    "jurosMes": 21977.67,
    "inadimplencia": 0,
    "contratosAtivos": 157,
    "retornoFinanceiro": 21977.67,
    "retornoPercentual": 1.08,
    "contratosNovos": 58,
    "contratosQuitados": 0,
    "prazosContratados": [24, 96, 36, 96, 32, 12, 85, 36, 96, 96, 96, 96, 12, 96, 40, 96, 65, 42, 12, 96, 96, 12, 60, 10, 36, 96, 24, 13, 46, 96, 48, 24, 96, 96, 48, 96, 96, 84, 42, 12, 96, 18, 51, 96, 96, 96, 40, 96, 18, 24, 30, 96, 96, 39, 96, 80, 45, 96],
    "fundoRisco": {
      "saldoInicial": 345.48,
      "entradas": 252.6,
      "saidas": 0.0,
      "saldoFinal": 598.08
    }
  },
  {
    "competencia": "2025-12",
    "quantidadeContratos": 47,
    "prazoMedio": 69,
    "saldoInicial": 3053389.09,
    "valorEmprestado": 913630.79,
    "valorAmortizado": 41582.65,
    "saldoCarteira": 3925440.21,
    "concessoesMes": 913630.79,
    "amortizacoesMes": 41582.65,
    "jurosMes": 33486.65,
    "inadimplencia": 0,
    "contratosAtivos": 204,
    "retornoFinanceiro": 33486.65,
    "retornoPercentual": 1.1,
    "contratosNovos": 47,
    "contratosQuitados": 0,
    "prazosContratados": [96, 96, 96, 39, 38, 40, 40, 96, 24, 96, 96, 40, 96, 96, 96, 36, 36, 96, 44, 96, 65, 96, 96, 36, 96, 60, 96, 36, 24, 96, 12, 96, 96, 96, 96, 36, 24, 96, 96, 96, 16, 36, 96, 39, 96, 40, 96],
    "fundoRisco": {
      "saldoInicial": 598.08,
      "entradas": 6086.59,
      "saidas": 0.0,
      "saldoFinal": 6684.67
    }
  },
  {
    "competencia": "2026-01",
    "quantidadeContratos": 71,
    "prazoMedio": 60,
    "saldoInicial": 3925437.23,
    "valorEmprestado": 1489852.48,
    "valorAmortizado": 125976.48,
    "saldoCarteira": 5289316.21,
    "concessoesMes": 1489852.48,
    "amortizacoesMes": 125976.48,
    "jurosMes": 41060.77,
    "inadimplencia": 0,
    "contratosAtivos": 272,
    "retornoFinanceiro": 41060.77,
    "retornoPercentual": 1.05,
    "contratosNovos": 71,
    "contratosQuitados": 3,
    "prazosContratados": [96, 96, 96, 25, 96, 92, 36, 6, 25, 44, 30, 96, 96, 96, 40, 96, 12, 36, 96, 96, 10, 24, 96, 12, 96, 96, 60, 96, 10, 36, 96, 25, 96, 96, 96, 36, 60, 48, 12, 60, 10, 55, 60, 96, 34, 96, 96, 96, 96, 96, 24, 12, 36, 60, 96, 25, 48, 12, 96, 25, 15, 79, 36, 36, 96, 96, 36, 48, 12, 96, 96],
    "fundoRisco": {
      "saldoInicial": 6684.67,
      "entradas": 85.58,
      "saidas": 0.0,
      "saldoFinal": 6770.25
    }
  },
  {
    "competencia": "2026-02",
    "quantidadeContratos": 51,
    "prazoMedio": 62,
    "saldoInicial": 5289313.21,
    "valorEmprestado": 796177.22,
    "valorAmortizado": 160593.61,
    "saldoCarteira": 5924899.82,
    "concessoesMes": 796177.22,
    "amortizacoesMes": 160593.61,
    "jurosMes": 55133.7,
    "inadimplencia": 0,
    "contratosAtivos": 320,
    "retornoFinanceiro": 55133.7,
    "retornoPercentual": 1.04,
    "contratosNovos": 51,
    "contratosQuitados": 3,
    "prazosContratados": [12, 12, 17, 96, 96, 96, 96, 96, 48, 24, 24, 18, 96, 96, 96, 36, 46, 15, 42, 96, 68, 58, 60, 96, 96, 24, 96, 12, 96, 96, 36, 10, 36, 96, 96, 48, 96, 25, 10, 96, 24, 12, 77, 96, 96, 96, 96, 96, 55, 96, 16],
    "fundoRisco": {
      "saldoInicial": 6770.25,
      "entradas": 4734.96,
      "saidas": 0.0,
      "saldoFinal": 11505.21
    }
  },
  {
    "competencia": "2026-03",
    "quantidadeContratos": 144,
    "prazoMedio": 77,
    "saldoInicial": 5924896.82,
    "valorEmprestado": 1756907.38,
    "valorAmortizado": 83239.04,
    "saldoCarteira": 7598568.16,
    "concessoesMes": 1756907.38,
    "amortizacoesMes": 83239.04,
    "jurosMes": 71935.5,
    "inadimplencia": 0,
    "contratosAtivos": 464,
    "retornoFinanceiro": 71935.5,
    "retornoPercentual": 1.21,
    "contratosNovos": 144,
    "contratosQuitados": 0,
    "prazosContratados": [36, 96, 96, 48, 10, 48, 96, 96, 48, 96, 96, 24, 12, 36, 36, 36, 96, 48, 15, 96, 96, 96, 48, 36, 67, 24, 36, 25, 20, 48, 27, 48, 96, 36, 81, 25, 25, 79, 96, 96, 77, 77, 60, 80, 96, 84, 96, 96, 40, 96, 96, 20, 30, 96, 40, 48, 25, 36, 60, 96, 96, 96, 96, 36, 96, 96, 96, 96, 20, 25, 36, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 36, 96, 96, 96, 36, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 79, 96, 96, 96, 96, 96, 48, 96, 96, 96, 96, 96, 96, 96, 96, 96, 18, 96, 96, 96, 96, 96, 94, 96, 96, 96, 96, 96],
    "fundoRisco": {
      "saldoInicial": 11505.21,
      "entradas": 9985.88,
      "saidas": 0.0,
      "saldoFinal": 21491.09
    }
  },
  {
    "competencia": "2026-04",
    "quantidadeContratos": 140,
    "prazoMedio": 77,
    "saldoInicial": 7598565.16,
    "valorEmprestado": 1636421.49,
    "valorAmortizado": 149152.8,
    "saldoCarteira": 9085836.85,
    "concessoesMes": 1636421.49,
    "amortizacoesMes": 149152.8,
    "jurosMes": 93786.71,
    "inadimplencia": 0,
    "contratosAtivos": 603,
    "retornoFinanceiro": 93786.71,
    "retornoPercentual": 1.23,
    "contratosNovos": 140,
    "contratosQuitados": 1,
    "prazosContratados": [96, 96, 96, 29, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 42, 96, 96, 96, 96, 96, 96, 96, 36, 96, 74, 12, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 60, 96, 22, 96, 96, 96, 37, 96, 96, 15, 30, 85, 96, 96, 96, 50, 96, 25, 96, 96, 96, 48, 8, 96, 96, 24, 96, 96, 96, 96, 96, 48, 96, 41, 36, 96, 25, 52, 81, 75, 96, 96, 96, 96, 96, 96, 96, 48, 96, 15, 40, 96, 96, 39, 96, 84, 84, 24, 36, 96, 24, 48, 96, 96, 96, 48, 96, 30, 96, 48, 25, 96, 35, 50, 48, 96, 25, 24, 96, 96, 15, 48, 96, 48, 96, 96, 96, 96, 20, 96, 96, 15, 96, 96, 96, 96, 20, 96, 40, 96, 96, 96, 70],
    "fundoRisco": {
      "saldoInicial": 21491.09,
      "entradas": 3840.89,
      "saidas": 0.0,
      "saldoFinal": 25331.98
    }
  },
  {
    "competencia": "2026-05",
    "quantidadeContratos": 85,
    "prazoMedio": 73,
    "saldoInicial": 9085833.85,
    "valorEmprestado": 1298575.19,
    "valorAmortizado": 129568.29,
    "saldoCarteira": 10254843.75,
    "concessoesMes": 1298575.19,
    "amortizacoesMes": 129568.29,
    "jurosMes": 104936.97,
    "inadimplencia": 0,
    "contratosAtivos": 686,
    "retornoFinanceiro": 104936.97,
    "retornoPercentual": 1.15,
    "contratosNovos": 85,
    "contratosQuitados": 2,
    "prazosContratados": [48, 48, 72, 96, 96, 96, 60, 96, 96, 96, 18, 76, 96, 72, 96, 96, 60, 12, 96, 24, 25, 96, 32, 48, 96, 96, 96, 96, 96, 96, 96, 96, 20, 96, 96, 60, 24, 96, 10, 78, 96, 96, 25, 10, 40, 96, 96, 60, 96, 48, 96, 96, 96, 96, 42, 96, 96, 96, 35, 36, 96, 12, 70, 96, 25, 48, 96, 96, 51, 96, 96, 24, 96, 96, 96, 67, 96, 56, 36, 96, 96, 36, 96, 96, 96, 70],
    "fundoRisco": {
      "saldoInicial": 25331.98,
      "entradas": 56637.45,
      "saidas": 0.0,
      "saldoFinal": 81969.43
    }
  },
  {
    "competencia": "2026-06",
    "quantidadeContratos": 77,
    "prazoMedio": 68,
    "saldoInicial": 10254840.75,
    "valorEmprestado": 1530943.04,
    "valorAmortizado": 180090.67,
    "saldoCarteira": 11605696.12,
    "concessoesMes": 1530943.04,
    "amortizacoesMes": 180090.67,
    "jurosMes": 110492.41,
    "inadimplencia": 0,
    "contratosAtivos": 759,
    "retornoFinanceiro": 110492.41,
    "retornoPercentual": 1.08,
    "contratosNovos": 77,
    "contratosQuitados": 4,
    "prazosContratados": [96, 96, 96, 96, 96, 60, 48, 40, 96, 40, 96, 96, 96, 40, 10, 96, 20, 96, 96, 60, 60, 96, 96, 96, 18, 96, 96, 96, 96, 96, 40, 70, 36, 7, 96, 96, 96, 6, 15, 96, 81, 65, 95, 24, 96, 10, 25, 96, 96, 24, 96, 96, 95, 60, 90, 69, 18, 91, 96, 36, 96, 96, 77, 96, 36, 10, 96, 12, 71, 96, 96, 42, 59, 85, 24, 96, 96],
    "fundoRisco": {
      "saldoInicial": 81969.43,
      "entradas": 56637.45,
      "saidas": 0.0,
      "saldoFinal": 138606.9
    }
  },
  {
    "competencia": "2026-07",
    "quantidadeContratos": 103,
    "prazoMedio": 74,
    "saldoInicial": 11605696.12,
    "valorEmprestado": 2395018.71,
    "valorAmortizado": 242423.95,
    "saldoCarteira": 13758290.88,
    "concessoesMes": 2395018.71,
    "amortizacoesMes": 242423.95,
    "jurosMes": 136367.61,
    "inadimplencia": 0,
    "contratosAtivos": 857,
    "retornoFinanceiro": 136367.61,
    "retornoPercentual": 1.18,
    "contratosNovos": 103,
    "contratosQuitados": 5,
    "prazosContratados": [96, 96, 96, 96, 96, 60, 48, 40, 96, 40, 96, 96, 96, 40, 10, 96, 20, 96, 96, 60, 60, 96, 96, 96, 18, 96, 96, 96, 96, 96, 40, 70, 36, 7, 96, 96, 96, 6, 15, 96, 81, 65, 95, 24, 96, 10, 25, 96, 96, 24, 96, 96, 95, 60, 90, 69, 18, 91, 96, 36, 96, 96, 77, 96, 36, 10, 96, 12, 71, 96, 96, 42, 59, 85, 24, 96, 96],
    "fundoRisco": {
      "saldoInicial": 138606.9,
      "entradas": 94009.73,
      "saidas": 0.0,
      "saldoFinal": 232616.6
    }
  }
];

export const agendaReunioes: AgendaReuniao[] = [
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-01-13",
    "competencia": "2026-01",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-01-26",
    "competencia": "2026-01",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-02-10",
    "competencia": "2026-02",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-02-23",
    "competencia": "2026-02",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-03-12",
    "competencia": "2026-03",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-03-25",
    "competencia": "2026-03",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-04-10",
    "competencia": "2026-04",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-04-24",
    "competencia": "2026-04",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-05-12",
    "competencia": "2026-05",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-05-25",
    "competencia": "2026-05",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-06-10",
    "competencia": "2026-06",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-06-24",
    "competencia": "2026-06",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-07-10",
    "competencia": "2026-07",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-07-24",
    "competencia": "2026-07",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-08-11",
    "competencia": "2026-08",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-08-24",
    "competencia": "2026-08",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-09-11",
    "competencia": "2026-09",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-09-25",
    "competencia": "2026-09",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-10-14",
    "competencia": "2026-10",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-10-26",
    "competencia": "2026-10",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-11-12",
    "competencia": "2026-11",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-11-25",
    "competencia": "2026-11",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-12-11",
    "competencia": "2026-12",
    "horario": "14:00"
  },
  {
    "colegiado": "comiteInvestimentos",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-12-18",
    "competencia": "2026-12",
    "horario": "14:00"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-01-16",
    "competencia": "2026-01",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-01-28",
    "competencia": "2026-01",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-02-12",
    "competencia": "2026-02",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-02-26",
    "competencia": "2026-02",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-03-13",
    "competencia": "2026-03",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-03-27",
    "competencia": "2026-03",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-04-13",
    "competencia": "2026-04",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-04-27",
    "competencia": "2026-04",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-05-14",
    "competencia": "2026-05",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-05-27",
    "competencia": "2026-05",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-06-12",
    "competencia": "2026-06",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-06-26",
    "competencia": "2026-06",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-07-13",
    "competencia": "2026-07",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-07-27",
    "competencia": "2026-07",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-08-13",
    "competencia": "2026-08",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-08-27",
    "competencia": "2026-08",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-09-14",
    "competencia": "2026-09",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-09-28",
    "competencia": "2026-09",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-10-14",
    "competencia": "2026-10",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-10-28",
    "competencia": "2026-10",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-11-13",
    "competencia": "2026-11",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-11-27",
    "competencia": "2026-11",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-12-14",
    "competencia": "2026-12",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoFiscal",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-12-21",
    "competencia": "2026-12",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-01-19",
    "competencia": "2026-01",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-01-30",
    "competencia": "2026-01",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-02-13",
    "competencia": "2026-02",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-02-27",
    "competencia": "2026-02",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-03-16",
    "competencia": "2026-03",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-03-30",
    "competencia": "2026-03",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-04-15",
    "competencia": "2026-04",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-04-29",
    "competencia": "2026-04",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-05-15",
    "competencia": "2026-05",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-05-29",
    "competencia": "2026-05",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-06-15",
    "competencia": "2026-06",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-06-29",
    "competencia": "2026-06",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-07-15",
    "competencia": "2026-07",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-07-29",
    "competencia": "2026-07",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-08-14",
    "competencia": "2026-08",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-08-28",
    "competencia": "2026-08",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-09-14",
    "competencia": "2026-09",
    "horario": "16:00"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-09-30",
    "competencia": "2026-09",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-10-15",
    "competencia": "2026-10",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-10-30",
    "competencia": "2026-10",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-11-16",
    "competencia": "2026-11",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-11-30",
    "competencia": "2026-11",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-12-15",
    "competencia": "2026-12",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoDeliberativo",
    "local": "Sala de Reunião da Maringá Previdência",
    "data": "2026-12-22",
    "competencia": "2026-12",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-01-07",
    "competencia": "2026-01",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-02-04",
    "competencia": "2026-02",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-03-11",
    "competencia": "2026-03",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-04-01",
    "competencia": "2026-04",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-05-06",
    "competencia": "2026-05",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-06-11",
    "competencia": "2026-06",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-07-01",
    "competencia": "2026-07",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-08-05",
    "competencia": "2026-08",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-09-02",
    "competencia": "2026-09",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-10-07",
    "competencia": "2026-10",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-11-04",
    "competencia": "2026-11",
    "horario": "13:30"
  },
  {
    "colegiado": "conselhoPrevidenciaComplementar",
    "local": "Sala de Reunião da Secretaria da Fazenda",
    "data": "2026-12-02",
    "competencia": "2026-12",
    "horario": "13:30"
  }
];

export const evolucaoCarteiraConsolidada: EvolucaoCarteira[] = [
  {"competencia":"2022-12","valorCarteiraConsolidada":675348472.65},
  {"competencia":"2023-06","valorCarteiraConsolidada":771030701.23},
  {"competencia":"2023-12","valorCarteiraConsolidada":867375939.96},
  {"competencia":"2024-06","valorCarteiraConsolidada":972986619.51},
  {"competencia":"2024-12","valorCarteiraConsolidada":1082193450.63},
  {"competencia":"2025-01","valorCarteiraConsolidada":1102678557.27},
  {"competencia":"2025-02","valorCarteiraConsolidada":1120619297.0},
  {"competencia":"2025-03","valorCarteiraConsolidada":1140788620.63},
  {"competencia":"2025-04","valorCarteiraConsolidada":1168398688.94},
  {"competencia":"2025-05","valorCarteiraConsolidada":1191826649.46},
  {"competencia":"2025-06","valorCarteiraConsolidada":1205288083.84},
  {"competencia":"2025-07","valorCarteiraConsolidada":1232925595.0},
  {"competencia":"2025-08","valorCarteiraConsolidada":1245770877.93},
  {"competencia":"2025-09","valorCarteiraConsolidada":1274347636.12},
  {"competencia":"2025-10","valorCarteiraConsolidada":1296342863.2},
  {"competencia":"2025-11","valorCarteiraConsolidada":1313922246.14},
  {"competencia":"2025-12","valorCarteiraConsolidada":1330914240.58},
  {"competencia":"2026-01","valorCarteiraConsolidada":1347009209.85},
  {"competencia":"2026-02","valorCarteiraConsolidada":1342354182.42},
  {"competencia":"2026-03","valorCarteiraConsolidada":1368617518.94},
  {"competencia":"2026-04","valorCarteiraConsolidada":1394270157.21},
  {"competencia":"2026-05","valorCarteiraConsolidada":1408263937.19},
  {"competencia":"2026-06","valorCarteiraConsolidada":1414618405.85},
  {"competencia":"2026-07","valorCarteiraConsolidada":1424784018.63}
];
