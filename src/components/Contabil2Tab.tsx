import React, { useState, useMemo } from "react";
import { movimentacoesFinanceiras } from "../data";
import { formatCurrency } from "../utils";
import { 
  Scale, 
  PiggyBank, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building, 
  TrendingUp, 
  Wallet,
  Coins
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Contabil2TabProps {
  competence: string;
}

type FundoType = "consolidado" | "capitalizacao" | "reparticao" | "orgaoGerenciador";

export const Contabil2Tab: React.FC<Contabil2TabProps> = ({ competence }) => {
  const [activeFundo, setActiveFundo] = useState<FundoType>("consolidado");
  const [compositionPeriod, setCompositionPeriod] = useState<"mes" | "ytd">("mes");

  const fundosInfo = {
    consolidado: {
      nome: "CONSOLIDADO",
      descricao: "Consolidado de todas as movimentações financeiras da Maringá Previdência.",
      cor: "border-indigo-600 text-indigo-700 bg-indigo-50",
      accent: "bg-indigo-600",
      pill: "bg-indigo-100 text-indigo-800"
    },
    capitalizacao: {
      nome: "CAPITALIZAÇÃO",
      descricao: "Fundo Previdenciário capitalizado, onde os recursos das contribuições são investidos para garantir os benefícios futuros.",
      cor: "border-emerald-600 text-emerald-700 bg-emerald-50",
      accent: "bg-emerald-600",
      pill: "bg-emerald-100 text-emerald-800"
    },
    reparticao: {
      nome: "REPARTIÇÃO",
      descricao: "Fundo Financeiro de repartição simples, destinado ao pagamento de benefícios dos servidores do grupo de transição.",
      cor: "border-blue-600 text-blue-700 bg-blue-50",
      accent: "bg-blue-600",
      pill: "bg-blue-100 text-blue-800"
    },
    orgaoGerenciador: {
      nome: "ÓRGÃO GERENCIADOR",
      descricao: "Fundo de Taxa de Administração da autarquia, destinado a cobrir as despesas operacionais e administrativas da Maringá Previdência.",
      cor: "border-purple-600 text-purple-700 bg-purple-50",
      accent: "bg-purple-600",
      pill: "bg-purple-100 text-purple-800"
    }
  };

  const all2026Comp = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const selectedIndex = all2026Comp.indexOf(competence);
  const activeYTDCompetencies = useMemo(() => {
    return selectedIndex !== -1 ? all2026Comp.slice(0, selectedIndex + 1) : all2026Comp;
  }, [selectedIndex]);

  // Filter movements for the current selected fund
  const refMovsFundo = useMemo(() => {
    return movimentacoesFinanceiras.filter(m => m.competencia === competence && (activeFundo === "consolidado" || m.fundo === activeFundo));
  }, [competence, activeFundo]);

  const ytdMovsFundo = useMemo(() => {
    return movimentacoesFinanceiras.filter(m => activeYTDCompetencies.includes(m.competencia) && (activeFundo === "consolidado" || m.fundo === activeFundo));
  }, [activeYTDCompetencies, activeFundo]);

  // Summarize category for selected fund
  const getCategorySummaryFundo = (tipo: "receita" | "despesa" | "transferenciaRecebida") => {
    const listThisMonth = refMovsFundo.filter(m => m.tipo === tipo);
    const listYTD = ytdMovsFundo.filter(m => m.tipo === tipo);

    const categoriesThisMonth: Record<string, number> = {};
    const categoriesYTD: Record<string, number> = {};

    listThisMonth.forEach(m => {
      categoriesThisMonth[m.categoria] = (categoriesThisMonth[m.categoria] || 0) + m.valor;
    });

    listYTD.forEach(m => {
      categoriesYTD[m.categoria] = (categoriesYTD[m.categoria] || 0) + m.valor;
    });

    const allCategories = Array.from(new Set([...Object.keys(categoriesThisMonth), ...Object.keys(categoriesYTD)]));

    return allCategories.map(cat => ({
      categoria: cat,
      valorMes: categoriesThisMonth[cat] || 0,
      valorYTD: categoriesYTD[cat] || 0
    })).sort((a, b) => b.valorYTD - a.valorYTD);
  };

  const revenuesSummary = useMemo(() => getCategorySummaryFundo("receita"), [refMovsFundo, ytdMovsFundo]);
  const expensesSummary = useMemo(() => getCategorySummaryFundo("despesa"), [refMovsFundo, ytdMovsFundo]);
  const transfersSummary = useMemo(() => getCategorySummaryFundo("transferenciaRecebida"), [refMovsFundo, ytdMovsFundo]);

  // Calculations for current fund
  const totalRevenuesMes = useMemo(() => refMovsFundo.filter(m => m.tipo === "receita").reduce((acc, curr) => acc + curr.valor, 0), [refMovsFundo]);
  const totalRevenuesYTD = useMemo(() => ytdMovsFundo.filter(m => m.tipo === "receita").reduce((acc, curr) => acc + curr.valor, 0), [ytdMovsFundo]);

  const totalExpensesMes = useMemo(() => refMovsFundo.filter(m => m.tipo === "despesa").reduce((acc, curr) => acc + curr.valor, 0), [refMovsFundo]);
  const totalExpensesYTD = useMemo(() => ytdMovsFundo.filter(m => m.tipo === "despesa").reduce((acc, curr) => acc + curr.valor, 0), [ytdMovsFundo]);

  const totalTransfersMes = useMemo(() => refMovsFundo.filter(m => m.tipo === "transferenciaRecebida").reduce((acc, curr) => acc + curr.valor, 0), [refMovsFundo]);
  const totalTransfersYTD = useMemo(() => ytdMovsFundo.filter(m => m.tipo === "transferenciaRecebida").reduce((acc, curr) => acc + curr.valor, 0), [ytdMovsFundo]);

  // Net Operating Balance (Revenues - Expenses)
  const netOperatingMes = totalRevenuesMes - totalExpensesMes;
  const netOperatingYTD = totalRevenuesYTD - totalExpensesYTD;

  // Final Adjusted Balance (Revenues + Transfers - Expenses)
  const finalBalanceMes = totalRevenuesMes + totalTransfersMes - totalExpensesMes;
  const finalBalanceYTD = totalRevenuesYTD + totalTransfersYTD - totalExpensesYTD;

  // Historical data for chart: Receitas vs Despesas per competence
  const chartData = useMemo(() => {
    return activeYTDCompetencies.map(comp => {
      const compMovs = movimentacoesFinanceiras.filter(m => m.competencia === comp && (activeFundo === "consolidado" || m.fundo === activeFundo));
      
      const rec = compMovs.filter(m => m.tipo === "receita").reduce((acc, curr) => acc + curr.valor, 0);
      const tra = compMovs.filter(m => m.tipo === "transferenciaRecebida").reduce((acc, curr) => acc + curr.valor, 0);
      const desp = compMovs.filter(m => m.tipo === "despesa").reduce((acc, curr) => acc + curr.valor, 0);

      const parts = comp.split("-");
      const label = parts[1] === "01" ? "Jan" :
                    parts[1] === "02" ? "Fev" :
                    parts[1] === "03" ? "Mar" :
                    parts[1] === "04" ? "Abr" :
                    parts[1] === "05" ? "Mai" : "Jun";

      return {
        name: label,
        "Receitas": Number((rec / 1000000).toFixed(2)),
        "Aportes/Transf.": Number((tra / 1000000).toFixed(2)),
        "Despesas": Number((desp / 1000000).toFixed(2))
      };
    });
  }, [activeYTDCompetencies, activeFundo]);

  const revenueComposition = useMemo(() => {
    const groups = {
      rendimento: { name: "Rendimento", valorMes: 0, valorYTD: 0, color: "#3b82f6" },
      contribuicao: { name: "Contribuição", valorMes: 0, valorYTD: 0, color: "#10b981" },
      compensacao: { name: "Compensação", valorMes: 0, valorYTD: 0, color: "#f59e0b" },
      taxaAdmin: { name: "Taxa de Administração", valorMes: 0, valorYTD: 0, color: "#8b5cf6" },
      outras: { name: "Outras", valorMes: 0, valorYTD: 0, color: "#64748b" },
    };

    refMovsFundo.filter(m => m.tipo === "receita").forEach(m => {
      const cat = m.categoria;
      if (cat === "Rendimento de Aplicação" || cat === "Juros de Empréstimos Consignados") {
        groups.rendimento.valorMes += m.valor;
      } else if (cat === "Contribuição Patronal" || cat === "Contribuição do Servidor" || cat === "Contribuição de Inativos e Pensionistas") {
        groups.contribuicao.valorMes += m.valor;
      } else if (cat === "Compensação Previdenciária") {
        groups.compensacao.valorMes += m.valor;
      } else if (cat === "Taxa de Administração") {
        groups.taxaAdmin.valorMes += m.valor;
      } else {
        groups.outras.valorMes += m.valor;
      }
    });

    ytdMovsFundo.filter(m => m.tipo === "receita").forEach(m => {
      const cat = m.categoria;
      if (cat === "Rendimento de Aplicação" || cat === "Juros de Empréstimos Consignados") {
        groups.rendimento.valorYTD += m.valor;
      } else if (cat === "Contribuição Patronal" || cat === "Contribuição do Servidor" || cat === "Contribuição de Inativos e Pensionistas") {
        groups.contribuicao.valorYTD += m.valor;
      } else if (cat === "Compensação Previdenciária") {
        groups.compensacao.valorYTD += m.valor;
      } else if (cat === "Taxa de Administração") {
        groups.taxaAdmin.valorYTD += m.valor;
      } else {
        groups.outras.valorYTD += m.valor;
      }
    });

    return Object.values(groups);
  }, [refMovsFundo, ytdMovsFundo]);

  const totalCompMes = useMemo(() => revenueComposition.reduce((acc, curr) => acc + curr.valorMes, 0), [revenueComposition]);
  const totalCompYTD = useMemo(() => revenueComposition.reduce((acc, curr) => acc + curr.valorYTD, 0), [revenueComposition]);

  const activeCompData = useMemo(() => {
    return revenueComposition.map(g => ({
      name: g.name,
      value: compositionPeriod === "mes" ? g.valorMes : g.valorYTD,
      color: g.color
    })).filter(item => item.value > 0);
  }, [revenueComposition, compositionPeriod]);

  return (
    <div className="space-y-4">
      {/* Fundo Navigation Selector */}
      <div className="bg-white rounded shadow-xs border border-slate-200 p-2 flex items-center justify-between">
        <div className="flex space-x-2">
          {(Object.keys(fundosInfo) as FundoType[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFundo(f)}
              className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFundo === f
                  ? "bg-[#1e3a8a] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {f === "consolidado" ? "CONSOLIDADO" : f === "capitalizacao" ? "CAPITALIZAÇÃO" : f === "reparticao" ? "REPARTIÇÃO" : "ÓRGÃO GERENCIADOR"}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium mr-2">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Filtro de fundo contábil e regime previdenciário</span>
        </div>
      </div>

      {/* KPI Cards for selected Fundo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Receitas */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Receitas Próprias</span>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {formatCurrency(totalRevenuesMes)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              Acumulado no Ano: <strong className="text-slate-700">{formatCurrency(totalRevenuesYTD)}</strong>
            </p>
          </div>
        </div>

        {/* Total Despesas */}
        <div className="bg-white rounded shadow-sm border-l-4 border-rose-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Despesas Liquidadas</span>
            <div className="p-1.5 rounded bg-rose-50 text-rose-600">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {formatCurrency(totalExpensesMes)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              Acumulado no Ano: <strong className="text-slate-700">{formatCurrency(totalExpensesYTD)}</strong>
            </p>
          </div>
        </div>

        {/* Aportes / Transferências */}
        <div className="bg-white rounded shadow-sm border-l-4 border-sky-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aportes / Transferências</span>
            <div className="p-1.5 rounded bg-sky-50 text-sky-600">
              <PiggyBank className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {formatCurrency(totalTransfersMes)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              Acumulado no Ano: <strong className="text-slate-700">{formatCurrency(totalTransfersYTD)}</strong>
            </p>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className={`bg-white rounded shadow-sm border-l-4 p-4 flex flex-col justify-between ${
          finalBalanceMes >= 0 ? "border-emerald-600" : "border-rose-600"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saldo Líquido</span>
            <div className={`p-1.5 rounded ${finalBalanceMes >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              <Wallet className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className={`text-xl font-black tracking-tight ${finalBalanceMes >= 0 ? "text-emerald-800" : "text-rose-800"}`}>
              {formatCurrency(finalBalanceMes)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              Acumulado no Ano: <strong className={finalBalanceYTD >= 0 ? "text-emerald-700" : "text-rose-700"}>{formatCurrency(finalBalanceYTD)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Main Breakdown Area & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger - Detailed Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-5">
          <div>
            <h3 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${fundosInfo[activeFundo].accent}`}></span>
              Lançamentos por Categoria ({fundosInfo[activeFundo].nome})
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Detalhamento de receitas, despesas e aportes correspondentes à competência selecionada e acumulado do ano.
            </p>
          </div>

          {/* Table: Receitas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-emerald-50/40 px-3 py-1.5 rounded-lg border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Receitas Realizadas</span>
              <span className="text-[11px] text-emerald-800 font-bold">Total: {formatCurrency(totalRevenuesMes)}</span>
            </div>
            
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3 text-right">No Mês</th>
                    <th className="py-2.5 px-3 text-right">Acumulado Ano</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {revenuesSummary.length > 0 ? (
                    revenuesSummary.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-700">{item.categoria}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{formatCurrency(item.valorMes)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(item.valorYTD)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-slate-400 italic">Nenhuma receita registrada para este fundo no período.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Despesas */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between bg-rose-50/40 px-3 py-1.5 rounded-lg border border-rose-100">
              <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Despesas Liquidadas</span>
              <span className="text-[11px] text-rose-800 font-bold">Total: {formatCurrency(totalExpensesMes)}</span>
            </div>
            
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3 text-right">No Mês</th>
                    <th className="py-2.5 px-3 text-right">Acumulado Ano</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {expensesSummary.length > 0 ? (
                    expensesSummary.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-700">{item.categoria}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{formatCurrency(item.valorMes)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(item.valorYTD)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-slate-400 italic">Nenhuma despesa registrada para este fundo no período.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Aportes / Transferências se existirem */}
          {transfersSummary.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-sky-50/40 px-3 py-1.5 rounded-lg border border-sky-100">
                <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">Aportes Extraordinários / Recebidos</span>
                <span className="text-[11px] text-sky-800 font-bold">Total: {formatCurrency(totalTransfersMes)}</span>
              </div>
              
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Origem</th>
                      <th className="py-2.5 px-3 text-right">No Mês</th>
                      <th className="py-2.5 px-3 text-right">Acumulado Ano</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transfersSummary.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-700">{item.categoria}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{formatCurrency(item.valorMes)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(item.valorYTD)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Charts Column */}
        <div className="space-y-6">
          
          {/* Visual Chart - Monthly Flow */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-[#1e3a8a]" />
                Evolução Mensal (Receitas vs Despesas)
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Gráfico comparativo mensal acumulado do exercício (Valores expressos em Milhões de Reais).
              </p>
            </div>

            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `${val}M`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`R$ ${value}M`, name]}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend verticalAlign="top" height={32} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px", fontWeight: 700 }} />
                  <Bar dataKey="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} name="Receitas" />
                  {(activeFundo === "reparticao" || activeFundo === "orgaoGerenciador") && <Bar dataKey="Aportes/Transf." fill="#0284c7" radius={[4, 4, 0, 0]} name="Aportes" />}
                  <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Chart - Revenue Composition */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Coins className="h-4.5 w-4.5 text-[#1e3a8a]" />
                  Composição da Receita
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Proporção das fontes de receita do fundo selecionado.
                </p>
              </div>
              
              {/* Period Selector Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setCompositionPeriod("mes")}
                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                    compositionPeriod === "mes"
                      ? "bg-white text-slate-800 shadow-2xs"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setCompositionPeriod("ytd")}
                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                    compositionPeriod === "ytd"
                      ? "bg-white text-slate-800 shadow-2xs"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Acumulado
                </button>
              </div>
            </div>

            {activeCompData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <div className="h-36 w-36 flex-shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activeCompData}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={58}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {activeCompData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[8px] uppercase font-bold text-slate-400">Total</span>
                    <span className="text-[10px] font-black text-slate-700 text-center px-1 truncate max-w-full">
                      {formatCurrency(compositionPeriod === "mes" ? totalCompMes : totalCompYTD)}
                    </span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 w-full space-y-1">
                  {revenueComposition.map((item, index) => {
                    const val = compositionPeriod === "mes" ? item.valorMes : item.valorYTD;
                    const total = compositionPeriod === "mes" ? totalCompMes : totalCompYTD;
                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                    
                    return (
                      <div key={index} className="flex items-center justify-between text-[10px] p-0.5 rounded hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-slate-500 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 font-mono">
                          <span className="text-slate-700 font-bold">{formatCurrency(val)}</span>
                          <span className="text-slate-400 font-medium">({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-100 rounded-xl">
                <Coins className="h-8 w-8 text-slate-300 stroke-1 mb-1.5" />
                <p className="text-xs font-bold text-slate-400">Nenhuma receita registrada</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Não há valores correspondentes ao período selecionado.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
