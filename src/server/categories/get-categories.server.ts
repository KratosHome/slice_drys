"use server";

import { Category } from "@/server/categories/categories-schema.server";
import { Product } from "@/server/products/product-schema.server";

import { connectToDbServer } from "@/server/connect-to-db.server";

export async function getCategories(
  slug?: string,
  locale?: ILocale,
): Promise<IResult<ICategory> & { name?: string }> {
  try {
    await connectToDbServer();

    if (slug && (slug === "promotions" || slug === "mixes")) {
      const mainCategory = await Category.findOne({ slug }).lean<ICategory>();

      if (!mainCategory) {
        return {
          data: [],
          success: false,
          message: `Category with slug ${slug} not found`,
        };
      }

      const products = await Product.find({
        categories: mainCategory._id,
      }).lean<IProduct[]>();

      const categoryIdsSet = new Set<string>();

      products.forEach((product) => {
        product.categories.forEach((catId: string) => {
          categoryIdsSet.add(String(catId));
        });
      });

      const categories = await Category.find({
        _id: { $in: Array.from(categoryIdsSet) },
      })
        .sort({ order: 1 })
        .populate({
          path: "children",
          populate: {
            path: "children",
          },
        })
        .lean<ICategory[]>();

      const filteredCategories: ICategory[] = categories.filter(
        (category) =>
          category.slug !== "promotions" && category.slug !== "mixes",
      );

      return {
        data: filteredCategories,
        success: true,
        message: "Categories retrieved successfully for promotions/mixes",
      };
    }

    if (slug) {
      const category = await Category.findOne({ slug })
        .sort({ order: 1 })
        .populate({
          path: "children",
          populate: {
            path: "children",
          },
        })
        .lean<ICategory>();

      if (!category) {
        return {
          data: [],
          success: false,
          message: `Category with slug ${slug} not found`,
        };
      }

      return {
        name: locale ? category.name?.[locale] : "",
        data: category.children || [],
        success: true,
        message: "Category children retrieved successfully",
      };
    }

    const categories = await Category.find({ parentCategory: null })
      .sort({ order: 1 })
      .populate({
        path: "children",
        populate: {
          path: "children",
        },
      })
      .lean<ICategory[]>();

    const plainCategories: ICategory[] = JSON.parse(JSON.stringify(categories));

    return {
      data: plainCategories,
      success: true,
      message: "Categories retrieved successfully",
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve categories: ${error}`,
    };
  }
}
