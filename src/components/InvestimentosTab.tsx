import React, { useState, useMemo } from "react";
import { investimentos } from "../data_investimentos";
import { retornoMetaAtuarial, evolucaoCarteiraConsolidada } from "../data";
import { formatCurrency, formatPercentRaw, formatPercent, formatNumber } from "../utils";
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck,
  Info,
  CheckCircle2,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface InvestimentosTabProps {
  competence: string;
}

export const InvestimentosTab: React.FC<InvestimentosTabProps> = ({ competence }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("todos");
  const [selectedFund, setSelectedFund] = useState<string>("todos");
  const [showStressedOnly, setShowStressedOnly] = useState(false);

  // Parse competence date fields
  const selectedYear = useMemo(() => competence.split("-")[0], [competence]);
  const selectedMonth = useMemo(() => parseInt(competence.split("-")[1], 10), [competence]);

  // Gather monthly data of the current fiscal year (exercício corrente) up to selected month
  const monthlyData = useMemo(() => {
    return retornoMetaAtuarial
      .filter(item => {
        const [year, monthStr] = item.competencia.split("-");
        const month = parseInt(monthStr, 10);
        return year === selectedYear && month <= selectedMonth;
      })
      .map(item => {
        const [_, monthStr] = item.competencia.split("-");
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const name = monthNames[parseInt(monthStr, 10) - 1] || monthStr;
        
        return {
          competencia: item.competencia,
          mesLabel: name,
          retornoPct: item.retornoPercentual * 100,
          metaPct: item.metaAtuarialPercentual * 100,
          retornoVal: item.retornoValor,
          isCurrent: item.competencia === competence
        };
      })
      .sort((a, b) => a.competencia.localeCompare(b.competencia));
  }, [competence, selectedYear, selectedMonth]);

  // Selected competence stats
  const selectedReturn = useMemo(() => {
    return retornoMetaAtuarial.find(r => r.competencia === competence);
  }, [competence]);

  // Previous competence identifier
  const previousCompetence = useMemo(() => {
    const [yearStr, monthStr] = competence.split("-");
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) - 1;
    if (month === 0) {
      month = 12;
      year = year - 1;
    }
    const prevMonthStr = month < 10 ? `0${month}` : `${month}`;
    return `${year}-${prevMonthStr}`;
  }, [competence]);

  // Previous competence stats
  const previousReturn = useMemo(() => {
    return retornoMetaAtuarial.find(r => r.competencia === previousCompetence);
  }, [previousCompetence]);

  // 1. Filter investments for chosen competence
  const refInvestments = useMemo(() => {
    const list: any[] = [];
    let sumBalance = 0;
    let sumYield = 0;
    const totalsByFund: Record<string, number> = { capitalizacao: 0, reparticao: 0, orgaoGerenciador: 0 };
    const yieldsByFund: Record<string, number> = { capitalizacao: 0, reparticao: 0, orgaoGerenciador: 0 };

    investimentos.forEach(inv => {
      const hist = inv.historico.find(h => h.competencia === competence);
      if (hist && (hist.saldoFinal > 0 || inv.ativoEstressado)) {
        list.push({
          id: inv.id,
          ativo: inv.nome,
          cnpj: inv.cnpj,
          fundo: inv.fundo,
          gestor: inv.gestor,
          administrador: inv.administrador,
          enquadramento: inv.enquadramento,
          ativoEstressado: inv.ativoEstressado,
          segmento: inv.segmento,
          tipoAtivo: inv.tipoAtivo,
          benchmark: inv.benchmark,
          saldoInicial: hist.saldoInicial,
          saldoFinal: hist.saldoFinal,
          rendimentos: hist.rendimentos,
          rentabilidadeMes: hist.rentabilidadeMes,
          participacaoCarteira: hist.participacaoCarteira
        });
        sumBalance += hist.saldoFinal;
        sumYield += hist.rendimentos;
        if (inv.fundo in totalsByFund) {
          totalsByFund[inv.fundo] += hist.saldoFinal;
        }
        if (inv.fundo in yieldsByFund) {
          yieldsByFund[inv.fundo] += hist.rendimentos;
        }
      }
    });

    // Get true total consolidated balance and yield
    const trueTotalObj = evolucaoCarteiraConsolidada.find(e => e.competencia === competence);
    const trueTotalBalance = trueTotalObj ? trueTotalObj.valorCarteiraConsolidada : 0;

    const goalObj = retornoMetaAtuarial.find(g => g.competencia === competence);
    const trueTotalYield = goalObj ? goalObj.retornoValor : 0;
    const avgYieldPercent = goalObj ? goalObj.retornoPercentual : 0;

    if (Math.abs(trueTotalBalance - sumBalance) > 0.01) {
      const diffBalance = trueTotalBalance - sumBalance;
      const diffYield = trueTotalYield - sumYield;

      const fundsList = ["capitalizacao", "reparticao", "orgaoGerenciador"] as const;
      const sumOfFundTotals = Object.values(totalsByFund).reduce((a, b) => a + b, 0);
      const sumOfFundYields = Object.values(yieldsByFund).reduce((a, b) => a + b, 0);

      fundsList.forEach((f, idx) => {
        const propBalance = sumOfFundTotals ? totalsByFund[f] / sumOfFundTotals : 1/3;
        const propYield = sumOfFundYields ? yieldsByFund[f] / sumOfFundYields : 1/3;

        const fundDiffBalance = diffBalance * propBalance;
        const fundDiffYield = diffYield * propYield;

        if (Math.abs(fundDiffBalance) > 0.01) {
          list.push({
            id: 1000 + idx,
            ativo: `OUTRAS DISPONIBILIDADES E OPERAÇÕES CONSOLIDADAS (${f === "capitalizacao" ? "CAPITALIZAÇÃO" : f === "reparticao" ? "REPARTIÇÃO" : "ÓRGÃO GERENCIADOR"})`,
            cnpj: "-",
            fundo: f,
            gestor: "MARINGÁ PREVIDÊNCIA",
            administrador: "MARINGÁ PREVIDÊNCIA",
            enquadramento: "14, I",
            ativoEstressado: false,
            segmento: "outrosAtivos",
            tipoAtivo: "Disponibilidades",
            benchmark: "IPCA",
            saldoInicial: fundDiffBalance - fundDiffYield,
            saldoFinal: fundDiffBalance,
            rendimentos: fundDiffYield,
            rentabilidadeMes: avgYieldPercent,
            participacaoCarteira: fundDiffBalance / trueTotalBalance
          });
        }
      });
    }

    return list;
  }, [competence]);

  // Filter based on selected Fundo for top level KPIs and charts
  const filteredRefInvestments = useMemo(() => {
    if (selectedFund === "todos") return refInvestments;
    return refInvestments.filter(item => item.fundo === selectedFund);
  }, [refInvestments, selectedFund]);

  // 2. Calculations using filtered ref investments
  const totalBalance = useMemo(() => {
    return filteredRefInvestments.reduce((sum, item) => sum + item.saldoFinal, 0);
  }, [filteredRefInvestments]);

  const totalYield = useMemo(() => {
    return filteredRefInvestments.reduce((sum, item) => sum + item.rendimentos, 0);
  }, [filteredRefInvestments]);

  const averageYieldPercent = useMemo(() => {
    const goalObj = retornoMetaAtuarial.find(g => g.competencia === competence);
    return goalObj ? goalObj.retornoPercentual : 0;
  }, [competence]);

  const stressedAssets = useMemo(() => {
    return filteredRefInvestments.filter(item => item.ativoEstressado);
  }, [filteredRefInvestments]);

  const totalStressedBalance = useMemo(() => {
    return stressedAssets.reduce((sum, item) => sum + item.saldoFinal, 0);
  }, [stressedAssets]);

  const stressedShare = useMemo(() => {
    if (totalBalance === 0) return 0;
    return (totalStressedBalance / totalBalance) * 100;
  }, [totalStressedBalance, totalBalance]);

  // 3. Segment Breakdown Calculations using filtered ref investments
  const segmentAllocation = useMemo(() => {
    const segments: Record<string, { value: number; label: string; color: string }> = {
      rendaFixa: { value: 0, label: "Renda Fixa", color: "#0284c7" },
      variavel: { value: 0, label: "Renda Variável", color: "#10b981" },
      estruturados: { value: 0, label: "Investimentos Estruturados", color: "#f59e0b" },
      fundosImobiliarios: { value: 0, label: "Fundos Imobiliários", color: "#ec4899" },
      exterior: { value: 0, label: "Investimentos no Exterior", color: "#8b5cf6" },
      emprestimoConsignado: { value: 0, label: "Consignados", color: "#14b8a6" },
      outrosAtivos: { value: 0, label: "Disponibilidades e Ajustes", color: "#64748b" }
    };

    filteredRefInvestments.forEach(item => {
      if (segments[item.segmento]) {
        segments[item.segmento].value += item.saldoFinal;
      }
    });

    return Object.values(segments).filter(s => s.value > 0);
  }, [filteredRefInvestments]);

  // 3b. Fund Breakdown Calculations (distribution of overall portfolio among funds)
  const fundAllocation = useMemo(() => {
    const funds: Record<string, { id: string; value: number; label: string; color: string }> = {
      capitalizacao: { id: "capitalizacao", value: 0, label: "Fundo em Capitalização", color: "#10b981" },
      reparticao: { id: "reparticao", value: 0, label: "Fundo em Repartição", color: "#2563eb" },
      orgaoGerenciador: { id: "orgaoGerenciador", value: 0, label: "Órgão Gerenciador", color: "#f59e0b" }
    };

    refInvestments.forEach(item => {
      if (funds[item.fundo]) {
        funds[item.fundo].value += item.saldoFinal;
      }
    });

    return Object.values(funds).filter(f => f.value > 0);
  }, [refInvestments]);

  const totalPortfolioBalance = useMemo(() => {
    return refInvestments.reduce((sum, item) => sum + item.saldoFinal, 0);
  }, [refInvestments]);

  // Segment Labels mapping
  const segmentLabels: Record<string, string> = {
    rendaFixa: "Renda Fixa",
    variavel: "Renda Variável",
    estruturados: "Investimento Estruturado",
    fundosImobiliarios: "Fundo Imobiliário",
    exterior: "Investimento no Exterior",
    emprestimoConsignado: "Consignado / Outros",
    outrosAtivos: "Disponibilidades e Ajustes"
  };

  // 4. Filter List based on Search, Segment, and Stressed filter using filteredRefInvestments
  const filteredInvestments = useMemo(() => {
    return filteredRefInvestments.filter(item => {
      const matchesSearch = item.ativo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.cnpj.includes(searchTerm) || 
                            item.gestor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSegment = selectedSegment === "todos" || item.segmento === selectedSegment;
      const matchesStressed = !showStressedOnly || item.ativoEstressado;

      return matchesSearch && matchesSegment && matchesStressed;
    }).map(item => {
      const share = totalBalance ? (item.saldoFinal / totalBalance) * 100 : 0;
      return { ...item, share };
    }).sort((a, b) => b.saldoFinal - a.saldoFinal);
  }, [filteredRefInvestments, searchTerm, selectedSegment, showStressedOnly, totalBalance]);

  const fundDescriptions: Record<string, string> = {
    todos: "Consolidado total da carteira de investimentos da Maringá Previdência, unificando todos os fundos e recursos sob gestão.",
    reparticao: "Recursos do Fundo em Repartição Simples (Fundo Financeiro): Recursos destinados ao custeio de benefícios de servidores do regime financeiro.",
    capitalizacao: "Recursos do Fundo em Capitalização (Fundo Previdenciário): Investimentos de longo prazo acumulados para garantir os benefícios futuros sob o regime de capitalização.",
    orgaoGerenciador: "Recursos da Taxa de Administração (Órgão Gerenciador): Recursos próprios da autarquia destinados à manutenção administrativa e despesas operacionais."
  };

  return (
    <div className="space-y-4">
      {/* Selector of Fundo */}
      <div className="bg-white rounded shadow-xs border border-slate-200 p-2 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(["todos", "capitalizacao", "reparticao", "orgaoGerenciador"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFund(f)}
              className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedFund === f
                  ? "bg-[#1e3a8a] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {f === "todos" 
                ? "CONSOLIDADO" 
                : f === "capitalizacao" 
                ? "CAPITALIZAÇÃO" 
                : f === "reparticao" 
                ? "REPARTIÇÃO" 
                : "ÓRGÃO GERENCIADOR"}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium mr-2">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Filtro de regime atuarial e fundos de previdência</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recursos Aplicados</span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{formatCurrency(totalBalance)}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Alocados em {filteredRefInvestments.length} ativos e fundos
            </span>
          </div>
        </div>

        {/* Total Monthly Yield */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rendimento no Mês</span>
            <div className={`p-1.5 rounded ${totalYield >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {totalYield >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-2">
            <h4 className={`text-xl font-black tracking-tight ${totalYield >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
              {formatCurrency(totalYield)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Resultado líquido das aplicações
            </span>
          </div>
        </div>

        {/* Rentabilidade Ponderada */}
        <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">RENTABILIDADE</span>
            <div className={`p-1.5 rounded ${averageYieldPercent >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h4 className={`text-xl font-black tracking-tight ${averageYieldPercent >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
              {formatPercent(averageYieldPercent)}
            </h4>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Retorno para fins de meta atuarial
            </span>
          </div>
        </div>

        {/* Distribuição por Fundo */}
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 flex flex-col justify-between">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Distribuição por Fundo</span>
              <div className="p-1.5 rounded bg-amber-50 text-amber-600">
                <Filter className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {fundAllocation.map((f, i) => {
                const pct = totalPortfolioBalance ? ((f.value / totalPortfolioBalance) * 100).toFixed(1) : "0.0";
                const fNameShort = f.id === "capitalizacao" ? "Capit." : f.id === "reparticao" ? "Repart." : "Tx. Adm.";
                return (
                  <div key={i} className="flex items-center justify-between text-[11px] font-semibold text-slate-600 py-0.5">
                    <div className="flex items-center space-x-1 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: f.color }}></span>
                      <span className="text-slate-500 truncate" title={f.label}>{fNameShort}:</span>
                    </div>
                    <div className="font-mono text-right shrink-0 space-x-1">
                      <span className="text-slate-800 font-bold text-[11px]">{formatCurrency(f.value)}</span>
                      <span className="text-slate-400 text-[10px]">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Rentabilidade e Comparativo de Competências */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gráfico do Exercício Corrente */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 lg:col-span-2 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">Rentabilidade Mensal do Exercício ({selectedYear})</h4>
              <p className="text-[11px] text-slate-400">Desempenho consolidado da carteira de investimentos mês a mês durante o ano vigente.</p>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs"></span>
                <span>Anteriores</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span>
                <span>Selecionada</span>
              </span>
            </div>
          </div>

          <div className="h-56">
            {monthlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Nenhum dado disponível para o ano {selectedYear}.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="mesLabel" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `${v.toFixed(1)}%`}
                    tick={{ fill: '#64748b', fontSize: 10 }} 
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value: any, name: any, props: any) => {
                      if (name === "retornoPct") {
                        return [`${value.toFixed(2)}%`, "Rentabilidade"];
                      }
                      if (name === "metaPct") {
                        return [`${value.toFixed(2)}%`, "Meta Atuarial"];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      if (item) {
                        return `Competência: ${item.competencia}`;
                      }
                      return label;
                    }}
                    contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="retornoPct" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {monthlyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isCurrent ? "#10b981" : "#2563eb"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Card Comparativo com Competência Anterior */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 lg:col-span-1 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">Comparativo Mensal</h4>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-black uppercase">Análise de Variação</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Comparativo direto entre a perfomance da rentabilidade para fins de meta atuarial entre a competência ativa e o período imediatamente anterior.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Competência Anterior */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block flex items-center space-x-1">
                  <CalendarDays className="h-3 w-3 text-slate-400" />
                  <span>Anterior ({previousCompetence.split("-")[1]}/{previousCompetence.split("-")[0].slice(2)})</span>
                </span>
                {previousReturn ? (
                  <div className="space-y-1">
                    <span className="text-sm font-black text-slate-700 block">
                      {formatPercent(previousReturn.retornoPercentual)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 block truncate">
                      {formatCurrency(previousReturn.retornoValor)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic block py-2 font-medium">Sem registros</span>
                )}
              </div>

              {/* Competência Selecionada */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 space-y-1.5">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block flex items-center space-x-1">
                  <CalendarDays className="h-3 w-3 text-emerald-500" />
                  <span>Selecionada ({competence.split("-")[1]}/{competence.split("-")[0].slice(2)})</span>
                </span>
                {selectedReturn ? (
                  <div className="space-y-1">
                    <span className="text-sm font-black text-emerald-700 block">
                      {formatPercent(selectedReturn.retornoPercentual)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 block truncate">
                      {formatCurrency(selectedReturn.retornoValor)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic block py-2 font-medium">Sem registros</span>
                )}
              </div>
            </div>
          </div>

          {selectedReturn && previousReturn ? (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              {/* Rentabilidade de Variação badge */}
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500">Diferença de Taxa:</span>
                {(() => {
                  const diffPct = (selectedReturn.retornoPercentual - previousReturn.retornoPercentual) * 100;
                  const isPositive = diffPct >= 0;
                  return (
                    <span className={`inline-flex items-center space-x-0.5 font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      <span>{isPositive ? "+" : ""}{diffPct.toFixed(2)} p.p.</span>
                    </span>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="mt-4 text-[10px] text-slate-400 italic text-center font-medium">
              Informações comparativas parciais devido à ausência de dados históricos anteriores.
            </div>
          )}
        </div>
      </div>

      {/* Segment & Fund Breakdowns Column on the Left, Ledger on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-1 space-y-4 flex flex-col">
          {/* Segment Breakdown Donut */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Alocação por Segmento</h4>
              <p className="text-[11px] text-slate-400">Distribuição dos recursos sob gestão em conformidade com as diretrizes de investimento.</p>
            </div>
            <div className="h-44 flex items-center justify-center my-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {segmentAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      const pct = totalBalance ? ((Number(value) / totalBalance) * 100).toFixed(2) : "0.00";
                      return [`${formatCurrency(Number(value))} (${pct}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-1.5 text-[10px] border-t border-slate-50 pt-2">
              {segmentAllocation.map((seg, i) => {
                const pct = totalBalance ? ((seg.value / totalBalance) * 100).toFixed(2) : "0.00";
                return (
                  <div key={i} className="flex items-center justify-between py-0.5">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: seg.color }}></span>
                      <span className="text-slate-500 font-medium truncate" title={seg.label}>{seg.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0 font-mono text-right">
                      <span className="text-slate-500 font-semibold">{formatCurrency(seg.value)}</span>
                      <span className="font-bold text-slate-800 bg-slate-50 px-1 py-0.2 rounded border border-slate-100">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fund Breakdown Donut */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Alocação por Fundo</h4>
                {selectedFund !== "todos" && (
                  <button 
                    onClick={() => setSelectedFund("todos")}
                    className="text-[10px] text-blue-600 hover:underline font-semibold"
                  >
                    Limpar Filtro
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Distribuição do patrimônio líquido consolidado entre os fundos previdenciários e taxa administrativa.</p>
            </div>
            <div className="h-44 flex items-center justify-center my-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {fundAllocation.map((entry, index) => {
                      const isSelected = selectedFund === entry.id;
                      const hasActiveFilter = selectedFund !== "todos";
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={hasActiveFilter && !isSelected ? 0.4 : 1.0}
                          stroke={isSelected ? "#1e293b" : "#fff"}
                          strokeWidth={isSelected ? 2 : 1}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      const pct = totalPortfolioBalance ? ((Number(value) / totalPortfolioBalance) * 100).toFixed(2) : "0.00";
                      return [`${formatCurrency(Number(value))} (${pct}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-1.5 text-[10px] border-t border-slate-50 pt-2">
              {fundAllocation.map((seg, i) => {
                const pct = totalPortfolioBalance ? ((seg.value / totalPortfolioBalance) * 100).toFixed(2) : "0.00";
                const isSelected = selectedFund === seg.id;
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedFund(isSelected ? "todos" : seg.id)}
                    className={`flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-slate-100 ring-1 ring-slate-200 font-bold" 
                        : "hover:bg-slate-50"
                    }`}
                    title="Clique para filtrar a carteira por este fundo"
                  >
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: seg.color }}></span>
                      <span className={`truncate ${isSelected ? "text-slate-900 font-bold" : "text-slate-500 font-medium"}`}>{seg.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0 font-mono text-right">
                      <span className="text-slate-500 font-semibold">{formatCurrency(seg.value)}</span>
                      <span className={`font-bold px-1 py-0.2 rounded border ${
                        isSelected 
                          ? "text-blue-700 bg-blue-50 border-blue-100" 
                          : "text-slate-800 bg-slate-50 border-slate-100"
                      }`}>({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Investments Ledger */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 lg:col-span-2 flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Composição da Carteira de Investimentos</h4>
              <p className="text-[11px] text-slate-400">Listagem analítica de todos os instrumentos aplicados na competência selecionada.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowStressedOnly(!showStressedOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1 ${
                  showStressedOnly 
                    ? "bg-amber-100 border-amber-300 text-amber-800" 
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Sob Monitoramento</span>
              </button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por ativo, CNPJ ou gestor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-700"
              />
            </div>

            <div className="relative">
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-600"
              >
                <option value="todos">Todos os Segmentos</option>
                <option value="rendaFixa">Renda Fixa</option>
                <option value="variavel">Renda Variável</option>
                <option value="estruturados">Investimento Estruturado</option>
                <option value="fundosImobiliarios">Fundo Imobiliário</option>
                <option value="exterior">Investimento no Exterior</option>
                <option value="emprestimoConsignado">Consignados</option>
                <option value="outrosAtivos">Disponibilidades e Ajustes</option>
              </select>
            </div>
          </div>

          {/* Results table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl lg:max-h-[580px] max-h-[400px] overflow-y-auto no-scrollbar flex-1">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Ativo / CNPJ</th>
                  <th className="py-2.5 px-2">Segmento</th>
                  <th className="py-2.5 px-2">Enquadramento CMN</th>
                  <th className="py-2.5 px-2 text-right">Rent. Mês</th>
                  <th className="py-2.5 px-2 text-right">Rend. Absoluto</th>
                  <th className="py-2.5 px-3 text-right">Saldo Final</th>
                  <th className="py-2.5 px-2 text-right">Part. (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Nenhum ativo corresponde aos filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((item, i) => (
                    <tr 
                      key={i} 
                      className={`hover:bg-slate-50 transition-colors ${item.ativoEstressado ? "bg-amber-50/20" : ""}`}
                    >
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-800 flex items-center space-x-1">
                          <span>{item.ativo}</span>
                          {item.ativoEstressado && (
                            <span className="px-1 py-0.5 rounded bg-amber-100 text-amber-800 text-[8px] font-bold uppercase tracking-wider flex items-center space-x-0.5">
                              <AlertTriangle className="h-2 w-2" />
                              <span>ALERTA</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap gap-x-1.5 gap-y-0.5 items-center">
                          <span>CNPJ: {item.cnpj}</span>
                          <span>|</span>
                          <span>Gestor: {item.gestor}</span>
                          {item.fundo && (
                            <>
                              <span>|</span>
                              <span className={`px-1 rounded-sm text-[8px] font-bold uppercase ${
                                item.fundo === "capitalizacao"
                                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                                  : item.fundo === "reparticao"
                                  ? "bg-purple-50 text-indigo-600 border border-purple-100"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}>
                                {item.fundo === "capitalizacao"
                                  ? "Capitalização"
                                  : item.fundo === "reparticao"
                                  ? "Repartição"
                                  : "Órgão Gerenciador"}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-slate-500 font-medium">{segmentLabels[item.segmento] || item.segmento}</td>
                      <td className="py-2 px-2 text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium text-[10px]">
                          Art. {item.enquadramento}
                        </span>
                      </td>
                      <td className={`py-2 px-2 text-right font-semibold ${item.rentabilidadeMes >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {formatPercentRaw(item.rentabilidadeMes)}
                      </td>
                      <td className={`py-2 px-2 text-right font-medium ${item.rendimentos >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        {formatCurrency(item.rendimentos)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">{formatCurrency(item.saldoFinal)}</td>
                      <td className="py-2 px-2 text-right font-mono text-slate-500 font-semibold">{item.share.toFixed(2)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
