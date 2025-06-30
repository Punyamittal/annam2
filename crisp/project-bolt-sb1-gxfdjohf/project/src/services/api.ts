export interface ApiResponse {
  crop: string;
  trait: string;
  gene: {
    ensembl_id: string;
    symbol: string;
  };
  source: string;
  sequence_length: number;
  top_grnas: Array<{
    sequence: string;
    pam: string;
    start: number;
    strand: string;
    score: number;
  }>;
  explanation: string;
  custom_analysis: boolean;
}

export interface ApiError {
  error: string;
  traceback?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeGene = async (crop: string, trait: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crop: crop.toLowerCase(),
        trait: trait.toLowerCase(),
      }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to analyze gene: ${error.message}`);
    }
    throw new Error('Failed to analyze gene: Unknown error occurred');
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};