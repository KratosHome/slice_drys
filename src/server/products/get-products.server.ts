"use server";

import { connectToDbServer } from "@/server/connect-to-db.server";
import { Product } from "@/server/products/product-schema.server";

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  composition: string[] = [],
  menu: string[] = [],
  category: string[] = [],
  locale: string,
  fetchAll: boolean = false,
) {
  "use server";
  try {
    await connectToDbServer();

    const query: IQueryType = {};

    if (composition.length > 0) {
      query[`composition.${locale}`] = { $in: composition };
    }

    if (menu.length > 0) {
      query[`menu.${locale}`] = { $in: menu };
    }

    if (category.length > 0) {
      query[`category.${locale}`] = { $in: category };
    }

    const products = await Product.find(query)
      .select({
        [`name.${locale}`]: 1,
        [`description.${locale}`]: 1,
        img: 1,
        variables: 1,
        nutritionalValue: 1,
        statusLabel: 1,
        visited: 1,
        title: 1,
        metaDescription: 1,
        [`menu.${locale}`]: 1,
        [`category.${locale}`]: 1,
        [`composition.${locale}`]: 1,
        createdAt: 1,
        keywords: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .lean()
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedProducts: IProduct[] = products.map((product) => ({
      ...product,
      _id: product._id as string,
      name: product.name[locale],
      description: product.description[locale],
      categories: product.category ?? [],
      menu: product.menu[locale],
      composition: product.composition[locale],
      variables: product.variables,
      statusLabel: product.statusLabel,
      nutritionalValue: product.nutritionalValue,
      slug: product.slug,
      title: product.title[locale],
      metaDescription: product.metaDescription[locale],
      keywords: product.keywords[locale],
    }));

    const allProducts: IProductLocal[] = fetchAll
      ? ((await Product.find()
          .sort({ createdAt: -1 })
          .lean()) as unknown as IProductLocal[])
      : [];

    return {
      success: true,
      product: formattedProducts,
      productAll: allProducts,
      message: "Products retrieved",
    };
  } catch (error) {
    return {
      success: false,
      product: [],
      productAll: [],
      message: `Can't retrieve products ${error}`,
    };
  }
}
