import React from "react";
import { retornoMetaAtuarial } from "../data";
import { formatCurrency, formatPercent, getPrevCompetence } from "../utils";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  HelpCircle,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
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
  ComposedChart
} from "recharts";

interface MetaAtuarialTabProps {
  competence: string;
}

export const MetaAtuarialTab: React.FC<MetaAtuarialTabProps> = ({ competence }) => {
  // Get data for selected month
  const currentGoal = retornoMetaAtuarial.find(g => g.competencia === competence);

  // Previous month goal to calculate trend
  const prevCompetence = getPrevCompetence(competence);
  const prevGoal = retornoMetaAtuarial.find(g => g.competencia === prevCompetence);

  const returnPercent = currentGoal?.retornoPercentual || 0;
  const targetPercent = currentGoal?.metaAtuarialPercentual || 0;
  const returnAbsolute = currentGoal?.retornoValor || 0;
  
  // Calculate gap
  const gapPercent = returnPercent - targetPercent; // Difference in decimal/ratio terms
  const gapPercentagePoints = gapPercent * 100;

  const returnCum = currentGoal?.retornoAcumulado || 0;
  const targetCum = currentGoal?.metaAcumulada || 0;
  const gapCumPercentagePoints = (returnCum - targetCum) * 100;

  const isMet = currentGoal?.atingiuMeta || false;

  // Historical data for 2026 up to selected competence
  const all2026Comp = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const selectedIndex = all2026Comp.indexOf(competence);
  const activeCompetencies = selectedIndex !== -1 ? all2026Comp.slice(0, selectedIndex + 1) : all2026Comp;

  const monthLabels: { [key: string]: string } = {
    "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
    "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
  };

  const chartData = activeCompetencies.map(comp => {
    const item = retornoMetaAtuarial.find(g => g.competencia === comp);
    const parts = comp.split("-");
    const label = monthLabels[parts[1]] || parts[1];
    return {
      name: label,
      "Retorno Mensal (%)": item ? parseFloat((item.retornoPercentual * 100).toFixed(2)) : 0,
      "Meta Mensal (%)": item ? parseFloat((item.metaAtuarialPercentual * 100).toFixed(2)) : 0,
      "Retorno Acumulado (%)": item ? parseFloat((item.retornoAcumulado * 100).toFixed(2)) : 0,
      "Meta Acumulada (%)": item ? parseFloat((item.metaAcumulada * 100).toFixed(2)) : 0,
      "Ganho Absoluto (Milhões)": item ? parseFloat((item.retornoValor / 1000000).toFixed(2)) : 0,
      "Gap (p.p.)": item ? parseFloat(((item.retornoPercentual - item.metaAtuarialPercentual) * 100).toFixed(2)) : 0
    };
  });

  return (
    <div className="space-y-4">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Return */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Retorno da Carteira</span>
            <div className={`p-1.5 rounded ${returnAbsolute >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {formatPercent(returnPercent)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Equivale a {formatCurrency(returnAbsolute)} nominal
            </span>
          </div>
        </div>

        {/* Actuarial Target */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Meta de Rentabilidade</span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {formatPercent(targetPercent)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Parâmetro: {currentGoal?.metaAtuarialFormula}
            </span>
          </div>
        </div>

        {/* GAP / Excedente */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gap de Desempenho</span>
            <div className={`p-1.5 rounded ${gapPercentagePoints >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {gapPercentagePoints >= 0 ? <TrendUpIcon className="h-4 w-4" /> : <TrendDownIcon className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-2">
            <h4 className={`text-xl font-black tracking-tight ${gapPercentagePoints >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
              {gapPercentagePoints >= 0 ? "+" : ""}{gapPercentagePoints.toFixed(2)} p.p.
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              {gapPercentagePoints >= 0 ? "Superou a meta atuarial" : "Abaixo da meta atuarial"}
            </span>
          </div>
        </div>

        {/* Goal Status Badge */}
        <div className="bg-white rounded shadow-sm border-l-4 border-orange-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status da Meta</span>
            <div className={`p-1 rounded-full ${isMet ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
              {isMet ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
            </div>
          </div>
          <div className="mt-2">
            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider block text-center ${isMet ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}>
              {isMet ? "Meta Atingida" : "Abaixo da Meta"}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block text-center font-semibold">
              Acumulado 2026: {gapCumPercentagePoints >= 0 ? "Superávit de " : "Déficit de "}{Math.abs(gapCumPercentagePoints).toFixed(2)} p.p.
            </span>
          </div>
        </div>
      </div>

      {/* Narrative block */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700 flex items-center">
          <Award className="h-4 w-4 mr-1 text-indigo-600" />
          Acompanhamento do Equilíbrio Atuarial
        </p>
        <p className="mt-1 text-slate-500 leading-relaxed text-[11px]">
          A <strong>Meta Atuarial</strong> é o parâmetro mínimo de rentabilidade exigido para os investimentos da Maringá Previdência, visando garantir a solvência e o equilíbrio atuarial de longo prazo para pagamento das aposentadorias e pensões futuras. A meta é vinculada à variação do índice de inflação oficial <strong>IPCA + taxa de juros real ({currentGoal?.metaAtuarialFormula.split("+")[1]?.trim() || "5,92%"})</strong> ao ano.
        </p>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Monthly return vs target */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Rentabilidade Mensal vs. Parâmetro Atuarial</h4>
            <p className="text-[11px] text-slate-400">Desempenho relativo do retorno obtido pela carteira de investimentos contra a meta IPCA + 5,92%.</p>
          </div>
          <div className="h-48 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, ""]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={28} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Retorno Mensal (%)" fill="#10b981" radius={[4, 4, 0, 0]} name="Retorno Mensal (%)" />
                <Line type="monotone" dataKey="Meta Mensal (%)" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3, stroke: "#ef4444", strokeWidth: 1, fill: "#ffffff" }} activeDot={{ r: 5 }} name="Meta Atuarial (%)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: YTD Cumulative return vs target */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Desempenho Acumulado no Exercício (2026)</h4>
            <p className="text-[11px] text-slate-400">Comparativo acumulado (Year-to-Date) entre rentabilidade líquida obtida e meta atuarial agregada.</p>
          </div>
          <div className="h-48 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetornoCum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, ""]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={28} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="Retorno Acumulado (%)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRetornoCum)" name="Rentabilidade Acumulada (%)" />
                <Area type="monotone" dataKey="Meta Acumulada (%)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Meta Acumulada (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical gap barchart */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Evolução do Gap Mensal de Rentabilidade (p.p.)</h4>
          <p className="text-[11px] text-slate-400">Diferença em pontos percentuais entre o retorno da carteira e a meta atuarial. Valores acima de zero indicam rentabilidade excedente.</p>
        </div>
        <div className="h-32 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val} p.p.`}
              />
              <Tooltip 
                formatter={(value: any) => [`${value} p.p.`, "Diferença"]}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar 
                dataKey="Gap (p.p.)" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry["Gap (p.p.)"] >= 0 ? "#10b981" : "#ef4444"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
