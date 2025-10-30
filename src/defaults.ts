import { GCQuery, GCVariableQuery, GCDNSMetric, GCGranularity, GCVariable } from "./types";
import { createOptionForMetric } from "./metric";
import { createOptionForGranularity } from "./granularity";

export const defaultQuery: Partial<GCQuery> = {
  zone: "testt.com",
  record_type: undefined,
  metric: createOptionForMetric(GCDNSMetric.Requests),
  granularity: createOptionForGranularity(GCGranularity.OneHour),
};

export const defaultVariableQuery: Partial<GCVariableQuery> = {
  selector: { value: GCVariable.Zone, label: "Zone" },
};
