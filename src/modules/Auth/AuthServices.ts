import * as moltin from "@moltin/sdk";
import axios from "src/utils/axios";
import { config } from "src/config";
import { moltinParam } from "src/services";
import { safeLsSet } from "src/utils/safeLS";

const MoltinGateway = moltin.gateway;

export async function loadCustomerAuthenticationSettings(): Promise<any> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  return moltin.AuthenticationSettings.Get();
}

export async function loadOidcProfiles(
  realmId: string
): Promise<moltin.ResourcePage<moltin.Profile>> {
  const moltin = MoltinGateway({
    client_id: config.clientId,
    host: config.endpointURL,
  });

  return moltin.OidcProfile.All(realmId);
}

export async function getToken(): Promise<any> {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("grant_type", "implicit");
    bodyFormData.append("client_id", config.clientId);

    console.log(bodyFormData);

    //eslint-disable-next-line
    const response: any = await axios.post(
      `https://${config.endpointURL}/oauth/access_token`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response) {
      const credentials = {
        client_id: config.clientId,
        access_token: response["access_token"],
        expires: response["expires"],
      };

      safeLsSet("moltinCredentials", JSON.stringify(credentials));
    }
  } catch (err) {
    console.log(err);
  }
}

export async function loadCurrencySetting(): Promise<any> {
  const moltin = MoltinGateway(moltinParam);

  const { data } = await moltin.Currencies.All();

  return data.find((x) => x.default && x.enabled);
}
