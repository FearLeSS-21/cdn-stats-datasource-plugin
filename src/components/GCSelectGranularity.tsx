import React from "react";
import { Select, SelectCommonProps } from "@grafana/ui";
import { GCGranularity } from "../types";
import { createOptions } from "../granularity";

export const GCSelectGranularity: React.FC<Omit<SelectCommonProps<GCGranularity>, "options">> = (props) => {
  return <Select {...props} options={createOptions()} />;
};
