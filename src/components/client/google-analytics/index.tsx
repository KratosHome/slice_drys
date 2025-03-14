import Script from 'next/script'

export const GoogleAnalytics = () => {
  const GOOGLE_ANALYTICS_ID: string | undefined =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
      />

      <Script id="google-analytics">
        {`
                       window.dataLayer = window.dataLayer || [];
                       function gtag(){dataLayer.push(arguments);}
                       gtag('js', new Date());
                       gtag('config', '${GOOGLE_ANALYTICS_ID}');
                    `}
      </Script>
    </>
  )
}
