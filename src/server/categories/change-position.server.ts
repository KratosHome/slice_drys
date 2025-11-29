"use server";
import { connectToDbServer } from "@/server/connect-to-db.server";
import { Category } from "@/server/categories/categories-schema.server";

export async function changePosition(categoriesOrder: ICategory[]) {
  "use server";
  try {
    await connectToDbServer();

    const bulkOps = categoriesOrder.map(({ _id, order }) => ({
      updateOne: {
        filter: { _id: _id },
        update: { $set: { order } },
      },
    }));

    await Category.bulkWrite(bulkOps);

    return {
      success: true,
      message: "Категорію створено успішно",
    };
  } catch (error) {
    return {
      success: false,
      message: `Помилка при створенні категорії: ${error}`,
    };
  }
}
