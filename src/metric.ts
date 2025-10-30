import { SelectableValue } from "@grafana/data";
import { GCDNSMetric, GCMetric, GCPoint } from "./types";

export enum GCUnit {
  Number = "count",
  Milliseconds = "ms",
}

export interface GCReportsConfig {
  originalMetric: GCDNSMetric;
  label: string;
  unit: GCUnit;
}

export type GCGetterFn<T> = (data: Partial<Record<GCDNSMetric, GCPoint[]>>) => T;

const config = Object.values(GCDNSMetric).reduce(
  (acc, metric) => {
    switch (metric) {
      case GCDNSMetric.Requests:
        acc[metric] = { originalMetric: metric, label: "Total Requests", unit: GCUnit.Number };
        break;
      case GCDNSMetric.Responses:
        acc[metric] = { originalMetric: metric, label: "Responses", unit: GCUnit.Number };
        break;
      case GCDNSMetric.Errors:
        acc[metric] = { originalMetric: metric, label: "Errors", unit: GCUnit.Number };
        break;
      case GCDNSMetric.Latency:
        acc[metric] = { originalMetric: metric, label: "Latency", unit: GCUnit.Milliseconds };
        break;
      case GCDNSMetric.NXDomain:
        acc[metric] = { originalMetric: metric, label: "NXDomain Responses", unit: GCUnit.Number };
        break;
      case GCDNSMetric.ServFail:
        acc[metric] = { originalMetric: metric, label: "ServFail Responses", unit: GCUnit.Number };
        break;
      case GCDNSMetric.Refused:
        acc[metric] = { originalMetric: metric, label: "Refused Responses", unit: GCUnit.Number };
        break;
    }
    return acc;
  },
  {} as Record<GCMetric, GCReportsConfig>
);

export const createOptions = (): Array<SelectableValue<GCMetric>> =>
  Object.entries(config).map(([value, { label }]) => ({
    value: value as GCMetric,
    label,
  }));

export const createOptionForMetric = (metric: GCMetric): SelectableValue<GCMetric> => ({
  value: metric,
  ...config[metric],
});

export const getOriginalMetric = (metric: GCMetric): GCDNSMetric => config[metric].originalMetric;
export const getLabelByMetric = (metric: GCMetric): string => config[metric].label;
export const getUnitByMetric = (metric: GCMetric): GCUnit => config[metric].unit;

export const createGetterSample = (metric: GCMetric): GCGetterFn<GCPoint[]> => (
  data: Partial<Record<GCDNSMetric, GCPoint[]>>
): GCPoint[] => {
  const originalMetric = getOriginalMetric(metric);
  return data[originalMetric] || [];
};

export const createGetterYValues = (metric: GCMetric): GCGetterFn<number[]> => (
  data: Partial<Record<GCDNSMetric, GCPoint[]>>
): number[] => {
  const originalMetric = getOriginalMetric(metric);
  const points = data[originalMetric] || [];
  return points.map((p) => p[1]);
};
