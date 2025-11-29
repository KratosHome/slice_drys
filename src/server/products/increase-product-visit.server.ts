"use server";
import { connectToDbServer } from "@/server/connect-to-db.server";
import { Product } from "@/server/products/product-schema.server";

export async function increaseProductVisit(slug: string) {
  "use server";
  try {
    await connectToDbServer();

    await Product.findOneAndUpdate(
      { slug },
      { $inc: { visited: 1 } },
      { new: true },
    );

    return { success: true, message: "Visited product" };
  } catch (error) {
    return { success: false, message: `Can't create product ${error}` };
  }
}
