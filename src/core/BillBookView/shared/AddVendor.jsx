/* @flow */
/**
 * @fileoverview  Create Edit Invoice Container
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
// import moment from 'moment';
// import Select from '@components/Select/Select.jsx';
import Input from '@components/Input/Input.jsx';
import { pincodeKeyPress } from '@components/utils';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import CreditCardIcon from '@material-ui/icons/CreditCard';
// import CloudUpload from '@material-ui/icons/CloudUpload';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import {
  validateName,
  validatePan,
  validateOnlyText,
  validateEmail,
  validatePhone,
  validateAddress,
  validateGst,
  validatePincode,
  validateAccountNumber,
  validateIfsc,
  validateRequired,
} from '@services/Validation.jsx';
import * as css from './AddVendor.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
  },
}));

const BANK_VALIDATION = {
  accountNo: {
    errMsg: 'Please enter valid account number',
    test: validateAccountNumber,
  },
  ifsc: {
    errMsg: 'Please enter valid IFSC',
    test: validateIfsc,
  },
  branch: {
    errMsg: 'Please enter valid branch',
    test: validateRequired,
  },
  beneficiaryName: {
    errMsg: 'Please enter valid name',
    test: validateName,
  },
};

const BankDetails = (props) => {
  const initialValidationErr = Object.keys(BANK_VALIDATION).map((k) => ({
    [k]: false,
  }));
  const { onInputChange, data, validateAll } = props;
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const classes = useStyles();

  const validateAllFields = () => {
    return Object.keys(BANK_VALIDATION).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !BANK_VALIDATION?.[v]?.test(data[v]);
      return a;
    }, {});
  };

  useEffect(() => {
    if (validateAll) {
      const v = validateAllFields();
      const valid = Object.values(v).every((val) => !val);
      if (!valid) {
        setValidationErr((s) => ({ ...s, ...v }));
      }
    }
  }, [validateAll]);

  const getEventNameValue = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    return [name, value];
  };
  const reValidate = (e) => {
    const [name, value] = getEventNameValue(e);
    setValidationErr((v) => ({
      ...v,
      [name]: !BANK_VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onChange = (e) => {
    reValidate(e);
    onInputChange(e, true);
  };

  return (
    <>
      <div className={css.fields}>
        <div className={css.fieldRow}>
          <Input
            name="accountNo"
            value={data.accountNo}
            onChange={onChange}
            onBlur={reValidate}
            error={validationErr.accountNo}
            helperText={
              validationErr.accountNo ? BANK_VALIDATION?.accountNo?.errMsg : ''
            }
            className={`${css.greyBorder} ${classes.root}`}
            label="Account Number"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            type="number"
          />
        </div>
      </div>
      <div className={css.fields}>
        <div className={css.fieldRow}>
          <Input
            name="ifsc"
            value={data.ifsc}
            onChange={onChange}
            onBlur={reValidate}
            error={validationErr.ifsc}
            helperText={validationErr.ifsc ? BANK_VALIDATION?.ifsc?.errMsg : ''}
            className={`${css.greyBorder} ${classes.root}`}
            label="IFSC Code"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
          />
        </div>
      </div>

      <div className={css.fields}>
        <div className={css.fieldRow}>
          <Input
            name="branch"
            value={data.branch}
            onChange={onChange}
            onBlur={reValidate}
            error={validationErr.branch}
            helperText={
              validationErr.branch ? BANK_VALIDATION?.branch?.errMsg : ''
            }
            label="Branch Name & City"
            variant="standard"
            className={`${css.greyBorder} ${classes.root}`}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
          />
        </div>
      </div>

      <div className={css.fields}>
        <div className={css.fieldRow}>
          <Input
            name="beneficiaryName"
            value={data.beneficiaryName}
            onChange={onChange}
            onBlur={reValidate}
            error={validationErr.beneficiaryName}
            helperText={
              validationErr.beneficiaryName
                ? BANK_VALIDATION?.beneficiaryName?.errMsg
                : ''
            }
            label="Benficiary Name"
            variant="standard"
            className={`${css.greyBorder} ${classes.root}`}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
          />
        </div>
      </div>

      <div className={css.fields}>
        <div className={css.validatebankRow}>
          <Checkbox
            name="isMsme"
            checked={data.isMsme}
            onChange={onInputChange}
          />
          <div className={css.validatebank}>
            <div className={css.title}>Validate the Bank Account</div>
            <div className={css.desc}>
              On checking the box, Rs 1 will be deducted for validation
              purposes.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const VALIDATION = {
  vendorName: {
    errMsg: 'Please provide valid Input',
    test: validateName,
    section: 1,
  },
  phone: {
    errMsg: 'Please provide valid Input',
    test: validatePhone,
    section: 1,
  },
  email: {
    errMsg: 'Please provide valid Input',
    test: validateEmail,
    section: 1,
  },
  pan: {
    errMsg: 'Please provide valid Input',
    test: validatePan,
    section: 2,
  },
  gstin: {
    errMsg: 'Please provide valid Input',
    test: validateGst,
    section: 2,
  },
  address: {
    errMsg: 'Please provide valid Input',
    test: validateAddress,
    section: 3,
  },
  city: {
    errMsg: 'Please provide valid Input',
    test: (v) => validateOnlyText(v),
    section: 3,
  },
  pincode: {
    errMsg: 'Please provide valid Input',
    test: validatePincode,
    section: 3,
  },
};

const bankData = {
  accountNo: '',
  ifsc: '',
  branch: '',
  beneficiaryName: '',
  validate: false,
};
// const bankData = {
//   accountNo: '1234123413244567',
//   ifsc: 'IFSC',
//   branch: 'Branch',
//   beneficiaryName: 'BeneficiaryName',
//   validate: false,
// };

// const initialState = {
//   vendorName: 'MyVendor',
//   phone: '9595785854',
//   email: 'k@k.k',
//   pan: 'FFFFF3333F',
//   gstin: '123123123123123',
//   isMsme: false,
//   address: 'No 10, Dubai kuruku sandhu, Dubai Main Road',
//   city: 'Dubai',
//   pincode: '622154',
//   bankDetails: [{ ...bankData }],
// };
const initialState = {
  vendorName: '',
  phone: '',
  email: '',
  pan: '',
  gstin: '',
  isMsme: false,
  address: '',
  city: '',
  pincode: '',
  bankDetails: [{ ...bankData }],
};

const AddNewVendor = ({ onCloseVendor }) => {
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const classes = useStyles();

  const { organization, enableLoading, user } = useContext(AppContext);
  const [section, setSection] = useState(1);
  const [vendor, setVendor] = useState(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [bankIndex, setBankIndex] = useState(0);
  const [bankValidateAll, setBankValidateAll] = useState(false);
  const bankLength = useRef(0);
  // const [vendorId, setVendorId] = useState({});
  const { openSnackBar } = useContext(AppContext);

  const getGstDetail = () => {
    enableLoading(true);
    RestApi(`gstins`, {
      method: METHOD.POST,
      payload: {
        gstin: vendor.gstin,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const {
            address_line1: adr1,
            address_line2: adr2,
            city,
            pincode,
            vendor_name: vendorName,
          } = res;
          const address = `${adr1}, ${adr2}`;
          setVendor((v) => ({ ...v, address, city, pincode, vendorName }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const validateAllFields = (validationData, isBank) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(
        isBank ? vendor?.bankDetails?.[bankIndex]?.[v] : vendor[v],
      );
      return a;
    }, {});
  };

  const onAddBank = () => {
    bankLength.current += 1;
    setBankIndex(bankLength.current - 1);
    setVendor((v) => {
      const bankDetails = [...v.bankDetails, { ...bankData }];
      return { ...v, bankDetails };
    });
    setSection(4);
  };

  const onEditBank = (i) => {
    setBankIndex(i);
    setSection(4);
  };

  const resetValues = () => {
    const bankDetails = [{ ...bankData }];
    setVendor({ ...initialState, bankDetails });
  };

  const close = () => {
    resetValues();
    onCloseVendor();
  };

  const onChangeNextSection = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      if (VALIDATION[k]?.section === section) {
        sectionValidation[k] = VALIDATION[k];
      }
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    let skipToBankList = 0;
    if (section === 2) getGstDetail();
    if (section === 3) {
      if (bankLength.current > 0) {
        skipToBankList += 1;
      }
      if (bankLength.current === 0) {
        setVendor((val) => {
          const bankDetails = [{ ...bankData }];
          return { ...val, bankDetails };
        });
      }
      bankLength.current += 1;
    }
    if (section === 4) {
      const vData = validateAllFields(BANK_VALIDATION, true);
      const isValid = Object.values(vData).every((val) => !val);
      if (!isValid) {
        setBankValidateAll(true);
        return;
      }
      setBankValidateAll(false);
    }
    setSection((s) => {
      return s >= 5 ? 5 : s + 1 + skipToBankList;
    });
  };

  const onChangeBackSection = () => {
    if (section === 1) {
      close();
      return;
    }
    let skipBank = 0;
    if (section === 5) skipBank += 1;
    setSection((s) => s - 1 - skipBank);
  };

  const getEventNameValue = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    return [name, value];
  };

  const reValidate = (e) => {
    const [name, value] = getEventNameValue(e);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (e, isBankData) => {
    // eslint-disable-next-line prefer-const
    let [name, value] = getEventNameValue(e);
    const i = bankIndex;
    if (isBankData) {
      setVendor((v) => {
        const bankDetails = [...v.bankDetails];
        if (!bankDetails[i]) {
          bankDetails[i] = { ...bankData };
          bankLength.current += 1;
        }
        bankDetails[i][name] = value;
        return { ...v, bankDetails };
      });
      return;
    }
    reValidate(e);
    if (e?.target?.type === 'checkbox') value = e?.target?.checked;
    setVendor((v) => ({ ...v, [name]: value }));
  };

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown error occured',
      type: MESSAGE_TYPE.ERROR,
    });
  };

  const onAddVendor = () => {
    const payload = {
      name: vendor.vendorName,
      pan_number: vendor.pan,
      contacts: [
        {
          name: vendor.vendorName,
          mobile_number: vendor.phone,
          email: vendor.email,
        },
      ],
      location: [
        {
          address_line1: vendor.address,
          city: vendor.city,
          gstin: vendor.gstin,
          pincode: vendor.pincode,
          state: 'Tamil Nadu',
          country: 'India',
        },
      ],
      bank_details: vendor.bankDetails.map((b) => ({
        bank_name: 'HDFC',
        bank_account_number: b.accountNo,
        bank_branch_name: b.branch,
        bank_ifsc_code: b.ifsc,
        account_holder_name: b.beneficiaryName,
      })),
    };
    RestApi(`organizations/${organization.orgId}/entities?type[]=vendor`, {
      method: METHOD.POST,
      payload,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          onCloseVendor(res);
        } else {
          const msg = res?.message || Object.values(res?.errors)?.join(',');
          showError(msg);
        }
      })
      .catch(() => showError());
  };

  useEffect(() => {
    // getVendor();
  }, []);

  return (
    <div className={css.addNewVendorContainer}>
      {/* <div className={css.fields}>
                        <div className={css.fieldHeadingRow}>
                            <div className={css.fieldsHeading} onClick={onCloseVendor}>
                                {(section === 1 || section === 2) && 'Add New Vendor'}
                                {section === 3 && 'Add Vendor Address'}
                                {section === 4 && 'Add Vendor Bank Address'}
                            </div>
                        </div>
                        <div className={css.fieldsHeadingLine}>
                            <hr className={css.headingLineColor} />
                        </div>
                    </div> */}

      <div className={css.inputContainer}>
        {section === 1 && (
          <>
            <Input
              name="vendorName"
              onBlur={reValidate}
              error={validationErr.vendorName}
              helperText={
                validationErr.vendorName ? VALIDATION?.vendorName?.errMsg : ''
              }
              value={vendor.vendorName}
              className={`${css.greyBorder} ${classes.root}`}
              label="Vendor Name"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
            <Input
              name="phone"
              onBlur={reValidate}
              error={validationErr.phone}
              helperText={validationErr.phone ? VALIDATION?.phone?.errMsg : ''}
              value={vendor.phone}
              className={`${css.greyBorder} ${classes.root}`}
              label="Phone Number"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
            <Input
              name="email"
              onBlur={reValidate}
              error={validationErr.email}
              helperText={validationErr.email ? VALIDATION?.email?.errMsg : ''}
              value={vendor.email}
              label="Email Address"
              variant="standard"
              className={`${css.greyBorder} ${classes.root}`}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
          </>
        )}

        {section === 2 && (
          <>
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <Input
                  name="pan"
                  onBlur={reValidate}
                  error={validationErr.pan}
                  helperText={validationErr.pan ? VALIDATION?.pan?.errMsg : ''}
                  value={vendor.pan}
                  label="Pan"
                  variant="standard"
                  className={`${css.greyBorder} ${classes.root}`}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                />
              </div>
            </div>

            <div className={css.fields}>
              <div className={css.fieldRow}>
                <Input
                  name="gstin"
                  onBlur={reValidate}
                  error={validationErr.gstin}
                  helperText={
                    validationErr.gstin ? VALIDATION?.gstin?.errMsg : ''
                  }
                  value={vendor.gstin}
                  label="GSTN"
                  variant="standard"
                  className={`${css.greyBorder} ${classes.root}`}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                />
              </div>
            </div>

            <div className={css.isMsme}>
              <Checkbox
                name="isMsme"
                checked={vendor.isMsme}
                onChange={onInputChange}
              />
              <span>Check the box if the vendor is MSME</span>
            </div>
          </>
        )}

        {section === 3 && (
          <>
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <Input
                  name="address"
                  onBlur={reValidate}
                  error={validationErr.address}
                  helperText={
                    validationErr.address ? VALIDATION?.address?.errMsg : ''
                  }
                  value={vendor.address}
                  className={`${css.greyBorder} ${classes.root}`}
                  label="No/Building Name/Street"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  multiline
                  rows={4}
                />
              </div>
            </div>
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <Input
                  name="city"
                  onBlur={reValidate}
                  error={validationErr.city}
                  helperText={
                    validationErr.city ? VALIDATION?.city?.errMsg : ''
                  }
                  value={vendor.city}
                  className={`${css.greyBorder} ${classes.root}`}
                  label="City"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                />
              </div>
            </div>

            <div className={css.fields}>
              <div className={css.fieldRow}>
                <Input
                  name="pincode"
                  onBlur={reValidate}
                  error={validationErr.pincode}
                  helperText={
                    validationErr.pincode ? VALIDATION?.pincode?.errMsg : ''
                  }
                  value={vendor.pincode}
                  label="Postal Code"
                  variant="standard"
                  className={`${css.greyBorder} ${classes.root}`}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  onKeyPress={pincodeKeyPress}
                />
              </div>
            </div>
          </>
        )}

        {section === 4 && vendor.bankDetails?.[bankIndex] && (
          <BankDetails
            onInputChange={onInputChange}
            data={vendor.bankDetails?.[bankIndex]}
            validateAll={bankValidateAll}
          />
        )}

        {section === 5 && (
          <>
            <div className={css.bankCardsContainer}>
              {vendor.bankDetails.map((item, i) => (
                <div
                  key={item.accountNo}
                  className={css.bankCard}
                  onClick={() => onEditBank(i)}
                  role="menu"
                >
                  <CreditCardIcon className={css.cardIcon} />
                  <span className={css.cardNo}>
                    **** **** **** {item?.accountNo?.substr(12, 4)}
                  </span>
                </div>
              ))}
            </div>
            <div className={css.bankAction}>
              <span
                className={css.addBank}
                onClick={onAddBank}
                value="ss"
                // underline="always"
                role="button"
              >
                Add Another Account
              </span>
              {/* <span className={css.addBank} onClick={addOption} value="ss" underline="always">
                    + Edit
                  </span> */}
            </div>
          </>
        )}
      </div>

      <div className={css.actionContainer}>
        <Button
          variant="outlined"
          className={css.outlineButton}
          onClick={() => onChangeBackSection('exit')}
          size="medium"
        >
          {section === 1 ? 'Cancel' : 'Back'}
        </Button>
        {(section === 1 || section === 2 || section === 3) && (
          <Button
            variant="contained"
            className={css.submitButton}
            onClick={() => onChangeNextSection()}
            size="medium"
          >
            Next
          </Button>
        )}
        {section === 4 && (
          <Button
            variant="contained"
            className={css.submitButton}
            onClick={() => onChangeNextSection()}
            size="medium"
          >
            Add
          </Button>
        )}
        {section === 5 && (
          <Button
            variant="contained"
            className={css.submitButton}
            onClick={onAddVendor}
            size="medium"
          >
            Done
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddNewVendor;
