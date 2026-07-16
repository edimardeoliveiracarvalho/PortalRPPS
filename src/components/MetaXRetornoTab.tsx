import React, { useState } from "react";
import { MetaAtuarialTab } from "./MetaAtuarialTab";
import { MetaAtuarial2Tab } from "./MetaAtuarial2Tab";
import { Target, TrendingUp } from "lucide-react";

interface MetaXRetornoTabProps {
  competence: string;
}

export const MetaXRetornoTab: React.FC<MetaXRetornoTabProps> = ({ competence }) => {
  const [activeSubTab, setActiveSubTab] = useState<"meta_atuarial" | "meta_atuarial_2">("meta_atuarial");

  return (
    <div id="meta_x_retorno_container" className="space-y-4">
      {/* Sub-tab Navigation */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented Control */}
        <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 order-2 sm:order-1">
          <button
            id="subtab_meta_atuarial_btn"
            onClick={() => setActiveSubTab("meta_atuarial")}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === "meta_atuarial"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>Meta Atuarial (Mensal)</span>
          </button>
          <button
            id="subtab_meta_atuarial_2_btn"
            onClick={() => setActiveSubTab("meta_atuarial_2")}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === "meta_atuarial_2"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Meta Atuarial (Histórica)</span>
          </button>
        </div>

        <div className="order-1 sm:order-2 text-left sm:text-right">
          <h3 className="text-sm font-bold text-slate-800">Análise Comparativa: Meta vs. Retorno</h3>
          <p className="text-[11px] text-slate-400">Navegue pelas visões de acompanhamento mensal atual e histórico consolidado.</p>
        </div>
      </div>

      {/* Content Area */}
      <div id="meta_x_retorno_content" className="transition-all duration-300">
        {activeSubTab === "meta_atuarial" ? (
          <MetaAtuarialTab competence={competence} />
        ) : (
          <MetaAtuarial2Tab competence={competence} />
        )}
      </div>
    </div>
  );
};
