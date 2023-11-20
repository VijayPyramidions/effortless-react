export const FormattedAmount = (value) => {
  return Number(value) < 0
    ? `(₹ ${Math.abs(Number(value || 0)).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })})`
    : `₹ ${Math.abs(Number(value || 0)).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })}`;
};

export const customCurrency = (currency, locale) =>
  Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  });
