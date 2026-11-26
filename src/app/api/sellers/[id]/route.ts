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
    return NextResponse.json({ success: true, seller });
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
    const { action, status, rejectionReason, ...updates } = body;

    if (action === "verify" || action === "reject" || status) {
      const targetStatus = action === "verify" ? "VERIFIED" : action === "reject" ? "REJECTED" : status;
      const updated = db.verifySeller(params.id, targetStatus, rejectionReason);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, seller: updated });
    }

    const updated = db.updateSeller(params.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, seller: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
