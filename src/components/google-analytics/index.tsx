import Script from 'next/script'

export default function GoogleAnalytics() {
  const GOOGLE_ANALYTICS_ID: string =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''

  if (
    process.env.NODE_ENV === 'development' ||
    !/^G-[A-Z0-9]+$/.test(GOOGLE_ANALYTICS_ID)
  )
    return null

  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         if (!window.sliceDrysAnalyticsInitialized) {
           gtag('js', new Date());
           gtag('config', '${GOOGLE_ANALYTICS_ID}');
           window.sliceDrysAnalyticsInitialized = true;
         }
         `}
      </Script>
      <Script
        async
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
      />
    </>
  )
}
