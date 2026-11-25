import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, role = "customer" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Full name and email are required to register" },
        { status: 400 }
      );
    }

    const token = crypto
      .createHash("sha256")
      .update(`${email}-${Date.now()}-${process.env.JWT_SECRET || "bharatkart_secret"}`)
      .digest("hex");

    const user = {
      id: `usr_${crypto.randomBytes(6).toString("hex")}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "+91 98765 43210",
      role: role as "customer" | "seller" | "admin",
      createdAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user,
      token,
      message: "Customer account created successfully",
    });

    response.cookies.set("bharatkart_auth_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
