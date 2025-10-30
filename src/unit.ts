import { GCQuery, GCResponseStats, GCDNSMetric } from "./types";

type Transform = (value: number) => number;
const noop: Transform = (v) => v;

export const getUnit = (query: GCQuery, data: GCResponseStats[]): [string, Transform] => {
  const metric = query.metric.value;
  if (!metric) {
    return ["none", noop];
  }

  const unit = metric === GCDNSMetric.Latency ? "ms" : "none";
  return [unit, noop];
};
