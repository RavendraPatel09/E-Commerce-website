import { NextRequest, NextResponse } from "next/server";
import { lookupPincode, getEstimatedDeliveryDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("code");

    if (!pincode) {
      return NextResponse.json({ success: false, error: "Pincode is required" }, { status: 400 });
    }

    const info = lookupPincode(pincode);
    const estimatedDate = getEstimatedDeliveryDate(info.deliveryDays);

    return NextResponse.json({
      success: true,
      pincode: info.pincode,
      city: info.city,
      state: info.state,
      deliveryDays: info.deliveryDays,
      estimatedDeliveryDate: estimatedDate,
      freeDelivery: true,
      codAvailable: info.codAvailable,
      expressAvailable: info.expressAvailable,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
