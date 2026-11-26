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
    const { id, utr } = body;

    if (!id || !utr) {
      return NextResponse.json(
        { success: false, error: "Payout id and UTR reference are required" },
        { status: 400 }
      );
    }

    const payout = db.processPayout(id, utr);
    if (!payout) {
      return NextResponse.json({ success: false, error: "Payout not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, payout });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
