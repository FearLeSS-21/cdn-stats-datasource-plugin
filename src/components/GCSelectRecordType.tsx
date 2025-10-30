import React, { FC, useMemo } from "react";
import { Select, SelectCommonProps } from "@grafana/ui";
import { GCDNSRecordType } from "../types";
import { createOptions } from "../recordtype";

export const GCSelectRecordType: FC<Omit<SelectCommonProps<GCDNSRecordType>, "options">> = (props) => {
  const options = useMemo(() => createOptions(), []);
  return <Select {...props} options={options} />;
};
