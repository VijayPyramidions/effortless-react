import React, { useState, useContext, useEffect,memo } from 'react';
import { makeStyles, InputAdornment } from '@material-ui/core';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import Input, { MobileNumberFormatCustom } from '@components/Input/Input.jsx';
import { pincodeKeyPress } from '@components/utils';
import * as Mui from '@mui/material';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Select, { SingleSelect } from '@components/Select/Select.jsx';
import Button from '@material-ui/core/Button';
import { ContactIcon, CheckCircle } from '@components/SvgIcons/SvgIcons.jsx';
import JSBridge from '@nativeBridge/jsbridge';
import {
  validateGst,
  validatePincode,
  // validatePhone,
  // validateEmail,
  validateAddress,
  validateRequired,
} from '@services/Validation.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import * as mainCss from '../../../App.scss';
import * as css from './CustomerNew.scss';

const Puller = Mui.styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));


const ValidationErrMsg = {
  name: 'Enter a valid name',
  gstin: 'Enter valid GST',
  address_line1: 'Enter Address',
  // address_line2: 'Enter address',
  pincode: 'Enter valid Pincode',
  city: 'Enter City Name',
  state: 'Choose the State',
  contacts_name: 'Enter a valid Contact Name',
  contacts_mobile_number: 'Enter valid Contact Number',
  contacts_email: 'Enter valid Email Address',
};
const initialValidationErr = {
  name: false,
  gstin: false,
  address_line1: false,
  // address_line2: false,
  pincode: false,
  city: false,
  state: false,
  contacts_name: false,
  contacts_mobile_number: false,
  contacts_email: false,
};

const useStyles = makeStyles(() => ({
  checked: {
    color: '#F08B32 !important',
  },
}));

const CreateCustomerDialogNew = ({
  handleBottomSheet,
  addCusomerComplete,
  entitytype,
  // for People
  showCustomerAvail,
}) => {
  let etype = entitytype;
  if (!etype) {
    etype = 'customer';
  }
  const etext = `${etype.substr(0, 1).toUpperCase()}${etype.substr(1)}`;
  const { organization, registerEventListeners, deRegisterEventListener } =
    useContext(AppContext);
  const classes = useStyles();
  const { enableLoading, openSnackBar, user } = useContext(AppContext);
  const [customerName, setCustomerName] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [custState, setCustState] = useState('');
  const [individualName, setIndividualName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [noGst, setNoGst] = useState(false);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [gstCheck, setGstCheck] = useState(true);
  const [addDetails, setAddDetails] = useState(false);
  const [customerAvailable, setCustomerAvailable] = useState('');
  const [customer, setCustomer] = useState();
  const [allStates, setAllStates] = React.useState([]);
  const [allCountries, setAllCountries] = React.useState([]);
  const [title, setTitle] = React.useState(`Add a New ${etype} - 1 of 2`);
  const themes = Mui.useTheme();
  const desktopView = Mui.useMediaQuery(themes.breakpoints.up('sm'));

  const VALIDATOR = {
    name: (v) => validateRequired(v),
    gstin: (v) => validateGst(v),
    address_line1: (v) => validateAddress(v),
    // address_line2: (v) => validateAddress(v),
    pincode: (v) => country?.toLowerCase() === 'india' ? validatePincode(v) : true,
    city: (v) => validateRequired(v),
    state: (v) => validateRequired(v),
    contacts_name: () => true,
    contacts_mobile_number: () => true,
    contacts_email: () => true,
  };

  const toggleView = (view) => {
    if (view === 'gstCheck') {
      setTitle(`Add a New ${etext} - 1 of 2`);
    } else if (view === 'addDetails') {
      setTitle(`Add a New ${etext} - 2 of 2`);
    }
  };

  React.useEffect(() => {
    if (etype === 'customer') {
      toggleView('gstCheck');
    }
  }, []);

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

  const fetchAllCountries = () => {
    enableLoading(true);
    RestApi(`countries`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setAllCountries(
            res.data.map((l) => ({
              payload: l.name,
              text: l.name,
            })),
          );
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    fetchAllStates();
    fetchAllCountries();
  }, []);

  React.useEffect(() => {
    if (customerAvailable && showCustomerAvail && customer) {
      showCustomerAvail({
        customer_name: customerAvailable,
        customer_id: customer,
      });
    }
    if (!customerAvailable && showCustomerAvail) {
      showCustomerAvail();
    }
  }, [customerAvailable, customer]);

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  const resetErrors = () => {
    setValidationErr(initialValidationErr);
  };

  const validateAllFields = () => {
    return {
      name: !VALIDATOR?.name?.(customerName),
      gstin: !noGst ? !VALIDATOR?.gstin?.(gstNo) : false,
      address_line1: !VALIDATOR?.address_line1?.(addr1),
      // address_line2: !VALIDATOR?.address_line2?.(addr2),
      pincode: !VALIDATOR?.pincode?.(pincode),
      city: !VALIDATOR?.city?.(city),
      state: !VALIDATOR?.state?.(custState),
      contacts_name: !VALIDATOR?.contacts_name?.(individualName),
      contacts_mobile_number: !VALIDATOR?.contacts_mobile_number?.(mobileNo),
      contacts_email: !VALIDATOR?.contacts_email?.(email),
    };
  };

  const onSubmitCreate = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/entities`, {
      method: METHOD.POST,
      payload: {
        name: customerName,
        type: etype,
        location: {
          address_line1: addr1,
          address_line2: addr2,
          city,
          state: custState,
          gstin: gstNo?.toUpperCase(),
          pincode,
          country,
        },
        contacts: [
          {
            name: individualName === '' ? undefined : individualName,
            mobile_number: mobileNo === '' ? undefined : mobileNo,
            email: email === '' ? undefined : email,
          },
        ],
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        enableLoading(false);
        addCusomerComplete(res?.id);
        // setTimeout(() => {
          memo(openSnackBar({
            message: `${customerName} ${etype} created successfully.`,
            type: MESSAGE_TYPE.INFO,
          }));
        // }, 1500);
      } else {
        const errorValues = Object.values(res.errors);
        openSnackBar({
          message: errorValues.join(', '),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      }
    });
  };

  const onCreateCustomer = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    if (valid) {
      onSubmitCreate();
    }
  };

  const StatusBar = () => {
    return (
      <>
        {desktopView
          ? ''
          : openSnackBar({
              message: `Incorrect GST or unable to retrieve address`,
              type: MESSAGE_TYPE.ERROR,
            })}
      </>
    );
  };

  React.useEffect(() => {
    if (customerName !== '') {
      reValidate({ target: { name: 'name', value: customerName } });
    }
  }, [customerName]);
  // React.useEffect(() => {
  //   if (addr2 !== '') {
  //     reValidate({ target: { name: 'address_line2', value: addr2 } });
  //   }
  // }, [addr2]);
  React.useEffect(() => {
    if (addr1 !== '') {
      reValidate({ target: { name: 'address_line1', value: addr1 } });
    }
  }, [addr1]);
  React.useEffect(() => {
    if (pincode !== '') {
      reValidate({ target: { name: 'pincode', value: pincode } });
    }
  }, [pincode]);
  React.useEffect(() => {
    if (custState !== '') {
      reValidate({ target: { name: 'state', value: custState } });
    }
  }, [custState]);
  React.useEffect(() => {
    if (city !== '') {
      reValidate({ target: { name: 'city', value: city } });
    }
  }, [city]);
  const getGstAddr = (gstVal) => {
    enableLoading(true);
    RestApi('gstins', {
      method: METHOD.POST,
      payload: {
        gstin: gstVal.toUpperCase(),
        organization_id: organization.orgId,
        gstin_type: 'Customer',
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          if (res.customer_id) {
            setCustomerAvailable(res.customer_name);
            setCustomer(res.customer_id);
          } else {
            setCustomerAvailable('');
            if (Object.keys(res).length > 0) {
            setCustomerName(res.name);
            setAddr1(res.address_line1?.substring(0, 45));
            // let tempAddr = '';
            // if (res?.address_line2) {
            //   tempAddr = String(
            //     res?.address_line1 || '',
            //     res?.address_line2 || '',
            //   );
            // } else {
            //   tempAddr = String(res?.address_line1 || '');
            // }
            setAddr2(res?.address_line2?.substring(0, 45));
            setCity(res.city);
            setCountry('India');
            setCustState(res.state);
            setPincode(res.pincode);
            }
            else {
              setCustomerName("");
            setAddr1("");
            // let tempAddr = '';
            // if (res?.address_line2) {
            //   tempAddr = String(
            //     res?.address_line1 || '',
            //     res?.address_line2 || '',
            //   );
            // } else {
            //   tempAddr = String(res?.address_line1 || '');
            // }
            setAddr2("");
            setCity("");
            setCountry('India');
            setCustState("");
            setPincode("");
              throw new Error();
            }
          }
        }
        enableLoading(false);
      })
      .catch((e) => {
        console.log('gstAddr', e);
        enableLoading(false);
        openSnackBar({
          message: `Incorrect GST or unable to retrieve address`,
          type: MESSAGE_TYPE.ERROR,
        });
        StatusBar();
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
          setCity(res.city);
          setCountry(res.country);
          setCustState(res.state);
        } 
        if(Object.keys(res || {})?.length === 0){
          setValidationErr((s) => ({ ...s, pincode: true }));
          setCity('');
          setCustState('');
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

  const onInputChange = (setter) => (e) => {
    if (
      e?.target?.name === 'contacts_mobile_number' &&
      e.target.value?.toString().length > 0
    ) {
      reValidate(e);
    } else if (e?.target?.name !== 'contacts_mobile_number') {
      reValidate(e);
    }
    setter(e.target.value);
    if (
      e.target.name === 'gstin' &&
      e.target.value.length === 15 &&
      noGst === false
    ) {
      getGstAddr(e.target.value);
    } else if (
      e.target.name === 'gstin' &&
      e.target.value.length === 0 &&
      noGst === false
    ) {
      setCustomerAvailable('');
    }
    if (e.target.name === 'pincode' && e.target.value.length === 6 && country?.toLowerCase() === 'india') {
      fetchPincodeDetails(e.target.value);
    }
  };

  // const onGstFill = (e: *) => {
  //   reValidate(e);
  //   if (e.target.value !== '' && noGst === false) {
  //     getGstAddr(e.target.value);
  //   }
  // };

  //  x

  const gstCheckboxChange = (e) => {
    if (e.target.checked === false) {
      setCountry('India');
      if (gstNo) {
        getGstAddr(gstNo);
      }
    } else if (e.target.checked === true) {
      setValidationErr((s) => ({ ...s, gstin: false }));
    }
    setNoGst(e.target.checked);
  };

  useEffect(() => {
    setGstCheck(true);
    setAddDetails(false);
  }, []);

  const handleCustomer = (ele) => {
    setTimeout(() => {
      setIndividualName(ele.Name);
      setMobileNo(ele.phone);
      setEmail(ele.email);
    }, 100);
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
    // setContactDetails(JSON.parse(response.detail.value));
    handleCustomer(JSON.parse(response.detail.value));
    // enableLoading(false);
  };

  useEffect(() => {
    registerEventListeners({ name: 'contactDetailsData', method: setContacts });
    return () =>
      deRegisterEventListener({
        name: 'contactDetailsData',
        method: setContacts,
      });
  }, []);

  const GstCheck = () => {
    const device = localStorage.getItem('device_detect');
    return (
      <div style={{ height: 'auto' }}>
        {device === 'mobile' && <Puller />}
        <div
          style={{ margin: '3vh 3vw 0', height: '6vh' }}
          className={css.headerContainer}
        >
          <p className={css.headerLabelForEdit}>
            {device === 'desktop' ? `Add a New ${etext}` : title}
          </p>
        </div>
        <div
          style={{
            overflow: device === 'desktop' ? 'auto' : '',
            height:
              device === 'desktop'
                ? (customerAvailable && 'auto') || '90vh'
                : '',
          }}
        >
          <div
            className={css.addCustomerContainerNew}
            style={{ display: gstCheck ? 'block' : 'none' }}
          >
            <Grid container spacing={3}>
              {/* <Grid item xs={12}> */}
              <Grid item xs={12}>
                <Input
                  name="gstin"
                  onBlur={reValidate}
                  error={validationErr.gstin}
                  helperText={validationErr.gstin ? ValidationErrMsg.gstin : ''}
                  label="GSTIN"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    type: 'text',
                    endAdornment: customerAvailable ? <CheckCircle /> : null,
                  }}
                  fullWidth
                  onChange={onInputChange(setGstNo)}
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  text="capital"
                  required
                  disabled={noGst}
                />
              </Grid>
              {customerAvailable ? (
                <div className={css.gstCheckBox}>
                  <span
                    style={{
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#6E6E6E',
                      textAlign: 'center',
                    }}
                  >
                    {showCustomerAvail
                      ? `${customerAvailable} is already a part of your list.`
                      : `${customerAvailable} is already a part of your list. Would you
                like to create a bill?`}
                  </span>
                </div>
              ) : (
                <>
                  {gstNo === '' && (
                    <div
                      className={css.gstCheckBox}
                      style={{ padding: '0px 10px 0px 20px' }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={noGst}
                              onChange={gstCheckboxChange}
                              classes={{ checked: classes.checked }}
                            />
                          }
                          label="My Customer Does Not Have a GST Number"
                        />
                      </FormGroup>
                    </div>
                  )}

                  <Grid item xs={12}>
                    <Input
                      name="name"
                      onBlur={reValidate}
                      error={validationErr.name}
                      helperText={
                        validationErr.name ? ValidationErrMsg.name : ''
                      }
                      label={`${etext} Name`}
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange(setCustomerName)}
                      theme="light"
                      rootStyle={{
                        border: '1px solid #A0A4AF',
                      }}
                      value={customerName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      name="address_line1"
                      onBlur={reValidate}
                      error={validationErr.address_line1}
                      value={addr1}
                      helperText={
                        validationErr.address_line1
                          ? ValidationErrMsg.address_line1
                          : ''
                      }
                      label="Address line 1"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 45 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={mainCss.endInput}
                          >
                            {`${addr1?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={onInputChange(setAddr1)}
                      theme="light"
                      rootStyle={{
                        border: '1px solid #A0A4AF',
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      name="address_line2"
                      onBlur={reValidate}
                      value={addr2}
                      // error={validationErr.address_line2}
                      // helperText={
                      //   validationErr.address_line2
                      //     ? ValidationErrMsg.address_line2
                      //     : ''
                      // }
                      label="Address line 2"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 45 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={mainCss.endInput}
                          >
                            {`${addr2?.length || 0}/45`}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={onInputChange(setAddr2)}
                      theme="light"
                      rootStyle={{
                        border: '1px solid #A0A4AF',
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}> */}
                  <Grid item xs={6}>
                    <Input
                      name="pincode"
                      value={pincode}
                      onBlur={reValidate}
                      error={country?.toLowerCase() === 'india' && validationErr.pincode}
                      helperText={
                        country?.toLowerCase() === 'india' && validationErr.pincode ? ValidationErrMsg.pincode : ''
                      }
                      label="Pin Code"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        type: country?.toLowerCase() === 'india' ? 'tel' : 'text',
                        maxLength: country?.toLowerCase() === 'india' && 6,
                      }}
                      fullWidth
                      onChange={onInputChange(setPincode)}
                      theme="light"
                      rootStyle={{
                        border: '1px solid #A0A4AF',
                      }}
                      required
                      onKeyPress={ country?.toLowerCase() === 'india' && pincodeKeyPress}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Input
                      name="city"
                      value={city}
                      onBlur={reValidate}
                      error={validationErr.city}
                      helperText={
                        validationErr.city ? ValidationErrMsg.city : ''
                      }
                      label="City/Town"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={onInputChange(setCity)}
                      theme="light"
                      rootStyle={{
                        border: '1px solid #A0A4AF',
                      }}
                      required
                    />
                  </Grid>
                  {/* </Grid> */}

                  <Grid item xs={6}>
                    <SingleSelect
                      name="state"
                      onBlur={reValidate}
                      error={validationErr.state}
                      helperText={
                        validationErr.state ? ValidationErrMsg.state : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="State"
                      variant="standard"
                      options={allStates}
                      defaultValue={custState}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={onInputChange(setCustState)}
                      theme="light"
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    {/* <Input
                  name="country"
                  value={country}
                  onBlur={reValidate}
                  // error={validationErr.city}
                  // helperText={validationErr.city ? ValidationErrMsg.city : ''}
                  label="Country"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={onInputChange(setCountry)}
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  required
                /> */}
                    {/* <SingleSelect */}
                    <Select
                      name="country"
                      // onBlur={reValidate}
                      // error={validationErr.state}
                      // helperText={validationErr.state ? ValidationErrMsg.state : ''}
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Country"
                      variant="standard"
                      options={allCountries}
                      defaultValue={country}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={onInputChange(setCountry)}
                      fullWidth
                      disabled={!noGst}
                      theme="light"
                    />
                  </Grid>

                  {device === 'desktop' && (
                    <div
                      className={css.addCustomerContainerNew}
                      style={{ margin: 10 }}
                    >
                      <Grid container spacing={3}>
                        {/* <Grid item xs={12}> */}
                        <Grid item xs={12} style={{ position: 'relative' }}>
                          <Input
                            name="contacts_name"
                            onBlur={reValidate}
                            error={validationErr.contacts_name}
                            helperText={
                              validationErr.contacts_name
                                ? ValidationErrMsg.contacts_name
                                : ''
                            }
                            label="Contact Name"
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            rootStyle={{
                              border: '1px solid #A0A4AF',
                            }}
                            fullWidth
                            onChange={onInputChange(setIndividualName)}
                            theme="light"
                            value={individualName}
                          />
                          {/* <span className={css.contactIcon} onClick={getContacts}>
                        <ContactIcon />
                      </span> */}
                          {/* <SelectBottomSheet
                  name="contact"
                  triggerComponent={
                    <span className={css.contactIcon} onClick={getContacts}>
                      <ContactIcon />
                    </span>
                  }
                  open={drawer.contact}
                  onTrigger={onTriggerDrawer}
                  onClose={handleBottomSheet1}
                  maxHeight="45vh"
                >
                  <div className={css.searchFilter}>
                    <SearchIcon />{' '}
                    <input
                      placeholder="Search for Customer"
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>
                  {contactDetails &&
                    contactDetails
                      .filter((post) => {
                        if (query === '') {
                          return post;
                        }
                        if (
                          post.Name.toLowerCase().includes(query.toLowerCase()) ||
                          post.Phoneno.toLowerCase().includes(query.toLowerCase())
                        ) {
                          return post;
                        }
                        return false;
                      })
                      .map((element) => (
                        <div
                          className={css.valueWrapper}
                          onClick={() => handleCustomer(element)}
                        >
                          <span className={css.value}>{element.Name}</span>
                          <br />
                          <span className={css.value}>{element.Phoneno}</span>
                          <hr />
                        </div>
                      ))}
                </SelectBottomSheet> */}
                        </Grid>

                        <Grid item xs={12}>
                          <Input
                            name="contacts_mobile_number"
                            onBlur={reValidate}
                            error={validationErr.contacts_mobile_number}
                            helperText={
                              validationErr.contacts_mobile_number
                                ? ValidationErrMsg.contacts_mobile_number
                                : ''
                            }
                            label="Contact Phone Number"
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              inputComponent: MobileNumberFormatCustom,
                            }}
                            rootStyle={{ border: '1px solid #A0A4AF' }}
                            inputProps={{
                              type: 'tel',
                            }}
                            fullWidth
                            onChange={onInputChange(setMobileNo)}
                            theme="light"
                            value={mobileNo}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Input
                            name="contacts_email"
                            onBlur={reValidate}
                            error={validationErr.contacts_email}
                            helperText={
                              validationErr.contacts_email
                                ? ValidationErrMsg.contacts_email
                                : ''
                            }
                            label="Contact Email ID"
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            rootStyle={{
                              border: '1px solid #A0A4AF',
                            }}
                            fullWidth
                            onChange={onInputChange(setEmail)}
                            theme="light"
                            value={email}
                          />
                          {/* <div className={css.copyContact}>
    
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={copyContact}
                            onChange={customerNameCheckboxChange}
                            classes={{ checked: classes.checked }}
                          />
                        }
                        label="Copy Contact Name as Customer Name"
                      />
                    </FormGroup>
                  </div> */}
                        </Grid>

                        <Grid item xs={12}>
                          <div className={css.addCustomerFooter}>
                            <Button
                              variant="outlined"
                              className={css.secondary}
                              style={{
                                padding: '15px 35px',
                                textTransform: 'initial',
                              }}
                              onClick={() => {
                                handleBottomSheet();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              className={css.primary}
                              style={{ padding: 15, textTransform: 'initial' }}
                              onClick={() => {
                                onCreateCustomer();
                              }}
                            >
                              Save and Finish
                            </Button>
                          </div>
                        </Grid>
                        {/* </Grid> */}
                      </Grid>
                    </div>
                  )}
                </>
              )}

              {!showCustomerAvail && customerAvailable && (
                <div
                  className={css.addCustomerFooter}
                  style={{ justifyContent: 'center' }}
                >
                  <Button
                    variant="contained"
                    className={css.primary}
                    style={{
                      width: 'auto',
                      height: 'auto',
                      whiteSpace: 'break-spaces',
                    }}
                    onClick={() => {
                      resetErrors();
                      addCusomerComplete(customer);
                    }}
                  >
                    Create Bill for {customerAvailable}
                  </Button>
                </div>
              )}
              {!customerAvailable && device === 'mobile' && (
                <div className={css.addCustomerFooter}>
                  <Button
                    variant="outlined"
                    className={css.secondary}
                    style={{ padding: '15px 35px', textTransform: 'initial' }}
                    onClick={() => {
                      resetErrors();
                      handleBottomSheet();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    className={css.primary}
                    style={{ padding: 15, textTransform: 'initial' }}
                    onClick={() => {
                      if (noGst && customerName !== '') {
                        toggleView('addDetails');
                        setGstCheck(false);
                        setAddDetails(true);
                      } else if (gstNo === '' || customerName === '') {
                        if (gstNo === '' && !noGst) {
                          setValidationErr((s) => ({ ...s, gstin: true }));
                        }
                        if (customerName === '') {
                          setValidationErr((s) => ({ ...s, name: true }));
                        }
                        // gstNo === '' ? setValidationErr((s) => ({ ...s, gstin: true })) : setValidationErr((s) => ({ ...s, gstin: false }));
                        // customerName === '' ? setValidationErr((s) => ({ ...s, name: true })) : setValidationErr((s) => ({ ...s, name: false }));
                        // setValidationErr((s) => ({ ...s, gstin: true }));
                      } else {
                        setValidationErr((s) => ({ ...s, gstin: false }));
                        setValidationErr((s) => ({ ...s, name: false }));
                        toggleView('addDetails');
                        setGstCheck(false);
                        setAddDetails(true);
                      }
                    }}
                  >
                    Save and Continue
                  </Button>
                </div>
              )}
              {/* </Grid> */}
            </Grid>
          </div>
        </div>
      </div>
    );
  };

  const AddCustomerDetails = () => {
    return (
      <div
        className={css.addCustomerContainerNew}
        style={{ display: addDetails ? 'block' : 'none' }}
      >
        <Grid container spacing={3}>
          {/* <Grid item xs={12}> */}
          <Grid item xs={12} style={{ position: 'relative' }}>
            <Input
              name="contacts_name"
              onBlur={reValidate}
              error={validationErr.contacts_name}
              helperText={
                validationErr.contacts_name
                  ? ValidationErrMsg.contacts_name
                  : ''
              }
              label="Contact Name"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              fullWidth
              onChange={onInputChange(setIndividualName)}
              theme="light"
              value={individualName}
              required
            />
            <span className={css.contactIcon} onClick={getContacts}>
              <ContactIcon />
            </span>
          </Grid>

          <Grid item xs={12}>
            <Input
              name="contacts_mobile_number"
              onBlur={reValidate}
              error={validationErr.contacts_mobile_number}
              helperText={
                validationErr.contacts_mobile_number
                  ? ValidationErrMsg.contacts_mobile_number
                  : ''
              }
              label="Contact Phone Number"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              rootStyle={{ border: '1px solid #A0A4AF' }}
              inputProps={{
                type: 'tel',
              }}
              fullWidth
              onChange={onInputChange(setMobileNo)}
              theme="light"
              value={mobileNo}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name="contacts_email"
              onBlur={reValidate}
              error={validationErr.contacts_email}
              helperText={
                validationErr.contacts_email
                  ? ValidationErrMsg.contacts_email
                  : ''
              }
              label="Contact Email ID"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              fullWidth
              onChange={onInputChange(setEmail)}
              theme="light"
              value={email}
            />
          </Grid>

          <Grid item xs={12}>
            <div className={css.addCustomerFooter}>
              <Button
                variant="outlined"
                className={css.secondary}
                style={{ padding: '15px 35px', textTransform: 'initial' }}
                onClick={() => {
                  toggleView('gstCheck');
                  setGstCheck(true);
                  setAddDetails(false);
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                className={css.primary}
                style={{ padding: 15, textTransform: 'initial' }}
                onClick={() => {
                  onCreateCustomer();
                }}
              >
                Save and Finish
              </Button>
            </div>
          </Grid>
          {/* </Grid> */}
        </Grid>
      </div>
    );
  };

  return (
    <div>
      {GstCheck()}
      {AddCustomerDetails()}
    </div>
  );
};

export default memo(CreateCustomerDialogNew);
