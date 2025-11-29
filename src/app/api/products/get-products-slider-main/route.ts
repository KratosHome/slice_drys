import { NextResponse } from "next/server";
import { getProductsSliderMain } from "@/server/products/get-productsSliderMain.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") as ILocale;

  const data = await getProductsSliderMain(locale);
  return NextResponse.json(data);
}
