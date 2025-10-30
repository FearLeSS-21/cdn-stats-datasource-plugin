import { SelectableValue } from "@grafana/data";
import { GCZoneName } from "./types";

// Config object for zone names
export interface GCZoneNameConfig {
  label: string;
}

const config: Record<GCZoneName, GCZoneNameConfig> = {
  [GCZoneName.TesttCom]: { label: "testt.com" },
  [GCZoneName.All]: { label: "All" },
};

// Function to create options for select component
export const createZoneOptions = (): Array<SelectableValue<GCZoneName>> =>
  Object.entries(config).map(([value, { label }]) => ({
    value: value as GCZoneName,
    label,
  }));

// Function to create a single option for a specific zone
export const createOptionForZone = (
  zone: GCZoneName
): SelectableValue<GCZoneName> => ({
  value: zone,
  ...config[zone],
});
