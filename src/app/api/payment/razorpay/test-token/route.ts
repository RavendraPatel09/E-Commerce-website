import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { success: false, error: "Both orderId and paymentId are required to generate test authorization" },
        { status: 400 }
      );
    }

    // Generate genuine HMAC-SHA256 signature using RAZORPAY_KEY_SECRET
    const signature = razorpay.generateSignature(orderId, paymentId);

    return NextResponse.json({
      success: true,
      orderId,
      paymentId,
      signature,
      algorithm: "HMAC-SHA256",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
