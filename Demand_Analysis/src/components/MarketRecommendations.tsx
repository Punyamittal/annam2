import React, { useState, useEffect, useRef } from 'react';
import { MapPin, TrendingUp, Truck, IndianRupee, Star, Lightbulb, Loader2 } from 'lucide-react';
import { MarketInfo, VehicleInfo, SeasonalPattern, LocationData } from '../types/market';
import { getCoordinates, calculateDistance } from '../utils/geocoding';

interface MarketRecommendationsProps {
  markets: MarketInfo[];
  bestStateMarkets: MarketInfo[];
  variety: string;
  userLocation?: LocationData;
  vehicleInfo: VehicleInfo;
  seasonalPatterns: SeasonalPattern[];
  costPerKm: number;
}

const normalizeMarketName = (name: string): string => {
  // Removes text in parentheses like (F&V), (Sub Yard), etc. and trims whitespace
  return name.replace(/\s*\(.*\)\s*/g, '').trim();
};

type EnhancedMarketInfo = MarketInfo & {
  distance: number | null;
  transportCost: number;
  score: number;
};

export const MarketRecommendations: React.FC<MarketRecommendationsProps> = ({
  markets,
  bestStateMarkets,
  variety,
  userLocation,
  vehicleInfo,
  seasonalPatterns,
  costPerKm
}) => {
  const [geminiSuggestion, setGeminiSuggestion] = useState<string>('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [enhancedMarkets, setEnhancedMarkets] = useState<EnhancedMarketInfo[]>([]);
  const [isLoadingDistances, setIsLoadingDistances] = useState(false);

  useEffect(() => {
    const fetchGeminiSuggestion = async () => {
      if (!markets.length || !seasonalPatterns.length) return;
      setLoadingSuggestion(true);
      setSuggestionError(null);
      setGeminiSuggestion('');

      try {
        const overallMarketText = `Overall best markets: ${markets.map(m => `${m.market} (High: ₹${m.highPrice})`).join(', ')}.`;
        const stateMarketText = bestStateMarkets.length > 0 ? `Top markets in the state: ${bestStateMarkets.map(m => `${m.market} (High: ₹${m.highPrice})`).join(', ')}.` : '';
        const seasonalText = `Seasonal trends: ${seasonalPatterns.map(p => `${p.month} (${p.recommendation})`).join(', ')}.`;
        const prompt = `
          Given the following data for ${variety} in the region of ${userLocation?.state || 'this area'}:
          1. ${overallMarketText}
          2. ${stateMarketText}
          3. ${seasonalText}

          First, provide a concise (2-3 sentences) overall market strategy for a farmer.
          
          Then, provide a detailed, point-wise list of 5-8 actionable recommendations under the heading "Additional Detailed Recommendations:".
          These should be tailored to ${variety} and cover topics like market diversification, storage, value-added products, harvesting techniques, pest management, precision agriculture, cooperative marketing, and government schemes.
          
          Format the output exactly as follows:
          [Your 2-3 sentence summary here]
          
          Additional Detailed Recommendations:
          1. **[Title of Recommendation 1]:** [Description of recommendation 1].
          2. **[Title of Recommendation 2]:** [Description of recommendation 2].
          ...and so on.
        `;

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBdcfzUa9q2FFZoslweResfdsYcpj0J0nI', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        const data = await response.json();
        const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No AI suggestion available.';
        setGeminiSuggestion(suggestion);
      } catch (err) {
        setSuggestionError('Failed to fetch AI suggestion.');
      } finally {
        setLoadingSuggestion(false);
      }
    };
    fetchGeminiSuggestion();
  }, [markets, bestStateMarkets, seasonalPatterns, variety]);

  useEffect(() => {
    const processMarkets = async () => {
      if (!markets.length || !userLocation?.latitude || !userLocation?.longitude) {
        setEnhancedMarkets([]);
        return;
      }

      setIsLoadingDistances(true);

      const userCoords = {
        lat: userLocation.latitude,
        lon: userLocation.longitude,
      };

      const marketsWithDistances = await Promise.all(
        markets.map(async (market) => {
          const normalizedMarketName = normalizeMarketName(market.market);
          let distance: number | null = null;
          
          if (userCoords) {
            const placeNameMarket = `${normalizedMarketName}, ${market.district}, ${market.state}`;
            let marketCoords = await getCoordinates(placeNameMarket);
  
            if (!marketCoords) {
              console.warn(`Could not find coordinates for market: '${placeNameMarket}'. Falling back to district.`);
              const placeNameDistrict = `${market.district}, ${market.state}`;
              marketCoords = await getCoordinates(placeNameDistrict);
            }
            
            if (marketCoords) {
              distance = calculateDistance(
                userCoords.lat,
                userCoords.lon,
                marketCoords.lat,
                marketCoords.lon
              );
            }
          }

          // Fallback logic for when geocoding fails
          if (distance === null && userLocation) {
            if (market.state === userLocation.state) {
              distance = market.district === userLocation.district ? 50 : 150;
            } else {
              distance = 300;
            }
          }

          // If distance is 0, show 30km as a minimum.
          if (distance === 0) {
            distance = 30;
          }
          
          return { ...market, distance };
        })
      );

      const getRecommendationScore = (market: MarketInfo, distance: number | null): number => {
        const priceScore = (market.highPrice || 0) / 10000;
        
        let distanceScore = 4;
        const numericDistance = distance ?? 1000;
        if (numericDistance < 50) distanceScore = 10;
        else if (numericDistance < 200) distanceScore = 7;

        const arrivalScore = Math.min((market.arrivals || 0) / 10, 5);
        
        const score = (priceScore + distanceScore + arrivalScore) / 3;
        return Math.min(Math.round(score), 5);
      };

      const calculateTransportCost = (distance: number | null): number => {
        if (costPerKm === 0 || distance === null) {
          return 0;
        }
        return Math.round(costPerKm * distance);
      };

      const finalMarkets = marketsWithDistances
        .map(market => ({
          ...market,
          transportCost: calculateTransportCost(market.distance),
          score: getRecommendationScore(market, market.distance)
        }))
        .sort((a, b) => b.score - a.score);
      
      setEnhancedMarkets(finalMarkets);
      setIsLoadingDistances(false);
    };

    processMarkets();
  }, [markets, userLocation, vehicleInfo, costPerKm]);

  if (isLoadingDistances) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" size={20} />
        <span>Calculating exact distances to markets...</span>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Star className="mr-2 text-yellow-600" size={20} />
          Market Recommendations
        </h3>
        <p className="text-gray-600">No market data available for this crop.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Star className="mr-2 text-yellow-600" size={20} />
          Best Markets for {variety}
        </h3>
        <p className="text-sm text-gray-600">
          Showing top {Math.min(enhancedMarkets.length, 5)} recommendations
        </p>
      </div>

      <div className="space-y-4">
        {enhancedMarkets.slice(0, 5).map((market, index) => (
          <div 
            key={`${market.state}-${market.district}-${market.market}`}
            className={`p-4 rounded-lg border-2 ${
              index === 0 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                {index === 0 && <Star className="text-yellow-500 mr-2" size={20} fill="currentColor" />}
                <div>
                  <h4 className="font-semibold text-gray-800">{market.market}</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="mr-1" size={14} />
                    {market.district}, {market.state}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  High: ₹{market.highPrice || 0} <span className="text-sm font-medium text-gray-600">({market.highPriceMonth || 'N/A'})</span>
                </p>
                <p className="text-lg font-bold text-red-600">
                  Low: ₹{market.lowPrice || 0} <span className="text-sm font-medium text-gray-600">({market.lowPriceMonth || 'N/A'})</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Truck className="mr-2 text-blue-600" size={16} />
                <div>
                  <p className="text-gray-600">Distance</p>
                  <p className="font-medium">
                    {market.distance !== null ? `${Math.round(market.distance)} km` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <IndianRupee className="mr-2 text-orange-600" size={16} />
                <div>
                  <p className="text-gray-600">Transport Cost</p>
                  <p className="font-medium">₹{market.transportCost}</p>
                </div>
              </div>
              <div className="flex items-center">
                <TrendingUp className="mr-2 text-purple-600" size={16} />
                <div>
                  <p className="text-gray-600">Market Activity</p>
                  <p className="font-medium">{market.arrivals.toFixed(1)}T</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Net Price (based on high): 
                  <span className="font-semibold text-green-600 ml-1">
                    ₹{(market.highPrice || 0) - market.transportCost}
                  </span>
                </p>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Score:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < market.score ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {index === 0 && (
              <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                <strong>Recommended:</strong> Best combination of price, distance, and market activity
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Contact markets before traveling to confirm current prices</li>
          <li>• Consider grouping with other farmers to reduce transport costs</li>
          <li>• Check market timings and weekly schedules</li>
          <li>• Negotiate better prices for larger quantities</li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
          <Lightbulb className="mr-2" size={16} />
          Gemini AI Market Suggestion
        </h4>
        {loadingSuggestion ? (
          <p className="text-yellow-700">Loading suggestion...</p>
        ) : suggestionError ? (
          <p className="text-red-600">{suggestionError}</p>
        ) : (
          <p className="text-yellow-700 whitespace-pre-wrap">{geminiSuggestion}</p>
        )}
      </div>
    </div>
  );
};