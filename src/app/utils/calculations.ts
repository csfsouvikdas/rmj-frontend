import { ProfitType } from '../types';

/**
 * Updated Calculation Logic:
 * 1. Net Gold Used = Total Delivered - Stone Weight
 * 2. Fine Gold = Net Gold Used * Quality
 */
export function calculateGoldOrder(
  totalDelivered: number,
  stoneWeight: number,
  quality: number
): {
  netGoldUsed: number;
  fineGold: number;
} {
  // Ensure we don't have negative numbers
  const netGoldUsed = Math.max(0, totalDelivered - stoneWeight);
  const fineGold = netGoldUsed * quality;

  return {
    netGoldUsed: Number(netGoldUsed.toFixed(3)),
    fineGold: Number(fineGold.toFixed(3)),
  };
}

// Fixed to handle undefined/null values to prevent "toFixed" errors
export function formatGoldWeight(grams: number | undefined | null): string {
  if (grams === undefined || grams === null || isNaN(grams)) {
    return '0.000g';
  }
  return `${grams.toFixed(3)}g`;
}

export function formatCurrency(amount: number | undefined | null): string {
  const value = amount ?? 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function isOrderOverdue(expectedDate: string): boolean {
  if (!expectedDate) return false;
  const expected = new Date(expectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expected.setHours(0, 0, 0, 0);
  return expected < today;
}

export function formatDate(date: string): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isToday(date: string): boolean {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}