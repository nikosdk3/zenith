export const PADDING = 12;

export const getItemPadding = (level: number, isFile: boolean) => {
  return PADDING + level * PADDING + (isFile ? 16 : 0);
};
