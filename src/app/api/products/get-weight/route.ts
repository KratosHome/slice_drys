import { NextResponse } from "next/server";
import { getProductWeights } from "@/server/products/get-product-weights";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const menu = searchParams.get("menu") || "";

  const data = await getProductWeights(menu);

  return NextResponse.json(data);
}
