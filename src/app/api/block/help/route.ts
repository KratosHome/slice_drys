import { NextResponse } from "next/server";
import { getHelpMain } from "@/server/block/get-help-main.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") as ILocale;

  const helpData = await getHelpMain(locale, true);
  return NextResponse.json(helpData);
}
