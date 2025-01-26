import MobileDetect from 'mobile-detect'

export const detectDevice = (userAgent: string) => {
  const md = new MobileDetect(userAgent)

  const isMobile = !!md.mobile()
  const isTablet = !!md.tablet()
  const isDesktop = !md.mobile() && !md.tablet()

  return {
    isMobile,
    isTablet,
    isDesktop,
  }
}
