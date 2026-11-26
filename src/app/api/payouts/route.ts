import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId") || undefined;

    const payouts = db.getPayouts(sellerId);
    return NextResponse.json({ success: true, payouts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sellerId, amount } = body;

    if (!sellerId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "sellerId and a positive amount are required" },
        { status: 400 }
      );
    }

    const financials = db.getSellerFinancials(sellerId);
    if (amount > financials.availableBalance) {
      return NextResponse.json(
        {
          success: false,
          error: `Requested amount exceeds available balance (₹${financials.availableBalance.toLocaleString()})`,
        },
        { status: 400 }
      );
    }

    const payout = db.requestPayout(sellerId, amount);
    return NextResponse.json({ success: true, payout }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, utr, settlementMethod = "NEFT", verifiedBy = "admin@bharatkart.com" } = body;

    if (!id || !utr) {
      return NextResponse.json(
        { success: false, error: "Payout id and Banking UTR reference are required" },
        { status: 400 }
      );
    }

    const cleanUtr = utr.trim().toUpperCase();

    // Strict Banking UTR Validation (RBI standard: 12-24 alphanumeric chars)
    if (!/^[A-Z0-9]{12,24}$/.test(cleanUtr)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Banking UTR format. A valid RBI NEFT/RTGS/IMPS transaction reference must be between 12 and 24 alphanumeric characters (e.g. CMS991188220011).",
        },
        { status: 400 }
      );
    }

    const payout = db.processPayout(id, cleanUtr, settlementMethod, verifiedBy);
    if (!payout) {
      return NextResponse.json({ success: false, error: "Payout not found or already settled" }, { status: 404 });
    }

    return NextResponse.json({ success: true, payout });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
