import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getEstimatedDeliveryDate } from "@/lib/utils";
import { razorpay } from "@/lib/razorpay";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let orders = db.getAllOrders();
    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }

    // Sort by latest order first
    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = "user-1",
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      paymentMethod = "COD",
      couponCode,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    // 1. Basic validation
    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, error: "No items provided in order" },
        { status: 400 }
      );
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode) {
      return NextResponse.json(
        { success: false, error: "A complete shipping address with pincode is required" },
        { status: 400 }
      );
    }

    // 2. Strict Inventory Validation
    const allProducts = db.getAllProducts();
    for (const item of items) {
      const product = allProducts.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} was not found in catalog` },
          { status: 400 }
        );
      }
      if (!product.inStock || product.stockCount < (item.quantity || 1)) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for "${product.title}". Only ${product.stockCount} units remaining in inventory.`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Payment Verification
    let finalPaymentStatus: "PAID" | "PENDING" | "COD_PENDING" | "REFUNDED" = "COD_PENDING";
    let finalPaymentId = razorpayPaymentId || undefined;

    if (paymentMethod === "RAZORPAY") {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Payment verification failed: Missing required Razorpay credentials (orderId, paymentId, signature)",
          },
          { status: 400 }
        );
      }

      // Cryptographic server-side verification
      const isSignatureValid = razorpay.verifySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });

      if (!isSignatureValid) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid Razorpay payment signature. Payment could not be verified on the server.",
          },
          { status: 400 }
        );
      }

      finalPaymentStatus = "PAID";
    } else if (paymentMethod === "COD") {
      finalPaymentStatus = "COD_PENDING";
    } else {
      // For UPI, Card, NetBanking placed directly
      finalPaymentStatus = "PAID";
      finalPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    // 4. Calculate pricing & discounts
    let subtotal = 0;
    let discount = 0;

    const validatedItems = items.map((item: any) => {
      const product = allProducts.find((p) => p.id === item.productId);
      const price = item.price || product?.price || 0;
      const originalPrice =
        (item.variantId && product?.variants?.find((v: any) => v.id === item.variantId)?.originalPrice) ||
        product?.originalPrice ||
        price;
      const qty = item.quantity || 1;

      subtotal += price * qty;
      discount += Math.max(0, (originalPrice - price) * qty);

      const displayTitle = item.variantName
        ? `${product?.title || item.title} (${item.variantName})`
        : item.title || product?.title || "Item";

      return {
        productId: item.productId,
        title: displayTitle,
        brand: item.brand || product?.brand || "Brand",
        thumbnail: item.thumbnail || product?.thumbnail || "",
        variantName: item.variantName,
        quantity: qty,
        price,
        sellerId: product?.seller?.id || product?.sellerId || "seller-retailnet",
        sellerName: product?.seller?.name || (product?.sellerId ? db.getSellerById(product.sellerId)?.name : "RetailNet SuperStore") || "RetailNet SuperStore",
      };
    });

    // 5. Coupon validation
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

    const deliveryFee = 0; // Free delivery across BharatKart
    const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);
    const expectedDelivery = getEstimatedDeliveryDate(2);

    // 6. Persist Order (inventory deduction is handled atomically inside db.createOrder)
    const order = db.createOrder({
      userId,
      customerName: customerName || shippingAddress.fullName,
      customerEmail: customerEmail || "customer@bharatkart.com",
      customerPhone: customerPhone || shippingAddress.phone,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      paymentId: finalPaymentId,
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
