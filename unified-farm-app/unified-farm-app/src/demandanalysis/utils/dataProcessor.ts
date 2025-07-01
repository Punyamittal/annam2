import { ProcessedMarketData, PriceForecast, SeasonalPattern, MarketInfo } from '../types/market';

export class DataProcessor {
  private data: ProcessedMarketData[] = [];

  async loadData(): Promise<void> {
    try {
      // List all CSV filenames in the data directory
      const csvFiles = [
        "Almond(Badam).csv",
        "Ambada Seed.csv",
        "Antawala.csv",
        "Bamboo.csv",
        "Guava.csv",
        "Methi(Leaves).csv",
        "Papaya (Raw).csv",
        "Paddy(Dhan)(Basmati).csv",
        "Peas(Dry).csv"
      ];

      // Fetch and parse all CSV files in parallel
      const allDataArrays = await Promise.all(
        csvFiles.map(async (filename) => {
          const response = await fetch(`/data/${filename}`);
          const text = await response.text();
          return this.parseCSV(text);
        })
      );

      // Flatten the array of arrays into a single array
      this.data = allDataArrays.flat();
    } catch (error) {
      console.error('Error loading market data:', error);
      throw new Error('Failed to load market data');
    }
  }

  private parseCSV(csvText: string): ProcessedMarketData[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data: ProcessedMarketData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      if (values.length !== headers.length) continue;

      try {
        const row: ProcessedMarketData = {
          state: values[0] || '',
          district: values[1] || '',
          market: values[2] || '',
          variety: values[3] || '',
          group: values[4] || '',
          arrivals: parseFloat(values[5]) || 0,
          minPrice: parseFloat(values[6]) || 0,
          maxPrice: parseFloat(values[7]) || 0,
          modalPrice: parseFloat(values[8]) || 0,
          date: new Date(values[9] || '2023-01-01')
        };

        if (row.modalPrice > 0 && row.state && row.district && row.market) {
          data.push(row);
        }
      } catch (error) {
        console.warn('Error parsing row:', line, error);
      }
    }

    return data;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  getStates(): string[] {
    const states = new Set(this.data.map(d => d.state));
    return Array.from(states).sort();
  }

  getDistricts(state: string): string[] {
    const districts = new Set(
      this.data
        .filter(d => d.state === state)
        .map(d => d.district)
    );
    return Array.from(districts).sort();
  }

  getMarkets(state: string, district: string): string[] {
    const markets = new Set(
      this.data
        .filter(d => d.state === state && d.district === district)
        .map(d => d.market)
    );
    return Array.from(markets).sort();
  }

  getVarieties(): string[] {
    const varieties = new Set(this.data.map(d => d.variety));
    return Array.from(varieties).filter(v => v && v !== 'Other').sort();
  }

  getMarketData(state?: string, district?: string, variety?: string): ProcessedMarketData[] {
    return this.data.filter(d => {
      if (state && d.state !== state) return false;
      if (district && d.district !== district) return false;
      if (variety && d.variety !== variety) return false;
      return true;
    });
  }

  generatePriceForecast(variety: string, months: number = 12): PriceForecast[] {
    const varietyData = this.data.filter(d => d.variety === variety);
    if (varietyData.length === 0) return [];

    // Sort by date
    varietyData.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate moving average and trend
    const forecasts: PriceForecast[] = [];
    const currentDate = new Date();
    
    // Get recent price trend
    const recentData = varietyData.slice(-30); // Last 30 records
    const avgPrice = recentData.reduce((sum, d) => sum + d.modalPrice, 0) / recentData.length;
    
    // Calculate seasonal patterns
    const monthlyAvg = this.calculateMonthlyAverages(varietyData);
    
    for (let i = 0; i < months; i++) {
      const forecastDate = new Date(currentDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      const month = forecastDate.getMonth();
      const seasonalMultiplier = monthlyAvg[month] / avgPrice;
      
      // Simple trend calculation with seasonal adjustment
      const trendFactor = 1 + (Math.random() - 0.5) * 0.1; // ±5% random variation
      const predictedPrice = avgPrice * seasonalMultiplier * trendFactor;
      
      forecasts.push({
        date: forecastDate.toISOString().split('T')[0],
        predictedPrice: Math.round(predictedPrice),
        confidence: Math.max(0.6, 1 - (i * 0.05)), // Decreasing confidence over time
        trend: predictedPrice > avgPrice ? 'up' : predictedPrice < avgPrice ? 'down' : 'stable'
      });
    }

    return forecasts;
  }

  private calculateMonthlyAverages(data: ProcessedMarketData[]): number[] {
    const monthlyData: { [key: number]: number[] } = {};
    
    data.forEach(d => {
      const month = d.date.getMonth();
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(d.modalPrice);
    });

    const monthlyAvg: number[] = [];
    for (let i = 0; i < 12; i++) {
      if (monthlyData[i] && monthlyData[i].length > 0) {
        monthlyAvg[i] = monthlyData[i].reduce((sum, price) => sum + price, 0) / monthlyData[i].length;
      } else {
        // Use overall average if no data for this month
        const overallAvg = data.reduce((sum, d) => sum + d.modalPrice, 0) / data.length;
        monthlyAvg[i] = overallAvg;
      }
    }

    return monthlyAvg;
  }

  private calculateMonthlyPriceAverages(data: ProcessedMarketData[], priceType: 'minPrice' | 'maxPrice' | 'modalPrice'): { month: string, avg: number }[] {
    const monthlyData: { [key: number]: number[] } = {};
    
    data.forEach(d => {
      const month = d.date.getMonth();
      if (!monthlyData[month]) monthlyData[month] = [];
      const price = priceType === 'minPrice' ? d.minPrice : priceType === 'maxPrice' ? d.maxPrice : d.modalPrice;
      if (price > 0) { // Only include valid prices
        monthlyData[month].push(price);
      }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const overallAvg = data.length > 0 
      ? data.reduce((sum, d) => {
          const price = priceType === 'minPrice' ? d.minPrice : priceType === 'maxPrice' ? d.maxPrice : d.modalPrice;
          return sum + price;
        }, 0) / data.filter(d => (priceType === 'minPrice' ? d.minPrice : priceType === 'maxPrice' ? d.maxPrice : d.modalPrice) > 0).length
      : 0;

    const monthlyAvgs: { month: string, avg: number }[] = [];
    for (let i = 0; i < 12; i++) {
        let avgForMonth: number;
        if (monthlyData[i] && monthlyData[i].length > 0) {
            avgForMonth = monthlyData[i].reduce((sum, price) => sum + price, 0) / monthlyData[i].length;
        } else {
            avgForMonth = overallAvg; // Fallback to overall average
        }
        monthlyAvgs.push({ month: months[i], avg: avgForMonth });
    }

    return monthlyAvgs;
  }

  getSeasonalPatterns(variety: string): SeasonalPattern[] {
    const varietyData = this.data.filter(d => d.variety === variety);
    if (varietyData.length === 0) return [];

    const monthlyAvg = this.calculateMonthlyAverages(varietyData);
    const overallAvg = monthlyAvg.reduce((sum, price) => sum + price, 0) / 12;

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => {
      const priceIndex = monthlyAvg[index] / overallAvg;
      let recommendation: 'excellent' | 'good' | 'average' | 'poor';
      
      if (priceIndex >= 1.15) recommendation = 'excellent';
      else if (priceIndex >= 1.05) recommendation = 'good';
      else if (priceIndex >= 0.95) recommendation = 'average';
      else recommendation = 'poor';

      return {
        month,
        averagePrice: Math.round(monthlyAvg[index]),
        priceIndex,
        recommendation
      };
    });
  }

  getBestMarkets(variety: string, userState?: string, userMarket?: string, limit: number = 5): MarketInfo[] {
    let varietyData = this.data.filter(d => d.variety === variety);

    // Filter by market if one is provided
    if (userMarket) {
      varietyData = varietyData.filter(d => d.market === userMarket);
    }
    
    // Group by market
    const marketGroups: { [key: string]: ProcessedMarketData[] } = {};
    
    varietyData.forEach(d => {
      const key = `${d.state}-${d.district}-${d.market}`;
      if (!marketGroups[key]) marketGroups[key] = [];
      marketGroups[key].push(d);
    });

    const marketAverages = Object.entries(marketGroups).map(([key, data]) => {
      if (data.length === 0) return null;

      // Find highest and lowest prices from monthly averages
      const monthlyMaxPrices = this.calculateMonthlyPriceAverages(data, 'maxPrice');
      const monthlyMinPrices = this.calculateMonthlyPriceAverages(data, 'minPrice');

      const highPriceEntry = monthlyMaxPrices.reduce((max, p) => p.avg > max.avg ? p : max, { avg: 0, month: 'N/A' });
      const lowPriceEntry = monthlyMinPrices.reduce((min, p) => (p.avg < min.avg && p.avg > 0) ? p : min, { avg: Infinity, month: 'N/A' });

      // The main price for sorting and display will be the historical high price average
      const displayPrice = highPriceEntry.avg;

      return {
        ...data.sort((a, b) => b.date.getTime() - a.date.getTime())[0], // Use latest for base info
        modalPrice: displayPrice,
        highPrice: Math.round(highPriceEntry.avg),
        highPriceMonth: highPriceEntry.month,
        lowPrice: lowPriceEntry.avg === Infinity ? 0 : Math.round(lowPriceEntry.avg),
        lowPriceMonth: lowPriceEntry.month,
        arrivals: data.reduce((sum, d) => sum + d.arrivals, 0) / data.length
      };
    }).filter((m): m is MarketInfo => m !== null && m.highPrice > 0);

    // Sort by high price (descending) and prioritize user's state
    marketAverages.sort((a, b) => {
      if (userState) {
        if (a.state === userState && b.state !== userState) return -1;
        if (b.state === userState && a.state !== userState) return 1;
      }
      return (b.highPrice || 0) - (a.highPrice || 0);
    });

    return marketAverages.slice(0, limit);
  }

  getBestStateMarkets(variety: string, state: string, limit: number = 3): MarketInfo[] {
    const stateVarietyData = this.data.filter(d => d.variety === variety && d.state === state);

    const marketGroups: { [key: string]: ProcessedMarketData[] } = {};
    
    stateVarietyData.forEach(d => {
      const key = `${d.state}-${d.district}-${d.market}`;
      if (!marketGroups[key]) marketGroups[key] = [];
      marketGroups[key].push(d);
    });

    const marketAverages = Object.entries(marketGroups).map(([key, data]) => {
      if (data.length === 0) return null;

      const monthlyMaxPrices = this.calculateMonthlyPriceAverages(data, 'maxPrice');
      const monthlyMinPrices = this.calculateMonthlyPriceAverages(data, 'minPrice');

      const highPriceEntry = monthlyMaxPrices.reduce((max, p) => p.avg > max.avg ? p : max, { avg: 0, month: 'N/A' });
      const lowPriceEntry = monthlyMinPrices.reduce((min, p) => (p.avg < min.avg && p.avg > 0) ? p : min, { avg: Infinity, month: 'N/A' });
      
      const displayPrice = highPriceEntry.avg;

      return {
        ...data.sort((a, b) => b.date.getTime() - a.date.getTime())[0],
        modalPrice: displayPrice,
        highPrice: Math.round(highPriceEntry.avg),
        highPriceMonth: highPriceEntry.month,
        lowPrice: lowPriceEntry.avg === Infinity ? 0 : Math.round(lowPriceEntry.avg),
        lowPriceMonth: lowPriceEntry.month,
        arrivals: data.reduce((sum, d) => sum + d.arrivals, 0) / data.length
      };
    }).filter((m): m is MarketInfo => m !== null && m.highPrice > 0);

    return marketAverages
      .sort((a, b) => (b.highPrice || 0) - (a.highPrice || 0))
      .slice(0, limit);
  }
}