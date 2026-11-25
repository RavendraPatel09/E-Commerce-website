import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase().trim();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: [
          { type: "trending", text: "iPhone 15 Pro", category: "mobiles" },
          { type: "trending", text: "Sony Headphones", category: "electronics" },
          { type: "trending", text: "Air Fryer XXL", category: "appliances" },
          { type: "trending", text: "Running Shoes", category: "fashion" },
        ],
      });
    }

    const all = db.getAllProducts();
    const suggestions: { type: "product" | "brand" | "category"; text: string; link: string; category?: string }[] = [];

    // Check matching product titles
    all.forEach((p) => {
      if (p.title.toLowerCase().includes(query)) {
        if (suggestions.length < 6) {
          suggestions.push({
            type: "product",
            text: p.title,
            link: `/product/${p.id}`,
            category: p.category,
          });
        }
      }
    });

    // Check matching brands
    const brands = Array.from(new Set(all.map((p) => p.brand)));
    brands.forEach((b) => {
      if (b.toLowerCase().includes(query) && suggestions.length < 8) {
        suggestions.push({
          type: "brand",
          text: `${b} in Electronics & Mobiles`,
          link: `/search?brand=${encodeURIComponent(b)}`,
        });
      }
    });

    return NextResponse.json({ success: true, suggestions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
