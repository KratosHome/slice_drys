import MobileDetect from "mobile-detect";

export const detectDevice = (userAgent: string): IDevice => {
  const md: MobileDetect = new MobileDetect(userAgent);

  const isMobile: boolean = !!md.mobile();
  const isTablet: boolean = !!md.tablet();
  const isDesktop: boolean = !md.mobile() && !md.tablet();

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};
