"use server";

import { connectToDbServer } from "@/server/connect-to-db.server";
import { Order } from "./order-schema.server";

export const getOrderStatusCounts = async () => {
  "use server";
  try {
    await connectToDbServer();

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = statusCounts.reduce(
      (acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      success: true,
      data: counts,
    };
  } catch (error) {
    return {
      success: false,
      data: {},
      error,
    };
  }
};
