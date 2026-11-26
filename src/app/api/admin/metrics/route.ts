import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const products = db.getAllProducts(true);
    const orders = db.getAllOrders();
    const sellers = db.getAllSellers();
    const payouts = db.getPayouts();
    const refunds = db.getRefunds();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const lowStockProducts = products.filter((p) => p.stockCount <= 15);

    let totalCommission = 0;
    orders.forEach((o) => {
      o.items.forEach((item) => {
        totalCommission += item.commissionAmount || Math.round(item.price * item.quantity * 0.1);
      });
    });

    const pendingSellerVerifications = sellers.filter((s) => s.status === "PENDING_VERIFICATION").length;
    const pendingProductApprovals = products.filter((p) => p.approvalStatus === "PENDING_APPROVAL").length;
    const pendingPayoutRequests = payouts.filter((p) => p.status === "PENDING").length;
    const pendingRefundRequests = refunds.filter((r) => r.status === "REQUESTED").length;

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        totalProducts: products.length,
        totalSellers: sellers.length,
        activeSellers: sellers.filter((s) => s.status === "VERIFIED").length,
        pendingSellerVerifications,
        pendingProductApprovals,
        pendingPayoutRequests,
        pendingRefundRequests,
        marketplaceCommission: totalCommission,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders: orders.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
