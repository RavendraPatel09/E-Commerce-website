/**
 * Medusa Headless E-Commerce Integration Layer for BharatKart
 * Maps BharatKart Marketplace storefront to Medusa REST endpoints
 */

export interface MedusaProduct {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  handle?: string;
  variants?: any[];
}

export interface MedusaCart {
  id: string;
  items: any[];
  region_id?: string;
  total?: number;
  subtotal?: number;
}

export class MedusaClient {
  private baseUrl: string;
  private publishableKey: string;

  constructor() {
    this.baseUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
    this.publishableKey =
      process.env.MEDUSA_PUBLISHABLE_KEY || "pk_test_bharatkart_medusa_publishable_key";
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public async getProducts(): Promise<MedusaProduct[]> {
    try {
      const res = await fetch(`${this.baseUrl}/store/products`, {
        headers: {
          "x-publishable-key": this.publishableKey,
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        return data.products || [];
      }
    } catch {
      // Offline fallback
    }
    return [];
  }

  public async createCart(): Promise<MedusaCart | null> {
    try {
      const res = await fetch(`${this.baseUrl}/store/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-key": this.publishableKey,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data.cart;
      }
    } catch {
      // Offline fallback
    }
    return null;
  }
}

export const medusaClient = new MedusaClient();
