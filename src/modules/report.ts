import { Context } from "@actions/github/lib/context";
import { Condition, QualityGate } from "./models";
import {
  formatMetricKey,
  getStatusEmoji,
  getComparatorSymbol,
  trimTrailingSlash,
  formatStringNumber,
} from "./utils";

const buildRow = (condition: Condition) => {
  const rowValues = [
    formatMetricKey(condition.metricKey), // Metric
    getStatusEmoji(condition.status), // Status
    formatStringNumber(condition.actualValue), // Value
    `${getComparatorSymbol(condition.comparator)} ${condition.errorThreshold}`, // Error Threshold
  ];

  return "|" + rowValues.join("|") + "|";
};

export const buildReport = (
  result: QualityGate,
  hostURL: string,
  projectKey: string,
  context: Context
) => {
  const projectURL = trimTrailingSlash(hostURL) + `/dashboard?id=${projectKey}`;
  const projectStatus = getStatusEmoji(result.projectStatus.status);

  const resultTable = result.projectStatus.conditions.map(buildRow).join("\n");

  const { updatedDate, updatedOffset } = (() => {
    const currentDate = new Date();
    const offset = -(currentDate.getTimezoneOffset() / 60);
    const offsetSign = offset >= 0 ? "+" : "-";

    return {
      updatedDate: currentDate.toLocaleString(),
      updatedOffset: `UTC${offsetSign}${offset}`,
    };
  })();

  return `### SonarQube Quality Gate Result
- **Result**: ${projectStatus}
- Triggered by @${context.actor} on \`${context.eventName}\`

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
${resultTable}

[View on SonarQube](${projectURL})
###### _updated: ${updatedDate} (${updatedOffset})_`;
};
