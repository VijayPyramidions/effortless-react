import * as Mui from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input, { MobileNumberFormatCustom } from '@components/Input/Input.jsx';
import { pincodeKeyPress } from '@components/utils';
import { makeStyles, InputAdornment } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import {
  // validateName,
  // validateEmail,
  validateGst,
  validatePincode,
  // validateAddress,
  validateNoSymbol,
  validateRequired,
  validateIfsc,
  // validatePhone,
} from '@services/Validation.jsx';
import {
  GetInvoiceByIdState,
  GetInvoiceCustomerLocationState,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import { ContactIcon } from '@components/SvgIcons/SvgIcons.jsx';
// import JSBridge from '@nativeBridge/jsbridge';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import Select from '@components/Select/Select.jsx';
import AppContext from '@root/AppContext.jsx';
import * as mainCss from '../../App.scss';
import * as css from './InvoiceCurrency.scss';

const useStyles = makeStyles(() => ({
  root: {
    background: '#fff',
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    textTransform: 'capitalize',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `rgb(160, 164, 175) !important`,
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

const VALIDATION = {
  name: {
    errMsg: 'Enter valid Name',
    test: validateRequired,
  },
};

const VALIDATIONADDRESS = {
  gstin: {
    errMsg: 'Please provide valid GST',
    test: validateGst,
  },
  pincode: {
    errMsg: 'Enter valid Pincode',
    test: (v) => (v?.toLowerCase() === 'india' ? validatePincode : true),
  },
  address_line1: {
    errMsg: 'Enter valid Address',
    test: validateRequired,
  },
  // address_line2: {
  //   errMsg: 'Enter valid Address',
  //   test: validateRequired,
  // },
  city: {
    errMsg: 'Enter valid City',
    test: validateNoSymbol,
  },
  state: {
    errMsg: 'Enter valid State',
    test: validateRequired,
  },
  country: {
    errMsg: 'Enter valid Country',
    test: validateRequired,
  },
};

const VALIDATIONCONTACT = {
  name: {
    errMsg: 'Please provide valid Name',
    test: () => true,
  },
  mobile_number: {
    errMsg: 'Please provide valid Phone',
    test: () => true,
  },
  email: {
    errMsg: 'Please provide valid Email',
    test: () => true,
  },
};

const VALIDATIONBANK = {
  bank_account_number: {
    errMsg: 'Enter valid Account Number',
    test: validateRequired,
  },
  bank_ifsc_code: {
    errMsg: 'Enter valid IFSC Code',
    test: validateIfsc,
  },
  bank_name: {
    errMsg: 'Enter valid Bank Name',
    test: validateRequired,
  },
  bank_branch_name: {
    errMsg: 'Enter valid Bank Branch Name',
    test: validateRequired,
  },
  account_holder_name: {
    errMsg: 'Enter valid Bank holder name',
    test: validateRequired,
  },
};

export const InvoiceCustomer = ({
  showValue,
  handleBottomSheet,
  type,
  openFrom,
  entitytype,
  buttons,
}) => {
  let etype = 'Customer';
  if (entitytype) {
    etype = entitytype;
  }
  const gtext = `This ${etype} Does Not Have a GST Number`;
  const classes = useStyles();
  const { organization, enableLoading, user, openSnackBar } =
    React.useContext(AppContext);
  const [localState, setLocalState] = React.useState({
    name: '',
    // type: '',
  });
  const [numOfData, setNumOfData] = React.useState({
    address: [{}],
    contacts: [{}],
    bank: [{}],
  });
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const [addressValue, setAddressValue] = React.useState({});
  const [contactValue, setContactValue] = React.useState({});
  const [bankValue, setBankValue] = React.useState({});
  const [errorShow, setErrorShow] = React.useState({
    address: false,
    contact: false,
    bank: false,
  });
  const device = localStorage.getItem('device_detect');
  const [redirect, setRedirect] = React.useState({
    address: 0,
    bank: 0,
    contact: 0,
  });
  const [allStates, setAllStates] = React.useState([]);
  const [countries, setCountries] = React.useState([]);

  React.useEffect(() => {
    setTimeout(() => {
      setRedirect({
        address: numOfData?.address?.length,
        bank: numOfData?.bank?.length,
        contact: numOfData?.contacts?.length,
      });
    }, 1000);
  }, [numOfData?.address, numOfData?.bank, numOfData?.contacts]);

  const fetchAllContacts = () => {
    const requiredType =
      type === 'customers' || type === 'vendors' ? type : 'entities';
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/${requiredType}/${showValue?.id}/contacts?show=all`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          const tempCont = res?.data?.filter((val) => val?.active);
          if (tempCont?.length > 0) {
            setNumOfData((prev) => ({
              ...prev,
              contacts: [...tempCont],
            }));
          } else if (tempCont?.length === 0) {
            setNumOfData((prev) => ({
              ...prev,
              contacts: [{}],
            }));
          }
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const fetchAllAddress = () => {
    const requiredType =
      type === 'customers' || type === 'vendors' ? type : 'entities';
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/${requiredType}/${
        showValue?.id
      }/locations?show=all?entity_type=${type?.toLowerCase()}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          const tempAddr = res?.data?.reverse()?.filter((val) => val?.active);
          if (tempAddr?.length > 0) {
            setNumOfData((prev) => ({
              ...prev,
              address: [...tempAddr],
            }));
          } else if (tempAddr?.length === 0) {
            setNumOfData((prev) => ({
              ...prev,
              address: [{}],
            }));
          }
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const fetchAllBank = () => {
    const requiredType =
      type === 'customers' || type === 'vendors' ? type : 'entities';
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/${requiredType}/${showValue?.id}/bank_details`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          const tempBank = res?.data;
          if (tempBank?.length > 0) {
            setNumOfData((prev) => ({
              ...prev,
              bank: [...tempBank],
            }));
          } else if (tempBank?.length === 0) {
            setNumOfData((prev) => ({
              ...prev,
              bank: [{}],
            }));
          }
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useState(() => {
    setLocalState((prev) => ({ ...prev, name: showValue?.name }));
    fetchAllContacts();
    fetchAllAddress();
    if (
      (type === 'vendors' || type === 'lender' || type === 'promoter') &&
      showValue?.bank_detail
    ) {
      fetchAllBank();
    }
  }, [showValue]);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(localState[v]);
      return a;
    }, {});
  };

  const validateAllFieldsForAddr = (validationData, key) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(addressValue[key][v]);
      return a;
    }, {});
  };

  const validateAllFieldsForContact = (validationData, key) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(contactValue[key][v]);
      return a;
    }, {});
  };

  const validateAllFieldsForBank = (validationData, key) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(bankValue[key][v]);
      return a;
    }, {});
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setLocalState((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const submitField = () => {
    const from = type
      ?.split('')
      .slice(0, type?.length - 1)
      .join('');
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/entities/${showValue?.id}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        ...localState,
        type: from,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);

          if (device === 'desktop') {
            handleBottomSheet('edit');
          }
          if (device === 'mobile') {
            handleBottomSheet();
          }

          setTimeout(() => {
            openSnackBar({
              message: 'Successfully Updated',
              type: MESSAGE_TYPE.INFO,
            });
          }, 500);
        } else {
          openSnackBar({
            message: 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        }
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const onSubmit = () => {
    console.log(bankValue, contactValue, addressValue);
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      sectionValidation[k] = VALIDATION[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    const addressTemp = Object.keys(addressValue || {});
    let validForAddress = {};
    for (let i = 1; i <= addressTemp?.length; i += 1) {
      const addressSection = {};
      Object.keys(VALIDATIONADDRESS).forEach((k) => {
        addressSection[k] = VALIDATIONADDRESS[k];
      });
      if (addressValue[i]?.noGst) {
        const { gstin, ...addrValidate } = addressSection;
        const a = validateAllFieldsForAddr(addrValidate, i);
        const checkAddr = Object.values(a).every((val) => !val);
        validForAddress = { ...validForAddress, [i]: checkAddr };
      } else if (!addressValue[i]?.noGst) {
        const a = validateAllFieldsForAddr(addressSection, i);
        const checkAddr = Object.values(a).every((val) => !val);
        validForAddress = { ...validForAddress, [i]: checkAddr };
      }
    }

    const contactTemp = Object.keys(contactValue || {});
    let validForContact = {};
    for (let i = 1; i <= contactTemp?.length; i += 1) {
      const contactSection = {};
      Object.keys(VALIDATIONCONTACT).forEach((k) => {
        contactSection[k] = VALIDATIONCONTACT[k];
      });

      const a = validateAllFieldsForContact(contactSection, i);
      const checkContact = Object.values(a).every((val) => !val);
      validForContact = { ...validForContact, [i]: checkContact };
    }

    let validForBank = {};
    const bankTemp = Object.keys(bankValue || {});

    for (let i = 1; i <= bankTemp?.length; i += 1) {
      const bankSection = {};
      Object.keys(VALIDATIONBANK).forEach((k) => {
        bankSection[k] = VALIDATIONBANK[k];
      });

      const a = validateAllFieldsForBank(bankSection, i);
      const checkBank = Object.values(a).every((val) => !val);
      validForBank = { ...validForBank, [i]: checkBank };
    }

    const addrMain = Object.values(validForAddress).every((val) => val);
    const contactMain = Object.values(validForContact).every((val) => val);
    const bankMain =
      type === 'vendors' || type === 'lender' || type === 'promoter'
        ? Object.values(validForBank).every((val) => val)
        : true;
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    }
    if (!addrMain) {
      setErrorShow((p) => ({ ...p, address: true }));
    }
    if (!contactMain) {
      setErrorShow((p) => ({ ...p, contact: true }));
    }
    if (!bankMain) {
      setErrorShow((p) => ({ ...p, bank: true }));
    }
    if (contactMain && addrMain && bankMain && valid) {
      submitField();
    }
    console.log(valid, validForAddress, validForContact, validForBank);
    setTimeout(() => {
      setErrorShow({ address: false, contact: false, bank: false });
    }, [10000]);
  };

  const fetchAllStates = () => {
    enableLoading(true);
    RestApi(`states`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setAllStates(
            res.data.map((l) => ({
              payload: l.state_name,
              text: l.state_name,
            })),
          );
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const fetchCountries = () => {
    RestApi('countries', {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setCountries(
            res.data.map((c) => ({
              payload: c.name,
              text: c.name,
            })),
          );
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    fetchAllStates();
    fetchCountries();
  }, []);

  return (
    <>
      <Mui.Box sx={{ p: 4 }}>
        <Mui.Grid container spacing={3}>
          <Mui.Grid item xs={12}>
            <Input
              name="name"
              label={type === 'vendors' ? 'Vendor Name' : `${etype} Name`}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              className={`${css.greyBorder} ${classes.root}`}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              onBlur={reValidate}
              error={validationErr.name}
              helperText={validationErr.name ? VALIDATION?.name?.errMsg : ''}
              onChange={onInputChange}
              value={localState?.name}
              required
            />
          </Mui.Grid>
          {/* <Mui.Grid item xs={12}>
            <Input
              name="type"
              label="Business Type"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
            />
          </Mui.Grid> */}
        </Mui.Grid>

        <Mui.Grid container spacing={2} mt={2}>
          <Mui.Grid item xs={12}>
            <Mui.Stack direction="row" justifyContent="space-between">
              <Mui.Typography className={css.head}>
                Business Addresses
              </Mui.Typography>
              <Mui.IconButton
                component="a"
                href={`#byAddress${redirect?.address}`}
                title="Add New"
                style={{
                  display: buttons && buttons === 'no' ? 'none' : 'block',
                }}
              >
                <MuiIcons.AddCircleOutlineRounded
                  onClick={() => {
                    setNumOfData((prev) => ({
                      ...prev,
                      address: [
                        ...prev?.address,
                        {
                          address_line1: '',
                          address_line2: '',
                          city: '',
                          country: 'India',
                          gstin: '',
                          pincode: '',
                          state: 'Tamil Nadu',
                          noGst: false,
                        },
                      ],
                    }));
                  }}
                  className={css.icon}
                />
              </Mui.IconButton>
            </Mui.Stack>
          </Mui.Grid>
        </Mui.Grid>
        <div
          className={css.addressDivScroll}
          style={{
            border: errorShow?.address
              ? '1px solid #db0909'
              : '1px solid #A0A4AF',
            background: device === 'mobile' && '#fff',
          }}
        >
          {numOfData?.address?.map((val, index) => (
            <div className={css.inner}>
              <div>
                <AddressField
                  valueAddr={val}
                  index={index + 1}
                  setAddressValue={setAddressValue}
                  custId={showValue?.id || false}
                  type={type}
                  from={openFrom}
                  gtext={gtext}
                  allStates={allStates}
                  countries={countries}
                />
              </div>
              {device === 'desktop' && (
                <Mui.Grid item xs={12}>
                  <Mui.Stack direction="row" justifyContent="space-between">
                    <Mui.IconButton
                      component="a"
                      href={`#byAddress${index - 1}`}
                      title="Prev Form"
                      style={{
                        display: buttons && buttons === 'no' ? 'none' : 'block',
                      }}
                    >
                      <MuiIcons.ArrowBack
                        sx={{
                          color: '#f08b32',
                          border: '1px solid #f08b32',
                          borderRadius: '15px',
                        }}
                      />
                    </Mui.IconButton>
                    <Mui.IconButton
                      component="a"
                      href={`#byAddress${index + 1}`}
                      title="Next Form"
                      style={{
                        display: buttons && buttons === 'no' ? 'none' : 'block',
                      }}
                    >
                      <MuiIcons.ArrowForward
                        sx={{
                          color: '#f08b32',
                          border: '1px solid #f08b32',
                          borderRadius: '15px',
                        }}
                      />
                    </Mui.IconButton>
                  </Mui.Stack>
                </Mui.Grid>
              )}
            </div>
          ))}
        </div>
        {errorShow?.address && (
          <p className={css.errorText}>Enter Valid Address Details</p>
        )}
        <Mui.Grid item xs={12}>
          <Mui.Typography
            align="center"
            className={css.swipe}
            style={{ display: buttons && buttons === 'no' ? 'none' : 'block' }}
          >
            Swipe to View Next
          </Mui.Typography>
        </Mui.Grid>

        {(type === 'vendors' || type === 'lender' || type === 'promoter') && (
          <>
            <Mui.Grid container spacing={2} mt={2}>
              <Mui.Grid item xs={12}>
                <Mui.Stack direction="row" justifyContent="space-between">
                  <Mui.Typography className={css.head}>
                    Bank Details
                  </Mui.Typography>
                  <Mui.IconButton
                    component="a"
                    href={`#byBank${redirect?.bank}`}
                    title="Add New"
                  >
                    <MuiIcons.AddCircleOutlineRounded
                      onClick={() => {
                        setNumOfData((prev) => ({
                          ...prev,
                          bank: [
                            ...prev?.bank,
                            {
                              bank_account_number: '',
                              bank_ifsc_code: '',
                              bank_name: '',
                              bank_branch_name: '',
                              account_holder_name: '',
                            },
                          ],
                        }));
                      }}
                      className={css.icon}
                    />
                  </Mui.IconButton>
                </Mui.Stack>
              </Mui.Grid>
            </Mui.Grid>
            <div
              className={css.addressDivScroll}
              style={{
                border: errorShow?.bank
                  ? '1px solid #db0909'
                  : '1px solid #A0A4AF',
                background: device === 'mobile' && '#fff',
              }}
            >
              {numOfData?.bank?.map((val, index) => (
                <div className={css.inner}>
                  <div>
                    <BankField
                      valueCont={val}
                      index={index + 1}
                      setBankValue={setBankValue}
                      custId={showValue?.id || false}
                      type={type}
                    />
                  </div>
                  {device === 'desktop' && (
                    <Mui.Grid item xs={12}>
                      <Mui.Stack direction="row" justifyContent="space-between">
                        <Mui.IconButton
                          component="a"
                          href={`#byBank${index - 1}`}
                          title="Prev Form"
                        >
                          <MuiIcons.ArrowBack
                            sx={{
                              color: '#f08b32',
                              border: '1px solid #f08b32',
                              borderRadius: '15px',
                            }}
                          />
                        </Mui.IconButton>
                        <Mui.IconButton
                          component="a"
                          href={`#byBank${index + 1}`}
                          title="Next Form"
                        >
                          <MuiIcons.ArrowForward
                            sx={{
                              color: '#f08b32',
                              border: '1px solid #f08b32',
                              borderRadius: '15px',
                            }}
                          />
                        </Mui.IconButton>
                      </Mui.Stack>
                    </Mui.Grid>
                  )}
                </div>
              ))}
            </div>
            {errorShow?.bank && (
              <p className={css.errorText}>Enter Valid Bank Details</p>
            )}
          </>
        )}

        <Mui.Stack direction="row" justifyContent="space-between" mb={4}>
          <Mui.Typography className={css.head}>List of Contacts</Mui.Typography>
          <Mui.IconButton
            component="a"
            href={`#byContact${redirect?.contact}`}
            title="Add New"
            style={{ display: buttons && buttons === 'no' ? 'none' : 'block' }}
          >
            <MuiIcons.AddCircleOutlineRounded
              onClick={() => {
                setNumOfData((prev) => ({
                  ...prev,
                  contacts: [
                    ...prev?.contacts,
                    { name: '', email: '', mobile_number: '' },
                  ],
                }));
              }}
              className={css.icon}
            />
          </Mui.IconButton>
        </Mui.Stack>
        <div
          className={css.addressDivScroll}
          style={{
            border: errorShow?.contact
              ? '1px solid #db0909'
              : '1px solid #A0A4AF',
            background: device === 'mobile' && '#fff',
          }}
        >
          {numOfData?.contacts?.map((val, index) => (
            <div className={css.inner}>
              <div>
                <ListOfContact
                  valueCont={val}
                  index={index + 1}
                  setContactValue={setContactValue}
                  custId={showValue?.id || false}
                  type={type}
                />
              </div>
              {device === 'desktop' && (
                <Mui.Grid item xs={12}>
                  <Mui.Stack direction="row" justifyContent="space-between">
                    <Mui.IconButton
                      component="a"
                      href={`#byContact${index - 1}`}
                      title="Prev Form"
                      style={{
                        display: buttons && buttons === 'no' ? 'none' : 'block',
                      }}
                    >
                      <MuiIcons.ArrowBack
                        sx={{
                          color: '#f08b32',
                          border: '1px solid #f08b32',
                          borderRadius: '15px',
                        }}
                      />
                    </Mui.IconButton>
                    <Mui.IconButton
                      component="a"
                      href={`#byContact${index + 1}`}
                      title="Next Form"
                      style={{
                        display: buttons && buttons === 'no' ? 'none' : 'block',
                      }}
                    >
                      <MuiIcons.ArrowForward
                        sx={{
                          color: '#f08b32',
                          border: '1px solid #f08b32',
                          borderRadius: '15px',
                        }}
                      />
                    </Mui.IconButton>
                  </Mui.Stack>
                </Mui.Grid>
              )}
            </div>
          ))}
        </div>
        {errorShow?.contact && (
          <p className={css.errorText}>Enter Valid Contact Details</p>
        )}
        <Mui.Grid item xs={12}>
          <Mui.Typography
            align="center"
            className={css.swipe}
            style={{ display: buttons && buttons === 'no' ? 'none' : 'block' }}
          >
            Swipe to View Next
          </Mui.Typography>
        </Mui.Grid>
        <Mui.Stack direction="row" justifyContent="space-between">
          <Mui.Button
            className={css.btnOutline}
            onClick={() => {
              if (device === 'desktop') {
                handleBottomSheet('edit');
              }
              if (device === 'mobile') {
                handleBottomSheet();
              }
            }}
          >
            Back
          </Mui.Button>
          <Mui.Button className={css.btnContain} onClick={() => onSubmit()}>
            Save {type} Details
          </Mui.Button>
        </Mui.Stack>
      </Mui.Box>
    </>
  );
};

const AddressField = ({
  valueAddr,
  index,
  setAddressValue,
  custId,
  type,
  from,
  gtext,
  allStates,
  countries,
}) => {
  const { organization, enableLoading, user, openSnackBar } =
    React.useContext(AppContext);
  const dispatch = useDispatch();
  const { createInvoiceState } = useSelector((value) => value.Invoice);
  const classes = useStyles();
  const [addressState, setAddressState] = React.useState({
    address_line1: '',
    address_line2: '',
    city: '',
    country: 'India',
    gstin: '',
    pincode: '',
    state: 'Tamil Nadu',
    noGst: false,
  });
  // const [noGst, setNoGst] = React.useState(false);
  const initialValidationErr = Object.keys(VALIDATIONADDRESS).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);

  React.useEffect(() => {
    setAddressState((prev) => ({
      ...prev,
      ...valueAddr,
      // address_line1:
      //   valueAddr?.address_line1 || valueAddr?.address_line2
      //     ? `${valueAddr?.address_line1 || ''}, ${
      //         valueAddr?.address_line2 || ''
      //       }`
      //     : '',
    }));
    if (
      (valueAddr?.gstin === '' || valueAddr?.gstin === null) &&
      valueAddr?.id
    ) {
      setAddressState((prev) => ({ ...prev, noGst: true }));
    }
  }, [valueAddr]);

  const getGstAddress = (gstin) => {
    enableLoading(true);
    RestApi(`gstins`, {
      method: METHOD.POST,
      payload: {
        organization_id: organization.orgId,
        gstin: gstin.toUpperCase(),
        gstin_type: type,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          if (Object.keys(res).length > 0) {
            const {
              address_line1,
              address_line2,
              city,
              state: stateRes,
              pincode,
              country,
            } = res;

            setAddressState((s) => ({
              ...s,
              address_line1: address_line1?.substring(0, 45),
              address_line2: address_line2?.substring(0, 45),
              city,
              state: stateRes,
              pincode,
              country,
            }));
          } else {
            throw new Error();
          }
        }
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Incorrect GST or unable to retrieve address`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const fetchPincodeDetails = (code) => {
    enableLoading(true);
    RestApi(`pincode_lookups?pincode=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error && Object.keys(res || {})?.length > 0) {
          const { city, state: stateRes, country } = res;

          setAddressState((s) => ({
            ...s,
            city,
            state: stateRes,
            country,
          }));
        }
        if (Object.keys(res || {})?.length === 0) {
          setValidationErr((s) => ({ ...s, pincode: true }));
          setAddressState((s) => ({
            ...s,
            city: '',
            state: '',
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

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(addressState[v]);
      return a;
    }, {});
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value =
      ps?.target?.type === 'checkbox' ? ps?.target?.checked : ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATIONADDRESS?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    if (name === 'noGst' && value) {
      setAddressState((prev) => ({ ...prev, noGst: value, gstin: '' }));
      setValidationErr((s) => ({ ...s, gstin: false }));
    } else if (name === 'noGst' && !value) {
      setAddressState((prev) => ({ ...prev, noGst: value }));
    }
    // if (name === 'noGst' && !value) {
    //   setValidationErr((s) => ({ ...s, pan: false }));
    //   setState((prev) => ({ ...prev, pan: '' }));
    // }
    setAddressState((s) => ({
      ...s,
      [name]: name === 'gstin' ? value.toUpperCase() : value,
    }));
    if (name === 'gstin' && value.length === 15) {
      getGstAddress(value);
    }
    if (
      name === 'pincode' &&
      value.length === 6 &&
      addressState?.country?.toLowerCase() === 'india'
    ) {
      fetchPincodeDetails(value);
    }
  };

  const submitAddress = () => {
    const { id, ...param } = addressState;
    enableLoading(true);
    RestApi(
      addressState?.id
        ? `organizations/${organization.orgId}/${type}/${custId}/locations/${addressState?.id}`
        : `organizations/${organization.orgId}/${type}/${custId}/locations`,
      {
        method: addressState?.id ? METHOD.PATCH : METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          ...param,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          if (from === 'invoiceContainer') {
            dispatch(
              GetInvoiceByIdState({
                activeInvoiceSubject: organization?.activeInvoiceSubject,
                invoiceId: createInvoiceState?.newInvoice?.id,
              }),
            );
            dispatch(
              GetInvoiceCustomerLocationState({
                customerId: createInvoiceState?.newInvoice?.customer_id,
              }),
            );
          }
          if (res?.gstin === '' || res?.gstin === null) {
            setAddressState({ ...res, noGst: true });
          } else {
            setAddressState({ ...res, noGst: false });
          }
          openSnackBar({
            message: 'Address added successfully',
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res?.error) {
          openSnackBar({
            message: Object.values(res?.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e?.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const onSubmit = () => {
    const addrValidate = {};
    Object.keys(VALIDATIONADDRESS).forEach((k) => {
      addrValidate[k] = VALIDATIONADDRESS[k];
    });
    if (addressState.noGst) {
      const { gstin, ...sectionValidation } = addrValidate;
      const v = validateAllFields(sectionValidation);
      const valid = Object.values(v).every((val) => !val);
      if (!valid) {
        setValidationErr((s) => ({ ...s, ...v }));
      } else {
        submitAddress();
      }
      return;
    }
    const v = validateAllFields(addrValidate);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else {
      submitAddress();
    }
  };

  React.useEffect(() => {
    setAddressValue((prev) => ({ ...prev, [index]: addressState }));
  }, [addressState]);

  return (
    <Mui.Grid
      container
      spacing={3}
      mt={2}
      className={css.businessAddress}
      id={`byAddress${index - 1}`}
    >
      <Mui.Grid item xs={12}>
        <Mui.Stack direction="row" justifyContent="space-between">
          <Mui.Typography className={css.businessLoc}>
            Business Location {index < 10 ? `0${index}` : index}
          </Mui.Typography>
          <Mui.Chip
            label="Default"
            className={index === 1 ? css.chip : css.chipForOthers}
          />
        </Mui.Stack>
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Input
          name="gstin"
          label="GSTIN"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
            background: addressState?.noGst ? '#a0a4af5e' : '',
          }}
          onBlur={reValidate}
          error={validationErr.gstin}
          helperText={
            validationErr.gstin ? VALIDATIONADDRESS?.gstin?.errMsg : ''
          }
          onChange={onInputChange}
          value={addressState?.gstin}
          disabled={addressState.noGst}
          required
        />
      </Mui.Grid>
      {/* {addressState?.gstin?.length > 1  && ( */}
      <Mui.Grid item xs={12}>
        <Mui.FormControlLabel
          control={
            <Mui.Checkbox
              checked={addressState.noGst}
              className={css.checkbox}
            />
          }
          label={
            <Mui.Typography className={css.checkboxtxt}>{gtext}</Mui.Typography>
          }
          name="noGst"
          onChange={onInputChange}
        />
      </Mui.Grid>
      {/* )} */}

      {from === 'billBookingFalse' && (
        <Mui.Grid item xs={12}>
          <Input
            name="pan"
            label="Pan"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            // onBlur={reValidate}
            // error={validationErr.address_line1}
            // helperText={
            //   validationErr.address_line1
            //     ? VALIDATIONADDRESS?.address_line1?.errMsg
            //     : ''
            // }
            onChange={onInputChange}
            // value={addressState?.address_line1}
            required
          />
        </Mui.Grid>
      )}

      <Mui.Grid item xs={12}>
        <Input
          name="address_line1"
          label="Address Line 1"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.address_line1}
          helperText={
            validationErr.address_line1
              ? VALIDATIONADDRESS?.address_line1?.errMsg
              : ''
          }
          inputProps={{ maxLength: 45 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className={mainCss.endInput}>
                {`${addressState?.address_line1?.length || 0}/45`}
              </InputAdornment>
            ),
          }}
          onChange={onInputChange}
          value={addressState?.address_line1}
          required
        />
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Input
          name="address_line2"
          label="Address Line 2"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          inputProps={{ maxLength: 45 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className={mainCss.endInput}>
                {`${addressState?.address_line2?.length || 0}/45`}
              </InputAdornment>
            ),
          }}
          onBlur={reValidate}
          // error={validationErr.address_line2}
          // helperText={
          //   validationErr.address_line2
          //     ? VALIDATIONADDRESS?.address_line2?.errMsg
          //     : ''
          // }
          onChange={onInputChange}
          value={addressState?.address_line2}
        />
      </Mui.Grid>
      <Mui.Grid item container spacing={2} direction="row">
        <Mui.Grid item xs={6}>
          <Input
            name="pincode"
            label="Pin Code"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            onBlur={reValidate}
            error={
              addressState?.country?.toLowerCase() === 'india' &&
              validationErr.pincode
            }
            helperText={
              addressState?.country?.toLowerCase() === 'india' &&
              validationErr.pincode
                ? VALIDATIONADDRESS?.pincode?.errMsg
                : ''
            }
            inputProps={{
              type:
                addressState?.country?.toLowerCase() === 'india'
                  ? 'tel'
                  : 'text',
              maxLength: addressState?.country?.toLowerCase() === 'india' && 6,
            }}
            onChange={onInputChange}
            value={addressState?.pincode}
            required
            onKeyPress={
              addressState?.country?.toLowerCase() === 'india' &&
              pincodeKeyPress
            }
          />
        </Mui.Grid>
        <Mui.Grid item xs={6}>
          <Input
            name="city"
            label="Town/City"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            onBlur={reValidate}
            error={validationErr.city}
            helperText={
              validationErr.city ? VALIDATIONADDRESS?.city?.errMsg : ''
            }
            onChange={onInputChange}
            value={addressState?.city}
            required
          />
        </Mui.Grid>
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Select
          name="state"
          onBlur={reValidate}
          error={validationErr.state}
          helperText={validationErr.state ? VALIDATION?.state?.errMsg : ''}
          className={`${css.greyBorder} ${classes.root}`}
          label="State"
          variant="standard"
          options={allStates}
          defaultValue={addressState?.state}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onChange={onInputChange}
          theme="light"
          required
        />
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Select
          name="country"
          onBlur={reValidate}
          error={validationErr.country}
          helperText={validationErr.country ? VALIDATION?.country?.errMsg : ''}
          className={`${css.greyBorder} ${classes.root}`}
          label="Country"
          variant="standard"
          options={countries}
          defaultValue={addressState.country}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onChange={onInputChange}
          theme="light"
        />
      </Mui.Grid>
      <Mui.Grid item xs={12} display="flex" justifyContent="center">
        <Mui.Button className={css.btnCenter} onClick={() => onSubmit()}>
          Save Location Details
        </Mui.Button>
      </Mui.Grid>
    </Mui.Grid>
  );
};

const ListOfContact = ({ valueCont, index, setContactValue, custId, type }) => {
  const {
    organization,
    enableLoading,
    user,
    openSnackBar,
    // registerEventListeners, deRegisterEventListener
  } = React.useContext(AppContext);
  const [contactState, setContactState] = React.useState({
    name: '',
    email: '',
    mobile_number: '',
  });
  const initialValidationErr = Object.keys(VALIDATIONCONTACT).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const device = localStorage.getItem('device_detect');

  React.useEffect(() => {
    setContactState({ ...valueCont });
  }, [valueCont]);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(contactState[v]);
      return a;
    }, {});
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    if (
      (ps?.target?.name === 'mobile_number' &&
        ps.target.value?.toString().length > 0) ||
      ps?.target?.name !== 'mobile_number'
    ) {
      const [name, value] = getEventNameValue(ps);
      setValidationErr((v) => ({
        ...v,
        [name]: !VALIDATIONCONTACT?.[name]?.test?.(value),
      }));
    }
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setContactState((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const submitContact = () => {
    const { id, ...param } = contactState;
    enableLoading(true);
    RestApi(
      contactState?.id
        ? `organizations/${organization.orgId}/${type}/${custId}/contacts/${contactState?.id}`
        : `organizations/${organization.orgId}/${type}/${custId}/contacts`,
      {
        method: contactState?.id ? METHOD.PATCH : METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          ...param,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setContactState(res);
          openSnackBar({
            message: 'Contact details added successfully',
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res?.error) {
          openSnackBar({
            message: Object.values(res?.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e?.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const onSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATIONCONTACT).forEach((k) => {
      sectionValidation[k] = VALIDATIONCONTACT[k];
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else {
      submitContact();
    }
  };

  // const handleCustomer = (ele) => {
  //   setTimeout(() => {
  //     setContactState({
  //       name: ele.Name,
  //       email: ele.email,
  //       mobile_number: ele.phone,
  //     });
  //   }, 100);
  // };

  // const getContacts = () => {
  //   JSBridge.getContacts();
  // };

  // const setContacts = (response) => {
  //   handleCustomer(JSON.parse(response.detail.value));
  // };

  // React.useEffect(() => {
  //   registerEventListeners({ name: 'contactDetailsData', method: setContacts });
  //   return () =>
  //     deRegisterEventListener({
  //       name: 'contactDetailsData',
  //       method: setContacts,
  //     });
  // }, []);

  React.useEffect(() => {
    setContactValue((prev) => ({ ...prev, [index]: contactState }));
  }, [contactState]);

  return (
    <Mui.Grid
      container
      spacing={3}
      mt={2}
      className={css.businessAddress}
      id={`byContact${index - 1}`}
    >
      <Mui.Grid item xs={12}>
        <Mui.Typography className={css.businessLoc}>
          Contact No. {index < 10 ? `0${index}` : index}
        </Mui.Typography>
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Input
          name="name"
          label="Full Name"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.name}
          helperText={validationErr.name ? VALIDATIONCONTACT?.name?.errMsg : ''}
          onChange={onInputChange}
          value={contactState?.name}
        />
      </Mui.Grid>
      <Mui.Grid item xs={12} style={{ position: 'relative' }}>
        <Input
          name="mobile_number"
          label="Phone No."
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.mobile_number}
          helperText={
            validationErr.mobile_number
              ? VALIDATIONCONTACT?.mobile_number?.errMsg
              : ''
          }
          InputProps={{
            inputComponent: MobileNumberFormatCustom,
          }}
          inputProps={{
            type: 'tel',
          }}
          onChange={onInputChange}
          value={contactState?.mobile_number}
        />
        {/* check device */}
        {device === 'mobiles' && (
          <span
            className={css.contactIcon}
            // onClick={getContacts}
          >
            <ContactIcon />
          </span>
        )}
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Input
          name="email"
          label="Email Id"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.email}
          helperText={
            validationErr.email ? VALIDATIONCONTACT?.email?.errMsg : ''
          }
          onChange={onInputChange}
          value={contactState?.email}
        />
      </Mui.Grid>
      <Mui.Grid item xs={12} display="flex" justifyContent="center">
        <Mui.Button className={css.btnCenter} onClick={() => onSubmit()}>
          Save Contact Details
        </Mui.Button>
      </Mui.Grid>
    </Mui.Grid>
  );
};

const BankField = ({ valueCont, index, setBankValue, custId, type }) => {
  const { organization, enableLoading, user, openSnackBar } =
    React.useContext(AppContext);
  const [bankState, setBankState] = React.useState({
    bank_account_number: '',
    bank_ifsc_code: '',
    bank_name: '',
    bank_branch_name: '',
    account_holder_name: '',
  });
  const initialValidationErr = Object.keys(VALIDATIONBANK).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);

  React.useEffect(() => {
    setBankState({ ...valueCont });
  }, [valueCont]);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(bankState[v]);
      return a;
    }, {});
  };

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode,
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATIONBANK?.[name]?.test?.(value),
    }));
  };

  const getBankDetails = (code) => {
    enableLoading(true);
    RestApi(`ifsc?ifsc=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const { BANK: bank_name, BRANCH: bank_branch_name } = res;
          setBankState((s) => ({
            ...s,
            bank_name,
            bank_branch_name,
          }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const handleAccountPress = (e) =>
    ['e', 'E', '-', '+', '.'].includes(e.key) && e.preventDefault();
  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setBankState((s) => ({
      ...s,
      [name]: name === 'bank_ifsc_code' ? value?.toUpperCase() : value,
    }));
    if (name === 'bank_ifsc_code' && value.length === 11) {
      getBankDetails(value);
    }
  };

  const submitBank = () => {
    const { id, ...param } = bankState;
    enableLoading(true);
    RestApi(
      bankState?.id
        ? `organizations/${organization.orgId}/${type}/${custId}/bank_details/${bankState?.id}`
        : `organizations/${organization.orgId}/${type}/${custId}/bank_details`,
      {
        method: bankState?.id ? METHOD.PATCH : METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          ...param,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setBankState(res);
          openSnackBar({
            message: 'Bank details added successfully',
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res?.error) {
          openSnackBar({
            message: Object.values(res?.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e?.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const onSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATIONBANK).forEach((k) => {
      sectionValidation[k] = VALIDATIONBANK[k];
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
    } else {
      submitBank();
    }
  };

  React.useEffect(() => {
    setBankValue((prev) => ({ ...prev, [index]: bankState }));
  }, [bankState]);
  return (
    <Mui.Grid
      container
      spacing={3}
      mt={2}
      mb={2}
      className={css.businessAddress}
      id={`byBank${index - 1}`}
    >
      <Mui.Grid item xs={12}>
        <Mui.Typography className={css.businessLoc}>
          Bank Details No. {index < 10 ? `0${index}` : index}
        </Mui.Typography>
      </Mui.Grid>
      <Mui.Grid item xs={12}>
        <Input
          name="bank_account_number"
          label="Bank Account No."
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.bank_account_number}
          helperText={
            validationErr.bank_account_number
              ? VALIDATIONBANK?.bank_account_number?.errMsg
              : ''
          }
          onKeyDown={handleAccountPress}
          type="number"
          onChange={onInputChange}
          value={bankState?.bank_account_number}
          required
        />
      </Mui.Grid>

      <Mui.Grid item xs={12}>
        <Input
          name="bank_ifsc_code"
          label="IFSC Code"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onKeyPress={handleIfscKeyPress}
          onBlur={reValidate}
          error={validationErr.bank_ifsc_code}
          helperText={
            validationErr.bank_ifsc_code
              ? VALIDATIONBANK?.bank_ifsc_code?.errMsg
              : ''
          }
          onChange={onInputChange}
          value={bankState?.bank_ifsc_code}
          required
        />
      </Mui.Grid>

      <Mui.Grid item xs={12}>
        <Input
          name="bank_name"
          label="Bank Name"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.bank_name}
          helperText={
            validationErr.bank_name ? VALIDATIONBANK?.bank_name?.errMsg : ''
          }
          onChange={onInputChange}
          value={bankState?.bank_name}
          required
        />
      </Mui.Grid>

      <Mui.Grid item xs={12}>
        <Input
          name="bank_branch_name"
          label="Branch"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.bank_branch_name}
          helperText={
            validationErr.bank_branch_name
              ? VALIDATIONBANK?.bank_branch_name?.errMsg
              : ''
          }
          onChange={onInputChange}
          value={bankState?.bank_branch_name}
          required
        />
      </Mui.Grid>

      <Mui.Grid item xs={12}>
        <Input
          name="account_holder_name"
          label="Account Holder's Name"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          theme="light"
          rootStyle={{
            border: '1px solid #A0A4AF',
          }}
          onBlur={reValidate}
          error={validationErr.account_holder_name}
          helperText={
            validationErr.account_holder_name
              ? VALIDATIONBANK?.account_holder_name?.errMsg
              : ''
          }
          onChange={onInputChange}
          value={bankState?.account_holder_name}
          required
        />
      </Mui.Grid>

      <Mui.Grid item xs={12} display="flex" justifyContent="center">
        <Mui.Button className={css.btnCenter} onClick={() => onSubmit()}>
          Update Bank Details
        </Mui.Button>
      </Mui.Grid>
    </Mui.Grid>
  );
};
