import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date + "T12:00:00") : date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const VEHICLES = {
  buggy: {
    label: "Open-Air Buggy",
    labelEs: "Buggy Descapotable",
    price: 75,
    stock: 10,
    deposit: 25,
    emoji: "🚗",
    description: "Up to 5 people · Open air · No A/C",
    descriptionEs: "Hasta 5 personas · Aire libre · Sin A/C",
  },
  compact: {
    label: "Compact Car (A/C)",
    labelEs: "Auto Compacto (A/C)",
    price: 65,
    stock: 5,
    deposit: 25,
    emoji: "🚙",
    description: "Up to 5 people · Air conditioning",
    descriptionEs: "Hasta 5 personas · Aire acondicionado",
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;

export type CartItem = {
  type: VehicleType;
  qty: number;
  unitPrice: number;
  subtotal: number;
};

export function calcCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

export function calcCartDeposit(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty * VEHICLES[item.type].deposit, 0);
}

export function formatCartItems(items: CartItem[]): string {
  return items
    .filter((i) => i.qty > 0)
    .map((i) => `${i.qty}× ${VEHICLES[i.type].label}`)
    .join(", ");
}

export function parseItems(raw: unknown): CartItem[] {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export const DEPOSIT_PER_VEHICLE = 25;
