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
import maringaLogo from "../assets/images/maringa_prev_logo_new_1784335339502.jpg";
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

      return `
========================================================================
MARINGÁ PREVIDÊNCIA - PORTAL EXECUTIVO SGE
${titleMap[reportType]}
Período Analisado: Janeiro/2026 a Junho/2026 (Mês a Mês)
Data de Emissão: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
========================================================================

1. RESUMO CONSOLIDADO ACUMULADO NO SEMESTRE:
- Total das Receitas e Transferências Recebidas: ${formatCurrency(totRecSemestre)}
- Total das Despesas Realizadas: ${formatCurrency(totDespSemestre)}
- Resultado Financeiro Consolidado (Superávit/Déficit): ${formatCurrency(resultadoSemestre)}

2. RECEITAS E TRANSFERÊNCIAS POR FUNDO (EVOLUÇÃO MENSAL):
${monthsList.map((m, idx) => `
[${monthShortLabels[idx]}]
- Repartição Simples (Receitas + Transferências): ${formatCurrency(getSubtotalRepRec(m))}
- Capitalização (Receitas): ${formatCurrency(getSubtotalCapRec(m))}
- Órgão Gerenciador (Receitas + Transferências): ${formatCurrency(getSubtotalOrgRec(m))}
- Total do Mês: ${formatCurrency(getTotalRecConsolidado(m))}
`).join("")}

3. DESPESAS POR FUNDO (EVOLUÇÃO MENSAL):
${monthsList.map((m, idx) => `
[${monthShortLabels[idx]}]
- Repartição Simples (Benefícios): ${formatCurrency(getSubtotalRepDesp(m))}
- Capitalização (Benefícios): ${formatCurrency(getSubtotalCapDesp(m))}
- Órgão Gerenciador (ADM): ${formatCurrency(getSubtotalOrgDesp(m))}
- Total do Mês: ${formatCurrency(getTotalDespConsolidado(m))}
`).join("")}

4. OBSERVAÇÕES E PARECER TÉCNICO:
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
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Instituto de Previdência dos Servidores Públicos do Município de Maringá</p>
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
              
              {/* Quadro 1: Receitas e Transferências Recebidas */}
              <div className="break-inside-avoid">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1 mb-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Quadro 1: Demonstrativo de Receitas e Transferências Recebidas (Mês a Mês)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Valores em Reais (R$)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-300 text-[9px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-900 font-bold uppercase tracking-wider">
                        <th className="p-1.5 border border-slate-300 min-w-[180px]">Fundo / Categoria de Receita</th>
                        {monthShortLabels.map((lbl, i) => (
                          <th key={i} className="p-1.5 border border-slate-300 text-right w-[85px]">{lbl}</th>
                        ))}
                        <th className="p-1.5 border border-slate-300 text-right bg-slate-300 text-slate-950 font-black w-[100px]">Total Semestre</th>
                      </tr>
                    </thead>
                    <tbody>

                      {/* --- REPARTIÇÃO SIMPLES --- */}
                      <tr className="bg-slate-100 font-black text-slate-900 uppercase">
                        <td colSpan={8} className="p-1.5 border border-slate-300 bg-amber-50/80 text-amber-950">
                          1. FUNDO FINANCEIRO (REPARTIÇÃO SIMPLES)
                        </td>
                      </tr>
                      {repReceitaCats.map((cat, idx) => {
                        const totalCat = monthsList.reduce((acc, c) => acc + getVal("reparticao", "receita", c, cat), 0);
                        return (
                          <tr key={`rep_rec_${idx}`} className="hover:bg-slate-50 border-b border-slate-200">
                            <td className="p-1.5 border border-slate-300 pl-4 font-medium text-slate-800">{cat}</td>
                            {monthsList.map((c, i) => (
                              <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-slate-700">
                                {formatCurrency(getVal("reparticao", "receita", c, cat))}
                              </td>
                            ))}
                            <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-slate-900 bg-slate-50">
                              {formatCurrency(totalCat)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Transferência Repartição */}
                      <tr className="hover:bg-slate-50 border-b border-slate-200 bg-amber-50/30">
                        <td className="p-1.5 border border-slate-300 pl-4 font-medium text-amber-900 italic">
                          Aporte por Insuficiência Financeira (Transferência)
                        </td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-amber-900">
                            {formatCurrency(getVal("reparticao", "transferenciaRecebida", c, "Aporte por Insuficiência Financeira"))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-amber-950 bg-amber-100/50">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getVal("reparticao", "transferenciaRecebida", c, "Aporte por Insuficiência Financeira"), 0))}
                        </td>
                      </tr>
                      {/* Subtotal Repartição */}
                      <tr className="bg-slate-200 font-bold text-slate-900">
                        <td className="p-1.5 border border-slate-300 uppercase">Subtotal Receitas - Repartição Simples</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-emerald-800 font-extrabold">
                            {formatCurrency(getSubtotalRepRec(c))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-emerald-900 bg-slate-300">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalRepRec(c), 0))}
                        </td>
                      </tr>

                      {/* --- CAPITALIZAÇÃO --- */}
                      <tr className="bg-slate-100 font-black text-slate-900 uppercase">
                        <td colSpan={8} className="p-1.5 border border-slate-300 bg-blue-50/80 text-blue-950">
                          2. FUNDO PREVIDENCIÁRIO (CAPITALIZAÇÃO)
                        </td>
                      </tr>
                      {capReceitaCats.map((cat, idx) => {
                        const totalCat = monthsList.reduce((acc, c) => acc + getVal("capitalizacao", "receita", c, cat), 0);
                        return (
                          <tr key={`cap_rec_${idx}`} className="hover:bg-slate-50 border-b border-slate-200">
                            <td className="p-1.5 border border-slate-300 pl-4 font-medium text-slate-800">{cat}</td>
                            {monthsList.map((c, i) => (
                              <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-slate-700">
                                {formatCurrency(getVal("capitalizacao", "receita", c, cat))}
                              </td>
                            ))}
                            <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-slate-900 bg-slate-50">
                              {formatCurrency(totalCat)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Subtotal Capitalização */}
                      <tr className="bg-slate-200 font-bold text-slate-900">
                        <td className="p-1.5 border border-slate-300 uppercase">Subtotal Receitas - Capitalização</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-emerald-800 font-extrabold">
                            {formatCurrency(getSubtotalCapRec(c))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-emerald-900 bg-slate-300">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalCapRec(c), 0))}
                        </td>
                      </tr>

                      {/* --- ÓRGÃO GERENCIADOR --- */}
                      <tr className="bg-slate-100 font-black text-slate-900 uppercase">
                        <td colSpan={8} className="p-1.5 border border-slate-300 bg-indigo-50/80 text-indigo-950">
                          3. ÓRGÃO GERENCIADOR (TAXA DE ADMINISTRAÇÃO)
                        </td>
                      </tr>
                      {orgReceitaCats.map((cat, idx) => {
                        const totalCat = monthsList.reduce((acc, c) => acc + getVal("orgaoGerenciador", "receita", c, cat), 0);
                        return (
                          <tr key={`org_rec_${idx}`} className="hover:bg-slate-50 border-b border-slate-200">
                            <td className="p-1.5 border border-slate-300 pl-4 font-medium text-slate-800">{cat}</td>
                            {monthsList.map((c, i) => (
                              <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-slate-700">
                                {formatCurrency(getVal("orgaoGerenciador", "receita", c, cat))}
                              </td>
                            ))}
                            <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-slate-900 bg-slate-50">
                              {formatCurrency(totalCat)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Transferência Órgão Gerenciador */}
                      <tr className="hover:bg-slate-50 border-b border-slate-200 bg-indigo-50/30">
                        <td className="p-1.5 border border-slate-300 pl-4 font-medium text-indigo-900 italic">
                          Interferência Financeira (Transferência)
                        </td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-indigo-900">
                            {formatCurrency(getVal("orgaoGerenciador", "transferenciaRecebida", c, "Interferência Financeira"))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-indigo-950 bg-indigo-100/50">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getVal("orgaoGerenciador", "transferenciaRecebida", c, "Interferência Financeira"), 0))}
                        </td>
                      </tr>
                      {/* Subtotal Órgão Gerenciador */}
                      <tr className="bg-slate-200 font-bold text-slate-900">
                        <td className="p-1.5 border border-slate-300 uppercase">Subtotal Receitas - Órgão Gerenciador</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-emerald-800 font-extrabold">
                            {formatCurrency(getSubtotalOrgRec(c))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-emerald-900 bg-slate-300">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalOrgRec(c), 0))}
                        </td>
                      </tr>

                      {/* --- TOTAL CONSOLIDADO DE RECEITAS --- */}
                      <tr className="bg-blue-900 text-white font-black text-[10px] uppercase">
                        <td className="p-2 border border-slate-900">TOTAL CONSOLIDADO DE RECEITAS E TRANSFERÊNCIAS</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-2 border border-slate-900 text-right font-mono text-emerald-300">
                            {formatCurrency(getTotalRecConsolidado(c))}
                          </td>
                        ))}
                        <td className="p-2 border border-slate-900 text-right font-mono text-yellow-300 bg-blue-950 font-black">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getTotalRecConsolidado(c), 0))}
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quadro 2: Despesas Previdenciárias e Administrativas */}
              <div className="break-inside-avoid">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1 mb-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 flex items-center space-x-1.5">
                    <Coins className="w-4 h-4 text-red-700" />
                    <span>Quadro 2: Demonstrativo de Despesas Previdenciárias e Administrativas (Mês a Mês)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Valores em Reais (R$)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-300 text-[9px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-900 font-bold uppercase tracking-wider">
                        <th className="p-1.5 border border-slate-300 min-w-[180px]">Fundo / Categoria de Despesa</th>
                        {monthShortLabels.map((lbl, i) => (
                          <th key={i} className="p-1.5 border border-slate-300 text-right w-[85px]">{lbl}</th>
                        ))}
                        <th className="p-1.5 border border-slate-300 text-right bg-slate-300 text-slate-950 font-black w-[100px]">Total Semestre</th>
                      </tr>
                    </thead>
                    <tbody>

                      {/* --- REPARTIÇÃO SIMPLES DESPESAS --- */}
                      <tr className="bg-slate-100 font-black text-slate-900 uppercase">
                        <td colSpan={8} className="p-1.5 border border-slate-300 bg-amber-50/80 text-amber-950">
                          1. FUNDO FINANCEIRO (REPARTIÇÃO SIMPLES)
                        </td>
                      </tr>
                      {repDespesaCats.map((cat, idx) => {
                        const totalCat = monthsList.reduce((acc, c) => acc + getVal("reparticao", "despesa", c, cat), 0);
                        return (
                          <tr key={`rep_desp_${idx}`} className="hover:bg-slate-50 border-b border-slate-200">
                            <td className="p-1.5 border border-slate-300 pl-4 font-medium text-slate-800">{cat}</td>
                            {monthsList.map((c, i) => (
                              <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-slate-700">
                                {formatCurrency(getVal("reparticao", "despesa", c, cat))}
                              </td>
                            ))}
                            <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-slate-900 bg-slate-50">
                              {formatCurrency(totalCat)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Subtotal Repartição Despesas */}
                      <tr className="bg-slate-200 font-bold text-slate-900">
                        <td className="p-1.5 border border-slate-300 uppercase">Subtotal Despesas - Repartição Simples</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-red-800 font-extrabold">
                            {formatCurrency(getSubtotalRepDesp(c))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-red-900 bg-slate-300">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalRepDesp(c), 0))}
                        </td>
                      </tr>

                      {/* --- CAPITALIZAÇÃO DESPESAS --- */}
                      <tr className="bg-slate-100 font-black text-slate-900 uppercase">
                        <td colSpan={8} className="p-1.5 border border-slate-300 bg-blue-50/80 text-blue-950">
                          2. FUNDO PREVIDENCIÁRIO (CAPITALIZAÇÃO)
                        </td>
                      </tr>
                      {capDespesaCats.map((cat, idx) => {
                        const totalCat = monthsList.reduce((acc, c) => acc + getVal("capitalizacao", "despesa", c, cat), 0);
                        return (
                          <tr key={`cap_desp_${idx}`} className="hover:bg-slate-50 border-b border-slate-200">
                            <td className="p-1.5 border border-slate-300 pl-4 font-medium text-slate-800">{cat}</td>
                            {monthsList.map((c, i) => (
                              <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-slate-700">
                                {formatCurrency(getVal("capitalizacao", "despesa", c, cat))}
                              </td>
                            ))}
                            <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-slate-900 bg-slate-50">
                              {formatCurrency(totalCat)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Subtotal Capitalização Despesas */}
                      <tr className="bg-slate-200 font-bold text-slate-900">
                        <td className="p-1.5 border border-slate-300 uppercase">Subtotal Despesas - Capitalização</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-red-800 font-extrabold">
                            {formatCurrency(getSubtotalCapDesp(c))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-red-900 bg-slate-300">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalCapDesp(c), 0))}
                        </td>
                      </tr>

                      {/* --- ÓRGÃO GERENCIADOR DESPESAS --- */}
                      <tr className="bg-slate-100 font-black text-slate-900 uppercase">
                        <td colSpan={8} className="p-1.5 border border-slate-300 bg-indigo-50/80 text-indigo-950">
                          3. ÓRGÃO GERENCIADOR (TAXA DE ADMINISTRAÇÃO)
                        </td>
                      </tr>
                      {orgDespesaCats.map((cat, idx) => {
                        const totalCat = monthsList.reduce((acc, c) => acc + getVal("orgaoGerenciador", "despesa", c, cat), 0);
                        return (
                          <tr key={`org_desp_${idx}`} className="hover:bg-slate-50 border-b border-slate-200">
                            <td className="p-1.5 border border-slate-300 pl-4 font-medium text-slate-800">{cat}</td>
                            {monthsList.map((c, i) => (
                              <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-slate-700">
                                {formatCurrency(getVal("orgaoGerenciador", "despesa", c, cat))}
                              </td>
                            ))}
                            <td className="p-1.5 border border-slate-300 text-right font-mono font-bold text-slate-900 bg-slate-50">
                              {formatCurrency(totalCat)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Subtotal Órgão Gerenciador Despesas */}
                      <tr className="bg-slate-200 font-bold text-slate-900">
                        <td className="p-1.5 border border-slate-300 uppercase">Subtotal Despesas - Órgão Gerenciador</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-1.5 border border-slate-300 text-right font-mono text-red-800 font-extrabold">
                            {formatCurrency(getSubtotalOrgDesp(c))}
                          </td>
                        ))}
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-red-900 bg-slate-300">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getSubtotalOrgDesp(c), 0))}
                        </td>
                      </tr>

                      {/* --- TOTAL CONSOLIDADO DE DESPESAS --- */}
                      <tr className="bg-slate-900 text-white font-black text-[10px] uppercase">
                        <td className="p-2 border border-slate-900">TOTAL CONSOLIDADO DE DESPESAS</td>
                        {monthsList.map((c, i) => (
                          <td key={i} className="p-2 border border-slate-900 text-right font-mono text-red-300">
                            {formatCurrency(getTotalDespConsolidado(c))}
                          </td>
                        ))}
                        <td className="p-2 border border-slate-900 text-right font-mono text-red-200 bg-slate-950 font-black">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + getTotalDespConsolidado(c), 0))}
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quadro 3: Resultado Financeiro (Superávit / Déficit) */}
              <div className="break-inside-avoid">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1 mb-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 flex items-center space-x-1.5">
                    <Scale className="w-4 h-4 text-blue-900" />
                    <span>Quadro 3: Resultado Financeiro por Fundo e Consolidado (Mês a Mês)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">(Receitas + Transferências) - Despesas</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-300 text-[9.5px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-900 font-bold uppercase tracking-wider">
                        <th className="p-2 border border-slate-300 min-w-[180px]">Fundo Previdenciário / Administrativo</th>
                        {monthShortLabels.map((lbl, i) => (
                          <th key={i} className="p-2 border border-slate-300 text-right w-[85px]">{lbl}</th>
                        ))}
                        <th className="p-2 border border-slate-300 text-right bg-slate-300 text-slate-950 font-black w-[100px]">Resultado Semestre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Repartição */}
                      <tr className="hover:bg-slate-50 border-b border-slate-200">
                        <td className="p-2 border border-slate-300 font-bold text-slate-800">1. Fundo Financeiro (Repartição Simples)</td>
                        {monthsList.map((c, i) => {
                          const res = getSubtotalRepRec(c) - getSubtotalRepDesp(c);
                          return (
                            <td key={i} className={`p-2 border border-slate-300 text-right font-mono font-bold ${res >= 0 ? "text-emerald-800" : "text-red-800"}`}>
                              {formatCurrency(res)}
                            </td>
                          );
                        })}
                        <td className="p-2 border border-slate-300 text-right font-mono font-black bg-slate-100 text-slate-900">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalRepRec(c) - getSubtotalRepDesp(c)), 0))}
                        </td>
                      </tr>

                      {/* Capitalização */}
                      <tr className="hover:bg-slate-50 border-b border-slate-200">
                        <td className="p-2 border border-slate-300 font-bold text-slate-800">2. Fundo Previdenciário (Capitalização)</td>
                        {monthsList.map((c, i) => {
                          const res = getSubtotalCapRec(c) - getSubtotalCapDesp(c);
                          return (
                            <td key={i} className={`p-2 border border-slate-300 text-right font-mono font-bold ${res >= 0 ? "text-emerald-800" : "text-red-800"}`}>
                              {formatCurrency(res)}
                            </td>
                          );
                        })}
                        <td className="p-2 border border-slate-300 text-right font-mono font-black bg-slate-100 text-emerald-900">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalCapRec(c) - getSubtotalCapDesp(c)), 0))}
                        </td>
                      </tr>

                      {/* Órgão Gerenciador */}
                      <tr className="hover:bg-slate-50 border-b border-slate-200">
                        <td className="p-2 border border-slate-300 font-bold text-slate-800">3. Órgão Gerenciador (Taxa de Administração)</td>
                        {monthsList.map((c, i) => {
                          const res = getSubtotalOrgRec(c) - getSubtotalOrgDesp(c);
                          return (
                            <td key={i} className={`p-2 border border-slate-300 text-right font-mono font-bold ${res >= 0 ? "text-emerald-800" : "text-red-800"}`}>
                              {formatCurrency(res)}
                            </td>
                          );
                        })}
                        <td className="p-2 border border-slate-300 text-right font-mono font-black bg-slate-100 text-slate-900">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + (getSubtotalOrgRec(c) - getSubtotalOrgDesp(c)), 0))}
                        </td>
                      </tr>

                      {/* RESULTADO CONSOLIDADO */}
                      <tr className="bg-slate-900 text-white font-black text-[10.5px] uppercase">
                        <td className="p-2 border border-slate-900">RESULTADO LIQUIDO CONSOLIDADO DO RPPS</td>
                        {monthsList.map((c, i) => {
                          const resCons = getTotalRecConsolidado(c) - getTotalDespConsolidado(c);
                          return (
                            <td key={i} className={`p-2 border border-slate-900 text-right font-mono ${resCons >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                              {formatCurrency(resCons)}
                            </td>
                          );
                        })}
                        <td className="p-2 border border-slate-900 text-right font-mono text-amber-300 bg-slate-950 font-black">
                          {formatCurrency(monthsList.reduce((acc, c) => acc + (getTotalRecConsolidado(c) - getTotalDespConsolidado(c)), 0))}
                        </td>
                      </tr>

                    </tbody>
                  </table>
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
