import React, { useState } from "react";
import { InvestimentosTab } from "./InvestimentosTab";
import { Investimentos2Tab } from "./Investimentos2Tab";
import { EnquadramentoTab } from "./EnquadramentoTab";
import { Briefcase, Layers, ShieldCheck } from "lucide-react";

interface CarteiraInvestimentosTabProps {
  competence: string;
}

type SubTabId = "investimentos" | "concentracao" | "enquadramento";

export const CarteiraInvestimentosTab: React.FC<CarteiraInvestimentosTabProps> = ({ competence }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("investimentos");

  const subTabs = [
    { id: "investimentos", label: "CARTEIRA", icon: Briefcase },
    { id: "concentracao", label: "CONCENTRAÇÃO", icon: Layers },
    { id: "enquadramento", label: "ENQUADRAMENTO", icon: ShieldCheck },
  ] as const;

  return (
    <div className="flex flex-row items-stretch gap-6 min-h-[calc(100vh-140px)] w-full">
      {/* Side Navigation Bar (Vertical tabs on the left) */}
      <div className="flex flex-col gap-3 shrink-0 py-2 border-r border-slate-200/80 pr-4">
        {subTabs.map((tab) => {
          const isSelected = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex flex-col items-center justify-center py-6 px-3.5 rounded-xl border transition-all cursor-pointer select-none relative focus:outline-hidden ${
                isSelected
                  ? "bg-[#1e3a8a] text-white border-[#1e3a8a] font-black shadow-md scale-[1.02]"
                  : "bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200/80 font-bold"
              }`}
              style={{ minHeight: "150px" }}
            >
              <Icon className={`h-4 w-4 mb-3 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
              <span 
                className="whitespace-nowrap text-[10px] uppercase tracking-widest font-black"
                style={{ 
                  writingMode: "vertical-lr", 
                  transform: "rotate(180deg)",
                  display: "inline-block"
                }}
              >
                {tab.label}
              </span>
              
              {/* Active indicator bar */}
              {isSelected && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-md"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area on the Right */}
      <div className="flex-1 min-w-0">
        {activeSubTab === "investimentos" && <InvestimentosTab competence={competence} />}
        {activeSubTab === "concentracao" && <Investimentos2Tab competence={competence} />}
        {activeSubTab === "enquadramento" && <EnquadramentoTab competence={competence} />}
      </div>
    </div>
  );
};
