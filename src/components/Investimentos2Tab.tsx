import React, { useState, useMemo } from "react";
import { investimentos } from "../data_investimentos";
import { formatCurrency, formatPercentRaw } from "../utils";
import { retornoMetaAtuarial, evolucaoCarteiraConsolidada } from "../data";
import { 
  Building,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Info
} from "lucide-react";

interface Investimentos2TabProps {
  competence: string;
}

export const Investimentos2Tab: React.FC<Investimentos2TabProps> = ({ competence }) => {
  const [groupBy, setGroupBy] = useState<"gestor" | "administrador">("gestor");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedFund, setSelectedFund] = useState<string>("todos");

  const formatCompetence = (comp: string) => {
    if (!comp) return "";
    const parts = comp.split("-");
    if (parts.length === 2) {
      return `${parts[1]}/${parts[0]}`;
    }
    return comp;
  };

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

  const fundDescriptions: Record<string, string> = {
    todos: "Consolidado total da carteira de investimentos da Maringá Previdência, unificando todos os fundos e recursos sob gestão.",
    reparticao: "Recursos do Fundo em Repartição Simples (Fundo Financeiro): Recursos destinados ao custeio de benefícios de servidores do regime financeiro.",
    capitalizacao: "Recursos do Fundo em Capitalização (Fundo Previdenciário): Investimentos de longo prazo acumulados para garantir os benefícios futuros sob o regime de capitalização.",
    orgaoGerenciador: "Recursos da Taxa de Administração (Órgão Gerenciador): Recursos próprios da autarquia destinados à manutenção administrativa e despesas operacionais."
  };

  // Get current month assets
  const currentAssets = useMemo(() => {
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

  // Filter based on selected Fundo
  const filteredCurrentAssets = useMemo(() => {
    if (selectedFund === "todos") return currentAssets;
    return currentAssets.filter(item => item.fundo === selectedFund);
  }, [currentAssets, selectedFund]);

  const totalBalance = useMemo(() => {
    return filteredCurrentAssets.reduce((sum, item) => sum + item.saldoFinal, 0);
  }, [filteredCurrentAssets]);

  const groupedData = useMemo(() => {
    const groups: Record<string, { 
      nome: string; 
      saldoTotal: number; 
      rendimentosTotal: number;
      ativos: Array<{ ativo: string; saldoFinal: number; segmento: string; rentabilidadeMes: number; fundo?: string }>;
    }> = {};

    filteredCurrentAssets.forEach(item => {
      const key = groupBy === "gestor" ? item.gestor : item.administrador;
      const cleanKey = key || "NÃO ESPECIFICADO";
      if (!groups[cleanKey]) {
        groups[cleanKey] = {
          nome: cleanKey,
          saldoTotal: 0,
          rendimentosTotal: 0,
          ativos: []
        };
      }
      groups[cleanKey].saldoTotal += item.saldoFinal;
      groups[cleanKey].rendimentosTotal += item.rendimentos;
      groups[cleanKey].ativos.push({
        ativo: item.ativo,
        saldoFinal: item.saldoFinal,
        segmento: item.segmento,
        rentabilidadeMes: item.rentabilidadeMes,
        fundo: item.fundo
      });
    });

    return Object.values(groups)
      .map(group => {
        const share = totalBalance ? (group.saldoTotal / totalBalance) * 100 : 0;
        const sortedAtivos = [...group.ativos].sort((a, b) => b.saldoFinal - a.saldoFinal);
        return {
          ...group,
          share,
          ativos: sortedAtivos
        };
      })
      .sort((a, b) => b.saldoTotal - a.saldoTotal);
  }, [filteredCurrentAssets, groupBy, totalBalance]);

  React.useEffect(() => {
    if (groupedData.length > 0) {
      setSelectedGroup(groupedData[0].nome);
    } else {
      setSelectedGroup(null);
    }
  }, [groupBy, competence, groupedData]);

  const selectedGroupDetails = useMemo(() => {
    if (!selectedGroup) return null;
    return groupedData.find(g => g.nome === selectedGroup) || null;
  }, [selectedGroup, groupedData]);

  const gestoresCount = useMemo(() => {
    const uniqueGestores = new Set(filteredCurrentAssets.map(item => item.gestor).filter(Boolean));
    return uniqueGestores.size;
  }, [filteredCurrentAssets]);

  const adminsCount = useMemo(() => {
    const uniqueAdmins = new Set(filteredCurrentAssets.map(item => item.administrador).filter(Boolean));
    return uniqueAdmins.size;
  }, [filteredCurrentAssets]);

  const totalYield = useMemo(() => {
    return filteredCurrentAssets.reduce((sum, item) => sum + item.rendimentos, 0);
  }, [filteredCurrentAssets]);

  const maxConcentration = useMemo(() => {
    if (groupedData.length === 0) return { nome: "Nenhum", valor: 0, pct: 0 };
    const top = groupedData[0];
    return {
      nome: top.nome,
      valor: top.saldoTotal,
      pct: top.share
    };
  }, [groupedData]);

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
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Patrimônio sob Gestão */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Patrimônio sob Gestão</span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600 shrink-0">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 block tracking-tight">{formatCurrency(totalBalance)}</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Recursos consolidados no fundo atual
            </span>
          </div>
        </div>

        {/* Rendimentos Consolidados */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rendimentos Consolidados</span>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-600 shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-emerald-700 block tracking-tight">
              {totalYield >= 0 ? "+" : ""}{formatCurrency(totalYield)}
            </h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Retorno absoluto na competência {formatCompetence(competence)}
            </span>
          </div>
        </div>

        {/* Instituições Ativas */}
        <div className="bg-white rounded shadow-sm border-l-4 border-purple-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">INSTITUIÇÕES ATIVAS</span>
            <div className="p-1.5 rounded bg-purple-50 text-purple-600 shrink-0">
              <Building className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-purple-700 block tracking-tight">
              {gestoresCount} Gest. | {adminsCount} Adm.
            </h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Instituições financeiras ativas
            </span>
          </div>
        </div>

        {/* Concentração Máxima */}
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Concentração Máxima</span>
            <div className="p-1.5 rounded bg-amber-50 text-amber-500 shrink-0">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-amber-600 block tracking-tight">
              {maxConcentration.pct.toFixed(1)}%
            </h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold truncate" title={maxConcentration.nome}>
              Líder: {maxConcentration.nome}
            </span>
          </div>
        </div>
      </div>

      {/* Concentration by Gestor / Administrador Panel */}
      <div id="quadro_gestao_admin_tab2" className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building className="h-4.5 w-4.5 text-[#1e3a8a]" />
              Concentração por {groupBy === "gestor" ? "Gestor" : "Administrador"}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Análise dos recursos consolidados sob a responsabilidade de cada instituição (Gestores ou Administradores).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setGroupBy("gestor")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  groupBy === "gestor"
                    ? "bg-white text-slate-800 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Por Gestor
              </button>
              <button
                onClick={() => setGroupBy("administrador")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                  groupBy === "administrador"
                    ? "bg-white text-slate-800 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Por Administrador
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* List and share progress bars */}
          <div className="lg:col-span-5 space-y-3 max-h-[350px] overflow-y-auto pr-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instituições e Alocação</span>
            <div className="space-y-2">
              {groupedData.map((item, index) => {
                const isSelected = selectedGroup === item.nome;
                return (
                  <div
                    key={`group-item-tab2-${index}`}
                    onClick={() => setSelectedGroup(item.nome)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-indigo-50/40 border-indigo-200 shadow-2xs"
                        : "bg-slate-50/40 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{item.nome}</span>
                      <span className="text-xs font-black text-slate-800">{formatCurrency(item.saldoTotal)}</span>
                    </div>

                    <div className="space-y-1">
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isSelected ? "bg-indigo-600" : "bg-slate-400"}`}
                          style={{ width: `${item.share}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                        <span>{item.ativos.length} ativo{item.ativos.length !== 1 ? "s" : ""}</span>
                        <span className="font-bold text-slate-600">{item.share.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed table of assets under the selected manager/admin */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ativos de: <strong className="text-slate-700">{selectedGroup || "Nenhum selecionado"}</strong>
              </span>
              {selectedGroupDetails && (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                  Total: {formatCurrency(selectedGroupDetails.saldoTotal)} ({selectedGroupDetails.share.toFixed(2)}%)
                </span>
              )}
            </div>

            {selectedGroupDetails ? (
              <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/20 max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-2 px-3">Ativo</th>
                      <th className="py-2 px-2 text-center">Segmento</th>
                      <th className="py-2 px-2 text-right">Rent. Mês</th>
                      <th className="py-2 px-3 text-right">Saldo Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedGroupDetails.ativos.map((at, idx) => (
                      <tr key={`at-detail-tab2-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-700 block">{at.ativo}</span>
                          {at.fundo && (
                            <span className={`inline-block px-1 rounded-sm text-[8px] font-bold uppercase mt-0.5 ${
                              at.fundo === "capitalizacao"
                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                : at.fundo === "reparticao"
                                ? "bg-purple-50 text-indigo-600 border border-purple-100"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                              {at.fundo === "capitalizacao"
                                ? "Capitalização"
                                : at.fundo === "reparticao"
                                ? "Repartição"
                                : "Órgão Gerenciador"}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-600">
                            {segmentLabels[at.segmento] || at.segmento}
                          </span>
                        </td>
                        <td className={`py-2 px-2 text-right font-medium ${at.rentabilidadeMes >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {formatPercentRaw(at.rentabilidadeMes)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-800">
                          {formatCurrency(at.saldoFinal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-100 rounded-xl py-20 flex flex-col items-center justify-center text-center">
                <Building className="h-8 w-8 text-slate-300 mb-2" />
                <span className="text-xs text-slate-400 italic">Selecione uma instituição para detalhar os ativos aplicados</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
