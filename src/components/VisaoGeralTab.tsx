import React from "react";
import { 
  seguradosAtivos, 
  retornoMetaAtuarial, 
  movimentacoesFinanceiras, 
  crp, 
  agendaReunioes, 
  evolucaoCarteiraConsolidada
} from "../data";
import { investimentos } from "../data_investimentos";
import { beneficios } from "../data_beneficios";
import { formatCurrency, formatPercent, formatNumber, getMonthName, getPrevCompetence } from "../utils";
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Briefcase, 
  PieChart as PieIcon, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  Cell,
  ComposedChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";

interface VisaoGeralTabProps {
  competence: string;
}

export const VisaoGeralTab: React.FC<VisaoGeralTabProps> = ({ competence }) => {
  // 1. Current Patrimônio (Evolução Carteira Consolidada for this competence)
  const currentPatrimonioObj = evolucaoCarteiraConsolidada.find(e => e.competencia === competence);
  const prevCompetence = getPrevCompetence(competence);
  const prevPatrimonioObj = evolucaoCarteiraConsolidada.find(e => e.competencia === prevCompetence);
  const currentPatrimonio = currentPatrimonioObj?.valorCarteiraConsolidada || 0;
  const prevPatrimonio = prevPatrimonioObj?.valorCarteiraConsolidada || 0;
  const patrimonioGrowth = prevPatrimonio ? ((currentPatrimonio - prevPatrimonio) / prevPatrimonio) * 100 : 0;

  // 2. Monthly Financial Balance
  const monthlyMov = movimentacoesFinanceiras.filter(m => m.competencia === competence);
  const totalReceitas = monthlyMov.filter(m => m.tipo === "receita").reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = monthlyMov.filter(m => m.tipo === "despesa").reduce((acc, curr) => acc + curr.valor, 0);
  const totalTransferencias = monthlyMov.filter(m => m.tipo === "transferenciaRecebida").reduce((acc, curr) => acc + curr.valor, 0);
  const monthlyBalance = totalReceitas + totalTransferencias - totalDespesas;

  // 3. Actuarial Goal for this competence
  const currentGoalObj = retornoMetaAtuarial.find(g => g.competencia === competence);
  
  // 4. Beneficiary stats
  const currentBeneficiosObj = beneficios.find(b => b.competencia === competence && b.fundo === "consolidado");
  const totalBeneficiarios = currentBeneficiosObj?.totalBeneficiarios || 0;

  // 5. Servidores stats
  const currentServidoresObj = seguradosAtivos.find(s => s.competencia === competence);
  const totalAtivos = currentServidoresObj?.quantidadeAtivos || 0;

  // 6. Active CRP (get the one valid for this date)
  // Our select competence is e.g. "2026-05" (May 2026), meaning we are in May 2026.
  // The CRP valid in May 2026 is "987691-252301" (valid until 2026-09-07)
  const activeCRP = crp.find(c => c.situacao === "vigente") || crp[crp.length - 1];

  const [compYear, compMonth] = competence.split("-").map(Number);
  const [valYear, valMonth] = activeCRP.validade.split("-").map(Number);

  const validityParts = activeCRP.validade.split("-");
  const formattedValidade = validityParts.length === 3 ? `${validityParts[2]}/${validityParts[1]}/${validityParts[0].substring(2)}` : "07/09/26";

  // Calculate remaining days considering competence date (first day of selected month) and real-world today
  const valDay = Number(validityParts[2] || 7);
  const valDate = new Date(valYear, valMonth - 1, valDay);
  const compDate = new Date(compYear, compMonth - 1, 1);
  const today = new Date();

  const diffTimeComp = valDate.getTime() - compDate.getTime();
  const diffDaysComp = Math.ceil(diffTimeComp / (1000 * 60 * 60 * 24));

  const diffTimeToday = valDate.getTime() - today.getTime();
  const diffDaysToday = Math.ceil(diffTimeToday / (1000 * 60 * 60 * 24));

  // Minimum of days remaining relative to today or relative to the selected competence
  const daysRemaining = Math.min(diffDaysComp, diffDaysToday);

  // Urgent Alert (high intensity) when remaining days is less than 5 or already passed
  const isUrgentAlert = daysRemaining < 5;

  // Urgent (moderate intensity) when remaining days is between 5 and 10 days
  const isUrgent = daysRemaining >= 5 && daysRemaining <= 10;

  // 7. Council Meetings for selected month
  const selectedMeetings = agendaReunioes.filter(m => m.competencia === competence);

  // 8. 2026 Monthly Cash Flow Chart Data
  const compMonthNum = parseInt(competence.split("-")[1], 10);
  const competencesUpToSelected = Array.from({ length: compMonthNum }, (_, i) => {
    const monthNum = i + 1;
    const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    return `2026-${monthStr}`;
  });

  const monthLabels: { [key: string]: string } = {
    "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
    "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
  };

  const monthlyFlowData = competencesUpToSelected.map(comp => {
    const movs = movimentacoesFinanceiras.filter(m => m.competencia === comp);
    const rec = movs.filter(m => m.tipo === "receita").reduce((a, c) => a + c.valor, 0);
    const trans = movs.filter(m => m.tipo === "transferenciaRecebida").reduce((a, c) => a + c.valor, 0);
    const desp = movs.filter(m => m.tipo === "despesa").reduce((a, c) => a + c.valor, 0);
    const mStr = comp.split("-")[1];
    const label = monthLabels[mStr] || mStr;
    return {
      name: label,
      Receitas: rec,
      Aportes: trans,
      Despesas: desp,
      Resultado: rec + trans - desp
    };
  });

  // 9. Actuarial Return vs Target Chart Data (all months of 2026 up to selected)
  const actuarialChartData = competencesUpToSelected.map(comp => {
    const item = retornoMetaAtuarial.find(g => g.competencia === comp);
    const mStr = comp.split("-")[1];
    const label = `${monthLabels[mStr] || mStr}/26`;
    return {
      name: label,
      Retorno: item ? parseFloat((item.retornoPercentual * 100).toFixed(2)) : 0,
      Meta: item ? parseFloat((item.metaAtuarialPercentual * 100).toFixed(2)) : 0,
    };
  });

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes crp-flash {
          0%, 100% {
            border-color: #f97316;
            box-shadow: 0 0 0 0px rgba(239, 68, 68, 0);
          }
          50% {
            border-color: #ef4444;
            background-color: #fef2f2;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25);
          }
        }
        @keyframes crp-alert-flash {
          0%, 100% {
            border-color: #dc2626;
            box-shadow: 0 0 0 0px rgba(220, 38, 38, 0);
            background-color: #fef2f2;
          }
          50% {
            border-color: #b91c1c;
            box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.35);
            background-color: #fee2e2;
          }
        }
        .crp-urgent-pulse {
          animation: crp-flash 1.8s infinite ease-in-out;
          border-left-color: #ef4444 !important;
        }
        .crp-alert-pulse {
          animation: crp-alert-flash 0.8s infinite ease-in-out;
          border-left-color: #dc2626 !important;
        }
      `}</style>
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Patrimônio Líquido */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patrimônio Consolidado</span>
            <div className={`p-1.5 rounded flex items-center justify-center ${patrimonioGrowth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {patrimonioGrowth >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(currentPatrimonio)}</h3>
            <div className="flex items-center mt-1 text-[10px]">
              <span className={`font-bold flex items-center ${patrimonioGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {patrimonioGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {patrimonioGrowth >= 0 ? "+" : ""}{patrimonioGrowth.toFixed(2)}%
              </span>
              <span className="text-slate-400 ml-1.5 font-medium">vs. {prevCompetence.split("-")[1]}/{prevCompetence.split("-")[0]}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Resultado Financeiro */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fluxo de Caixa Líquido</span>
            <div className={`p-1.5 rounded flex items-center justify-center ${monthlyBalance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Briefcase className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className={`text-xl font-black tracking-tight ${monthlyBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatCurrency(monthlyBalance)}
            </h3>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-semibold">
              <span>Rec: {formatCurrency(totalReceitas + totalTransferencias)}</span>
              <span>Des: {formatCurrency(totalDespesas)}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Meta Atuarial */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Atuarial ({currentGoalObj?.metaAtuarialFormula.split(" ")[2]})</span>
            <div className={`p-1.5 rounded flex items-center justify-center ${currentGoalObj?.atingiuMeta ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {currentGoalObj?.atingiuMeta ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-black text-slate-800 tracking-tight">
                {formatPercent(currentGoalObj?.retornoPercentual)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">vs Meta {formatPercent(currentGoalObj?.metaAtuarialPercentual)}</span>
            </div>
            <div className="mt-1 flex items-center">
              <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold tracking-wider ${currentGoalObj?.atingiuMeta ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {currentGoalObj?.atingiuMeta ? 'CUMPRIDA' : 'NÃO ALCANCADA'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Demografia & Compliance */}
        <div className={`rounded shadow-sm p-4 flex flex-col justify-between transition-all duration-300 ${
          isUrgentAlert
            ? "bg-red-50 border-l-4 border-red-600 crp-alert-pulse"
            : isUrgent 
              ? "bg-rose-50 border-l-4 border-rose-500 crp-urgent-pulse" 
              : "bg-white border-l-4 border-orange-500"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Situação CRP</span>
            <div className={`p-1.5 rounded ${isUrgentAlert ? 'bg-red-100 text-red-600' : isUrgent ? 'bg-rose-100 text-rose-600' : 'bg-sky-50 text-sky-600'}`}>
              <ShieldCheck className={`h-3.5 w-3.5 ${isUrgentAlert ? 'animate-bounce' : ''}`} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-black text-slate-800 leading-tight">Nº {activeCRP.numero}</h3>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              {isUrgentAlert ? (
                <span className="font-black text-red-700 uppercase bg-red-100 px-1.5 py-0.5 rounded-sm text-[9px] flex items-center gap-0.5 animate-pulse">
                  ⚠️ URGENT ALERT
                </span>
              ) : isUrgent ? (
                <span className="font-bold text-rose-600 uppercase bg-rose-100 px-1.5 py-0.5 rounded-sm text-[9px] flex items-center gap-0.5 animate-pulse">
                  EXPIRA EM BREVE
                </span>
              ) : (
                <span className="font-bold text-emerald-600 uppercase bg-emerald-100 px-1.5 py-0.5 rounded-sm text-[9px]">
                  REGULAR
                </span>
              )}
              <span className={`font-semibold ${isUrgentAlert ? 'text-red-600 font-bold' : isUrgent ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                Validade: {formattedValidade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 gap-4">
        {/* Chart 1: Cash Flow (Revenues vs Expenses) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Fluxo de Caixa Consolidado (2026)</h4>
              <p className="text-[11px] text-slate-400">Acompanhamento mensal das receitas arrecadadas (incluindo aportes) e despesas liquidadas.</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFlowData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value)), ""]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Receitas" fill="#10b981" name="Receitas Próprias" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Aportes" fill="#0284c7" name="Aportes/Transferências" stackId="a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Despesas" fill="#ef4444" name="Despesas Totais" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Actuarial Performance & Coverage Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Actuarial return vs target */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 lg:col-span-2">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Retorno mensal vs Meta mensal</h4>
            <p className="text-[11px] text-slate-400">Barras coloridas por atingimento</p>
          </div>
          <div className="h-44 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={actuarialChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                <Bar 
                  dataKey="Retorno" 
                  name="Retorno Mensal (%)" 
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                >
                  {actuarialChartData.map((entry, index) => {
                    const isMet = entry.Retorno >= entry.Meta;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={isMet ? "#10b981" : "#dc2626"} 
                      />
                    );
                  })}
                </Bar>
                <Line 
                  type="monotone" 
                  dataKey="Meta" 
                  stroke="#ca8a04" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Meta Atuarial (%)" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographic widget summary */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Resumo Demográfico (Segurados)</h4>
            <p className="text-[11px] text-slate-400">Relação entre servidores contribuintes e beneficiários dependentes.</p>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Servidores Ativos (Contribuintes)</span>
                <span className="text-xs font-bold text-slate-800">{formatNumber(totalAtivos)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-sky-600 h-2 rounded-full" 
                  style={{ width: `${(totalAtivos / (totalAtivos + totalBeneficiarios)) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Inativos e Pensionistas (Beneficiários)</span>
                <span className="text-xs font-bold text-slate-800">{formatNumber(totalBeneficiarios)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full" 
                  style={{ width: `${(totalBeneficiarios / (totalAtivos + totalBeneficiarios)) * 100}%` }}
                ></div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Razão de Equivalência</span>
                <span className="text-xs font-bold text-slate-800">
                  {totalBeneficiarios ? `${((totalAtivos / totalBeneficiarios) || 0).toFixed(2)} ativos / inativo` : "0,00"}
                </span>
              </div>
              <p className="text-[9px] text-slate-400">Representa a quantidade de servidores ativos em atividade para cada 1 beneficiário inativo ou pensionista.</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-2">
            <Users className="h-3 w-3 text-slate-400" />
            <span>Dados da competência atualizados de forma direta</span>
          </div>
        </div>
      </div>
    </div>
  );
};
