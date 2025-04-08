import { CHART_COLORS } from '@/lib/constants';

export function getChartConfig(type: 'area' | 'bar' | 'line' | 'pie') {
  const baseConfig = {
    width: '100%',
    height: 300,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  switch (type) {
    case 'area':
      return {
        ...baseConfig,
        stroke: CHART_COLORS.primary,
        fill: CHART_COLORS.primary,
        fillOpacity: 0.2,
      };
    case 'bar':
      return {
        ...baseConfig,
        barSize: 20,
        fill: CHART_COLORS.primary,
      };
    case 'line':
      return {
        ...baseConfig,
        stroke: CHART_COLORS.primary,
        strokeWidth: 2,
      };
    case 'pie':
      return {
        ...baseConfig,
        innerRadius: 60,
        outerRadius: 80,
        paddingAngle: 5,
        colors: Object.values(CHART_COLORS),
      };
    default:
      return baseConfig;
  }
}

export function formatChartData(data: any[], key: string) {
  return data.map((item) => ({
    ...item,
    [key]:
      typeof item[key] === 'number' ? item[key].toLocaleString() : item[key],
  }));
}
