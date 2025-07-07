export interface Gene {
  ensembl_id: string;
  symbol: string;
}

export interface GRNA {
  sequence: string;
  pam: string;
  start: number;
  strand: string;
  score: number;
}

export interface GeneData {
  crop: string;
  trait: string;
  gene: Gene;
  source: string;
  sequence_length: number;
  top_grnas: GRNA[];
  explanation: string;
}