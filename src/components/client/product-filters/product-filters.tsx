"use client";
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import CheckboxRoot from "@/components/ui/checkbox-root";
import CheckboxIndicator from "@/components/ui/checkbox-indicator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  categories: ICategory[];
  weights: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  weights,
  categories,
}) => {
  const t = useTranslations("product-list");

  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale() as ILocale;

  const numericWeights = weights.map(Number);

  const getInitialCategories = () => {
    const params = searchParams.get("categories");
    return params ? params.split(",") : [];
  };

  const getInitialSliderValues = () => {
    const minWeight =
      Number(searchParams.get("minWeight")) || numericWeights[0];
    const maxWeight =
      Number(searchParams.get("maxWeight")) ||
      numericWeights[numericWeights.length - 1];
    return [minWeight, maxWeight];
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(getInitialCategories);
  const [sliderValue, setSliderValue] = useState<number[]>(
    getInitialSliderValues,
  );

  const [debouncedSliderValue] = useDebounce(sliderValue, 700);

  useEffect(() => {
    setSelectedCategories(getInitialCategories());
    setSliderValue(getInitialSliderValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (
      debouncedSliderValue[0] !== numericWeights[0] ||
      debouncedSliderValue[1] !== numericWeights[numericWeights.length - 1]
    ) {
      params.set("minWeight", debouncedSliderValue[0].toString());
      params.set("maxWeight", debouncedSliderValue[1].toString());
    } else {
      params.delete("minWeight");
      params.delete("maxWeight");
    }

    updateUrlParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSliderValue]);

  const updateUrlParams = (params: URLSearchParams) => {
    const query = params.toString();
    const newUrl = query ? `?${query}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
    router.refresh();
  };

  const updateCategoriesQuery = (updatedCategories: string[]) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (updatedCategories.length > 0) {
      params.set("categories", updatedCategories.join(","));
    } else {
      params.delete("categories");
    }
    params.set("page", "1");
    updateUrlParams(params);
  };

  const handleToggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    updateCategoriesQuery(updatedCategories);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSliderValue([
      numericWeights[0],
      numericWeights[numericWeights.length - 1],
    ]);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("categories");
    params.delete("minWeight");
    params.delete("maxWeight");
    updateUrlParams(params);
  };

  return (
    <div className="relative min-w-[259px] lg:min-w-[319px]">
      <div className="flex items-center gap-2 py-[16px]">
        <div className="hidden w-full max-w-80 grow md:block">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="mb-2"
          >
            <AccordionItem value="item-1">
              <LazyMotion features={domAnimation}>
                <m.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <AccordionTrigger className="font-rubik">
                    {t("type")}
                  </AccordionTrigger>
                </m.div>
              </LazyMotion>
              <AccordionContent className="flex max-h-[400px] flex-col gap-2 pt-8 pb-[40px]">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <LazyMotion key={category.slug} features={domAnimation}>
                      <m.label
                        htmlFor={category.slug}
                        className="flex cursor-pointer items-center gap-[24px]"
                        whileHover={{ scale: 1.05, marginLeft: 15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckboxPrimitive.Root
                          id={category.slug}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={() =>
                            handleToggleCategory(category.slug)
                          }
                          className="relative z-0 cursor-pointer py-2"
                        >
                          <CheckboxRoot />
                          <CheckboxPrimitive.Indicator>
                            <CheckboxIndicator />
                          </CheckboxPrimitive.Indicator>
                        </CheckboxPrimitive.Root>
                        <span className="text-xl text-[20px] font-normal uppercase">
                          {category.name[locale]}
                        </span>
                      </m.label>
                    </LazyMotion>
                  ))
                ) : (
                  <div>{t("no-categories-available")}</div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible defaultValue="item-2">
            <AccordionItem value="item-2">
              <LazyMotion features={domAnimation}>
                <m.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <AccordionTrigger className="font-rubik">
                    {t("weight")}
                  </AccordionTrigger>
                </m.div>
              </LazyMotion>
              <AccordionContent>
                <div className="my-[50px]">
                  <Slider
                    value={sliderValue}
                    step={10}
                    min={numericWeights[0]}
                    max={numericWeights[numericWeights.length - 1]}
                    onValueChange={(value) => setSliderValue(value)}
                  />
                  <div className="mt-10 flex items-center justify-between pt-9 text-xl">
                    <div className="flex gap-10">
                      <span className="">{t("from")}</span>
                      <span className="relative flex items-center justify-center">
                        {sliderValue[0]}
                        {t("g")}
                        <svg className="absolute h-[40px] w-[70px] origin-center">
                          <use href="/icons/sprite.svg#o-oval" />
                        </svg>
                      </span>
                    </div>
                    <div className="mr-5 flex gap-10">
                      <span className="">{t("to")}</span>
                      <span className="relative flex items-center justify-center">
                        {sliderValue[1]}
                        {t("g")}
                        <svg className="absolute h-[40px] w-[70px] origin-center">
                          <use href="/icons/sprite.svg#o-oval" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="md:hidden">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="flex items-center gap-2">
              <div className="font-rubik text-xl sm:text-2xl">
                {t("filter")}
              </div>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-rubik text-[32px]">
                  {t("filter")}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-[30px] pb-[40px]">
                    <Button
                      className="rounded-none text-base"
                      variant="outline"
                      type="button"
                      onClick={resetFilters}
                    >
                      {t("reset-all")}
                    </Button>
                    <Button
                      className="rounded-none text-base"
                      type="button"
                      onClick={() => setDialogOpen(false)}
                    >
                      {t("show")}
                    </Button>
                  </div>
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    className="mb-2"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="font-rubik">
                        {t("type")}
                      </AccordionTrigger>
                      <AccordionContent className="flex max-h-[400px] flex-col gap-2 pt-8 pb-[40px]">
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <label
                              key={category.slug}
                              htmlFor={category.slug}
                              className="flex cursor-pointer items-center gap-[24px]"
                            >
                              <CheckboxPrimitive.Root
                                id={category.slug}
                                checked={selectedCategories.includes(
                                  category.slug,
                                )}
                                onCheckedChange={() =>
                                  handleToggleCategory(category.slug)
                                }
                                className="relative z-0 py-2"
                              >
                                <CheckboxRoot />
                                <CheckboxPrimitive.Indicator>
                                  <CheckboxIndicator />
                                </CheckboxPrimitive.Indicator>
                              </CheckboxPrimitive.Root>
                              <span className="text-xl text-[20px] font-normal uppercase">
                                {category.name[locale]}
                              </span>
                            </label>
                          ))
                        ) : (
                          <div>{t("no-categories-available")}</div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Accordion type="single" collapsible defaultValue="item-2">
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="font-rubik">
                        {t("weight")}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="my-[50px]">
                          <Slider
                            value={sliderValue}
                            step={10}
                            min={numericWeights[0]}
                            max={numericWeights[numericWeights.length - 1]}
                            onValueChange={(value) => setSliderValue(value)}
                          />
                          <div className="mt-10 flex items-center justify-between pt-9 text-xl">
                            <div className="flex gap-10">
                              <span className="">{t("from")}</span>
                              <span className="relative flex items-center justify-center">
                                {sliderValue[0]}
                                {t("g")}
                                <svg className="absolute h-[40px] w-[70px] origin-center">
                                  <use href="/icons/sprite.svg#o-oval" />
                                </svg>
                              </span>
                            </div>
                            <div className="mr-5 flex gap-10">
                              <span className="">{t("to")}</span>
                              <span className="relative flex items-center justify-center">
                                {sliderValue[1]}
                                {t("g")}
                                <svg className="absolute h-[40px] w-[70px] origin-center">
                                  <use href="/icons/sprite.svg#o-oval" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
