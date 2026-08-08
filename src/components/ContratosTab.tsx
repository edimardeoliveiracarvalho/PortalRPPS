import React, { useState, useMemo } from "react";
import { contratosData, Contrato } from "../data_contratos";
import { formatCurrency, formatNumber } from "../utils";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Scale,
  DollarSign,
  Layers,
  Search,
  Filter,
  ArrowRightLeft,
  Calendar,
  Info,
  X,
  User,
  Users,
  UserCheck,
  UserCog,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Building,
  Bell,
  FileCheck,
  Zap,
  Check,
  ThumbsUp,
  Send,
  FileSpreadsheet
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface ContratosTabProps {
  competence?: string;
}

type SubTab = "visao_geral" | "decisoes_urgentes" | "gestores_fiscais" | "todos_contratos" | "comparador";

export const ContratosTab: React.FC<ContratosTabProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("visao_geral");

  // Filters state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todos");
  const [riscoFilter, setRiscoFilter] = useState<string>("todos");
  const [essencialFilter, setEssencialFilter] = useState<string>("todos");
  const [modalidadeFilter, setModalidadeFilter] = useState<string>("todos");

  // Filters state for Gestores & Fiscais sub-tab
  const [gestorFiscalSearch, setGestorFiscalSearch] = useState<string>("");
  const [gestorFiscalViewMode, setGestorFiscalViewMode] = useState<"gestores" | "fiscais" | "tabela">("gestores");

  // Sub-filter for Decisões Urgentes / Vencimentos
  const [decisaoFilter, setDecisaoFilter] = useState<"todos" | "urgente60" | "atencao90" | "prazo180" | "aditivo" | "licitacao" | "essencial_risco">("todos");

  // State to simulate Board (Diretoria) decision registration
  const [decisoesTomadas, setDecisoesTomadas] = useState<Record<string, { decisao: "aditivo" | "licitacao" | "parecer"; data: string }>>({});

  // Selection state for Comparator & Modal
  const [selectedContractForModal, setSelectedContractForModal] = useState<Contrato | null>(null);
  const [comparedIds, setComparedIds] = useState<string[]>(["202201", "202302", "202307"]);

  // Helper to calculate days remaining until expiration (Reference Date: 2026-08-06)
  const getDaysRemaining = (endDateStr: string) => {
    if (!endDateStr) return 0;
    const today = new Date(2026, 7, 6);
    const [year, month, day] = endDateStr.split("-").map(Number);
    const endDate = new Date(year, month - 1, day);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setCategoriaFilter("todos");
    setRiscoFilter("todos");
    setEssencialFilter("todos");
    setModalidadeFilter("todos");
    setDecisaoFilter("todos");
  };

  // Categories & Options
  const categories = useMemo(() => {
    const set = new Set<string>();
    contratosData.forEach((c) => set.add(c.categoriaContrato));
    return Array.from(set).sort();
  }, []);

  const modalidades = useMemo(() => {
    const set = new Set<string>();
    contratosData.forEach((c) => set.add(c.tipoContratacao));
    return Array.from(set).sort();
  }, []);

  // Filtered Contracts for general lists
  const filteredContracts = useMemo(() => {
    return contratosData.filter((c) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !search ||
        c.idContrato.toLowerCase().includes(search) ||
        c.processoSEI.toLowerCase().includes(search) ||
        c.fornecedor.toLowerCase().includes(search) ||
        c.categoriaContrato.toLowerCase().includes(search) ||
        c.gestorContrato.toLowerCase().includes(search) ||
        c.fiscalContrato.toLowerCase().includes(search) ||
        `contrato ${c.numeroContrato}/${c.anoContrato}`.toLowerCase().includes(search);

      const matchStatus = statusFilter === "todos" || c.statusContrato === statusFilter;
      const matchCategoria = categoriaFilter === "todos" || c.categoriaContrato === categoriaFilter;
      const matchRisco = riscoFilter === "todos" || c.riscoDescontinuidade === riscoFilter;
      const matchEssencial =
        essencialFilter === "todos" ||
        (essencialFilter === "sim" && c.servicoEssencial) ||
        (essencialFilter === "nao" && !c.servicoEssencial);
      const matchModalidade = modalidadeFilter === "todos" || c.tipoContratacao === modalidadeFilter;

      return matchSearch && matchStatus && matchCategoria && matchRisco && matchEssencial && matchModalidade;
    });
  }, [searchTerm, statusFilter, categoriaFilter, riscoFilter, essencialFilter, modalidadeFilter]);

  // Overall statistics focused on expiration & executive decision making
  const stats = useMemo(() => {
    const ativos = contratosData.filter((c) => c.statusContrato === "Ativo");

    const v60 = ativos.filter((c) => {
      const d = getDaysRemaining(c.fimVigencia);
      return d >= 0 && d <= 60;
    });

    const v90 = ativos.filter((c) => {
      const d = getDaysRemaining(c.fimVigencia);
      return d >= 0 && d <= 90;
    });

    const v180 = ativos.filter((c) => {
      const d = getDaysRemaining(c.fimVigencia);
      return d >= 0 && d <= 180;
    });

    const valorAtRisco180 = v180.reduce((acc, c) => acc + c.valorAtualizado, 0);
    const valorAtRisco60 = v60.reduce((acc, c) => acc + c.valorAtualizado, 0);

    const prorrogaveis180 = v180.filter((c) => c.possibilidadeProrrogacao === true);
    const licitacaoObrigatoria180 = v180.filter((c) => c.possibilidadeProrrogacao === false || c.necessitaNovaContratacao === true);

    return {
      totalContratos: contratosData.length,
      totalAtivos: ativos.length,
      v60Count: v60.length,
      v60Value: valorAtRisco60,
      v90Count: v90.length,
      v180Count: v180.length,
      v180Value: valorAtRisco180,
      prorrogaveis180Count: prorrogaveis180.length,
      licitacao180Count: licitacaoObrigatoria180.length
    };
  }, []);

  // Contracts list specifically filtered for Board Decision Panel
  const decisaoPanelContracts = useMemo(() => {
    const ativos = contratosData.filter((c) => c.statusContrato === "Ativo");

    return ativos.filter((c) => {
      const days = getDaysRemaining(c.fimVigencia);

      if (decisaoFilter === "urgente60") {
        return days >= 0 && days <= 60;
      }
      if (decisaoFilter === "atencao90") {
        return days >= 0 && days <= 90;
      }
      if (decisaoFilter === "prazo180") {
        return days >= 0 && days <= 180;
      }
      if (decisaoFilter === "aditivo") {
        return days <= 180 && c.possibilidadeProrrogacao === true;
      }
      if (decisaoFilter === "licitacao") {
        return days <= 180 && (c.possibilidadeProrrogacao === false || c.necessitaNovaContratacao === true);
      }
      if (decisaoFilter === "essencial_risco") {
        return days <= 180 && c.servicoEssencial && (c.riscoDescontinuidade === "Alto" || c.riscoDescontinuidade === "Médio");
      }
      // Default: show expiring within 180 days first for decision making
      return days <= 180;
    }).sort((a, b) => getDaysRemaining(a.fimVigencia) - getDaysRemaining(b.fimVigencia));
  }, [decisaoFilter]);

  // Chart Data: Expiration timeline & financial commitments
  const chartSemestreData = useMemo(() => {
    const map: Record<string, { semestre: string; total: number; valor: number; aditivos: number; licitacoes: number }> = {
      "2026-H2": { semestre: "2º Sem 2026", total: 0, valor: 0, aditivos: 0, licitacoes: 0 },
      "2027-H1": { semestre: "1º Sem 2027", total: 0, valor: 0, aditivos: 0, licitacoes: 0 },
      "2027-H2": { semestre: "2º Sem 2027", total: 0, valor: 0, aditivos: 0, licitacoes: 0 },
      "2028+": { semestre: "2028 em diante", total: 0, valor: 0, aditivos: 0, licitacoes: 0 }
    };

    contratosData.forEach((c) => {
      if (c.statusContrato !== "Ativo") return;
      const year = parseInt(c.fimVigencia.substring(0, 4));
      const month = parseInt(c.fimVigencia.substring(5, 7));

      let key = "2028+";
      if (year === 2026) key = "2026-H2";
      else if (year === 2027 && month <= 6) key = "2027-H1";
      else if (year === 2027 && month > 6) key = "2027-H2";

      if (map[key]) {
        map[key].total += 1;
        map[key].valor += c.valorAtualizado;
        if (c.possibilidadeProrrogacao) map[key].aditivos += 1;
        else map[key].licitacoes += 1;
      }
    });

    return Object.values(map);
  }, []);

  // Chart Data: Decision Route distribution (Aditivos vs Licitações)
  const chartRouteData = useMemo(() => {
    const expiring180 = contratosData.filter((c) => c.statusContrato === "Ativo" && getDaysRemaining(c.fimVigencia) <= 180);
    const aditivos = expiring180.filter((c) => c.possibilidadeProrrogacao).length;
    const licitacoes = expiring180.filter((c) => !c.possibilidadeProrrogacao || c.necessitaNovaContratacao).length;

    return [
      { name: "Prorrogação via Aditivo", value: aditivos, color: "#2563eb" },
      { name: "Nova Licitação (SEI)", value: licitacoes, color: "#e11d48" }
    ];
  }, []);

  // Overview Statistics for VISÃO GERAL Sub-tab
  const overviewStats = useMemo(() => {
    const ativos = contratosData.filter((c) => c.statusContrato === "Ativo");

    const valorInicialTotal = ativos.reduce((acc, c) => acc + c.valorInicialContrato, 0);
    const valorAtualizadoTotal = ativos.reduce((acc, c) => acc + c.valorAtualizado, 0);
    const saldoRemanescenteTotal = ativos.reduce((acc, c) => acc + c.saldoContrato, 0);
    const valorExecutadoTotal = valorAtualizadoTotal - saldoRemanescenteTotal;
    const valorMensalTotal = ativos.reduce((acc, c) => acc + (c.valorMensal || 0), 0);

    const vencimentos90 = ativos.filter((c) => {
      const d = getDaysRemaining(c.fimVigencia);
      return d >= 0 && d <= 90;
    });
    const vencimentos90Value = vencimentos90.reduce((acc, c) => acc + c.valorAtualizado, 0);

    const essenciais = ativos.filter((c) => c.servicoEssencial);
    const riscoAlto = ativos.filter((c) => c.riscoDescontinuidade === "Alto");

    const fornecedoresUnicos = new Set(ativos.map((c) => c.fornecedor)).size;

    return {
      totalAtivos: ativos.length,
      valorInicialTotal,
      valorAtualizadoTotal,
      saldoRemanescenteTotal,
      valorExecutadoTotal,
      valorMensalTotal,
      vencimentos90Count: vencimentos90.length,
      vencimentos90Value,
      essenciaisCount: essenciais.length,
      riscoAltoCount: riscoAlto.length,
      fornecedoresUnicos
    };
  }, []);

  // Chart 1: Expiration Horizon for Active Contracts (< 30d, 31-90d, 91-180d, 181-365d, > 1 Ano)
  const chartHorizonteVencimento = useMemo(() => {
    const map = {
      critico: { faixa: "< 30 dias", label: "< 30 dias (Crítico)", order: 1, count: 0, valor: 0, color: "#ef4444" },
      urgente: { faixa: "31-90 dias", label: "31-90 dias (Urgente)", order: 2, count: 0, valor: 0, color: "#f59e0b" },
      medio: { faixa: "91-180 dias", label: "91-180 dias (Médio)", order: 3, count: 0, valor: 0, color: "#3b82f6" },
      ano1: { faixa: "181-365 dias", label: "181-365 dias (1 Ano)", order: 4, count: 0, valor: 0, color: "#6366f1" },
      longo: { faixa: "> 1 Ano", label: "> 1 Ano (Longo)", order: 5, count: 0, valor: 0, color: "#10b981" }
    };

    contratosData.forEach((c) => {
      if (c.statusContrato !== "Ativo") return;
      const days = getDaysRemaining(c.fimVigencia);

      if (days < 30) {
        map.critico.count += 1;
        map.critico.valor += c.valorAtualizado;
      } else if (days <= 90) {
        map.urgente.count += 1;
        map.urgente.valor += c.valorAtualizado;
      } else if (days <= 180) {
        map.medio.count += 1;
        map.medio.valor += c.valorAtualizado;
      } else if (days <= 365) {
        map.ano1.count += 1;
        map.ano1.valor += c.valorAtualizado;
      } else {
        map.longo.count += 1;
        map.longo.valor += c.valorAtualizado;
      }
    });

    return Object.values(map).sort((a, b) => a.order - b.order);
  }, []);

  // Chart 2: Contracting Modality (Tipo de Contratação)
  const chartModalidadeData = useMemo(() => {
    const map: Record<string, { modalidade: string; count: number; valor: number }> = {};

    contratosData.forEach((c) => {
      if (c.statusContrato !== "Ativo") return;
      const mod = c.tipoContratacao || "Outros";
      if (!map[mod]) {
        map[mod] = { modalidade: mod, count: 0, valor: 0 };
      }
      map[mod].count += 1;
      map[mod].valor += c.valorAtualizado;
    });

    return Object.values(map).sort((a, b) => b.valor - a.valor);
  }, []);

  // Chart 3: Financial Execution Breakdown (Valor Inicial x Valor Atualizado x Saldo Remanescente)
  const chartExecucaoPorCategoria = useMemo(() => {
    const map: Record<string, { categoria: string; valorInicial: number; valorAtualizado: number; saldoRemanescente: number; executado: number; count: number }> = {};

    contratosData.forEach((c) => {
      if (c.statusContrato !== "Ativo") return;
      const cat = c.categoriaContrato || "Geral";
      if (!map[cat]) {
        map[cat] = {
          categoria: cat,
          valorInicial: 0,
          valorAtualizado: 0,
          saldoRemanescente: 0,
          executado: 0,
          count: 0
        };
      }
      map[cat].valorInicial += c.valorInicialContrato;
      map[cat].valorAtualizado += c.valorAtualizado;
      map[cat].saldoRemanescente += c.saldoContrato;
      map[cat].executado += (c.valorAtualizado - c.saldoContrato);
      map[cat].count += 1;
    });

    return Object.values(map).sort((a, b) => b.valorAtualizado - a.valorAtualizado);
  }, []);

  // Top 5 largest active contracts
  const topContratosAtivos = useMemo(() => {
    return contratosData
      .filter((c) => c.statusContrato === "Ativo")
      .sort((a, b) => b.valorAtualizado - a.valorAtualizado)
      .slice(0, 5);
  }, []);

  // Summary aggregation for Gestores (Contract Managers)
  const gestoresSummary = useMemo(() => {
    const map: Record<string, {
      nome: string;
      totalContratos: number;
      ativosCount: number;
      valorTotal: number;
      vencimentoUrgente: number;
      contratos: Contrato[];
    }> = {};

    contratosData.forEach((c) => {
      const g = c.gestorContrato || "Não Designado";
      if (!map[g]) {
        map[g] = { nome: g, totalContratos: 0, ativosCount: 0, valorTotal: 0, vencimentoUrgente: 0, contratos: [] };
      }
      map[g].totalContratos += 1;
      map[g].contratos.push(c);
      if (c.statusContrato === "Ativo") {
        map[g].ativosCount += 1;
        map[g].valorTotal += c.valorAtualizado;
        const days = getDaysRemaining(c.fimVigencia);
        if (days >= 0 && days <= 180) {
          map[g].vencimentoUrgente += 1;
        }
      }
    });

    return Object.values(map).sort((a, b) => b.ativosCount - a.ativosCount || b.valorTotal - a.valorTotal);
  }, []);

  // Summary aggregation for Fiscais (Contract Inspectors)
  const fiscaisSummary = useMemo(() => {
    const map: Record<string, {
      nome: string;
      totalContratos: number;
      ativosCount: number;
      valorTotal: number;
      vencimentoUrgente: number;
      contratos: Contrato[];
    }> = {};

    contratosData.forEach((c) => {
      const f = c.fiscalContrato || "Não Designado";
      if (!map[f]) {
        map[f] = { nome: f, totalContratos: 0, ativosCount: 0, valorTotal: 0, vencimentoUrgente: 0, contratos: [] };
      }
      map[f].totalContratos += 1;
      map[f].contratos.push(c);
      if (c.statusContrato === "Ativo") {
        map[f].ativosCount += 1;
        map[f].valorTotal += c.valorAtualizado;
        const days = getDaysRemaining(c.fimVigencia);
        if (days >= 0 && days <= 180) {
          map[f].vencimentoUrgente += 1;
        }
      }
    });

    return Object.values(map).sort((a, b) => b.ativosCount - a.ativosCount || b.valorTotal - a.valorTotal);
  }, []);

  // Toggle comparison contract
  const handleToggleCompare = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length < 4) {
        setComparedIds([...comparedIds, id]);
      } else {
        alert("Máximo de 4 contratos para comparação simultânea.");
      }
    }
  };

  const comparedContracts = useMemo(() => {
    return contratosData.filter((c) => comparedIds.includes(c.idContrato));
  }, [comparedIds]);

  // Handle Board Decision registration
  const handleRegistrarDecisao = (idContrato: string, tipo: "aditivo" | "licitacao" | "parecer") => {
    const now = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setDecisoesTomadas((prev) => ({
      ...prev,
      [idContrato]: { decisao: tipo, data: now }
    }));
  };

  // Helper Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Ativo</span>;
      case "Suspenso":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Suspenso</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  const getRiscoBadge = (risco: string) => {
    switch (risco) {
      case "Alto":
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">Risco Alto</span>;
      case "Médio":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">Risco Médio</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">Risco Baixo</span>;
    }
  };

  const getVigenciaAlertBadge = (c: Contrato) => {
    if (c.statusContrato !== "Ativo") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          Encerrado / Inativo
        </span>
      );
    }

    const days = getDaysRemaining(c.fimVigencia);

    if (days < 0) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
          🚨 Vencido ({Math.abs(days)}d atrás)
        </span>
      );
    }

    if (days <= 30) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse shadow-xs">
          🚨 Vence em {days}d (Ação Imediata)
        </span>
      );
    }

    if (days <= 60) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
          🚨 Vence em {days}d (&lt; 60d)
        </span>
      );
    }

    if (days <= 90) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
          ⚠️ Vence em {days}d (&lt; 90d)
        </span>
      );
    }

    if (days <= 180) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-800 border border-yellow-300">
          ⏳ Vence em {days}d (&lt; 180d)
        </span>
      );
    }

    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Regular ({days}d)
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 1. SUB-NAVIGATION SELECTOR BAR */}
      <div className="bg-white rounded shadow-xs border border-slate-200 p-2 flex flex-wrap gap-2">
        {[
          { id: "visao_geral", label: "VISÃO GERAL", icon: BarChart3 },
          { id: "decisoes_urgentes", label: "PAINEL DE VENCIMENTOS", icon: Zap },
          { id: "gestores_fiscais", label: "GESTORES & FISCAIS", icon: UserCheck },
          { id: "todos_contratos", label: `TODOS OS CONTRATOS (${stats.totalContratos})`, icon: Layers },
          { id: "comparador", label: `COMPARADOR (${comparedIds.length})`, icon: ArrowRightLeft }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                isActive
                  ? "bg-[#1e3a8a] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================================= */}
      {/* SUB-TAB 0: VISÃO GERAL DOS CONTRATOS                                                       */}
      {/* ========================================================================================= */}
      {activeSubTab === "visao_geral" && (
        <div className="space-y-4">
          
          {/* Executive Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Contratos Ativos & Valor Total */}
            <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Contratos Ativos
                </span>
                <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {overviewStats.totalAtivos} <span className="text-xs font-bold text-slate-500 font-sans">contratos</span>
                </h4>
                <span className="text-[10px] text-slate-500 mt-0.5 block font-semibold">
                  Valor Atualizado: <strong className="text-slate-800 font-mono">{formatCurrency(overviewStats.valorAtualizadoTotal)}</strong>
                </span>
                <span className="text-[10px] text-slate-400 block font-normal">
                  Inicial: <span className="font-mono">{formatCurrency(overviewStats.valorInicialTotal)}</span>
                </span>
              </div>
            </div>

            {/* Card 2: Vencimentos Próximos < 90 Dias */}
            <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Vencimentos &lt; 90 Dias
                </span>
                <div className="p-1.5 rounded bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {overviewStats.vencimentos90Count} <span className="text-xs font-bold text-slate-500 font-sans">em atenção</span>
                </h4>
                <span className="text-[10px] text-slate-500 mt-0.5 block font-semibold">
                  Volume: <strong className="text-slate-800 font-mono">{formatCurrency(overviewStats.vencimentos90Value)}</strong>
                </span>
                <span className="text-[10px] text-amber-700 block font-medium">
                  Atuação preventiva em andamento
                </span>
              </div>
            </div>

            {/* Card 3: Saldo Remanescente Total */}
            <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Saldo Remanescente Total
                </span>
                <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight font-mono">
                  {formatCurrency(overviewStats.saldoRemanescenteTotal)}
                </h4>
                <span className="text-[10px] text-slate-500 mt-0.5 block font-semibold">
                  Compromisso Mensal: <strong className="text-slate-800 font-mono">{formatCurrency(overviewStats.valorMensalTotal)}</strong>
                </span>
                <span className="text-[10px] text-emerald-700 block font-medium">
                  Executado: <span className="font-mono">{formatCurrency(overviewStats.valorExecutadoTotal)}</span>
                </span>
              </div>
            </div>

            {/* Card 4: Serviços Essenciais & Risco */}
            <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Serviços Essenciais
                </span>
                <div className="p-1.5 rounded bg-indigo-50 text-indigo-600">
                  <ShieldAlert className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {overviewStats.essenciaisCount} <span className="text-xs font-bold text-slate-500 font-sans">vitais</span>
                </h4>
                <span className="text-[10px] text-slate-500 mt-0.5 block font-semibold">
                  Risco Alto: <strong className="text-rose-700 font-bold">{overviewStats.riscoAltoCount} contrato(s)</strong>
                </span>
                <span className="text-[10px] text-slate-400 block font-normal">
                  Rede de {overviewStats.fornecedoresUnicos} fornecedores únicos
                </span>
              </div>
            </div>
          </div>

          {/* Gráfico Main: Horizonte de Vencimentos dos Contratos */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Horizonte de Vencimentos dos Contratos (Contratos Ativos)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Agrupamento por janelas temporais de término de vigência: &lt; 30 dias (Crítico), 31-90 dias (Urgente), 91-180 dias (Médio), 181-365 dias (1 Ano) e &gt; 1 Ano (Longo)
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartHorizonteVencimento} margin={{ top: 15, right: 20, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#475569" }} interval={0} />
                  <YAxis yAxisId="left" orientation="left" stroke="#2563eb" tick={{ fontSize: 11, fill: "#475569" }} allowDecimals={false} label={{ value: "Qtd Contratos", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#64748b" } }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#059669" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: "#475569" }} />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      if (name === "Qtd Contratos") return [`${value} contrato(s)`, name];
                      if (name === "Valor Total") return [formatCurrency(Number(value)), name];
                      return [value, name];
                    }}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar yAxisId="left" dataKey="count" name="Qtd Contratos" radius={[4, 4, 0, 0]}>
                    {chartHorizonteVencimento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Badges / Cards de Resumo de Faixa abaixo do gráfico */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
              {chartHorizonteVencimento.map((item) => (
                <div key={item.faixa} className="bg-slate-50 border border-slate-200/80 rounded p-2 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500" style={{ color: item.color }}>
                    {item.label}
                  </div>
                  <div className="text-base font-black text-slate-800 font-mono my-0.5">
                    {item.count} <span className="text-[10px] font-normal text-slate-500">contratos</span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600 font-mono truncate">
                    {formatCurrency(item.valor)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid com 2 Gráficos: Modalidade & Comparativo de Execução */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Gráfico 2: Modalidade de Contratação */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Modalidade de Contratação (Tipo)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Distribuição dos contratos ativos por modalidade licitatória (Pregão, Inexigibilidade, Dispensa, etc.)
                </p>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartModalidadeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis type="category" dataKey="modalidade" tick={{ fontSize: 11, fill: "#334155", fontWeight: 600 }} width={100} />
                    <Tooltip
                      formatter={(value: any, name: any, props: any) => {
                        const count = props.payload?.count || 0;
                        return [`${formatCurrency(Number(value))} (${count} contrato(s))`, "Valor Total"];
                      }}
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "12px" }}
                    />
                    <Bar dataKey="valor" name="Valor Atualizado" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                {chartModalidadeData.map((m) => (
                  <span key={m.modalidade} className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 font-semibold">
                    {m.modalidade}: <strong className="text-slate-900 font-mono">{m.count}</strong> ({formatCurrency(m.valor)})
                  </span>
                ))}
              </div>
            </div>

            {/* Gráfico 3: Comparativo de Execução: Valor Inicial x Valor Atualizado x Saldo Remanescente */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-800 flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-emerald-600" />
                  <span>Comparativo de Execução por Categoria</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Confronto entre Valor Inicial, Valor Atualizado (Aditivos/Reajustes) e Saldo Remanescente por Categoria
                </p>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartExecucaoPorCategoria} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="categoria" tick={{ fontSize: 10, fill: "#475569" }} />
                    <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip
                      formatter={(value: any, name: any) => [formatCurrency(Number(value)), name]}
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="valorInicial" name="Valor Inicial" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="valorAtualizado" name="Valor Atualizado" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saldoRemanescente" name="Saldo Remanescente" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center font-medium">
                <span>Total Atualizado: <strong className="text-slate-800 font-mono">{formatCurrency(overviewStats.valorAtualizadoTotal)}</strong></span>
                <span>Saldo Disponível: <strong className="text-emerald-700 font-mono">{formatCurrency(overviewStats.saldoRemanescenteTotal)}</strong></span>
              </div>
            </div>

          </div>

          {/* Tabela Resumo: Top Contratos por Valor */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Principais Contratações em Execução (Maior Valor)</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-500">Top 5 Maior Impacto Financeiro</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <th className="p-2.5">Contrato</th>
                    <th className="p-2.5">Fornecedor</th>
                    <th className="p-2.5">Categoria / Modalidade</th>
                    <th className="p-2.5">Término Vigência</th>
                    <th className="p-2.5 text-right">Valor Atualizado</th>
                    <th className="p-2.5 text-right">Saldo Remanescente</th>
                    <th className="p-2.5 text-center">Status / Risco</th>
                    <th className="p-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {topContratosAtivos.map((c) => {
                    return (
                      <tr key={c.idContrato} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-900">
                          Nº {c.numeroContrato}/{c.anoContrato}
                          <div className="text-[10px] text-slate-400 font-mono">SEI: {c.processoSEI}</div>
                        </td>
                        <td className="p-2.5 font-bold text-slate-800 max-w-[200px] truncate" title={c.fornecedor}>
                          {c.fornecedor}
                        </td>
                        <td className="p-2.5">
                          <span className="font-semibold text-slate-800">{c.categoriaContrato}</span>
                          <div className="text-[10px] text-slate-500">{c.tipoContratacao}</div>
                        </td>
                        <td className="p-2.5 font-mono font-bold">
                          {c.fimVigencia}
                          <div className="text-[10px]">{getVigenciaAlertBadge(c)}</div>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(c.valorAtualizado)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                          {formatCurrency(c.saldoContrato)}
                        </td>
                        <td className="p-2.5 text-center">
                          {getRiscoBadge(c.riscoDescontinuidade)}
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => setSelectedContractForModal(c)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer flex items-center space-x-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Ver Ficha</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB 1: PAINEL DECISÓRIO DA DIRETORIA (VENCIMENTOS & DECISÕES RÁPIDAS)                  */}
      {/* ========================================================================================= */}
      {activeSubTab === "decisoes_urgentes" && (
        <div className="space-y-4">
          
          {/* Executive Directorial KPI Header Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Vencimento Crítico < 60 Dias */}
            <div className="bg-white rounded shadow-sm border-l-4 border-rose-600 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">🚨 AÇÃO IMEDIATA (&lt; 60 DIAS)</span>
                <div className="p-1.5 rounded bg-rose-50 text-rose-600">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {stats.v60Count} <span className="text-xs font-bold text-slate-500 font-sans">contrato(s)</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Impacto: <strong className="text-slate-800 font-mono">{formatCurrency(stats.v60Value)}</strong>
                </span>
              </div>
            </div>

            {/* KPI 2: Vencimento < 90 Dias */}
            <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">⚠️ ATENÇÃO (&lt; 90 DIAS)</span>
                <div className="p-1.5 rounded bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {stats.v90Count} <span className="text-xs font-bold text-slate-500 font-sans">contrato(s)</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Atuando em tempo hábil para renovação
                </span>
              </div>
            </div>

            {/* KPI 3: Próximos Vencimentos < 180 Dias */}
            <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">⏳ PRÓXIMOS 180 DIAS</span>
                <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {stats.v180Count} <span className="text-xs font-bold text-slate-500 font-sans">contrato(s)</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Total em risco: <strong className="text-slate-800 font-mono">{formatCurrency(stats.v180Value)}</strong>
                </span>
              </div>
            </div>

            {/* KPI 4: Encaminhamento Recomendado */}
            <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">📑 ENCAMINHAMENTO TÉCNICO</span>
                <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
                  <FileCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-xs font-semibold text-slate-600 flex justify-between">
                  <span>Prorrogação (Aditivo):</span>
                  <span className="text-blue-700 font-mono font-bold">{stats.prorrogaveis180Count}</span>
                </div>
                <div className="text-xs font-semibold text-slate-600 flex justify-between">
                  <span>Nova Licitação (Edital):</span>
                  <span className="text-rose-700 font-mono font-bold">{stats.licitacao180Count}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Directorial Filter Bar for Decisions */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 shrink-0">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Filtro:</span>
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {[
                { id: "todos", label: "TODOS OS VENCIMENTOS (< 180d)", icon: Clock },
                { id: "urgente60", label: `🚨 URGENTE (< 60d: ${stats.v60Count})`, icon: Zap },
                { id: "atencao90", label: `⚠️ ATENÇÃO (< 90d: ${stats.v90Count})`, icon: AlertTriangle },
                { id: "aditivo", label: `📑 PRORROGÁVEIS (${stats.prorrogaveis180Count})`, icon: FileCheck },
                { id: "licitacao", label: `⚖️ NOVA LICITAÇÃO (${stats.licitacao180Count})`, icon: Scale },
                { id: "essencial_risco", label: "🛡️ ESSENCIAIS EM RISCO", icon: ShieldAlert }
              ].map((btn) => {
                const Icon = btn.icon;
                const isSel = decisaoFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setDecisaoFilter(btn.id as any)}
                    className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center space-x-1 ${
                      isSel
                        ? "bg-[#1e3a8a] text-white shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Cards Grid: Expedited Decision Cards for Board */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Painel de Vencimentos ({decisaoPanelContracts.length} contratos)</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Ordens ordenadas por urgência do prazo legal de vencimento
              </span>
            </div>

            {decisaoPanelContracts.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs font-medium">
                Nenhum contrato ativo encontrado no filtro selecionado.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {decisaoPanelContracts.map((c) => {
                  const days = getDaysRemaining(c.fimVigencia);
                  const isCritical = days <= 60;
                  const isUrgent = days <= 90;
                  const decisionRecord = decisoesTomadas[c.idContrato];

                  return (
                    <div
                      key={c.idContrato}
                      className={`bg-white rounded-xl border p-4 shadow-xs transition-all space-y-3 ${
                        isCritical
                          ? "border-rose-300 bg-rose-50/20"
                          : isUrgent
                          ? "border-amber-200 bg-amber-50/10"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Top Row: Identification, Badges & Days remaining */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-xs font-black bg-blue-900 text-white font-mono">
                            Nº {c.numeroContrato}/{c.anoContrato}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">SEI: {c.processoSEI}</span>
                          <span className="text-xs font-bold text-slate-800">| {c.categoriaContrato}</span>
                          {c.servicoEssencial && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Serviço Essencial
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {getVigenciaAlertBadge(c)}
                          {getRiscoBadge(c.riscoDescontinuidade)}
                          <button
                            onClick={() => setSelectedContractForModal(c)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Ver Ficha</span>
                          </button>
                        </div>
                      </div>

                      {/* Middle Grid: Provider, Object, Expiration & Financials */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                        {/* Column 1: Provider & Object */}
                        <div className="md:col-span-2 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Empresa Contratada / Objeto</div>
                          <div className="font-black text-slate-900 text-sm">{c.fornecedor}</div>
                          <div className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                            {c.objetoContrato}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">CNPJ: {c.cnpjFornecedor}</div>
                        </div>

                        {/* Column 2: Financial Numbers */}
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Valores & Saldo</div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Valor Atualizado:</span>
                            <strong className="font-mono text-blue-900">{formatCurrency(c.valorAtualizado)}</strong>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Mensalidade:</span>
                            <strong className="font-mono text-slate-800">{c.valorMensal ? formatCurrency(c.valorMensal) : "Sob demanda"}</strong>
                          </div>
                          <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-1">
                            <span className="text-slate-500">Saldo Restante:</span>
                            <strong className="font-mono text-emerald-700">{formatCurrency(c.saldoContrato)}</strong>
                          </div>
                        </div>

                        {/* Column 3: Expiration Dates & Responsibles */}
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Prazos & Governança</div>
                          <div className="text-[11px] text-slate-700">
                            Vigência: <strong>{c.inicioVigencia}</strong> a <strong className="text-blue-900 font-mono">{c.fimVigencia}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700">
                            Gestor: <strong className="text-blue-900">{c.gestorContrato}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700">
                            Fiscal: <strong className="text-slate-800">{c.fiscalContrato}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Charts Section: Timeline and Encaminhamentos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart 1: Projeção de Vencimentos */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Projeção de Vencimentos Contratuais e Quantitativos</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-bold">Distribuição Temporal</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartSemestreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="semestre" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: number, name: string) => [val, name === "aditivos" ? "Termos Aditivos" : "Novas Licitações"]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="aditivos" name="Prorrogação via Aditivo" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="licitacoes" name="Nova Licitação Necessária" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Distribution Pie */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-800 flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-indigo-600" />
                  <span>Distribuição de Encaminhamentos (&lt; 180d)</span>
                </h4>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartRouteData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {chartRouteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB: GESTORES & FISCAIS                                                                 */}
      {/* ========================================================================================= */}
      {activeSubTab === "gestores_fiscais" && (
        <div className="space-y-4">
          
          {/* Executive Summary Cards for Gestores & Fiscais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Gestores */}
            <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">GESTORES DE CONTRATOS</span>
                <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                  <UserCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {gestoresSummary.length} <span className="text-xs font-bold text-slate-500 font-sans">servidores</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Gestão técnica de {stats.totalAtivos} contratos ativos
                </span>
              </div>
            </div>

            {/* KPI 2: Total Fiscais */}
            <div className="bg-white rounded shadow-sm border-l-4 border-indigo-500 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">FISCAIS DE CONTRATOS</span>
                <div className="p-1.5 rounded bg-indigo-50 text-indigo-600">
                  <UserCog className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {fiscaisSummary.length} <span className="text-xs font-bold text-slate-500 font-sans">servidores</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Acompanhamento de execução e faturamento
                </span>
              </div>
            </div>

            {/* KPI 3: Maior Carga (Gestão) */}
            <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">MAIOR CARGA (GESTOR)</span>
                <div className="p-1.5 rounded bg-amber-50 text-amber-600">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-black text-slate-800 truncate" title={gestoresSummary[0]?.nome}>
                  {gestoresSummary[0]?.nome || "N/A"}
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  <strong className="text-slate-800 font-mono">{gestoresSummary[0]?.ativosCount || 0}</strong> contrato(s) | <strong className="font-mono">{formatCurrency(gestoresSummary[0]?.valorTotal || 0)}</strong>
                </span>
              </div>
            </div>

            {/* KPI 4: Vencimentos sob Responsabilidade */}
            <div className="bg-white rounded shadow-sm border-l-4 border-rose-500 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ATENÇÃO A VENCIMENTOS</span>
                <div className="p-1.5 rounded bg-rose-50 text-rose-600">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-black text-slate-800 tracking-tight">
                  {stats.v180Count} <span className="text-xs font-bold text-slate-500 font-sans">contratos em &lt; 180d</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Atuação preventiva dos gestores designados
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Filter & View Switcher Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* View switcher buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setGestorFiscalViewMode("gestores")}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center space-x-1.5 ${
                  gestorFiscalViewMode === "gestores"
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Visão por Gestor ({gestoresSummary.length})</span>
              </button>

              <button
                onClick={() => setGestorFiscalViewMode("fiscais")}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center space-x-1.5 ${
                  gestorFiscalViewMode === "fiscais"
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Visão por Fiscal ({fiscaisSummary.length})</span>
              </button>

              <button
                onClick={() => setGestorFiscalViewMode("tabela")}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center space-x-1.5 ${
                  gestorFiscalViewMode === "tabela"
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Matriz Completa de Atribuições</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por gestor, fiscal ou contrato..."
                value={gestorFiscalSearch}
                onChange={(e) => setGestorFiscalSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
              />
              {gestorFiscalSearch && (
                <button onClick={() => setGestorFiscalSearch("")} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* VIEW MODE 1: VISÃO POR GESTOR */}
          {gestorFiscalViewMode === "gestores" && (
            <div className="space-y-4">
              {gestoresSummary
                .filter((g) => {
                  if (!gestorFiscalSearch) return true;
                  const search = gestorFiscalSearch.toLowerCase();
                  return (
                    g.nome.toLowerCase().includes(search) ||
                    g.contratos.some(
                      (c) =>
                        c.numeroContrato.toString().includes(search) ||
                        c.fornecedor.toLowerCase().includes(search) ||
                        c.categoriaContrato.toLowerCase().includes(search)
                    )
                  );
                })
                .map((g) => (
                  <div key={g.nome} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                    {/* Header for Gestor */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 font-black">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{g.nome}</div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            Gestor responsável por <strong className="text-slate-800">{g.ativosCount}</strong> contrato(s) ativo(s)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-xs">
                        {g.vencimentoUrgente > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            ⚠️ {g.vencimentoUrgente} contrato(s) expira(m) em &lt; 180d
                          </span>
                        )}
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Volume sob Gestão</span>
                          <strong className="font-mono text-blue-900 text-sm">{formatCurrency(g.valorTotal)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Table of Contracts for this Gestor */}
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                            <th className="p-2">Contrato / Ano</th>
                            <th className="p-2">Fornecedor</th>
                            <th className="p-2">Categoria</th>
                            <th className="p-2">Fiscal Responsável</th>
                            <th className="p-2">Vigência & Alerta</th>
                            <th className="p-2 text-right">Valor Atualizado</th>
                            <th className="p-2 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                          {g.contratos.map((c) => (
                            <tr key={c.idContrato} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2 font-bold text-slate-800 font-mono">
                                Nº {c.numeroContrato}/{c.anoContrato}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{c.fornecedor}</td>
                              <td className="p-2 text-slate-600">{c.categoriaContrato}</td>
                              <td className="p-2 text-slate-800 font-semibold">{c.fiscalContrato}</td>
                              <td className="p-2">
                                <div className="text-[11px] font-mono">{c.fimVigencia}</div>
                                {getVigenciaAlertBadge(c)}
                              </td>
                              <td className="p-2 text-right font-mono font-bold text-blue-900">
                                {formatCurrency(c.valorAtualizado)}
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  onClick={() => setSelectedContractForModal(c)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Ficha
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* VIEW MODE 2: VISÃO POR FISCAL */}
          {gestorFiscalViewMode === "fiscais" && (
            <div className="space-y-4">
              {fiscaisSummary
                .filter((f) => {
                  if (!gestorFiscalSearch) return true;
                  const search = gestorFiscalSearch.toLowerCase();
                  return (
                    f.nome.toLowerCase().includes(search) ||
                    f.contratos.some(
                      (c) =>
                        c.numeroContrato.toString().includes(search) ||
                        c.fornecedor.toLowerCase().includes(search) ||
                        c.categoriaContrato.toLowerCase().includes(search)
                    )
                  );
                })
                .map((f) => (
                  <div key={f.nome} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                    {/* Header for Fiscal */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200 font-black">
                          <UserCog className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{f.nome}</div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            Fiscal responsável por inspecionar <strong className="text-slate-800">{f.ativosCount}</strong> contrato(s) ativo(s)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-xs">
                        {f.vencimentoUrgente > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            ⚠️ {f.vencimentoUrgente} contrato(s) expira(m) em &lt; 180d
                          </span>
                        )}
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Volume Fiscalizado</span>
                          <strong className="font-mono text-indigo-900 text-sm">{formatCurrency(f.valorTotal)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Table of Contracts for this Fiscal */}
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                            <th className="p-2">Contrato / Ano</th>
                            <th className="p-2">Fornecedor</th>
                            <th className="p-2">Categoria</th>
                            <th className="p-2">Gestor Responsável</th>
                            <th className="p-2">Vigência & Alerta</th>
                            <th className="p-2 text-right">Valor Atualizado</th>
                            <th className="p-2 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                          {f.contratos.map((c) => (
                            <tr key={c.idContrato} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2 font-bold text-slate-800 font-mono">
                                Nº {c.numeroContrato}/{c.anoContrato}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{c.fornecedor}</td>
                              <td className="p-2 text-slate-600">{c.categoriaContrato}</td>
                              <td className="p-2 text-slate-800 font-semibold">{c.gestorContrato}</td>
                              <td className="p-2">
                                <div className="text-[11px] font-mono">{c.fimVigencia}</div>
                                {getVigenciaAlertBadge(c)}
                              </td>
                              <td className="p-2 text-right font-mono font-bold text-indigo-900">
                                {formatCurrency(c.valorAtualizado)}
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  onClick={() => setSelectedContractForModal(c)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Ficha
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* VIEW MODE 3: TABELA GERAL DE ATRIBUIÇÕES */}
          {gestorFiscalViewMode === "tabela" && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Matriz Geral de Responsabilidade Técnica (Gestão & Fiscalização)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  {contratosData.filter((c) => c.statusContrato === "Ativo").length} contratos ativos
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                      <th className="p-2.5">Contrato</th>
                      <th className="p-2.5">Empresa Contratada</th>
                      <th className="p-2.5">Gestor do Contrato</th>
                      <th className="p-2.5">Fiscal do Contrato</th>
                      <th className="p-2.5">Término Vigência</th>
                      <th className="p-2.5 text-right">Valor Atualizado</th>
                      <th className="p-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                    {contratosData
                      .filter((c) => {
                        if (!gestorFiscalSearch) return true;
                        const search = gestorFiscalSearch.toLowerCase();
                        return (
                          c.gestorContrato.toLowerCase().includes(search) ||
                          c.fiscalContrato.toLowerCase().includes(search) ||
                          c.fornecedor.toLowerCase().includes(search) ||
                          c.numeroContrato.toString().includes(search)
                        );
                      })
                      .map((c) => (
                        <tr key={c.idContrato} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-800 font-mono">
                            Nº {c.numeroContrato}/{c.anoContrato}
                            <div className="text-[10px] font-sans text-slate-400">{c.categoriaContrato}</div>
                          </td>
                          <td className="p-2.5 font-bold text-slate-900">{c.fornecedor}</td>
                          <td className="p-2.5 font-black text-blue-900">{c.gestorContrato}</td>
                          <td className="p-2.5 font-bold text-slate-800">{c.fiscalContrato}</td>
                          <td className="p-2.5 font-mono">
                            {c.fimVigencia}
                            <div>{getVigenciaAlertBadge(c)}</div>
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                            {formatCurrency(c.valorAtualizado)}
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => setSelectedContractForModal(c)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                            >
                              Ver Ficha
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB 3: TODOS OS CONTRATOS (LISTAGEM OPERACIONAL & FILTROS COMPLETOS)                   */}
      {/* ========================================================================================= */}
      {activeSubTab === "todos_contratos" && (
        <div className="space-y-4">
          
          {/* FILTER BAR FOR FULL LIST */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filtros de Pesquisa Operacional</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Exibindo <strong className="text-slate-900">{filteredContracts.length}</strong> de <strong className="text-slate-900">{contratosData.length}</strong> registros
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {/* Search box */}
              <div className="relative col-span-1 sm:col-span-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar contrato, SEI, fornecedor, gestor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-600"
                >
                  <option value="todos">Status: Todos</option>
                  <option value="Ativo">Status: Ativos</option>
                  <option value="Suspenso">Status: Suspensos</option>
                  <option value="Encerrado">Status: Encerrados</option>
                </select>
              </div>

              {/* Categoria filter */}
              <div>
                <select
                  value={categoriaFilter}
                  onChange={(e) => setCategoriaFilter(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-600"
                >
                  <option value="todos">Categoria: Todas</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Risco filter */}
              <div>
                <select
                  value={riscoFilter}
                  onChange={(e) => setRiscoFilter(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-600"
                >
                  <option value="todos">Risco: Todos</option>
                  <option value="Alto">Risco: Alto</option>
                  <option value="Médio">Risco: Médio</option>
                  <option value="Baixo">Risco: Baixo</option>
                </select>
              </div>

              {/* Essencial filter */}
              <div className="flex items-center space-x-1">
                <select
                  value={essencialFilter}
                  onChange={(e) => setEssencialFilter(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-600"
                >
                  <option value="todos">Essencialidade: Todas</option>
                  <option value="sim">Serviço Essencial (Sim)</option>
                  <option value="nao">Não Essencial (Não)</option>
                </select>

                {(searchTerm || statusFilter !== "todos" || categoriaFilter !== "todos" || riscoFilter !== "todos" || essencialFilter !== "todos") && (
                  <button
                    onClick={handleResetFilters}
                    title="Limpar filtros"
                    className="p-1.5 bg-rose-50 text-rose-700 rounded hover:bg-rose-100 border border-rose-200 shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABLE OF CONTRACTS */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <th className="p-2.5">Contrato / SEI</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Categoria</th>
                    <th className="p-2.5">Modalidade</th>
                    <th className="p-2.5">Fornecedor</th>
                    <th className="p-2.5 text-right">Valor Inicial</th>
                    <th className="p-2.5 text-right">Valor Atualizado</th>
                    <th className="p-2.5 text-right">Saldo Restante</th>
                    <th className="p-2.5">Vigência & Alerta</th>
                    <th className="p-2.5 text-center">Risco</th>
                    <th className="p-2.5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {filteredContracts.map((c) => (
                    <tr key={c.idContrato} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-900">
                        Nº {c.numeroContrato}/{c.anoContrato}
                        <div className="text-[10px] text-slate-400 font-mono font-normal">{c.processoSEI}</div>
                      </td>
                      <td className="p-2.5">{getStatusBadge(c.statusContrato)}</td>
                      <td className="p-2.5 font-bold text-slate-800">{c.categoriaContrato}</td>
                      <td className="p-2.5 text-slate-600">{c.tipoContratacao}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-800">{c.fornecedor}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.cnpjFornecedor}</div>
                      </td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-700">
                        {formatCurrency(c.valorInicialContrato)}
                      </td>
                      <td className="p-2.5 text-right font-mono font-black text-blue-900">
                        {formatCurrency(c.valorAtualizado)}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                        {formatCurrency(c.saldoContrato)}
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-600">
                        <div className="font-semibold text-slate-800">{c.inicioVigencia} até <strong>{c.fimVigencia}</strong></div>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {getVigenciaAlertBadge(c)}
                          {c.possibilidadeProrrogacao ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              Prorrogável
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              Nova Licitação
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2.5 text-center">{getRiscoBadge(c.riscoDescontinuidade)}</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setSelectedContractForModal(c)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB 4: COMPARADOR DE CONTRATOS (UNCHANGED EXACTLY AS REQUESTED)                        */}
      {/* ========================================================================================= */}
      {activeSubTab === "comparador" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
              <div>
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                  <span>Comparador de Contratos Lado a Lado</span>
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Selecione até 4 contratos para analisar valores, prazos e responsabilidades simultaneamente.</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {contratosData.map((c) => {
                  const isSelected = comparedIds.includes(c.idContrato);
                  return (
                    <button
                      key={c.idContrato}
                      onClick={() => handleToggleCompare(c.idContrato)}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all border ${
                        isSelected
                          ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}Nº {c.numeroContrato}/{c.anoContrato}
                    </button>
                  );
                })}
              </div>
            </div>

            {comparedContracts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs">
                Nenhum contrato selecionado para comparação. Clique nos botões acima para adicionar.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                      <th className="p-3 w-40">Métrica / Atributo</th>
                      {comparedContracts.map((c) => (
                        <th key={c.idContrato} className="p-3 text-center min-w-[200px] border-l border-slate-200 bg-blue-50/50">
                          <div className="font-black text-slate-900 text-xs">Contrato {c.numeroContrato}/{c.anoContrato}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{c.categoriaContrato}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Status</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100">
                          {getStatusBadge(c.statusContrato)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Fornecedor</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100 font-bold text-slate-900">
                          {c.fornecedor}
                          <div className="text-[10px] text-slate-400 font-mono font-normal">{c.cnpjFornecedor}</div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Valor Inicial</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100 font-mono font-bold">
                          {formatCurrency(c.valorInicialContrato)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Valor Atualizado</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100 font-mono font-black text-blue-900">
                          {formatCurrency(c.valorAtualizado)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Saldo Restante</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100 font-mono font-bold text-emerald-700">
                          {formatCurrency(c.saldoContrato)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Valor Mensal</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100 font-mono">
                          {c.valorMensal ? formatCurrency(c.valorMensal) : "Sob Demanda / Única"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Vigência</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100">
                          <div className="font-bold text-slate-800">{c.inicioVigencia} até {c.fimVigencia}</div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Reajuste</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100 font-bold">
                          {c.possuiReajuste ? (
                            <span className="text-blue-700">Sim ({c.indiceReajuste})</span>
                          ) : (
                            <span className="text-slate-400">Não possui</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Gestor / Fiscal</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100 text-[11px]">
                          <div>Gestor: <strong className="text-blue-900">{c.gestorContrato}</strong></div>
                          <div>Fiscal: <strong className="text-slate-700">{c.fiscalContrato}</strong></div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL DETALHES DO CONTRATO                                                                */}
      {/* ========================================================================================= */}
      {selectedContractForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="bg-[#1e3a8a] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    Ficha Técnica do Contrato Nº {selectedContractForModal.numeroContrato}/{selectedContractForModal.anoContrato}
                  </h3>
                  <p className="text-[11px] text-blue-200 font-mono">Processo SEI: {selectedContractForModal.processoSEI}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContractForModal(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Top Banner Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                  <div className="mt-0.5">{getStatusBadge(selectedContractForModal.statusContrato)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Categoria</span>
                  <span className="font-bold text-slate-800">{selectedContractForModal.categoriaContrato}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Modalidade</span>
                  <span className="font-bold text-slate-800">{selectedContractForModal.tipoContratacao} Nº {selectedContractForModal.numeroLicitacao}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Risco Operacional</span>
                  <div className="mt-0.5">{getRiscoBadge(selectedContractForModal.riscoDescontinuidade)}</div>
                </div>
              </div>

              {/* Fornecedor Details */}
              <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dados da Empresa Contratada (Fornecedor)</span>
                </div>
                <div className="text-sm font-black text-slate-900">{selectedContractForModal.fornecedor}</div>
                <div className="text-xs text-slate-600 font-mono">CNPJ: {selectedContractForModal.cnpjFornecedor}</div>
              </div>

              {/* Valores & Financeiro */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resumo Financeiro e Saldos Contratuais</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Valor Inicial</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{formatCurrency(selectedContractForModal.valorInicialContrato)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Valor Atualizado</span>
                    <span className="font-mono font-black text-blue-900 text-sm">{formatCurrency(selectedContractForModal.valorAtualizado)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Saldo Restante</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{formatCurrency(selectedContractForModal.saldoContrato)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Recorrência Mensal</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {selectedContractForModal.valorMensal ? formatCurrency(selectedContractForModal.valorMensal) : "N/A (Sob Demanda)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vigência e Reajustes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prazos de Vigência</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <div>Início: <strong>{selectedContractForModal.inicioVigencia}</strong></div>
                    <div>Término: <strong className="text-blue-700">{selectedContractForModal.fimVigencia}</strong></div>
                    <div className="mt-1 pt-1 border-t border-slate-100 text-[11px]">
                      Prorrogável: {selectedContractForModal.possibilidadeProrrogacao ? <span className="text-emerald-700 font-bold">Sim</span> : <span className="text-rose-700 font-bold">Não</span>}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cláusula de Reajuste</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <div>Possui Reajuste: <strong>{selectedContractForModal.possuiReajuste ? "Sim" : "Não"}</strong></div>
                    <div>Índice Aplicado: <strong className="text-blue-700">{selectedContractForModal.indiceReajuste || "Nenhum"}</strong></div>
                    <div className="mt-1 pt-1 border-t border-slate-100 text-[11px]">
                      Nova Licitação Exigida: {selectedContractForModal.necessitaNovaContratacao ? <span className="text-rose-700 font-bold">Sim (Processo Necessário)</span> : <span className="text-slate-500">Não</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gestão e Fiscalização */}
              <div className="p-3 rounded-xl border border-slate-200 bg-blue-50/30 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  <span>Responsáveis Internos (Governança)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Gestor do Contrato: <strong className="text-blue-900">{selectedContractForModal.gestorContrato}</strong></div>
                  <div>Fiscal do Contrato: <strong className="text-slate-800">{selectedContractForModal.fiscalContrato}</strong></div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedContractForModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-xs transition-all cursor-pointer"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
