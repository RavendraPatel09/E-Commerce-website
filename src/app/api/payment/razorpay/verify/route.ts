import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required Razorpay payment verification fields (orderId, paymentId, signature)",
        },
        { status: 400 }
      );
    }

    // Strict server-side HMAC-SHA256 signature verification.
    // Never simulates successful payments without genuine cryptographic proof.
    const isValid = razorpay.verifySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed. Invalid or fraudulent Razorpay cryptographic signature.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId,
      orderId,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server error verifying payment" },
      { status: 500 }
    );
  }
}
