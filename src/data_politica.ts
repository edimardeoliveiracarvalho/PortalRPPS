export interface PoliticaInvestimento {
  artigo: string;
  descricao: string;
  segmento: string;
  limiteCMN5272: number;          // percentual, e.g. 100
  limitePolitica: number;         // percentual, e.g. 30
  limiteProGestaoNivel2: number;  // percentual, e.g. 100
  restricaoProGestao: boolean;    // boolean
}

export const politicaInvestimentos: PoliticaInvestimento[] = [
  {
    "artigo": "7",
    "descricao": "rendaFixa",
    "segmento": "rendaFixa",
    "limiteCMN5272": 100,
    "limitePolitica": 100,
    "limiteProGestaoNivel2": 100,
    "restricaoProGestao": false
  },
  {
    "artigo": "7, I",
    "descricao": "FI Renda Fixa Referenciado 100% títulos TN",
    "segmento": "rendaFixa",
    "limiteCMN5272": 100,
    "limitePolitica": 30,
    "limiteProGestaoNivel2": 100,
    "restricaoProGestao": false
  },
  {
    "artigo": "7, II",
    "descricao": "Títulos Tesouro Nacional",
    "segmento": "rendaFixa",
    "limiteCMN5272": 100,
    "limitePolitica": 20,
    "limiteProGestaoNivel2": 100,
    "restricaoProGestao": false
  },
  {
    "artigo": "7, III",
    "descricao": "Títulos Tesouro Nacional (Balcão)",
    "segmento": "rendaFixa",
    "limiteCMN5272": 100,
    "limitePolitica": 90,
    "limiteProGestaoNivel2": 100,
    "restricaoProGestao": false
  },
  {
    "artigo": "7, IV",
    "descricao": "Operações Compromissadas - TN",
    "segmento": "rendaFixa",
    "limiteCMN5272": 5,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 5,
    "restricaoProGestao": false
  },
  {
    "artigo": "7, V",
    "descricao": "FI Renda Fixa e ETF Renda Fixa",
    "segmento": "rendaFixa",
    "limiteCMN5272": 80,
    "limitePolitica": 20,
    "limiteProGestaoNivel2": 80,
    "restricaoProGestao": false
  },
  {
    "artigo": "7, VI",
    "descricao": "Ativos Bancários",
    "segmento": "rendaFixa",
    "limiteCMN5272": 20,
    "limitePolitica": 10,
    "limiteProGestaoNivel2": 20,
    "restricaoProGestao": false
  },
  {
    "artigo": "7, VII",
    "descricao": "FI Renda Fixa \"Crédito Privado\"",
    "segmento": "rendaFixa",
    "limiteCMN5272": 20,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "7, VIII",
    "descricao": "FI Debêntures",
    "segmento": "rendaFixa",
    "limiteCMN5272": 20,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "7, IX",
    "descricao": "FIDC Sênior",
    "segmento": "rendaFixa",
    "limiteCMN5272": 20,
    "limitePolitica": 3,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "8",
    "descricao": "rendaVariavel",
    "segmento": "rendaVariavel",
    "limiteCMN5272": 50,
    "limitePolitica": 4,
    "limiteProGestaoNivel2": 50,
    "restricaoProGestao": false
  },
  {
    "artigo": "8, I",
    "descricao": "FI Ações",
    "segmento": "rendaVariavel",
    "limiteCMN5272": 40,
    "limitePolitica": 10,
    "limiteProGestaoNivel2": 40,
    "restricaoProGestao": false
  },
  {
    "artigo": "8, II",
    "descricao": "ETF de Ações",
    "segmento": "rendaVariavel",
    "limiteCMN5272": 40,
    "limitePolitica": 5,
    "limiteProGestaoNivel2": 40,
    "restricaoProGestao": false
  },
  {
    "artigo": "8, III",
    "descricao": "BDR / BDR-ETF - Ações",
    "segmento": "rendaVariavel",
    "limiteCMN5272": 10,
    "limitePolitica": 2,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "8, IV",
    "descricao": "ETF - Internacional",
    "segmento": "rendaVariavel",
    "limiteCMN5272": 10,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "9",
    "descricao": "exterior",
    "segmento": "exterior",
    "limiteCMN5272": 10,
    "limitePolitica": 2,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "9, I",
    "descricao": "Renda Fixa - Dívida Externa",
    "segmento": "exterior",
    "limiteCMN5272": 10,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "9, II",
    "descricao": "Investimento no Exterior - Qualificado",
    "segmento": "exterior",
    "limiteCMN5272": 10,
    "limitePolitica": 2,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "9, III",
    "descricao": "FI Investimentos Exterior",
    "segmento": "exterior",
    "limiteCMN5272": 10,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "10",
    "descricao": "estruturados",
    "segmento": "estruturados",
    "limiteCMN5272": 20,
    "limitePolitica": 15,
    "limiteProGestaoNivel2": 15,
    "restricaoProGestao": false
  },
  {
    "artigo": "10, I",
    "descricao": "FI Multimercado",
    "segmento": "estruturados",
    "limiteCMN5272": 15,
    "limitePolitica": 10,
    "limiteProGestaoNivel2": 15,
    "restricaoProGestao": false
  },
  {
    "artigo": "10, II",
    "descricao": "Fiagro",
    "segmento": "estruturados",
    "limiteCMN5272": 5,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "10, III",
    "descricao": "FI em Participações",
    "segmento": "estruturados",
    "limiteCMN5272": 10,
    "limitePolitica": 1,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "10, IV",
    "descricao": "FI \"Ações - Mercado de Acesso\"",
    "segmento": "estruturados",
    "limiteCMN5272": 10,
    "limitePolitica": 0,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "11",
    "descricao": "FI Imobiliário",
    "segmento": "fundosImobiliarios",
    "limiteCMN5272": 20,
    "limitePolitica": 2,
    "limiteProGestaoNivel2": 0,
    "restricaoProGestao": true
  },
  {
    "artigo": "12",
    "descricao": "Empréstimos Consignados",
    "segmento": "emprestimosConsignados",
    "limiteCMN5272": 10,
    "limitePolitica": 10,
    "limiteProGestaoNivel2": 10,
    "restricaoProGestao": false
  }
];

export function getArticleForEnquadramento(enq: string): string {
  if (!enq) return "";
  const normalized = enq.toLowerCase().trim();
  
  if (normalized.includes("7") && normalized.includes("i") && !normalized.includes("ii") && !normalized.includes("iii") && !normalized.includes("iv") && !normalized.includes("v") && !normalized.includes("vi") && !normalized.includes("vii") && !normalized.includes("viii") && !normalized.includes("ix")) {
    return "7, I";
  }
  if (normalized.includes("7") && normalized.includes("ii") && !normalized.includes("iii")) return "7, II";
  if (normalized.includes("7") && normalized.includes("iii")) return "7, III";
  if (normalized.includes("7") && normalized.includes("iv")) return "7, IV";
  if (normalized.includes("7") && normalized.includes("v") && !normalized.includes("vi") && !normalized.includes("vii") && !normalized.includes("viii") && !normalized.includes("ix")) return "7, V";
  if (normalized.includes("7") && normalized.includes("vi") && !normalized.includes("vii") && !normalized.includes("viii") && !normalized.includes("ix")) return "7, VI";
  if (normalized.includes("7") && normalized.includes("vii")) return "7, VII";
  if (normalized.includes("7") && normalized.includes("viii")) return "7, VIII";
  if (normalized.includes("7") && normalized.includes("ix")) return "7, IX";
  
  if (normalized.includes("8") && normalized.includes("i") && !normalized.includes("ii") && !normalized.includes("iii") && !normalized.includes("iv")) return "8, I";
  if (normalized.includes("8") && normalized.includes("ii") && !normalized.includes("iii")) return "8, II";
  if (normalized.includes("8") && normalized.includes("iii")) return "8, III";
  if (normalized.includes("8") && normalized.includes("iv")) return "8, IV";
  
  if (normalized.includes("9") && normalized.includes("i") && !normalized.includes("ii") && !normalized.includes("iii")) return "9, I";
  if (normalized.includes("9") && normalized.includes("ii") && !normalized.includes("iii")) return "9, II";
  if (normalized.includes("9") && normalized.includes("iii")) return "9, III";
  
  if (normalized.includes("10") && normalized.includes("i") && !normalized.includes("ii") && !normalized.includes("iii") && !normalized.includes("iv")) return "10, I";
  if (normalized.includes("10") && normalized.includes("ii") && !normalized.includes("iii")) return "10, II";
  if (normalized.includes("10") && normalized.includes("iii")) return "10, III";
  if (normalized.includes("10") && normalized.includes("iv")) return "10, IV";
  
  if (normalized.includes("11")) return "11";
  if (normalized.includes("12")) return "12";
  
  return "";
}
