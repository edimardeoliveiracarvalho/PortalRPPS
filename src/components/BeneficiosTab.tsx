import React, { useState } from "react";
import { beneficios } from "../data_beneficios";
import { formatCurrency, formatNumber, getPrevCompetence } from "../utils";
import { 
  Users, 
  UserPlus, 
  Wallet, 
  PiggyBank, 
  ShieldCheck, 
  Info,
  Calendar
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";

interface BeneficiosTabProps {
  competence: string;
}

export const BeneficiosTab: React.FC<BeneficiosTabProps> = ({ competence }) => {
  // We allow selecting which Fundo to view (reparticao, capitalizacao, consolidado)
  const [activeFundo, setActiveFundo] = useState<"consolidado" | "reparticao" | "capitalizacao">("consolidado");

  // Get data for this competence and active fund
  const dataThisCompetence = beneficios.find(b => b.competencia === competence && b.fundo === activeFundo);
  
  // Previous competence
  const prevCompetence = getPrevCompetence(competence);
  const dataPrevCompetence = beneficios.find(b => b.competencia === prevCompetence && b.fundo === activeFundo);

  const aposentadosCount = dataThisCompetence?.aposentados || 0;
  const aposentadosVal = dataThisCompetence?.valorAposentados || 0;
  const pensionistasCount = dataThisCompetence?.pensionistas || 0;
  const pensionistasVal = dataThisCompetence?.valorPensionistas || 0;
  const totalBeneficiarios = dataThisCompetence?.totalBeneficiarios || 0;
  const totalVal = dataThisCompetence?.valorTotal || 0;

  const novosAposentados = dataThisCompetence?.novosAposentados || 0;
  const novosPensionistas = dataThisCompetence?.novosPensionistas || 0;

  // Average payout per benefit type
  const avgAposentadoria = aposentadosCount ? aposentadosVal / aposentadosCount : 0;
  const avgPensao = pensionistasCount ? pensionistasVal / pensionistasCount : 0;
  const avgOverall = totalBeneficiarios ? totalVal / totalBeneficiarios : 0;

  // Pie chart data: Aposentadorias vs Pensões (Selected Fundo & Selected Competence)
  const pieData = [
    { name: "Aposentadorias", value: aposentadosVal, count: aposentadosCount },
    { name: "Pensões", value: pensionistasVal, count: pensionistasCount }
  ];
  const COLORS = ["#0284c7", "#10b981"];

  // Historical data for 2026 for Area Chart
  const historicalCompetences = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"].filter(comp => comp <= competence);
  const historicalBeneficiosData = historicalCompetences.map(comp => {
    const item = beneficios.find(b => b.competencia === comp && b.fundo === activeFundo);
    const label = comp.split("-")[1] === "01" ? "Jan" :
                  comp.split("-")[1] === "02" ? "Fev" :
                  comp.split("-")[1] === "03" ? "Mar" :
                  comp.split("-")[1] === "04" ? "Abr" :
                  comp.split("-")[1] === "05" ? "Mai" : "Jun";
    return {
      name: label,
      "Aposentados": item?.aposentados || 0,
      "Pensionistas": item?.pensionistas || 0,
      "Total Beneficiários": item?.totalBeneficiarios || 0,
      "Valor Pago (Milhões)": item ? parseFloat((item.valorTotal / 1000000).toFixed(2)) : 0
    };
  });

  // Descriptions of funds
  const fundDescriptions = {
    consolidado: "Consolidado total da Maringá Previdência, unificando os fundos em repartição simples e capitalização.",
    reparticao: "Fundo em Repartição Simples (Fundo Financeiro): Mantido pelo regime financeiro onde os servidores ativos financiam diretamente os inativos atuais (servidores mais antigos ingressantes até determinada data limite).",
    capitalizacao: "Fundo em Capitalização (Fundo Previdenciário): Mantido pelo regime de capitalização, onde as contribuições acumuladas dos servidores são investidas para garantir seus próprios benefícios futuros (servidores admitidos após a estruturação)."
  };

  return (
    <div className="space-y-4">
      {/* Selector of Fundo */}
      <div className="bg-white rounded shadow-xs border border-slate-200 p-2 flex items-center justify-between">
        <div className="flex space-x-2">
          {(["consolidado", "capitalizacao", "reparticao"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFundo(f)}
              className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFundo === f
                  ? "bg-[#1e3a8a] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {f === "consolidado" ? "CONSOLIDADO" : f === "capitalizacao" ? "CAPITALIZAÇÃO" : "REPARTIÇÃO"}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium mr-2">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Filtro de regime atuarial e fundos de previdência</span>
        </div>
      </div>

      {/* Main KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Beneficiaries Card */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-sky-50 text-sky-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total de Beneficiários</span>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{formatNumber(totalBeneficiarios)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              {aposentadosCount} Aposentados | {pensionistasCount} Pensionistas
            </span>
          </div>
        </div>

        {/* Total Payments Card */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-emerald-50 text-emerald-600">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Valor Total Mensal Pago</span>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(totalVal)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Média ponderada por benefício: {formatCurrency(avgOverall)}
            </span>
          </div>
        </div>

        {/* New Entrants Card */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-purple-50 text-purple-600">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Novas Concessões do Mês</span>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">+{formatNumber(novosAposentados + novosPensionistas)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              +{novosAposentados} Aposentadorias | +{novosPensionistas} Pensões
            </span>
          </div>
        </div>
      </div>

      {/* Split details for Retirees and Pensioners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Aposentados Detailed Box */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
              <h4 className="text-sm font-bold text-slate-800">Aposentados</h4>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded">Aposentadorias</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Quantidade de Inativos</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{formatNumber(aposentadosCount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Folha Mensal</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(aposentadosVal)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Benefício Médio</p>
              <p className="text-base font-bold text-sky-700 mt-1">{formatCurrency(avgAposentadoria)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Novos Registros</p>
              <p className="text-base font-bold text-purple-700 mt-1">+{formatNumber(novosAposentados)} segurados</p>
            </div>
          </div>
        </div>

        {/* Pensionistas Detailed Box */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <h4 className="text-sm font-bold text-slate-800">Pensionistas</h4>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded">Pensões</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Quantidade de Pensionistas</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{formatNumber(pensionistasCount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Folha Mensal</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(pensionistasVal)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Benefício Médio</p>
              <p className="text-base font-bold text-emerald-700 mt-1">{formatCurrency(avgPensao)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">Novos Registros</p>
              <p className="text-base font-bold text-purple-700 mt-1">+{formatNumber(novosPensionistas)} pensões</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie/Donut Chart: Value Distribution */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Distribuição Financeira dos Benefícios</h4>
            <p className="text-[11px] text-slate-400">Proporção do valor pago em Aposentadorias vs. Pensões nesta competência.</p>
          </div>
          <div className="h-44 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${formatCurrency(Number(value))} (${formatNumber(props.payload.count)} benefícios)`, 
                    name
                  ]}
                />
                <Legend verticalAlign="bottom" height={24} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 text-center border-t border-slate-50 pt-2">
            Aposentadorias compõem {((aposentadosVal / totalVal) * 100).toFixed(1)}% do dispêndio previdenciário do regime.
          </div>
        </div>

        {/* Historical Evolution Chart for active Fund */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 lg:col-span-2">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Evolução de Custos da Folha Previdenciária (2026)</h4>
            <p className="text-[11px] text-slate-400">Evolução do desembolso mensal total com benefícios previdenciários (Aposentadorias + Pensões) em R$ Milhões.</p>
          </div>
          <div className="h-48 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalBeneficiosData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotalPago" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={activeFundo === "consolidado" ? [22, 30] : ["auto", "auto"]}
                  tickFormatter={(val) => `R$ ${val}M`}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => {
                    if (name === "Valor Pago (Milhões)") {
                      return [`R$ ${value}M`, "Valor Total Pago"];
                    }
                    return [value, name];
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={28} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="Valor Pago (Milhões)" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotalPago)" name="Valor Pago (Milhões)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
