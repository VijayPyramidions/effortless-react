/* eslint-disable no-unused-vars */
/* @flow */
/**
 * @fileoverview  Add Vendor
 */

import React, { useState, useContext } from 'react';
import Input, { MobileNumberFormatCustom } from '@components/Input/Input.jsx';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import * as Mui from '@mui/material';
// import SearchIcon from '@material-ui/icons/Search';
import * as themes from '@root/theme.scss';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import Select from '@components/Select/Select.jsx';
import { ContactIcon, CheckCircle } from '@components/SvgIcons/SvgIcons.jsx';
import JSBridge from '@nativeBridge/jsbridge';
// import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';

import AppContext from '@root/AppContext.jsx';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateGst,
  validateAccountNumber,
  validateIfsc,
  validatePincode,
  validateAddress,
  validateNoSymbol,
  validateRequired,
} from '@services/Validation.jsx';
import * as css from './VendorCustomerCategory.scss';

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
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));

const PageTitle = ['1 of 2', '2 0f 2'];

const VALIDATION = {
  gst: {
    errMsg: 'Please provide valid GST',
    test: validateGst,
    page: 1,
  },
  pincode: {
    errMsg: 'Enter valid Pincode',
    test: validatePincode,
    page: 1,
  },
  address1: {
    errMsg: 'Enter valid Address',
    test: validateAddress,
    page: 1,
  },
  city: {
    errMsg: 'Enter valid City',
    test: validateNoSymbol,
    page: 1,
  },
  state: {
    errMsg: 'Enter valid State',
    test: validateRequired,
    page: 1,
  },
  country: {
    errMsg: 'Enter valid country',
    test: validateRequired,
    page: 1,
  },
  vendorName: {
    errMsg: 'Enter valid Name',
    test: validateRequired,
    page: 1,
  },
  contactName: {
    errMsg: 'Please provide valid Name',
    test: validateName,
    page: 2,
  },
  contactPhone: {
    errMsg: 'Please provide valid Phone',
    test: validatePhone,
    page: 2,
  },
  contactEmail: {
    errMsg: 'Please provide valid Email',
    test: validateEmail,
    page: 2,
  },
  accountNo: {
    errMsg: 'Enter valid Account',
    test: validateRequired,
    page: 3,
  },
  ifsc: {
    errMsg: 'Enter valid IFSC',
    test: validateIfsc,
    page: 3,
  },
};

const initialState = {
  // page 1 - GSTIN
  gst: '',
  noGst: false,
  address1: '',
  pincode: '',
  city: '',
  state: '',
  country: '',
  vendorName: '',
  // Page 2 - Details
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  // Page 3 - Banking
  accountNo: '',
  ifsc: '',
  //  validateBankAccount: false,
};

const VendorCustomerCategory = ({
  handleClose2,
  addVendorComplete,
  onCancel,
  handleParent2,
  fetch,
  handleClosePeople,
}) => {
  const classes = useStyles();
  const {
    organization,
    enableLoading,
    user,
    registerEventListeners,
    deRegisterEventListener,
    changeSubView,
    openSnackBar,
  } = useContext(AppContext);
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [state, setState] = useState(initialState);
  const [page, setPage] = useState(1);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [vendorAvailable, setVendorAvailable] = useState('');
  // const [contactDetails, setContactDetails] = useState();
  // const [drawer, setDrawer] = useState({
  //   contact: false,
  // });
  // const [query, setQuery] = useState('');

  const showError = (message) => {
    openSnackBar({
      message: message || 'Unknown error occured',
      type: MESSAGE_TYPE.ERROR,
    });
  };

  const showSuccess = (message) => {
    openSnackBar({
      message: message || 'Last operation was successful',
      type: MESSAGE_TYPE.INFO,
    });
  };

  //  const existingVendorFlow = () => {
  //    addVendorComplete('exists');
  //  };
  const device = localStorage.getItem('device_detect');

  const addVendor = () => {
    enableLoading(true);

    // TODO - kbt - Call POST /vendor
    const payload = {
      name: state.vendorName,
      // pan_number: state.pan,
      contacts: [
        {
          name: state.contactName,
          mobile_number: state.contactPhone,
          email: state.contactEmail,
        },
      ],
      location: {
        address_line1: state.address1,
        city: state.city,
        gstin: state.gst,
        pincode: state.pincode,
        state: state.state,
        country: state.country,
      },

      //  bank_details: [
      //    {
      //      bank_name: state.bankName,
      //      bank_account_number: state.accountNo,
      //      bank_branch_name: state.bankBranch,
      //      bank_ifsc_code: state.ifsc,
      //      beneficiary_mobile: state.contactPhone,
      //      account_holder_name: state.contactName,
      //    },
      //  ],
    };
    RestApi(`organizations/${organization.orgId}/entities`, {
      method: METHOD.POST,
      payload: { ...payload, type: 'customer' },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res) {
          //  addVendorComplete('success', res);
          if (fetch) {
            fetch('customer');
          }
          handleClose2(false);
          if (res.id) {
            showSuccess('Customer successfully created');
          }
        } else {
          const msg = res?.message || Object.values(res?.errors)?.join(',');
          if (!res.id) {
            showError(msg);
          }
        }
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  //
  const getGstAddress = (gstin) => {
    enableLoading(true);
    RestApi(`gstins`, {
      method: METHOD.POST,
      payload: {
        organization_id: organization.orgId,
        gstin: gstin.toUpperCase(),
        gstin_type: 'Customer',
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const {
            address_line1: address1,
            city,
            state: stateRes,
            pincode,
            country,
            // customer_name: vendorName,
          } = res;
          setState((s) => ({
            ...s,
            address1,
            city,
            state: stateRes,
            pincode,
            vendorName: res.customer_name || res.name || res.vendor_name,
            country,
          }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const existingVendorFlow = () => {
    addVendorComplete('exists');
  };

  // all states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const fetchCountries = () => {
    RestApi('countries', {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setCountries(
          res.data.map((c) => ({
            payload: c.name,
            text: c.name,
          })),
        );
      }
    });
  };
  const fetchStates = () => {
    RestApi('states', {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setStates(
          res.data.map((c) => ({
            payload: c.state_name,
            text: c.state_name,
          })),
        );
      }
    });
  };

  React.useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  // const getGstAddress = () => {
  //   enableLoading(true);
  //   RestApi(`gstins`, {
  //     method: METHOD.POST,
  //     payload: {
  //       organization_id: organization.orgId,
  //       gstin: state.gst,
  //     },
  //     headers: {
  //       Authorization: `Bearer ${user.activeToken}`,
  //     },
  //   })
  //     .then((res) => {
  //       enableLoading(false);
  //       if (res && !res.error) {
  //         const {
  //           address_line1: address1,
  //           city,
  //           state: stateResp,
  //           pincode,
  //         } = res;
  //         setState((s) => ({
  //           ...s,
  //           address1,
  //           city,
  //           state: stateResp,
  //           pincode,
  //         }));
  //       }
  //     })
  //     .catch(() => {
  //       enableLoading(false);
  //     });
  // };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(state[v]);
      return a;
    }, {});
  };

  const onPageNext = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      if (VALIDATION[k]?.page === page) {
        sectionValidation[k] = VALIDATION[k];
      }
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    // No validation if checkbox ticked in page 1
    const bypass = page === 1 && state.noGst;
    if (!bypass && !valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    // if (page === 1 && !state.noGst && state.gst) getGstAddress();
    if (page < 2 && device === 'mobile') setPage((p) => p + 1);
    if (page === 2 || device === 'desktop') addVendor();
  };

  const onPagePrev = () => {
    if (page > 1) setPage((p) => p - 1);
    if (page === 1) onCancel();
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value =
      ps?.target?.type === 'checkbox' ? ps?.target?.checked : ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    const bypass = name === 'gst' && state.noGst;
    setValidationErr((v) => ({
      ...v,
      [name]: !bypass && !VALIDATION?.[name]?.test?.(value),
    }));
  };

  React.useEffect(() => {
    if (state.vendorName !== '') {
      reValidate({ target: { name: 'vendorName', value: state.vendorName } });
    }
  }, [state.vendorName]);
  React.useEffect(() => {
    if (state.address1 !== '') {
      reValidate({ target: { name: 'address1', value: state.address1 } });
    }
  }, [state.address1]);
  React.useEffect(() => {
    if (state.pincode !== '') {
      reValidate({ target: { name: 'pincode', value: state.pincode } });
    }
  }, [state.pincode]);
  React.useEffect(() => {
    if (state.state !== '') {
      reValidate({ target: { name: 'state', value: state.state } });
    }
  }, [state.state]);
  React.useEffect(() => {
    if (state.city !== '') {
      reValidate({ target: { name: 'city', value: state.city } });
    }
  }, [state.city]);

  const checkVendorExistence = (gstin) => {
    const payload = {
      gstin: gstin.toUpperCase(),
      organization_id: organization.orgId,
      gstin_type: 'Customer',
    };
    RestApi(`gstins`, {
      method: METHOD.POST,
      payload,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && res.customer_id) {
        setVendorAvailable(res);
      } else {
        setVendorAvailable('');
      }
    });
  };

  //  const validateBankAccount = () => {
  //    const payload = {
  //      ifsc: state.ifsc,
  //      account_number: state.accountNo,
  //      name: state.beneficiaryName,
  //      mobile: state.contactPhone,
  //      organization_id: organization.orgId,
  //    };
  //    RestApi(`bank_details_verifications`, {
  //      method: METHOD.POST,
  //      payload,
  //      headers: {
  //        Authorization: `Bearer ${user.activeToken}`,
  //      },
  //    }).then((res) => {
  //      if (res && !res.error && res.verified) {
  //        showSuccess('Verification Successful');
  //      } else {
  //        showError(res?.message || 'Verification Not Successful');
  //      }
  //    });
  //  };

  const fetchPincodeDetails = (code) => {
    enableLoading(true);
    RestApi(`pincode_lookups?pincode=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          const { city, state: stateRes, country } = res;

          setState((s) => ({
            ...s,
            city,
            state: stateRes,
            country,
          }));
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Pincode error`,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    if (name === 'noGst' && value) {
      setValidationErr((s) => ({ ...s, gst: false }));
    }
    setState((s) => ({
      ...s,
      [name]:
        typeof value === 'boolean' ? value : value?.toString().toUpperCase(),
    }));
    if (name === 'gst' && value.length === 15) {
      checkVendorExistence(value);
      getGstAddress(value);
    }
    if (name === 'copyContactNameAsVendor' && value)
      setState((s) => ({ ...s, vendorName: s.contactName }));
    //  if (name === 'validateBankAccount' && value) validateBankAccount();
    if (name === 'pincode' && value.length === 6) {
      fetchPincodeDetails(value);
    }
  };
  // const onTriggerDrawer = (name) => {
  //   setDrawer((d) => ({ ...d, [name]: true }));
  // };
  // const handleBottomSheet1 = (name) => {
  //   setDrawer((d) => ({ ...d, [name]: false }));
  // };
  const handleCustomer = (ele) => {
    setTimeout(() => {
      setState((s) => ({
        ...s,
        contactName: ele.Name,
        contactPhone: ele.phone,
        contactEmail: ele.email,
      }));
      // setIndividualName(ele.Name);
      // setMobileNo(ele.Phoneno);
    }, 100);
    // handleBottomSheet1('contact');
  };
  const getContacts = () => {
    // enableLoading(true);
    JSBridge.getContacts();
    // onTriggerDrawer('contact');
    // setContactDetails(JSON.parse(localStorage.getItem('contact_details')));
  };

  const setContacts = (response) => {
    // JSBridge.getContacts();
    // onTriggerDrawer('contact');
    handleCustomer(JSON.parse(response.detail.value));
    // enableLoading(false);
  };

  React.useEffect(() => {
    registerEventListeners({
      name: 'onRecieveContactsVendor',
      method: setContacts,
    });
    return () =>
      deRegisterEventListener({
        name: 'onRecieveContactsVendor',
        method: setContacts,
      });
  }, []);
  // const device = localStorage.getItem('device_detect');
  return (
    <div className={css.magicLinkContainer}>
      <div className={css.headerContainer}>
        <div className={css.headerLabel}>
          Add a New Customer - {PageTitle[page - 1]}
        </div>
        <span className={css.headerUnderline} />
      </div>
      {device === 'mobile' ? (
        <div className={css.inputContainer}>
          {page === 1 && (
            <>
              <Input
                name="gst"
                disabled={state.noGst}
                onBlur={reValidate}
                error={validationErr.gst}
                helperText={validationErr.gst ? VALIDATION?.gst?.errMsg : ''}
                className={`${css.greyBorder} ${classes.root}`}
                label="GSTIN"
                variant="standard"
                value={state.gst}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  type: 'text',
                  endAdornment: vendorAvailable ? <CheckCircle /> : null,
                }}
                fullWidth
                onChange={onInputChange}
                theme="light"
                required
              />
              {!vendorAvailable && state.gst === '' && (
                <div className={css.noGst}>
                  <Checkbox
                    name="noGst"
                    checked={state.noGst}
                    onChange={onInputChange}
                  />
                  <div htmlFor="whatsappNotify" className={css.label}>
                    My Customer Does Not Have a GST Number
                  </div>
                </div>
              )}

              {!vendorAvailable && page === 1 && (
                <>
                  <Input
                    name="vendorName"
                    onBlur={reValidate}
                    error={validationErr.vendorName}
                    helperText={
                      validationErr.vendorName
                        ? VALIDATION?.vendorName?.errMsg
                        : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Customer Name"
                    variant="standard"
                    value={state.vendorName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    required
                  />

                  <Input
                    name="address1"
                    onBlur={reValidate}
                    error={validationErr.address1}
                    helperText={
                      validationErr.address1 ? VALIDATION?.address1?.errMsg : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Address"
                    variant="standard"
                    value={state.address1}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    required
                  />
                  <div className={css.twoFields}>
                    <Input
                      name="pincode"
                      onBlur={reValidate}
                      error={validationErr.pincode}
                      helperText={
                        validationErr.pincode ? VALIDATION?.pincode?.errMsg : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Pin Code"
                      variant="standard"
                      value={state.pincode}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        type: 'tel',
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      required
                    />
                    <Input
                      name="city"
                      onBlur={reValidate}
                      error={validationErr.city}
                      helperText={
                        validationErr.city ? VALIDATION?.city?.errMsg : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Town/City"
                      variant="standard"
                      value={state.city}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      required
                    />
                  </div>

                  <div className={css.twoFields}>
                    <Select
                      name="state"
                      onBlur={reValidate}
                      error={validationErr.state}
                      helperText={
                        validationErr.state ? VALIDATION?.state?.errMsg : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="State"
                      variant="standard"
                      options={states}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      defaultValue={state.state}
                      required
                    />
                    <Select
                      name="country"
                      onBlur={reValidate}
                      error={validationErr.country}
                      options={countries}
                      helperText={
                        validationErr.country ? VALIDATION?.country?.errMsg : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Country"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange}
                      theme="light"
                      defaultValue={state.country}
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}
          {!vendorAvailable && page === 2 && device === 'mobile' && (
            <>
              <Mui.Stack direction="row">
                <Input
                  name="contactName"
                  onBlur={reValidate}
                  error={validationErr.contactName}
                  helperText={
                    validationErr.contactName
                      ? VALIDATION?.contactName?.errMsg
                      : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Contact Name"
                  variant="standard"
                  value={state.contactName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  required
                />

                <span
                  className={css.contactIcon}
                  onClick={getContacts}
                  style={{
                    marginLeft: '-34px',
                    marginTop: '16px',
                  }}
                >
                  <ContactIcon />
                </span>
              </Mui.Stack>
              <Input
                name="contactPhone"
                onBlur={reValidate}
                error={validationErr.contactPhone}
                helperText={
                  validationErr.contactPhone
                    ? VALIDATION?.contactPhone?.errMsg
                    : ''
                }
                className={`${css.greyBorder} ${classes.root}`}
                label="Contact Phone Number"
                variant="standard"
                value={state.contactPhone}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  type: 'tel',
                }}
                fullWidth
                onChange={onInputChange}
                theme="light"
                required
              />
              <Input
                name="contactEmail"
                onBlur={reValidate}
                error={validationErr.contactEmail}
                helperText={
                  validationErr.contactEmail
                    ? VALIDATION?.contactEmail?.errMsg
                    : ''
                }
                className={`${css.greyBorder} ${classes.root}`}
                label="Contact Email ID"
                variant="standard"
                value={state.contactEmail}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={onInputChange}
                theme="light"
                required
              />
            </>
          )}
        </div>
      ) : (
        <div className={css.inputContainer}>
          {/* {page === 1 && ( */}
          <>
            <Input
              name="gst"
              disabled={state.noGst}
              onBlur={reValidate}
              error={validationErr.gst}
              helperText={validationErr.gst ? VALIDATION?.gst?.errMsg : ''}
              className={`${css.greyBorder} ${classes.root}`}
              label="GSTIN"
              variant="standard"
              value={state.gst}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                type: 'text',
                endAdornment: vendorAvailable ? <CheckCircle /> : null,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
              required
            />
            {!vendorAvailable && state.gst === '' && (
              <div className={css.noGst}>
                <Checkbox
                  name="noGst"
                  checked={state.noGst}
                  onChange={onInputChange}
                />
                <div htmlFor="whatsappNotify" className={css.label}>
                  My Customer Does Not Have a GST Number
                </div>
              </div>
            )}

            {!vendorAvailable && page === 1 && (
              <>
                <Input
                  name="vendorName"
                  onBlur={reValidate}
                  error={validationErr.vendorName}
                  helperText={
                    validationErr.vendorName
                      ? VALIDATION?.vendorName?.errMsg
                      : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Customer Name"
                  variant="standard"
                  value={state.vendorName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  required
                />

                <Input
                  name="address1"
                  onBlur={reValidate}
                  error={validationErr.address1}
                  helperText={
                    validationErr.address1 ? VALIDATION?.address1?.errMsg : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Address"
                  variant="standard"
                  value={state.address1}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  required
                />
                <div className={css.twoFields}>
                  <Input
                    name="pincode"
                    onBlur={reValidate}
                    error={validationErr.pincode}
                    helperText={
                      validationErr.pincode ? VALIDATION?.pincode?.errMsg : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Pin Code"
                    variant="standard"
                    value={state.pincode}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      type: 'tel',
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    required
                  />
                  <Input
                    name="city"
                    onBlur={reValidate}
                    error={validationErr.city}
                    helperText={
                      validationErr.city ? VALIDATION?.city?.errMsg : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Town/City"
                    variant="standard"
                    value={state.city}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    required
                  />
                </div>
                <div className={css.twoFields}>
                  <Select
                    name="state"
                    onBlur={reValidate}
                    error={validationErr.state}
                    helperText={
                      validationErr.state ? VALIDATION?.state?.errMsg : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="State"
                    variant="standard"
                    options={states}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    defaultValue={state.state}
                    required
                  />
                  <Select
                    name="country"
                    onBlur={reValidate}
                    error={validationErr.country}
                    options={countries}
                    helperText={
                      validationErr.country ? VALIDATION?.country?.errMsg : ''
                    }
                    className={`${css.greyBorder} ${classes.root}`}
                    label="Country"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    onChange={onInputChange}
                    theme="light"
                    defaultValue={state.country}
                    required
                  />
                </div>
              </>
            )}
          </>
          {/* )} */}
          {!vendorAvailable && (
            <>
              <Mui.Stack direction="row">
                <Input
                  name="contactName"
                  onBlur={reValidate}
                  error={validationErr.contactName}
                  helperText={
                    validationErr.contactName
                      ? VALIDATION?.contactName?.errMsg
                      : ''
                  }
                  className={`${css.greyBorder} ${classes.root}`}
                  label="Contact Name"
                  variant="standard"
                  value={state.contactName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange}
                  theme="light"
                  required
                />

                {/* <span
                  className={css.contactIcon}
                  onClick={getContacts}
                  style={{
                    marginLeft: '-34px',
                    marginTop: '16px',
                  }}
                >
                  <ContactIcon />
                </span> */}
              </Mui.Stack>
              <Input
                name="contactPhone"
                onBlur={reValidate}
                error={validationErr.contactPhone}
                helperText={
                  validationErr.contactPhone
                    ? VALIDATION?.contactPhone?.errMsg
                    : ''
                }
                className={`${css.greyBorder} ${classes.root}`}
                label="Contact Phone Number"
                variant="standard"
                value={state.contactPhone}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  type: 'tel',
                }}
                InputProps={{
                  inputComponent: MobileNumberFormatCustom,
                }}
                fullWidth
                onChange={onInputChange}
                theme="light"
                required
              />
              <Input
                name="contactEmail"
                onBlur={reValidate}
                error={validationErr.contactEmail}
                helperText={
                  validationErr.contactEmail
                    ? VALIDATION?.contactEmail?.errMsg
                    : ''
                }
                className={`${css.greyBorder} ${classes.root}`}
                label="Contact Email ID"
                variant="standard"
                value={state.contactEmail}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={onInputChange}
                theme="light"
                required
              />
            </>
          )}
        </div>
      )}
      {!vendorAvailable && (
        <>
          <div className={css.actionContainer}>
            <Button
              variant="outlined"
              className={css.outlineButton}
              onClick={() => onPagePrev()}
              size="medium"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                onPageNext();
                if (fetch && page === 2) {
                  handleClosePeople('close');
                }
              }}
              size="medium"
              className={css.submitButton}
            >
              {page === 2 || device === 'desktop'
                ? 'Save and Finish '
                : 'Save and Continue'}
            </Button>
          </div>
        </>
      )}
      {vendorAvailable && (
        <div className={css.vendorAvailable}>
          <p>{vendorAvailable.customer_name} is already a part of your list</p>
          <p>Would you like to record a bill?</p>
          {!fetch && (
            <Button
              onClick={() =>
                handleParent2({
                  id: vendorAvailable.customer_id,
                  name: vendorAvailable.customer_name,
                })
              }
              size="medium"
              className={css.submitButton}
            >
              Record Bill for {vendorAvailable.customer_name}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorCustomerCategory;
