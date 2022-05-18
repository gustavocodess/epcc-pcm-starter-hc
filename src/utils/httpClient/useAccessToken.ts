import { safeLsGet } from "../safeLS";

export function useAccessToken() {
  try {
    const moltinCredentials = JSON.parse(
      safeLsGet("moltinCredentials") || ""
    );
    if (moltinCredentials.access_token) return moltinCredentials.access_token;
    return null;
  } catch (error) {
    return null;
  }
}

export function getCredentialStore() {
  try {
    const moltinCredentials = JSON.parse(
      safeLsGet("moltinCredentials") || ""
    );

    return moltinCredentials;
  } catch (error) {
    return {};
  }
}
