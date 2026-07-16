import React, { useMemo, useState } from "react";
import { investimentos } from "../data_investimentos";
import { evolucaoCarteiraConsolidada } from "../data";
import { politicaInvestimentos, getArticleForEnquadramento } from "../data_politica";
import { formatCurrency, formatPercent } from "../utils";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from "recharts";
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Search, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  SlidersHorizontal,
  TrendingUp,
  Award,
  BookOpen,
  Lock
} from "lucide-react";

interface EnquadramentoTabProps {
  competence: string;
}

export const EnquadramentoTab: React.FC<EnquadramentoTabProps> = ({ competence }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"todos" | "alertas_desenquadrados">("todos");
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [chartView, setChartView] = useState<"margem" | "consumo">("margem");

  // Get total consolidated portfolio balance for the selected competence
  const totalPortfolioBalance = useMemo(() => {
    const trueTotalObj = evolucaoCarteiraConsolidada.find(e => e.competencia === competence);
    return trueTotalObj ? trueTotalObj.valorCarteiraConsolidada : 0;
  }, [competence]);

  // Gather active investments for the chosen competence
  const activeInvestments = useMemo(() => {
    const list: any[] = [];
    let sumActive = 0;

    investimentos.forEach(inv => {
      const hist = inv.historico.find(h => h.competencia === competence);
      if (hist && (hist.saldoFinal > 0 || inv.ativoEstressado)) {
        list.push({
          id: inv.id,
          nome: inv.nome,
          cnpj: inv.cnpj,
          fundo: inv.fundo,
          gestor: inv.gestor,
          administrador: inv.administrador,
          enquadramento: inv.enquadramento,
          ativoEstressado: inv.ativoEstressado,
          segmento: inv.segmento,
          benchmark: inv.benchmark || "N/A",
          saldoFinal: hist.saldoFinal,
          participacao: hist.participacaoCarteira,
        });
        sumActive += hist.saldoFinal;
      }
    });

    // If there is outstanding balance matching (unallocated cash, etc.), add it
    if (totalPortfolioBalance > sumActive) {
      const diff = totalPortfolioBalance - sumActive;
      list.push({
        id: 9999,
        nome: "DISPONIBILIDADES E OPERAÇÕES CONSOLIDADAS (CAIXA / OUTROS)",
        cnpj: "-",
        fundo: "capitalizacao",
        gestor: "MARINGÁ PREVIDÊNCIA",
        administrador: "MARINGÁ PREVIDÊNCIA",
        enquadramento: "Art. 7, I",
        ativoEstressado: false,
        segmento: "rendaFixa",
        benchmark: "CDI",
        saldoFinal: diff,
        participacao: 0
      });
    }

    return list;
  }, [competence, totalPortfolioBalance]);

  // Aggregate balance by article
  const articleBalances = useMemo(() => {
    const balances: Record<string, { total: number; funds: any[] }> = {};
    
    // Initialize for all policy articles
    politicaInvestimentos.forEach(p => {
      balances[p.artigo] = { total: 0, funds: [] };
    });

    activeInvestments.forEach(item => {
      const art = getArticleForEnquadramento(item.enquadramento);
      const articleKey = art || "Não Mapeado";

      if (!balances[articleKey]) {
        balances[articleKey] = { total: 0, funds: [] };
      }

      balances[articleKey].total += item.saldoFinal;
      balances[articleKey].funds.push(item);
    });

    return balances;
  }, [activeInvestments]);

  // Calculate audit statistics for each article in the Investment Policy
  const auditData = useMemo(() => {
    return politicaInvestimentos.map(policy => {
      const isSegmentLevel = ["7", "8", "9", "10"].includes(policy.artigo);
      
      let balance = 0;
      let funds: any[] = [];
      
      if (isSegmentLevel) {
        // Sum up all funds belonging to this segment
        activeInvestments.forEach(item => {
          if (item.segmento === policy.segmento) {
            balance += item.saldoFinal;
            funds.push(item);
          }
        });
      } else {
        const data = articleBalances[policy.artigo] || { total: 0, funds: [] };
        balance = data.total;
        funds = data.funds;
      }
      
      const pct = totalPortfolioBalance > 0 ? (balance / totalPortfolioBalance) * 100 : 0;
      
      const ratioOfPolicyLimit = policy.limitePolitica > 0 ? (pct / policy.limitePolitica) * 100 : 0;
      const ratioOfCMNLimit = policy.limiteCMN5272 > 0 ? (pct / policy.limiteCMN5272) * 100 : 0;
      const ratioOfProGestaoLimit = policy.limiteProGestaoNivel2 > 0 ? (pct / policy.limiteProGestaoNivel2) * 100 : 0;

      const isBreachedCMN = policy.limiteCMN5272 === 0 ? balance > 0 : pct > policy.limiteCMN5272;
      const isBreachedPolicy = policy.limitePolitica === 0 ? balance > 0 : pct > policy.limitePolitica;
      const isBreached = isBreachedCMN || isBreachedPolicy;

      // Pró-Gestão block: either explicitly restricted or exceeded the Pró-Gestão limit
      const isProGestaoBlocked = policy.restricaoProGestao 
        ? balance > 0 
        : (policy.limiteProGestaoNivel2 > 0 ? pct > policy.limiteProGestaoNivel2 : balance > 0);

      // Alert Zone: not breached but reached 90% or more of policy limit (as per revised rules)
      const inAlertZone = !isBreached && policy.limitePolitica > 0 && ratioOfPolicyLimit >= 90;

      let status: "ok" | "alerta" | "irregular" = "ok";
      if (isBreached) status = "irregular";
      else if (inAlertZone || isProGestaoBlocked) status = "alerta";

      return {
        ...policy,
        isSegmentLevel,
        balance,
        pct,
        ratioOfPolicyLimit,
        ratioOfCMNLimit,
        ratioOfProGestaoLimit,
        isBreachedCMN,
        isBreachedPolicy,
        isBreached,
        isProGestaoBlocked,
        inAlertZone,
        status,
        funds: funds.sort((a, b) => b.saldoFinal - a.saldoFinal)
      };
    });
  }, [articleBalances, totalPortfolioBalance, activeInvestments]);

  // Segment allocations comparison
  const segmentAllocations = useMemo(() => {
    // Look up segment limits from the segment records in politicaInvestimentos
    const getLimitsForSegment = (segName: string, defaultCmn: number, defaultPol: number, defaultPro: number) => {
      const segItem = politicaInvestimentos.find(p => p.segmento === segName && ["7", "8", "9", "10", "11", "12"].includes(p.artigo));
      if (segItem) {
        return {
          cmnMax: segItem.limiteCMN5272,
          policyMax: segItem.limitePolitica,
          proMax: segItem.limiteProGestaoNivel2,
          restritoPro: segItem.restricaoProGestao
        };
      }
      return { cmnMax: defaultCmn, policyMax: defaultPol, proMax: defaultPro, restritoPro: false };
    };

    const map: Record<string, { label: string; balance: number; cmnMax: number; policyMax: number; color: string }> = {
      rendaFixa: { label: "Renda Fixa", balance: 0, ...getLimitsForSegment("rendaFixa", 100, 100, 100), color: "#3b82f6" },
      rendaVariavel: { label: "Renda Variável", balance: 0, ...getLimitsForSegment("rendaVariavel", 50, 4, 50), color: "#8b5cf6" },
      estruturados: { label: "Estruturados", balance: 0, ...getLimitsForSegment("estruturados", 20, 15, 15), color: "#ec4899" },
      exterior: { label: "Exterior", balance: 0, ...getLimitsForSegment("exterior", 10, 2, 0), color: "#f43f5e" },
      fundosImobiliarios: { label: "Fundos Imobiliários", balance: 0, ...getLimitsForSegment("fundosImobiliarios", 20, 2, 0), color: "#10b981" },
      emprestimosConsignados: { label: "Consignados", balance: 0, ...getLimitsForSegment("emprestimosConsignados", 10, 10, 10), color: "#eab308" }
    };

    auditData.forEach(item => {
      // Don't sum segment-level rows themselves to prevent double-counting!
      if (item.segmento in map && !item.isSegmentLevel) {
        map[item.segmento].balance += item.balance;
      }
    });

    return Object.entries(map).map(([key, data]) => {
      const pct = totalPortfolioBalance > 0 ? (data.balance / totalPortfolioBalance) * 100 : 0;
      return {
        key,
        ...data,
        pct
      };
    });
  }, [auditData, totalPortfolioBalance]);

  // Decision-making metrics: available margin (R$ and %) and limit consumption rate (%)
  const decisionChartData = useMemo(() => {
    return segmentAllocations.map(seg => {
      const availablePct = Math.max(0, seg.policyMax - seg.pct);
      const availableValue = totalPortfolioBalance * (availablePct / 100);
      const consumptionPct = seg.policyMax > 0 ? (seg.pct / seg.policyMax) * 100 : 0;
      return {
        ...seg,
        availablePct,
        availableValue, // In BRL
        consumptionPct  // % of policy limit consumed
      };
    });
  }, [segmentAllocations, totalPortfolioBalance]);

  // Overall compliance indicators
  const stats = useMemo(() => {
    let compliantCount = 0;
    let alertCount = 0;
    let proGestaoBlockedCount = 0;
    let breachCount = 0;
    let totalAllocatedWithRecords = 0;

    auditData.forEach(item => {
      if (item.balance > 0 && !item.isSegmentLevel) {
        totalAllocatedWithRecords += item.balance;
        if (item.isBreached) {
          breachCount++;
        } else {
          if (item.inAlertZone) {
            alertCount++;
          }
          if (item.isProGestaoBlocked) {
            proGestaoBlockedCount++;
          }
          if (!item.inAlertZone && !item.isProGestaoBlocked) {
            compliantCount++;
          }
        }
      }
    });

    return {
      compliantCount,
      alertCount,
      proGestaoBlockedCount,
      breachCount,
      totalAllocatedWithRecords,
      complianceRate: totalPortfolioBalance > 0 
        ? ((totalPortfolioBalance - auditData.filter(i => i.isBreached && !i.isSegmentLevel).reduce((a, b) => a + b.balance, 0)) / totalPortfolioBalance) * 100 
        : 100
    };
  }, [auditData, totalPortfolioBalance]);

  // Toggle row expansion helper
  const toggleRow = (article: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [article]: !prev[article]
    }));
  };

  const allocatedCount = useMemo(() => {
    return auditData.filter(item => item.balance > 0 && !item.isSegmentLevel).length;
  }, [auditData]);

  // Filtered and Searched Audit Records
  const filteredAuditData = useMemo(() => {
    return auditData.filter(item => {
      // Do not include segment-level limit rows in the table list
      if (item.isSegmentLevel) return false;

      // ONLY show CMN articles/segments in which there is an allocated value in the selected competence
      if (item.balance <= 0) return false;

      // 1. Search term
      const matchesSearch = 
        item.artigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.segmento.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filter Type
      if (filterType === "alertas_desenquadrados") {
        if (item.isSegmentLevel) return false;
        return item.status !== "ok";
      }
      return true;
    });
  }, [auditData, searchTerm, filterType]);

  // Segment labels in Portuguese
  const getSegmentName = (seg: string) => {
    const names: Record<string, string> = {
      rendaFixa: "Renda Fixa",
      rendaVariavel: "Renda Variável",
      estruturados: "Investimentos Estruturados",
      exterior: "Investimentos no Exterior",
      fundosImobiliarios: "Fundos Imobiliários",
      emprestimosConsignados: "Empréstimos Consignados",
    };
    return names[seg] || seg;
  };

  return (
    <div className="space-y-4">
      
      {/* KPI stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total portfolio value */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Patrimônio Consolidado</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded shrink-0">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(totalPortfolioBalance)}</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              100% dos recursos enquadrados
            </span>
          </div>
        </div>

        {/* Compliance percentage */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Grau de Conformidade</span>
            <div className={`p-1.5 rounded shrink-0 ${stats.complianceRate >= 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.complianceRate.toFixed(2)}%</h3>
            <span className={`text-[10px] font-black mt-0.5 block ${stats.complianceRate >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {stats.breachCount === 0 ? "Nenhum desenquadramento" : `${stats.breachCount} artigos excedidos`}
            </span>
          </div>
        </div>

        {/* Warning Count */}
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Artigos em Alerta</span>
            <div className={`p-1.5 rounded shrink-0 ${stats.alertCount > 0 ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.alertCount}</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              {stats.alertCount > 0 ? "Alocação acima de 90% do limite" : "Nenhum artigo > 90%"}
            </span>
          </div>
        </div>

        {/* Pró-Gestão Block Count */}
        <div className="bg-white rounded shadow-sm border-l-4 border-purple-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bloqueio Pró-Gestão</span>
            <div className={`p-1.5 rounded shrink-0 ${stats.proGestaoBlockedCount > 0 ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
              <Lock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.proGestaoBlockedCount}</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              {stats.proGestaoBlockedCount > 0 ? "Novos aportes suspensos" : "Sem restrições operacionais"}
            </span>
          </div>
        </div>

        {/* Policy breach count */}
        <div className="bg-white rounded shadow-sm border-l-4 border-rose-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Limites Excedidos</span>
            <div className={`p-1.5 rounded shrink-0 ${stats.breachCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <XCircle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.breachCount}</h3>
            <span className={`text-[10px] font-black mt-0.5 block ${stats.breachCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {stats.breachCount > 0 ? "Readequação necessária" : "Ativos operando dentro dos limites"}
            </span>
          </div>
        </div>
      </div>

      {/* Segment Compliance Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Segment limits chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs lg:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-[#1e3a8a]" />
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-700">
                {chartView === "margem" ? "Capacidade de Novos Aportes por Segmento (Margem Livre)" : "Índice de Saturação da Política de Investimento"}
              </h3>
            </div>
            
            {/* Chart View Toggle */}
            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-0.5 self-start sm:self-center">
              <button
                onClick={() => setChartView("margem")}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${chartView === "margem" ? "bg-white text-[#1e3a8a] shadow-xs border border-slate-200/50 font-black" : "text-slate-500 hover:text-slate-800"}`}
              >
                Espaço Livre (R$)
              </button>
              <button
                onClick={() => setChartView("consumo")}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${chartView === "consumo" ? "bg-white text-[#1e3a8a] shadow-xs border border-slate-200/50 font-black" : "text-slate-500 hover:text-slate-800"}`}
              >
                Consumo do Limite (%)
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={decisionChartData} 
                margin={{ top: 10, right: 10, left: chartView === "margem" ? -10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={chartView === "margem" ? (v) => {
                    if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(0)}M`;
                    if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}K`;
                    return `R$ ${v}`;
                  } : (v) => `${v}%`}
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    if (chartView === "margem") {
                      return (
                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg space-y-1.5 text-xs max-w-[280px]">
                          <div className="font-black text-slate-800 border-b border-slate-100 pb-1 flex items-center justify-between">
                            <span>{data.label}</span>
                            <span style={{ backgroundColor: `${data.color}20`, color: data.color }} className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                              Margem Livre
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-600 font-medium">
                              Limite disponível para novos aportes:
                            </div>
                            <div className="text-sm font-black text-slate-900 font-mono">
                              {formatCurrency(data.availableValue)}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Equivale a <span className="font-bold text-slate-700">{data.availablePct.toFixed(2)}%</span> do Patrimônio Líquido do RPPS.
                            </div>
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                              Alocação Atual: {data.pct.toFixed(2)}% (Limite: {data.policyMax.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      const consumption = data.consumptionPct;
                      let statusText = "Margem Segura";
                      let statusColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
                      if (consumption >= 100) {
                        statusText = "Limite Violado";
                        statusColor = "text-rose-600 bg-rose-50 border-rose-100";
                      } else if (consumption >= 90) {
                        statusText = "Alerta (>90%)";
                        statusColor = "text-amber-600 bg-amber-50 border-amber-100";
                      }
                      return (
                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg space-y-1.5 text-xs max-w-[280px]">
                          <div className="font-black text-slate-800 border-b border-slate-100 pb-1 flex items-center justify-between">
                            <span>{data.label}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border ${statusColor}`}>
                              {statusText}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-600 font-medium">
                              Consumo do limite da política:
                            </div>
                            <div className="text-sm font-black text-slate-900 font-mono">
                              {consumption.toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Alocação Atual de <span className="font-bold text-slate-700">{data.pct.toFixed(2)}%</span> sobre o limite máximo permitido de <span className="font-bold text-slate-700">{data.policyMax.toFixed(1)}%</span>.
                            </div>
                          </div>
                        </div>
                      );
                    }
                  }}
                />
                {chartView === "margem" ? (
                  <Bar dataKey="availableValue" name="Disponível para Aporte (R$)" radius={[4, 4, 0, 0]} maxBarSize={18}>
                    {decisionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                ) : (
                  <Bar dataKey="consumptionPct" name="Consumo do Limite (%)" radius={[4, 4, 0, 0]} maxBarSize={18}>
                    {decisionChartData.map((entry, index) => {
                      const consumption = entry.consumptionPct;
                      const cellColor = consumption >= 100 ? "#f43f5e" : consumption >= 90 ? "#f59e0b" : "#10b981";
                      return <Cell key={`cell-${index}`} fill={cellColor} />;
                    })}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Segment explanation list */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <TrendingUp className="h-4 w-4 text-[#1e3a8a]" />
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-700">Demonstrativo Consolidado por Segmento</h3>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {segmentAllocations.map((seg, idx) => {
                const ratio = seg.policyMax > 0 ? (seg.pct / seg.policyMax) * 100 : 0;
                const isOver = seg.pct > seg.policyMax;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">{seg.label}</span>
                      <span className="text-slate-500 font-mono">
                        {seg.pct.toFixed(2)}% <span className="text-slate-300">/</span> {seg.policyMax.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-red-500' : ratio >= 80 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(ratio, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>

      </div>

      {/* Main compliance ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Controls, Search and Filters bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar artigo ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quick view selector buttons */}
            <div className="flex items-center space-x-1.5 bg-slate-200/60 rounded-lg p-0.5">
              <button
                onClick={() => setFilterType("todos")}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${filterType === "todos" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType("alertas_desenquadrados")}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${filterType === "alertas_desenquadrados" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Alertas / Irregulares
              </button>
            </div>
          </div>

          <div className="text-[10px] font-bold text-slate-400 text-right uppercase tracking-wider">
            Exibindo {filteredAuditData.length} de {allocatedCount} artigos com alocação
          </div>
        </div>

        {/* Audit list representation */}
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {filteredAuditData.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-semibold text-xs italic">
              Nenhum artigo localizado correspondente aos critérios de busca ou filtros ativos.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 w-12 text-center">Expandir</th>
                  <th className="py-3 px-2 w-24">Artigo CMN</th>
                  <th className="py-3 px-4 w-32">Segmento</th>
                  <th className="py-3 px-4">Descrição Legal do Dispositivo</th>
                  <th className="py-3 px-4 text-right w-36">Valor Alocado</th>
                  <th className="py-3 px-4 text-right w-24">Alocação %</th>
                  <th className="py-3 px-4 text-right w-24">Lim. Estratégico (PI)</th>
                  <th className="py-3 px-4 text-right w-28">Lim. Operacional (PG)</th>
                  <th className="py-3 px-4 text-right w-24">Lim. Regulatório (CMN)</th>
                  <th className="py-3 px-4 text-center w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAuditData.map((item, idx) => {
                  const isExpanded = !!expandedArticles[item.artigo];
                  const hasFunds = item.funds.length > 0;
                  
                  return (
                    <React.Fragment key={idx}>
                      <tr className={`hover:bg-slate-50/40 transition-colors ${item.isSegmentLevel ? 'bg-blue-50/20 font-semibold border-y border-blue-100/50' : item.status === 'irregular' ? 'bg-rose-50/20' : item.status === 'alerta' ? 'bg-amber-50/10' : ''}`}>
                        
                        {/* Expand Button */}
                        <td className="py-3.5 px-4 text-center">
                          {hasFunds ? (
                            <button 
                              onClick={() => toggleRow(item.artigo)} 
                              className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors focus:outline-none"
                            >
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-blue-600" /> : <ChevronDown className="h-3.5 w-3.5 text-blue-600" />}
                            </button>
                          ) : (
                            <span className="text-slate-300 select-none text-[10px] font-bold">•</span>
                          )}
                        </td>

                        {/* Article Code */}
                        <td className="py-3.5 px-2 font-black text-blue-900 font-mono">
                          {item.isSegmentLevel ? `Art. ${item.artigo} (Seg)` : `Art. ${item.artigo}`}
                        </td>

                        {/* Segment Badge */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase block w-max ${item.isSegmentLevel ? 'bg-blue-100 text-blue-800 border border-blue-200/50' : 'bg-slate-100 text-slate-500'}`}>
                            {getSegmentName(item.segmento)}
                          </span>
                        </td>

                        {/* Article Description */}
                        <td className="py-3.5 px-4 font-medium text-slate-600 max-w-sm lg:max-w-md">
                          {item.isSegmentLevel ? (
                            <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                              <span>Limite do Segmento Consolidadado</span>
                              <span className="px-1 py-0.2 bg-blue-50 text-blue-700 rounded text-[8px] uppercase tracking-wider border border-blue-100 font-black">Consolidado</span>
                            </div>
                          ) : (
                            item.descricao
                          )}
                        </td>

                        {/* Allocated Value */}
                        <td className={`py-3.5 px-4 text-right font-mono font-black ${item.isSegmentLevel ? 'text-blue-950 font-black' : 'text-slate-800'}`}>
                          {formatCurrency(item.balance)}
                        </td>

                        {/* Allocated Pct */}
                        <td className={`py-3.5 px-4 text-right font-mono font-bold ${item.isSegmentLevel ? 'text-blue-900 font-black' : 'text-slate-800'}`}>
                          {item.pct.toFixed(2)}%
                        </td>

                        {/* Policy Limit */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-400">
                          {item.isSegmentLevel ? "-" : `${item.limitePolitica.toFixed(1)}%`}
                        </td>

                        {/* Operational Limit (Pró-Gestão) */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-500">
                          {item.isSegmentLevel ? "-" : item.restricaoProGestao ? (
                            <span className="text-rose-500 font-bold text-[10px] flex items-center justify-end space-x-1" title="Restrição de alocação de acordo com o nível do Pró-Gestão RPPS">
                              <span>0.0%</span>
                              <span className="bg-rose-50 text-rose-700 px-1 py-0.2 rounded text-[8px] uppercase font-black">Restrito</span>
                            </span>
                          ) : (
                            <span>{item.limiteProGestaoNivel2.toFixed(1)}%</span>
                          )}
                        </td>

                        {/* CMN Limit */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-400">
                          {item.isSegmentLevel ? "-" : `${item.limiteCMN5272.toFixed(1)}%`}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 text-center">
                          {item.isSegmentLevel ? (
                            <span className="text-slate-300 font-bold font-mono">-</span>
                          ) : item.status === "irregular" ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider border border-amber-200" title="Limite excedido (Desenquadrado)">
                              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600 animate-pulse" />
                              <span>Alerta</span>
                            </span>
                          ) : item.status === "alerta" ? (
                            item.isProGestaoBlocked ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider border border-amber-200" title="Limite do Pró-Gestão excedido. Novos aportes bloqueados.">
                                <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600 animate-pulse" />
                                <span>Bloqueado (PG)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider border border-amber-200">
                                <AlertTriangle className="h-3 w-3 shrink-0" />
                                <span>Alerta</span>
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider border border-emerald-200">
                              <ShieldCheck className="h-3 w-3 shrink-0" />
                              <span>Enquadrado</span>
                            </span>
                          )}
                        </td>

                      </tr>

                      {/* Expanded Funds Details Row */}
                      {isExpanded && hasFunds && (
                        <tr>
                          <td colSpan={10} className="bg-slate-50/60 p-4 border-l-2 border-blue-500">
                            <div className="space-y-2.5 pl-8">
                              <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                  Ativos alocados sob o Artigo {item.artigo} ({item.funds.length} fundo(s))
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">Patrimônio Proporcional Realizado</span>
                              </div>
                              <div className="divide-y divide-slate-200/60 max-h-[250px] overflow-y-auto pr-2">
                                {item.funds.map((fund: any, fidx: number) => (
                                  <div key={fidx} className="py-2 flex items-center justify-between text-xs hover:bg-slate-100/50 px-2 rounded transition-colors">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-slate-800">{fund.nome}</span>
                                        {fund.ativoEstressado && (
                                          <span className="px-1.5 py-0.2 bg-red-100 text-red-800 rounded text-[8px] font-black uppercase tracking-wider">
                                            Estressado
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-semibold font-mono flex items-center space-x-2">
                                        <span>CNPJ: {fund.cnpj}</span>
                                        <span>•</span>
                                        <span>Gestor: {fund.gestor}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-mono font-black text-slate-700 block">{formatCurrency(fund.saldoFinal)}</span>
                                      <span className="text-[10px] text-slate-400 font-bold block">
                                        {totalPortfolioBalance > 0 ? ((fund.saldoFinal / totalPortfolioBalance) * 100).toFixed(2) : "0.00"}% da carteira total
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>



      </div>

    </div>
  );
};
