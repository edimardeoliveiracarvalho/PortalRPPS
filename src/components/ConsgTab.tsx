import React, { useMemo, useState } from "react";
import { evolucaoCarteiraConsolidada, retornoMetaAtuarial } from "../data";
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
  ArrowRightLeft
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
  LabelList
} from "recharts";

// Consignment Loan data with the new structure provided by the user
export const emprestimosConsignadosData = [
  {
    "competencia": "2025-09",
    "saldoInicial": 0,
    "valorConcedido": 134052.23,
    "valorAmortizado": 0,
    "saldoFinal": 134052.23,
    "retornoFinanceiro": 36.93,
    "retornoPercentual": 0.06,
    "contratosNovos": 9,
    "contratosQuitados": 0,
    "contratosAtivos": 9,
    "prazosContratados": [45,24,48,11,24,50,40,96,60]
  },
  {
    "competencia": "2025-10",
    "saldoInicial": 134052.23,
    "valorConcedido": 1912609.99,
    "valorAmortizado": 4769.91,
    "saldoFinal": 2041892.31,
    "retornoFinanceiro": 4506.32,
    "retornoPercentual": 3.36,
    "contratosNovos": 90,
    "contratosQuitados": 0,
    "contratosAtivos": 99,
    "prazosContratados": [96,28,25,40,48,18,96,96,49,72,96,96,96,96,96,96,20,42,96,96,45,24,96,30,38,40,96,40,10,40,40,48,96,36,96,67,36,96,36,96,96,60,29,96,96,42,96,96,48,30,60,72,41,31,96,42,40,36,96,42,29,96,96,96,48,96,53,24,96,96,96,42,96,36,96,96,96,23,71,96,60,42,12,36,36,24,12,96,96,35]
  },
  {
    "competencia": "2025-11",
    "saldoInicial": 2041892.31,
    "valorConcedido": 1038008.48,
    "valorAmortizado": 26508.72,
    "saldoFinal": 3053392.07,
    "retornoFinanceiro": 21977.67,
    "retornoPercentual": 1.08,
    "contratosNovos": 58,
    "contratosQuitados": 0,
    "contratosAtivos": 157,
    "prazosContratados": [24,96,36,96,32,12,85,36,96,96,96,96,12,96,40,96,65,42,12,96,96,12,60,10,36,96,24,13,46,96,48,24,96,96,48,96,96,84,42,12,96,18,51,96,96,96,40,96,18,24,30,96,96,39,96,80,45,96]
  },
  {
    "competencia": "2025-12",
    "saldoInicial": 3053389.09,
    "valorConcedido": 913630.79,
    "valorAmortizado": 41582.65,
    "saldoFinal": 3925440.21,
    "retornoFinanceiro": 33486.65,
    "retornoPercentual": 1.10,
    "contratosNovos": 47,
    "contratosQuitados": 0,
    "contratosAtivos": 204,
    "prazosContratados": [96,96,96,39,38,40,40,96,24,96,96,40,96,96,96,36,36,96,44,96,65,96,96,36,96,60,96,36,24,96,12,96,96,96,96,36,24,96,96,96,16,36,96,39,96,40,96]
  },
  {
    "competencia": "2026-01",
    "saldoInicial": 3925437.23,
    "valorConcedido": 1489852.48,
    "valorAmortizado": 125976.48,
    "saldoFinal": 5289316.21,
    "retornoFinanceiro": 41060.77,
    "retornoPercentual": 1.05,
    "contratosNovos": 71,
    "contratosQuitados": 3,
    "contratosAtivos": 272,
    "prazosContratados": [96,96,96,25,96,92,36,6,25,44,30,96,96,96,40,96,12,36,96,96,10,24,96,12,96,96,60,96,10,36,96,25,96,96,96,36,60,48,12,60,10,55,60,96,34,96,96,96,96,96,24,12,36,60,96,25,48,12,96,25,15,79,36,36,96,96,36,48,12,96,96]
  },
  {
    "competencia": "2026-02",
    "saldoInicial": 5289313.21,
    "valorConcedido": 796177.22,
    "valorAmortizado": 160593.61,
    "saldoFinal": 5924899.82,
    "retornoFinanceiro": 55133.70,
    "retornoPercentual": 1.04,
    "contratosNovos": 51,
    "contratosQuitados": 3,
    "contratosAtivos": 320,
    "prazosContratados": [12,12,17,96,96,96,96,96,48,24,24,18,96,96,96,36,46,15,42,96,68,58,60,96,96,24,96,12,96,96,36,10,36,96,96,48,96,25,10,96,24,12,77,96,96,96,96,96,55,96,16]
  },
  {
    "competencia": "2026-03",
    "saldoInicial": 5924896.82,
    "valorConcedido": 1756907.38,
    "valorAmortizado": 83239.04,
    "saldoFinal": 7598568.16,
    "retornoFinanceiro": 71935.50,
    "retornoPercentual": 1.21,
    "contratosNovos": 144,
    "contratosQuitados": 0,
    "contratosAtivos": 464,
    "prazosContratados": [36,96,96,48,10,48,96,96,48,96,96,24,12,36,36,36,96,48,15,96,96,96,48,36,67,24,36,25,20,48,27,48,96,36,81,25,25,79,96,96,77,77,60,80,96,84,96,96,40,96,96,20,30,96,40,48,25,36,60,96,96,96,96,36,96,96,96,96,20,25,36,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,36,96,96,96,36,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,79,96,96,96,96,96,48,96,96,96,96,96,96,96,96,96,18,96,96,96,96,96,94,96,96,96,96,96]
  },
  {
    "competencia": "2026-04",
    "saldoInicial": 7598565.16,
    "valorConcedido": 1636421.49,
    "valorAmortizado": 149152.80,
    "saldoFinal": 9085836.85,
    "retornoFinanceiro": 93786.71,
    "retornoPercentual": 1.23,
    "contratosNovos": 140,
    "contratosQuitados": 1,
    "contratosAtivos": 603,
    "prazosContratados": [96,96,96,29,96,96,96,96,96,96,96,96,96,96,96,42,96,96,96,96,96,96,96,36,96,74,12,96,96,96,96,96,96,96,96,96,96,96,60,96,22,96,96,96,37,96,96,15,30,85,96,96,96,50,96,25,96,96,96,48,8,96,96,24,96,96,96,96,96,48,96,41,36,96,25,52,81,75,96,96,96,96,96,96,96,48,96,15,40,96,96,39,96,84,84,24,36,96,24,48,96,96,96,48,96,30,96,48,25,96,35,50,48,96,25,24,96,96,15,48,96,48,96,96,96,96,20,96,96,15,96,96,96,96,20,96,40,96,96,96,70]
  },
  {
    "competencia": "2026-05",
    "saldoInicial": 9085833.85,
    "valorConcedido": 1298575.19,
    "valorAmortizado": 129568.29,
    "saldoFinal": 10254843.75,
    "retornoFinanceiro": 104936.97,
    "retornoPercentual": 1.15,
    "contratosNovos": 85,
    "contratosQuitados": 2,
    "contratosAtivos": 686,
    "prazosContratados": [48,48,72,96,96,96,60,96,96,96,18,76,96,72,96,96,60,12,96,24,25,96,32,48,96,96,96,96,96,96,96,96,20,96,96,60,24,96,10,78,96,96,25,10,40,96,96,60,96,48,96,96,96,96,42,96,96,96,35,36,96,12,70,96,25,48,96,96,51,96,96,24,96,96,96,67,96,56,36,96,96,36,96,96,96,70]
  },
  {
    "competencia": "2026-06",
    "saldoInicial": 10254840.75,
    "valorConcedido": 1530943.04,
    "valorAmortizado": 180090.67,
    "saldoFinal": 11605696.12,
    "retornoFinanceiro": 110492.41,
    "retornoPercentual": 1.08,
    "contratosNovos": 77,
    "contratosQuitados": 4,
    "contratosAtivos": 759,
    "prazosContratados": [96,96,96,96,96,60,48,40,96,40,96,96,96,40,10,96,20,96,96,60,60,96,96,96,18,96,96,96,96,96,40,70,36,7,96,96,96,6,15,96,81,65,95,24,96,10,25,96,96,24,96,96,95,60,90,69,18,91,96,36,96,96,77,96,36,10,96,12,71,96,96,42,59,85,24,96,96]
  }
];

interface ConsgTabProps {
  competence: string;
}

export const ConsgTab: React.FC<ConsgTabProps> = ({ competence }) => {
  // Mode selection key state for Chart 1: "recurso" or "contrato"
  const [evolutionMode, setEvolutionMode] = useState<"recurso" | "contrato">("recurso");

  // New State for horizontal bar chart (Monthly vs Accumulated)
  const [termViewMode, setTermViewMode] = useState<"mensal" | "acumulado">("mensal");

  // Find current and previous month records
  const currentLoan = useMemo(() => {
    return emprestimosConsignadosData.find(c => c.competencia === competence) || emprestimosConsignadosData[emprestimosConsignadosData.length - 1];
  }, [competence]);

  const prevCompetence = getPrevCompetence(currentLoan.competencia);
  const prevLoan = useMemo(() => {
    return emprestimosConsignadosData.find(c => c.competencia === prevCompetence);
  }, [prevCompetence]);

  // KPIs
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

  // New Memo for horizontal bar chart (Monthly vs Accumulated)
  const termDistributionData = useMemo(() => {
    let activePrazos: number[] = [];
    
    if (termViewMode === "mensal") {
      activePrazos = currentLoan.prazosContratados || [];
    } else {
      // Accumulate all prazos up to selected competence
      const relevantLoans = emprestimosConsignadosData.filter(
        item => item.competencia <= currentLoan.competencia
      );
      activePrazos = relevantLoans.reduce<number[]>((acc, item) => {
        return acc.concat(item.prazosContratados || []);
      }, []);
    }

    // Count occurrences
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

    const bucketOrder = [
      "96 meses",
      "84 meses",
      "72 meses",
      "60 meses",
      "48 meses",
      "36 meses",
      "24 meses",
      "12 meses"
    ];

    const colors = [
      "#4f46e5", // 96
      "#3b82f6", // 84
      "#10b981", // 72
      "#0ea5e9", // 60
      "#14b8a6", // 48
      "#f59e0b", // 36
      "#6366f1", // 24
      "#ef4444", // 12
    ];

    return bucketOrder.map((name, index) => {
      const value = counts[name];
      return {
        name,
        value,
        color: colors[index % colors.length]
      };
    });
  }, [currentLoan, termViewMode]);

  // Compare with Patrimonio Consolidado and Limit (10%)
  const patrimonioConsolidado = useMemo(() => {
    const matchingPatr = evolucaoCarteiraConsolidada.find(e => e.competencia === currentLoan.competencia);
    if (matchingPatr) return matchingPatr.valorCarteiraConsolidada;
    
    // Fallback: search closest or latest
    return evolucaoCarteiraConsolidada[evolucaoCarteiraConsolidada.length - 1]?.valorCarteiraConsolidada || 1414618402.85;
  }, [currentLoan.competencia]);

  const limiteMaximo = patrimonioConsolidado * 0.10;
  const margemDisponivel = Math.max(0, limiteMaximo - saldoFinal);
  const percentualUtilizado = (saldoFinal / patrimonioConsolidado) * 100;

  // Recharts historical charts data preparation
  const chartHistoricalData = useMemo(() => {
    return emprestimosConsignadosData.map(item => {
      const parts = item.competencia.split("-");
      const monthNames: Record<string, string> = {
        "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
        "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
      };
      const label = `${monthNames[parts[1]] || parts[1]}/${parts[0].substring(2)}`;
      
      return {
        ...item,
        name: label,
        "Saldo (Milhões)": parseFloat((item.saldoFinal / 1000000).toFixed(2)),
        "Contratos Ativos": item.contratosAtivos,
        "Concedido (k)": parseFloat((item.valorConcedido / 1000).toFixed(1)),
        "Amortizado (k)": parseFloat((item.valorAmortizado / 1000).toFixed(1)),
        "Retorno (k)": parseFloat((item.retornoFinanceiro / 1000).toFixed(2)),
        "Rentabilidade (%)": item.retornoPercentual
      };
    });
  }, []);

  // Fetch actual monthly actuarial target percentual
  const currentMeta = useMemo(() => {
    return retornoMetaAtuarial.find(m => m.competencia === currentLoan.competencia);
  }, [currentLoan.competencia]);

  const metaMensalPercentual = currentMeta ? currentMeta.metaAtuarialPercentual * 100 : 0.49; // fallback

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
      {/* Main KPI Grid - Exactly formatted as Aba Contábil layout */}
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

        {/* Chart 3: Distribuição de Contratos por Prazo (Estilo Barras Horizontais com Chave para filtro mensal/acumulado) */}
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
                Mensal
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

          <div className="h-40 mt-1 flex-1">
            {termDistributionData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={termDistributionData} 
                  layout="vertical"
                  margin={{ top: 5, right: 35, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontWeight={600}
                    tickLine={false} 
                    width={70}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value} contratos`, "Quantidade"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {termDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="right" 
                      style={{ fill: '#334155', fontSize: 9, fontWeight: 'bold' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold">
                Sem contratos para o período selecionado
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Charts Section - Double Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Evolução da Carteira (Now with toggling key between money and contract count) */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Evolução Histórica do Saldo da Carteira</h4>
              <p className="text-[11px] text-slate-400">Acompanhamento da evolução da Carteira de Empréstimo Consignado.</p>
            </div>
            <div className="mt-2 sm:mt-0 flex bg-slate-100 p-1 rounded-lg self-start">
              <button
                onClick={() => setEvolutionMode("recurso")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  evolutionMode === "recurso"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Recurso (R$)
              </button>
              <button
                onClick={() => setEvolutionMode("contrato")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  evolutionMode === "contrato"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Contratos (Qtd)
              </button>
            </div>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartHistoricalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsgBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={evolutionMode === "recurso" ? "#4f46e5" : "#3b82f6"} stopOpacity={0.20}/>
                    <stop offset="95%" stopColor={evolutionMode === "recurso" ? "#4f46e5" : "#3b82f6"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => evolutionMode === "recurso" ? `R$ ${val}M` : `${val}`}
                />
                <Tooltip 
                  formatter={(value: any) => 
                    evolutionMode === "recurso" 
                      ? [`R$ ${value} Milhões`, "Saldo da Carteira"] 
                      : [`${value} contratos`, "Contratos Ativos"]
                  }
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Area 
                  type="monotone" 
                  dataKey={evolutionMode === "recurso" ? "Saldo (Milhões)" : "Contratos Ativos"} 
                  stroke={evolutionMode === "recurso" ? "#4f46e5" : "#2563eb"} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorConsgBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Concessões vs Amortizações */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Concessões (Novos Recursos) vs. Amortizações (Retorno em Folha)</h4>
            <p className="text-[11px] text-slate-400">Fluxo mensal de caixa gerado pela modalidade consignada (R$ Milhares).</p>
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

      {/* Chart 4: Evolução do Retorno e Rentabilidade - Full width */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Evolução de Retorno Financeiro vs. Rentabilidade Percentual</h4>
          <p className="text-[11px] text-slate-400">Geração de juros reais recebidos no período em confronto com a rentabilidade percentual correspondente.</p>
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

      {/* Detailed Historical Data Table - Harmonized with Visão Geral */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Evolução Mensal da Carteira de Consignado</h4>
            <p className="text-[11px] text-slate-400">Demonstrativo mensal completo das posições, captação, amortização e rentabilidade obtida.</p>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-semibold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            <span>Valores nominais e acumulados</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Competência</th>
                <th className="py-3 px-4 text-right">Saldo Inicial</th>
                <th className="py-3 px-4 text-right">Valor Concedido</th>
                <th className="py-3 px-4 text-right">Valor Amortizado</th>
                <th className="py-3 px-4 text-right">Saldo Final</th>
                <th className="py-3 px-4 text-right">Retorno Juros (R$)</th>
                <th className="py-3 px-4 text-center">Rentabilidade (%)</th>
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
      </div>
    </div>
  );
};
