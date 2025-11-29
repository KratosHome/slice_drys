"use client";
import { useTranslations } from "next-intl";

const TopLabel = () => {
  const t = useTranslations("product");

  return (
    <div className="text-background relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#EC9006] px-2 py-[2px] uppercase">
      <svg className="md:h-6 md:w-6" width="16" height="16">
        <use href="/icons/sprite.svg#top" />
      </svg>
      <p className="mt-[2px]">{t("top")}</p>
    </div>
  );
};

export default TopLabel;
