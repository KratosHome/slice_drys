import React from "react";
import { useTranslations } from "next-intl";

const SaleLabel = () => {
  const t = useTranslations("product");

  return (
    <div className="text-background relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#A90909] px-2 py-[2px] uppercase">
      <svg className="md:h-6 md:w-6" width="16" height="16">
        <use href="/icons/sprite.svg#sale" />
      </svg>
      <p className="mt-[2px]">{t("sale")}</p>
    </div>
  );
};

export default SaleLabel;
