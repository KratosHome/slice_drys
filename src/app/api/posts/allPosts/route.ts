import { NextResponse } from "next/server";
import { getAllPosts } from "@/server/posts/get-posts.server";

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const data = await getAllPosts({
    locale: (searchParams.get("locale") as ILocale) ?? "uk",
  });
  return NextResponse.json(data);
}
