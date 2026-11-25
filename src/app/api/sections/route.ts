import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const sections = isAdmin ? db.getAllSectionsAdmin() : db.getAllSections();

    // Expand product objects for each section
    const allProducts = db.getAllProducts();
    const enrichedSections = sections.map((sec) => {
      const sectionProducts = sec.productIds
        .map((pid) => allProducts.find((p) => p.id === pid))
        .filter(Boolean);
      return {
        ...sec,
        products: sectionProducts,
      };
    });

    return NextResponse.json({ success: true, sections: enrichedSections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.productIds) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, productIds" },
        { status: 400 }
      );
    }
    const section = db.addSection({
      title: body.title,
      subtitle: body.subtitle || "",
      dealTag: body.dealTag || "Best Deals",
      type: body.type || "carousel",
      productIds: body.productIds,
      viewAllLink: body.viewAllLink || "/search",
      order: body.order || 99,
      active: body.active ?? true,
    });
    return NextResponse.json({ success: true, section }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
