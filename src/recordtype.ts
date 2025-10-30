import { GCDNSRecordType } from "./types";
import { SelectableValue } from "@grafana/data";

export interface GCRecordTypeConfig {
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

export const createOptions = (): Array<SelectableValue<GCDNSRecordType>> =>
  Object.entries(config).map(([value, { label }]) => ({
    value: value as GCDNSRecordType,
    label,
  }));

export const createOptionForRecordType = (
  recordType: GCDNSRecordType
): SelectableValue<GCDNSRecordType> => ({
  value: recordType,
  ...config[recordType],
});
