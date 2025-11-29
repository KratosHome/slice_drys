import { getTranslations } from "next-intl/server";

const BlogTitle = async () => {
  const t = await getTranslations("blog");
  return (
    <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-[26px] lg:flex-nowrap lg:gap-[54px]">
      <h1 className="font-rubik w-full text-[clamp(64px,calc(64px+64*(100vw-768px)/672),128px)] md:w-fit">
        {t("title")}
      </h1>
      <div className="bg-foreground text-background ml-auto w-full p-4 text-base shadow-[16px_-16px_0px_#A90909] sm:max-w-[75%] md:mr-8 md:text-xl lg:max-w-none">
        {t("description-top")}
      </div>
    </div>
  );
};

export default BlogTitle;
