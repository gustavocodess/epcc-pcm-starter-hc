import * as moltin from "@moltin/sdk";
import { config } from "src/config";
import { safeLsGet } from "./safeLS";

export function isProductAvailable(product: moltin.Product): boolean {
  // we assume that product is available if we are not managing the stock
  return (
    !product.manage_stock || product.meta?.stock?.availability === "in-stock"
  );
}

export function formatMoney(value: number): string {
  try {
    const currency = Number(safeLsGet("decimal_places"));

    const format = value / Math.pow(10, currency);
    return "$" + format.toFixed(currency).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } catch (err) {
    return `${value}`;
  }
}

export function formatPrice(value: number): number {
  try {
    const currency = Number(safeLsGet("decimal_places"));

    return value / Math.pow(10, currency);
  } catch (err) {
    return value;
  }
}

export function correctFreeShipping() {
  const setting = config.freeShipping;
  try {
    const currency = Number(safeLsGet("decimal_places"));

    return setting * Math.pow(10, currency);
  } catch (err) {
    return setting;
  }
}

export function correctShippingFee() {
  const setting = config.shippingFee;
  try {
    const currency = Number(safeLsGet("decimal_places"));

    return setting * Math.pow(10, currency);
  } catch (err) {
    return setting;
  }
}

export function formatProductMatrix(
  data: any,
  results: any = [],
  tempResults: any = []
) {
  if (typeof data === "string") {
    results.push([...tempResults, data]);
  }

  if (typeof data === "object") {
    for (const [id, value] of Object.entries(data)) {
      formatProductMatrix(value, results, [...tempResults, id]);
    }
  }

  return results;
}
