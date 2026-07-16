import React, { useMemo, useState } from "react";
import { titulosData, Titulo } from "../data_titulos";
import { formatCurrency, formatPercent, formatNumber } from "../utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
  Line
} from "recharts";
import {
  ShieldAlert,
  TrendingUp,
  Coins,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Search,
  SlidersHorizontal,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Layers,
  Filter,
  Clock,
  ArrowRight,
  Lock,
  Percent
} from "lucide-react";

export function TitulosTab() {
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"todos" | "publico" | "privado">("todos");
  const [custodianFilter, setCustodianFilter] = useState<string>("todos");
  const [vencimentoFilter, setVencimentoFilter] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"curva_vs_mercado" | "geral">("curva_vs_mercado");
  const [activeChart, setActiveChart] = useState<"vencimento" | "custodiante" | "comparativo">("vencimento");

  // Calculated values
  const calculations = useMemo(() => {
    let totalCompra = 0;
    let totalCurva = 0;
    let totalMercado = 0;
    let totalContabil = 0;
    let totalCupons = 0;
    let publicoContabil = 0;
    let privadoContabil = 0;

    titulosData.forEach(t => {
      totalCompra += t.valorCompra;
      totalCurva += t.valorNaCurva;
      totalMercado += t.valorMercado;
      totalContabil += t.valorContabil;
      totalCupons += t.cupomRecebidoAcumulado;

      if (t.categoriaTitulo === "publico") {
        publicoContabil += t.valorContabil;
      } else {
        privadoContabil += t.valorContabil;
      }
    });

    const mtmDifference = totalMercado - totalCurva;
    const mtmPct = totalCurva > 0 ? (mtmDifference / totalCurva) * 100 : 0;

    // Weighted average contracted rates
    let totalWeightPublic = 0;
    let weightedRateSumPublic = 0;
    let totalWeightPrivate = 0;
    let weightedRateSumPrivate = 0;

    titulosData.forEach(t => {
      // Extract numerical percentage from something like "6,2005 a.a." or "5,9000a.a."
      const rateStr = t.taxaContratada.replace(/[^\d,]/g, "").replace(",", ".");
      const rateNum = parseFloat(rateStr);
      if (!isNaN(rateNum)) {
        if (t.categoriaTitulo === "publico") {
          weightedRateSumPublic += rateNum * t.valorContabil;
          totalWeightPublic += t.valorContabil;
        } else {
          weightedRateSumPrivate += rateNum * t.valorContabil;
          totalWeightPrivate += t.valorContabil;
        }
      }
    });

    const avgRatePublic = totalWeightPublic > 0 ? weightedRateSumPublic / totalWeightPublic : 0;
    const avgRatePrivate = totalWeightPrivate > 0 ? weightedRateSumPrivate / totalWeightPrivate : 0;
    const avgRateTotal = totalContabil > 0 ? (weightedRateSumPublic + weightedRateSumPrivate) / totalContabil : 0;

    return {
      totalCompra,
      totalCurva,
      totalMercado,
      totalContabil,
      totalCupons,
      publicoContabil,
      privadoContabil,
      mtmDifference,
      mtmPct,
      avgRatePublic,
      avgRatePrivate,
      avgRateTotal
    };
  }, []);

  // Filter options list
  const custodiansList = useMemo(() => {
    const set = new Set<string>();
    titulosData.forEach(t => set.add(t.custodiante));
    return Array.from(set).sort();
  }, []);

  const vencimentosList = useMemo(() => {
    const set = new Set<number>();
    titulosData.forEach(t => set.add(t.vencimento));
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  // Filtered titles
  const filteredTitulos = useMemo(() => {
    return titulosData.filter(t => {
      const matchesSearch = 
        t.nomeTitulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.custodiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.taxaContratada.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "todos" || t.categoriaTitulo === categoryFilter;
      const matchesCustodian = custodianFilter === "todos" || t.custodiante === custodianFilter;
      const matchesVencimento = vencimentoFilter === "todos" || t.vencimento.toString() === vencimentoFilter;

      return matchesSearch && matchesCategory && matchesCustodian && matchesVencimento;
    });
  }, [searchTerm, categoryFilter, custodianFilter, vencimentoFilter]);

  // Chart data: Histórico de Alocação & Taxas Reais Contratadas
  const historicoChartData = useMemo(() => {
    const map: Record<string, { year: string; volume: number; rateSum: number; weightSum: number }> = {};
    
    titulosData.forEach(t => {
      const year = t.dataAplicacaoInicial ? t.dataAplicacaoInicial.split("-")[0] : null;
      if (!year) return;
      
      // extract rate number
      const rateStr = t.taxaContratada.replace(/[^\d,]/g, "").replace(",", ".");
      const rateNum = parseFloat(rateStr);
      
      if (!map[year]) {
        map[year] = { year, volume: 0, rateSum: 0, weightSum: 0 };
      }
      
      map[year].volume += t.valorCompra; // Volume de compra
      if (!isNaN(rateNum)) {
        map[year].rateSum += rateNum * t.valorCompra;
        map[year].weightSum += t.valorCompra;
      }
    });
    
    return Object.keys(map)
      .map(year => {
        const item = map[year];
        const avgRate = item.weightSum > 0 ? item.rateSum / item.weightSum : 0;
        return {
          year,
          volume: item.volume,
          taxaMedia: avgRate
        };
      })
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, []);

  // Chart data: Vencimento Profile
  const vencimentoChartData = useMemo(() => {
    const map: Record<number, { name: string; publico: number; privado: number; total: number }> = {};
    
    titulosData.forEach(t => {
      if (!map[t.vencimento]) {
        map[t.vencimento] = { name: t.vencimento.toString(), publico: 0, privado: 0, total: 0 };
      }
      if (t.categoriaTitulo === "publico") {
        map[t.vencimento].publico += t.valorContabil;
      } else {
        map[t.vencimento].privado += t.valorContabil;
      }
      map[t.vencimento].total += t.valorContabil;
    });

    return Object.values(map).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, []);

  // Chart data: Custodian Distribution
  const custodianChartData = useMemo(() => {
    const map: Record<string, { name: string; value: number }> = {};
    titulosData.forEach(t => {
      if (!map[t.custodiante]) {
        map[t.custodiante] = { name: t.custodiante, value: 0 };
      }
      map[t.custodiante].value += t.valorContabil;
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, []);

  // Chart data: Comparativo Curva vs Mercado por Vencimento
  const comparativoChartData = useMemo(() => {
    const map: Record<number, { name: string; curva: number; mercado: number }> = {};
    titulosData.forEach(t => {
      if (!map[t.vencimento]) {
        map[t.vencimento] = { name: t.vencimento.toString(), curva: 0, mercado: 0 };
      }
      map[t.vencimento].curva += t.valorNaCurva;
      map[t.vencimento].mercado += t.valorMercado;
    });
    return Object.values(map).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, []);

  // Chart data: Pizza Público vs Privado
  const pieChartData = [
    { name: "Públicos (Federal)", value: calculations.publicoContabil, color: "#1e3a8a" },
    { name: "Privados (Letras Financeiras)", value: calculations.privadoContabil, color: "#eab308" }
  ];

  // Specific risk signals & limits alerts (Semaphores)
  const creditPrivateLimit = 20; // 20% max allowed CMN limit on private credit (usually 20% limit for single RPPS under some criteria, let's represent as percentage of our total bond portfolio)
  const privateContabilPct = (calculations.privadoContabil / calculations.totalContabil) * 100;

  // Semaphores states
  const semaforos = useMemo(() => {
    // 1. Private Credit Concentration
    let privateCreditState: "success" | "warning" | "danger" = "success";
    if (privateContabilPct > 15) privateCreditState = "danger";
    else if (privateContabilPct > 10) privateCreditState = "warning";

    // 2. Volatility / Duration Risk (Bonds maturing >= 2040)
    const longTermBondsSum = titulosData
      .filter(t => t.vencimento >= 2040)
      .reduce((acc, curr) => acc + curr.valorContabil, 0);
    const longTermBondsPct = (longTermBondsSum / calculations.totalContabil) * 100;
    
    let durationRiskState: "success" | "warning" | "danger" = "success";
    if (longTermBondsPct > 60) durationRiskState = "danger";
    else if (longTermBondsPct > 40) durationRiskState = "warning";

    // 3. Mark to Market spread gap (curva vs mercado deviation)
    const mtmDeviationAbs = Math.abs(calculations.mtmPct);
    let mtmState: "success" | "warning" | "danger" = "success";
    if (mtmDeviationAbs > 15) mtmState = "danger";
    else if (mtmDeviationAbs > 8) mtmState = "warning";

    return {
      privateCredit: {
        pct: privateContabilPct,
        state: privateCreditState,
        label: privateCreditState === "danger" ? "Alto Risco" : privateCreditState === "warning" ? "Atenção" : "Confortável",
        title: "Concentração em Crédito Privado",
        limitMsg: "Limite Prudencial Interno de 10%"
      },
      durationRisk: {
        pct: longTermBondsPct,
        state: durationRiskState,
        label: durationRiskState === "danger" ? "Risco Crítico" : durationRiskState === "warning" ? "Moderado" : "Baixo Risco",
        title: "Sensibilidade de Taxa (Vencimento ≥ 2040)",
        limitMsg: "Concentração ideal até 50%"
      },
      mtmGap: {
        pct: mtmDeviationAbs,
        state: mtmState,
        label: mtmState === "danger" ? "Desvio Crítico" : mtmState === "warning" ? "Desvio Moderado" : "Desvio Normal",
        title: "Desvio Curva vs Marcação Mercado",
        limitMsg: "Monitorar gap de saída antecipada"
      }
    };
  }, [calculations, privateContabilPct]);

  return (
    <div id="titulos_tab_container" className="space-y-4">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Patrimonio Direct Titles */}
        <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-600 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Patrimônio Direto (Curva)</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded shrink-0">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(calculations.totalContabil)}</h3>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>Mkt: <strong className="text-slate-600">{formatCurrency(calculations.totalMercado)}</strong></span>
            </div>
          </div>
        </div>

        {/* KPI 2: Coupons Accumulated */}
        <div className="bg-white p-4 rounded shadow-sm border-l-4 border-emerald-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cupons Recebidos</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded shrink-0">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-emerald-700 tracking-tight">{formatCurrency(calculations.totalCupons)}</h3>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>Cupons Recebidos dos Ativos em Carteira</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Mark to Market Difference */}
        <div className="bg-white p-4 rounded shadow-sm border-l-4 border-rose-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ágio / Deságio de Saída (MtM)</span>
            <div className={`p-1.5 rounded shrink-0 ${calculations.mtmDifference < 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {calculations.mtmDifference < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
            </div>
          </div>
          <div className="mt-2">
            <h3 className={`text-xl font-black tracking-tight ${calculations.mtmDifference < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {formatCurrency(calculations.mtmDifference)}
            </h3>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>Desvio percentual: <strong className={calculations.mtmDifference < 0 ? 'text-rose-600' : 'text-emerald-600'}>{calculations.mtmPct.toFixed(2)}%</strong></span>
            </div>
          </div>
        </div>

        {/* KPI 4: Weighted Coupon Spread */}
        <div className="bg-white p-4 rounded shadow-sm border-l-4 border-amber-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rentabilidade Média</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-amber-700 tracking-tight">
              {calculations.avgRateTotal.toFixed(4).replace(".", ",")}% a.a.
            </h3>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>Meta do RPPS: <strong className="text-slate-600">5,92% a.a. + IPCA</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Alertas e Semáforos (Compliance / Traffic Lights) & Metas Atuariais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic Light 1: Crédito Privado */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  semaforos.privateCredit.state === "danger" ? "bg-rose-400" : semaforos.privateCredit.state === "warning" ? "bg-amber-400" : "bg-emerald-400"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  semaforos.privateCredit.state === "danger" ? "bg-rose-600" : semaforos.privateCredit.state === "warning" ? "bg-amber-500" : "bg-emerald-600"
                }`}></span>
              </span>
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">{semaforos.privateCredit.title}</h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-black border ${
              semaforos.privateCredit.state === "danger" ? "bg-rose-50 text-rose-700 border-rose-200" : semaforos.privateCredit.state === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {semaforos.privateCredit.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-slate-800">{semaforos.privateCredit.pct.toFixed(2)}%</span>
              <span className="text-[10px] font-bold text-slate-400">Total Carteira Títulos</span>
            </div>
            
            {/* Custom visual progress bar bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  semaforos.privateCredit.state === "danger" ? "bg-rose-500" : semaforos.privateCredit.state === "warning" ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, (semaforos.privateCredit.pct / creditPrivateLimit) * 100)}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Atual: {formatCurrency(calculations.privadoContabil)}</span>
              <span>Teto CMN: 20%</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 italic font-semibold pt-2 border-t border-slate-50 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-400 shrink-0" />
            {semaforos.privateCredit.limitMsg}. Risco equilibrado entre 4 emissores de primeira linha.
          </p>
        </div>

        {/* Traffic Light 2: Duration Risk */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  semaforos.durationRisk.state === "danger" ? "bg-rose-400" : semaforos.durationRisk.state === "warning" ? "bg-amber-400" : "bg-emerald-400"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  semaforos.durationRisk.state === "danger" ? "bg-rose-600" : semaforos.durationRisk.state === "warning" ? "bg-amber-500" : "bg-emerald-600"
                }`}></span>
              </span>
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">{semaforos.durationRisk.title}</h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-black border ${
              semaforos.durationRisk.state === "danger" ? "bg-rose-50 text-rose-700 border-rose-200" : semaforos.durationRisk.state === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {semaforos.durationRisk.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-slate-800">{semaforos.durationRisk.pct.toFixed(2)}%</span>
              <span className="text-[10px] font-bold text-slate-400">Exposição ao Longo Prazo</span>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  semaforos.durationRisk.state === "danger" ? "bg-rose-500" : semaforos.durationRisk.state === "warning" ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${semaforos.durationRisk.pct}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Curto/Médio Prazo: {(100 - semaforos.durationRisk.pct).toFixed(2)}%</span>
              <span>Longo Prazo: {semaforos.durationRisk.pct.toFixed(2)}%</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 italic font-semibold pt-2 border-t border-slate-50 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-400 shrink-0" />
            {semaforos.durationRisk.limitMsg}. Ativos longos trazem alta volatilidade mas garantem metas longas.
          </p>
        </div>

        {/* Traffic Light 3: MtM Gap */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  semaforos.mtmGap.state === "danger" ? "bg-rose-400" : semaforos.mtmGap.state === "warning" ? "bg-amber-400" : "bg-emerald-400"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  semaforos.mtmGap.state === "danger" ? "bg-rose-600" : semaforos.mtmGap.state === "warning" ? "bg-amber-500" : "bg-emerald-600"
                }`}></span>
              </span>
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">{semaforos.mtmGap.title}</h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-black border ${
              semaforos.mtmGap.state === "danger" ? "bg-rose-50 text-rose-700 border-rose-200" : semaforos.mtmGap.state === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {semaforos.mtmGap.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-mono font-black ${calculations.mtmDifference < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {calculations.mtmPct.toFixed(2)}%
              </span>
              <span className="text-[10px] font-bold text-slate-400">Ajuste Acumulado</span>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  semaforos.mtmGap.state === "danger" ? "bg-rose-500" : semaforos.mtmGap.state === "warning" ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, Math.abs(calculations.mtmPct) * 4)}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Preço Curva: {formatCurrency(calculations.totalCurva)}</span>
              <span>Preço Mercado: {formatCurrency(calculations.totalMercado)}</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 italic font-semibold pt-2 border-t border-slate-50 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-400 shrink-0" />
            {semaforos.mtmGap.limitMsg}. Deságio é temporário se mantidos até o vencimento.
          </p>
        </div>

      </div>

      {/* Historical Allocation and Contracted Rates Chart */}
      <div id="historico_alocacao_taxas_container" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4.5 w-4.5 text-[#1e3a8a]" />
            <h3 className="text-xs uppercase font-black tracking-wider text-slate-700">Histórico de Alocação & Taxas Reais Contratadas</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume Comprado vs Taxa Média Contratada (% a.a. + IPCA)</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historicoChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} />
              <YAxis 
                yAxisId="left"
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
                tick={{ fill: '#64748b', fontSize: 10 }} 
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false} 
                axisLine={false} 
                domain={['auto', 'auto']}
                tickFormatter={(v) => `${v.toFixed(2)}%`}
                tick={{ fill: '#64748b', fontSize: 10 }} 
              />
              <Tooltip
                contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                formatter={(v: any, name: any) => {
                  if (name === "volume") return [formatCurrency(v), "Capital Comprado (Volume R$)"];
                  return [`${v.toFixed(4).replace(".", ",")}% a.a. + IPCA`, "Taxa Média Contratada"];
                }}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
              <Bar yAxisId="left" name="Capital Comprado (Volume R$)" dataKey="volume" fill="#1e3a8a" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Line yAxisId="right" name="Taxa Média Contratada (% a.a. + IPCA)" dataKey="taxaMedia" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: "#eab308", strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Decision-making Graphs Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main interactive charts container */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-[#1e3a8a]" />
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-700">Painel Gráfico de Planejamento</h3>
            </div>
            
            {/* View selectors */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
              <button
                onClick={() => setActiveChart("vencimento")}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-md transition-all ${activeChart === "vencimento" ? "bg-white text-[#1e3a8a] shadow-xs font-black" : "text-slate-500 hover:text-slate-800"}`}
              >
                Cronograma de Vencimento
              </button>
              <button
                onClick={() => setActiveChart("custodiante")}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-md transition-all ${activeChart === "custodiante" ? "bg-white text-[#1e3a8a] shadow-xs font-black" : "text-slate-500 hover:text-slate-800"}`}
              >
                Distribuição por Custodiante
              </button>
              <button
                onClick={() => setActiveChart("comparativo")}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-md transition-all ${activeChart === "comparativo" ? "bg-white text-[#1e3a8a] shadow-xs font-black" : "text-slate-500 hover:text-slate-800"}`}
              >
                Curva vs Mercado por Ano
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === "vencimento" ? (
                <BarChart data={vencimentoChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
                    tick={{ fill: '#64748b', fontSize: 10 }} 
                  />
                  <Tooltip
                    formatter={(v: any) => [formatCurrency(v), "Valor Contábil"]}
                    contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
                  <Bar name="Títulos Públicos (NTN-B)" dataKey="publico" stackId="a" fill="#1e3a8a" radius={[0, 0, 0, 0]} />
                  <Bar name="Crédito Privado (LF)" dataKey="privado" stackId="a" fill="#eab308" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : activeChart === "custodiante" ? (
                <BarChart data={custodianChartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis 
                    type="number"
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
                    tick={{ fill: '#64748b', fontSize: 10 }} 
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    tick={{ fill: '#334155', fontSize: 10, fontWeight: 700 }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    formatter={(v: any) => [formatCurrency(v), "Total Custodiado"]}
                    contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                  />
                  <Bar dataKey="value" name="Alocação" radius={[0, 4, 4, 0]} maxBarSize={20}>
                    {custodianChartData.map((entry, index) => {
                      const colors = ["#1e3a8a", "#0284c7", "#3b82f6", "#eab308", "#f97316"];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              ) : (
                <ComposedChart data={comparativoChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(0)}M`}
                    tick={{ fill: '#64748b', fontSize: 10 }} 
                  />
                  <Tooltip
                    contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                    formatter={(v: any, name: any) => {
                      if (name === "curva") return [formatCurrency(v), "Valor na Curva (Contábil)"];
                      return [formatCurrency(v), "Valor de Saída (Marc. Mercado)"];
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
                  <Bar name="curva" dataKey="curva" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={25} />
                  <Line name="mercado" dataKey="mercado" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4, fill: "#1e3a8a", strokeWidth: 0 }} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {activeChart !== "vencimento" && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-[10px] text-slate-500 mt-4 leading-relaxed font-medium">
              {activeChart === "custodiante" ? (
                <span>💡 <strong>Análise de Contraparte:</strong> A <strong>XP Investimentos</strong> concentra a custódia de todos os títulos federais na carteira direta. O crédito privado (LFs) está diversificado entre <strong>BTG Pactual, Bradesco, Santander e Safra</strong>, mitigando riscos de liquidez e bancários.</span>
              ) : (
                <span>💡 <strong>Estratégia Atuarial:</strong> O distanciamento temporário da linha de <strong>Mercado</strong> frente às barras de <strong>Curva</strong> deve-se à alta das taxas de juros (curva empinada). Recomenda-se manter os ativos até o vencimento para realizar 100% da rentabilidade contratada.</span>
              )}
            </div>
          )}
        </div>

        {/* Right side: Category allocation */}
        <div className="lg:col-span-4">
          
          {/* Pie Distribution Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-full flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3 mb-2">
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-700">Alocação de Risco por Categoria</h3>
            </div>
            
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center text indicating total */}
              <div className="absolute text-center">
                <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block">Total Geral</span>
                <span className="text-xs font-mono font-black text-[#1e3a8a]">{formatCurrency(calculations.totalContabil)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {pieChartData.map((item, idx) => {
                const pct = (item.value / calculations.totalContabil) * 100;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-mono font-black text-slate-900">{pct.toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Advanced Filters Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        {/* Title and Active count */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-[#1e3a8a]" />
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-700">Filtros Avançados e Seleção</h3>
            </div>
            
            {/* Toggle View Mode */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Modo de Exibição:</span>
              <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200/40">
                <button
                  onClick={() => setViewMode("curva_vs_mercado")}
                  className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-md transition-all cursor-pointer ${viewMode === "curva_vs_mercado" ? "bg-white text-[#1e3a8a] shadow-xs font-black" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Curva vs Mercado
                </button>
                <button
                  onClick={() => setViewMode("geral")}
                  className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-md transition-all cursor-pointer ${viewMode === "geral" ? "bg-white text-[#1e3a8a] shadow-xs font-black" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Dados Gerais de Compra
                </button>
              </div>
            </div>
          </div>
          
          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md self-start lg:self-center">
            Mostrando <strong className="text-[#1e3a8a]">{filteredTitulos.length}</strong> de <strong className="text-slate-800">{titulosData.length}</strong> Títulos Cadastrados
          </span>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Search Term */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Busca por texto</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca por título, taxa ou custodiante..."
                className="pl-9 pr-3 py-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Categoria do Título</label>
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e: any) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
              >
                <option value="todos">Todos as Categorias</option>
                <option value="publico">Públicos (Tesouro Nacional)</option>
                <option value="privado">Privados (Letra Financeira)</option>
              </select>
            </div>
          </div>

          {/* Custodian Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Custodiante / Emissor</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <select
                value={custodianFilter}
                onChange={(e) => setCustodianFilter(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
              >
                <option value="todos">Todos os Custodiantes</option>
                {custodiansList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Maturity Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Ano de Vencimento</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <select
                value={vencimentoFilter}
                onChange={(e) => setVencimentoFilter(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
              >
                <option value="todos">Todos os Anos</option>
                {vencimentosList.map(v => (
                  <option key={v} value={v.toString()}>{v}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Main Table for titles list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Ativo</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Taxa Contratada</th>
                <th className="py-3 px-4 text-right">Qtd</th>
                
                {viewMode === "curva_vs_mercado" ? (
                  <>
                    <th className="py-3 px-4 text-right">Curva (R$)</th>
                    <th className="py-3 px-4 text-right">Mercado (R$)</th>
                    <th className="py-3 px-4 text-right">Cupom Acumulado</th>
                    <th className="py-3 px-4 text-center">Desvio MtM</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 text-right">PU Compra</th>
                    <th className="py-3 px-4 text-right">Total Compra (R$)</th>
                    <th className="py-3 px-4 text-right">Valor Contábil (R$)</th>
                    <th className="py-3 px-4 text-center">Cupom Semestral</th>
                  </>
                )}
                
                <th className="py-3 px-4">Custodiante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredTitulos.length > 0 ? (
                filteredTitulos.map((item) => {
                  const mtmDiffIndividual = item.valorMercado - item.valorNaCurva;
                  const mtmPctIndividual = item.valorNaCurva > 0 ? (mtmDiffIndividual / item.valorNaCurva) * 100 : 0;
                  
                  return (
                    <tr key={item.Id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 text-slate-400 font-mono font-bold">
                        #{item.Id}
                      </td>
                      
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.nomeTitulo}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{item.indexador} • {item.marcacao}</div>
                      </td>
                      
                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black border ${
                          item.categoriaTitulo === "publico"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {item.categoriaTitulo === "publico" ? "Público Fed." : "Privado (LF)"}
                        </span>
                      </td>
                      
                      {/* Maturity */}
                      <td className="py-3 px-4 font-bold text-slate-700">
                        {item.vencimento}
                      </td>
                      
                      {/* Contracted rate */}
                      <td className="py-3 px-4 font-semibold text-blue-900 bg-blue-50/20 font-mono">
                        {item.taxaContratada}
                      </td>
                      
                      {/* Quantity */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-600">
                        {formatNumber(item.quantidadeTitulos)}
                      </td>

                      {viewMode === "curva_vs_mercado" ? (
                        <>
                          {/* Curva */}
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                            {formatCurrency(item.valorNaCurva)}
                          </td>
                          
                          {/* Mercado */}
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                            {formatCurrency(item.valorMercado)}
                          </td>

                          {/* Cupom Acumulado */}
                          <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold">
                            {formatCurrency(item.cupomRecebidoAcumulado)}
                          </td>

                          {/* Individual Mtm Deviation */}
                          <td className="py-3 px-4 text-center">
                            {mtmPctIndividual === 0 ? (
                              <span className="text-slate-400 font-mono text-[10px] font-bold">0,00%</span>
                            ) : (
                              <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${
                                mtmPctIndividual < 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                                {mtmPctIndividual < 0 ? '↓' : '↑'} {Math.abs(mtmPctIndividual).toFixed(2)}%
                              </span>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          {/* PU Compra */}
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            {formatCurrency(item.PUCompra)}
                          </td>
                          
                          {/* Total Compra */}
                          <td className="py-3 px-4 text-right font-mono text-slate-800">
                            {formatCurrency(item.valorCompra)}
                          </td>

                          {/* Valor Contabil */}
                          <td className="py-3 px-4 text-right font-mono text-slate-900 font-black">
                            {formatCurrency(item.valorContabil)}
                          </td>

                          {/* Cupom Semestral indicator */}
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                              item.cupomSemestral === "true"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                : "bg-slate-100 text-slate-400"
                            }`}>
                              {item.cupomSemestral === "true" ? "Sim" : "Não"}
                            </span>
                          </td>
                        </>
                      )}
                      
                      {/* Custodian */}
                      <td className="py-3 px-4 text-slate-500 font-semibold">
                        {item.custodiante}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 font-semibold italic">
                    Nenhum título encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination summary / Export dummy bar */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>Relatório de Auditoria Externa de Títulos Diretos RPPS</span>
          <span>Maringá Previdência SGE</span>
        </div>
      </div>

    </div>
  );
}
