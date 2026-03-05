import React from "react";
// @ts-ignore
import NextImage from "next/legacy/image";

const CDN_HOST = "cdn.surge.fm";

export const Image = React.forwardRef((props: any, ref: any) => {
  const isCdnImage = typeof props.src === "string" && props.src.includes(CDN_HOST);
  return (
    <NextImage
      {...props}
      ref={ref}
      crossOrigin={isCdnImage ? "anonymous" : props.crossOrigin}
    />
  );
});

Image.displayName = "Image";
