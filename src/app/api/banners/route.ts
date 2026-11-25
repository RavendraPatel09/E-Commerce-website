import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const banners = isAdmin ? db.getAllBannersAdmin() : db.getAllBanners();
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.imageUrl || !body.ctaLink) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, imageUrl, ctaLink" },
        { status: 400 }
      );
    }
    const banner = db.addBanner({
      title: body.title,
      subtitle: body.subtitle || "",
      ctaText: body.ctaText || "Shop Now",
      ctaLink: body.ctaLink,
      imageUrl: body.imageUrl,
      badge: body.badge || "SPECIAL OFFER",
      backgroundColor: body.backgroundColor || "#1c2b59",
      textColor: body.textColor || "#ffffff",
      active: body.active ?? true,
    });
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
