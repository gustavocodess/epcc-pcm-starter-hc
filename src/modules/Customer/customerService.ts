import { config } from "src/config";
import { MoltinGateway } from "src/services";
import { safeLsGet, safeLsSet } from "src/utils/safeLS";

export const setCustomer = (customer: string, token: string) => {
  safeLsSet("mcustomer", customer);
  safeLsSet("mtoken", token);
};

export const clearCustomer = () => {
  safeLsSet("mcustomer", "");
  safeLsSet("mtoken", "");
};

export const getCustomerToken = () => {
  const customer = safeLsGet("mcustomer") || "";
  const token = safeLsGet("mtoken") || "";

  return {
    customer,
    token,
  };
};

export async function getCustomer(
  id: string,
  token: string
): Promise<moltin.CustomerBase> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });
  const { data } = await moltin.Customers.Get(id, token);

  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<moltin.CustomerBase> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });
  const { data } = await moltin.Customers.Create({
    type: "customer",
    name,
    email,
    password,
  });

  return data;
}

export async function login(
  email: string,
  password: string
): Promise<moltin.CustomerToken> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });
  const { data } = await moltin.Customers.TokenViaPassword(email, password);

  return data;
}

export async function getAddresses(
  customer: string,
  token: string
): Promise<{
  data: moltin.CustomerAddress[];
}> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });

  const result = await moltin.CustomerAddresses.All({ customer, token });

  return result;
}

export async function addCustomerAssociation(
  cartId: string,
  customerId: string,
  token: string
) {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });
  const result = await moltin
    .Cart(cartId)
    .AddCustomerAssociation(customerId, token);
  return result;
}
