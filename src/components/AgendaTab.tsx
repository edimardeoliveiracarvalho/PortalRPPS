import React, { useState, useMemo } from "react";
import { agendaReunioes, AgendaReuniao } from "../data";
import { getMonthName } from "../utils";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle,
  ChevronRight,
  Info,
  Download,
  CheckCircle2,
  List,
  Grid,
  Filter,
  CalendarDays,
  FileText,
  X,
  Search,
  ExternalLink
} from "lucide-react";

interface AgendaTabProps {
  competence: string;
}

export function AgendaTab({ competence }: AgendaTabProps) {
  // States for interactive filters and view modes
  const [selectedColegiado, setSelectedColegiado] = useState<string>("todos");
  const [selectedMonth, setSelectedMonth] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMeeting, setSelectedMeeting] = useState<AgendaReuniao | null>(null);

  // Helper to map Colegiado to pretty Portuguese labels, colors and metadata
  const getColegiadoDetails = (colegiado: string) => {
    switch (colegiado) {
      case "comiteInvestimentos":
        return {
          label: "Comitê de Investimentos",
          shortLabel: "COMIN",
          bg: "bg-blue-50 text-blue-700 border-blue-100",
          badgeBg: "bg-blue-600 text-white",
          iconColor: "text-blue-500",
          members: "Membros do Comitê de Investimentos",
          description: "Análise técnica de alocações de recursos, cenário macroeconômico e acompanhamento das metas de rentabilidade."
        };
      case "conselhoDeliberativo":
        return {
          label: "Conselho Deliberativo",
          shortLabel: "CONDEL",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          badgeBg: "bg-emerald-600 text-white",
          iconColor: "text-emerald-500",
          members: "Conselheiros Titulares e Diretoria Executiva",
          description: "Órgão supremo de deliberação. Aprovação de políticas de longo prazo, plano de benefícios e orçamentos."
        };
      case "conselhoFiscal":
        return {
          label: "Conselho Fiscal",
          shortLabel: "CONFIS",
          bg: "bg-purple-50 text-purple-700 border-purple-100",
          badgeBg: "bg-purple-600 text-white",
          iconColor: "text-purple-500",
          members: "Conselheiros Fiscais e Auditores",
          description: "Fiscalização financeira, contábil e patrimonial. Revisão de balancetes mensais e cumprimento legal."
        };
      case "conselhoPrevidenciaComplementar":
        return {
          label: "Conselho de Previdência Complementar",
          shortLabel: "CONPREV",
          bg: "bg-amber-50 text-amber-700 border-amber-100",
          badgeBg: "bg-amber-600 text-white",
          iconColor: "text-amber-500",
          members: "Conselheiros do Plano de Previdência Complementar",
          description: "Acompanhamento, fiscalização e deliberação sobre o plano de previdência complementar."
        };
      default:
        return {
          label: colegiado,
          shortLabel: "COLEG",
          bg: "bg-slate-50 text-slate-700 border-slate-100",
          badgeBg: "bg-slate-600 text-white",
          iconColor: "text-slate-500",
          members: "Membros do Colegiado",
          description: "Reunião de acompanhamento das diretrizes institucionais."
        };
    }
  };

  // Safe and precise Date formatter in Portuguese
  const formatMeetingDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length < 3) return { full: dateStr, day: "00", monthShort: "???", monthLong: "???", weekday: "" };
    
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    
    // Create UTC date to avoid local timezone offset issues
    const date = new Date(Date.UTC(y, m, d, 12, 0, 0)); 
    
    const weekdays = [
      "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
      "Quinta-feira", "Sexta-feira", "Sábado"
    ];
    const monthsShort = [
      "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
      "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
    ];
    const monthsLong = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const weekdayIdx = isNaN(date.getUTCDay()) ? 0 : date.getUTCDay();
    const weekdayName = weekdays[weekdayIdx];
    const monthShort = monthsShort[m] || "???";
    const monthLong = monthsLong[m] || "???";

    return {
      day: String(d).padStart(2, "0"),
      monthShort,
      monthLong,
      weekday: weekdayName,
      full: `${weekdayName}, ${d} de ${monthLong} de ${y}`
    };
  };

  // Realistic agenda topics for each colegiado
  const getMeetingAgendaTopics = (colegiado: string) => {
    switch (colegiado) {
      case "comiteInvestimentos":
        return [
          "Análise de Rentabilidade da Carteira de Investimentos do RPPS.",
          "Estudo de Cenário Macroeconômico e Alocação Estratégica em Ativos Financeiros.",
          "Avaliação de Novos Fundos de Investimentos e Credenciamento de Instituições.",
          "Discussão sobre a aderência à Política de Investimentos vigente."
        ];
      case "conselhoDeliberativo":
        return [
          "Deliberação sobre Pareceres Técnicos do Comitê de Investimentos.",
          "Aprovação do Relatório Anual de Governança e Prestação de Contas.",
          "Avaliação dos Estudos Atuariais e Equilíbrio Financeiro/Atuarial.",
          "Definições sobre a Estrutura Administrativa e Orçamento do Instituto."
        ];
      case "conselhoFiscal":
        return [
          "Auditoria Contábil e Financeira dos Balancetes Mensais.",
          "Fiscalização da Execução Orçamentária e Despesas de Administração.",
          "Verificação do cumprimento das obrigações previdenciárias patronais e dos servidores.",
          "Emissão de Parecer Fiscal sobre as Demonstrações Financeiras."
        ];
      case "conselhoPrevidenciaComplementar":
        return [
          "Acompanhamento da evolução patrimonial e plano de custeio do plano de previdência complementar.",
          "Análise da rentabilidade dos perfis de investimentos oferecidos aos participantes.",
          "Avaliação de propostas de alteração do regulamento do plano ou convênios de adesão.",
          "Apreciação de relatórios periódicos da entidade fechada de previdência complementar gestora."
        ];
      default:
        return [
          "Análise dos relatórios de rotina e expedientes administrativos.",
          "Leitura e aprovação da ata da sessão anterior.",
          "Assuntos gerais e comunicações da presidência."
        ];
    }
  };

  // Generate and download a real standard iCalendar (.ics) file
  const downloadIcsFile = (meeting: AgendaReuniao, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details drawer
    const dateParts = meeting.data.split("-");
    const y = dateParts[0];
    const m = dateParts[1];
    const d = dateParts[2];
    const hrParts = meeting.horario.split(":");
    const hr = hrParts[0];
    const min = hrParts[1];
    
    // Start & End Strings formatted for ICS (assume 2 hour meeting duration)
    const startStr = `${y}${m}${d}T${hr}${min}00`;
    const endHour = String(parseInt(hr, 10) + 2).padStart(2, "0");
    const endStr = `${y}${m}${d}T${endHour}${min}00`;
    
    const details = getColegiadoDetails(meeting.colegiado);
    const title = `Reunião Ordinária - ${details.label}`;
    const topics = getMeetingAgendaTopics(meeting.colegiado).map((t, idx) => `${idx + 1}. ${t}`).join("\\n");
    const description = `Reunião Ordinária da Maringá Previdência.\\nPauta:\\n${topics}`;
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MaringaPrevidencia//AgendaReunioes//PT",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DTSTART;TZID=America/Sao_Paulo:${startStr}`,
      `DTEND;TZID=America/Sao_Paulo:${endStr}`,
      `LOCATION:${meeting.local}`,
      `DESCRIPTION:${description}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:1",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `maringa_prev_reuniao_${meeting.colegiado}_${meeting.data}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get list of unique competencies that have scheduled meetings, for filtering
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    agendaReunioes.forEach(m => monthsSet.add(m.competencia));
    return Array.from(monthsSet).sort();
  }, []);

  // Filter meetings based on selected competence, colegiado, search queries, and only show meetings AFTER selected competence
  const filteredMeetings = useMemo(() => {
    return agendaReunioes
      .filter((meeting) => {
        // Must be in subsequent or equal competence to current workspace selected competence
        const isSubsequentOrCurrent = meeting.competencia >= competence;
        
        // Filter by collegiate
        const matchesColegiado = selectedColegiado === "todos" || meeting.colegiado === selectedColegiado;
        
        // Filter by month
        const matchesMonth = selectedMonth === "todos" || meeting.competencia === selectedMonth;
        
        // Filter by search text
        const details = getColegiadoDetails(meeting.colegiado);
        const searchTarget = `${details.label} ${meeting.local} ${meeting.data} ${meeting.horario}`.toLowerCase();
        const matchesSearch = searchQuery.trim() === "" || searchTarget.includes(searchQuery.toLowerCase());
        
        return isSubsequentOrCurrent && matchesColegiado && matchesMonth && matchesSearch;
      })
      .sort((a, b) => a.data.localeCompare(b.data));
  }, [competence, selectedColegiado, selectedMonth, searchQuery]);

  // Statistics for the top summary bar
  const stats = useMemo(() => {
    const year = competence.split("-")[0] || "2026";
    const yearMeetings = agendaReunioes.filter(m => m.data.startsWith(year));
    return {
      total: yearMeetings.length,
      comite: yearMeetings.filter(m => m.colegiado === "comiteInvestimentos").length,
      conselhos: yearMeetings.filter(m => m.colegiado === "conselhoDeliberativo" || m.colegiado === "conselhoFiscal").length,
      previdenciaComplementar: yearMeetings.filter(m => m.colegiado === "conselhoPrevidenciaComplementar").length
    };
  }, [competence]);

  // Date of the last update
  const LAST_UPDATE_DATE = "2026-07-15";

  const upcomingMeetingsByColegiado = useMemo(() => {
    const colegiados = [
      "comiteInvestimentos",
      "conselhoDeliberativo",
      "conselhoFiscal",
      "conselhoPrevidenciaComplementar"
    ];
    
    return colegiados.map(col => {
      const colMeetings = agendaReunioes
        .filter(m => m.colegiado === col && m.data > LAST_UPDATE_DATE)
        .sort((a, b) => a.data.localeCompare(b.data))
        .slice(0, 2);
        
      return {
        colegiado: col,
        meetings: colMeetings
      };
    });
  }, []);

  return (
    <div id="agenda_tab_dashboard" className="space-y-4">
      
      {/* Quick Statistics Counter widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Planejado */}
        <div className="bg-white rounded shadow-sm border-l-4 border-blue-600 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Planejado</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded shrink-0">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.total} reuniões</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Compromissos agendados no ano (exercício)
            </span>
          </div>
        </div>

        {/* Comitê Investimentos */}
        <div className="bg-white rounded shadow-sm border-l-4 border-emerald-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Comitê Investimentos</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded shrink-0">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.comite} sessões</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Acompanhamento de rentabilidade no ano (exercício)
            </span>
          </div>
        </div>

        {/* Conselhos Fiscais/Delib. */}
        <div className="bg-white rounded shadow-sm border-l-4 border-purple-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Conselhos Fiscais/Delib.</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded shrink-0">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.conselhos} sessões</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Fiscalização e deliberações no ano (exercício)
            </span>
          </div>
        </div>

        {/* Prev. Complementar */}
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Prev. Complementar</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded shrink-0">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{stats.previdenciaComplementar} sessões</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
              Previdência e planos municipais no ano (exercício)
            </span>
          </div>
        </div>
      </div>

      {/* Collegiate Upcoming Meetings Cards Overview Panel */}
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Próximos Compromissos por Órgão Colegiado
            </h3>
            <p className="text-[11px] text-slate-500">
              Exibindo as próximas 2 reuniões ordinárias programadas a partir de <strong className="text-slate-700">15 de Julho de 2026</strong> (data de referência/última atualização).
            </p>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 self-start sm:self-auto bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200">
            Última Atualização: 15/07/2026 - 20:26
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingMeetingsByColegiado.map(({ colegiado, meetings }) => {
            const details = getColegiadoDetails(colegiado);
            return (
              <div 
                key={`upcoming-col-${colegiado}`}
                className="bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between overflow-hidden hover:border-indigo-200 hover:shadow-xs transition-all duration-300"
              >
                {/* Header with badge */}
                <div className={`p-3 border-b border-slate-100 flex items-center justify-between ${details.bg}`}>
                  <span className="text-[11px] font-bold truncate pr-1">
                    {details.label}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${details.badgeBg}`}>
                    {details.shortLabel}
                  </span>
                </div>

                {/* Meetings List */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {meetings.length === 0 ? (
                      <div className="p-4 rounded-lg bg-slate-50/50 border border-dashed border-slate-100 text-center py-6">
                        <span className="text-[11px] text-slate-400 italic">Nenhum compromisso futuro</span>
                      </div>
                    ) : (
                      meetings.map((meeting, idx) => {
                        const dateInfo = formatMeetingDate(meeting.data);
                        return (
                          <div 
                            key={`upcoming-meet-${colegiado}-${idx}`} 
                            onClick={() => setSelectedMeeting(meeting)}
                            className="p-2 rounded-lg bg-slate-50/60 hover:bg-indigo-50/40 border border-slate-100 hover:border-indigo-100 transition-all flex items-start gap-2.5 cursor-pointer group"
                          >
                            {/* Calendar Block */}
                            <div className="w-8 h-9 bg-white border border-slate-200 rounded flex flex-col items-center justify-center text-center shadow-2xs flex-shrink-0 group-hover:border-indigo-300">
                              <span className="text-[7.5px] font-extrabold text-indigo-600 uppercase leading-none">{dateInfo.monthShort}</span>
                              <span className="text-xs font-black text-slate-800 leading-none mt-0.5">{dateInfo.day}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-700 truncate block group-hover:text-indigo-900">
                                  {dateInfo.weekday}
                                </span>
                                <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-0.5 flex-shrink-0">
                                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                                  {meeting.horario}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 truncate block mt-0.5 flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                                {meeting.local.replace("Sala de Reunião da ", "").replace("Sala de Reunião do ", "")}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {meetings.length === 1 && (
                      <div className="p-2 rounded-lg border border-dashed border-slate-100 text-center py-3">
                        <span className="text-[10px] text-slate-400 italic">Sem 2ª reunião agendada</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-300" />
                      {meetings.length} agendada{meetings.length !== 1 ? 's' : ''}
                    </span>
                    <button 
                      onClick={() => setSelectedColegiado(colegiado)}
                      className="text-indigo-600 font-extrabold hover:text-indigo-800 transition-colors flex items-center gap-0.5"
                    >
                      Filtrar Lista
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls Bar: Search, Filters & View Toggle */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs space-y-4">
        
        {/* Row 1: Search & Layout toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text"
              placeholder="Pesquisar por colegiado, local, horário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* View Toggle (Cards vs Timeline) */}
          <div className="flex items-center self-start md:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "cards" 
                  ? "bg-white text-slate-800 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              Sessões em Cards
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "timeline" 
                  ? "bg-white text-slate-800 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Cronograma Linear
            </button>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Row 2: Filters (Colegiado & Competência) */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Colegiado Filters */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Colegiado</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "todos", label: "Todos" },
                { id: "comiteInvestimentos", label: "Comitê de Investimentos" },
                { id: "conselhoDeliberativo", label: "Conselho Deliberativo" },
                { id: "conselhoFiscal", label: "Conselho Fiscal" },
                { id: "conselhoPrevidenciaComplementar", label: "Conselho da Previdência Complementar" }
              ].map(tab => {
                const isSelected = selectedColegiado === tab.id;
                let activeColorClass = "bg-blue-600 text-white";
                if (tab.id === "conselhoDeliberativo") activeColorClass = "bg-emerald-600 text-white";
                if (tab.id === "conselhoFiscal") activeColorClass = "bg-purple-600 text-white";
                if (tab.id === "conselhoPrevidenciaComplementar") activeColorClass = "bg-amber-600 text-white";

                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedColegiado(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected 
                        ? activeColorClass
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month Selector dropdown */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtrar por Mês</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="todos">Todos os Meses</option>
              {availableMonths
                .filter(m => m >= competence)
                .map(m => (
                  <option key={m} value={m}>{getMonthName(m)} ({m})</option>
                ))}
            </select>
          </div>

        </div>

      </div>

      {/* Main Meetings Layout (Rendered according to Selected ViewMode) */}
      {filteredMeetings.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
            <AlertCircle className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-700">Nenhum compromisso encontrado</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Não encontramos nenhuma reunião agendada correspondente aos filtros selecionados para as competências seguintes a {getMonthName(competence)}.
            </p>
          </div>
          {(selectedColegiado !== "todos" || selectedMonth !== "todos" || searchQuery !== "") && (
            <button 
              onClick={() => {
                setSelectedColegiado("todos");
                setSelectedMonth("todos");
                setSearchQuery("");
              }}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Limpar Filtros de Busca
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        
        /* CARD VIEW: Modern Grid Layout grouped by month or displayed directly as cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting, index) => {
            const dateDetails = formatMeetingDate(meeting.data);
            const colegiadoDetails = getColegiadoDetails(meeting.colegiado);
            const isCurrentMonth = meeting.competencia === competence;
            const pautas = getMeetingAgendaTopics(meeting.colegiado);

            return (
              <div 
                key={`meeting-card-${index}`}
                onClick={() => setSelectedMeeting(meeting)}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                {/* Card Top Branding Header */}
                <div className={`p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 group-hover:bg-slate-50/100 transition-colors`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colegiadoDetails.bg}`}>
                    {colegiadoDetails.shortLabel} • {colegiadoDetails.label}
                  </span>
                  
                  {isCurrentMonth ? (
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      Mês Corrente
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {meeting.competencia}
                    </span>
                  )}
                </div>

                {/* Card Main Body */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Date presentation */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-700 font-extrabold rounded-xl flex flex-col items-center justify-center border border-blue-100">
                      <span className="text-base font-black leading-none">{dateDetails.day}</span>
                      <span className="text-[9px] mt-0.5 tracking-wider">{dateDetails.monthShort}</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
                        {dateDetails.weekday}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {dateDetails.day} de {dateDetails.monthLong}
                      </p>
                    </div>
                  </div>

                  {/* Hour & Location with sleek icons */}
                  <div className="space-y-1.5 text-xs text-slate-500 font-medium bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      <span>{meeting.horario} Horas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{meeting.local}</span>
                    </div>
                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="p-4 border-t border-slate-50 bg-slate-50/20 flex items-center justify-end">
                  <span className="text-[10px] text-slate-400 font-bold group-hover:text-slate-600 flex items-center gap-0.5 transition-colors">
                    Detalhes <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* TIMELINE VIEW: Gorgeous Left-Aligned Timeline Schedule */
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-6">
            
            {filteredMeetings.map((meeting, index) => {
              const dateDetails = formatMeetingDate(meeting.data);
              const colegiadoDetails = getColegiadoDetails(meeting.colegiado);
              const isCurrent = meeting.competencia === competence;
              const pautas = getMeetingAgendaTopics(meeting.colegiado);

              return (
                <div 
                  key={`timeline-row-${index}`}
                  onClick={() => setSelectedMeeting(meeting)}
                  className="relative group cursor-pointer"
                >
                  {/* Glowing vertical node marker representing state */}
                  <span 
                    className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all duration-300 group-hover:scale-125 ${
                      isCurrent
                        ? "border-amber-500 bg-amber-500 ring-4 ring-amber-50"
                        : "border-blue-600 bg-blue-600 ring-4 ring-blue-50"
                    }`}
                  />

                  <div className="bg-slate-50/50 hover:bg-slate-50 rounded-xl p-4 border border-slate-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colegiadoDetails.bg}`}>
                          {colegiadoDetails.label}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                          {meeting.competencia}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                            Ativa
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                          {dateDetails.full}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{meeting.horario} Horas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{meeting.local}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INTERACTIVE DOSSIER MODAL (Selected Meeting Details) */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
          
          <div 
            className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-5 text-white flex items-center justify-between bg-gradient-to-r ${
              selectedMeeting.colegiado === "comiteInvestimentos" 
                ? "from-blue-600 to-indigo-700" 
                : selectedMeeting.colegiado === "conselhoDeliberativo"
                ? "from-emerald-600 to-teal-700"
                : "from-purple-600 to-indigo-700"
            }`}>
              <div className="space-y-1">
                <span className="text-[9px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded">
                  {getColegiadoDetails(selectedMeeting.colegiado).shortLabel} • Sessão Ordinária
                </span>
                <h3 className="text-lg font-black tracking-tight leading-snug">
                  {getColegiadoDetails(selectedMeeting.colegiado).label}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[460px] overflow-y-auto no-scrollbar">
              
              {/* Collegiate Description */}
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl leading-relaxed italic border border-slate-100">
                {getColegiadoDetails(selectedMeeting.colegiado).description}
              </div>

              {/* Date & Location Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    Data e Horário
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {formatMeetingDate(selectedMeeting.data).day}/{formatMeetingDate(selectedMeeting.data).monthShort} • {selectedMeeting.horario}h
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatMeetingDate(selectedMeeting.data).weekday}
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    Localização
                  </p>
                  <p className="text-xs font-bold text-slate-700 leading-snug truncate">
                    {selectedMeeting.local.split(" da ")[0]}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Sede Institucional
                  </p>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-500" />
                  Presenças Convocadas
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-1.5 h-7 bg-blue-500 rounded-full" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">
                      {getColegiadoDetails(selectedMeeting.colegiado).members}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Quórum mínimo regulamentar: Maioria Simples (50% + 1)
                    </p>
                  </div>
                </div>
              </div>

              {/* Agenda Topics List */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Pauta e Ordem do Dia
                </p>
                <div className="space-y-2.5">
                  {getMeetingAgendaTopics(selectedMeeting.colegiado).map((topic, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl hover:border-slate-200 transition-colors shadow-xs">
                      <div className="bg-blue-50 text-blue-700 text-xs font-extrabold w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        {tIdx + 1}
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {topic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button 
                onClick={(e) => downloadIcsFile(selectedMeeting, e)}
                className="flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:text-blue-800 bg-white hover:bg-blue-100/50 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
              >
                <Download className="h-4 w-4" />
                Adicionar à minha Agenda (.ics)
              </button>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 transition-colors"
              >
                Fechar
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
