import { DataQuery, DataSourceJsonData, SelectableValue } from "@grafana/data";

export { SelectableValue };

export enum GCDNSMetric {
  Requests = "requests",
  Responses = "responses",
  Errors = "errors",
  Latency = "latency",
  NXDomain = "nxdomain",
  ServFail = "servfail",
  Refused = "refused",
}

export type GCMetric = GCDNSMetric;

export enum GCGranularity {
  FiveMinutes = "5m",
  TenMinutes = "10m",
  OneHour = "1h",
  OneDay = "1d",
}

export type GCGranularityType = GCGranularity | string;

export enum GCVariable {
  Zone = "zone",
  RecordType = "record_type",
  Metric = "metric",
  Granularity = "granularity",
}

export enum GCDNSRecordType {
  A = "A",
  AAAA = "AAAA",
  NS = "NS",
  CNAME = "CNAME",
  MX = "MX",
  TXT = "TXT",
  SVCB = "SVCB",
  HTTPS = "HTTPS",
}

export enum GCZoneName {
  TesttCom = "testt.com",
  All = "all",
}

export type GCZone = GCZoneName | string;

export interface GCZoneNameConfig {
  label: string;
}

export interface GCQuery extends DataQuery {
  metric: SelectableValue<GCMetric>;
  granularity?: SelectableValue<GCGranularityType>;
  zone?: GCZone;
  record_type?: GCDNSRecordType;
  from?: number;
  to?: number;
  legendFormat?: string;
  grouping?: Array<SelectableValue<GCVariable>>;
}

export interface GCStatsRequestData {
  zone: GCZone;
  from: number;
  to: number;
  record_type?: GCDNSRecordType;
  granularity?: GCGranularityType;
}

export interface GCResponseStats {
  requests?: Record<string, number>;
  total?: number;
}

export type GCPoint = [number, number];

export interface GCDataSourceOptions extends DataSourceJsonData {
  apiUrl?: string;
  apiKey?: string;
}

export interface GCSecureJsonData {
  apiKey?: string;
}

export interface GCJsonData {
  apiUrl?: string;
}

export interface GCVariableQuery {
  selector: SelectableValue<GCVariable>;
}

export interface Paginator<T> {
  count: number;
  results: T[];
}

export interface ZoneResponse {
  name: string;
}

export enum GCUnit {
  Number = "count",
  Milliseconds = "ms",
}
