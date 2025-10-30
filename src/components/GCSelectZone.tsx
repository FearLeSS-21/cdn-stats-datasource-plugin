import React, { FC, useMemo } from "react";
import { Select, SelectCommonProps } from "@grafana/ui";
import { SelectValue } from "@grafana/data";
import { GCZoneName } from "../types";
import { createZoneOptions } from "../zonenames";

export const GCSelectZone: FC<Omit<SelectCommonProps<GCZoneName>, "options">> = (props) => {
  const options: Array<SelectValue<GCZoneName>> = useMemo(() => createZoneOptions(), []);
  return <Select {...props} options={options} />;
};
