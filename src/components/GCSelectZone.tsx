import React, { FC, useMemo } from "react";
import { Select, SelectCommonProps } from "@grafana/ui";
import { GCZoneName } from "../types";
import { createZoneOptions } from "../zonenames";

export const GCSelectZone: FC<Omit<SelectCommonProps<GCZoneName>, "options">> = (props) => {
  const options = useMemo(() => createZoneOptions(), []);
  return <Select<GCZoneName> {...props} options={options} />;
};
