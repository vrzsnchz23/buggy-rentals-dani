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

/**
 * The fleet, and the single source of truth for what each vehicle costs.
 *
 * Every price shown anywhere on the site — cards, the pricing page, the
 * calculator, the sticky bar, the OG image, JSON-LD, llms.txt — reads from
 * here. Changing a rate should be a one-line edit in this object.
 *
 * Key order is display order: Sedan → Buggy → Jimny, with the buggy flagged
 * as the popular pick.
 *
 * The object KEYS are storage identifiers, not labels. `compact` stays
 * `compact` even though the car is now called a Sedan, because the key is
 * written into the `items` JSON of every booking already in the database;
 * renaming it would orphan that history. Only `label`/`labelEs` changed.
 */
export const VEHICLES = {
  compact: {
    label: "Sedan",
    labelEs: "Sedán",
    price: 79,
    stock: 5,
    deposit: 25,
    emoji: "🚘",
    description: "Up to 5 people · Air conditioning",
    descriptionEs: "Hasta 5 personas · Aire acondicionado",
    popular: false,
  },
  buggy: {
    label: "Open-Air Buggy",
    labelEs: "Buggy Descapotable",
    price: 99,
    stock: 10,
    deposit: 25,
    emoji: "🚗",
    description: "Up to 5 people · Open air · No A/C",
    descriptionEs: "Hasta 5 personas · Aire libre · Sin A/C",
    popular: true,
  },
  jimny: {
    label: "Suzuki Jimny 4x4",
    labelEs: "Suzuki Jimny 4x4",
    price: 119,
    stock: 1,
    deposit: 25,
    emoji: "🚙",
    description: "Up to 5 people · 4x4 · Air conditioning",
    descriptionEs: "Hasta 5 personas · 4x4 · Aire acondicionado",
    popular: false,
  },
} as const;

/** Display order for any surface that lists the whole fleet. */
export const VEHICLE_ORDER = ["compact", "buggy", "jimny"] as const;

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
