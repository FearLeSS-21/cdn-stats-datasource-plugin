import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,
  Labels,
  LoadingState,
  toDataFrame,
  MetricFindValue,
} from "@grafana/data";
import { defaults } from "lodash";
import { getBackendSrv } from "@grafana/runtime";
import {
  GCDataSourceOptions,
  GCQuery,
  GCResponseStats,
  GCVariable,
  GCVariableQuery,
  GCDNSRecordType,
  GCPoint,
  ZoneResponse,
} from "./types";
import { createLabelInfo, getEmptyDataFrame, getTimeField, getValueField, getValueVariable } from "./utils";
import { defaultQuery } from "./defaults";
import { getUnit } from "./unit";

export class DataSource extends DataSourceApi<GCQuery, GCDataSourceOptions> {
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<GCDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url;
  }

  async metricFindQuery(query: GCVariableQuery): Promise<MetricFindValue[]> {
    if (!query.selector?.value) return [];

    switch (query.selector.value) {
      case GCVariable.Zone:
        const zones = await this.getAllZones();
        return getValueVariable(zones.map((z) => z.name));
      case GCVariable.RecordType:
        return getValueVariable(Object.values(GCDNSRecordType));
      default:
        return [];
    }
  }

  private async getAllZones(): Promise<ZoneResponse[]> {
    const limit = 1000;
    const getZones = (offset = 0) =>
      getBackendSrv().datasourceRequest<{ results: ZoneResponse[]; count: number }>({
        method: "GET",
        url: `${this.url}/zones`,
        responseType: "json",
        params: { limit, offset },
      });

    const first = await getZones(0);
    const { count, results } = first.data;
    if (count <= limit) return results;

    const rest = await Promise.all(
      Array.from({ length: Math.ceil(count / limit) - 1 }, (_, i) => getZones((i + 1) * limit))
    );

    return rest.reduce((acc, cur) => acc.concat(cur.data.results), results);
  }

  private prepareTargets(targets: GCQuery[]): GCQuery[] {
    return targets.map((q) => defaults(q, defaultQuery));
  }

  private async transform(data: GCResponseStats[], options: DataQueryRequest<GCQuery>, query: GCQuery): Promise<DataFrame> {
    if (!data || data.length === 0) return getEmptyDataFrame();

    const fields: Field[] = [];
    const metric = query.metric?.value;
    if (!metric) return getEmptyDataFrame();

    const [unit, transformFn] = getUnit(query, data);

    const firstRow = data[0];
    const sample: GCPoint[] = firstRow.requests
      ? Object.entries(firstRow.requests).map(([ts, v]) => [Number(ts), Number(v)] as GCPoint)
      : [];
    fields.push(getTimeField(sample, true));

    for (const row of data) {
      const rawLabels: Labels = { metric, zone: query.zone ?? "", record_type: query.record_type ?? "" };

      const metricsData: GCPoint[] = row.requests
        ? Object.entries(row.requests).map(([ts, v]) => [Number(ts), Number(v)] as GCPoint)
        : [];

      const { name, labels } = createLabelInfo(rawLabels, query, options.scopedVars);
      fields.push(
        getValueField({
          unit,
          labels,
          transform: transformFn,
          decimals: 2,
          data: metricsData,
          displayNameFromDS: name,
        })
      );
    }

    return toDataFrame({ fields, refId: query.refId });
  }

  async query(options: DataQueryRequest<GCQuery>): Promise<DataQueryResponse> {
    const targets = this.prepareTargets(options.targets.filter((t) => !t.hide));

    const promises = targets.map(async (query) => {
      const resp = await this.doRequest(options, query);
      const data: GCResponseStats[] = resp.data ? [resp.data] : [];
      return this.transform(data, options, query);
    });

    const frames = await Promise.all(promises);

    return { data: frames, key: options.requestId, state: LoadingState.Done };
  }

  private async doRequest(options: DataQueryRequest<GCQuery>, query: GCQuery): Promise<{ data: GCResponseStats }> {
    if (!query.zone) throw new Error("Zone is required");

    const { range } = options;
    const zoneName = query.zone === "all" ? "all" : query.zone;

    const params: Record<string, any> = {
      from: Math.floor((range?.from.valueOf() ?? 0) / 1000),
      to: Math.floor((range?.to.valueOf() ?? 0) / 1000),
    };

    if (query.record_type) params.record_type = query.record_type;
    if (query.granularity?.value) params.granularity = query.granularity.value;

    return getBackendSrv().datasourceRequest({
      method: "GET",
      url: `${this.url}/zones/${zoneName}/statistics`,
      responseType: "json",
      params,
    });
  }

  async testDatasource(): Promise<{ status: string; message: string }> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const resp = await getBackendSrv().datasourceRequest({
        method: "GET",
        url: `${this.url}/zones/all/statistics`,
        responseType: "json",
        params: { from: now - 3600, to: now },
      });

      return resp.status === 200
        ? { status: "success", message: "Successfully connected to Gcore DNS API." }
        : { status: "error", message: "Failed to connect to DNS API." };
    } catch (e: unknown) {
      const err = e as any;
      const message = err.data?.message || err.statusText || "Connection failed.";
      return { status: "error", message };
    }
  }
}
