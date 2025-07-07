import React from 'react';
import { MapPin, TrendingUp, Star } from 'lucide-react';
import { MarketInfo } from '../types/market';

interface StateMarketRecommendationsProps {
  markets: MarketInfo[];
  variety: string;
  state?: string;
}

export const StateMarketRecommendations: React.FC<StateMarketRecommendationsProps> = ({
  markets,
  variety,
  state
}) => {
  if (!state) {
    return null; // Don't render anything if no state is selected
  }

  if (markets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Star className="mr-2 text-blue-600" size={20} />
          Top Markets in {state} for {variety}
        </h3>
        <p className="text-gray-600">No specific market data available for this state and crop combination.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Star className="mr-2 text-blue-600" size={20} />
          Top Markets in {state} for {variety}
        </h3>
        <p className="text-sm text-gray-600">
          Showing top {markets.length} recommendations
        </p>
      </div>

      <div className="space-y-4">
        {markets.map((market, index) => (
          <div 
            key={`${market.state}-${market.district}-${market.market}`}
            className="p-4 rounded-lg border bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">{market.market}</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="mr-1" size={14} />
                    {market.district}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-md font-bold text-green-600">
                  High: ₹{market.highPrice} <span className="text-sm font-medium text-gray-600">({market.highPriceMonth})</span>
                </p>
                <p className="text-md font-bold text-red-600">
                  Low: ₹{market.lowPrice} <span className="text-sm font-medium text-gray-600">({market.lowPriceMonth})</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 