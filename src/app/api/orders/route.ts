import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getEstimatedDeliveryDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let orders = db.getAllOrders();
    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = "user-default",
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: "No items provided in order" }, { status: 400 });
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode) {
      return NextResponse.json({ success: false, error: "Valid shipping address is required" }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    let discount = 0;

    const validatedItems = items.map((item: any) => {
      const product = db.getProductById(item.productId);
      const price = item.price || product?.price || 0;
      const originalPrice = product?.originalPrice || price;
      const qty = item.quantity || 1;

      subtotal += price * qty;
      discount += (originalPrice - price) * qty;

      return {
        productId: item.productId,
        title: item.title || product?.title || "Item",
        brand: item.brand || product?.brand || "Brand",
        thumbnail: item.thumbnail || product?.thumbnail || "",
        variantName: item.variantName,
        quantity: qty,
        price,
        sellerId: product?.seller.id || "seller-retailnet",
        sellerName: product?.seller.name || "RetailNet SuperStore",
      };
    });

    let couponDiscount = 0;
    if (couponCode) {
      const coupon = db.getCoupon(couponCode);
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === "FIXED") {
          couponDiscount = coupon.discountValue;
        } else {
          couponDiscount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
        }
      }
    }

    const deliveryFee = 0; // Free delivery
    const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);
    const expectedDelivery = getEstimatedDeliveryDate(2);

    const order = db.createOrder({
      userId,
      customerName: customerName || shippingAddress.fullName,
      customerEmail: customerEmail || "customer@example.com",
      customerPhone: customerPhone || shippingAddress.phone,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: paymentMethod === "COD" ? "COD_PENDING" : "PAID",
      subtotal,
      discount,
      couponCode,
      couponDiscount,
      deliveryFee,
      totalAmount,
      expectedDeliveryDate: expectedDelivery,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
