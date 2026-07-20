export const USD_TO_NPR_RATE = parseFloat(process.env.USD_TO_NPR_RATE || '152.5');

export function usdToNpr(usd: number): number {
  return usd * USD_TO_NPR_RATE;
}

export function nprToPaisa(npr: number): number {
  return Math.round(npr * 100);
}
