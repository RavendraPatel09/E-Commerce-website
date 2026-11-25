import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.toLowerCase().trim();
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const brands = searchParams.get("brand")?.split(",").map((b) => b.trim().toLowerCase()).filter(Boolean);
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
    const minDiscount = searchParams.get("minDiscount") ? Number(searchParams.get("minDiscount")) : undefined;
    const isAssured = searchParams.get("isAssured") === "true";
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const sort = searchParams.get("sort") || "relevance";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 12);

    let all = db.getAllProducts();

    // 1. Full-text search
    if (search) {
      all = all.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.brand.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.highlights.some((h) => h.toLowerCase().includes(search))
      );
    }

    // 2. Category
    if (category && category !== "all") {
      all = all.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // 3. SubCategory
    if (subCategory) {
      all = all.filter((p) => p.subCategory?.toLowerCase() === subCategory.toLowerCase());
    }

    // 4. Brands
    if (brands && brands.length > 0) {
      all = all.filter((p) => brands.includes(p.brand.toLowerCase()));
    }

    // 5. Price bounds
    if (minPrice !== undefined && !isNaN(minPrice)) {
      all = all.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      all = all.filter((p) => p.price <= maxPrice);
    }

    // 6. Rating
    if (minRating !== undefined && !isNaN(minRating)) {
      all = all.filter((p) => p.rating >= minRating);
    }

    // 7. Discount
    if (minDiscount !== undefined && !isNaN(minDiscount)) {
      all = all.filter((p) => p.discountPercentage >= minDiscount);
    }

    // 8. Assured
    if (isAssured) {
      all = all.filter((p) => p.isAssured);
    }

    // 9. In Stock Only
    if (inStockOnly) {
      all = all.filter((p) => p.inStock);
    }

    // Compute facet statistics for filter sidebar
    const rawAll = db.getAllProducts();
    const availableBrands = Array.from(new Set(rawAll.map((p) => p.brand))).sort();
    const minAvailablePrice = Math.min(...rawAll.map((p) => p.price));
    const maxAvailablePrice = Math.max(...rawAll.map((p) => p.price));

    // 10. Sorting
    switch (sort) {
      case "price_asc":
        all.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        all.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "rating":
        all.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        all.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case "popularity":
      case "relevance":
      default:
        all.sort((a, b) => b.ratingCount - a.ratingCount);
        break;
    }

    // 11. Pagination
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = all.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      total,
      totalPages,
      currentPage: page,
      limit,
      facets: {
        brands: availableBrands,
        priceRange: { min: minAvailablePrice, max: maxAvailablePrice },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.price || !body.brand || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, price, brand, category" },
        { status: 400 }
      );
    }

    const originalPrice = body.originalPrice || body.price;
    const discount = Math.round(((originalPrice - body.price) / originalPrice) * 100);

    const product = db.addProduct({
      title: body.title,
      brand: body.brand,
      category: body.category,
      subCategory: body.subCategory || "general",
      price: Number(body.price),
      originalPrice: Number(originalPrice),
      discountPercentage: discount > 0 ? discount : 0,
      rating: 4.5,
      ratingCount: 1,
      reviewCount: 0,
      thumbnail: body.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      images: body.images && body.images.length > 0 ? body.images : [body.thumbnail],
      inStock: true,
      stockCount: Number(body.stockCount) || 20,
      isAssured: body.isAssured ?? true,
      description: body.description || "Premium quality product on BharatKart.",
      highlights: body.highlights || ["100% Genuine product", "Brand warranty included"],
      specifications: body.specifications || [
        { category: "General", items: [{ key: "Brand", value: body.brand }] },
      ],
      seller: body.seller || {
        id: "seller-custom",
        name: body.sellerName || "Registered Partner Seller",
        rating: 4.7,
        joinedYear: 2024,
        city: "Bengaluru",
        state: "Karnataka",
        badge: "Verified Partner",
      },
      fastestDeliveryDays: 2,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
