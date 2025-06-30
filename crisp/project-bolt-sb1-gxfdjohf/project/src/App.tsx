import React, { useState, useEffect } from 'react';
import { CropForm } from './components/CropForm';
import { GeneResults } from './components/GeneResults';
import { Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage';
import { GeneData } from './types/GeneData';
import { analyzeGene, checkApiHealth } from './services/api';

function App() {
  const [geneData, setGeneData] = useState<GeneData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Check API health on component mount
    const checkHealth = async () => {
      const isHealthy = await checkApiHealth();
      setApiStatus(isHealthy ? 'online' : 'offline');
    };
    
    checkHealth();
  }, []);

  const handleFormSubmit = async (crop: string, trait: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await analyzeGene(crop, trait);
      
      // Transform API response to match our GeneData interface
      const transformedData: GeneData = {
        crop: data.crop.charAt(0).toUpperCase() + data.crop.slice(1),
        trait: data.trait.charAt(0).toUpperCase() + data.trait.slice(1),
        gene: data.gene,
        source: data.source,
        sequence_length: data.sequence_length,
        top_grnas: data.top_grnas,
        explanation: data.explanation
      };
      
      setGeneData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setGeneData(null);
    setError(null);
  };

  const handleRetryConnection = async () => {
    setApiStatus('checking');
    const isHealthy = await checkApiHealth();
    setApiStatus(isHealthy ? 'online' : 'offline');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header apiStatus={apiStatus} onRetryConnection={handleRetryConnection} />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
            onRetry={() => handleRetryConnection()}
          />
        )}
        
        {!geneData ? (
          <CropForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading}
            apiStatus={apiStatus}
          />
        ) : (
          <GeneResults data={geneData} onNewSearch={handleNewSearch} />
        )}
      </main>
    </div>
  );
}

export default App;