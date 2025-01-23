import { BreadcrumbArrow } from '../ui/arrow'

export const Breadcrumbs = () => {
  return (
    <div className="mt-[1.875rem] flex items-center gap-4 leading-none sm:gap-6 sm:text-xl md:mt-[4.375rem]">
      Головна <BreadcrumbArrow /> М&apos;ясо <BreadcrumbArrow />
      <span className="font-semibold">Курка сушена</span>
    </div>
  )
}

// const Breadcrumbs = () => {
//   const pathname = usePathname()
//
//   // Split and filter out empty crumbs
//   const pathSegments = pathname.split('/').filter(Boolean)
//
//   // Remove the first segment if it's a locale (e.g., 'uk', 'en', etc.)
//   const locale = pathSegments[0]
//   const nonLocaleSegments = pathSegments.slice(1)
//
//   // Map each non-locale path segment to a breadcrumb link
//   const crumbs = nonLocaleSegments.map((segment, index) => {
//     // Construct the link for each segment
//     const linkPath = `/${[locale, ...nonLocaleSegments.slice(0, index + 1)].join('/')}`
//
//     // Replace underscores with spaces and capitalize the first letter
//     const formattedCrumb = segment.replace(/_/g, ' ')
//     const uppercasedCrumb =
//       formattedCrumb.charAt(0).toUpperCase() + formattedCrumb.slice(1)
//
//     return (
//       <Link key={segment} href={linkPath}>
//         {uppercasedCrumb}
//       </Link>
//     )
//   })
//
//   return (
//     <div>
//       {/* Always show 'Home' as the first breadcrumb */}
//       <Link href={`/${locale}`}>Home</Link>
//       {crumbs}
//     </div>
//   )
// }
