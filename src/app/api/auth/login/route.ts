import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneOrEmail, role = "customer", otp } = body;

    if (!phoneOrEmail || !phoneOrEmail.trim()) {
      return NextResponse.json(
        { success: false, error: "Mobile number or email is required" },
        { status: 400 }
      );
    }

    const trimmed = phoneOrEmail.trim();
    const isEmail = trimmed.includes("@");

    // Generate token
    const token = crypto
      .createHash("sha256")
      .update(`${trimmed}-${Date.now()}-${process.env.JWT_SECRET || "bharatkart_secret"}`)
      .digest("hex");

    const user = {
      id: `usr_${crypto.randomBytes(6).toString("hex")}`,
      name: isEmail ? trimmed.split("@")[0] : `Customer (+91 ${trimmed.slice(-4)})`,
      email: isEmail ? trimmed : `${trimmed}@customer.bharatkart.com`,
      phone: isEmail ? "+91 98765 43210" : trimmed,
      role: role as "customer" | "seller" | "admin",
      createdAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user,
      token,
      message: "Authentication successful",
    });

    // Set secure HTTP-only cookie
    response.cookies.set("bharatkart_auth_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
