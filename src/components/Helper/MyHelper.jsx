export const CheckCinWithGST = (value) => {
  const corporate = value?.toLocaleLowerCase()?.split('')?.[5];
  if (corporate === 'c') {
    return true;
  }
  return false;
};
