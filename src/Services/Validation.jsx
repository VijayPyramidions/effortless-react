export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const NAME_REGEX = /^[a-zA-Z ]{1,100}$/;
export const PAN_REGEX = /[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
export const IFSC_REGEX = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
export const INVOICE_REGEX = /^[A-Za-z0-9-]+$/;
export const VEHICLE_NUMBER_REGEX = /[A-Za-z]{2}[0-9]{2}[A-Za-z]{0,4}[0-9]{4}/;
export const URL_REGEX =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/\S*)?$/;
export const SWIFT_REGEX = /[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;

const test = (value, regex) => {
  return regex.test(value);
};

export const validateLength = (value, min, max) =>
  test(value, new RegExp(`^.{${min},${max || min}}$`));
export const validateNumLength = (value, min, max) =>
  test(value, new RegExp(`^\\d{${min},${max || min}}$`));
export const validateRequired = (value) => !!value;
export const validateURL = (value) => URL_REGEX.test(value);

export const validateWholeNum = (v) => test(v, new RegExp(/^\d+$/));
export const validateDecimalNum = (v, d) =>
  test(v, new RegExp(`^\\d+([.]\\d{1,${d}}){0,1}$`));
export const validateOnlyText = (v, noWhitespace) =>
  test(v, new RegExp(`^[A-Za-z${noWhitespace ? '' : ' '}]+$`));
export const validateNoSymbol = (v, noWhitespace) =>
  test(v, new RegExp(`^[A-Za-z0-9${noWhitespace ? '' : ' '}]+$`));

export const validateName = (name) => name && NAME_REGEX.test(name);
export const validateEmail = (email) => email && EMAIL_REGEX.test(email);
export const validatePhone = (phone) => phone && PHONE_REGEX.test(phone);
export const validatePan = (pan) => pan && PAN_REGEX.test(pan);
export const validatePassword = validateRequired;
export const validateAddress = (address) => validateLength(address, 1, 500);
export const validateGst = (gst) => validateLength(gst, 15);
export const validateAadhar = (aadhar) => validateLength(aadhar, 12);
export const validatePincode = (pin) => validateNumLength(pin, 6);
export const validatePrice = (v) => validateDecimalNum(v, 2);
export const validateAccountNumber = (v) => validateNumLength(v, 16);
export const validateIfsc = (v) => v && IFSC_REGEX.test(v);
export const validateInvoice = (v) => v && INVOICE_REGEX.test(v);
export const validateCin = (cin) => validateLength(cin, 21);
export const validatePasswordWithLength = (val) => validateLength(val, 5, 50);
export const validateNum = (val) => validateWholeNum(val);
export const validateVehicleNumber = (v) => v && VEHICLE_NUMBER_REGEX.test(v);
export const validateSwiftCode = (v) => v && SWIFT_REGEX.test(v);
