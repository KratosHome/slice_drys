"use server";
import { connectToDbServer } from "@/server/connect-to-db.server";
import { Product } from "@/server/products/product-schema.server";
import { fetchTags } from "@/data/fetch-tags";

import cloudinary from "@/server/cloudinary-config.server";
import { revalidateTag } from "next/cache";

export async function createProduct(
  formData: IProductLocal,
  image: string,
): Promise<IResponse> {
  "use server";
  try {
    await connectToDbServer();

    const upload = await cloudinary.uploader.upload(image, {
      folder: "products-slice",
    });

    const productData: IProductLocal = { ...formData, img: upload.secure_url };

    const product = new Product(productData);
    await product.save();

    revalidateTag(fetchTags.products, "max");
    revalidateTag(fetchTags.product, "max");

    return { success: true, message: "Product created" };
  } catch (error) {
    return { success: false, message: `Can't create product ${error}` };
  }
}
