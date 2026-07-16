import React, { useState, useMemo } from "react";
import { movimentacoesFinanceiras } from "../data";
import { formatCurrency } from "../utils";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Scale, 
  Info, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRightLeft,
  DollarSign,
  Layers
} from "lucide-react";
import { 
  ResponsiveContainer, 
  ComposedChart,
  Bar, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

interface CompensacaoTabProps {
  competence: string;
}

type ViewFilter = "consolidado" | "capitalizacao" | "reparticao";

export const CompensacaoTab: React.FC<CompensacaoTabProps> = ({ competence }) => {
  const [filter, setFilter] = useState<ViewFilter>("consolidado");

  const filterInfo = {
    consolidado: {
      label: "CONSOLIDADO",
      desc: "Demonstrativo geral da Compensação Previdenciária acumulando ambos os fundos.",
      accent: "border-indigo-600 text-indigo-700 bg-indigo-50/50",
      pill: "bg-indigo-600"
    },
    capitalizacao: {
      label: "CAPITALIZAÇÃO",
      desc: "Compensações vinculadas ao Fundo Previdenciário (servidores capitalizados).",
      accent: "border-emerald-600 text-emerald-700 bg-emerald-50/50",
      pill: "bg-emerald-600"
    },
    reparticao: {
      label: "REPARTIÇÃO",
      desc: "Compensações vinculadas ao Fundo Financeiro (servidores em repartição simples).",
      accent: "border-blue-600 text-blue-700 bg-blue-50/50",
      pill: "bg-blue-600"
    }
  };

  // Define active competencies for YTD calculation
  const all2026Comp = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const selectedIndex = all2026Comp.indexOf(competence);
  const activeYTDCompetencies = useMemo(() => {
    return selectedIndex !== -1 ? all2026Comp.slice(0, selectedIndex + 1) : all2026Comp;
  }, [selectedIndex]);

  // Filter only movements with category "Compensação Previdenciária"
  const refComprevMovs = useMemo(() => {
    return movimentacoesFinanceiras.filter(m => m.competencia === competence && m.categoria === "Compensação Previdenciária");
  }, [competence]);

  const ytdComprevMovs = useMemo(() => {
    return movimentacoesFinanceiras.filter(m => activeYTDCompetencies.includes(m.competencia) && m.categoria === "Compensação Previdenciária");
  }, [activeYTDCompetencies]);

  // Calculations for current month (static references for the table and calculation)
  const recMesReparticao = useMemo(() => refComprevMovs.filter(m => m.tipo === "receita" && m.fundo === "reparticao").reduce((sum, item) => sum + item.valor, 0), [refComprevMovs]);
  const recMesCapitalizacao = useMemo(() => refComprevMovs.filter(m => m.tipo === "receita" && m.fundo === "capitalizacao").reduce((sum, item) => sum + item.valor, 0), [refComprevMovs]);
  const totalRecMes = recMesReparticao + recMesCapitalizacao;

  const despMesReparticao = useMemo(() => refComprevMovs.filter(m => m.tipo === "despesa" && m.fundo === "reparticao").reduce((sum, item) => sum + item.valor, 0), [refComprevMovs]);
  const despMesCapitalizacao = useMemo(() => refComprevMovs.filter(m => m.tipo === "despesa" && m.fundo === "capitalizacao").reduce((sum, item) => sum + item.valor, 0), [refComprevMovs]);
  const totalDespMes = despMesReparticao + despMesCapitalizacao;

  const saldoMes = totalRecMes - totalDespMes;

  // Calculations for Year to Date (YTD) (static references)
  const recYtdReparticao = useMemo(() => ytdComprevMovs.filter(m => m.tipo === "receita" && m.fundo === "reparticao").reduce((sum, item) => sum + item.valor, 0), [ytdComprevMovs]);
  const recYtdCapitalizacao = useMemo(() => ytdComprevMovs.filter(m => m.tipo === "receita" && m.fundo === "capitalizacao").reduce((sum, item) => sum + item.valor, 0), [ytdComprevMovs]);
  const totalRecYtd = recYtdReparticao + recYtdCapitalizacao;

  const despYtdReparticao = useMemo(() => ytdComprevMovs.filter(m => m.tipo === "despesa" && m.fundo === "reparticao").reduce((sum, item) => sum + item.valor, 0), [ytdComprevMovs]);
  const despYtdCapitalizacao = useMemo(() => ytdComprevMovs.filter(m => m.tipo === "despesa" && m.fundo === "capitalizacao").reduce((sum, item) => sum + item.valor, 0), [ytdComprevMovs]);
  const totalDespYtd = despYtdReparticao + despYtdCapitalizacao;

  const saldoYtd = totalRecYtd - totalDespYtd;

  // Dynamic values used for KPIs based on selected filter
  const displayRecMes = useMemo(() => {
    if (filter === "reparticao") return recMesReparticao;
    if (filter === "capitalizacao") return recMesCapitalizacao;
    return totalRecMes;
  }, [filter, recMesReparticao, recMesCapitalizacao, totalRecMes]);

  const displayDespMes = useMemo(() => {
    if (filter === "reparticao") return despMesReparticao;
    if (filter === "capitalizacao") return despMesCapitalizacao;
    return totalDespMes;
  }, [filter, despMesReparticao, despMesCapitalizacao, totalDespMes]);

  const displaySaldoMes = displayRecMes - displayDespMes;

  const displayRecYtd = useMemo(() => {
    if (filter === "reparticao") return recYtdReparticao;
    if (filter === "capitalizacao") return recYtdCapitalizacao;
    return totalRecYtd;
  }, [filter, recYtdReparticao, recYtdCapitalizacao, totalRecYtd]);

  const displayDespYtd = useMemo(() => {
    if (filter === "reparticao") return despYtdReparticao;
    if (filter === "capitalizacao") return despYtdCapitalizacao;
    return totalDespYtd;
  }, [filter, despYtdReparticao, despYtdCapitalizacao, totalDespYtd]);

  const displaySaldoYtd = displayRecYtd - displayDespYtd;

  // Monthly historical flow data for chart (filtering based on selected option)
  const chartData = useMemo(() => {
    return activeYTDCompetencies.map(comp => {
      const compMovs = movimentacoesFinanceiras.filter(m => m.competencia === comp && m.categoria === "Compensação Previdenciária");
      
      let rec = 0;
      let desp = 0;

      if (filter === "consolidado") {
        rec = compMovs.filter(m => m.tipo === "receita").reduce((sum, item) => sum + item.valor, 0);
        desp = compMovs.filter(m => m.tipo === "despesa").reduce((sum, item) => sum + item.valor, 0);
      } else {
        rec = compMovs.filter(m => m.tipo === "receita" && m.fundo === filter).reduce((sum, item) => sum + item.valor, 0);
        desp = compMovs.filter(m => m.tipo === "despesa" && m.fundo === filter).reduce((sum, item) => sum + item.valor, 0);
      }
      
      const saldo = rec - desp;

      const monthLabels: { [key: string]: string } = {
        "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
        "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
      };
      const parts = comp.split("-");
      const label = monthLabels[parts[1]] || parts[1];

      return {
        name: label,
        "Receita Comprev": Number((rec / 1000).toFixed(2)),
        "Despesa Comprev": Number((desp / 1000).toFixed(2)),
        "Saldo Líquido": Number((saldo / 1000).toFixed(2))
      };
    });
  }, [activeYTDCompetencies, filter]);

  // Format currency in thousands or millions helper
  const formatComprevCurrency = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <div className="space-y-4">
      {/* Selector Component */}
      <div className="bg-white rounded shadow-xs border border-slate-200 p-2 flex items-center justify-between">
        <div className="flex space-x-2">
          {(Object.keys(filterInfo) as ViewFilter[]).map((fFilter) => (
            <button
              key={fFilter}
              onClick={() => setFilter(fFilter)}
              className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === fFilter
                  ? "bg-[#1e3a8a] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {fFilter === "consolidado" ? "CONSOLIDADO" : fFilter === "capitalizacao" ? "CAPITALIZAÇÃO" : "REPARTIÇÃO"}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium mr-2">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Filtro de fundo da Compensação Previdenciária</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receita Recebida */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Receita Recebida</span>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {formatComprevCurrency(displayRecMes)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              Acumulado no Ano: <strong className="text-slate-700">{formatComprevCurrency(displayRecYtd)}</strong>
            </p>
          </div>
        </div>

        {/* Despesa Liquidada / Compensada */}
        <div className="bg-white rounded shadow-sm border-l-4 border-rose-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Despesa Liquidada / Compensada</span>
            <div className="p-1.5 rounded bg-rose-50 text-rose-600">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {formatComprevCurrency(displayDespMes)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              Acumulado no Ano: <strong className="text-slate-700">{formatComprevCurrency(displayDespYtd)}</strong>
            </p>
          </div>
        </div>

        {/* Resultado Líquido */}
        <div className={`bg-white rounded shadow-sm border-l-4 p-4 flex flex-col justify-between ${
          displaySaldoMes >= 0 ? "border-emerald-600" : "border-rose-600"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resultado Líquido</span>
            <div className={`p-1.5 rounded ${displaySaldoMes >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className={`text-xl font-black tracking-tight ${displaySaldoMes >= 0 ? "text-emerald-800" : "text-rose-800"}`}>
              {formatComprevCurrency(displaySaldoMes)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              Acumulado no Ano: <strong className={displaySaldoYtd >= 0 ? "text-emerald-700" : "text-rose-700"}>{formatComprevCurrency(displaySaldoYtd)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
        <div>
          <h3 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-[#1e3a8a]" />
            Histórico Comparativo (Receitas vs Despesas)
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Valores demonstrados mensalmente de forma acumulada em Milhares de Reais (R$ mil) para melhor detalhamento visual.
          </p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `R$ ${val}k`}
              />
              <Tooltip 
                formatter={(value: any, name: any) => [`R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}k`, name]}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
              />
              <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 700 }} />
              <Bar dataKey="Receita Comprev" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita Recebida" />
              <Bar dataKey="Despesa Comprev" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesa Paga" />
              <Line type="monotone" dataKey="Saldo Líquido" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2 }} name="Saldo Líquido" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown per Fundo table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
        <div>
          <h3 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-2">
            <Scale className="h-4.5 w-4.5 text-slate-600" />
            Detalhamento por Fundo Previdenciário (Mês e Acumulado)
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Demonstrativo analítico do fluxo de Comprev dividido entre o Fundo Financeiro (Repartição) e o Fundo Previdenciário (Capitalização).
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Fundo Previdenciário</th>
                <th className="py-3 px-4 text-right">Receita no Mês</th>
                <th className="py-3 px-4 text-right">Despesa no Mês</th>
                <th className="py-3 px-4 text-right">Saldo no Mês</th>
                <th className="py-3 px-4 text-right">Receita Acumulada</th>
                <th className="py-3 px-4 text-right">Despesa Acumulada</th>
                <th className="py-3 px-4 text-right">Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Repartição Simples */}
              <tr className={`hover:bg-slate-50/50 transition-colors ${filter === "reparticao" ? "bg-blue-50/30 border-l-4 border-blue-500 font-medium" : ""}`}>
                <td className="py-3.5 px-4 font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Fundo em Repartição
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right text-slate-600 font-mono">{formatComprevCurrency(recMesReparticao)}</td>
                <td className="py-3.5 px-4 text-right text-slate-600 font-mono">{formatComprevCurrency(despMesReparticao)}</td>
                <td className={`py-3.5 px-4 text-right font-semibold font-mono ${recMesReparticao - despMesReparticao >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {formatComprevCurrency(recMesReparticao - despMesReparticao)}
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-slate-800 font-mono">{formatComprevCurrency(recYtdReparticao)}</td>
                <td className="py-3.5 px-4 text-right font-medium text-slate-800 font-mono">{formatComprevCurrency(despYtdReparticao)}</td>
                <td className={`py-3.5 px-4 text-right font-bold font-mono ${recYtdReparticao - despYtdReparticao >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {formatComprevCurrency(recYtdReparticao - despYtdReparticao)}
                </td>
              </tr>

              {/* Capitalização */}
              <tr className={`hover:bg-slate-50/50 transition-colors ${filter === "capitalizacao" ? "bg-emerald-50/30 border-l-4 border-emerald-500 font-medium" : ""}`}>
                <td className="py-3.5 px-4 font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Fundo em Capitalização
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right text-slate-600 font-mono">{formatComprevCurrency(recMesCapitalizacao)}</td>
                <td className="py-3.5 px-4 text-right text-slate-600 font-mono">{formatComprevCurrency(despMesCapitalizacao)}</td>
                <td className={`py-3.5 px-4 text-right font-semibold font-mono ${recMesCapitalizacao - despMesCapitalizacao >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {formatComprevCurrency(recMesCapitalizacao - despMesCapitalizacao)}
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-slate-800 font-mono">{formatComprevCurrency(recYtdCapitalizacao)}</td>
                <td className="py-3.5 px-4 text-right font-medium text-slate-800 font-mono">{formatComprevCurrency(despYtdCapitalizacao)}</td>
                <td className={`py-3.5 px-4 text-right font-bold font-mono ${recYtdCapitalizacao - despYtdCapitalizacao >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {formatComprevCurrency(recYtdCapitalizacao - despYtdCapitalizacao)}
                </td>
              </tr>

              {/* Totais Consolidados */}
              <tr className={`bg-slate-50 font-bold border-t-2 border-slate-100 text-slate-900 ${filter === "consolidado" ? "bg-indigo-50/40 border-l-4 border-indigo-500" : ""}`}>
                <td className="py-4 px-4 uppercase text-[10px] tracking-wide text-slate-500">
                  Total Consolidado (Comprev)
                </td>
                <td className="py-4 px-4 text-right font-mono">{formatComprevCurrency(totalRecMes)}</td>
                <td className="py-4 px-4 text-right font-mono">{formatComprevCurrency(totalDespMes)}</td>
                <td className={`py-4 px-4 text-right font-mono ${saldoMes >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {formatComprevCurrency(saldoMes)}
                </td>
                <td className="py-4 px-4 text-right font-mono">{formatComprevCurrency(totalRecYtd)}</td>
                <td className="py-4 px-4 text-right font-mono">{formatComprevCurrency(totalDespYtd)}</td>
                <td className={`py-4 px-4 text-right font-mono ${saldoYtd >= 0 ? "text-emerald-700 font-extrabold" : "text-rose-700 font-extrabold"}`}>
                  {formatComprevCurrency(saldoYtd)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
