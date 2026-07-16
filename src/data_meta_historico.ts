export interface HistoricoMetaAtuarial {
  exercicio: number;
  metaAtuarialFormula: string;
  metaAtuarialPercentual: number;
  retornoPercentual: number;
  gap: number;
  atingiuMeta: boolean;
  resultado: "superavit" | "deficit";
}

export const retornoMetaAtuarialHistorico: HistoricoMetaAtuarial[] = [
  {
    "exercicio": 2012,
    "metaAtuarialFormula": "IPC-FIPE + 6,00% a.a.",
    "metaAtuarialPercentual": 11.42,
    "retornoPercentual": 25.20,
    "gap": 13.78,
    "atingiuMeta": true,
    "resultado": "superavit"
  },
  {
    "exercicio": 2013,
    "metaAtuarialFormula": "IPC-FIPE + 6,00% a.a.",
    "metaAtuarialPercentual": 10.12,
    "retornoPercentual": 3.02,
    "gap": -7.10,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2014,
    "metaAtuarialFormula": "IPC-FIPE + 6,00% a.a.",
    "metaAtuarialPercentual": 11.51,
    "retornoPercentual": 9.27,
    "gap": -2.24,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2015,
    "metaAtuarialFormula": "IPC-FIPE + 6,00% a.a.",
    "metaAtuarialPercentual": 17.75,
    "retornoPercentual": 12.25,
    "gap": -5.50,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2016,
    "metaAtuarialFormula": "IPC-FIPE + 6,00% a.a.",
    "metaAtuarialPercentual": 12.24,
    "retornoPercentual": 11.47,
    "gap": -0.77,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2017,
    "metaAtuarialFormula": "IPC-FIPE + 6,00% a.a.",
    "metaAtuarialPercentual": 7.80,
    "retornoPercentual": 7.38,
    "gap": -0.42,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2018,
    "metaAtuarialFormula": "INPC + 6,00% a.a.",
    "metaAtuarialPercentual": 9.59,
    "retornoPercentual": 9.75,
    "gap": 0.16,
    "atingiuMeta": true,
    "resultado": "superavit"
  },
  {
    "exercicio": 2019,
    "metaAtuarialFormula": "INPC + 6,00% a.a.",
    "metaAtuarialPercentual": 10.78,
    "retornoPercentual": 18.07,
    "gap": 7.29,
    "atingiuMeta": true,
    "resultado": "superavit"
  },
  {
    "exercicio": 2020,
    "metaAtuarialFormula": "INPC + 5,88% a.a.",
    "metaAtuarialPercentual": 11.62,
    "retornoPercentual": 2.93,
    "gap": -8.69,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2021,
    "metaAtuarialFormula": "IPCA + 5,45% a.a.",
    "metaAtuarialPercentual": 16.03,
    "retornoPercentual": -0.84,
    "gap": -16.87,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2022,
    "metaAtuarialFormula": "IPCA + 4,95% a.a.",
    "metaAtuarialPercentual": 11.00,
    "retornoPercentual": 0.25,
    "gap": -10.75,
    "atingiuMeta": false,
    "resultado": "deficit"
  },
  {
    "exercicio": 2023,
    "metaAtuarialFormula": "IPCA + 5,11% a.a.",
    "metaAtuarialPercentual": 9.90,
    "retornoPercentual": 12.43,
    "gap": 2.53,
    "atingiuMeta": true,
    "resultado": "superavit"
  },
  {
    "exercicio": 2024,
    "metaAtuarialFormula": "IPCA + 5,25% a.a.",
    "metaAtuarialPercentual": 10.36,
    "retornoPercentual": 11.13,
    "gap": 0.77,
    "atingiuMeta": true,
    "resultado": "superavit"
  },
  {
    "exercicio": 2025,
    "metaAtuarialFormula": "IPCA + 5,32% a.a.",
    "metaAtuarialPercentual": 9.81,
    "retornoPercentual": 11.55,
    "gap": 1.74,
    "atingiuMeta": true,
    "resultado": "superavit"
  }
];
