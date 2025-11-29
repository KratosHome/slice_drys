import Image from "next/image";
import React from "react";

const SliderWithThumbnails = ({ img }: { img: string }) => {
  return (
    <div className="flex w-full justify-center lg:w-1/2">
      <div className="relative aspect-12/9 w-full max-w-[344px] lg:aspect-auto">
        <Image
          className="object-contain"
          src={img}
          alt={`Slider ${img}`}
          fill
          fetchPriority="high"
          priority={true}
          loading="eager"
          sizes="(min-width: 1024px) 344px, 100vw"
          quality={70}
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default SliderWithThumbnails;
