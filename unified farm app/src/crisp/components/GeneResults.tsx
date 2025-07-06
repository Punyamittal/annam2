import React from 'react';
import { Download, ArrowLeft, Database, Hash, Dna as Dna2, Star } from 'lucide-react';
import { GeneData } from '../types/GeneData';
import { generatePDF } from '../utils/pdfGenerator';

interface GeneResultsProps {
  data: GeneData;
  onNewSearch: () => void;
}

export const GeneResults: React.FC<GeneResultsProps> = ({ data, onNewSearch }) => {
  const handleDownloadPDF = () => {
    generatePDF(data);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Good';
    return 'Fair';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNewSearch}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>New Search</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Download className="h-4 w-4" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Gene Overview */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Dna2 className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gene Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-blue-800 mb-1">Crop</p>
            <p className="text-xl font-bold text-blue-900">{data.crop}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-green-800 mb-1">Trait</p>
            <p className="text-xl font-bold text-green-900">{data.trait}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-purple-800 mb-1">Gene ID</p>
            <p className="text-xl font-bold text-purple-900">{data.gene.ensembl_id}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-orange-800 mb-1">Sequence Length</p>
            <p className="text-xl font-bold text-orange-900">{data.sequence_length.toLocaleString()} bp</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Source: {data.source}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Gene Symbol: {data.gene.symbol}</span>
          </div>
        </div>
      </div>

      {/* gRNA Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Star className="h-6 w-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Top CRISPR gRNAs</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Sequence (5' → 3')</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">PAM</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Start Position</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Strand</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Score</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Quality</th>
              </tr>
            </thead>
            <tbody>
              {data.top_grnas.map((grna, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {grna.sequence}
                    </code>
                  </td>
                  <td className="py-4 px-4">
                    <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">
                      {grna.pam}
                    </code>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{grna.start}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      grna.strand === '+' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {grna.strand}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm">{grna.score.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(grna.score)}`}>
                      {getScoreBadge(grna.score)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Gene Function & Analysis</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">
            {data.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};