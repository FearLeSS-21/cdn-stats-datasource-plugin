import defaults from "lodash/defaults";
import React, { PureComponent, ChangeEvent } from "react";
import { LegacyForms } from "@grafana/ui";
import { QueryEditorProps, SelectableValue } from "@grafana/data";
import { DataSource } from "../datasource";
import {
  GCDataSourceOptions,
  GCGranularity,
  GCQuery,
  GCMetric,
  GCDNSRecordType,
  GCZoneName,
} from "../types";
import { GCSelectMetric } from "./GCSelectMetric";
import { GCSelectGranularity } from "./GCSelectGranularity";
import { GCSelectRecordType } from "./GCSelectRecordType";
import { GCSelectZone } from "./GCSelectZone";
import { GCInput } from "./GCInput";
import { defaultQuery } from "../defaults";
import { createOptionForZone } from "../zonenames";

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, GCQuery, GCDataSourceOptions>;

export class GCQueryEditor extends PureComponent<Props> {
  onZoneChange = (value: SelectableValue<GCZoneName>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, zone: value?.value });
    onRunQuery();
  };

  onMetricChange = (value: SelectableValue<GCMetric>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, metric: value });
    onRunQuery();
  };

  onGranularityChange = (value: SelectableValue<GCGranularity>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, granularity: value });
    onRunQuery();
  };

  onRecordTypeChange = (value: SelectableValue<GCDNSRecordType>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, record_type: value?.value });
    onRunQuery();
  };

  onLegendFormatChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, legendFormat: event.target.value });
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { zone, metric, granularity, record_type, legendFormat } = query;

    const selectedGranularity =
      granularity?.value && Object.values(GCGranularity).includes(granularity.value as GCGranularity)
        ? (granularity as SelectableValue<GCGranularity>)
        : undefined;

    const selectedZone = zone ? createOptionForZone(zone as GCZoneName) : undefined;

    return (
      <>
        <div className="section" style={{ marginRight: "27px" }}>
          <label className="gf-form-group-label">Query</label>

          <div className="gf-form">
            <FormField
              label="Zone"
              inputEl={
                <GCSelectZone
                  width={20}
                  isSearchable
                  maxVisibleValues={20}
                  minMenuHeight={25}
                  menuPlacement="bottom"
                  onChange={this.onZoneChange}
                  value={selectedZone}
                />
              }
            />
          </div>

          <div className="gf-form">
            <FormField
              label="Metric"
              inputEl={
                <GCSelectMetric
                  width={20}
                  isSearchable
                  maxVisibleValues={20}
                  minMenuHeight={45}
                  menuPlacement="bottom"
                  onChange={this.onMetricChange}
                  value={metric}
                />
              }
            />
          </div>

          <div className="gf-form">
            <FormField
              label="Granularity"
              tooltip="Time series granularity"
              inputEl={
                <GCSelectGranularity
                  width={20}
                  maxVisibleValues={20}
                  minMenuHeight={25}
                  menuPlacement="bottom"
                  onChange={this.onGranularityChange}
                  value={selectedGranularity}
                />
              }
            />
          </div>

          <div className="gf-form">
            <FormField
              label="Record"
              tooltip="Select DNS record type or leave empty for all"
              inputEl={
                <GCSelectRecordType
                  width={20}
                  isSearchable
                  maxVisibleValues={20}
                  minMenuHeight={25}
                  menuPlacement="bottom"
                  onChange={this.onRecordTypeChange}
                  value={record_type ? { value: record_type, label: record_type } : undefined}
                />
              }
            />
          </div>
        </div>

        <div className="section" style={{ marginRight: "27px" }}>
          <div className="gf-form">
            <GCInput
              inputWidth={30}
              value={legendFormat}
              onChange={this.onLegendFormatChange}
              label="Legend"
              placeholder="legend format"
              tooltip="Controls the name of the time series. Use placeholders like {{zone}} or {{record_type}}."
              type="text"
            />
          </div>
        </div>
      </>
    );
  }
}
