"use client";

import React, { useState } from 'react';
import { Loader2, UploadCloud, XCircle } from 'lucide-react';

const DiseasePredictor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/predict-disease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      if (data.prediction) {
        setPrediction(data.prediction);
      } else {
        setError(data.message || 'Unexpected response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-6">Plant Disease Prediction</h1>
      <p className="text-center text-gray-600 mb-8">Upload an image of a plant leaf to predict potential diseases.</p>

      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-md mx-auto" />
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Clear image"
              >
                <XCircle size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32">
              <UploadCloud className="text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">Drag & drop an image or click to upload</p>
              <p className="text-sm text-gray-400">(JPG, JPEG, PNG)</p>
            </div>
          )}
        </div>

        <button
          onClick={handlePredict}
          disabled={!selectedFile || loading}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center
            ${!selectedFile || loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
          `}
        >
          {loading && <Loader2 className="animate-spin mr-2" size={20} />}
          {loading ? 'Predicting...' : 'Predict Disease'}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {prediction && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Prediction Result:</h2>
          <p className="text-2xl font-bold">{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor;