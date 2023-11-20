const NumberFormat = (value, onlycurrency, onlyvalue) => {
  let nformat = `\u20B9 ${value}`;
  if (onlycurrency) {
    nformat = `\u20B9 `;
  }
  if (onlyvalue) {
    nformat = `${value}`;
  }
  return nformat;
};

export default NumberFormat;
