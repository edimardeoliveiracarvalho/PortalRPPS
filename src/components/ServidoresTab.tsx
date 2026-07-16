import React from "react";
import { seguradosAtivos } from "../data";
import { beneficios } from "../data_beneficios";
import { formatNumber } from "../utils";
import { 
  Users, 
  UserCheck, 
  Activity, 
  UsersRound, 
  TrendingUp, 
  Scale,
  ShieldCheck
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
  LineChart,
  Line
} from "recharts";

interface ServidoresTabProps {
  competence: string;
}

export const ServidoresTab: React.FC<ServidoresTabProps> = ({ competence }) => {
  // Current active servants for selected month
  const currentServidores = seguradosAtivos.find(s => s.competencia === competence);
  const totalAtivos = currentServidores?.quantidadeAtivos || 0;

  // Current inactive servants for selected month
  const currentBeneficios = beneficios.find(b => b.competencia === competence && b.fundo === "consolidado");
  const totalInativos = currentBeneficios?.totalBeneficiarios || 0;

  // Covered Lives
  const totalVidas = totalAtivos + totalInativos;

  // Razão ativos/inativos (Ativos / Inativos)
  const ratioAtivosInativos = totalInativos ? (totalAtivos / totalInativos) : 0;

  // Find index of selected competence in seguradosAtivos to get the 12-month period ending in selected competence
  const compIndex = React.useMemo(() => {
    return seguradosAtivos.findIndex(s => s.competencia === competence);
  }, [competence]);

  const chartData12Months = React.useMemo(() => {
    let list = seguradosAtivos;
    if (compIndex !== -1) {
      const start = Math.max(0, compIndex - 11);
      list = seguradosAtivos.slice(start, compIndex + 1);
    } else {
      list = seguradosAtivos.slice(-12);
    }

    return list.map(item => {
      const comp = item.competencia;
      const parts = comp.split("-");
      const year = parts[0].substring(2);
      const month = parts[1];
      const monthNames: { [key: string]: string } = {
        "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
        "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
      };
      const label = `${monthNames[month]}/${year}`;
      return {
        name: label,
        "quantidadeAtivos": item.quantidadeAtivos,
        "quantidadeInativos": item.quantidadeInativos,
      };
    });
  }, [competence, compIndex]);

  // 2026 Demographic data for Chart
  const demographicData2026 = React.useMemo(() => {
    const all2026Comp = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
    const selectedIndex = all2026Comp.indexOf(competence);
    const activeCompetencies = selectedIndex !== -1 ? all2026Comp.slice(0, selectedIndex + 1) : all2026Comp;

    const monthLabels: { [key: string]: string } = {
      "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
      "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
    };

    return activeCompetencies.map(comp => {
      const activeObj = seguradosAtivos.find(s => s.competencia === comp);
      const inactiveObj = beneficios.find(b => b.competencia === comp && b.fundo === "consolidado");
      const mStr = comp.split("-")[1];
      const label = monthLabels[mStr] || mStr;
      return {
        name: label,
        "Servidores Ativos": activeObj?.quantidadeAtivos || 0,
        "Beneficiários Inativos": inactiveObj?.totalBeneficiarios || 0,
      };
    });
  }, [competence]);

  return (
    <div className="space-y-4">
      {/* Demographic Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total covered lives */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-blue-50 text-blue-600">
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total de Vidas Seguradas</span>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{formatNumber(totalVidas)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Servidores ativos + beneficiários
            </span>
          </div>
        </div>

        {/* Active Servants */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-emerald-50 text-emerald-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Servidores Ativos</span>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{formatNumber(totalAtivos)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Público em atividade (contribuintes)
            </span>
          </div>
        </div>

        {/* Inactive & Pensioners */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4 flex items-center space-x-4">
          <div className="p-2.5 rounded bg-purple-50 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Inativos & Pensionistas</span>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{formatNumber(totalInativos)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Total de beneficiários amparados
            </span>
          </div>
        </div>

        {/* Ratio Ativos/Inativos */}
        <div className="bg-white rounded shadow-sm border-l-4 border-orange-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Razão ativos/inativos</span>
            <div className="p-1.5 rounded bg-orange-50 text-orange-600 flex items-center justify-center">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {ratioAtivosInativos.toFixed(2)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Equivale a {ratioAtivosInativos.toFixed(2)} ativos para cada inativo
            </span>
          </div>
        </div>
      </div>

      {/* Main Demographic Chart */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Equilíbrio Demográfico (Ativos vs. Inativos)</h4>
          <p className="text-[11px] text-slate-400">Comparativo mensal da força de trabalho ativa contribuinte em relação ao número total de dependentes inativos/pensionistas.</p>
        </div>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demographicData2026} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${formatNumber(val)}`}
              />
              <Tooltip 
                formatter={(value: any) => [formatNumber(Number(value)), ""]}
                labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend verticalAlign="top" height={28} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="Servidores Ativos" fill="#0284c7" radius={[4, 4, 0, 0]} name="Servidores Ativos (Contribuintes)" />
              <Bar dataKey="Beneficiários Inativos" fill="#10b981" radius={[4, 4, 0, 0]} name="Beneficiários Inativos (Assistidos)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical charts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Chart: Histórico de Contribuintes Ativos */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-blue-600" />
              Histórico de Contribuintes Ativos
            </h4>
            <p className="text-[11px] text-slate-400">Evolução do número de servidores ativos nos últimos 12 meses.</p>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData12Months} margin={{ top: 10, right: 15, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `${formatNumber(val)}`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatNumber(Number(value)), "Servidores Ativos"]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantidadeAtivos" 
                  stroke="#0284c7" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Servidores Ativos" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Histórico de Inativos e Pensionistas */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-600" />
              Histórico de Inativos e Pensionistas
            </h4>
            <p className="text-[11px] text-slate-400">Evolução do número de beneficiários inativos e pensionistas nos últimos 12 meses.</p>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData12Months} margin={{ top: 10, right: 15, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `${formatNumber(val)}`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatNumber(Number(value)), "Inativos e Pensionistas"]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantidadeInativos" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Inativos & Pensionistas" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
