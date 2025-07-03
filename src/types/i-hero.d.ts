interface IHeroAnimationSubImage {
  path: string
  width: number
  height: number
  rotate?: number
  isMobileDiz?: boolean
  position: {
    desktop: {
      x: number
      y: number
    }
    tablet: {
      x: number
      y: number
    }
    mobile: {
      x: number
      y: number
    }
  }
}
