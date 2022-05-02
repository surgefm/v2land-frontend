import getConfig from 'next/config';

const {
  publicRuntimeConfig: { CDN_URL },
} = getConfig();

export const getImageUrl = (src: string, _width: number, _height: number) => {
  // return `${CDN_URL}/${width}x${height}/${src}`;
  return `${CDN_URL}/${src}`;
};
