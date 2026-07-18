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
  saldoFinal: number;
  participacaoCarteira: number;
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

export interface EmprestimoConsignado {
  competencia: string;
  quantidadeContratos: number;
  prazoMedio: number;
  saldoInicial: number;
  valorEmprestado: number;
  valorAmortizado: number;
  saldoCarteira: number;
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

export const ultimaAtualizacao = {
  data: "17/07/2026",
  hora: "23:15",
  textoExtenso: "17 de Julho de 2026"
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
  {"competencia":"2026-06","quantidadeAtivos":11265,"quantidadeInativos":5099}
];

export const retornoMetaAtuarial: RetornoMetaAtuarial[] = [
  {"competencia":"2025-01","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":10472951.96,"retornoPercentual":0.0094,"metaAtuarialPercentual":0.00594,"retornoAcumulado":0.0094,"metaAcumulada":0.0059,"atingiuMeta":true},
  {"competencia":"2025-02","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":8566941.0,"retornoPercentual":0.0084,"metaAtuarialPercentual":0.01744,"retornoAcumulado":0.0178,"metaAcumulada":0.0235,"atingiuMeta":false},
  {"competencia":"2025-03","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":10935216.33,"retornoPercentual":0.009,"metaAtuarialPercentual":0.00994,"retornoAcumulado":0.027,"metaAcumulada":0.0337,"atingiuMeta":false},
  {"competencia":"2025-04","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":11571299.94,"retornoPercentual":0.0103,"metaAtuarialPercentual":0.00864,"retornoAcumulado":0.0375,"metaAcumulada":0.0427,"atingiuMeta":true},
  {"competencia":"2025-05","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":14473868.34,"retornoPercentual":0.0129,"metaAtuarialPercentual":0.00694,"retornoAcumulado":0.0509,"metaAcumulada":0.0499,"atingiuMeta":true},
  {"competencia":"2025-06","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":10454977.15,"retornoPercentual":0.0084,"metaAtuarialPercentual":0.00674,"retornoAcumulado":0.0597,"metaAcumulada":0.057,"atingiuMeta":true},
  {"competencia":"2025-07","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":10230559.82,"retornoPercentual":0.0084,"metaAtuarialPercentual":0.00694,"retornoAcumulado":0.0687,"metaAcumulada":0.0643,"atingiuMeta":true},
  {"competencia":"2025-08","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":9195733.74,"retornoPercentual":0.0082,"metaAtuarialPercentual":0.00324,"retornoAcumulado":0.0775,"metaAcumulada":0.0677,"atingiuMeta":true},
  {"competencia":"2025-09","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":12352515.35,"retornoPercentual":0.0092,"metaAtuarialPercentual":0.00914,"retornoAcumulado":0.0874,"metaAcumulada":0.0775,"atingiuMeta":true},
  {"competencia":"2025-10","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":13375621.4,"retornoPercentual":0.0105,"metaAtuarialPercentual":0.0052,"retornoAcumulado":0.0988,"metaAcumulada":0.0831,"atingiuMeta":true},
  {"competencia":"2025-11","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":8307416.34,"retornoPercentual":0.0071,"metaAtuarialPercentual":0.0061,"retornoAcumulado":0.1066,"metaAcumulada":0.0898,"atingiuMeta":true},
  {"competencia":"2025-12","metaAtuarialFormula":"IPCA + 5.32%","retornoValor":11904429.61,"retornoPercentual":0.0085,"metaAtuarialPercentual":0.0076,"retornoAcumulado":0.1161,"metaAcumulada":0.0981,"atingiuMeta":true},
  {"competencia":"2026-01","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":13125852.02,"retornoPercentual":0.01,"metaAtuarialPercentual":0.0081,"retornoAcumulado":0.01,"metaAcumulada":0.0081,"atingiuMeta":true},
  {"competencia":"2026-02","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":9892577.75,"retornoPercentual":0.0082,"metaAtuarialPercentual":0.0118,"retornoAcumulado":0.0183,"metaAcumulada":0.0201,"atingiuMeta":false},
  {"competencia":"2026-03","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":13441057.69,"retornoPercentual":0.0095,"metaAtuarialPercentual":0.0136,"retornoAcumulado":0.0279,"metaAcumulada":0.034,"atingiuMeta":false},
  {"competencia":"2026-04","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":21825608.81,"retornoPercentual":0.0161,"metaAtuarialPercentual":0.01154,"retornoAcumulado":0.0445,"metaAcumulada":0.0459,"atingiuMeta":true},
  {"competencia":"2026-05","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":14087352.06,"retornoPercentual":0.011,"metaAtuarialPercentual":0.0106,"retornoAcumulado":0.056,"metaAcumulada":0.057,"atingiuMeta":true},
  {"competencia":"2026-06","metaAtuarialFormula":"IPCA + 5.92%","retornoValor":13858350.44,"retornoPercentual":0.0095,"metaAtuarialPercentual":0.0064,"retornoAcumulado":0.0661,"metaAcumulada":0.0638,"atingiuMeta":true}
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
  {"tipo":"transferenciaRecebida","fundo":"orgaoGerenciador","competencia":"2026-06","categoria":"Interferência Financeira","valor":700000.00}
];

export const crp: CRP[] = [
  {"tipo":"CRP","numero":"987691-236629","status":"ativa","emissao":"2024-09-16","validade":"2025-03-15","situacao":"vencida"},
  {"tipo":"CRP","numero":"987691-241916","status":"ativa","emissao":"2025-03-15","validade":"2025-09-11","situacao":"vencida"},
  {"tipo":"CRP","numero":"987691-247191","status":"ativa","emissao":"2025-09-11","validade":"2026-03-10","situacao":"vencida"},
  {"tipo":"CRP","numero":"987691-252301","status":"ativa","emissao":"2026-03-11","validade":"2026-09-07","situacao":"vigente"}
];

export const emprestimosConsignados: EmprestimoConsignado[] = [
  {"competencia":"2025-09","quantidadeContratos":9,"prazoMedio":44,"saldoInicial":0.0,"valorEmprestado":134052.23,"valorAmortizado":0.0,"saldoCarteira":134052.23},
  {"competencia":"2025-10","quantidadeContratos":90,"prazoMedio":63,"saldoInicial":134052.23,"valorEmprestado":1912609.99,"valorAmortizado":3706.79,"saldoCarteira":2042955.43},
  {"competencia":"2025-11","quantidadeContratos":58,"prazoMedio":62,"saldoInicial":2042955.43,"valorEmprestado":1038005.5,"valorAmortizado":2499.88,"saldoCarteira":3078461.05},
  {"competencia":"2025-12","quantidadeContratos":47,"prazoMedio":69,"saldoInicial":3078461.05,"valorEmprestado":913634.79,"valorAmortizado":66690.34,"saldoCarteira":3925405.5},
  {"competencia":"2026-01","quantidadeContratos":71,"prazoMedio":60,"saldoInicial":3925405.5,"valorEmprestado":1489942.54,"valorAmortizado":127845.33,"saldoCarteira":5287502.71},
  {"competencia":"2026-02","quantidadeContratos":51,"prazoMedio":62,"saldoInicial":5287502.71,"valorEmprestado":796177.22,"valorAmortizado":124548.76,"saldoCarteira":5959131.17},
  {"competencia":"2026-03","quantidadeContratos":144,"prazoMedio":77,"saldoInicial":5959131.17,"valorEmprestado":1756900.38,"valorAmortizado":80439.33,"saldoCarteira":7635592.22},
  {"competencia":"2026-04","quantidadeContratos":142,"prazoMedio":77,"saldoInicial":7635592.22,"valorEmprestado":1636428.49,"valorAmortizado":140243.17,"saldoCarteira":9131777.54},
  {"competencia":"2026-05","quantidadeContratos":85,"prazoMedio":73,"saldoInicial":9131777.54,"valorEmprestado":1298575.19,"valorAmortizado":121470.14,"saldoCarteira":10308882.59}
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
    "data": "2026-09-15",
    "competencia": "2026-09",
    "horario": "13:30"
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
  {"competencia":"2026-06","valorCarteiraConsolidada":1414618402.85}
];
