"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "quill/dist/quill.snow.css";
import { FC } from "react";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import {
  CardIcon,
  ChequeIcon,
  PaperIcon,
} from "@/components/client/product-page/icons";
import { useTranslations } from "next-intl";
import { ResponsiveMotion } from "@/components/client/responsive-motion";

interface AccordionsProps {
  nutrition: INutritionalValue;
  description: string;
}

export const Accordions: FC<AccordionsProps> = ({ nutrition, description }) => {
  const t = useTranslations("product");

  const content = JSON.parse(description);
  const converter = new QuillDeltaToHtmlConverter(content.ops);
  const html = converter.convert();

  return (
    <Accordion
      type="multiple"
      defaultValue={["info", "about", "nutrition"]}
      className="mx-auto mb-[230px] grid max-w-[988px] gap-6"
    >
      <AccordionItem value="about">
        <ResponsiveMotion
          whileHover={{ scale: 1.009 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">
            <h2>{t("about-product")}</h2>
          </AccordionTrigger>
        </ResponsiveMotion>
        <AccordionContent className="border border-t-0">
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <article
              id="editor"
              className="ql-editor prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={"nutrition"}>
        <ResponsiveMotion
          whileHover={{ scale: 1.009 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">
            <h2>{t("nutritional-value")}</h2>
          </AccordionTrigger>
        </ResponsiveMotion>
        <AccordionContent className="border border-t-0 px-4">
          <section className="my-6 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2">
            <div className="flex w-full max-w-[290px] justify-between">
              <h3 className="font-bold">{t("proteins")}</h3>
              <span>
                {nutrition.proteins} {t("g")}
              </span>
            </div>
            <div className="flex w-full max-w-[290px] justify-between">
              <h3 className="font-bold">{t("fats")}</h3>
              <span>
                {nutrition.fats} {t("g")}
              </span>
            </div>
            <div className="flex w-full max-w-[290px] justify-between">
              <h3 className="font-bold">{t("carbohydrates")}</h3>
              <span>
                {nutrition.carbohydrates} {t("g")}
              </span>
            </div>
            <div className="flex w-full max-w-[290px] justify-between">
              <h3 className="font-bold">{t("energy-value")}</h3>
              <span>
                {nutrition.energyValue} {t("g")}
              </span>
            </div>
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={"info"}>
        <ResponsiveMotion
          whileHover={{ scale: 1.009 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">
            {t("shelf-life")}
          </AccordionTrigger>
        </ResponsiveMotion>
        <AccordionContent className="gap-6 border border-t-0 p-6">
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t("storage-conditions")}
            </dt>
            <dd className="sm:min-w-40">
              {t("at-temperatures-from-relative-humidity")}
            </dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t("expiration-date")}
            </dt>
            <dd className="sm:min-w-40">
              {t("months-from-the-date-manufacture-indicated-packaging")}
            </dd>
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={"delivery"}>
        <ResponsiveMotion
          whileHover={{ scale: 1.009 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">{t("delivery")}</AccordionTrigger>
        </ResponsiveMotion>
        <AccordionContent className="gap-6 border border-t-0 p-6">
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t("delivery-ukraine")}
            </dt>
            <dd className="sm:min-w-40">
              {t(
                "we-offer-fast-and-reliable-delivery-of-our-products-throughout-ukraine-using-nova-poshta-after-placing-an-order-we-ship-it-within",
              )}
              <b> {t("1-2-business-days")}</b>.{" "}
              {t("delivery-time-depends-on-your-location-and-usually-takes")}{" "}
              <b>{t("1-3-days")}.</b>
            </dd>
          </div>
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t("payment-methods")}
            </dt>
            <dd className="sm:min-w-40">
              <p>
                {t("we-offer")}
                <b> {t("several-convenient-payment-options")}:</b>
              </p>
              <ul className="grid gap-3 pt-3">
                <li className="flex items-center gap-4">
                  <CardIcon />{" "}
                  {t(
                    "online-payment-by-card-visa-mastercard-through-secure-payment-system",
                  )}
                </li>

                <li className="flex items-center gap-4">
                  <ChequeIcon />{" "}
                  {t(
                    "cash-on-delivery-payment-upon-receipt-nova-poshta-branch",
                  )}
                </li>

                <li className="flex items-center gap-4">
                  <PaperIcon />{" "}
                  {t("cashless-payment-for-corporate-clients-and-large-orders")}
                </li>
              </ul>
            </dd>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
