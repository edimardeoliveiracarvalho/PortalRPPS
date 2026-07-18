import React, { useState } from "react";
import { getMonthName } from "./utils";
import { ultimaAtualizacao } from "./data";
import maringaLogo from "./assets/images/maringa_prev_logo_new_1784335339502.jpg";
import { 
  VisaoGeralTab 
} from "./components/VisaoGeralTab";
import { 
  BeneficiosTab 
} from "./components/BeneficiosTab";
import { 
  Contabil2Tab 
} from "./components/Contabil2Tab";
import { 
  CarteiraInvestimentosTab 
} from "./components/CarteiraInvestimentosTab";
import { 
  PatrimonioTab 
} from "./components/PatrimonioTab";
import { 
  ServidoresTab 
} from "./components/ServidoresTab";
import { 
  AgendaTab 
} from "./components/AgendaTab";
import { 
  CompensacaoTab 
} from "./components/CompensacaoTab";
import { 
  MetaXRetornoTab 
} from "./components/MetaXRetornoTab";
import { 
  TitulosTab 
} from "./components/TitulosTab";
import { 
  ConsgTab 
} from "./components/ConsgTab";

import { 
  Compass, 
  Users, 
  Scale, 
  TrendingUp, 
  Target, 
  Briefcase, 
  FileText, 
  Coins, 
  ShieldAlert, 
  ChevronDown,
  Calendar,
  Layers,
  ArrowRightLeft,
  ShieldCheck
} from "lucide-react";

type TabId = "visao_geral" | "beneficios" | "contabil" | "compensacao" | "carteira_investimentos" | "titulos" | "meta_x_retorno" | "patrimonio" | "servidores" | "consg" | "agenda";

export default function App() {
  const [competence, setCompetence] = useState<string>("2026-06"); // Default to the latest complete month
  const [activeTab, setActiveTab] = useState<TabId>("visao_geral");
  const [showCompetenceMenu, setShowCompetenceMenu] = useState(false);

  const availableCompetences = [
    { value: "2026-06", label: "Junho / 2026" },
    { value: "2026-05", label: "Maio / 2026" },
    { value: "2026-04", label: "Abril / 2026" },
    { value: "2026-03", label: "Março / 2026" },
    { value: "2026-02", label: "Fevereiro / 2026" },
    { value: "2026-01", label: "Janeiro / 2026" },
  ];

  const tabs = [
    { id: "visao_geral", label: "Visão Geral", icon: Compass, component: VisaoGeralTab },
    { id: "beneficios", label: "Benefícios", icon: FileText, component: BeneficiosTab },
    { id: "contabil", label: "Contábil", icon: Scale, component: Contabil2Tab },
    { id: "compensacao", label: "Compensação", icon: ArrowRightLeft, component: CompensacaoTab },
    { id: "carteira_investimentos", label: "INVESTIMENTOS", icon: Briefcase, component: CarteiraInvestimentosTab },
    { id: "titulos", label: "TÍTULOS", icon: Coins, component: TitulosTab },
    { id: "meta_x_retorno", label: "META ATUARIAL", icon: Target, component: MetaXRetornoTab },
    { id: "patrimonio", label: "Carteira Consolidada", icon: TrendingUp, component: PatrimonioTab },
    { id: "servidores", label: "Servidores", icon: Users, component: ServidoresTab },
    { id: "consg", label: "CONSIGNADO", icon: Coins, component: ConsgTab },
    { id: "agenda", label: "Agenda", icon: Calendar, component: AgendaTab },
  ] as const;

  const handleCompetenceChange = (comp: string) => {
    setCompetence(comp);
    setShowCompetenceMenu(false);
  };

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || VisaoGeralTab;

  return (
    <div id="app_root" className="min-h-screen bg-slate-50 flex flex-col lg:h-screen lg:overflow-hidden font-sans antialiased text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Upper Navigation Header */}
      <header id="app_header" className="bg-[#1e3a8a] text-white px-6 h-16 flex items-center justify-between flex-shrink-0 z-50 shadow-md">
        
        {/* Logo / Brand identity */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white rounded-full p-1 shadow-sm flex items-center justify-center overflow-hidden border border-slate-200">
            <img 
              src={maringaLogo} 
              alt="Maringá Previdência" 
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold tracking-tight uppercase leading-tight">Maringá Previdência</h1>
            <p className="text-[10px] opacity-75 font-semibold uppercase tracking-wider italic">PORTAL EXECUTIVO</p>
          </div>
        </div>

        {/* Competency Selector Dropdown */}
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="hidden sm:inline-block text-[10px] uppercase opacity-70 font-semibold tracking-wider">Competência Selecionada</span>
            <div className="relative mt-0.5">
              <button
                onClick={() => setShowCompetenceMenu(!showCompetenceMenu)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded border border-white/20 text-xs font-semibold transition-all focus:outline-hidden"
              >
                <Calendar className="h-3.5 w-3.5 text-white/80" />
                <span>{getMonthName(competence)}</span>
                <ChevronDown className="h-3 w-3 text-white/80" />
              </button>

              {showCompetenceMenu && (
                <>
                  {/* Overlay Backdrop to dismiss */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowCompetenceMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                      Competências 2026
                    </div>
                    {availableCompetences.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => handleCompetenceChange(c.value)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                          competence === c.value ? "text-blue-700 bg-blue-50 font-bold" : "text-slate-600"
                        }`}
                      >
                        <span>{c.label}</span>
                        {competence === c.value && <span className="w-1.5 h-1.5 bg-blue-700 rounded-full"></span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block h-8 w-[1px] bg-white/20"></div>
          <div className="hidden md:block text-right text-[11px] leading-tight">
            <p className="opacity-70 font-semibold uppercase tracking-wider text-[9px]">Última Atualização</p>
            <p className="font-mono font-bold mt-0.5">{ultimaAtualizacao.data} - {ultimaAtualizacao.hora}</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Horizontal, matching the design spec perfectly */}
      <nav id="app_nav" className="bg-white border-b border-slate-200 px-6 h-12 flex items-center flex-shrink-0 overflow-x-auto no-scrollbar z-45">
        <div className="flex space-x-8 h-full">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-full flex items-center text-xs uppercase tracking-wide font-bold transition-all border-b-2 whitespace-nowrap px-1 cursor-pointer ${
                  isSelected
                    ? "text-blue-700 border-blue-700 font-bold"
                    : "text-slate-500 hover:text-slate-800 border-transparent font-semibold"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main id="content_stage" className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar bg-slate-50">
          <ActiveComponent competence={competence} />
        </main>

        {/* Footer Bar */}
        <footer className="bg-slate-200 h-8 px-6 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500 shrink-0 border-t border-slate-300">
          <div>Maringá Previdência • Sistema de Gestão Estratégica (SGE)</div>
          <div className="flex items-center">
            <span className="mr-4">Versão 2.4.0</span>
            <span className="text-emerald-600">● Conexão Segura</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
