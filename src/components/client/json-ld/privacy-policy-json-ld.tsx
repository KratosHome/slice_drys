import React, { FC } from "react";

interface PrivacyPolicyJsonLdProps {
  locale: ILocale;
}

const PrivacyPolicyJsonLd: FC<PrivacyPolicyJsonLdProps> = ({ locale }) => {
  const baseUrl = process.env.NEXT_URL;

  const isUk = locale === "uk";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: isUk ? "Політика конфіденційності" : "Privacy Policy",
    description: isUk
      ? "Умови політики конфіденційності"
      : "Privacy policy details",
    url: `${baseUrl}/${locale}/privacy-policy`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default PrivacyPolicyJsonLd;
