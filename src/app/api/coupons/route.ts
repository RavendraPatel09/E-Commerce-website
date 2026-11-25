import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = db.getCoupon(code);
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon code. Try WELCOME200, FESTIVE10 or FLIPDEAL" },
        { status: 400 }
      );
    }

    const currentTotal = Number(orderTotal) || 0;
    if (currentTotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString("en-IN")}`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === "FIXED") {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((currentTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discount,
      description: coupon.description,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
