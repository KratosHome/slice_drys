interface IHeroAnimationImage {
  path: string
  width: number
  height: number
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

const mixSubImages: IHeroAnimationImage[] = [
  {
    path: '/sliders/mix/left-bottom-orange.png',
    width: 43,
    height: 43,
    position: {
      desktop: {
        x: -225,
        y: 345,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/left-bottom-kivi.png',
    width: 69,
    height: 66,
    position: {
      desktop: {
        x: -495,
        y: 275,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/left-bottom-grapefruit.png',
    width: 40,
    height: 78,
    position: {
      desktop: {
        x: -600,
        y: 115,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/left-top-potatoes.png',
    width: 40,
    height: 34,
    position: {
      desktop: {
        x: -55,
        y: -215,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/left-top-pineapple.png',
    width: 61,
    height: 54,
    position: {
      desktop: {
        x: -585,
        y: -565,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/left-top-papper.png',
    width: 86,
    height: 82,
    position: {
      desktop: {
        x: -545,
        y: -295,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/right-top-berry.png',
    width: 71,
    height: 70,
    position: {
      desktop: {
        x: 665,
        y: -405,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/right-bottom-pineapple.png',
    width: 40,
    height: 40,
    position: {
      desktop: {
        x: 555,
        y: 275,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/right-bottom-meet.png',
    width: 115,
    height: 73,
    position: {
      desktop: {
        x: 495,
        y: 335,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/right-bottom-cucumber.png',
    width: 111,
    height: 99,
    position: {
      desktop: {
        x: 680,
        y: 20,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/right-bottom-orange-big.png',
    width: 43,
    height: 43,
    position: {
      desktop: {
        x: 460,
        y: 250,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/right-bottom-orange.png',
    width: 43,
    height: 43,
    position: {
      desktop: {
        x: 710,
        y: 145,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/mix/right-top-pumpkin.png',
    width: 65,
    height: 77,
    position: {
      desktop: {
        x: 700,
        y: -620,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
]

const fruitSubImages: IHeroAnimationImage[] = [
  {
    path: '/sliders/fruit/fruit-left-bottom-1.png',
    width: 88,
    height: 90,
    position: {
      desktop: {
        x: -555,
        y: -55,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-left-bottom-2.png',
    width: 66,
    height: 61,
    position: {
      desktop: {
        x: -475,
        y: 275,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-left-bottom-3.png',
    width: 55,
    height: 55,
    position: {
      desktop: {
        x: -585,
        y: 345,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-left-top-1.png',
    width: 53,
    height: 87,
    position: {
      desktop: {
        x: -605,
        y: -565,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-left-top-2.png',
    width: 36,
    height: 40,
    position: {
      desktop: {
        x: -545,
        y: -295,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-1.png',
    width: 86,
    height: 68,
    position: {
      desktop: {
        x: 675,
        y: 345,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-2.png',
    width: 39,
    height: 82,
    position: {
      desktop: {
        x: 710,
        y: -185,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-3.png',
    width: 56,
    height: 56,
    position: {
      desktop: {
        x: 700,
        y: -110,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-4.png',
    width: 60,
    height: 55,
    position: {
      desktop: {
        x: 540,
        y: 275,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-5.png',
    width: 59,
    height: 55,
    position: {
      desktop: {
        x: 675,
        y: -5,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-top-3.png',
    width: 75,
    height: 66,
    position: {
      desktop: {
        x: 605,
        y: -485,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-top-2.png',
    width: 49,
    height: 48,
    position: {
      desktop: {
        x: 705,
        y: -620,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/fruit/fruit-right-top-1.png',
    width: 49,
    height: 92,
    position: {
      desktop: {
        x: 665,
        y: -405,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
]

const meatSubImages: IHeroAnimationImage[] = [
  {
    path: '/sliders/meat/meat-left-bottom-1.png',
    width: 52,
    height: 52,
    position: {
      desktop: {
        x: -425,
        y: 205,
      },
      tablet: {
        x: -270,
        y: 200,
      },
      mobile: {
        x: -115,
        y: 125,
      },
    },
  },
  {
    path: '/sliders/meat/meat-left-bottom-2.png',
    width: 67,
    height: 64,
    position: {
      desktop: {
        x: -495,
        y: 275,
      },
      tablet: {
        x: -320,
        y: 110,
      },
      mobile: {
        x: -130,
        y: 75,
      },
    },
  },
  {
    path: '/sliders/meat/meat-left-bottom-3.png',
    width: 113,
    height: 102,
    position: {
      desktop: {
        x: -565,
        y: 115,
      },
      tablet: {
        x: -255,
        y: 100,
      },
      mobile: {
        x: -70,
        y: 160,
      },
    },
  },
  {
    path: '/sliders/meat/meat-left-top-1.png',
    width: 32,
    height: 32,
    position: {
      desktop: {
        x: -545,
        y: -295,
      },
      tablet: {
        x: -235,
        y: -210,
      },
      mobile: {
        x: -95,
        y: -110,
      },
    },
  },
  {
    path: '/sliders/meat/meat-left-top-2.png',
    width: 66,
    height: 62,
    position: {
      desktop: {
        x: -585,
        y: -565,
      },
      tablet: {
        x: -290,
        y: -150,
      },
      mobile: {
        x: -120,
        y: -70,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-bottom-1.png',
    width: 78,
    height: 74,
    position: {
      desktop: {
        x: 555,
        y: 275,
      },
      tablet: {
        x: 375,
        y: 200,
      },
      mobile: {
        x: 190,
        y: 130,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-bottom-2.png',
    width: 22,
    height: 25,
    position: {
      desktop: {
        x: 675,
        y: -55,
      },
      tablet: {
        x: 310,
        y: 140,
      },
      mobile: {
        x: 210,
        y: 90,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-bottom-3.png',
    width: 24,
    height: 95,
    position: {
      desktop: {
        x: 720,
        y: -185,
      },
      tablet: {
        x: 428,
        y: 0,
      },
      mobile: {
        x: 240,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-bottom-4.png',
    width: 71,
    height: 63,
    position: {
      desktop: {
        x: 690,
        y: -110,
      },
      tablet: {
        x: 330,
        y: 40,
      },
      mobile: {
        x: 195,
        y: 50,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-bottom-5.png',
    width: 85,
    height: 88,
    position: {
      desktop: {
        x: 675,
        y: 345,
      },
      tablet: {
        x: 410,
        y: 100,
      },
      mobile: {
        x: 95,
        y: -80,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-top-1.png',
    width: 42,
    height: 92,
    position: {
      desktop: {
        x: 710,
        y: -620,
      },
      tablet: {
        x: 425,
        y: -300,
      },
      mobile: {
        x: 235,
        y: -210,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-top-2.png',
    width: 32,
    height: 30,
    position: {
      desktop: {
        x: 665,
        y: -405,
      },
      tablet: {
        x: 185,
        y: -300,
      },
      mobile: {
        x: 185,
        y: -150,
      },
    },
  },
  {
    path: '/sliders/meat/meat-right-top-3.png',
    width: 64,
    height: 63,
    position: {
      desktop: {
        x: 605,
        y: -485,
      },
      tablet: {
        x: 315,
        y: -200,
      },
      mobile: {
        x: 0,
        y: -200,
      },
    },
  },
]

const veggieSubImages: IHeroAnimationImage[] = [
  {
    path: '/sliders/veggie/left-bottom-beet-small.png',
    width: 44,
    height: 35,
    position: {
      desktop: {
        x: -225,
        y: 345,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/left-bottom-pumpkin.png',
    width: 66,
    height: 51,
    position: {
      desktop: {
        x: -495,
        y: 275,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/left-bottom-beet-big.png',
    width: 61,
    height: 48,
    position: {
      desktop: {
        x: -540,
        y: 45,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/left-bottom-papper.png',
    width: 40,
    height: 38,
    position: {
      desktop: {
        x: -580,
        y: 215,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/left-top-cucumber.png',
    width: 85,
    height: 76,
    position: {
      desktop: {
        x: -575,
        y: -545,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/left-top-pumpkin.png',
    width: 52,
    height: 30,
    position: {
      desktop: {
        x: -130,
        y: -85,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/left-top-papper.png',
    width: 35,
    height: 33,
    position: {
      desktop: {
        x: -545,
        y: -295,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-top-pumpkin.png',
    width: 33,
    height: 25,
    position: {
      desktop: {
        x: 695,
        y: -375,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-top-papper.png',
    width: 45,
    height: 42,
    position: {
      desktop: {
        x: 625,
        y: -480,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-bottom-beet-big.png',
    width: 73,
    height: 57,
    position: {
      desktop: {
        x: 555,
        y: 275,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-bottom-beet-small.png',
    width: 35,
    height: 30,
    position: {
      desktop: {
        x: 690,
        y: 85,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-bottom-cucumber.png',
    width: 50,
    height: 81,
    position: {
      desktop: {
        x: 705,
        y: -155,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-bottom-papper.png',
    width: 41,
    height: 43,
    position: {
      desktop: {
        x: 635,
        y: -55,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-bottom-pumpkin.png',
    width: 30,
    height: 35,
    position: {
      desktop: {
        x: 495,
        y: 335,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/veggie/right-top-beet.png',
    width: 40,
    height: 54,
    position: {
      desktop: {
        x: 710,
        y: -620,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
]

const actionSubImages: IHeroAnimationImage[] = [
  {
    path: '/sliders/action/left-bottom.png',
    width: 38,
    height: 60,
    position: {
      desktop: {
        x: -575,
        y: 285,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/action/left-top.png',
    width: 92,
    height: 28,
    position: {
      desktop: {
        x: -555,
        y: -275,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    path: '/sliders/action/right-top-text.png',
    width: 250,
    height: 50,
    position: {
      desktop: {
        x: 505,
        y: -380,
      },
      tablet: {
        x: 0,
        y: 0,
      },
      mobile: {
        x: 0,
        y: 0,
      },
    },
  },
]

export {
  mixSubImages,
  fruitSubImages,
  meatSubImages,
  veggieSubImages,
  actionSubImages,
}
