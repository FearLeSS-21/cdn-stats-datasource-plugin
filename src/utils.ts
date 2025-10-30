import {
  FieldType,
  formatLabels,
  getDisplayProcessor,
  Labels,
  MutableField,
  TIME_SERIES_TIME_FIELD_NAME,
  TIME_SERIES_VALUE_FIELD_NAME,
  toDataFrame,
  ScopedVars,
  MetricFindValue,
} from "@grafana/data";
import { getTemplateSrv } from "@grafana/runtime";
import { GCPoint, GCQuery } from "./types";
import { TimeInSeconds } from "./times";

export const renderTemplate = (aliasPattern: string, aliasData: Record<string, string>): string =>
  aliasPattern.replace(/\{\{\s*(.+?)\s*\}\}/g, (_match, g1) => aliasData[g1] || "");

export const getTimeField = (data: GCPoint[], isMs = false): MutableField => ({
  name: TIME_SERIES_TIME_FIELD_NAME,
  type: FieldType.time,
  config: {},
  values: data.map((val) => (isMs ? val[0] : val[0] * TimeInSeconds.MILLISECOND)),
});

export const getEmptyDataFrame = () =>
  toDataFrame({
    name: "empty",
    fields: [],
  });

export type ValueFieldOptions = {
  data?: GCPoint[];
  valueName?: string;
  labels?: Labels;
  unit?: string;
  decimals?: number;
  displayNameFromDS?: string;
  transform?: (value: number) => number;
};

export const getValueField = ({
  data = [],
  valueName = TIME_SERIES_VALUE_FIELD_NAME,
  decimals = 2,
  labels,
  unit,
  displayNameFromDS,
  transform,
}: ValueFieldOptions): MutableField => ({
  labels,
  name: valueName,
  type: FieldType.number,
  display: getDisplayProcessor(),
  config: {
    unit,
    decimals,
    displayNameFromDS,
    displayName: displayNameFromDS,
  },
  values: data.map((val) => (transform ? transform(val[1]) : val[1])),
});

export interface LabelInfo {
  name: string;
  labels: Labels;
}

export const createLabelInfo = (labels: Labels, query: GCQuery, scopedVars: ScopedVars): LabelInfo => {
  if (query?.legendFormat) {
    const title = renderTemplate(getTemplateSrv().replace(query.legendFormat, scopedVars), labels);
    return { name: title, labels };
  }
  const { metric, ...labelsWithoutMetric } = labels;
  const labelPart = formatLabels(labelsWithoutMetric);
  const title = metric ? `${metric} ${labelPart}` : labelPart;
  return { name: title, labels: labelsWithoutMetric };
};

export const getValueVariable = (target: Array<string | number>): MetricFindValue[] =>
  Array.from(new Set(target)).map((text) => ({ text: `${text}` }));
