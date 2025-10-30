import { SelectableValue } from "@grafana/data";
import { GCDNSRecordType } from "./types";

// Config for DNS record types
interface GCRecordTypeConfig {
  label: string;
}

const config: Record<GCDNSRecordType, GCRecordTypeConfig> = {
  [GCDNSRecordType.A]: { label: "A" },
  [GCDNSRecordType.AAAA]: { label: "AAAA" },
  [GCDNSRecordType.NS]: { label: "NS" },
  [GCDNSRecordType.CNAME]: { label: "CNAME" },
  [GCDNSRecordType.MX]: { label: "MX" },
  [GCDNSRecordType.TXT]: { label: "TXT" },
  [GCDNSRecordType.SVCB]: { label: "SVCB" },
  [GCDNSRecordType.HTTPS]: { label: "HTTPS" },
};

/**
 * Create options for all DNS record types
 */
export const createOptions = (): Array<SelectableValue<GCDNSRecordType>> =>
  Object.entries(config).map(([value, { label }]) => ({
    value: value as GCDNSRecordType,
    label,
  }));

/**
 * Create a single option for a specific record type
 */
export const createOptionForRecordType = (recordType: GCDNSRecordType): SelectableValue<GCDNSRecordType> => ({
  value: recordType,
  ...config[recordType],
});
