/* eslint-disable no-restricted-syntax */
export const IndianCurrency = Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});
export const IndianCurrencyNoSymbol = Intl.NumberFormat('en-IN', {
  // style: 'currency',
  // currency: 'INR',
  maximumFractionDigits: 2,
});

export const SumAmount = (arr) => {
  return arr?.reduce(
    (n, { available_balance }) => Number(n) + Number(available_balance),
    0,
  );
};

export const organizationDetail = () =>
  JSON.parse(localStorage.getItem('selected_organization'));

export const capitalizeFirstLetter = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const pincodeKeyPress = (event) => {
  const key = String.fromCharCode(
    !event.charCode ? event.which : event.charCode,
  );
  if (!/^[0-9{6}\b]+$/.test(key)) {
    event.preventDefault();
  }
};

export const OnlyAlphaNumeric = (event) => {
  const key = String.fromCharCode(
    !event.charCode ? event.which : event.charCode,
  );
  if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
    event.preventDefault();
  }
};

export const convertKeysToSnakeCase = (obj) => {
  const snakeCaseObject = {};

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      snakeCaseObject[snakeCaseKey] = obj[key];
    }
  }
  return snakeCaseObject;
};

export const totalKeySum = (array, key) => {
  const totalSum = array.reduce((sum, item) => {
    if (item[key])
      // eslint-disable-next-line
      sum += parseFloat(item[key]);

    return sum;
  }, 0);
  return totalSum;
};
