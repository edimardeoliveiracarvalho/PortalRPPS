import React, { useState, useMemo } from "react";
import { retornoMetaAtuarial } from "../data";
import { retornoMetaAtuarialHistorico, HistoricoMetaAtuarial } from "../data_meta_historico";
import { formatPercentRaw } from "../utils";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Calendar,
  Layers,
  Percent,
  CheckCircle,
  HelpCircle,
  BarChart3,
  ListFilter,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  PieChart,
  Pie
} from "recharts";

interface MetaAtuarial2TabProps {
  competence: string;
}

export const MetaAtuarial2Tab: React.FC<MetaAtuarial2TabProps> = ({ competence }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "superavit" | "deficit">("todos");

  // Dynamically compute historical data including the current year (2026) based on selected competence
  const combinedHistory = useMemo<HistoricoMetaAtuarial[]>(() => {
    // If the selected competence is a 2026 month, use it. Otherwise, default to the latest (2026-06).
    const is2026 = competence && competence.startsWith("2026");
    const targetComp = is2026 ? competence : "2026-06";
    const current2026Month = retornoMetaAtuarial.find(g => g.competencia === targetComp);

    if (!current2026Month) return retornoMetaAtuarialHistorico;

    const rawRetorno = (current2026Month.retornoAcumulado || 0) * 100;
    const rawMeta = (current2026Month.metaAcumulada || 0) * 100;
    const rawGap = rawRetorno - rawMeta;
    
    // Format formula (e.g., "IPCA + 5.92%" -> "IPCA + 5,92% a.a.")
    const formula = current2026Month.metaAtuarialFormula.replace(".", ",") + " a.a.";
    
    // Month label for clarity
    const parts = current2026Month.competencia.split("-");
    const monthLabelsShort: { [key: string]: string } = {
      "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
      "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
    };
    const monthLabel = monthLabelsShort[parts[1]] || parts[1];

    const entry2026: HistoricoMetaAtuarial = {
      exercicio: 2026,
      metaAtuarialFormula: `${formula} (Acumulado até ${monthLabel})`,
      metaAtuarialPercentual: parseFloat(rawMeta.toFixed(2)),
      retornoPercentual: parseFloat(rawRetorno.toFixed(2)),
      gap: parseFloat(rawGap.toFixed(2)),
      atingiuMeta: rawRetorno >= rawMeta,
      resultado: rawRetorno >= rawMeta ? "superavit" as const : "deficit" as const
    };

    // Filter out 2026 if it already exists in historical data (preventing double entries)
    const base = retornoMetaAtuarialHistorico.filter(item => item.exercicio !== 2026);
    return [...base, entry2026];
  }, [competence]);

  // Calculate high-level stats dynamically
  const totalYears = combinedHistory.length;
  
  const averageReturn = useMemo(() => {
    const sum = combinedHistory.reduce((acc, curr) => acc + curr.retornoPercentual, 0);
    return sum / totalYears;
  }, [combinedHistory, totalYears]);

  const averageTarget = useMemo(() => {
    const sum = combinedHistory.reduce((acc, curr) => acc + curr.metaAtuarialPercentual, 0);
    return sum / totalYears;
  }, [combinedHistory, totalYears]);

  const successRate = useMemo(() => {
    const successfulYears = combinedHistory.filter(item => item.atingiuMeta).length;
    return (successfulYears / totalYears) * 100;
  }, [combinedHistory, totalYears]);

  const yearsCount = useMemo(() => {
    const superavit = combinedHistory.filter(item => item.resultado === "superavit").length;
    const deficit = totalYears - superavit;
    return { superavit, deficit };
  }, [combinedHistory, totalYears]);

  const bestYear = useMemo(() => {
    return [...combinedHistory].sort((a, b) => b.retornoPercentual - a.retornoPercentual)[0];
  }, [combinedHistory]);

  // 1. Long-term cumulative compound performance (Base 100 in 2011)
  const cumulativeData = useMemo(() => {
    let valRetorno = 100;
    let valMeta = 100;
    
    // Compound chronologically (exercise ascending)
    const sortedHistory = [...combinedHistory].sort((a, b) => a.exercicio - b.exercicio);
    
    return sortedHistory.map(item => {
      valRetorno = valRetorno * (1 + item.retornoPercentual / 100);
      valMeta = valMeta * (1 + item.metaAtuarialPercentual / 100);
      return {
        exercicio: item.exercicio,
        "Retorno Acumulado": parseFloat(valRetorno.toFixed(1)),
        "Meta Atuarial Acumulada": parseFloat(valMeta.toFixed(1)),
      };
    });
  }, [combinedHistory]);

  // 2. Historical real interest rate surcharge (Sobretaxa requerida)
  const surchargeData = useMemo(() => {
    const sortedHistory = [...combinedHistory].sort((a, b) => a.exercicio - b.exercicio);
    return sortedHistory.map(item => {
      const cleanedFormula = item.metaAtuarialFormula.replace(",", ".");
      const match = cleanedFormula.match(/\+\s*([0-9.]+)/);
      let rate = 6.0;
      if (match && match[1]) {
        rate = parseFloat(match[1]);
      } else {
        // Fallback mapping based on exercise if regex doesn't match
        if (item.exercicio <= 2019) rate = 6.0;
        else if (item.exercicio === 2020) rate = 5.88;
        else if (item.exercicio === 2021) rate = 5.45;
        else if (item.exercicio === 2022) rate = 4.95;
        else if (item.exercicio === 2023) rate = 5.11;
        else if (item.exercicio === 2024) rate = 5.25;
        else if (item.exercicio === 2025) rate = 5.32;
        else rate = 5.32; // 2026 current
      }
      return {
        exercicio: item.exercicio,
        "Taxa de Juros Real": rate,
      };
    });
  }, [combinedHistory]);

  const targetAchievementData = useMemo(() => {
    return [
      { name: "Meta Atingida (Superávit)", value: yearsCount.superavit, color: "#10b981" },
      { name: "Abaixo da Meta (Déficit)", value: yearsCount.deficit, color: "#ef4444" }
    ];
  }, [yearsCount]);

  const indexerData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    combinedHistory.forEach(item => {
      const formulaName = item.metaAtuarialFormula.split("+")[0].trim().replace("-", " ");
      counts[formulaName] = (counts[formulaName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => {
      let color = "#3b82f6"; // default
      if (name.includes("IPCA")) color = "#4f46e5";
      else if (name.includes("INPC")) color = "#06b6d4";
      else if (name.includes("IPC")) color = "#10b981";
      return { name, value, color };
    });
  }, [combinedHistory]);

  // Filtered list
  const filteredData = useMemo(() => {
    return combinedHistory.filter(item => {
      const matchesSearch = item.exercicio.toString().includes(searchTerm);
      const matchesStatus = 
        statusFilter === "todos" || 
        (statusFilter === "superavit" && item.atingiuMeta) || 
        (statusFilter === "deficit" && !item.atingiuMeta);
      return matchesSearch && matchesStatus;
    });
  }, [combinedHistory, searchTerm, statusFilter]);

  // Sorting descending by exercise for table display
  const sortedTableData = useMemo(() => {
    return [...filteredData].sort((a, b) => b.exercicio - a.exercicio);
  }, [filteredData]);

  // Formatting utility for local use (making sure we don't multiply by 100)
  const formatPercentLocal = (val: number) => {
    const formatted = val.toFixed(2);
    return `${formatted.replace(".", ",")}%`;
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* KPI 1: Média Histórica de Retorno */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Retorno Médio Histórico</span>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {formatPercentLocal(averageReturn)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Média anual do retorno obtido
            </span>
          </div>
        </div>

        {/* KPI 2: Média Histórica de Meta */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Meta Atuarial Média</span>
            <div className="p-1.5 rounded bg-indigo-50 text-indigo-600">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {formatPercentLocal(averageTarget)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Média do parâmetro de rentabilidade
            </span>
          </div>
        </div>

        {/* KPI 3: Taxa de Sucesso */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Índice de Atingimento</span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {successRate.toFixed(1).replace(".", ",")}%
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              {yearsCount.superavit} de {totalYears} anos superaram a meta
            </span>
          </div>
        </div>

        {/* KPI 4: Resultados Consolidados */}
        <div className="bg-white rounded shadow-sm border-l-4 border-orange-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Superávit vs Déficit</span>
            <div className="p-1.5 rounded bg-orange-50 text-orange-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-black text-emerald-600">{yearsCount.superavit}S</span>
            <span className="text-slate-300">/</span>
            <span className="text-lg font-black text-rose-600">{yearsCount.deficit}D</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
            Anos com superávit vs déficit atuarial
          </span>
        </div>

        {/* KPI 5: Melhor Retorno Anual */}
        <div className="bg-white rounded shadow-sm border-l-4 border-teal-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Melhor Retorno Anual</span>
            <div className="p-1.5 rounded bg-teal-50 text-teal-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {formatPercentLocal(bestYear.retornoPercentual)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Máximo em {bestYear.exercicio}
            </span>
          </div>
        </div>
      </div>

      {/* Rentabilidade vs Meta Chart */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Rentabilidade Obtida vs. Meta Atuarial por Exercício</h4>
          <p className="text-[11px] text-slate-400">Comparativo direto anual das taxas em porcentagem. Barras verdes representam retornos e a linha tracejada vermelha representa a meta correspondente.</p>
        </div>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="exercicio" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip 
                formatter={(value: any, name: any) => [`${value.toFixed(2).replace(".", ",")}%`, name]}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend verticalAlign="top" height={28} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="retornoPercentual" fill="#10b981" radius={[4, 4, 0, 0]} name="Retorno Real (%)" />
              <Line type="monotone" dataKey="metaAtuarialPercentual" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3, stroke: "#ef4444", strokeWidth: 1, fill: "#ffffff" }} activeDot={{ r: 5 }} name="Meta Atuarial (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gap Chart (Full History) */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Evolução do Gap Histórico de Desempenho (Pontos Percentuais)</h4>
          <p className="text-[11px] text-slate-400">Diferença em p.p. entre o retorno consolidado e a meta atuarial correspondente. Barras acima de zero indicam retorno excedente (Superávit).</p>
        </div>
        <div className="h-40 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={combinedHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="exercicio" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val} pp`}
              />
              <Tooltip 
                formatter={(value: any) => [`${value.toFixed(2).replace(".", ",")} p.p.`, "Diferença"]}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar 
                dataKey="gap" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Gap (p.p.)"
              >
                {combinedHistory.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.gap >= 0 ? "#10b981" : "#ef4444"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts Block */}
      <div className="grid grid-cols-1 gap-4">
        {/* Chart 4: Crescimento de Longo Prazo (Base 100) */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Crescimento de Longo Prazo: Evolução Patrimonial de Referência</h4>
            <p className="text-[11px] text-slate-400">Desempenho acumulado composto de um aporte inicial hipotético de R$ 100,00 em 2011 face à Meta Atuarial acumulada.</p>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="exercicio" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `R$ ${val}`}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [`R$ ${value.toFixed(2).replace(".", ",")}`, name]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={28} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                <Line 
                  type="monotone" 
                  dataKey="Retorno Acumulado" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  dot={{ r: 2, fill: "#10b981" }} 
                  activeDot={{ r: 4 }} 
                  name="Retorno Acumulado" 
                />
                <Line 
                  type="monotone" 
                  dataKey="Meta Atuarial Acumulada" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  dot={{ r: 2, fill: "#ef4444" }} 
                  activeDot={{ r: 4 }} 
                  name="Meta Acumulada" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive List and Details */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        {/* Header and Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Tabela de Dados dos Exercícios</h4>
            <p className="text-[11px] text-slate-400">Pesquise por ano e filtre por situação de atingimento da meta.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar ano..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 pl-8 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Status Filter buttons */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-0.5">
              <button
                onClick={() => setStatusFilter("todos")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-sm ${statusFilter === "todos" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter("superavit")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-sm ${statusFilter === "superavit" ? "bg-emerald-50 text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Superávit
              </button>
              <button
                onClick={() => setStatusFilter("deficit")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-sm ${statusFilter === "deficit" ? "bg-rose-50 text-rose-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Déficit
              </button>
            </div>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Exercício</th>
                <th className="py-2.5 px-3">Fórmula da Meta</th>
                <th className="py-2.5 px-3 text-right">Meta (%)</th>
                <th className="py-2.5 px-3 text-right">Retorno (%)</th>
                <th className="py-2.5 px-3 text-right">Diferença (Gap)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {sortedTableData.length > 0 ? (
                sortedTableData.map((item) => (
                  <tr key={item.exercicio} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {item.exercicio}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {item.metaAtuarialFormula}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-600">
                      {formatPercentLocal(item.metaAtuarialPercentual)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-800">
                      {formatPercentLocal(item.retornoPercentual)}
                    </td>
                    <td className={`py-3 px-3 text-right font-bold ${item.gap >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {item.gap >= 0 ? "+" : ""}{item.gap.toFixed(2).replace(".", ",")} p.p.
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          item.atingiuMeta 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {item.atingiuMeta ? "Meta Atingida" : "Abaixo da Meta"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    Nenhum exercício correspondente aos filtros foi encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
