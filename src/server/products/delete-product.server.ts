"use server";
import { connectToDbServer } from "@/server/connect-to-db.server";
import { Product } from "@/server/products/product-schema.server";
import cloudinary from "../cloudinary-config.server";
import { revalidateTag } from "next/cache";
import { fetchTags } from "@/data/fetch-tags";

export async function deleteProduct(id?: string): Promise<IResponse> {
  try {
    await connectToDbServer();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return { success: false, message: "Product wasn't found" };
    }

    const { img } = deletedProduct;

    const publicIdMatch = img.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      });
    }

    revalidateTag(fetchTags.products);
    revalidateTag(fetchTags.product);

    return { success: true, message: "Product was deleted" };
  } catch (error) {
    return { success: false, message: `Can't delete product ${error}` };
  }
}
