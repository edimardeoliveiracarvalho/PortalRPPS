import React from "react";
import { evolucaoCarteiraConsolidada } from "../data";
import { formatCurrency, formatPercentRaw, formatNumber } from "../utils";
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Award, 
  LineChart as ChartIcon,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

interface PatrimonioTabProps {
  competence: string;
}

export const PatrimonioTab: React.FC<PatrimonioTabProps> = ({ competence }) => {
  // Get current portfolio value
  const currentObj = evolucaoCarteiraConsolidada.find(e => e.competencia === competence);
  const currentValue = currentObj?.valorCarteiraConsolidada || 0;

  // Initial portfolio value (Jan 2022)
  const initialObj = evolucaoCarteiraConsolidada[0];
  const initialValue = initialObj?.valorCarteiraConsolidada || 539057.51; // fallback

  // Helper to format short competence label (e.g. "Jan/22")
  const formatCompLabel = (compStr: string) => {
    const parts = compStr.split("-");
    const m = parts[1];
    const y = parts[0].substring(2);
    const monthsShort: Record<string, string> = {
      "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
      "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
    };
    return `${monthsShort[m] || m}/${y}`;
  };

  // Calculations
  const absoluteGrowth = currentValue - initialValue;
  const growthPercent = (absoluteGrowth / initialValue) * 100;

  // Calculations for last 24 months
  const getMonths = (comp: string) => {
    const [y, m] = comp.split("-").map(Number);
    return y * 12 + m;
  };

  const targetMonths24 = getMonths(competence) - 24;

  // Find the entry that has the minimum absolute difference in months
  let base24Obj = evolucaoCarteiraConsolidada[0];
  let minDiff = Infinity;
  for (const item of evolucaoCarteiraConsolidada) {
    const diff = Math.abs(getMonths(item.competencia) - targetMonths24);
    if (diff < minDiff) {
      minDiff = diff;
      base24Obj = item;
    }
  }
  const base24Value = base24Obj?.valorCarteiraConsolidada || 0;
  const growth24Value = currentValue - base24Value;
  const growth24Percent = base24Value ? (growth24Value / base24Value) * 100 : 0;

  // Calculations for last 12 months
  const targetMonths12 = getMonths(competence) - 12;
  let base12Obj = evolucaoCarteiraConsolidada[0];
  let minDiff12 = Infinity;
  for (const item of evolucaoCarteiraConsolidada) {
    const diff = Math.abs(getMonths(item.competencia) - targetMonths12);
    if (diff < minDiff12) {
      minDiff12 = diff;
      base12Obj = item;
    }
  }
  const base12Value = base12Obj?.valorCarteiraConsolidada || 0;
  const growth12Value = currentValue - base12Value;
  const growth12Percent = base12Value ? (growth12Value / base12Value) * 100 : 0;

  // Calculations for current year growth
  const [cYear] = competence.split("-").map(Number);
  const competencePrevDec = `${cYear - 1}-12`;
  const prevDecObj = evolucaoCarteiraConsolidada.find(e => e.competencia === competencePrevDec);
  const competenceJanCurrent = `${cYear}-01`;
  const currentJanObj = evolucaoCarteiraConsolidada.find(e => e.competencia === competenceJanCurrent);
  const baseYearObj = prevDecObj || currentJanObj || evolucaoCarteiraConsolidada[0];
  const baseYearValue = baseYearObj?.valorCarteiraConsolidada || 0;
  const growthYearValue = currentValue - baseYearValue;
  const growthYearPercent = baseYearValue ? (growthYearValue / baseYearValue) * 100 : 0;

  // Helper to format growth with sign
  const formatGrowthValue = (value: number) => {
    const formatted = formatCurrency(Math.abs(value));
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  // Get the last 12 records ending at the selected competence
  const selectedIndex = evolucaoCarteiraConsolidada.findIndex(e => e.competencia === competence);
  const last12Records = selectedIndex !== -1 
    ? evolucaoCarteiraConsolidada.slice(Math.max(0, selectedIndex - 11), selectedIndex + 1)
    : evolucaoCarteiraConsolidada.slice(-12);

  const chartData = last12Records.map((item) => {
    const parts = item.competencia.split("-");
    const year = parts[0].substring(2); // "25", "26"
    const month = parts[1] === "01" ? "Jan" :
                  parts[1] === "02" ? "Fev" :
                  parts[1] === "03" ? "Mar" :
                  parts[1] === "04" ? "Abr" :
                  parts[1] === "05" ? "Mai" :
                  parts[1] === "06" ? "Jun" :
                  parts[1] === "07" ? "Jul" :
                  parts[1] === "08" ? "Ago" :
                  parts[1] === "09" ? "Set" :
                  parts[1] === "10" ? "Out" :
                  parts[1] === "11" ? "Nov" : "Dez";
    return {
      name: `${month}/${year}`,
      competencia: item.competencia,
      "Patrimônio (Milhões)": parseFloat((item.valorCarteiraConsolidada / 1000000).toFixed(2)),
      valorFidedigno: item.valorCarteiraConsolidada
    };
  });

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Patrimônio */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-blue-50 text-blue-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CARTEIRA CONSOLIDADA</span>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(currentValue)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Competência: {competence.split("-")[1]}/{competence.split("-")[0]}
            </span>
          </div>
        </div>

        {/* Growth Last 24 Months */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-purple-50 text-purple-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Últimos 24 meses</span>
            <h4 className={`text-xl font-black tracking-tight ${growth24Value >= 0 ? "text-slate-800" : "text-rose-600"}`}>
              {formatGrowthValue(growth24Value)}
            </h4>
            <span className={`text-[10px] font-bold mt-0.5 block ${growth24Value >= 0 ? "text-indigo-600" : "text-rose-500"}`}>
              Variação de {growth24Percent >= 0 ? "+" : ""}{growth24Percent.toFixed(1)}% ({formatCompLabel(base24Obj.competencia)})
            </span>
          </div>
        </div>

        {/* Growth Last 12 Months */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-emerald-50 text-emerald-600">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Últimos 12 meses</span>
            <h4 className={`text-xl font-black tracking-tight ${growth12Value >= 0 ? "text-slate-800" : "text-rose-600"}`}>
              {formatGrowthValue(growth12Value)}
            </h4>
            <span className={`text-[10px] font-bold mt-0.5 block ${growth12Value >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
              Variação de {growth12Percent >= 0 ? "+" : ""}{growth12Percent.toFixed(1)}% ({formatCompLabel(base12Obj.competencia)})
            </span>
          </div>
        </div>

        {/* Growth of the Year */}
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-amber-50 text-amber-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Crescimento no Ano</span>
            <h4 className={`text-xl font-black tracking-tight ${growthYearValue >= 0 ? "text-slate-800" : "text-rose-600"}`}>
              {formatGrowthValue(growthYearValue)}
            </h4>
            <span className={`text-[10px] font-bold mt-0.5 block ${growthYearValue >= 0 ? "text-amber-600" : "text-rose-500"}`}>
              Variação de {growthYearPercent >= 0 ? "+" : ""}{growthYearPercent.toFixed(1)}% ({formatCompLabel(baseYearObj.competencia)})
            </span>
          </div>
        </div>
      </div>

      {/* Main Historical Growth Chart */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Evolução do Patrimônio Consolidado (Últimos 12 Meses)</h4>
            <p className="text-[11px] text-slate-400">Carteira de Investimentos Consolidada (Fundo em Capitalização, Fundo em Repartição e Órgão Gerenciador).</p>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
            <Calendar className="h-3.5 w-3.5" />
            <span>Últimos 12 meses ({chartData.length} competências)</span>
          </div>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPatrimonioBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.85}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.35}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={9} 
                tickLine={false} 
                interval={0}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={['dataMin - 50', 'dataMax + 50']}
                tickFormatter={(val) => `R$ ${val}M`}
              />
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [
                  formatCurrency(props.payload.valorFidedigno), 
                  "Patrimônio"
                ]}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar 
                dataKey="Patrimônio (Milhões)" 
                fill="url(#colorPatrimonioBar)" 
                radius={[4, 4, 0, 0]} 
                name="Patrimônio Líquido" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
