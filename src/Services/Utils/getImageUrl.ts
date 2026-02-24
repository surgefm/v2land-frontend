const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export const getImageUrl = (src: string, _width: number, _height: number) => {
  // return `${CDN_URL}/${width}x${height}/${src}`;
  return `${CDN_URL}/${src}`;
};
