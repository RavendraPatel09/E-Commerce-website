import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seller = db.getSellerById(params.id);
    if (!seller) {
      return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
    }

    const sellerOrders = db.getSellerOrders(params.id);

    return NextResponse.json({
      success: true,
      orders: sellerOrders,
      totalOrders: sellerOrders.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { orderId, productId, status, trackingNumber, courierPartner } = body;

    if (!orderId || !productId || !status) {
      return NextResponse.json(
        { success: false, error: "orderId, productId, and status are required" },
        { status: 400 }
      );
    }

    const updated = db.updateOrderItemStatus(
      orderId,
      productId,
      status,
      trackingNumber,
      courierPartner
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Could not update order item. Check orderId and productId." },
        { status: 404 }
      );
    }

    const order = db.getOrderById(orderId);
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
