import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "sec_rzp_live_test_90ab38c18204";

    // 1. Webhook Signature Verification
    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // 2. Parse Event Payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;
    const refundEntity = payload.payload?.refund?.entity;

    // 3. Process Events Idempotently
    if (event === "payment.captured" || event === "order.paid") {
      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const orders = db.getAllOrders();
        const matchedOrder = orders.find(
          (o) => o.paymentId === paymentId || o.id === orderId
        );

        if (matchedOrder && matchedOrder.paymentStatus !== "PAID") {
          matchedOrder.paymentStatus = "PAID";
          matchedOrder.paymentId = paymentId;
          matchedOrder.currentStatus = "Order Confirmed";
        }
      }
    } else if (event === "payment.failed") {
      const paymentId = paymentEntity?.id;
      const orders = db.getAllOrders();
      const matchedOrder = orders.find((o) => o.paymentId === paymentId);
      if (matchedOrder) {
        matchedOrder.paymentStatus = "PENDING";
      }
    } else if (event === "refund.processed") {
      const refundId = refundEntity?.id;
      const paymentId = refundEntity?.payment_id;
      const allRefunds = db.getRefunds();
      const matchedRefund = allRefunds.find(
        (r) => r.paymentGatewayRefundId === refundId || r.id === refundId
      );
      if (matchedRefund) {
        db.updateRefundStatus(matchedRefund.id, "PROCESSED", undefined, refundId, refundEntity?.arn);
      }
    }

    return NextResponse.json({ success: true, status: "webhook_processed", event });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
