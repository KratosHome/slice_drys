"use server";

import { Product } from "@/server/products/product-schema.server";

import { connectToDbServer } from "@/server/connect-to-db.server";
import cloudinary from "../cloudinary-config.server";

export async function getProductsSliderMain(
  locale: ILocale,
): Promise<IGetProducts> {
  try {
    await connectToDbServer();

    const products = await Product.find()
      .populate("categories", "slug")
      .sort({ visited: -1 })
      .limit(5)
      .lean<IProductLocal[]>();

    const formattedProducts: IProduct[] = products.map(
      (product: IProductLocal) => {
        const populatedCategories =
          product.categories as unknown as CategorySlug[];

        const transformedImage: string = cloudinary.url(`${product.images}`, {
          transformation: [
            { width: 500, crop: "scale" },
            { quality: 35 },
            { fetch_format: "auto" },
          ],
        });

        return {
          ...product,
          _id: product._id?.toString(),
          name: product.name[locale],
          description: product.description[locale],
          categories: populatedCategories
            ? populatedCategories.map((category) => category._id)
            : [],
          category:
            populatedCategories && populatedCategories[0]
              ? populatedCategories[0].slug
              : "",
          menu: product.menu[locale],
          composition: product.composition[locale],
          variables: JSON.parse(JSON.stringify(product.variables)),
          statusLabel: product.statusLabel,
          nutritionalValue: product.nutritionalValue,
          title: product.title[locale],
          metaDescription: product.metaDescription[locale],
          keywords: product.keywords[locale],
          images: [transformedImage],
        };
      },
    );

    return {
      success: true,
      products: formattedProducts,
      message: "Products retrieved",
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      message: `${error}`,
    };
  }
}
