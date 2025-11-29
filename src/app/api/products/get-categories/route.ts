import { NextResponse } from "next/server";
import { getCategories } from "@/server/categories/get-categories.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") as ILocale;
  const menu = searchParams.get("menu") || "";

  const data = await getCategories(menu, locale);

  return NextResponse.json(data);
}
