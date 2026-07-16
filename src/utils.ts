export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null) return "0,00%";
  
  // If value is a ratio like 0.0125 (representing 1.25%), multiply by 100
  // If the value is already in percentage terms like 1.25, check based on magnitude or context.
  // In our dataset:
  // - metaAtuarialPercentual is ratio (0.00594 = 0.59%)
  // - retornoPercentual is ratio (0.0094 = 0.94%)
  // - rentabilidadeMes is already percent (e.g. 1.1702 = 1.17%) OR ratio (e.g. -0.0125 in FUNDO BR HOTEIS = -0.15%? Let's check magnitude)
  // Let's standardise the formatting logic
  const isRatio = Math.abs(value) < 0.2; // values under 20% are treated as ratios if not already formatted
  const multiplier = isRatio ? 100 : 1;
  const formattedVal = (value * multiplier).toFixed(decimals);
  return `${formattedVal.replace(".", ",")}%`;
}

export function formatPercentRaw(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null) return "0,00%";
  const formattedVal = value.toFixed(decimals);
  return `${formattedVal.replace(".", ",")}%`;
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return "0";
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function getMonthName(competencia: string): string {
  const parts = competencia.split("-");
  if (parts.length < 2) return competencia;
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const idx = parseInt(parts[1], 10) - 1;
  return `${months[idx]} de ${parts[0]}`;
}

export function getPrevCompetence(competencia: string): string {
  const parts = competencia.split("-");
  if (parts.length < 2) return competencia;
  let year = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10);
  
  month -= 1;
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  return `${year}-${monthStr}`;
}
