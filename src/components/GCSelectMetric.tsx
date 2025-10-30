import React, { FC, useMemo } from "react";
import { Select, SelectCommonProps } from "@grafana/ui";
import { SelectableValue } from "@grafana/data";
import { GCMetric } from "../types";
import { createOptions } from "../metric";

export const GCSelectMetric: FC<Omit<SelectCommonProps<GCMetric>, "options"> & {
  value?: SelectableValue<GCMetric>; // Accept SelectableValue
}> = ({ value, onChange, ...props }) => {
  const options = useMemo(() => createOptions(), []);

  return <Select {...props} options={options} value={value} onChange={onChange} />;
};
