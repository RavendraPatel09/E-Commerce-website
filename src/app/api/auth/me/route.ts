import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("bharatkart_auth_token")?.value;

    // Default authenticated customer session
    const defaultUser = {
      id: "user-1",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      role: "customer",
      superCoins: 480,
      isPlusMember: true,
      createdAt: "2024-01-15T10:00:00.000Z",
    };

    return NextResponse.json({
      success: true,
      user: defaultUser,
      isAuthenticated: true,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
