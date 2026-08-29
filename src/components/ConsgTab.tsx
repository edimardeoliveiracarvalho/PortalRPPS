import React, { useMemo, useState } from "react";
import { emprestimosConsignados, evolucaoCarteiraConsolidada, retornoMetaAtuarial } from "../data";
import { formatCurrency, formatNumber, getMonthName, getPrevCompetence } from "../utils";
import { 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Info,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Scale,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  Cell,
  LabelList,
  ComposedChart,
  Line
} from "recharts";

// Consignment Loan data normalized from single-source data.ts
export const emprestimosConsignadosData = emprestimosConsignados.map(item => ({
  competencia: item.competencia,
  saldoInicial: item.saldoInicial,
  valorConcedido: item.concessoesMes ?? item.valorEmprestado,
  valorAmortizado: item.amortizacoesMes ?? item.valorAmortizado,
  saldoFinal: item.saldoCarteira,
  retornoFinanceiro: item.retornoFinanceiro ?? item.jurosMes ?? 0,
  retornoPercentual: item.retornoPercentual ?? 0,
  contratosNovos: item.contratosNovos ?? item.quantidadeContratos,
  contratosQuitados: item.contratosQuitados ?? 0,
  contratosAtivos: item.contratosAtivos ?? item.quantidadeContratos,
  prazosContratados: item.prazosContratados ?? [],
  fundoRisco: item.fundoRisco ?? {
    saldoInicial: 0,
    entradas: 0,
    saidas: 0,
    saldoFinal: 0
  }
}));

interface ConsgTabProps {
  competence: string;
}

export const ConsgTab: React.FC<ConsgTabProps> = ({ competence }) => {
  // Mode selection key state for Chart 1: "recurso" or "contrato"
  const [evolutionMode, setEvolutionMode] = useState<"recurso" | "contrato">("recurso");

  // State for horizontal bar chart (Monthly vs Accumulated)
  const [termViewMode, setTermViewMode] = useState<"mensal" | "acumulado">("mensal");

  // State for Table View: "carteira" | "fundoRisco"
  const [tableTab, setTableTab] = useState<"carteira" | "fundoRisco">("carteira");

  // Find current and previous month records
  const currentLoan = useMemo(() => {
    return emprestimosConsignadosData.find(c => c.competencia === competence) || emprestimosConsignadosData[emprestimosConsignadosData.length - 1];
  }, [competence]);

  const prevCompetence = getPrevCompetence(currentLoan.competencia);
  const prevLoan = useMemo(() => {
    return emprestimosConsignadosData.find(c => c.competencia === prevCompetence);
  }, [prevCompetence]);

  // Core KPIs
  const saldoFinal = currentLoan.saldoFinal;
  const prevSaldoFinal = prevLoan?.saldoFinal || 0;
  const saldoGrowthVal = saldoFinal - prevSaldoFinal;
  const saldoGrowthPct = prevSaldoFinal ? (saldoGrowthVal / prevSaldoFinal) * 100 : 0;

  const contratosAtivos = currentLoan.contratosAtivos;
  const prevContratosAtivos = prevLoan?.contratosAtivos || 0;
  const contratosGrowthVal = contratosAtivos - prevContratosAtivos;

  const valorConcedido = currentLoan.valorConcedido;
  const valorAmortizado = currentLoan.valorAmortizado;
  const netFlow = valorConcedido - valorAmortizado;

  const retornoFinanceiro = currentLoan.retornoFinanceiro;
  const retornoPercentual = currentLoan.retornoPercentual;

  // Fundo de Risco KPIs
  const currentFundoRisco = currentLoan.fundoRisco || { saldoInicial: 0, entradas: 0, saidas: 0, saldoFinal: 0 };
  const prevFundoRisco = prevLoan?.fundoRisco || { saldoInicial: 0, entradas: 0, saidas: 0, saldoFinal: 0 };
  
  const fundoSaldoFinal = currentFundoRisco.saldoFinal;
  const fundoEntradas = currentFundoRisco.entradas;
  const fundoSaidas = currentFundoRisco.saidas;
  const fundoSaldoInicial = currentFundoRisco.saldoInicial;
  
  const fundoVarVal = fundoSaldoFinal - prevFundoRisco.saldoFinal;
  const fundoVarPct = prevFundoRisco.saldoFinal > 0 ? (fundoVarVal / prevFundoRisco.saldoFinal) * 100 : 0;
  
  // Taxa de Cobertura do Fundo de Risco em relação ao Saldo Total da Carteira Consignada
  const coberturaCarteiraPct = saldoFinal > 0 ? (fundoSaldoFinal / saldoFinal) * 100 : 0;

  // Horizontal bar chart data for term distribution
  const termDistributionData = useMemo(() => {
    let activePrazos: number[] = [];
    
    if (termViewMode === "mensal") {
      activePrazos = currentLoan.prazosContratados || [];
    } else {
      const relevantLoans = emprestimosConsignadosData.filter(
        item => item.competencia <= currentLoan.competencia
      );
      activePrazos = relevantLoans.reduce<number[]>((acc, item) => {
        return acc.concat(item.prazosContratados || []);
      }, []);
    }

    const counts: Record<string, number> = {
      "96 meses": 0,
      "84 meses": 0,
      "72 meses": 0,
      "60 meses": 0,
      "48 meses": 0,
      "36 meses": 0,
      "24 meses": 0,
      "12 meses": 0,
    };

    activePrazos.forEach(p => {
      if (p > 84) counts["96 meses"]++;
      else if (p > 72) counts["84 meses"]++;
      else if (p > 60) counts["72 meses"]++;
      else if (p > 48) counts["60 meses"]++;
      else if (p > 36) counts["48 meses"]++;
      else if (p > 24) counts["36 meses"]++;
      else if (p > 12) counts["24 meses"]++;
      else counts["12 meses"]++;
    });

    const total = activePrazos.length || 1;

    return [
      { range: "96 meses", count: counts["96 meses"], pct: (counts["96 meses"] / total) * 100 },
      { range: "84 meses", count: counts["84 meses"], pct: (counts["84 meses"] / total) * 100 },
      { range: "72 meses", count: counts["72 meses"], pct: (counts["72 meses"] / total) * 100 },
      { range: "60 meses", count: counts["60 meses"], pct: (counts["60 meses"] / total) * 100 },
      { range: "48 meses", count: counts["48 meses"], pct: (counts["48 meses"] / total) * 100 },
      { range: "36 meses", count: counts["36 meses"], pct: (counts["36 meses"] / total) * 100 },
      { range: "24 meses", count: counts["24 meses"], pct: (counts["24 meses"] / total) * 100 },
      { range: "12 meses", count: counts["12 meses"], pct: (counts["12 meses"] / total) * 100 },
    ];
  }, [currentLoan, termViewMode]);

  // Enquadramento Limite 10% do Patrimônio Consolidado
  const currentPatrimonio = useMemo(() => {
    return evolucaoCarteiraConsolidada.find(p => p.competencia === currentLoan.competencia) || 
           evolucaoCarteiraConsolidada[evolucaoCarteiraConsolidada.length - 1];
  }, [currentLoan.competencia]);

  const patrimonioConsolidado = currentPatrimonio.valorCarteiraConsolidada;
  const limiteMaximo = patrimonioConsolidado * 0.10;
  const percentualUtilizado = patrimonioConsolidado > 0 ? (saldoFinal / patrimonioConsolidado) * 100 : 0;
  const margemDisponivel = Math.max(0, limiteMaximo - saldoFinal);

  // Historical chart data
  const chartHistoricalData = useMemo(() => {
    return emprestimosConsignadosData.map(item => {
      const [year, month] = item.competencia.split("-");
      const shortMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const label = `${shortMonths[parseInt(month, 10) - 1]}/${year.slice(2)}`;
      const fundo = item.fundoRisco || { saldoInicial: 0, entradas: 0, saidas: 0, saldoFinal: 0 };
      const cobPct = item.saldoFinal > 0 ? (fundo.saldoFinal / item.saldoFinal) * 100 : 0;

      return {
        ...item,
        name: label,
        "Saldo (Milhões)": parseFloat((item.saldoFinal / 1000000).toFixed(2)),
        "Contratos Ativos": item.contratosAtivos,
        "Concedido (k)": parseFloat((item.valorConcedido / 1000).toFixed(1)),
        "Amortizado (k)": parseFloat((item.valorAmortizado / 1000).toFixed(1)),
        "Retorno (k)": parseFloat((item.retornoFinanceiro / 1000).toFixed(2)),
        "Rentabilidade (%)": item.retornoPercentual,
        "Fundo Risco (k)": parseFloat((fundo.saldoFinal / 1000).toFixed(2)),
        "Entradas Fundo (k)": parseFloat((fundo.entradas / 1000).toFixed(2)),
        "Cobertura (%)": parseFloat(cobPct.toFixed(2))
      };
    });
  }, []);

  // Fetch actual monthly actuarial target percentual
  const currentMeta = useMemo(() => {
    return retornoMetaAtuarial.find(m => m.competencia === currentLoan.competencia);
  }, [currentLoan.competencia]);

  const metaMensalPercentual = currentMeta ? currentMeta.metaAtuarialPercentual * 100 : 0.49;

  // Performance status traffic light (Semáforo)
  const performanceStatus = useMemo(() => {
    const diff = retornoPercentual - metaMensalPercentual;
    if (diff >= 0.30) {
      return {
        label: "Excelente",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        dot: "bg-emerald-500",
        desc: `Retorno de ${retornoPercentual.toFixed(2)}% supera com folga a meta atuarial de ${metaMensalPercentual.toFixed(2)}%, gerando um expressivo spread positivo de +${diff.toFixed(2)}% a.m.`
      };
    } else if (diff >= 0) {
      return {
        label: "Adequado",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        dot: "bg-blue-500",
        desc: `Retorno de ${retornoPercentual.toFixed(2)}% alinhado ou ligeiramente superior à meta atuarial de ${metaMensalPercentual.toFixed(2)}%, gerando spread positivo de +${diff.toFixed(2)}% a.m.`
      };
    } else {
      return {
        label: "Atenção",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        dot: "bg-amber-500",
        desc: `Retorno de ${retornoPercentual.toFixed(2)}% ficou abaixo da meta atuarial de ${metaMensalPercentual.toFixed(2)}% para este período (diferença de ${diff.toFixed(2)}% a.m.).`
      };
    }
  }, [retornoPercentual, metaMensalPercentual]);

  // Financial return analysis compared with previous month
  const prevRetornoPercentual = prevLoan?.retornoPercentual || 0;
  const returnDiff = retornoPercentual - prevRetornoPercentual;

  return (
    <div className="space-y-4">
      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Saldo Final da Carteira */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saldo da Carteira</span>
            <div className={`p-1.5 rounded flex items-center justify-center ${saldoGrowthVal >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {saldoGrowthVal >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(saldoFinal)}</h3>
            <div className="flex items-center mt-1 text-[10px]">
              <span className={`font-bold flex items-center ${saldoGrowthVal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {saldoGrowthVal >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {saldoGrowthVal >= 0 ? "+" : ""}{formatCurrency(saldoGrowthVal)} ({saldoGrowthPct.toFixed(1)}%)
              </span>
              <span className="text-slate-400 font-semibold ml-1">vs. mês anterior</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Contratos Ativos */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contratos Ativos</span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatNumber(contratosAtivos)}</h3>
            <div className="flex items-center mt-1 text-[10px] text-slate-400 font-semibold">
              <span className="text-blue-700 font-bold mr-1">+{currentLoan.contratosNovos} novos</span>
              <span>|</span>
              <span className="text-amber-600 font-bold mx-1">{currentLoan.contratosQuitados} quitados</span>
              <span>neste mês</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Fluxo de Recursos */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fluxo Líquido Mensal</span>
            <div className={`p-1.5 rounded flex items-center justify-center ${netFlow >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {netFlow >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(netFlow)}</h3>
            <div className="flex items-center mt-1 text-[10px] text-slate-400 font-semibold justify-between">
              <span>Conc: <span className="text-emerald-600 font-bold">{formatCurrency(valorConcedido)}</span></span>
              <span>Amort: <span className="text-slate-600 font-bold">{formatCurrency(valorAmortizado)}</span></span>
            </div>
          </div>
        </div>

        {/* KPI 4: Retorno Financeiro e Rentabilidade */}
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Retorno e Rendimento</span>
            <div className="p-1.5 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(retornoFinanceiro)}</h3>
            <div className="flex items-center mt-1 text-[10px]">
              <span className="bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded mr-1">
                {retornoPercentual.toFixed(2)}% a.m.
              </span>
              <span className="text-slate-400 font-semibold">
                ({returnDiff >= 0 ? "+" : ""}{returnDiff.toFixed(2)}% vs ant.)
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Alertas e Estatísticas - Grid 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Semáforo de Performance */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <span className={`w-2.5 h-2.5 rounded-full ${performanceStatus.dot} mr-2 animate-pulse`}></span>
                Semáforo de Rentabilidade
              </h4>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${performanceStatus.color}`}>
                {performanceStatus.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              {performanceStatus.desc}
            </p>
          </div>
          <div className="mt-4 bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[10px] space-y-1.5">
            <div className="flex justify-between text-slate-500">
              <span>Retorno do Mês:</span>
              <span className="font-bold text-slate-800">{retornoPercentual.toFixed(2)}% a.m.</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Meta Atuarial Mensal:</span>
              <span className="font-bold text-indigo-700">{metaMensalPercentual.toFixed(2)}% a.m.</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Spread de Rendimento:</span>
              <span className={`font-bold ${(retornoPercentual - metaMensalPercentual) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {(retornoPercentual - metaMensalPercentual) >= 0 ? "+" : ""}{(retornoPercentual - metaMensalPercentual).toFixed(2)}% a.m.
              </span>
            </div>
          </div>
        </div>

        {/* Card Comparativo de Enquadramento e Limites (Patrimônio vs Carteira) */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center border-b border-slate-100 pb-2.5">
              <Layers className="h-4 w-4 mr-2 text-indigo-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Limite & Política de Investimento
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Comparativo do saldo de empréstimos com o Patrimônio Consolidado do RPPS e o limite máximo regulamentar de 10%.
            </p>
          </div>
          
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>Utilização do Limite:</span>
                <span className="font-bold text-slate-800">{percentualUtilizado.toFixed(2)}% de 10,00%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (percentualUtilizado / 10) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[10px] space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Patrimônio Consolidado:</span>
                <span className="font-bold text-slate-800">{formatCurrency(patrimonioConsolidado)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Limite Máximo (10% PL):</span>
                <span className="font-bold text-indigo-700">{formatCurrency(limiteMaximo)}</span>
              </div>
              <div className="flex justify-between text-slate-500 border-t border-slate-200/60 pt-1.5">
                <span>Margem Livre Consignável:</span>
                <span className="font-black text-emerald-600">{formatCurrency(margemDisponivel)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Distribuição de Contratos por Prazo */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2 mb-2">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Layers className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                Contratos por Prazo
              </h4>
            </div>
            <div className="mt-1 sm:mt-0 flex bg-slate-100 p-0.5 rounded-md self-start">
              <button
                onClick={() => setTermViewMode("mensal")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                  termViewMode === "mensal"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                No Mês
              </button>
              <button
                onClick={() => setTermViewMode("acumulado")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                  termViewMode === "acumulado"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Acumulado
              </button>
            </div>
          </div>
          
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={termDistributionData}
                margin={{ top: 0, right: 35, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide domain={[0, 'dataMax + 10']} />
                <YAxis 
                  dataKey="range" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} contratos`, "Quantidade"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {termDistributionData.map((entry, index) => {
                    const colors = ["#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#38bdf8", "#34d399", "#fbbf24", "#f87171"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                  <LabelList 
                    dataKey="count" 
                    position="right" 
                    formatter={(val: any) => val > 0 ? `${val}` : ""}
                    style={{ fontSize: "10px", fill: "#475569", fontWeight: 700 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid: Carteira & Concessões vs Amortizações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Evolução Histórica do Saldo da Carteira */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Evolução Histórica do Saldo da Carteira</h4>
              <p className="text-[11px] text-slate-400">Acompanhamento do saldo e quantidade de contratos ativos ao longo dos meses.</p>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-lg self-start">
              <button
                onClick={() => setEvolutionMode("recurso")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  evolutionMode === "recurso"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Recurso (R$)
              </button>
              <button
                onClick={() => setEvolutionMode("contrato")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  evolutionMode === "contrato"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Contratos
              </button>
            </div>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              {evolutionMode === "recurso" ? (
                <AreaChart data={chartHistoricalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConsgSaldo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `R$ ${val}M`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`R$ ${value} Milhões`, "Saldo"]}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Area type="monotone" dataKey="Saldo (Milhões)" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorConsgSaldo)" />
                </AreaChart>
              ) : (
                <BarChart data={chartHistoricalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} contratos`, "Ativos"]}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="Contratos Ativos" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Concessões vs Amortizações */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Concessões vs. Amortizações Mensais</h4>
            <p className="text-[11px] text-slate-400">Volume concedido de novos contratos em confronto com os valores amortizados.</p>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartHistoricalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                  formatter={(value: any) => [`R$ ${value}k`, ""]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={32} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#475569" }} />
                <Bar dataKey="Concedido (k)" fill="#10b981" radius={[4, 4, 0, 0]} name="Volume Concedido (Novos)" />
                <Bar dataKey="Amortizado (k)" fill="#ef4444" radius={[4, 4, 0, 0]} name="Volume Amortizado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid 2: Evolução Fundo de Risco & Retorno Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart: Evolução do Saldo do Fundo de Risco */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-indigo-600" />
              Evolução do Saldo do Fundo de Risco
            </h4>
            <p className="text-[11px] text-slate-400">Acompanhamento do saldo acumulado da provisão de risco e das entradas mensais.</p>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartHistoricalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFundoSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                  formatter={(value: any, name: any) => [`R$ ${value}k`, name]}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={32} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#475569" }} />
                <Bar dataKey="Entradas Fundo (k)" fill="#10b981" radius={[4, 4, 0, 0]} name="Aporte Mensal (R$ k)" />
                <Area type="monotone" dataKey="Fundo Risco (k)" stroke="#4338ca" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFundoSaldo)" name="Saldo Acumulado (R$ k)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Evolução do Retorno e Rentabilidade */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Evolução de Retorno Financeiro vs. Rentabilidade Percentual</h4>
            <p className="text-[11px] text-slate-400">Geração de juros reais recebidos no período em confronto com a rentabilidade percentual.</p>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartHistoricalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsgReturn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                  formatter={(value: any, name: any) => {
                    if (name === "Rentabilidade (%)") return [`${value}% a.m.`, name];
                    return [`R$ ${value}k`, name];
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={32} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#475569" }} />
                <Area type="monotone" dataKey="Retorno (k)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorConsgReturn)" name="Retorno Financeiro (R$ k)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Historical Data Table Section with Tab selector */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Demonstrativo Detalhado de Empréstimos Consignados</h4>
            <p className="text-[11px] text-slate-400">Histórico completo mensal de posições, movimentações e constituição do Fundo de Risco.</p>
          </div>
          
          <div className="flex bg-slate-100 p-0.5 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setTableTab("carteira")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center ${
                tableTab === "carteira"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Movimentação da Carteira
            </button>
            <button
              onClick={() => setTableTab("fundoRisco")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center ${
                tableTab === "fundoRisco"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              Demonstrativo Fundo de Risco
            </button>
          </div>
        </div>

        {tableTab === "carteira" ? (
          /* TABELA 1: MOVIMENTAÇÃO GERAL DA CARTEIRA */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Competência</th>
                  <th className="py-3 px-4 text-right">Saldo Inicial</th>
                  <th className="py-3 px-4 text-right">Valor Concedido</th>
                  <th className="py-3 px-4 text-right">Valor Amortizado</th>
                  <th className="py-3 px-4 text-right">Saldo Final</th>
                  <th className="py-3 px-4 text-right">Fundo de Risco</th>
                  <th className="py-3 px-4 text-right">Retorno Juros</th>
                  <th className="py-3 px-4 text-center">Rentabilidade</th>
                  <th className="py-3 px-4 text-center">Novos</th>
                  <th className="py-3 px-4 text-center">Ativos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {[...emprestimosConsignadosData]
                  .sort((a, b) => b.competencia.localeCompare(a.competencia))
                  .map((row) => {
                    const isCurrent = row.competencia === competence;
                    return (
                      <tr 
                        key={row.competencia} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCurrent ? "bg-indigo-50/40 font-bold text-slate-950 border-y border-indigo-100/50" : "text-slate-600"
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold uppercase">
                          <span className="flex items-center">
                            {isCurrent && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>}
                            {getMonthName(row.competencia)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">{formatCurrency(row.saldoInicial)}</td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-600">+{formatCurrency(row.valorConcedido)}</td>
                        <td className="py-3 px-4 text-right font-mono text-rose-600">-{formatCurrency(row.valorAmortizado)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-950">{formatCurrency(row.saldoFinal)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700">{formatCurrency(row.fundoRisco.saldoFinal)}</td>
                        <td className="py-3 px-4 text-right font-mono text-amber-600">{formatCurrency(row.retornoFinanceiro)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded ${
                            row.retornoPercentual >= 1.10 
                              ? "bg-emerald-50 text-emerald-700" 
                              : row.retornoPercentual >= 0.95 
                              ? "bg-blue-50 text-blue-700" 
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {row.retornoPercentual.toFixed(2)}% a.m.
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-800">{row.contratosNovos}</td>
                        <td className="py-3 px-4 text-center font-bold text-indigo-900">{row.contratosAtivos}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          /* TABELA 2: DEMONSTRATIVO DO FUNDO DE RISCO */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Competência</th>
                  <th className="py-3 px-4 text-right">Saldo Inicial Fundo</th>
                  <th className="py-3 px-4 text-right">Entradas (Aportes)</th>
                  <th className="py-3 px-4 text-right">Saídas (Sinistros)</th>
                  <th className="py-3 px-4 text-right">Saldo Final Fundo</th>
                  <th className="py-3 px-4 text-right">Saldo da Carteira</th>
                  <th className="py-3 px-4 text-center">% Cobertura</th>
                  <th className="py-3 px-4 text-center">Status de Inadimplência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {[...emprestimosConsignadosData]
                  .sort((a, b) => b.competencia.localeCompare(a.competencia))
                  .map((row) => {
                    const isCurrent = row.competencia === competence;
                    const fundo = row.fundoRisco;
                    const cobPct = row.saldoFinal > 0 ? (fundo.saldoFinal / row.saldoFinal) * 100 : 0;
                    return (
                      <tr 
                        key={row.competencia} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCurrent ? "bg-indigo-50/40 font-bold text-slate-950 border-y border-indigo-100/50" : "text-slate-600"
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold uppercase">
                          <span className="flex items-center">
                            {isCurrent && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>}
                            {getMonthName(row.competencia)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600">{formatCurrency(fundo.saldoInicial)}</td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">+{formatCurrency(fundo.entradas)}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{formatCurrency(fundo.saidas)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-950">{formatCurrency(fundo.saldoFinal)}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">{formatCurrency(row.saldoFinal)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {cobPct.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                            0,00% Sinistro
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
