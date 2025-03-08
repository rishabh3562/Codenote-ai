import { CHART_COLORS } from '@/config/constants';

export interface ChartConfig {
  width?: string | number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export function getChartConfig(type: 'area' | 'bar' | 'line' | 'pie'): ChartConfig {
  const baseConfig = {
    width: '100%',
    height: 300,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  switch (type) {
    case 'area':
      return {
        ...baseConfig,
        margin: { ...baseConfig.margin, bottom: 20 },
      };
    case 'bar':
      return {
        ...baseConfig,
        margin: { ...baseConfig.margin, left: 40, bottom: 20 },
      };
    case 'line':
      return {
        ...baseConfig,
        margin: { ...baseConfig.margin, left: 40, bottom: 20 },
      };
    case 'pie':
      return {
        ...baseConfig,
        height: 400,
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
      };
    default:
      return baseConfig;
  }
}

export function formatChartData<T extends Record<string, any>>(
  data: T[],
  key: keyof T
): T[] {
  return data.map(item => ({
    ...item,
    [key]: typeof item[key] === 'number' ? item[key].toLocaleString() : item[key],
  }));
}