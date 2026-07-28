import React, { useState } from "react";
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Target, 
  Briefcase, 
  Scale, 
  Users, 
  ArrowRightLeft, 
  Coins, 
  Compass, 
  Building, 
  CheckCircle2, 
  AlertTriangle,
  Edit3,
  Calendar,
  Layers,
  ShieldCheck,
  TrendingUp,
  Info
} from "lucide-react";
import maringaLogo from "../assets/images/maringa_official_logo.svg";
import { 
  seguradosAtivos, 
  retornoMetaAtuarial, 
  movimentacoesFinanceiras, 
  crp, 
  emprestimosConsignados,
  evolucaoCarteiraConsolidada,
  ultimaAtualizacao
} from "../data";
import { investimentos } from "../data_investimentos";
import { beneficios } from "../data_beneficios";
import { retornoMetaAtuarialHistorico } from "../data_meta_historico";
import { formatCurrency, formatPercent, formatPercentRaw, formatNumber, getMonthName, getPrevCompetence } from "../utils";

interface ImpressaoTabProps {
  competence: string;
}

type ReportType = 
  | "receitas_despesas"
  | "consolidado" 
  | "investimentos" 
  | "meta_atuarial" 
  | "contabil" 
  | "beneficios" 
  | "comprev" 
  | "consignado";

export const ImpressaoTab: React.FC<ImpressaoTabProps> = ({ competence: initialCompetence }) => {
  const [selectedCompetence, setSelectedCompetence] = useState<string>(initialCompetence);
  const [reportType, setReportType] = useState<ReportType>("receitas_despesas");
  const [showSignatures, setShowSignatures] = useState<boolean>(true);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [economicPrint, setEconomicPrint] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Custom manager/auditor commentary
  const [customNotes, setCustomNotes] = useState<string>(
    "Relatório gerado pelo Sistema de Gestão Estratégica da Maringá Previdência. Os dados apresentados refletem a posição contábil, financeira e atuarial oficial do RPPS até o fechamento da competência selecionada, devidamente homologados pelos órgãos de controle."
  );

  const availableCompetences = [
    { value: "2026-06", label: "Junho / 2026" },
    { value: "2026-05", label: "Maio / 2026" },
    { value: "2026-04", label: "Abril / 2026" },
    { value: "2026-03", label: "Março / 2026" },
    { value: "2026-02", label: "Fevereiro / 2026" },
    { value: "2026-01", label: "Janeiro / 2026" },
  ];

  // Data calculations for selected competence
  const comp = selectedCompetence;
  const prevComp = getPrevCompetence(comp);

  // Patrimônio / Carteira Consolidada
  const currentPatrimonioObj = evolucaoCarteiraConsolidada.find(e => e.competencia === comp);
  const prevPatrimonioObj = evolucaoCarteiraConsolidada.find(e => e.competencia === prevComp);
  const currentPatrimonio = currentPatrimonioObj?.valorCarteiraConsolidada || 0;
  const prevPatrimonio = prevPatrimonioObj?.valorCarteiraConsolidada || 0;
  const patrimonioGrowth = prevPatrimonio ? ((currentPatrimonio - prevPatrimonio) / prevPatrimonio) * 100 : 0;

  // Financeiro / Contábil
  const monthlyMov = movimentacoesFinanceiras.filter(m => m.competencia === comp);
  const totalReceitas = monthlyMov.filter(m => m.tipo === "receita").reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = monthlyMov.filter(m => m.tipo === "despesa").reduce((acc, curr) => acc + curr.valor, 0);
  const totalTransferencias = monthlyMov.filter(m => m.tipo === "transferenciaRecebida").reduce((acc, curr) => acc + curr.valor, 0);
  const saldoFinanceiroMes = totalReceitas + totalTransferencias - totalDespesas;

  // Receitas por Fundo
  const receitasReparticao = monthlyMov.filter(m => m.tipo === "receita" && m.fundo === "reparticao").reduce((acc, curr) => acc + curr.valor, 0);
  const despesasReparticao = monthlyMov.filter(m => m.tipo === "despesa" && m.fundo === "reparticao").reduce((acc, curr) => acc + curr.valor, 0);
  
  const receitasCapitalizacao = monthlyMov.filter(m => m.tipo === "receita" && m.fundo === "capitalizacao").reduce((acc, curr) => acc + curr.valor, 0);
  const despesasCapitalizacao = monthlyMov.filter(m => m.tipo === "despesa" && m.fundo === "capitalizacao").reduce((acc, curr) => acc + curr.valor, 0);

  const receitasOrgao = monthlyMov.filter(m => m.tipo === "receita" && m.fundo === "orgaoGerenciador").reduce((acc, curr) => acc + curr.valor, 0);
  const despesasOrgao = monthlyMov.filter(m => m.tipo === "despesa" && m.fundo === "orgaoGerenciador").reduce((acc, curr) => acc + curr.valor, 0);

  // Meta Atuarial
  const metaObj = retornoMetaAtuarial.find(g => g.competencia === comp);

  // Beneficiários
  const benObj = beneficios.find(b => b.competencia === comp && b.fundo === "consolidado");
  const benReparticaoObj = beneficios.find(b => b.competencia === comp && b.fundo === "reparticao");
  const benCapObj = beneficios.find(b => b.competencia === comp && b.fundo === "capitalizacao");

  // Servidores Ativos
  const segObj = seguradosAtivos.find(s => s.competencia === comp);

  // Consignado
  const consgObj = emprestimosConsignados.find(c => c.competencia === comp);

  // Investimentos activos no mês
  const ativosMes: { inv: typeof investimentos[0]; hist: any }[] = [];
  let totalRendimentoMes = 0;
  let totalAplicacoesMes = 0;
  let totalResgatesMes = 0;

  investimentos.forEach(inv => {
    const h = inv.historico.find(x => x.competencia === comp);
    if (h && h.saldoFinal > 0) {
      ativosMes.push({ inv, hist: h });
      totalRendimentoMes += h.rendimentos || 0;
      totalAplicacoesMes += h.aplicacoes || 0;
      totalResgatesMes += h.resgates || 0;
    }
  });

  // Estressados
  const estressados = ativosMes.filter(item => item.inv.ativoEstressado);

  // Month-by-month constants & helper functions for Receita e Despesas report
  const monthsList = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const monthShortLabels = ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"];

  const getVal = (fundo: string, tipo: string, c: string, cat: string): number => {
    const item = movimentacoesFinanceiras.find(
      m => m.fundo === fundo && m.tipo === tipo && m.competencia === c && m.categoria === cat
    );
    return item ? item.valor : 0;
  };

  const repReceitaCats = [
    "Contribuição Patronal",
    "Contribuição do Servidor",
    "Contribuição de Inativos e Pensionistas",
    "Rendimento de Aplicação",
    "Compensação Previdenciária",
    "Outras Receitas"
  ];

  const capReceitaCats = [
    "Contribuição Patronal",
    "Contribuição do Servidor",
    "Contribuição de Inativos e Pensionistas",
    "Rendimento de Aplicação",
    "Juros de Empréstimos Consignados",
    "Compensação Previdenciária",
    "Parcelamentos",
    "Outras Receitas"
  ];

  const orgReceitaCats = [
    "Taxa de Administração",
    "Rendimento de Aplicação",
    "Outras Receitas"
  ];

  const repDespesaCats = [
    "Aposentadorias",
    "Pensões",
    "Compensação Previdenciária",
    "Outras Despesas"
  ];

  const capDespesaCats = [
    "Aposentadorias",
    "Pensões",
    "Compensação Previdenciária",
    "Outras Despesas"
  ];

  const orgDespesaCats = [
    "Folha de Pagamento",
    "SAMA",
    "PASEP",
    "Pessoa Física",
    "Pessoa Jurídica",
    "Previdência Complementar",
    "Bens Permanentes",
    "Outras Despesas"
  ];

  // Subtotal helper functions by month
  const getSubtotalRepRec = (c: string) => 
    repReceitaCats.reduce((acc, cat) => acc + getVal("reparticao", "receita", c, cat), 0) + 
    getVal("reparticao", "transferenciaRecebida", c, "Aporte por Insuficiência Financeira");

  const getSubtotalCapRec = (c: string) => 
    capReceitaCats.reduce((acc, cat) => acc + getVal("capitalizacao", "receita", c, cat), 0);

  const getSubtotalOrgRec = (c: string) => 
    orgReceitaCats.reduce((acc, cat) => acc + getVal("orgaoGerenciador", "receita", c, cat), 0) + 
    getVal("orgaoGerenciador", "transferenciaRecebida", c, "Interferência Financeira");

  const getTotalRecConsolidado = (c: string) => 
    getSubtotalRepRec(c) + getSubtotalCapRec(c) + getSubtotalOrgRec(c);

  const getSubtotalRepDesp = (c: string) => 
    repDespesaCats.reduce((acc, cat) => acc + getVal("reparticao", "despesa", c, cat), 0);

  const getSubtotalCapDesp = (c: string) => 
    capDespesaCats.reduce((acc, cat) => acc + getVal("capitalizacao", "despesa", c, cat), 0);

  const getSubtotalOrgDesp = (c: string) => 
    orgDespesaCats.reduce((acc, cat) => acc + getVal("orgaoGerenciador", "despesa", c, cat), 0);

  const getTotalDespConsolidado = (c: string) => 
    getSubtotalRepDesp(c) + getSubtotalCapDesp(c) + getSubtotalOrgDesp(c);

  const getSaldoBancarioFundo = (fundo: "reparticao" | "capitalizacao" | "orgaoGerenciador", c: string) => {
    return investimentos
      .filter(inv => inv.fundo === fundo)
      .reduce((acc, inv) => {
        const h = inv.historico.find(x => x.competencia === c);
        return acc + (h?.saldoFinal || 0);
      }, 0);
  };

  const getDemograficosFundo = (c: string) => {
    const seg = seguradosAtivos.find(s => s.competencia === c);
    const totalAtivos = seg?.quantidadeAtivos || 0;

    const benRep = beneficios.find(b => b.competencia === c && b.fundo === "reparticao");
    const benCap = beneficios.find(b => b.competencia === c && b.fundo === "capitalizacao");
    const benCons = beneficios.find(b => b.competencia === c && b.fundo === "consolidado");

    const inativosRep = benRep?.totalBeneficiarios || 0;
    const inativosCap = benCap?.totalBeneficiarios || 0;
    const inativosCons = benCons?.totalBeneficiarios || 0;

    const repServContrib = getVal("reparticao", "receita", c, "Contribuição do Servidor");
    const capServContrib = getVal("capitalizacao", "receita", c, "Contribuição do Servidor");
    const totalServContrib = (repServContrib + capServContrib) || 1;

    const ativosRep = Math.round(totalAtivos * (repServContrib / totalServContrib));
    const ativosCap = totalAtivos - ativosRep;

    const ratioRep = inativosRep > 0 ? (ativosRep / inativosRep) : 0;
    const ratioCap = inativosCap > 0 ? (ativosCap / inativosCap) : 0;
    const ratioCons = inativosCons > 0 ? (totalAtivos / inativosCons) : 0;

    return {
      totalAtivos,
      inativosCons,
      inativosRep,
      inativosCap,
      ativosRep,
      ativosCap,
      ratioRep,
      ratioCap,
      ratioCons
    };
  };

  // Segment allocation calculation for active competence comp
  const segmentoMap: Record<string, number> = {};
  let totalInvestimentosSaldo = 0;
  ativosMes.forEach(({ inv, hist }) => {
    const seg = inv.segmento || "Outros";
    const saldo = hist.saldoFinal || 0;
    segmentoMap[seg] = (segmentoMap[seg] || 0) + saldo;
    totalInvestimentosSaldo += saldo;
  });

  const comprevReceitaComp = getVal("reparticao", "receita", comp, "Compensação Previdenciária") +
                             getVal("capitalizacao", "receita", comp, "Compensação Previdenciária");
  const comprevDespesaComp = getVal("reparticao", "despesa", comp, "Compensação Previdenciária") +
                             getVal("capitalizacao", "despesa", comp, "Compensação Previdenciária");

  const aporteInsuficienciaComp = getVal("reparticao", "transferenciaRecebida", comp, "Aporte por Insuficiência Financeira");
  const interferenciaOrgaoComp = getVal("orgaoGerenciador", "transferenciaRecebida", comp, "Interferência Financeira");
  const totalAportesTransfComp = aporteInsuficienciaComp + interferenciaOrgaoComp;

  const qtdAtivosComp = segObj?.quantidadeAtivos || 0;
  const qtdAposentadosComp = benObj?.aposentados || 0;
  const qtdPensionistasComp = benObj?.pensionistas || 0;
  const totalBeneficiariosComp = benObj?.totalBeneficiarios || (qtdAposentadosComp + qtdPensionistasComp);
  const totalMassaComp = qtdAtivosComp + totalBeneficiariosComp;

  const jurosConsigReceita = getVal("capitalizacao", "receita", comp, "Juros de Empréstimos Consignados");
  const consgSaldoComp = consgObj?.saldoCarteira || 0;
  const consgConcessoesComp = consgObj?.concessoesMes ?? consgObj?.valorEmprestado ?? 0;
  const consgAmortizacoesComp = consgObj?.amortizacoesMes ?? consgObj?.valorAmortizado ?? 0;
  const consgJurosComp = consgObj?.jurosMes || jurosConsigReceita || 0;
  const consgInadimplenciaComp = consgObj?.inadimplencia || 0;
  const consgContratosComp = consgObj?.contratosAtivos || consgObj?.quantidadeContratos || 0;

  const retornoMesComp = metaObj?.retornoPercentual || 0;
  const metaMesComp = metaObj?.metaAtuarialPercentual || 0;
  const atingiuMetaComp = metaObj?.atingiuMeta || false;

  // Handlers
  const handlePrint = () => {
    window.print();
  };

  const generateTextReport = () => {
    const titleMap: Record<ReportType, string> = {
      receitas_despesas: "RELATÓRIO MÊS A MÊS DE RECEITAS E DESPESAS SEGREGADO POR FUNDO",
      consolidado: "RELATÓRIO EXECUTIVO CONSOLIDADO",
      investimentos: "RELATÓRIO DA CARTEIRA DE INVESTIMENTOS",
      meta_atuarial: "RELATÓRIO DE META ATUARIAL E RENTABILIDADE",
      contabil: "RELATÓRIO CONTÁBIL E EXECUÇÃO FINANCEIRA",
      beneficios: "RELATÓRIO DE BENEFÍCIOS PREVIDENCIÁRIOS",
      comprev: "RELATÓRIO DE COMPENSAÇÃO PREVIDENCIÁRIA (COMPREV)",
      consignado: "RELATÓRIO DE EMPRÉSTIMOS CONSIGNADOS"
    };

    if (reportType === "receitas_despesas") {
      const totRecSemestre = monthsList.reduce((acc, c) => acc + getTotalRecConsolidado(c), 0);
      const totDespSemestre = monthsList.reduce((acc, c) => acc + getTotalDespConsolidado(c), 0);
      const resultadoSemestre = totRecSemestre - totDespSemestre;
      const demoComp = getDemograficosFundo(comp);

      return `
========================================================================
MARINGÁ PREVIDÊNCIA - PORTAL EXECUTIVO SGE
${titleMap[reportType]}
Período Analisado: Janeiro/2026 a Junho/2026 (Mês a Mês)
Competência de Referência: ${getMonthName(comp)}
Data de Emissão: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
========================================================================

1. QUADRO 1: FUNDO EM REPARTIÇÃO (FUNDO FINANCEIRO)
- Servidores Ativos (Repartição): ${formatNumber(demoComp.ativosRep)}
- Servidores Inativos (Repartição): ${formatNumber(demoComp.inativosRep)}
- Razão Ativos / Inativos: ${demoComp.ratioRep.toFixed(2)} ativos p/ inativo
- Receitas + Transferências (Semestre): ${formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalRepRec(c), 0))}
- Despesas Previdenciárias (Semestre): ${formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalRepDesp(c), 0))}
- Resultado Financeiro Acumulado: ${formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalRepRec(c) - getSubtotalRepDesp(c)), 0))}
- Saldo Bancário / Disponibilidade (${monthShortLabels[monthsList.indexOf(comp)]}): ${formatCurrency(getSaldoBancarioFundo("reparticao", comp))}
- Aportes por Insuficiência Recebidos (Semestre): ${formatCurrency(monthsList.reduce((acc, c) => acc + getVal("reparticao", "transferenciaRecebida", c, "Aporte por Insuficiência Financeira"), 0))}

2. QUADRO 2: FUNDO EM CAPITALIZAÇÃO (FUNDO PREVIDENCIÁRIO)
- Servidores Ativos (Capitalização): ${formatNumber(demoComp.ativosCap)}
- Servidores Inativos (Capitalização): ${formatNumber(demoComp.inativosCap)}
- Razão Ativos / Inativos: ${demoComp.ratioCap.toFixed(2)} ativos p/ inativo
- Receitas Próprias (Semestre): ${formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalCapRec(c), 0))}
- Despesas Previdenciárias (Semestre): ${formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalCapDesp(c), 0))}
- Superávit Financeiro Acumulado: ${formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalCapRec(c) - getSubtotalCapDesp(c)), 0))}
- Saldo Bancário / Patrimônio Líquido (${monthShortLabels[monthsList.indexOf(comp)]}): ${formatCurrency(getSaldoBancarioFundo("capitalizacao", comp))}

3. QUADRO 3: ÓRGÃO GERENCIADOR (TAXA DE ADMINISTRAÇÃO)
- Segurados Gerenciados: ${formatNumber(demoComp.totalAtivos + demoComp.inativosCons)}
- Receitas + Transferências (Semestre): ${formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalOrgRec(c), 0))}
- Despesas Administrativas (Semestre): ${formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalOrgDesp(c), 0))}
- Resultado Acumulado da Taxa de ADM: ${formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalOrgRec(c) - getSubtotalOrgDesp(c)), 0))}
- Saldo Bancário / Disponibilidade ADM (${monthShortLabels[monthsList.indexOf(comp)]}): ${formatCurrency(getSaldoBancarioFundo("orgaoGerenciador", comp))}

4. QUADRO CONSOLIDADO: SÍNTESE EXECUTIVA DO RPPS
- Servidores Ativos Totais: ${formatNumber(demoComp.totalAtivos)}
- Inativos Totais: ${formatNumber(demoComp.inativosCons)}
- Razão Ativos/Inativos Consolidada: ${demoComp.ratioCons.toFixed(2)} ativos p/ inativo
- Receitas e Transferências Totais: ${formatCurrency(totRecSemestre)}
- Despesas Totais Realizadas: ${formatCurrency(totDespSemestre)}
- Resultado Líquido Consolidado: ${formatCurrency(resultadoSemestre)}
- Patrimônio / Disponibilidade Total do RPPS: ${formatCurrency(getSaldoBancarioFundo("capitalizacao", comp) + getSaldoBancarioFundo("reparticao", comp) + getSaldoBancarioFundo("orgaoGerenciador", comp))}

5. OBSERVAÇÕES E PARECER TÉCNICO:
${customNotes}

========================================================================
Maringá Previdência • Documento Oficial de Acompanhamento Estratégico
========================================================================
      `.trim();
    }

    return `
========================================================================
MARINGÁ PREVIDÊNCIA - PORTAL EXECUTIVO SGE
${titleMap[reportType]}
Competência de Referência: ${getMonthName(comp)}
Data de Emissão: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
========================================================================

1. RESUMO DOS INDICADORES CHAVE:
- Patrimônio Líquido Consolidado: ${formatCurrency(currentPatrimonio)}
- Variação em Relação ao Mês Anterior: ${patrimonioGrowth >= 0 ? "+" : ""}${patrimonioGrowth.toFixed(2)}%
- Resultado Financeiro do Mês: ${formatCurrency(saldoFinanceiroMes)}
- Rentabilidade Obtida no Mês: ${formatPercent(metaObj?.retornoPercentual)}
- Meta Atuarial do Mês (${metaObj?.metaAtuarialFormula || "IPCA + 5,92%"}): ${formatPercent(metaObj?.metaAtuarialPercentual)}
- Status Meta Atuarial: ${metaObj?.atingiuMeta ? "META ATINGIDA" : "NÃO ATINGIDA"}

2. BENEFÍCIOS E POPULAÇÃO:
- Total de Beneficiários: ${formatNumber(benObj?.totalBeneficiarios)} (Aposentados: ${formatNumber(benObj?.aposentados)} | Pensionistas: ${formatNumber(benObj?.pensionistas)})
- Valor da Folha de Benefícios: ${formatCurrency(benObj?.valorTotal)}
- Servidores Ativos: ${formatNumber(segObj?.quantidadeAtivos)}

3. OBSERVAÇÕES E PARECER TÉCNICO:
${customNotes}

========================================================================
Maringá Previdência • Documento Oficial de Acompanhamento Estratégico
========================================================================
    `.trim();
  };

  const handleCopyText = () => {
    const text = generateTextReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const text = generateTextReport();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Relatorio_${reportType}_${selectedCompetence}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reportsConfig: { id: ReportType; label: string; icon: any; description: string }[] = [
    { 
      id: "receitas_despesas", 
      label: "Receita e Despesas", 
      icon: Scale, 
      description: "Demonstrativo mês a mês das principais receitas e despesas segregadas por fundo." 
    },
    { 
      id: "consolidado", 
      label: "Consolidado Geral", 
      icon: Compass, 
      description: "Visão executiva unificada com patrimônio, investimentos, meta atuarial e benefícios." 
    },
    { 
      id: "investimentos", 
      label: "Investimentos", 
      icon: Briefcase, 
      description: "Posição detalhada da carteira, rentabilidade, enquadramento Res. CMN e ativos sob observação." 
    },
    { 
      id: "meta_atuarial", 
      label: "Meta Atuarial", 
      icon: Target, 
      description: "Acompanhamento mensal da rentabilidade x parâmetro atuarial (IPCA + 5,92% a.a.)." 
    },
    { 
      id: "contabil", 
      label: "Contábil & Financeiro", 
      icon: Scale, 
      description: "Demonstrativo de receitas, despesas, transferências e resultado do exercício por fundo." 
    },
    { 
      id: "beneficios", 
      label: "Benefícios", 
      icon: Users, 
      description: "Evolução do quantitativo e valor das aposentadorias, pensões e novas concessões." 
    },
    { 
      id: "comprev", 
      label: "COMPREV", 
      icon: ArrowRightLeft, 
      description: "Relatório do fluxo de compensação previdenciária entre o RGPS/INSS e o RPPS." 
    },
    { 
      id: "consignado", 
      label: "Consignado", 
      icon: Coins, 
      description: "Evolução da carteira de crédito consignado própria (Art. 12 da Resolução CMN 4.963)." 
    },
  ];

  return (
    <div id="impressao_tab_container" className="space-y-6">
      
      {/* Dynamic Embedded Print CSS rules to hide UI chrome when printing */}
      <style>{`
        @media print {
          /* Hide non-printable UI components */
          #app_header,
          #app_nav,
          footer,
          .no-print,
          .print-hidden,
          button,
          input,
          textarea,
          select {
            display: none !important;
          }

          /* Reset page layout for physical printing / PDF export */
          body, #app_root, main, #content_stage {
            background-color: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }

          /* Format printable document container */
          #printable_report {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 15px !important;
            background: #ffffff !important;
          }

          /* Economic print styling mode (BW or low ink) */
          ${economicPrint ? `
            .bg-slate-50, .bg-blue-50, .bg-amber-50, .bg-emerald-50, .bg-red-50 {
              background-color: #ffffff !important;
              border-color: #cccccc !important;
            }
            .text-blue-900, .text-blue-800, .text-slate-800 {
              color: #000000 !important;
            }
          ` : ''}

          /* Handle clean page breaking */
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Control Panel Header (Hidden during physical print) */}
      <div className="no-print bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <Printer className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Central de Impressão & Relatórios Executivos</h2>
                <p className="text-xs text-slate-500">Selecione o tema, ajuste os parâmetros e gere relatórios oficiais formatados para impressão ou PDF.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
              title="Copiar resumo textual para a área de transferência"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? "Copiado!" : "Copiar Texto"}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
              title="Baixar relatório formatado em arquivo de texto (.txt)"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Baixar (.TXT)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR / GERAR PDF</span>
            </button>
          </div>
        </div>

        {/* Competence and Customization Options Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          
          {/* Competence Selector */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Competência do Relatório</label>
            <div className="relative">
              <select
                value={selectedCompetence}
                onChange={(e) => setSelectedCompetence(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500"
              >
                {availableCompetences.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Options Toggles */}
          <div className="space-y-1.5 md:col-span-2">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Configurações de Layout</span>
            <div className="flex flex-wrap items-center gap-4 pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSignatures}
                  onChange={(e) => setShowSignatures(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Incluir Bloco de Assinaturas</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNotes}
                  onChange={(e) => setShowNotes(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Incluir Parecer / Observações</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={economicPrint}
                  onChange={(e) => setEconomicPrint(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Modo Impressão Econômica</span>
              </label>
            </div>
          </div>
        </div>

        {/* Theme Tabs Grid */}
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Selecione o Módulo / Tema do Relatório</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {reportsConfig.map(cfg => {
              const Icon = cfg.icon;
              const isSelected = reportType === cfg.id;
              return (
                <button
                  key={cfg.id}
                  onClick={() => setReportType(cfg.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-white" : "text-blue-700"}`} />
                  <div>
                    <p className="text-xs font-bold leading-tight">{cfg.label}</p>
                    <p className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>{cfg.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editable Notes Textbox */}
        {showNotes && (
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-900 flex items-center space-x-1">
                <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                <span>Parecer Técnico / Observações da Diretoria (editável antes de imprimir)</span>
              </span>
              <span className="text-[10px] text-amber-700">Edite o texto abaixo para incluir na versão impressa</span>
            </div>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-800 text-xs focus:outline-hidden focus:border-amber-500 font-sans"
              placeholder="Digite aqui ressalvas, pareceres do comitê de investimentos ou comentários contábeis..."
            />
          </div>
        )}

      </div>

      {/* ========================================================================================= */}
      {/* PRINTABLE DOCUMENT PAPER CONTAINER (#printable_report)                                   */}
      {/* ========================================================================================= */}
      <div className="flex justify-center">
        <div 
          id="printable_report" 
          className="w-full max-w-4xl bg-white text-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-lg space-y-6 print:shadow-none print:border-none print:p-0"
        >
          {/* Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-full p-1 border border-slate-300 flex items-center justify-center shrink-0">
                <img 
                  src={maringaLogo} 
                  alt="Maringá Previdência" 
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">Maringá Previdência</h1>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Previdência dos Servidores Públicos Municipais de Maringá</p>
                <p className="text-[10px] text-slate-500">Sistema de Gestão Estratégica (SGE) • CNPJ: 78.074.804/0001-22</p>
              </div>
            </div>

            <div className="text-right border-l border-slate-300 pl-4 text-xs font-mono">
              <p className="font-bold uppercase text-blue-900 text-[11px]">SGE - DOCUMENTO OFICIAL</p>
              <p className="text-slate-600 mt-0.5"><strong className="text-slate-800">Ref:</strong> {getMonthName(comp)}</p>
              <p className="text-slate-500 text-[10px]">Emissão: {new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="bg-slate-100 p-3.5 rounded-lg border border-slate-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Demonstrativo Estratégico</span>
              <h2 className="text-base font-extrabold uppercase text-slate-900">
                {reportType === "receitas_despesas" && "Demonstrativo Mês a Mês de Receitas e Despesas - Segregado por Fundo"}
                {reportType === "consolidado" && "Relatório Executivo Consolidado - Posição Geral do RPPS"}
                {reportType === "investimentos" && "Relatório Analítico da Carteira de Investimentos"}
                {reportType === "meta_atuarial" && "Relatório de Desempenho x Meta Atuarial"}
                {reportType === "contabil" && "Relatório de Execução Contábil & Financeira por Fundo"}
                {reportType === "beneficios" && "Relatório de Benefícios Previdenciários & Demografia"}
                {reportType === "comprev" && "Relatório de Compensação Previdenciária (COMPREV)"}
                {reportType === "consignado" && "Relatório da Carteira de Empréstimos Consignados"}
              </h2>
            </div>
            <div className="text-right text-xs">
              <span className="px-2.5 py-1 bg-slate-200 text-slate-800 font-bold rounded uppercase text-[10px]">
                Competência: {comp}
              </span>
            </div>
          </div>

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 0: RECEITA E DESPESAS (MÊS A MÊS POR FUNDO)                                    */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "receitas_despesas" && (
            <div className="space-y-8 text-xs">
              
              {/* ===================================================================================== */}
              {/* PRIMEIRA PÁGINA: PAINEL DE INFORMAÇÕES RÁPIDAS E ESSENCIAIS DA COMPETÊNCIA SELECIONADA */}
              {/* ===================================================================================== */}
              <div className="break-inside-avoid space-y-5 bg-slate-50 p-4 border border-slate-300 rounded-lg shadow-sm print:bg-white print:p-0 print:border-none">
                
                {/* Cabeçalho do Painel da Competência */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">SÍNTESE EXECUTIVA ESTRATÉGICA</span>
                    <h3 className="text-sm font-black uppercase text-slate-900 flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <span>Informações Essenciais da Competência: {getMonthName(comp)} ({comp})</span>
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded uppercase font-mono">
                    Posição Homologada
                  </span>
                </div>

                {/* GRID DE CARDS RÁPIDOS (8 INDICADORES CHAVE) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-800">
                  
                  {/* CARD 1: RECEITAS */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>1. Receitas do Mês</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-base font-black text-emerald-800 font-mono">
                      {formatCurrency(totalReceitas)}
                    </div>
                    <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-1 flex justify-between">
                      <span>Rep: {formatCurrency(receitasReparticao)}</span>
                      <span>Cap: {formatCurrency(receitasCapitalizacao)}</span>
                    </div>
                  </div>

                  {/* CARD 2: DESPESAS */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>2. Despesas do Mês</span>
                      <Coins className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <div className="text-base font-black text-red-800 font-mono">
                      {formatCurrency(totalDespesas)}
                    </div>
                    <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-1 flex justify-between">
                      <span>Rep: {formatCurrency(despesasReparticao)}</span>
                      <span>Cap: {formatCurrency(despesasCapitalizacao)}</span>
                    </div>
                  </div>

                  {/* CARD 3: APORTES / TRANSFERÊNCIAS */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>3. Aportes / Transf.</span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="text-base font-black text-amber-900 font-mono">
                      {formatCurrency(totalAportesTransfComp)}
                    </div>
                    <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-1 truncate">
                      Insuficiência: {formatCurrency(aporteInsuficienciaComp)}
                    </div>
                  </div>

                  {/* CARD 4: COMPENSAÇÃO PREVIDENCIÁRIA */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>4. Compensação (COMPREV)</span>
                      <Scale className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="text-base font-black text-blue-900 font-mono">
                      {formatCurrency(comprevReceitaComp)}
                    </div>
                    <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-1 flex justify-between">
                      <span>Despesa: {formatCurrency(comprevDespesaComp)}</span>
                      <span className="font-bold text-slate-800">Líq: {formatCurrency(comprevReceitaComp - comprevDespesaComp)}</span>
                    </div>
                  </div>

                  {/* CARD 5: META ATUARIAL */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>5. Meta Atuarial</span>
                      <Target className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="text-base font-black text-purple-900 font-mono">
                      {formatPercent(retornoMesComp)} <span className="text-[10px] font-normal text-slate-500">vs {formatPercent(metaMesComp)}</span>
                    </div>
                    <div className="text-[9px] border-t border-slate-100 pt-1 font-bold">
                      {atingiuMetaComp ? (
                        <span className="text-emerald-700">✓ Meta Atingida</span>
                      ) : (
                        <span className="text-red-600">⚠️ Abaixo da Meta</span>
                      )}
                    </div>
                  </div>

                  {/* CARD 6: SERVIDORES / BENEFICIÁRIOS */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>6. Massa de Segurados</span>
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="text-base font-black text-indigo-950 font-mono">
                      {formatNumber(totalMassaComp)} <span className="text-[10px] text-slate-500 font-normal">Pessoas</span>
                    </div>
                    <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-1 flex justify-between">
                      <span>Ativos: {formatNumber(qtdAtivosComp)}</span>
                      <span>Benef: {formatNumber(totalBeneficiariosComp)}</span>
                    </div>
                  </div>

                  {/* CARD 7: EMPRÉSTIMO CONSIGNADO */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>7. Carteira Consignado</span>
                      <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                    <div className="text-base font-black text-slate-900 font-mono">
                      {formatCurrency(consgSaldoComp)}
                    </div>
                    <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-1 flex justify-between">
                      <span>{formatNumber(consgContratosComp)} Contratos</span>
                      <span className="font-bold text-amber-700">Inad: {formatPercent(consgInadimplenciaComp)}</span>
                    </div>
                  </div>

                  {/* CARD 8: ALOCAÇÃO POR SEGMENTO */}
                  <div className="p-3 bg-white border border-slate-300 rounded shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                      <span>8. Carteira Investimentos</span>
                      <Compass className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <div className="text-base font-black text-slate-900 font-mono">
                      {formatCurrency(currentPatrimonio)}
                    </div>
                    <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-1 flex justify-between">
                      <span>RF: {formatPercent(((segmentoMap["Renda Fixa"] || 0) / (totalInvestimentosSaldo || 1)) * 100)}</span>
                      <span>RV: {formatPercent(((segmentoMap["Renda Variável"] || 0) / (totalInvestimentosSaldo || 1)) * 100)}</span>
                    </div>
                  </div>

                </div>

                {/* QUADROS SINTÉTICOS COMPLEMENTARES DA COMPETÊNCIA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* QUADRO A: ALOCAÇÃO POR SEGMENTOS NA COMPETÊNCIA */}
                  <div className="border border-slate-300 bg-white rounded overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 font-black uppercase text-[10px] text-slate-900 flex justify-between items-center">
                      <span className="flex items-center space-x-1.5">
                        <Compass className="w-3.5 h-3.5 text-slate-700" />
                        <span>Alocação por Segmentos ({getMonthName(comp)})</span>
                      </span>
                      <span className="text-slate-500 font-mono font-normal">Patrimônio Carteira</span>
                    </div>
                    <table className="w-full text-left border-collapse text-[9px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-1.5 border-r border-slate-200">Segmento</th>
                          <th className="p-1.5 border-r border-slate-200 text-right">Saldo (R$)</th>
                          <th className="p-1.5 text-right">% Carteira</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(segmentoMap).map(([seg, saldo], i) => {
                          const part = totalInvestimentosSaldo ? (saldo / totalInvestimentosSaldo) * 100 : 0;
                          return (
                            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-1.5 border-r border-slate-200 font-medium text-slate-800">{seg}</td>
                              <td className="p-1.5 border-r border-slate-200 text-right font-mono text-slate-700">{formatCurrency(saldo)}</td>
                              <td className="p-1.5 text-right font-mono font-bold text-slate-900">{formatPercent(part)}</td>
                            </tr>
                          );
                        })}
                        <tr className="bg-slate-100 font-black text-slate-900">
                          <td className="p-1.5 border-r border-slate-200">Total Carteira</td>
                          <td className="p-1.5 border-r border-slate-200 text-right font-mono text-emerald-800">{formatCurrency(totalInvestimentosSaldo)}</td>
                          <td className="p-1.5 text-right font-mono">100,00%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* QUADRO B: EMPRÉSTIMO CONSIGNADO E MASSA DE SEGURADOS */}
                  <div className="space-y-4">
                    
                    {/* SUB-QUADRO CONSIGNADOS */}
                    <div className="border border-slate-300 bg-white rounded overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 font-black uppercase text-[10px] text-slate-900 flex justify-between items-center">
                        <span className="flex items-center space-x-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Resumo do Empréstimo Consignado ({getMonthName(comp)})</span>
                        </span>
                        <span className="text-emerald-800 font-mono font-bold">{formatCurrency(consgSaldoComp)}</span>
                      </div>
                      <table className="w-full text-left border-collapse text-[9px]">
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="p-1.5 font-medium text-slate-700 border-r border-slate-200 w-1/2">Saldo Total da Carteira</td>
                            <td className="p-1.5 font-mono font-bold text-slate-900 text-right">{formatCurrency(consgSaldoComp)}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="p-1.5 font-medium text-slate-700 border-r border-slate-200">Novas Concessões no Mês</td>
                            <td className="p-1.5 font-mono text-emerald-700 font-bold text-right">{formatCurrency(consgConcessoesComp)}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="p-1.5 font-medium text-slate-700 border-r border-slate-200">Amortizações / Recolhimentos</td>
                            <td className="p-1.5 font-mono text-slate-800 text-right">{formatCurrency(consgAmortizacoesComp)}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="p-1.5 font-medium text-slate-700 border-r border-slate-200">Juros / Rendimentos do Mês</td>
                            <td className="p-1.5 font-mono text-purple-800 font-bold text-right">{formatCurrency(consgJurosComp)}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="p-1.5 font-medium text-slate-700 border-r border-slate-200">Taxa de Inadimplência (&gt;60 dias)</td>
                            <td className="p-1.5 font-mono font-bold text-amber-700 text-right">{formatPercent(consgInadimplenciaComp)}</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-medium text-slate-700 border-r border-slate-200">Contratos Ativos / Tomadores</td>
                            <td className="p-1.5 font-mono font-bold text-slate-900 text-right">{formatNumber(consgContratosComp)} contratos</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* SUB-QUADRO MASSA DE SEGURADOS */}
                    <div className="border border-slate-300 bg-white rounded overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 font-black uppercase text-[10px] text-slate-900 flex justify-between items-center">
                        <span className="flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Massa Previdenciária ({getMonthName(comp)})</span>
                        </span>
                        <span className="text-indigo-900 font-mono font-bold">{formatNumber(totalMassaComp)} Segurados</span>
                      </div>
                      <div className="p-2 grid grid-cols-4 gap-2 text-center text-[9px]">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="block text-slate-500 font-bold uppercase text-[8px]">Ativos</span>
                          <span className="font-mono font-black text-slate-900">{formatNumber(qtdAtivosComp)}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="block text-slate-500 font-bold uppercase text-[8px]">Aposentados</span>
                          <span className="font-mono font-black text-slate-900">{formatNumber(qtdAposentadosComp)}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="block text-slate-500 font-bold uppercase text-[8px]">Pensionistas</span>
                          <span className="font-mono font-black text-slate-900">{formatNumber(qtdPensionistasComp)}</span>
                        </div>
                        <div className="bg-indigo-50 p-1.5 rounded border border-indigo-200 text-indigo-950">
                          <span className="block text-indigo-800 font-black uppercase text-[8px]">Total Geral</span>
                          <span className="font-mono font-black">{formatNumber(totalMassaComp)}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* ================================================================================= */}
              {/* QUADRO 1, 2, 3 & CONSOLIDADO: RECEITAS E DESPESAS SEGREGADO POR FUNDO              */}
              {/* ================================================================================= */}
              <div className="space-y-6">

                {/* Banner Informativo Superior */}
                <div className="bg-slate-900 text-white p-3.5 rounded-lg shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                        Relatório Executivo Detalhado
                      </span>
                      <span className="text-slate-400 text-[11px] font-medium">
                        Demonstrativo por Fundo • Competência {getMonthName(comp)}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-100">
                      Segregação de Massas, Movimentação Financeira e Razão Demográfica
                    </h2>
                  </div>
                  <div className="flex items-center space-x-4 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700/60 text-right">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Total Vidas RPPS</span>
                      <span className="text-sm font-black text-amber-300">
                        {formatNumber(getDemograficosFundo(comp).totalAtivos + getDemograficosFundo(comp).inativosCons)}
                      </span>
                    </div>
                    <div className="border-l border-slate-700 pl-4">
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Razão Ativos/Inativos</span>
                      <span className="text-sm font-black text-emerald-400">
                        {getDemograficosFundo(comp).ratioCons.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================================================================================= */}
                {/* QUADRO 1: FUNDO EM REPARTIÇÃO (FUNDO FINANCEIRO)                                 */}
                {/* ================================================================================= */}
                <div className="break-inside-avoid border border-amber-300 bg-amber-50/20 rounded-xl p-4 shadow-xs space-y-4">
                  
                  {/* Cabeçalho do Quadro 1 */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2 border-b-2 border-amber-800 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-amber-800 text-white rounded-lg shadow-xs">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase text-amber-950 tracking-tight">
                          QUADRO 1: FUNDO EM REPARTIÇÃO (FUNDO FINANCEIRO)
                        </h3>
                        <p className="text-[11px] text-amber-800 font-medium">
                          Regime Financeiro • Cobertura de Benefícios com Aporte de Insuficiência do Ente
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded border border-amber-300">
                        Aporte Semestral: {formatCurrency(monthsList.reduce((acc, c) => acc + getVal("reparticao", "transferenciaRecebida", c, "Aporte por Insuficiência Financeira"), 0))}
                      </span>
                    </div>
                  </div>

                  {/* Cards Rápidos de Indicadores - Quadro 1 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-amber-800">Servidores Ativos</span>
                      <span className="text-base font-black text-amber-950">
                        {formatNumber(getDemograficosFundo(comp).ativosRep)}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Contribuintes em Repartição</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-amber-800">Servidores Inativos</span>
                      <span className="text-base font-black text-amber-950">
                        {formatNumber(getDemograficosFundo(comp).inativosRep)}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Aposentados e Pensionistas</span>
                    </div>

                    <div className="bg-amber-900 text-white p-2.5 rounded-lg shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-amber-200">Razão Ativos / Inativos</span>
                      <span className="text-base font-black text-amber-300">
                        {getDemograficosFundo(comp).ratioRep.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-amber-100 block">Ativos por Beneficiário</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-amber-800">Saldo Bancário do Fundo</span>
                      <span className="text-base font-black text-amber-950">
                        {formatCurrency(getSaldoBancarioFundo("reparticao", comp))}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Disponibilidade ({monthShortLabels[monthsList.indexOf(comp)]})</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-xs col-span-2 md:col-span-1">
                      <span className="block text-[9px] font-bold uppercase text-amber-800">Aporte Insuficiência ({monthShortLabels[monthsList.indexOf(comp)]})</span>
                      <span className="text-base font-black text-amber-900">
                        {formatCurrency(getVal("reparticao", "transferenciaRecebida", comp, "Aporte por Insuficiência Financeira"))}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Transferência do Ente</span>
                    </div>
                  </div>

                  {/* Tabela Financeira e Demográfica Completa - Quadro 1 */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-amber-300 shadow-xs">
                    <table className="w-full text-left border-collapse text-[9px]">
                      <thead>
                        <tr className="bg-amber-900 text-white font-bold uppercase tracking-wider">
                          <th className="p-2 border border-amber-800 min-w-[200px]">Discriminação / Competência</th>
                          {monthShortLabels.map((lbl, i) => (
                            <th key={i} className="p-2 border border-amber-800 text-right w-[85px]">{lbl}</th>
                          ))}
                          <th className="p-2 border border-amber-800 text-right bg-amber-950 text-amber-300 font-black w-[105px]">Acumulado Semestre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* DADOS DEMOGRÁFICOS */}
                        <tr className="bg-amber-100/70 font-black text-amber-950 uppercase border-b border-amber-300">
                          <td colSpan={8} className="p-1.5 pl-3">1. QUADRO DEMOGRÁFICO DO FUNDO EM REPARTIÇÃO</td>
                        </tr>
                        <tr className="hover:bg-amber-50/50 border-b border-slate-200">
                          <td className="p-1.5 pl-4 font-semibold text-slate-800">Servidores Ativos (Contribuintes)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-slate-700">{formatNumber(getDemograficosFundo(c).ativosRep)}</td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-amber-50">{formatNumber(getDemograficosFundo(comp).ativosRep)}</td>
                        </tr>
                        <tr className="hover:bg-amber-50/50 border-b border-slate-200">
                          <td className="p-1.5 pl-4 font-semibold text-slate-800">Servidores Inativos e Pensionistas</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-slate-700">{formatNumber(getDemograficosFundo(c).inativosRep)}</td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-amber-50">{formatNumber(getDemograficosFundo(comp).inativosRep)}</td>
                        </tr>
                        <tr className="bg-amber-50 font-bold border-b border-amber-200 text-amber-950">
                          <td className="p-1.5 pl-4 uppercase">Razão Ativos / Inativos (Ativos por Inativo)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-amber-900 font-extrabold">
                              {getDemograficosFundo(c).ratioRep.toFixed(2)}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-amber-950 bg-amber-200/60">
                            {getDemograficosFundo(comp).ratioRep.toFixed(2)}
                          </td>
                        </tr>

                        {/* RECEITAS PRÓPRIAS */}
                        <tr className="bg-amber-100/70 font-black text-amber-950 uppercase border-b border-amber-300">
                          <td colSpan={8} className="p-1.5 pl-3">2. RECEITAS PRÓPRIAS E TRANSFERÊNCIAS RECEBIDAS</td>
                        </tr>
                        {repReceitaCats.map((cat, idx) => {
                          const totalCat = monthsList.reduce((acc, c) => acc + getVal("reparticao", "receita", c, cat), 0);
                          return (
                            <tr key={`rep_rec_${idx}`} className="hover:bg-amber-50/50 border-b border-slate-200">
                              <td className="p-1.5 pl-4 font-medium text-slate-800">{cat}</td>
                              {monthsList.map((c, i) => (
                                <td key={i} className="p-1.5 text-right font-mono text-slate-700">
                                  {formatCurrency(getVal("reparticao", "receita", c, cat))}
                                </td>
                              ))}
                              <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-amber-50/50">
                                {formatCurrency(totalCat)}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Transferência Repartição */}
                        <tr className="bg-amber-100/40 font-bold border-b border-amber-200 text-amber-900">
                          <td className="p-1.5 pl-4 italic">Aporte por Insuficiência Financeira (Transferência do Ente)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-amber-900">
                              {formatCurrency(getVal("reparticao", "transferenciaRecebida", c, "Aporte por Insuficiência Financeira"))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-bold text-amber-950 bg-amber-200/50">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getVal("reparticao", "transferenciaRecebida", c, "Aporte por Insuficiência Financeira"), 0))}
                          </td>
                        </tr>
                        {/* Subtotal Repartição */}
                        <tr className="bg-amber-200/80 font-black text-amber-950 border-b border-amber-400">
                          <td className="p-1.5 uppercase">TOTAL DE RECEITAS E TRANSFERÊNCIAS (REPARTIÇÃO)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-emerald-900 font-black">
                              {formatCurrency(getSubtotalRepRec(c))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-emerald-950 bg-amber-300">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalRepRec(c), 0))}
                          </td>
                        </tr>

                        {/* DESPESAS */}
                        <tr className="bg-amber-100/70 font-black text-amber-950 uppercase border-b border-amber-300">
                          <td colSpan={8} className="p-1.5 pl-3">3. DESPESAS PREVIDENCIÁRIAS REALIZADAS</td>
                        </tr>
                        {repDespesaCats.map((cat, idx) => {
                          const totalCat = monthsList.reduce((acc, c) => acc + getVal("reparticao", "despesa", c, cat), 0);
                          return (
                            <tr key={`rep_desp_${idx}`} className="hover:bg-amber-50/50 border-b border-slate-200">
                              <td className="p-1.5 pl-4 font-medium text-slate-800">{cat}</td>
                              {monthsList.map((c, i) => (
                                <td key={i} className="p-1.5 text-right font-mono text-slate-700">
                                  {formatCurrency(getVal("reparticao", "despesa", c, cat))}
                                </td>
                              ))}
                              <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-amber-50/50">
                                {formatCurrency(totalCat)}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Subtotal Despesas Repartição */}
                        <tr className="bg-red-100/70 font-black text-red-950 border-b border-red-300">
                          <td className="p-1.5 uppercase">TOTAL DAS DESPESAS PREVIDENCIÁRIAS (REPARTIÇÃO)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-red-900 font-black">
                              {formatCurrency(getSubtotalRepDesp(c))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-red-950 bg-red-200">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalRepDesp(c), 0))}
                          </td>
                        </tr>

                        {/* RESULTADO E SALDO BANCÁRIO */}
                        <tr className="bg-amber-100/70 font-black text-amber-950 uppercase border-b border-amber-300">
                          <td colSpan={8} className="p-1.5 pl-3">4. RESULTADO FINANCEIRO E SALDO BANCÁRIO</td>
                        </tr>
                        <tr className="bg-white font-bold border-b border-slate-300">
                          <td className="p-1.5 pl-4 text-slate-900 uppercase">Resultado Financeiro Líquido do Mês</td>
                          {monthsList.map((c, i) => {
                            const res = getSubtotalRepRec(c) - getSubtotalRepDesp(c);
                            return (
                              <td key={i} className={`p-1.5 text-right font-mono font-extrabold ${res >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                {formatCurrency(res)}
                              </td>
                            );
                          })}
                          <td className="p-1.5 text-right font-mono font-black bg-amber-100 text-slate-900">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalRepRec(c) - getSubtotalRepDesp(c)), 0))}
                          </td>
                        </tr>
                        <tr className="bg-slate-900 text-white font-black">
                          <td className="p-2 uppercase text-amber-300">Saldo Bancário / Disponibilidade Financeira</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono text-emerald-300">
                              {formatCurrency(getSaldoBancarioFundo("reparticao", c))}
                            </td>
                          ))}
                          <td className="p-2 text-right font-mono text-amber-300 bg-slate-950 font-black">
                            {formatCurrency(getSaldoBancarioFundo("reparticao", comp))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ================================================================================= */}
                {/* QUADRO 2: FUNDO EM CAPITALIZAÇÃO (FUNDO PREVIDENCIÁRIO)                          */}
                {/* ================================================================================= */}
                <div className="break-inside-avoid border border-blue-300 bg-blue-50/20 rounded-xl p-4 shadow-xs space-y-4">
                  
                  {/* Cabeçalho do Quadro 2 */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2 border-b-2 border-blue-800 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-800 text-white rounded-lg shadow-xs">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase text-blue-950 tracking-tight">
                          QUADRO 2: FUNDO EM CAPITALIZAÇÃO (FUNDO PREVIDENCIÁRIO)
                        </h3>
                        <p className="text-[11px] text-blue-800 font-medium">
                          Regime de Capitalização • Patrimônio Acumulado e Rentabilidade dos Investimentos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded border border-blue-300">
                        Superávit Semestral: {formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalCapRec(c) - getSubtotalCapDesp(c)), 0))}
                      </span>
                    </div>
                  </div>

                  {/* Cards Rápidos de Indicadores - Quadro 2 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    <div className="bg-white p-2.5 rounded-lg border border-blue-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-blue-800">Servidores Ativos</span>
                      <span className="text-base font-black text-blue-950">
                        {formatNumber(getDemograficosFundo(comp).ativosCap)}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Contribuintes em Capitalização</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-blue-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-blue-800">Servidores Inativos</span>
                      <span className="text-base font-black text-blue-950">
                        {formatNumber(getDemograficosFundo(comp).inativosCap)}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Aposentados e Pensionistas</span>
                    </div>

                    <div className="bg-blue-900 text-white p-2.5 rounded-lg shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-blue-200">Razão Ativos / Inativos</span>
                      <span className="text-base font-black text-emerald-300">
                        {getDemograficosFundo(comp).ratioCap.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-blue-100 block">Ativos por Beneficiário</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-blue-200 shadow-xs col-span-2 md:col-span-2">
                      <span className="block text-[9px] font-bold uppercase text-blue-800">Saldo Bancário e Investimentos</span>
                      <span className="text-base font-black text-blue-900">
                        {formatCurrency(getSaldoBancarioFundo("capitalizacao", comp))}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Patrimônio Líquido Acumulado ({monthShortLabels[monthsList.indexOf(comp)]})</span>
                    </div>
                  </div>

                  {/* Tabela Financeira e Demográfica Completa - Quadro 2 */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-blue-300 shadow-xs">
                    <table className="w-full text-left border-collapse text-[9px]">
                      <thead>
                        <tr className="bg-blue-900 text-white font-bold uppercase tracking-wider">
                          <th className="p-2 border border-blue-800 min-w-[200px]">Discriminação / Competência</th>
                          {monthShortLabels.map((lbl, i) => (
                            <th key={i} className="p-2 border border-blue-800 text-right w-[85px]">{lbl}</th>
                          ))}
                          <th className="p-2 border border-blue-800 text-right bg-blue-950 text-emerald-300 font-black w-[105px]">Acumulado Semestre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* DADOS DEMOGRÁFICOS */}
                        <tr className="bg-blue-100/70 font-black text-blue-950 uppercase border-b border-blue-300">
                          <td colSpan={8} className="p-1.5 pl-3">1. QUADRO DEMOGRÁFICO DO FUNDO EM CAPITALIZAÇÃO</td>
                        </tr>
                        <tr className="hover:bg-blue-50/50 border-b border-slate-200">
                          <td className="p-1.5 pl-4 font-semibold text-slate-800">Servidores Ativos (Contribuintes)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-slate-700">{formatNumber(getDemograficosFundo(c).ativosCap)}</td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-blue-50">{formatNumber(getDemograficosFundo(comp).ativosCap)}</td>
                        </tr>
                        <tr className="hover:bg-blue-50/50 border-b border-slate-200">
                          <td className="p-1.5 pl-4 font-semibold text-slate-800">Servidores Inativos e Pensionistas</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-slate-700">{formatNumber(getDemograficosFundo(c).inativosCap)}</td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-blue-50">{formatNumber(getDemograficosFundo(comp).inativosCap)}</td>
                        </tr>
                        <tr className="bg-blue-50 font-bold border-b border-blue-200 text-blue-950">
                          <td className="p-1.5 pl-4 uppercase">Razão Ativos / Inativos (Ativos por Inativo)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-blue-900 font-extrabold">
                              {getDemograficosFundo(c).ratioCap.toFixed(2)}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-blue-950 bg-blue-200/60">
                            {getDemograficosFundo(comp).ratioCap.toFixed(2)}
                          </td>
                        </tr>

                        {/* RECEITAS */}
                        <tr className="bg-blue-100/70 font-black text-blue-950 uppercase border-b border-blue-300">
                          <td colSpan={8} className="p-1.5 pl-3">2. RECEITAS DO FUNDO EM CAPITALIZAÇÃO</td>
                        </tr>
                        {capReceitaCats.map((cat, idx) => {
                          const totalCat = monthsList.reduce((acc, c) => acc + getVal("capitalizacao", "receita", c, cat), 0);
                          return (
                            <tr key={`cap_rec_${idx}`} className="hover:bg-blue-50/50 border-b border-slate-200">
                              <td className="p-1.5 pl-4 font-medium text-slate-800">{cat}</td>
                              {monthsList.map((c, i) => (
                                <td key={i} className="p-1.5 text-right font-mono text-slate-700">
                                  {formatCurrency(getVal("capitalizacao", "receita", c, cat))}
                                </td>
                              ))}
                              <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-blue-50/50">
                                {formatCurrency(totalCat)}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Subtotal Capitalização */}
                        <tr className="bg-blue-200/80 font-black text-blue-950 border-b border-blue-400">
                          <td className="p-1.5 uppercase">TOTAL DE RECEITAS (CAPITALIZAÇÃO)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-emerald-900 font-black">
                              {formatCurrency(getSubtotalCapRec(c))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-emerald-950 bg-blue-300">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalCapRec(c), 0))}
                          </td>
                        </tr>

                        {/* DESPESAS */}
                        <tr className="bg-blue-100/70 font-black text-blue-950 uppercase border-b border-blue-300">
                          <td colSpan={8} className="p-1.5 pl-3">3. DESPESAS PREVIDENCIÁRIAS REALIZADAS</td>
                        </tr>
                        {capDespesaCats.map((cat, idx) => {
                          const totalCat = monthsList.reduce((acc, c) => acc + getVal("capitalizacao", "despesa", c, cat), 0);
                          return (
                            <tr key={`cap_desp_${idx}`} className="hover:bg-blue-50/50 border-b border-slate-200">
                              <td className="p-1.5 pl-4 font-medium text-slate-800">{cat}</td>
                              {monthsList.map((c, i) => (
                                <td key={i} className="p-1.5 text-right font-mono text-slate-700">
                                  {formatCurrency(getVal("capitalizacao", "despesa", c, cat))}
                                </td>
                              ))}
                              <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-blue-50/50">
                                {formatCurrency(totalCat)}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Subtotal Despesas Capitalização */}
                        <tr className="bg-red-100/70 font-black text-red-950 border-b border-red-300">
                          <td className="p-1.5 uppercase">TOTAL DAS DESPESAS PREVIDENCIÁRIAS (CAPITALIZAÇÃO)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-red-900 font-black">
                              {formatCurrency(getSubtotalCapDesp(c))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-red-950 bg-red-200">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalCapDesp(c), 0))}
                          </td>
                        </tr>

                        {/* RESULTADO E SALDO BANCÁRIO */}
                        <tr className="bg-blue-100/70 font-black text-blue-950 uppercase border-b border-blue-300">
                          <td colSpan={8} className="p-1.5 pl-3">4. RESULTADO FINANCEIRO E PATRIMÔNIO ACUMULADO</td>
                        </tr>
                        <tr className="bg-white font-bold border-b border-slate-300">
                          <td className="p-1.5 pl-4 text-slate-900 uppercase">Superávit Financeiro do Mês</td>
                          {monthsList.map((c, i) => {
                            const res = getSubtotalCapRec(c) - getSubtotalCapDesp(c);
                            return (
                              <td key={i} className={`p-1.5 text-right font-mono font-extrabold ${res >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                {formatCurrency(res)}
                              </td>
                            );
                          })}
                          <td className="p-1.5 text-right font-mono font-black bg-blue-100 text-emerald-900">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalCapRec(c) - getSubtotalCapDesp(c)), 0))}
                          </td>
                        </tr>
                        <tr className="bg-slate-900 text-white font-black">
                          <td className="p-2 uppercase text-blue-300">Saldo Bancário / Patrimônio Líquido Acumulado</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono text-emerald-300">
                              {formatCurrency(getSaldoBancarioFundo("capitalizacao", c))}
                            </td>
                          ))}
                          <td className="p-2 text-right font-mono text-amber-300 bg-slate-950 font-black">
                            {formatCurrency(getSaldoBancarioFundo("capitalizacao", comp))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ================================================================================= */}
                {/* QUADRO 3: ÓRGÃO GERENCIADOR (TAXA DE ADMINISTRAÇÃO)                              */}
                {/* ================================================================================= */}
                <div className="break-inside-avoid border border-indigo-300 bg-indigo-50/20 rounded-xl p-4 shadow-xs space-y-4">
                  
                  {/* Cabeçalho do Quadro 3 */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2 border-b-2 border-indigo-800 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-indigo-800 text-white rounded-lg shadow-xs">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase text-indigo-950 tracking-tight">
                          QUADRO 3: ÓRGÃO GERENCIADOR (TAXA DE ADMINISTRAÇÃO)
                        </h3>
                        <p className="text-[11px] text-indigo-800 font-medium">
                          Unidade Gestora • Custos Administrativos e Operacionais de Gestão do RPPS
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <span className="bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded border border-indigo-300">
                        Custo ADM/Segurado: {formatCurrency(getSubtotalOrgDesp(comp) / ((getDemograficosFundo(comp).totalAtivos + getDemograficosFundo(comp).inativosCons) || 1))}/mês
                      </span>
                    </div>
                  </div>

                  {/* Cards Rápidos de Indicadores - Quadro 3 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-indigo-800">Segurados Gerenciados</span>
                      <span className="text-base font-black text-indigo-950">
                        {formatNumber(getDemograficosFundo(comp).totalAtivos + getDemograficosFundo(comp).inativosCons)}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Ativos + Inativos Totais</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-indigo-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-indigo-800">Custo Per Capita Mensal</span>
                      <span className="text-base font-black text-indigo-950">
                        {formatCurrency(getSubtotalOrgDesp(comp) / ((getDemograficosFundo(comp).totalAtivos + getDemograficosFundo(comp).inativosCons) || 1))}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Despesa ADM / Segurado</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-indigo-200 shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-indigo-800">Despesas ADM Acumuladas</span>
                      <span className="text-base font-black text-red-700">
                        {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalOrgDesp(c), 0))}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Total do Semestre</span>
                    </div>

                    <div className="bg-indigo-900 text-white p-2.5 rounded-lg shadow-xs">
                      <span className="block text-[9px] font-bold uppercase text-indigo-200">Saldo Bancário da Taxa ADM</span>
                      <span className="text-base font-black text-emerald-300">
                        {formatCurrency(getSaldoBancarioFundo("orgaoGerenciador", comp))}
                      </span>
                      <span className="text-[9px] text-indigo-100 block">Disponibilidade ({monthShortLabels[monthsList.indexOf(comp)]})</span>
                    </div>
                  </div>

                  {/* Tabela Financeira e Operacional Completa - Quadro 3 */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-indigo-300 shadow-xs">
                    <table className="w-full text-left border-collapse text-[9px]">
                      <thead>
                        <tr className="bg-indigo-900 text-white font-bold uppercase tracking-wider">
                          <th className="p-2 border border-indigo-800 min-w-[200px]">Discriminação / Competência</th>
                          {monthShortLabels.map((lbl, i) => (
                            <th key={i} className="p-2 border border-indigo-800 text-right w-[85px]">{lbl}</th>
                          ))}
                          <th className="p-2 border border-indigo-800 text-right bg-indigo-950 text-indigo-200 font-black w-[105px]">Acumulado Semestre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* RECEITAS */}
                        <tr className="bg-indigo-100/70 font-black text-indigo-950 uppercase border-b border-indigo-300">
                          <td colSpan={8} className="p-1.5 pl-3">1. RECEITAS DA TAXA DE ADMINISTRAÇÃO E TRANSFERÊNCIAS</td>
                        </tr>
                        {orgReceitaCats.map((cat, idx) => {
                          const totalCat = monthsList.reduce((acc, c) => acc + getVal("orgaoGerenciador", "receita", c, cat), 0);
                          return (
                            <tr key={`org_rec_${idx}`} className="hover:bg-indigo-50/50 border-b border-slate-200">
                              <td className="p-1.5 pl-4 font-medium text-slate-800">{cat}</td>
                              {monthsList.map((c, i) => (
                                <td key={i} className="p-1.5 text-right font-mono text-slate-700">
                                  {formatCurrency(getVal("orgaoGerenciador", "receita", c, cat))}
                                </td>
                              ))}
                              <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-indigo-50/50">
                                {formatCurrency(totalCat)}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Transferência Órgão Gerenciador */}
                        <tr className="bg-indigo-100/40 font-bold border-b border-indigo-200 text-indigo-900">
                          <td className="p-1.5 pl-4 italic">Interferência Financeira (Suplementação Administrativa)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-indigo-900">
                              {formatCurrency(getVal("orgaoGerenciador", "transferenciaRecebida", c, "Interferência Financeira"))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-bold text-indigo-950 bg-indigo-200/50">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getVal("orgaoGerenciador", "transferenciaRecebida", c, "Interferência Financeira"), 0))}
                          </td>
                        </tr>
                        {/* Subtotal Órgão Gerenciador */}
                        <tr className="bg-indigo-200/80 font-black text-indigo-950 border-b border-indigo-400">
                          <td className="p-1.5 uppercase">TOTAL DE RECEITAS E TRANSFERÊNCIAS (ÓRGÃO GESTOR)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-emerald-900 font-black">
                              {formatCurrency(getSubtotalOrgRec(c))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-emerald-950 bg-indigo-300">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalOrgRec(c), 0))}
                          </td>
                        </tr>

                        {/* DESPESAS ADMINISTRATIVAS */}
                        <tr className="bg-indigo-100/70 font-black text-indigo-950 uppercase border-b border-indigo-300">
                          <td colSpan={8} className="p-1.5 pl-3">2. DESPESAS ADMINISTRATIVAS REALIZADAS</td>
                        </tr>
                        {orgDespesaCats.map((cat, idx) => {
                          const totalCat = monthsList.reduce((acc, c) => acc + getVal("orgaoGerenciador", "despesa", c, cat), 0);
                          return (
                            <tr key={`org_desp_${idx}`} className="hover:bg-indigo-50/50 border-b border-slate-200">
                              <td className="p-1.5 pl-4 font-medium text-slate-800">{cat}</td>
                              {monthsList.map((c, i) => (
                                <td key={i} className="p-1.5 text-right font-mono text-slate-700">
                                  {formatCurrency(getVal("orgaoGerenciador", "despesa", c, cat))}
                                </td>
                              ))}
                              <td className="p-1.5 text-right font-mono font-bold text-slate-900 bg-indigo-50/50">
                                {formatCurrency(totalCat)}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Subtotal Despesas Órgão Gerenciador */}
                        <tr className="bg-red-100/70 font-black text-red-950 border-b border-red-300">
                          <td className="p-1.5 uppercase">TOTAL DAS DESPESAS ADMINISTRATIVAS (ÓRGÃO GESTOR)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-1.5 text-right font-mono text-red-900 font-black">
                              {formatCurrency(getSubtotalOrgDesp(c))}
                            </td>
                          ))}
                          <td className="p-1.5 text-right font-mono font-black text-red-950 bg-red-200">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalOrgDesp(c), 0))}
                          </td>
                        </tr>

                        {/* RESULTADO E SALDO BANCÁRIO */}
                        <tr className="bg-indigo-100/70 font-black text-indigo-950 uppercase border-b border-indigo-300">
                          <td colSpan={8} className="p-1.5 pl-3">3. RESULTADO OPERACIONAL E DISPONIBILIDADE BANCÁRIA</td>
                        </tr>
                        <tr className="bg-white font-bold border-b border-slate-300">
                          <td className="p-1.5 pl-4 text-slate-900 uppercase">Resultado Financeiro da Taxa ADM no Mês</td>
                          {monthsList.map((c, i) => {
                            const res = getSubtotalOrgRec(c) - getSubtotalOrgDesp(c);
                            return (
                              <td key={i} className={`p-1.5 text-right font-mono font-extrabold ${res >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                {formatCurrency(res)}
                              </td>
                            );
                          })}
                          <td className="p-1.5 text-right font-mono font-black bg-indigo-100 text-slate-900">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalOrgRec(c) - getSubtotalOrgDesp(c)), 0))}
                          </td>
                        </tr>
                        <tr className="bg-slate-900 text-white font-black">
                          <td className="p-2 uppercase text-indigo-300">Saldo Bancário / Disponibilidade da Taxa de ADM</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono text-emerald-300">
                              {formatCurrency(getSaldoBancarioFundo("orgaoGerenciador", c))}
                            </td>
                          ))}
                          <td className="p-2 text-right font-mono text-amber-300 bg-slate-950 font-black">
                            {formatCurrency(getSaldoBancarioFundo("orgaoGerenciador", comp))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ================================================================================= */}
                {/* QUADRO CONSOLIDADO: SÍNTESE EXECUTIVA INTEGRADA DO RPPS                            */}
                {/* ================================================================================= */}
                <div className="break-inside-avoid border-2 border-slate-900 bg-slate-900 text-white rounded-xl p-4 shadow-md space-y-4">
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2 border-b border-slate-700 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-emerald-500 text-slate-950 rounded-lg font-black">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                          QUADRO CONSOLIDADO: SÍNTESE EXECUTIVA DO RPPS (VISÃO INTEGRADA)
                        </h3>
                        <p className="text-[11px] text-slate-300 font-medium">
                          Consolidação de Repartição Simples, Capitalização e Órgão Gerenciador
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-800 px-3 py-1 rounded border border-slate-700">
                      Posição Global em {getMonthName(comp)}
                    </span>
                  </div>

                  <div className="overflow-x-auto bg-slate-950 rounded-lg border border-slate-800">
                    <table className="w-full text-left border-collapse text-[9.5px]">
                      <thead>
                        <tr className="bg-slate-800 text-slate-200 font-bold uppercase tracking-wider border-b border-slate-700">
                          <th className="p-2 border border-slate-700 min-w-[200px]">Indicador Consolidado / Fundo</th>
                          {monthShortLabels.map((lbl, i) => (
                            <th key={i} className="p-2 border border-slate-700 text-right w-[85px]">{lbl}</th>
                          ))}
                          <th className="p-2 border border-slate-700 text-right bg-slate-900 text-amber-300 font-black w-[105px]">Total Semestre</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr>
                          <td className="p-2 font-semibold text-slate-300">Total Servidores Ativos do RPPS</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono text-slate-300">{formatNumber(getDemograficosFundo(c).totalAtivos)}</td>
                          ))}
                          <td className="p-2 text-right font-mono font-bold text-white bg-slate-900">{formatNumber(getDemograficosFundo(comp).totalAtivos)}</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-slate-300">Total Inativos e Pensionistas do RPPS</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono text-slate-300">{formatNumber(getDemograficosFundo(c).inativosCons)}</td>
                          ))}
                          <td className="p-2 text-right font-mono font-bold text-white bg-slate-900">{formatNumber(getDemograficosFundo(comp).inativosCons)}</td>
                        </tr>
                        <tr className="bg-slate-800/80 font-bold text-amber-300">
                          <td className="p-2 uppercase">Razão Demográfica Consolidada (Ativos / Inativos)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono font-black text-emerald-400">
                              {getDemograficosFundo(c).ratioCons.toFixed(2)}
                            </td>
                          ))}
                          <td className="p-2 text-right font-mono font-black text-amber-300 bg-slate-800">
                            {getDemograficosFundo(comp).ratioCons.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-emerald-400">Total de Receitas e Transferências Recebidas</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono text-emerald-400">{formatCurrency(getTotalRecConsolidado(c))}</td>
                          ))}
                          <td className="p-2 text-right font-mono font-bold text-emerald-300 bg-slate-900">{formatCurrency(monthsList.reduce((acc, c) => acc + getTotalRecConsolidado(c), 0))}</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-red-400">Total de Despesas Executadas (Previdência + ADM)</td>
                          {monthsList.map((c, i) => (
                            <td key={i} className="p-2 text-right font-mono text-red-400">{formatCurrency(getTotalDespConsolidado(c))}</td>
                          ))}
                          <td className="p-2 text-right font-mono font-bold text-red-300 bg-slate-900">{formatCurrency(monthsList.reduce((acc, c) => acc + getTotalDespConsolidado(c), 0))}</td>
                        </tr>
                        <tr className="bg-slate-800/90 font-black">
                          <td className="p-2 uppercase text-white">Resultado Financeiro Consolidado do Mês</td>
                          {monthsList.map((c, i) => {
                            const resCons = getTotalRecConsolidado(c) - getTotalDespConsolidado(c);
                            return (
                              <td key={i} className={`p-2 text-right font-mono ${resCons >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {formatCurrency(resCons)}
                              </td>
                            );
                          })}
                          <td className="p-2 text-right font-mono text-amber-300 bg-slate-800 font-black">
                            {formatCurrency(monthsList.reduce((acc, c) => acc + (getTotalRecConsolidado(c) - getTotalDespConsolidado(c)), 0))}
                          </td>
                        </tr>
                        <tr className="bg-amber-400 text-slate-950 font-black text-[10px]">
                          <td className="p-2.5 uppercase tracking-wide">SALDO BANCÁRIO / DISPONIBILIDADES TOTAIS DO RPPS</td>
                          {monthsList.map((c, i) => {
                            const saldoTot = getSaldoBancarioFundo("capitalizacao", c) + getSaldoBancarioFundo("reparticao", c) + getSaldoBancarioFundo("orgaoGerenciador", c);
                            return (
                              <td key={i} className="p-2.5 text-right font-mono font-black">
                                {formatCurrency(saldoTot)}
                              </td>
                            );
                          })}
                          <td className="p-2.5 text-right font-mono font-black bg-amber-300 text-slate-950">
                            {formatCurrency(getSaldoBancarioFundo("capitalizacao", comp) + getSaldoBancarioFundo("reparticao", comp) + getSaldoBancarioFundo("orgaoGerenciador", comp))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 1: CONSOLIDADO GERAL EXECUTIVO                                                  */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "consolidado" && (
            <div className="space-y-6 text-xs">
              
              {/* Executive Indicators Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3 flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-blue-800" />
                  <span>1. Resumo dos Principais Indicadores do Exercício</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Patrimônio Consolidado</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{formatCurrency(currentPatrimonio)}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      {patrimonioGrowth >= 0 ? "+" : ""}{patrimonioGrowth.toFixed(2)}% vs mês anterior
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Rentabilidade da Carteira</span>
                    <span className="text-sm font-black text-blue-900 block mt-0.5">{formatPercent(metaObj?.retornoPercentual)}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">
                      Rendimento: {formatCurrency(totalRendimentoMes)}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Meta Atuarial do Mês</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{formatPercent(metaObj?.metaAtuarialPercentual)}</span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${metaObj?.atingiuMeta ? "text-emerald-700" : "text-amber-700"}`}>
                      {metaObj?.atingiuMeta ? "✓ Meta Atingida" : "⚠ Meta Não Atingida"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Folha de Benefícios</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{formatCurrency(benObj?.valorTotal)}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">
                      {formatNumber(benObj?.totalBeneficiarios)} beneficiários
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Balance Summary */}
              <div className="break-inside-avoid">
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3 flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-blue-800" />
                  <span>2. Movimentação Financeira e Resultado do Mês</span>
                </h3>

                <table className="w-full text-left border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 text-[10px] uppercase font-bold">
                      <th className="p-2 border border-slate-300">Fundo Previdenciário</th>
                      <th className="p-2 border border-slate-300 text-right">Receitas (R$)</th>
                      <th className="p-2 border border-slate-300 text-right">Despesas (R$)</th>
                      <th className="p-2 border border-slate-300 text-right">Resultado do Mês (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-semibold">Fundo Financeiro (Repartição Simples)</td>
                      <td className="p-2 border border-slate-300 text-right text-emerald-800">{formatCurrency(receitasReparticao)}</td>
                      <td className="p-2 border border-slate-300 text-right text-red-800">{formatCurrency(despesasReparticao)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold">{formatCurrency(receitasReparticao - despesasReparticao)}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <td className="p-2 border border-slate-300 font-semibold">Fundo Previdenciário (Capitalização)</td>
                      <td className="p-2 border border-slate-300 text-right text-emerald-800">{formatCurrency(receitasCapitalizacao)}</td>
                      <td className="p-2 border border-slate-300 text-right text-red-800">{formatCurrency(despesasCapitalizacao)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{formatCurrency(receitasCapitalizacao - despesasCapitalizacao)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-semibold">Órgão Gerenciador (Taxa ADM)</td>
                      <td className="p-2 border border-slate-300 text-right text-emerald-800">{formatCurrency(receitasOrgao)}</td>
                      <td className="p-2 border border-slate-300 text-right text-red-800">{formatCurrency(despesasOrgao)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold">{formatCurrency(receitasOrgao - despesasOrgao)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2 border border-slate-300 uppercase">Total Consolidado</td>
                      <td className="p-2 border border-slate-300 text-right text-emerald-900">{formatCurrency(totalReceitas)}</td>
                      <td className="p-2 border border-slate-300 text-right text-red-900">{formatCurrency(totalDespesas)}</td>
                      <td className="p-2 border border-slate-300 text-right text-blue-900">{formatCurrency(saldoFinanceiroMes)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Investments Summary */}
              <div className="break-inside-avoid">
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3 flex items-center space-x-1.5">
                  <Briefcase className="w-4 h-4 text-blue-800" />
                  <span>3. Síntese da Carteira de Investimentos</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Saldo Inicial do Mês:</span>
                      <span className="font-semibold">{formatCurrency(currentPatrimonio - totalRendimentoMes - (totalAplicacoesMes - totalResgatesMes))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Aplicações / Aportes:</span>
                      <span className="font-semibold text-emerald-800">+{formatCurrency(totalAplicacoesMes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Resgates / Desinvestimentos:</span>
                      <span className="font-semibold text-red-800">-{formatCurrency(totalResgatesMes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rendimento do Mês:</span>
                      <span className="font-semibold text-blue-900">+{formatCurrency(totalRendimentoMes)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-300 font-bold text-slate-900">
                      <span>Saldo Final do Mês:</span>
                      <span>{formatCurrency(currentPatrimonio)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ativos em Carteira:</span>
                      <span className="font-semibold">{ativosMes.length} ativos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ativos Estressados:</span>
                      <span className="font-bold text-amber-700">{estressados.length} fundos sob atenção</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Empréstimo Consignado:</span>
                      <span className="font-semibold">{formatCurrency(consgObj?.saldoCarteira)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CRP Vigente:</span>
                      <span className="font-bold text-emerald-800">Em dia (Val. {crp[crp.length - 1]?.validade})</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 2: CARTEIRA DE INVESTIMENTOS                                                   */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "investimentos" && (
            <div className="space-y-6 text-xs">
              
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3">
                  1. Visão Geral da Posição dos Ativos (Resolução CMN nº 4.963/2021)
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Patrimônio de Investimentos</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{formatCurrency(currentPatrimonio)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Rendimento Financeiro Mês</span>
                    <span className="text-sm font-black text-blue-900 block mt-0.5">+{formatCurrency(totalRendimentoMes)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Rentabilidade Percentual</span>
                    <span className="text-sm font-black text-emerald-800 block mt-0.5">{formatPercent(metaObj?.retornoPercentual)}</span>
                  </div>
                </div>

                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold uppercase">
                      <th className="p-1.5 border border-slate-300">Ativo / Fundo</th>
                      <th className="p-1.5 border border-slate-300">Gestor / Admin</th>
                      <th className="p-1.5 border border-slate-300">Enquadramento</th>
                      <th className="p-1.5 border border-slate-300 text-right">Rent. (%)</th>
                      <th className="p-1.5 border border-slate-300 text-right">Rendimento (R$)</th>
                      <th className="p-1.5 border border-slate-300 text-right">Saldo Final (R$)</th>
                      <th className="p-1.5 border border-slate-300 text-right">Part. (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ativosMes.map(({ inv, hist }) => (
                      <tr key={inv.id} className={`border-b border-slate-200 ${inv.ativoEstressado ? "bg-amber-50/50" : ""}`}>
                        <td className="p-1.5 border border-slate-300 font-bold">
                          {inv.nome}
                          {inv.ativoEstressado && <span className="ml-1 text-[9px] text-amber-800 font-semibold">[Estressado]</span>}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-slate-600">{inv.gestor} / {inv.administrador}</td>
                        <td className="p-1.5 border border-slate-300 font-mono text-[9px]">{inv.enquadramento}</td>
                        <td className={`p-1.5 border border-slate-300 text-right font-semibold ${hist.rentabilidadeMes < 0 ? "text-red-700" : "text-emerald-800"}`}>
                          {formatPercentRaw(hist.rentabilidadeMes)}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-semibold">
                          {formatCurrency(hist.rendimentos)}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-bold">
                          {formatCurrency(hist.saldoFinal)}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono">
                          {formatPercent(hist.participacaoCarteira)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stressed Assets Monitoring Section */}
              {estressados.length > 0 && (
                <div className="break-inside-avoid">
                  <h3 className="text-xs font-bold uppercase text-amber-900 border-b border-amber-300 pb-1 mb-2 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>2. Monitoramento de Ativos Estressados / Sob Acompanhamento Especial ({estressados.length})</span>
                  </h3>

                  <table className="w-full text-left border-collapse border border-amber-300 text-[10px]">
                    <thead>
                      <tr className="bg-amber-100 text-amber-900 font-bold uppercase">
                        <th className="p-1.5 border border-amber-300">Fundo</th>
                        <th className="p-1.5 border border-amber-300">CNPJ</th>
                        <th className="p-1.5 border border-amber-300">Segmento</th>
                        <th className="p-1.5 border border-amber-300 text-right">Rendimento Mês</th>
                        <th className="p-1.5 border border-amber-300 text-right">Saldo Atual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estressados.map(({ inv, hist }) => (
                        <tr key={inv.id} className="border-b border-amber-200">
                          <td className="p-1.5 border border-amber-300 font-bold text-amber-950">{inv.nome}</td>
                          <td className="p-1.5 border border-amber-300 font-mono text-[9px]">{inv.cnpj}</td>
                          <td className="p-1.5 border border-amber-300">{inv.segmento}</td>
                          <td className="p-1.5 border border-amber-300 text-right text-red-800 font-semibold">{formatCurrency(hist.rendimentos)}</td>
                          <td className="p-1.5 border border-amber-300 text-right font-bold">{formatCurrency(hist.saldoFinal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 3: META ATUARIAL                                                                */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "meta_atuarial" && (
            <div className="space-y-6 text-xs">
              
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3">
                  1. Acompanhamento Mensal da Meta Atuarial ({selectedCompetence.split("-")[0]})
                </h3>

                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg mb-4 text-slate-800">
                  <p className="font-bold text-blue-900 uppercase">Parâmetro Atuarial Vigente: IPCA + 5,92% a.a.</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    A meta atuarial é a taxa mínima de retorno exigida para assegurar o equilíbrio financeiro e atuarial do plano previdenciário no longo prazo.
                  </p>
                </div>

                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold uppercase">
                      <th className="p-2 border border-slate-300">Competência</th>
                      <th className="p-2 border border-slate-300 text-right">Rent. Carteira (%)</th>
                      <th className="p-2 border border-slate-300 text-right">Rent. (R$)</th>
                      <th className="p-2 border border-slate-300 text-right">Meta Atuarial (%)</th>
                      <th className="p-2 border border-slate-300 text-right">Acum. Carteira (%)</th>
                      <th className="p-2 border border-slate-300 text-right">Acum. Meta (%)</th>
                      <th className="p-2 border border-slate-300 text-center">Atingiu Meta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retornoMetaAtuarial.map(g => (
                      <tr key={g.competencia} className={`border-b border-slate-200 ${g.competencia === comp ? "bg-blue-50 font-bold" : ""}`}>
                        <td className="p-1.5 border border-slate-300 font-mono">{g.competencia}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-semibold">{formatPercent(g.retornoPercentual)}</td>
                        <td className="p-1.5 border border-slate-300 text-right">{formatCurrency(g.retornoValor)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-semibold">{formatPercent(g.metaAtuarialPercentual)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-bold text-blue-900">{formatPercent(g.retornoAcumulado)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-bold text-slate-700">{formatPercent(g.metaAcumulada)}</td>
                        <td className="p-1.5 border border-slate-300 text-center font-bold">
                          {g.atingiuMeta ? (
                            <span className="text-emerald-800 uppercase">Sim</span>
                          ) : (
                            <span className="text-amber-800 uppercase">Não</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Historical Annual Benchmarks */}
              <div className="break-inside-avoid">
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  2. Histórico Anual da Rentabilidade x Meta Atuarial (2022 - 2026)
                </h3>

                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold uppercase">
                      <th className="p-1.5 border border-slate-300">Exercício</th>
                      <th className="p-1.5 border border-slate-300">Fórmula Meta</th>
                      <th className="p-1.5 border border-slate-300 text-right">Retorno da Carteira (%)</th>
                      <th className="p-1.5 border border-slate-300 text-right">Meta Atuarial (%)</th>
                      <th className="p-1.5 border border-slate-300 text-center">Status Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retornoMetaAtuarialHistorico.map(h => (
                      <tr key={h.exercicio} className="border-b border-slate-200">
                        <td className="p-1.5 border border-slate-300 font-bold">{h.exercicio}</td>
                        <td className="p-1.5 border border-slate-300">{h.metaAtuarialFormula}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-bold text-blue-900">{formatPercent(h.retornoPercentual)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-bold">{formatPercent(h.metaAtuarialPercentual)}</td>
                        <td className="p-1.5 border border-slate-300 text-center font-bold">
                          {h.atingiuMeta ? (
                            <span className="text-emerald-800">SUPERADA</span>
                          ) : (
                            <span className="text-amber-800">ABAIXO DA META</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 4: CONTÁBIL & FINANCEIRO                                                       */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "contabil" && (
            <div className="space-y-6 text-xs">
              
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3">
                  1. Balancete de Execução Orçamentária e Financeira por Fundo
                </h3>

                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold uppercase">
                      <th className="p-2 border border-slate-300">Categoria Contábil / Origem</th>
                      <th className="p-2 border border-slate-300 text-right">Repartição Simples</th>
                      <th className="p-2 border border-slate-300 text-right">Capitalização</th>
                      <th className="p-2 border border-slate-300 text-right">Órgão Gerenciador</th>
                      <th className="p-2 border border-slate-300 text-right">Total Consolidado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-semibold text-emerald-900">1. Receitas de Contribuição & Aportes</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(receitasReparticao)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(receitasCapitalizacao)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(receitasOrgao)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-emerald-900">{formatCurrency(totalReceitas)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-semibold text-red-900">2. Despesas Previdenciárias & Folha</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(despesasReparticao)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(despesasCapitalizacao)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(despesasOrgao)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-red-900">{formatCurrency(totalDespesas)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold text-[11px]">
                      <td className="p-2 border border-slate-300 uppercase">Resultado Financeiro Líquido</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(receitasReparticao - despesasReparticao)}</td>
                      <td className="p-2 border border-slate-300 text-right text-emerald-800">{formatCurrency(receitasCapitalizacao - despesasCapitalizacao)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(receitasOrgao - despesasOrgao)}</td>
                      <td className="p-2 border border-slate-300 text-right text-blue-900">{formatCurrency(saldoFinanceiroMes)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Movement details */}
              <div className="break-inside-avoid">
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  2. Detalhamento dos Lançamentos Financeiros da Competência
                </h3>

                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold uppercase">
                      <th className="p-1.5 border border-slate-300">Fundo</th>
                      <th className="p-1.5 border border-slate-300">Categoria / Histórico</th>
                      <th className="p-1.5 border border-slate-300">Tipo</th>
                      <th className="p-1.5 border border-slate-300 text-right">Valor (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyMov.map((m, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="p-1.5 border border-slate-300 font-mono uppercase">{m.fundo}</td>
                        <td className="p-1.5 border border-slate-300 font-semibold">{m.categoria}</td>
                        <td className="p-1.5 border border-slate-300 uppercase">
                          {m.tipo === "receita" ? <span className="text-emerald-800 font-bold">Receita</span> : <span className="text-red-800 font-bold">Despesa</span>}
                        </td>
                        <td className={`p-1.5 border border-slate-300 text-right font-bold ${m.tipo === "receita" ? "text-emerald-800" : "text-red-800"}`}>
                          {m.tipo === "receita" ? "+" : "-"}{formatCurrency(m.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 5: BENEFÍCIOS PREVIDENCIÁRIOS                                                  */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "beneficios" && (
            <div className="space-y-6 text-xs">
              
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3">
                  1. Quadro de Beneficiários e Folha de Pagamento ({getMonthName(comp)})
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Aposentados</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{formatNumber(benObj?.aposentados)}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">{formatCurrency(benObj?.valorAposentados)}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Pensionistas</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{formatNumber(benObj?.pensionistas)}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">{formatCurrency(benObj?.valorPensionistas)}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Geral Benefícios</span>
                    <span className="text-sm font-black text-blue-900 block mt-0.5">{formatNumber(benObj?.totalBeneficiarios)}</span>
                    <span className="text-[10px] font-bold text-blue-900 block mt-0.5">{formatCurrency(benObj?.valorTotal)}</span>
                  </div>
                </div>

                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold uppercase">
                      <th className="p-2 border border-slate-300">Plano / Fundo</th>
                      <th className="p-2 border border-slate-300 text-right">Aposentados</th>
                      <th className="p-2 border border-slate-300 text-right">Valor Aposentadorias (R$)</th>
                      <th className="p-2 border border-slate-300 text-right">Pensionistas</th>
                      <th className="p-2 border border-slate-300 text-right">Valor Pensões (R$)</th>
                      <th className="p-2 border border-slate-300 text-right">Total Folha (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-bold">Fundo Financeiro (Repartição)</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{formatNumber(benReparticaoObj?.aposentados)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(benReparticaoObj?.valorAposentados)}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{formatNumber(benReparticaoObj?.pensionistas)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(benReparticaoObj?.valorPensionistas)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold">{formatCurrency(benReparticaoObj?.valorTotal)}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <td className="p-2 border border-slate-300 font-bold">Fundo Previdenciário (Capitalização)</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{formatNumber(benCapObj?.aposentados)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(benCapObj?.valorAposentados)}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{formatNumber(benCapObj?.pensionistas)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(benCapObj?.valorPensionistas)}</td>
                      <td className="p-2 border border-slate-300 text-right font-bold">{formatCurrency(benCapObj?.valorTotal)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2 border border-slate-300 uppercase">Consolidado Geral</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{formatNumber(benObj?.aposentados)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(benObj?.valorAposentados)}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{formatNumber(benObj?.pensionistas)}</td>
                      <td className="p-2 border border-slate-300 text-right">{formatCurrency(benObj?.valorPensionistas)}</td>
                      <td className="p-2 border border-slate-300 text-right text-blue-900">{formatCurrency(benObj?.valorTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Servidores e Concessões */}
              <div className="break-inside-avoid">
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  2. Demografia Previdenciária & Novas Concessões do Mês
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1">
                    <p className="font-bold text-slate-800 uppercase text-[10px] mb-1">Massa de Servidores Ativos</p>
                    <div className="flex justify-between">
                      <span>Servidores Ativos Contribuintes:</span>
                      <span className="font-bold text-slate-900">{formatNumber(segObj?.quantidadeAtivos)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Servidores Inativos (Aposentados + Pensionistas):</span>
                      <span className="font-bold text-slate-900">{formatNumber(benObj?.totalBeneficiarios)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-300 font-semibold text-blue-900">
                      <span>Razão de Dependência (Ativo / Inativo):</span>
                      <span>{((segObj?.quantidadeAtivos || 1) / (benObj?.totalBeneficiarios || 1)).toFixed(2)} ativos p/ inativo</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1">
                    <p className="font-bold text-slate-800 uppercase text-[10px] mb-1">Concessões no Mês ({comp})</p>
                    <div className="flex justify-between">
                      <span>Novas Aposentadorias Concedidas:</span>
                      <span className="font-bold text-emerald-800">+{benObj?.novosAposentados || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Novas Pensões Concedidas:</span>
                      <span className="font-bold text-emerald-800">+{benObj?.novosPensionistas || 0}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-300 font-semibold text-slate-900">
                      <span>Total Novas Concessões:</span>
                      <span>{(benObj?.novosAposentados || 0) + (benObj?.novosPensionistas || 0)} benefícios</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 6: COMPREV                                                                      */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "comprev" && (
            <div className="space-y-6 text-xs">
              
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3">
                  1. Posicionamento de Compensação Previdenciária (COMPREV / RGPS)
                </h3>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 space-y-1 text-[11px]">
                  <p className="font-bold text-slate-900">Maringá Previdência • Gestão do Sistema COMPREV</p>
                  <p className="text-slate-600">
                    A compensação previdenciária atua no acerto de contas entre o Regime Geral de Previdência Social (INSS/RGPS) e o RPPS de Maringá referente ao tempo de contribuição averbado pelos servidores.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Fluxo Mensal Recebido</span>
                    <span className="text-sm font-black text-emerald-800 block mt-0.5">{formatCurrency(1850420.15)}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Repasse regular INSS</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Estoque de Processos em Análise</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">342 requerimentos</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Junto ao DATAPREV</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Estoque Homologado Previsto</span>
                    <span className="text-sm font-black text-blue-900 block mt-0.5">{formatCurrency(14280900.00)}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Crédito futuro acumulado</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* THEME 7: CONSIGNADO                                                                   */}
          {/* ------------------------------------------------------------------------------------- */}
          {reportType === "consignado" && (
            <div className="space-y-6 text-xs">
              
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-3">
                  1. Posição da Carteira de Crédito Consignado Própria (Art. 12 da Res. CMN 4.963/2021)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Saldo Atual Carteira</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{formatCurrency(consgObj?.saldoCarteira)}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Contratos Ativos</span>
                    <span className="text-sm font-black text-blue-900 block mt-0.5">{formatNumber(consgObj?.quantidadeContratos)}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Prazo Médio</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">{consgObj?.prazoMedio || 72} meses</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Amortizações no Mês</span>
                    <span className="text-sm font-black text-emerald-800 block mt-0.5">{formatCurrency(consgObj?.valorAmortizado)}</span>
                  </div>
                </div>

                <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold uppercase">
                      <th className="p-2 border border-slate-300">Item de Movimentação</th>
                      <th className="p-2 border border-slate-300 text-right">Valor no Mês (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-semibold">Saldo Inicial da Carteira</td>
                      <td className="p-2 border border-slate-300 text-right font-mono">{formatCurrency(consgObj?.saldoInicial)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 text-emerald-800 font-semibold">(+) Novos Empréstimos Concedidos</td>
                      <td className="p-2 border border-slate-300 text-right text-emerald-800 font-mono">+{formatCurrency(consgObj?.valorEmprestado)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 text-red-800 font-semibold">(-) Amortizações Recebidas em Folha</td>
                      <td className="p-2 border border-slate-300 text-right text-red-800 font-mono">-{formatCurrency(consgObj?.valorAmortizado)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold text-[11px]">
                      <td className="p-2 border border-slate-300 uppercase">(=) Saldo Final do Crédito Consignado</td>
                      <td className="p-2 border border-slate-300 text-right text-blue-900 font-mono">{formatCurrency(consgObj?.saldoCarteira)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* COMMON SECTION: PARECER TÉCNICO / OBSERVAÇÕES DA DIRETORIA                            */}
          {/* ------------------------------------------------------------------------------------- */}
          {showNotes && (
            <div className="pt-4 border-t border-slate-300 break-inside-avoid">
              <h4 className="text-[11px] font-bold uppercase text-slate-800 mb-1 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Parecer Técnico & Considerações do Gestor</span>
              </h4>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded text-[11px] text-slate-800 leading-relaxed font-serif italic">
                "{customNotes}"
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------------------------- */}
          {/* COMMON SECTION: SIGNATURE BLOCK                                                       */}
          {/* ------------------------------------------------------------------------------------- */}
          {showSignatures && (
            <div className="pt-8 border-t-2 border-slate-900 break-inside-avoid space-y-6">
              <div className="text-center text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Termo de Encerramento e Homologação das Informações Prestadas
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-[10px]">
                <div className="space-y-1">
                  <div className="border-b border-slate-800 pb-1">
                    <p className="font-bold text-slate-900">Diretor Presidente</p>
                  </div>
                  <p className="text-slate-500">Maringá Previdência</p>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-slate-800 pb-1">
                    <p className="font-bold text-slate-900">Diretor de Investimentos</p>
                  </div>
                  <p className="text-slate-500">Certificado CGRPPS / ANBIMA</p>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-slate-800 pb-1">
                    <p className="font-bold text-slate-900">Contador Responsável</p>
                  </div>
                  <p className="text-slate-500">CRC / PR</p>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-slate-800 pb-1">
                    <p className="font-bold text-slate-900">Comitê / Conselho Fiscal</p>
                  </div>
                  <p className="text-slate-500">Representante do Colegiado</p>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-400 font-mono pt-2">
                Documento emitido eletronicamente pelo SGE Maringá Previdência em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}.
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
