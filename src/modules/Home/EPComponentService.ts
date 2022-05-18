import { config, isInternal, NAVIGATOR_CONTEXT_TAG } from "../../config";
import axios from "src/utils/axios";

const REACT_APP_NAVIGATOR_URL_ENDPOINT = `https://${config.endpointURL}/catalog/hierarchies`;
const REACT_APP_END_POINT_V2 = `https://${config.endpointURL}/v2`;

export const getTopNavigater = async () => {
  const response = await axios.get(REACT_APP_NAVIGATOR_URL_ENDPOINT, {
    headers: {
      "EP-Context-Tag": NAVIGATOR_CONTEXT_TAG,
    },
  });

  return response;
};

export const getTopNavigaterNode = async (hierarchyId: string) => {
  const response: any = await axios.get(
    `${REACT_APP_NAVIGATOR_URL_ENDPOINT}/${hierarchyId}/children`,
    {
      headers: {
        "EP-Context-Tag": NAVIGATOR_CONTEXT_TAG,
      },
    }
  );
  return response;
};

export const getTopNavigaterNodeItem = async (nodeId: string) => {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalog/nodes/${nodeId}/relationships/children`,
    {
      headers: {
        "EP-Context-Tag": NAVIGATOR_CONTEXT_TAG,
      },
    }
  );
  return response;
};

export const getComponent = async (component_id: string) => {
  const url = `${REACT_APP_END_POINT_V2}/flows/${
    isInternal() ? "component-config-3layers" : "component-config"
  }/entries/${component_id}?include=${
    isInternal() ? "component-details-3layers" : "component-details"
  }`;

  const response = await axios.get(url);
  return response;
};
