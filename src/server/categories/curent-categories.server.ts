"use server";
import { connectToDbServer } from "@/server/connect-to-db.server";
import { Category } from "@/server/categories/categories-schema.server";

export async function getCurrentCategory(slug: string) {
  "use server";
  try {
    await connectToDbServer();

    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      return {
        data: null,
        success: false,
        message: "Category not found",
      };
    }

    return {
      data: category,
      success: true,
      message: "Category retrieved successfully",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: `Error retrieving category: ${error}`,
    };
  }
}
