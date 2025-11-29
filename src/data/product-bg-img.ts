export const getProductBgImg = (t: (key: string) => string) => [
  {
    src: "orange",
    className: "absolute left-5 top-5 w-24",
    alt: t("fruit.orange"),
  },
  {
    src: "mango",
    className: "absolute left-[140px] top-[250px] hidden w-12 md:block",
    alt: t("fruit.mango"),
  },
  {
    src: "pear",
    className:
      "absolute left-[40px] top-[650px] hidden w-24 rotate-[-120deg] md:block",
    alt: t("fruit.pear"),
  },
  {
    src: "pineapple",
    className: "absolute bottom-24 left-36 h-12 w-12",
    alt: t("fruit.pineapple"),
  },
  {
    src: "grapefruit",
    className: "absolute right-10 top-12 w-28",
    alt: t("fruit.grapefruit"),
  },
  {
    src: "pineapple",
    className: "absolute bottom-[300px] right-[50px] w-16 rotate-45",
    alt: t("fruit.pineapple"),
  },
  {
    src: "pineapple",
    className: "absolute bottom-[100px] right-[140px] hidden w-16 md:block",
    alt: t("fruit.pineapple"),
  },
  {
    src: "kiwi",
    className: "absolute bottom-5 right-5 w-10",
    alt: t("fruit.kiwi"),
  },
];
