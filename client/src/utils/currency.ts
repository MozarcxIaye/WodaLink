export const USD_TO_NPR_RATE = 152.5;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNpr(amount: number): string {
  return `NRs ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function usdToNpr(usd: number): number {
  return usd * USD_TO_NPR_RATE;
}
