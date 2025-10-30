import defaults from "lodash/defaults";
import React, { useState, useMemo } from "react";
import { Select } from "@grafana/ui";
import { SelectableValue } from "@grafana/data";
import {
  GCVariable,
  GCVariableQuery,
  GCZoneName,
  GCDNSRecordType,
  GCMetric,
  GCGranularity,
} from "../types";
import { defaultVariableQuery } from "../defaults";
import { GCSelectZone } from "./GCSelectZone";
import { GCSelectRecordType } from "./GCSelectRecordType";
import { GCSelectMetric } from "./GCSelectMetric";
import { GCSelectGranularity } from "./GCSelectGranularity";
import { createOptions } from "../metric"; // For metrics options

type SelectorState = SelectableValue<GCVariable> & {
  selected?: GCZoneName | GCDNSRecordType | GCMetric | GCGranularity;
};

export interface GCVariableQueryProps {
  query: GCVariableQuery;
  onChange: (query: GCVariableQuery, definition: string) => void;
}

export const GCVariableQueryEditor: React.FC<GCVariableQueryProps> = ({
  query: rawQuery,
  onChange,
}) => {
  const query = defaults(rawQuery, defaultVariableQuery);

  const metricOptions = useMemo(() => createOptions(), []);

  // ---------- CHANGE 1 ----------
  // Initialize selector.selected for Metric to first metric if undefined
  const [selector, setSelector] = useState<SelectorState>({
    value: query.selector?.value ?? GCVariable.Zone,
    label: query.selector?.label,
    selected:
      query.selector?.selected ??
      (query.selector?.value === GCVariable.Metric ? metricOptions[0]?.value : undefined),
  });

  const handleVariableTypeChange = (sel: SelectableValue<GCVariable>) => {
    const newSelector: SelectorState = { value: sel.value!, label: sel.label, selected: undefined };
    setSelector(newSelector);
    onChange({ ...query, selector: newSelector }, sel.label || "");
  };

  const handleValueChange = <
    T extends GCZoneName | GCDNSRecordType | GCMetric | GCGranularity
  >(sel: SelectableValue<T>) => {
    const newSelector: SelectorState = { ...selector, selected: sel.value };
    setSelector(newSelector);
    onChange({ ...query, selector: newSelector }, sel.label || "");
  };

  const renderValueSelector = () => {
    switch (selector.value) {
      case GCVariable.Zone:
        return (
          <GCSelectZone
            value={selector.selected as GCZoneName | undefined}
            onChange={handleValueChange}
          />
        );
      case GCVariable.RecordType:
        return (
          <GCSelectRecordType
            value={selector.selected as GCDNSRecordType | undefined}
            onChange={handleValueChange}
          />
        );
      case GCVariable.Metric:
        // ---------- CHANGE 2 ----------
        // Provide fallback to first metric if selector.selected is undefined
        const selectedMetric: SelectableValue<GCMetric> | undefined = selector.selected
          ? metricOptions.find((o) => o.value === selector.selected)
          : metricOptions[0]; // Default to first metric
        return <GCSelectMetric value={selectedMetric} onChange={handleValueChange} />;
      case GCVariable.Granularity:
        return (
          <GCSelectGranularity
            value={selector.selected as GCGranularity | undefined}
            onChange={handleValueChange}
          />
        );
      default:
        return null;
    }
  };

  const variableOptions: Array<SelectableValue<GCVariable>> = useMemo(
    () => [
      { value: GCVariable.Zone, label: "Zone" },
      { value: GCVariable.RecordType, label: "Record" },
      { value: GCVariable.Metric, label: "Metric" },
      { value: GCVariable.Granularity, label: "Granularity" },
    ],
    []
  );

  return (
    <div className="gf-form">
      <span className="gf-form-label width-10">Values for</span>
      <Select
        width={16}
        value={{
          value: selector.value,
          label: variableOptions.find((o) => o.value === selector.value)?.label,
        }}
        onChange={handleVariableTypeChange}
        options={variableOptions}
        menuPlacement="bottom"
      />
      <div style={{ marginTop: "6px" }}>{renderValueSelector()}</div>
    </div>
  );
};
