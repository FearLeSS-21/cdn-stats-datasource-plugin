import { GCGranularity } from "./types";
import { SelectableValue } from "@grafana/data";

export const createOptions = (): Array<SelectableValue<GCGranularity>> =>
  Object.values(GCGranularity).map((g) => ({ value: g, label: g }));

export const getSecondsByGranularity = (granularity: GCGranularity): number => {
  switch (granularity) {
    case GCGranularity.FiveMinutes: return 5 * 60;
    case GCGranularity.TenMinutes: return 10 * 60;
    case GCGranularity.OneHour: return 60 * 60;
    case GCGranularity.OneDay: return 24 * 60 * 60;
  }
};

export const createOptionForGranularity = (granularity: GCGranularity): SelectableValue<GCGranularity> => ({
  value: granularity,
  label: granularity,
});
