import React, { useState, useMemo } from "react";
import { contratosData, Contrato } from "../data_contratos";
import { formatCurrency, formatNumber, formatPercentRaw } from "../utils";
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
  ChevronRight,
  Info,
  X,
  Briefcase,
  UserCheck,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Building2,
  Check,
  SlidersHorizontal,
  Maximize2,
  HelpCircle,
  ShieldCheck,
  Plus,
  Building,
  User,
  Bell,
  FileCheck,
  Zap,
  CalendarDays,
  Hourglass
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

type SubTab = "visao_geral" | "cronograma" | "governanca" | "comparador" | "lista_completa";

export const ContratosTab: React.FC<ContratosTabProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("visao_geral");

  // Filters state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todos");
  const [riscoFilter, setRiscoFilter] = useState<string>("todos");
  const [essencialFilter, setEssencialFilter] = useState<string>("todos");
  const [modalidadeFilter, setModalidadeFilter] = useState<string>("todos");

  // Sub-filter for Vigências & Prazos
  const [vigenciaFilter, setVigenciaFilter] = useState<"todos" | "urgentes" | "ate90" | "ate60" | "aditivos" | "licitacoes" | "reajustes">("todos");

  // Selection state for Comparator & Modal
  const [selectedContractForModal, setSelectedContractForModal] = useState<Contrato | null>(null);
  const [comparedIds, setComparedIds] = useState<string[]>(["202201", "202302", "202307"]);

  // Helper to calculate days remaining until expiration (Reference: 2026-08-06)
  const getDaysRemaining = (endDateStr: string) => {
    if (!endDateStr) return 0;
    const today = new Date(2026, 7, 6);
    const [year, month, day] = endDateStr.split("-").map(Number);
    const endDate = new Date(year, month - 1, day);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper to calculate total duration in days between start and end
  const getTotalDurationDays = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return 365;
    const [sY, sM, sD] = startDateStr.split("-").map(Number);
    const [eY, eM, eD] = endDateStr.split("-").map(Number);
    const start = new Date(sY, sM - 1, sD);
    const end = new Date(eY, eM - 1, eD);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setCategoriaFilter("todos");
    setRiscoFilter("todos");
    setEssencialFilter("todos");
    setModalidadeFilter("todos");
    setVigenciaFilter("todos");
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

  // Filtered Contracts
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

  // General Calculations & KPIs
  const stats = useMemo(() => {
    const totalContratos = contratosData.length;
    const ativos = contratosData.filter((c) => c.statusContrato === "Ativo");
    const encerrados = contratosData.filter((c) => c.statusContrato === "Encerrado");
    const suspensos = contratosData.filter((c) => c.statusContrato === "Suspenso");

    const valorTotalAtualizadoGeral = contratosData.reduce((acc, c) => acc + c.valorAtualizado, 0);
    const valorAtualizadoAtivos = ativos.reduce((acc, c) => acc + c.valorAtualizado, 0);
    const valorInicialAtivos = ativos.reduce((acc, c) => acc + c.valorInicialContrato, 0);

    const saldoRemanescenteAtivos = ativos.reduce((acc, c) => acc + c.saldoContrato, 0);
    const valorExecutadoAtivos = valorAtualizadoAtivos - saldoRemanescenteAtivos;
    const pctExecucaoAtivos = valorAtualizadoAtivos > 0 ? (valorExecutadoAtivos / valorAtualizadoAtivos) * 100 : 0;

    const valorMensalRecorrenteTotal = ativos.reduce((acc, c) => acc + (c.valorMensal || 0), 0);

    const riscoAltoEssencialCount = ativos.filter((c) => c.riscoDescontinuidade === "Alto" && c.servicoEssencial).length;
    const necessitaNovaLicitacaoCount = ativos.filter((c) => c.necessitaNovaContratacao === true || c.possibilidadeProrrogacao === false).length;

    return {
      totalContratos,
      countAtivos: ativos.length,
      countEncerrados: encerrados.length,
      countSuspensos: suspensos.length,
      valorTotalAtualizadoGeral,
      valorAtualizadoAtivos,
      valorInicialAtivos,
      saldoRemanescenteAtivos,
      valorExecutadoAtivos,
      pctExecucaoAtivos,
      valorMensalRecorrenteTotal,
      riscoAltoEssencialCount,
      necessitaNovaLicitacaoCount
    };
  }, []);

  // Vigência-specific metrics & stats for Gestores
  const vigenciaStats = useMemo(() => {
    const ativos = contratosData.filter((c) => c.statusContrato === "Ativo");

    const urgentesCriticos = ativos.filter((c) => {
      const days = getDaysRemaining(c.fimVigencia);
      return days >= 0 && days <= 90;
    });

    const proximosVencimentos = ativos.filter((c) => {
      const days = getDaysRemaining(c.fimVigencia);
      return days >= 0 && days <= 180;
    });

    const vencimento90 = ativos.filter((c) => {
      const days = getDaysRemaining(c.fimVigencia);
      return days >= 0 && days <= 90;
    });

    const vencimento60 = ativos.filter((c) => {
      const days = getDaysRemaining(c.fimVigencia);
      return days >= 0 && days <= 60;
    });

    const devemSerAditivados = ativos.filter((c) => c.possibilidadeProrrogacao === true);

    const devemLicitar = ativos.filter((c) => c.necessitaNovaContratacao === true || c.possibilidadeProrrogacao === false);

    const comReajuste = ativos.filter((c) => c.possuiReajuste === true);

    return {
      totalAtivos: ativos.length,
      urgentesCriticosCount: urgentesCriticos.length,
      proximosVencimentosCount: proximosVencimentos.length,
      vencimento90Count: vencimento90.length,
      vencimento60Count: vencimento60.length,
      devemSerAditivadosCount: devemSerAditivados.length,
      devemLicitarCount: devemLicitar.length,
      comReajusteCount: comReajuste.length
    };
  }, []);

  // Chart Data: Vencimentos por Semestre (Projeção)
  const chartVencimentosData = useMemo(() => {
    const map: Record<string, { periodo: string; aditivos: number; licitacoes: number }> = {};
    contratosData
      .filter((c) => c.statusContrato === "Ativo")
      .forEach((c) => {
        const [year, month] = c.fimVigencia.split("-");
        const sem = Number(month) <= 6 ? "1º Sem" : "2º Sem";
        const key = `${year} (${sem})`;

        if (!map[key]) {
          map[key] = { periodo: key, aditivos: 0, licitacoes: 0 };
        }

        if (c.possibilidadeProrrogacao === true) {
          map[key].aditivos += 1;
        } else {
          map[key].licitacoes += 1;
        }
      });

    return Object.values(map).sort((a, b) => a.periodo.localeCompare(b.periodo));
  }, []);

  // Filtered List for Vigências & Prazos
  const vigenciaFilteredContracts = useMemo(() => {
    const base = activeSubTab === "cronograma" ? contratosData : filteredContracts;
    return base.filter((c) => {
      const days = getDaysRemaining(c.fimVigencia);
      const isAtivo = c.statusContrato === "Ativo";

      if (vigenciaFilter === "urgentes") {
        return isAtivo && days >= 0 && days <= 180;
      }
      if (vigenciaFilter === "ate90") {
        return isAtivo && days >= 0 && days <= 90;
      }
      if (vigenciaFilter === "ate60") {
        return isAtivo && days >= 0 && days <= 60;
      }
      if (vigenciaFilter === "aditivos") {
        return isAtivo && c.possibilidadeProrrogacao === true;
      }
      if (vigenciaFilter === "licitacoes") {
        return isAtivo && (c.necessitaNovaContratacao === true || c.possibilidadeProrrogacao === false);
      }
      if (vigenciaFilter === "reajustes") {
        return isAtivo && c.possuiReajuste === true;
      }
      return true;
    });
  }, [filteredContracts, vigenciaFilter, activeSubTab]);

  // Chart Data: Categorias
  const chartCategoryData = useMemo(() => {
    const map: Record<string, { categoria: string; valorAtualizado: number; saldo: number; qtd: number }> = {};
    contratosData.forEach((c) => {
      if (!map[c.categoriaContrato]) {
        map[c.categoriaContrato] = { categoria: c.categoriaContrato, valorAtualizado: 0, saldo: 0, qtd: 0 };
      }
      map[c.categoriaContrato].valorAtualizado += c.valorAtualizado;
      map[c.categoriaContrato].saldo += c.saldoContrato;
      map[c.categoriaContrato].qtd += 1;
    });
    return Object.values(map).sort((a, b) => b.valorAtualizado - a.valorAtualizado);
  }, []);

  // Chart Data: Riscos
  const chartRiscoData = useMemo(() => {
    const map: Record<string, number> = { Alto: 0, Médio: 0, Baixo: 0 };
    contratosData.filter((c) => c.statusContrato === "Ativo").forEach((c) => {
      map[c.riscoDescontinuidade] = (map[c.riscoDescontinuidade] || 0) + 1;
    });
    return [
      { name: "Alto Risco", value: map["Alto"], color: "#e11d48" },
      { name: "Médio Risco", value: map["Médio"], color: "#f59e0b" },
      { name: "Baixo Risco", value: map["Baixo"], color: "#10b981" }
    ];
  }, []);

  // Chart Data: Modalidades
  const chartModalidadeData = useMemo(() => {
    const map: Record<string, number> = {};
    contratosData.forEach((c) => {
      map[c.tipoContratacao] = (map[c.tipoContratacao] || 0) + 1;
    });
    const colors: Record<string, string> = {
      Pregão: "#1e3a8a",
      Dispensa: "#8b5cf6",
      Inexigibilidade: "#10b981"
    };
    return Object.entries(map).map(([key, val]) => ({
      name: key,
      value: val,
      color: colors[key] || "#64748b"
    }));
  }, []);

  // Toggle comparison selection
  const handleToggleCompare = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 4) {
        alert("Você pode comparar no máximo 4 contratos simultaneamente.");
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const comparedContracts = useMemo(() => {
    return contratosData.filter((c) => comparedIds.includes(c.idContrato));
  }, [comparedIds]);

  // Standard Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
            Ativo
          </span>
        );
      case "Encerrado":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
            Encerrado
          </span>
        );
      case "Suspenso":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5"></span>
            Suspenso
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getRiscoBadge = (risco: string) => {
    switch (risco) {
      case "Alto":
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">Alto Risco</span>;
      case "Médio":
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Médio Risco</span>;
      case "Baixo":
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Baixo Risco</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{risco}</span>;
    }
  };

  const getVigenciaAlertBadge = (c: Contrato) => {
    if (c.statusContrato !== "Ativo") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          Inativo / Encerrado
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
          🚨 Vence em {days}d (Crítico)
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
        Em dia ({days}d)
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 1. SUB-NAVIGATION SELECTOR BAR (INVESTIMENTOS / TITULOS STANDARD) */}
      <div className="bg-white rounded shadow-xs border border-slate-200 p-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "visao_geral", label: "VISÃO GERAL & KPIS", icon: BarChart3 },
            { id: "cronograma", label: "VIGÊNCIAS & PRAZOS", icon: Calendar },
            { id: "governanca", label: "GOVERNANÇA & RISCOS", icon: ShieldAlert },
            { id: "comparador", label: `COMPARADOR (${comparedIds.length})`, icon: ArrowRightLeft },
            { id: "lista_completa", label: `TODOS OS CONTRATOS (${stats.totalContratos})`, icon: Layers }
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

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-semibold px-2">
          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>Maringá Previdência • Gestão de Contratos Administrativos e Previdenciários</span>
        </div>
      </div>

      {/* 2. TOP KPI CARDS ROW (STANDARD BORDER-L-4 FORMAT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: CONTRATOS ATIVOS & VALOR ATUALIZADO */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contratos Ativos (Global)</span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {formatCurrency(stats.valorAtualizadoAtivos)}
            </h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              <strong className="text-blue-700">{stats.countAtivos} ativos</strong> de {stats.totalContratos} contratados em carteira
            </span>
          </div>
        </div>

        {/* KPI 2: SALDO REMANESCENTE */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Saldo Remanescente</span>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-emerald-700 tracking-tight">
              {formatCurrency(stats.saldoRemanescenteAtivos)}
            </h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Executado: <strong className="text-slate-700">{formatPercentRaw(stats.pctExecucaoAtivos, 1)}</strong> do limite contratual
            </span>
          </div>
        </div>

        {/* KPI 3: COMPROMETIMENTO MENSAL RECORRENTE */}
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Despesa Mensal Recorrente</span>
            <div className="p-1.5 rounded bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-amber-700 tracking-tight">
              {formatCurrency(stats.valorMensalRecorrenteTotal)}
            </h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Comprometimento mensal fixo dos contratos
            </span>
          </div>
        </div>

        {/* KPI 4: ALTO RISCO & SERVIÇOS ESSENCIAIS */}
        <div className="bg-white rounded shadow-sm border-l-4 border-rose-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Alto Risco / Essencial</span>
            <div className="p-1.5 rounded bg-rose-50 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-rose-700 tracking-tight">
              {stats.riscoAltoEssencialCount} Contratos
            </h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Atuária, Jurídico e Consultorias Críticas
            </span>
          </div>
        </div>

      </div>

      {/* 3. FILTER BAR (COMMONS ACROSS SUBTABS EXCEPT VIGÊNCIAS & PRAZOS) */}
      {activeSubTab !== "cronograma" && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filtros de Pesquisa & Seleção</span>
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
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB 1: VISÃO GERAL                                                                   */}
      {/* ========================================================================================= */}
      {activeSubTab === "visao_geral" && (
        <div className="space-y-4">
          
          {/* SEMÁFOROS E PAINÉIS DE ALERTAS (TITULOS STANDARD FORMAT) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* SEMÁFORO 1: VIGÊNCIAS & NOVAS LICITAÇÕES */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-amber-400"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">Novas Licitações Exigidas</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-black border bg-amber-50 text-amber-700 border-amber-200">
                  {stats.necessitaNovaLicitacaoCount} Contratos
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {contratosData
                  .filter((c) => c.statusContrato === "Ativo" && (c.necessitaNovaContratacao || c.possibilidadeProrrogacao === false))
                  .map((c) => (
                    <div
                      key={c.idContrato}
                      onClick={() => setSelectedContractForModal(c)}
                      className="p-2 bg-slate-50 rounded border border-slate-200 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800">Contrato {c.numeroContrato}/{c.anoContrato} ({c.fornecedor})</div>
                        <div className="text-[10px] text-slate-500">Término: <strong className="text-amber-700">{c.fimVigencia}</strong> • {c.categoriaContrato}</div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded">
                        Novo SEI
                      </span>
                    </div>
                  ))}
              </div>

              <p className="text-[10px] text-slate-400 italic font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400 shrink-0" />
                Sem possibilidade de aditivo de tempo. Abertura obrigatória de certame.
              </p>
            </div>

            {/* SEMÁFORO 2: SERVIÇOS ESSENCIAIS DE ALTO RISCO */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-400"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                  </span>
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">Risco Operacional Essencial</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-black border bg-rose-50 text-rose-700 border-rose-200">
                  {stats.riscoAltoEssencialCount} Críticos
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {contratosData
                  .filter((c) => c.statusContrato === "Ativo" && c.riscoDescontinuidade === "Alto" && c.servicoEssencial)
                  .map((c) => (
                    <div
                      key={c.idContrato}
                      onClick={() => setSelectedContractForModal(c)}
                      className="p-2 bg-slate-50 rounded border border-slate-200 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800">Contrato {c.numeroContrato}/{c.anoContrato} ({c.categoriaContrato})</div>
                        <div className="text-[10px] text-slate-500">Gestor: <strong>{c.gestorContrato}</strong> • Fiscal: <strong>{c.fiscalContrato}</strong></div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-800">
                        {formatCurrency(c.valorAtualizado)}
                      </span>
                    </div>
                  ))}
              </div>

              <p className="text-[10px] text-slate-400 italic font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400 shrink-0" />
                Descontinuidade impacta diretamente o funcionamento regulatório do RPPS.
              </p>
            </div>

            {/* SEMÁFORO 3: REAJUSTES E INDEXADORES INFLACIONÁRIOS */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-blue-400"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                  </span>
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">Índices de Reajuste Anual</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-black border bg-blue-50 text-blue-700 border-blue-200">
                  IPCA / IGP-M
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">IPCA</span>
                  <div className="text-lg font-black text-blue-700 mt-0.5">
                    {contratosData.filter((c) => c.statusContrato === "Ativo" && c.indiceReajuste === "IPCA").length} Contratos
                  </div>
                  <span className="text-[9px] text-slate-400">Atuariais e Consultorias</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">IGP-M</span>
                  <div className="text-lg font-black text-indigo-700 mt-0.5">
                    {contratosData.filter((c) => c.statusContrato === "Ativo" && c.indiceReajuste === "IGPM").length} Contratos
                  </div>
                  <span className="text-[9px] text-slate-400">Serviços Contínuos</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400 shrink-0" />
                Aditivos anuais de valor balizados pelo IPCA e IGP-M acumulados.
              </p>
            </div>

          </div>

          {/* CHARTS GRID (MATCHING TITULOS & INVESTIMENTOS STANDARDS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* CHART 1: BARCHART CATEGORIAS */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Valor Atualizado x Saldo Remanescente por Categoria</span>
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Em Reais (R$)</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartCategoryData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="categoria"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val)), ""]}
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "11px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="valorAtualizado" name="Valor Atualizado" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saldo" name="Saldo Remanescente" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 2: PIE & MODALIDADES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* PIE RISCOS */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                    <PieChartIcon className="w-4 h-4 text-rose-600" />
                    <span>Nível de Risco</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">Ativos</span>
                </div>

                <div className="h-40 w-full my-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartRiscoData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={3}
                      >
                        {chartRiscoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "11px" }}
                        formatter={(value: any) => [`${value} contratos`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1 text-[10px] border-t border-slate-100 pt-2">
                  {chartRiscoData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PIE MODALIDADES */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Modalidade</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">Total</span>
                </div>

                <div className="h-40 w-full my-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartModalidadeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={3}
                      >
                        {chartModalidadeData.map((entry, index) => (
                          <Cell key={`cell-mod-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "11px" }}
                        formatter={(value: any) => [`${value} contratos`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1 text-[10px] border-t border-slate-100 pt-2">
                  {chartModalidadeData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* PAINEL DE EXECUÇÃO FINANCEIRA DOS CONTRATOS ATIVOS */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Acompanhamento da Execução do Saldo Contratual</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Contratos Ativos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {contratosData
                .filter((c) => c.statusContrato === "Ativo")
                .map((c) => {
                  const percentExecutado = c.valorAtualizado > 0 ? ((c.valorAtualizado - c.saldoContrato) / c.valorAtualizado) * 100 : 0;
                  return (
                    <div
                      key={c.idContrato}
                      onClick={() => setSelectedContractForModal(c)}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-400 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800">
                          Contrato {c.numeroContrato}/{c.anoContrato}
                        </span>
                        {getRiscoBadge(c.riscoDescontinuidade)}
                      </div>

                      <div className="text-[10px] text-slate-600 font-bold truncate">
                        {c.fornecedor}
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-200/60">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Valor Atualizado:</span>
                          <span className="font-mono font-bold text-slate-800">{formatCurrency(c.valorAtualizado)}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Saldo Restante:</span>
                          <span className="font-mono font-bold text-emerald-700">{formatCurrency(c.saldoContrato)}</span>
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold mb-1">
                          <span>Execução: {percentExecutado.toFixed(1)}%</span>
                          <span>Saldo: {(100 - percentExecutado).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                          <div className="bg-[#1e3a8a] h-full" style={{ width: `${Math.min(100, percentExecutado)}%` }}></div>
                          <div className="bg-emerald-500 h-full" style={{ width: `${Math.max(0, 100 - percentExecutado)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB 2: VIGÊNCIAS & PRAZOS CONTRATUAIS                                                 */}
      {/* ========================================================================================= */}
      {activeSubTab === "cronograma" && (
        <div className="space-y-4">
          
          {/* 1. CARDS DE INDICADORES & ALERTAS DE VIGÊNCIA (PADRÃO INVESTIMENTOS / TÍTULOS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Urgentes / Próximos de Vencer */}
            <div className="bg-white rounded shadow-sm border-l-4 border-rose-600 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Vencimento &lt; 90 Dias
                </span>
                <div className="p-1.5 rounded bg-rose-50 text-rose-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight font-mono">
                  {vigenciaStats.urgentesCriticosCount}{" "}
                  <span className="text-xs font-semibold text-slate-500 font-sans">contratos</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Ação urgente / autuação no SEI recomendada
                </span>
              </div>
            </div>

            {/* Card 2: Devem ser Aditivados */}
            <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Termos Aditivos
                </span>
                <div className="p-1.5 rounded bg-amber-50 text-amber-600">
                  <FileCheck className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight font-mono">
                  {vigenciaStats.devemSerAditivadosCount}{" "}
                  <span className="text-xs font-semibold text-slate-500 font-sans">prorrogáveis</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Notificação e minuta de prorrogação regular
                </span>
              </div>
            </div>

            {/* Card 3: Nova Licitação Necessária */}
            <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Novas Licitações
                </span>
                <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                  <Scale className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight font-mono">
                  {vigenciaStats.devemLicitarCount}{" "}
                  <span className="text-xs font-semibold text-slate-500 font-sans">certames SEI</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Abertura de DFD, ETP e Termo de Referência
                </span>
              </div>
            </div>

            {/* Card 4: Reajustes Inflacionários */}
            <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Reajustes de Índice
                </span>
                <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight font-mono">
                  {vigenciaStats.comReajusteCount}{" "}
                  <span className="text-xs font-semibold text-slate-500 font-sans">contratos</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Cláusulas de reajustes na data de aniversário
                </span>
              </div>
            </div>

          </div>

          {/* 2. SUB-FILTROS DE AÇÃO DE VIGÊNCIA PARA OS GESTORES */}
          <div className="bg-white rounded shadow-xs border border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setVigenciaFilter("todos")}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  vigenciaFilter === "todos"
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>TODOS OS PRAZOS ({contratosData.filter(c => c.statusContrato === "Ativo").length})</span>
              </button>

              <button
                onClick={() => setVigenciaFilter("urgentes")}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  vigenciaFilter === "urgentes"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>⏳ &lt; 180 DIAS ({vigenciaStats.proximosVencimentosCount})</span>
              </button>

              <button
                onClick={() => setVigenciaFilter("ate90")}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  vigenciaFilter === "ate90"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>⚠️ &lt; 90 DIAS ({vigenciaStats.vencimento90Count})</span>
              </button>

              <button
                onClick={() => setVigenciaFilter("ate60")}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  vigenciaFilter === "ate60"
                    ? "bg-rose-700 text-white shadow-xs animate-pulse"
                    : "text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>🚨 &lt; 60 DIAS ({vigenciaStats.vencimento60Count})</span>
              </button>

              <button
                onClick={() => setVigenciaFilter("aditivos")}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  vigenciaFilter === "aditivos"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>📑 ELABORAR ADITIVO ({vigenciaStats.devemSerAditivadosCount})</span>
              </button>

              <button
                onClick={() => setVigenciaFilter("licitacoes")}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  vigenciaFilter === "licitacoes"
                    ? "bg-indigo-700 text-white shadow-xs"
                    : "text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>⚖️ NOVA LICITAÇÃO ({vigenciaStats.devemLicitarCount})</span>
              </button>

              <button
                onClick={() => setVigenciaFilter("reajustes")}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                  vigenciaFilter === "reajustes"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>📈 REAJUSTES ANUAIS ({vigenciaStats.comReajusteCount})</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium mr-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Data-Base de Referência: <strong>06/08/2026</strong></span>
            </div>
          </div>

          {/* 4. GRÁFICO DE PROJEÇÃO DE VENCIMENTOS POR SEMESTRE */}
          <div className="bg-white rounded shadow-xs border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Projeção de Vencimentos Contratuais por Semestre</span>
              </h4>
              <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center text-slate-600">
                  <span className="w-2.5 h-2.5 rounded bg-[#f59e0b] mr-1.5"></span>
                  Prorrogação (Aditivo)
                </span>
                <span className="flex items-center text-slate-600">
                  <span className="w-2.5 h-2.5 rounded bg-[#e11d48] mr-1.5"></span>
                  Nova Licitação
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartVencimentosData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "11px" }}
                    formatter={(val: any, name: any) => [
                      `${val} contrato(s)`,
                      name === "aditivos" ? "Prorrogação (Aditivo)" : "Nova Licitação"
                    ]}
                  />
                  <Bar dataKey="aditivos" name="Aditivos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="licitacoes" name="Licitações" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. QUADRO DETALHADO DE ACOMPANHAMENTO DOS CONTRATOS & PRAZOS */}
          <div className="bg-white rounded shadow-xs border border-slate-200 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
              <div>
                <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span>Painel Cronológico de Vencimentos e Prazos</span>
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  Exibindo {vigenciaFilteredContracts.length} contratos com cálculo de tempo restante e orientações do Gestor
                </span>
              </div>

              <div className="flex items-center space-x-2 text-[10px] font-bold">
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
                  &lt; 90 dias: Crítico
                </span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                  90-180 dias: Atenção
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                  &gt; 180 dias: Regular
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {vigenciaFilteredContracts.map((c) => {
                const daysRemaining = getDaysRemaining(c.fimVigencia);
                const isAtivo = c.statusContrato === "Ativo";
                const requiresNew = c.necessitaNovaContratacao === true || c.possibilidadeProrrogacao === false;

                // Color codes for days
                let daysBadgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                let daysLabel = "Vigência Regular";
                if (!isAtivo) {
                  daysBadgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                  daysLabel = c.statusContrato;
                } else if (daysRemaining <= 30) {
                  daysBadgeColor = "bg-rose-100 text-rose-800 border-rose-300 font-black animate-pulse";
                  daysLabel = "🔴 ALERTA MÁXIMO / CRÍTICO";
                } else if (daysRemaining <= 90) {
                  daysBadgeColor = "bg-rose-50 text-rose-700 border-rose-200 font-bold";
                  daysLabel = "🚨 AÇÃO URGENTE NECESSÁRIA";
                } else if (daysRemaining <= 180) {
                  daysBadgeColor = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
                  daysLabel = "⚠️ REQUER ATENÇÃO E INÍCIO DE PROCESSO";
                }

                // Recommended Action text
                let acaoRecomendada = "";
                if (!isAtivo) {
                  acaoRecomendada = `Contrato ${c.statusContrato}. Não requer providências de prazo.`;
                } else if (requiresNew) {
                  acaoRecomendada = `🚨 LIMITE DE RENOVAÇÃO ATINGIDO. Gestor ${c.gestorContrato} deve autuar Novo Termo de Referência / Licitação no SEI (${c.processoSEI}).`;
                } else if (c.possibilidadeProrrogacao === true) {
                  acaoRecomendada = `📑 PRORROGAÇÃO PERMITIDA. Gestor ${c.gestorContrato} deve notificar a contratada ${c.fornecedor} e elaborar Minuta de Termo Aditivo.`;
                } else {
                  acaoRecomendada = `Acompanhar execução do saldo contratual e fiscalização ordinária.`;
                }

                return (
                  <div
                    key={c.idContrato}
                    className="p-3 bg-slate-50 rounded border border-slate-200 hover:border-blue-400 transition-all space-y-2.5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                      {/* Left Contract Info */}
                      <div className="flex items-start space-x-3">
                        <span className="text-xs font-black bg-[#1e3a8a] text-white px-2.5 py-1 rounded shadow-xs mt-0.5">
                          Nº {c.numeroContrato}/{c.anoContrato}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex flex-wrap items-center gap-2">
                            <span className="text-slate-800 text-sm">{c.fornecedor}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600 font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                              {c.categoriaContrato}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-mono text-[11px]">{c.tipoContratacao}</span>
                          </div>

                          <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                            <span>Processo SEI: <strong className="text-slate-700 font-mono">{c.processoSEI}</strong></span>
                            <span>Gestor: <strong className="text-blue-900">{c.gestorContrato}</strong></span>
                            <span>Fiscal: <strong className="text-slate-700">{c.fiscalContrato}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right Badges & Value */}
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(c.statusContrato)}

                        {/* Days Countdown Badge */}
                        <div className={`px-2.5 py-1 rounded text-xs border flex items-center gap-1.5 ${daysBadgeColor}`}>
                          <Hourglass className="w-3.5 h-3.5" />
                          <span>
                            {daysRemaining > 0 ? `${daysRemaining} dias restantes` : "Vencido"}
                          </span>
                        </div>

                        {c.possibilidadeProrrogacao === true && (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <FileCheck className="w-3 h-3 text-emerald-600" />
                            Prorrogável
                          </span>
                        )}

                        {requiresNew && isAtivo && (
                          <span className="px-2 py-1 rounded text-[10px] font-black uppercase bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <Scale className="w-3 h-3 text-rose-600" />
                            Nova Licitação
                          </span>
                        )}

                        <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                          {formatCurrency(c.valorAtualizado)}
                        </span>

                        <button
                          onClick={() => setSelectedContractForModal(c)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded text-xs font-bold border border-blue-200 transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ficha</span>
                        </button>
                      </div>
                    </div>

                    {/* Vigência Date Bar & Progress */}
                    <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div className="bg-white p-2 rounded border border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Início Vigência:</span>
                        <span className="font-bold text-slate-800">{c.inicioVigencia}</span>
                      </div>

                      <div className="bg-white p-2 rounded border border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Término Vigência:</span>
                        <span className="font-bold text-blue-800 font-mono">{c.fimVigencia}</span>
                      </div>

                      <div className="bg-white p-2 rounded border border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Situação de Prazo:</span>
                        <span className="font-bold text-slate-700">{daysLabel}</span>
                      </div>
                    </div>

                    {/* Recommendation Box for Manager */}
                    <div className="p-2.5 rounded bg-white border border-slate-200 text-xs flex items-start space-x-2">
                      <Zap className={`w-4 h-4 mt-0.5 shrink-0 ${requiresNew ? "text-rose-600" : c.possibilidadeProrrogacao ? "text-amber-600" : "text-blue-600"}`} />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                          Orientação ao Gestor ({c.gestorContrato}):
                        </span>
                        <p className="text-xs font-semibold text-slate-800">
                          {acaoRecomendada}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB 3: GOVERNANÇA & RISCOS                                                            */}
      {/* ========================================================================================= */}
      {activeSubTab === "governanca" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Matriz de Governança, Gestores e Fiscais de Contratos</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Diretoria Executiva</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <th className="p-2.5">Contrato</th>
                    <th className="p-2.5">Categoria / Objeto</th>
                    <th className="p-2.5">Fornecedor</th>
                    <th className="p-2.5">Gestor Responsável</th>
                    <th className="p-2.5">Fiscal do Contrato</th>
                    <th className="p-2.5 text-center">Essencialidade</th>
                    <th className="p-2.5 text-center">Risco</th>
                    <th className="p-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {filteredContracts.map((c) => (
                    <tr key={c.idContrato} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-800">
                        Nº {c.numeroContrato}/{c.anoContrato}
                        <div className="text-[10px] text-slate-400 font-mono">{c.processoSEI}</div>
                      </td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-800">{c.categoriaContrato}</span>
                        <div className="text-[10px] text-slate-500">{c.tipoContratacao}</div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-800">{c.fornecedor}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.cnpjFornecedor}</div>
                      </td>
                      <td className="p-2.5 font-bold text-blue-900">
                        {c.gestorContrato}
                      </td>
                      <td className="p-2.5 font-bold text-slate-700">
                        {c.fiscalContrato}
                      </td>
                      <td className="p-2.5 text-center">
                        {c.servicoEssencial ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Sim (Vital)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
                            Não
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        {getRiscoBadge(c.riscoDescontinuidade)}
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => setSelectedContractForModal(c)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold transition-all cursor-pointer"
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
        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB-TAB 4: COMPARADOR DE CONTRATOS                                                         */}
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
                          <div>Gestor: <strong>{c.gestorContrato}</strong></div>
                          <div>Fiscal: <strong>{c.fiscalContrato}</strong></div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Risco Operacional</td>
                      {comparedContracts.map((c) => (
                        <td key={c.idContrato} className="p-3 text-center border-l border-slate-100">
                          {getRiscoBadge(c.riscoDescontinuidade)}
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
      {/* SUB-TAB 5: LISTA COMPLETA ANALÍTICA                                                        */}
      {/* ========================================================================================= */}
      {activeSubTab === "lista_completa" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Tabela Geral Analítica de Contratos</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Relatório Consolidado</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <th className="p-2.5">Contrato</th>
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
      {/* MODAL DETALHES DO CONTRATO (STANDARDS MATCHING INVESTIMENTOS / TITULOS)                  */}
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
