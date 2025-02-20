import axios from "axios";
import { QualityGate } from "./models";

export const fetchQualityGate = async (
  url: string,
  projectKey: string,
  token: string,
  branch?: string,
  pullRequest?: string
): Promise<QualityGate> => {
  let params: { projectKey: string; branch?: string; pullRequest?: string } = { projectKey };

  if (pullRequest) {
    params = { projectKey: projectKey, pullRequest: pullRequest };
  } else if (branch) {
    params = { projectKey: projectKey, branch: branch };
  }

  const response = await axios.get<QualityGate>(
    `${url}/api/qualitygates/project_status`,
    {
      params,
      auth: {
        username: token,
        password: "",
      },
    }
  );

  return response.data;
};
