/* @flow */
/**
 * @fileoverview Platform Utilities
 */

const extractErrorMessage = (errors) => {
  const fields = Object.keys(errors).map((key) => ({
    fieldName: key,
    fieldErrorMsg: errors[key],
  }));

  return fields;
};

let timeout = 0;

const debounce = (func, wait = 1000) => {
  return (args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      func(args);
    }, wait);
  };
};

export { extractErrorMessage, debounce };
