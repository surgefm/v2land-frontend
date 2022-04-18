export const getErrorMessage = async (res: any, fallback: string): Promise<string> => {
  if (res && res.json) {
    const body = await res.json();
    if (typeof body.message !== 'undefined') return body.message as string;
  }
  return fallback;
};
