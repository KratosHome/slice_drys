"use client";

import { useTranslations } from "next-intl";

import CartProductCard from "@/components/client/cart-product-card";
import { useCartStore } from "@/store/cart-store";

export default function CartList() {
  const t = useTranslations("cart");
  const { cart, totalPrice, totalProducts, minOrderAmount, clearCart } =
    useCartStore((state) => state);

  return (
    <div className="flex flex-col">
      {cart.itemList?.length === 0 ? (
        <div className="mt-4 h-[300px] py-[150px] text-center text-[20px]">
          {t("cart-empty")}
        </div>
      ) : (
        <>
          <div className="mt-1 px-6 text-right text-base">
            <span className="mr-[24px] font-semibold text-[#7D7D7D]">
              {t("added")}
            </span>

            <span>
              {t("item-count", {
                count: totalProducts,
              })}
            </span>
          </div>
          <div className="mt-1 px-6 text-right text-base">
            <span
              className="before:bg-foreground relative inline-block cursor-pointer select-none before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:origin-left before:scale-x-0 before:opacity-100 before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-x-100"
              onClick={() => clearCart()}
            >
              {t("clear-cart")}
            </span>
          </div>

          <div className="mt-6 space-y-4 overflow-hidden">
            {cart.itemList?.map((item) => (
              <CartProductCard itemData={item} key={item.id + item.weight} />
            ))}
          </div>

          <div className="px-5 pb-4">
            <div className="flex items-center justify-between pt-2">
              <p className="text-lg font-bold">{t("total")}:</p>

              <div className="flex items-center gap-1">
                <p>{totalPrice}</p>

                <p className="text-lg font-bold">{t("uah")}</p>
              </div>
            </div>

            {totalPrice < minOrderAmount && (
              <div className="mt-2 text-sm text-red-500">
                {t("minimum-order-amount")} {minOrderAmount} {t("uah")}.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
