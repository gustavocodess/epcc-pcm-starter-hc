import axios from "axios";
import { getToken } from "src/modules/Auth/AuthServices";
import { useAccessToken } from "src/utils/httpClient/useAccessToken";

let refreshTokenRequest: any = null;

// Create new axios instance
const instance = axios.create();

// Add a request interceptor
instance.interceptors.request.use((config: any) => {
  // Token
  const token = useAccessToken();
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  return config;
});

// Add a response interceptor
instance.interceptors.response.use(
  async (response) => {
    const { data } = response;

    return data;
  },
  async (error) => {
    const { response, config = {} } = error;

    if (response?.status === 401) {
      refreshTokenRequest = refreshTokenRequest
        ? refreshTokenRequest
        : getToken();

      await refreshTokenRequest;
      refreshTokenRequest = null;
      return instance(config);
    }
    return Promise.reject(error);
  }
);

export default instance;
