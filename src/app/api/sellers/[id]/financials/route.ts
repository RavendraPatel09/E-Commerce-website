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

    const financials = db.getSellerFinancials(params.id);
    const payouts = db.getPayouts(params.id);

    return NextResponse.json({
      success: true,
      seller,
      financials,
      payouts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
