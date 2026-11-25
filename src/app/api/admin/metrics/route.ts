import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = db.getAllProducts();
    const orders = db.getAllOrders();
    const sellers = db.getAllSellers();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const lowStockProducts = products.filter((p) => p.stockCount <= 15);
    const marketplaceCommission = Math.round(totalRevenue * 0.1); // 10% marketplace take rate

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        totalProducts: products.length,
        totalSellers: sellers.length,
        marketplaceCommission,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders: orders.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
