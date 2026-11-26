import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId") || undefined;

    const refunds = db.getRefunds(sellerId);
    return NextResponse.json({ success: true, refunds });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, amount, reason, customerName, customerEmail } = body;

    if (!orderId || !productId || !reason) {
      return NextResponse.json(
        { success: false, error: "orderId, productId, and return reason are required" },
        { status: 400 }
      );
    }

    const order = db.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const item = order.items.find((i) => i.productId === productId);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found in order" }, { status: 404 });
    }

    const refund = db.createRefund({
      orderId,
      productId,
      sellerId: item.sellerId,
      customerName: customerName || order.customerName,
      customerEmail: customerEmail || order.customerEmail,
      amount: amount || item.price * item.quantity,
      reason,
      status: "REQUESTED",
    });

    // Update item status in order
    item.status = "RETURN_REQUESTED";

    return NextResponse.json({ success: true, refund }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Refund id and status are required" },
        { status: 400 }
      );
    }

    const refund = db.updateRefundStatus(id, status, rejectionReason);
    if (!refund) {
      return NextResponse.json({ success: false, error: "Refund not found" }, { status: 404 });
    }

    // If approved or processed, update order item status as well
    const order = db.getOrderById(refund.orderId);
    if (order) {
      const item = order.items.find((i) => i.productId === refund.productId);
      if (item) {
        if (status === "PROCESSED") {
          item.status = "REFUNDED";
        } else if (status === "REJECTED") {
          item.status = "DELIVERED";
        }
      }
    }

    return NextResponse.json({ success: true, refund });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
