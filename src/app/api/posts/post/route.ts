import { NextResponse } from "next/server";
import { getPost } from "@/server/posts/get-posts.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") as ILocale;
  const slug = searchParams.get("slug") as string;
  const isVisited = searchParams.get("isVisited") === "true";

  const data = await getPost({ locale, slug, isVisited });

  return NextResponse.json(data);
}
