import { investimentos } from "./src/data_investimentos";
import { evolucaoCarteiraConsolidada } from "./src/data";

const competences = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];

competences.forEach(comp => {
  const sumFinal = investimentos.reduce((sum, inv) => {
    const hist = inv.historico.find(h => h.competencia === comp);
    return sum + (hist ? hist.saldoFinal : 0);
  }, 0);

  const consObj = evolucaoCarteiraConsolidada.find(e => e.competencia === comp);
  const consVal = consObj ? consObj.valorCarteiraConsolidada : 0;
  const diff = consVal - sumFinal;

  console.log(`Month: ${comp}`);
  console.log(`  Sum of investments (saldoFinal): ${sumFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
  console.log(`  Consolidated portfolio value:    ${consVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
  console.log(`  Difference:                      ${diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
});
