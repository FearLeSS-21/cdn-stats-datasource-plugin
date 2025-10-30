import React, { ChangeEvent, PureComponent } from "react";
import { Legend, LegacyForms, Alert } from "@grafana/ui";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { GCDataSourceOptions, GCJsonData, GCSecureJsonData } from "../types";
import { getAuthorizationValue, getHostnameValue } from "../token";

const { FormField, SecretFormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<GCDataSourceOptions> {}

interface State {
  apiKey: string;
  apiUrl: string;
}

export class GCConfigEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const secureJsonData = (props.options.secureJsonData || {}) as GCSecureJsonData;
    const jsonData = (props.options.jsonData || {}) as GCJsonData;

    this.state = {
      apiKey: secureJsonData.apiKey || "",
      apiUrl: jsonData.apiUrl || "",
    };
  }

  onApiUrlChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ apiUrl: e.target.value });
  onApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => this.setState({ apiKey: e.target.value });

  updateApiUrl = () => {
    const { onOptionsChange, options } = this.props;
    const apiUrl = getHostnameValue(this.state.apiUrl.trim());
    onOptionsChange({ ...options, jsonData: { apiUrl } });
  };

  updateApiKey = () => {
    const { onOptionsChange, options } = this.props;
    const apiKey = getAuthorizationValue(this.state.apiKey.trim());
    onOptionsChange({ ...options, secureJsonData: { apiKey } });
  };

  onResetApiKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: { ...options.secureJsonFields, apiKey: false },
      secureJsonData: { ...options.secureJsonData, apiKey: "" },
    });
  };

  render() {
    const { options } = this.props;
    const { apiKey, apiUrl } = this.state;
    const isConfigured = options.secureJsonFields?.apiKey;

    return (
      <>
        <Legend>HTTP</Legend>
        <div className="gf-form-group">
          <FormField
            label="URL"
            labelWidth={8}
            inputWidth={20}
            placeholder="API base url"
            value={apiUrl}
            onChange={this.onApiUrlChange}
            onBlur={this.updateApiUrl}
            required
          />
        </div>

        <div className="gf-form-group">
          <SecretFormField
            isConfigured={!!isConfigured}
            label="API key"
            placeholder="Secure field"
            labelWidth={8}
            inputWidth={20}
            value={apiKey}
            onChange={this.onApiKeyChange}
            onBlur={this.updateApiKey}
            onReset={this.onResetApiKey}
          />
        </div>

        <div className="gf-form-group">
          <Alert severity="info" title="How to create an API token?">
            <a
              href="https://gcore.com/docs/account-settings/create-use-or-delete-a-permanent-api-token"
              target="_blank"
              rel="noreferrer"
            >
              https://gcore.com/docs/account-settings/create-use-or-delete-a-permanent-api-token
            </a>
          </Alert>
        </div>
      </>
    );
  }
}
