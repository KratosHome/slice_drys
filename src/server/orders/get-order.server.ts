"use server";

import { connectToDbServer } from "@/server/connect-to-db.server";
import { Order } from "./order-schema.server";

export const getOrdersServer = async () => {
  "use server";
  try {
    await connectToDbServer();

    const orders = await Order.find().lean();

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error,
    };
  }
};
