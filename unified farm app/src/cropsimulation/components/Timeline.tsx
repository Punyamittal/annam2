import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { BBCHStage } from '../data/bbchDatabase';

interface TimelineProps {
  previousStages: { code: string; stage: BBCHStage }[];
  currentStage: { code: string; stage: BBCHStage } | null;
  upcomingStages: { code: string; stage: BBCHStage }[];
}

const Timeline: React.FC<TimelineProps> = ({ previousStages, currentStage, upcomingStages }) => {
  const formatStageType = (stageType: string) => {
    return stageType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStageColor = (stageType: string) => {
    const colors = {
      germination: 'text-yellow-600 bg-yellow-100',
      leaf_development: 'text-green-600 bg-green-100',
      tillering: 'text-green-700 bg-green-200',
      stem_elongation: 'text-blue-600 bg-blue-100',
      booting: 'text-purple-600 bg-purple-100',
      heading: 'text-indigo-600 bg-indigo-100',
      flowering: 'text-pink-600 bg-pink-100',
      fruit_development: 'text-orange-600 bg-orange-100',
      ripening: 'text-amber-600 bg-amber-100',
      senescence: 'text-gray-600 bg-gray-100'
    };
    return colors[stageType as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Growth Timeline</h2>
      
      <div className="space-y-4">
        {/* Previous Stages */}
        {previousStages.map((item, index) => (
          <div key={`prev-${item.code}`} className="flex items-center space-x-4 opacity-60">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-700">BBCH {item.code}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(item.stage.stage_type)}`}>
                  {formatStageType(item.stage.stage_type)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.stage.description}</p>
            </div>
          </div>
        ))}

        {/* Current Stage */}
        {currentStage && (
          <div className="flex items-center space-x-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-bold text-green-800">BBCH {currentStage.code}</span>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                  CURRENT
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(currentStage.stage.stage_type)}`}>
                  {formatStageType(currentStage.stage.stage_type)}
                </span>
              </div>
              <p className="text-sm text-gray-700 font-medium">{currentStage.stage.description}</p>
            </div>
          </div>
        )}

        {/* Upcoming Stages */}
        {upcomingStages.map((item, index) => (
          <div key={`next-${item.code}`} className="flex items-center space-x-4 opacity-50">
            <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-600">BBCH {item.code}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(item.stage.stage_type)}`}>
                  {formatStageType(item.stage.stage_type)}
                </span>
              </div>
              <p className="text-sm text-gray-500">{item.stage.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;