import getConfig from 'next/config';

const {
  publicRuntimeConfig: { CDN_URL },
} = getConfig();

export const getImageUrl = (src: string, width: number, height: number) => {
  return `${CDN_URL}/${width}x${height}/${src}`;
};
