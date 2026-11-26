import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let sellers = db.getAllSellers();
    if (status) {
      sellers = sellers.filter((s) => s.status === status);
    }

    return NextResponse.json({ success: true, sellers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Business name, email, and phone number are required" },
        { status: 400 }
      );
    }

    const seller = db.createSeller({
      userId: body.userId || `user-seller-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      gstin: body.gstin || "29AAAAA0000A1Z5",
      pan: body.pan || "AAAAA0000A",
      bankDetails: body.bankDetails || {
        accountNumber: "987654321012",
        ifsc: "HDFC0001234",
        bankName: "HDFC Bank",
        accountHolder: body.name,
      },
      pickupAddress: body.pickupAddress || {
        addressLine: "Shop 12, Commercial Hub",
        city: body.city || "Bengaluru",
        state: body.state || "Karnataka",
        pincode: body.pincode || "560001",
      },
      category: body.category || "electronics",
      commissionRate: 0.1,
      city: body.city || "Bengaluru",
      state: body.state || "Karnataka",
    });

    return NextResponse.json({ success: true, seller }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
