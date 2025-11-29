"use server";

import { Category } from "@/server/categories/categories-schema.server";

import { connectToDbServer } from "@/server/connect-to-db.server";

export async function getCategoryUrls(): Promise<IResult<CategorySlug>> {
  try {
    await connectToDbServer();

    const categories = await Category.find({})
      .select("slug")
      .lean<CategorySlug[]>();

    const categoriesWithLowercaseSlug = categories.map((category) => ({
      ...category,
      slug: category.slug.toLowerCase(),
    }));

    return {
      data: categoriesWithLowercaseSlug,
      success: true,
      message: "Categories retrieved",
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `Can't retrieve categories: ${error}`,
    };
  }
}
